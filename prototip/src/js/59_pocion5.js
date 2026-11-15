/* =====================================================================
   POCIÓN 5 · LUMUS CONTROLARUM — la última del nivel 1
   - Pelo de unicornio: hierba picante en la nariz → estornudo → atrapar los pelos que vuelan.
   - Cueva del árbol gigante: tapada con tablas. Verlas, pedir ayuda al unicornio, que las rompe a coces.
     Dentro, setas luminosas (se cogen dos: ingrediente y cebo).
   - La cosa rara que brilla (luciérnaga): dejar la seta en el rincón tranquilo y quedarse quieta; tapar el bote.
   - Luciérnagas en un bote (junto al arbusto de bayas).
   - Cera de la vela: casa del árbol en el árbol gigante; las ramas no dejan llegar volando;
     plantar una semilla, «Pluja», trepar por la planta.
   - Final: certificado de bruja, aparece el Gato y la sigue. Conjuro «Llum».
   ===================================================================== */
const p5on=()=>PLAY&&GS.pot===4&&(GS.phase==='recoger'||GS.phase==='caldero');
const F5=GS.flags;
const uniPos=()=>uni.g.position;
const uniNear=r=>Math.hypot(S.pos.x-uniPos().x,S.pos.z-uniPos().z)<r;

/* ---------- herba picant y estornudo ---------- */
const SPICY=(()=>{const [x,z]=freeSpot(-6.8,-8.0,0.4),g=new THREE.Group();g.position.set(x,gY(x,z),z);world.add(g);
  for(let i=0;i<9;i++){const a=i*0.7,c=mk(new THREE.ConeGeometry(0.03,0.42+(i%3)*0.1,4),LM('#e2402a',{emissive:'#a02010',emissiveIntensity:0.3}),Math.sin(a)*0.12,0.22,Math.cos(a)*0.12,g);c.rotation.set(Math.sin(a)*0.3,0,Math.cos(a)*0.3);}
  g.scale.setScalar(1.4);return {g,x,z};})();
const handSpicy=new THREE.Group();{for(let i=0;i<4;i++){const c=mk(new THREE.ConeGeometry(0.015,0.2,4),LM('#e2402a'),(i-1.5)*0.02,0.06,0,handSpicy);c.rotation.z=(i-1.5)*0.2;}handSpicy.position.set(-0.14,0,0.26);handSpicy.visible=false;B.chest.add(handSpicy);}
const SNZ={st:null,t:0,hairs:[]};
TARGETS.peluni=v=>{if(!GS.spicy){v.set(SPICY.x,gY(SPICY.x,SPICY.z)+0.4,SPICY.z);return true;}v.copy(uniPos());v.y+=1;return true;};

/* ---------- la cueva tapada con tablas ---------- */
const CAVE={g:new THREE.Group(),box:null,boards:[],uni:null,t:0};
const PLANK_Z=GT.z+6.45;
function openCave(){if(CAVE.box){const i=BOXES.indexOf(CAVE.box);if(i>=0)BOXES.splice(i,1);CAVE.box=null;}CAVE.g.visible=false;F5.caveOpen=1;}
{const g=CAVE.g;g.position.set(GT.x,GT.y,PLANK_Z);world.add(g);const m=LM('#8a6a44'),m2=LM('#6b4a30');
 [[0.35,0,0.05],[1.0,0.12,-0.04],[1.65,-0.08,0.03],[2.3,0.1,0.0]].forEach(([y,r,z])=>{const b=mk(new THREE.BoxGeometry(TUN*2+0.5,0.42,0.1),m,0,y,z,g);b.rotation.z=r;b.castShadow=true;CAVE.boards.push({m:b,v:new THREE.Vector3(),w:0});});
 [-1,1].forEach(s=>{const b=mk(new THREE.BoxGeometry(0.12,2.8,0.12),m2,s*(TUN+0.1),1.3,0.1,g);CAVE.boards.push({m:b,v:new THREE.Vector3(),w:0});});
 [[-0.4,0.6],[0.5,1.5]].forEach(([x,y])=>mk(SPH(0.03,6,5),LM('#3a3540'),x,y,0.08,g));
 const n=BOXES.length;addBox(GT.x,PLANK_Z,0,TUN+0.3,0.25);CAVE.box=BOXES[n];
 if(F5.caveOpen)openCave();}
