const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),out=path.join(root,'dist','production');
if(fs.existsSync(out)&&fs.lstatSync(out).isSymbolicLink())throw Error('Unsafe output directory');
fs.rmSync(out,{recursive:true,force:true});fs.mkdirSync(out,{recursive:true});
const allowed=/\.(html|js|css|json|png|jpg|jpeg|svg|webp|mp3|mp4|woff2|ico)$/i;
function copy(from,to){fs.mkdirSync(to,{recursive:true});for(const e of fs.readdirSync(from,{withFileTypes:true})){if(e.name.startsWith('.'))continue;const src=path.join(from,e.name),dst=path.join(to,e.name);if(e.isDirectory())copy(src,dst);else if(allowed.test(e.name))fs.copyFileSync(src,dst);}}
for(const e of fs.readdirSync(root,{withFileTypes:true}))if(e.isFile()&&allowed.test(e.name)&&(!e.name.endsWith('.json')||e.name==='manifest.json')&&!/(archive|backup|migrate)/.test(e.name))fs.copyFileSync(path.join(root,e.name),path.join(out,e.name));
for(const name of ['stories','assets','images','css','js','posters','qr-codes','audio','photos','clue-thumbs'])if(fs.existsSync(path.join(root,name)))copy(path.join(root,name),path.join(out,name));
require('./story-boundaries.cjs').publish(root,out);
console.log('Built production site with private memory text removed.');
