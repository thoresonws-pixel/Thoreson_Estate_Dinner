const {test,expect}=require('@playwright/test');
test('character switching preserves tab and isolates private inventory',async({page,request})=>{
 const config=await(await request.get('/__lab/config')).json();
 expect(config.mode).toBe('test');
 const database='http://127.0.0.1:'+config.ports.database;
 const pack=await(await request.get('/stories/'+config.gameId.replace(/^lab_/,'')+'/experience.json')).json();
 const url=database+'/games/'+config.gameId+'/state/experience.json?ns='+config.namespace,headers={Authorization:'Bearer owner'};
 const before=await(await request.get(url,{headers})).json();
 const privateURL=database+'/privateSessions/'+config.gameId+'.json?ns='+config.namespace;
 const privateBefore=await(await request.get(privateURL,{headers})).json();
 try{
  await request.put(url,{headers,data:{stepId:pack.steps.find(s=>s.type==='exploration').id,startedAt:Date.now()}});
  await request.put(privateURL,{headers,data:{schemaVersion:1,generation:0,players:{[config.players[0].uid]:{inventory:{ci_private_item:{name:'Private CI item',text:'Only the first identity should see this.'}}}}}});
  await page.goto('/');const phone=page.frameLocator('#phone');
  await page.locator('#player').selectOption(config.players[0].uid);
  await expect(phone.locator('#actions')).toBeVisible();await phone.getByRole('link',{name:'Inventory',exact:true}).click();await expect(phone.locator('#personalInventory')).toContainText('Private CI item');
  await page.locator('#player').selectOption(config.players[1].uid);await expect(phone.locator('#inventory')).toBeVisible();await expect(phone.locator('#characterContent')).not.toBeEmpty();await expect(phone.locator('#personalInventory')).not.toContainText('Private CI item');
  await page.getByRole('button',{name:'All players',exact:true}).click();await expect(page.locator('#playerGrid iframe')).toHaveCount(config.players.length);
  for(let i=0;i<config.players.length;i++){const frame=page.frameLocator('#playerGrid iframe').nth(i);await expect(frame.locator('#actions')).toBeVisible();const actual=await page.locator('#playerGrid iframe').nth(i).evaluate(el=>el.contentWindow.firebase.auth().currentUser.uid);expect(actual).toBe(config.players[i].uid);}
 }finally{await request.put(privateURL,{headers,data:privateBefore});await request.put(url,{headers,data:before});}
});
test('reset clears only the selected lab game and its private inventory together',async({page,request})=>{
 const config=await(await request.get('/__lab/config')).json(),headers={Authorization:'Bearer owner'};
 const root='http://127.0.0.1:'+config.ports.database+'/.json?ns='+config.namespace;
 const original=await(await request.get(root,{headers})).json();
 try{
  const data=structuredClone(original);data.privateSessions||={};data.privateSessions[config.gameId]={schemaVersion:1,generation:0,players:{[config.players[0].uid]:{inventory:{private:{name:'Reset me'}}}}};
  data.privateSessions.other={schemaVersion:1,generation:0,players:{elsewhere:{inventory:{keep:{name:'Keep me'}}}}};data.games.other={createdBy:'someone',storyId:'other'};
  await request.put(root,{headers,data});await page.goto('/');
  const response=await page.evaluate(()=>fetch('/__lab/progress',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'reset'})}).then(async r=>({status:r.status,body:await r.json()})));
  expect(response.status).toBe(200);
  const after=await(await request.get(root,{headers})).json();
  expect(after.privateSessions?.[config.gameId]).toBeUndefined();expect(after.privateSessions.other).toEqual(data.privateSessions.other);expect(after.games.other).toEqual(data.games.other);
  expect(after.games[config.gameId].privateGeneration).toBe((data.games[config.gameId].privateGeneration||0)+1);
 }finally{await request.put(root,{headers,data:original});}
});
