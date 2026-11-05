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
  const staticP=[],staticC=[],dynamic=[];
  const hex=h=>{h=h.replace('#','');return [parseInt(h.slice(0,2),16)/255,parseInt(h.slice(2,4),16)/255,parseInt(h.slice(4,6),16)/255];};
  const box=(x,y,z,w,h,d,color,into=staticP)=>{
    const c=hex(color),targetC=into===staticP?staticC:null;
    for(let i=0;i<cube.length;i+=3){into.push(cube[i]*w+x,cube[i+1]*h+y,cube[i+2]*d+z);if(targetC)targetC.push(...c);}
  };
  const choose=(array,n)=>array[(n%array.length+array.length)%array.length];
  const makeBuilding=(x,z,w,d,h,n,glow)=>{
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
  };

  // City floor, luminous lane markings and blocks.
  box(0,-.25,0,key==='home'?108:58,.5,key==='home'?108:58,'#090f22');
  const gridExtent=key==='home'?52:28;
  for(let i=-gridExtent;i<=gridExtent;i+=2){box(i,-.005,0,.022,.018,gridExtent*2,i%8===0?'#15324d':'#10243a');box(0,-.004,i,gridExtent*2,.018,.022,i%8===0?'#15324d':'#10243a');}
  for(let lane=key==='home'?-45:-25;lane<=(key==='home'?45:25);lane+=10){box(lane,.035,0,.72,.07,gridExtent*2,'#162b42');box(lane,.08,0,.08,.04,gridExtent*2,choose(colors,lane+40));}
  for(let z=key==='home'?-40:-24;z<=(key==='home'?40:24);z+=12){box(0,.04,z,key==='home'?90:55,.08,.62,'#1b3450');}
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
    const center={...primary,x:0,z:0};makeDistrict(center,1.35);
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
  status.innerHTML=key==='home'?'<strong>自由漫游 / N-06</strong><span>WASD 移动 · 拖动转向 · 点击街区进入</span><small>浮空车流 · 动态灯牌 · 6 个可探索区域</small>':'<strong>区域探索 / '+(primary?.name||'N-06')+'</strong><span>WASD 移动 · 拖动转向 · 点击信标调查</span><small class="neon-world-message">发现街区里的隐藏节点，收集本地信号。</small>';
  const touch=document.createElement('div');touch.className='neon-touch-pad';touch.setAttribute('aria-label','触屏移动控制');touch.innerHTML='<button data-key="w" aria-label="向前">▲</button><span><button data-key="a" aria-label="向左">◀</button><button data-key="s" aria-label="向后">▼</button><button data-key="d" aria-label="向右">▶</button></span>';
  stage.append(touch);
  stage.append(status);
  let message=status.querySelector('.neon-world-message');
  const showMessage=text=>{if(message){message.textContent=text;message.classList.add('is-new');setTimeout(()=>message?.classList.remove('is-new'),700);}};
  const visited=new Set();
  const landmarks=key==='home'?districts:[{...primary,x:0,z:0}, {id:'signal',name:'能量信标',x:0,z:-7}, {id:'overlook',name:'空中观景台',x:7,z:5}, {id:'cache',name:'隐藏补给',x:-7,z:6}];
  let yaw=key==='home'?-0.55:0,pitch=key==='home' ? 0.88 : 0.48,distance=key==='home'?48:32,target=[0,0,0],drag=null,lastPointer=null,moved=false;
  const keys=new Set();
  touch.querySelectorAll('[data-key]').forEach(button=>{const down=e=>{e.preventDefault();keys.add(button.dataset.key);button.classList.add('is-pressed');};const up=()=>{keys.delete(button.dataset.key);button.classList.remove('is-pressed');};button.addEventListener('pointerdown',down);button.addEventListener('pointerup',up);button.addEventListener('pointerleave',up);button.addEventListener('pointercancel',up);});
  const resize=()=>{const rect=stage.getBoundingClientRect(),dpr=Math.min(devicePixelRatio||1,1.7);canvas.width=Math.max(1,Math.floor(rect.width*dpr));canvas.height=Math.max(1,Math.floor(rect.height*dpr));canvas.style.width='100%';canvas.style.height='100%';gl.viewport(0,0,canvas.width,canvas.height);};
  new ResizeObserver(resize).observe(stage);resize();
  window.addEventListener('keydown',e=>{if(['w','a','s','d','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key)){keys.add(e.key.toLowerCase());if(e.key.startsWith('Arrow'))e.preventDefault();}});
  window.addEventListener('keyup',e=>keys.delete(e.key.toLowerCase()));
  stage.addEventListener('pointerdown',e=>{if(e.target.closest('a,button'))return;drag={x:e.clientX,y:e.clientY,yaw,pitch};moved=false;canvas.setPointerCapture?.(e.pointerId);});
  stage.addEventListener('pointermove',e=>{if(!drag)return;const dx=e.clientX-drag.x,dy=e.clientY-drag.y;if(Math.abs(dx)+Math.abs(dy)>3)moved=true;yaw=drag.yaw-dx*.006;pitch=Math.max(.18,Math.min(1.22,drag.pitch+dy*.0045));});
  stage.addEventListener('pointerup',e=>{if(drag&&!moved){const rect=canvas.getBoundingClientRect(),px=(e.clientX-rect.left)/rect.width*2-1,py=1-(e.clientY-rect.top)/rect.height*2;let nearest=null,dist=Infinity;for(const item of landmarks){const dx=px-item.screenX,dy=py-item.screenY,d=dx*dx+dy*dy;if(Number.isFinite(d)&&d<dist){nearest=item;dist=d;}}if(nearest&&dist<.045){visited.add(nearest.id);showMessage(nearest.id==='signal'?'信标已接入：本区供能状态稳定。':nearest.id==='overlook'?'观景台已标记：可俯瞰整片城区。':nearest.id==='cache'?'发现隐藏补给：夜班维修包 +1。':`已锁定 ${nearest.name}，街区入口已点亮。`);const marker=document.querySelector(`.district-marker[data-district="${nearest.id}"]`);if(marker&&key==='home')marker.click();}}
    drag=null;});
  stage.addEventListener('wheel',e=>{if(!stage.matches(':hover'))return;e.preventDefault();distance=Math.max(key==='home'?27:13,Math.min(key==='home'?65:40,distance+Math.sign(e.deltaY)*2));},{passive:false});
  document.querySelector('[data-city-reset], [data-district-reset]')?.addEventListener('click',()=>{yaw=key==='home'?-0.55:0;pitch=key==='home' ? 0.88 : 0.48;distance=key==='home'?48:32;target=[0,0,0];});
  document.querySelectorAll('[data-city-turn],[data-district-turn]').forEach(button=>button.addEventListener('click',()=>yaw-=Number(button.dataset.cityTurn||button.dataset.districtTurn)*Math.PI/180));
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  let start=performance.now(),prev=start;
  const render=now=>{
    const t=(now-start)/1000,dt=Math.min(.04,(now-prev)/1000);prev=now;
    const forward=(keys.has('w')||keys.has('arrowup'))-(keys.has('s')||keys.has('arrowdown'));
    const sideways=(keys.has('d')||keys.has('arrowright'))-(keys.has('a')||keys.has('arrowleft'));
    if(forward||sideways){target[0]+=(-Math.sin(yaw)*forward+Math.cos(yaw)*sideways)*dt*9;target[2]+=(-Math.cos(yaw)*forward-Math.sin(yaw)*sideways)*dt*9;target[0]=Math.max(-25,Math.min(25,target[0]));target[2]=Math.max(-25,Math.min(25,target[2]));}
    const orbit=reduced?0:t*.055;const cameraYaw=yaw+orbit;
    const eye=[target[0]+Math.sin(cameraYaw)*Math.cos(pitch)*distance,target[1]+Math.sin(pitch)*distance,target[2]+Math.cos(cameraYaw)*Math.cos(pitch)*distance];
    const proj=perspective(.79,canvas.width/canvas.height,.1,150),view=lookAt(eye,[target[0],target[1]+1,target[2]]),vp=multiply(proj,view);
    gl.enable(gl.DEPTH_TEST);gl.clearColor(.012,.018,.052,1);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.useProgram(program);gl.uniform1f(loc.tick,reduced?0:t*3.4);
    gl.uniform3f(loc.tint,1,1,1);setAttr(bp,loc.p);setAttr(bc,loc.c);gl.uniformMatrix4fv(loc.mvp,false,vp);gl.drawArrays(gl.TRIANGLES,0,staticP.length/3);
    setAttr(cubePositions,loc.p);setAttr(cubeColor,loc.c);
    for(const obj of dynamic){const phase=t*obj.speed+obj.phase;let x=obj.x,z=obj.z;if(obj.axis==='x')x=((obj.x+Math.sin(phase)*19+29)%58)-29;else z=((obj.z+Math.cos(phase)*14+15)%30)-15;const y=obj.y+(reduced?0:Math.sin(phase*1.7)*.13);const model=new Float32Array([obj.w,0,0,0,0,obj.h,0,0,0,0,obj.d,0,x,y,z,1]);gl.uniformMatrix4fv(loc.mvp,false,multiply(vp,model));gl.uniform3fv(loc.tint,hex(obj.c));gl.drawArrays(gl.TRIANGLES,0,36);}
    for(const item of landmarks){const p=[item.x,1.6,item.z],clip=vp;const x=clip[0]*p[0]+clip[4]*p[1]+clip[8]*p[2]+clip[12],y=clip[1]*p[0]+clip[5]*p[1]+clip[9]*p[2]+clip[13],w=clip[3]*p[0]+clip[7]*p[1]+clip[11]*p[2]+clip[15];item.screenX=x/w;item.screenY=y/w;}
    requestAnimationFrame(render);
  };
  requestAnimationFrame(render);
  document.querySelectorAll('.district-console [role="tab"]').forEach((tab,index)=>tab.addEventListener('click',()=>{
    colors[0]=['#ffb52e','#29e8ff','#ff3b71'][index%3];
    dynamic.forEach((object,n)=>{if(n%2===0)object.c=colors[0];});
    showMessage(['全区灯号转为暖琥珀，摊位恢复常亮。','引导灯切换冷青，人流通道已标记。','局部灯牌熄灭，维修区和紧急通道保留照明。'][index%3]);
  }));
})();

