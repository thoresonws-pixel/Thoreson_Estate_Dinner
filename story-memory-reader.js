/* Resolve only eligible private entries; never cache content across identities. */
(function(global){
'use strict';
async function hydrate(story){
 if(!global.firebase?.apps?.length||typeof global.firebase.auth!=='function')return story;
 const user=global.firebase?.auth().currentUser;if(!user||user.isAnonymous)return story;
 const db=firebase.database(),uid=user.uid;
 const gameId=(await db.ref('users/'+uid+'/currentGameId').once('value')).val();if(!gameId)return story;
 const game=(await db.ref('games/'+gameId).once('value')).val();if(!game||game.storyId!==story.id)return story;
 const characterId=game.players?.[uid]?.characterId,host=game.createdBy===uid;
 let developer=false;try{developer=user.emailVerified&&(await db.ref('developerAccess/'+uid+'/inspectAllCharacters').once('value')).val()===true;}catch(_){}
 if(!game.players?.[uid]&&!host&&!developer)return story;
 if(characterId){const claim=db.ref('characterClaims/'+gameId+'/'+uid);const existing=(await claim.once('value')).val();if(!existing)await claim.transaction(current=>current?undefined:characterId,undefined,false);}
 const grants=(await db.ref('memoryGrants/'+gameId).once('value')).val()||{};
 const work=[];
 function read(entry,owner,interaction){
  if(!entry?.privateTextId||(!host&&!developer&&owner!==characterId))return;
  if(!host&&grants[entry.privateTextId]?.generation!==(game.privateGeneration||0))return;
  work.push(db.ref('storyMemoryText/'+story.id+'/'+entry.privateTextId).once('value').then(s=>{if(firebase.auth().currentUser?.uid!==uid)return;const value=s.val();if(!value)throw Error('Private story text has not been published.');entry.text=value.text;}));
 }
 for(const [id,c]of Object.entries(story.content?.characters||{}))for(const field of ['memories','knowledge','canShare'])for(const e of c[field]||[])read(e,id);
 for(const item of story.experience?.interactions||[])read(item.memory,item.memory?.characterId,item.id);
 await Promise.all(work);return story;
}
global.StoryMemoryReader={hydrate};
})(window);
