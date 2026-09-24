const {test,expect}=require('@playwright/test');
const fs=require('node:fs');
const {initializeTestEnvironment,assertFails,assertSucceeds}=require('@firebase/rules-unit-testing');

for(const variant of ['production','development']) {
 test.describe(variant+' database authority',()=>{
  let env,guest,admin,host,outsider;
  test.beforeAll(async({request})=>{
   const lab=await(await request.get('/__lab/config')).json();expect(lab.mode).toBe('test');
   env=await initializeTestEnvironment({projectId:'demo-authority-'+variant,database:{host:'127.0.0.1',port:lab.ports.database,rules:fs.readFileSync(variant==='production'?'database.rules.json':'config/database.dev.rules.json','utf8')}});
   guest=env.authenticatedContext('guest',{email:'guest@example.test'}).database();
   admin=env.authenticatedContext('operator',{email:'operator@example.test'}).database();
   host=env.authenticatedContext('host',{email:'host@example.test'}).database();
   outsider=env.authenticatedContext('outsider',{email:'outsider@example.test'}).database();
  });
  test.beforeEach(async()=>{
   await env.withSecurityRulesDisabled(async context=>context.database().ref().set({
    platformAdmins:{operator:true},devMembers:{guest:true,host:true,operator:true,outsider:true},
    users:{guest:{displayName:'Guest',role:'player'},operator:{role:'player'},host:{role:'player'},outsider:{role:'admin'}},
    adminInvites:{oldInvite:{recipient:'Guest',used:false}},hostAccess:{host:true},
    games:{session:{createdBy:'host',storyId:'alternate-voyage',unlockId:'fixture',gameMode:'standard',players:{guest:{characterId:'navigator'}},state:{experience:{schemaVersion:1,revision:3,stepId:'arrival',startedAt:10},tv:{inventory:{}}}}}
   }));
  });
  test.afterAll(async()=>{await env?.cleanup();});

  test('profile edits cannot create authority, including whole-record and multi-path writes',async()=>{
   await assertSucceeds(guest.ref('users/guest/displayName').set('Updated name'));
   await assertFails(guest.ref('users/guest/role').set('admin'));
   await assertFails(guest.ref('users/guest').set({displayName:'Forged',role:'admin'}));
   await assertFails(guest.ref().update({'users/guest/role':'admin','venues/stolen':{name:'Forged'}}));
   await assertFails(outsider.ref('venues/stolen').set({name:'Forged using legacy role'}));
   await assertFails(outsider.ref('users/host').once('value'));
   await assertFails(guest.ref('hostAccess/guest').set(true));
   await assertFails(guest.ref('hostAccess').once('value'));
  });

  test('administrator registry is readable by self but only trusted tooling can change it',async()=>{
   await assertSucceeds(guest.ref('platformAdmins/guest').once('value'));
   await assertFails(guest.ref('platformAdmins').once('value'));
   await assertFails(guest.ref('platformAdmins/guest').set(true));
   await assertFails(admin.ref('platformAdmins/guest').set(true));
   await assertSucceeds(admin.ref('venues/approved').set({name:'Approved'}));
   await assertSucceeds(admin.ref('users/host').once('value'));
   await assertFails(guest.ref('adminInvites').once('value'));
   await assertFails(env.unauthenticatedContext().database().ref('adminInvites/oldInvite').once('value'));
   await env.withSecurityRulesDisabled(async context=>context.database().ref('platformAdmins/operator').remove());
   // Revocation takes effect without needing to refresh the Auth token.
   await assertFails(admin.ref('venues/afterRevocation').set({name:'Denied'}));
  });

  test('only session host may change or remove story progression, including ancestor writes',async()=>{
   await assertSucceeds(host.ref('games/session/state/experience/stepId').set('search'));
   for(const db of [guest,outsider,admin]){
    await assertFails(db.ref('games/session/state/experience/stepId').set('ending'));
    await assertFails(db.ref('games/session/state/experience/pausedAt').set(20));
    await assertFails(db.ref('games/session/state/experience').remove());
    await assertFails(db.ref('games/session/state').remove());
    await assertFails(db.ref('games/session').remove());
   }
   await assertSucceeds(guest.ref('games/session/state/tv/inventory/shared_item').set({name:'Discovered document'}));
   await assertSucceeds(host.ref('games/session/state/experience').set({schemaVersion:1,revision:4,stepId:'search',startedAt:20,pausedAt:30}));
   await assertSucceeds(host.ref('games/session/state/experience').remove());
   await assertFails(guest.ref('games/session/state/experience').set({unknownField:'cannot create malformed progress'}));
   await assertSucceeds(host.ref('games/session').remove());
  });

  test('development allowlist and server-managed access flags cannot be self-assigned',async()=>{
   await assertFails(guest.ref('developerAccess/guest').set(true));
   await assertFails(guest.ref('devMembers/guest').set(true));
   if(variant==='development'){
    await assertFails(guest.ref('games/nonexistent/players/guest').set({characterId:'invented'}));
    const stranger=env.authenticatedContext('not-a-teammate').database();
    await assertFails(stranger.ref('users/not-a-teammate').set({role:'player'}));
    await assertFails(stranger.ref('games/session').once('value'));
   }
  });
 });
}
