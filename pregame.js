(function(global){
    'use strict';
    let db,gameId,game,players={},invites={},packet=null,dirty=false;
    const el=id=>document.getElementById(id);
    const email=value=>String(value || '').trim().toLowerCase();
    function node(tag,text,className){const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(className)n.className=className;return n;}
    const inviteUrl=()=>location.origin+'/invite.html?code='+encodeURIComponent(game.partyCode);
    const welcomeUrl=()=>location.origin+'/welcome.html?code='+encodeURIComponent(game.partyCode);
    function status(message){el('invitationStatus').textContent=message;}
    async function copy(text){try{await navigator.clipboard.writeText(text);status('Copied. Paste it into your message to guests.');}catch(err){window.prompt('Copy this message:',text);}}
    function tasks(player){if(!player)return ['join the game'];const out=[];if(!player.questionnaire)out.push('complete the questionnaire');if(!player.characterId)out.push('choose a character');return out;}
    function message(player){const missing=tasks(player);return ["You're invited to "+(game.partyName || game.storyName)+'.',WelcomePacket.formatDate(game.eventDate),game.venueName || '', '',missing.length?'Before the party, please '+missing.join(' and ')+'.':'Your character is ready. We look forward to seeing you.',inviteUrl(),'',packet?'Your welcome packet, party plans and dress suggestions: '+welcomeUrl():'Bring a charged phone for your private character information.'].filter(Boolean).join('\n');}
    function draft(to,player){location.href='mailto:'+encodeURIComponent(to || '')+'?subject='+encodeURIComponent((player?'A quick reminder — ':'Invitation — ')+(game.partyName || game.storyName))+'&body='+encodeURIComponent(message(player));status('Email draft opened. Send it in your email app, then mark the invitation sent.');}
    function action(text,fn){const b=node('button',text,'party-small-btn');b.type='button';b.onclick=fn;return b;}
    function updatePlayers(next){players=next || {};if(el('plannedGuests'))renderGuests();}
    function renderGuests(){
        const joined=Object.values(players),completed=joined.filter(p=>!tasks(p).length);
        const planned=Object.entries(invites),waiting=planned.filter(([,i])=>!players[i.playerUid]&&!joined.some(p=>email(p.email)===email(i.email)));
        const summary=el('invitationProgress');summary.replaceChildren();
        for(const text of [planned.filter(([,i])=>i.sentAt).length+' / '+planned.length+' invitations marked sent',joined.length+' joined',joined.filter(p=>p.questionnaire).length+' / '+joined.length+' questionnaires',joined.filter(p=>p.characterId).length+' / '+joined.length+' characters',completed.length+' ready'])summary.appendChild(node('span',text));
        const list=el('plannedGuests');list.replaceChildren();const matched=new Set();
        const rows=planned.map(([id,invite])=>{const entry=Object.entries(players).find(([uid,p])=>invite.playerUid?uid===invite.playerUid:email(p.email)===email(invite.email));if(entry)matched.add(entry[0]);return {id,invite,player:entry?.[1]};});
        for(const [uid,player] of Object.entries(players))if(!matched.has(uid))rows.push({player});
        if(!rows.length){list.appendChild(node('p','Add the people you plan to invite, or share the invitation link. Joined players appear here automatically.','party-description'));}
        for(const {id,invite,player} of rows){
            const row=node('div',undefined,'party-guest'),top=node('div',undefined,'party-guest-top'),identity=node('div');
            identity.append(node('strong',player?.displayName || invite?.name || 'Guest'),node('div',player?.email || invite?.email || '', 'party-guest-email'));top.append(identity);row.append(top);
            const badges=node('div',undefined,'party-badges');
            for(const [label,done] of [['Invitation sent',!!invite?.sentAt || !!player],['Joined',!!player],['Questionnaire',!!player?.questionnaire],['Character chosen',!!player?.characterId]])badges.append(node('span',(done?'✓ ':'○ ')+label,'party-badge '+(done?'done':'pending')));
            row.append(badges);
            const actions=node('div',undefined,'party-actions');
            if(id&&joined.length){const label=node('label','Match joined player: '),select=node('select');select.setAttribute('aria-label','Match joined player for '+invite.name);const empty=node('option','Not matched');empty.value='';select.append(empty);for(const [uid,p] of Object.entries(players)){const option=node('option',p.displayName || 'Guest');option.value=uid;option.selected=players[uid]===player;select.append(option);}select.onchange=async()=>{try{await db.ref('hostInvitations/'+gameId+'/'+id+'/playerUid').set(select.value || null);}catch(err){status('Could not save the player match.');}};label.append(select);actions.append(label);}
            if(tasks(player).length){actions.append(action(player?'Draft reminder':'Draft invitation',()=>draft(player?.email || invite?.email,player)),action(player?'Copy reminder':'Copy invitation',()=>copy(message(player))));}
            if(id&&!invite.sentAt)actions.append(action('Mark invitation sent',async()=>{try{await db.ref('hostInvitations/'+gameId+'/'+id+'/sentAt').set(Date.now());status('Invitation marked sent.');}catch(err){status('Could not update the invitation. Please try again.');}}));
            if(id)actions.append(action('Remove from invite plan',async()=>{if(!confirm('Remove this planned invitation? Joined players will stay in the game.'))return;try{await db.ref('hostInvitations/'+gameId+'/'+id).remove();}catch(err){status('Could not remove this invitation.');}}));
            row.append(actions);list.append(row);
        }
        el('readinessNote').textContent=waiting.length?waiting.length+' invited '+(waiting.length===1?'person has':'people have')+' not joined yet.':joined.length===0?'Waiting for your first player.':completed.length===joined.length?'Everyone who joined has completed the questionnaire and chosen a character.':(joined.length-completed.length)+' joined '+(joined.length-completed.length===1?'player still needs':'players still need')+' to finish setup. Use the reminders below.';
    }
    async function addInvite(event){
        event.preventDefault();const name=el('plannedName').value.trim(),address=email(el('plannedEmail').value);
        if(!name||!address||!el('plannedEmail').checkValidity())return el('plannedEmail').reportValidity();
        if(Object.values(invites).some(i=>email(i.email)===address)){status('That email is already on your invite plan.');return;}
        if(Object.keys(invites).length>=40){status('This invite plan supports up to 40 guests.');return;}
        const button=el('addPlannedGuest');button.disabled=true;
        try{await db.ref('hostInvitations/'+gameId).push({name,email:address,addedAt:Date.now()});el('plannedName').value='';el('plannedEmail').value='';status('Guest added. Draft or copy their invitation below.');}
        catch(err){status('Could not save the guest. Please try again.');}finally{button.disabled=false;}
    }
    function buildEditor(){
        const holder=el('drinkChoices');holder.replaceChildren();
        for(const drink of WelcomePacket.drinks){
            const card=node('div',undefined,'party-drink'),label=node('label'),check=node('input');check.type='checkbox';check.value=drink.id;check.name='selectedDrink';check.id='drink-'+drink.id;
            label.append(check,node('span',drink.name+(drink.alcoholFree?' · Alcohol-free':'')));card.append(label,node('p',drink.description));
            const details=node('details'),summary=node('summary','How to serve');details.append(summary,node('p',drink.recipe));
            if(drink.source){const link=node('a','Recipe reference');link.href=drink.source;link.target='_blank';link.rel='noopener noreferrer';details.append(link);}card.append(details);holder.append(card);
        }
        el('welcomeEditor').addEventListener('input',()=>{dirty=true;el('packetSaveStatus').textContent='Unsaved changes. Save to update the guest welcome packet.';});
        el('welcomeEditor').addEventListener('submit',savePacket);
        el('useSuggestedMenu').onclick=()=>{for(const check of document.querySelectorAll('[name=selectedDrink]'))check.checked=(currentStoryPackage.content.preparation?.suggestedMenu || []).includes(check.value);dirty=true;el('packetSaveStatus').textContent='Suggested menu selected. Adjust it, then save.';};
        el('attirePreset').onchange=()=>{if(el('attirePreset').value){el('packetAttire').value=el('attirePreset').value;dirty=true;}};
    }
    function fillEditor(){
        el('packetCocktail').value=packet?.cocktailTime || game.eventTime || '';
        el('packetDinner').value=packet?.dinnerTime || '';
        el('packetWelcome').value=packet?.welcomeNote || currentStoryPackage.content.preparation?.welcomeNote || '';
        el('packetAttire').value=packet?.attire || currentStoryPackage.content.preparation?.attire || '';
        el('packetFood').value=packet?.foodNote || '';
        for(const check of document.querySelectorAll('[name=selectedDrink]'))check.checked=!!packet?.menu.some(item=>item.id===check.value);
        el('customSpirits').value=(packet?.menu || []).filter(i=>!WelcomePacket.drinks.some(d=>d.id===i.id)&&!i.alcoholFree).map(i=>i.name+' | '+i.description).join('\n');
        el('customAlcoholFree').value=(packet?.menu || []).filter(i=>!WelcomePacket.drinks.some(d=>d.id===i.id)&&i.alcoholFree).map(i=>i.name+' | '+i.description).join('\n');
        el('packetSaveStatus').textContent=packet?'Saved welcome packet is available to your guests.':'Choose your plans, then save to share them with guests.';
    }
    function customMenu(id,alcoholFree){return el(id).value.split('\n').map(s=>s.trim()).filter(Boolean).map((line,index)=>{const [name,...rest]=line.split('|');if(!name.trim()||name.trim().length>80||rest.join('|').trim().length>200)throw Error('Custom menu items need a name of up to 80 characters and a description of up to 200.');return {id:'custom-'+id+'-'+index,name:name.trim(),description:rest.join('|').trim(),alcoholFree};});}
    async function savePacket(event){
        event.preventDefault();const button=el('saveWelcomePacket');button.disabled=true;
        try{
            const menu=[...document.querySelectorAll('[name=selectedDrink]:checked')].map(check=>{const d=WelcomePacket.drinks.find(d=>d.id===check.value);return {id:d.id,name:d.name,description:d.description,alcoholFree:d.alcoholFree};}).concat(customMenu('customSpirits',false),customMenu('customAlcoholFree',true));
            if(menu.length>18)throw Error('Choose up to 18 menu items.');
            const raw={version:1,cocktailTime:el('packetCocktail').value,dinnerTime:el('packetDinner').value,welcomeNote:el('packetWelcome').value.trim(),attire:el('packetAttire').value.trim(),foodNote:el('packetFood').value.trim(),menu,updatedAt:Date.now()};
            const next=WelcomePacket.clean(raw);
            const base='partyCodeIndex/'+game.partyCode;
            await db.ref().update({['games/'+gameId+'/welcomePacket']:next,[base+'/welcomePacket']:next,[base+'/gameId']:gameId,[base+'/storyId']:game.storyId,[base+'/storyName']:game.storyName,[base+'/partyName']:game.partyName || null,[base+'/eventDate']:game.eventDate || null,[base+'/eventTime']:game.eventTime || null,[base+'/venueName']:game.venueName || null,[base+'/venueAddress']:game.venueAddress || null});
            packet=next;dirty=false;el('packetSaveStatus').textContent='Saved. Your invitation and welcome packet now show these plans.';renderGuests();
        }catch(err){el('packetSaveStatus').textContent=err.message || 'Could not save. Your changes are still here; please try again.';}finally{button.disabled=false;}
    }
    function mount(options){
        db=options.db;gameId=options.gameId;game=options.game;players=options.players || {};packet=WelcomePacket.clean(game.welcomePacket);
        const root=el('partyPlanning');
        root.innerHTML=`
        <section class="party-section" aria-labelledby="invitePlanTitle">
          <h2 id="invitePlanTitle">1. Invite your guests &amp; get everyone ready</h2>
          <p class="party-description">Add the people you plan to invite. Match each invitation to its joined player when they arrive in the list. Their questionnaire and character progress then updates automatically.</p>
          <div class="party-actions"><button type="button" class="btn-gold" id="copyPartyInvite">Copy invitation link</button><button type="button" class="btn-ghost" id="draftGeneralInvite">Draft invitation email</button></div>
          <form id="invitePlanForm" class="party-form-grid"><div class="party-field"><label for="plannedName">Guest name</label><input id="plannedName" maxlength="100" required autocomplete="off"></div><div class="party-field"><label for="plannedEmail">Guest email</label><input id="plannedEmail" type="email" maxlength="254" required autocomplete="off"></div><div class="party-actions"><button id="addPlannedGuest" class="btn-gold" type="submit">Add to invite plan</button></div></form>
          <p class="party-status">Email buttons open a draft in your email app. Mark an invitation sent after sending; delivery is not tracked.</p>
          <p class="party-status" id="invitationStatus" role="status"></p><div class="party-progress" id="invitationProgress"></div><p class="party-description" id="readinessNote"></p><div id="plannedGuests"></div>
        </section>
        <section class="party-section" aria-labelledby="packetTitle"><h2 id="packetTitle">2. Plan your gathering &amp; welcome packet</h2>
          <p class="party-description">Give guests a reason to arrive early, meet each other, and get into character. These plans appear on their invitation and in a printable welcome packet after you save.</p>
          <form id="welcomeEditor"><div class="party-form-grid">
            <div class="party-field"><label for="packetCocktail">Gathering begins</label><input id="packetCocktail" type="time"></div>
            <div class="party-field"><label for="packetDinner">Food or dinner time (optional)</label><input id="packetDinner" type="time"></div>
            <div class="party-field full"><label for="packetWelcome">Welcome from the host</label><textarea id="packetWelcome" maxlength="1200"></textarea></div>
            <div class="party-field full"><label for="attirePreset">Dress-up suggestions</label><select id="attirePreset"><option value="">Choose a starting point…</option></select><textarea id="packetAttire" maxlength="300"></textarea><small>Guests can use clothes and accessories they already own.</small></div>
            <div class="party-field full"><label for="packetFood">Food &amp; anything guests should bring</label><textarea id="packetFood" maxlength="600" placeholder="For example: I'll have light snacks during cocktails, then dinner at 7. Please let me know privately about dietary needs."></textarea></div>
          </div>
          <h3 style="margin:24px 0 8px;">What I'll be serving</h3><p class="party-description">Choose from the story’s suggested drinks or add your own. Only selected drinks appear on the menu.</p>
          <div class="party-actions"><button type="button" class="party-small-btn" id="useSuggestedMenu">Start with a simple suggested menu</button></div><div class="party-drinks" id="drinkChoices"></div>
          <div class="party-form-grid" style="margin-top:18px;"><div class="party-field"><label for="customSpirits">Your other drinks</label><textarea id="customSpirits" maxlength="2200" placeholder="One per line: Name | Ingredients or description"></textarea></div><div class="party-field"><label for="customAlcoholFree">Your other alcohol-free drinks</label><textarea id="customAlcoholFree" maxlength="2200" placeholder="One per line: Name | Ingredients or description"></textarea></div></div>
          <div class="party-actions"><button type="submit" class="btn-gold" id="saveWelcomePacket">Save welcome packet</button><a id="viewWelcomePacket" class="btn-ghost" target="_blank" rel="noopener">Preview &amp; print</a><button type="button" class="btn-ghost" id="copyWelcomePacket">Copy welcome packet link</button></div><p id="packetSaveStatus" class="party-status" role="status"></p></form>
        </section>`;
        el('invitePlanForm').onsubmit=addInvite;el('copyPartyInvite').onclick=()=>copy(inviteUrl());el('draftGeneralInvite').onclick=()=>draft('');el('viewWelcomePacket').href=welcomeUrl();el('copyWelcomePacket').onclick=()=>copy(welcomeUrl());
        for(const preset of currentStoryPackage.content.preparation?.attirePresets || []) {const option=node('option',preset.label);option.value=preset.text;el('attirePreset').append(option);}
        buildEditor();fillEditor();renderGuests();
        db.ref('hostInvitations/'+gameId).on('value',snap=>{invites=snap.val() || {};renderGuests();},()=>status('Could not load your private invite plan. Please refresh to retry.'));
        db.ref('games/'+gameId+'/welcomePacket').on('value',snap=>{packet=WelcomePacket.clean(snap.val());game.welcomePacket=packet;if(!dirty)fillEditor();},()=>{el('packetSaveStatus').textContent='Could not load the saved welcome packet. Please refresh before editing.';});
    }
    global.PregamePlanner={mount,updatePlayers};
})(window);
