/* =====================================================================
   EL JUEGO — física combinada (bosque + torreón), acciones, visibilidad
   ===================================================================== */
const CLEAR=14.5;
const damp=(Q,tg,k)=>{for(const n in tg)Q[n]=Q[n]===undefined?tg[n]:Q[n]+(tg[n]-Q[n])*k;};
let mode='forest',curKey='out',act=null;
const loc={x:0,y:0,z:0};
function toLoc(x,z,y){loc.x=x-OX;loc.z=z-OZ;loc.y=y-OY;return loc;}
const inTowerZone=(x,z,y)=>Math.hypot(x-OX,z-OZ)<CLEAR;

/* ---------- superficies del torreón (coordenadas locales) ---------- */
function phi(x,z){let a=(Math.atan2(x-TX,z)-PHD)%TAU;if(a<0)a+=TAU;return a;}
const rampH=(n,p)=>L(n)+(p-PH0)/(TAU-2*PH0)*H;
const _c=[];
function groundAt(x,z,y){
  const dM=Math.hypot(x,z),dT=Math.hypot(x-TX,z);_c.length=0;
  if(dT<TR+0.05){const p=phi(x,z);_c.push(0);if(p<PH0||p>TAU-PH0){_c.push(L(1),L(2),L(3));}else _c.push(rampH(0,p),rampH(1,p),rampH(2,p));}
  else{
    const dL=Math.hypot(x-LX,z-LZ);
    if(dM<RB)_c.push(BY);
    if(dL<LR)_c.push(lift.y);else _c.push(0);
    if(dM<RM+0.05)_c.push(L(1),L(2));
    if(dM<RM+WT+0.05)_c.push(L(3));
    if(x>-8.7&&x<-6.4&&Math.abs(z)<1.0)_c.push(L(1),L(2),L(3));
  }
  let best=-1e9,low=1e9;for(const h of _c){if(h<=y+0.5&&h>best)best=h;if(h<low)low=h;}
  return best>-1e8?best:low;
}
function stairBlock(x,z,y){
  const p=phi(x,z);
  if(p<PH0||p>TAU-PH0){for(let n=1;n<=3;n++){const h=L(n);if(h>y+0.5&&h<y+2.0)return true;}}
  else for(let n=0;n<3;n++){const h=rampH(n,p);if(h>y+0.5&&h<y+2.0)return true;}
  return false;
}
function keyAt(x,z,y){
  const dM=Math.hypot(x,z),dT=Math.hypot(x-TX,z),m=0.24,dL=Math.hypot(x-LX,z-LZ);
  if(y<-2.6){
    if(dM>RB-m)return null;
    if(dL<LR+0.12+m){if(lift.y>BY+0.05)return null;
      if(dL>LR-0.25-m){const a=Math.atan2(x-LX,z-LZ);if(Math.abs(a)>0.26||lift.door<0.7)return null;}}
    return '-1';
  }
  const n=clamp(Math.round(y/H),0,3),on=Math.abs(y-L(n))<1.25;
  if(dT<TR-m){if(dT<0.5+m||stairBlock(x,z,y))return null;return 't';}
  if(on&&n<3&&dM<RM-m)return n;
  if(on&&n===3&&dM<RM+0.16-m&&dT>TRo+m)return 3;
  if(on&&DT[n].open>0.75&&inDoorRect(DT[n],x,z,m-0.02))return 'd';
  if(n===0&&on){if(DE.open>0.75&&inDoorRect(DE,x,z,m-0.02))return 'd';if(dM>RM+WT+m&&dT>TRo+m&&dM<CLEAR+1)return 'out';}
  return null;
}
function pushOut(k,p){
  const cs=COLS[k];if(!cs)return;
  for(let i=0;i<2;i++){for(const c of cs){const dx=p.x-c.x,dz=p.z-c.z,d=Math.hypot(dx,dz),mn=c.r+0.22;if(d<mn&&d>1e-5){p.x=c.x+dx/d*mn;p.z=c.z+dz/d*mn;}}
    if((k===0&&lift.y>-0.3)||(k==='-1'&&lift.y<BY+0.3)){const cx=LX,cz=LZ-0.95,dx=p.x-cx,dz=p.z-cz,d=Math.hypot(dx,dz),mn=0.98;if(d<mn&&d>1e-5){p.x=cx+dx/d*mn;p.z=cz+dz/d*mn;}}}
}
const tOk=(x,z,y,air)=>{const k=keyAt(x,z,y);if(k===null)return false;if(!air&&groundAt(x,z,y)<y-0.75)return false;return true;};
const _p={x:0,z:0};
function tMove(px,pz,py,nx,nz,air){
  const k0=keyAt(px,pz,py);_p.x=nx;_p.z=nz;if(k0!==null)pushOut(k0,_p);nx=_p.x;nz=_p.z;
  if(tOk(nx,nz,py,air))return [nx,nz];
  for(const [cx,cz] of [[0,0],[TX,0],[LX,LZ]]){const r=Math.hypot(px-cx,pz-cz),a=Math.atan2(nx-cx,nz-cz),x=cx+Math.sin(a)*r,z=cz+Math.cos(a)*r;
    if(Math.hypot(x-px,z-pz)<Math.hypot(nx-px,nz-pz)*1.2+0.01&&tOk(x,z,py,air))return [x,z];}
  if(tOk(nx,pz,py,air))return [nx,pz];
  if(tOk(px,nz,py,air))return [px,nz];
  return [px,pz];
}
function forestMove(nx,nz){
  for(let k=0;k<2;k++)for(const c of COL){const dx=nx-c.x,dz=nz-c.z;if(Math.abs(dx)>c.r+0.3||Math.abs(dz)>c.r+0.3)continue;const d=Math.hypot(dx,dz),mn=c.r+0.2;if(d<mn&&d>1e-5){nx=c.x+dx/d*mn;nz=c.z+dz/d*mn;}}
  _p.x=nx;_p.z=nz;pushStatics(_p,0.24);nx=_p.x;nz=_p.z;
  const b=bound(nx,nz);nx=b[0];nz=b[1];
  if(waterDepth(nx,nz)>0.42){if(waterDepth(nx,S.pos.z)<=0.42)nz=S.pos.z;else if(waterDepth(S.pos.x,nz)<=0.42)nx=S.pos.x;else{nx=S.pos.x;nz=S.pos.z;S.speed*=0.5;}}
  return [nx,nz];
}
function groundY(x,z,y){return mode==='tower'?OY+groundAt(x-OX,z-OZ,y-OY):gY(x,z);}
function surfHere(x,z,y){
  if(mode==='tower'){
    if(curKey==='out'){const l=toLoc(x,z,y);return (Math.abs(l.x)<1.3&&l.z>RM+WT)?'path':'grass';}
    return curKey==='t'?'wood':'stone';
  }
  return surfForest(x,z);
}

