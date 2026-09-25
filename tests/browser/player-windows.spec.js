const {test,expect}=require('@playwright/test');
test('one popup displays every player concurrently while switcher stays available',async({page,context,request})=>{
 const config=await(await request.get('/__lab/config')).json();
 await page.goto('/');await page.locator('#playerWindows summary').click();
 let popupEvent=page.waitForEvent('popup');await page.locator('#openSwitcher').click();const switcher=await popupEvent;
 await expect(switcher.locator('#player')).toBeEnabled();await switcher.locator('#player').selectOption(config.players[1].uid);
 await expect(switcher.frameLocator('#phone').locator('#characterContent')).not.toBeEmpty();await switcher.close();
 const before=context.pages().length;
 popupEvent=page.waitForEvent('popup');await page.locator('#openGrid').click();const grid=await popupEvent;
 try{
  await expect(grid.locator('#playerGrid iframe')).toHaveCount(config.players.length);
  expect(context.pages()).toHaveLength(before+1);
  await expect(grid.locator('.tv')).toBeHidden();await expect(grid.locator('#togglePlayers')).toBeHidden();
  for(let i=0;i<config.players.length;i++){
   const frame=grid.frameLocator('#playerGrid iframe').nth(i);
   await expect(frame.locator('#actions')).toBeVisible();
   expect(await grid.locator('#playerGrid iframe').nth(i).evaluate(el=>el.contentWindow.firebase.auth().currentUser.uid)).toBe(config.players[i].uid);
  }
  await grid.setViewportSize({width:1440,height:900});
  const cards=grid.locator('.player-card');const first=await cards.nth(0).boundingBox(),second=await cards.nth(1).boundingBox(),last=await cards.last().boundingBox();
  expect(second.y).toBe(first.y);expect(second.x).toBeGreaterThan(first.x);expect(last.y).toBeGreaterThan(first.y);
  await grid.reload();await expect(grid.locator('#playerGrid iframe')).toHaveCount(config.players.length);
 }finally{await grid.close();}
});
