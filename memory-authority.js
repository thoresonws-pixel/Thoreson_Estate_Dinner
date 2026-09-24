/* The host releases story-authored memories. No private text enters shared game state. */
(function(global){
'use strict';
function eligible(story,game){
 const found=new Set();
 for(const field of ['activeItems','revealedItems','memoryTriggers']){const values=game.state?.[field]||{};for(const [key,value]of Object.entries(values))if(value)found.add(Array.isArray(values)?value:key);}
 for(const [key,value]of Object.entries({...game.state?.tv?.discoveries,...game.state?.tv?.inventory})){found.add(key);if(value.source)found.add(value.source);}
 const result={};
 function consider(entry,characterId,interaction){
  if(!entry?.privateTextId)return;
  const inspected=entry.whenInspected||interaction;
  if(inspected?!game.state?.tv?.inspected?.[inspected]:entry.unlockedBy&&!found.has(entry.unlockedBy))return;
  result[entry.privateTextId]={characterId,generation:game.privateGeneration||0};
 }
 for(const [id,c]of Object.entries(story.content?.characters||{}))for(const field of ['memories','knowledge','canShare'])for(const entry of c[field]||[])consider(entry,id);
 for(const item of story.experience?.interactions||[])consider(item.memory,item.memory?.characterId,item.id);
 return result;
}
function mount(db,gameId,uid,story,onError=console.error){
 const ref=db.ref('games/'+gameId),grants=db.ref('memoryGrants/'+gameId);let stopped=false;
 const update=async snap=>{const game=snap.val();if(stopped||game?.createdBy!==uid)return;const desired=eligible(story,game);if(!Object.keys(desired).length)return;try{await grants.transaction(current=>{if(stopped)return;const next={...current,...desired};return JSON.stringify(next)===JSON.stringify(current)?undefined:next;},undefined,false);}catch(e){if(!stopped)onError(e);}};
 ref.on('value',update,onError);return ()=>{stopped=true;ref.off('value',update);};
}
const api={eligible,mount};global.MemoryAuthority=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