/* ---------- avisos ---------- */
let toastT=0;
function toast(msg,ms){const h=$('hint');h.textContent=msg;h.style.opacity=1;clearTimeout(toastT);toastT=setTimeout(()=>h.style.opacity=0,ms||2600);}

/* ---------- movimiento ---------- */
const liftIdle=()=>Math.abs(lift.y-lift.tgt)<0.01;
function stepMove(dt){
  // escoba: saltar desde el borde de la terraza y volar
  if(S.jumpReq&&canLaunch()){S.jumpReq=false;startLaunch();}
  if(FL.on||FL.phase){flightStep(dt);S.jumpReq=false;return;}
  let ix=input.x,iy=input.y;const m=Math.hypot(ix,iy);
  const kx=(K.d||K.arrowright?1:0)-(K.a||K.arrowleft?1:0),ky=(K.w||K.arrowup?1:0)-(K.s||K.arrowdown?1:0);
  let ts=0;
  if(kx||ky){const l=Math.hypot(kx,ky);ix=kx/l;iy=ky/l;ts=K.shift?RUN:WALK;}
  else if(m>0.12){ts=m<0.7?WALK*clamp(m/0.55,0.4,1):RUN;ix/=m;iy/=m;}
  mode=inTowerZone(S.pos.x,S.pos.z,S.y)?'tower':'forest';
  S.depth=mode==='forest'?waterDepth(S.pos.x,S.pos.z):0;{const wa=waterAt(S.pos.x,S.pos.z);WL=wa>-1e8?wa:WY;}
  ts*=lerp(1,0.5,sat(S.depth/0.36));
  // turbo a pie; con las sabates màgiques corre muchísimo más, casi sin tocar el suelo (v.1.2)
  S.dash=false;if(ts>0&&!S.air&&!act&&!lift.riding&&turboUse(dt,false)){S.dash=shoesOn;ts=shoesOn?TURBO.footShoes:TURBO.foot;}
  if(S.glide&&ts>0)ts=Math.max(ts,4.6);                                        // planeando avanza más
  if(act||lift.riding)ts=0;
  if(ts>0){const sy=Math.sin(cam.yaw),cy=Math.cos(cam.yaw);S.tyaw=Math.atan2(-sy*iy+cy*ix,-cy*iy-sy*ix);}
  let dy=wrapA(S.tyaw-S.yaw);
  if(S.skid<=0&&!S.air&&S.speed>RUN*0.8&&Math.abs(dy)>2.2&&ts>0){S.skid=0.3;}
  if(S.skid>0){S.skid-=dt;ts=0;dy=0;S.skE=(S.skE||0)-dt;if(S.skE<0&&S.speed>0.8){S.skE=0.05;burst(S.surf,S.pos.x+Math.sin(S.yaw)*0.15,S.y,S.pos.z+Math.cos(S.yaw)*0.15,0.8,S.yaw);}}
  const rate=clamp(dy*(S.air?4:7.5),-7.5,7.5);S.yaw+=rate*dt;S.turn+=(rate-S.turn)*(1-Math.exp(-dt*10));
  const prev=S.speed,acc=TURBO.on?12:S.glide?4:S.air?3.5:(ts>S.speed?(S.speed<WALK?9:7.2):(S.skid>0?13:9));   // arrencades i frenades com a Alba
  S.speed+=clamp(ts-S.speed,-acc*dt,acc*dt);
  if(S.prep>=0)S.speed*=Math.exp(-dt*3);
  S.acc+=((S.speed-prev)/dt-S.acc)*(1-Math.exp(-dt*12));
  // ascensor
  if(!liftIdle()){const d=lift.tgt-lift.y;lift.y+=Math.sign(d)*Math.min(Math.abs(d),1.6*dt);
    if(Math.abs(lift.tgt-lift.y)<0.01){lift.y=lift.tgt;if(lift.riding){lift.riding=false;toast(lift.y<-1?'El dormitori de la bruixa':'La sala del tron',1800);}}}
  lift.g.position.y=lift.y;
  lift.door+=((lift.y<=BY+0.01&&liftIdle()?1:0)-lift.door)*(1-Math.exp(-dt*4));tubeDoor.rotation.y=-lift.door*1.75;
  if(lift.riding){S.y=OY+lift.y;S.vy=0;S.air=false;S.jumpReq=false;S.speed=0;return;}
  // horizontal
  if(S.speed>1e-4){
    let nx=S.pos.x+Math.sin(S.yaw)*S.speed*dt,nz=S.pos.z+Math.cos(S.yaw)*S.speed*dt;
    if(mode==='forest'){const r=forestMove(nx,nz);nx=r[0];nz=r[1];}
    else{const l=toLoc(S.pos.x,S.pos.z,S.y),r=tMove(l.x,l.z,l.y,nx-OX,nz-OZ,S.air);nx=r[0]+OX;nz=r[1]+OZ;}
    S.pos.x=nx;S.pos.z=nz;
  }
  mode=inTowerZone(S.pos.x,S.pos.z,S.y)?'tower':'forest';
  const g=groundY(S.pos.x,S.pos.z,S.y);S.surf=surfHere(S.pos.x,S.pos.z,S.y);
  // vertical: anticipación, subida lenta, caída más rápida, aterrizaje
  if(!S.air){
    if(g<S.y-0.75){S.air=true;S.vy=0;S.airT=0;}
    else{
      S.y+=(g-S.y)*(1-Math.exp(-dt*13));
      if(S.jumpReq&&S.prep<0&&!act)S.prep=0;
      if(S.prep>=0){S.prep+=dt;if(S.prep>0.11){S.prep=-1;S.air=true;S.dbl=false;S.sqKick=5;sfx('jump');S.vy=JUMPV*(S.depth>0.15?0.8:1);S.airT=0;SP.squat.v=-1.4;burst(S.surf,S.pos.x,S.y,S.pos.z,0.7);}}
    }
  }else{
    // salt flotant estil Alba: puja suau (més si es manté premut) i queda un moment suspès a dalt (|vy|<1.4)
    S.airT+=dt;let gr=S.vy>0?(S.jumpHeld?9.5:15):15;if(S.bounced)gr=S.vy>0?11:14.5;if(Math.abs(S.vy)<1.4)gr*=0.55;
    // sabates màgiques (encàrrec v.1, 2.8): un segundo salto en el aire, con chispas en los zapatos; después se puede planear
    if(S.jumpReq&&shoesOn&&!S.dbl&&!act){S.dbl=true;S.sqKick=4;S.vy=Math.max(S.vy,JUMPV*0.95);S.airT=0;S.bounced=false;sfx('jump');SP.squat.v=-1.2;doubleJumpFx();}
    S.glide=(mode==='forest'||S.dbl)&&glideNow(g);
    if(S.glide)S.vy+=(-1.25-S.vy)*(1-Math.exp(-dt*5));else S.vy-=gr*dt;      // planeo: el vestido frena la caída
    const py=S.y;S.y+=S.vy*dt;
    if(mode==='forest')mushHit(py);
    if(S.y<=g&&S.vy<0){S.sqKick=-(4.5+Math.min(3,-S.vy*0.3));S.bounced=false;S.glide=false;S.dbl=false;const imp=sat(-S.vy/6);S.y=g;S.air=false;sfx('land',imp);SP.squat.v+=1.0+2.0*imp;burst(S.surf,S.pos.x,S.y,S.pos.z,0.7+0.8*imp);if(S.surf!=='water')emit('dust',S.pos.x,S.y+0.03,S.pos.z,5,{sp:1.4,size:0.1,color:DUSTC});S.vy=0;}
  }
  S.jumpReq=false;
  if(!S.air&&S.depth>0.03&&S.speed>0.4){S.wake-=dt*S.speed;if(S.wake<0){S.wake=0.55;emit('ring',S.pos.x,0,S.pos.z,1,{size:0.45+S.depth,life:0.8});}}
}

