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
const photoBase='';
function pick(key,index){const source=pools[key]||pools.all;let previous='';if(index===0){try{previous=localStorage.getItem('evening-letter-last-'+key)||''}catch{}}let candidates=source.filter(id=>!used.has(id)&&id!==previous);if(!candidates.length)candidates=source.filter(id=>!used.has(id));if(!candidates.length)candidates=source;const id=candidates[Math.floor(Math.random()*candidates.length)];used.add(id);if(index===0){try{localStorage.setItem('evening-letter-last-'+key,id)}catch{}}return id}
function imageUrl(id){return `${photoBase}${id}.jpg`}
document.querySelectorAll('[data-photo]').forEach((image,index)=>{const key=image.dataset.photo||'all';const poolIndex=counts.get(key)||0;counts.set(key,poolIndex+1);const id=pick(key,poolIndex);image.src=imageUrl(id);image.dataset.photoId=id;image.addEventListener('error',()=>{const alternatives=(pools[key]||pools.all).filter(other=>other!==id);if(alternatives.length)image.src=imageUrl(alternatives[Math.floor(Math.random()*alternatives.length)])},{once:true})});
document.querySelectorAll('a[href^=""],a[href$=".html"]').forEach(link=>link.addEventListener('click',event=>{if(event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;document.body.classList.add('leaving');setTimeout(()=>{window.location.href=link.href},120);event.preventDefault()}));

