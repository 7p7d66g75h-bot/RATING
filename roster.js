(function(){
const extra=[];
const codes={EC:'🇪🇨',CN:'🇨🇳',UG:'🇺🇬',MA:'🇲🇦',CL:'🇨🇱',SK:'🇸🇰',IT:'🇮🇹',SE:'🇸🇪',CZ:'🇨🇿',AT:'🇦🇹',MD:'🇲🇩',TR:'🇹🇷',LT:'🇱🇹',BH:'🇧🇭',DO:'🇩🇴',HR:'🇭🇷',UA:'🇺🇦',KG:'🇰🇬',UZ:'🇺🇿',BS:'🇧🇸',SR:'🇷🇸'};
Object.assign(FLAGS,codes);
const currentChampions={
  'Heavyweight':'Кёртис Блейдс',
  'Light Heavyweight':'Алекс Перейра',
  'Middleweight':'Исраэль Адесанья',
  'Welterweight':'Джек Маддалена',
  'Lightweight':'Тони Фергюсон',
  'Featherweight':'Корейский Зомби',
  'Bantamweight':'Пётр Ян'
};
Object.entries(currentChampions).forEach(([w,name])=>{
  F.filter(f=>f.weight===w).forEach(f=>{f.champion=(f.name===name);});
});

// In a weight class the champion is NOT #1. The champion has the belt,
// and #1 is the highest-ranked contender below the champion.
function rank(m){
  let a=weight==='P4P'?p4p():ranked();
  if(weight==='P4P'){
    const top=a.slice(0,15),out=a.slice(15);
    m.innerHTML=`<div class="card"><div class="muted">RANKING</div><div class="hero" style="font-size:25px">P4P</div><div class="muted">TOP-15</div></div><div class="list">${top.map((f,i)=>row(f,i+1)).join('')||'<div class="card muted">Нет бойцов</div>'}</div>${out.length?`<div class="outside"><div class="outsideTitle">За пределами TOP-15</div><div class="list">${out.map((f,i)=>row(f,i+16)).join('')}</div></div>`:''}`;
    return;
  }
  const champ=a.find(f=>f.champion);
  const contenders=a.filter(f=>!f.champion);
  const top=contenders.slice(0,15),out=contenders.slice(15);
  const champHtml=champ?`<div class="card" style="border:1px solid #eee"><div class="muted">ЧЕМПИОН</div><div class="row" style="margin-top:8px;border:0;padding:4px 0"><div class="flag">${flag(champ)}</div><div class="grow" onclick="openProfile(${champ.id})"><div class="name">${champ.name} 🏆</div><div class="meta">${names[champ.weight]} · ${champ.wins}-${champ.losses}-${champ.draws} · ${champ.titleDefenses||0} защит</div></div><button class="edit" onclick="editFighter(${champ.id})">✎</button></div></div>`:'';
  m.innerHTML=`<div class="card"><div class="muted">RANKING</div><div class="hero" style="font-size:25px">${names[weight]}</div><div class="muted">Чемпион отдельно · №1 — главный претендент</div></div>${champHtml}<div class="section">РЕЙТИНГ TOP-15</div><div class="list">${top.map((f,i)=>row(f,i+1)).join('')||'<div class="card muted">Нет бойцов</div>'}</div>${out.length?`<div class="outside"><div class="outsideTitle">За пределами TOP-15</div><div class="list">${out.map((f,i)=>row(f,i+16)).join('')}</div></div>`:''}`;
}

// Do not create duplicate fighters; keep the existing database and its records.
save();
render();
})();