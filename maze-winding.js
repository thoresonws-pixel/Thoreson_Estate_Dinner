/* Pointer/keyboard winding control. Dialogue and art are supplied by the story. */
(function(global){
'use strict';
function mount(root,config,onTurn){
 const box=document.createElement('div');box.style.cssText='text-align:center;max-width:290px;margin:16px auto';
 const label=document.createElement('p');label.textContent='Hold the handle and wind clockwise. Listen for someone to call your color.';
 const wheel=document.createElement('div');wheel.style.cssText='position:relative;width:100%;aspect-ratio:1;touch-action:none';
 const rotor=document.createElement('div');rotor.style.cssText='position:absolute;inset:0';
 const img=document.createElement('img');img.src=config.gearImage;img.alt='Winding gear';img.draggable=false;img.style.cssText='width:100%;height:100%;pointer-events:none';
 const handle=document.createElement('button');handle.type='button';handle.setAttribute('aria-label','Wind gear clockwise. Drag around the axle, or press Right Arrow for a quarter turn.');handle.style.cssText='position:absolute;left:78%;top:9%;width:20%;height:20%;border-radius:50%;background:transparent;border:2px solid #d4b86b;cursor:grab;touch-action:none';
 const status=document.createElement('p');status.setAttribute('role','status');rotor.append(img,handle);wheel.append(rotor);box.append(label,wheel,status);root.append(box);
 let angle=0,progress=0,pointer=null,last=0,busy=false,cooldown=0,disposed=false,dialog=null,restoreFocus=null;
 const position=e=>{const r=wheel.getBoundingClientRect();return Math.atan2(e.clientY-r.top-r.height/2,e.clientX-r.left-r.width/2);};
 function render(){rotor.style.transform='rotate('+angle+'rad)';handle.disabled=busy||cooldown>0;status.textContent=cooldown>0?'Cooling down: '+Math.ceil(cooldown/1000)+'s':busy?'Winding…':'Drag clockwise · Right Arrow also winds';}
 async function advance(delta){if(disposed||busy||cooldown>0)return;progress=Math.max(0,progress+delta);angle+=delta;render();if(progress>=Math.PI*2-.001){progress=0;busy=true;render();try{await onTurn();}finally{busy=false;if(!disposed)render();}}}
 handle.onpointerdown=e=>{if(busy||cooldown>0)return;e.preventDefault();pointer=e.pointerId;last=position(e);handle.setPointerCapture(pointer);};
 handle.onpointermove=e=>{if(e.pointerId!==pointer)return;const next=position(e);let delta=next-last;last=next;if(delta>Math.PI)delta-=2*Math.PI;if(delta<-Math.PI)delta+=2*Math.PI;if(Math.abs(delta)<Math.PI/2)advance(delta);};
 const release=()=>{pointer=null;};handle.onpointerup=release;handle.onpointercancel=release;handle.onlostpointercapture=release;
 handle.onkeydown=e=>{if(e.key==='ArrowRight'){e.preventDefault();advance(Math.PI/2);}};
 function close(){dialog?.remove();dialog=null;restoreFocus?.focus();}
 function warn(){if(disposed)return;close();restoreFocus=document.activeElement;dialog=document.createElement('dialog');dialog.setAttribute('aria-label',config.warning.speakerName+' warning');dialog.style.cssText='position:fixed;inset:0;width:100vw;height:100vh;max-width:none;max-height:none;margin:0;padding:0;border:0;background:rgba(15,12,25,.8);color:#fff;overflow:hidden';
 const portrait=document.createElement('img');portrait.src=config.warning.portrait;portrait.alt=config.warning.speakerName;portrait.style.cssText='position:absolute;right:0;bottom:16%;width:min(75vw,420px);max-height:65vh;object-fit:contain';
 const bubble=document.createElement('div');bubble.style.cssText='position:absolute;bottom:3%;left:4%;right:4%;padding:18px;border:2px solid #d6b363;border-radius:16px;background:#211b2b';
 const title=document.createElement('strong');title.textContent=config.warning.speakerName;const text=document.createElement('p');text.textContent=config.warning.text;const ok=document.createElement('button');ok.textContent='Understood';ok.style.cssText='min-height:44px;padding:8px 20px';ok.onclick=close;bubble.append(title,text,ok);dialog.append(portrait,bubble);document.body.append(dialog);dialog.addEventListener('cancel',e=>{e.preventDefault();close();});dialog.showModal();ok.focus();
 if(!global.matchMedia('(prefers-reduced-motion: reduce)').matches){for(let i=0;i<18;i++){const spark=document.createElement('span');spark.textContent='✦';spark.style.cssText='pointer-events:none;position:absolute;color:#ffcf65;font-size:28px;left:'+Math.random()*95+'%;top:'+Math.random()*80+'%';dialog.append(spark);spark.animate([{opacity:1,transform:'scale(.4)'},{opacity:0,transform:'translateY(65px) scale(1.3)'}],{duration:700,fill:'forwards'});}portrait.animate([{transform:'translateY(50px)'},{transform:'translateY(0)'}],{duration:300});}
 }
 render();return{update(ms){cooldown=Math.max(0,ms);render();},warn,dispose(){disposed=true;close();box.remove();}};
}
global.MazeWinding={mount};
})(window);
