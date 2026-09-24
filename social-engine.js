(function(global){
'use strict';
async function distribute(db,gameId,story,phase,players){
 const data=StoryContent.assignments(story,phase,players), fields=story.compatibility?.social||{}, writes={};
 for(const [uid,value]of Object.entries(data)){
  if(phase.onStart?.distributeFacts)writes['games/'+gameId+'/players/'+uid+'/'+(fields.factsField||'socialFacts')]=value.facts;
  if(phase.onStart?.distributeQuests)writes['games/'+gameId+'/players/'+uid+'/'+(fields.questsField||'socialQuests')]=value.quests;
 }
 if(Object.keys(writes).length)await db.ref().update(writes);
}
async function fire(db,gameId,story,event){
 const base='games/'+gameId+'/state/';
 if(event.action==='quiz')await db.ref(base+(story.compatibility?.social?.quizField||'socialQuiz')).set({active:true,firedAt:Date.now()});
 if(event.action==='reveal'&&event.item)await db.ref(base+'activeItems').transaction(old=>[...new Set([...(old||[]),event.item])]);
 if(event.screen)await db.ref(base+'bigScreen').set({mode:event.screen,manual:false,updatedAt:new Date().toISOString()});
}
function schedule(db,gameId,story,state,onError=console.error){
 const phase=story.content.flow?.phases?.find(p=>p.id===state?.id),timers=[];
 if(!phase)return ()=>{};
 const start=typeof state.startedAt==='number'?state.startedAt:Date.parse(state.startedAt);
 if(!Number.isFinite(start))return ()=>{};
 let disposed=false;
 const tasks=(phase.social?.schedule||[]).flatMap((event,index)=>[{...event,id:String(index)},...(event.returnAfterSeconds&&event.returnScreen?[{id:index+'-return',afterSeconds:event.afterSeconds+event.returnAfterSeconds,screen:event.returnScreen}]:[])]);
 for(const event of tasks){const timer=setTimeout(async()=>{try{if(disposed)return;const current=(await db.ref('games/'+gameId+'/state/currentPhase').once('value')).val();if(current?.id!==state.id||current.startedAt!==state.startedAt)return;const key='games/'+gameId+'/state/phaseEvents/'+phase.id+'/'+start+'/'+event.id;const claim=await db.ref(key).transaction(old=>old?undefined:true);if(claim.committed)try{await fire(db,gameId,story,event);}catch(e){await db.ref(key).remove();throw e;}}catch(e){onError(e);}},Math.max(0,start+event.afterSeconds*1000-Date.now()));timers.push(timer);}
 return ()=>{disposed=true;timers.forEach(clearTimeout);};
}
global.SocialEngine={distribute,fire,schedule};
})(window);
