/* =====================================================================
   POCIÓN 3 · MAGICUS ARBOLERUMS — lo que tiene de especial
   - Caca de unicornio: probar comidas (bayas, manzana, seta, hierba). Con las bayas lilas da vueltas, se tira un pedo
     y levanta la cola: hay que poner el bote a tiempo. Después ofrece su fuerza (para la cueva del árbol, poción 5).
   - Gusano: empujar la roca grande; el Conillet cava; el gusano sale unos segundos.
   - Recoger: huesos de la cesta de fruta (cocina), savia del árbol azul, polvo de la mariposa dorada.
   - Premio: zapatos con alas. Poder: turbo con la fruta.
   ===================================================================== */
const P3=NIVEL1.pociones[2];
const p3on=()=>PLAY&&GS.pot===2&&(GS.phase==='recoger'||GS.phase==='caldero');
const placeAt=(x,z,r)=>{const [a,b]=freeSpot(x,z,r);return {x:a,z:b,y:gY(a,b)};};

/* ---------- comida para el unicornio (se puede coger siempre) ---------- */
const FOODS={},FOOD_C={baya:'#a050e0',manzana:'#e8434f',seta:'#e8506a',hierba:'#6fbf5a'};
function foodMesh(k,s){const g=new THREE.Group(),c=FOOD_C[k];
  if(k==='baya')[[0,0,0],[0.06,-0.03,0.02],[-0.05,-0.03,0.03],[0.01,-0.05,-0.05]].forEach(p=>mk(SPH(0.045,10,8),LM(c),p[0],p[1],p[2],g));
  else if(k==='manzana'){mk(SPH(0.09,14,10),LM(c),0,0,0,g).scale.y=0.9;mk(new THREE.CylinderGeometry(0.008,0.01,0.06,5),LM('#6b4430'),0,0.09,0,g);}
  else if(k==='seta'){mk(new THREE.CylinderGeometry(0.03,0.04,0.1,8),LM('#f3e6cf'),0,0,0,g);const c2=mk(new THREE.SphereGeometry(0.08,12,8,0,TAU,0,PI/2),LM(c),0,0.05,0,g);c2.scale.y=0.7;}
  else for(let i=0;i<5;i++){const b=mk(new THREE.ConeGeometry(0.02,0.18,4),LM(c),(i-2)*0.025,0.06,0,g);b.rotation.z=(i-2)*0.2;}
  g.scale.setScalar(s||1);g.traverse(o=>{if(o.isMesh)o.castShadow=true;});return g;}
{ // arbusto de bayas lilas
  const p=placeAt(-0.4,-6.4,0.8),g=new THREE.Group();g.position.set(p.x,p.y,p.z);world.add(g);
  [[0,0.45,0,0.55],[0.35,0.35,0.2,0.4],[-0.35,0.35,-0.1,0.42],[0.1,0.7,-0.2,0.38]].forEach(([x,y,z,r])=>mk(SPH(r,12,10),LM('#4f7a3a'),x,y,z,g));
  for(let i=0;i<14;i++){const a=i*2.4,h=0.3+(i%5)*0.12;mk(SPH(0.05,8,6),LM('#a050e0',{emissive:'#7020c0',emissiveIntensity:0.3}),Math.sin(a)*0.55,h,Math.cos(a)*0.5,g);}
  g.traverse(o=>{if(o.isMesh)o.castShadow=true;});COL.push({x:p.x,z:p.z,r:0.7});FOODS.baya={x:p.x,z:p.z,y:p.y};}
{ // manzanas caídas
  const p=placeAt(-5.6,-6.0,0.5);[[0,0],[0.3,0.15],[-0.2,0.25]].forEach(([dx,dz])=>{const m=foodMesh('manzana',1.4);m.position.set(p.x+dx,p.y+0.12,p.z+dz);world.add(m);});FOODS.manzana=p;}
{ // seta pequeña
  const p=placeAt(1.8,-0.8,0.3),m=foodMesh('seta',2.2);m.position.set(p.x,p.y+0.1,p.z);world.add(m);FOODS.seta=p;}
{ // hierba alta
  const p=placeAt(-5.0,-0.6,0.3),m=foodMesh('hierba',3.0);m.position.set(p.x,p.y,p.z);world.add(m);FOODS.hierba=p;}