// setas luminosas dentro de la cueva
{const g=new THREE.Group();g.position.set(GT.x+1.3,GT.y,GT.z-0.9);world.add(g);const m=LM('#6fe0ff',{emissive:'#30c0ff',emissiveIntensity:0.9});
 [[0,0,1],[0.25,0.1,0.8]].forEach(([x,z,s])=>{mk(new THREE.CylinderGeometry(0.03,0.04,0.25,8),LM('#e8f6ff'),x,0.12*s,z,g).scale.setScalar(s);const c=mk(new THREE.SphereGeometry(0.13,12,8,0,TAU,0,PI/2),m,x,0.24*s,z,g);c.scale.set(s,s*0.7,s);});
 registerItem('bolet',g,{nobob:true,halo:1.0});if(GS.got.bolet||GS.done.includes(4))g.visible=false;}

/* ---------- la cosa rara que brilla ---------- */
const QUIET=(()=>{const [x,z]=freeSpot(-6.5,8.5,0.6);return {x,z,y:gY(x,z)};})();
const baitM=new THREE.Group();{const m=LM('#6fe0ff',{emissive:'#30c0ff',emissiveIntensity:0.9});mk(new THREE.CylinderGeometry(0.04,0.05,0.3,8),LM('#e8f6ff'),0,0.15,0,baitM);const c=mk(new THREE.SphereGeometry(0.16,12,8,0,TAU,0,PI/2),m,0,0.3,0,baitM);c.scale.y=0.7;
  halo(baitM,0,0.35,0,1.4,'#7fe8ff',0.5);baitM.position.set(QUIET.x,QUIET.y,QUIET.z);baitM.visible=false;world.add(baitM);}
const LL={g:new THREE.Group(),still:0,st:null,pos:new THREE.Vector3()};
{mk(SPH(0.07,12,10),new THREE.MeshBasicMaterial({color:'#e8fbff'}),0,0,0,LL.g);halo(LL.g,0,0,0,1.6,'#7fd8ff',0.8);LL.g.visible=false;world.add(LL.g);}
TARGETS.lluerna=v=>{if(GS.bait||F5.baitDown){v.set(QUIET.x,QUIET.y+0.5,QUIET.z);return true;}if(!F5.caveOpen){v.set(GT.x,GT.y+1,PLANK_Z+1);return true;}v.set(GT.x+1.3,GT.y+0.3,GT.z-0.9);return true;};

/* ---------- lluernes en un pot ---------- */
const FFLY=new THREE.Group();
{const p=FOODS.baya,[x,z]=freeSpot(p.x+1.8,p.z+0.8,0.4);FFLY.position.set(x,gY(x,z)+1.0,z);world.add(FFLY);const m=new THREE.MeshBasicMaterial({color:'#e0ff80'});
 for(let i=0;i<12;i++){const s=mk(SPH(0.03,6,5),m,0,0,0,FFLY);s.userData.i=i;}
 registerItem('llucioles',FFLY,{nobob:true,halo:1.3});if(GS.got.llucioles||GS.done.includes(4))FFLY.visible=false;}

