(() => {
  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

  // Assemble a small procedural skyline so each visit has its own layered city silhouette.
  const skyline = document.querySelector('.map-skyline');
  if (skyline) {
    let seed = new Date().getDate() * 97 + new Date().getHours() * 31;
    const random = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
    for (let i = 0; i < 34; i += 1) {
      const building = document.createElement('i');
      const height = 7 + Math.round(random() * 20);
      building.className = 'map-building';
      building.style.setProperty('--x', `${2 + random() * 94}%`);
      building.style.setProperty('--y', `${9 + random() * 77}%`);
      building.style.setProperty('--w', `${1.3 + random() * 3.8}%`);
      building.style.setProperty('--h', `${height}%`);
      building.style.setProperty('--z', `${Math.round(random() * 60)}px`);
      building.style.setProperty('--delay', `${Math.round(random() * 650)}ms`);
      building.style.setProperty('--phase', `${-Math.round(random() * 5000)}ms`);
      if (height > 23) building.dataset.tower = 'true';
      skyline.append(building);
    }
  }

  const palette = { market:'#ff956d', loopline:'#5fe4ef', tower:'#7bb7f5', underworks:'#c6d87a', harbor:'#ffad5c', archive:'#9cdb8b' };
  const makePrism = (world, district, x, y, width, depth, height, index) => {
    const building = document.createElement('div');
    building.className = 'city3d-building';
    building.dataset.district = district;
    building.style.cssText = `--x:${x};--y:${y};--w:${width}px;--d:${depth}px;--h:${height}px;--glow:${palette[district]};--tone:color-mix(in srgb,${palette[district]} 18%,#0c1721);`;
    for (const face of ['front', 'side', 'roof']) {
      const panel = document.createElement('i');
      panel.className = `city3d-face city3d-face--${face}`;
      building.append(panel);
    }
    if (index % 3 === 0) building.dataset.tall = 'true';
    world.append(building);
    return building;
  };
  const cityWorld = document.querySelector('.city3d-world');
  if (cityWorld && !document.body.classList.contains('district-page')) {
    const districts = Object.keys(palette);
    const width = cityWorld.clientWidth || 420;
    const height = cityWorld.clientHeight || 320;
    // Six clusters form recognizable landmarks around the transit spine.
    const clusters = [[.12,.17],[.61,.08],[.43,.43],[.11,.66],[.66,.63],[.38,.16]];
    districts.forEach((district, group) => {
      for (let i = 0; i < 5; i += 1) {
        const x = Math.round((clusters[group][0] + (i % 3) * .075) * width);
        const y = Math.round((clusters[group][1] + Math.floor(i / 3) * .12) * height);
        const building = makePrism(cityWorld, district, `${x}px`, `${y}px`, 23 + (i % 3) * 8, 20 + (i % 2) * 9, 42 + ((i * 29 + group * 17) % 72), i);
        building.style.setProperty('--phase', `${-i * 430}ms`);
      }
    });
    [['18%','48%','53%','12px'],['38%','26%','35%','9px'],['49%','72%','31%','8px']].forEach(([x,y,w,d])=>{
      const road=document.createElement('i'); road.className='city3d-road'; road.style.cssText=`--x:${x};--y:${y};--w:${w};--d:${d}`; cityWorld.append(road);
    });
  }

  const makeDistrictScene = () => {
    const world = document.querySelector('.district3d-world');
    const key = document.body.dataset.district;
    if (!world || !palette[key]) return;
    const width = world.clientWidth || 380;
    const height = world.clientHeight || 250;
    const counts = { market:10, loopline:8, tower:12, underworks:9, harbor:10, archive:11 };
    for (let i=0;i<counts[key];i+=1) {
      const column=i%5; const row=Math.floor(i/5);
      const h=key==='tower'?90+(i*17%95):key==='archive'?50+(i%3)*28:key==='underworks'?24+(i%3)*10:38+(i*19%50);
      const b=makePrism(world,key,`${8+column*17}%`,`${18+row*40+(column%2)*9}%`,key==='loopline'?48:28+(i%3)*9,key==='harbor'?30:24+(i%2)*13,h,i);
      b.dataset.slot=String(i%3);
      b.dataset.form=key==='loopline'?'platform':key==='harbor'?'container':key==='archive'?'archive':key==='underworks'?'pipe':'tower';
      if (key==='loopline' && i<3) b.style.setProperty('--h','28px');
    }
    [[`${Math.round(width*.12)}px`,`${Math.round(height*.48)}px`,'70%','12px'],[`${Math.round(width*.2)}px`,`${Math.round(height*.72)}px`,'58%','9px']].forEach(([x,y,w,d])=>{
      const road=document.createElement('i');road.className='city3d-road';road.style.cssText=`--x:${x};--y:${y};--w:${w};--d:${d}`;world.append(road);
    });
  };
  makeDistrictScene();

  const setupOrbit = (surface, world, resetButton) => {
    if (!surface || !world) return;
    const onSmallScreen=window.matchMedia('(max-width: 680px)').matches;
    const baseZoom=surface.classList.contains('district3d-stage') ? (onSmallScreen ? .72 : .9) : (onSmallScreen ? .62 : .78);
    let spin=0, tilt=0, zoom=baseZoom, drag=null, moved=false;
    const paint=()=>{ world.style.setProperty('--spin',`${spin}deg`);world.style.setProperty('--tilt',`${tilt}deg`);world.style.setProperty('--camera-zoom',zoom); };
    surface.addEventListener('pointerdown',event=>{
      if(event.target.closest('a,button')) return;
      drag={x:event.clientX,y:event.clientY,spin,tilt};moved=false;surface.setPointerCapture?.(event.pointerId);
    });
    surface.addEventListener('pointermove',event=>{
      if(!drag)return;
      const dx=event.clientX-drag.x,dy=event.clientY-drag.y;
      if(Math.abs(dx)+Math.abs(dy)>4)moved=true;
      spin=drag.spin+dx*.35;tilt=Math.max(-12,Math.min(16,drag.tilt-dy*.18));paint();
    });
    const release=()=>{drag=null;};surface.addEventListener('pointerup',release);surface.addEventListener('pointercancel',release);
    surface.addEventListener('wheel',event=>{if(!surface.matches(':hover'))return;event.preventDefault();zoom=Math.max(.58,Math.min(1.08,zoom+(event.deltaY<0?.04:-.04)));paint();},{passive:false});
    resetButton?.addEventListener('click',()=>{spin=0;tilt=0;zoom=baseZoom;paint();});
    surface.addEventListener('keydown',event=>{if(event.key==='ArrowLeft'){spin-=8;paint()}else if(event.key==='ArrowRight'){spin+=8;paint()}else if(event.key==='ArrowUp'){tilt=Math.min(16,tilt+4);paint()}else if(event.key==='ArrowDown'){tilt=Math.max(-12,tilt-4);paint()}});
    surface.dataset.orbitReady='true';
    return {turn:amount=>{spin+=amount;paint();}};
  };
  const homeOrbit=setupOrbit(document.querySelector('.city-map-canvas'),cityWorld,document.querySelector('[data-city-reset]'));
  document.querySelectorAll('[data-city-turn]').forEach(button=>button.addEventListener('click',()=>homeOrbit?.turn(Number(button.dataset.cityTurn))));
  const districtOrbit=setupOrbit(document.querySelector('.district3d-stage'),document.querySelector('.district3d-world'),document.querySelector('[data-district-reset]'));
  document.querySelectorAll('[data-district-turn]').forEach(button=>button.addEventListener('click',()=>districtOrbit?.turn(Number(button.dataset.districtTurn))));

  // Pointer parallax is intentionally subtle; touch and reduced-motion users keep a calm view.
  if (!motionQuery.matches && matchMedia('(hover: hover) and (pointer: fine)').matches) {
    document.querySelectorAll('.city-map-canvas, .district-scene').forEach(scene => {
      scene.addEventListener('pointermove', event => {
        const box = scene.getBoundingClientRect();
        scene.style.setProperty('--pointer-x', ((event.clientX - box.left) / box.width - .5).toFixed(2));
        scene.style.setProperty('--pointer-y', ((event.clientY - box.top) / box.height - .5).toFixed(2));
      });
      scene.addEventListener('pointerleave', () => {
        scene.style.setProperty('--pointer-x', '0');
        scene.style.setProperty('--pointer-y', '0');
      });
    });
  }

  // Keep the map preview and marker accessibility state aligned with the current destination.
  const markers = [...document.querySelectorAll('.district-marker[data-district][data-status][data-description]')];
  const readout = document.querySelector('#city-readout');
  if (markers.length && readout) {
    const eyebrow = readout.querySelector('.eyebrow');
    const title = readout.querySelector('h2');
    const status = readout.querySelector('.readout-status');
    const description = readout.querySelector('.readout-description');
    const link = readout.querySelector('.readout-link');

    const selectMarker = marker => {
      markers.forEach(item => {
        const selected = item === marker;
        item.classList.toggle('is-selected', selected);
        if (selected) item.setAttribute('aria-current', 'true');
        else item.removeAttribute('aria-current');
      });
      const name = marker.querySelector('strong')?.textContent?.trim() || marker.dataset.district;
      if (eyebrow) eyebrow.textContent = `当前街区 / ${marker.dataset.district.toUpperCase()}`;
      if (title) title.textContent = name;
      if (status) status.textContent = marker.dataset.status;
      if (description) description.textContent = marker.dataset.description;
      if (link) link.href = marker.href;
      document.querySelectorAll('.city3d-building').forEach(building => building.classList.toggle('is-lit',building.dataset.district===marker.dataset.district));
      if (typeof readout.animate === 'function' && !motionQuery.matches) {
        readout.animate([{ opacity: .35, transform: 'translateX(10px)' }, { opacity: 1, transform: 'translateX(0)' }], { duration: 300, easing: 'ease-out' });
      }
    };

    markers.forEach(marker => {
      marker.addEventListener('pointerenter', () => selectMarker(marker));
      marker.addEventListener('focus', () => selectMarker(marker));
      marker.addEventListener('click', event => {
        if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || motionQuery.matches) return;
        const route = document.querySelector('.city-map-canvas .map-route');
        if (!route || typeof route.animate !== 'function') return;
        event.preventDefault();
        selectMarker(marker);
        document.querySelector('.city3d-world')?.style.setProperty('--camera-zoom','1.02');
        route.animate(
          [{ opacity: 0.55, filter: 'brightness(1)' }, { opacity: 1, filter: 'brightness(2.1)' }, { opacity: 0.9, filter: 'brightness(1.3)' }],
          { duration: 620, easing: 'ease-out' }
        ).finished.then(() => { window.location.href = marker.href; }).catch(() => { window.location.href = marker.href; });
      });
    });

    const selected = markers.find(marker => marker.classList.contains('is-selected')) || markers[0];
    selectMarker(selected);
  }

  // Initialize only complete tab groups whose controls resolve to unique local panels.
  document.querySelectorAll('[data-control-group]').forEach(group => {
    const tablist = group.querySelector('[role="tablist"]');
    if (!tablist) return;
    const buttons = [...tablist.querySelectorAll('[role="tab"][data-control-button][aria-controls]')];
    const panels = [...group.querySelectorAll('[role="tabpanel"][data-control-panel]')];
    if (!buttons.length || !panels.length) return;

    const panelById = new Map(panels.filter(panel => panel.id).map(panel => [panel.id, panel]));
    const targets = buttons.map(button => panelById.get(button.getAttribute('aria-controls')));
    if (targets.some(panel => !panel) || panels.length !== buttons.length || new Set(targets).size !== buttons.length) return;

    const initiallySelected = buttons.findIndex(button => button.getAttribute('aria-selected') === 'true');
    const activate = index => {
      const districtWorld=document.querySelector('.district3d-world');
      if(districtWorld) districtWorld.dataset.slot=String(index);
      buttons.forEach((button, buttonIndex) => {
        const active = buttonIndex === index;
        button.setAttribute('aria-selected', String(active));
        button.tabIndex = active ? 0 : -1;
        button.classList.toggle('is-active', active);
        targets[buttonIndex].hidden = !active;
        targets[buttonIndex].tabIndex = active ? 0 : -1;
      });
    };

    activate(initiallySelected >= 0 ? initiallySelected : 0);
    buttons.forEach((button, index) => {
      button.addEventListener('click', () => activate(index));
      button.addEventListener('keydown', event => {
        let next;
        if (event.key === 'Home') next = 0;
        else if (event.key === 'End') next = buttons.length - 1;
        else if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % buttons.length;
        else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index - 1 + buttons.length) % buttons.length;
        else return;
        event.preventDefault();
        activate(next);
        buttons[next].focus();
      });
    });
  });
})();

