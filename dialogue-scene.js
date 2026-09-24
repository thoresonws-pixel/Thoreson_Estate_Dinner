window.createDialogueScene=function(pack){
    const el=document.createElement('section');el.className='scene-dialogue';el.id='sceneDialogue';el.hidden=true;
    el.innerHTML='<div class="dialogue-backdrop" aria-hidden="true"></div><img class="dialogue-portrait"><section class="dialogue-chat"><div class="dialog-head"><h2></h2><div class="scene-controls"><span class="scene-progress"></span><button class="scene-pause">Pause</button></div></div><p class="eyebrow"></p><p class="dialogue-line" aria-live="polite"></p></section>';
    document.querySelector('.focus').append(el);let visual=null;
    return {element:el,render(v,next,pause){
        el.hidden=false;const speaker=pack.speakers[v.step.speakerId],room=pack.map.roomViews[v.step.roomId],key=v.step.speakerId+'/'+v.step.roomId;
        if(key!==visual){const portrait=el.querySelector('img');portrait.src=speaker.portrait;portrait.alt=speaker.alt;portrait.style.animation='none';void portrait.offsetWidth;portrait.style.animation='';el.querySelector('.dialogue-backdrop').style.backgroundImage='url('+JSON.stringify(room.image)+')';visual=key;}
        el.querySelector('h2').textContent=speaker.name;el.querySelector('.eyebrow').textContent=v.step.label||'';
        const text=el.querySelector('.dialogue-line');if(text.textContent!==v.step.text)text.textContent=v.step.text;
        const paused=v.state?.pausedAt!=null;const button=el.querySelector('.scene-pause');button.textContent=paused?'Resume':'Pause';button.onclick=()=>pause(!paused);button.hidden=v.expired&&!paused;
        el.querySelector('.scene-progress').textContent=paused?'Paused':v.expired?'':Math.ceil(v.remaining/1000)+'s';
        el.querySelector('.scene-controls').append(next);
    },leave(){visual=null;el.hidden=true;}};
};
