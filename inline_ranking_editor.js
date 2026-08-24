(function(){
  'use strict';
  const qs=s=>document.querySelector(s);
  const esc=s=>String(s??'').replace(/[&<>\"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[m]));
  const n=v=>{const x=Number(v);return Number.isFinite(x)?x:0};
  const saveDB=()=>{if(typeof save==='function')save();else localStorage.ratingDB=JSON.stringify(F)};
  const names2=window.names||{};
  let editing=false;

  function getList(){
    if(typeof weight==='undefined') return [];
    if(weight==='P4P'){
      if(typeof p4p==='function') return p4p();
      return [];
    }
    return F.filter(f=>f.weight===weight).slice().sort((a,b)=>(n(a.rank)||999)-(n(b.rank)||999)||b.wins-a.wins);
  }

  function renderInline(){
    if(!editing) return;
    const main=qs('#main'); if(!main) return;
    const list=getList();
    const isP4P=weight==='P4P';
    const title=isP4P?'P4P':'Рейтинг';
    const rows=list.map((f,i)=>{
      const id=f.id!=null?String(f.id):encodeURIComponent(f.name);
      const champ=isP4P?(n(f.championCount)>0):(!!f.champion);
      const rec=isP4P?`${n(f.wins)}-${n(f.losses)}-${n(f.draws)}`:`${n(f.wins)}-${n(f.losses)}-${n(f.draws)}`;
      return `<div class="inlineRankRow" data-id="${esc(id)}" data-index="${i}">
        <div class="inlineRankNum">${i+1}</div>
        <div class="inlineRankInfo"><b>${typeof flag==='function'?flag(f):''} ${esc(f.name)}</b><span>${rec}${champ?' · 🏆':''}${isP4P&&n(f.activeDefenses)?` · ${n(f.activeDefenses)} активных защит`:''}</span></div>
        <div class="inlineRankControls">
          <button type="button" class="irMove" data-dir="up" aria-label="Вверх">▲</button>
          <button type="button" class="irMove" data-dir="down" aria-label="Вниз">▼</button>
          ${!isP4P?`<button type="button" class="irChamp ${champ?'active':''}" aria-label="Чемпион">🏆</button>`:''}
        </div>
      </div>`;
    }).join('');
    main.innerHTML=`<div class="card inlineEditorCard">
      <div style="display:flex;justify-content:space-between;align-items:center;gap:10px"><div><div class="hero" style="font-size:25px">✎ ${title}</div><div class="muted">Перемещай бойцов справа. 🏆 — назначить чемпиона.</div></div><button type="button" id="irCancel">Отмена</button></div>
      <div id="inlineRankList" class="inlineRankList">${rows}</div>
      <button type="button" class="primary" id="irSave" style="margin-top:12px">СОХРАНИТЬ РЕЙТИНГ</button>
    </div>`;

    const container=qs('#inlineRankList');
    container.addEventListener('click',e=>{
      const btn=e.target.closest('button'); if(!btn)return;
      const row=btn.closest('.inlineRankRow'); if(!row)return;
      const rows=[...container.querySelectorAll('.inlineRankRow')];
      const idx=rows.indexOf(row);
      if(btn.classList.contains('irMove')){
        const dir=btn.dataset.dir==='up'?-1:1;
        const target=rows[idx+dir];
        if(target){dir<0?container.insertBefore(row,target):container.insertBefore(target,row);refreshNums(container)}
      }
      if(btn.classList.contains('irChamp')){
        const all=rows;
        all.forEach(r=>r.querySelector('.irChamp')?.classList.remove('active'));
        btn.classList.add('active');
        const targetId=row.dataset.id;
        if(weight!=='P4P'){
          F.filter(f=>f.weight===weight).forEach(f=>f.champion=String(f.id)===targetId);
        }
      }
    });
    qs('#irCancel').onclick=()=>{editing=false;if(typeof render==='function')render()};
    qs('#irSave').onclick=saveInline;
  }
  function refreshNums(c){c.querySelectorAll('.inlineRankRow').forEach((r,i)=>{r.dataset.index=i;r.querySelector('.inlineRankNum').textContent=i+1})}
  function saveInline(){
    const rows=[...document.querySelectorAll('#inlineRankList .inlineRankRow')];
    const isP4P=weight==='P4P';
    rows.forEach((r,i)=>{
      if(isP4P){
        const nm=decodeURIComponent(r.dataset.id).trim().toLowerCase();
        F.filter(f=>f.name.trim().toLowerCase()===nm).forEach(f=>{f.p4pRank=i+1;f.p4pManual=true});
      }else{
        const f=F.find(x=>String(x.id)===r.dataset.id);
        if(f){f.rank=i+1;f.rankManual=true}
      }
    });
    saveDB();
    editing=false;
    if(typeof render==='function')render();
  }
  window.openRankingEditor=function(){renderInline()};
  window.openP4PEditor=function(){renderInline()};

  function hook(){
    document.addEventListener('click',e=>{
      const b=e.target.closest('button'); if(!b)return;
      const t=(b.textContent||'').replace(/\s+/g,' ').trim();
      if(t.includes('РЕДАКТИРОВАТЬ РЕЙТИНГ')||t.includes('РЕДАКТИРОВАТЬ P4P')){
        e.preventDefault();e.stopImmediatePropagation();editing=true;renderInline();
      }
    },true);
  }
  const style=document.createElement('style');style.textContent=`
    .inlineRankList{display:grid;gap:7px;margin-top:12px}
    .inlineRankRow{display:flex;align-items:center;gap:9px;background:#121416;border:1px solid #292c30;border-radius:12px;padding:9px;min-height:58px}
    .inlineRankNum{width:28px;text-align:center;font-size:18px;font-weight:900}
    .inlineRankInfo{flex:1;min-width:0}.inlineRankInfo b{display:block;font-size:15px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.inlineRankInfo span{display:block;color:#858a90;font-size:10px;margin-top:3px}
    .inlineRankControls{display:flex;align-items:center;gap:4px;flex-shrink:0}.inlineRankControls button{width:34px;height:38px;padding:0;border-radius:8px;font-weight:900}.irChamp{font-size:17px!important;opacity:.45}.irChamp.active{opacity:1;background:#eee;color:#090a0b}.irMove{font-size:13px}
  `;document.head.appendChild(style);hook();
})();
