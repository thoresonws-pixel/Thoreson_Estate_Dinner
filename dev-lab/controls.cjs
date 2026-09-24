// Development-only transformations; all step IDs and transitions come from the story.
function changeGame(game, experience, players, action, stepId, now=Date.now()) {
 const current=experience.steps.find(s=>s.id===game.state?.experience?.stepId);
 const target=action==='reset'?experience.steps[0]:action==='advance'?experience.steps.find(s=>s.id===current?.next):experience.steps.find(s=>s.id===stepId);
 if(!['reset','advance','jump'].includes(action)||!target)throw Error('Choose a valid story step; this step may have no next step.');
 const next=structuredClone(game);
 if(action==='reset') {
  next.players=Object.fromEntries(players.map(p=>[p.uid,{characterId:p.characterId,characterName:p.name,displayName:p.name,status:'ready',joinedAt:now,questionnaireComplete:true,waiverSigned:true}]));
  next.state={};
  // Retain session metadata, not legacy progress outside state.
  for(const key of Object.keys(next))if(!['storyId','storyName','partyName','partyCode','createdBy','createdAt','status','gameMode','unlockId','players','state'].includes(key))delete next[key];
 }
 next.state||={};next.state.experience={stepId:target.id,startedAt:now};
 next.state.tv||={};delete next.state.tv.activeInteraction;delete next.state.tv.phoneActionRequest;delete next.state.tv.songSelection;
 return next;
}
module.exports={changeGame};
