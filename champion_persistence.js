(()=>{
'use strict';
const KEY='manualChampionByWeight',MIG='data_integrity_18';
const read=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'{}')}catch(e){return{}}};
const write=x=>localStorage.setItem(KEY,JSON.stringify(x));
const save=()=>{try{localStorage.setItem('ratingDB',JSON.stringify(F))}catch(e){}};
const find=(name,w)=>F.find(f=>f.name===name&&f.weight===w);
const setChamp=(w,name)=>{const f=find(name,w);if(!f)return;F.filter(x=>x.weight===w).forEach(x=>x.champion=x.id===f.id);const s=read();s[w]=f.id;write(s)};
if(!localStorage.getItem(MIG)){
 const pm=find('Алекс Перейра','Middleweight');
 if(pm&&pm.wins===3&&pm.losses===1){pm.wins=4;pm.losses=1;}
 const pl=find('Алекс Перейра','Light Heavyweight');
 if(pl){pl.activeDefenses=1;pl.titleDefenses=Math.max(Number(pl.titleDefenses)||0,1)}
 if(pm){pm.activeDefenses=1;pm.titleDefenses=Math.max(Number(pm.titleDefenses)||0,1)}
 const yan=find('Пётр Ян','Bantamweight');if(yan){yan.titleDefenses=1;yan.activeDefenses=1}
 const tony=find('Тони Фергюсон','Lightweight');if(tony){tony.titleDefenses=3;tony.activeDefenses=0}
 localStorage.setItem(MIG,'1');save();
}
// These are authoritative current champions; P4P must derive from these records.
setChamp('Light Heavyweight','Алекс Перейра');
setChamp('Middleweight','Алекс Перейра');
setChamp('Bantamweight','Пётр Ян');
setChamp('Flyweight','Кай Аскаура');
save();
const apply=()=>{const s=read();Object.keys(s).forEach(w=>{const f=F.find(x=>x.id==s[w]&&x.weight===w);if(f)F.filter(x=>x.weight===w).forEach(x=>x.champion=x.id===f.id)});save()};
setTimeout(apply,0);setTimeout(apply,300);
const oldSave=window.saveEdit;if(typeof oldSave==='function')window.saveEdit=function(id){oldSave.apply(this,arguments);save();apply()};
const oldAdd=window.addFight;if(typeof oldAdd==='function')window.addFight=function(){oldAdd.apply(this,arguments);save()};
window.setChampionPersist=(id,on=true)=>{const f=F.find(x=>x.id==id);if(!f)return;if(on)setChamp(f.weight,f.name);else{f.champion=false;const s=read();if(s[f.weight]==f.id)delete s[f.weight];write(s);save()}};
setTimeout(()=>{if(!document.querySelector('script[data-final-ui-fix]')){const s=document.createElement('script');s.src='ui_final_fix.js?v=18';s.dataset.finalUiFix='1';document.body.appendChild(s)}},900);
})();
