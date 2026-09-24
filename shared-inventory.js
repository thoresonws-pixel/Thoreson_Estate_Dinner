/* Inventory contains collected objects. Evidence is a property, not a second bag. */
(function(global){
    'use strict';
    let bookletActions=null;
    function refreshBookletActions(){for(const button of document.querySelectorAll('[data-booklet-play]')){const state=bookletActions?.available(button.dataset.bookletPlay);button.disabled=button.dataset.saving==='true'||!state?.enabled;button.textContent=state?.label||'Play this song';}}
    function renderBooklet(container,pages,itemId){
        if(!pages?.length)return;
        const make=(tag,text)=>{const el=document.createElement(tag);el.textContent=text;return el;};
        const book=make('div',''),sheet=make('div',''),controls=make('div','');
        book.setAttribute('aria-label','Booklet');book.style.cssText='padding:16px;border:1px solid #b49a60;border-radius:8px;touch-action:pan-y';
        sheet.style.cssText='min-height:180px;white-space:pre-wrap;line-height:1.8';sheet.setAttribute('aria-live','polite');
        const previous=make('button','Previous song'),next=make('button','Next song'),count=make('span','');
        for(const button of [previous,next]){button.type='button';button.style.cssText='min-height:48px;padding:10px 16px;margin:6px';}
        let index=0,start=null;
        const draw=()=>{const page=pages[index];sheet.replaceChildren(make('h3',page.title),make('p',page.text));count.textContent=(index+1)+' / '+pages.length;previous.disabled=index===0;next.disabled=index===pages.length-1;};
        const move=delta=>{index=Math.max(0,Math.min(pages.length-1,index+delta));draw();};
        previous.onclick=()=>move(-1);next.onclick=()=>move(1);
        book.addEventListener('touchstart',e=>{const t=e.touches[0];start={x:t.clientX,y:t.clientY};},{passive:true});
        book.addEventListener('touchend',e=>{if(!start)return;const t=e.changedTouches[0],dx=t.clientX-start.x,dy=t.clientY-start.y;start=null;if(Math.abs(dx)>50&&Math.abs(dx)>Math.abs(dy))move(dx<0?1:-1);},{passive:true});
        controls.append(previous,count,next);book.append(sheet,controls);container.append(book);draw();
        if(bookletActions&&itemId){const play=make('button','Play this song'),status=make('p','');status.setAttribute('role','status');play.type='button';play.dataset.bookletPlay=itemId;play.style.cssText='display:block;width:100%;min-height:64px;font-size:21px;padding:16px;margin-top:14px;background:#c9a227;color:#14101c;border-radius:8px';play.onclick=async()=>{play.dataset.saving='true';refreshBookletActions();try{status.textContent=await bookletActions.play(itemId,pages[index].id);}catch(e){status.textContent=e.message;}finally{delete play.dataset.saving;refreshBookletActions();}};book.append(play,status);refreshBookletActions();}
    }
    function entries(state={},pack={}){
        const definitions=new Map([...(pack.interactions||[]),...(pack.collections||[])].map(i=>[i.reward?.id,i]));
        const result={};
        // Read older evidence records without treating puzzle unlock notices as objects.
        for(const [id,entry] of Object.entries(state.discoveries||{})){
            const def=definitions.get(id);
            if(def?.type==='evidence'||def?.isEvidence===true||entry.kind==='evidence')result[id]={...entry,isEvidence:true};
        }
        for(const [id,entry] of Object.entries(state.inventory||{}))result[id]={...result[id],...entry};
        const collected=new Set(Object.keys(result));
        for(const collection of pack.collections||[])if(collection.pages.some(page=>collected.has(page.requiresInventory)))result[collection.reward.id]={...collection.reward,kind:collection.itemKind||'booklet'};
        return Object.entries(result).map(([id,entry])=>{
            const def=definitions.get(id);
            return {...entry,id,name:entry.name||def?.reward?.name||'Collected item',text:entry.text??def?.reward?.text??'',
                pages:(def?.pages||entry.pages)?.filter(page=>!page.requiresInventory||collected.has(page.requiresInventory)),kind:entry.kind==='evidence'?'document':entry.kind==='inventory'?(def?.itemKind||'item'):entry.kind||def?.itemKind||'item',
                isPuzzleItem:def?.isPuzzleItem===true||entry.isPuzzleItem===true,
                isEvidence:entry.isEvidence===true||entry.kind==='evidence'||def?.isEvidence===true||def?.type==='evidence'};
        });
    }
    function render(container,state,pack,{title='Group inventory',evidenceOnly=false,puzzleOnly=false}={}){
        if(!container)return;
        const all=entries(state,pack),signature=JSON.stringify([all,evidenceOnly,puzzleOnly,title]);
        if(container._inventorySignature===signature)return;container._inventorySignature=signature;
        const expanded=new Set([...container.querySelectorAll('details[open]')].map(d=>d.dataset.itemId));
        const make=(tag,text)=>{const el=document.createElement(tag);el.textContent=text;return el;};
        const heading=make('h2',title),body=document.createElement('div');
        container.replaceChildren(heading);
        const draw=filter=>{
            container._inventoryFilter=filter;body.replaceChildren();
            const grouped=new Set((pack.collections||[]).flatMap(c=>c.pages.map(p=>p.requiresInventory)));
            const visible=filter==='evidence'?all.filter(i=>i.isEvidence):all.filter(i=>!grouped.has(i.id)&&(!puzzleOnly||!i.isEvidence||i.isPuzzleItem));
            if(!visible.length)body.append(make('p',filter==='evidence'?'No evidence collected yet.':'No items collected yet.'));
            for(const item of visible){
                const card=document.createElement('details');card.dataset.itemId=item.id;card.open=expanded.has(item.id);card.style.cssText='margin:12px 0;padding:16px;border:1px solid #786733;border-radius:8px';
                const label=make('summary',item.name);label.style.cssText='cursor:pointer;font-size:18px';
                const content=make('p',item.text);content.style.cssText='white-space:pre-wrap;line-height:1.65;font-size:17px';
                card.append(label,make('p',item.isEvidence?'Evidence · '+item.kind:'Item · '+item.kind),content);body.append(card);
                renderBooklet(card,item.pages,item.id);
            }
        };
        if(!evidenceOnly&&!puzzleOnly){const controls=document.createElement('div');
            for(const [value,label]of [['all','All items'],['evidence','Evidence']]){const button=make('button',label);button.type='button';button.style.cssText='margin:4px;padding:10px 16px';button.onclick=()=>{draw(value);for(const b of controls.children)b.setAttribute('aria-pressed',String(b===button));};button.setAttribute('aria-pressed',String((container._inventoryFilter||'all')===value));controls.append(button);}container.append(controls);
        }
        container.append(body);draw(evidenceOnly?'evidence':puzzleOnly?'all':container._inventoryFilter||'all');
    }
    global.SharedInventory={entries,render,renderBooklet,refreshBookletActions,setBookletActions(value){bookletActions=value;}};
})(window);
