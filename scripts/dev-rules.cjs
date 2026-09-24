const fs=require('node:fs');
const rules=JSON.parse(fs.readFileSync('database.rules.json'));
const member="auth != null && (root.child('devMembers').child(auth.uid).val() === true || (auth.token.email_verified === true && auth.token.email === 'thoresonws@gmail.com'))";
function gate(o){for(const k in o){if(['.read','.write'].includes(k))o[k]='('+member+') && ('+o[k]+')';else if(typeof o[k]==='object')gate(o[k]);}}
gate(rules.rules);
rules.rules.games.$gameId['.write']='('+member+') && ((!data.exists() && newData.child("createdBy").val() === auth.uid) || data.child("createdBy").val() === auth.uid || data.child("players").child(auth.uid).exists())';
rules.rules.games.$gameId.players={$uid:{'.write':'('+member+') && auth.uid === $uid && !data.exists()'}};
rules.rules.devMembers={'.read':false,'.write':false};
fs.writeFileSync('config/database.dev.rules.json',JSON.stringify(rules,null,2)+'\n');
