const {test,expect}=require('@playwright/test');
test('host discovery releases a private memory to its phone in real time',async({page,request})=>{
 const cfg=await(await request.get('/__lab/config')).json(),headers={Authorization:'Bearer owner'};
 const root='http://127.0.0.1:'+cfg.ports.database+'/.json?ns='+cfg.namespace;
 const before=await(await request.get(root,{headers})).json(),storyId=before.games[cfg.gameId].storyId;
 const story=await(await request.get('/stories/'+storyId+'/package.json')).json();
 const [characterId,character]=Object.entries(story.content.characters).find(([,c])=>c.memories?.some(m=>m.unlockedBy||m.whenInspected));
 const entry=character.memories.find(m=>m.unlockedBy||m.whenInspected),uid=cfg.players.find(p=>p.characterId===characterId).uid;
 const data=structuredClone(before);data.storyMemoryText[storyId][entry.privateTextId].text='Private browser test memory';data.games[cfg.gameId].state={experience:before.games[cfg.gameId].state.experience,tv:{}};
 const hostPage=await page.context().newPage();
 try{
  await request.put(root,{headers,data});
  await page.goto('/authenticated-dashboard.html?labPlayer='+uid);await expect(page.locator('#actionMemories')).not.toContainText('Private browser test memory');
  await hostPage.goto('/estate-tv.html?id='+cfg.gameId+'&labPlayer='+cfg.hostUid);
  await expect.poll(()=>hostPage.evaluate(()=>typeof window.stopMemoryAuthority)).toBe('function');
  await hostPage.evaluate(async({gameId,entry})=>{const path=entry.whenInspected?'state/tv/inspected/'+entry.whenInspected:'state/memoryTriggers/'+entry.unlockedBy;await firebase.database().ref('games/'+gameId+'/'+path).set(entry.whenInspected?{at:Date.now()}:true);},{gameId:cfg.gameId,entry});
  await expect(page.locator('#actionMemories')).toContainText('Private browser test memory');
  const peer=cfg.players.find(p=>p.uid!==uid);await page.goto('/authenticated-dashboard.html?labPlayer='+peer.uid);
  await expect(page.locator('#actionMemories')).not.toContainText('Private browser test memory');
 }finally{await hostPage.close();await page.close();await request.put(root,{headers,data:before});}
});
