/* =====================================================================
   EL CONEJO — sigue a Bruna a saltitos
   ===================================================================== */
const bowTex2=canvasTex(64,64,(g,w,h)=>{g.fillStyle='#e0484c';g.fillRect(0,0,w,h);g.fillStyle='#5a1f2c';[[16,16],[48,48],[48,-4],[-4,48],[16,48+16],[48+16,16]].forEach(([x,y])=>{g.beginPath();g.arc(x,y,8,0,7);g.fill();});},1,1);
function buildBunny(){
  const mB=LM('#c99055'),mBL=LM('#f0dcb8'),mBD=LM('#b47c47'),mIn=LM('#f2a69c'),mNose=LM('#d9787c'),mEye=LM('#1a1213'),mG=LM('#ffffff',{emissive:'#ffffff',emissiveIntensity:0.5}),mBow=LM('#ffffff',{map:bowTex2}),
    mCheek=new THREE.MeshBasicMaterial({color:'#e88a7a',transparent:true,opacity:0.5,depthWrite:false});
  const root=new THREE.Group(),rig=new THREE.Group();root.add(rig);
  const body=new THREE.Group();body.position.y=0.16;rig.add(body);
  mk(SPH(1,20,14),mB,0,0,-0.01,body).scale.set(0.15,0.14,0.18);
  mk(SPH(1,14,10),mBL,0,-0.02,0.1,body).scale.set(0.09,0.1,0.07);
  const tail=mk(SPH(0.06,12,8),mBL,0,0.02,-0.18,body);
  const head=new THREE.Group();head.position.set(0,0.13,0.11);body.add(head);
  mk(SPH(1,20,14),mB,0,0,0,head).scale.set(0.125,0.115,0.115);
  mk(SPH(1,14,10),mBL,0,-0.04,0.085,head).scale.set(0.06,0.045,0.04);
  const nose=mk(SPH(1,10,8),mNose,0,-0.018,0.112,head);nose.scale.set(0.017,0.012,0.012);
  [1,-1].forEach(s=>{const e=mk(SPH(1,12,10),mEye,s*0.06,0.02,0.088,head);e.scale.set(0.022,0.028,0.015);mk(SPH(0.007,6,5),mG,s*0.06+0.006,0.03,0.103,head);
    const c=new THREE.Mesh(new THREE.CircleGeometry(0.022,12),mCheek);c.position.set(s*0.085,-0.03,0.08);c.rotation.y=s*0.7;head.add(c);});
  const ears=[1,-1].map(s=>{const g=new THREE.Group();g.position.set(s*0.05,0.09,-0.02);head.add(g);
    const p=new THREE.Group();g.add(p);mk(SPH(1,14,10),mB,0,0.14,0,p).scale.set(0.038,0.15,0.022);mk(SPH(1,12,8),mIn,0,0.14,0.014,p).scale.set(0.024,0.12,0.01);
    g.rotation.z=-s*0.16;return {g,p,s};});
  // lacito de lunares en la oreja izquierda
  {const bg=new THREE.Group();bg.position.set(0,0.05,0.02);bg.rotation.z=0.25;ears[0].p.add(bg);
   [1,-1].forEach(s=>{const w=mk(SPH(1,12,10),mBow,s*0.04,0,0,bg);w.scale.set(0.045,0.032,0.018);w.rotation.z=s*0.4;});mk(SPH(0.016,10,8),mBow,0,0,0.006,bg);}
  const fore=[1,-1].map(s=>{const g=new THREE.Group();g.position.set(s*0.055,-0.05,0.1);body.add(g);mk(SPH(1,10,8),mB,0,-0.05,0,g).scale.set(0.03,0.06,0.03);mk(SPH(1,10,8),mBL,0,-0.1,0.01,g).scale.set(0.032,0.022,0.04);return g;});
  const hind=[1,-1].map(s=>{const g=new THREE.Group();g.position.set(s*0.085,-0.04,-0.06);body.add(g);mk(SPH(1,12,10),mB,0,0,0,g).scale.set(0.06,0.075,0.08);
    const f=new THREE.Group();f.position.set(0,-0.07,0.02);g.add(f);mk(SPH(1,10,8),mBD,0,-0.03,0.04,f).scale.set(0.04,0.025,0.085);return {g,f};});
  root.traverse(o=>{if(o.isMesh&&o.material!==mCheek)o.castShadow=true;});
  return {root,rig,body,head,ears,fore,hind,tail,nose};
}
const BN=Object.assign(buildBunny(),{x:0,y:0,z:0,yaw:0,v:0,ph:0,gy:0,lastG:0,onLift:false,landed:true,pit:spring(70,11),sq:spring(160,13),eL:spring(60,6),eR:spring(55,6.5),look:0,twT:2,tw:0});
BN.root.scale.setScalar(1.15);scene.add(BN.root);
const trail=[],FOLLOW=1.05;let lastSx=0,lastSz=0;
function bunnyReset(){const bx=S.pos.x-Math.sin(S.yaw)*1.2,bz=S.pos.z-Math.cos(S.yaw)*1.2;BN.x=bx;BN.z=bz;BN.gy=BN.y=bGround(bx,bz,S.y+0.3);BN.yaw=S.yaw;BN.v=0;trail.length=0;trail.push({x:bx,y:BN.gy,z:bz},{x:S.pos.x,y:S.y,z:S.pos.z});}
function bGround(x,z,y){
  if(Math.hypot(x-OX,z-OZ)<CLEAR){if(lift.riding&&BN.onLift)return OY+lift.y;return OY+groundAt(x-OX,z-OZ,y-OY);}
  return Math.max(gY(x,z),waterAt(x,z)-0.04);
}
function bunnyStep(dt){
  if(BN.riding||FL.on||FL.phase)return;                                       // en la escoba lo coloca 45_vuelo.js
  const t=S.t;
  // ¿teletransporte o salto brusco? colocar el conejo detrás de Bruna
  if(Math.hypot(S.pos.x-lastSx,S.pos.z-lastSz)>2.5||!trail.length)bunnyReset();
  lastSx=S.pos.x;lastSz=S.pos.z;
  if(!S.air)BN.lastG=S.y;
  // ascensor: se sube con ella
  if(lift.riding){
    if(!BN.onLift){const l=toLoc(BN.x,BN.z,BN.gy);if(Math.hypot(l.x-LX,l.z-LZ)<6&&Math.abs(l.y-lift.y)<1.5){BN.onLift=true;const p=[LX+0.95,LZ+0.8];BN.x=p[0]+OX;BN.z=p[1]+OZ;}}
    trail.length=0;
  }else if(BN.onLift){BN.onLift=false;trail.length=0;}
  const lst=trail[trail.length-1];
  if(!lst||Math.hypot(S.pos.x-lst.x,S.pos.z-lst.z)>0.12){trail.push({x:S.pos.x,y:BN.lastG,z:S.pos.z});if(trail.length>500)trail.shift();}
  // punto objetivo: sobre el rastro, FOLLOW metros detrás de Bruna
  let need=FOLLOW,tx=S.pos.x,tz=S.pos.z,ty=BN.lastG;
  for(let i=trail.length-1;i>0;i--){const a=trail[i],b=trail[i-1],d=Math.hypot(a.x-b.x,a.z-b.z);if(d>=need){const k=need/d;tx=a.x+(b.x-a.x)*k;tz=a.z+(b.z-a.z)*k;ty=a.y+(b.y-a.y)*k;need=0;break;}need-=d;tx=b.x;tz=b.z;ty=b.y;}
  // si se ha quedado muy lejos (p. ej. tras el ascensor), aparece detrás
  if(Math.hypot(tx-BN.x,tz-BN.z)>9)bunnyReset();
  const dx=tx-BN.x,dz=tz-BN.z,dist=Math.hypot(dx,dz),dB=Math.hypot(S.pos.x-BN.x,S.pos.z-BN.z);
  let want=BN.onLift?0:(dist>0.2?clamp(dist*2.8,0,dist>2.5?8.5:5.0):0);if(dB<0.8)want=0;
  BN.v+=clamp(want-BN.v,-7*dt,4.5*dt);if(BN.v<0.02&&want===0)BN.v=0;
  // fase de salto
  const prevPh=BN.ph,hopF=1.7+BN.v*0.55;
  if(BN.v>0.12||BN.ph%1>0.001)BN.ph+=dt*hopF;
  if(BN.v<=0.12&&Math.floor(BN.ph)!==Math.floor(prevPh))BN.ph=Math.floor(BN.ph);
  const u=BN.ph%1,fl=clamp((u-0.08)/0.84,0,1),inAir=u>0.08&&u<0.92,hopK=Math.sin(Math.PI*fl);
  // avance (más rápido en el aire, como un salto de verdad)
  if(dist>1e-3){const step=Math.min(dist,BN.v*dt*(0.3+1.1*hopK));BN.x+=dx/dist*step;BN.z+=dz/dist*step;}
  // orientación
  const ty2=BN.v>0.15?Math.atan2(dx,dz):Math.atan2(S.pos.x-BN.x,S.pos.z-BN.z);
  BN.yaw+=wrapA(ty2-BN.yaw)*(1-Math.exp(-dt*(BN.v>0.15?9:2.2)));
  // suelo
  const g=bGround(BN.x,BN.z,Math.max(BN.gy,ty)+0.15);BN.gy+=(g-BN.gy)*(1-Math.exp(-dt*(BN.onLift?30:14)));
  const H=Math.min(0.26,0.06+0.045*BN.v),hy=H*Math.pow(hopK,0.85);
  // aterrizaje: aplastarse un poco y polvo/salpicadura
  if(inAir)BN.landed=false;else if(!BN.landed){BN.landed=true;BN.sq.v+=0.9+BN.v*0.35;const inWater=waterAt(BN.x,BN.z)>gY(BN.x,BN.z)+0.03;
    if(inWater){emit('drop',BN.x,0,BN.z,4,{sp:0.7,up:0.6,size:0.8});emit('ring',BN.x,0,BN.z,1,{size:0.45});}else if(BN.v>2.2)emit('dust',BN.x,BN.gy+0.03,BN.z,2,{sp:0.5,size:0.06,color:DUSTC});}
  const sq=stepS(BN.sq,0,dt);
  BN.y=BN.gy;BN.root.position.set(BN.x,BN.gy+hy,BN.z);BN.root.rotation.y=BN.yaw;
  const st=1+0.12*hopK*(BN.v>0.12?1:0)-clamp(sq,-0.1,0.25);BN.rig.scale.set(1/Math.sqrt(st),st,1/Math.sqrt(st));
  // inclinación: morro arriba al despegar, abajo al caer
  const pit=stepS(BN.pit,BN.v>0.12?-0.3*Math.cos(Math.PI*fl)*Math.min(1,BN.v/1.5):0,dt);BN.body.rotation.x=pit;
  BN.hind.forEach(h=>{h.g.rotation.x=inAir?-0.9*Math.sin(Math.PI*Math.min(1,fl*1.3)):0;h.f.rotation.x=inAir?0.5*hopK:0;});
  BN.fore.forEach((f,i)=>{f.rotation.x=inAir?(fl<0.5?0.7*hopK:-0.6*hopK):(BN.v<0.1?Math.max(0,Math.sin(t*1.3+i))*0.06:0);});
  // orejas con muelle (se quedan atrás al saltar y rebotan al aterrizar)
  const vy=H*Math.PI*hopF*Math.cos(Math.PI*fl)*(inAir?1:0);
  BN.twT-=dt;if(BN.twT<0){BN.twT=rr(1.5,4);BN.tw=R()<0.5?0:1;BN.eL.v+=BN.tw?0:2.5;BN.eR.v+=BN.tw?2.5:0;}
  const eb=-0.22-BN.v*0.06-clamp(vy*0.25,-0.35,0.35);
  BN.ears[0].p.rotation.x=stepS(BN.eL,eb,dt);BN.ears[1].p.rotation.x=stepS(BN.eR,eb*1.05,dt);
  BN.ears[0].g.rotation.z=-0.16-Math.max(0,BN.eL.x+0.2)*0.2;BN.ears[1].g.rotation.z=0.16+Math.max(0,BN.eR.x+0.2)*0.2;
  // cabeza: mira a Bruna cuando está quieto; olisquea
  const la=BN.v<0.2?clamp(wrapA(Math.atan2(S.pos.x-BN.x,S.pos.z-BN.z)-BN.yaw),-0.8,0.8):0;BN.look+=(la-BN.look)*(1-Math.exp(-dt*5));
  BN.head.rotation.set(-pit*0.6+(BN.v<0.2?Math.sin(t*0.7)*0.06:0),BN.look,0);
  BN.nose.scale.y=0.012*(1+0.35*Math.max(0,Math.sin(t*14))*(BN.v<0.2?1:0));
  BN.tail.scale.setScalar(1+0.12*Math.sin(t*9)*(BN.v>0.2?1:0.3));
  const br=1+Math.sin(t*3.1)*0.015;BN.body.scale.set(br,br,1);
}
