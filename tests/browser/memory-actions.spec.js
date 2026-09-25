const {test,expect}=require('@playwright/test'),fs=require('node:fs');
const {initializeTestEnvironment,assertFails,assertSucceeds}=require('@firebase/rules-unit-testing');
for(const variant of ['production','development'])test.describe(variant+' memory and action boundaries',()=>{
 let env,host,guest,peer,developer;
 test.beforeAll(async({request})=>{const lab=await(await request.get('/__lab/config')).json();env=await initializeTestEnvironment({projectId:'demo-boundaries-'+variant,database:{host:'127.0.0.1',port:lab.ports.database,rules:fs.readFileSync(variant==='production'?'database.rules.json':'config/database.dev.rules.json','utf8')}});[host,guest,peer,developer]=['host','guest','peer','developer'].map(uid=>env.authenticatedContext(uid,{email_verified:true}).database());});
 test.beforeEach(async()=>env.withSecurityRulesDisabled(async c=>c.database().ref().set({
  users:{host:{currentGameId:'session'},guest:{currentGameId:'session'},peer:{currentGameId:'session'},developer:{currentGameId:'session'}},
  devMembers:{host:true,guest:true,peer:true,developer:true},developerAccess:{developer:{inspectAllCharacters:true}},
  games:{session:{createdBy:'host',storyId:'voyage',players:{guest:{characterId:'pilot'},peer:{characterId:'navigator'}},state:{experience:{stepId:'search',revision:2},tv:{currentRoom:'saloon',activeInteraction:'pool'}}}},
  privateSessions:{session:{schemaVersion:1,generation:0,players:{guest:{inventory:{compass:{name:'Compass'}}}}}},
  storyMemoryText:{voyage:{remember:{characterId:'pilot',text:'Secret rendezvous'}}},
  actionPolicies:{voyage:{pool:{kind:'poolShot',roomId:'saloon',allowedSteps:{search:true},requiredItem:'compass',proof:'top-left>bottom-right'},piano:{kind:'noteSequence',roomId:'saloon',allowedSteps:{search:true},pages:{song:{bookletId:'book',requiresInventory:'sheet'}}}}}
 })));
 test.afterAll(async()=>env?.cleanup());
 test('memory requires a permanent character claim and a host-issued current-generation grant',async()=>{
  const path='storyMemoryText/voyage/remember';await assertFails(guest.ref(path).once('value'));
  await assertFails(guest.ref('characterClaims/session/guest').set('navigator'));
  await guest.ref('characterClaims/session/guest').set('pilot');await assertFails(guest.ref(path).once('value'));
  await assertFails(guest.ref('memoryGrants/session/remember').set({generation:0,characterId:'pilot'}));
  await assertFails(guest.ref('games/session/state/tv/inspected/radio').set({at:1}));
  await assertFails(guest.ref('games/session/state/tv/inventory/forged').set({source:'radio'}));
  await host.ref('memoryGrants/session/remember').set({generation:0,characterId:'pilot'});
  expect((await assertSucceeds(guest.ref(path).once('value'))).val().text).toBe('Secret rendezvous');
  await peer.ref('characterClaims/session/peer').set('navigator');await assertFails(peer.ref(path).once('value'));
  await assertFails(guest.ref('storyMemoryText/voyage').once('value'));
  await assertSucceeds(developer.ref(path).once('value'));
  await assertFails(guest.ref('characterClaims/session/guest').remove());
  await assertFails(guest.ref('games/session/players/guest/characterId').set('navigator'));
  await guest.ref('games/session/players/guest').remove();await assertFails(guest.ref('games/session/players/guest').set({characterId:'navigator'}));
  await assertFails(guest.ref(path).once('value'));
  await host.ref('games/session/privateGeneration').set(1);await assertFails(developer.ref(path).once('value'));
 });
 test('pool result enforces player, answer, phase and reset generation; retries cannot overwrite its receipt',async()=>{
  const result={uid:'guest',generation:0,revision:2,proof:'top-left>bottom-right',solvedAt:{'.sv':'timestamp'}},ref=guest.ref('actionReceipts/session/pool');
  await assertFails(guest.ref('games/session/state/tv/puzzles/pool').set({solved:true,solvedBy:'guest',solvedAt:1}));
  await assertFails(ref.set({...result,proof:'wrong'}));await assertFails(ref.set({...result,uid:'peer'}));await assertFails(ref.set({...result,generation:1}));
  await assertFails(peer.ref('actionReceipts/session/pool').set({...result,uid:'peer'}));
  await host.ref('games/session/state/experience/pausedAt').set(1);await assertFails(ref.set(result));await host.ref('games/session/state/experience/pausedAt').remove();
  await assertFails(guest.ref('games/session/state/tv/currentRoom').set('elsewhere'));
  await assertSucceeds(ref.set(result));const receipt=(await ref.once('value')).val();
  await assertFails(ref.set(result));await assertFails(ref.remove());
  await assertSucceeds(guest.ref('games/session/state/tv/puzzles/pool').set({solved:true,solvedBy:'guest',solvedAt:receipt.solvedAt}));
  await host.ref('games/session/privateGeneration').set(1);await assertFails(guest.ref('games/session/state/tv/puzzles/pool').set({solved:true,solvedBy:'guest',solvedAt:receipt.solvedAt}));
 });
 test('piano requires discovered music and preserves the first reservation until host release',async()=>{
  const selection={id:'request-a',bookletId:'book',pageId:'song',interactionId:'piano',selectedBy:'guest',revision:2,privateGeneration:0},ref=guest.ref('games/session/state/tv/songSelection');
  await assertFails(ref.set(selection));await host.ref('games/session/state/tv/activeInteraction').set('piano');await assertFails(ref.set(selection));
  await host.ref('games/session/state/tv/inventory/sheet').set({name:'Sheet'});
  await assertSucceeds(ref.set(selection));await assertFails(peer.ref('games/session/state/tv/songSelection').set({...selection,id:'request-b',selectedBy:'peer'}));
  await assertFails(ref.remove());await host.ref('games/session/state/tv/songSelection').remove();await assertSucceeds(peer.ref('games/session/state/tv/songSelection').set({...selection,id:'request-b',selectedBy:'peer'}));
 });
});
