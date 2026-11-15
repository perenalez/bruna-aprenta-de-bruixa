/* =====================================================================
   VUELO EN ESCOBA (se desbloquea a partir del nivel 4)
   - La escoba está en la terraza del torreón. Se coge, se va al borde y
     Espacio (o el botón) hace saltar a Bruna, que se lanza con la escoba.
   - En el aire: mantener Espacio = sube; soltar = baja. Joystick = dirección.
   ===================================================================== */
const FL={state:'stand',phase:null,on:false,k:0,pt:0,age:0,vy:0,vh:0,turn:0,pitch:0,roll:0,dragT:-9,sparkT:0,msgT:0,camD:7.8,landT:-9,hardN:0};
const FLY={up:3.2,down:-3.8,accUp:6.5,accDown:6,speed:7,boost:10,acc:3.2,dec:1.6,brake:4,turn:1.9,ceil:40,launchVy:6.8,launchVh:2.8};
const BROOM_STAND=()=>({x:OX-2.4,y:OY+L(3),z:OZ+4.2});

/* ---------- la escoba ---------- */
const broom=(()=>{
  const g=new THREE.Group(),wood=LM('#8a5d3a'),woodD=LM('#6b4430'),straw=LM('#d9ad55'),strawD=LM('#b88a3c'),band=LM('#7a4fb0'),ribbon=LM('#e8506a');
  mk(new THREE.CylinderGeometry(0.02,0.024,1.42,8),wood,0,0.26,0,g);
  mk(SPH(0.032,10,8),woodD,0,0.98,0,g);
  // nudo de ramitas torcidas en la punta
  [0.6,-0.5].forEach((a,i)=>{const t=mk(new THREE.CylinderGeometry(0.006,0.01,0.16,5),woodD,0.02*Math.sign(a),0.95+i*0.02,0,g);t.rotation.z=a;});
  // atadura y cerdas
  [-0.38,-0.44].forEach(y=>mk(new THREE.CylinderGeometry(0.05,0.05,0.035,10),band,0,y,0,g));
  const br=new THREE.LatheGeometry([[0.045,-0.36],[0.06,-0.45],[0.11,-0.62],[0.15,-0.8],[0.13,-0.86],[0.001,-0.88]].map(p=>new THREE.Vector2(p[0],p[1])),12);
  mk(br,straw,0,0,0,g);
  for(let i=0;i<9;i++){const a=i/9*Math.PI*2,s=mk(new THREE.CylinderGeometry(0.008,0.012,0.4,4),strawD,Math.sin(a)*0.1,-0.66,Math.cos(a)*0.1,g);s.rotation.set(Math.cos(a)*0.22,0,-Math.sin(a)*0.22);}
  // lacito
  const bow=new THREE.Group();bow.position.set(0,-0.32,0.045);g.add(bow);
  [1,-1].forEach(s=>{const w=mk(SPH(1,10,8),ribbon,s*0.03,0,0,bow);w.scale.set(0.03,0.02,0.012);});
  [1,-1].forEach(s=>{const t=mk(new THREE.BoxGeometry(0.012,0.07,0.004),ribbon,s*0.014,-0.04,0,bow);t.rotation.z=s*0.3;});
  g.traverse(o=>{if(o.isMesh)o.castShadow=true;});
  const glow=halo(g,0,0.1,0,1.4,'#c79aff',0.0);
  return {g,glow};
})();
function broomTo(where){
  FL.state=where;const g=broom.g;g.rotation.set(0,0,0);g.scale.setScalar(1);broom.glow.material.opacity=0;
  if(where==='stand'){scene.add(g);const p=BROOM_STAND();g.position.set(p.x,p.y+0.9,p.z);broom.glow.material.opacity=0.5;}
  else if(where==='back'){B.chest.add(g);g.position.set(0.03,0.14,-0.25);g.rotation.set(0.12,0,0.78);}
  else if(where==='fly'){B.root.add(g);g.position.set(0,0.4,0.06);g.rotation.set(Math.PI/2,0,0);}
}
broomTo('stand');

