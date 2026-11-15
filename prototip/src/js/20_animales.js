/* =====================================================================
   ANIMALES
   ===================================================================== */
const mEyeB=TOON('#1b1420'),mEyeW=TOON('#fbfaf5');
/* ---------- unicornio ---------- */
const UNI={x:-2.6,z:-3.2,yaw:0.95};
const uni=(()=>{
  const g=new THREE.Group(),rig=new THREE.Group();g.add(rig);
  const mB=TOON('#e8efff',{},true),mB2=TOON('#cdd8fb',{},true),mHoof=TOON('#b39ce6',{},true),mMane=TOON('#f4a8de'),mMane2=TOON('#c9a4f4'),
    mHorn=new THREE.MeshBasicMaterial({color:'#8ff0ff'}),mHorn2=new THREE.MeshBasicMaterial({color:'#e6fdff'});
  const body=new THREE.Group();body.position.y=1.02;rig.add(body);
  mk(ico(1,1),mB,0,0,0,body).scale.set(0.43,0.44,0.88);
  mk(ico(1,1),mB,0,0.03,0.5,body).scale.set(0.4,0.46,0.42);
  mk(ico(1,1),mB2,0,-0.02,-0.5,body).scale.set(0.42,0.45,0.42);
  const legs=[];
  [[0.2,0.56],[-0.2,0.56],[0.2,-0.58],[-0.2,-0.58]].forEach(([x,z])=>{
    const hip=new THREE.Group();hip.position.set(x,0.95,z);rig.add(hip);
    mk(prismG(0.115,0.085,0.46),mB,0,-0.23,0,hip);
    const kn=new THREE.Group();kn.position.y=-0.46;hip.add(kn);
    mk(prismG(0.075,0.062,0.4),mB2,0,-0.2,0,kn);mk(prismG(0.07,0.09,0.1),mHoof,0,-0.44,0,kn);
    legs.push({hip,kn});});
  const neck=new THREE.Group();neck.position.set(0,1.2,0.72);rig.add(neck);
  mk(prismG(0.17,0.27,0.9),mB,0,0.4,0,neck);
  [[0.1,0],[0.3,1],[0.5,0],[0.7,1],[0.86,0]].forEach(([y,k],i)=>{const m=mk(SPH(1,10,8),k?mMane2:mMane,0,y,-0.2,neck);m.scale.set(0.11,0.2,0.16);m.rotation.x=-0.4;});
  const head=new THREE.Group();head.position.y=0.86;neck.add(head);
  mk(ico(1,1),mB,0,0,0.12,head).scale.set(0.17,0.19,0.3);
  mk(ico(1,1),mB2,0,-0.045,0.4,head).scale.set(0.115,0.12,0.16);
  [1,-1].forEach(s=>{mk(SPH(0.032,10,8),mEyeB,s*0.15,0.035,0.2,head).scale.x=0.5;
    const e=mk(new THREE.ConeGeometry(0.055,0.17,4),mB,s*0.11,0.21,-0.03,head);e.rotation.z=-s*0.3;
    mk(SPH(0.014,6,4),mHoof,s*0.05,-0.06,0.545,head);});
  const horn=mk(new THREE.ConeGeometry(0.05,0.5,6),mHorn,0,0.36,0.2,head);horn.rotation.x=0.5;horn.castShadow=false;
  mk(new THREE.ConeGeometry(0.022,0.5,6),mHorn2,0.012,0.365,0.215,head).rotation.x=0.5;
  const hornGlow=halo(head,0,0.5,0.28,0.9,'#8ff0ff',0.6);
  [[0,0.2,0.1,0],[0.07,0.12,0.02,1],[-0.07,0.13,-0.05,0]].forEach(([x,y,z,k])=>{const m=mk(SPH(1,10,8),k?mMane2:mMane,x,y,z,head);m.scale.set(0.09,0.09,0.15);});
  const tail=new THREE.Group();tail.position.set(0,1.2,-0.86);rig.add(tail);
  [[0,-0.2,-0.08,0.11,0.26,0],[0.02,-0.55,-0.1,0.1,0.26,1],[-0.01,-0.85,-0.06,0.07,0.2,0]].forEach(([x,y,z,w,h,k])=>{mk(SPH(1,10,8),k?mMane2:mMane,x,y,z,tail).scale.set(w,h,w);});
  g.position.set(UNI.x,landH(UNI.x,UNI.z),UNI.z);g.rotation.y=UNI.yaw;g.scale.setScalar(1.08);world.add(g);
  COL.push({x:UNI.x,z:UNI.z,r:0.72},{x:UNI.x+Math.sin(UNI.yaw)*0.75,z:UNI.z+Math.cos(UNI.yaw)*0.75,r:0.5},{x:UNI.x-Math.sin(UNI.yaw)*0.7,z:UNI.z-Math.cos(UNI.yaw)*0.7,r:0.5});
  return {g,rig,body,legs,neck,head,tail,hornGlow,nk:2.3,ny:0,happy:0,P:{}};
})();

