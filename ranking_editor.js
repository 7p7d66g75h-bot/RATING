(function(){
  function n(v){const x=Number(v);return Number.isFinite(x)?x:99;}
  function saveNow(){if(typeof save==='function')save();}

  // Manual ranking editor: preserves all fighter stats while changing only rank/champion status.
  window.openRankingEditor=function(){
    if(typeof weight==='undefined'||weight==='P4P'){
      alert('Выбери конкретный вес, чтобы редактировать его рейтинг.');
      return;
    }
    const fighters=F.filter(f=>f.weight===weight).slice().sort((a,b)=>n(a.rank)-n(b.rank)||a.name.localeCompare(b.name,'ru'));
    const html=`<h2>✎ Редактор рейтинга</h2><div class="muted">${names[weight]||weight}. Меняй только позиции и чемпиона — рекорд, серии и защиты не трогаются.</div>${fighters.map(f=>`<div class="card" style="margin-top:8px"><b>${flag(f)} ${f.name}</b><label>Позиция</label><input id="rr_${f.id}" type="number" min="1" max="999" value="${n(f.rank)}"><label><input id="rc_${f.id}" type="checkbox" ${f.champion?'checked':''}> Чемпион</label></div>`).join('')}<button class="primary" onclick="saveRankingEditor()">СОХРАНИТЬ РЕЙТИНГ</button>`;
    document.getElementById('modalContent').innerHTML=html;
    document.getElementById('modal').classList.add('show');
  };
  window.saveRankingEditor=function(){
    if(typeof weight==='undefined'||weight==='P4P')return;
    const fighters=F.filter(f=>f.weight===weight);
    let championId=null;
    fighters.forEach(f=>{
      const rank=document.getElementById('rr_'+f.id);
      const champ=document.getElementById('rc_'+f.id);
      if(rank)f.rank=Math.max(1,n(rank.value));
      if(champ&&champ.checked)championId=f.id;
    });
    // Only one champion per division. Manual champion assignment resets active defenses to 0 only when a new fighter receives the belt.
    fighters.forEach(f=>{
      const should=f.id===championId;
      if(should&&!f.champion)f.activeDefenses=0;
      f.champion=should;
    });
    saveNow();
    closeModal();
    render();
  };

  // Add a visible editor button to every concrete weight ranking.
  const oldRank=window.rank;
  window.rank=function(m){
    oldRank(m);
    if(typeof weight!=='undefined'&&weight!=='P4P'){
      const card=m.querySelector('.card');
      if(card)card.insertAdjacentHTML('beforeend','<button class="primary" style="margin-top:10px" onclick="openRankingEditor()">✎ РЕДАКТИРОВАТЬ РЕЙТИНГ</button>');
    }
  };

  // P4P: a fighter who is champion in two divisions displays two belts.
  const oldP4P=window.p4p;
  window.p4p=function(){
    const arr=oldP4P();
    const map=new Map();
    F.forEach(f=>{
      const key=f.name.trim().toLowerCase();
      if(f.champion)map.set(key,(map.get(key)||0)+1);
    });
    arr.forEach(f=>f.beltCount=map.get(f.name.trim().toLowerCase())||0);
    return arr;
  };
  const oldRow=window.row;
  window.row=function(f,pos){
    let html=oldRow(f,pos);
    if(f.beltCount>=2)html=html.replace('🏆','🏆🏆');
    return html;
  };

  if(typeof render==='function')render();
})();