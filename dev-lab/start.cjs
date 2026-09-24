const fs=require('fs'),path=require('path'),http=require('http'),{spawn}=require('child_process');
const {changeGame}=require('./controls.cjs');
const {migrate}=require('../scripts/private-inventory-migration.cjs');
const root=path.resolve(__dirname,'..'),workspace=path.dirname(root);
const {settings,assertPortsAvailable}=require('./settings.cjs');
const lab=settings(root),{stateDir,ports}=lab;
const storyId=process.argv[2]||JSON.parse(fs.readFileSync(path.join(__dirname,'launch.json'))).storyId;if(!/^[a-z0-9_]+$/.test(storyId||''))throw Error('Usage: node dev-lab/start.cjs <story_id>');
const story=JSON.parse(fs.readFileSync(path.join(root,'stories',storyId,'package.json'))),experience=JSON.parse(fs.readFileSync(path.join(root,'stories',storyId,story.experienceFile||'experience.json')));
const project=lab.project,namespace=project+'-default-rtdb',gameId='lab_'+storyId,hostUid='lab_host';
const players=Object.entries(story.content.characters).map(([id,c])=>({uid:'lab_'+id,characterId:id,name:c.name,email:'lab_'+id+'@example.invalid'}));
const accounts=[{uid:hostUid,name:'Lab host',email:'host@example.invalid'},...players];
fs.mkdirSync(stateDir,{recursive:true});
const dbUrl='http://127.0.0.1:'+ports.database+'/.json?ns='+namespace,headers={Authorization:'Bearer owner','Content-Type':'application/json'};
function token(uid){const now=Math.floor(Date.now()/1000);return Buffer.from(JSON.stringify({alg:'none',typ:'JWT'})).toString('base64url')+'.'+Buffer.from(JSON.stringify({iss:'lab@example.invalid',sub:'lab@example.invalid',aud:'https://identitytoolkit.googleapis.com/google.identity.identitytoolkit.v1.IdentityToolkit',iat:now,exp:now+3600,uid})).toString('base64url')+'.';}
async function wait(url){for(let i=0;i<120;i++){try{await fetch(url);return;}catch{}await new Promise(r=>setTimeout(r,1000));}throw Error('Emulator did not start: '+url);}
const {cli,env}=require('./runtime.cjs').runtime(workspace);
const emulatorConfig=JSON.parse(fs.readFileSync(path.join(__dirname,'firebase.json')));emulatorConfig.database.rules='database.rules.json';for(const name of ['auth','database','hub','logging'])emulatorConfig.emulators[name].port=ports[name];fs.copyFileSync(path.join(root,'database.rules.json'),path.join(stateDir,'database.rules.json'));fs.writeFileSync(path.join(stateDir,'firebase.json'),JSON.stringify(emulatorConfig));
let emulator;
function startEmulators(){
const emulator=spawn(process.execPath,[cli,'emulators:start','--only','auth,database','--project',project,'--config',path.join(stateDir,'firebase.json')],{cwd:stateDir,env,windowsHide:true,stdio:['ignore','pipe','pipe']});
const log=fs.createWriteStream(path.join(stateDir,'emulators.log'),{flags:'a'});emulator.stdout.pipe(log);emulator.stderr.pipe(log);return emulator;
}
let server,interval;const snapshotFile=path.join(stateDir,'database.json');
async function snapshot(){if(!lab.persist)return;const r=await fetch(dbUrl,{headers});if(!r.ok)throw Error('Cannot persist local state');const text=await r.text();fs.writeFileSync(snapshotFile+'.tmp',text);fs.renameSync(snapshotFile+'.tmp',snapshotFile);}
(async()=>{
 await assertPortsAvailable(ports);emulator=startEmulators();
 await wait('http://127.0.0.1:'+ports.auth);await wait(dbUrl);
 const original=lab.persist&&fs.existsSync(snapshotFile)?JSON.parse(fs.readFileSync(snapshotFile)):{};
 const migration=migrate(original),data=migration.data;
 if(lab.persist&&migration.changed.length)fs.writeFileSync(path.join(stateDir,'before-private-inventory-'+Date.now()+'.json'),JSON.stringify(original),{flag:'wx',mode:0o600});
 data.users||={};data.games||={};data.platformAdmins||={};data.platformAdmins[hostUid]=true;
 if(!data.games[gameId]){const step=experience.steps.find(s=>s.type==='exploration')||experience.steps[0];data.games[gameId]={storyId,storyName:story.metadata?.name||storyId,partyName:'Player Lab',partyCode:'LOCAL-LAB',createdBy:hostUid,createdAt:Date.now(),status:'active',gameMode:'standard',unlockId:'local-only',players:{},state:{experience:{stepId:step.id,startedAt:Date.now()},tv:{}}};}
 if(!Number.isFinite(data.games[gameId].state?.experience?.startedAt))data.games[gameId].state.experience.startedAt=Date.now();
 for(const account of accounts){data.users[account.uid]||={displayName:account.name,email:account.email,role:account.uid===hostUid?'admin':'player'};data.users[account.uid].currentGameId=gameId;}
 for(const player of players)data.games[gameId].players[player.uid]||={characterId:player.characterId,characterName:player.name,displayName:player.name,status:'ready',joinedAt:Date.now(),questionnaireComplete:true,waiverSigned:true};
 const seeded=await fetch(dbUrl,{method:'PUT',headers,body:JSON.stringify(data)});if(!seeded.ok)throw Error('Local seed failed: '+seeded.status);await snapshot();
 const config={mode:lab.mode,ports,namespace,project,gameId,hostUid,players,title:story.metadata?.name||storyId,steps:experience.steps.map(s=>({id:s.id,label:s.title||s.label||s.id,next:s.next}))};
 server=http.createServer(async(req,res)=>{
  try{if(!['127.0.0.1:'+ports.web,'localhost:'+ports.web].includes(req.headers.host)){res.writeHead(403).end('Loopback only');return;}const url=new URL(req.url,lab.origin);
   res.setHeader('Cache-Control','no-store');res.setHeader('Content-Security-Policy',`connect-src 'self' http://127.0.0.1:${ports.database} http://127.0.0.1:${ports.auth} ws://127.0.0.1:${ports.database}; worker-src 'none'`);
   if(url.pathname==='/__lab/config'){res.setHeader('Content-Type','application/json');res.end(JSON.stringify(config));return;}
   if(url.pathname==='/__lab/progress'){
    const gameUrl='http://127.0.0.1:'+ports.database+'/games/'+gameId+'.json?ns='+namespace;
    if(req.method==='GET'){const r=await fetch(gameUrl,{headers});if(!r.ok)throw Error('Cannot read test game');const game=await r.json();res.setHeader('Content-Type','application/json');res.end(JSON.stringify({stepId:game.state?.experience?.stepId}));return;}
    if(req.method!=='POST'||req.headers.origin!=='http://'+req.headers.host||!req.headers['content-type']?.startsWith('application/json')){res.writeHead(403).end('Local Player Lab controls only');return;}
    let body='';for await(const chunk of req){body+=chunk;if(body.length>2048){res.writeHead(413).end();return;}}
    const command=JSON.parse(body);
    // Reset both branches in one local-only CAS. Do not lose concurrent updates to other lab games.
    const reset=command.action==='reset',targetUrl=reset?dbUrl:gameUrl;
    const read=await fetch(targetUrl,{headers:{...headers,'X-Firebase-ETag':'true'}});if(!read.ok)throw Error('Cannot read test game');
    const previous=await read.json();const updated=changeGame(reset?previous.games[gameId]:previous,experience,players,command.action,command.stepId);
    if(reset){previous.games[gameId]=updated;if(previous.privateSessions)delete previous.privateSessions[gameId];}
    const saved=await fetch(targetUrl,{method:'PUT',headers:{...headers,'if-match':read.headers.get('etag')},body:JSON.stringify(reset?previous:updated)});
    if(!saved.ok)throw Error(saved.status===412?'The game changed. Try again.':'Could not update test game');
    await snapshot();res.setHeader('Content-Type','application/json');res.end(JSON.stringify({stepId:updated.state.experience.stepId}));return;
   }
   if(url.pathname==='/__lab/stop'&&req.method==='POST'){if(req.headers.origin&&req.headers.origin!=='http://'+req.headers.host){res.writeHead(403).end();return;}res.end('Stopping local lab');setTimeout(stop,50);return;}
   let file;if(url.pathname==='/')file=path.join(__dirname,'index.html');else if(url.pathname==='/__lab/bootstrap.js')file=path.join(__dirname,'bootstrap.js');else{const requested=decodeURIComponent(url.pathname).slice(1);if(requested.split('/').some(x=>x.startsWith('.')||['node_modules','functions','dev-lab','review'].includes(x))||! /\.(html|js|css|json|png|jpg|jpeg|webp|svg|mp3|mp4|woff2|ico)$/i.test(requested)||requested==='sw.js'){res.writeHead(404).end();return;}file=path.resolve(root,requested);if(!file.startsWith(root+path.sep)){res.writeHead(403).end();return;}}
   if(!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404).end();return;}
   const ext=path.extname(file),types={'.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp','.svg':'image/svg+xml'};res.setHeader('Content-Type',types[ext]||'application/octet-stream');
   if(ext!=='.html'){fs.createReadStream(file).pipe(res);return;}
   let html=fs.readFileSync(file,'utf8');if(file!==path.join(__dirname,'index.html')){
    let selected=url.searchParams.get('labPlayer');if(!selected&&req.headers.referer){const previous=new URL(req.headers.referer);if(previous.origin==='http://'+req.headers.host)selected=previous.searchParams.get('labPlayer');if(selected){url.searchParams.set('labPlayer',selected);res.writeHead(302,{Location:url.pathname+url.search});res.end();return;}}const account=accounts.find(a=>a.uid===selected);if(!account){res.writeHead(400).end('Open this page from Player Lab to select an identity.');return;}
    const scripts=[...html.matchAll(/<script\b[^>]*src=["'][^"']*firebase-[^"']*-compat\.js["'][^>]*><\/script>/g)];if(!scripts.length){res.writeHead(400).end('This page is not connected to the lab.');return;}
    const match=scripts.at(-1),at=match.index+match[0].length;const bootstrap='<script>window.__PLAYER_LAB__='+JSON.stringify({...account,gameId,ports,project,token:token(account.uid)}).replace(/</g,'\\u003c')+';</script><script src="/__lab/bootstrap.js"></script>';html=html.slice(0,at)+bootstrap+html.slice(at);
   }res.end(html);
  }catch(e){res.writeHead(500).end(e.message);}
 });server.listen(ports.web,'127.0.0.1',()=>console.log('Player Lab ready: '+lab.origin+' ('+players.length+' players, '+lab.mode+')'));
 interval=setInterval(()=>snapshot().catch(e=>console.error(e.message)),5000);
})().catch(async e=>{console.error(e);if(emulator)await stop(1);else process.exitCode=1;});
let stopping=false;
async function stop(code=0){if(stopping)return;stopping=true;clearInterval(interval);try{await snapshot();}catch{}server?.close();if(!emulator){process.exit(code);return;}if(process.platform==='win32'){const killer=spawn('taskkill',['/PID',String(emulator.pid),'/T','/F'],{windowsHide:true,stdio:'ignore'});killer.on('exit',()=>process.exit(code));}else{emulator.kill();process.exit(code);}}process.on('SIGINT',()=>stop());process.on('SIGTERM',()=>stop());
