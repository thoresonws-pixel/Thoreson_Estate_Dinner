/* Served only by the loopback development server, never included in a release. */
(function(){
    'use strict';
    if(!['127.0.0.1','localhost'].includes(location.hostname))throw Error('The player lab requires localhost.');
    const settings=window.__PLAYER_LAB__;
    if(!settings?.uid)throw Error('Missing lab identity');
    if(navigator.serviceWorker)navigator.serviceWorker.register=()=>Promise.reject(Error('Push notifications are disabled in the local player lab.'));
    const prefix='lab:'+settings.gameId+':'+settings.uid+':';
    for(const method of ['getItem','setItem','removeItem']){
        const original=Storage.prototype[method];
        Storage.prototype[method]=function(key,...args){return original.call(this,prefix+key,...args);};
    }
    const Channel=window.BroadcastChannel;
    window.BroadcastChannel=class extends Channel{constructor(name){super(prefix+name);}};
    const initialize=firebase.initializeApp.bind(firebase);
    firebase.initializeApp=function(){
        const app=initialize({apiKey:'demo-key',projectId:'demo-mystery-lab',authDomain:'localhost',databaseURL:'https://demo-mystery-lab-default-rtdb.firebaseio.com',storageBucket:'demo-mystery-lab.appspot.com'});
        const auth=app.auth(),db=app.database();
        auth.useEmulator('http://127.0.0.1:9099',{disableWarnings:true});db.useEmulator('127.0.0.1',9000);
        // Wait for the selected identity before legacy auth listeners are attached.
        const ready=(async()=>{await auth.setPersistence(firebase.auth.Auth.Persistence.NONE);await auth.signInWithCustomToken(settings.token);if(auth.currentUser.email!==settings.email)await auth.currentUser.updateEmail(settings.email);await auth.currentUser.updateProfile({displayName:settings.name});return auth.currentUser;})();
        const listen=auth.onAuthStateChanged.bind(auth);
        auth.onAuthStateChanged=(next,error,complete)=>{let stopped=false,unsubscribe;ready.then(()=>{if(!stopped)unsubscribe=listen(next,error,complete);}).catch(e=>{if(error)error(e);else{console.error(e);document.body.prepend(Object.assign(document.createElement('p'),{textContent:'Player lab sign-in failed: '+e.message}));}});return()=>{stopped=true;unsubscribe?.();};};
        window.playerLabReady=ready;
        return app;
    };
})();
