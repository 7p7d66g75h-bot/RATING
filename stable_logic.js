(()=>{
const N=v=>Number(v)||0, norm=s=>String(s||'').trim().toLowerCase();
const saveDB=()=>localStorage.setItem('ratingDB',JSON.stringify(F));
const champIcons=f=>f.championCount>=2?'🏆🏆':f.championCount===1?'🏆':'';
function buildP4P(){
 const map=new Map();
 F.forEach(f=>{const k=norm(f.name);if(!map.has(k))map.set(k,{key:k,name:f.name,country:f.country,wins:0,losses:0,draws:0,titleDefenses:0,activeDefenses:0,titleWins:0,streak:0,championCount:0,p4pRank:null,ids:[]});const x=map.get(k);x.wins+=N(f.wins);x.losses+=N(f.losses);x.draws+=N(f.draws);x.titleDefenses+=N(f.titleDefenses);x.activeDefenses+=N(f.activeDefenses);x.titleWins+=N(f.titleWins);x.streak=Math.max(x.streak,N(f.streak));x.championCount+=f.champion?1:0;x.ids.push(f.id);if(N(f.p4pRank)>0&&(x.p4pRank===null||N(f.p4pRank)<x.p4pRank))x.p4pRank=N(f.p4pRank)});
 const a=[...map.values()];
 const score=x=>x.championCount*10000+x.activeDefenses*500+x.titleDefenses*300+x.titleWins*200+x.streak*100+x.wins*10-x.losses*10;
 a.sort((a,b)=>{if(a.p4pRank!==null||b.p4pRank!==null)return(a.p4pRank??999)-(b.p4pRank??999);return score(b)-score(a)});
 return a;
}
function p4pCard(){
 const a=buildP4P();
 return `<div class="card"><div class="muted">P4P</div><div class="hero" style="font-size:25px">Рейтинг P4P</div><div class="muted">Один боец объединяет все весовые. Позиция сохраняется отдельно.</div><button class="primary" style="margin-top:10px" onclick="openP4PEditor()">✎ РЕДАКТИРОВАТЬ P4P</button></div>`;
}
function p4pRow(x,pos){
 const rec=`${x.wins}-${x.losses}-${x.draws}`;
 return `<div class="row" style="cursor:pointer" onclick="openProfile(${x.ids[0]})"><div class="rank">${pos}</div><div class="flag">${FLAGS[x.country]||'🏳️'}</div><div class="grow"><div class="name">${x.name} ${champIcons(x)}</div><div class="meta">ОБЩИЙ РЕКОРД · ${rec} · ${x.streak>0?'+'+x.streak+' W':x.streak<0?x.streak+' L':'0'} · ${x.titleDefenses} защит</div></div><button class="edit" onclick="event.stopPropagation();openP4PEditor()">✎</button></div>`;
}
window.p4p=buildP4P;
window.openP4PEditor=function(){
 const a=buildP4P();
 document.getElementById('modalContent').innerHTML=`<h2>✎ Редактор P4P</h2><div class="muted">Меняй только позицию P4P. Никаких весовых позиций здесь нет.</div>${a.map((x,i)=>`<div class="card"><b>${FLAGS[x.country]||'🏳️'} ${x.name} ${champIcons(x)}</b><div class="meta">${x.wins}-${x.losses}-${x.draws} · ${x.titleDefenses} защит · серия ${x.streak>0?'+'+x.streak:x.streak}</div><label>Позиция P4P</label><input class="p4p-pos" data-key="${encodeURIComponent(x.key)}" type="number" min="1" value="${x.p4pRank||i+1}"></div>`).join('')}<div style="position:sticky;bottom:0;background:#111315;padding:10px 0"><button class="primary" id="saveP4P">СОХРАНИТЬ P4P</button></div>`;
 document.getElementById('saveP4P').onclick=()=>{document.querySelectorAll('.p4p-pos').forEach(e=>{const k=norm(decodeURIComponent(e.dataset.key)),v=N(e.value)||null;F.filter(f=>norm(f.name)===k).forEach(f=>f.p4pRank=v)});saveDB();closeModal();render()};
 document.getElementById('modal').classList.add('show');
};
function cleanEditorButtons(main){main.querySelectorAll('button').forEach(b=>{if(/РЕДАКТИРОВАТЬ РЕЙТИНГ/.test(b.textContent))b.remove()})}
const oldRender=window.render;
window.render=function(){
 oldRender();
 const main=document.getElementById('main'); if(!main)return;
 if(weight==='P4P'&&page==='rank'){
   const a=buildP4P(), top=a.slice(0,15), out=a.slice(15);
   main.innerHTML=p4pCard()+`<div class="section">P4P TOP 15</div><div class="list">${top.map((x,i)=>p4pRow(x,i+1)).join('')}</div>${out.length?`<div class="outside"><div class="outsideTitle">За пределами TOP-15</div><div class="list">${out.map((x,i)=>p4pRow(x,i+16)).join('')}</div></div>`:''}`;
 }else if(page==='rank'){
   cleanEditorButtons(main);
   const card=main.querySelector('.card');
   if(card){const b=document.createElement('button');b.className='primary';b.style.marginTop='10px';b.textContent='✎ РЕДАКТИРОВАТЬ РЕЙТИНГ';b.onclick=window.openRankingEditor;card.appendChild(b)}
 }
};
// Repair P4P immediately and make it independent from legacy P4P scripts.
if(weight==='P4P'&&page==='rank')window.render();
})();