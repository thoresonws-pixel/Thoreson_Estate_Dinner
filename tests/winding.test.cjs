const {test}=require('node:test'),assert=require('node:assert/strict');require('../cooperative-maze.js');
const M=global.CooperativeMaze;
// Unrelated story: no estate identities, timings, or content required.
const c={durationSeconds:120,shufflePauseSeconds:3,mazes:['a','b'].map(id=>({id,label:id,symbol:'*',color:'#ffffff',grid:['#####','#...#','###.#'],start:[1,1],goal:[3,2]})),winding:{turnsToRepair:2,cooldownSeconds:10,breakdownChance:1,graceSeconds:1,gearImage:'stories/other/gear.png',warning:{portrait:'stories/other/person.png',speakerName:'Inventor',text:'Too much!'}}};
test('foreign fault, silent disconnected input, two turns repair and cooldown',()=>{
 let s=M.start(c,['g1','g2','c1'],0,'a');const id=s.controls.c1;
 s=M.move(s,c,'c1',{attempt:'a',revision:0,mazeId:id,direction:'right',roll:0},1100);assert.equal(s.fault.mazeId,'a');
 s.controls.c1='a';const position={...s.positions.a};s=M.move(s,c,'c1',{attempt:'a',revision:s.revision,mazeId:'a',direction:'right'},1200);assert.deepEqual(s.positions.a,position);assert.equal(s.lastMove.hit,false);
 assert.equal(M.wind(s,c,'c1',{attempt:'a',mazeId:'a',turn:0},1300),null);
 s=M.wind(s,c,'g1',{attempt:'a',mazeId:'a',turn:0},1300);assert(s.fault);assert.equal(s.windTurns.a,1);
 assert.equal(M.wind(s,c,'g1',{attempt:'a',mazeId:'a',turn:0},1350),null);
 s=M.wind(s,c,'g1',{attempt:'a',mazeId:'a',turn:1},1400);assert(!s.fault);assert.equal(s.windCooldowns.a,11400);
 assert.equal(M.wind(s,c,'g1',{attempt:'a',mazeId:'a',turn:0},1500),null);
});
test('one healthy turn overloads only that guide; stale attempts and paused rounds reject',()=>{
 let s=M.start(c,['g1','g2','c1'],0,'a');s=M.wind(s,c,'g1',{attempt:'a',mazeId:'a',turn:0},100);assert.equal(s.overloads.g1.at,100);assert(!s.overloads.g2);assert.equal(s.windCooldowns.a,10100);
 assert.equal(M.wind(s,c,'g2',{attempt:'old',mazeId:'b',turn:0},200),null);s.status='paused';assert.equal(M.wind(s,c,'g2',{attempt:'a',mazeId:'b',turn:0},200),null);
});
