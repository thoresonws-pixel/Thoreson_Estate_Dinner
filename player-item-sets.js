/* Story-owned item sets assigned to real session players, once per set. */
(function(global){
'use strict';
function allocate(current,players,set,generation=0){
 const next=structuredClone(current||{schemaVersion:1,generation,assignments:{},players:{}});
 if(next.schemaVersion!==1||next.generation!==generation)throw Error('Inventory state changed. Reopen the object to retry.');
 next.assignments||={};next.players||={};
 const assigned=next.assignments[set.id]||={};
 const used=new Set(Object.values(assigned));
 for(const uid of Object.keys(players||{}).sort()){
  let id=assigned[uid];
  if(!id){const item=set.items.find(i=>!used.has(i.id));if(!item)throw Error('No unassigned personal items remain.');id=item.id;assigned[uid]=id;used.add(id);}
  const item=set.items.find(i=>i.id===id);if(!item)throw Error('Personal item definition changed.');
  const player=next.players[uid]||={};player.inventory||={};player.inventory[id]||={...item,source:set.id};
 }
 return next;
}
async function ensure({db,gameId,uid,pack},setId){
 const set=pack.playerItemSets?.find(s=>s.id===setId);if(!set)throw Error('Unknown personal item set.');
 const game=(await db.ref('games/'+gameId).once('value')).val();
 if(!game||game.createdBy!==uid)throw Error('Only the session host can assign personal items.');
 const result=await db.ref('privateSessions/'+gameId).transaction(current=>allocate(current,game.players,set,game.privateGeneration||0),undefined,false);
 if(!result.committed)throw Error('Could not assign personal items.');
}
global.PlayerItemSets={allocate,ensure};if(typeof module!=='undefined')module.exports=global.PlayerItemSets;
})(typeof window!=='undefined'?window:globalThis);
