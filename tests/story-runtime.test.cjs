const {test}=require('node:test');
const assert=require('node:assert/strict');
const {state:engine}=require('../story-runtime.js');
const flow={version:1,steps:[{id:'launch',type:'title',next:'orbit'},{id:'orbit',type:'placeholder',durationSeconds:10,next:'landing'},{id:'landing',type:'exploration',next:'launch'}]};

test('alternate story runs without fixed acts and upgrades legacy saves on write',()=>{
 const legacy={stepId:'orbit',startedAt:1000};
 assert.equal(engine.view(flow,legacy,5000).remaining,6000);
 assert.equal(engine.transition(flow,legacy,{type:'advance',expected:legacy},10999),undefined);
 const next=engine.transition(flow,legacy,{type:'advance',expected:legacy},11000);
 assert.deepEqual(next,{schemaVersion:1,revision:1,stepId:'landing',startedAt:11000});
 assert.deepEqual(legacy,{stepId:'orbit',startedAt:1000});
});
test('two commands from the same snapshot can advance only once',()=>{
 const old={stepId:'launch',startedAt:10,schemaVersion:1,revision:1};
 const command={type:'advance',expected:{...old}};
 const first=engine.transition(flow,old,command,100);
 assert.equal(first.stepId,'orbit');
 assert.equal(engine.transition(flow,first,command,200),undefined);
 // Return to the same step: an old command still cannot skip the new visit.
 assert.equal(engine.transition(flow,{...old,revision:5,startedAt:500},command,600),undefined);
});
test('pause/resume survive refresh and preserve remaining time',()=>{
 const old={stepId:'orbit',startedAt:1000};
 const paused=engine.transition(flow,old,{type:'pause',expected:old},4000);
 const restored=JSON.parse(JSON.stringify(paused));
 assert.equal(engine.view(flow,restored,50000).remaining,7000);
 assert.equal(engine.transition(flow,restored,{type:'advance',expected:restored},50000),undefined);
 const resumed=engine.transition(flow,restored,{type:'resume',expected:restored},50000);
 assert.equal(engine.view(flow,resumed,50000).remaining,7000);
 assert.equal(engine.transition(flow,resumed,{type:'resume',expected:restored},51000),undefined);
});
test('reset invalidates stale same-step commands and games remain independent',()=>{
 const a={stepId:'launch',startedAt:100}; const b={...a,startedAt:200};
 assert.equal(engine.transition(flow,b,{type:'advance',expected:a},300),undefined);
 assert.equal(engine.transition(flow,a,{type:'advance',expected:a},300).stepId,'orbit');
 assert.deepEqual(b,{stepId:'launch',startedAt:200});
});
test('future versions and corrupt saves fail clearly instead of resetting progress',()=>{
 for(const state of [{schemaVersion:2,stepId:'launch',startedAt:1},{stepId:'missing',startedAt:1},{stepId:'launch',startedAt:'bad'},{stepId:'launch',startedAt:1,revision:-1},{stepId:'launch',startedAt:1,pausedAt:'bad'}])assert.throws(()=>engine.view(flow,state,100));
});
test('initialization and terminal steps are idempotent',()=>{
 const timed={steps:[{id:'wait',durationSeconds:1,next:'finish'},{id:'finish'}]};
 const start=engine.transition(timed,null,{type:'start'},10);
 assert.equal(engine.transition(timed,start,{type:'start'},20),undefined);
 assert.equal(engine.transition(timed,{stepId:'finish',startedAt:10},{type:'advance',expected:{stepId:'finish',startedAt:10}},20),undefined);
 assert.equal(engine.transition(flow,null,{type:'advance',expected:null},10).stepId,'orbit');
});
