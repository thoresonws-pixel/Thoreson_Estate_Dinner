/* Shared story progression: pure transitions plus a Firebase browser adapter.
 * Story IDs, step order, and durations are supplied by the story package.
 */
(function (global) {
  'use strict';
  const VERSION = 1;

  function validateState(flow, state) {
    if (state == null) return;
    if (state.schemaVersion != null && state.schemaVersion !== VERSION) {
      throw Error('Unsupported saved story-state version. Update the game before continuing.');
    }
    if (!flow.steps.some(step => step.id === state.stepId)) throw Error('Saved step is missing from this story');
    if (!Number.isFinite(state.startedAt)) throw Error('Invalid saved step timestamp');
    if (state.pausedAt != null && !Number.isFinite(state.pausedAt)) throw Error('Invalid saved pause timestamp');
    if (state.revision != null && (!Number.isSafeInteger(state.revision) || state.revision < 0)) throw Error('Invalid saved story revision');
  }

  function view(flow, state, now) {
    validateState(flow, state);
    const step = state ? flow.steps.find(step => step.id === state.stepId) : flow.steps[0];
    if (!step) throw Error('Story has no steps');
    const deadline = state && step.durationSeconds ? state.startedAt + step.durationSeconds * 1000 : null;
    const clock = state?.pausedAt ?? now;
    return { state, step, deadline, remaining: deadline === null ? null : Math.max(0, deadline - clock), expired: deadline !== null && clock >= deadline };
  }

  function matches(actual, expected) {
    if (actual == null || expected == null) return actual == null && expected == null;
    return ['schemaVersion', 'stepId', 'startedAt', 'pausedAt', 'revision'].every(key => actual[key] === expected[key]);
  }

  // undefined means reject/no-op. Safe to call repeatedly during transaction retries.
  function transition(flow, state, command, now) {
    if (!Number.isFinite(now)) throw Error('A finite clock value is required');
    validateState(flow, state);
    if (!['start', 'advance', 'pause', 'resume'].includes(command.type)) throw Error('Unknown story command');
    if (command.type === 'start') {
      if (state != null || !flow.steps[0]?.durationSeconds) return;
      return { schemaVersion: VERSION, revision: 1, stepId: flow.steps[0].id, startedAt: now };
    }
    if (!matches(state, command.expected)) return;
    const current = view(flow, state, now);
    const revision = (state?.revision || 0) + 1;
    if (command.type === 'advance') {
      if (state?.pausedAt != null || !current.step.next || (current.step.durationSeconds && !state) || (current.deadline !== null && !current.expired)) return;
      if (!flow.steps.some(step => step.id === current.step.next)) throw Error('Next story step is missing');
      return { schemaVersion: VERSION, revision, stepId: current.step.next, startedAt: now };
    }
    if (!state) return;
    if (command.type === 'pause') {
      if (state.pausedAt != null) return;
      return { ...state, schemaVersion: VERSION, revision, pausedAt: now };
    }
    if (state.pausedAt == null) return;
    const next = { ...state, schemaVersion: VERSION, revision, startedAt: state.startedAt + Math.max(0, now - state.pausedAt) };
    delete next.pausedAt;
    return next;
  }

  async function load(id) {
    const story = await global.StoryPackage.load(id);
    if (!story.experience) throw Error('This story has no experience flow.');
    return story.experience;
  }

  function connect(db, id, flow, onChange, onError = console.error) {
    global.StoryPackage.validateExperience(flow);
    let state = null, offset = 0, loaded = false, disposed = false;
    const ref = db.ref('games/' + id + '/state/experience');
    const clockRef = db.ref('.info/serverTimeOffset');
    const connectionRef = db.ref('.info/connected');
    let connected = false;
    const readyWaiters = new Set();
    const now = () => Date.now() + offset;
    const current = () => ({ ...view(flow, state, now()), connected });
    const tick = () => {
      if (!loaded || disposed) return;
      if (connected) { for (const resolve of readyWaiters) resolve(true); readyWaiters.clear(); }
      try { onChange(current()); } catch (error) { onError(error); }
    };
    const stateChanged = snapshot => { state = snapshot.val(); loaded = true; tick(); };
    const clockChanged = snapshot => { offset = snapshot.val() || 0; tick(); };
    const connectionChanged = snapshot => { connected = snapshot.val() === true; tick(); };
    ref.on('value', stateChanged, onError);
    clockRef.on('value', clockChanged, onError);
    connectionRef.on('value', connectionChanged, onError);
    const timer = setInterval(tick, 500);

    async function dispatch(type) {
      // Do not queue host actions while disconnected; retry explicitly after reconnect.
      if (!loaded || disposed || !connected) return false;
      const command = { type, expected: state && { ...state } };
      const result = await ref.transaction(old => {
        if (disposed) return;
        const next = transition(flow, old, command, now());
        if (next && ['start', 'advance'].includes(type)) next.startedAt = global.firebase.database.ServerValue.TIMESTAMP;
        return next;
      }, undefined, false);
      return result.committed;
    }
    return {
      view: current,
      setPaused: paused => dispatch(paused ? 'pause' : 'resume'),
      async ensureStarted() {
        if (disposed) return false;
        if (!loaded || !connected) {
          const ready = await new Promise(resolve => readyWaiters.add(resolve));
          if (!ready) return false;
        }
        return dispatch('start');
      },
      advance: () => dispatch('advance'),
      dispose() {
        disposed = true;
        for (const resolve of readyWaiters) resolve(false);
        readyWaiters.clear();
        clearInterval(timer);
        ref.off('value', stateChanged);
        clockRef.off('value', clockChanged);
        connectionRef.off('value', connectionChanged);
      }
    };
  }
  const api = { load, validate: flow => global.StoryPackage.validateExperience(flow), connect, state: { version: VERSION, validate: validateState, view, transition } };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else global.StoryRuntime = api;
})(typeof window !== 'undefined' ? window : globalThis);
