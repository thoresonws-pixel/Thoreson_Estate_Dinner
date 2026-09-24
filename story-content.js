(function(global){
'use strict';
function decodeScan(story,text){
 const scans=story.content?.scans||{};
 for(const prefix of [...(scans.skillPrefixes||[]),"STORY:"+story.id+":"])if(text.startsWith(prefix)){const id=text.slice(prefix.length);if(!story.content.skills?.[id])throw Error('Unknown skill document.');return {type:'skill',id};}
 let url;try{url=new URL(text,location.origin);}catch(e){throw Error('Unrecognized code.');}
 const explicit=url.searchParams.get('story');if(explicit&&explicit!==story.id)throw Error('This code belongs to a different story.');
 const route=url.pathname.split('/').pop(),key=url.searchParams.get('item')||url.searchParams.get('id')||'';
 const entry=scans.routes?.[route]?.[key];if(entry)return {...entry,id:entry.id||key};
 if(['scan.html','clue.html'].includes(route)){const item=story.content.items?.find(i=>i.id===key);if(item)return {type:'item',id:item.id,item};}
 throw Error('This code is not part of this story.');
}
function roleOptions(story){return Object.values(story.content?.roles?.priorities||{}).map(r=>({id:r.label,label:r.displayName||r.label,description:r.description||'',color:r.color||''}));}
function assignments(story,phase,players){
 const config=phase.social||{},chars=story.content.characters||{},byChar=Object.fromEntries(Object.entries(players).filter(([,p])=>p.characterId).map(([uid,p])=>[p.characterId,uid]));
 const out=Object.fromEntries(Object.values(byChar).map(uid=>[uid,{facts:[],quests:[]} ]));
 const name=id=>{const c=chars[id];return c?.nameVariants?.[players[byChar[id]]?.questionnaire?.gender]||c?.nameVariants?.female||c?.name||id;};
 const resolve=text=>String(text||'').replace(/\{\{([^}]+)\}\}/g,(_,id)=>name(id));
 if(phase.onStart?.distributeFacts){const source=config.facts?story.content.factSets?.[config.facts]||[]:story.content.facts||[];for(const fact of source){const candidates=[fact.preferredChar,...(fact.fallbacks||[])].map(c=>byChar[c]).filter(Boolean);const uid=candidates.find(u=>!out[u].facts.length)||Object.keys(out).find(u=>!out[u].facts.length);if(uid)out[uid].facts.push({id:fact.id,text:resolve(fact.text)});}}
 if(phase.onStart?.distributeQuests){for(const q of story.content.quests?.[config.questSet||phase.id]||[]){if(!(q.requires||[]).every(c=>byChar[c]))continue;for(const c of q.giveTo||[]){const uid=byChar[c];if(uid)out[uid].quests.push({id:q.id,text:resolve(q.text),type:q.type||'social',completed:false});}}}
 return out;
}
global.StoryContent={decodeScan,roleOptions,assignments};
})(window);
