const {test}=require('node:test'),assert=require('node:assert/strict');
const {changeGame}=require('../dev-lab/controls.cjs');
test('alternate story: reset isolates progress; skip follows configured transitions',()=>{
 const exp={steps:[{id:'arrival',next:'wait'},{id:'wait',next:'search',durationSeconds:600},{id:'search'}]};
 const game={storyId:'space',createdBy:'host',players:{p:{inventory:{secret:true}}},state:{experience:{stepId:'wait',pausedAt:2},tv:{inventory:{key:true},activeInteraction:'instrument'},memories:{secret:true}}};
 const advance=changeGame(game,exp,[],'advance',null,100);assert.equal(advance.state.experience.stepId,'search');assert.equal(advance.state.experience.startedAt,100);assert.equal(advance.state.tv.inventory.key,true);assert.equal(advance.state.tv.activeInteraction,undefined);
 const reset=changeGame(game,exp,[{uid:'p',characterId:'pilot',name:'Pilot'}],'reset',null,100);assert.equal(reset.state.experience.stepId,'arrival');assert.deepEqual(reset.state.tv,{});assert.equal(reset.players.p.inventory,undefined);assert.equal(reset.state.memories,undefined);assert.equal(reset.createdBy,'host');assert.ok(game.state.memories);
 assert.throws(()=>changeGame(game,exp,[],'jump','unknown'));assert.throws(()=>changeGame(advance,exp,[],'advance'));
});
