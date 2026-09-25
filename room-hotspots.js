/* Artwork-relative inspection targets. Story packages own all object locations. */
(function(global){
'use strict';
function mount(container){
 const layer=document.createElement('div');layer.className='room-hotspots';container.append(layer);
 let signature='',image=null,view=null,disposed=false,timer=null,activate=()=>{};
 function layout(){if(!image?.naturalWidth)return;const scale=Math.min(container.clientWidth/image.naturalWidth,container.clientHeight/image.naturalHeight);const w=image.naturalWidth*scale,h=image.naturalHeight*scale;Object.assign(layer.style,{width:w+'px',height:h+'px',left:(container.clientWidth-w)/2+'px',top:(container.clientHeight-h)/2+'px'});}
 const observer=new ResizeObserver(layout);observer.observe(container);
 function update(next,hotspots,onSelect){activate=onSelect;const key=JSON.stringify([next?.image,hotspots]);if(key===signature)return;signature=key;view=next;layer.replaceChildren();layer.hidden=!next;layer.classList.remove('reveal');clearTimeout(timer);if(!next)return;
 const current=new Image();image=current;layer.style.visibility='hidden';current.onload=()=>{if(disposed||image!==current)return;layout();layer.style.visibility='visible';};current.src=next.image;
 for(const h of hotspots){const b=document.createElement('button');b.type='button';b.className='room-hotspot';b.dataset.interactionId=h.interactionId;b.setAttribute('aria-label','Inspect '+h.label);const [x,y,w,height]=h.rect;Object.assign(b.style,{left:x+'%',top:y+'%',width:w+'%',height:height+'%'});const label=document.createElement('span');label.textContent='Inspect '+h.label;b.append(label);b.onclick=()=>activate(h.interactionId);layer.append(b);}
 }
 return{update,highlight(){if(!view)return;clearTimeout(timer);layer.classList.add('reveal');timer=setTimeout(()=>layer.classList.remove('reveal'),3500);},dispose(){disposed=true;clearTimeout(timer);observer.disconnect();layer.remove();}};
}
global.RoomHotspots={mount};
})(window);