/* ---------- ¿se puede saltar desde aquí? ---------- */
function canLaunch(){
  if(FL.state!=='back'||FL.on||FL.phase||S.air||mode!=='tower'||lift.riding)return false;
  const l=toLoc(S.pos.x,S.pos.z,S.y);if(Math.abs(l.y-L(3))>0.35)return false;
  const dM=Math.hypot(l.x,l.z);if(dM<RM-1.15)return false;
  return Math.abs(wrapA(Math.atan2(l.x,l.z)-W_TH))>0.65;          // no hacia la torrecilla de la escalera
}
function flightActions(){
  if(FL.on||FL.phase||!POW.escoba)return null;          // la escoba llega con la poción 4
  if(FL.state==='stand'&&mode==='tower'){const p=BROOM_STAND();if(Math.hypot(S.pos.x-p.x,S.pos.z-p.z)<1.9&&Math.abs(S.y-p.y)<1){ctxCap='Escombra màgica';ctxA.set(p.x,p.y+2.1,p.z);return ['escoba'];}}
  if(canLaunch()){ctxCap='Vora de la terrassa';return ['lanzarse'];}
  return null;
}
function startLaunch(){
  const l=toLoc(S.pos.x,S.pos.z,S.y);S.tyaw=S.yaw=Math.atan2(l.x,l.z);S.speed=0;
  FL.phase='prep';FL.pt=0;S.prep=0;
}
function launchNow(){
  FL.phase=null;FL.on=true;FL.age=0;FL.vy=FLY.launchVy;FL.vh=FLY.launchVh;FL.turn=0;S.prep=-1;S.air=true;
  broomTo('fly');SP.squat.v=-1.6;sfx('fly');
  for(let i=0;i<14;i++)emit('dust',S.pos.x,S.y+0.4,S.pos.z,1,{sp:1.4,size:0.07,color:pick(['#e6c8ff','#ffd6f0','#c8e8ff'])});
  if(Math.hypot(BN.x-S.pos.x,BN.z-S.pos.z)<4.5){BN.riding=true;BN.root.rotation.order='YXZ';}
  $('bjump').textContent='Pujar';
  toast(matchMedia('(pointer:coarse)').matches?'Mantén «Pujar» per pujar · deixa-ho anar per baixar':'Mantén Espai per pujar · deixa-ho anar per baixar',5000);
}
function endFlight(soft){
  FL.on=false;FL.phase=null;S.air=false;S.vy=0;$('bjump').textContent='Saltar';
  if(FL.state==='fly')broomTo('back');
  if(BN.riding){BN.riding=false;BN.root.rotation.set(0,BN.root.rotation.y,0);BN.body.rotation.set(0,0,0);}
  trail.length=0;
}

