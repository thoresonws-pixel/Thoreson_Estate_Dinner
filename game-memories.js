/* Shared progress gates for character memories, including developer observers. */
(function(global){
    'use strict';
    function triggers(game){
        const state=game.state||{},found=new Set();
        const add=value=>{if(Array.isArray(value))value.forEach(v=>{if(typeof v==='string')found.add(v);});else for(const [id,enabled]of Object.entries(value||{}))if(enabled)found.add(id);};
        add(state.activeItems);add(state.revealedItems);add(state.memoryTriggers);
        for(const [id,item]of Object.entries({...state.tv?.discoveries,...state.tv?.inventory})){found.add(id);if(item.source)found.add(item.source);}
        return found;
    }
    function entryUnlocked(entry,game,interactionId){
        if(entry.whenInspected||interactionId){const id=entry.whenInspected||interactionId;return !!game.state?.tv?.inspected?.[id]||game.state?.tv?.activeInteraction===id;}
        return !entry.unlockedBy||triggers(game).has(entry.unlockedBy);
    }
    function available(story,game,characterId,developer=false){
        const result=[],characters=story?.content?.characters||{};
        const expand=text=>String(text||'').replace(/\{\{([a-zA-Z0-9_]+)\}\}/g,(_,id)=>characters[id]?.name||id);
        for(const [id,character]of Object.entries(characters)){
            if(!developer&&id!==characterId)continue;
            for(const [index,entry]of (character.memories||[]).entries())if(entryUnlocked(entry,game))result.push({id:'character:'+id+':'+index,characterId:id,characterName:character.name||id,title:'Memory',text:expand(entry.text)});
        }
        for(const item of story?.experience?.interactions||[]){const entry=item.memory;if(!entry||(!developer&&entry.characterId!==characterId)||!entryUnlocked(entry,game,item.id))continue;
            result.push({id:'interaction:'+item.id,characterId:entry.characterId,characterName:characters[entry.characterId]?.name||entry.characterId,title:entry.title,text:expand(entry.text)});
        }
        return result;
    }
    function render(container,entries){
        const signature=JSON.stringify(entries);if(container._memorySignature===signature)return;container._memorySignature=signature;container.replaceChildren();
        for(const entry of entries){const card=document.createElement('details');card.style.cssText='padding:16px;margin:12px 0;border:1px solid #786733;border-radius:8px';const title=document.createElement('summary');title.textContent=entry.characterName+' · '+entry.title;const text=document.createElement('p');text.textContent=entry.text;card.append(title,text);container.append(card);}
        if(!entries.length){const text=document.createElement('p');text.textContent='Memories appear as the group discovers their triggers.';container.append(text);}
    }
    global.GameMemories={triggers,entryUnlocked,available,render};
})(window);
