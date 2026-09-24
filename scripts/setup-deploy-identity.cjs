// Owner-run provisioning. Uses the local Firebase login; never prints or stores tokens.
const auth=require('firebase-tools/lib/auth');
const {Client}=require('firebase-tools/lib/apiv2');
const project='thoreson-estate-dev',number='634959998634',repoId='1138420307',ownerId='256157508';
async function api(origin,path,method='GET',body){console.log(method+' '+path);const r=await new Client({urlPrefix:origin}).request({path,method,body,resolveOnHTTPError:true});if(r.status>=400){if(r.status===409)return;throw Error(method+' '+path+': '+r.status+' '+JSON.stringify(r.body));}return r.body;}
async function ensure(origin,path,method,body){return api(origin,path,method,body);}
(async()=>{
 await require('firebase-tools/lib/requireAuth').requireAuth({...auth.getGlobalDefaultAccount(),project});
 for(const service of ['iam.googleapis.com','iamcredentials.googleapis.com','sts.googleapis.com'])await api('https://serviceusage.googleapis.com','/v1/projects/'+number+'/services/'+service+':enable','POST',{});
 const pool='projects/'+number+'/locations/global/workloadIdentityPools/github';
 await ensure('https://iam.googleapis.com','/v1/projects/'+number+'/locations/global/workloadIdentityPools?workloadIdentityPoolId=github','POST',{displayName:'GitHub deployments'});
 const provider={displayName:'Protected main branch',oidc:{issuerUri:'https://token.actions.githubusercontent.com'},attributeMapping:{'google.subject':'assertion.sub','attribute.repository_id':'assertion.repository_id'},attributeCondition:"assertion.repository_id == '"+repoId+"' && assertion.repository_owner_id == '"+ownerId+"' && assertion.ref == 'refs/heads/main'"};
 await ensure('https://iam.googleapis.com','/v1/'+pool+'/providers?workloadIdentityPoolProviderId=actions','POST',provider);
 for(const [target,environment] of [[project,'development'],['thoreson-estate','production']]){
  const account='github-deploy@'+target+'.iam.gserviceaccount.com';
  await ensure('https://iam.googleapis.com','/v1/projects/'+target+'/serviceAccounts','POST',{accountId:'github-deploy',serviceAccount:{displayName:'GitHub '+environment+' deployment'}});
  const resource='/v1/projects/'+target+'/serviceAccounts/'+account;
  const saPolicy=await api('https://iam.googleapis.com',resource+':getIamPolicy','POST',{});saPolicy.bindings||=[];
  const member='principal://iam.googleapis.com/'+pool+'/subject/repo:thoresonws-pixel/Thoreson_Estate_Dinner:environment:'+environment;
  const binding=saPolicy.bindings.find(b=>b.role==='roles/iam.workloadIdentityUser')||{role:'roles/iam.workloadIdentityUser',members:[]};if(!saPolicy.bindings.includes(binding))saPolicy.bindings.push(binding);if(!binding.members.includes(member))binding.members.push(member);
  await api('https://iam.googleapis.com',resource+':setIamPolicy','POST',{policy:saPolicy});
  const policy=await api('https://cloudresourcemanager.googleapis.com','/v1/projects/'+target+':getIamPolicy','POST',{});policy.bindings||=[];
  for(const role of ['roles/firebasehosting.admin','roles/firebasedatabase.admin','roles/serviceusage.serviceUsageConsumer','roles/firebase.viewer']){let b=policy.bindings.find(b=>b.role===role&&!b.condition);if(!b){b={role,members:[]};policy.bindings.push(b);}if(!b.members.includes('serviceAccount:'+account))b.members.push('serviceAccount:'+account);}
  await api('https://cloudresourcemanager.googleapis.com','/v1/projects/'+target+':setIamPolicy','POST',{policy});
  console.log('Configured '+environment+' keyless deploy identity');
 }
 console.log('Provider: '+pool+'/providers/actions');
})().catch(e=>{console.error(e.message);process.exitCode=1;});


