const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
test('preserved review files match their original bytes and cannot be published',()=>{
 const manifest=JSON.parse(fs.readFileSync('review/manifest.json'));
 for(const entry of manifest.entries){assert.ok(entry.retained.startsWith('review/legacy/'));assert.equal(crypto.createHash('sha256').update(fs.readFileSync(entry.retained)).digest('hex'),entry.sha256,entry.original);}
 assert.ok(JSON.parse(fs.readFileSync('firebase.json')).hosting.ignore.includes('review/**'));
 assert.equal(fs.existsSync('dist/development/review'),false);
});
test('root application scripts do not reference quarantined or missing local files',()=>{
 for(const name of fs.readdirSync('.').filter(n=>n.endsWith('.html'))){
  const text=fs.readFileSync(name,'utf8');
  for(const match of text.matchAll(/<script\b[^>]*\bsrc=["']([^"']+)["']/gi)){
   if(/^(https?:)?\/\//.test(match[1]))continue;
   const file=match[1].split('?')[0];assert.ok(!file.startsWith('review/'),name);assert.ok(fs.existsSync(path.resolve(file)),name+': '+file);
  }
 }
});
