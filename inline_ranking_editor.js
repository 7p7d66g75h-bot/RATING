(function(){
  'use strict';
  const qs=s=>document.querySelector(s);
  const esc=s=>String(s??'').replace(/[&<>\"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[m]));
  const n=v=>{const x=Number(v);return Number.isFinite(x)?x:0};
  const saveDB=()=>{if(typeof save==='function')save();else localStorage.ratingDB=JSON.stringify(F)};
  let editing=false;
  const NEWS_KEY='fighterRatingsNewsV1';
  const getNews=()=>{try{return JSON.parse(localStorage.getItem(NEWS_KEY)||'[]')}catch{return[]}};
  const putNews=items=>{const old=getNews();localStorage.setItem(NEWS_KEY,JSON.stringify([...items,...old].slice(0,20)))};
  const addNews=text=>putNews([{id:Date.now()+Math.random(),text,ts:Date.now()}]);
  const weightName=w=>(window.names&&window.names[w])||w;
  const flagOf=f=>typeof flag==='function'?flag(f):(window.FLAGS&&FLAGS[f.country])||'🏳️';

  // Current champion correction requested for the database. Applied once.
  function seedCurrentChampions(){
    if(localStorage.getItem('championsV2Applied')==='1')return;
    [['Bantamweight','Пётр Ян'],['Flyweight','Кай Аскаура']].forEach(([w,name])=>{
      const target=F.find(f=>f.weight===w&&f.name===name);
      if(!target)return;
      F.filter(f=>f.weight===w).forEach(f=>f.champion=false);
      target.champion=true;
      target.titleWins=Math.max(1,n(target.titleWins));
    });
    saveDB();
    localStorage.setItem('championsV2Applied','1');
  }
  seedCurrentChampions();

  // One fighter = one P4P row. Record and title statistics are aggregated across all divisions.
  window.p4p=function(){
    const map=new Map();
    F.forEach(f=>{
      const key=String(f.name||'').trim().toLowerCase(); if(!key)return;
      if(!map.has(key))map.set(key,{...f,wins:0,losses:0,draws:0,titleWins:0,titleDefenses:0,activeDefenses:0,streak:0,weights:[],championCount:0,p4pRank:null,p4pManual:false});
      const x=map.get(key);
      x.wins+=n(f.wins);x.losses+=n(f.losses);x.draws+=n(f.draws);
      x.titleWins+=n(f.titleWins);x.titleDefenses+=n(f.titleDefenses);x.activeDefenses+=n(f.activeDefenses);
      if(n(f.streak)>n(x.streak))x.streak=n(f.streak);
      if(!x.weights.includes(f.weight))x.weights.push(f.weight);
      if(f.champion){x.championCount++;x.champion=true}
      if(n(f.p4pRank)>0&&(!x.p4pRank||n(f.p4pRank)<x.p4pRank))x.p4pRank=n(f.p4pRank);
      if(f.p4pManual)x.p4pManual=true;
    });
    return [...map.values()].sort((a,b)=>{
      if(a.p4pManual&&b.p4pManual&&a.p4pRank!==b.p4pRank)return a.p4pRank-b.p4pRank;
      if(a.p4pManual!==b.p4pManual)return a.p4pManual?-1:1;
      if(a.p4pManual&&a.p4pRank!==b.p4pRank)return a.p4pRank-b.p4pRank;
      return p4pScore(b)-p4pScore(a);
    });
  };
  function p4pScore(f){return (f.championCount||0)*260+(f.activeDefenses||0)*55+(f.titleDefenses||0)*20+Math.max(0,n(f.streak))*22+n(f.wins)*7-n(f.losses)*10+n(f.titleWins)*25}

  function getList(){
    if(typeof weight==='undefined')return[];
    if(weight==='P4P')return p4p();
    return F.filter(f=>f.weight===weight&&!f.champion).slice().sort((a,b)=>(n(a.rank)||999)-(n(b.rank)||999)||p4pScore(b)-p4pScore(a));
  }
  function rankMapFor(w){
    const list=w==='P4P'?p4p():F.filter(f=>f.weight===w&&!f.champion).slice().sort((a,b)=>(n(a.rank)||999)-(n(b.rank)||999));
    const m={};list.forEach((f,i)=>m[String(f.name).toLowerCase()]=i+1);return m;
  }
  function capture(w){return rankMapFor(w)}
  function newsFor(before,after,w){
    const out=[];
    Object.keys(after).forEach(name=>{
      if(before[name]===undefined||before[name]===after[name])return;
      const a=before[name],b=after[name],f=F.find(x=>x.name.toLowerCase()===name)||{},nm=f.name||name,div=w==='P4P'?'P4P':weightName(w);
      if(b<=5&&a>5)out.push(`${flagOf(f)} ${nm} поднялся в TOP-5 — теперь №${b} в ${div}`);
      else if(b<a)out.push(`${flagOf(f)} ${nm} поднялся с №${a} на №${b} в ${div}`);
      else out.push(`${flagOf(f)} ${nm} опустился с №${a} на №${b} в ${div}`);
    });
    return out;
  }
  function renderInline(){
    if(!editing)return;
    const main=qs('#main');if(!main)return;
    const list=getList(),isP4P=weight==='P4P';
    const rows=list.map((f,i)=>{
      const id=f.id!=null?String(f.id):encodeURIComponent(f.name),champ=isP4P?n(f.championCount)>0:!!f.champion;
      return `<div class="inlineRankRow" data-id="${esc(id)}" data-name="${esc(f.name)}" data-index="${i}"><div class="inlineRankNum">${i+1}</div><div class="inlineRankInfo"><b>${flagOf(f)} ${esc(f.name)}</b><span>${n(f.wins)}-${n(f.losses)}-${n(f.draws)}${champ?' · 🏆'.repeat(Math.max(1,isP4P?n(f.championCount):1)):''}${isP4P&&n(f.activeDefenses)?` · ${n(f.activeDefenses)} активных защит`:''}</span></div><div class="inlineRankControls"><button type="button" class="irMove" data-dir="up">▲</button><button type="button" class="irMove" data-dir="down">▼</button>${!isP4P?`<button type="button" class="irChamp ${champ?'active':''}">🏆</button>`:''}</div></div>`;
    }).join('');
    main.innerHTML=`<div class="card inlineEditorCard"><div class="inlineEditorHead"><div><div class="hero" style="font-size:25px">✎ ${isP4P?'P4P':'Рейтинг'}</div><div class="muted">Перемещай бойцов справа. ${isP4P?'Позиции P4P сохраняются отдельно.':'🏆 — назначить чемпиона.'}</div></div><button type="button" id="irCancel">Отмена</button></div><div id="inlineRankList" class="inlineRankList">${rows}</div><button type="button" class="primary" id="irSave">${isP4P?'СОХРАНИТЬ P4P':'СОХРАНИТЬ РЕЙТИНГ'}</button></div>`;
    const container=qs('#inlineRankList');
    container.addEventListener('click',e=>{const btn=e.target.closest('button');if(!btn)return;const row=btn.closest('.inlineRankRow');if(!row)return;const rows=[...container.querySelectorAll('.inlineRankRow')],idx=rows.indexOf(row);
      if(btn.classList.contains('irMove')){const dir=btn.dataset.dir==='up'?-1:1,target=rows[idx+dir];if(target){dir<0?container.insertBefore(row,target):container.insertBefore(target,row);refreshNums(container)}}
      if(btn.classList.contains('irChamp')){rows.forEach(r=>r.querySelector('.irChamp')?.classList.remove('active'));btn.classList.add('active');const id=row.dataset.id;F.filter(f=>f.weight===weight).forEach(f=>f.champion=String(f.id)===id);saveDB();addNews(`${flagOf(F.find(f=>String(f.id)===id)||{})} ${row.dataset.name} стал чемпионом в ${weightName(weight)}`)}
    });
    qs('#irCancel').onclick=()=>{editing=false;if(typeof render==='function')render()};
    qs('#irSave').onclick=saveInline;
  }
  function refreshNums(c){c.querySelectorAll('.inlineRankRow').forEach((r,i)=>{r.dataset.index=i;r.querySelector('.inlineRankNum').textContent=i+1})}
  function saveInline(){
    const w=weight,before=capture(w),rows=[...document.querySelectorAll('#inlineRankList .inlineRankRow')],isP4P=w==='P4P';
    rows.forEach((r,i)=>{if(isP4P){const nm=r.dataset.name.trim().toLowerCase();F.filter(f=>f.name.trim().toLowerCase()===nm).forEach(f=>{f.p4pRank=i+1;f.p4pManual=true})}else{const f=F.find(x=>String(x.id)===r.dataset.id);if(f){f.rank=i+1;f.rankManual=true}}});
    saveDB();newsFor(before,capture(w),w).forEach(addNews);editing=false;if(typeof render==='function')render();setTimeout(injectHomeNews,50);
  }
  function injectHomeNews(){
    const main=qs('#main');if(!main||!(/DATABASE|P4P TOP 15/.test(main.textContent||'')))return;
    let box=qs('#rankingNews');if(box)box.remove();const items=getNews().slice(0,8);if(!items.length)return;
    main.insertAdjacentHTML('afterbegin',`<div id="rankingNews" class="card rankingNews"><div class="section" style="margin-top:0">📰 НОВОСТИ РЕЙТИНГОВ</div><div class="newsList">${items.map(x=>`<div class="newsItem">${esc(x.text)}</div>`).join('')}</div></div>`);
  }
  window.openRankingEditor=()=>{editing=true;renderInline()};window.openP4PEditor=()=>{editing=true;renderInline()};
  function hook(){document.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;const t=(b.textContent||'').replace(/\s+/g,' ').trim();if(t.includes('РЕДАКТИРОВАТЬ РЕЙТИНГ')||t.includes('РЕДАКТИРОВАТЬ P4P')){e.preventDefault();e.stopImmediatePropagation();editing=true;renderInline()}},true)}
  const style=document.createElement('style');style.textContent=`
    .inlineEditorCard{width:100%;max-width:100%;overflow:hidden}.inlineEditorHead{display:flex;justify-content:space-between;align-items:center;gap:8px;min-width:0}.inlineRankList{display:grid;gap:7px;margin-top:12px;width:100%;max-width:100%;overflow:hidden}.inlineRankRow{display:flex;align-items:center;gap:6px;background:#121416;border:1px solid #292c30;border-radius:12px;padding:8px;width:100%;max-width:100%;min-width:0;overflow:hidden}.inlineRankNum{width:27px;flex:0 0 27px;text-align:center;font-size:18px;font-weight:900}.inlineRankInfo{flex:1 1 auto;min-width:0;overflow:hidden}.inlineRankInfo b{display:block;font-size:15px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.inlineRankInfo span{display:block;color:#858a90;font-size:10px;margin-top:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.inlineRankControls{display:flex;align-items:center;justify-content:flex-end;gap:3px;flex:0 0 auto;width:auto}.inlineRankControls button{width:31px;height:36px;min-width:31px;flex:0 0 31px;padding:0;border-radius:8px;font-weight:900}.irChamp{font-size:16px!important;opacity:.45}.irChamp.active{opacity:1;background:#eee;color:#090a0b}.irMove{font-size:12px}.rankingNews{margin-top:12px}.newsList{display:grid;gap:6px}.newsItem{padding:9px 10px;background:#181a1d;border-radius:9px;font-size:12px;font-weight:700}.rankingNews .section{font-size:15px}
  `;document.head.appendChild(style);hook();
  const mo=new MutationObserver(()=>{if(!editing)injectHomeNews()});mo.observe(document.body,{subtree:true,childList:true});setTimeout(injectHomeNews,250);
})();