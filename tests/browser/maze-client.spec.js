const {test,expect}=require('@playwright/test');
test('maze controller saves only its puzzle when another puzzle was host-solved',async({page,context,request})=>{
 const cfg=await(await request.get('/__lab/config')).json(),headers={Authorization:'Bearer owner'},root='http://127.0.0.1:'+cfg.ports.database+'/.json?ns='+cfg.namespace;
 const before=await(await request.get(root,{headers})).json(),pack=await(await request.get('/stories/'+before.games[cfg.gameId].storyId+'/experience.json')).json();
 const item=pack.interactions.find(i=>i.maze),pool=pack.interactions.find(i=>i.type==='poolShot'),uids=cfg.players.slice(0,2).map(p=>p.uid);
 const guide=await context.newPage();
 try{
  await page.goto('/authenticated-dashboard.html?labTab=actions&labPlayer='+uids[1]);
  await expect.poll(()=>page.evaluate(()=>!!window.CooperativeMaze)).toBe(true);
  const maze=await page.evaluate(({item,uids})=>CooperativeMaze.start(item.maze,uids,Date.now(),'controller-regression'),{item,uids});
  const m=item.maze.mazes[0],direction=await page.evaluate(m=>CooperativeMaze.route(m,m.start)[0],m);
  const data=structuredClone(before),game=data.games[cfg.gameId];
  game.state.experience={stepId:pack.steps.find(s=>s.type==='exploration').id,startedAt:Date.now()};
  const legacyWin={solved:true,solvedBy:cfg.hostUid,solvedAt:1};
  game.state.tv={currentRoom:item.roomId,activeInteraction:item.id,puzzles:{[item.id]:maze,[pool.id]:legacyWin}};
  delete data.actionReceipts;
  await request.put(root,{headers,data});
  await page.reload();await guide.goto('/authenticated-dashboard.html?labTab=actions&labPlayer='+uids[0]);
  await expect(page.locator('.cooperative-maze')).toContainText('CONTROLLER');
  await expect(guide.locator('.cooperative-maze')).toContainText('GUIDE');
  const label={down:'↓ Down',up:'↑ Up',left:'← Left',right:'→ Right'}[direction];
  await page.getByRole('button',{name:label,exact:true}).click();
  await expect.poll(async()=>{const d=await(await request.get(root,{headers})).json();return d.games[cfg.gameId].state.tv.puzzles[item.id].revision;}).toBe(1);
  const after=await(await request.get(root,{headers})).json();expect(after.games[cfg.gameId].state.tv.puzzles[pool.id]).toEqual(legacyWin);
  await expect(guide.locator('.cooperative-maze')).not.toContainText('Could not save');
 }finally{await guide.close();await page.close();await request.put(root,{headers,data:before});}
});

