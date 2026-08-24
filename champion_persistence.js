(() => {
  const KEY='manualChampionByWeight';
  const read=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'{}')}catch(e){return {}}};
  const write=x=>localStorage.setItem(KEY,JSON.stringify(x));
  const apply=()=>{
    const x=read();
    Object.keys(x).forEach(w=>{const id=x[w],champ=F.find(f=>f.id==id&&f.weight===w);if(!champ)return;F.filter(f=>f.weight===w).forEach(f=>f.champion=(f.id==id))});
    try{localStorage.ratingDB=JSON.stringify(F)}catch(e){}
  };
  const syncWeight=w=>{if(!w||w==='P4P')return;const c=F.filter(f=>f.weight===w&&f.champion);const x=read();if(c.length===1)x[w]=c[0].id;else if(!c.length)delete x[w];write(x)};
  const setChamp=(id,enabled)=>{const f=F.find(x=>x.id==id);if(!f||f.weight==='P4P')return;const x=read();if(enabled){F.filter(z=>z.weight===f.weight).forEach(z=>z.champion=z.id===f.id);x[f.weight]=f.id}else{f.champion=false;if(x[f.weight]==f.id)delete x[f.weight]}write(x);localStorage.ratingDB=JSON.stringify(F)};
  apply();setTimeout(apply,0);setTimeout(apply,100);setTimeout(apply,500);
  const oldSave=window.saveEdit;if(typeof oldSave==='function')window.saveEdit=function(id){oldSave.apply(this,arguments);const f=F.find(x=>x.id==id);if(f)setChamp(id,!!f.champion);try{localStorage.ratingDB=JSON.stringify(F)}catch(e){}};
  const oldAdd=window.addFight;if(typeof oldAdd==='function')window.addFight=function(){oldAdd.apply(this,arguments);F.forEach(f=>{if(f.champion)syncWeight(f.weight)});try{localStorage.ratingDB=JSON.stringify(F)}catch(e){}};
  window.setChampionPersist=(id)=>setChamp(id,true);
  // Load the final UI/persistence layer last, after every legacy renderer has initialized.
  setTimeout(()=>{if(!document.querySelector('script[data-final-ui-fix]')){const s=document.createElement('script');s.src='ui_final_fix.js?v=16';s.dataset.finalUiFix='1';document.body.appendChild(s)}},1200);
})();