(() => {
  function cleanButtons() {
    const main = document.getElementById('main');
    if (!main) return;
    const buttons = [...main.querySelectorAll('button')];
    const rating = buttons.filter(b => /РЕДАКТИРОВАТЬ РЕЙТИНГ/i.test((b.textContent || '').trim()));
    const p4p = buttons.filter(b => /РЕДАКТИРОВАТЬ P4P/i.test((b.textContent || '').trim()));
    const isP4P = typeof weight !== 'undefined' && weight === 'P4P';
    if (isP4P) {
      rating.forEach(b => b.remove());
      p4p.slice(1).forEach(b => b.remove());
    } else {
      rating.slice(1).forEach(b => b.remove());
      p4p.forEach(b => b.remove());
    }
  }
  const oldRender = window.render;
  if (typeof oldRender === 'function') {
    window.render = function() {
      const r = oldRender.apply(this, arguments);
      setTimeout(cleanButtons, 0);
      return r;
    };
  }
  new MutationObserver(cleanButtons).observe(document.body, {childList:true, subtree:true});
  setTimeout(cleanButtons, 0);
})();