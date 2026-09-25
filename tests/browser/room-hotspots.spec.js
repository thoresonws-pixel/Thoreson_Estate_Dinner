const {test,expect}=require('@playwright/test');
test('music artwork opens existing inspections and keeps contents gated',async({page,request})=>{
 const cfg=await(await request.get('/__lab/config')).json(),headers={Authorization:'Bearer owner'},root='http://127.0.0.1:'+cfg.ports.database+'/.json?ns='+cfg.namespace;
 const before=await(await request.get(root,{headers})).json();
 try{
 const data=structuredClone(before),g=data.games[cfg.gameId];g.state.experience={stepId:'act2_investigation',startedAt:Date.now()};g.state.tv={currentRoom:'music'};await request.put(root,{headers,data});
 await page.goto('/estate-tv.html?id='+cfg.gameId+'&labPlayer='+cfg.hostUid);
 const piano=page.locator('.room-hotspot[data-interaction-id="piano_melody"]'),cabinet=page.locator('.room-hotspot[data-interaction-id="harmonic_cabinet"]');await expect(piano).toBeVisible();await expect(cabinet).toBeVisible();await expect(page.locator('#objectList')).toBeHidden();
 await page.getByRole('button',{name:'Show things I can inspect'}).click();await expect(page.locator('.room-hotspots')).toHaveClass(/reveal/);
 await cabinet.click();await expect(page.locator('#interactionDialog')).toContainText('Locked.');await expect(page.locator('#objectList')).not.toContainText('William’s recording device');
 await page.keyboard.press('Escape');await piano.click();await expect(page.locator('#interactionDialog')).toBeVisible();await expect(page.locator('#objectList')).toContainText('Sheet music:');
 await expect.poll(async()=>{const d=await(await request.get(root,{headers})).json();return d.games[cfg.gameId].state.tv.activeInteraction;}).toBe('piano_melody');
 await page.keyboard.press('Escape');await page.setViewportSize({width:900,height:650});await expect(cabinet).toBeVisible();const r=await cabinet.boundingBox();expect(r.width).toBeGreaterThan(30);await cabinet.click();await expect(page.locator('#interactionDialog')).toContainText('Locked.');
 }finally{await page.close();await request.put(root,{headers,data:before});}
});
test('hotspot renderer uses alternate artwork proportions and object identities',async({page})=>{
 await page.goto('/');await page.addScriptTag({url:'/room-hotspots.js'});
 await page.evaluate(()=>{const root=document.createElement('div');root.style.cssText='position:relative;width:600px;height:400px';document.body.replaceChildren(root);window.targets=RoomHotspots.mount(root);targets.update({image:'data:image/svg+xml,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"/>')},[{interactionId:'space_console',label:'Navigation console',rect:[10,20,30,40]}],id=>window.selected=id);});
 const b=page.getByRole('button',{name:'Inspect Navigation console'});await expect(b).toBeVisible();await expect.poll(async()=>Math.round((await b.boundingBox()).width)).toBe(120);await b.click();expect(await page.evaluate(()=>selected)).toBe('space_console');await page.evaluate(()=>targets.dispose());await expect(b).toHaveCount(0);
});
