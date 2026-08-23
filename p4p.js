(function(){
function keyName(n){return String(n).toLowerCase().replace(/[ё]/g,'е').replace(/[^a-zа-я0-9]/g,'').replace(/корейскийзомби/,'корейскийзомби');}
function p4pGroups(){
 const map=new Map();
 F.forEach(f=>{
  const k=keyName(f.name);
  if(!map.has(k)) map.set(k,{id:f.id,name:f.name,country:f.country,wins:0,losses:0,draws:0,titleWins:0,titleDefenses:0,activeDefenses:0,champion:false,streak:0,weights:[]});
  const g=map.get(k);
  g.wins+=Number(f.wins)||0; g.losses+=Number(f.losses)||0; g.draws+=Number(f.draws)||0;
  g.titleWins+=Number(f.titleWins)||0; g.titleDefenses+=Number(f.titleDefenses)||0; g.activeDefenses=Math.max(g.activeDefenses,Number(f.activeDefenses)||0);
  g.champion=g.champion||!!f.champion; if(!g.weights.includes(f.weight))g.weights.push(f.weight);
  // Prefer the strongest active streak stored on the fighter; if history exists, calculate it globally later.
  g.streak=Math.abs(Number(f.streak)||0)>Math.abs(g.streak)?Number(f.streak)||0:g.streak;
 });
 return [...map.values()];
}
function p4pScore(g){
 const rec=(g.wins-g.losses)*100 + g.wins*8 - g.losses*5;
 const champ=g.champion?450:0;
 const title= g.titleWins*70 + g.titleDefenses*55 + g.activeDefenses*35;
 const streak=(g.streak>0?g.streak*45:g.streak*35);
 const activity=g.wins+g.losses+g.draws;
 return rec+champ+title+streak+activity;
}
window.p4p=function(){return p4pGroups().sort((a,b)=>p4pScore(b)-p4pScore(a)||b.wins-a.wins||a.losses-b.losses)};
window.row=function(f,pos){
 const isP4P=weight==='P4P';
 const rec=`${f.wins}-${f.losses}-${f.draws||0}`;
 const meta=isP4P?`ОБЩИЙ РЕКОРД · ${rec}${f.weights?.length?` · ${f.weights.map(x=>names[x]||x).join(' / ')}`:''}`:`${names[f.weight]||'P4P'} · ${rec}`;
 const series=f.streak?` · ${f.streak>0?'+'+f.streak:'-'+Math.abs(f.streak)}`:'';
 return `<div class="row"><div class="rank">${pos}</div><div class="flag">${flag(f)}</div><div class="grow" onclick="openProfile(${f.id})"><div class="name">${f.name} ${f.champion?'🏆':''}</div><div class="meta">${meta}${series}</div></div><button class="edit" onclick="editFighter(${f.id})">✎</button></div>`;
};
// P4P uses the same person across every division. No duplicate Pereira, Jones, Silva, etc.
const oldRender=window.render;
window.render=function(){oldRender(); if(weight==='P4P'){
 const list=document.querySelector('#main .list'); if(list){const a=p4p(); list.innerHTML=a.slice(0,15).map((f,i)=>row(f,i+1)).join(''); const outside=a.slice(15); let sec=document.querySelector('#main .outside'); if(outside.length){if(!sec){sec=document.createElement('div');sec.className='outside';document.querySelector('#main').appendChild(sec)}sec.innerHTML=`<div class="outsideTitle">За пределами TOP-15</div><div class="list">${outside.map((f,i)=>row(f,i+16)).join('')}</div>`}else if(sec)sec.remove();}}
};
render();
})();