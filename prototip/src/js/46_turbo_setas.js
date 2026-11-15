/* =====================================================================
   TURBO + FRUTA · SETAS SALTARINAS + PLANEO CON EL VESTIDO · VOLAR DESDE CUALQUIER SITIO
   - Turbo (T / botón «Turbo»): corre o vuela mucho más rápido y se gasta. Se llena comiendo fruta.
   - Setas gigantes: al caer encima, Bruna sale disparada. Bajando, Espacio apretado = planea (el vestido hace de paracaídas).
   - Con la escoba a la espalda: Control+Mayús+Espacio despega desde cualquier sitio; en el móvil, al saltar aparece «Volar».
   ===================================================================== */
const TURBO={v:35,max:100,on:false,held:false,drainFoot:14,drainFly:18,fruit:20,foot:6.6,fly:16,emptyT:-9,sparkT:0};
const TURBO_LEVEL=DEMO==='turbo';       // en el juego completo: llega con la poción 3 (POW.turbo)
const turboOn=()=>TURBO_LEVEL||POW.turbo;

/* ---------- setas gigantes ---------- */
const MUSH=[];
function freeSpot(x,z,r){
  const q={x:0,z:0};
  for(let k=0;k<60;k++){const a=k*2.4,d=k*0.3,px=x+Math.sin(a)*d,pz=z+Math.cos(a)*d;
    const b=bound(px,pz);if(Math.hypot(b[0]-px,b[1]-pz)>0.01)continue;
    if(waterAt(px,pz)>gY(px,pz)-0.1||Math.hypot(px-OX,pz-OZ)<16||Math.abs(px-pathX(pz))<r+0.9&&pz>-46)continue;
    let ok=true;for(const c of COL)if(Math.hypot(c.x-px,c.z-pz)<c.r+r+0.5){ok=false;break;}
    if(ok){q.x=px;q.z=pz;pushStatics(q,r+0.4);ok=Math.hypot(q.x-px,q.z-pz)<0.01;}
    if(ok)return [px,pz];}
  return [x,z];
}
function buildMush(x0,z0,h,capR,col,bv){
  const [x,z]=freeSpot(x0,z0,capR),y=gY(x,z),top=y+h,capH=capR*0.45,base=top-capH;
  const g=new THREE.Group();g.position.set(x,y,z);world.add(g);
  const stemM=LM('#f3e6cf'),capM=LM(col,{emissive:col,emissiveIntensity:0.18}),dotM=LM('#fff6ee'),gillM=LM('#f6cfe0',{side:THREE.DoubleSide});
  const stemH=base-y+0.08;mk(new THREE.CylinderGeometry(capR*0.26,capR*0.34,stemH,16),stemM,0,stemH/2,0,g);
  mk(SPH(1,16,10),stemM,0,0.05,0,g).scale.set(capR*0.42,0.18,capR*0.42);
  const cap=new THREE.Group();cap.position.y=base-y;g.add(cap);
  const dome=mk(new THREE.SphereGeometry(capR,28,14,0,TAU,0,PI/2),capM,0,0,0,cap);dome.scale.y=0.45;
  const gill=new THREE.Mesh(new THREE.CircleGeometry(capR*0.99,28),gillM);gill.rotation.x=PI/2;gill.position.y=0.005;cap.add(gill);
  for(let i=0;i<9;i++){const a=i*2.39+0.4,ph=0.35+0.75*((i*0.618)%1),s=capR*(0.1+0.05*((i*0.37)%1));
    const d=mk(SPH(1,10,6),dotM,Math.sin(ph)*Math.cos(a)*capR*0.98,Math.cos(ph)*capH*0.98,Math.sin(ph)*Math.sin(a)*capR*0.98,cap);
    d.scale.set(s,s*0.35,s);d.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),new THREE.Vector3(Math.sin(ph)*Math.cos(a)*0.45,Math.cos(ph),Math.sin(ph)*Math.sin(a)*0.45).normalize());}
  halo(g,0,0.15,0,capR*2.6,col,0.22);halo(cap,0,capH+0.2,0,capR*1.6,'#fff0f8',0.12);
  g.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true;}});
  COL.push({x,z,r:capR*0.3});
  const M={x,z,y,top,r:capR,capH,bv,cap,sp:spring(140,8)};MUSH.push(M);return M;
}
{const z1=-9,x1=pathX(z1)-4.6;
 buildMush(x1,z1,0.72,1.3,'#e8506a',11);                 // bajita: se llega con un salto normal
 buildMush(x1-4.2,z1-3.6,3.2,1.6,'#ff7fb0',12.5);
 buildMush(x1-6.8,z1-8.6,6.4,2.0,'#b05bd0',14);
 buildMush(x1-5.2,z1-14.2,2.0,1.4,'#e0743a',12);
 buildMush(GT.x-17,GT.z+12,0.75,1.4,'#e8506a',12);        // cerca del árbol gigante
 buildMush(GT.x-19,GT.z+5.5,4.6,1.9,'#b05bd0',16);}