/* ---------- la casa del árbol gigante (y fuera la antigua del árbol solitario) ---------- */
world.children.forEach(m=>{if(m.isMesh&&m.geometry){m.geometry.computeBoundingSphere();const c=m.geometry.boundingSphere.center;if(Math.hypot(c.x-TH.x,c.z-TH.z)<3.5&&m.geometry.boundingSphere.radius<9)m.visible=false;}});
const HOUSE={x:GT.x+6.6,z:GT.z+0.4,y:GT.y+12.0};
{const g=new THREE.Group();g.position.set(HOUSE.x,HOUSE.y,HOUSE.z);world.add(g);const w=LM('#7a5a44'),wd=LM('#5a4636'),pl=LM('#7d5f47');
 const p=mk(new THREE.CylinderGeometry(2.2,2.2,0.22,16),pl,0,0,0,g);p.castShadow=true;
 [-0.6,0.6].forEach(dz=>{const b=mk(new THREE.BoxGeometry(3.0,0.22,0.25),wd,-1.8,-0.1,dz,g);b.rotation.z=0.25;});
 const h=new THREE.Group();h.position.set(0.3,0.11,0);h.rotation.y=-PI/2;g.add(h);
 mk(new THREE.BoxGeometry(2.0,1.8,1.7),w,0,0.9,0,h).castShadow=true;mk(new THREE.BoxGeometry(0.55,1.1,0.04),LM('#1c1824'),0,0.6,0.86,h);
 [-1,1].forEach(s=>{const r=mk(new THREE.BoxGeometry(1.25,0.1,2.0),wd,s*0.55,2.05,0,h);r.rotation.z=-s*0.6;});
 const win=mk(new THREE.BoxGeometry(0.4,0.4,0.04),LM('#ffd890',{emissive:'#ffb040',emissiveIntensity:0.6}),0.6,1.1,0.86,h);
 for(let i=0;i<10;i++){const a=i/10*TAU;mk(new THREE.BoxGeometry(0.1,0.7,0.1),wd,Math.sin(a)*2.1,0.4,Math.cos(a)*2.1,g);}
 // ramas que cuelgan: no dejan llegar volando
 const lv=LM('#5d7a3a');for(let i=0;i<16;i++){const a=i/16*TAU,r=2.6+(i%3)*0.4,len=3+(i%4)*0.8,v=mk(new THREE.CylinderGeometry(0.03,0.05,len,5),LM('#5a4030'),Math.sin(a)*r,2.5-len/2,Math.cos(a)*r,g);
   for(let k=0;k<3;k++){const l=mk(SPH(1,8,6),lv,Math.sin(a)*r+0.08,2.5-len*(0.2+k*0.3),Math.cos(a)*r,g);l.scale.set(0.18,0.08,0.12);}}
 g.traverse(o=>{if(o.isMesh)o.castShadow=true;});}
const SOIL={x:GT.x+8.6,z:GT.z+1.6};SOIL.y=gY(SOIL.x,SOIL.z);
{const s=new THREE.Mesh(new THREE.CircleGeometry(0.8,18),LM('#5a3a26'));s.rotation.x=-PI/2;s.position.set(SOIL.x,SOIL.y+0.02,SOIL.z);world.add(s);}
const VINE={g:new THREE.Group(),grow:F5.grown?1:0,sprout:null};
{const g=VINE.g;g.position.set(SOIL.x,SOIL.y,SOIL.z);world.add(g);const h=HOUSE.y-SOIL.y+0.3;
 const st=mk(new THREE.CylinderGeometry(0.1,0.22,h,8),LM('#4f8a3a'),0,h/2,0,g);st.castShadow=true;
 for(let i=0;i<22;i++){const a=i*1.1,y=(i+0.5)/22*h,l=mk(SPH(1,8,6),LM(i%2?'#6fbf5a':'#5fa04a'),Math.sin(a)*0.35,y,Math.cos(a)*0.35,g);l.scale.set(0.35,0.08,0.22);l.rotation.y=a;}
 g.scale.set(1,Math.max(0.001,VINE.grow),1);g.visible=VINE.grow>0;
 VINE.sprout=new THREE.Group();mk(new THREE.CylinderGeometry(0.02,0.03,0.25,5),LM('#5fa04a'),0,0.12,0,VINE.sprout);[1,-1].forEach(s=>{const l=mk(SPH(1,8,6),LM('#6fbf5a'),s*0.07,0.24,0,VINE.sprout);l.scale.set(0.08,0.02,0.05);});
 VINE.sprout.position.set(SOIL.x,SOIL.y,SOIL.z);VINE.sprout.visible=!!F5.planted&&!F5.grown;world.add(VINE.sprout);}
TARGETS.cera=v=>{v.set(SOIL.x,SOIL.y+1,SOIL.z);return true;};
const CLIMB={st:null,t:0};