/* ---------- acciones: puertas, ascensor, unicornio ---------- */
function nearDoor(){const l=toLoc(S.pos.x,S.pos.z,S.y);let best=null,bd=2.4;for(const d of doors){if(Math.abs(l.y-L(d.lvl))>1)continue;const dd=Math.hypot(l.x-d.x,l.z-d.z);if(dd<bd){bd=dd;best=d;}}return best;}
const dLiftB=()=>{const l=toLoc(S.pos.x,S.pos.z,S.y);return Math.hypot(l.x-LX,l.z-LZ);};
const onLift=()=>mode==='tower'&&dLiftB()<LR-0.3&&Math.abs(S.y-OY-lift.y)<0.3;
const uniDist=()=>Math.hypot(S.pos.x-UNI.x,S.pos.z-UNI.z);
let ctxCap='',ctxDoor=null;const ctxA=new THREE.Vector3();
function actions(){
  if(lift.riding||S.air||act)return [];
  ctxA.set(S.pos.x,S.y+1.75,S.pos.z);
  {const pa=potionActions();if(pa)return pa;}       // pociones: libro, botes, caldero, armario (55_pociones.js)
  {const fa=flightActions();if(fa)return fa;}
  if(mode==='forest'){if(uniDist()<2.5){ctxCap='Unicorn';ctxA.set(UNI.x,uni.g.position.y+2.0,UNI.z);return ['acariciar'];}return [];}
  const l=toLoc(S.pos.x,S.pos.z,S.y);
  if(liftIdle()){
    if(onLift()){ctxCap='El tron és l\'ascensor';return [lift.y>-0.1?'bajar':'subir'];}
    if(l.y<-2.6&&lift.y>BY+0.1&&dLiftB()<4.2){ctxCap='Ascensor';return ['llamar'];}
    if(Math.abs(l.y)<0.3&&lift.y<-0.1&&dLiftB()<4.2&&keyAt(l.x,l.z,l.y)===0){ctxCap='Ascensor';return ['llamar'];}
  }
  const d=nearDoor();ctxDoor=d;
  if(d){ctxCap=d.name;ctxA.set(d.x+OX,OY+L(d.lvl)+2.3,d.z+OZ);return [d.tgt?'cerrar':'abrir'];}
  return [];
}
const ACT={
  abrir(){if(ctxDoor){ctxDoor.tgt=1;sfx('door');}},
  cerrar(){const d=ctxDoor;if(!d)return;const l=toLoc(S.pos.x,S.pos.z,S.y);if(inDoorRect(d,l.x,l.z,-0.25)){toast('Aparta\'t de la porta per tancar-la',1800);return;}d.tgt=0;sfx('door');},
  bajar(){lift.tgt=BY;lift.riding=true;sfx('lift');},subir(){lift.tgt=0;lift.riding=true;sfx('lift');},
  llamar(){lift.tgt=S.y-OY<-2.6?BY:0;sfx('lift');},
  escoba(){broomTo('back');toast('Ves a la vora de la terrassa i prem Espai per llançar-te',4200);},
  lanzarse(){startLaunch();},
  acariciar(){act={type:'pet',t:0,hb:0};S.tyaw=Math.atan2(UNI.x+Math.sin(UNI.yaw)*0.6-S.pos.x,UNI.z+Math.cos(UNI.yaw)*0.6-S.pos.z);S.speed=0;}
};
const LAB={abrir:'Obrir',cerrar:'Tancar',bajar:'Baixar',subir:'Pujar',llamar:'Cridar',acariciar:'Acariciar',escoba:'Agafar l\'escombra',lanzarse:'Llançar-se!'};
function stepAct(dt){
  if(!act)return;act.t+=dt;
  if(act.type==='pet'){uni.happy=1;act.hb-=dt;
    if(act.hb<0&&act.t>0.5){act.hb=0.38;uni.head.getWorldPosition(tv);heart(lerp(tv.x,S.pos.x,rr(0.1,0.5)),tv.y+rr(0.1,0.4),lerp(tv.z,S.pos.z,rr(0.1,0.5)));}
    if(act.t>3.4){act=null;toast('A l\'unicorn li ha agradat');}}
}
let ctxKey='';
function renderCtx(){
  const a=actions(),key=a.join()+'|'+ctxCap,el=$('ctx');
  if(key!==ctxKey){ctxKey=key;
    el.innerHTML=a.length?'<div class="cap">'+ctxCap+'</div><div class="row">'+a.map(k=>'<button data-k="'+k+'" class="'+(k==='cerrar'?'alt':'')+'">'+LAB[k]+'</button>').join('')+'</div>':'';
    el.style.display=a.length?'flex':'none';}
  if(!a.length)return;
  tv.copy(ctxA).project(camera);
  const x=clamp((tv.x*0.5+0.5)*innerWidth,90,innerWidth-90),y=clamp((-tv.y*0.5+0.5)*innerHeight,150,innerHeight-40);
  el.style.transform='translate('+x.toFixed(1)+'px,'+y.toFixed(1)+'px) translate(-50%,-100%)';
}
$('ctx').addEventListener('pointerdown',e=>{const k=e.target&&e.target.dataset&&e.target.dataset.k;if(k){ACT[k]();e.preventDefault();}});
addEventListener('keydown',e=>{if(e.key.toLowerCase()==='e'&&!e.repeat){const a=actions();if(a.length)ACT[a[0]]();}});

