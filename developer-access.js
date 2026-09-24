/* Capabilities are provisioned by the project administrator, never by a player profile. */
(function(global){
    'use strict';
    function watch(user,change){
        change(false);
        if(!user||user.isAnonymous||!user.emailVerified)return ()=>{};
        const ref=firebase.database().ref('developerAccess/'+user.uid);
        const updated=snapshot=>change(snapshot.val()?.inspectAllCharacters===true);
        ref.on('value',updated,()=>change(false));
        return ()=>ref.off('value',updated);
    }
    function render(container,story,enabled,game={}){
        if(!container)return;
        const available=GameMemories.available(story,game,null,true);
        const signature=JSON.stringify([enabled,story?.id,story?.content?.characters,available,[...GameMemories.triggers(game)]]);
        if(container._developerSignature===signature)return;container._developerSignature=signature;container.replaceChildren();
        if(!enabled||!story)return;
        const make=(tag,text)=>{const el=document.createElement(tag);el.textContent=text;return el;};
        const characters=story.content?.characters||{};
        const expand=text=>String(text||'').replace(/\{\{([a-zA-Z0-9_]+)\}\}/g,(_,id)=>characters[id]?.name||id);
        container.append(make('h2','Developer access · All characters'),make('p','You can inspect each character’s available information here. Memories and gated knowledge appear only as the game unlocks them. Your selected player character is unchanged.'));
        for(const [id,character]of Object.entries(characters)){
            const card=document.createElement('details');card.dataset.characterId=id;card.style.cssText='margin:14px 0;padding:16px;border:1px solid #c9a227;border-radius:8px';
            card.append(make('summary',character.name||id));
            if(character.backstory)card.append(make('h3','Backstory'),make('p',expand(character.backstory)));
            for(const [field,title]of [['knowledge','Knowledge'],['canShare','Information to share']]){
                if(!Array.isArray(character[field])||!character[field].length)continue;
                card.append(make('h3',title));
                for(const entry of character[field]){if(typeof entry!=='string'&&!GameMemories.entryUnlocked(entry,game))continue;card.append(make('p',expand(typeof entry==='string'?entry:entry.text)));}
            }
            for(const entry of available.filter(m=>m.characterId===id))card.append(make('h3',entry.title),make('p',entry.text));
            container.append(card);
        }
    }
    function canAct(item,characterId,developer){return !item.characterIds?.length||item.characterIds.includes(characterId)||developer===true;}
    global.DeveloperAccess={watch,render,canAct};
})(window);
