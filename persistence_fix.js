(function(){
  // Keep every manual profile/ranking edit persistent in the same local database.
  setInterval(function(){try{localStorage.ratingDB=JSON.stringify(F)}catch(e){}},250);
  window.addEventListener('pagehide',function(){try{localStorage.ratingDB=JSON.stringify(F)}catch(e){}});
  window.addEventListener('beforeunload',function(){try{localStorage.ratingDB=JSON.stringify(F)}catch(e){}});
  // P4P uses the manually assigned P4P rank when present. If two fighters have no P4P rank,
  // fall back to the normal P4P criteria instead of changing saved rank values.
  window.p4p=function(){return F.slice().sort(function(a,b){
    const ar=Number(a.p4pRank||0), br=Number(b.p4pRank||0);
    if(ar&&br)return ar-br;
    if(ar&&!br)return -1;
    if(br&&!ar)return 1;
    return (b.wins-b.losses)-(a.wins-a.losses)||b.wins-a.wins||b.streak-a.streak||b.titleDefenses-a.titleDefenses;
  })};
})();