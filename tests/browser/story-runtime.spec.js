const {test,expect}=require('@playwright/test');
const flow={version:1,steps:[{id:'briefing',type:'title',next:'signal'},{id:'signal',type:'placeholder',durationSeconds:600,next:'arrival'},{id:'arrival',type:'exploration'}]};

test('real clients serialize story transitions and recover paused state after disconnect',async({page,browser,request})=>{
 const config=await(await request.get('/__lab/config')).json();expect(config.mode).toBe('test');
 const gameId='ci_runtime_session';
 const url=`http://127.0.0.1:${config.ports.database}/games/${gameId}.json?ns=${config.namespace}`;
 const headers={Authorization:'Bearer owner'};
 const otherContext=await browser.newContext();const other=await otherContext.newPage();
 const setup=async p=>{
  await p.goto(`/estate-tv.html?id=${config.gameId}&labPlayer=${config.hostUid}`);
  await p.waitForFunction(()=>window.playerLabReady&&window.StoryRuntime);
  await p.evaluate(()=>window.playerLabReady);
  await p.evaluate(({gameId,flow})=>{
   window.testErrors=[];
   window.testRuntime=StoryRuntime.connect(firebase.database(),gameId,flow,v=>window.testView=v,e=>testErrors.push(e.message));
  },{gameId,flow});
  await p.waitForFunction(()=>window.testView?.connected);
 };
 try{
  expect((await request.put(url,{headers,data:{storyId:'alternate-orbital-story',createdBy:config.hostUid,state:{experience:{stepId:'briefing',startedAt:1}}}})).ok()).toBeTruthy();
  await setup(page);await setup(other);
  const results=await Promise.all([page.evaluate(()=>testRuntime.advance()),other.evaluate(()=>testRuntime.advance())]);
  expect(results.filter(Boolean)).toHaveLength(1);
  await other.waitForFunction(()=>testView.step.id==='signal');
  expect(await page.evaluate(()=>testRuntime.setPaused(true))).toBe(true);
  await other.waitForFunction(()=>testView.state?.pausedAt!=null);
  const remaining=await other.evaluate(()=>testView.remaining);
  await page.evaluate(()=>firebase.database().goOffline());
  await page.waitForFunction(()=>!testView.connected);
  expect(await page.evaluate(()=>testRuntime.setPaused(false))).toBe(false);
  // A fresh client receives the paused deadline; disconnect did not enqueue a resume.
  await other.reload();await other.waitForFunction(()=>window.playerLabReady&&window.StoryRuntime);await other.evaluate(()=>window.playerLabReady);
  await other.evaluate(({gameId,flow})=>{window.testRuntime=StoryRuntime.connect(firebase.database(),gameId,flow,v=>window.testView=v);},{gameId,flow});
  await other.waitForFunction(()=>testView?.connected&&testView.state?.pausedAt!=null);
  expect(await other.evaluate(()=>testView.remaining)).toBe(remaining);
  await page.evaluate(()=>firebase.database().goOnline());await page.waitForFunction(()=>testView.connected);
  expect(await page.evaluate(()=>testRuntime.setPaused(false))).toBe(true);
  await other.waitForFunction(()=>testView.state?.pausedAt==null);
  expect(await other.evaluate(()=>testView.remaining)).toBeLessThanOrEqual(remaining);
  expect(await page.evaluate(()=>testErrors)).toEqual([]);
  await page.evaluate(()=>testRuntime.dispose());
  expect(await page.evaluate(()=>testRuntime.advance())).toBe(false);
 }finally{await otherContext.close();await request.delete(url,{headers});}
});

test('timed first step starts even when ensureStarted precedes initial database snapshot',async({page,request})=>{
 const config=await(await request.get('/__lab/config')).json();
 await page.goto(`/estate-tv.html?id=${config.gameId}&labPlayer=${config.hostUid}`);
 await page.waitForFunction(()=>window.playerLabReady&&window.StoryRuntime);await page.evaluate(()=>window.playerLabReady);
 const gameId='ci_runtime_initial';const url=`http://127.0.0.1:${config.ports.database}/games/${gameId}.json?ns=${config.namespace}`;
 const headers={Authorization:'Bearer owner'};
 await request.put(url,{headers,data:{storyId:'alternate-clock-story',createdBy:config.hostUid}});
 try{
  const result=await page.evaluate(async id=>{
   const flow={version:1,steps:[{id:'countdown',type:'placeholder',durationSeconds:60}]};
   const runtime=StoryRuntime.connect(firebase.database(),id,flow,()=>{});
   const started=await runtime.ensureStarted();runtime.dispose();return started;
  },gameId);
  expect(result).toBe(true);
  const saved=await(await request.get(url,{headers})).json();
  expect(saved.state.experience.schemaVersion).toBe(1);expect(saved.state.experience.stepId).toBe('countdown');
 }finally{await request.delete(url,{headers});}
});
