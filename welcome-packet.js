(function (global) {
    'use strict';
    function text(value, max) { return typeof value === 'string' ? value.slice(0,max) : ''; }
    function clean(raw) {
        if (!raw || typeof raw !== 'object' || raw.version !== 1) return null;
        return {
            version:1,
            cocktailTime:/^([01]\d|2[0-3]):[0-5]\d$/.test(raw.cocktailTime) ? raw.cocktailTime : '',
            dinnerTime:/^([01]\d|2[0-3]):[0-5]\d$/.test(raw.dinnerTime) ? raw.dinnerTime : '',
            welcomeNote:text(raw.welcomeNote,1200),attire:text(raw.attire,300),foodNote:text(raw.foodNote,600),
            menu:(Array.isArray(raw.menu) ? raw.menu : []).slice(0,18).filter(item=>item && typeof item.name==='string' && item.name.trim()).map(item=>({id:text(item.id,80),name:text(item.name,80),description:text(item.description,200),alcoholFree:item.alcoholFree===true})),
            updatedAt:typeof raw.updatedAt==='number'?raw.updatedAt:0
        };
    }
    function formatTime(value) {
        if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(value || '')) return '';
        const [h,m]=value.split(':').map(Number);
        return (h%12 || 12)+':'+String(m).padStart(2,'0')+(h>=12?' PM':' AM');
    }
    function formatDate(value) {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(value || '')) return 'Date to come';
        const date=new Date(value+'T12:00:00');
        return Number.isNaN(date.getTime())?'Date to come':date.toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric',year:'numeric'});
    }
    function renderMenu(container, menu) {
        container.replaceChildren();
        if (!menu?.length) { const p=document.createElement('p');p.textContent='Your host will share the menu soon.';container.appendChild(p);return; }
        for (const alcoholFree of [false,true]) {
            const items=menu.filter(item=>item.alcoholFree===alcoholFree);
            if (!items.length) continue;
            const heading=document.createElement('h3');heading.className='menu-section-head';heading.textContent=alcoholFree?'Without spirits':'Cocktails';container.appendChild(heading);
            items.forEach(item=>{
                const row=document.createElement('div');row.className='menu-item';
                const name=document.createElement('div');name.className='menu-item-name';name.textContent=item.name;
                const description=document.createElement('div');description.className='menu-item-desc';description.textContent=item.description;
                row.append(name,description);container.appendChild(row);
            });
        }
    }
    global.WelcomePacket={get drinks(){return global.currentStoryPackage?.content?.preparation?.drinks || [];},clean,formatTime,formatDate,renderMenu};
})(window);