const handFood={};for(const k in FOOD_C){const m=foodMesh(k,1.2);m.position.set(-0.14,-0.02,0.24);m.visible=false;B.chest.add(m);handFood[k]=m;}

/* ---------- el unicornio ---------- */
const UST={st:null,t:0};
const handJar=mkPot(ing3('caca').color,0.9);handJar.visible=false;handJar.position.set(0.12,-0.05,0.25);B.chest.add(handJar);handJar.userData.halo.material.opacity=0;
function ing3(id){return P3.ingredientes.find(i=>i.id===id);}
TARGETS.caca=v=>{v.set(uni.g.position.x,uni.g.position.y+1,uni.g.position.z);return true;};
function feedUni(){
  const k=GS.food;GS.food=null;saveGame();sfx('eat');
  say(TXT.unicornio,TXT.uniDice[k],()=>{if(k==='baya'){UST.st='paseo';UST.t=0;}});
}
function poopNow(){UST.st='caca';UST.t=0;handJar.visible=true;act={type:'uni',t:0};S.speed=0;
  const tl=new THREE.Vector3();uni.tail.getWorldPosition(tl);S.tyaw=Math.atan2(tl.x-S.pos.x,tl.z-S.pos.z);}
const poops=[];

/* ---------- la roca y el gusano ---------- */
const ROCK={g:new THREE.Group(),moved:0,mv:0,from:null,to:null,col:null,worm:null,wst:null,wt:0,dig:null};
{ const p=placeAt(5.2,1.0,1.2);ROCK.home={x:p.x,z:p.z,y:p.y};
  const soil=new THREE.Mesh(new THREE.CircleGeometry(0.9,20),LM('#5a3a26'));soil.rotation.x=-PI/2;soil.position.set(p.x,p.y+0.02,p.z);world.add(soil);
  const r=mk(new THREE.DodecahedronGeometry(0.85,1),LM('#7e7888'),0,0.55,0,ROCK.g);r.scale.set(1.15,0.8,1);r.castShadow=true;
  ROCK.g.position.set(p.x,p.y,p.z);world.add(ROCK.g);ROCK.col={x:p.x,z:p.z,r:1.0};COL.push(ROCK.col);
  const w=new THREE.Group();for(let i=0;i<6;i++)mk(SPH(0.05,10,8),LM('#e88a8a'),0,i*0.07,0,w);w.position.set(p.x,p.y-0.4,p.z);w.visible=false;world.add(w);ROCK.worm=w;}
TARGETS.gusano=v=>{v.set(ROCK.home.x,ROCK.home.y+0.5,ROCK.home.z);return true;};
function startDig(){ROCK.dig={t:0};}

/* ---------- huesos, savia, mariposa dorada ---------- */
{ // cesta de fruta en la cocina
  const x=-1.6,z=4.6,y=L(2),b=TBatch();b.base=TRS(x,y,z);
  b.cyl('#a8783a',0,0.14,0,0.36,0.28,12);b.cyl('#8a5d2a',0,0.29,0,0.38,0.03,12);b.base=null;b.mesh(G[2]);col(2,x,z,0.42);
  [['#e8434f',0.12,0.32,0.05],['#f0a040',-0.1,0.33,0.08],['#ffd84a',0.0,0.36,-0.12],['#8a4fd0',0.15,0.31,-0.12]].forEach(([c,dx,dy,dz])=>{const m=mk(SPH(0.11,12,10),LM(c),x+dx,y+dy,z+dz,G[2]);m.castShadow=true;});
  const seeds=new THREE.Group();seeds.position.set(x,y+0.47,z);G[2].add(seeds);for(let i=0;i<4;i++){const s=mk(SPH(1,8,6),LM('#8a5a30'),(i-1.5)*0.06,0,(i%2)*0.04,seeds);s.scale.set(0.035,0.022,0.05);}
  registerItem('huesos',seeds,{halo:0.7});if(GS.got.huesos||GS.done.includes(2))seeds.visible=false;}
{ // gota de savia en el tronco del árbol azul
  const p=T1.curve.getPointAt(0.12),ang=0.9,r=0.5-0.3*Math.pow(0.12,0.8)+0.04,v=new THREE.Vector3(p.x+Math.sin(ang)*r,p.y,p.z+Math.cos(ang)*r).applyMatrix4(T1.M);
  const g=new THREE.Group();g.position.copy(v);world.add(g);const d=mk(SPH(0.07,12,10),LM('#5fb0ff',{emissive:'#3080ff',emissiveIntensity:0.6,transparent:true,opacity:0.9}),0,0,0,g);d.scale.set(1,1.6,1);
  registerItem('savia',g,{nobob:true,halo:0.8});if(GS.got.savia||GS.done.includes(2))g.visible=false;}
