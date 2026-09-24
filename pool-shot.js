/* Reusable one-ball pocket-sequence challenge. Story data supplies the routine. */
(function(global){
    'use strict';
    const table={left:30,right:330,top:30,bottom:510};
    const pockets=[['top-left',30,30],['top-right',330,30],['middle-left',30,270],['middle-right',330,270],['bottom-left',30,510],['bottom-right',330,510]];
    function trace(start,direction,distance=1400){
        let {x,y}=start,mag=Math.hypot(direction.x,direction.y);
        if(!mag)return {points:[{x,y}],cushions:[],pocket:null};
        let dx=direction.x/mag,dy=direction.y/mag;
        const points=[{x,y}],cushions=[];
        for(let bounce=0;bounce<10&&distance>0;bounce++){
            const tx=dx>0?(table.right-x)/dx:dx<0?(table.left-x)/dx:Infinity;
            const ty=dy>0?(table.bottom-y)/dy:dy<0?(table.top-y)/dy:Infinity;
            const travel=Math.min(tx,ty,distance);x+=dx*travel;y+=dy*travel;distance-=travel;
            points.push({x,y});
            if(travel<Math.min(tx,ty)-.001)break;
            const pocket=pockets.find(p=>Math.hypot(x-p[1],y-p[2])<=20);
            if(pocket){points[points.length-1]={x:pocket[1],y:pocket[2]};return {points,cushions,pocket:pocket[0]};}
            if(tx<=ty){cushions.push(dx>0?'right':'left');dx=-dx;}
            else{cushions.push(dy>0?'bottom':'top');dy=-dy;}
        }
        return {points,cushions,pocket:null};
    }
    const matches=(result,shot)=>result.pocket===shot.pocket&&(!shot.cushions || JSON.stringify(result.cushions)===JSON.stringify(shot.cushions));
    function challenge(config){
        if(!config.letterPuzzle)return config;
        const puzzle=config.letterPuzzle;
        return {...config,shots:[...puzzle.word].map(letter=>({start:config.shots[0].start,pocket:Object.entries(puzzle.pockets).find(([,letters])=>letters.split(' ').includes(letter))?.[0]}))};
    }
    function canUnlock(config,player){return !config.letterPuzzle||!!player?.inventory?.[config.letterPuzzle.itemId];}
    function renderBoard(container,config){
        container.replaceChildren();const heading=document.createElement('h2');heading.textContent='Puzzle board';container.append(heading);
        const prompt=document.createElement('p');prompt.textContent=config.letterPuzzle.prompt;container.append(prompt);
        const board=document.createElement('div');board.style.cssText='display:grid;grid-template-columns:1fr 1fr;gap:22px 14px;background:#135f4a;border:12px solid #503321;padding:18px;border-radius:18px;color:#fff8e8';
        for(const [id]of pockets){const tile=document.createElement('div');tile.style.cssText='min-height:78px;text-align:center';const title=document.createElement('strong'),letters=document.createElement('p');title.textContent=id.replace('-',' ').toUpperCase();letters.textContent=config.letterPuzzle.pockets[id];tile.append(title,letters);board.append(tile);}container.append(board);
        const help=document.createElement('p');help.textContent='Read the pockets to the shooter, one letter at a time. The table and board are separate views.';container.append(help);
    }
    function mount(container,config,onWin){
        let index=0,strikes=0,drag=null,flight=null,frame=0,disposed=false,busy=false,won=false;
        container.replaceChildren();
        const make=(tag,text)=>{const el=document.createElement(tag);if(text)el.textContent=text;return el;};
        const score=make('p'),message=make('p','Drag back from the ball to aim; release to shoot. The dots preview your path.');message.setAttribute('role','status');
        const canvas=make('canvas');canvas.width=360;canvas.height=540;canvas.tabIndex=0;canvas.setAttribute('aria-label','Pool table. Drag back from the ball and release to shoot. Keyboard aiming controls are below.');canvas.style.cssText='display:block;width:100%;max-width:360px;height:auto;margin:auto;touch-action:none;border-radius:18px';
        const controls=make('details'),legend=make('summary','Alternative aiming controls');controls.append(legend);
        const angle=make('input');angle.type='range';angle.min='0';angle.max='359';angle.value='270';angle.setAttribute('aria-label','Aim angle in degrees');
        const shoot=make('button','Shoot'),retry=make('button','Try again'),saveAgain=make('button','Retry saving win');retry.hidden=true;saveAgain.hidden=true;
        controls.append(angle,shoot);container.append(score,message,canvas,controls,retry,saveAgain);
        const ctx=canvas.getContext('2d');
        const start=()=>config.shots[Math.min(index,config.shots.length-1)].start;
        function info(){score.textContent='Shot '+Math.min(index+1,config.shots.length)+' of '+config.shots.length+'   '+Array.from({length:config.maxStrikes},(_,i)=>i<strikes?'✕':'○').join(' ');score.setAttribute('aria-label',strikes+' strikes out of '+config.maxStrikes);}
        function draw(ball=start()){
            ctx.clearRect(0,0,360,540);ctx.fillStyle='#503321';ctx.fillRect(0,0,360,540);ctx.fillStyle='#135f4a';ctx.fillRect(22,22,316,496);
            ctx.fillStyle='#060907';for(const p of pockets){ctx.beginPath();ctx.arc(p[1],p[2],17,0,Math.PI*2);ctx.fill();}
            ctx.fillStyle='#e7d7ad';ctx.font='12px sans-serif';ctx.textAlign='center';ctx.fillText('TOP',180,15);ctx.fillText('BOTTOM',180,534);
            ctx.save();ctx.translate(12,270);ctx.rotate(-Math.PI/2);ctx.fillText('LEFT',0,0);ctx.restore();ctx.save();ctx.translate(350,270);ctx.rotate(Math.PI/2);ctx.fillText('RIGHT',0,0);ctx.restore();
            if(drag&&!busy){const result=trace(start(),drag.vector,drag.distance);ctx.beginPath();ctx.moveTo(result.points[0].x,result.points[0].y);for(const p of result.points.slice(1))ctx.lineTo(p.x,p.y);ctx.strokeStyle='rgba(255,255,255,.65)';ctx.lineWidth=2;ctx.setLineDash([2,9]);ctx.stroke();ctx.setLineDash([]);
                const length=Math.hypot(drag.vector.x,drag.vector.y)||1,dx=drag.vector.x/length,dy=drag.vector.y/length;ctx.beginPath();ctx.moveTo(ball.x-dx*20,ball.y-dy*20);ctx.lineTo(ball.x-dx*100,ball.y-dy*100);ctx.lineWidth=5;ctx.strokeStyle='#e1bd78';ctx.stroke();}
            ctx.beginPath();ctx.arc(ball.x,ball.y,9,0,Math.PI*2);ctx.fillStyle='#fff8e8';ctx.fill();
        }
        async function finish(){
            if(disposed)return;busy=true;shoot.disabled=true;
            try{await onWin();if(disposed)return;won=true;message.textContent=config.winText||'Challenge complete.';saveAgain.hidden=true;}
            catch(error){if(disposed)return;message.textContent=error.message||'Could not save your win. Please retry.';saveAgain.hidden=false;}
        }
        function settle(result){
            busy=false;flight=null;if(disposed)return;
            if(matches(result,config.shots[index])){index++;if(index===config.shots.length){info();draw();finish();return;}message.textContent='That shot counts. Continue the routine.';}
            else{strikes++;message.textContent=strikes>=config.maxStrikes?config.maxStrikes+' strikes. This attempt is over. Try again when you are ready.':'That shot did not count toward the routine.';}
            shoot.disabled=strikes>=config.maxStrikes;retry.hidden=strikes<config.maxStrikes;info();draw();
        }
        function fire(vector,distance){
            if(disposed||busy||won||strikes>=config.maxStrikes||index>=config.shots.length)return;
            const result=trace(start(),vector,distance);drag=null;busy=true;shoot.disabled=true;
            const lengths=result.points.slice(1).map((p,i)=>Math.hypot(p.x-result.points[i].x,p.y-result.points[i].y));const total=lengths.reduce((a,b)=>a+b,0);const begun=performance.now(),duration=Math.min(1800,Math.max(500,total*1.5));
            function animate(now){if(disposed)return;let remain=Math.min(1,(now-begun)/duration)*total,i=0;while(i<lengths.length-1&&remain>lengths[i])remain-=lengths[i++];const a=result.points[i],b=result.points[i+1]||a,t=lengths[i]?Math.min(1,remain/lengths[i]):1;draw({x:a.x+(b.x-a.x)*t,y:a.y+(b.y-a.y)*t});if(now-begun>=duration){shoot.disabled=false;settle(result);}else frame=requestAnimationFrame(animate);}
            flight=result;frame=requestAnimationFrame(animate);
        }
        const point=e=>{const r=canvas.getBoundingClientRect();return {x:(e.clientX-r.left)*360/r.width,y:(e.clientY-r.top)*540/r.height};};
        canvas.onpointerdown=e=>{if(busy||won||strikes>=config.maxStrikes)return;const p=point(e);if(Math.hypot(p.x-start().x,p.y-start().y)>55)return;canvas.setPointerCapture(e.pointerId);drag={pointer:e.pointerId,vector:{x:0,y:-1},distance:1000};};
        canvas.onpointermove=e=>{if(!drag||drag.pointer!==e.pointerId)return;const p=point(e),vector={x:start().x-p.x,y:start().y-p.y},pull=Math.hypot(vector.x,vector.y);drag={pointer:e.pointerId,vector,distance:Math.min(1600,300+pull*16)};draw();};
        canvas.onpointerup=e=>{if(!drag||drag.pointer!==e.pointerId)return;const shot=drag;drag=null;if(Math.hypot(shot.vector.x,shot.vector.y)<8){draw();return;}fire(shot.vector,shot.distance);};
        canvas.onpointercancel=()=>{drag=null;draw();};
        angle.oninput=()=>{if(busy||won)return;const a=Number(angle.value)*Math.PI/180;drag={vector:{x:Math.cos(a),y:Math.sin(a)},distance:1400};draw();};
        shoot.onclick=()=>{const a=Number(angle.value)*Math.PI/180;fire({x:Math.cos(a),y:Math.sin(a)},1400);};
        retry.onclick=()=>{index=0;strikes=0;won=false;busy=false;drag=null;retry.hidden=true;shoot.disabled=false;message.textContent='New attempt. Recreate the routine.';info();draw();};saveAgain.onclick=finish;
        info();draw();
        return {dispose(){disposed=true;cancelAnimationFrame(frame);canvas.onpointerdown=canvas.onpointermove=canvas.onpointerup=canvas.onpointercancel=null;}};
    }
    global.PoolShot={trace,matches,mount,pockets,challenge,canUnlock,renderBoard};
})(window);
