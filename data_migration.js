(function(){
const legacy={
'Кёртис Блейдс':{d:2,ad:2,s:6},'Алекс Перейра':{d:2,ad:2},'Исраэль Адесанья':{d:2,ad:2},'Джек Маддалена':{d:1,ad:1},'Корейский Зомби':{d:1,ad:1},'Тони Фергюсон':{d:3,ad:0,s:0},'Пётр Ян':{d:0,ad:0,s:1},'Илия Топурия':{s:1},'Маурисио Руффи':{s:3},'Бобби Грин':{s:1},'Рафаэль Дос Аньос':{s:-1},'Майкл Пейдж':{s:-1},'Шавкат Рахмонов':{s:-2},'Ти Джей Диллашоу':{s:-1},'Карлос Улберг':{s:-2},'Жаилтон Алмейда':{s:-1},'Оливейра':{s:-1},'Жозе Альдо':{s:-1},'Конор Макгрегор':{s:-1},'Джин Силва':{s:-1}
};
const old=JSON.parse(localStorage.ratingDB||'null'); if(!old||!Array.isArray(old)) return;
old.forEach(f=>{const x=legacy[f.name];if(x){if(x.d!==undefined)f.titleDefenses=x.d;if(x.ad!==undefined)f.activeDefenses=x.ad;if(x.s!==undefined)f.streak=x.s;}f.history=f.history||[];f.draws=f.draws||0;f.titleWins=f.titleWins||0;});
localStorage.ratingDB=JSON.stringify(old);
})();