const capTop=(M,x,z)=>{const d=Math.hypot(x-M.x,z-M.z);return d<M.r*0.97?M.top-(d/M.r)*(d/M.r)*M.capH:-1e9;};
function mushHit(py){                                     // llamada en el aire, cayendo
  if(S.vy>=0||!POW.setas)return false;                    // las setas hacen saltar desde la poción 2
  for(const M of MUSH){const t=capTop(M,S.pos.x,S.pos.z);if(t<-1e8)continue;
    if(py>=t-0.03&&S.y<=t){S.y=t;sfx('boing');S.vy=M.bv*(S.jumpHeld?1:0.86);S.bounced=true;S.airT=0;S.glide=false;M.sp.v-=3.2;SP.squat.v=-1.6;
      for(let i=0;i<10;i++)emit('dust',S.pos.x,t+0.05,S.pos.z,1,{sp:1.8,size:0.08,color:pick(['#ffd6f0','#fff3b0','#e6c8ff'])});
      if(!MUSH.told){MUSH.told=1;toast('En baixar, mantén '+(matchMedia('(pointer:coarse)').matches?'«Saltar»':'Espai')+' per planejar amb el vestit',4000);}
      return true;}}
  return false;
}
function mushSolid(p){for(const M of MUSH){const dx=p.x-M.x,dz=p.z-M.z,d=Math.hypot(dx,dz),R0=M.r+0.35;if(d<R0&&p.y<M.top+0.2&&d>1e-4){p.x=M.x+dx/d*R0;p.z=M.z+dz/d*R0;}}}
// planeo: cayendo, con Espacio apretado, después de una seta o desde cierta altura
function glideNow(g){return S.air&&S.vy<0&&S.jumpHeld&&(S.bounced||S.y-g>1.6);}

/* ---------- fruta ---------- */
const FRUIT=[];
const FRUITS=[
  g=>{mk(SPH(0.13,16,12),LM('#e8434f'),0,0,0,g).scale.y=0.92;mk(new THREE.CylinderGeometry(0.01,0.012,0.08,5),LM('#6b4430'),0,0.13,0,g);const l=mk(SPH(1,8,6),LM('#6fbf5a'),0.05,0.14,0,g);l.scale.set(0.05,0.015,0.028);l.rotation.z=0.5;return '#ff6a72';},
  g=>{mk(SPH(0.13,16,12),LM('#f0a040'),0,0,0,g);mk(SPH(0.025,8,6),LM('#6fbf5a'),0,0.125,0,g);return '#ffc070';},
  g=>{[[0,0.04,0],[0.07,-0.04,0.02],[-0.06,-0.04,0.03],[0,-0.03,-0.07]].forEach(p=>mk(SPH(0.075,12,10),LM('#8a4fd0'),p[0],p[1],p[2],g));mk(new THREE.CylinderGeometry(0.008,0.01,0.1,5),LM('#5f8a3a'),0,0.12,0,g);return '#c79aff';},
  g=>{const p=mk(SPH(0.12,16,12),LM('#ffd84a'),0,0,0,g);p.scale.set(0.9,1.2,0.9);mk(SPH(0.08,12,10),LM('#ffd84a'),0,0.13,0,g);mk(new THREE.CylinderGeometry(0.01,0.012,0.08,5),LM('#6b4430'),0,0.24,0,g);return '#fff07a';}
];
function addFruit(x,y,z,k){const g=new THREE.Group(),i=(k===undefined?FRUIT.length:k)%FRUITS.length,c=FRUITS[i](g);g.position.set(x,y,z);g.scale.setScalar(1.25);world.add(g);
  halo(g,0,0,0,0.9,c,0.4);g.traverse(o=>{if(o.isMesh)o.castShadow=true;});FRUIT.push({g,x,y,z,ph:FRUIT.length*1.7,alive:true,dead:0,s:1});}
