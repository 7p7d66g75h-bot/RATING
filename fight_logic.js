(function(){
  // Central fight engine. A champion's every recorded win is a title defense.
  // Total defenses never decrease; active defenses reset only when the champion loses/vacates.
  window.applyFightResult=function(f,result,details){
    if(!f)return;
    details=details||{};
    f.history=f.history||[];
    const win=result==='WIN', loss=result==='LOSS';
    if(win){
      f.wins=Number(f.wins||0)+1;
      f.streak=Number(f.streak||0)>0?Number(f.streak)+1:1;
      if(f.champion){
        f.titleDefenses=Number(f.titleDefenses||0)+1;
        f.activeDefenses=Number(f.activeDefenses||0)+1;
      }
    }else if(loss){
      f.losses=Number(f.losses||0)+1;
      f.streak=Number(f.streak||0)<0?Number(f.streak)-1:-1;
      if(f.champion){
        f.champion=false;
        f.activeDefenses=0;
      }
    }else{
      f.draws=Number(f.draws||0)+1;
      f.streak=0;
    }
    f.history.unshift({result:result,method:details.method||'',round:details.round||null,date:new Date().toLocaleDateString('ru-RU')});
    if(typeof save==='function')save();
    if(typeof render==='function')render();
  };

  // Replace the old +Бой handler. The title checkbox is no longer required:
  // if the selected fighter is champion, a win automatically counts as a defense.
  window.addFight=function(){
    const select=document.getElementById('bf')||document.getElementById('f');
    const resultEl=document.getElementById('br')||document.getElementById('r');
    const methodEl=document.getElementById('bm');
    const roundEl=document.getElementById('bround');
    if(!select||!resultEl)return;
    const f=F.find(x=>x.id==select.value);
    if(!f)return;
    let raw=resultEl.value;
    const result=(raw==='W'||raw==='1'||raw==='WIN')?'WIN':(raw==='L'||raw==='0'||raw==='LOSS'?'LOSS':'DRAW');
    applyFightResult(f,result,{method:methodEl?methodEl.value:'',round:roundEl?roundEl.value:null});
    if(typeof alert==='function')alert(`${f.name}: ${result==='WIN'?'ПОБЕДА':result==='LOSS'?'ПОРАЖЕНИЕ':'НИЧЬЯ'} | ${f.wins}-${f.losses}-${f.draws||0} | серия ${f.streak}${f.champion?' | ЗАЩИТА ПОЯСА':''}`);
    if(typeof weight!=='undefined')weight=f.weight;
    if(typeof page!=='undefined')page='rank';
    if(typeof render==='function')render();
  };
})();