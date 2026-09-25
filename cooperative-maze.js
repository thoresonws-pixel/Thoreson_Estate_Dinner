/* Reusable cooperative maze state machine and synchronized host/player views. */
(function(global){
'use strict';
const copy=x=>JSON.parse(JSON.stringify(x));
const directions={up:[0,-1],down:[0,1],left:[-1,0],right:[1,0]};
function validate(c){
 if(!c||!Number.isInteger(c.durationSeconds)||c.durationSeconds<30||!Number.isInteger(c.shufflePauseSeconds)||c.shufflePauseSeconds<2||c.shufflePauseSeconds>30||!Array.isArray(c.mazes)||c.mazes.length<1||c.mazes.length>8)throw Error('Invalid cooperative maze configuration');
 const ids=new Set();for(const m of c.mazes){if(!m.id||ids.has(m.id)||!m.label||!m.symbol||!/^#[0-9a-f]{6}$/i.test(m.color))throw Error('Invalid maze identity');ids.add(m.id);
 if(!Array.isArray(m.grid)||m.grid.length<3||m.grid.length>15||m.grid.some(r=>typeof r!=='string'||r.length!==m.grid[0].length||!/^[#.]+$/.test(r))||m.grid[0].length>15)throw Error('Invalid maze grid');
 for(const point of [m.start,m.goal])if(!Array.isArray(point)||point.length!==2||!point.every(Number.isInteger)||m.grid[point[1]]?.[point[0]]!=='.')throw Error('Invalid maze endpoint');
 if(m.start.join()===m.goal.join()||!route(m,m.start))throw Error('Maze goal must be reachable');
 }if(c.winding){const w=c.winding;if(!Number.isInteger(w.turnsToRepair)||w.turnsToRepair<1||w.turnsToRepair>8||!Number.isFinite(w.cooldownSeconds)||w.cooldownSeconds<1||!Number.isFinite(w.breakdownChance)||w.breakdownChance<0||w.breakdownChance>1||!Number.isFinite(w.graceSeconds)||w.graceSeconds<0||![w.gearImage,w.warning?.portrait].every(x=>typeof x==='string'&&/^stories\/[a-z0-9_/-]+\.png$/i.test(x))||!w.warning?.text||!w.warning?.speakerName)throw Error('Invalid maze winding configuration');}return true;
}
function route(m,pos){const q=[[pos,[]]],seen=new Set([pos.join()]);while(q.length){const [p,path]=q.shift();if(p.join()===m.goal.join())return path;for(const [name,[dx,dy]]of Object.entries(directions)){const n=[p[0]+dx,p[1]+dy],k=n.join();if(m.grid[n[1]]?.[n[0]]==='.'&&!seen.has(k)){seen.add(k);q.push([n,[...path,name]]);}}}return null;}
function assign(s){const active=s.mazeIds.filter(id=>!s.positions[id].done);s.controls={};for(let i=0;i<s.controllers.length;i++)if(i<active.length)s.controls[s.controllers[i]]=active[(i+s.rotation)%active.length];}
function start(config,uids,now,id){validate(config);if(new Set(uids).size!==uids.length||uids.length<2||Math.ceil(uids.length/2)>config.mazes.length)throw Error('Choose between 2 and '+config.mazes.length*2+' participants.');
 const n=Math.ceil(uids.length/2),s={attempt:id,revision:0,status:'running',activated:true,startedAt:now,deadline:now+config.durationSeconds*1000,shuffleAt:now+config.durationSeconds*500,shuffled:false,rotation:0,participants:uids,guideUids:uids.slice(0,n),controllers:uids.slice(n),mazeIds:config.mazes.slice(0,n).map(m=>m.id),positions:{},help:0};
 for(const m of config.mazes.slice(0,n))s.positions[m.id]={x:m.start[0],y:m.start[1],done:false};assign(s);return s;
}
function tick(s,c,now){if(!s||s.status!=='running')return false;
 if(now>=s.deadline){s.status='expired';s.revision++;return true;}
 if(!s.shuffled&&now>=s.shuffleAt){const old=s.guideUids.slice();s.guideUids=[...s.controllers];if(old.length>s.controllers.length)s.guideUids.push(old[0]);s.controllers=old.slice(old.length>s.controllers.length?1:0);s.guideUids.push(s.guideUids.shift());s.shuffled=true;delete s.lastMove;s.resumeAt=now+c.shufflePauseSeconds*1000;s.deadline+=c.shufflePauseSeconds*1000;s.rotation++;assign(s);s.revision++;return true;}return false;}
function move(original,c,uid,command,now){const s=copy(original);if(s.attempt!==command.attempt||s.revision!==command.revision||s.status!=='running')return null;
 if(tick(s,c,now))return s;if(now<(s.resumeAt||0)||!directions[command.direction])return null;
 const id=s.controls?.[uid];if(!id||id!==command.mazeId)return null;const m=c.mazes.find(m=>m.id===id),p=s.positions[id],[dx,dy]=directions[command.direction];
 const disconnected=s.fault?.mazeId===id;const hit=!disconnected&&m.grid[p.y+dy]?.[p.x+dx]!=='.';if(!hit&&!disconnected){p.x+=dx;p.y+=dy;p.done=p.x===m.goal[0]&&p.y===m.goal[1];}
 s.lastMove={uid,mazeId:id,hit,at:now};s.rotation++;s.revision++;if(s.mazeIds.every(id=>s.positions[id].done)){s.status='complete';s.solved=true;s.solvedAt=now;s.solvedBy=uid;s.controls={};}else {assign(s);const w=c.winding;if(w&&!s.fault&&s.guideUids.length>1&&now>=Math.max(s.startedAt+w.graceSeconds*1000,s.faultGraceUntil||0)&&Number.isFinite(command.roll)&&command.roll>=0&&command.roll<w.breakdownChance){const available=s.mazeIds.filter(mid=>!s.positions[mid].done);if(available.length){s.fault={mazeId:available[Math.floor(command.roll/w.breakdownChance*available.length)],at:now};s.windTurns={};}}}return s;
}
function wind(original,c,uid,command,now){
 const w=c.winding;if(!w||!original)return null;const s=copy(original);
 if(s.attempt!==command.attempt||s.status!=='running'||now<(s.resumeAt||0)||now<(s.windCooldowns?.[command.mazeId]||0)||s.mazeIds[s.guideUids.indexOf(uid)]!==command.mazeId||s.positions[command.mazeId]?.done)return null;
 if(tick(s,c,now))return s;
 const id=command.mazeId;if((s.windTurns?.[id]||0)!==command.turn)return null;
 s.windTurns||={};s.windCooldowns||={};
 if(s.fault?.mazeId===id){s.windTurns[id]=(s.windTurns[id]||0)+1;if(s.windTurns[id]>=w.turnsToRepair){delete s.fault;s.windTurns[id]=0;s.windCooldowns[id]=now+w.cooldownSeconds*1000;s.faultGraceUntil=now+w.graceSeconds*1000;}}
 else{s.overloads||={};s.overloads[uid]={at:now,mazeId:id};s.windTurns[id]=0;s.windCooldowns[id]=now+w.cooldownSeconds*1000;}
 s.revision++;return s;
}
const el=(tag,text)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=text;return n;};
function mount(container,{db,gameId,item,uid,host=false,pack}){
 const ref=db.ref('games/'+gameId);let latest=null,offset=0,disposed=false,pending=false,lastSignature='',selected=null,lastShuffle=null;
 const time=()=>Date.now()+offset,offsetRef=db.ref('.info/serverTimeOffset'),offsetListener=s=>offset=Number(s.val())||0;offsetRef.on('value',offsetListener);
 const shell=el('div');shell.className='cooperative-maze';shell.style.cssText='padding:16px;border:1px solid #a18a54;border-radius:10px;background:#171421;color:#faf5e7';const clock=el('p'),content=el('div'),error=el('p');error.setAttribute('role','status');clock.setAttribute('aria-label','Maze time remaining');const gearRoot=el('div');shell.append(clock,content,gearRoot,error);let gear=null,gearKey='';container.append(shell);
 const state=g=>g?.state?.tv?.puzzles?.[item.id];
 function active(g){const tv=g?.state?.tv,step=pack.steps.find(s=>s.id===g?.state?.experience?.stepId);return step?.type==='exploration'&&tv?.currentRoom===item.roomId&&tv.activeInteraction===item.id&&state(g)?.activated===true;}
 // Only transact this puzzle: rewriting the game also revalidates unrelated rewards.
 async function change(fn){
  if(disposed||pending)return;pending=true;error.textContent='';
  const expectedAttempt=state(latest)?.attempt;
  try{
   const result=await ref.child('state/tv/puzzles/'+item.id).transaction(current=>{
    const g=latest;
    if(!current||!g||!active(g)||(host?g.createdBy!==uid:!g.players?.[uid])||current.attempt!==expectedAttempt)return;
    return fn(current,g,time())||undefined;
   });
   if(result.committed)return result.snapshot.val();if(!result.committed)error.textContent='The assignment changed. Check your current color and try again.';
  }catch(e){error.textContent=e.code==='PERMISSION_DENIED'?'This maze move was rejected. Reopen the device and try again.':'Could not save. Check your connection and try again.';}
  finally{pending=false;}
 }
 function button(text,fn){const b=el('button',text);b.type='button';b.style.cssText='min-height:52px;padding:12px 18px;margin:6px;font-size:18px;touch-action:manipulation';b.onclick=fn;return b;}
 function begin(){const members=Object.keys(latest.players||{}).filter(id=>selected?.has(id));const attempt=crypto.randomUUID();change((s,g,now)=>{if(s?.status==='running'||s?.status==='paused'||members.some(id=>!g.players?.[id]))return;return start(item.maze,members,now,attempt)});}
 function draw(){if(disposed||!latest)return;const s=state(latest),key=JSON.stringify([s,active(latest),host?Object.keys(latest.players||{}):null]);updateClock();updateGear();if(key===lastSignature)return;lastSignature=key;content.replaceChildren();
 if(!active(latest)){content.append(el('p','Open this device on the TV to continue.'));return;}
 if(!s?.attempt){if(host)lobby();else content.append(el('p','Waiting for the host to start. You will receive either a maze to guide or directional controls.'));return;}
 if(s.shuffled&&lastShuffle!==s.attempt){lastShuffle=s.attempt;if(time()<(s.resumeAt||0))sound();}
 if(s.status==='complete'){content.append(el('h3',item.reward.name),el('p',item.reward.text));return;}
 if(s.status==='expired'){content.append(el('h3','Time is up'),el('p','You can try again. The key stays unlocked.'));if(host)lobby();return;}
 const paused=s.status==='paused'||time()<(s.resumeAt||0);
 if(s.shuffled&&time()<(s.resumeAt||0))content.append(el('h3',item.maze.shuffleText||'A change of perspective! New roles—get ready.'));
 if(s.status==='paused')content.append(el('h3','Paused'));
 if(host){const total=s.mazeIds.length,done=s.mazeIds.filter(id=>s.positions[id].done).length;content.append(el('h3',done+' / '+total+' mazes complete'));
 const progress=el('div');progress.style.cssText='display:grid;grid-template-columns:repeat(auto-fit,minmax(175px,1fr));gap:4px 16px';content.append(progress);for(const id of s.mazeIds){const m=item.maze.mazes.find(m=>m.id===id),label=el('p',m.symbol+' '+m.label+' — '+(s.positions[id].done?'Complete':Object.values(s.controls||{}).includes(id)?'Active':'Waiting for a controller'));label.style.color=m.color;progress.append(label);}
 content.append(button(s.status==='paused'?'Resume':'Pause',()=>change((v,g,now)=>{if(v.status==='running'){v=copy(v);v.status='paused';v.pausedAt=now;}else if(v.status==='paused'){v=copy(v);const delta=now-v.pausedAt;v.deadline+=delta;v.shuffleAt+=delta;if(v.resumeAt)v.resumeAt+=delta;v.status='running';delete v.pausedAt;}else return;v.revision++;return v;})));
 }else{const guideIndex=s.guideUids.indexOf(uid),id=guideIndex>=0?s.mazeIds[guideIndex]:s.controls?.[uid];
 if(!s.participants.includes(uid)){content.append(el('p','You are not in this attempt. Join the next round.'));return;}
 if(!id){content.append(el('h3','Waiting'),el('p','The remaining mazes have controllers. Stay ready for a new color.'));}
 else{const m=item.maze.mazes.find(m=>m.id===id),p=s.positions[id];const title=el('h3',m.symbol+' '+m.label+' — '+(guideIndex>=0?'GUIDE':'CONTROLLER'));title.style.color=m.color;content.append(title);
 if(guideIndex>=0){if(s.fault&&s.mazeIds[(s.mazeIds.indexOf(s.fault.mazeId)+1)%s.mazeIds.length]===id){const broken=item.maze.mazes.find(m=>m.id===s.fault.mazeId);content.append(el('p','Call out: Wind '+broken.label+'!'));}content.append(el('p',p.done?'Maze complete!':s.help>=1&&!Object.values(s.controls||{}).includes(id)?'Waiting for a controller. Plan your next direction.':'Call your color and a direction. You cannot move the token.'));const grid=el('div');grid.setAttribute('aria-label',m.label+' maze');grid.style.cssText='display:grid;grid-template-columns:repeat('+m.grid[0].length+',1fr);width:100%;max-width:360px;aspect-ratio:'+m.grid[0].length+'/'+m.grid.length+';border:2px solid '+m.color+';opacity:'+(s.help<1||p.done||Object.values(s.controls||{}).includes(id)?1:.45);
 m.grid.forEach((row,y)=>[...row].forEach((cell,x)=>{const tile=el('div',p.x===x&&p.y===y?'●':m.goal[0]===x&&m.goal[1]===y?'★':'');tile.style.cssText='display:flex;align-items:center;justify-content:center;font-size:22px;background:'+(cell==='#'?'#514c60':'#fcf3d8')+';color:#121020;min-width:0';grid.append(tile);}));content.append(grid,el('p','● Current position · ★ Goal'));if(s.help>=2&&!p.done){const path=route(m,[p.x,p.y]);content.append(el('p','Route hint: '+path.slice(0,3).join(' → ')));}}
 else{content.append(el('p','Listen for '+m.label+'. Choose a direction; then check your new color.'));const controls=el('div');controls.style.cssText='display:grid;grid-template-columns:repeat(3,1fr);max-width:360px';for(const name of ['up','left','down','right']){const b=button({up:'↑ Up',left:'← Left',down:'↓ Down',right:'→ Right'}[name],()=>{const command={attempt:s.attempt,revision:s.revision,mazeId:id,direction:name,roll:Math.random()};change((v,g,now)=>move(v,item.maze,uid,command,now));});b.disabled=paused;b.style.gridColumn=name==='up'?'2':name==='left'?'1':name==='down'?'2':'3';controls.append(b);}content.append(controls);}
 }
 if(s.lastMove?.uid===uid&&s.lastMove.hit)content.append(el('p','Thonk! A wall blocked the move. Check your new color.'));
 }
 if(s.help>=1)content.append(el('p',item.maze.helpText||'Guides call the color and a direction. Controllers check their color after every move. Only guides see the routes.'));
 content.append(button('We need help',()=>change(v=>{if(!['running','paused'].includes(v.status)||(!host&&!v.participants.includes(uid)))return;v=copy(v);v.help=Math.min(2,(v.help||0)+1);v.revision++;return v;})));
 }
 function updateGear(){
 const s=state(latest),index=s?.guideUids?.indexOf(uid),id=index>=0?s.mazeIds[index]:null;
 const show=!host&&item.maze.winding&&active(latest)&&s?.status==='running'&&id&&!s.positions[id].done;
 const key=show?s.attempt+':'+id:'';
 if(key!==gearKey){gear?.dispose();gear=null;gearKey=key;if(show)gear=global.MazeWinding.mount(gearRoot,item.maze.winding,async()=>{
 const current=state(latest),command={attempt:current.attempt,mazeId:id,turn:current.windTurns?.[id]||0},before=current.overloads?.[uid]?.at;
 const result=await change((v,g,now)=>wind(v,item.maze,uid,command,now));
 if(result?.overloads?.[uid]?.at&&result.overloads[uid].at!==before)gear?.warn();return !!result;
 });}
 gear?.update(Math.max(s?.windCooldowns?.[id]||0,s?.resumeAt||0)-time());
 }
 function lobby(){content.append(el('p','Choose the players taking part. Guides keep a maze; controllers receive changing colors. Halfway through, roles shuffle once.'));
 selected||=new Set(Object.keys(latest.players||{}));for(const [id,p]of Object.entries(latest.players||{})){const label=el('label'),check=el('input');check.type='checkbox';check.checked=selected.has(id);check.onchange=()=>check.checked?selected.add(id):selected.delete(id);label.style.cssText='display:inline-flex;align-items:center;gap:8px;margin:8px';label.append(check,el('span',p.characterName||p.displayName||id));content.append(label);}content.append(button('Start maze challenge',()=>{if(selected.size<2||selected.size>item.maze.mazes.length*2){error.textContent='Select 2–'+item.maze.mazes.length*2+' participants.';return;}begin();}));}
 function updateClock(){const s=state(latest);if(!s?.attempt){clock.textContent='Ready when your group is ready';return;}const now=s.status==='paused'?s.pausedAt:time();const remaining=Math.max(0,Math.ceil((s.deadline-Math.max(now,s.resumeAt||0))/1000));clock.textContent=s.status==='complete'?'All mazes complete':s.status==='expired'?'Attempt finished':Math.floor(remaining/60)+':'+String(remaining%60).padStart(2,'0')+' remaining';}
 function sound(){try{const Audio=global.AudioContext||global.webkitAudioContext;if(!Audio)return;const a=new Audio();for(let i=0;i<3;i++){const o=a.createOscillator(),g=a.createGain();o.type='triangle';o.frequency.value=110+i*65;g.gain.value=.035;o.connect(g);g.connect(a.destination);o.start(a.currentTime+i*.12);o.stop(a.currentTime+i*.12+.15);}setTimeout(()=>a.close(),1000);}catch(_){}}
 const listener=s=>{latest=s.val();draw();};ref.on('value',listener,e=>error.textContent='Could not load the maze. Reopen it to reconnect.');
 const timer=setInterval(()=>{updateClock();updateGear();const s=state(latest);if(s?.resumeAt&&time()>=s.resumeAt&&shell.dataset.resumed!==s.attempt){shell.dataset.resumed=s.attempt;lastSignature='';draw();}if(host&&s?.status==='running'&&active(latest)&&(time()>=s.deadline||!s.shuffled&&time()>=s.shuffleAt))change(v=>{v=copy(v);return tick(v,item.maze,time())?v:null;});},500);
 return{dispose(){disposed=true;gear?.dispose();clearInterval(timer);ref.off('value',listener);offsetRef.off('value',offsetListener);shell.remove();}};
}
global.CooperativeMaze={validate,start,move,wind,tick,route,mount};
})(typeof window!=='undefined'?window:globalThis);
