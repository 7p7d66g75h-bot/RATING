(function(){
  // Restore only unambiguous streaks. Do not overwrite fighters whose record contains both wins and losses.
  F.forEach(f=>{
    const w=Number(f.wins||0), l=Number(f.losses||0), d=Number(f.draws||0);
    if(l===0 && d===0 && w>0) f.streak=w;
    else if(w===0 && d===0 && l>0) f.streak=-l;
  });
  save();
  if(typeof render==='function') render();
})();