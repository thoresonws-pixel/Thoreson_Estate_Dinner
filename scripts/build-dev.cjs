const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),out=path.join(root,'dist/development');
const config=JSON.parse(fs.readFileSync(path.join(root,'config/development.json')));
if(config.projectId!=='thoreson-estate-dev'||!config.databaseURL.includes('thoreson-estate-dev-default-rtdb'))throw Error('Refusing non-development Firebase target');
if(out!==path.resolve(root,'dist','development')||fs.existsSync(out)&&fs.lstatSync(out).isSymbolicLink())throw Error('Unsafe build output path');
fs.rmSync(out,{recursive:true,force:true});
fs.mkdirSync(out,{recursive:true});
function copy(from,to){fs.mkdirSync(to,{recursive:true});for(const e of fs.readdirSync(from,{withFileTypes:true})){const src=path.join(from,e.name),dst=path.join(to,e.name);if(e.isDirectory()){copy(src,dst);continue;}if(!/\.(html|js|css|json|png|jpg|jpeg|svg|webp|mp3|mp4|woff2|ico)$/i.test(e.name))continue;let data=fs.readFileSync(src);if(/\.(html|js)$/.test(e.name)){let s=data.toString();s=s.replace(/firebase\.initializeApp\(\s*(?:firebaseConfig|\{[\s\S]*?\})\s*\)/g,'firebase.initializeApp('+JSON.stringify(config)+')');if(e.name.endsWith('.html'))s=s.replace('</head>','<script>if(navigator.serviceWorker)navigator.serviceWorker.register=()=>Promise.reject(Error("Disabled in development"));</script></head>');data=Buffer.from(s);}fs.writeFileSync(dst,data);}}
// Explicit deploy boundary: never publish tools, tests, credentials or emulator controls.
for(const e of fs.readdirSync(root,{withFileTypes:true}))if(e.isFile()&&/\.(html|js|css|ico|png|jpg|jpeg|svg|webp|mp3|mp4)$/.test(e.name)&&!/(archive|backup|migrate|sw\.js)/.test(e.name)){const staging=path.join(out,e.name);if(!/\.(html|js|css)$/.test(e.name)){fs.copyFileSync(path.join(root,e.name),staging);continue;}let s=fs.readFileSync(path.join(root,e.name),'utf8');s=s.replace(/firebase\.initializeApp\(\s*(?:firebaseConfig|\{[\s\S]*?\})\s*\)/g,'firebase.initializeApp('+JSON.stringify(config)+')');if(e.name.endsWith('.html'))s=s.replace('</head>','<script>if(navigator.serviceWorker)navigator.serviceWorker.register=()=>Promise.reject(Error("Disabled in development"));</script></head>');fs.writeFileSync(staging,s);}
for(const name of ['stories','assets','images','css','js','posters','qr-codes','audio','photos','clue-thumbs'])if(fs.existsSync(path.join(root,name)))copy(path.join(root,name),path.join(out,name));
fs.copyFileSync(path.join(root,'development/index.html'),path.join(out,'index.html'));
fs.writeFileSync(path.join(out,'development-config.js'),'window.DEVELOPMENT_CONFIG='+JSON.stringify(config)+';');
console.log('Built isolated development site:',out);
