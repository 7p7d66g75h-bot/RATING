// Complete profile layer: history, streaks, methods, title defenses
(function(){
  function norm(f){
    f.history=Array.isArray(f.history)?f.history:[];
    f.wins=Number(f.wins)||0; f.losses=Number(f.losses)||0; f.draws=Number(f.draws)||0;
    f.streak=Number(f.streak)||0;
    f.titleWins=Number(f.titleWins)||0; f.titleDefenses=Number(f.titleDefenses)||0; f.activeDefenses=Number(f.activeDefenses)||0;
    return f;
  }
  F.forEach(norm);
  function method(h){let m=h.method||h.finish||h.type||h.result_method||'';let r=h.round||h.r||h.rd||'';let mm=String(m).toUpperCase(); if(mm==='KO/TKO'||mm==='KOTKO'||mm==='KO')m='KO'; else if(mm==='SUBMISSION'||mm==='SUB')m='SUB'; else if(mm==='DECISION'||mm==='DEC')m='DEC'; else if(!m)m='DEC'; return `${m}${r?` ${r}R`:''}`;}
  function resultClass(h){let r=String(h.result||h.outcome||'').toUpperCase(); return r==='WIN'||r==='W'||r==='ПОБЕДА'?'historyWin':r==='LOSS'||r==='L'||r==='ПОРАЖЕНИЕ'?'historyLoss':'historyDraw';}
  window.openProfile=function(id){
    const f=norm(F.find(x=>x.id==id)); if(!f)return;
    const streak=f.streak;
    const series=streak>0?`${streak} побед подряд`:streak<0?`${Math.abs(streak)} поражения подряд`:'нет активной серии';
    const h=(f.history||[]).slice().reverse();
    document.getElementById('modalContent').innerHTML=`
      <div class="flag" style="font-size:40px">${flag(f)}</div>
      <h1 style="margin:5px 0">${f.name} ${f.champion?'🏆':''}</h1>
      <div class="muted">${names[f.weight]||f.weight}</div>
      <div class="grid" style="margin-top:14px">
        <div class="stat"><b>${f.wins}-${f.losses}-${f.draws}</b><span>ОБЩИЙ РЕКОРД</span></div>
        <div class="stat"><b>${series}</b><span>АКТИВНАЯ СЕРИЯ</span></div>
        <div class="stat"><b>${f.titleWins}</b><span>РАЗ ВЫИГРЫВАЛ ПОЯС</span></div>
        <div class="stat"><b>${f.titleDefenses}</b><span>ВСЕГО ЗАЩИТ ПОЯСА</span></div>
        <div class="stat"><b>${f.activeDefenses}</b><span>АКТИВНАЯ СЕРИЯ ЗАЩИТ</span></div>
        <div class="stat"><b>${f.champion?'🏆 ЧЕМПИОН':'Претендент'}</b><span>СТАТУС</span></div>
      </div>
      <button class="primary" style="margin-top:12px" onclick="editFighter(${f.id})">✎ РЕДАКТИРОВАТЬ</button>
      <div class="section">ИСТОРИЯ БОЁВ (${h.length})</div>
      <div class="list">${h.length?h.map(x=>{let r=x.result||x.outcome||'';let rr=x.round||x.r||'';return `<div class="row"><div class="grow"><div class="${resultClass(x)}">${String(r).toUpperCase()==='WIN'||String(r).toUpperCase()==='W'||r==='ПОБЕДА'?'WIN':String(r).toUpperCase()==='LOSS'||String(r).toUpperCase()==='L'||r==='ПОРАЖЕНИЕ'?'LOSS':'DRAW'} ${method(x)}</div><div class="meta">${x.opponent||x.vs||x.opponentName||'Бой'}</div></div><div class="muted">${rr?rr+'R':''}</div></div>`}).join(''):'<div class="card muted">История боёв пока не заполнена. Добавляй бои через ＋ Бой.</div>'}</div>`;
    document.getElementById('modal').classList.add('show'); save();
  };
  window.closeModal=function(){document.getElementById('modal').classList.remove('show')};
  window.editFighter=function(id){
    const f=norm(F.find(x=>x.id==id)); if(!f)return;
    document.getElementById('modalContent').innerHTML=`<h2>Редактировать бойца</h2>
      <label>Имя</label><input id="efn" value="${String(f.name).replaceAll('"','&quot;')}">
      <label>Победы</label><input id="efw" type="number" value="${f.wins}">
      <label>Поражения</label><input id="efl" type="number" value="${f.losses}">
      <label>Ничьи</label><input id="efd" type="number" value="${f.draws}">
      <label>Активная серия (плюс победы, минус поражения)</label><input id="efs" type="number" value="${f.streak}">
      <label>Выигрывал пояс</label><input id="eftw" type="number" value="${f.titleWins}">
      <label>Общие защиты пояса</label><input id="eftd" type="number" value="${f.titleDefenses}">
      <label>Активная серия защит</label><input id="efad" type="number" value="${f.activeDefenses}">
      <label>Чемпион</label><select id="efc"><option value="0" ${!f.champion?'selected':''}>Нет</option><option value="1" ${f.champion?'selected':''}>Да</option></select>
      <button class="primary" onclick="saveProfileEdit(${f.id})">СОХРАНИТЬ</button>`;
    document.getElementById('modal').classList.add('show');
  };
  window.saveProfileEdit=function(id){let f=F.find(x=>x.id==id);if(!f)return;f.name=document.getElementById('efn').value.trim()||f.name;f.wins=+document.getElementById('efw').value||0;f.losses=+document.getElementById('efl').value||0;f.draws=+document.getElementById('efd').value||0;f.streak=+document.getElementById('efs').value||0;f.titleWins=+document.getElementById('eftw').value||0;f.titleDefenses=+document.getElementById('eftd').value||0;f.activeDefenses=+document.getElementById('efad').value||0;f.champion=document.getElementById('efc').value==='1';save();closeModal();render();};
  save();
})();