/* ---------- física del vuelo ---------- */
function fGround(x,z,y){
  if(Math.hypot(x-OX,z-OZ)<CLEAR)return {g:OY+groundAt(x-OX,z-OZ,y-OY),water:null};
  const g=gY(x,z),w=waterAt(x,z);return {g,water:w>g+0.3?w:null};       // charcos poco profundos: se puede aterrizar
}
function landable(x,z,g){
  if(Math.hypot(x-OX,z-OZ)<CLEAR){const k=keyAt(x-OX,z-OZ,g-OY);return k!==null&&k!=='d'&&k!=='t';}
  const b=bound(x,z);if(Math.hypot(b[0]-x,b[1]-z)>0.05)return false;
  _p.x=x;_p.z=z;pushStatics(_p,0.24);if(Math.hypot(_p.x-x,_p.z-z)>0.02)return false;
  for(const c of COL){if(Math.abs(c.x-x)<c.r+0.3&&Math.abs(c.z-z)<c.r+0.3&&Math.hypot(c.x-x,c.z-z)<c.r+0.2)return false;}
  return true;
}
const _fp={x:0,y:0,z:0};
function fSolids(p,px,pz,py){
  // torreón: se puede entrar a la terraza desde arriba, no atravesar los muros
  {const R0=RM+WT+0.35,floor=OY+L(3),top=floor+1.55,lx=p.x-OX,lz=p.z-OZ,d=Math.hypot(lx,lz),wasIn=Math.hypot(px-OX,pz-OZ)<R0;
   if(d<R0&&((p.y<floor-0.05)||(!wasIn&&p.y<top))){p.x=OX+lx/d*R0;p.z=OZ+lz/d*R0;}}
  {const R0=TRo+0.35,lx=p.x-(OX+TX),lz=p.z-OZ,d=Math.hypot(lx,lz);if(d<R0&&p.y<OY+L(3)+8.2){p.x=OX+TX+lx/d*R0;p.z=OZ+lz/d*R0;}}
  // árbol gigante: tronco y copa
  {const lx=p.x-GT.x,lz=p.z-GT.z,d=Math.hypot(lx,lz),hy=p.y-GT.y,rT=(hy<3.5?6.3:hy<15?lerp(5.5,4.4,(hy-3.5)/11.5):lerp(4.4,3.4,(hy-15)/6.5))+0.55;
   if(hy<22.5&&d<rT&&d>1e-4){p.x=GT.x+lx/d*rT;p.z=GT.z+lz/d*rT;}
   const ex=lx/15.5,ey=(hy-25.5)/6,ez=lz/15.5,e=Math.hypot(ex,ey,ez);if(e<1&&e>1e-4){p.x=GT.x+ex/e*15.5;p.y=GT.y+25.5+ey/e*6;p.z=GT.z+ez/e*15.5;FL.vh*=0.97;if(S.t-FL.msgT>4){FL.msgT=S.t;toast('Fulles! Millor per sobre o per sota de la copa',2000);}}}
  // casas (con tejado)
  for(const H of HOUSES){const top=H.y+H.h*1.62+0.25;if(p.y>top)continue;const l=hL(H,p.x,p.z),hw=H.w/2+0.55,hd=H.d/2+0.65;
    if(Math.abs(l[0])<hw&&Math.abs(l[1])<hd){let lx=l[0],lz=l[1];if(hw-Math.abs(lx)<hd-Math.abs(lz))lx=Math.sign(lx||1)*hw;else lz=Math.sign(lz||1)*hd;p.x=H.x+lx*H.c+lz*H.s;p.z=H.z-lx*H.s+lz*H.c;}}
  // troncos, rocas y raíces cerca del suelo
  const gnd=gY(p.x,p.z);if(p.y-gnd<3.5)for(const c of COL){const dx=p.x-c.x,dz=p.z-c.z;if(Math.abs(dx)>c.r+0.5||Math.abs(dz)>c.r+0.5)continue;const d=Math.hypot(dx,dz),mn=c.r+0.3;if(d<mn&&d>1e-5){p.x=c.x+dx/d*mn;p.z=c.z+dz/d*mn;}}
  mushSolid(p);
  // límites del mundo
  if(p.x<-85||p.x>85||p.z<-150||p.z>62){p.x=clamp(p.x,-85,85);p.z=clamp(p.z,-150,62);FL.vh*=0.9;if(S.t-FL.msgT>4){FL.msgT=S.t;toast('L\'escombra no vol anar més lluny',1800);}}
}
function flightStep(dt){
  // anticipación del salto
  if(FL.phase==='prep'){FL.pt+=dt;S.prep=FL.pt;if(FL.pt>0.3)launchNow();return;}
  let ix=input.x,iy=input.y;const m=Math.hypot(ix,iy);
  const kx=(K.d||K.arrowright?1:0)-(K.a||K.arrowleft?1:0),ky=(K.w||K.arrowup?1:0)-(K.s||K.arrowdown?1:0);
  let want=0,mag=0;
  if(kx||ky){const l=Math.hypot(kx,ky);ix=kx/l;iy=ky/l;mag=1;want=K.shift?FLY.boost:FLY.speed;}
  else if(m>0.12){ix/=m;iy/=m;mag=Math.min(1,m);want=FLY.speed*mag*(m>0.95?FLY.boost/FLY.speed:1);}
  if(mag>0){const sy=Math.sin(cam.yaw),cy=Math.cos(cam.yaw);S.tyaw=Math.atan2(-sy*iy+cy*ix,-cy*iy-sy*ix);}
  FL.age+=dt;
  // vertical: impulso del salto y después, Espacio = sube / soltar = baja
  if(FL.age<0.45)FL.vy-=11*dt;
  else{const hold=S.jumpHeld,ceil=sat((OY+FLY.ceil-S.y)/6),tgt=hold?FLY.up*ceil:FLY.down,acc=hold?FLY.accUp:FLY.accDown;FL.vy+=clamp(tgt-FL.vy,-acc*dt,acc*dt);}
  // horizontal con inercia y giros suaves
  const dy=wrapA(S.tyaw-S.yaw),rate=mag>0?clamp(dy*2.4,-FLY.turn,FLY.turn):0;S.yaw+=rate*dt;FL.turn+=(rate-FL.turn)*(1-Math.exp(-dt*5));
  if(mag>0&&turboUse(dt,true))want=TURBO.fly;
  FL.vh+=clamp(want-FL.vh,-(mag>0?FLY.dec:FLY.brake)*dt*(FL.vh>FLY.boost+0.5?2.5:1),(TURBO.on?9:FLY.acc)*dt);   // sin joystick frena antes
  const px=S.pos.x,pz=S.pos.z,py=S.y;
  _fp.x=px+Math.sin(S.yaw)*FL.vh*dt;_fp.z=pz+Math.cos(S.yaw)*FL.vh*dt;_fp.y=py+FL.vy*dt;
  // suelo: aterrizar, rebotar en el agua o en sitios donde no se puede
  const G=fGround(_fp.x,_fp.z,py),surf=G.water!==null?G.water:G.g;
  if(_fp.y<=surf&&FL.vy<=0&&FL.age>0.45){
    if(G.water!==null){_fp.y=surf;FL.vy=2.6;emit('drop',_fp.x,0,_fp.z,10,{sp:1.4,up:1.1,size:1.3});emit('ring',_fp.x,0,_fp.z,1,{size:1.1});emit('ring',_fp.x,0,_fp.z,1,{size:1.8,life:1.2});
      if(S.t-FL.msgT>3){FL.msgT=S.t;toast('A l\'escombra no li agrada mullar-se!',1800);}}
    else if(landable(_fp.x,_fp.z,G.g)){land(_fp.x,_fp.z,G.g);return;}
    else{_fp.y=surf;FL.vy=1.8;if(S.t-FL.msgT>3){FL.msgT=S.t;toast('Aquí no es pot aterrar',1600);}}
  }
  fSolids(_fp,px,pz,py);
  S.pos.x=_fp.x;S.pos.z=_fp.z;S.y=_fp.y;
  mode=inTowerZone(S.pos.x,S.pos.z,S.y)?'tower':'forest';
  S.speed=FL.vh;S.vy=FL.vy;S.air=true;S.turn=FL.turn;S.depth=0;S.surf='air';
  // actitud: morro según sube/baja, inclinación en los giros
  FL.pitch+=((-FL.vy*0.07+Math.min(FL.vh,8)*0.012)-FL.pitch)*(1-Math.exp(-dt*4));
  FL.roll+=((-FL.turn*0.32*Math.min(1,FL.vh/4))-FL.roll)*(1-Math.exp(-dt*4));
  // la cámara se coloca poco a poco detrás si no la estás girando
  if(mag>0&&S.t-FL.dragT>1.4)cam.yaw+=wrapA(S.yaw+Math.PI-cam.yaw)*(1-Math.exp(-dt*1.1));
  // estela de chispas
  FL.sparkT-=dt;if(FL.sparkT<0){FL.sparkT=0.045;tv.set(0,0.42,-0.75);B.root.localToWorld(tv);emit('dust',tv.x,tv.y,tv.z,1,{sp:0.25,size:0.05+0.01*FL.vh,color:pick(['#e6c8ff','#ffd6f0','#c8e8ff','#fff3b0'])});}
}
function land(x,z,g){
  const sp=-FL.vy,imp=sat((sp-1.2)/2.6);
  S.pos.x=x;S.pos.z=z;S.y=g;S.speed=Math.min(FL.vh,RUN);
  endFlight();
  mode=inTowerZone(x,z,g)?'tower':'forest';
  SP.squat.v+=1.2+2.5*imp;FL.landT=S.t;
  const s=mode==='tower'?'stone':surfForest(x,z);burst(s==='water'?'grass':s,x,g,z,1);emit('dust',x,g+0.03,z,6,{sp:1.4,size:0.1,color:DUSTC});
  if(sp<1.6)toast('Aterratge perfecte!',1600);
  else if(sp>3.3){toast(FL.hardN++<2?'Uf! Per aterrar suau, prem una mica just abans de tocar a terra':'Uf! Aterratge mogudet',FL.hardN<3?3600:1500);}
  else toast('Aterratge!',1400);
}
/* ---------- postura encima de la escoba ---------- */
function flightLegs(F){
  const k=FL.k,t=S.t;
  for(let i=0;i<2;i++){const s=i?-1:1,sw=Math.sin(t*2.2+i*1.7)*0.025+FL.vh*0.004;
    F[i].x=lerp(F[i].x,s*0.12,k);F[i].y=lerp(F[i].y,0.14+AH+sw,k);F[i].z=lerp(F[i].z,0.12-FL.vh*0.008,k);F[i].p=lerp(F[i].p,0.7,k);}
}
function flightArms(tg){
  const k=FL.k;if(k<0.01)return;
  const q={aL:-0.98,aR:-0.98,zL:0.18,zR:-0.18,eL:-0.55,eR:-0.55,hx:-0.1-clamp(FL.vy*0.05,-0.2,0.2),hy:clamp(FL.turn*0.25,-0.5,0.5),hz:0};
  for(const n in q)tg[n]=lerp(tg[n],q[n],k);
}
function flightBody(dt){
  FL.k+=((FL.on?1:0)-FL.k)*(1-Math.exp(-dt*7));
  B.root.rotation.order='YXZ';B.root.rotation.x=FL.pitch*FL.k;B.root.rotation.z=FL.roll*FL.k;
  if(FL.k>0.01){const w=FL.k*clamp(FL.vh*0.1,0,0.95);B.hairB.rotation.x+=w+Math.sin(S.t*13)*0.04*w;B.hairS[0].rotation.x+=w*0.8;B.hairS[1].rotation.x+=w*0.85;B.skirt.rotation.x-=w*0.25+Math.sin(S.t*17)*0.03*w;}
  // escoba en el soporte: flota y brilla un poco
  B.root.updateMatrixWorld(true);
  if(FL.state==='stand'){const p=BROOM_STAND();broom.g.position.y=p.y+0.92+Math.sin(S.t*2)*0.05;broom.g.rotation.y=S.t*0.4;}
  // el conejo, montado en las cerdas
  if(BN.riding){tv.set(0,0.47,-0.5);B.root.localToWorld(tv);BN.root.position.copy(tv);BN.root.rotation.set(B.root.rotation.x,S.yaw,B.root.rotation.z);
    BN.ears.forEach((e,i)=>{e.p.rotation.x=-1.0-FL.vh*0.05+Math.sin(S.t*14+i)*0.08;});BN.hind.forEach(h=>{h.g.rotation.x=0.3;h.f.rotation.x=0;});BN.fore.forEach(f=>f.rotation.x=-0.5);BN.body.rotation.x=0.1;BN.rig.scale.set(1,1,1);}
}
canvas.addEventListener('pointermove',()=>{FL.dragT=S.t;});

