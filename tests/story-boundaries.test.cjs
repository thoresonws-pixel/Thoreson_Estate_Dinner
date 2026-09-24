const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs');
const {project}=require('../scripts/story-boundaries.cjs'),{eligible}=require('../memory-authority.js');
test('unrelated story projects private text separately and releases only triggered memories',()=>{
 const source={id:'voyage',content:{characters:{pilot:{name:'Pilot',memories:[{text:'Private rendezvous',whenInspected:'radio'}],knowledge:[{text:'Secret map',unlockedBy:'map'}]}}},experience:{steps:[{id:'landing',type:'exploration'}],interactions:[]}};
 const p=project(source);assert.ok(!JSON.stringify(p.story).includes('Private rendezvous'));assert.equal(p.memories['pilot-memories-0'].text,'Private rendezvous');assert.deepEqual(eligible(p.story,{}),{});
 assert.deepEqual(eligible(p.story,{privateGeneration:2,state:{tv:{inspected:{radio:{at:1}}}}}),{'pilot-memories-0':{characterId:'pilot',generation:2}});
 assert.equal(source.content.characters.pilot.memories[0].text,'Private rendezvous');
});
test('production publishes from an explicit build, never the authoring repository',()=>{
 assert.equal(JSON.parse(fs.readFileSync('firebase.json')).hosting.public,'dist/production');
 require('../scripts/build-production.cjs');
 const {catalog}=require('../scripts/story-boundaries.cjs');
 for(const [id,p]of Object.entries(catalog(process.cwd()))){const paths=['dist/production','dist/development'];for(const prefix of paths){const file=prefix+'/stories/'+id+'/package.json';if(!fs.existsSync(file))continue;const body=fs.readFileSync(file,'utf8')+(p.story.experienceFile?fs.readFileSync(prefix+'/stories/'+id+'/'+p.story.experienceFile,'utf8'):'');for(const m of Object.values(p.memories))assert.ok(!body.includes(JSON.stringify(m.text).slice(1,-1)),id+' contains private text');}}
});
