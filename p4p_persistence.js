(function(){
  const P4P={
    'Алекс Перейра':{rank:1,streak:5},
    'Тони Фергюсон':{streak:1}
  };
  function load(){try{return JSON.parse(localStorage.ratingDB||'[]')}catch(e){return []}}
  function saveDB(a){localStorage.ratingDB=JSON.stringify(a)}
  const a=load();
  a.forEach(f=>{
    const p=P4P[f.name];
    if(p){ if(p.rank!==undefined) f.p4pRank=p.rank; if(p.streak!==undefined) f.streak=p.streak; }
    f.p4pRank=Number.isFinite(Number(f.p4pRank))?Number(f.p4pRank):null;
  });
  // P4P is an explicit persistent ranking, not a recalculated visual order.
  window.setP4PRank=function(id,rank){const a=load();const f=a.find(x=>String(x.id)===String(id));if(!f)return;f.p4pRank=Number(rank)||null;saveDB(a);};
  saveDB(a);
})();