const fs=require('node:fs');
const member="auth != null && (root.child('devMembers').child(auth.uid).val() === true || (auth.token.email_verified === true && auth.token.email === 'thoresonws@gmail.com'))";
function buildDevelopmentRules(base){
 const rules=structuredClone(base);
 function gate(o){for(const k in o){if(['.read','.write'].includes(k))o[k]='('+member+') && ('+o[k]+')';else if(typeof o[k]==='object')gate(o[k]);}}
 gate(rules.rules);
 rules.rules.games.$gameId['.write']='('+member+') && ((!data.exists() && newData.child("createdBy").val() === auth.uid) || data.child("createdBy").val() === auth.uid || (newData.exists() && data.child("players").child(auth.uid).exists()))';
 rules.rules.games.$gameId.players={$uid:{'.write':'('+member+') && auth.uid === $uid && !data.exists() && newData.exists() && root.child("games").child($gameId).child("createdBy").exists()'}};
 rules.rules.devMembers={'.read':false,'.write':false};
 return rules;
}
if(require.main===module){
 const generated=JSON.stringify(buildDevelopmentRules(JSON.parse(fs.readFileSync('database.rules.json'))),null,2)+'\n';
 if(process.argv.includes('--check')){
  if(fs.readFileSync('config/database.dev.rules.json','utf8')!==generated){console.error('Development rules are stale. Run node scripts/dev-rules.cjs.');process.exitCode=1;}
 }else fs.writeFileSync('config/database.dev.rules.json',generated);
}
module.exports={buildDevelopmentRules};
