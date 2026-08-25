(()=>{'use strict';
/* FINAL LOADER v21: never modifies fighter records. */
try{const old=JSON.parse(localStorage.getItem('manualP4PPositions_v2')||'null');const cur=JSON.parse(localStorage.getItem('manualP4PPositions_v3')||'null');if(old&&typeof old==='object'&&(!cur||!Object.keys(cur).length))localStorage.setItem('manualP4PPositions_v3',JSON.stringify(old));}catch(e){}
const s=document.createElement('script');s.src='stabilizer_v21.js?v=21.1';s.onload=()=>{try{window.__RATING_V21_LOADED__=true}catch(e){}};document.body.appendChild(s);
})();