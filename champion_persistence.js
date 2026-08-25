(() => {
  'use strict';
  const KEY='manualChampionByWeight';
  const read=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'{}')}catch(e){return {}}};
  const write=x=>localStorage.setItem(KEY,JSON.stringify(x));
  const save=()=>{try{localStorage.setItem('ratingDB',JSON.stringify(F))}catch(e){}};
  const setWeightChampion=(weight,name)=>{const fighter=F.find(f=>f.weight===weight&&f.name===name);if(!fighter)return false;F.filter(f=>f.weight===weight).forEach(f=>f.champion=(f.id===fighter.id));return fighter.id};
  const repairKnown=()=>{const state=read();[['Light Heavyweight','Алекс Перейра'],['Middleweight','Алекс Перейра'],['Bantamweight','Пётр Ян'],['Flyweight','Кай Аскаура']].forEach(([w,n])=>{const id=setWeightChampion(w,n);if(id)state[w]=id});write(state);save()};
  const apply=()=>{const state=read();Object.keys(state).forEach(w=>{const id=state[w],champ=F.find(f=>f.id==id&&f.weight===w);if(!champ)return;F.filter(f=>f.weight===w).forEach(f=>f.champion=(f.id==id))});save()};
  const syncWeight=w=>{if(!w||w==='P4P')return;const c=F.filter(f=>f.weight===w&&f.champion),state=read();if(c.length===1)state[w]=c[0].id;else if(!c.length)delete state[w];write(state)};
  const setChamp=(id,enabled)=>{const f=F.find(x=>x.id==id);if(!f||f.weight==='P4P')return;if(enabled){F.filter(z=>z.weight===f.weight).forEach(z=>z.champion=z.id===f.id);const state=read();state[f.weight]=f.id;write(state)}else{f.champion=false;const state=read();if(state[f.weight]==f.id)delete state[f.weight];write(state)}save()};
  // Authoritative initial championship state. This fixes P4P/weight-rating divergence.
  repairKnown();
  setTimeout(apply,0);setTimeout(repairKnown,100);setTimeout(apply,500);
  const oldSave=window.saveEdit;if(typeof oldSave==='function')window.saveEdit=function(id){oldSave.apply(this,arguments);const f=F.find(x=>x.id==id);if(f)setChamp(id,!!f.champion);else save()};
  const oldAdd=window.addFight;if(typeof oldAdd==='function')window.addFight=function(){oldAdd.apply(this,arguments);F.filter(f=>f.champion).forEach(f=>syncWeight(f.weight));save()};
  window.setChampionPersist=setChamp;
  setTimeout(()=>{if(!document.querySelector('script[data-final-ui-fix]')){const s=document.createElement('script');s.src='ui_final_fix.js?v=17';s.dataset.finalUiFix='1';document.body.appendChild(s)}},1200);
})();
