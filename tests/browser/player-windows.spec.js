const {test,expect}=require('@playwright/test');
test('player windows support switching, roster-sized launches, blocked popups and pinned identities',async({page,context,request})=>{
 const config=await(await request.get('/__lab/config')).json();
 await page.goto('/');await page.locator('#playerWindows summary').click();
 const popupEvent=page.waitForEvent('popup');await page.locator('#openSwitcher').click();const switcher=await popupEvent;
 await expect(switcher.locator('#player')).toBeEnabled();await switcher.locator('#player').selectOption(config.players[1].uid);
 await expect(switcher.frameLocator('#phone').locator('#characterContent')).not.toBeEmpty();await switcher.close();
 // Model a popup blocker, retaining every attempted URL and reusable window name.
 await page.evaluate(()=>{window.popupAttempts=[];window.open=(url,name)=>{window.popupAttempts.push({url,name});return null;};});
 await page.locator('#openSeparate').click();const attempts=await page.evaluate(()=>window.popupAttempts);
 expect(attempts).toHaveLength(config.players.length);expect(new Set(attempts.map(a=>a.name)).size).toBe(config.players.length);
 expect(attempts.map(a=>new URL(a.url).searchParams.get('player'))).toEqual(config.players.map(p=>p.uid));
 await expect(page.locator('#windowFallback button')).toHaveCount(config.players.length);await expect(page.locator('#windowStatus')).toContainText('blocked');
 const first=await context.newPage(),second=await context.newPage();
 try{
  await first.goto(attempts[0].url);await second.goto(attempts[1].url);
  for(const [window,index]of [[first,0],[second,1]]){
   await expect(window.locator('#player')).toBeDisabled();await expect(window.locator('#player')).toHaveValue(config.players[index].uid);
   await expect(window.frameLocator('#phone').locator('#characterContent')).not.toBeEmpty();
   const uid=await window.locator('#phone').evaluate(frame=>frame.contentWindow.firebase.auth().currentUser.uid);expect(uid).toBe(config.players[index].uid);
  }
  await first.reload();await expect(first.locator('#player')).toHaveValue(config.players[0].uid);await expect(second.locator('#player')).toHaveValue(config.players[1].uid);
 }finally{await first.close();await second.close();}
});
