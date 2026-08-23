(function(){
const KEY='ratingDB';
function normalize(){
 let db=JSON.parse(localStorage.getItem(KEY)||'[]');
 if(!Array.isArray(db)) return;
 db.forEach(f=>{
  f.wins=Number(f.wins)||0; f.losses=Number(f.losses)||0; f.draws=Number(f.draws)||0;
  f.streak=Number(f.streak)||0; f.titleDefenses=Number(f.titleDefenses)||0; f.activeDefenses=Number(f.activeDefenses)||0; f.titleWins=Number(f.titleWins)||0;
  f.history=Array.isArray(f.history)?f.history:[];
 });
 localStorage.setItem(KEY,JSON.stringify(db));
}
normalize();
window.addEventListener('beforeunload',normalize);
})();