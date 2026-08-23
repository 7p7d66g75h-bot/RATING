(() => {
  const n = v => Number.isFinite(Number(v)) ? Number(v) : 0;
  const saveDB = () => localStorage.setItem('ratingDB', JSON.stringify(F));
  const normalize = s => String(s || '').trim().toLowerCase();

  // Never manufacture a P4P order. P4P is either the saved manual order or a score.
  window.p4p = function () {
    const map = new Map();
    F.forEach(f => {
      const key = normalize(f.name);
      if (!map.has(key)) map.set(key, {
        name:f.name,country:f.country,wins:0,losses:0,draws:0,
        titleDefenses:0,activeDefenses:0,titleWins:0,streak:0,championCount:0,
        p4pRank:null,weights:[]
      });
      const x=map.get(key);
      x.wins+=n(f.wins); x.losses+=n(f.losses); x.draws+=n(f.draws);
      x.titleDefenses+=n(f.titleDefenses); x.activeDefenses+=n(f.activeDefenses); x.titleWins+=n(f.titleWins);
      if (n(f.streak)>x.streak) x.streak=n(f.streak);
      if (f.champion) x.championCount++;
      if (!x.weights.includes(f.weight)) x.weights.push(f.weight);
      if (n(f.p4pRank)>0 && (x.p4pRank===null || n(f.p4pRank)<x.p4pRank)) x.p4pRank=n(f.p4pRank);
    });
    const score=x => x.championCount*1000+x.activeDefenses*50+x.titleDefenses*35+x.titleWins*30+x.streak*20+x.wins*3-x.losses*3;
    return [...map.values()].sort((a,b)=>{
      if(a.p4pRank!==null || b.p4pRank!==null) return (a.p4pRank??999)-(b.p4pRank??999);
      return score(b)-score(a) || b.wins-a.wins || a.losses-b.losses;
    });
  };

  function rankList(){
    return F.filter(f=>f.weight===weight).slice().sort((a,b)=>{
      if(a.champion!==b.champion) return a.champion?-1:1;
      const ar=n(a.rank)||999, br=n(b.rank)||999;
      if(ar!==br) return ar-br;
      return (b.streak-a.streak)||(b.wins-a.losses-a.wins+a.losses);
    });
  }

  window.openP4PEditor=function(){
    const a=p4p();
    document.getElementById('modalContent').innerHTML=`<h2>✎ Редактор P4P</h2><div class="muted">Меняй только позицию. Она сохраняется отдельно.</div>${a.map((f,i)=>`<div class="card"><b>${flag({country:f.country})} ${f.name}</b><div class="muted">${f.wins}-${f.losses}-${f.draws} · ${f.championCount?'🏆'.repeat(Math.min(2,f.championCount)):'без пояса'}</div><label>Позиция P4P</label><input class="stable-p4" data-name="${encodeURIComponent(f.name)}" type="number" min="1" value="${f.p4pRank||i+1}"></div>`).join('')}<div style="position:sticky;bottom:0;background:#111315;padding:10px 0"><button class="primary" id="saveP4PBtn">СОХРАНИТЬ P4P</button></div>`;
    document.getElementById('saveP4PBtn').onclick=()=>{document.querySelectorAll('.stable-p4').forEach(e=>F.filter(f=>normalize(f.name)===normalize(decodeURIComponent(e.dataset.name))).forEach(f=>f.p4pRank=n(e.value)||null));saveDB();closeModal();render();};
    document.getElementById('modal').classList.add('show');
  };

  window.openRankingEditor=function(){
    if(weight==='P4P') return openP4PEditor();
    const a=F.filter(f=>f.weight===weight).slice().sort((x,y)=>(n(x.rank)||999)-(n(y.rank)||999));
    document.getElementById('modalContent').innerHTML=`<h2>✎ ${names[weight]} — рейтинг</h2><div class="muted">Редактируй позиции и чемпиона.</div>${a.map(f=>`<div class="card"><b>${flag(f)} ${f.name}</b><div class="muted">${f.wins}-${f.losses}-${f.draws}</div><label>Позиция</label><input class="stable-rank" data-id="${f.id}" type="number" min="1" value="${n(f.rank)||999}"><label><input class="stable-champ" data-id="${f.id}" type="radio" name="stableChamp" ${f.champion?'checked':''}> Чемпион</label></div>`).join('')}<div style="position:sticky;bottom:0;background:#111315;padding:10px 0"><button class="primary" id="saveRankBtn">СОХРАНИТЬ РЕЙТИНГ</button></div>`;
    document.getElementById('saveRankBtn').onclick=()=>{document.querySelectorAll('.stable-rank').forEach(e=>{const f=F.find(x=>x.id==e.dataset.id);if(f)f.rank=n(e.value)||999});const chosen=document.querySelector('.stable-champ:checked');F.filter(f=>f.weight===weight).forEach(f=>f.champion=!!chosen&&String(f.id)===chosen.dataset.id);saveDB();closeModal();render();};
    document.getElementById('modal').classList.add('show');
  };

  window.editFighter=function(id){
    const f=F.find(x=>x.id===id); if(!f)return;
    document.getElementById('modalContent').innerHTML=`<h2>✎ ${flag(f)} ${f.name}</h2><label>Победы</label><input id="swin" type="number" value="${n(f.wins)}"><label>Поражения</label><input id="sloss" type="number" value="${n(f.losses)}"><label>Ничьи</label><input id="sdraw" type="number" value="${n(f.draws)}"><label>Серия (+/-)</label><input id="sstreak" type="number" value="${n(f.streak)}"><label>Общие защиты</label><input id="sdef" type="number" value="${n(f.titleDefenses)}"><label>Активные защиты</label><input id="sact" type="number" value="${n(f.activeDefenses)}"><label>Позиция</label><input id="srank" type="number" value="${n(f.rank)||999}"><label>P4P</label><input id="sp4p" type="number" value="${n(f.p4pRank)||''}"><label><input id="schamp" type="checkbox" ${f.champion?'checked':''}> Чемпион</label><div style="position:sticky;bottom:0;background:#111315;padding:10px 0"><button class="primary" id="saveFBtn">СОХРАНИТЬ</button></div>`;
    document.getElementById('saveFBtn').onclick=()=>{f.wins=n(swin.value);f.losses=n(sloss.value);f.draws=n(sdraw.value);f.streak=n(sstreak.value);f.titleDefenses=n(sdef.value);f.activeDefenses=n(sact.value);f.rank=n(srank.value)||999;f.p4pRank=n(sp4p.value)||null;f.champion=schamp.checked;saveDB();closeModal();render();};
    document.getElementById('modal').classList.add('show');
  };

  window.addFight=function(){
    const s=document.getElementById('bf'), r=document.getElementById('br'); if(!s||!r)return;
    const f=F.find(x=>String(x.id)===String(s.value)); if(!f)return;
    const result=r.value==='W'||r.value==='1'||r.value==='WIN'?'W':r.value==='L'||r.value==='0'||r.value==='LOSS'?'L':'D';
    const wasChampion=!!f.champion;
    f.history=f.history||[];
    if(result==='W'){
      f.wins=n(f.wins)+1; f.streak=f.streak>0?f.streak+1:1;
      if(wasChampion){f.titleDefenses=n(f.titleDefenses)+1;f.activeDefenses=n(f.activeDefenses)+1;}
      f.history.unshift({result:'W',method:document.getElementById('bm')?.value||'DECISION',round:document.getElementById('bround')?.value||'3R',date:new Date().toLocaleDateString('ru-RU')});
    }else if(result==='L'){
      f.losses=n(f.losses)+1; f.streak=f.streak<0?f.streak-1:-1; f.history.unshift({result:'L',method:document.getElementById('bm')?.value||'DECISION',round:document.getElementById('bround')?.value||'3R',date:new Date().toLocaleDateString('ru-RU')});
      if(wasChampion){f.champion=false;f.activeDefenses=0;const candidate=F.filter(x=>x.weight===f.weight&&!x.champion&&n(x.streak)>=2).sort((a,b)=>(n(a.rank)||999)-(n(b.rank)||999))[0];if(candidate)candidate.champion=true;}
    }else{f.draws=n(f.draws)+1;f.streak=0;f.history.unshift({result:'D',method:document.getElementById('bm')?.value||'DRAW',round:document.getElementById('bround')?.value||'3R',date:new Date().toLocaleDateString('ru-RU')});}
    saveDB();weight=f.weight;page='rank';render();
  };

  const oldRow=window.row;
  window.row=function(f,pos){let s=oldRow(f,pos);if(f.championCount>=2)s=s.replace('🏆','🏆🏆');return s;};

  const oldRank=window.rank;
  window.rank=function(m){oldRank(m);const c=m.querySelector('.card');if(c){const b=document.createElement('button');b.className='primary';b.textContent='✎ РЕДАКТИРОВАТЬ РЕЙТИНГ';b.style.marginTop='10px';b.onclick=window.openRankingEditor;c.appendChild(b);}};

  // Replace the render once, after all legacy scripts have loaded. This removes the need for a manual refresh.
  const baseRender=window.render;
  window.render=function(){baseRender(); if(weight==='P4P'){const main=document.getElementById('main'); if(main&&!main.querySelector('[data-stable-p4p]')){const b=document.createElement('button');b.dataset.stableP4p='1';b.className='primary';b.textContent='✎ РЕДАКТИРОВАТЬ P4P';b.onclick=window.openP4PEditor;const card=main.querySelector('.card');if(card)card.appendChild(b);}}};
  window.render();
})();