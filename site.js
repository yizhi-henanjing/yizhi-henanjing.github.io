const pools={
  all:['photo-1470252649378-9c29740c9fa8','photo-1470770841072-f978cf4d019e','photo-1464822759023-fed622ff2c3b','photo-1500530855697-b586d89ba3ee','photo-1473448912268-2022ce9509d8','photo-1518837695005-2083093ee35b','photo-1500375592092-40eb2168fd21','photo-1507525428034-b723cf961d3e','photo-1519608487953-e999c86e7455','photo-1511818966892-d7d671e672a2','photo-1518005020951-eccb494ad742','photo-1519501025264-65ba15a82390','photo-1493246507139-91e8fad9978e','photo-1472214103451-9374bd1c798e','photo-1480714378408-67cf0d13bc1b','photo-1501785888041-af3ef285b470','photo-1498623116890-37e912163d5d','photo-1506953823976-52e1fdc0149a','photo-1677126138830-ca9d01b53ed5','photo-1695792622995-dc673d0d9d64','photo-1740021762335-8bdd7d297443'],
  mountain:['photo-1470252649378-9c29740c9fa8','photo-1464822759023-fed622ff2c3b','photo-1500530855697-b586d89ba3ee','photo-1473448912268-2022ce9509d8','photo-1472214103451-9374bd1c798e'],
  lake:['photo-1470770841072-f978cf4d019e','photo-1493246507139-91e8fad9978e','photo-1501785888041-af3ef285b470'],
  coast:['photo-1518837695005-2083093ee35b','photo-1500375592092-40eb2168fd21','photo-1507525428034-b723cf961d3e'],
  island:['photo-1498623116890-37e912163d5d','photo-1506953823976-52e1fdc0149a','photo-1518837695005-2083093ee35b'],
  oldtown:['photo-1519608487953-e999c86e7455','photo-1511818966892-d7d671e672a2','photo-1518005020951-eccb494ad742','photo-1519501025264-65ba15a82390','photo-1480714378408-67cf0d13bc1b'],
  village:['photo-1677126138830-ca9d01b53ed5','photo-1695792622995-dc673d0d9d64','photo-1740021762335-8bdd7d297443']
};
const used=new Set(),counts=new Map();
const photoBase='./';
function pick(key,index){const source=pools[key]||pools.all;let previous='';if(index===0){try{previous=localStorage.getItem('evening-letter-last-'+key)||''}catch{}}let candidates=source.filter(id=>!used.has(id)&&id!==previous);if(!candidates.length)candidates=source.filter(id=>!used.has(id));if(!candidates.length)candidates=source;const id=candidates[Math.floor(Math.random()*candidates.length)];used.add(id);if(index===0){try{localStorage.setItem('evening-letter-last-'+key,id)}catch{}}return id}
function imageUrl(id){return `${photoBase}${id}.jpg`}
document.querySelectorAll('[data-photo]').forEach((image,index)=>{const key=image.dataset.photo||'all';const poolIndex=counts.get(key)||0;counts.set(key,poolIndex+1);const id=pick(key,poolIndex);image.src=imageUrl(id);image.dataset.photoId=id;image.addEventListener('error',()=>{const alternatives=(pools[key]||pools.all).filter(other=>other!==id);if(alternatives.length)image.src=imageUrl(alternatives[Math.floor(Math.random()*alternatives.length)])},{once:true})});

// Scroll reveals are one-shot: motion helps orient the reader without making text move repeatedly.
const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if(!reduceMotion&&'IntersectionObserver' in window){
  const revealTargets=[...document.querySelectorAll('.destination,.place-intro,.essay-row,.place-pause,.next-place')];
  if(revealTargets.length){
    document.body.classList.add('motion-ready');
    revealTargets.forEach((element,index)=>{element.classList.add('reveal');element.style.setProperty('--reveal-delay',`${(index%4)*60}ms`)});
    const revealObserver=new IntersectionObserver(entries=>{
      entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');revealObserver.unobserve(entry.target)}});
    },{threshold:.12,rootMargin:'0px 0px -8% 0px'});
    revealTargets.forEach(element=>revealObserver.observe(element));
  }
}

// Keep page changes brief and allow the browser's normal navigation when motion is reduced.
const motionPreference=window.matchMedia('(prefers-reduced-motion: reduce)');
document.querySelectorAll('a[href^="places/"],a[href$=".html"]').forEach(link=>link.addEventListener('click',event=>{
  if(event.metaKey||event.ctrlKey||event.shiftKey||event.altKey||link.target==='_blank'||motionPreference.matches)return;
  const destination=new URL(link.href,location.href);
  if(destination.origin!==location.origin)return;
  event.preventDefault();
  document.body.classList.add('leaving');
  window.setTimeout(()=>location.assign(destination.href),180);
}));

// Ask once per browser tab. Load the official Spotify Embed only after a choice.
const musicChoiceKey='evening-letter-background-music';
const musicInvitation=document.querySelector('.music-invitation');
const musicDock=document.querySelector('.music-dock');
if(musicDock&&musicInvitation){
  const toggle=musicDock.querySelector('.music-toggle');
  const panel=musicDock.querySelector('.music-panel');
  const close=musicDock.querySelector('.music-close');
  const status=musicDock.querySelector('.music-fallback');
  const playChoice=musicInvitation.querySelector('.invitation-play');
  const quietChoice=musicInvitation.querySelector('.invitation-quiet');
  const setPanelOpen=open=>{panel.hidden=!open;toggle.setAttribute('aria-expanded',String(open))};
  const readChoice=()=>{try{return sessionStorage.getItem(musicChoiceKey)||''}catch{return ''}};
  const saveChoice=choice=>{try{sessionStorage.setItem(musicChoiceKey,choice)}catch{}};
  const loadSpotify=()=>{
    setPanelOpen(true);
    status.textContent='通过下方链接打开官方页面收听；数字下载需在 Bandcamp 购买。';
  };
  const savedChoice=readChoice();
  if(savedChoice==='play')loadSpotify();
  else if(!savedChoice)musicInvitation.hidden=false;
  playChoice.addEventListener('click',()=>{saveChoice('play');musicInvitation.hidden=true;loadSpotify()});
  quietChoice.addEventListener('click',()=>{saveChoice('quiet');musicInvitation.hidden=true});
  toggle.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')!=='true';if(open)loadSpotify();else setPanelOpen(false)});
  close.addEventListener('click',()=>setPanelOpen(false));
  document.addEventListener('keydown',event=>{if(event.key==='Escape'&&toggle.getAttribute('aria-expanded')==='true'){setPanelOpen(false);toggle.focus()}});
}

