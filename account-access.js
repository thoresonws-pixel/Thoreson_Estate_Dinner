/* UI capability lookup. Database rules remain the authorization boundary. */
(function (global) {
  'use strict';
  function grantPath(uid) {
    if (typeof uid !== 'string' || !uid || /[.#$\[\]/]/.test(uid)) throw Error('A valid account identity is required.');
    return 'platformAdmins/' + uid;
  }
  global.AccountAccess = {
    async isPlatformAdmin(db, uid) {
      if (!uid) return false;
      try {
        return (await db.ref(grantPath(uid)).once('value')).val() === true;
      } catch (error) {
        // During a staged rollout, older rules may deny this new path. Never
        // infer administrator access from a profile or prevent ordinary play.
        if (/permission.denied/i.test(error.code || '')) return false;
        throw error;
      }
    },
    watchPlatformAdmin(db, uid, onChange, onError = console.error) {
      if (!uid) { onChange(false); return () => {}; }
      const ref = db.ref(grantPath(uid));
      const changed = snapshot => onChange(snapshot.val() === true);
      ref.on('value', changed, error => { onChange(false); onError(error); });
      return () => ref.off('value', changed);
    }
  };
})(window);
