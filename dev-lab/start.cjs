const fs=require('fs'),path=require('path'),http=require('http'),{spawn}=require('child_process');
const root=path.resolve(__dirname,'..'),workspace=path.dirname(root),stateDir=path.join(workspace,'.player-lab-work/state');
const storyId=process.argv[2];if(!/^[a-z0-9_]+$/.test(storyId||''))throw Error('Usage: node dev-lab/start.cjs <story_id>');
const story=JSON.parse(fs.readFileSync(path.join(root,'stories',storyId,'package.json'))),experience=JSON.parse(fs.readFileSync(path.join(root,'stories',storyId,story.experienceFile||'experience.json')));
const project='demo-mystery-lab',namespace=project+'-default-rtdb',gameId='lab_'+storyId,hostUid='lab_host';
const players=Object.entries(story.content.characters).map(([id,c])=>({uid:'lab_'+id,characterId:id,name:c.name,email:'lab_'+id+'@example.invalid'}));
const accounts=[{uid:hostUid,name:'Lab host',email:'host@example.invalid'},...players];
fs.mkdirSync(stateDir,{recursive:true});
const dbUrl='http://127.0.0.1:9000/.json?ns='+namespace,headers={Authorization:'Bearer owner','Content-Type':'application/json'};
function token(uid){const now=Math.floor(Date.now()/1000);return Buffer.from(JSON.stringify({alg:'none',typ:'JWT'})).toString('base64url')+'.'+Buffer.from(JSON.stringify({iss:'lab@example.invalid',sub:'lab@example.invalid',aud:'https://identitytoolkit.googleapis.com/google.identity.identitytoolkit.v1.IdentityToolkit',iat:now,exp:now+3600,uid})).toString('base64url')+'.';}
async function wait(url){for(let i=0;i<120;i++){try{await fetch(url);return;}catch{}await new Promise(r=>setTimeout(r,1000));}throw Error('Emulator did not start: '+url);}
const javaDir=fs.readdirSync(path.join(workspace,'.player-lab-work/runtime'),{withFileTypes:true}).find(e=>e.isDirectory()&&e.name.startsWith('jdk-'))?.name;
if(!javaDir)throw Error('Install Java 21 into .player-lab-work/runtime first.');
const javaHome=path.join(workspace,'.player-lab-work/runtime',javaDir),cli=path.join(process.env.APPDATA,'npm/node_modules/firebase-tools/lib/bin/firebase.js');
const emulatorConfig=JSON.parse(fs.readFileSync(path.join(__dirname,'firebase.json')));emulatorConfig.database.rules='database.rules.json';fs.copyFileSync(path.join(root,'database.rules.json'),path.join(stateDir,'database.rules.json'));fs.writeFileSync(path.join(stateDir,'firebase.json'),JSON.stringify(emulatorConfig));
const emulator=spawn(process.execPath,[cli,'emulators:start','--only','auth,database','--project',project,'--config',path.join(stateDir,'firebase.json')],{cwd:stateDir,env:{...process.env,JAVA_HOME:javaHome,PATH:path.join(javaHome,'bin')+path.delimiter+process.env.PATH},windowsHide:true,stdio:['ignore','pipe','pipe']});
const log=fs.createWriteStream(path.join(stateDir,'emulators.log'),{flags:'a'});emulator.stdout.pipe(log);emulator.stderr.pipe(log);
let server,interval;const snapshotFile=path.join(stateDir,'database.json');
async function snapshot(){const r=await fetch(dbUrl,{headers});if(!r.ok)throw Error('Cannot persist local state');const text=await r.text();fs.writeFileSync(snapshotFile+'.tmp',text);fs.renameSync(snapshotFile+'.tmp',snapshotFile);}
(async()=>{
 await wait('http://127.0.0.1:9099');await wait(dbUrl);
 const data=fs.existsSync(snapshotFile)?JSON.parse(fs.readFileSync(snapshotFile)):{};data.users||={};data.games||={};
 if(!data.games[gameId]){const step=experience.steps.find(s=>s.type==='exploration')||experience.steps[0];data.games[gameId]={storyId,storyName:story.metadata?.name||storyId,partyName:'Player Lab',partyCode:'LOCAL-LAB',createdBy:hostUid,createdAt:Date.now(),status:'active',gameMode:'standard',unlockId:'local-only',players:{},state:{experience:{stepId:step.id,startedAt:Date.now()},tv:{}}};}
 if(!Number.isFinite(data.games[gameId].state?.experience?.startedAt))data.games[gameId].state.experience.startedAt=Date.now();
 for(const account of accounts){data.users[account.uid]||={displayName:account.name,email:account.email,role:account.uid===hostUid?'admin':'player'};data.users[account.uid].currentGameId=gameId;}
 for(const player of players)data.games[gameId].players[player.uid]||={characterId:player.characterId,characterName:player.name,displayName:player.name,status:'ready',joinedAt:Date.now(),questionnaireComplete:true,waiverSigned:true};
 const seeded=await fetch(dbUrl,{method:'PUT',headers,body:JSON.stringify(data)});if(!seeded.ok)throw Error('Local seed failed: '+seeded.status);await snapshot();
 const config={gameId,hostUid,players,title:story.metadata?.name||storyId};
 server=http.createServer((req,res)=>{
  try{if(!['127.0.0.1:5173','localhost:5173'].includes(req.headers.host)){res.writeHead(403).end('Loopback only');return;}const url=new URL(req.url,'http://127.0.0.1:5173');
   res.setHeader('Cache-Control','no-store');res.setHeader('Content-Security-Policy',"connect-src 'self' http://127.0.0.1:9000 http://127.0.0.1:9099 ws://127.0.0.1:9000; worker-src 'none'");
   if(url.pathname==='/__lab/config'){res.setHeader('Content-Type','application/json');res.end(JSON.stringify(config));return;}
   if(url.pathname==='/__lab/stop'&&req.method==='POST'){if(req.headers.origin&&req.headers.origin!=='http://'+req.headers.host){res.writeHead(403).end();return;}res.end('Stopping local lab');setTimeout(stop,50);return;}
   let file;if(url.pathname==='/')file=path.join(__dirname,'index.html');else if(url.pathname==='/__lab/bootstrap.js')file=path.join(__dirname,'bootstrap.js');else{const requested=decodeURIComponent(url.pathname).slice(1);if(requested.split('/').some(x=>x.startsWith('.')||['node_modules','functions','dev-lab'].includes(x))||! /\.(html|js|css|json|png|jpg|jpeg|webp|svg|mp3|mp4|woff2|ico)$/i.test(requested)||requested==='sw.js'){res.writeHead(404).end();return;}file=path.resolve(root,requested);if(!file.startsWith(root+path.sep)){res.writeHead(403).end();return;}}
   if(!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404).end();return;}
   const ext=path.extname(file),types={'.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp','.svg':'image/svg+xml'};res.setHeader('Content-Type',types[ext]||'application/octet-stream');
   if(ext!=='.html'){fs.createReadStream(file).pipe(res);return;}
   let html=fs.readFileSync(file,'utf8');if(file!==path.join(__dirname,'index.html')){
    let selected=url.searchParams.get('labPlayer');if(!selected&&req.headers.referer){const previous=new URL(req.headers.referer);if(previous.origin==='http://'+req.headers.host)selected=previous.searchParams.get('labPlayer');if(selected){url.searchParams.set('labPlayer',selected);res.writeHead(302,{Location:url.pathname+url.search});res.end();return;}}const account=accounts.find(a=>a.uid===selected);if(!account){res.writeHead(400).end('Open this page from Player Lab to select an identity.');return;}
    const scripts=[...html.matchAll(/<script\b[^>]*src=["'][^"']*firebase-[^"']*-compat\.js["'][^>]*><\/script>/g)];if(!scripts.length){res.writeHead(400).end('This page is not connected to the lab.');return;}
    const match=scripts.at(-1),at=match.index+match[0].length;const bootstrap='<script>window.__PLAYER_LAB__='+JSON.stringify({...account,gameId,token:token(account.uid)}).replace(/</g,'\\u003c')+';</script><script src="/__lab/bootstrap.js"></script>';html=html.slice(0,at)+bootstrap+html.slice(at);
   }res.end(html);
  }catch(e){res.writeHead(500).end(e.message);}
 });server.listen(5173,'127.0.0.1',()=>console.log('Player Lab ready: http://127.0.0.1:5173 ('+players.length+' players)'));
 interval=setInterval(()=>snapshot().catch(e=>console.error(e.message)),5000);
})().catch(e=>{console.error(e);emulator.kill();process.exitCode=1;});
async function stop(){clearInterval(interval);try{await snapshot();}catch{}server?.close();if(process.platform==='win32'){const killer=spawn('taskkill',['/PID',String(emulator.pid),'/T','/F'],{windowsHide:true,stdio:'ignore'});killer.on('exit',()=>process.exit());}else{emulator.kill();process.exit();}}process.on('SIGINT',stop);process.on('SIGTERM',stop);
