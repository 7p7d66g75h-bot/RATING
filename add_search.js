(function(){
  function enhance(){
    const s=document.getElementById('bf');
    if(!s || document.getElementById('fighterSearch')) return;
    const wrap=document.createElement('div');
    const input=document.createElement('input');
    input.id='fighterSearch'; input.placeholder='🔎 Найти бойца по имени...'; input.autocomplete='off';
    s.parentNode.insertBefore(input,s);
    const original=[...s.options].map(o=>({value:o.value,text:o.text}));
    function filter(){
      const q=input.value.trim().toLocaleLowerCase('ru-RU');
      const old=s.value;
      s.innerHTML='';
      original.filter(o=>o.text.toLocaleLowerCase('ru-RU').includes(q)).forEach(o=>{const x=document.createElement('option');x.value=o.value;x.textContent=o.text;s.appendChild(x)});
      if([...s.options].some(o=>o.value===old)) s.value=old;
    }
    input.addEventListener('input',filter); filter(); input.focus();
  }
  const oldRender=window.render;
  if(typeof oldRender==='function'){
    window.render=function(){oldRender();setTimeout(enhance,0)};
  }
  document.addEventListener('DOMContentLoaded',enhance);
  setInterval(enhance,500);
})();