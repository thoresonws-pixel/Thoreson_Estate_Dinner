const {test}=require('node:test'),assert=require('node:assert/strict');
const {allocate}=require('../player-item-sets.js');
const {migrate}=require('../scripts/private-inventory-migration.cjs');
const {options}=require('../scripts/migrate-private-inventory.cjs');
const set={id:'expedition-kits',items:[{id:'compass',name:'Compass'},{id:'radio',name:'Radio'},{id:'map',name:'Map'}]};
test('personal allocation is stable across retries, roster order and absent players',()=>{
 const first=allocate(null,{beta:{},alpha:{}},set);
 assert.equal(first.assignments[set.id].alpha,'compass');assert.equal(first.assignments[set.id].beta,'radio');
 first.players.alpha.inventory.compass.inspected=true;
 const retry=allocate(first,{beta:{},alpha:{}},set);assert.deepEqual(retry,first);
 const added=allocate(first,{gamma:{},beta:{}},set);
 assert.equal(added.assignments[set.id].gamma,'map');assert.equal(added.players.alpha.inventory.compass.inspected,true);
 assert.equal(first.players.gamma,undefined);assert.throws(()=>allocate(added,{delta:{}},set),/No unassigned/);
 assert.throws(()=>allocate(first,{alpha:{}},set,1),/state changed/);
 assert.throws(()=>allocate({...first,schemaVersion:99},{alpha:{}},set),/state changed/);
});
test('migration retains personal items and assignments, leaves shared evidence and other roots intact',()=>{
 const item={name:'Private map',text:'An unshared note'},source={other:{keep:true},games:{voyage:{createdBy:'host',players:{a:{characterId:'navigator',inventory:{map:item}}},state:{itemAssignments:{kits:{a:'map'}},tv:{inventory:{document:{name:'Shared'}}}}}}};
 const plan=migrate(source);assert.equal(plan.items,1);assert.deepEqual(plan.changed,['voyage']);
 assert.deepEqual(plan.data.privateSessions.voyage.players.a.inventory.map,item);
 assert.deepEqual(plan.data.privateSessions.voyage.assignments,{kits:{a:'map'}});
 assert.equal(plan.data.games.voyage.players.a.inventory,undefined);assert.equal(plan.data.games.voyage.state.itemAssignments,undefined);
 assert.deepEqual(plan.data.games.voyage.state.tv,source.games.voyage.state.tv);assert.deepEqual(plan.data.other,source.other);
 assert.ok(source.games.voyage.players.a.inventory);assert.deepEqual(migrate(plan.data).changed,[]);
 const conflict=structuredClone(plan.data);conflict.games.voyage.players.a.inventory={map:{name:'Different'}};
 assert.throws(()=>migrate(conflict),/Conflicting inventory/);assert.equal(conflict.privateSessions.voyage.players.a.inventory.map.name,'Private map');
 assert.throws(()=>options(['--project','valid-project','--check','--apply']));assert.throws(()=>options(['--project','https://untrusted.example']));
});
