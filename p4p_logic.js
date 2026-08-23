(function(){
  // One P4P row per fighter name; merge records from every weight.
  window.p4p=function(){
    const map=new Map();
    F.forEach(f=>{
      const key=f.name.trim().toLowerCase();
      if(!map.has(key)) map.set(key,{...f,wins:0,losses:0,draws:0,titleWins:0,titleDefenses:0,activeDefenses:0,streak:0,weights:[]});
      const x=map.get(key);
      x.wins+=Number(f.wins)||0; x.losses+=Number(f.losses)||0; x.draws+=Number(f.draws)||0;
      x.titleWins=Math.max(x.titleWins||0,Number(f.titleWins)||0);
      x.titleDefenses+=Number(f.titleDefenses)||0;
      x.activeDefenses=Math.max(x.activeDefenses||0,Number(f.activeDefenses)||0);
      if(Math.abs(Number(f.streak)||0)>Math.abs(Number(x.streak)||0)) x.streak=Number(f.streak)||0;
      if(f.champion) x.champion=true;
      if(!x.weights.includes(f.weight)) x.weights.push(f.weight);
    });
    return [...map.values()].sort((a,b)=>p4pScore(b)-p4pScore(a));
  };
  function p4pScore(f){
    const record=(f.wins-f.losses)*10+f.wins*2-f.losses*2;
    const champ=f.champion?300:0;
    const title=(f.titleWins||0)*35;
    const defenses=(f.titleDefenses||0)*25+(f.activeDefenses||0)*35;
    const streak=(f.streak||0)>0?(f.streak*18):((f.streak||0)*12);
    return champ+title+defenses+record+streak;
  }
  // Our champions are separate from #1 contender.
  const champs={
    'Heavyweight':'Кёртис Блейдс','Light Heavyweight':'Алекс Перейра','Middleweight':'Исраэль Адесанья',
    'Welterweight':'Джек Маддалена','Lightweight':'Тони Фергюсон','Featherweight':'Корейский Зомби',
    'Bantamweight':'Пётр Ян','Flyweight':'Кай Аскаура'
  };
  Object.entries(champs).forEach(([w,name])=>F.filter(f=>f.weight===w).forEach(f=>f.champion=(f.name===name)));
  window.ranked=function(){
    return F.filter(f=>f.weight===weight && !f.champion).slice().sort((a,b)=>(a.rank||99)-(b.rank||99)||p4pScore(b)-p4pScore(a));
  };
  window.rank=function(m){
    if(weight==='P4P'){
      const a=p4p(),top=a.slice(0,15),out=a.slice(15);
      m.innerHTML=`<div class="card"><div class="muted">RANKING</div><div class="hero" style="font-size:25px">P4P</div><div class="muted">Единый рекорд бойца из всех весовых. Один боец — одна строка.</div></div><div class="list">${top.map((f,i)=>row(f,i+1)).join('')}</div>${out.length?`<div class="outside"><div class="outsideTitle">За пределами TOP-15</div><div class="list">${out.map((f,i)=>row(f,i+16)).join('')}</div></div>`:''}`;
      return;
    }
    const champion=F.find(f=>f.weight===weight&&f.champion);
    const a=ranked(),top=a.slice(0,15),out=a.slice(15);
    m.innerHTML=`<div class="card"><div class="muted">${names[weight]}</div><div class="hero" style="font-size:25px">Рейтинг</div><div class="muted">Чемпион отдельно · №1 — первый претендент</div></div>${champion?`<div class="section">🏆 ЧЕМПИОН</div><div class="list">${row(champion,'🏆')}</div>`:''}<div class="section">№1–15 ПРЕТЕНДЕНТЫ</div><div class="list">${top.map((f,i)=>row(f,i+1)).join('')||'<div class="card muted">Нет бойцов</div>'}</div>${out.length?`<div class="outside"><div class="outsideTitle">За пределами TOP-15</div><div class="list">${out.map((f,i)=>row(f,i+16)).join('')}</div></div>`:''}`;
  };
  save();
  if(typeof render==='function') render();
})();