/* ---------- modo prueba de vuelo: empezar en la terraza y panel de ajustes ----------
   En el juego completo: FLIGHT_TEST=false y la escoba solo aparece a partir del nivel 4. */
const FLIGHT_TEST=DEMO==='vuelo';
if(FLIGHT_TEST){
S.pos.set(OX-1.1,0,OZ+5.3);S.y=OY+L(3);S.yaw=S.tyaw=Math.atan2(BROOM_STAND().x-S.pos.x,BROOM_STAND().z-S.pos.z);
cam.yaw=Math.atan2(S.pos.x-BROOM_STAND().x,S.pos.z-BROOM_STAND().z)-0.45;cam.pitch=0.42;camT.set(S.pos.x,S.y+0.72,S.pos.z);
setTimeout(()=>toast(matchMedia('(pointer:coarse)').matches?'Agafa l\'escombra i salta des de la vora':'E: agafar l\'escombra · Espai a la vora: saltar',6000),400);
// panel para probar sensaciones: los valores se aplican al momento
const SL=[['Pujada','up',1,7,0.1,'m/s'],['Caiguda','down',1,8,0.1,'m/s'],['Reacció','acc',2,14,0.5,''],['Velocitat','speed',3,14,0.5,'m/s']];
const css=document.createElement('style');css.textContent='#fbtn{left:calc(env(safe-area-inset-left) + 12px);top:calc(env(safe-area-inset-top) + 96px);border:0;border-radius:999px;background:rgba(255,255,255,.22);color:#fff;font:600 11px system-ui;padding:5px 10px;cursor:pointer}#fpan{left:calc(env(safe-area-inset-left) + 12px);top:calc(env(safe-area-inset-top) + 124px);display:none;width:210px;background:rgba(30,20,40,.78);color:#fff;border-radius:14px;padding:10px 12px;font:600 11px system-ui}#fpan.on{display:block}#fpan label{display:flex;justify-content:space-between;margin-top:6px}#fpan input{width:100%;accent-color:#ff8fa0}#fpan p{margin:8px 0 0;font-weight:400;opacity:.75;line-height:1.35}';document.head.appendChild(css);
const fb=document.createElement('button');fb.id='fbtn';fb.className='ui';fb.textContent='⚙ Ajustos de vol';document.body.appendChild(fb);
const fp=document.createElement('div');fp.id='fpan';fp.className='ui';document.body.appendChild(fp);
const getV=k=>k==='acc'?FLY.accUp:k==='down'?-FLY.down:FLY[k],setV=(k,v)=>{if(k==='acc'){FLY.accUp=v;FLY.accDown=v*0.92;}else if(k==='down')FLY.down=-v;else{FLY[k]=v;if(k==='speed')FLY.boost=v*1.43;}};
fp.innerHTML=SL.map(([n,k,a,b,st,u])=>'<label>'+n+'<span id="fv_'+k+'"></span></label><input type="range" min="'+a+'" max="'+b+'" step="'+st+'" data-k="'+k+'" data-u="'+u+'">').join('')+'<p>Pujada i caiguda: a quina velocitat puja amb Espai premut i baixa en deixar-lo anar. Reacció: com de ràpid canvia d\'una a l\'altra (més baix = més pesada i difícil).</p>';
fp.querySelectorAll('input').forEach(i=>{const k=i.dataset.k,show=()=>{$('fv_'+k).textContent=(+i.value).toFixed(1)+' '+i.dataset.u;};i.value=getV(k);show();
  i.addEventListener('input',()=>{setV(k,+i.value);show();});i.addEventListener('change',()=>i.blur());i.addEventListener('pointerdown',e=>e.stopPropagation());});
fb.addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();fp.classList.toggle('on');});
fp.addEventListener('pointerdown',e=>e.stopPropagation());
}