/* ---------- saltar a cualquier sitio ---------- */
const TP={Bosque:[-0.6,10.5,null],Estanque:[2.6,6.0,null],'Torreón':[OX,OZ+12.5,OY],Trono:[OX,OZ+3.5,OY],Terraza:[OX,OZ+3,OY+L(3)],'Sótano':[OX,OZ+5.5,OY+BY],Puente:[RXB+BL+1.6,BZ,null],'Árbol':[GT.x,GT.z+13,null],Cueva:[GT.x,GT.z+0.6,null],Setas:[MUSH[0].x+3.2,MUSH[0].z+5.2,null],Casa:[...hW(H1,-0.6,1.2),null],Casita:[...hW(H2,0.3,1.0),null]};
const TP_CA={Bosque:'Bosc',Estanque:'Estany','Torreón':'Torreó',Trono:'Tron',Terraza:'Terrassa','Sótano':'Soterrani',Puente:'Pont','Árbol':'Arbre',Cueva:'Cova',Setas:'Bolets',Casa:'Casa',Casita:'Caseta'};
function teleport(name){const t=TP[name];if(!t||lift.riding)return;act=null;if(FL.on||FL.phase)endFlight();S.pos.set(t[0],0,t[1]);S.y=t[2]===null?gY(t[0],t[1]):t[2];S.vy=0;S.air=false;S.speed=0;S.prep=-1;
  mode=inTowerZone(S.pos.x,S.pos.z,S.y)?'tower':'forest';camT.set(S.pos.x,S.y+0.72,S.pos.z);}
