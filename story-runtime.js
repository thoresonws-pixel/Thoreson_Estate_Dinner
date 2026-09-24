(function(global){
'use strict';
async function load(id){const story=await StoryPackage.load(id);if(!story.experience)throw Error('This story has no experience flow.');return story.experience;}
function connect(db,id,p,onChange,onError=console.error){
 StoryPackage.validateExperience(p);
 let state=null,offset=0,loaded=false,disposed=false;
 const ref=db.ref('games/'+id+'/state/experience'),clockRef=db.ref('.info/serverTimeOffset');
 const now=()=>Date.now()+offset;
 function view(){const step=p.steps.find(s=>s.id===state?.stepId)||(!state?p.steps[0]:null);if(!step)throw Error('Saved step is missing from this story');if(state&&!Number.isFinite(state.startedAt))throw Error('Invalid saved step timestamp');const deadline=state&&step.durationSeconds?state.startedAt+step.durationSeconds*1000:null;return {state,step,deadline,remaining:deadline===null?null:Math.max(0,deadline-(state?.pausedAt??now())),expired:deadline!==null&&(state?.pausedAt??now())>=deadline};}
 const tick=()=>{if(!loaded||disposed)return;try{onChange(view());}catch(e){onError(e);}};
 const stateChanged=s=>{state=s.val();loaded=true;tick();};const clockChanged=s=>{offset=s.val()||0;tick();};
 ref.on('value',stateChanged,onError);clockRef.on('value',clockChanged,onError);const timer=setInterval(tick,500);
 return {view,async setPaused(paused){if(!loaded)return;const stepId=state?.stepId;await ref.transaction(old=>{if(!old||old.stepId!==stepId)return;if(paused){if(old.pausedAt!=null)return;return {...old,pausedAt:now()};}if(old.pausedAt==null)return;const next={...old,startedAt:old.startedAt+Math.max(0,now()-old.pausedAt)};delete next.pausedAt;return next;});},async ensureStarted(){if(!p.steps[0].durationSeconds)return;await ref.transaction(old=>old||{stepId:p.steps[0].id,startedAt:firebase.database.ServerValue.TIMESTAMP});},async advance(){if(!loaded)return false;const v=view();if(v.state?.pausedAt!=null||!v.step.next||(v.step.durationSeconds&&!v.state)||(v.deadline!==null&&!v.expired))return false;const result=await ref.transaction(old=>{if((old?.stepId||p.steps[0].id)!==v.step.id)return;if(old?.pausedAt!=null)return;if(v.step.durationSeconds&&(!old||now()<old.startedAt+v.step.durationSeconds*1000))return;return {stepId:v.step.next,startedAt:firebase.database.ServerValue.TIMESTAMP};});return result.committed;},dispose(){disposed=true;clearInterval(timer);ref.off('value',stateChanged);clockRef.off('value',clockChanged);}};
}
global.StoryRuntime={load,validate:p=>StoryPackage.validateExperience(p),connect};
})(window);
