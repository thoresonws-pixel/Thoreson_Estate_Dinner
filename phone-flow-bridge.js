// Attach after each legacy player page's Firebase initialization.
window.addEventListener('load', () => {
    if (new URLSearchParams(location.search).get('stay') === '1') return;
    let gameRef, changed, stepRef, stepChanged, generation = 0, selection = 0;
    const detachStep = () => { if (stepRef && stepChanged) stepRef.off('value', stepChanged); stepRef = stepChanged = null; };
    const detach = () => { generation++; if (gameRef && changed) gameRef.off('value', changed); detachStep(); };
    const unsubscribe = firebase.auth().onAuthStateChanged(user => {
        detach();
        if (!user || user.isAnonymous) return;
        const current = generation;
        gameRef = firebase.database().ref('users/' + user.uid + '/currentGameId');
        changed = async snapshot => {
            const selected = ++selection;
            detachStep();
            const id = snapshot.val();
            if (!id) return;
            try {
                const game = (await firebase.database().ref('games/' + id).once('value')).val();
                if (!game?.players?.[user.uid]) return;
                const story = await StoryPackage.load(game.storyId);
                if (current !== generation || selected !== selection || !story.experience) return;
                stepRef = firebase.database().ref('games/' + id + '/state/experience');
                stepChanged = snapshot => {
                    if (current !== generation || selected !== selection) return;
                    const saved = snapshot.val();
                    const step = saved ? story.experience.steps.find(step => step.id === saved.stepId) : story.experience.steps[0];
                    // Exploration uses the player's character, case file and photo tabs.
                    // Timed questionnaires and other scripted steps use the flow screen.
                    if (step?.type !== 'exploration') location.replace('player-flow.html');
                };
                stepRef.on('value', stepChanged);
            } catch (error) {
                if (current !== generation) return;
                let message = document.getElementById('storyLoadError');
                if (!message) { message = document.createElement('p'); message.id = 'storyLoadError'; message.setAttribute('role', 'alert'); document.body.prepend(message); }
                message.textContent = error.message;
            }
        };
        gameRef.on('value', changed);
    });
    window.addEventListener('pagehide', () => { detach(); if (typeof unsubscribe === 'function') unsubscribe(); }, {once: true});
});