Object.keys(TP).forEach(n=>{const b=document.createElement('button');b.textContent=TP_CA[n]||n;b.addEventListener('pointerdown',e=>{e.preventDefault();teleport(n);});$('chips').appendChild(b);});

/* ---------- luces, visibilidad y vida del torreón ---------- */
const pl1=new THREE.PointLight('#ff9a48',0,13,1.5),pl2=new THREE.PointLight('#ff9a48',0,13,1.5);scene.add(pl1);scene.add(pl2);
const LIGHTS={
  out:[[0,3,9.5,'#ffb060',0.55],[0,6,14,'#9fb0ff',0.2],HEMI_OUT[0],HEMI_OUT[1],HEMI_OUT[2]],
  0:[[-3.1,2.4,-3.0,'#ff9a48',0.75],[3.1,2.4,-3.0,'#ff9a48',0.75],'#d6ccf2','#8f7a68',1.0],
  1:[[5.2,L(1)+1.6,-3.2,'#ffb060',0.7],[-5.6,L(1)+2.6,0.5,'#ffc890',0.55],'#e2d6f2','#998272',1.05],
  2:[[0.3,L(2)+0.6,-0.4,'#ff8a3a',0.8],[0.3,L(2)+2.0,-0.4,'#b46cff',0.55],'#d6ccf2','#8f7a68',1.0],
  3:[[5.6,L(3)+2.3,3.6,'#ffb85a',0.6],[-2.6,L(3)+2.3,-6.0,'#ffb85a',0.6],HEMI_OUT[0],HEMI_OUT[1],HEMI_OUT[2]],
  '-1':[[-5.9,BY+1.6,1.0,'#c070ff',0.75],[1.2,BY+2.0,4.2,'#ffa050',0.75],'#cbbcea','#7a6286',1.0],
  cave:[[GT.x-OX,GT.y+2.6-OY,GT.z-OZ,'#6fd8ff',1.1],[GT.x-OX,GT.y+0.9-OY,GT.z-2.2-OZ,'#c07aff',0.85],'#6a64a8','#3e3048',0.55],
  house:[[0,0,0,'#cfd8ff',0.6],[0,0,0,'#ffcf8a',0.3],'#c2b8e6','#8a7262',0.82]
};
const NAMES={'-1':'el dormitori de la bruixa',0:'la sala del tron',1:'l\'habitació de la Bruna',2:'la cuina del calder',3:'la terrassa',t:'l\'escala'};
const _col=new THREE.Color();let isBase=false;
function towerAnim(dt){
  const t=S.t;
  for(const d of doors){d.open+=(d.tgt-d.open)*(1-Math.exp(-dt*5));d.hinge.rotation.y=d.open*1.72*(d.key==='E'?1:-1);}
  const l=toLoc(S.pos.x,S.pos.z,S.y),base=isBase=mode==='tower'&&(l.y<-2.6||(lift.riding&&l.y<-0.4)),dT=Math.hypot(l.x-TX,l.z),inT=dT<TR+0.1;
  if(mode==='tower'){
    for(const f of flames){const a=t*f.sp+f.ph,k=1+0.24*Math.sin(a)+0.14*Math.sin(a*1.73+f.ph*3);f.m.scale.set(f.s*(1.06-0.25*(k-1)),f.s*k,f.s*(1.06-0.25*(k-1)));f.m.rotation.z=0.2*Math.sin(a*0.61);f.m.rotation.x=0.16*Math.sin(a*0.83+f.ph);}
    for(const a of anims)a(t,dt);
    if(base)for(const p of plants){const dx=l.x-p.x,dz=l.z-p.z,d=Math.hypot(dx,dz),near=d<3.2;
      p.yaw+=wrapA((near?Math.atan2(dx,dz):p.ph+Math.sin(t*0.4+p.ph)*0.8)-p.yaw)*(1-Math.exp(-dt*(near?5:1.5)));p.g.rotation.y=p.yaw;
      p.st.rotation.x=0.25+Math.sin(t*1.1+p.ph)*0.1+(near?0.25:0);p.st.rotation.z=Math.sin(t*0.8+p.ph)*0.12;p.st2.rotation.x=0.35+Math.sin(t*1.4+p.ph)*0.12+(near?0.3:0);p.head.rotation.x=-0.4;
      const ch=near?Math.abs(Math.sin(t*7+p.ph)):0.5+0.5*Math.sin(t*1.6+p.ph);p.jaw.rotation.x=-(0.12+ch*0.75);}
  }
  // en qué parte del torreón estamos
  if(mode==='forest')curKey='out';
  else if(FL.on)curKey='out';
  else{const k=lift.riding?(l.y<-2.6?'-1':0):keyAt(l.x,l.z,l.y);if(k!==null&&k!=='d')curKey=k;}
  const lvl=base?-1:clamp(Math.floor((l.y+0.8)/H),0,3),outside=curKey==='out'||(lvl===3&&!inT);
  G[-1].visible=mode==='tower'&&(l.y<-0.3||lift.y<-0.3);
  for(let n=0;n<=3;n++){G[n].visible=!base&&(outside?(n===0||n===3):n<=lvl);TG[n].visible=!base&&!outside&&n<=lvl;}
  for(const s of steps)s.m.visible=!base&&!outside&&s.y<l.y+2.3&&!(s.off&&s.off());
  EXT.visible=outside;turretTop.visible=!inT;world.visible=!base;sky.visible=!base;
  // luz de la zona
  const cfg=LIGHTS[mode==='forest'?zoneKey():(curKey==='t'?lvl:curKey)]||LIGHTS[0],e=1-Math.exp(-dt*4);
  [pl1,pl2].forEach((p,i)=>{const c=cfg[i];p.position.set(c[0]+OX,c[1]+OY,c[2]+OZ);p.color.set(c[3]);p.intensity+=(c[4]*(0.9+0.1*Math.sin(t*11+i*2)*Math.sin(t*6.3))-p.intensity)*e;});
  hemi.color.lerp(_col.set(cfg[2]),e);hemi.groundColor.lerp(_col.set(cfg[3]),e);hemi.intensity+=(cfg[4]-hemi.intensity)*e;
  // nombre del sitio
  let nm;
  if(FL.on)nm='volant · '+Math.max(0,Math.round(S.y-fGround(S.pos.x,S.pos.z,S.y).g))+' m';
  else if(mode==='forest')nm=forestName();
  else nm=curKey==='out'?'el clar del torreó':NAMES[curKey]||'';
  if($('cnt').textContent!==nm)$('cnt').textContent=nm;
}

