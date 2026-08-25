(()=>{'use strict';
/* FINAL LOADER v23: never modifies fighter records. Loads ranking stabilizer then the UI/news patch. */
try{const old=JSON.parse(localStorage.getItem('manualP4PPositions_v2')||'null');const cur=JSON.parse(localStorage.getItem('manualP4PPositions_v3')||'null');if(old&&typeof old==='object'&&(!cur||!Object.keys(cur).length))localStorage.setItem('manualP4PPositions_v3',JSON.stringify(old));}catch(e){}
const s=document.createElement('script');s.src='stabilizer_v21.js?v=23.0';s.onload=()=>{try{window.__RATING_V23_LOADED__=true}catch(e){};const p=document.createElement('script');p.src='news_defense_patch.js?v=23.0';document.body.appendChild(p)};document.body.appendChild(s);
})();
