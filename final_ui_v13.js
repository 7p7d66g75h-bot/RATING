(function(){
'use strict';
const KEY='ratingDB';
const NEWS='fighterRatingsNewsV1';
const OV='fighterManualStatsV2';
const n=v=>Number.isFinite(Number(v))?Number(v):0;
const esc=s=>String(s??'').replace(/[&<>\"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[m]));
const getNews=()=>{try{return JSON.parse(localStorage.getItem(NEWS)||'[]')}catch{return[]}};
const addNews=t=>{const a=getNews();a.unshift({id:Date.now()+Math.random(),text:t,ts:Date.now()});localStorage.setItem(NEWS,JSON.stringify(a.slice(0,30)))};
const saveDB=()=>{localStorage.setItem(KEY,JSON.stringify(F));};
function applyManualStats(){
  let o={};try{o=JSON.parse(localStorage.getItem(OV)||'{}')}catch{}
  F.forEach(f=>{const x=o[String(f.id)];if(x){if(x.titleDefenses!==undefined)f.titleDefenses=n(x.titleDefenses);if(x.activeDefenses!==undefined)f.activeDefenses=n(x.activeDefenses);}});
}
applyManualStats();saveDB();

// Fix the obvious lightweight ordering without destroying manually positioned fighters.
function qualityScore(f){
  const w=n(f.wins),l=n(f.losses),d=n(f.draws),t=w+l+d;
  const winRate=t?w/t:0;
  const streak=n(f.streak);
  const champ=f.champion?1:0;
  const active=n(f.activeDefenses), total=n(f.titleDefenses);
  return w*100 + winRate*70 - l*65 + Math.max(streak,0)*18 + champ*22 + active*16 + total*5;
}
function rankingList(w){
  let a=F.filter(f=>f.weight===w&&!f.champion).slice();
  a.sort((a,b)=>{
    const ar=n(a.rank),br=n(b.rank);
    const am=ar>0&&ar<99,bm=br>0&&br<99;
    // Existing manual positions are respected only when the quality difference is not absurd.
    if(am&&bm){
      const qa=qualityScore(a),qb=qualityScore(b);
      if(Math.abs(qa-qb)>180)return qb-qa;
      return ar-br;
    }
    if(am&&!bm)return ar<20?-1:qualityScore(b)-qualityScore(a);
    if(!am&&bm)return br<20?1:qualityScore(b)-qualityScore(a);
    return qualityScore(b)-qualityScore(a);
  });
  return a;
}

// Explicit correction requested: Ruffi must be ahead of Gaethje in lightweight ranking.
(function(){
  const r=F.find(f=>f.name==='Маурисио Руффи'&&f.weight==='Lightweight');
  const g=F.find(f=>f.name==='Джастин Гейджи'&&f.weight==='Lightweight');
  if(r&&g){
    if(n(r.wins)>n(g.wins) && n(r.losses)<n(g.losses)){
      if(n(r.rank)>=n(g.rank)||n(r.rank)===0||n(r.rank)>=99) r.rank=Math.max(1,n(g.rank)-1);
    }
  }
  saveDB();
})();

// Home is news only. No ratings on the home page.
window.home=function(m){
  const items=getNews().slice(0,15);
  m.innerHTML=`<div class="card"><div class="muted">RANKING NEWS</div><div class="hero" style="font-size:25px">📰 Новости рейтингов</div><div class="muted">Здесь отображаются изменения позиций, чемпионства и другие изменения рейтингов.</div></div>${items.length?`<div class="list">${items.map(x=>`<div class="row newsRow"><div class="grow"><div class="name">${esc(x.text)}</div><div class="meta">${new Date(x.ts).toLocaleString('ru-RU')}</div></div></div>`).join('')}`:'<div class="card muted">Пока изменений нет.</div>'}`;
};

// Replace the ranking editor with a drag-only editor. Three bars are the handle.
let editMode=false;
let editBefore={};
function currentList(){
  if(weight==='P4P')return typeof p4p==='function'?p4p():[];
  return rankingList(weight);
}
function mapRanks(){const m={};currentList().forEach((f,i)=>m[String(f.name).toLowerCase()]=i+1);return m;}
function openEditor(){editMode=true;editBefore=mapRanks();renderEditor();}
function renderEditor(){
  const isP=weight==='P4P', list=currentList();
  const rows=list.map((f,i)=>{
    const champ=isP?(n(f.championCount)>0||!!f.champion):!!f.champion;
    return `<div class="dragRankRow" draggable="true" data-id="${esc(f.id)}" data-name="${esc(f.name)}" data-index="${i}"><div class="dragNum">${i+1}</div><div class="dragInfo"><b>${typeof flag==='function'?flag(f):'🏳️'} ${esc(f.name)}</b><span>${n(f.wins)}-${n(f.losses)}-${n(f.draws)}${champ?' · 🏆':''}${isP&&n(f.activeDefenses)?` · ${n(f.activeDefenses)} активных защит`:''}</span></div><div class="dragHandle" aria-label="Перетащить">☰</div>${!isP?`<button class="dragChamp ${champ?'active':''}" data-champ="1" type="button">🏆</button>`:''}</div>`;
  }).join('');
  document.getElementById('main').innerHTML=`<div class="card dragEditor"><div class="dragHead"><div><div class="hero" style="font-size:25px">✎ ${isP?'P4P':'Рейтинг'}</div><div class="muted">Перетаскивай бойца за ☰. 🏆 — сменить чемпиона.</div></div><button type="button" id="cancelDrag">Отмена</button></div><div id="dragList" class="dragList">${rows}</div><div class="dragSaveBar"><button class="primary" id="saveDrag">${isP?'СОХРАНИТЬ P4P':'СОХРАНИТЬ РЕЙТИНГ'}</button></div></div>`;
  bindDrag();
}
function refreshDragNums(){document.querySelectorAll('.dragRankRow').forEach((r,i)=>r.querySelector('.dragNum').textContent=i+1)}
function bindDrag(){
  const list=document.getElementById('dragList');let dragged=null;
  list.querySelectorAll('.dragRankRow').forEach(row=>{
    row.addEventListener('dragstart',e=>{dragged=row;row.classList.add('dragging');e.dataTransfer.effectAllowed='move';});
    row.addEventListener('dragend',()=>{row.classList.remove('dragging');dragged=null;refreshDragNums();});
    row.addEventListener('dragover',e=>{e.preventDefault();if(!dragged||dragged===row)return;const rect=row.getBoundingClientRect();const before=e.clientY<rect.top+rect.height/2;list.insertBefore(dragged,before?row:row.nextSibling);refreshDragNums();});
  });
  // iPhone touch dragging.
  list.querySelectorAll('.dragHandle').forEach(handle=>handle.addEventListener('pointerdown',startTouch,{passive:false}));
  document.getElementById('cancelDrag').onclick=()=>{editMode=false;render()};
  document.getElementById('saveDrag').onclick=saveDrag;
  list.querySelectorAll('[data-champ]').forEach(btn=>btn.addEventListener('click',e=>{e.stopPropagation();const row=btn.closest('.dragRankRow');const id=String(row.dataset.id);F.filter(f=>f.weight===weight).forEach(f=>f.champion=String(f.id)===id);btn.parentElement.querySelectorAll('.dragChamp').forEach(x=>x.classList.remove('active'));btn.classList.add('active');saveDB();const f=F.find(x=>String(x.id)===id);if(f)addNews(`${typeof flag==='function'?flag(f):'🏳️'} ${f.name} стал чемпионом в ${names[weight]||weight}`)}));
}
function startTouch(e){
  e.preventDefault();const handle=e.currentTarget,row=handle.closest('.dragRankRow'),list=document.getElementById('dragList');if(!row)return;
  let lastY=e.clientY;row.classList.add('touchDragging');
  const move=ev=>{ev.preventDefault();const y=ev.clientY;lastY=y;const rows=[...list.querySelectorAll('.dragRankRow:not(.touchDragging)')];let target=null;for(const r of rows){const b=r.getBoundingClientRect();if(y<b.top+b.height/2){target=r;break}}if(target)list.insertBefore(row,target);else list.appendChild(row);refreshDragNums()};
  const up=()=>{row.classList.remove('touchDragging');document.removeEventListener('pointermove',move);document.removeEventListener('pointerup',up);};
  document.addEventListener('pointermove',move,{passive:false});document.addEventListener('pointerup',up,{once:true});
}
function saveDrag(){
  const isP=weight==='P4P',rows=[...document.querySelectorAll('.dragRankRow')];
  rows.forEach((r,i)=>{
    if(isP){const nm=r.dataset.name.toLowerCase();F.filter(f=>f.name.toLowerCase()===nm).forEach(f=>{f.p4pRank=i+1;f.p4pManual=true});}
    else {const f=F.find(x=>String(x.id)===String(r.dataset.id));if(f){f.rank=i+1;f.rankManual=true;}}
  });
  const after=mapRanks();
  Object.keys(after).forEach(name=>{const a=editBefore[name],b=after[name];if(a&&b&&a!==b){const f=F.find(x=>x.name.toLowerCase()===name);if(f){const div=isP?'P4P':names[weight]||weight;addNews(`${typeof flag==='function'?flag(f):'🏳️'} ${f.name} ${b<a?'поднялся':'опустился'} с №${a} на №${b} в ${div}`);}}});
  saveDB();editMode=false;render();
}
window.openRankingEditor=openEditor;window.openP4PEditor=openEditor;

// Make the save bar permanently visible while editing.
const css=document.createElement('style');css.textContent=`
.dragEditor{padding-bottom:82px;overflow:visible}.dragHead{display:flex;justify-content:space-between;align-items:center;gap:8px}.dragList{display:grid;gap:7px;margin-top:12px}.dragRankRow{display:flex;align-items:center;gap:7px;background:#121416;border:1px solid #292c30;border-radius:12px;padding:8px;min-width:0}.dragRankRow.touchDragging{opacity:.72;transform:scale(.99)}.dragRankRow.dragging{opacity:.5}.dragNum{width:26px;flex:0 0 26px;text-align:center;font-weight:900}.dragInfo{flex:1;min-width:0}.dragInfo b{display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-size:15px}.dragInfo span{display:block;color:#858a90;font-size:10px;margin-top:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.dragHandle{width:30px;flex:0 0 30px;height:38px;display:flex;align-items:center;justify-content:center;border:1px solid #292c30;border-radius:8px;color:#aaa;font-size:18px;touch-action:none;cursor:grab}.dragChamp{width:34px;flex:0 0 34px;height:38px;padding:0;border-radius:8px;opacity:.45}.dragChamp.active{opacity:1;background:#eee;color:#090a0b}.dragSaveBar{position:sticky;bottom:76px;z-index:10;padding-top:8px;background:linear-gradient(transparent,#111315 12px,#111315)}.dragSaveBar .primary{box-shadow:0 4px 18px #000}.newsRow{padding:12px}.rankingNews{margin-top:0}@media(max-width:430px){.dragRankRow{gap:5px;padding:7px}.dragNum{width:23px;flex-basis:23px}.dragHandle{width:28px;flex-basis:28px}.dragChamp{width:31px;flex-basis:31px}}
`;document.head.appendChild(css);

// Keep manually edited defense values persistent even if another legacy script rewrites ratingDB.
const oldSaveEdit=window.saveEdit;
if(typeof oldSaveEdit==='function')window.saveEdit=function(id){oldSaveEdit(id);const f=F.find(x=>String(x.id)===String(id));if(f){let o={};try{o=JSON.parse(localStorage.getItem(OV)||'{}')}catch{}o[String(f.id)]={titleDefenses:n(f.titleDefenses),activeDefenses:n(f.activeDefenses)};localStorage.setItem(OV,JSON.stringify(o));saveDB();}};
const oldRender=window.render;
window.render=function(){applyManualStats();if(editMode){renderEditor();return;}oldRender();if(page==='home')setTimeout(()=>{},0)};

// Intercept legacy editor buttons so only the inline editor is used.
document.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;const t=(b.textContent||'').replace(/\s+/g,' ').trim();if(t.includes('РЕДАКТИРОВАТЬ РЕЙТИНГ')||t.includes('РЕДАКТИРОВАТЬ P4P')){e.preventDefault();e.stopImmediatePropagation();openEditor();}},true);

// Ensure defense fields survive every page load.
window.addEventListener('load',()=>{applyManualStats();saveDB();});
})();