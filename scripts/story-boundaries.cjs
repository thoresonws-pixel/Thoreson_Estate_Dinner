// Story definitions remain the source; published packages carry memory metadata only.
const fs=require('node:fs'),path=require('node:path');
function project(source){
 const story=structuredClone(source),memories={},policies={};
 function extract(entry,key,characterId,interactionId){
  if(!entry||typeof entry!=='object'||!entry.text)return;
  memories[key]={text:entry.text,characterId,whenInspected:entry.whenInspected||interactionId||'',unlockedBy:entry.unlockedBy||''};
  delete entry.text;entry.privateTextId=key;
 }
 for(const [id,c]of Object.entries(story.content?.characters||{})){
  for(const field of ['memories','knowledge','canShare'])for(const [index,e]of (c[field]||[]).entries())if(field==='memories'||e?.unlockedBy||e?.whenInspected)extract(e,id+'-'+field+'-'+index,id);
 }
 for(const item of story.experience?.interactions||[])extract(item.memory,'interaction-'+item.id,item.memory?.characterId,item.id);
 const exp=story.experience;
 for(const item of exp?.interactions||[]){
  if(!['poolShot','noteSequence'].includes(item.type))continue;
  const allowedSteps={};for(const [index,step]of exp.steps.entries()){
   const gates=[item,exp.map?.access?.[item.roomId]].filter(Boolean);
   if(step.type==='exploration'&&gates.every(g=>!Object.hasOwn(g,'unlockAtStep')||(g.unlockAtStep&&index>=exp.steps.findIndex(s=>s.id===g.unlockAtStep))))allowedSteps[step.id]=true;
  }
  const policy={kind:item.type,roomId:item.roomId,allowedSteps};
  if(item.type==='poolShot'){
   const p=item.letterPuzzle;policy.sequence=p?[...p.word].map(l=>Object.entries(p.pockets).find(([,letters])=>letters.split(' ').includes(l))[0]):item.shots.map(s=>s.pocket);
   policy.length=policy.sequence.length;policy.proof=policy.sequence.join('>');policy.requiredItem=p?.itemId||'';
  }else{policy.pages={};for(const collection of exp.collections||[])if(collection.playInteraction===item.id)for(const page of collection.pages||[])policy.pages[page.id]={bookletId:collection.reward.id,requiresInventory:page.requiresInventory||''};}
  policies[item.id]=policy;
 }
 return {story,memories,policies};
}
function catalog(root){
 const result={};
 for(const dir of fs.readdirSync(path.join(root,'stories'))){const file=path.join(root,'stories',dir,'package.json');if(!fs.existsSync(file))continue;const p=JSON.parse(fs.readFileSync(file));if(p.experienceFile)p.experience=JSON.parse(fs.readFileSync(path.join(path.dirname(file),p.experienceFile)));result[p.id]=project(p);}
 return result;
}
function publish(root,out){
 for(const [id,{story}]of Object.entries(catalog(root))){const p=structuredClone(story),exp=p.experience;delete p.experience;fs.writeFileSync(path.join(out,'stories',id,'package.json'),JSON.stringify(p));if(p.experienceFile)fs.writeFileSync(path.join(out,'stories',id,p.experienceFile),JSON.stringify(exp));}
}
module.exports={project,catalog,publish};
