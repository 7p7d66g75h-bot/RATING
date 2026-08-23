(() => {
  // Persistent manual champion state. This is deliberately stored separately from ratingDB
  // so legacy ranking/P4P scripts cannot restore an old champion on reload.
  const KEY='manualChampionByWeight';
  const read=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'{}')}catch(e){return {}}};
  const write=x=>localStorage.setItem(KEY,JSON.stringify(x));
  const norm=s=>String(s||'').trim().toLowerCase();
  const syncWeight=w=>{
    if(!w||w==='P4P')return;
    const c=F.filter(f=>f.weight===w&&f.champion);
    if(c.length===1){const x=read();x[w]=c[0].id;write(x)}
    else if(c.length===0){const x=read();delete x[w];write(x)}
  };
  const apply=()=>{
    const x=read();
    Object.keys(x).forEach(w=>{
      const id=x[w];
      const champ=F.find(f=>f.id==id&&f.weight===w);
      if(!champ)return;
      F.filter(f=>f.weight===w).forEach(f=>f.champion=(f.id==id));
    });
    try{localStorage.ratingDB=JSON.stringify(F)}catch(e){}
  };
  const setChamp=(id,enabled)=>{
    const f=F.find(x=>x.id==id);if(!f||f.weight==='P4P')return;
    const x=read();
    if(enabled){
      F.filter(z=>z.weight===f.weight).forEach(z=>z.champion=(z.id===f.id));
      x[f.weight]=f.id;
    }else{
      f.champion=false;
      if(x[f.weight]==f.id)delete x[f.weight];
    }
    write(x);
    localStorage.ratingDB=JSON.stringify(F);
  };
  const after=()=>{apply();try{localStorage.ratingDB=JSON.stringify(F)}catch(e){}};

  // Capture manual fighter editor changes.
  const oldSaveF=window.saveFighterEdit;
  if(typeof oldSaveF==='function')window.saveFighterEdit=function(id){
    oldSaveF.apply(this,arguments);
    const f=F.find(x=>x.id==id);if(f)setChamp(id,!!f.champion);
    after();
  };
  const oldSaveP=window.saveProfileEdit;
  if(typeof oldSaveP==='function')window.saveProfileEdit=function(id){
    oldSaveP.apply(this,arguments);
    const f=F.find(x=>x.id==id);if(f)setChamp(id,!!f.champion);
    after();
  };
  const oldSaveR=window.saveRankingEditor;
  if(typeof oldSaveR==='function')window.saveRankingEditor=function(){
    oldSaveR.apply(this,arguments);
    if(typeof weight!=='undefined'&&weight!=='P4P')syncWeight(weight);
    after();
  };
  const oldAdd=window.addFight;
  if(typeof oldAdd==='function')window.addFight=function(){
    oldAdd.apply(this,arguments);
    F.forEach(f=>{if(f.champion)syncWeight(f.weight)});
    after();
  };

  // Apply immediately and again after legacy scripts/renderers have had a chance to run.
  apply();
  setTimeout(apply,0);setTimeout(apply,100);setTimeout(apply,500);
  setInterval(apply,1000);
})();
