(function(){
  const KEY='ratingLiveFix20260823v2';
  let db; try{db=JSON.parse(localStorage.ratingDB||'[]')}catch(e){return}
  if(!Array.isArray(db))return;
  const save=()=>{try{localStorage.setItem('ratingDB',JSON.stringify(db));localStorage.setItem('ratingDB_backup',JSON.stringify(db));localStorage.setItem('ratingDB_savedAt',String(Date.now()))}catch(e){console.error(e)}};
  const find=(name,weight)=>db.find(f=>f.name===name&&(!weight||f.weight===weight));
  if(!localStorage[KEY]){
    const t=find('Тони Фергюсон','Lightweight');
    if(t){t.wins=Number(t.wins||0)+1;t.streak=Number(t.streak||0)>0?Number(t.streak)+1:1;t.titleDefenses=Number(t.titleDefenses||0)+1;t.activeDefenses=Number(t.activeDefenses||0)+1;t.history=t.history||[];t.history.unshift({result:'W',method:'',round:'',date:new Date().toLocaleDateString('ru-RU')})}
    const h=find('Josh Hokit','Heavyweight')||find('Хокит','Heavyweight');
    if(h){h.losses=Number(h.losses||0)+1;h.streak=Number(h.streak||0)<0?Number(h.streak)-1:-1;h.history=h.history||[];h.history.unshift({result:'L',method:'',round:'',date:new Date().toLocaleDateString('ru-RU')})}
    const p=find('Алекс Перейра','Welterweight');
    if(p){p.streak=5;p.titleDefenses=3;p.activeDefenses=3}
    db.forEach(f=>{const w=Number(f.wins||0),l=Number(f.losses||0),d=Number(f.draws||0);if(l===0&&d===0&&w>0)f.streak=w;else if(w===0&&d===0&&l>0)f.streak=-l;f.history=f.history||[];f.titleDefenses=Number(f.titleDefenses||0);f.activeDefenses=Number(f.activeDefenses||0);if(f.p4pRank!==undefined)f.p4pRank=Number(f.p4pRank)||null});
    save();localStorage[KEY]='1';
  }
  // Persistent safety net: any navigation, tab switch, page hide or close saves the current in-memory database.
  const persist=()=>{try{const current=window.F;if(Array.isArray(current)){db=current;save()}}catch(e){save()}};
  window.addEventListener('beforeunload',persist);
  document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden')persist()});
  window.addEventListener('pagehide',persist);
  setInterval(persist,1000);
  // Patch the global save function when the app defines it later/earlier.
  const originalSave=window.save;
  if(typeof originalSave==='function'){
    window.save=function(){try{originalSave();}finally{persist();}};
  }
})();