const BFLY={g:new THREE.Group(),wl:new THREE.Group(),wr:new THREE.Group()};
{ const wing=new THREE.ShapeGeometry(new THREE.Shape([[0,0],[0.05,0.16],[0.2,0.2],[0.26,0.08],[0.16,-0.02],[0.2,-0.12],[0.08,-0.15]].map(p=>new THREE.Vector2(p[0],p[1]))));wing.rotateX(-PI/2);
  const m=new THREE.MeshBasicMaterial({color:'#ffd84a',side:THREE.DoubleSide});BFLY.wl.add(new THREE.Mesh(wing,m));const w2=new THREE.Mesh(wing,m);w2.scale.x=-1;BFLY.wr.add(w2);
  mk(SPH(1,6,5),LM('#5a3a1a'),0,0,0,BFLY.g).scale.set(0.022,0.022,0.11);BFLY.g.add(BFLY.wl);BFLY.g.add(BFLY.wr);BFLY.g.scale.setScalar(2.2);world.add(BFLY.g);
  registerItem('polvo',BFLY.g,{nobob:true,halo:0.6});if(GS.got.polvo||GS.done.includes(2))BFLY.g.visible=false;}

/* ---------- zapatos con alas ---------- */
const wingG=()=>{const g=new THREE.Group(),m=LM('#fffdf6',{emissive:'#ffffff',emissiveIntensity:0.2});
  [[0,0.04,-0.02,0.07],[0,0.02,-0.06,0.055],[0,0.0,-0.09,0.04]].forEach(([x,y,z,r])=>{const f=mk(SPH(1,8,6),m,x,y,z,g);f.scale.set(0.012,r*0.55,r);f.rotation.x=0.5;});return g;};
const shoesW=new THREE.Group();
{ [-1,1].forEach(s=>{const sh=mk(RBox(0.108,0.074,0.2,0.034),LM('#5a3a8a'),s*0.09,0,0,shoesW);const w=wingG();w.position.set(s*0.15,0.04,-0.02);w.rotation.z=-s*0.5;shoesW.add(w);});
  shoesW.scale.setScalar(2.2);shoesW.position.setFromMatrixPosition(WARD_M.clone().multiply(TRS(-0.4,1.1,0.45)));shoesW.rotation.y=PI+0.05;shoesW.visible=false;G[1].add(shoesW);}
let shoesOn=false;
function wearShoes(){if(shoesOn)return;shoesOn=true;
  [B.legL,B.legR].forEach((L0,i)=>{L0.foot.traverse(o=>{if(o.isMesh&&o.material&&o.material.color&&o.material.color.getHexString()==='34303f')o.material=LM('#5a3a8a');});
    const w=wingG();w.position.set((i?-1:1)*0.07,0.0,-0.02);w.rotation.z=(i?1:-1)*0.6;L0.foot.add(w);});}
REWARD.sabates={w:shoesW,lab:'Ponerse los zapatos',wear:wearShoes};
if(GS.clothes.includes('sabates'))wearShoes();