/* ---------- conjuro «Llum» y el gato ---------- */
const lightOrb=new THREE.Group();{mk(SPH(0.15,14,10),new THREE.MeshBasicMaterial({color:'#fffbe0'}),0,0,0,lightOrb);halo(lightOrb,0,0,0,2.6,'#fff3a0',0.8);lightOrb.visible=false;scene.add(lightOrb);}
const orbL=new THREE.PointLight('#fff0c0',0,14,1.3);scene.add(orbL);
const CAT={g:new THREE.Group(),x:0,y:0,z:0,yaw:0,on:false,tail:null};
{const g=CAT.g,c=LM('#4a4552'),cl=LM('#d8d4e0'),ey=LM('#ffd84a',{emissive:'#ffd84a',emissiveIntensity:0.5}),k=LM('#1a1213');
 mk(SPH(1,14,10),c,0,0.2,0,g).scale.set(0.13,0.13,0.22);mk(SPH(1,12,8),cl,0,0.18,0.12,g).scale.set(0.09,0.1,0.08);
 const hd=new THREE.Group();hd.position.set(0,0.36,0.17);g.add(hd);mk(SPH(0.11,14,10),c,0,0,0,hd);
 [1,-1].forEach(s=>{const e=mk(new THREE.ConeGeometry(0.045,0.09,4),c,s*0.065,0.1,0,hd);e.rotation.z=-s*0.25;mk(SPH(0.022,8,6),ey,s*0.042,0.015,0.095,hd);mk(SPH(0.01,6,5),k,s*0.042,0.015,0.11,hd);});
 const hat=new THREE.Group();hat.position.set(0.03,0.11,0);hat.rotation.z=-0.35;hd.add(hat);mk(new THREE.CylinderGeometry(0.08,0.08,0.012,14),LM('#2f2440'),0,0,0,hat);mk(new THREE.ConeGeometry(0.05,0.12,12),LM('#2f2440'),0,0.06,0,hat);mk(SPH(0.02,6,5),LM('#e0484c'),0.05,0.02,0.03,hat);
 [[0.06,0.06],[-0.06,0.06],[0.06,-0.12],[-0.06,-0.12]].forEach(([x,z])=>mk(new THREE.CylinderGeometry(0.025,0.025,0.14,6),c,x,0.07,z,g));
 const tail=new THREE.Group();tail.position.set(0,0.25,-0.2);g.add(tail);const t1=mk(new THREE.CylinderGeometry(0.02,0.025,0.22,6),c,0,0.1,-0.03,tail);t1.rotation.x=-0.5;const t2=mk(new THREE.CylinderGeometry(0.018,0.02,0.18,6),c,0,0.24,0.0,tail);t2.rotation.x=0.5;CAT.tail=tail;
 g.scale.setScalar(1.25);g.traverse(o=>{if(o.isMesh)o.castShadow=true;});g.visible=false;scene.add(g);}
function catAppear(){CAT.on=true;CAT.x=S.pos.x+1;CAT.z=S.pos.z;CAT.y=S.y;CAT.g.visible=true;for(let i=0;i<16;i++)emit('dust',CAT.x,CAT.y+0.3,CAT.z,1,{sp:1.5,size:0.08,color:pick(['#ffd84a','#c98aff','#fff3b0'])});}
REWARD.gat={w:new THREE.Group(),noWard:true,lab:'',wear(){}};
if(GS.clothes.includes('gat')){CAT.on=true;CAT.g.visible=true;CAT.x=S.pos.x+1;CAT.z=S.pos.z;CAT.y=S.y;}

/* ---------- certificado (final del nivel) ---------- */
let certOn=false;
function showCertificate(){certOn=true;const ov=$('ovMini');
  ov.innerHTML='<div id="cert"><div class="ct">'+TXT.certificado+'</div><p>'+TXT.certTxt+'</p><div class="seal">★</div><div class="fi">'+TXT.findeNivel+'</div><button id="certOk">D\'acord!</button></div>';ov.classList.add('on');sfx('success');
  $('certOk').addEventListener('click',()=>{ov.classList.remove('on');catAppear();toast(TXT.gatoLlega,3500);sfx('magic');finishReward();setTimeout(()=>{certOn=false;},500);});}
{const css=document.createElement('style');css.textContent='#cert{width:min(90vw,420px);background:#fbf3dc;border:6px double #b9975a;border-radius:14px;padding:22px 20px;text-align:center;font-family:"Bradley Hand","Segoe Print","Marker Felt","Comic Sans MS",cursive;color:#3f3530;box-shadow:0 14px 40px rgba(0,0,0,.6);animation:nb .5s ease-out}#cert .ct{font-size:28px;color:#5a2e1a;margin-bottom:10px}#cert p{font-size:18px;line-height:1.4;margin:0 0 12px}#cert .seal{font-size:46px;color:#e0484c}#cert .fi{font:800 14px system-ui;letter-spacing:1px;text-transform:uppercase;color:#8a2337;margin:8px 0 14px}#cert button{border:0;border-radius:14px;background:#8a2337;color:#fff;font:800 16px system-ui;padding:12px 26px;cursor:pointer}';document.head.appendChild(css);}