for(let z=7;z>=-40;z-=5.5){const s=(Math.round(z)&1)?1:-1,x=pathX(z)+s*1.7;addFruit(x,gY(x,z)+0.6,z);}       // por el camino
for(const M of MUSH){addFruit(M.x,M.top+1.4,M.z);addFruit(M.x,M.top+M.bv*M.bv/24,M.z);}                     // encima de las setas
for(let i=0;i<10;i++){const a=i/10*TAU;addFruit(OX+Math.sin(a)*12,OY+L(3)+5+Math.sin(a*2)*2,OZ+Math.cos(a)*12);}   // anillo del torreón
for(let i=0;i<10;i++){const a=i/10*TAU;addFruit(GT.x+Math.sin(a)*19,GT.y+27+Math.sin(a*3)*1.5,GT.z+Math.cos(a)*19);} // alrededor de la copa
for(let i=1;i<8;i++){const k=i/8,x=lerp(OX,GT.x,k),z=lerp(OZ-12,GT.z+20,k);addFruit(x,lerp(OY+16,GT.y+20,k)+Math.sin(k*PI)*4,z);} // camino aéreo
function eat(f){f.alive=false;f.dead=0;sfx('eat');TURBO.v=Math.min(TURBO.max,TURBO.v+TURBO.fruit);TURBO.flash=1;
  for(let i=0;i<8;i++)emit('dust',f.g.position.x,f.g.position.y,f.g.position.z,1,{sp:1.6,size:0.07,color:pick(['#fff3b0','#ffd6f0','#c8ffd6'])});
  if(!FRUIT.told){FRUIT.told=1;toast('Nyam! La fruita omple el turbo · '+(matchMedia('(pointer:coarse)').matches?'mantén «Turbo»':'mantén T'),3500);}}

/* ---------- turbo ---------- */
function turboUse(dt,fly){
  if(!turboOn()||!TURBO.held)return false;
  if(TURBO.v<=0){if(S.t-TURBO.emptyT>3){TURBO.emptyT=S.t;toast('Sense turbo: menja fruita per omplir-lo',2000);}return false;}
  TURBO.v=Math.max(0,TURBO.v-(fly?TURBO.drainFly:TURBO.drainFoot)*dt);if(S.t-(TURBO.sndT||-9)>0.6)sfx('turbo');TURBO.sndT=S.t;TURBO.on=true;return true;
}

/* ---------- volar desde cualquier sitio ---------- */
function canMountHere(){
  if(FL.state!=='back'||FL.on||FL.phase||lift.riding||act)return false;
  if(mode==='tower')return curKey==='out'||curKey===3;
  if(inCave)return false;for(const H of HOUSES)if(H.inside)return false;return true;
}
function mountAir(){
  FL.on=true;FL.phase=null;FL.age=0.45;FL.vy=Math.max(S.vy,2.4);FL.vh=Math.max(S.speed,2);S.prep=-1;S.air=true;S.glide=false;S.bounced=false;
  broomTo('fly');SP.squat.v=-1.2;sfx('fly');
  for(let i=0;i<12;i++)emit('dust',S.pos.x,S.y+0.4,S.pos.z,1,{sp:1.4,size:0.07,color:pick(['#e6c8ff','#ffd6f0','#c8e8ff'])});
  if(Math.hypot(BN.x-S.pos.x,BN.z-S.pos.z)<4.5&&S.y-BN.gy<3){BN.riding=true;BN.root.rotation.order='YXZ';}
  $('bjump').textContent='Pujar';
}
function groundLaunch(){FL.phase='prep';FL.pt=0;S.prep=0;S.speed*=0.5;}
function tryFly(){
  if(FL.state==='stand'){toast('Primer agafa l\'escombra de la terrassa del torreó',2200);return;}
  if(!canMountHere()){if(!FL.on)toast('Aquí no es pot volar',1500);return;}
  if(S.air)mountAir();else groundLaunch();
}
addEventListener('keydown',e=>{
  const k=e.key.toLowerCase();
  if(k===' '&&e.ctrlKey&&e.shiftKey){S.jumpReq=false;e.preventDefault();if(!e.repeat)tryFly();}
  if(k==='t'){TURBO.held=true;}
});
addEventListener('keyup',e=>{if(e.key.toLowerCase()==='t')TURBO.held=false;});

