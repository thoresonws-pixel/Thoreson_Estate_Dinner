window.mountStoryFlow = function (db, id, pack) {
    const panel = document.createElement('section');
    panel.id = 'flowScreen';
    panel.innerHTML = '<div class="eyebrow" id="flowLabel"></div><h1 id="flowText"></h1><p id="flowClock" role="timer"></p><button id="flowNext"></button><p id="flowError" role="status"></p>';
    document.querySelector('.focus').prepend(panel);
    const el = id => document.getElementById(id);
    const scene = createDialogueScene(pack);
    let lastStep = null, busy = false;
    const report = error => { el('flowError').textContent = error.message; el('notice').textContent = error.message; el('flowNext').disabled = true; };
    const runtime = StoryRuntime.connect(db, id, pack, v => {
        const exploration = v.step.type === 'exploration';
        const dialogue = v.step.type === 'dialogue';
        panel.hidden = exploration || dialogue;
        if (lastStep !== v.step.id) {
            if (typeof closeFocusPanels === 'function') closeFocusPanels();
            document.querySelectorAll('video,audio').forEach(media => media.pause());
            document.querySelectorAll('.focus > :not(#flowScreen)').forEach(node => { node.hidden = true; });
            if (exploration) {
                el('roomView').hidden = false;
                el('focusCaption').hidden = false;
                document.querySelector('.focus-title').hidden = false;
                document.querySelector('header .toolbar').prepend(el('flowNext'));
            } else panel.insertBefore(el('flowNext'), el('flowError'));
            lastStep = v.step.id;
            if (typeof setRoomStep === 'function') setRoomStep(v.step.id, pack.steps);
            if (dialogue) db.ref('games/'+id+'/state/tv').update({currentRoom:v.step.roomId}).catch(report);
            else scene.leave();
        }
        document.querySelectorAll('#openMap,#showEstate').forEach(node => { node.disabled = !pack.map?.rooms?.length; });
        el('openBoard').disabled = false;
        if (window.roomInteractionUI) roomInteractionUI.setEnabled(exploration);
        el('flowLabel').textContent = v.step.label || '';
        el('flowText').textContent = (v.expired ? v.step.expiredText || v.step.text : v.step.text) || '';
        const seconds = Math.ceil(v.remaining / 1000);
        el('flowClock').textContent = v.remaining === null || v.expired ? '' : Math.floor(seconds / 60) + ':' + String(seconds % 60).padStart(2, '0');
        el('flowNext').textContent = v.step.button || 'Continue';
        el('flowNext').hidden = !v.step.next || v.remaining !== null && !v.expired;
        el('flowNext').disabled = busy || !v.connected;
        if (dialogue) scene.render(v,el('flowNext'),paused=>runtime.setPaused(paused).catch(report));
        if(v.connected && v.expired && v.step.autoAdvance && v.state?.pausedAt == null && !busy) queueMicrotask(advance);
    }, report);
    window.pauseActiveScene = () => { if(runtime.view().step.type==='dialogue') runtime.setPaused(true).catch(report); };
    runtime.ensureStarted().catch(report);
    async function advance() {
        if(busy)return;
        busy = true;
        el('flowNext').disabled = true;
        try { await runtime.advance(); el('flowError').textContent = ''; }
        catch (error) { report(error); }
        finally { busy = false; }
    }
    el('flowNext').onclick = advance;
    window.addEventListener('pagehide', () => runtime.dispose(), {once: true});
    return runtime;
};
