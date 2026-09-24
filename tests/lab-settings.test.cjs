const {test}=require('node:test');
const assert=require('node:assert/strict');
const net=require('node:net');
const path=require('node:path');
const {settings,assertPortsAvailable}=require('../dev-lab/settings.cjs');
test('tests cannot reuse the manual lab state, ports or Firebase namespace',()=>{
 const dev=settings('/checkout',{}),test=settings('/checkout',{LAB_MODE:'test'});
 assert.notEqual(dev.stateDir,test.stateDir);assert.notEqual(dev.project,test.project);
 assert.equal(test.persist,false);assert.equal(dev.persist,true);
 assert.equal(Object.values(dev.ports).some(port=>Object.values(test.ports).includes(port)),false);
 assert.notEqual(settings('/other',{}).stateDir,dev.stateDir);
 assert.notEqual(settings('/checkout',{LAB_PORT_OFFSET:'20'}).stateDir,dev.stateDir);
 assert.ok(dev.stateDir.startsWith(path.resolve('/checkout')));
 assert.throws(()=>settings('/checkout',{LAB_PORT_OFFSET:'bad'}));
 assert.throws(()=>settings('/checkout',{LAB_MODE:'production'}));
});
test('an occupied port fails before touching an existing emulator',async()=>{
 const server=net.createServer();await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 try{await assert.rejects(assertPortsAvailable({database:server.address().port}),/occupied/);}finally{await new Promise(resolve=>server.close(resolve));}
});
