(function(){
const KEY='p4pOrderV1';
function aggregate(){
 const db=F;
 const map=new Map();
 db.forEach(f=>{
  const k=f.name.trim().toLowerCase();
  if(!map.has(k))map.set(k,{name:f.name,wins:0,losses:0,draws:0,streak:0,titleWins:0,titleDefenses:0,activeDefenses:0,champion:false,ids:[]});
  const a=map.get(k); a.wins+=Number(f.wins)||0;a.losses+=Number(f.losses)||0;a.draws+=Number(f.draws)||0;a.titleWins+=Number(f.titleWins)||0;a.titleDefenses+=Number(f.titleDefenses)||0;a.activeDefenses+=Number(f.activeDefenses)||0;a.champion=a.champion||!!f.champion;a.ids.push(f.id);if(Math.abs(Number(f.streak)||0)>Math.abs(a.streak))a.streak=f.streak;
 });
 return [...map.values()];
}
window.getStableP4P=function(){
 const a=aggregate(); const saved=JSON.parse(localStorage.getItem(KEY)||'[]'); const pos=new Map(saved.map((n,i)=>[n,i]));
 a.sort((x,y)=>{
  if(pos.has(x.name.toLowerCase())||pos.has(y.name.toLowerCase())) return (pos.get(x.name.toLowerCase())??999)-(pos.get(y.name.toLowerCase())??999);
  if(y.champion!==x.champion)return y.champion?1:-1;
  if(y.activeDefenses!==x.activeDefenses)return y.activeDefenses-x.activeDefenses;
  if(y.streak!==x.streak)return y.streak-x.streak;
  if(y.wins!==x.wins)return y.wins-x.wins;
  if(x.losses!==y.losses)return x.losses-y.losses;
  return y.titleDefenses-x.titleDefenses;
 });
 localStorage.setItem(KEY,JSON.stringify(a.map(x=>x.name.toLowerCase())));
 return a;
};
})();