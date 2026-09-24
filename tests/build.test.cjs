const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
test('development build never initializes production Firebase or exposes emulator tools',()=>{
 require('../scripts/build-dev.cjs');const dir=path.resolve('dist/development');
 for(const entry of fs.readdirSync(dir)){if(!/\.(js|html)$/.test(entry))continue;const text=fs.readFileSync(path.join(dir,entry),'utf8');for(const call of text.matchAll(/firebase\.initializeApp\(([^;]*?)\);/g))assert.match(call[1],/thoreson-estate-dev|window.DEVELOPMENT_CONFIG/,entry);}
 for(const name of ['dev-lab','scripts','tests','node_modules','sw.js'])assert.equal(fs.existsSync(path.join(dir,name)),false,name+' must not be published');
});