/* ---------- llums que suren al voltant del torreó (el que canvia en el món) ---------- */
const orbs=[];for(let i=0;i<14;i++){const g=new THREE.Group();halo(g,0,0,0,2.2,pick(['#fff3a0','#a0e8ff','#ffc0f0']),0.7);g.visible=false;world.add(g);orbs.push(g);}

/* ---------- acciones ---------- */
function p5Actions(){
  if(!p5on()||SNZ.st==='pre'||CLIMB.st||certOn)return null;
  if(mode!=='forest')return null;
  // unicornio
  if(uniNear(2.8)){const u=uniPos();ctxA.set(u.x,u.y+2.2,u.z);ctxCap=TXT.unicornio;
    if(SNZ.st==='pels')return ['pelos'];
    if(GS.spicy&&!GS.got.peluni&&!CAVE.uni)return ['nariz'];
    if(F5.sawPlanks&&!F5.caveOpen&&!CAVE.uni)return ['ayuda'];}
  if(!GS.spicy&&!GS.got.peluni&&Math.hypot(S.pos.x-SPICY.x,S.pos.z-SPICY.z)<1.6){ctxCap='Herba picant';ctxA.set(SPICY.x,gY(SPICY.x,SPICY.z)+1.2,SPICY.z);return ['picante'];}
  // cueva
  if(!F5.caveOpen&&Math.hypot(S.pos.x-GT.x,S.pos.z-(PLANK_Z+0.6))<2.8){ctxCap='Taules';ctxA.set(GT.x,GT.y+3.2,PLANK_Z);return [CAVE.uni&&CAVE.uni.st==='espera'?'romper':'tablas'];}
  // rincón tranquilo
  if(GS.bait&&!F5.baitDown&&Math.hypot(S.pos.x-QUIET.x,S.pos.z-QUIET.z)<2.2){ctxCap='Racó tranquil';ctxA.set(QUIET.x,QUIET.y+1.4,QUIET.z);return ['dejarBolet'];}
  if(LL.st==='posada'&&Math.hypot(S.pos.x-QUIET.x,S.pos.z-QUIET.z)<2.6){ctxCap=findIng('lluerna').nombre;ctxA.set(QUIET.x,QUIET.y+1.4,QUIET.z);return ['tapar'];}
  // casa del árbol
  if(!GS.got.cera&&Math.hypot(S.pos.x-SOIL.x,S.pos.z-SOIL.z)<2.0){ctxCap='Terra tova';ctxA.set(SOIL.x,SOIL.y+1.6,SOIL.z);
    if(!F5.planted)return ['plantar'];if(F5.grown)return ['trepar'];}
  return null;
}
Object.assign(LAB,{picante:TXT.picante,nariz:TXT.nariz,pelos:TXT.pelos,tablas:TXT.tablasMirar,ayuda:TXT.ayuda,romper:TXT.romper,dejarBolet:TXT.dejarBolet,tapar:TXT.tapar,plantar:TXT.plantar,trepar:TXT.trepar});
Object.assign(ACT,{
  picante(){GS.spicy=true;saveGame();sfx('pick');},
  nariz(){const u=uniPos();S.tyaw=Math.atan2(u.x-S.pos.x,u.z-S.pos.z);S.speed=0;act={type:'snz',t:0};SNZ.st='pre';SNZ.t=0;toast(TXT.esternuda,1800);},
  pelos(){SNZ.st=null;SNZ.hairs.forEach(h=>world.remove(h.m));SNZ.hairs.length=0;giveIngredient('peluni',S.pos.x,S.y+1,S.pos.z);toast(TXT.pelosOk,2500);},
  tablas(){F5.sawPlanks=1;saveGame();toast(TXT.tablas,4000);},
  ayuda(){say(TXT.unicornio,TXT.uniAyuda,()=>{CAVE.uni={st:'espera'};uni.g.position.set(GT.x+2.4,gY(GT.x+2.4,PLANK_Z+3.2),PLANK_Z+3.2);uni.g.rotation.y=0.3;});},
  romper(){CAVE.uni.st='coz';CAVE.t=0;},
  dejarBolet(){GS.bait=false;F5.baitDown=1;saveGame();baitM.visible=true;LL.still=0;LL.st='lejos';toast(TXT.quieta,3500);sfx('magic');},
  tapar(){LL.st=null;LL.g.visible=false;baitM.visible=false;giveIngredient('lluerna',QUIET.x,QUIET.y+0.4,QUIET.z);toast(TXT.lluernaOk,3500);},
  plantar(){if(GS.seeds<=0){toast(TXT.sinLlavor,3500);return;}GS.seeds--;F5.planted=1;saveGame();VINE.sprout.visible=true;sfx('dig');toast(TXT.regar,3500);},
  trepar(){CLIMB.st='up';CLIMB.t=0;act={type:'climb',t:0};S.speed=0;}
});
// las setas de la cueva: se cogen dos (una es el cebo)
{const prev=giveIngredient;giveIngredient=function(id,x,y,z){prev(id,x,y,z);if(id==='bolet'){GS.bait=true;saveGame();toast(TXT.boletDos,3500);}};}
// la lluvia hace crecer la planta trepadora
{const prev=onCast;onCast=function(k){prev(k);
  if(k==='lluvia'&&F5.planted&&!F5.grown&&Math.hypot(S.pos.x-SOIL.x,S.pos.z-SOIL.z)<6){F5.grown=1;saveGame();VINE.g.visible=true;VINE.grow=0.001;setTimeout(()=>toast(TXT.crece,3500),1500);}};}