/* ---------- interfaz: barra de turbo y botones ---------- */
{const css=document.createElement('style');css.textContent=
 '#tbar{left:calc(env(safe-area-inset-left) + 14px);top:calc(env(safe-area-inset-top) + 54px);width:130px;pointer-events:none;font:700 10px system-ui;color:#fff;letter-spacing:.5px}'+
 '#tbar .tr{height:10px;margin-top:3px;border-radius:999px;background:rgba(255,255,255,.22);overflow:hidden;box-shadow:inset 0 0 0 1.5px rgba(255,255,255,.5)}'+
 '#tbar .tf{height:100%;width:30%;border-radius:999px;background:linear-gradient(90deg,#ff8fa0,#ffd84a);transition:filter .2s}'+
 '#bturbo{width:64px;height:64px;margin-bottom:12px;background:rgba(255,216,74,.9)}#bturbo.off{opacity:.45}'+
 '#bfly{width:72px;height:72px;margin-bottom:8px;background:#efe3ff;color:#5b2d8a;display:none;animation:pl .35s infinite alternate}'+
 '#fbtn{top:calc(env(safe-area-inset-top) + 84px)!important}#fpan{top:calc(env(safe-area-inset-top) + 112px)!important}';
 document.head.appendChild(css);
 const bar=document.createElement('div');bar.id='tbar';bar.className='ui';bar.innerHTML='TURBO<div class="tr"><div class="tf"></div></div>';document.body.appendChild(bar);
 const acts=$('acts'),bt=document.createElement('button'),bf=document.createElement('button');
 bt.id='bturbo';bt.className='rb';bt.textContent='Turbo';bf.id='bfly';bf.className='rb';bf.textContent='Volar';
 acts.insertBefore(bf,$('bjump'));acts.insertBefore(bt,bf);
 bt.addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();TURBO.held=true;bt.setPointerCapture(e.pointerId);});
 const up=()=>{TURBO.held=false;};bt.addEventListener('pointerup',up);bt.addEventListener('pointercancel',up);
 bf.addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();tryFly();});
 if(!TURBO_LEVEL){bar.style.display='none';bt.style.display='none';}}
