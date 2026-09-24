// Offline transformation shared by trusted migration tooling and local snapshot loading.
const {isDeepStrictEqual}=require('node:util');
function migrate(source){
 const data=structuredClone(source),changed=[];let items=0;
 for(const [id,game]of Object.entries(data.games||{})){
  const legacy=Object.entries(game.players||{}).filter(([,p])=>Object.hasOwn(p,'inventory'));
  if(!legacy.length&&!Object.hasOwn(game.state||{},'itemAssignments'))continue;
  data.privateSessions||={};
  const target=data.privateSessions[id]||={schemaVersion:1,generation:game.privateGeneration||0,players:{},assignments:{}};
  if(target.schemaVersion!==1||target.generation!==(game.privateGeneration||0))throw Error('Unsupported private inventory version/generation in game '+id);
  target.players||={};target.assignments||={};
  for(const [uid,player]of legacy){
   const destination=target.players[uid]||={};destination.inventory||={};
   for(const [key,item]of Object.entries(player.inventory||{})){
    if(Object.hasOwn(destination.inventory,key)&&!isDeepStrictEqual(destination.inventory[key],item))throw Error('Conflicting inventory item in game '+id+', player '+uid+', item '+key);
    destination.inventory[key]=item;items++;
   }
   delete player.inventory;
  }
  for(const [set,assignments]of Object.entries(game.state?.itemAssignments||{})){
   const destination=target.assignments[set]||={};
   for(const [uid,item]of Object.entries(assignments)){
    if(Object.hasOwn(destination,uid)&&destination[uid]!==item)throw Error('Conflicting item assignment in game '+id);
    destination[uid]=item;
   }
  }
  if(game.state)delete game.state.itemAssignments;
  changed.push(id);
 }
 return {data,changed,items};
}
module.exports={migrate};
