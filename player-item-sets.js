/* Story-owned item sets assigned to real session players, once per set. */
(function(global){
'use strict';
function allocate(game,set){
 const players=Object.keys(game.players||{}).sort();if(players.length>set.items.length)throw Error('Not enough personal items in this story set.');
 game.state||={};game.state.itemAssignments||={};const assigned=game.state.itemAssignments[set.id]||={};
 // Preserve previous assignments, including those belonging to temporarily absent players.
 const used=new Set(Object.values(assigned));
 for(const uid of players){let id=assigned[uid];if(!id){const next=set.items.find(i=>!used.has(i.id));if(!next)throw Error('No unassigned personal items remain.');id=next.id;assigned[uid]=id;used.add(id);}const item=set.items.find(i=>i.id===id);if(!item)throw Error('Personal item definition changed.');game.players[uid].inventory||={};game.players[uid].inventory[id]||={...item,source:set.id};}
 return game;
}
async function ensure({db,gameId,uid,pack},setId){const set=pack.playerItemSets?.find(s=>s.id===setId);if(!set)throw Error('Unknown personal item set.');const ref=db.ref('games/'+gameId),keep=()=>{};ref.on('value',keep);try{await ref.once('value');const result=await ref.transaction(game=>{if(!game||game.createdBy!==uid)return;return allocate(game,set);});if(!result.committed)throw Error('Could not assign personal items.');}finally{ref.off('value',keep);}}
global.PlayerItemSets={allocate,ensure};
})(typeof window!=='undefined'?window:globalThis);
