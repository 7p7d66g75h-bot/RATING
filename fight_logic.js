(function(){
function applyFightResult(f,result){
  if(!f)return;
  f.history=f.history||[];
  const win=result==='WIN', loss=result==='LOSS';
  if(win){f.wins=(f.wins||0)+1;f.streak=Math.max(1,(f.streak||0)+1);}
  else if(loss){f.losses=(f.losses||0)+1;f.streak=Math.min(-1,(f.streak||0)-1);}
  else {f.draws=(f.draws||0)+1;f.streak=0;}
  if(win && f.champion){
    f.titleDefenses=(f.titleDefenses||0)+1;
    f.activeDefenses=(f.activeDefenses||0)+1;
  }
  if(loss && f.champion){f.champion=false;f.activeDefenses=0;}
  f.history.push({result:result,method:arguments[1]?.method||'',round:arguments[1]?.round||null,date:new Date().toISOString()});
  save();
  if(typeof render==='function')render();
}
window.applyFightResult=applyFightResult;
})();