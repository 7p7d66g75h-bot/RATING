(function(){
  const num=v=>{const n=Number(v);return Number.isFinite(n)?n:0};
  const saveDB=()=>{if(typeof save==='function')save();else localStorage.ratingDB=JSON.stringify(F)};
  const close=()=>{if(typeof closeModal==='function')closeModal();else document.getElementById('modal').classList.remove('show')};

  // Stable P4P: one row per fighter name, aggregate record across divisions.
  // P4P rank is an explicit manual field and never comes from a weight-class rank.
  window.p4p=function(){
    const map=new Map();
    F.forEach(f=>{
      const key=(f.name||'').trim().toLowerCase();
      if(!map.has(key)) map.set(key,{name:f.name,country:f.country,wins:0,losses:0,draws:0,titleWins:0,titleDefenses:0,activeDefenses:0,streak:0,weights:[],championCount:0,p4pRank:null,ids:[]});
      const x=map.get(key); x.ids.push(f.id); x.wins+=num(f.wins); x.losses+=num(f.losses); x.draws+=num(f.draws); x.titleWins+=num(f.titleWins); x.titleDefenses+=num(f.titleDefenses); x.activeDefenses+=num(f.activeDefenses); x.streak=Math.abs(num(f.streak))>Math.abs(x.streak)?num(f.streak):x.streak; if(f.champion)x.championCount++; if(!x.weights.includes(f.weight))x.weights.push(f.weight); if(f.p4pRank!=null&&f.p4pRank!==''){const r=num(f.p4pRank);if(r>0&&(x.p4pRank==null||r<x.p4pRank))x.p4pRank=r;}
    });
    const score=f=>num(f.wins)*2-num(f.losses)*2+(f.streak>0?f.streak*18:f.streak*12)+f.championCount*300+f.titleDefenses*25+f.activeDefenses*35+f.titleWins*35;
    return [...map.values()].sort((a,b)=>{const ar=a.p4pRank||999,br=b.p4pRank||999;if(ar!==br)return ar-br;return score(b)-score(a)||b.wins-a.wins;});
  };

  // P4P editor: set a single persistent position for each fighter, including double champions.
  window.openP4PEditor=function(){
    const arr=p4p();
    document.getElementById('modalContent').innerHTML=`<h2>✎ Редактор P4P</h2><div class="muted">Позиция P4P сохраняется отдельно от рейтингов весовых категорий. Рекорд и защиты не меняются.</div><div id="p4pEditList">${arr.map((f,i)=>`<div class="card" style="margin-top:8px"><b>${flag({country:f.country})} ${f.name}</b><div class="muted">${f.wins}-${f.losses}-${f.draws} · ${f.championCount?'🏆'.repeat(Math.min(3,f.championCount)):'без пояса'}</div><label>Позиция P4P</label><input class="p4pPos" data-name="${encodeURIComponent(f.name)}" type="number" min="1" max="999" value="${f.p4pRank||i+1}"></div>`).join('')}</div><div style="position:sticky;bottom:0;background:#111315;padding:10px 0"><button class="primary" onclick="saveP4PEditor()">СОХРАНИТЬ P4P</button></div>`;
    document.getElementById('modal').classList.add('show');
  };
  window.saveP4PEditor=function(){
    document.querySelectorAll('.p4pPos').forEach(el=>{const name=decodeURIComponent(el.dataset.name).trim().toLowerCase();const ids=F.filter(f=>f.name.trim().toLowerCase()===name);const r=Math.max(1,num(el.value));ids.forEach(f=>f.p4pRank=r);});
    saveDB();close();render();
  };

  // Weight ranking editor with sticky save button; P4P uses its own editor.
  window.openRankingEditor=function(){
    if(weight==='P4P'){openP4PEditor();return;}
    const fighters=F.filter(f=>f.weight===weight).slice().sort((a,b)=>(num(a.rank)||999)-(num(b.rank)||999)||a.name.localeCompare(b.name,'ru'));
    document.getElementById('modalContent').innerHTML=`<h2>✎ ${names[weight]} — рейтинг</h2><div class="muted">Меняй позиции и чемпиона. Для рекорда/серий/защит используй редактор бойца.</div><div>${fighters.map(f=>`<div class="card" style="margin-top:8px"><b>${flag(f)} ${f.name}</b><div class="muted">${f.wins}-${f.losses}-${f.draws}</div><label>Позиция</label><input class="rankPos" data-id="${f.id}" type="number" min="1" max="999" value="${num(f.rank)||999}"><label><input class="rankChamp" data-id="${f.id}" type="checkbox" ${f.champion?'checked':''}> Чемпион</label></div>`).join('')}</div><div style="position:sticky;bottom:0;background:#111315;padding:10px 0"><button class="primary" onclick="saveRankingEditor()">СОХРАНИТЬ РЕЙТИНГ</button></div>`;
    document.getElementById('modal').classList.add('show');
  };
  window.saveRankingEditor=function(){
    if(weight==='P4P'){saveP4PEditor();return;}
    const fighters=F.filter(f=>f.weight===weight); let newChamp=null;
    document.querySelectorAll('.rankPos').forEach(el=>{const f=F.find(x=>x.id==el.dataset.id);if(f)f.rank=Math.max(1,num(el.value));});
    document.querySelectorAll('.rankChamp').forEach(el=>{if(el.checked)newChamp=F.find(x=>x.id==el.dataset.id)||null;});
    fighters.forEach(f=>{const should=newChamp&&f.id===newChamp.id;if(should&&!f.champion)f.activeDefenses=0;f.champion=!!should;});
    saveDB();close();render();
  };

  // Full fighter editor. Defenses are editable here, including active and total defenses.
  window.editFighter=function(id){
    const f=F.find(x=>x.id===id); if(!f)return;
    document.getElementById('modalContent').innerHTML=`<h2>✎ ${flag(f)} ${f.name}</h2><label>Вес</label><select id="ef_weight">${W.filter(x=>x!=='P4P').map(w=>`<option value="${w}" ${f.weight===w?'selected':''}>${names[w]}</option>`).join('')}</select><label>Победы</label><input id="ef_w" type="number" min="0" value="${num(f.wins)}"><label>Поражения</label><input id="ef_l" type="number" min="0" value="${num(f.losses)}"><label>Ничьи</label><input id="ef_d" type="number" min="0" value="${num(f.draws)}"><label>Серия (победы +, поражения -)</label><input id="ef_s" type="number" value="${num(f.streak)}"><label>Общие защиты пояса</label><input id="ef_td" type="number" min="0" value="${num(f.titleDefenses)}"><label>Активная серия защит</label><input id="ef_ad" type="number" min="0" value="${num(f.activeDefenses)}"><label>Побед за пояс / завоеваний</label><input id="ef_tw" type="number" min="0" value="${num(f.titleWins)}"><label>Позиция в весе</label><input id="ef_rank" type="number" min="1" value="${num(f.rank)||999}"><label>P4P позиция</label><input id="ef_p4p" type="number" min="1" value="${num(f.p4pRank)||999}"><label><input id="ef_champ" type="checkbox" ${f.champion?'checked':''}> Чемпион</label><div style="position:sticky;bottom:0;background:#111315;padding:10px 0"><button class="primary" onclick="saveFighterEdit(${id})">СОХРАНИТЬ БОЙЦА</button></div>`;
    document.getElementById('modal').classList.add('show');
  };
  window.saveFighterEdit=function(id){
    const f=F.find(x=>x.id===id);if(!f)return;
    f.weight=document.getElementById('ef_weight').value;f.wins=Math.max(0,num(document.getElementById('ef_w').value));f.losses=Math.max(0,num(document.getElementById('ef_l').value));f.draws=Math.max(0,num(document.getElementById('ef_d').value));f.streak=num(document.getElementById('ef_s').value);f.titleDefenses=Math.max(0,num(document.getElementById('ef_td').value));f.activeDefenses=Math.max(0,num(document.getElementById('ef_ad').value));f.titleWins=Math.max(0,num(document.getElementById('ef_tw').value));f.rank=Math.max(1,num(document.getElementById('ef_rank').value)||999);f.p4pRank=Math.max(1,num(document.getElementById('ef_p4p').value)||999);f.champion=document.getElementById('ef_champ').checked;saveDB();close();render();
  };

  // Make the editor button available directly in every ranking, including P4P.
  const oldRank=window.rank;
  window.rank=function(m){oldRank(m);const card=m.querySelector('.card');if(card){const b=document.createElement('button');b.className='primary';b.style.marginTop='10px';b.textContent='✎ РЕДАКТИРОВАТЬ РЕЙТИНГ';b.onclick=openRankingEditor;card.appendChild(b);}};

  // Final fight handler: champion wins automatically add total+active defense; champion loss transfers title without adding a win to the new champion.
  window.addFight=function(){
    const select=document.getElementById('bf')||document.getElementById('f'),resultEl=document.getElementById('br')||document.getElementById('r');if(!select||!resultEl)return;const f=F.find(x=>x.id==select.value);if(!f)return;const raw=resultEl.value;const result=(raw==='W'||raw==='1'||raw==='WIN')?'WIN':(raw==='L'||raw==='0'||raw==='LOSS'?'LOSS':'DRAW');const wasChamp=!!f.champion;
    f.history=f.history||[];if(result==='WIN'){f.wins=num(f.wins)+1;f.streak=f.streak>0?f.streak+1:1;if(wasChamp){f.titleDefenses=num(f.titleDefenses)+1;f.activeDefenses=num(f.activeDefenses)+1;}}else if(result==='LOSS'){f.losses=num(f.losses)+1;f.streak=f.streak<0?f.streak-1:-1;f.history.unshift({result:'LOSS',method:document.getElementById('bm')?.value||'',round:document.getElementById('bround')?.value||'',date:new Date().toLocaleDateString('ru-RU')});if(wasChamp){f.champion=false;f.activeDefenses=0;const c=F.filter(x=>x.weight===f.weight&&!x.champion&&num(x.streak)>=2).sort((a,b)=>(num(a.rank)||999)-(num(b.rank)||999)||num(b.streak)-num(a.streak))[0];if(c){c.champion=true;c.activeDefenses=0;}}saveDB();weight=f.weight;page='rank';render();return;}else{f.draws=num(f.draws)+1;f.streak=0;}f.history.unshift({result,method:document.getElementById('bm')?.value||'',round:document.getElementById('bround')?.value||'',date:new Date().toLocaleDateString('ru-RU')});saveDB();weight=f.weight;page='rank';render();
  };

  if(typeof render==='function')render();
})();