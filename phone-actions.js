/* Story-defined phone actions. Wins are shared with the host's room view. */
(function(){
    'use strict';
    const node=(tag,text)=>{const el=document.createElement(tag);if(text)el.textContent=text;return el;};
    window.addEventListener('load',()=>{
        const root=document.getElementById('actions');if(!root)return;
        const list=node('div'),memory=node('div');memory.id='actionMemories';
        document.getElementById('character')?.append(memory);
        const inventory=document.getElementById('phoneInventory'),evidence=node('div');evidence.id='groupEvidence';document.getElementById('discoveries')?.append(evidence);
        const personal=document.getElementById('personalInventory'),otherInventories=document.getElementById('developerInventories');
        const developerPanel=node('div');developerPanel.id='developerCharacters';document.getElementById('character')?.append(developerPanel);
        root.replaceChildren(node('h2','Actions'),list);
        const modal=node('dialog');modal.setAttribute('aria-label','Phone challenge');modal.style.cssText='background:#14101c;color:#f5f0e6;border:1px solid #c9a227;border-radius:12px;width:min(92vw,420px);max-height:94dvh;overflow:auto;padding:16px;';
        const close=node('button','Close game'),gameSurface=node('div');close.type='button';modal.append(close,gameSurface);document.body.append(modal);
        const memoryPopup=node('dialog');memoryPopup.setAttribute('aria-label','New character memory');memoryPopup.style.cssText=modal.style.cssText;
        const memoryClose=node('button','Continue'),memoryBody=node('div');memoryPopup.append(memoryBody,memoryClose);document.body.append(memoryPopup);
        let seenMemories=null,pendingMemories=[];
        function showMemory(){if(mini||memoryPopup.open||!pendingMemories.length)return;const entry=pendingMemories.shift();memoryBody.replaceChildren(node('h2',entry.characterName+' · '+entry.title),node('p',entry.text));memoryPopup.showModal();}
        memoryClose.onclick=()=>{memoryPopup.close();showMemory();};memoryPopup.addEventListener('cancel',()=>queueMicrotask(showMemory));
        function updateMemories(entries,character){
            GameMemories.render(memory,entries);
            if(seenMemories)for(const entry of entries)if(!seenMemories.has(entry.id)&&(entry.id.startsWith('interaction:')||(developer&&entry.characterId!==character)))pendingMemories.push(entry);
            seenMemories=new Set(entries.map(entry=>entry.id));showMemory();
        }
        function renderPersonal(){
            if(!privateError)personal?.querySelector('[data-private-error]')?.remove();
            SharedInventory.render(personal,{inventory:privatePlayers[user.uid]?.inventory||{}},pack,{title:'Personal items'});
            if(privateError&&personal&&!personal.querySelector('[data-private-error]')){const error=node('p','Personal inventory is unavailable. Reopen the game to retry.');error.dataset.privateError='true';error.setAttribute('role','alert');personal.append(error);}
            if(!otherInventories)return;
            const peers=developer?Object.entries(privatePlayers).filter(([uid,p])=>uid!==user.uid&&Object.keys(p.inventory||{}).length):[];
            const key=JSON.stringify(peers);if(otherInventories._peers===key)return;otherInventories._peers=key;otherInventories.replaceChildren();
            for(const [uid,player]of peers){const box=node('div');box.dataset.playerId=uid;otherInventories.append(box);const identity=latest.players?.[uid]||{};const name=storyPackage.content?.characters?.[identity.characterId]?.name||identity.displayName||'Player';SharedInventory.render(box,{inventory:player.inventory},pack,{title:name+' · Personal items (developer view)'});}
        }
        let privatePlayers={},privateError=false,stopPrivate=null,privateScope='';
        function syncPrivate(){
            const scope=latest?.players?.[user?.uid]?gameId+':'+user.uid+':'+developer:'';
            if(scope===privateScope)return;
            stopPrivate?.();stopPrivate=null;privateScope=scope;privatePlayers={};privateError=false;
            for(const box of [personal,otherInventories])if(box){box.replaceChildren();box._inventorySignature=null;box._peers=null;}
            if(!scope)return;
            stopPrivate=PrivateInventory.watch({db:firebase.database(),gameId,uid:user.uid,all:developer},players=>{
                if(privateScope!==scope)return;privatePlayers=players;privateError=false;if(pack&&latest)renderPersonal();
            },()=>{if(privateScope!==scope)return;privateError=true;if(pack&&latest)renderPersonal();});
        }
        let developer=false,stopDeveloper=null,storyPackage=null;
        let mazeViews=[];
        let grantsRef,grantsChanged,gameRef,userRef,gameChanged,userChanged,mini=null,pack=null,latest=null,user=null,gameId=null,generation=0,signature='';
        function bookletAvailable(game,item){
            if(!item||!game?.players?.[user?.uid])return false;
            const target=pack.interactions.find(i=>i.id===item.playInteraction),tv=game.state?.tv||{};
            return target&&allowed(game,target)&&!tv.puzzles?.[target.id]?.solved;
        }
        SharedInventory.setBookletActions({
            available(id){const item=pack?.collections?.find(i=>i.reward.id===id),selection=latest?.state?.tv?.songSelection;
                if(!bookletAvailable(latest,item))return {enabled:false,label:'Open the instrument on the TV to play'};
                if(selection)return {enabled:false,label:'Piano in use — please wait'};
                return {enabled:true,label:'Play this song'};
            },
            async play(id,pageId){
                const item=pack?.collections?.find(i=>i.reward.id===id),page=item?.pages?.find(p=>p.id===pageId);
                if(!page||!bookletAvailable(latest,item))throw Error('This instrument is not currently available.');
                const selectedGeneration=generation,requestId=crypto.randomUUID(),uid=user.uid,revision=latest.state?.experience?.revision||0,privateGeneration=latest.privateGeneration||0;
                const result=await firebase.database().ref('games/'+gameId).transaction(game=>{
                    if(selectedGeneration!==generation||(game?.state?.experience?.revision||0)!==revision||(game?.privateGeneration||0)!==privateGeneration||!bookletAvailable(game,item)||game.state.tv.songSelection||(page.requiresInventory&&!game.state.tv.inventory?.[page.requiresInventory]))return;
                    game.state.tv.songSelection={id:requestId,bookletId:id,pageId,interactionId:item.playInteraction,selectedBy:uid,revision,privateGeneration};return game;
                });
                if(!result.committed)throw Error('Someone else has the piano. Try again when their attempt finishes.');
                return 'Ready on the TV. Play the notes there using the piano or keyboard.';
            }
        });
        const stopMini=()=>{mini?.dispose();mini=null;if(modal.open)modal.close();queueMicrotask(showMemory);};close.onclick=stopMini;modal.addEventListener('cancel',stopMini);
        const detachGame=()=>{if(grantsRef&&grantsChanged)grantsRef.off('value',grantsChanged);grantsRef=null;stopPrivate?.();stopPrivate=null;privateScope='';privatePlayers={};privateError=false;mazeViews.forEach(v=>v.dispose());mazeViews=[];if(gameRef&&gameChanged)gameRef.off('value',gameChanged);gameRef=null;pendingMemories=[];seenMemories=null;if(memoryPopup.open)memoryPopup.close();stopMini();for(const box of [personal,otherInventories])if(box){box.replaceChildren();box._inventorySignature=null;box._peers=null;}};
        const detach=()=>{stopDeveloper?.();stopDeveloper=null;developer=false;storyPackage=null;developerPanel.replaceChildren();developerPanel._developerSignature=null;generation++;detachGame();if(userRef&&userChanged)userRef.off('value',userChanged);userRef=null;pack=latest=null;signature='';memory.replaceChildren();inventory?.replaceChildren();if(inventory)inventory._inventorySignature=null;evidence.replaceChildren();evidence._inventorySignature=null;};
        function allowed(game,item){
            if(!game?.players?.[user?.uid])return false;
            if(!DeveloperAccess.canAct(item,game.players[user.uid].characterId,developer))return false;
            const state=game.state||{},step=pack.steps.find(s=>s.id===state.experience?.stepId)||(!state.experience?pack.steps[0]:null);
            if(step?.type!=='exploration'||state.tv?.currentRoom!==item.roomId||state.tv?.activeInteraction!==item.id)return false;
            if(Object.prototype.hasOwnProperty.call(item,'unlockAtStep')){if(!item.unlockAtStep)return false;if(pack.steps.findIndex(s=>s.id===step.id)<pack.steps.findIndex(s=>s.id===item.unlockAtStep))return false;}
            const gate=pack.map?.access?.[item.roomId];
            if(gate&&(!gate.unlockAtStep||pack.steps.findIndex(s=>s.id===step.id)<pack.steps.findIndex(s=>s.id===gate.unlockAtStep)))return false;
            return true;
        }
        const handledRequests=new Map();
        function focusRequestedAction(challenges){
            const request=latest.state?.tv?.phoneActionRequest;
            if(!request?.id||typeof request.id!=='string')return;
            const item=challenges.find(i=>i.id===request.interactionId);
            if(!item||!allowed(latest,item)||typeof window.navigateAuth!=='function')return;
            const key='phone-action-focus:'+gameId+':'+user.uid;
            let previous=handledRequests.get(key);
            try{previous=previous||sessionStorage.getItem(key);}catch(_){}
            if(previous===request.id)return;
            handledRequests.set(key,request.id);
            try{sessionStorage.setItem(key,request.id);}catch(_){}
            window.navigateAuth('#actions');
        }
        function render(){
            if(!pack||!latest||!user)return;
            syncPrivate();
            const legacyCase=document.getElementById('discoveriesContent');if(legacyCase)legacyCase.hidden=pack.caseBoard?.inventoryOnly===true;
            DeveloperAccess.render(developerPanel,storyPackage,developer,latest);
            renderPersonal();
            SharedInventory.render(inventory,latest.state?.tv||{},pack,{title:'Group puzzle items',puzzleOnly:true});
            CaseBoard.render(evidence,latest.state?.tv||{},pack,{showNotes:true});
            SharedInventory.refreshBookletActions();
            const challenges=pack.interactions.filter(i=>i.maze||['poolShot','noteSequence'].includes(i.type)),character=latest.players?.[user.uid]?.characterId;
            focusRequestedAction(challenges);
            updateMemories(GameMemories.available(storyPackage,latest,character,developer),character);
            const next=JSON.stringify([developer,SharedInventory.entries(latest.state?.tv||{},pack).filter(i=>i.pages).map(i=>[i.id,i.pages]),challenges.map(i=>[i.id,allowed(latest,i),!!latest.state?.tv?.puzzles?.[i.id]?.solved,character,Object.values(latest.players||{}).some(p=>p.characterId===i.memory?.characterId)])]);
            if(next===signature)return;signature=next;stopMini();mazeViews.forEach(v=>v.dispose());mazeViews=[];list.replaceChildren();
            let count=0;
            for(const item of challenges){
                if(!allowed(latest,item))continue;count++;
                const card=node('div');card.append(node('h3',item.name));
                if(developer&&item.characterIds?.length)card.append(node('p','Developer access · '+item.characterIds.map(id=>storyPackage.content?.characters?.[id]?.name||id).join(', ')));
                if(latest.state?.tv?.puzzles?.[item.id]?.solved){const complete=node('button','Completed');complete.disabled=true;card.append(complete);list.append(card);continue;}
                if(item.maze){list.append(card);mazeViews.push(CooperativeMaze.mount(card,{db:firebase.database(),gameId,item,uid:user.uid,pack}));continue;}
                if(item.type==='noteSequence'){
                    const booklet=pack.collections?.find(i=>i.playInteraction===item.id);
                    const collection=booklet&&SharedInventory.entries(latest.state?.tv||{},pack).find(i=>i.id===booklet.reward.id);
                    if(collection?.pages?.length){card.append(node('p','Browse the sheet music you have found and choose a song for the TV.'));SharedInventory.renderBooklet(card,collection.pages,booklet.reward.id);}else card.append(node('p','Find and collect sheet music while exploring. Your discovered songs will appear here.'));
                    list.append(card);continue;
                }
                const play=node('button',item.actionLabel||'Play');play.type='button';play.style.cssText='display:block;width:100%;min-height:80px;padding:22px 24px;margin:16px 0;font-size:24px;font-weight:700;background:#c9a227;color:#14101c;border:2px solid #e5c75f;border-radius:10px;cursor:pointer';
                if(item.letterPuzzle){
                    const board=node('button','View puzzle board');board.type='button';board.style.cssText=play.style.cssText;
                    board.onclick=()=>{if(!allowed(latest,item))return;stopMini();PoolShot.renderBoard(gameSurface,item);modal.showModal();};card.append(node('p',item.letterPuzzle.prompt),board);
                }
                play.onclick=()=>{
                    if(!allowed(latest,item))return;stopMini();modal.showModal();
                    const selectedGame=gameId,selectedUser=user.uid,selectedGeneration=generation;
                    const config=PoolShot.challenge(item),attemptGeneration=latest.privateGeneration||0,attemptRevision=latest.state?.experience?.revision||0;
                    mini=PoolShot.mount(gameSurface,config,async proof=>{
                        if(selectedGeneration!==generation||!allowed(latest,item))throw Error('The table is no longer active. Open it on the TV to continue.');
                        if(!PoolShot.canUnlock(item,privatePlayers[selectedUser])){const message=node('p','Practice complete. The drawer stays shut: the designated toy owner must take the shots.');message.setAttribute('role','status');gameSurface.append(message);return;}
                        await GameActions.completePool({db:firebase.database(),gameId:selectedGame,uid:selectedUser,item,generation:attemptGeneration,revision:attemptRevision,proof});
                    });
                };card.append(play);
                if(item.memory&&!Object.values(latest.players||{}).some(p=>p.characterId===item.memory.characterId)){const fallback=node('details');fallback.append(node('summary',item.memory.fallbackTitle||'A remembered conversation'),node('p',item.memory.text));card.append(fallback);}
                list.append(card);
            }
            if(!count)list.append(node('p','Inspect an interactive object on the TV to see available actions here.'));
        }
        const unsubscribe=firebase.auth().onAuthStateChanged(account=>{
            detach();user=account;list.replaceChildren(node('p','Loading available actions…'));
            if(!user||user.isAnonymous){list.replaceChildren(node('p','Sign in to use game actions.'));return;}
            stopDeveloper=DeveloperAccess.watch(user,enabled=>{developer=enabled;signature='';seenMemories=null;pendingMemories=[];if(memoryPopup.open)memoryPopup.close();if(pack&&latest)render();});
            userRef=firebase.database().ref('users/'+user.uid+'/currentGameId');
            userChanged=snapshot=>{
                detachGame();const current=++generation;gameId=snapshot.val();pack=null;latest=null;signature='';
                if(!gameId){list.replaceChildren(node('p','Choose a game first.'));return;}
                gameRef=firebase.database().ref('games/'+gameId);
                gameChanged=async snapshot=>{latest=snapshot.val();if(!latest?.players?.[user.uid]){syncPrivate();stopMini();list.replaceChildren(node('p','Join this game to use its actions.'));return;}
                    try{const story=await StoryPackage.load(latest.storyId);if(current!==generation)return;storyPackage=story;pack=story.experience;const own=story.content?.characters?.[latest.players?.[user.uid]?.characterId];if(own&&window.characterDatabase){window.characterDatabase[latest.players[user.uid].characterId]=own;window.loadCharacterData?.();}if(!pack){list.replaceChildren(node('p','No actions are available for this story.'));return;}render();}
                    catch(error){if(current===generation){stopMini();list.replaceChildren(node('p',error.message));}}
                };grantsRef=firebase.database().ref('memoryGrants/'+gameId);grantsChanged=()=>{const ref=gameRef;if(ref)ref.once('value').then(s=>{if(current===generation)gameChanged(s);});};grantsRef.on('value',grantsChanged);gameRef.on('value',gameChanged,error=>{stopMini();list.replaceChildren(node('p',error.message));});
            };userRef.on('value',userChanged);
        });
        window.addEventListener('pagehide',()=>{SharedInventory.setBookletActions(null);detach();unsubscribe?.();},{once:true});
    });
})();