/* ---------- conejos ---------- */
const rabbits=[];
function mkRabbit(x,z){
  const g=new THREE.Group(),rig=new THREE.Group();g.add(rig);
  mk(SPH(1,14,10),mRab,0,0.17,0,rig).scale.set(0.15,0.15,0.2);
  mk(SPH(1,10,8),mRabL,0,0.13,0.1,rig).scale.set(0.1,0.1,0.1);
  const head=new THREE.Group();head.position.set(0,0.33,0.13);rig.add(head);
  mk(SPH(0.115,14,10),mRab,0,0,0,head);
  mk(SPH(0.05,10,8),mRabL,0,-0.035,0.085,head).scale.set(1.2,0.8,0.8);mk(SPH(0.016,6,4),mNoseP,0,-0.015,0.125,head);
  const ears=[];
  [1,-1].forEach(s=>{mk(SPH(0.02,8,6),mEyeB,s*0.062,0.02,0.092,head);
    const e=new THREE.Group();e.position.set(s*0.05,0.09,-0.02);head.add(e);
    mk(SPH(1,10,8),mRab,0,0.13,0,e).scale.set(0.035,0.14,0.022);mk(SPH(1,8,6),mRabIn,0,0.13,0.013,e).scale.set(0.02,0.1,0.012);e.rotation.z=-s*0.15;ears.push(e);});
  mk(SPH(0.055,8,6),mRabL,0,0.16,-0.19,rig);
  [1,-1].forEach(s=>{mk(SPH(1,8,6),mRabD,s*0.1,0.05,-0.05,rig).scale.set(0.05,0.05,0.11);mk(SPH(1,8,6),mRabD,s*0.07,0.04,0.14,rig).scale.set(0.035,0.04,0.05);});
  g.position.set(x,landH(x,z),z);world.add(g);
  rabbits.push({g,rig,head,ears,hx:x,hz:z,x,z,yaw:rr(0,6),tx:x,tz:z,wait:rr(1,4),hop:0,flee:false});
}
mkRabbit(-6,-5.5);mkRabbit(-3.4,4.4);mkRabbit(6.5,-9.5);mkRabbit(-1.5,-24);

