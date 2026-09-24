// Trusted operator tool. Browser clients cannot write platform administrator grants.
const {parseArgs}=require('node:util');
const {randomUUID}=require('node:crypto');
const {Client}=require('firebase-tools/lib/apiv2');
const auth=require('firebase-tools/lib/auth');

function options(args) {
 const {values}=parseArgs({args,options:{project:{type:'string'},email:{type:'string'},uid:{type:'string'},grant:{type:'boolean'},revoke:{type:'boolean'},apply:{type:'boolean'},check:{type:'boolean'}}});
 if(!/^[a-z][a-z0-9-]{4,61}[a-z0-9]$/.test(values.project||''))throw Error('Specify --project <firebase-project-id>.');
 if(values.check){if(values.email||values.uid||values.grant||values.revoke||values.apply)throw Error('--check cannot be combined with account changes.');return values;}
 if(!!values.email===!!values.uid||!!values.grant===!!values.revoke)throw Error('Specify exactly one of --email/--uid and one of --grant/--revoke. Omit --apply for a dry run.');
 if(values.uid&&(/[.#$\[\]/]/.test(values.uid)||values.uid.length>128))throw Error('Invalid UID.');
 if(values.email&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email))throw Error('Invalid email address.');
 return values;
}
async function run(args) {
 const opt=options(args);
 await require('firebase-tools/lib/requireAuth').requireAuth({...auth.getGlobalDefaultAccount(),project:opt.project});
 // Resolve the database through the project's API rather than trusting an arbitrary URL.
 const management=new Client({urlPrefix:'https://firebasedatabase.googleapis.com'});
 const instances=(await management.request({method:'GET',path:`/v1beta/projects/${opt.project}/locations/-/instances`})).body.instances||[];
 const active=instances.filter(i=>i.state==='ACTIVE');
 if(active.length!==1)throw Error('Expected exactly one active database in this project. Select/provision the database explicitly before using this tool.');
 const db=new Client({urlPrefix:active[0].databaseUrl});
 if(opt.check){const grants=(await db.request({method:'GET',path:'/platformAdmins.json'})).body||{};if(!Object.values(grants).some(v=>v===true))throw Error('No trusted administrator is configured. Use scripts/admin-access.cjs to grant a verified owner account before deploying these rules.');console.log('Trusted administrator registry is configured for '+opt.project+'.');return;}
 const identity=new Client({urlPrefix:'https://identitytoolkit.googleapis.com'});
 const lookup=opt.uid?{localId:[opt.uid]}:{email:[opt.email]};
 const users=(await identity.request({method:'POST',path:`/v1/projects/${opt.project}/accounts:lookup`,body:lookup})).body.users||[];
 if(users.length!==1)throw Error('Account not found. Ask the person to sign in/create their account in this project first.');
 const user=users[0];
 if(opt.grant&&(!user.emailVerified||user.disabled))throw Error('Only an enabled account with a verified email can receive administrator access.');
 if(/[.#$\[\]/]/.test(user.localId))throw Error('This account UID is not compatible with the database key contract.');
 console.log(`${opt.apply?'Applying':'DRY RUN'}: ${opt.grant?'grant':'revoke'} administrator access for ${user.email} (${user.localId}) in ${opt.project}.`);
 if(!opt.apply)return;
 const id=randomUUID();
 await db.request({method:'PATCH',path:'/.json',body:{
  ['platformAdmins/'+user.localId]:opt.grant?true:null,
  ['platformAdminAudit/'+id]:{uid:user.localId,action:opt.grant?'grant':'revoke',at:{'.sv':'timestamp'},operator:auth.getGlobalDefaultAccount()?.user?.email||'trusted-service-identity'}
 }});
 console.log('Administrator grant updated; profile role fields were not used.');
}
if(require.main===module)run(process.argv.slice(2)).catch(error=>{console.error(error.message);process.exitCode=1;});
module.exports={options};