/* ---------- bucle ---------- */
let ramasT=-9;
function p5Step(dt){
  const t=S.t,on=p5on();
  handSpicy.visible=!!GS.spicy&&!GS.got.peluni;SPICY.g.visible=!GS.spicy&&!GS.got.peluni;
  // estornudo
  if(SNZ.st==='pre'){SNZ.t+=dt;uni.head.rotation.x-=Math.sin(SNZ.t*6)*0.01;
    if(SNZ.t>1.4){SNZ.st='pels';SNZ.t=0;act=null;GS.spicy=false;saveGame();sfx('sneeze');uni.happy=1;
      const u=uniPos(),hx=u.x+Math.sin(uni.g.rotation.y)*1.2,hz=u.z+Math.cos(uni.g.rotation.y)*1.2;
      for(let i=0;i<12;i++){const m=mk(new THREE.CylinderGeometry(0.008,0.008,0.22,4),new THREE.MeshBasicMaterial({color:pick(['#fff0ff','#ffd6f0','#e0f0ff'])}),hx,u.y+1.8,hz,world);SNZ.hairs.push({m,v:new THREE.Vector3(rr(-1.5,1.5),rr(1,2.5),rr(-1.5,1.5)),w:rr(-4,4)});}}}
  if(SNZ.st==='pels'){SNZ.t+=dt;for(const h of SNZ.hairs){h.v.y-=1.2*dt;h.v.multiplyScalar(Math.exp(-dt*1.5));h.m.position.addScaledVector(h.v,dt);h.m.rotation.z+=h.w*dt;if(h.m.position.y<gY(h.m.position.x,h.m.position.z)+0.2)h.m.position.y=gY(h.m.position.x,h.m.position.z)+0.2;}
    if(SNZ.t>8){SNZ.st=null;SNZ.hairs.forEach(h=>world.remove(h.m));SNZ.hairs.length=0;}}
  // el unicornio en la cueva: coces a las tablas
  if(CAVE.uni){const U=CAVE.uni;
    if(U.st==='coz'){CAVE.t+=dt;uni.rig.rotation.x=-Math.sin(Math.min(1,CAVE.t*3)*PI)*0.35;
      if(CAVE.t>0.35&&!U.hit){U.hit=1;sfx('crack');CAVE.boards.forEach(b=>{b.v.set(rr(-2,2),rr(2,4),rr(2,4));b.w=rr(-6,6);});F5.caveOpen=1;saveGame();if(CAVE.box){const i=BOXES.indexOf(CAVE.box);if(i>=0)BOXES.splice(i,1);CAVE.box=null;}}
      if(U.hit)CAVE.boards.forEach(b=>{b.v.y-=9*dt;b.m.position.addScaledVector(b.v,dt);b.m.rotation.x+=b.w*dt;});
      if(CAVE.t>2){CAVE.g.visible=false;U.st='vuelve';uni.rig.rotation.x=0;say(TXT.unicornio,TXT.uniRompe);}}
    else if(U.st==='vuelve'&&Math.hypot(S.pos.x-uniPos().x,S.pos.z-uniPos().z)>25){uni.g.position.set(UNI.x,landH(UNI.x,UNI.z),UNI.z);uni.g.rotation.y=UNI.yaw;CAVE.uni=null;}}
  // la luciérnaga: se acerca si estás quieta, huye si corres
  if(F5.baitDown&&!GS.got.lluerna&&GS.pot===4){baitM.visible=true;const d=Math.hypot(S.pos.x-QUIET.x,S.pos.z-QUIET.z);
    if(!LL.st)LL.st='lejos';
    if(d<7){if(S.speed<0.2&&!S.air)LL.still+=dt;else if(S.speed>2.5&&LL.still>0.5){LL.still=0;LL.st='lejos';toast(TXT.huye,2600);}}else LL.still=Math.max(0,LL.still-dt);
    const u=Math.min(1,LL.still/6);LL.g.visible=d<14;
    const far=new THREE.Vector3(QUIET.x-9,QUIET.y+4,QUIET.z+6);LL.g.position.lerpVectors(far,new THREE.Vector3(QUIET.x,QUIET.y+0.55,QUIET.z),u);LL.g.position.y+=Math.sin(t*3)*0.15*(1-u);LL.g.position.x+=Math.sin(t*1.7)*0.4*(1-u);
    if(u>=1&&LL.st!=='posada'){LL.st='posada';sfx('notify');}
    if(R()<dt*10)emit('dust',LL.g.position.x,LL.g.position.y,LL.g.position.z,1,{sp:0.2,size:0.05,color:'#a0e8ff'});}
  else if(!F5.baitDown||GS.got.lluerna){LL.g.visible=false;if(GS.got.lluerna)baitM.visible=false;}
  // lluernes del pot
  if(FFLY.visible)FFLY.children.forEach(c=>{const i=c.userData.i;if(i===undefined)return;c.position.set(Math.sin(t*1.3+i)*0.35,Math.sin(t*2+i*1.7)*0.25,Math.cos(t*1.1+i*0.7)*0.35);});
  // la planta crece
  if(VINE.grow>0&&VINE.grow<1){VINE.grow=Math.min(1,VINE.grow+dt/3);VINE.g.scale.set(1,VINE.grow,1);VINE.sprout.visible=false;if(R()<dt*15)emit('dust',SOIL.x,SOIL.y+VINE.grow*(HOUSE.y-SOIL.y),SOIL.z,1,{sp:0.8,size:0.08,color:'#9fe07a'});}
  // trepar por la planta hasta la casa
  if(CLIMB.st){CLIMB.t+=dt;const H=HOUSE.y-SOIL.y,a0=Math.atan2(HOUSE.x-SOIL.x,HOUSE.z-SOIL.z);let u;
    if(CLIMB.st==='up'){u=Math.min(1,CLIMB.t/3);if(u>=1){CLIMB.st='top';CLIMB.t=0;toast(TXT.casaDentro,3000);}}
    else if(CLIMB.st==='top'){u=1;if(CLIMB.t>1.6&&!GS.got.cera){giveIngredient('cera',HOUSE.x,HOUSE.y+0.8,HOUSE.z);}if(CLIMB.t>2.6){CLIMB.st='down';CLIMB.t=0;}}
    else{u=Math.max(0,1-CLIMB.t/2.5);if(u<=0){CLIMB.st=null;act=null;}}
    if(CLIMB.st==='top'||(CLIMB.st===null)){if(CLIMB.st==='top'){S.pos.set(HOUSE.x-1.3*Math.sin(a0),0,HOUSE.z-1.3*Math.cos(a0));S.y=HOUSE.y+0.11;}}
    else{const a=u*TAU*1.5;S.pos.set(SOIL.x+Math.sin(a)*0.55+(HOUSE.x-1.3*Math.sin(a0)-SOIL.x)*u*u,0,SOIL.z+Math.cos(a)*0.55+(HOUSE.z-1.3*Math.cos(a0)-SOIL.z)*u*u);S.y=SOIL.y+u*(H+0.11);S.tyaw=S.yaw=a+PI;}
    if(CLIMB.st===null){S.pos.set(SOIL.x+1.1,0,SOIL.z+0.6);S.y=SOIL.y;}
    S.air=false;S.vy=0;S.speed=0;}
  // las ramas no dejan llegar volando a la casa
  if(FL.on){const dx=S.pos.x-HOUSE.x,dz=S.pos.z-HOUSE.z,d=Math.hypot(dx,dz);if(d<5.5&&Math.abs(S.y-HOUSE.y-1)<5&&d>1e-3){S.pos.x=HOUSE.x+dx/d*5.5;S.pos.z=HOUSE.z+dz/d*5.5;if(S.t-ramasT>4){ramasT=S.t;toast(TXT.ramas,3000);}}}
  // conjuro «Llum»
  const lo=spell.type==='llum';if(lo){const f=Math.min(1,spell.t*2,(7-spell.t)*1.5);lightOrb.visible=true;lightOrb.position.set(S.pos.x+0.6*Math.cos(t*1.5),S.y+1.9+Math.sin(t*2)*0.15,S.pos.z+0.6*Math.sin(t*1.5));lightOrb.scale.setScalar(Math.max(0.01,f));orbL.position.copy(lightOrb.position);orbL.intensity=1.8*f;}
  else if(lightOrb.visible){lightOrb.visible=false;orbL.intensity=0;}
  // el gato sigue a Bruna
  if(CAT.on){const side=S.yaw-PI/2-0.6,tx=S.pos.x+Math.sin(side)*1.0,tz=S.pos.z+Math.cos(side)*1.0;
    const dx=tx-CAT.x,dz=tz-CAT.z,d=Math.hypot(dx,dz);if(d>8){CAT.x=tx;CAT.z=tz;}else{CAT.x+=dx*Math.min(1,dt*3);CAT.z+=dz*Math.min(1,dt*3);}
    if(d>0.05)CAT.yaw=Math.atan2(dx,dz);CAT.y+=((FL.on?S.y+0.3:S.y)-CAT.y)*Math.min(1,dt*6);
    CAT.g.position.set(CAT.x,CAT.y+(d>0.2?Math.abs(Math.sin(t*10))*0.04:0),CAT.z);CAT.g.rotation.y=CAT.yaw;CAT.tail.rotation.z=Math.sin(t*2)*0.3;}
  // final del nivel: el certificado
  if(PLAY&&GS.pot===4&&GS.phase==='premio'&&!dOn&&!certOn)showCertificate();
  // luces alrededor del torreón cuando la poción está hecha
  const lit=PLAY?GS.done.includes(4):false;orbs.forEach((g,i)=>{g.visible=lit;if(lit){const a=t*0.2+i/orbs.length*TAU;g.position.set(OX+Math.sin(a)*(14+Math.sin(t+i)*2),OY+6+Math.sin(t*0.7+i)*3+(i%3)*3,OZ+Math.cos(a)*(14+Math.sin(t+i)*2));}});
}
Object.assign(window.__j,{SNZ,CAVE,QUIET,LL,FFLY,SOIL,HOUSE,VINE,CLIMB,CAT,SPICY,openCave,showCertificate,PLANK_Z,BOXES,uniPos});