/* ---------- acciones ---------- */
function p3Actions(){
  if(!p3on()||(UST.st&&UST.st!=='cola')||ROCK.dig||ROCK.mv)return null;
  if(mode!=='forest')return null;
  const nearUni=uniDist()<2.7;
  // unicornio con la cola levantada: poner el bote
  if(UST.st==='cola'&&nearUni){ctxCap=TXT.unicornio;ctxA.set(uni.g.position.x,uni.g.position.y+2.2,uni.g.position.z);return ['bote'];}
  if(!GS.got.caca){
    if(nearUni&&GS.food){LAB.dar='Darle '+TXT.comida[GS.food];ctxCap=TXT.unicornio;ctxA.set(UNI.x,uni.g.position.y+2.2,UNI.z);return ['dar'];}
    for(const k in FOODS){const f=FOODS[k];if(Math.hypot(S.pos.x-f.x,S.pos.z-f.z)<1.6&&GS.food!==k){LAB['f_'+k]=TXT.coger[k];ctxCap='';ctxA.set(f.x,f.y+1.4,f.z);return ['f_'+k];}}}
  // roca y gusano
  if(!GS.got.gusano){const d=Math.hypot(S.pos.x-ROCK.home.x,S.pos.z-ROCK.home.z);
    if(ROCK.wst==='fuera'&&d<2.6){ctxCap='Gusano';ctxA.set(ROCK.home.x,ROCK.home.y+1.2,ROCK.home.z);return ['gusano'];}
    if(!ROCK.moved&&Math.hypot(S.pos.x-ROCK.g.position.x,S.pos.z-ROCK.g.position.z)<2.2){ctxCap='Roca grande';ctxA.set(ROCK.g.position.x,ROCK.g.position.y+1.7,ROCK.g.position.z);return ['empujar'];}
    if(ROCK.moved&&!ROCK.wst&&d<2.6){ctxCap='Tierra blanda';ctxA.set(ROCK.home.x,ROCK.home.y+1.2,ROCK.home.z);return ['cavar'];}}
  return null;
}
Object.assign(LAB,{bote:'Poner el bote',dar:'Darle',empujar:'Empujar la roca',cavar:'Conillet, ¡cava!',gusano:'Coger el gusano'});
for(const k in FOOD_C)ACT['f_'+k]=()=>{GS.food=k;saveGame();sfx('pick');};
Object.assign(ACT,{
  dar(){feedUni();},
  bote(){if(UST.st!=='cola')return;poopNow();},
  empujar(){const g=ROCK.g.position,a=Math.atan2(g.x-S.pos.x,g.z-S.pos.z);ROCK.from=g.clone();ROCK.to=new THREE.Vector3(g.x+Math.sin(a)*1.5,0,g.z+Math.cos(a)*1.5);
    const[x,z]=freeSpot(ROCK.to.x,ROCK.to.z,0.9);ROCK.to.set(x,gY(x,z),z);ROCK.mv=0.001;act={type:'push',t:0};S.tyaw=a;S.speed=0;sfx('door');},
  cavar(){startDig();},
  gusano(){ROCK.wst=null;ROCK.worm.visible=false;giveIngredient('gusano',ROCK.home.x,ROCK.home.y+0.3,ROCK.home.z);}
});

