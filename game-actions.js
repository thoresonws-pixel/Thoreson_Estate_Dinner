/* Idempotent pool completion. Firebase rules validate identity, context and proof. */
(function(global){
'use strict';
async function completePool({db,gameId,uid,item,generation,revision,proof}){
 if(!(await db.ref('.info/connected').once('value')).val())throw Error('Reconnect before saving your result.');
 const ref=db.ref('actionReceipts/'+gameId+'/'+item.id);
 await ref.transaction(current=>{
  if(current?.generation===generation)return;
  return {uid,generation,revision,proof:proof.join('>'),solvedAt:firebase.database.ServerValue.TIMESTAMP};
 },undefined,false);
 // Read the committed server timestamp, not the local timestamp estimate in a transaction snapshot.
 const receipt=(await ref.get()).val();
 if(receipt?.generation!==generation)throw Error('The game changed. Start a new attempt.');
 const gameRef=db.ref('games/'+gameId);
 const keep=()=>{};gameRef.on('value',keep);
 try{
 await gameRef.once('value');
 const saved=await gameRef.transaction(game=>{
  if(!game||(game.privateGeneration||0)!==generation)return;
  game.state||={};game.state.tv||={};game.state.tv.puzzles||={};
  if(game.state.tv.puzzles[item.id]?.solved)return;
  game.state.tv.puzzles[item.id]={solved:true,solvedAt:receipt.solvedAt,solvedBy:receipt.uid};return game;
 },undefined,false);
 if(!saved.committed&&!saved.snapshot.val()?.state?.tv?.puzzles?.[item.id]?.solved)throw Error('Could not show the result. Retry saving when connected.');
 }finally{gameRef.off('value',keep);}
}
global.GameActions={completePool};
})(window);
