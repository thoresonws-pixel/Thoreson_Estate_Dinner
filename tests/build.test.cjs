const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
test('development build never initializes production Firebase or exposes emulator tools',()=>{
 require('../scripts/build-dev.cjs');const dir=path.resolve('dist/development');
 // Check private text only after our own development build has completed.
 const {catalog}=require('../scripts/story-boundaries.cjs');
 for(const [id,p]of Object.entries(catalog(process.cwd()))){const folder=path.join(dir,'stories',id);const body=fs.readFileSync(path.join(folder,'package.json'),'utf8')+(p.story.experienceFile?fs.readFileSync(path.join(folder,p.story.experienceFile),'utf8'):'');for(const m of Object.values(p.memories))assert.ok(!body.includes(JSON.stringify(m.text).slice(1,-1)),id+' contains private text');}
 for(const entry of fs.readdirSync(dir)){if(!/\.(js|html)$/.test(entry))continue;const text=fs.readFileSync(path.join(dir,entry),'utf8');for(const call of text.matchAll(/firebase\.initializeApp\(([^;]*?)\);/g))assert.match(call[1],/thoreson-estate-dev|window.DEVELOPMENT_CONFIG/,entry);}
 for(const name of ['dev-lab','scripts','tests','node_modules','sw.js'])assert.equal(fs.existsSync(path.join(dir,name)),false,name+' must not be published');
});
