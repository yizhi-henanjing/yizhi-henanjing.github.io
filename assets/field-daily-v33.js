(() => {
  const placePages = { mountain:'market', coast:'loopline', lake:'tower', forest:'underworks', oldtown:'harbor', starlight:'archive' };
  const unsplash = id => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=2200&q=84`;
  const scenes = {
    mountain: {label:'山野',title:'把路走到山脊上',kicker:'UP THE RIDGE',weather:'山里的风，把心事吹得很轻。',image:'photo-1632335479115-1e3db2cdd262',images:['photo-1632335479115-1e3db2cdd262','photo-1464822759023-fed622ff2c3b','photo-1702360373582-968d932ac789'],teaser:'去有风的地方，看看远处。',lead:'不用赶到山顶。找一段视野渐渐打开的路，停在半山腰也很好。云影会从对面的坡上慢慢移过来，走路的节奏自然就慢了。把手机收进包里一会儿，看看近处的草如何被风压低，又怎样慢慢直起来。',detail:'山路最舒服的那段，常常不在地图的终点。是树影忽然变薄的时候，是鞋底碰到松软的落叶之后，是抬头发现刚才一直低着头。若有雾，就等它从山坳散开；若天晴，就看阳光在对面坡面上挪动。走到这里已经很好，不必再用高度证明什么。',stops:[['01 / 林口','从有树荫的缓坡开始，给呼吸一点适应的时间。留意脚边的松针和潮湿泥土，走几分钟后再决定要不要继续向上。'],['02 / 山脊风口','到视野打开的地方找个安全、背风的位置停下。喝口水，听风从草叶间过去，看云影慢慢盖住远处的坡。'],['03 / 原路回程','在天色还亮、体力也从容时折返。回程不必赶，偶尔回头看一眼刚走过的山路，会发现它已经换了颜色。']],season:'清晨 · 雨后 · 日落前',look:'云影与山脊线'},
    coast: {label:'海岸',title:'沿着潮声走一段',kicker:'WHERE THE TIDE TURNS',weather:'海边不需要目的地，潮汐会把时间说清楚。',image:'photo-1518837695005-2083093ee35b',images:['photo-1518837695005-2083093ee35b','photo-1500375592092-40eb2168fd21','photo-1507525428034-b723cf961d3e'],teaser:'沿海岸线走到天色变软。',lead:'海风会把声音吹远，也会让人的步子慢下来。挑一段不拥挤的岸边，先看浪头退回去，再看下一道浪慢慢走近。海边的时间不太按钟表走：一阵风、一艘慢慢移远的船，都够看一会儿。',detail:'潮水留下的细线很快会被抹平。石头、贝壳和湿沙上短暂的纹路，刚好提醒人有些事情不必急着留下答案。别急着拍下每一道浪，听它抵岸、碎开、退回去，重复几次之后，脑子里那些紧绷的声音也会安静一些。',stops:[['01 / 防波堤','从宽阔、稳当的步道开始，先看海面最远的那条线。风大的时候站在护栏内侧，听浪声一层一层叠上来。'],['02 / 潮线边','等浪退下后再沿着湿沙走一小段，看看泡沫留下的弯曲边缘。留意脚下地面，避开湿滑礁石，也不必追着浪跑。'],['03 / 背风处','找一处远离人流的长椅或避风角落坐一会儿。把外套拉好，看看天色从亮白转成灰蓝，再沿熟悉的路回去。']],season:'日出后 · 傍晚 · 退潮时',look:'潮线与远处的船'},
    lake: {label:'湖边',title:'把今天交给一片水面',kicker:'STILL WATER, SLOW HOURS',weather:'水面很安静，适合把步子也放轻。',image:'photo-1720986113502-658abdf52874',images:['photo-1720986113502-658abdf52874','photo-1501785888041-af3ef285b470','photo-1470770841072-f978cf4d019e'],teaser:'到湖边坐一会儿，不必想好下一步。',lead:'湖边的光总比路上慢一点。树影落在水里，风吹过时，倒影先动起来。找个视野开阔的岸边坐几分钟，今天就有了一个新的段落。水面把天空接住，也把高楼、树枝和偶尔经过的鸟都收进来。',detail:'如果附近没有湖，沿着河道、湿地或公园的水池走也可以。重要的是让眼睛有地方停下来，看看水面如何接住天空。风起时先别急着离开，等细碎的波纹慢慢散开，岸边的倒影会一点点拼回来。',stops:[['01 / 树荫入口','先在树荫下停半分钟，让眼睛从室内的光线里缓过来。沿着平坦的岸边往前走，听听风吹叶片和水声谁更近。'],['02 / 开阔岸线','走到能看见整片水面的地方，不追求走完一整圈。找一处不挡路的栏杆边，观察倒影怎样随着风一层层变形。'],['03 / 长椅旁','坐下来看一会儿水，不必拿出手机。等风歇下来、纹路重新变浅，再沿来时的路慢慢回去。']],season:'早晨 · 阴天 · 日落前',look:'树影在水上的变化'},
    forest: {label:'林间',title:'走进树影更深的地方',kicker:'UNDER THE CANOPY',weather:'林子把光线收得很柔，适合安静一会儿。',image:'photo-1696883114527-dfc03b22b20b',images:['photo-1696883114527-dfc03b22b20b','photo-1530236668220-b9c6c098c9aa','photo-1448375240586-882707db888b'],teaser:'今天的声音，可以交给树叶。',lead:'进林子之后，光会一小块一小块落在地上。沿着熟悉的步道走，不用找什么特别的景色，注意一下脚下的落叶、树皮和远处的鸟声。走进树荫里，外面的车声会慢慢变远，风声反而清楚起来。',detail:'雨后的林间气味更明显，叶片上的水珠会把光线折得很碎。走得慢一点，路边那些不起眼的绿也会变得清楚。偶尔会有一束阳光穿过枝叶，落在路中间；不妨停一下，看它随着树梢晃动，再继续往前。',stops:[['01 / 林缘','在入口处停一下，听听街上的声音怎样慢慢退远。鞋底踩过碎叶时会有很轻的脆响，让眼睛和耳朵都适应这里的节奏。'],['02 / 树下小路','选一条宽而好走的步道，顺着树影往前走。看树皮的纹路、苔藓的颜色和枝叶间漏下的天光，沿途不必盯着导航。'],['03 / 光斑处','找一块不挡路、地面干燥的地方歇脚。听一会儿远处的鸟声，再按原路回来；雨后记得留意湿滑的木阶和根系。']],season:'雨后 · 上午 · 微风时',look:'叶片上的水光'},
    oldtown: {label:'旧街',title:'在一条老街里慢慢绕',kicker:'A TURN THROUGH OLD STREETS',weather:'旧街的好处，是每个转弯都不必太快。',image:'photo-1738597222871-815dbfbcfb25',images:['photo-1738597222871-815dbfbcfb25','photo-1513635269975-59663e0ac1ad','photo-1502602898657-3e91760cbb34'],teaser:'拐进一条不熟悉的小路。',lead:'老街不一定要去最热闹的那一段。绕开主路，看看窗台上的植物、墙面褪下来的颜色，还有哪家店刚刚把门打开。晾衣绳、门口的凳子和被摸得发亮的门把手，都比打卡牌更像一条街的日常。',detail:'如果下雨，沿有屋檐的一侧走；如果天晴，就挑一段树荫。走到熟悉的街区以外一点点，城市会露出新的表情。看到店主开始收摊，就顺着熟悉的大路往回走；今天不需要把每个巷子都走完。',stops:[['01 / 街口','先看一眼路牌和周围的公交站，记住回去的方向。挑一条人行道宽、车流不急的街开始，给自己一点观察的时间。'],['02 / 店铺之间','从主街拐进支巷，留意窗户、招牌和院墙。看看哪家店刚开门、哪户人家的花盆摆到门外，街区的生活就藏在这些小事里。'],['03 / 回到亮处','在天色转暗前回到熟悉的街道，买一杯热饮或带点水果回家。若下雨就沿屋檐走，经过路口时慢一点，不必为了多走几步绕远。']],season:'午后 · 小雨时 · 蓝调时刻',look:'窗台与屋檐下的光'},
    starlight: {label:'夜色',title:'今晚抬头看一会儿',kicker:'LOOK UP AFTER DARK',weather:'夜色铺开以后，城市也有了远处。',image:'photo-1519681393784-d120267933ba',images:['photo-1519681393784-d120267933ba','photo-1470252649378-9c29740c9fa8','photo-1500534623283-312aade485b7'],teaser:'把手机放低一点，看看天还剩多少颜色。',lead:'入夜以后，找一处有开阔天空的地方。公园的空地、河岸的长椅，甚至回家路上少车的一段人行道，都能让今天慢慢收尾。先选熟悉、明亮、方便折返的路线，不必特意去很远的地方。',detail:'如果城市灯光太亮，就看云的边缘和天色，不必寻找星星。等眼睛适应暗处，远处那些平时忽略的光也会浮出来。夜里的散步不需要走很久，抬头看几分钟，再慢慢走回灯光和熟悉的人声里，就足够给一天画个柔和的句号。',stops:[['01 / 天色将暗','趁天还留着一点蓝，先走到平时熟悉的公园或河岸。确认路灯正常、往返方便，手机放在手边，穿过马路时仍留意周围。'],['02 / 抬头几分钟','停在开阔又不妨碍行人的地方，把屏幕收起来。看看云层和楼顶之间的天空，找找哪一颗灯最先亮起，不必强求看见星星。'],['03 / 慢慢回家','散步结束后沿原路回到熟悉的亮处。若天气转凉或开始下雨，就提前结束；把这段安静留在今晚，不用再给自己安排别的任务。']],season:'日落后 · 天气晴时 · 回家路上',look:'楼顶之间的最后一抹蓝'}
  };
  const categoryOrder = ['mountain','coast','lake','forest','oldtown','starlight'];
  const scenePhotos = {mountain:['mountain.jpg','mountain-2.jpg'],coast:['coast.jpg','coast-2.jpg'],lake:['lake.jpg','lake-2.jpg'],forest:['forest.jpg','forest-2.jpg'],oldtown:['oldtown.jpg','oldtown-2.jpg'],starlight:['starlight.jpg','starlight-2.jpg']};
  const quotes = [
    '把脚步放慢一点，远处的山会替你把心事放轻。',
    '今天不用走很远，走到风能吹到的地方就好。',
    '云没有赶时间，所以天空也不必马上给出答案。',
    '水面收下了天色，也收下了这一会儿的安静。',
    '有些路不通向哪里，只是让人重新听见自己的脚步。',
    '你可以先看一会儿树，再决定要不要继续忙。',
    '日落不会催人，它只是提醒我们一天已经足够长。',
    '把今天放在风里晾一晾，明天再继续也来得及。',
    '看远一点，眼前的事就不必占满整片天空。',
    '走到光线柔下来的地方，让脑子也歇一歇。',
    '这座城市之外，还有一段安静的路在等你。',
    '如果不知道去哪儿，就先沿着水边走十分钟。',
    '风经过的时候，树梢先替你松一口气。',
    '看一朵云走远，今天也就多了一小段空隙。',
    '不必把散步走成任务，走到想回头的地方就好。',
    '一片叶子的影子，也能把下午分成两半。',
    '沿着熟悉的路多看一眼，它就有了新的样子。',
    '水波把倒影弄皱，又慢慢还给天空。',
    '今天的光落在哪里，哪里就值得停一停。',
    '街角有人开门，风里有一点饭菜的香气。',
    '让远处占一会儿视线，近处的烦恼会松一点。',
    '走回家时，记得看看天色有没有变。',
    '有时候只需要一张长椅和几分钟不说话。',
    '把肩膀放下来，听听脚步落在路面的声音。'
  ];
  const page = document.body.dataset.scenePage || 'daily';
  const app = document.querySelector('#experience');
  if(page!=='daily'&&scenes[page])document.title=`${scenes[page].label} · 风景来信`;
  const $ = selector => document.querySelector(selector);
  const dateText = new Intl.DateTimeFormat('zh-CN',{year:'numeric',month:'long',day:'numeric',weekday:'long'}).format(new Date());
  $('#today-date').textContent = dateText;
  const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const dayKey = new Date().toISOString().slice(0,10);
  const hash = value => [...String(value)].reduce((sum,char)=>(sum*31+char.charCodeAt(0))>>>0,7);
  const iconFor = group => ({clear:'☼',cloud:'☁',fog:'≋',rain:'☂',snow:'✳',storm:'ϟ'})[group] || '◌';
  const weatherGroup = code => {
    if(code===0)return 'clear';
    if([1,2,3].includes(code))return 'cloud';
    if([45,48].includes(code))return 'fog';
    if((code>=51&&code<=67)||(code>=80&&code<=82))return 'rain';
    if((code>=71&&code<=77)||code===85||code===86)return 'snow';
    if(code>=95)return 'storm';
    return 'cloud';
  };
  const weatherName = code => ({0:'晴',1:'大致晴朗',2:'局部多云',3:'阴',45:'有雾',48:'雾凇',51:'毛毛雨',53:'小雨',55:'中雨',56:'冻毛毛雨',57:'冻雨',61:'小雨',63:'中雨',65:'大雨',66:'冻雨',67:'冻雨',71:'小雪',73:'中雪',75:'大雪',77:'霰',80:'阵雨',81:'阵雨',82:'强阵雨',85:'阵雪',86:'大阵雪',95:'雷雨',96:'雷雨伴冰雹',99:'强雷雨'})[code]||'天气变化';
  const suggestion = group => ({
    clear:['今天光线很好，找一段临水或开阔的路，慢慢走到日落前。','晴天适合把视线放远，山脊、河岸或城市公园都可以。'],
    cloud:['云把天空留白了，沿着河道走一段，看看水面怎样接住天光。','今天适合在树荫和开阔处之间走走，不必把路线排得太满。'],
    fog:['雾天就选熟悉、好走的近处路线。树影和远山会变得很安静。','能见度低时不必往远处赶，找一条林间或湖边的小路慢慢走。'],
    rain:['找一段有屋檐的旧街，听一会儿雨声；雨停以后再去水边。','今天的风景可以从窗边开始，等雨势缓下来再出门走一小段。'],
    snow:['雪天先挑熟悉、平坦的公园步道，走一小圈就够了。','如果路边积了雪，看看树梢和屋顶的颜色变化，别急着走远。'],
    storm:['今天可以先留在窗边看天色，等雷雨过去再决定要不要出门。','把散步留到雨势缓下来以后，今天不用勉强赶路。']
  })[group]||['找一段安静的路，给眼睛和脑子都留一点空白。'];
  const recommendedScene = group => ({clear:['mountain','coast'],cloud:['lake','oldtown'],fog:['forest','lake'],rain:['oldtown','forest'],snow:['mountain','lake'],storm:['lake','oldtown']})[group]||['lake','forest'];
  const choosePhoto = sceneId => {
    const items=scenePhotos[sceneId];const key=`field-photo:${sceneId}`;const previous=Number(sessionStorage.getItem(key));
    let index=Math.floor(Math.random()*items.length);if(items.length>1&&index===previous)index=(index+1)%items.length;sessionStorage.setItem(key,String(index));return {id:items[index],index};
  };
  const localPhoto = (sceneId,index=0) => `${page==='daily'?'':'../'}assets/scenes/${scenePhotos[sceneId][index]}`;
  const loadPhoto = (image,sceneId,startIndex) => {
    const photos=scenePhotos[sceneId];const alternate=(startIndex+1)%photos.length;
    image.classList.add('is-changing');
    image.onerror=()=>{if(startIndex!==alternate){startIndex=alternate;image.src=localPhoto(sceneId,startIndex);}else{image.classList.remove('is-changing');image.classList.add('photo-missing');}};
    image.onload=()=>image.classList.remove('photo-missing','is-changing');
    image.src=localPhoto(sceneId,startIndex);
  };
  const quoteFor = city => quotes[hash(`${dayKey}:${city||'somewhere'}`)%quotes.length];
  const sceneLink = id => `${page==='daily'?'':'../'}places/${placePages[id]}.html`;
  const cardsMarkup = () => categoryOrder.map((id,index)=>{
    const item=scenes[id];const photoIndex=(hash(`${dayKey}:${id}`)+index)%scenePhotos[id].length;
    return `<a class="scene-card" href="${sceneLink(id)}"><img loading="lazy" decoding="async" src="${localPhoto(id,photoIndex)}" alt="${item.label}风景" data-scene-photo="${id}" data-photo-index="${photoIndex}"><span class="scene-card-arrow" aria-hidden="true">↗</span><span class="scene-card-copy"><small>${item.label}风景</small><h3>${item.label} · ${item.title}</h3><p>${item.teaser}</p></span></a>`;
  }).join('');
  const makeHero = (id, quote, currentPlace, currentWeather, home=false) => {
    const item=scenes[id];const chosen=choosePhoto(id);const imageClass='hero-photo';
    const placeName=currentPlace?.name||'先选一座城市';const weatherText=currentWeather?`${weatherName(currentWeather.weather_code)} · ${Math.round(currentWeather.temperature_2m)}°`:'天气待选择';
    const scenePicker=home?`<div class="scene-picker" role="group" aria-label="选择今日风景">${categoryOrder.map((sceneId,index)=>`<button type="button" data-scene-choice="${sceneId}" aria-label="切换到${scenes[sceneId].label}" aria-pressed="${id===sceneId}" title="${scenes[sceneId].label}">${String(index+1).padStart(2,'0')}</button>`).join('')}</div>`:'';
    const mainCopy=home?`<p class="hero-kicker">${item.label}　·　今日风景</p><h1>${item.title}</h1><p class="hero-quote">${quote}</p><div class="hero-meta"><span>${escapeHtml(placeName)}　${weatherText}</span><span>${item.weather}</span></div><div class="hero-actions"><button class="text-action" id="another-view" type="button">换一处风景 <span class="arrow">↗</span></button><a class="text-action" href="${sceneLink(id)}">走进这处风景 <span class="arrow">→</span></a><button class="quiet-action" id="jump-scenes" type="button">今天想去别处？</button></div>${scenePicker}`:`<p class="hero-kicker">${item.label}　·　风景页</p><h1>${item.title}</h1><p class="hero-quote">${quote}</p><div class="hero-meta"><span>${escapeHtml(placeName)}　${weatherText}</span><span>${item.weather}</span></div><div class="hero-actions"><a class="text-action" href="#scene-notes">往下慢慢看 <span class="arrow">↓</span></a><a class="quiet-action" href="../index.html">回到今日推荐</a></div>`;
    const routeLink=home?'':'<a class="back-link" href="../index.html"><span aria-hidden="true">←</span> 今日推荐</a>';
    return `<section class="${home?'home-hero':'scene-hero'} page-fade" data-landscape="${id}" aria-label="${item.label}风景推荐"><img class="${imageClass}" alt="${item.label}风景：${item.look}" fetchpriority="high" decoding="async"><div class="hero-shade"></div><div class="weather-effects" aria-hidden="true"></div>${home?`<div class="hero-topline"><span>今日一景　/　${dateText}</span><span class="live-weather"><i class="weather-dot"></i>${escapeHtml(placeName)} · ${weatherText}</span></div>`:`<nav class="page-nav">${routeLink}<span>${item.label}风景</span></nav>`}<div class="hero-copy">${mainCopy}</div><span class="photo-credit">风景照片 <a href="https://unsplash.com/" target="_blank" rel="noreferrer">Unsplash</a></span></section>`;
  };
  const findWeatherDescription = weather => `${weatherName(weather.weather_code)} · ${Math.round(weather.temperature_2m)}°C`;
  let currentPlace=null;let currentWeather=null;let activeHomeScene=null;let selectedHomeScene=null;let sceneChangeTimer=0;
  const updateHeader = (place, weather, message='') => {
    $('#weather-place').textContent=place?.name||'还没选城市';
    $('#weather-line').textContent=weather?`${findWeatherDescription(weather)} · 体感 ${Math.round(weather.apparent_temperature)}°`:(message||'选一座城市，看看今天的天色');
    $('.weather-glyph').textContent=weather?iconFor(weatherGroup(weather.weather_code)):'◌';
    if(weather)document.body.dataset.weather=weatherGroup(weather.weather_code);
  };
  const setHeroImage = (sceneId, index) => {
    const heroImage=$('.hero-photo');if(heroImage)loadPhoto(heroImage,sceneId,index);
  };
  let revealObserver=null;
  const initVisualMotion = () => {
    revealObserver?.disconnect();
    const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer=window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const revealTargets=app.querySelectorAll('.daily-strip,.today-route,.explore-head,.scene-card,.small-print,.scene-page-info,.scene-walk,.nearby-thought,.other-places');
    revealTargets.forEach((element,index)=>{
      element.classList.add('reveal-on-scroll');
      if(element.matches('.scene-card'))element.style.setProperty('--reveal-delay',`${(index%3)*75}ms`);
    });
    if(reduceMotion||!('IntersectionObserver' in window))revealTargets.forEach(element=>element.classList.add('is-visible'));
    else{
      revealObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{
        if(entry.isIntersecting){entry.target.classList.add('is-visible');revealObserver.unobserve(entry.target);}
      }),{threshold:.12,rootMargin:'0px 0px -28px 0px'});
      revealTargets.forEach(element=>revealObserver.observe(element));
    }
    if(reduceMotion||!finePointer)return;
    const hero=app.querySelector('.home-hero,.scene-hero');
    if(hero){
      let frame=0,point=null;
      hero.addEventListener('pointermove',event=>{
        const rect=hero.getBoundingClientRect();point={x:(event.clientX-rect.left)/rect.width-.5,y:(event.clientY-rect.top)/rect.height-.5};
        if(!frame)frame=requestAnimationFrame(()=>{frame=0;if(!point)return;hero.style.setProperty('--parallax-x',`${point.x*-16}px`);hero.style.setProperty('--parallax-y',`${point.y*-12}px`);});
      },{passive:true});
      hero.addEventListener('pointerleave',()=>{point=null;hero.style.setProperty('--parallax-x','0px');hero.style.setProperty('--parallax-y','0px');},{passive:true});
    }
    app.querySelectorAll('.scene-card').forEach(card=>{
      let frame=0,tilt=null;
      card.addEventListener('pointermove',event=>{
        const rect=card.getBoundingClientRect();tilt={x:(event.clientX-rect.left)/rect.width-.5,y:(event.clientY-rect.top)/rect.height-.5};
        if(!frame)frame=requestAnimationFrame(()=>{frame=0;if(!tilt)return;card.style.setProperty('--tilt-x',`${tilt.x*3}deg`);card.style.setProperty('--tilt-y',`${tilt.y*-3}deg`);});
      },{passive:true});
      card.addEventListener('pointerleave',()=>{tilt=null;card.style.setProperty('--tilt-x','0deg');card.style.setProperty('--tilt-y','0deg');},{passive:true});
    });
  };
  const renderHome = () => {
    const quote=quoteFor(currentPlace?.name);const ids=currentWeather?recommendedScene(weatherGroup(currentWeather.weather_code)):categoryOrder;
    const seed=hash(`${dayKey}:${currentPlace?.name||'today'}:${currentWeather?.weather_code||0}`);activeHomeScene=selectedHomeScene||ids[seed%ids.length];const item=scenes[activeHomeScene];
    const group=currentWeather?weatherGroup(currentWeather.weather_code):'cloud';const advice=suggestion(group)[seed%suggestion(group).length];
    app.innerHTML=`${makeHero(activeHomeScene,quote,currentPlace,currentWeather,true)}<section class="daily-strip"><div><p class="section-label">每日一言</p><h2>今天的天气，适合这样走</h2></div><p class="daily-note">${quote}</p><p class="weather-suggestion"><strong>${currentWeather?`${escapeHtml(currentPlace?.name||'附近')} · ${findWeatherDescription(currentWeather)}`:'先选一座城市'}</strong>${currentWeather?advice:'手动搜索城市，或点右上角定位。风景会先在这里等你。'}</p></section><section class="today-route"><div class="route-heading"><div><p class="section-label">把时间留给沿途</p><h2>一段 ${item.label} 小路</h2></div><p>${item.weather} <span>建议留出 30–45 分钟，走累了就提前折返。</span></p></div><ol class="route-stops">${item.stops.map((stop,index)=>`<li><small>${String(index+1).padStart(2,'0')} / ${index===0?'开始':'停一停'}</small><h3>${escapeHtml(stop[0].slice(5))}</h3><p>${stop[1]}</p></li>`).join('')}</ol><a class="route-link" href="${sceneLink(activeHomeScene)}">打开完整风景手记 <span>↗</span></a></section><section class="explore-section" id="scene-list"><div class="explore-head"><div><p class="section-label">六处风景</p><h2>今天想往哪里走</h2></div><p>每一处都准备了一段不同的慢行路线与沿途观察。</p></div><div class="scene-grid">${cardsMarkup()}</div></section><div class="small-print"><span>今日推荐：${item.label} · ${item.look}</span><span>风景图每次打开都会轮换；每日短句按日期更新。</span></div>`;
    app.querySelectorAll('.scene-card img').forEach(image=>image.addEventListener('error',()=>{const id=image.dataset.scenePhoto;if(id){image.onerror=null;image.src=localPhoto(id);}}));
    initVisualMotion();
    setHeroImage(activeHomeScene,choosePhoto(activeHomeScene).index);
    const changeHomeScene = target => {
      selectedHomeScene=target;
      app.querySelector('.home-hero')?.classList.add('is-scene-leaving');
      window.clearTimeout(sceneChangeTimer);sceneChangeTimer=window.setTimeout(renderHome,150);
    };
    $('#another-view')?.addEventListener('click',()=>{
      const choices=categoryOrder.filter(sceneId=>sceneId!==activeHomeScene);changeHomeScene(choices[Math.floor(Math.random()*choices.length)]);
    });
    app.querySelectorAll('[data-scene-choice]').forEach(button=>button.addEventListener('click',()=>{
      const target=button.dataset.sceneChoice;if(target&&target!==activeHomeScene)changeHomeScene(target);
    }));
    $('#jump-scenes')?.addEventListener('click',()=>$('#scene-list')?.scrollIntoView({behavior:'smooth'}));
  };
  const renderScene = sceneId => {
    const item=scenes[sceneId]||scenes.mountain;const quote=quoteFor(currentPlace?.name);const group=currentWeather?weatherGroup(currentWeather.weather_code):'cloud';const advice=suggestion(group)[hash(`${dayKey}:${sceneId}`)%suggestion(group).length];
    app.innerHTML=`${makeHero(sceneId,quote,currentPlace,currentWeather,false)}<section class="scene-page-info" id="scene-notes"><div><p class="section-label">风景手记</p><h2>${item.teaser}</h2></div><p>${item.lead}<br><br>${item.detail}</p><div class="scene-facts"><div class="scene-fact"><small>适合时段</small><b>${item.season}</b></div><div class="scene-fact"><small>今天可以看看</small><b>${item.look}</b></div><div class="scene-fact"><small>你所在的天气</small><b>${currentWeather?`${findWeatherDescription(currentWeather)}`:'选择城市后显示'}</b></div></div></section><section class="scene-walk"><div class="walk-heading"><div><p class="section-label">沿途慢慢走</p><h2>给自己半小时</h2></div><p>不赶路，也不必走完整圈。挑一两处喜欢的地方停一停，就算完成今天的散步。</p></div><ol class="route-stops">${item.stops.map((stop,index)=>`<li><small>${String(index+1).padStart(2,'0')} / ${index===0?'出发':'沿途停留'}</small><h3>${escapeHtml(stop[0].slice(5))}</h3><p>${stop[1]}</p></li>`).join('')}</ol><div class="walk-extra"><span>今天看看</span><strong>${item.look}</strong><span>适合时段</span><strong>${item.season}</strong><span>天气提醒</span><strong>${currentWeather?`${findWeatherDescription(currentWeather)} · ${advice}`:advice}</strong></div></section><section class="nearby-thought"><blockquote>${advice}</blockquote><cite>${currentPlace?`${escapeHtml(currentPlace.name)} · ${currentWeather?findWeatherDescription(currentWeather):'今日建议'}`:'今日风景来信'}</cite></section><section class="other-places" aria-label="继续看一处风景">${categoryOrder.filter(id=>id!==sceneId).map(id=>`<a href="${sceneLink(id)}">${scenes[id].label}　↗</a>`).join('')}</section>`;
    initVisualMotion();
    setHeroImage(sceneId,choosePhoto(sceneId).index);
  };
  const render = () => { if(page==='daily')renderHome();else renderScene(page); };
  const updateWeather = async (place, save=true) => {
    currentPlace={...place,lat:Number(Number(place.lat).toFixed(2)),lon:Number(Number(place.lon).toFixed(2))};
    updateHeader(currentPlace,null,'正在读取天气…');
    if(save){try{localStorage.setItem('field-note-city',JSON.stringify(currentPlace));}catch{}}
    try{
      const url=new URL('https://api.open-meteo.com/v1/forecast');url.searchParams.set('latitude',currentPlace.lat);url.searchParams.set('longitude',currentPlace.lon);url.searchParams.set('current','temperature_2m,apparent_temperature,relative_humidity_2m,is_day,precipitation,weather_code,wind_speed_10m');url.searchParams.set('timezone','auto');
      const response=await fetch(url);if(!response.ok)throw new Error('weather request failed');const data=await response.json();currentWeather=data.current;updateHeader(currentPlace,currentWeather);render();
    }catch{
      currentWeather=null;updateHeader(currentPlace,null,'天气暂时不可用，风景仍可浏览');render();
    }
  };
  const searchCity = async query => {
    try{localStorage.setItem('field-note-city-mode','manual');}catch{}
    updateHeader(currentPlace,null,'正在查找城市…');
    try{
      const url=new URL('https://geocoding-api.open-meteo.com/v1/search');url.searchParams.set('name',query);url.searchParams.set('count','5');url.searchParams.set('language','zh');url.searchParams.set('format','json');
      const response=await fetch(url);if(!response.ok)throw new Error('geocoding failed');const data=await response.json();const result=data.results?.[0];if(!result)throw new Error('找不到这座城市');
      const name=[result.name,result.admin1&&result.admin1!==result.name?result.admin1:'',result.country].filter(Boolean).join(' · ');
      await updateWeather({name,lat:result.latitude,lon:result.longitude,timezone:result.timezone},true);
    }catch(error){updateHeader(currentPlace,null,error.message==='找不到这座城市'?'没有找到，请试试更完整的城市名':'城市服务暂时不可用');}
  };
  const cityForm=$('#city-form');cityForm.addEventListener('submit',event=>{event.preventDefault();const value=$('#city-input').value.trim();if(value.length>=2)searchCity(value);});
  const resolvePlaceName = async (latitude, longitude) => {
    try {
      const url=new URL('https://nominatim.openstreetmap.org/reverse');url.searchParams.set('format','jsonv2');url.searchParams.set('lat',latitude);url.searchParams.set('lon',longitude);url.searchParams.set('zoom','10');url.searchParams.set('accept-language','zh-CN');
      const response=await fetch(url,{headers:{'Accept-Language':'zh-CN'}});if(response.ok){const data=await response.json();const a=data.address||{};const name=a.city||a.town||a.municipality||a.county||a.city_district||a.suburb||a.district||a.village||a.locality;if(name)return name;}
    } catch {}
    try {
      const url=new URL('https://api.bigdatacloud.net/data/reverse-geocode-client');url.searchParams.set('latitude',latitude);url.searchParams.set('longitude',longitude);url.searchParams.set('localityLanguage','zh');
      const response=await fetch(url);if(response.ok){const data=await response.json();const name=data.city||data.locality;if(name)return name;}
    } catch {}
    return '城市名暂不可用';
  };
  const locateCity = () => {
    try{localStorage.setItem('field-note-city-mode','location');}catch{}
    if(!navigator.geolocation){updateHeader(currentPlace,null,'此浏览器不支持定位，请手动搜索');return;}
    updateHeader(currentPlace,null,'正在请求定位权限…');navigator.geolocation.getCurrentPosition(async position=>{
      const {latitude,longitude}=position.coords;const place={name:await resolvePlaceName(latitude,longitude),lat:latitude,lon:longitude};
      await updateWeather(place,true);
    },error=>{const message=error.code===1?'没有获得定位权限；也可以直接输入城市。':'暂时无法定位；也可以直接输入城市。';updateHeader(currentPlace,null,message);},{enableHighAccuracy:false,timeout:9000,maximumAge:300000});
  };
  $('#locate-button').addEventListener('click',locateCity);
  const cityMenu=()=>{try{const saved=JSON.parse(localStorage.getItem('field-note-city')||'null');if(saved&&Number.isFinite(saved.lat)&&Number.isFinite(saved.lon)){if(['你附近','所在城市'].includes(saved.name)){saved.name='城市名暂不可用';localStorage.setItem('field-note-city',JSON.stringify(saved));}updateWeather(saved,false);}}catch{}};
  render();cityMenu();
  const cityMode=(()=>{try{return localStorage.getItem('field-note-city-mode');}catch{return null;}})();
  if(cityMode!=='manual')window.setTimeout(()=>{
    if(!navigator.permissions?.query){locateCity();return;}
    navigator.permissions.query({name:'geolocation'}).then(permission=>{
      if(permission.state==='denied'){if(!currentPlace)updateHeader(null,null,'允许浏览器定位后显示附近天气，也可以输入城市。');return;}
      locateCity();
    }).catch(locateCity);
  },240);
})();