/* ---------- cámara ---------- */
function updateCam(dt){
  const k=1-Math.exp(-dt*4.2);
  camT.x+=(S.pos.x-camT.x)*k;camT.z+=(S.pos.z-camT.z)*k;
camT.y+=(S.y+0.72-camT.y)*(1-Math.exp(-dt*(lift.riding?8:3.2)));
  const cp=Math.cos(cam.pitch),sp=Math.sin(cam.pitch),cd=cam.dist*(1+0.38*FL.k);     // en vuelo, la cámara se aleja un poco
  camera.position.set(camT.x+Math.sin(cam.yaw)*cp*cd,camT.y+sp*cd,camT.z+Math.cos(cam.yaw)*cp*cd);
  const cx=camera.position.x,cz=camera.position.z;
  const g=isBase?OY+BY+0.4:Math.max(landH(cx,cz),WY)+0.25;if(camera.position.y<g)camera.position.y=g;
  camera.lookAt(camT);sky.position.copy(camera.position);
  sun.position.set(camT.x-7,camT.y+13,camT.z+6);sun.target.position.copy(camT);
}

/* ---------- bucle ---------- */
function frame(dt){stepMove(dt);stepAct(dt);animate(dt);animWorld(dt);worldAnim(dt);herbaStep();dayStep(dt);towerAnim(dt);bunnyStep(dt);turboStep(dt);gameStep(dt);}
let last=performance.now();
function loop(now){
  const dt=clamp((now-last)/1000,0,0.04);last=Math.max(last,now);   // el primer rAF puede llegar con una marca de tiempo anterior: dt negativo
  if(dt<=0){requestAnimationFrame(loop);return;}
  frame(dt);updateCam(dt);titleStep(dt);provaStep();renderCtx();
  if(!PCR.open)renderer.render(titleScene()||scene,camera);   // amb el creador de personatge obert no cal dibuixar el joc
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
window.__j={render:()=>renderer.render(titleScene()||scene,camera),step:(n,dt)=>{for(let i=0;i<n;i++)frame(dt||1/60);updateCam(1);},S,cam,K,input,ACT,actions,teleport,lift,doors,landH,groundY,parts,get mode(){return mode;},get key(){return curKey;},get act(){return act;},OX,OY,OZ,BN,GT,H1,H2,RXB,BZ,BL,trail,gY,pathX,waterAt,FL,FLY,broom,canLaunch,TURBO,MUSH,FRUIT,tryFly,canMountHere,get inCave(){return inCave;}};
