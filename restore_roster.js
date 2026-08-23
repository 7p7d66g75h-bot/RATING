(function(){
  const expected = [
    ['Кёртис Блейдс','Heavyweight','US',6,0,0],['Том Аспиналл','Heavyweight','GB',3,0,0],['Джон Джонс','Heavyweight','US',2,0,0],['Сирил Ган','Heavyweight','FR',2,0,0],['Фёдор Емельяненко','Heavyweight','RU',3,2,0],
    ['Алекс Перейра','Light Heavyweight','BR',6,1,0],['Магомед Анкалаев','Light Heavyweight','RU',2,0,0],['Пауло Коста','Light Heavyweight','BR',3,0,0],['Карлос Улберг','Light Heavyweight','NZ',3,3,0],['Ян Блахович','Light Heavyweight','PL',2,0,0],
    ['Исраэль Адесанья','Middleweight','NG',6,0,0],['Алекс Перейра','Middleweight','BR',3,1,0],['Роберт Уиттакер','Middleweight','AU',1,2,0],['Шон Стрикленд','Middleweight','US',1,1,0],['Бо Никал','Middleweight','US',2,1,0],
    ['Джек Маддалена','Welterweight','AU',5,0,0],['Ислам Махачев','Welterweight','RU',4,1,0],['Конор Макгрегор','Welterweight','IE',4,2,0],['Шон Брэди','Welterweight','US',2,0,0],['Кевин Холланд','Welterweight','US',1,0,0],['Белал Мухаммад','Welterweight','AE',1,0,0],
    ['Тони Фергюсон','Lightweight','US',8,1,0],['Илия Топурия','Lightweight','ES',10,3,0],['Майкл Чендлер','Lightweight','US',3,0,0],['Дастин Порье','Lightweight','US',3,1,0],['Маурисио Руффи','Lightweight','BR',5,2,0],['Бенуа Сен-Дени','Lightweight','FR',1,0,0],['Дональд Серроне','Lightweight','US',1,1,0],['Дэн Хукер','Lightweight','NZ',3,1,0],['Рафаэль Физиев','Lightweight','AZ',1,2,0],['Джастин Гейджи','Lightweight','US',1,3,0],['Бенеил Дариуш','Lightweight','US',1,0,0],['Халил Тёрнер','Lightweight','US',1,0,0],['Арман Царукян','Lightweight','AM',1,2,0],['Эстебан Рибович','Lightweight','AR',1,0,0],['Матеуш Гамрот','Lightweight','PL',1,0,0],['Бобби Грин','Lightweight','US',1,0,0],
    ['Корейский Зомби','Featherweight','KR',5,0,0],['Мовсар Евлоев','Featherweight','RU',2,0,0],['Макс Холлоуэй','Featherweight','US',1,0,0],['Александр Волкановски','Featherweight','AU',1,2,0],['Брайан Ортега','Featherweight','US',2,0,0],['Лерон Мерфи','Featherweight','GB',1,0,0],['Шон Вудсон','Featherweight','US',1,0,0],['Арнольд Аллен','Featherweight','GB',1,1,0],['Кевин Вальехос','Featherweight','AR',1,1,0],['Юрайя Фейбер','Featherweight','US',2,1,0],['Патрисио Питбуль','Featherweight','BR',1,0,0],['Жозе Альдо','Featherweight','BR',1,1,0],['Гига Чикадзе','Featherweight','GE',1,0,0],['Джин Силва','Featherweight','BR',0,1,0],
    ['Пётр Ян','Bantamweight','RU',5,1,0],['Мераб Двалишвили','Bantamweight','GE',3,0,0],['Жозе Альдо','Bantamweight','BR',3,1,0],['Ти Джей Диллашоу','Bantamweight','US',2,1,0],['Кори Сэндхаген','Bantamweight','US',3,2,0],['Коди Гарбрандт','Bantamweight','US',2,0,0],['Роб Фонт','Bantamweight','US',2,1,0],['Доминик Круз','Bantamweight','US',2,1,0],['Шон О’Мэлли','Bantamweight','US',1,1,0],['Умар Нурмагомедов','Bantamweight','RU',2,1,0],
    ['Кай Аскаура','Flyweight','JP',2,0,0],['Брендон Морено','Flyweight','MX',3,1,0],['Алешандру Пантожа','Flyweight','BR',1,1,0],['Манель Капе','Flyweight','AO',1,1,0],['Деметриус Джонсон','Flyweight','US',2,2,0],['Татсуро Тайра','Flyweight','JP',0,0,0]
  ];
  let F;try{F=JSON.parse(localStorage.getItem('ratingDB')||'null')}catch(e){F=null}
  if(!Array.isArray(F))return;
  let max=F.reduce((m,f)=>Math.max(m,Number(f.id)||0),0),changed=false;
  for(const x of expected){
    if(!F.some(f=>f.name===x[0]&&f.weight===x[1])){
      F.push({id:++max,name:x[0],weight:x[1],country:x[2],wins:x[3],losses:x[4],draws:x[5],rank:99,champion:false,titleWins:0,titleDefenses:0,activeDefenses:0,streak:(x[4]===0?x[3]:x[3]===0?-x[4]:0),p4pRank:null,history:[]});changed=true;
    }
  }
  if(changed)localStorage.setItem('ratingDB',JSON.stringify(F));
})();