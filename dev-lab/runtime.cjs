const fs=require('node:fs'),path=require('node:path'),{spawnSync}=require('node:child_process');
function runtime(workspace){
 const portable=path.join(workspace,'.player-lab-work/runtime');
 const fallback=fs.existsSync(portable)?fs.readdirSync(portable).find(n=>n.startsWith('jdk-')):null;
 const home=process.env.JAVA_HOME||(fallback?path.join(portable,fallback):null);
 const java=home?path.join(home,'bin',process.platform==='win32'?'java.exe':'java'):'java';
 const version=spawnSync(java,['-version'],{encoding:'utf8',windowsHide:true});
 const major=Number((version.stderr||version.stdout||'').match(/version "(\d+)/)?.[1]);
 if(version.status!==0||major<21)throw Error('Java 21 or newer is required. Install Temurin JDK 21 and set JAVA_HOME or add java to PATH.');
 let cli;try{cli=require.resolve('firebase-tools/lib/bin/firebase.js');}catch{throw Error('Run npm ci before starting Player Lab.');}
 return {cli,env:{...process.env,...(home?{JAVA_HOME:home,PATH:path.join(home,'bin')+path.delimiter+process.env.PATH}:{})}};
}
module.exports={runtime};
