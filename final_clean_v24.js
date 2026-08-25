(()=>{'use strict';
const getData=()=>{try{const d=JSON.parse(localStorage.getItem('ratingDB')||'null');return Array.isArray(d)?d:(window.F||[])}catch(e){return window.F||[]}};
function clean(){
 const main=document.getElementById('main'); if(!main)return;
 const data=getData();
 // Never show current active title defenses for non-champions.
 main.querySelectorAll('.row,.card').forEach(el=>{
   const text=(el.textContent||'').toLowerCase();
   if(!text.includes('актив'))return;
   const nameEl=el.querySelector('.name');
   if(!nameEl)return;
   const f=data.find(x=>x.name===nameEl.textContent.trim());
   if(f && !f.champion){
     el.querySelectorAll('*').forEach(n=>{if((n.textContent||'').toLowerCase().includes('актив')){if(n.children.length===0)n.remove()}});
   }
 });
}
function patchHome(){
 if(typeof window.page==='undefined')return;
 if(window.page!=='home')return;
 const main=document.getElementById('main');if(!main)return;
 // Remove rating-like sections from Home; retain only news content.
 [...main.children].forEach(el=>{
   const t=(el.textContent||'').toLowerCase();
   if(/p4p|топ 15|рейтинги|полутяж|средний вес|легкий вес|легчайший|тяжелый вес/.test(t) && !/новост/.test(t))el.remove();
 });
 const h=main.querySelector('.section'); if(h && !/новост/i.test(h.textContent))h.textContent='📰 НОВОСТИ';
}
const oldRender=window.render;
if(typeof oldRender==='function')window.render=function(){oldRender.apply(this,arguments);setTimeout(()=>{patchHome();clean()},0);setTimeout(()=>{patchHome();clean()},150)};
setTimeout(()=>{patchHome();clean()},100);
setTimeout(()=>{patchHome();clean()},500);
})();