/* ---------- ranas ---------- */
const frogs=[];
function mkFrog(x,y,z,yaw,s,col,dark,belly,o){
  o=o||{};const g=new THREE.Group(),rig=new THREE.Group();g.add(rig);
  const mC=TOON(col),mD=TOON(dark),mBl=TOON(belly),mY=TOON('#f4c63a',{emissive:'#f4c63a',emissiveIntensity:0.25});
  const body=mk(SPH(1,14,10),mC,0,0.15,-0.02,rig);body.scale.set(0.2,0.155,0.23);body.rotation.x=-0.3;
  const throat=mk(SPH(1,12,8),mBl,0,0.1,0.11,rig);throat.scale.set(0.14,0.1,0.11);
  mk(SPH(1,12,8),mC,0,0.22,0.12,rig).scale.set(0.17,0.1,0.14);
  const n=o.eyes||2,ex=n===3?[-0.105,0,0.105]:[-0.08,0.08];
  ex.forEach((x,i)=>{mk(SPH(0.058,10,8),mC,x,0.295+(n===3&&i===1?0.02:0),0.13,rig);mk(SPH(0.046,10,8),mY,x,0.3+(n===3&&i===1?0.02:0),0.155,rig);mk(SPH(0.024,8,6),mEyeB,x,0.3+(n===3&&i===1?0.02:0),0.19,rig).scale.z=0.5;});
  [1,-1].forEach(sd=>{const l=mk(SPH(1,10,8),mD,sd*0.19,0.08,-0.08,rig);l.scale.set(0.075,0.075,0.16);l.rotation.y=sd*0.4;
    mk(SPH(1,8,6),mD,sd*0.24,0.025,0.05,rig).scale.set(0.05,0.022,0.09);
    mk(prismG(0.03,0.025,0.16),mD,sd*0.13,0.07,0.17,rig).rotation.x=0.25;mk(SPH(1,8,6),mD,sd*0.14,0.015,0.22,rig).scale.set(0.045,0.018,0.05);});
  if(o.spots)for(let i=0;i<6;i++){const a=rr(-2.4,2.4)+Math.PI,e=rr(0.2,1.1);mk(SPH(1,8,6),mD,Math.sin(a)*Math.cos(e)*0.19,0.17+Math.sin(e)*0.14,-0.03+Math.cos(a)*Math.cos(e)*0.2,rig).scale.set(0.035,0.02,0.035);}
  g.position.set(x,y,z);g.rotation.y=yaw;g.scale.setScalar(s);world.add(g);
  frogs.push({g,rig,throat,x,y,z,yaw,s,t:rr(2,7),j:0,shy:o.shy||0,st:'sit',st_t:0,away:0});
}
mkFrog(10.3,ROCK_W,8.2,-2.3,2.1,'#7fbf62','#5f9a50','#b9dc8a',{eyes:3});
mkFrog(4.9,ROCK_F,10.9,0.9,1.25,'#9a86e0','#6b56a8','#c7b8f2',{spots:true,shy:1.9});
mkFrog(6.0,WY+0.03,6.6,-1.2,1.0,'#f08a8e','#c8646e','#ffc0b8',{shy:3.3});
mkFrog(9.6,WY+0.03,3.4,-2.0,1.15,'#a892e2','#7a66b4','#e6c66a',{spots:true});
ripple(10.3,8.2,2.3,true);

/* ---------- bicho peludo del arbusto ---------- */
const furry=(()=>{
  const g=new THREE.Group(),mF=TOON('#7a4a2e',{},true),mF2=TOON('#946038',{},true);
  const geo=new THREE.IcosahedronGeometry(1,1),p=geo.attributes.position;for(let i=0;i<p.count;i+=1){const k=(Math.sin(p.getX(i)*17+p.getY(i)*23+p.getZ(i)*31)*0.5+0.5)*0.34+0.86;p.setXYZ(i,p.getX(i)*k,p.getY(i)*k,p.getZ(i)*k);}
  geo.computeVertexNormals();mk(geo,mF,0,0,0,g).scale.set(0.42,0.4,0.36);
  [[-0.14,0.04],[0,0.11],[0.14,0.04]].forEach(([x,y])=>{mk(SPH(0.075,10,8),mEyeW,x,y,0.3,g).scale.z=0.5;mk(SPH(0.04,8,6),mEyeB,x,y-0.005,0.335,g).scale.z=0.5;});
  mk(new THREE.TorusGeometry(0.04,0.01,6,10,Math.PI),mEyeB,0,-0.1,0.35,g).rotation.z=Math.PI;
  [1,-1].forEach(s=>{mk(SPH(1,8,6),mF2,s*0.3,-0.26,0.26,g).scale.set(0.1,0.07,0.1);const e=mk(new THREE.ConeGeometry(0.06,0.2,4),mF,s*0.2,0.36,0,g);e.rotation.z=-s*0.5;});
  const bx=BUSH.x-0.9,bz=BUSH.z+0.95;g.position.set(bx,0,bz);g.rotation.y=-0.5;world.add(g);
  return {g,x:bx,z:bz,y0:landH(bx,bz)+0.55,up:1};
})();