let flyShown=false,lastTurboW=-1;
function turboStep(dt){
  const t=S.t;
  // fruta: flota, gira, se come y vuelve a crecer
  const hx=S.pos.x,hy=S.y+(FL.on?0.55:0.65),hz=S.pos.z,rr2=FL.on?1.25:0.9;
  for(const f of FRUIT){if(!turboOn()){f.g.visible=false;continue;}
    if(f.alive){f.g.position.y=f.y+Math.sin(t*2+f.ph)*0.08;f.g.rotation.y=t*1.3+f.ph;
      if(f.s<1)f.s=Math.min(1,f.s+dt*2);f.g.scale.setScalar(1.25*ease(f.s));
      const dx=f.g.position.x-hx,dy=f.g.position.y-hy,dz=f.g.position.z-hz;
      if(Math.abs(dx)<rr2&&Math.abs(dz)<rr2&&dx*dx+dy*dy*0.6+dz*dz<rr2*rr2)eat(f);}
    else{f.dead+=dt;if(f.dead<0.25)f.g.scale.setScalar(1.25*(1-f.dead/0.25)*(1+f.dead*2));else f.g.visible=false;
      if(f.dead>30){f.alive=true;f.s=0;f.g.visible=true;}}}
  // setas: rebote del sombrero
  for(const M of MUSH){const s=stepS(M.sp,0,dt);M.cap.scale.set(1-s*0.25,1+s,1-s*0.25);}
  // turbo: estela y cámara
  if(TURBO.on){TURBO.sparkT-=dt;if(TURBO.sparkT<0){TURBO.sparkT=0.03;emit('dust',S.pos.x-Math.sin(S.yaw)*0.3,S.y+(FL.on?0.45:0.2),S.pos.z-Math.cos(S.yaw)*0.3,1,{sp:0.6,size:0.06,color:pick(['#ffd84a','#ff8fa0','#fff3b0'])});}}
  const fov=38+(TURBO.on?9:0)*Math.min(1,S.speed/6);if(Math.abs(camera.fov-fov)>0.05){camera.fov+=(fov-camera.fov)*(1-Math.exp(-dt*4));camera.updateProjectionMatrix();}
  // barra
  TURBO.flash=Math.max(0,(TURBO.flash||0)-dt*2.5);
  {const on=turboOn();if(on!==TURBO.shown){TURBO.shown=on;$('tbar').style.display=on?'':'none';$('bturbo').style.display=on?'':'none';if(on)FRUIT.forEach(f=>{if(f.alive)f.g.visible=true;});}}
  const w=Math.round(TURBO.v/TURBO.max*100);if(w!==lastTurboW){lastTurboW=w;document.querySelector('#tbar .tf').style.width=w+'%';$('bturbo').classList.toggle('off',w<=0);}
  document.querySelector('#tbar .tf').style.filter=TURBO.flash>0?'brightness('+(1+TURBO.flash)+')':'';
  // botón «Volar»: aparece mientras salta con la escoba a la espalda
  const show=S.air&&!FL.on&&!FL.phase&&FL.state==='back'&&canMountHere();
  if(show!==flyShown){flyShown=show;$('bfly').style.display=show?'block':'none';}
  TURBO.on=false;
}
/* ---------- pose de planeo (desde 41_bruna_animacion.js) ---------- */
function glidePose(tg){const k=S.glideK||0;if(k<0.01)return;
  const q={aL:-0.15,aR:-0.15,zL:2.0+Math.sin(S.t*3)*0.08,zR:-2.0+Math.sin(S.t*3+1)*0.08,eL:-0.15,eR:-0.15,hx:0.25};
  for(const n in q)tg[n]=lerp(tg[n],q[n],k);}
function glideBody(dt){
  S.glideK=(S.glideK||0)+((S.glide?1:0)-(S.glideK||0))*(1-Math.exp(-dt*6));const k=S.glideK;if(k<0.01)return;
  B.skirt.scale.set(lerp(B.skirt.scale.x,1.9,k),lerp(B.skirt.scale.y,0.62,k),lerp(B.skirt.scale.z,1.9,k));B.skirt.rotation.x*=1-k;
  B.hairB.rotation.x=lerp(B.hairB.rotation.x,-0.45+Math.sin(S.t*5)*0.05,k);B.hairS[0].rotation.z+=0.4*k;B.hairS[1].rotation.z-=0.4*k;
  B.root.rotation.z+=Math.sin(S.t*1.8)*0.07*k;
}

/* ---------- arranque de esta prueba: en las setas, con la escoba ya a la espalda ---------- */
if(DEMO==='turbo'){const M=MUSH[0];S.pos.set(M.x+3.2,0,M.z+5.2);S.y=gY(S.pos.x,S.pos.z);S.yaw=S.tyaw=Math.atan2(M.x-S.pos.x,M.z-S.pos.z);
  broomTo('back');cam.yaw=S.yaw+PI+0.2;cam.pitch=0.3;camT.set(S.pos.x,S.y+0.72,S.pos.z);
  setTimeout(()=>toast(matchMedia('(pointer:coarse)').matches?'Salta al bolet · en saltar amb l\'escombra surt «Volar» · «Turbo» gasta fruita':'Salta al bolet · Ctrl+Maj+Espai: volar · T: turbo',7000),500);}
