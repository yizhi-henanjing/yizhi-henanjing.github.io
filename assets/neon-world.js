(() => {
  const palettes = {
    market: ['#ff2e88', '#ffb52e', '#35f6ff', '#9d42ff'],
    loopline: ['#29e8ff', '#ff3b9d', '#a8ff37', '#7b52ff'],
    tower: ['#56efff', '#ff4fb8', '#a7ff46', '#9e5cff'],
    underworks: ['#bcff35', '#31f7ce', '#ff4b75', '#ffe45d'],
    harbor: ['#ff7a35', '#26eaff', '#ff3fb4', '#f5ef51'],
    archive: ['#8b65ff', '#2ef4dc', '#f8e36a', '#ff4eaa']
  };
  const districts = [
    { id:'market', name:'霓虹夜市', x:-10, z:8, color:0 },
    { id:'loopline', name:'环线站台', x:2, z:-14, color:1 },
    { id:'tower', name:'云幕塔区', x:13, z:-3, color:2 },
    { id:'underworks', name:'地下机修层', x:-14, z:-10, color:3 },
    { id:'harbor', name:'港务区', x:14, z:12, color:4 },
    { id:'archive', name:'静默档案馆', x:-1, z:14, color:5 }
  ];
  const districtsById = Object.fromEntries(districts.map(item => [item.id, item]));
  const pageKey = document.body.dataset.district;
  const key = palettes[pageKey] ? pageKey : 'home';
  const colors = palettes[key] || ['#27e9ff', '#ff38a8', '#b8ff36', '#9650ff'];
  const primary = districtsById[key];
  const stage = document.querySelector('.city3d-stage, .district3d-stage');
  if (!stage || !window.WebGLRenderingContext) return;

  const canvas = document.createElement('canvas');
  canvas.className = 'neon-world-canvas';
  canvas.setAttribute('aria-label', '可自由移动和旋转视角的霓虹 3D 城市。使用 WASD 或方向键移动，拖动改变视角。');
  stage.append(canvas);
  document.body.classList.add('neon-world-active');
  const gl = canvas.getContext('webgl', { antialias: true, alpha: false, powerPreference: 'high-performance' });
  if (!gl) { canvas.remove(); document.body.classList.remove('neon-world-active'); return; }

  const vertex = `attribute vec3 p; attribute vec3 c; uniform mat4 mvp; uniform vec3 tint; varying vec3 v; void main(){v=c*tint;gl_Position=mvp*vec4(p,1.0);}`;
  const fragment = `precision mediump float; varying vec3 v; uniform float tick; void main(){float pulse=.82+.18*sin(tick+gl_FragCoord.y*.018);gl_FragColor=vec4(v*pulse,1.0);}`;
  const shader = (type, source) => { const s=gl.createShader(type);gl.shaderSource(s,source);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(s));return s; };
  const program=gl.createProgram();gl.attachShader(program,shader(gl.VERTEX_SHADER,vertex));gl.attachShader(program,shader(gl.FRAGMENT_SHADER,fragment));gl.linkProgram(program);
  if(!gl.getProgramParameter(program,gl.LINK_STATUS))return;
  const loc={p:gl.getAttribLocation(program,'p'),c:gl.getAttribLocation(program,'c'),mvp:gl.getUniformLocation(program,'mvp'),tick:gl.getUniformLocation(program,'tick'),tint:gl.getUniformLocation(program,'tint')};
  const cube=[
    [-.5,-.5,.5,.5,-.5,.5,.5,.5,.5,-.5,-.5,.5,.5,.5,.5,-.5,.5,.5], [.5,-.5,-.5,-.5,-.5,-.5,-.5,.5,-.5,.5,-.5,-.5,-.5,.5,-.5,.5,.5,-.5],
    [-.5,-.5,-.5,-.5,-.5,.5,-.5,.5,.5,-.5,-.5,-.5,-.5,.5,.5,-.5,.5,-.5], [.5,-.5,.5,.5,-.5,-.5,.5,.5,-.5,.5,-.5,.5,.5,.5,-.5,.5,.5,.5],
    [-.5,.5,.5,.5,.5,.5,.5,.5,-.5,-.5,.5,.5,.5,.5,-.5,-.5,.5,-.5], [-.5,-.5,-.5,.5,-.5,-.5,.5,-.5,.5,-.5,-.5,-.5,.5,-.5,.5,-.5,-.5,.5]
  ].flat();
  const staticP=[],staticC=[],dynamic=[],solids=[];
  const hex=h=>{h=h.replace('#','');return [parseInt(h.slice(0,2),16)/255,parseInt(h.slice(2,4),16)/255,parseInt(h.slice(4,6),16)/255];};
  const box=(x,y,z,w,h,d,color,into=staticP)=>{
    const c=hex(color),targetC=into===staticP?staticC:null;
    for(let i=0;i<cube.length;i+=3){into.push(cube[i]*w+x,cube[i+1]*h+y,cube[i+2]*d+z);if(targetC)targetC.push(...c);}
  };
  const choose=(array,n)=>array[(n%array.length+array.length)%array.length];
  const makeBuilding=(x,z,w,d,h,n,glow)=>{
    solids.push({x,z,w:w*.58+.4,d:d*.58+.4});
    const body=['#14233b','#1b2040','#142a3a','#211b3b'][n%4];
    box(x,h/2,z,w,h,d,body);
    box(x,h+.09,z,w*.56,.09,d*.56,glow);
    box(x,h*.62,z+d/2+.015,w*.72,.065,.035,glow);
    const rows=Math.min(10,Math.floor(h/1.15));
    for(let r=0;r<rows;r++)for(let col=0;col<3;col++){
      const wx=x-w*.31+col*w*.31,wy=.55+r*.92;
      if(wy<h-.45)box(wx,wy,z+d/2+.024,Math.max(.09,w*.09),.14,.035,choose(colors,n+col+r),staticP);
    }
    if(n%3===0)box(x+w*.28,h*.84,z+d/2+.04,.14,Math.max(.6,h*.22),.07,colors[(n+1)%4]);
  };
  const makeDistrict=(item,scale=1)=>{
    const c=colors[item.color%colors.length];
    box(item.x,.08,item.z,7.5*scale,.16,7.5*scale,'#13223b');
    box(item.x,.18,item.z,7.15*scale,.055,7.15*scale,'#101b32');
    box(item.x,.23,item.z-3.48*scale,7.0*scale,.065,.09*scale,c);
    box(item.x,.23,item.z+3.48*scale,7.0*scale,.065,.09*scale,choose(colors,item.color+1));
    box(item.x-3.48*scale,.23,item.z,.09*scale,.065,7.0*scale,choose(colors,item.color+2));
    box(item.x+3.48*scale,.23,item.z,.09*scale,.065,7.0*scale,choose(colors,item.color+3));
    box(item.x,.42,item.z,1.0*scale,.5,1.0*scale,'#172946');
    box(item.x,.83,item.z,1.35*scale,.15,1.35*scale,c);
    for(let n=0;n<11;n++){
      const angle=n*2.399, radius=(1.7+(n%3)*.95)*scale;
      const x=item.x+Math.cos(angle)*radius,z=item.z+Math.sin(angle)*radius;
      const h=(3+(n*7%9)*.9)*scale;
      makeBuilding(x,z,(.8+(n%3)*.22)*scale,(.75+(n%2)*.24)*scale,h,n+item.color*13,choose(colors,item.color+n));
    }
    // Twin gateway pylons frame the actual walkable district entrance.
    for(const side of [-1,1]){
      box(item.x+side*1.05*scale,.92*scale,item.z-3.1*scale,.2*scale,1.8*scale,.2*scale,c);
      box(item.x+side*1.05*scale,1.87*scale,item.z-3.1*scale,.34*scale,.12*scale,.34*scale,choose(colors,item.color+2));
    }
    box(item.x,2.0*scale,item.z-3.1*scale,2.28*scale,.16*scale,.24*scale,c);
    box(item.x,2.12*scale,item.z-3.1*scale,1.3*scale,.055*scale,.28*scale,'#f4f0ff');
  };

  // City floor, luminous lane markings and blocks.
  box(0,-.25,0,key==='home'?108:58,.5,key==='home'?108:58,'#090f22');
  const gridExtent=key==='home'?52:28;
  for(let i=-gridExtent;i<=gridExtent;i+=2){box(i,-.005,0,.022,.018,gridExtent*2,i%8===0?'#15324d':'#10243a');box(0,-.004,i,gridExtent*2,.018,.022,i%8===0?'#15324d':'#10243a');}
  for(let lane=key==='home'?-45:-25;lane<=(key==='home'?45:25);lane+=10){box(lane,.035,0,.72,.07,gridExtent*2,'#162b42');box(lane,.08,0,.08,.04,gridExtent*2,choose(colors,lane+40));}
  for(let z=key==='home'?-40:-24;z<=(key==='home'?40:24);z+=12){box(0,.04,z,key==='home'?90:55,.08,.62,'#1b3450');}
  // Broad asphalt lanes and raised curbs give the camera a ground-level street to follow.
  const avenueWidth=key==='home'?8:5,curb=avenueWidth/2-.16;
  box(0,.028,0,avenueWidth,.055,gridExtent*2,'#101a2d');
  box(-curb,.09,0,.13,.1,gridExtent*2,colors[0]);box(curb,.09,0,.13,.1,gridExtent*2,colors[1]);
  box(0,.028,0,gridExtent*2,.055,avenueWidth,'#101a2d');
  box(0,.09,-curb,gridExtent*2,.1,.13,colors[2]);box(0,.09,curb,gridExtent*2,.1,.13,colors[3]);
  if(key==='home'){
    districts.forEach(item=>makeDistrict(item,.77));
    for(let n=0;n<24;n++){
      const angle=n*Math.PI*2/24,radius=29+(n%3)*3.5,x=Math.cos(angle)*radius,z=Math.sin(angle)*radius;
      makeBuilding(x,z,1.5+(n%3)*.45,1.6+(n%2)*.5,7+(n%5)*1.5,n+40,choose(colors,n+1));
    }
    // Central transit hub, ring and suspended cross-city rail.
    box(0,.35,0,6,.7,6,'#182241');box(0,.77,0,4,.13,4,colors[0]);box(0,1.28,0,1.5,1.0,1.5,'#24365a');
    box(0,1.82,0,2.3,.15,2.3,colors[1]);
    box(0,1.72,0,48,.045,.09,colors[0]);box(0,1.86,0,48,.045,.09,colors[1]);
  }else{
    // The selected district is scaled up into a playable miniature level.
    const center={...primary,x:0,z:0};makeDistrict(center,1.0);
    // Street-level blocks form a continuous avenue instead of a handful of floating props.
    // Their lit shop fronts face the player as they enter the district.
    for(let side of [-1,1]){
      box(side*5.15,.12,0,1.15,.24,30,'#1a2037');
      box(side*4.55,.17,0,.08,.09,30,choose(colors,side+3));
      for(let n=0;n<5;n++){
        const z=-10+n*5, h=5.5+(n*7%6)*1.35, w=2.5+(n%2)*.55, d=3.4;
        const x=side*(7.15+(n%2)*.25);
        makeBuilding(x,z,w,d,h,n+primary.color*17+(side>0?5:0),choose(colors,n+primary.color));
        box(x,h*.48,z+d*.51,w*.94,.34,.12,choose(colors,n+primary.color+1));
        box(x,h*.48,z+d*.58,w*.7,.055,.04,'#fff0cb');
        box(x,h*.48+.55,z+d*.52,w*.98,.12,.18,'#17182e');
        for(let awning=-1;awning<=1;awning++)box(x+awning*.68,.95,z+d*.65,.56,.16,.5,choose(colors,n+awning+2));
      }
    }
    // A cross-street, overhead rails, and gantries give the level a readable scale.
    box(0,.17,-15,18,.28,.72,'#18243a');
    for(const x of [-8.5,8.5]){
      box(x,5.4,-2,.18,10.8,.22,choose(colors,Math.round(x)));
      box(x/2,10.7,-2,Math.abs(x),.18,.22,choose(colors,Math.round(x)+1));
      box(x,3.8,11,.12,7.6,.16,choose(colors,Math.round(x)+2));
    }
    for(let n=0;n<7;n++){
      const z=-14+n*4.5;
      box(-3.35,.12,z,.08,.1,1.5,colors[n%4]);
      box(3.35,.12,z,.08,.1,1.5,colors[(n+1)%4]);
    }
    // Distinct skyline silhouettes make every neighborhood read differently.
    if(key==='loopline'){
      box(0,.9,-5,24,.45,2,'#13293b');box(0,1.25,-5,24,.12,2,colors[0]);
      for(let i=-10;i<=10;i+=2)box(i,1.15,-5,.1,.08,2,colors[1]);
      box(-8,1.65,-5,4,.45,1.35,'#b4efff');box(-8,1.9,-5,3,.08,1.4,colors[0]);
    }else if(key==='tower'){
      for(let n=0;n<7;n++)box(-8+n*2.6,8+(n%3)*2,5,1.6,16+(n%3)*4,1.6,choose(colors,n));
      for(let y=3;y<14;y+=3)box(0,y,5,18,.09,1.8,colors[(y+1)%4]);
    }else if(key==='underworks'){
      for(let n=0;n<8;n++){box(-12+n*3,.45,4,2.7,.18,.18,choose(colors,n));box(-12+n*3,.8,4,.16,.8,.16,choose(colors,n+1));}
      for(let y=1;y<5;y+=1.1)box(0,y,-7,20,.09,.09,colors[1]);
    }else if(key==='harbor'){
      box(0,.12,13,30,.12,8,'#073343');
      for(let n=0;n<8;n++){
        const x=-12+(n%4)*8,z=7-Math.floor(n/4)*4,c=choose(colors,n);
        box(x,.82,z,2.8,1.35,1.9,c);box(x,1.52,z,2.8,.08,1.9,colors[(n+1)%4]);
        for(let stripe=-1;stripe<=1;stripe++)box(x+stripe*.78,.84,z+.97,.055,1.05,.035,'#ffe8ff');
      }
      box(10,5,2,.45,10,.45,colors[0]);box(6,10,2,8,.25,.35,colors[1]);
    }else if(key==='archive'){
      for(let side of [-1,1])for(let n=0;n<5;n++){box(side*6,.7+n*.5,-8+n*3,1,.08,2.4,choose(colors,n));box(side*6,.95+n*.5,-8+n*3,.12,.45,2.2,colors[(n+2)%4]);}
      box(0,2,0,5,4,.35,colors[0]);box(0,4.1,0,5,.13,.4,colors[2]);
    }
    // Three visible exploration objects respond to direct clicks.
    box(0,2.7,-8,.22,5.4,.22,colors[0]);box(0,5.5,-8,.72,.12,.72,colors[1]);
    box(7,.22,5,3.6,.24,3.6,colors[1]);box(7,1.35,5,.18,2.2,.18,colors[0]);box(7,2.55,5,2.8,.16,2.8,colors[2]);
    box(-7,.55,6,1.25,1.1,1.2,colors[2]);box(-7,1.14,6,1.45,.11,1.35,colors[0]);
  }
  // Moving traffic, drones and light ribbons.
  for(let i=0;i<8;i++)dynamic.push({x:-23+i*6.5,y:.58+(i%3)*.28,z:(i%2? -19:18),w:1.4,h:.35,d:.68,c:colors[i%4],speed:.65+(i%4)*.19,axis:'x',phase:i*2.4});
  for(let i=0;i<6;i++)dynamic.push({x:-17+i*6.5,y:4+(i%3)*1.15,z:((i*11)%29)-14,w:.38,h:.3,d:.38,c:colors[(i+2)%4],speed:.5+(i%3)*.16,axis:'z',phase:i*1.7});

  const buffer=(data)=>{const b=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(data),gl.STATIC_DRAW);return b;};
  const bp=buffer(staticP),bc=buffer(staticC);
  const cubePositions=buffer(cube),cubeColor=buffer(Array.from({length:36},()=>[1,1,1]).flat());
  const setAttr=(buf,loc)=>{gl.bindBuffer(gl.ARRAY_BUFFER,buf);gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,3,gl.FLOAT,false,0,0);};

  const multiply=(a,b)=>{const o=new Float32Array(16);for(let c=0;c<4;c++)for(let r=0;r<4;r++)o[c*4+r]=a[r]*b[c*4]+a[4+r]*b[c*4+1]+a[8+r]*b[c*4+2]+a[12+r]*b[c*4+3];return o;};
  const perspective=(fov,aspect,near,far)=>{const f=1/Math.tan(fov/2),nf=1/(near-far);return new Float32Array([f/aspect,0,0,0,0,f,0,0,0,0,(far+near)*nf,-1,0,0,2*far*near*nf,0]);};
  const lookAt=(eye,target)=>{let zx=eye[0]-target[0],zy=eye[1]-target[1],zz=eye[2]-target[2],l=Math.hypot(zx,zy,zz)||1;zx/=l;zy/=l;zz/=l;let xx=zz,xy=0,xz=-zx;l=Math.hypot(xx,xz)||1;xx/=l;xz/=l;const yx=-zy*xz,yy=zz*xx-zx*xz,yz=zx*xy-zy*xx;return new Float32Array([xx,yx,zx,0,xy,yy,zy,0,xz,yz,zz,0,-(xx*eye[0]+xy*eye[1]+xz*eye[2]),-(yx*eye[0]+yy*eye[1]+yz*eye[2]),-(zx*eye[0]+zy*eye[1]+zz*eye[2]),1]);};
  const status=document.createElement('div');status.className='neon-world-hud';
  status.innerHTML=key==='home'?'<strong>第三人称漫游 / N-06</strong><span>WASD 行走 · 拖动转向 · 靠近街区入口进入</span><small class="neon-world-message">路边信标可调查 · 靠近后按 E</small>':'<strong>街道探索 / '+(primary?.name||'N-06')+'</strong><span>WASD 行走 · 拖动转向 · 靠近后按 E 调查</span><small class="neon-world-message">正在扫描附近的信标…</small>';
  const reticle=document.createElement('i');reticle.className='neon-reticle';reticle.setAttribute('aria-hidden','true');
  const touch=document.createElement('div');touch.className='neon-touch-pad';touch.setAttribute('aria-label','触屏移动控制');touch.innerHTML='<button data-key="w" aria-label="向前">▲</button><span><button data-key="a" aria-label="向左">◀</button><button data-key="s" aria-label="向后">▼</button><button data-key="d" aria-label="向右">▶</button></span>';
  stage.append(touch,reticle,status);
  let message=status.querySelector('.neon-world-message');
  const showMessage=text=>{if(message){message.textContent=text;message.classList.add('is-new');setTimeout(()=>message?.classList.remove('is-new'),700);}};
  const visited=new Set();
  const landmarks=key==='home'?districts:[{...primary,x:0,z:0}, {id:'signal',name:'能量信标',x:0,z:-7}, {id:'overlook',name:'空中观景台',x:7,z:5}, {id:'cache',name:'隐藏补给',x:-7,z:6}];
  if(key==='home')document.querySelectorAll('.city-map-canvas .district-marker').forEach(marker=>marker.addEventListener('click',event=>{
    const destination=landmarks.find(item=>item.id===marker.dataset.district);
    if(destination&&Math.hypot(destination.x-player.x,destination.z-player.z)>7){event.preventDefault();showMessage(`入口还在 ${Math.round(Math.hypot(destination.x-player.x,destination.z-player.z))}m 外，沿灯带走近它。`);}
  }));
  const player={x:key==='home'?3.4:0,z:key==='home'?37:(key==='harbor'?-12:12),yaw:key==='harbor'?Math.PI:0};
  let yaw=player.yaw,pitch=.25,distance=12.5,cameraX=player.x,cameraZ=player.z,drag=null,moved=false,walkPhase=0,activeLandmark=null,lastHudUpdate=0;
  const keys=new Set();
  touch.querySelectorAll('[data-key]').forEach(button=>{const down=e=>{e.preventDefault();keys.add(button.dataset.key);button.classList.add('is-pressed');};const up=()=>{keys.delete(button.dataset.key);button.classList.remove('is-pressed');};button.addEventListener('pointerdown',down);button.addEventListener('pointerup',up);button.addEventListener('pointerleave',up);button.addEventListener('pointercancel',up);});
  const resize=()=>{const rect=stage.getBoundingClientRect(),dpr=Math.min(devicePixelRatio||1,1.7);canvas.width=Math.max(1,Math.floor(rect.width*dpr));canvas.height=Math.max(1,Math.floor(rect.height*dpr));canvas.style.width='100%';canvas.style.height='100%';gl.viewport(0,0,canvas.width,canvas.height);};
  new ResizeObserver(resize).observe(stage);resize();
  window.addEventListener('keydown',e=>{if(['w','a','s','d','ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Shift'].includes(e.key)){keys.add(e.key.toLowerCase());if(e.key.startsWith('Arrow'))e.preventDefault();}});
  window.addEventListener('keyup',e=>keys.delete(e.key.toLowerCase()));
  stage.addEventListener('pointerdown',e=>{if(e.target.closest('a,button'))return;drag={x:e.clientX,y:e.clientY,yaw,pitch};moved=false;canvas.setPointerCapture?.(e.pointerId);});
  stage.addEventListener('pointermove',e=>{if(!drag)return;const dx=e.clientX-drag.x,dy=e.clientY-drag.y;if(Math.abs(dx)+Math.abs(dy)>3)moved=true;yaw=drag.yaw-dx*.006;pitch=Math.max(.18,Math.min(1.22,drag.pitch+dy*.0045));});
  const interact=()=>{if(!activeLandmark){showMessage('先沿街走近发光信标，再按 E 调查。');return;}visited.add(activeLandmark.id);showMessage(activeLandmark.id==='signal'?'信标已接入：本区供能状态稳定。':activeLandmark.id==='overlook'?'观景台已标记：可俯瞰整片城区。':activeLandmark.id==='cache'?'发现隐藏补给：夜班维修包 +1。':`已抵达 ${activeLandmark.name}，街区入口已标记。`);const marker=document.querySelector(`.district-marker[data-district="${activeLandmark.id}"]`);if(marker&&key==='home')marker.click();};
  stage.addEventListener('pointerup',e=>{if(drag&&!moved){const rect=canvas.getBoundingClientRect(),px=(e.clientX-rect.left)/rect.width*2-1,py=1-(e.clientY-rect.top)/rect.height*2;let nearest=null,dist=Infinity;for(const item of landmarks){const dx=px-item.screenX,dy=py-item.screenY,d=dx*dx+dy*dy;if(Number.isFinite(d)&&d<dist){nearest=item;dist=d;}}if(nearest&&dist<.014&&Math.hypot(nearest.x-player.x,nearest.z-player.z)<11){activeLandmark=nearest;interact();}else if(nearest){showMessage('信标离得还远，沿着灯带走近一些。');}}
    drag=null;});
  stage.addEventListener('wheel',e=>{if(!stage.matches(':hover'))return;e.preventDefault();distance=Math.max(11,Math.min(22,distance+Math.sign(e.deltaY)*1));},{passive:false});
  document.querySelector('[data-city-reset], [data-district-reset]')?.addEventListener('click',()=>{yaw=player.yaw=key==='harbor'?Math.PI:0;pitch=.25;distance=12.5;player.x=key==='home'?3.4:0;player.z=key==='home'?37:(key==='harbor'?-12:12);cameraX=player.x;cameraZ=player.z;});
  document.querySelectorAll('[data-city-turn],[data-district-turn]').forEach(button=>button.addEventListener('click',()=>yaw-=Number(button.dataset.cityTurn||button.dataset.districtTurn)*Math.PI/180));
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  let start=performance.now(),prev=start;
  let viewProjection;
  const drawPart=(localX,y,localZ,w,h,d,color,rotZ=0)=>{
    const cy=Math.cos(player.yaw),sy=Math.sin(player.yaw),cr=Math.cos(rotZ),sr=Math.sin(rotZ);
    const x=player.x+cy*localX+sy*localZ,z=player.z-sy*localX+cy*localZ;
    const matrix=new Float32Array([cy*cr*w,sr*w,-sy*cr*w,0,-cy*sr*h,cr*h,sy*sr*h,0,sy*d,0,cy*d,0,x,y,z,1]);
    gl.uniformMatrix4fv(loc.mvp,false,multiply(viewProjection,matrix));gl.uniform3fv(loc.tint,hex(color));gl.drawArrays(gl.TRIANGLES,0,36);
  };
  const render=now=>{
    const t=(now-start)/1000,dt=Math.min(.04,(now-prev)/1000);prev=now;
    const forward=(keys.has('w')||keys.has('arrowup'))-(keys.has('s')||keys.has('arrowdown'));
    const sideways=(keys.has('d')||keys.has('arrowright'))-(keys.has('a')||keys.has('arrowleft'));
    const moving=Boolean(forward||sideways);
    if(moving){const length=Math.hypot(forward,sideways)||1,fx=-Math.sin(yaw)*forward/length+Math.cos(yaw)*sideways/length,fz=-Math.cos(yaw)*forward/length-Math.sin(yaw)*sideways/length,speed=keys.has('shift')?8:5.2,nx=player.x+fx*dt*speed,nz=player.z+fz*dt*speed,limit=key==='home'?49:24;
      const blocked=solids.some(s=>Math.abs(nx-s.x)<s.w/2+.38&&Math.abs(nz-s.z)<s.d/2+.38);
      if(!blocked){player.x=Math.max(-limit,Math.min(limit,nx));player.z=Math.max(-limit,Math.min(limit,nz));player.yaw=Math.atan2(fx,-fz);}
      walkPhase+=dt*speed*1.8;
    }
    cameraX+=(player.x-cameraX)*Math.min(1,dt*7);cameraZ+=(player.z-cameraZ)*Math.min(1,dt*7);
    const eye=[cameraX+Math.sin(yaw)*distance,1.55+Math.sin(pitch)*distance,cameraZ+Math.cos(yaw)*distance];
    const lookAhead=key==='home'?1.2:4.2;
    const target=[cameraX-Math.sin(yaw)*lookAhead,1.8,cameraZ-Math.cos(yaw)*lookAhead];
    const proj=perspective(.82,canvas.width/canvas.height,.1,150),view=lookAt(eye,target);viewProjection=multiply(proj,view);
    gl.enable(gl.DEPTH_TEST);gl.clearColor(.012,.018,.052,1);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.useProgram(program);gl.uniform1f(loc.tick,reduced?0:t*3.4);
    gl.uniform3f(loc.tint,1,1,1);setAttr(bp,loc.p);setAttr(bc,loc.c);gl.uniformMatrix4fv(loc.mvp,false,viewProjection);gl.drawArrays(gl.TRIANGLES,0,staticP.length/3);
    setAttr(cubePositions,loc.p);setAttr(cubeColor,loc.c);
    for(const obj of dynamic){const phase=t*obj.speed+obj.phase;let x=obj.x,z=obj.z;if(obj.axis==='x')x=((obj.x+Math.sin(phase)*19+29)%58)-29;else z=((obj.z+Math.cos(phase)*14+15)%30)-15;const y=obj.y+(reduced?0:Math.sin(phase*1.7)*.13);const model=new Float32Array([obj.w,0,0,0,0,obj.h,0,0,0,0,obj.d,0,x,y,z,1]);gl.uniformMatrix4fv(loc.mvp,false,multiply(viewProjection,model));gl.uniform3fv(loc.tint,hex(obj.c));gl.drawArrays(gl.TRIANGLES,0,36);}
    const gait=moving?Math.sin(walkPhase)*.48:0;
    drawPart(0,1.13,0,.52,.76,.38,'#27dff2');drawPart(0,1.82,0,.43,.43,.43,'#e6e2ff');
    drawPart(0,1.82,-.235,.23,.12,.035,'#ff4fb8');drawPart(0,1.22,.25,.44,.58,.18,'#8f4cff');
    drawPart(-.36,1.15,0,.17,.58,.18,'#ffb52e',gait);drawPart(.36,1.15,0,.17,.58,.18,'#35f6ff',-gait);
    drawPart(-.16,.48,0,.2,.68,.22,'#26345b',-gait*.8);drawPart(.16,.48,0,.2,.68,.22,'#3a2d60',gait*.8);
    drawPart(-.16,.12,-.08,.3,.16,.4,'#ff4fb8');drawPart(.16,.12,-.08,.3,.16,.4,'#35f6ff');
    activeLandmark=null;let nearestDistance=Infinity;
    for(const item of landmarks){const d=Math.hypot(item.x-player.x,item.z-player.z);if(d<nearestDistance){nearestDistance=d;activeLandmark=item;}const p=[item.x,2.4,item.z-3.1],clip=viewProjection;const x=clip[0]*p[0]+clip[4]*p[1]+clip[8]*p[2]+clip[12],y=clip[1]*p[0]+clip[5]*p[1]+clip[9]*p[2]+clip[13],w=clip[3]*p[0]+clip[7]*p[1]+clip[11]*p[2]+clip[15];item.screenX=x/w;item.screenY=y/w;
      if(key==='home'){const marker=document.querySelector(`.city-map-canvas .district-marker[data-district="${item.id}"]`),visible=w>0&&Math.abs(item.screenX)<.94&&Math.abs(item.screenY)<.94;if(marker){marker.style.left=`${(item.screenX+1)*50}%`;marker.style.top=`${(1-item.screenY)*50}%`;marker.style.opacity=visible?'1':'0';marker.style.pointerEvents=visible?'auto':'none';}}
    }
    if(nearestDistance>8)activeLandmark=null;
    reticle.classList.toggle('is-active',Boolean(activeLandmark));
    if(now-lastHudUpdate>250){const small=status.querySelector('small');if(small&&!message?.classList.contains('is-new'))small.textContent=activeLandmark?`按 E 调查：${activeLandmark.name} · ${Math.round(nearestDistance)}m`:`最近信标 ${Math.round(nearestDistance)}m · 沿霓虹路面前进`;lastHudUpdate=now;}
    requestAnimationFrame(render);
  };
  requestAnimationFrame(render);
  window.addEventListener('keydown',e=>{if(e.key.toLowerCase()==='e'&&!e.repeat)interact();});
  document.querySelectorAll('.district-console [role="tab"]').forEach((tab,index)=>tab.addEventListener('click',()=>{
    colors[0]=['#ffb52e','#29e8ff','#ff3b71'][index%3];
    dynamic.forEach((object,n)=>{if(n%2===0)object.c=colors[0];});
    showMessage(['全区灯号转为暖琥珀，摊位恢复常亮。','引导灯切换冷青，人流通道已标记。','局部灯牌熄灭，维修区和紧急通道保留照明。'][index%3]);
  }));
})();
