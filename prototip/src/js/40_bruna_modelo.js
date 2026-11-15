/* =====================================================================
   BRUNA — modelo nuevo (formas suaves, sombreado blando)
   ===================================================================== */
const L1=0.22,L2=0.22,AH=0.065,HIPW=0.082,STAND=0.488,UA=0.14,FA=0.13;
const cyl=(a,b,h,n)=>new THREE.CylinderGeometry(a,b,h,n||14,1);
function buildBruna(){
  const mSkin=LM('#b9764e'),mSkinD=LM('#a5633f'),mHair=LM('#3a2628',{side:THREE.DoubleSide}),mWhite=LM('#fffdf6',{emissive:'#fffdf6',emissiveIntensity:0.25}),mBlack=LM('#1a1213'),
    mMouth=LM('#7a342b'),mCheek=new THREE.MeshBasicMaterial({color:'#d5765c',transparent:true,opacity:0.55,depthWrite:false}),
    mDress=LM('#ffffff',{map:dotsTex,side:THREE.DoubleSide}),mDressT=LM('#ffffff',{map:canvasTex(128,128,(g,w,h)=>{g.fillStyle='#e8506a';g.fillRect(0,0,w,h);g.fillStyle='#3a2a3f';[[0,96],[128,96],[64,96],[32,32],[96,32]].forEach(([x,y])=>{g.beginPath();g.arc(x,y,13,0,7);g.fill();});},4,1.2)}),
    mShirt=LM('#ffffff',{map:stripe(5)}),mSleeve=LM('#ffffff',{map:stripe(2.5)}),mBow=LM('#6b2234'),mLeg=LM('#333a55'),mShoe=LM('#34303f'),mSole=LM('#b79aa6'),
    mPack=LM('#6f6e3c'),mPackL=LM('#807e48'),mPackD=LM('#5c5a30'),
    mBrace=LM('#ffffff',{map:canvasTex(64,4,(g,w,h)=>{['#e8443a','#f59a23','#f6d93a','#4fbf5a','#3f8fe0','#a45fd0'].forEach((c,i)=>{g.fillStyle=c;g.fillRect(i*w/6,0,w/6+1,h);});},2,1)});
  const root=new THREE.Group();
  // --- piernas (IK) ---
  const leg=s=>{
    const hip=new THREE.Group();hip.rotation.order='ZXY';root.add(hip);
    mk(SPH(0.068,14,10),mLeg,0,0,0,hip);mk(cyl(0.066,0.056,L1),mLeg,0,-L1/2,0,hip);
    const knee=new THREE.Group();knee.position.y=-L1;hip.add(knee);
    mk(SPH(0.056,14,10),mLeg,0,0,0,knee);mk(cyl(0.056,0.05,0.085),mLeg,0,-0.042,0,knee);mk(cyl(0.047,0.04,L2-0.08),mSkin,0,-0.08-(L2-0.08)/2,0,knee);
    const foot=new THREE.Group();foot.position.y=-L2;knee.add(foot);
    mk(SPH(0.042,12,8),mSkin,0,0,0,foot);
    mk(RBox(0.108,0.074,0.2,0.034),mShoe,0,-0.022,0.042,foot);mk(RBox(0.114,0.026,0.208,0.012),mSole,0,-0.052,0.042,foot);
    return {hip,knee,foot,s,contact:true,fx:0,fz:0,pp:0};
  };
  const legL=leg(1),legR=leg(-1);
  // --- pelvis, falda, pecho ---
  const pelvis=new THREE.Group();root.add(pelvis);
  mk(SPH(0.105,16,12),mLeg,0,0.0,0,pelvis).scale.set(1.05,0.8,0.95);
  const skirt=new THREE.Group();skirt.position.y=0.1;pelvis.add(skirt);
  const sk=mk(new THREE.LatheGeometry([[0.112,0.02],[0.128,-0.04],[0.158,-0.14],[0.19,-0.24],[0.212,-0.305]].map(p=>new THREE.Vector2(p[0],p[1])),28),mDress,0,0,0,skirt);
  const chest=new THREE.Group();chest.position.y=0.1;pelvis.add(chest);
  mk(cyl(0.106,0.116,0.14,20),mDressT,0,0.065,0,chest).scale.z=0.86;
  mk(cyl(0.092,0.106,0.085,20),mShirt,0,0.175,0,chest).scale.z=0.84;
  mk(SPH(0.1,18,12),mShirt,0,0.205,0,chest).scale.set(1.28,0.42,0.84);
  const mPink=LM('#e8506a');mk(RBox(0.12,0.1,0.03,0.014),mPink,0,0.15,0.083,chest);
  [1,-1].forEach(s=>{const st=mk(RBox(0.026,0.11,0.02,0.008),mPink,s*0.052,0.215,0.066,chest);st.rotation.x=-0.5;});
  [1,-1].forEach(s=>{const b=mk(new THREE.ConeGeometry(0.03,0.055,6),mBow,s*0.028,0.185,0.102,chest);b.rotation.z=s*PI/2;b.scale.z=0.55;});mk(SPH(0.016,8,6),mBow,0,0.185,0.104,chest);
  mk(cyl(0.044,0.05,0.07,12),mSkin,0,0.255,0,chest);
  // mochila (con muelle)
  const pack=new THREE.Group();pack.position.set(0,0.1,-0.15);chest.add(pack);
  mk(RBox(0.22,0.2,0.11,0.045),mPack,0,0,0,pack);mk(RBox(0.14,0.09,0.05,0.02),mPackL,0,-0.035,-0.062,pack);mk(RBox(0.15,0.035,0.055,0.014),mPackD,0,0.012,-0.064,pack);mk(RBox(0.2,0.05,0.1,0.02),mPackD,0,0.085,-0.004,pack);
  [1,-1].forEach(s=>{const a=mk(RBox(0.03,0.12,0.014,0.006),mPack,s*0.09,0.175,0.085,chest);a.rotation.x=-0.25;const t=mk(RBox(0.034,0.016,0.2,0.006),mPack,s*0.086,0.235,-0.01,chest);t.rotation.x=0.12;});
  // --- brazos ---
  const arm=s=>{
    const sh=new THREE.Group();sh.position.set(s*0.135,0.2,0);chest.add(sh);
    mk(SPH(0.052,12,8),mSleeve,0,0,0,sh);mk(cyl(0.052,0.05,0.075),mSleeve,0,-0.04,0,sh);mk(cyl(0.041,0.038,UA-0.05),mSkin,0,-0.05-(UA-0.05)/2,0,sh);
    const el=new THREE.Group();el.position.y=-UA;sh.add(el);
    mk(SPH(0.039,10,8),mSkin,0,0,0,el);mk(cyl(0.038,0.032,FA),mSkin,0,-FA/2,0,el);
    const hd=new THREE.Group();hd.position.y=-FA+0.006;hd.scale.setScalar(1.18);el.add(hd);
    mk(SPH(1,12,10),mSkin,0,-0.03,0.002,hd).scale.set(0.021,0.034,0.035);
    const fg=new THREE.Group();fg.position.set(0,-0.046,0);hd.add(fg);mk(SPH(1,12,10),mSkin,0,-0.024,-0.003,fg).scale.set(0.0175,0.034,0.031);fg.rotation.z=-s*0.3;
    const th=mk(SPH(1,10,8),mSkin,-s*0.012,-0.036,0.036,hd);th.scale.set(0.0125,0.029,0.0145);th.rotation.set(-0.85,0,s*0.5);
    if(s<0){const b=mk(new THREE.TorusGeometry(0.036,0.011,6,16),mBrace,0,-FA+0.015,0,el);b.rotation.x=PI/2;}
    return {sh,el,s,hd,fg};
  };
  const armL=arm(1),armR=arm(-1);
  // --- cabeza ---
  const head=new THREE.Group();head.position.y=0.45;chest.add(head);
  const hg=jawGeo(0.215,0.2,0.195,0.2,0.05),surf=surfFn(hg);
  mk(hg,mSkin,0,0,0,head);
  [1,-1].forEach(s=>{mk(SPH(0.036,10,8),mSkinD,s*0.212,-0.02,0,head).scale.set(0.45,1,0.8);});
  const eyes=[];
  [1,-1].forEach(s=>{
    const g=new THREE.Group();g.position.set(s*0.088,-0.004,surf(s*0.088,-0.004)-0.012);g.rotation.y=s*0.22;head.add(g);
    const w=mk(SPH(0.05,18,12),mWhite,0,0,0,g);w.scale.z=0.36;w.castShadow=false;
    const pu=mk(SPH(0.03,14,10),mBlack,-s*0.004,-0.002,0.014,g);pu.scale.z=0.4;pu.castShadow=false;
    mk(SPH(0.008,6,5),mWhite,0.01,0.012,0.026,g).castShadow=false;
    eyes.push(g);
    const br=mk(SPH(1,10,8),mHair,s*0.092,0.082,surf(s*0.092,0.082)+0.002,head);br.scale.set(0.042,0.011,0.012);br.rotation.set(0,s*0.25,-s*0.1);br.castShadow=false;
    const ck=new THREE.Mesh(new THREE.CircleGeometry(0.036,14),mCheek);ck.position.set(s*0.132,-0.07,surf(s*0.132,-0.07)+0.004);ck.rotation.y=s*0.6;ck.scale.y=0.72;head.add(ck);
  });
  const ns=mk(SPH(1,10,8),mSkinD,0,-0.048,surf(0,-0.048)+0.004,head);ns.scale.set(0.02,0.03,0.022);ns.castShadow=false;
  const mo=mk(new THREE.TorusGeometry(0.046,0.0075,6,14,PI*0.62),mMouth,0,-0.082,surf(0,-0.115)+0.003,head);mo.rotation.z=-PI/2-PI*0.31;mo.castShadow=false;
  // pelo
  mk(new THREE.SphereGeometry(1,28,14,0,TAU,0,1.22),mHair,0,0.022,-0.014,head).scale.set(0.236,0.218,0.226);
  [1,-1].forEach(s=>{const f=mk(SPH(1,14,10),mHair,s*0.124,0.128,0.094,head);f.scale.set(0.122,0.046,0.06);f.rotation.set(0.25,s*0.55,-s*0.62);
    const f2=mk(SPH(1,12,10),mHair,s*0.203,0.02,-0.005,head);f2.scale.set(0.045,0.14,0.1);f2.rotation.z=-s*0.1;});
  [[0.02,0.235,0.0,0.2],[-0.05,0.228,0.03,-0.5],[0.07,0.222,-0.03,0.7]].forEach(([x,y,z,a])=>{const c=mk(new THREE.ConeGeometry(0.014,0.06,5),mHair,x,y,z,head);c.rotation.z=-a;});
  const hairB=new THREE.Group();hairB.position.set(0,0.1,-0.1);head.add(hairB);
  mk(SPH(1,20,14),mHair,0,-0.2,-0.045,hairB).scale.set(0.25,0.27,0.125);
  for(let i=0;i<5;i++){const x=(i-2)*0.085,c=mk(new THREE.ConeGeometry(0.06,0.17,6),mHair,x,-0.47+Math.abs(i-2)*0.035,-0.05,hairB);c.rotation.x=PI;c.rotation.z=-(i-2)*0.12;c.scale.z=0.75;}
  const hairS=[1,-1].map(s=>{const g=new THREE.Group();g.position.set(s*0.19,0.03,-0.03);head.add(g);
    const a=mk(SPH(1,12,12),mHair,s*0.012,-0.2,0,g);a.scale.set(0.062,0.23,0.085);
    const c=mk(new THREE.ConeGeometry(0.05,0.13,6),mHair,s*0.02,-0.44,0.005,g);c.rotation.x=PI;c.scale.z=0.9;return g;});
  root.traverse(o=>{if(o.isMesh&&o.material!==mCheek&&o.castShadow!==false)o.castShadow=true;});
  return {root,legL,legR,pelvis,skirt,chest,pack,armL,armR,head,eyes,hairB,hairS};
}
const B=buildBruna();scene.add(B.root);

