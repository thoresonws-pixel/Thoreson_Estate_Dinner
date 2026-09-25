const {test,expect}=require('@playwright/test');
test('gear preserves partial drags and shows dismissible story warning',async({page})=>{
 await page.goto('/');await page.addScriptTag({url:'/maze-winding.js'});
 await page.evaluate(()=>{window.turns=0;const root=document.createElement('div');root.style.width='290px';document.body.replaceChildren(root);window.gear=MazeWinding.mount(root,{gearImage:'/stories/thoreson_estate_dinner/assets/winding-gear-v1.png',warning:{speakerName:'Test inventor',portrait:'/stories/thoreson_estate_dinner/assets/william-warning-v1.png',text:'Too much winding!'}},async()=>{window.turns++;window.gear.warn();window.gear.update(10000);return true;});});
 const handle=page.getByRole('button',{name:/Wind gear clockwise/});
 const wheel=await handle.locator('..').locator('..').boundingBox(),cx=wheel.x+wheel.width/2,cy=wheel.y+wheel.height/2;
 // Two separate drags accumulate a full turn.
 for(let part=0;part<2;part++){const b=await handle.boundingBox(),x=b.x+b.width/2,y=b.y+b.height/2,r=Math.hypot(x-cx,y-cy),start=Math.atan2(y-cy,x-cx);await page.mouse.move(x,y);await page.mouse.down();for(let i=1;i<=24;i++)await page.mouse.move(cx+r*Math.cos(start+Math.PI*i/24+.002),cy+r*Math.sin(start+Math.PI*i/24+.002));await page.mouse.up();}
 await expect(page.getByRole('dialog')).toContainText('Too much winding!');expect(await page.evaluate(()=>window.turns)).toBe(1);await page.getByRole('button',{name:'Understood'}).click();await expect(handle).toBeDisabled();
 await page.evaluate(()=>gear.update(0));await handle.focus();for(let i=0;i<4;i++)await page.keyboard.press('ArrowRight');await expect(page.getByRole('dialog')).toBeVisible();expect(await page.evaluate(()=>window.turns)).toBe(2);
 await page.evaluate(()=>gear.dispose());await expect(page.getByRole('dialog')).toHaveCount(0);
});