/* ---------- mariposas, pájaros, mariquitas ---------- */
const butterflies=[],birds=[],bugs=[];
{
  const wingG=new THREE.ShapeGeometry(new THREE.Shape([[0,0],[0.05,0.16],[0.2,0.2],[0.26,0.08],[0.16,-0.02],[0.2,-0.12],[0.08,-0.15]].map(p=>new THREE.Vector2(p[0],p[1]))));wingG.rotateX(-Math.PI/2);
  [[-10.5,2.8,-0.5,'#d9a8ff','#8a6fd0'],[6.5,3.2,-5.5,'#b9a4f2','#7f8ae0'],[13,3.0,-2,'#ff8fb0','#ffb36a'],[-3,2.2,7,'#ffd0f0','#c98ae8'],[1,2.6,-18,'#a8d8ff','#7f9ae0'],[9,1.6,9,'#ffe08a','#ff9f6a']].forEach(([x,y,z,c1,c2],i)=>{
    const g=new THREE.Group(),m1=new THREE.MeshBasicMaterial({color:c1,side:THREE.DoubleSide}),m2=new THREE.MeshBasicMaterial({color:c2});
    const b=new THREE.Mesh(SPH(1,6,5),m2);b.scale.set(0.022,0.022,0.11);g.add(b);
    const wl=new THREE.Group(),wr=new THREE.Group();wl.add(new THREE.Mesh(wingG,m1));const w2=new THREE.Mesh(wingG,m1);w2.scale.x=-1;wr.add(w2);g.add(wl);g.add(wr);
    g.scale.setScalar(1.5);world.add(g);butterflies.push({g,wl,wr,x,y,z,ph:i*1.7,px:x,pz:z});});
  const bw=new THREE.BufferGeometry();bw.setAttribute('position',new THREE.Float32BufferAttribute([0,0,0.18,0,0,-0.14,0.75,0,-0.05],3));
  const mBird=new THREE.MeshBasicMaterial({color:'#352f6e',side:THREE.DoubleSide});
  for(let i=0;i<5;i++){const g=new THREE.Group();const b=new THREE.Mesh(SPH(1,6,5),mBird);b.scale.set(0.09,0.08,0.3);g.add(b);
    const wl=new THREE.Group(),wr=new THREE.Group();wl.add(new THREE.Mesh(bw,mBird));const w2=new THREE.Mesh(bw,mBird);w2.scale.x=-1;wr.add(w2);g.add(wl);g.add(wr);
    world.add(g);birds.push({g,wl,wr,r:rr(9,22),h:rr(8.5,13),sp:rr(0.16,0.3)*(i%2?1:-1),ph:rr(0,6.28),cx:rr(-4,4),cz:rr(-14,0)});}
  const mLR=TOON('#e23b3b'),mLB=TOON('#2a2030');
  function ladybug(tr,t,ang){
    const g=new THREE.Group();mk(new THREE.SphereGeometry(1,10,6,0,6.283,0,1.57),mLR,0,0,0,g).scale.set(0.085,0.07,0.1);
    mk(SPH(0.04,8,6),mLB,0,0.015,0.09,g);[[0.04,0.045,0.02],[-0.04,0.045,0.02],[0.03,0.04,-0.05],[-0.03,0.04,-0.05]].forEach(([x,y,z])=>mk(SPH(0.016,6,4),mLB,x,y,z,g).scale.y=0.5);
    [1,-1].forEach(s=>{mk(prismG(0.004,0.004,0.07),mLB,s*0.02,0.05,0.12,g).rotation.set(0.9,0,-s*0.4);});
    g.scale.setScalar(1.7);world.add(g);bugs.push({g,tr,t,ang,ph:rr(0,6)});
  }
  ladybug(T1,0.42,0.6);ladybug(T1,0.62,1.2);ladybug(trees[2],0.5,-2.3);
}
/* ---------- corazones ---------- */
const heartTex=canvasTex(64,64,(g,w,h)=>{g.clearRect(0,0,w,h);g.fillStyle='#ff5f9a';g.beginPath();g.moveTo(32,56);g.bezierCurveTo(2,34,6,8,22,8);g.bezierCurveTo(28,8,32,13,32,18);g.bezierCurveTo(32,13,36,8,42,8);g.bezierCurveTo(58,8,62,34,32,56);g.fill();
  g.fillStyle='#ffc2dc';g.beginPath();g.arc(21,20,5,0,7);g.fill();},1,1);
const hearts=[];for(let i=0;i<8;i++){const s=new THREE.Sprite(new THREE.SpriteMaterial({map:heartTex,transparent:true,depthWrite:false,opacity:0}));s.visible=false;world.add(s);hearts.push({s,t:9,x:0,y:0,z:0,sw:0});}
function heart(x,y,z){const h=hearts.find(h=>h.t>1.5);if(!h)return;h.t=0;h.x=x;h.y=y;h.z=z;h.sw=rr(0,6);h.s.visible=true;}
