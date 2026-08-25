(function(){
  'use strict';
  // roster.js expects FLAGS to exist before it executes.
  // The previous cleanup removed the initializer, causing roster.js to stop
  // on Object.assign(FLAGS, codes) and leaving F empty/undefined.
  window.FLAGS = window.FLAGS || {};
  window.names = window.names || {
    Heavyweight:'Тяжёлый',
    'Light Heavyweight':'Полутяжёлый',
    Middleweight:'Средний',
    Welterweight:'Полусредний',
    Lightweight:'Лёгкий',
    Featherweight:'Полулёгкий',
    Bantamweight:'Легчайший',
    Flyweight:'Наилегчайший',
    P4P:'P4P'
  };
})();
