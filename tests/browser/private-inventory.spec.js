const {test,expect}=require('@playwright/test'),fs=require('node:fs');
const {initializeTestEnvironment,assertFails,assertSucceeds}=require('@firebase/rules-unit-testing');
const {ensure,allocate}=require('../../player-item-sets.js');
for(const variant of ['production','development'])test.describe(variant+' private inventory',()=>{
 let env,host,guest,peer,developer,outsider;
 const set={id:'expedition-kits',items:[{id:'compass',name:'Private compass'},{id:'radio',name:'Private radio'}]};
 test.beforeAll(async({request})=>{
  const lab=await(await request.get('/__lab/config')).json();expect(lab.mode).toBe('test');
  env=await initializeTestEnvironment({projectId:'demo-inventory-'+variant,database:{host:'127.0.0.1',port:lab.ports.database,rules:fs.readFileSync(variant==='production'?'database.rules.json':'config/database.dev.rules.json','utf8')}});
  [host,guest,peer,developer,outsider]=['host','guest','peer','developer','outsider'].map(uid=>env.authenticatedContext(uid,{email:uid+'@example.test',email_verified:true}).database());
 });
 test.beforeEach(async()=>env.withSecurityRulesDisabled(async c=>c.database().ref().set({
  devMembers:{host:true,guest:true,peer:true,developer:true,outsider:true},developerAccess:{developer:{inspectAllCharacters:true}},
  games:{session:{createdBy:'host',storyId:'voyage',players:{guest:{characterId:'navigator'},peer:{characterId:'pilot'}},state:{tv:{inventory:{shared:{name:'Shared evidence'}}}}}},
  privateSessions:{session:allocate(null,{guest:{},peer:{}},set)}
 })));
 test.afterAll(async()=>env?.cleanup());
 test('owners receive their own items; peers and parent reads are denied by the database',async()=>{
  expect((await assertSucceeds(guest.ref('privateSessions/session/players/guest').once('value'))).val().inventory.compass.name).toBe('Private compass');
  for(const path of ['privateSessions','privateSessions/session','privateSessions/session/players','privateSessions/session/assignments','privateSessions/session/players/peer','privateSessions/session/players/peer/inventory/radio'])await assertFails(guest.ref(path).once('value'));
  await assertFails(outsider.ref('privateSessions/session/players/guest').once('value'));
  await assertFails(env.unauthenticatedContext().database().ref('privateSessions/session/players/guest').once('value'));
  const shared=(await guest.ref('games/session').once('value')).val();expect(shared.players.guest.inventory).toBeUndefined();expect(shared.state.itemAssignments).toBeUndefined();expect(shared.state.tv.inventory.shared.name).toBe('Shared evidence');
 });
 test('only host can assign; no player can mint, overwrite, delete or publish private inventory',async()=>{
  for(const db of [guest,peer,developer,outsider]){
   await assertFails(db.ref('privateSessions/session/players/guest/inventory/forged').set({name:'Forged'}));
   await assertFails(db.ref('privateSessions/session').remove());
   await assertFails(db.ref('privateSessions/session').set(allocate(null,{guest:{},peer:{}},set)));
  }
  await assertFails(guest.ref().update({'privateSessions/session/players/guest/inventory/radio':{name:'Forged'},'games/session/state/tv/puzzles/pool/solved':true}));
  for(const db of [host,guest]){
   await assertFails(db.ref('games/session/players/guest/inventory/item').set({name:'Public leak'}));
   await assertFails(db.ref('games/session/players/guest').set({characterId:'navigator',inventory:{item:{name:'Public leak'}}}));
   await assertFails(db.ref('games/session/state/itemAssignments/kits/guest').set('compass'));
   const game=(await host.ref('games/session').once('value')).val();game.players.guest.inventory={item:{name:'Public leak'}};await assertFails(db.ref('games/session').set(game));
  }
  await assertFails(guest.ref('games/session/privateGeneration').set(1));
  await assertSucceeds(host.ref('privateSessions/session/players/guest/inventory/compass/inspected').set(true));
 });
 test('developer inspection is explicit, verified and revocable; unrelated admin profiles have no access',async()=>{
  await assertSucceeds(developer.ref('privateSessions/session/players').once('value'));
  await assertSucceeds(host.ref('privateSessions/session').once('value'));
  await assertFails(env.authenticatedContext('developer',{email_verified:false}).database().ref('privateSessions/session/players').once('value'));
  await env.withSecurityRulesDisabled(async c=>c.database().ref().update({'platformAdmins/outsider':true,'users/outsider/role':'admin'}));
  await assertFails(outsider.ref('privateSessions/session').once('value'));
  await env.withSecurityRulesDisabled(async c=>c.database().ref('developerAccess/developer').remove());
  await assertFails(developer.ref('privateSessions/session/players').once('value'));
  await host.ref('games/session/players/guest').remove();await assertFails(guest.ref('privateSessions/session/players/guest').once('value'));
 });
 test('concurrent host requests allocate once; generation prevents an old request restoring reset inventory',async()=>{
  await host.ref('privateSessions/session').remove();
  const context={db:host,gameId:'session',uid:'host',pack:{playerItemSets:[set]}};
  await Promise.all([ensure(context,set.id),ensure(context,set.id)]);
  const first=(await host.ref('privateSessions/session').once('value')).val();
  expect(Object.keys(first.players)).toEqual(['guest','peer']);expect(new Set(Object.values(first.assignments[set.id])).size).toBe(2);
  await expect(ensure({...context,db:guest,uid:'guest'},set.id)).rejects.toThrow('Only the session host');
  await host.ref('games/session/privateGeneration').set(1);await host.ref('privateSessions/session').remove();
  await assertFails(host.ref('privateSessions/session').set(first));
  await ensure(context,set.id);expect((await host.ref('privateSessions/session/generation').once('value')).val()).toBe(1);
 });
});
