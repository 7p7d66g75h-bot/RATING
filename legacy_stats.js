(function(){
  const stats={
    'Кёртис Блейдс':{titleDefenses:2,activeDefenses:2,champion:true},
    'Алекс Перейра':{titleDefenses:2,activeDefenses:2},
    'Исраэль Адесанья':{titleDefenses:2,activeDefenses:2,champion:true},
    'Джек Маддалена':{titleDefenses:1,activeDefenses:1,champion:true},
    'Корейский Зомби':{titleDefenses:1,activeDefenses:1,champion:true},
    'Тони Фергюсон':{titleDefenses:3,activeDefenses:0,champion:true,streak:0},
    'Пётр Ян':{titleDefenses:0,activeDefenses:0,champion:true},
    'Илия Топурия':{champion:false,streak:1},
    'Маурисио Руффи':{streak:3},
    'Бобби Грин':{streak:1},
    'Рафаэль Дос Аньос':{streak:-1},
    'Майкл Пейдж':{streak:-1},
    'Шавкат Рахмонов':{streak:-2},
    'Ти Джей Диллашоу':{streak:-1},
    'Карлос Улберг':{streak:-2},
    'Жаилтон Алмейда':{streak:-1},
    'Оливейра':{streak:-1},
    'Жозе Альдо':{streak:-1},
    'Конор Макгрегор':{streak:-1},
    'Джин Силва':{streak:-1}
  };
  // Apply only to matching fighter records. Duplicate names in different weights keep their own records.
  F.forEach(f=>{const s=stats[f.name];if(!s)return;Object.assign(f,s);});
  // Ensure the profile has usable derived values even when older records have no fight history.
  F.forEach(f=>{
    f.titleWins=f.titleWins||0;
    f.titleDefenses=f.titleDefenses||0;
    f.activeDefenses=f.activeDefenses||0;
    if(typeof f.streak!=='number')f.streak=0;
  });
  save();
  if(typeof render==='function')render();
})();