const {test,expect}=require('@playwright/test');
test('phone completion retries share one receipt and reject offline saving',async({page,request})=>{
 const cfg=await(await request.get('/__lab/config')).json(),headers={Authorization:'Bearer owner'};
 const root='http://127.0.0.1:'+cfg.ports.database+'/.json?ns='+cfg.namespace;
 const before=await(await request.get(root,{headers})).json();
 const pack=await(await request.get('/stories/'+before.games[cfg.gameId].storyId+'/experience.json')).json();
 const item=pack.interactions.find(i=>i.type==='poolShot'),uid=cfg.players[0].uid;
 const data=structuredClone(before),game=data.games[cfg.gameId],policy=data.actionPolicies[game.storyId][item.id];
 game.state.experience={stepId:Object.keys(policy.allowedSteps)[0],revision:7,startedAt:Date.now()};game.state.tv={currentRoom:item.roomId,activeInteraction:item.id};
 data.privateSessions||={};data.privateSessions[cfg.gameId]={schemaVersion:1,generation:0,players:{[uid]:{inventory:{[policy.requiredItem]:{name:'Required test item'}}}}};
 try{
  await request.put(root,{headers,data});await page.goto('/authenticated-dashboard.html?labPlayer='+uid);
  await expect.poll(()=>page.evaluate(()=>!!window.GameActions&&!!firebase.auth().currentUser)).toBe(true);
  const result=await page.evaluate(async({gameId,uid,item,proof})=>{
   const db=firebase.database(),args={db,gameId,uid,item,generation:0,revision:7,proof};
   await new Promise(resolve=>db.ref('.info/connected').on('value',function connected(s){if(s.val()){db.ref('.info/connected').off('value',connected);resolve();}}));
   await Promise.all([GameActions.completePool(args),GameActions.completePool(args)]);
   const first=(await db.ref('actionReceipts/'+gameId+'/'+item.id).once('value')).val();
   await GameActions.completePool(args);const retry=(await db.ref('actionReceipts/'+gameId+'/'+item.id).once('value')).val();
   db.goOffline();let offline='';try{await GameActions.completePool(args);}catch(e){offline=e.message;}db.goOnline();
   return {first,retry,offline};
  },{gameId:cfg.gameId,uid,item,proof:policy.sequence});
  expect(result.retry).toEqual(result.first);expect(result.offline).toContain('Reconnect');
  const after=await(await request.get(root,{headers})).json();expect(after.games[cfg.gameId].state.tv.puzzles[item.id].solvedBy).toBe(uid);
 }finally{await page.close();await request.put(root,{headers,data:before});}
});
