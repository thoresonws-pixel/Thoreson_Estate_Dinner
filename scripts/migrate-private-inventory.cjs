// Trusted, explicit maintenance operation. Never called by the browser.
const fs=require('node:fs'),path=require('node:path');
const {parseArgs}=require('node:util');
const {Client}=require('firebase-tools/lib/apiv2');
const auth=require('firebase-tools/lib/auth');
const {migrate}=require('./private-inventory-migration.cjs');
function options(args){
 const {values}=parseArgs({args,options:{project:{type:'string'},check:{type:'boolean'},apply:{type:'boolean'}}});
 if(!/^[a-z][a-z0-9-]{4,61}[a-z0-9]$/.test(values.project||''))throw Error('Specify --project <firebase-project-id>.');
 if(values.check&&values.apply)throw Error('Use --check or --apply, not both.');
 return values;
}
async function run(args){
 const opt=options(args);
 await require('firebase-tools/lib/requireAuth').requireAuth({...auth.getGlobalDefaultAccount(),project:opt.project});
 const management=new Client({urlPrefix:'https://firebasedatabase.googleapis.com'});
 const instances=(await management.request({method:'GET',path:`/v1beta/projects/${opt.project}/locations/-/instances`})).body.instances||[];
 const active=instances.filter(i=>i.state==='ACTIVE');if(active.length!==1)throw Error('Expected exactly one active database in the selected project.');
 const db=new Client({urlPrefix:active[0].databaseUrl});
 const snapshot=await db.request({method:'GET',path:'/.json',headers:{'X-Firebase-ETag':'true'},skipLog:{resBody:true}});
 const original=snapshot.body||{},plan=migrate(original);
 console.log(`${opt.project}: ${plan.changed.length} games require migration; ${plan.items} personal items. No item contents are logged.`);
 if(opt.check&&plan.changed.length)throw Error('Legacy public inventories remain. Follow docs/PRIVATE_INVENTORY.md before deploying.');
 if(!opt.apply||!plan.changed.length)return;
 const etag=snapshot.response.headers.get('etag');if(!etag)throw Error('Database did not return an ETag; refusing an unconditional write.');
 const backupDir=path.resolve(__dirname,'../.player-lab-work/migrations');fs.mkdirSync(backupDir,{recursive:true});
 const backup=path.join(backupDir,opt.project+'-'+Date.now()+'.json');
 fs.writeFileSync(backup,JSON.stringify(original),{flag:'wx',mode:0o600});
 // A root compare-and-set preserves unrelated data and rejects concurrent changes.
 await db.request({method:'PUT',path:'/.json',headers:{'if-match':etag},body:plan.data,skipLog:{body:true,resBody:true}});
 console.log('Migration applied. Private local backup: '+backup);
}
if(require.main===module)run(process.argv.slice(2)).catch(error=>{console.error(error.message);process.exitCode=1;});
module.exports={options};
