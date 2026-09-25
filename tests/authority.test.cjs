const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const {buildDevelopmentRules}=require('../scripts/dev-rules.cjs');
const {options}=require('../scripts/admin-access.cjs');
test('administrator operator tooling requires an explicit project, account and operation',()=>{
 assert.throws(()=>options([]));
 assert.throws(()=>options(['--project','example-project','--grant']));
 assert.throws(()=>options(['--project','example-project','--email','a@example.test','--grant','--revoke']));
 assert.throws(()=>options(['--project','example-project','--check','--apply']));
 assert.throws(()=>options(['--project','example-project','--uid','bad/path','--grant']));
 const dry=options(['--project','example-project','--email','a@example.test','--grant']);assert.equal(dry.apply,undefined);
 assert.equal(options(['--project','example-project','--check']).check,true);
});
test('checked-in development rules match generation from production rules',()=>{
 const before=fs.readFileSync('config/database.dev.rules.json','utf8');
 const generated=buildDevelopmentRules(JSON.parse(fs.readFileSync('database.rules.json','utf8')));
 assert.deepEqual(generated,JSON.parse(before),'Regenerate development rules whenever base rules change.');
});
