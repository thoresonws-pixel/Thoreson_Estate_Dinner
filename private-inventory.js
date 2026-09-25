/* Permission-scoped subscriptions. No fallback to the old public inventory fields. */
(function(global){
'use strict';
function watch({db,gameId,uid,all=false},change,onError){
 let stopped=false;
 const ref=db.ref('privateSessions/'+gameId+'/players'+(all?'':'/'+uid));
 const value=snapshot=>{if(!stopped)change(all?(snapshot.val()||{}):{[uid]:snapshot.val()||{}});};
 const failed=error=>{if(!stopped){change({});onError?.(error);}};
 ref.on('value',value,failed);
 return ()=>{stopped=true;ref.off('value',value);};
}
global.PrivateInventory={watch};
})(window);
