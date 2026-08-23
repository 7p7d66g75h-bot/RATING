(function(){
  // Central fight engine.
  // Champion win = automatic title defense. Total defenses persist; active defenses reset on title loss.
  function number(v){ return Number(v)||0; }

  function promoteNewChampion(weight){
    const candidates=F.filter(f=>f.weight===weight && !f.champion && number(f.streak)>=2);
    candidates.sort((a,b)=>{
      const ar=number(a.rank)||999, br=number(b.rank)||999;
      if(ar!==br)return ar-br;
      return number(b.streak)-number(a.streak);
    });
    const next=candidates[0];
    if(next){
      next.champion=true;
      next.activeDefenses=0;
      // IMPORTANT: becoming champion is not a new fight. Do not change wins/streak/history.
      return next;
    }
    return null;
  }
  window.resolveTitleAfterLoss=function(formerChampion){
    if(!formerChampion)return null;
    formerChampion.champion=false;
    formerChampion.activeDefenses=0;
    return promoteNewChampion(formerChampion.weight);
  };

  window.applyFightResult=function(f,result,details){
    if(!f)return;
    details=details||{};
    f.history=f.history||[];
    const wasChampion=!!f.champion;
    const win=result==='WIN', loss=result==='LOSS';

    if(win){
      f.wins=number(f.wins)+1;
      f.streak=number(f.streak)>0?number(f.streak)+1:1;
      if(wasChampion){
        f.titleDefenses=number(f.titleDefenses)+1;
        f.activeDefenses=number(f.activeDefenses)+1;
      }
    }else if(loss){
      f.losses=number(f.losses)+1;
      f.streak=number(f.streak)<0?number(f.streak)-1:-1;
      if(wasChampion){
        f.champion=false;
        f.activeDefenses=0;
      }
    }else{
      f.draws=number(f.draws)+1;
      f.streak=0;
    }

    f.history.unshift({result:result,method:details.method||'',round:details.round||null,date:new Date().toLocaleDateString('ru-RU')});

    // A title changes hands automatically after the former champion's loss.
    // The new champion gets NO additional win, because the title transfer is not a fight.
    let newChampion=null;
    if(loss && wasChampion)newChampion=promoteNewChampion(f.weight);

    if(typeof save==='function')save();
    if(typeof render==='function')render();
    return newChampion;
  };

  window.addFight=function(){
    const select=document.getElementById('bf')||document.getElementById('f');
    const resultEl=document.getElementById('br')||document.getElementById('r');
    const methodEl=document.getElementById('bm');
    const roundEl=document.getElementById('bround');
    if(!select||!resultEl)return;
    const f=F.find(x=>x.id==select.value);
    if(!f)return;
    const raw=resultEl.value;
    const result=(raw==='W'||raw==='1'||raw==='WIN')?'WIN':(raw==='L'||raw==='0'||raw==='LOSS'?'LOSS':'DRAW');
    const newChampion=applyFightResult(f,result,{method:methodEl?methodEl.value:'',round:roundEl?roundEl.value:null});
    if(typeof weight!=='undefined')weight=f.weight;
    if(typeof page!=='undefined')page='rank';
    if(typeof render==='function')render();
    if(typeof alert==='function' && result==='LOSS' && f.champion===false){
      alert(newChampion?`${f.name}: поражение. Новый чемпион: ${newChampion.name}`:`${f.name}: поражение. Пояс вакантен — нет бойца с серией минимум +2.`);
    }
  };
})();