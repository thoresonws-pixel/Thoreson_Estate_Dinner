// Run locally by the Firebase project owner; not part of the deployed site.
const auth=require('firebase-tools/lib/auth'),{Client}=require('firebase-tools/lib/apiv2');
(async()=>{
 const email=process.argv[2];if(!email?.includes('@'))throw Error('Usage: node scripts/dev-access.cjs email@example.com [--remove]');
 await require('firebase-tools/lib/requireAuth').requireAuth({...auth.getGlobalDefaultAccount(),project:'thoreson-estate-dev'});
 const identity=new Client({urlPrefix:'https://identitytoolkit.googleapis.com'});
 const result=await identity.request({method:'POST',path:'/v1/projects/thoreson-estate-dev/accounts:lookup',body:{email:[email]}});
 const user=result.body.users?.[0];if(!user)throw Error('Ask this person to sign in at https://thoreson-estate-dev.web.app once, then run this command again.');
 const db=new Client({urlPrefix:'https://thoreson-estate-dev-default-rtdb.firebaseio.com'});
 await db.request({method:'PUT',path:'/devMembers/'+encodeURIComponent(user.localId)+'.json',body:process.argv.includes('--remove')?null:true});
 console.log(process.argv.includes('--remove')?'Development access removed.':'Development access enabled.');
})().catch(e=>{console.error(e.message);process.exitCode=1;});
