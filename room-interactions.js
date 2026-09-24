(function(global){
    'use strict';
    const node=(tag,text,cls)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(cls)n.className=cls;return n;};
    function mount({pack,getState,save,open,close,panels,mazeContext}){
        const items=pack.interactions||[],list=document.getElementById('objectList');
        const panel=node('dialog');panel.id='interactionDialog';panel.setAttribute('aria-label','Inspect object');
        document.querySelector('.focus').append(panel);panels.push(panel);
        let focus='room',enabled=false,active=null,sequence=[],busy=false,audio=null,lastList='',renderedSolved=false;
        let mazeView=null,api=null;
        let stepId=null,playNote=null,lastSongRequest=null,attemptMessage='';
        function keyboardInput(event){
            if(!panel.open||active?.type!=='noteSequence'||!playNote||event.repeat||event.ctrlKey||event.altKey||event.metaKey)return;
            if(event.target.closest?.('input,textarea,select,[contenteditable="true"]'))return;
            const letter=event.key.toUpperCase();
            const key=active.keys.find(k=>k.keyboard===letter&&!!k.black===event.shiftKey);
            if(!key)return;event.preventDefault();playNote(key);
        }
        global.addEventListener('keydown',keyboardInput);
        const observedSolved=new Map();
        function renderUnlock(item){
            const box=node('div',undefined,'object-unlock');box.setAttribute('role','status');
            const symbol=node('div','◇','unlock-symbol');symbol.setAttribute('aria-hidden','true');
            box.append(symbol,node('span','UNLOCKED','eyebrow'),node('h3',item.reward.name),node('p',item.reward.text));
            const revealed=items.filter(i=>i.requiresPuzzle===item.id&&i.roomId===item.roomId&&!locked(i));
            for(const target of revealed){const inspect=node('button','Inspect '+target.name);inspect.onclick=()=>{active=target;renderItem();update(getState());};box.append(inspect);}
            panel.append(box);
        }
        const inventoryBox=document.getElementById('sharedInventory');
        function renderInventory(state){SharedInventory.render(inventoryBox,state,pack,{title:'Group puzzle items',puzzleOnly:true});if(global.CaseBoard)CaseBoard.render(document.getElementById('caseEvidence'),state,pack);const count=document.getElementById('noteCount');if(count){const entries=SharedInventory.entries(state,pack).filter(i=>!i.isEvidence||i.isPuzzleItem);count.textContent=entries.length+' collected puzzle item'+(entries.length===1?'':'s');}}
        function guidance(item){const state=getState(),inventory=new Set(SharedInventory.entries(state,pack).map(i=>i.id));return (item.guidance||[]).find(rule=>(!rule.stepId||rule.stepId===stepId)&&(!rule.requiresInventory||inventory.has(rule.requiresInventory))&&(!rule.missingInventory||!inventory.has(rule.missingInventory))&&(!rule.requiresInspected||state.inspected?.[rule.requiresInspected])&&(!rule.uninspected||!state.inspected?.[rule.uninspected])&&(!rule.unsolvedPuzzle||!state.puzzles?.[rule.unsolvedPuzzle]?.solved))?.text||item.reward.text;}
        function collected(item,state=getState()){return SharedInventory.entries(state,pack).some(entry=>entry.id===item.reward.id);}
        function hasRequired(item){return !item.requiresInventory||SharedInventory.entries(getState(),pack).some(entry=>entry.id===item.requiresInventory);}
        function renderSequence(item){
            if(!hasRequired(item)){
                panel.append(node('p',item.missingItemText||'A required item is missing.','puzzle-status'));
                if(new URLSearchParams(location.search).get('puzzleTest')==='1'){
                    const source=items.find(i=>i.type==='inventory'&&i.reward.id===item.requiresInventory);
                    if(source){const grant=node('button','TEST: Add required item to group inventory');grant.onclick=async()=>{if(busy)return;busy=true;grant.disabled=true;const ok=await save({['inventory/'+source.reward.id]:{...source.reward,source:source.id,foundAt:Date.now()}});busy=false;if(ok){renderItem();update(getState());}else{grant.disabled=false;}};panel.append(grant);}
                }
                return;
            }
            if(!getState().puzzles?.[item.id]?.activated){
                const activate=node('button',item.activateLabel||'Activate mechanism');
                activate.onclick=async()=>{if(busy||!enabled||locked(item)||!hasRequired(item)||getState().currentRoom!==item.roomId)return;busy=true;activate.disabled=true;const ok=await save({['puzzles/'+item.id+'/activated']:true});busy=false;if(ok&&active===item)renderItem();else activate.disabled=false;};panel.append(activate);return;
            }
            if(solved(item)){panel.append(node('h3',item.reward.name),node('p',item.reward.text));return;}
            if(item.hint){const hint=node('details');hint.append(node('summary','Show test order'),node('p',item.hint));panel.append(hint);}
            const output=node('p','Place each object once, in the correct order.','puzzle-status');output.setAttribute('role','status');
            const tray=node('div');tray.style.cssText='display:flex;flex-wrap:wrap;gap:12px;margin:24px 0';
            const reset=node('button','Reset placement');
            const clear=()=>{sequence=[];tray.querySelectorAll('button').forEach(b=>b.disabled=false);};
            reset.onclick=()=>{if(busy)return;clear();output.textContent='Ready for a new sequence.';};
            for(const object of item.objects){const button=node('button',object.label);button.style.cssText='min-height:70px;padding:16px';button.onclick=async()=>{
                if(busy||!enabled||locked(item)||!hasRequired(item)||!panel.open||getState().currentRoom!==item.roomId||sequence.includes(object.id))return;
                sequence.push(object.id);button.disabled=true;output.textContent=sequence.map(id=>item.objects.find(o=>o.id===id).label).join(' → ');
                if(sequence.length<item.solution.length)return;
                if(!sequence.every((id,i)=>id===item.solution[i])){clear();output.textContent='The mechanism stays shut. Resetting the toys—try a different order.';return;}
                busy=true;reset.disabled=true;output.textContent='Opening…';
                const ok=await save({['puzzles/'+item.id+'/solved']:true,['puzzles/'+item.id+'/solvedAt']:Date.now()});busy=false;
                if(active!==item)return;if(ok){renderItem();update(getState());}else{clear();reset.disabled=false;output.textContent='Could not save. Please try again.';}
            };tray.append(button);}
            panel.append(output,tray,reset);
        }
        function locked(item){
            if(item.parentInteraction&&!getState().inspected?.[item.parentInteraction])return true;
            if(item.requiresPuzzle&&!getState().puzzles?.[item.requiresPuzzle]?.solved)return true;
            if(!Object.prototype.hasOwnProperty.call(item,'unlockAtStep'))return false;
            if(item.unlockAtStep===null)return true;
            const current=pack.steps.findIndex(s=>s.id===stepId),required=pack.steps.findIndex(s=>s.id===item.unlockAtStep);
            return current<0||required<0||current<required;
        }
        function solved(item){return getState().puzzles?.[item.id]?.solved===true;}
        function tone(key){try{const Context=global.AudioContext||global.webkitAudioContext;if(!Context)return;audio||=new Context();if(audio.state==='suspended')audio.resume().catch(()=>{});const osc=audio.createOscillator(),gain=audio.createGain(),now=audio.currentTime;osc.type='triangle';osc.frequency.value=440*Math.pow(2,(key.midi-69)/12);gain.gain.setValueAtTime(0,now);gain.gain.linearRampToValueAtTime(.16,now+.015);gain.gain.exponentialRampToValueAtTime(.001,now+.8);osc.connect(gain);gain.connect(audio.destination);osc.start(now);osc.stop(now+.85);osc.onended=()=>{osc.disconnect();gain.disconnect();};}catch(e){/* Visual note input still works without an audio device. */}}
        function renderItem(){
            const item=active;if(!item)return;mazeView?.dispose();mazeView=null;playNote=null;sequence=[];renderedSolved=solved(item);panel.classList.remove('character-dialogue');panel.replaceChildren();
            const header=node('div',undefined,'dialog-head'),title=node('h2',item.name),back=node('button','Return to room');back.onclick=()=>{mazeView?.dispose();mazeView=null;if(item.maze||['poolShot','noteSequence'].includes(item.type))save({activeInteraction:null,...(item.type==='noteSequence'?{songSelection:null}:{})});close();list.querySelector('button')?.focus();};header.append(title,back);const description=node('p',item.description);if(item.maze)description.style.cssText='font-size:18px;line-height:1.4;margin:12px 0';panel.append(header,description);
            if(item.image){const art=node('img');art.src=item.image;art.alt=item.imageAlt;art.style.cssText='display:block;width:100%;max-height:48vh;object-fit:contain;margin:16px 0';if(item.maze&&getState().puzzles?.[item.id]?.activated)art.style.maxHeight='16vh';panel.append(art);}
            if(locked(item)){panel.append(node('p',item.lockedText||'This object is not available yet.','puzzle-status'));return;}
            if(item.type==='inspection'&&item.requiresInventory&&!getState().puzzles?.[item.id]?.activated){
                const status=node('p',item.missingItemText||'Locked. Try an item from the group inventory.','puzzle-status');status.setAttribute('role','status');panel.append(status);
                const options=SharedInventory.entries(getState(),pack).filter(entry=>!entry.isEvidence&&!entry.pages);
                if(!options.length)panel.append(node('p','There are no items to try in the group inventory yet.'));
                for(const entry of options){const use=node('button','Try '+entry.name);use.onclick=async()=>{
                    if(busy||!enabled||locked(item)||!panel.open||getState().currentRoom!==item.roomId)return;
                    if(!SharedInventory.entries(getState(),pack).some(found=>found.id===entry.id))return;
                    if(entry.id!==item.requiresInventory){status.textContent=item.wrongItemText||'That does not fit. Nothing happens.';return;}
                    busy=true;use.disabled=true;const ok=await save({['puzzles/'+item.id+'/activated']:true});busy=false;
                    if(active!==item)return;if(ok)renderItem();else{use.disabled=false;status.textContent='Could not save. Please try again.';}
                };panel.append(use);}return;
            }
            if(item.type==='poolShot'){if(solved(item))renderUnlock(item);else panel.append(node('p','Open Actions on your phone and choose '+(item.actionLabel||'Play')+'.'));return;}
            if(item.type==='objectSequence'){renderSequence(item);return;}
            if(item.maze&&mazeContext){if(item.activatedText)panel.append(node('p',item.activatedText));mazeView=CooperativeMaze.mount(panel,{...mazeContext,item});return;}
            if(item.view==='caseBoard'){const view=node('button','Open Case Board');view.onclick=()=>open('boardDialog');panel.append(view);return;}
            if(item.guidance){const talk=node('button',item.actionLabel||'Ask for guidance');talk.onclick=()=>api.showNotice({speakerId:item.speakerId,title:item.name,text:guidance(item),backLabel:'Return to conversation'},()=>{active=item;renderItem();open(panel.id);});panel.append(node('p',item.reward.text),talk);return;}
            if(item.type==='inspection'){panel.append(node('p',item.reward.text,'room-notice'));return;}
            if(item.type==='evidence'||item.type==='inventory'){
                const bucket='inventory';
                const found=collected(item);
                panel.append(node('p',item.reward.text,'room-notice'));
                SharedInventory.renderBooklet(panel,item.pages);
                const done='In group inventory',action='Take item';
                const collect=node('button',found?done:action),status=node('p','');status.setAttribute('role','status');collect.disabled=found;
                collect.onclick=async()=>{
                    if(busy||!enabled||locked(item)||getState().currentRoom!==item.roomId)return;
                    busy=true;collect.disabled=true;
                    const success=await save({[bucket+'/'+item.reward.id]:{name:item.reward.name,text:item.reward.text,source:item.id,foundAt:Date.now(),kind:item.itemKind||(item.type==='evidence'?'document':'item'),isEvidence:item.isEvidence===true||item.type==='evidence'}});
                    busy=false;if(active!==item)return;
                    collect.textContent=success?done:action;collect.disabled=success;status.textContent=success?'Saved for this game.':'Could not save. Please try again.';update(getState());
                };
                panel.append(collect,status);return;
            }
            const booklet=pack.collections?.find(i=>i.playInteraction===item.id),selection=getState().songSelection;
            if(booklet&&!renderedSolved){
                if(attemptMessage)panel.append(node('p',attemptMessage,'puzzle-status'));
                if(!selection||selection.interactionId!==item.id){panel.append(node('p','Choose a song from the sheet music on your phone. The first selection will appear here.'));return;}
                const page=booklet.pages.find(p=>p.id===selection.pageId);
                if(!page){panel.append(node('p','This song is unavailable. Return to the room and choose again.'));return;}
                panel.append(node('h3',page.title),node('p',page.text,'room-notice'));
                const different=node('button','Play different song');different.onclick=async()=>{if(busy)return;busy=true;different.disabled=true;const ok=await save({songSelection:null});busy=false;if(ok){attemptMessage='Choose another song on your phone.';renderItem();}else different.disabled=false;};panel.append(different);
            }
            if(item.hint){const hint=node('details'),summary=node('summary','Show hint');hint.append(summary,node('p',item.hint));panel.append(hint);}
            const output=node('p',renderedSolved?'Already unlocked.':'Play a sequence of '+item.solution.length+' notes.','puzzle-status');output.setAttribute('role','status');panel.append(output);
            const keyboard=node('div',undefined,'piano-keyboard');keyboard.setAttribute('aria-label','Playable keyboard');const whiteCount=item.keys.filter(k=>!k.black).length;keyboard.style.setProperty('--white-count',whiteCount);let whites=0;
            if(item.keys.some(k=>k.keyboard))panel.append(node('p','Keyboard: press A–G to play a note. Hold Shift for sharps (Shift + F = F♯). Only note order matters—rhythm and speed do not.'));
            const reset=node('button','Clear notes');
            async function press(key){
                if(busy||!enabled||locked(item)||!panel.open||getState().currentRoom!==item.roomId)return;
                tone(key);const visual=keyboard.querySelector('[data-note="'+key.id+'"]');if(visual){visual.style.filter='brightness(1.5)';setTimeout(()=>visual.style.filter='',160);}if(solved(item))return;
                sequence.push(key.id);output.textContent=sequence.join(' · ');
                if(sequence.length<item.solution.length)return;
                if(!sequence.every((k,i)=>k===item.solution[i])){sequence=[];output.textContent='That melody did not open it. Try again.';if(booklet){busy=true;const ok=await save({songSelection:null});busy=false;if(active===item){if(ok){attemptMessage='That melody did not open the mechanism. Choose a song on your phone to try again.';renderItem();}else output.textContent='Could not finish the attempt. Use Play different song to retry.';}}return;}
                busy=true;keyboard.querySelectorAll('button').forEach(b=>b.disabled=true);reset.disabled=true;output.textContent='Unlocking…';
                const success=await save({['puzzles/'+item.id]:{solved:true,solvedAt:Date.now()},['discoveries/'+item.reward.id]:{name:item.reward.name,text:item.reward.text,source:item.id,foundAt:Date.now()},...(booklet?{songSelection:null}:{})});
                busy=false;if(active!==item)return;
                if(success){renderItem();update(getState());}else{sequence=[];output.textContent='Could not save the unlock. Please play the melody again to retry.';keyboard.querySelectorAll('button').forEach(b=>b.disabled=false);reset.disabled=false;}
            }
            playNote=press;
            for(const key of item.keys){const b=node('button',key.label,key.black?'piano-key black':'piano-key white');b.type='button';b.setAttribute('aria-label','Play '+key.id);if(key.keyboard)b.title=(key.black?'Shift + ':'')+key.keyboard;b.dataset.note=key.id;if(key.black){b.style.left=((whites-.31)/whiteCount*100)+'%';b.style.width=(.62/whiteCount*100)+'%';}else whites++;b.onclick=()=>press(key);keyboard.append(b);}
            reset.onclick=()=>{sequence=[];output.textContent='Notes cleared. Play '+item.solution.length+' notes.';};reset.hidden=renderedSolved;panel.append(keyboard,reset);
            if(renderedSolved){const reward=item.reward,box=node('section',undefined,'puzzle-reward');box.append(node('span','UNLOCKED','eyebrow'),node('h3',reward.name),node('p',reward.text));panel.append(box);}
        }
        function update(state){
            renderInventory(state);
            const request=state.songSelection;
            if((request?.id||null)!==lastSongRequest){lastSongRequest=request?.id||null;
                const target=request&&items.find(i=>i.id===request.interactionId&&i.type==='noteSequence');
                if(target&&enabled&&!locked(target)&&state.currentRoom===target.roomId&&state.activeInteraction===target.id){active=target;attemptMessage='';renderItem();open(panel.id);}
                else if(!request&&active?.type==='noteSequence'&&panel.open&&!busy)renderItem();
            }
            let completed;
            for(const item of items){const now=!!state.puzzles?.[item.id]?.solved;
                if(now&&observedSolved.get(item.id)===false&&item.type==='poolShot'&&enabled&&item.roomId===state.currentRoom&&state.activeInteraction===item.id)completed=item;
                observedSolved.set(item.id,now);
            }
            if(completed){active=completed;renderItem();open(panel.id);}
            if(panel.open&&active&&(!enabled||active.roomId!==state.currentRoom)){active=null;close();}
            const inspecting=enabled&&focus!=='overview';
            const focusRoot=active?.parentInteraction||active?.id;
            const roomItems=inspecting?items.filter(i=>(!i.hiddenUntilReady||!locked(i))&&i.roomId===state.currentRoom&&(focus==='object'?(i.id===focusRoot||i.parentInteraction===focusRoot):!i.parentInteraction)):[],signature=JSON.stringify([focus,enabled,state.currentRoom,roomItems.map(i=>[i.id,solved(i),locked(i),!!state.discoveries?.[i.reward.id],!!state.inventory?.[i.reward.id]])]);
            if(signature!==lastList){lastList=signature;list.replaceChildren();if(!inspecting)list.append(node('p',focus==='overview'?'Open a room to inspect its objects.':'Objects will be available during exploration.'));else if(!state.currentRoom)list.append(node('p','Choose a room on the map.'));else if(!roomItems.length)list.append(node('p','No objects to inspect here yet.'));else for(const item of roomItems){const b=node('button',item.name+(locked(item)?' · Locked':(item.type==='inventory'||item.type==='evidence')?(collected(item,state)?' · Collected':' · Item'):(solved(item)?' · Unlocked':'')));b.disabled=!enabled;b.onclick=async()=>{if(busy)return;if(item.personalItemSet&&mazeContext){busy=true;b.disabled=true;try{await PlayerItemSets.ensure(mazeContext,item.personalItemSet);}catch(error){list.append(node('p',error.message));return;}finally{busy=false;b.disabled=false;}}active=item;renderItem();open(panel.id);if(!locked(item))save({['inspected/'+item.id]:{at:Date.now()},...((item.maze||['poolShot','noteSequence'].includes(item.type))?{activeInteraction:item.id,phoneActionRequest:{id:crypto.randomUUID(),interactionId:item.id}}:{})});};list.append(b);}if(!enabled&&roomItems.length)list.append(node('p','Available during exploration.'));}
            if(panel.open&&active&&!busy&&solved(active)!==renderedSolved)renderItem();
        }
        global.addEventListener('pagehide',()=>{mazeView?.dispose();global.removeEventListener('keydown',keyboardInput);audio?.close().catch(()=>{});},{once:true});
        return api={update,setStep(value){const changed=stepId!==value;stepId=value;if(changed&&active&&panel.open)renderItem();update(getState());},showNotice(notice,back){
            active=null;sequence=[];renderedSolved=false;panel.replaceChildren();
            const speaker=pack.speakers?.[notice.speakerId],illustrated=!!speaker?.portrait;
            panel.classList.toggle('character-dialogue',illustrated);
            if(illustrated){
                const background=node('div',undefined,'dialogue-backdrop');background.setAttribute('aria-hidden','true');background.style.backgroundImage='url('+JSON.stringify(speaker.background==='map'?pack.map.image:speaker.background)+')';panel.append(background);
                const portrait=node('img',undefined,'dialogue-portrait');portrait.src=speaker.portrait;portrait.alt=speaker.alt;panel.append(portrait);
            }
            const box=node('section',undefined,illustrated?'dialogue-chat':'notice-chat'),head=node('div',undefined,'dialog-head');head.append(node('h2',speaker?.name||notice.speaker));const button=node('button',notice.backLabel||'Return to map');button.onclick=back;head.append(button);
            box.append(head,node('p',notice.title,'eyebrow'),node('p',notice.text,illustrated?'dialogue-line':'room-notice'));panel.append(box);open(panel.id);
        },setFocus(value){if(value==='overview'&&getState().activeInteraction)save({activeInteraction:null});focus=value;update(getState());},setEnabled(value){enabled=value;update(getState());}};
    }
    global.RoomInteractions={mount};
})(window);