/* ---------- bucle ---------- */
function p3Step(dt){
  const t=S.t;
  for(const k in handFood)handFood[k].visible=GS.food===k;
  // mariposa dorada: vuela bajito en círculos por el claro y deja polvo brillante
  if(BFLY.g.visible){const a=t*0.35,c={x:-0.5,z:-1.5};BFLY.g.position.set(c.x+Math.sin(a)*3.2+Math.sin(a*2.3)*0.6,gY(c.x,c.z)+1.25+Math.sin(t*1.7)*0.25,c.z+Math.cos(a)*2.6);
    BFLY.g.rotation.y=a+PI/2;const fl=Math.sin(t*12)*0.8;BFLY.wl.rotation.z=fl;BFLY.wr.rotation.z=-fl;
    if(R()<dt*8)emit('dust',BFLY.g.position.x,BFLY.g.position.y,BFLY.g.position.z,1,{sp:0.2,size:0.04,color:'#ffe680'});}
  // unicornio
  const u=uni.g;
  if(UST.st){UST.t+=dt;}
  if(UST.st==='paseo'){const a=UST.t*1.4,r=1.3;u.position.set(UNI.x+Math.sin(a)*r-Math.sin(0)*r,landH(UNI.x+Math.sin(a)*r,UNI.z+Math.cos(a)*r-r),UNI.z+Math.cos(a)*r-r);
    u.rotation.y=a+PI/2;uni.rig.position.y=Math.abs(Math.sin(UNI.x+UST.t*8))*0.06;
    if(UST.t>1.6&&!UST.pet){UST.pet=1;sfx('pet');for(let i=0;i<10;i++)emit('dust',u.position.x-Math.sin(u.rotation.y)*1,u.position.y+1.1,u.position.z-Math.cos(u.rotation.y)*1,1,{sp:0.8,size:0.12,color:'#c8e070'});}
    if(UST.t>4.5){UST.st='cola';UST.t=0;UST.pet=0;u.position.set(UNI.x,landH(UNI.x,UNI.z),UNI.z);u.rotation.y=UNI.yaw;uni.rig.position.y=0;toast(TXT.ponBote,3000);sfx('notify');}}
  else if(UST.st==='cola'){uni.tail.rotation.x=-1.3;if(UST.t>6){UST.st=null;say(TXT.unicornio,TXT.uniFalsa);}}
  else if(UST.st==='caca'){uni.tail.rotation.x=-1.3;
    if(UST.t>0.3&&poops.length<7&&UST.t>0.3+poops.length*0.18){const c=['#ff5f6a','#ff9a4a','#ffd84a','#7fe07a','#5fb0ff','#7a6aff','#c98aff'][poops.length],m=mk(SPH(0.07,10,8),LM(c,{emissive:c,emissiveIntensity:0.4}),0,0,0,world);
      uni.tail.getWorldPosition(_w);m.position.copy(_w);poops.push({m,v:0});sfx('click');}
    for(const p of poops){p.v-=9*dt;p.m.position.y+=p.v*dt;if(p.m.position.y<S.y+0.9){p.m.visible=false;}}
    if(UST.t>2.2){poops.forEach(p=>world.remove(p.m));poops.length=0;UST.st=null;act=null;handJar.visible=false;
      giveIngredient('caca',S.pos.x,S.y+1,S.pos.z);GS.flags.uniHelp=1;saveGame();say(TXT.unicornio,TXT.uniGracias);}}
  // la roca: se desliza al empujarla
  if(ROCK.mv){ROCK.mv=Math.min(1,ROCK.mv+dt/1.2);const u2=ROCK.mv*ROCK.mv*(3-2*ROCK.mv);ROCK.g.position.lerpVectors(ROCK.from,ROCK.to,u2);ROCK.g.rotation.z=-u2*0.6;
    ROCK.col.x=ROCK.g.position.x;ROCK.col.z=ROCK.g.position.z;
    if(ROCK.mv>=1){ROCK.mv=0;ROCK.moved=1;act=null;toast(TXT.roca,2600);setTimeout(startDig,900);}}
  // el Conillet cava
  if(ROCK.dig){const D=ROCK.dig;D.t+=dt;const h=ROCK.home;BN.x=h.x+0.35;BN.z=h.z+0.35;BN.root.position.set(BN.x,h.y,BN.z);BN.root.rotation.y=Math.atan2(-0.35,-0.35);
    BN.body.rotation.x=0.5;BN.fore.forEach((f,i)=>f.rotation.x=Math.sin(t*22+i*PI)*0.9);
    if(R()<dt*20)emit('dust',h.x,h.y+0.1,h.z,1,{sp:1.2,size:0.08,color:'#7a5236'});if(Math.floor(D.t*6)!==Math.floor((D.t-dt)*6))sfx('dig');
    if(D.t>2.2){ROCK.dig=null;BN.body.rotation.x=0;BN.fore.forEach(f=>f.rotation.x=0);ROCK.wst='fuera';ROCK.wt=0;ROCK.worm.visible=true;toast(TXT.gusanoSale,2600);sfx('pick');}}
  if(ROCK.wst==='fuera'){ROCK.wt+=dt;const h=ROCK.home,up=Math.min(1,ROCK.wt*3)*(ROCK.wt>3.2?Math.max(0,1-(ROCK.wt-3.2)*3):1);
    ROCK.worm.position.set(h.x,h.y-0.35+up*0.45,h.z);ROCK.worm.children.forEach((c,i)=>c.position.x=Math.sin(t*8+i*0.8)*0.03*i);
    if(ROCK.wt>3.5){ROCK.wst=null;ROCK.worm.visible=false;toast(TXT.gusanoSeEsconde,3000);}}
}
Object.assign(window.__j,{UST,ROCK,FOODS,BFLY,uni,UNI});
