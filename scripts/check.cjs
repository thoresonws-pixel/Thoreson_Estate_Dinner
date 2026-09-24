const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..');
function walk(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.name.startsWith('.')||['node_modules','dist','functions'].includes(e.name)?[]:e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)]);}
for(const file of walk(root)){
 if(/\.(js|cjs)$/.test(file))new vm.Script(fs.readFileSync(file,'utf8'),{filename:file});
 if(file.endsWith('.html')){let n=0;for(const tag of fs.readFileSync(file,'utf8').matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)){if(/src=|application\/ld\+json|type=["']module/i.test(tag[1]))continue;new vm.Script(tag[2],{filename:file+':script'+(++n)});}}
}
const context={window:{},console};vm.createContext(context);vm.runInContext(fs.readFileSync(path.join(root,'story-package.js'),'utf8'),context);
for(const dir of fs.readdirSync(path.join(root,'stories'))){const file=path.join(root,'stories',dir,'package.json');if(!fs.existsSync(file))continue;const pack=JSON.parse(fs.readFileSync(file));const exp=path.join(path.dirname(file),pack.experienceFile||'experience.json');if(fs.existsSync(exp))pack.experience=JSON.parse(fs.readFileSync(exp));context.window.StoryPackage.validate(pack);}
console.log('JavaScript, inline scripts, and story packages validated.');