/* =====================================================================
   CONTROL Y ANIMACIÓN PROCEDURAL
   ===================================================================== */
const WALK=1.15,RUN=3.7,JUMPV=4.3;
const S={pos:new THREE.Vector3(-0.6,0,10.5),y:0,yaw:PI,tyaw:PI,turn:0,speed:0,acc:0,vy:0,air:false,prep:-1,ph:0,t:0,skid:0,blinkT:2,jumpHeld:false,jumpReq:false,surf:'grass',depth:0,wake:0,idleT:0};
S.y=landH(S.pos.x,S.pos.z);
const input={x:0,y:0},K={};
const cam={yaw:0.12,pitch:0.32,dist:5.8},camT=new THREE.Vector3(S.pos.x,S.y+0.8,S.pos.z);
const tv=new THREE.Vector3();
const spring=(k,c)=>({x:0,v:0,k,c});
const stepS=(s,target,dt)=>{s.v+=(-(s.x-target)*s.k-s.v*s.c)*dt;s.x+=s.v*dt;return s.x;};
const SP={squat:spring(110,15),hairB:spring(46,11),hairZ:spring(40,9.5),hairL:spring(42,10),hairR:spring(42,10.5),pack:spring(180,20),skirtX:spring(50,11),flare:spring(55,11),lean:spring(38,11),bank:spring(36,10)};
const P={};                      // pose amortiguada
let pelvisY=STAND,pelvisVy=0,lastPelvisW=0;

