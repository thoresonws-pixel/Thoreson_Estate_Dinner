/* Shared account sign-in. No story or party-specific authentication behavior. */
(function () {
    'use strict';
    window.PlayerAuth = {
        create(auth) {
            let completion;
            // Prepare storage on page load, not between the tap and window.open.
            // Mobile browsers may drop popup permission across an asynchronous wait.
            let persistenceError;
            const persistenceReady = auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
                .catch(error => { persistenceError = error; });
            async function finish(user, route) {
                if (!user || user.isAnonymous) return;
                if (!completion) {
                    completion = (async () => {
                        await persistenceReady;
                        if (persistenceError) throw persistenceError;
                        await route(user);
                    })().catch(error => { completion = null; throw error; });
                }
                return completion;
            }
            return {
                persist: () => auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL),
                async resume(route, onError) {
                    try {
                        const result = await auth.getRedirectResult();
                        if (result && result.user) return await finish(result.user, route);
                        // A restored account is valid even when no redirect result exists.
                        const user = await new Promise((resolve, reject) => {
                            const unsubscribe = auth.onAuthStateChanged(user => {
                                queueMicrotask(unsubscribe);
                                resolve(user);
                            }, reject);
                        });
                        await finish(user, route);
                    } catch (error) { onError(error); }
                },
                async google(route) {
                    if (persistenceError) throw persistenceError;
                    const provider = new firebase.auth.GoogleAuthProvider();
                    provider.setCustomParameters({ prompt: 'select_account' });
                    // Invoke the popup in the button's original user gesture, before
                    // any await. Persistence is checked before navigating to the game.
                    // Never silently redirect after a cancelled or blocked popup.
                    const result = await auth.signInWithPopup(provider);
                    await finish(result.user, route);
                }
            };
        },
        message(error) {
            if (error.code === 'auth/popup-blocked') return 'Google’s sign-in window was blocked. Open this invite in Safari or Chrome, allow pop-ups for this site, then tap Continue with Google again.';
            if (error.code === 'auth/popup-closed-by-user' || error.code === 'auth/cancelled-popup-request') return 'Google sign-in was cancelled. Tap Continue with Google to try again.';
            if (error.code === 'auth/web-storage-unsupported') return 'Your browser could not save your sign-in. Open this invite in a regular Safari or Chrome tab with site storage enabled.';
            return error.message || 'Sign-in could not finish. Please try again.';
        }
    };
})();
