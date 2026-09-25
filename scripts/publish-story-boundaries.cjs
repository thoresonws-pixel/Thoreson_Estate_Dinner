// Explicit trusted publishing for private story text and server action policies.
const path=require('node:path'),{isDeepStrictEqual,parseArgs}=require('node:util');
const {Client}=require('firebase-tools/lib/apiv2'),auth=require('firebase-tools/lib/auth');
const {catalog}=require('./story-boundaries.cjs');
async function run(){
 const {values:o}=parseArgs({options:{project:{type:'string'},apply:{type:'boolean'},check:{type:'boolean'}}});
 if(!/^[a-z][a-z0-9-]{4,61}[a-z0-9]$/.test(o.project||'')||o.apply&&o.check)throw Error('Specify --project and at most one of --apply/--check.');
 await require('firebase-tools/lib/requireAuth').requireAuth({...auth.getGlobalDefaultAccount(),project:o.project});
 const management=new Client({urlPrefix:'https://firebasedatabase.googleapis.com'});
 const instances=(await management.request({method:'GET',path:`/v1beta/projects/${o.project}/locations/-/instances`})).body.instances||[];
 const active=instances.filter(i=>i.state==='ACTIVE');if(active.length!==1)throw Error('Expected one active database.');
 const db=new Client({urlPrefix:active[0].databaseUrl}),entries=catalog(path.resolve(__dirname,'..')),updates={};
 // RTDB removes empty maps. Compare canonical serialized server representations.
 const canonical=v=>{if(Array.isArray(v))return v.map(canonical);if(v&&typeof v==='object'){const entries=Object.entries(v).map(([k,x])=>[k,canonical(x)]).filter(([,x])=>x!==null);return entries.length?Object.fromEntries(entries):null;}return v;};
 for(const [id,p]of Object.entries(entries))for(const [root,value]of [['storyMemoryText',p.memories],['actionPolicies',p.policies]]){
  const key=root+'/'+id,previous=(await db.request({method:'GET',path:'/'+key+'.json',skipLog:{resBody:true}})).body;
  if(!isDeepStrictEqual(previous,canonical(value)))updates[key]=canonical(value);
 }
 console.log(Object.keys(updates).length+' story sections need publication in '+o.project+'.');
 if(o.check&&Object.keys(updates).length)throw Error('Publish reviewed story boundaries during the release maintenance window first.');
 if(o.apply&&Object.keys(updates).length)await db.request({method:'PATCH',path:'/.json',body:updates,skipLog:{body:true,resBody:true}});
}
run().catch(e=>{console.error(e.message);process.exitCode=1;});