function resize(){const w=innerWidth,h=innerHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.fov=w/h<1?52:38;camera.updateProjectionMatrix();}
addEventListener('resize',resize);resize();
addEventListener('keydown',e=>{const k=e.key.toLowerCase();K[k]=true;if(k===' '){if(!e.repeat)S.jumpReq=true;S.jumpHeld=true;e.preventDefault();}if(k.startsWith('arrow'))e.preventDefault();});
addEventListener('keyup',e=>{const k=e.key.toLowerCase();K[k]=false;if(k===' ')S.jumpHeld=false;});
{const bj=$('bjump');bj.addEventListener('pointerdown',e=>{S.jumpReq=true;S.jumpHeld=true;bj.setPointerCapture(e.pointerId);e.preventDefault();});
 const up=()=>{S.jumpHeld=false;};bj.addEventListener('pointerup',up);bj.addEventListener('pointercancel',up);
 $('bwave').style.display='none';}
{const joy=$('joy'),knob=$('knob');let jid=null;const JR=50;
 const mv=e=>{const r=joy.getBoundingClientRect();let dx=e.clientX-(r.left+r.width/2),dy=e.clientY-(r.top+r.height/2);const l=Math.hypot(dx,dy);if(l>JR){dx*=JR/l;dy*=JR/l;}knob.style.transform='translate('+dx+'px,'+dy+'px)';input.x=dx/JR;input.y=-dy/JR;};
 joy.addEventListener('pointerdown',e=>{jid=e.pointerId;joy.setPointerCapture(jid);mv(e);$('hint').style.opacity=0;e.preventDefault();});
 joy.addEventListener('pointermove',e=>{if(e.pointerId===jid)mv(e);});
 const end=e=>{if(e.pointerId===jid){jid=null;knob.style.transform='';input.x=input.y=0;}};
 joy.addEventListener('pointerup',end);joy.addEventListener('pointercancel',end);}
{const ptrs=new Map();let pd=0;
 const dist2=()=>{const a=[...ptrs.values()];return Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y);};
 canvas.addEventListener('pointerdown',e=>{canvas.setPointerCapture(e.pointerId);ptrs.set(e.pointerId,{x:e.clientX,y:e.clientY});if(ptrs.size===2)pd=dist2();});
 canvas.addEventListener('pointermove',e=>{const p=ptrs.get(e.pointerId);if(!p)return;const dx=e.clientX-p.x,dy=e.clientY-p.y;p.x=e.clientX;p.y=e.clientY;
   if(ptrs.size===1){cam.yaw-=dx*0.0065;cam.pitch=clamp(cam.pitch+dy*0.005,0.03,1.3);}else if(ptrs.size===2){const d=dist2();if(pd>0)cam.dist=clamp(cam.dist*pd/d,1.4,16);pd=d;}});
 const up=e=>{ptrs.delete(e.pointerId);pd=0;};canvas.addEventListener('pointerup',up);canvas.addEventListener('pointercancel',up);
 canvas.addEventListener('wheel',e=>{cam.dist=clamp(cam.dist*(1+e.deltaY*0.001),1.4,16);e.preventDefault();},{passive:false});}
if(!matchMedia('(pointer:coarse)').matches)$('hint').textContent='WASD: caminar · Majúscules: córrer · Espai: saltar · E: portes, ascensor, accions';
setTimeout(()=>$('hint').style.opacity=0,9000);
