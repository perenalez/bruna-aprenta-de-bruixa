/* =====================================================================
   POCIÓN 2 · MAGICULIS PARINURIS — lo que tiene de especial
   - Recoger en el bosque: polen de la flor grande, musgo de la roca, la mariquita de 7 puntos (sube por el árbol azul)
   - Pelo de ratón: queso de la despensa → el ratón te sigue → queso detrás de la planta grande → la planta le arranca un pelo
   - Baba de planta carnívora: «Sol» cerca de la planta grande → babea → ofrecer el bote y esquivar a tiempo
   ===================================================================== */
const P2=NIVEL1.pociones[1];
const ing2=id=>P2.ingredientes.find(i=>i.id===id);
const FLOR2={};
const p2on=()=>PLAY?GS.pot===1&&(GS.phase==='recoger'||GS.phase==='caldero'):false;

/* ---------- en el bosque: flor, roca con musgo, mariquita ---------- */
{ // flor grande con polen dorado
  const s=ing2('polen').spot,[x,z]=freeSpot(s.x,s.z,0.6),y=gY(x,z),g=new THREE.Group();g.position.set(x,y,z);world.add(g);
  mk(new THREE.CylinderGeometry(0.04,0.06,1.1,8),LM('#5d8a3a'),0,0.55,0,g);
  [[0.5,0.35],[-0.6,0.6]].forEach(([a,h])=>{const l=mk(SPH(1,10,8),LM('#6f9a45'),Math.sin(a)*0.18,h,Math.cos(a)*0.18,g);l.scale.set(0.2,0.03,0.08);l.rotation.y=a;});
  const head=new THREE.Group();head.position.y=1.12;head.rotation.x=-0.5;g.add(head);
  for(let i=0;i<7;i++){const a=i/7*TAU,p=mk(SPH(1,12,8),LM('#ff8fd0',{emissive:'#ff5fb0',emissiveIntensity:0.25}),Math.sin(a)*0.2,0,Math.cos(a)*0.2,head);p.scale.set(0.13,0.03,0.2);p.rotation.y=a;}
  const pol=new THREE.Group();pol.position.set(0,0.04,0);head.add(pol);
  mk(SPH(0.1,14,10),LM('#ffd84a',{emissive:'#ffb000',emissiveIntensity:0.6}),0,0,0,pol);
  g.traverse(o=>{if(o.isMesh)o.castShadow=true;});COL.push({x,z,r:0.25});
  registerItem('polen',pol,{nobob:true,halo:1.2});if(GS.got.polen||GS.done.includes(1))pol.visible=false;
  FLOR2.g=g;FLOR2.pol=pol;
}
{ // roca con musgo
  const s=ing2('musgo').spot,[x,z]=freeSpot(s.x,s.z,0.8),y=gY(x,z),g=new THREE.Group();g.position.set(x,y,z);world.add(g);
  const r=mk(new THREE.DodecahedronGeometry(0.6,1),LM('#8a8494'),0,0.32,0,g);r.scale.set(1.2,0.75,1);
  const moss=new THREE.Group();moss.position.y=0.72;g.add(moss);
  mk(SPH(1,16,10),LM('#5f9a3a',{emissive:'#3f7a2a',emissiveIntensity:0.25}),0,0,0,moss).scale.set(0.5,0.12,0.42);
  for(let i=0;i<6;i++)mk(SPH(0.08,8,6),LM('#7fb84a'),rr(-.3,.3),0.06,rr(-.25,.25),moss);
  g.traverse(o=>{if(o.isMesh)o.castShadow=true;});COL.push({x,z,r:0.75});
  registerItem('musgo',moss,{nobob:true,halo:1.4});if(GS.got.musgo||GS.done.includes(1))moss.visible=false;
}
{ // la mariquita de siete puntos: sube y baja por el árbol azul con las otras
  const g=new THREE.Group(),mR=LM('#e23b3b',{emissive:'#ff3030',emissiveIntensity:0.35}),mB=LM('#2a2030');
  mk(new THREE.SphereGeometry(1,12,8,0,6.283,0,1.57),mR,0,0,0,g).scale.set(0.085,0.07,0.1);mk(SPH(0.04,8,6),mB,0,0.015,0.09,g);
  [[0,0.07,0.0],[0.045,0.05,0.03],[-0.045,0.05,0.03],[0.05,0.045,-0.04],[-0.05,0.045,-0.04],[0.025,0.05,-0.075],[-0.025,0.05,-0.075]].forEach(([x,y,z])=>mk(SPH(0.015,6,4),mB,x,y,z,g).scale.y=0.5);
  g.scale.setScalar(2.1);world.add(g);bugs.push({g,tr:T1,t:0.06,ang:-0.4,ph:1.3});            // la de siete puntos va por la parte baja del tronco
  registerItem('mariquita',g,{nobob:true,halo:0.9});if(GS.got.mariquita||GS.done.includes(1))g.visible=false;
}

/* ---------- la despensa con queso (cocina) ---------- */
const PANTRY={x:5.9,z:-1.5};
{ const b=TBatch(),y=L(2),ry=Math.atan2(-PANTRY.x,-PANTRY.z);b.base=TRS(PANTRY.x,y,PANTRY.z,0,ry,0);
  b.box('#6b4a30',0,0.45,0,1.0,0.9,0.6);b.box('#553924',0,0.92,0,1.08,0.06,0.66);b.box('#3a2a1f',0,0.45,0.3,0.86,0.76,0.02);
  b.box('#8a6a44',0,0.47,0.24,0.86,0.04,0.42);
  b.mesh(G[2]);col(2,PANTRY.x,PANTRY.z,0.6);
}
const cheeseG=()=>{const g=new THREE.Group(),m=LM('#ffd24a',{emissive:'#c09000',emissiveIntensity:0.2});
  const w=mk(new THREE.CylinderGeometry(0.22,0.22,0.16,3,1,false,0,PI*0.6),m,0,0.08,0,g);w.rotation.y=-0.4;
  [[0.06,0.12,0.05],[0.12,0.06,0.02]].forEach(([x,y,z])=>mk(SPH(0.025,6,5),LM('#e0a820'),x,y,z,g));g.traverse(o=>{if(o.isMesh)o.castShadow=true;});return g;};
const pantryCheese=cheeseG();{const ry=Math.atan2(-PANTRY.x,-PANTRY.z);pantryCheese.position.set(PANTRY.x+Math.sin(ry)*0.1,L(2)+0.95,PANTRY.z+Math.cos(ry)*0.1);G[2].add(pantryCheese);}
const handCheese=cheeseG();handCheese.scale.setScalar(0.7);handCheese.position.set(0,-0.05,0.2);B.chest.add(handCheese);
const dropCheese=cheeseG();dropCheese.visible=false;scene.add(dropCheese);

/* ---------- el ratón ---------- */
const HOLE_TH=Math.atan2(PANTRY.x,PANTRY.z)+0.32;
{ const m=wM(2,HOLE_TH,0.01);const hole=new THREE.Mesh(new THREE.CircleGeometry(0.2,16,0,PI),new THREE.MeshBasicMaterial({color:'#1a1214'}));hole.applyMatrix4(m.multiply(TRS(0,0.002,0.02)));G[2].add(hole);}
const HOLE=(()=>{const v=new THREE.Vector3().setFromMatrixPosition(wM(2,HOLE_TH,0.45));return {x:v.x,z:v.z};})();
const MOUSE={g:new THREE.Group(),st:'casa',x:0,y:0,z:0,yaw:0,trail:[],t:0,tail:null};
{ const g=MOUSE.g,c=LM('#9a9aa6'),cl=LM('#c8c8d2'),pk=LM('#f2a6b4'),k=LM('#1a1213');
  mk(SPH(1,14,10),c,0,0.07,0,g).scale.set(0.07,0.06,0.11);mk(SPH(1,12,8),c,0,0.09,0.1,g).scale.set(0.05,0.045,0.06);
  mk(SPH(0.012,6,5),pk,0,0.085,0.16,g);[1,-1].forEach(s=>{mk(SPH(1,10,8),pk,s*0.04,0.14,0.08,g).scale.set(0.03,0.03,0.01);mk(SPH(0.009,6,5),k,s*0.022,0.105,0.145,g);});
  const tail=new THREE.Group();tail.position.set(0,0.06,-0.1);g.add(tail);const tm=mk(new THREE.CylinderGeometry(0.006,0.01,0.2,5),pk,0,0,-0.1,tail);tm.rotation.x=PI/2;MOUSE.tail=tail;
  MOUSE.tuft=mk(SPH(0.03,8,6),cl,0,0.13,-0.02,g);
  g.scale.setScalar(1.6);g.traverse(o=>{if(o.isMesh)o.castShadow=true;});scene.add(g);}
function mouseHome(){MOUSE.st='casa';MOUSE.x=OX+HOLE.x;MOUSE.z=OZ+HOLE.z;MOUSE.y=OY+L(2);MOUSE.trail.length=0;MOUSE.g.visible=true;}
mouseHome();
TARGETS.pelo=v=>{if(POTS.pelo&&POTS.pelo.g.visible){POTS.pelo.g.getWorldPosition(v);return true;}v.set(MOUSE.x,MOUSE.y,MOUSE.z);return true;};

/* ---------- la planta carnívora grande (sótano) ---------- */
const BIGP=plants.reduce((a,p)=>p.g.scale.x>a.g.scale.x?p:a,plants[0]);
const bigPos=v=>{v.set(OX+BIGP.x,OY+BY,OZ+BIGP.z);return v;};
TARGETS.baba=v=>{bigPos(v);return true;};
const BABA={hot:0,st:null,t:0,at:0,pot:null};
const babaBusy=()=>!!BABA.st;
const handPot=mkPot(ing2('baba').color,1.0);handPot.visible=false;handPot.position.set(0.12,-0.05,0.25);B.chest.add(handPot);handPot.userData.halo.material.opacity=0;
{const d=document.createElement('button');d.id='dodge';d.className='ui';d.textContent=TXT.esquiva;document.body.appendChild(d);
 const css=document.createElement('style');css.textContent='#dodge{left:50%;bottom:calc(env(safe-area-inset-bottom) + 190px);transform:translateX(-50%);display:none;border:0;border-radius:22px;background:#ff5f6a;color:#fff;font:900 26px system-ui;padding:20px 34px;box-shadow:0 5px 0 #a8303a,0 10px 30px rgba(0,0,0,.5);cursor:pointer;touch-action:manipulation;animation:pl .25s infinite alternate;z-index:13}';document.head.appendChild(css);
 d.addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();dodge();});}
addEventListener('keydown',e=>{if(BABA.st==='lunge'&&(e.key===' '||e.key.toLowerCase()==='e')){e.preventDefault();dodge();}},{capture:true});
function onCast(k){
  if(k==='sol'&&p2on()&&!GS.got.baba&&mode==='tower'&&S.y-OY<-2.6&&bigPos(_w).distanceTo(S.pos.clone().setY(S.y))<6){BABA.hot=30;setTimeout(()=>toast(TXT.babea,4000),900);}
}
function startBaba(){
  if(BABA.hot<=0){toast(TXT.calor,3000);return;}
  BABA.st='prep';BABA.t=0;BABA.at=rr(1.3,2.4);act={type:'baba',t:0};handPot.visible=true;
  S.tyaw=Math.atan2(OX+BIGP.x-S.pos.x,OZ+BIGP.z-S.pos.z);S.speed=0;
}
function dodge(){if(BABA.st!=='lunge')return;BABA.st='ok';BABA.t=0;$('dodge').style.display='none';
  const side=S.tyaw+PI/2;S.pos.x+=Math.sin(side)*0.55;S.pos.z+=Math.cos(side)*0.55;sfx('jump');}
function babaStep(dt){
  if(BABA.hot>0){BABA.hot-=dt;if(R()<dt*6){const v=new THREE.Vector3();BIGP.head.getWorldPosition(v);emit('dust',v.x,v.y-0.15,v.z,1,{sp:0.15,size:0.06,color:'#c8f07a'});}}
  if(!BABA.st)return;BABA.t+=dt;const p=BIGP;
  if(BABA.st==='prep'){p.st.rotation.x=0.25+Math.sin(BABA.t*9)*0.08;p.jaw.rotation.x=-(0.3+0.6*Math.min(1,BABA.t/BABA.at));
    if(BABA.t>BABA.at){BABA.st='lunge';BABA.t=0;$('dodge').style.display='block';sfx('door');}}
  else if(BABA.st==='lunge'){p.st.rotation.x=0.25+Math.min(1,BABA.t/0.7)*0.7;p.jaw.rotation.x=-1.0;
    if(BABA.t>0.7){BABA.st='fail';BABA.t=0;$('dodge').style.display='none';}}
  else if(BABA.st==='ok'){p.st.rotation.x=0.9;p.jaw.rotation.x=BABA.t<0.2?-1:-0.05;
    if(BABA.t>0.2&&!BABA.bit){BABA.bit=1;sfx('splash');handPot.position.set(0.0,0.0,0.3);}
    if(BABA.t>1.1){BABA.st=null;BABA.bit=0;act=null;handPot.visible=false;handPot.position.set(0.12,-0.05,0.25);BABA.hot=0;
      giveIngredient('baba',S.pos.x,S.y+1,S.pos.z);toast(TXT.babaOk,3000);}}
  else if(BABA.st==='fail'){p.st.rotation.x=0.9;p.jaw.rotation.x=-0.05;
    if(BABA.t>0.5){BABA.st=null;act=null;handPot.visible=false;sfx('land',1);
      S.pos.set(OX+LX+0.4,0,OZ+LZ+2.8);S.y=OY+BY;S.speed=0;S.vy=0;camT.set(S.pos.x,S.y+0.72,S.pos.z);toast(TXT.fallo,3600);}}
}

/* ---------- acciones de la poción 2 ---------- */
function potionExtraActions(){
  if(!p2on())return p3Actions();
  if(mode!=='tower'||BABA.st)return null;
  const l=toLoc(S.pos.x,S.pos.z,S.y);
  // cocina: coger queso de la despensa
  if(Math.abs(l.y-L(2))<0.6&&!GS.got.pelo&&!GS.cheese&&MOUSE.st!=='corre'&&Math.hypot(l.x-PANTRY.x,l.z-PANTRY.z)<1.7){ctxCap='Despensa';ctxA.set(OX+PANTRY.x,OY+L(2)+1.9,OZ+PANTRY.z);return ['queso'];}
  // sótano: la planta grande
  if(l.y<-2.6){const d=Math.hypot(l.x-BIGP.x,l.z-BIGP.z);
    if(d<2.6&&GS.cheese&&MOUSE.st==='sigue'){ctxCap='Planta carnívora';ctxA.set(OX+BIGP.x,OY+BY+2.6,OZ+BIGP.z);return ['dejarQueso'];}
    if(d<2.6&&!GS.got.baba){ctxCap='Planta carnívora';ctxA.set(OX+BIGP.x,OY+BY+2.6,OZ+BIGP.z);return ['ofrecer'];}}
  return null;
}
Object.assign(LAB,{queso:'Coger queso',dejarQueso:'Dejar el queso',ofrecer:'Ofrecer el bote'});
Object.assign(ACT,{
  queso(){GS.cheese=true;saveGame();sfx('pick');toast('Tienes queso. ¿Quién tendrá hambre?',2500);},
  dejarQueso(){GS.cheese=false;saveGame();
    const ox=BIGP.x,oz=BIGP.z,dl=Math.hypot(ox,oz)||1,cx=ox+ox/dl*0.9,cz=oz+oz/dl*0.9;      // detrás de la planta (hacia la pared)
    dropCheese.position.set(OX+cx,OY+BY+0.02,OZ+cz);dropCheese.visible=true;MOUSE.st='corre';MOUSE.t=0;
    MOUSE.path=[{x:MOUSE.x,z:MOUSE.z},{x:OX+ox-ox/dl*0.2+oz/dl*0.6,z:OZ+oz-oz/dl*0.2-ox/dl*0.6},{x:OX+cx,z:OZ+cz}];MOUSE.pi=1;sfx('click');},
  ofrecer(){startBaba();}
});

/* ---------- bucle ---------- */
function potionExtraStep(dt){
  const t=S.t;p3Step(dt);
  pantryCheese.visible=!GS.cheese&&!GS.got.pelo;handCheese.visible=GS.cheese;
  if(FLOR2.pol&&FLOR2.pol.visible)if(R()<dt*3){FLOR2.pol.getWorldPosition(_w);emit('dust',_w.x,_w.y,_w.z,1,{sp:0.4,size:0.05,color:'#ffe680'});}
  babaStep(dt);
  // ratón
  const M=MOUSE,hereT=mode==='tower';
  if(M.st==='casa'){M.x=OX+HOLE.x;M.z=OZ+HOLE.z;M.y=OY+L(2);M.yaw=HOLE_TH+PI+Math.sin(t*0.7)*0.6;M.g.position.y=M.y+Math.abs(Math.sin(t*6))*0.01;
    if(p2on()&&!GS.got.pelo&&hereT&&Math.abs(S.y-M.y)<1){const d=Math.hypot(S.pos.x-M.x,S.pos.z-M.z);
      if(d<3&&!GS.flags.pinzas){GS.flags.pinzas=1;saveGame();toast(TXT.pinzas,5000);setTimeout(()=>conill(TXT.pistaPinzas),2500);}
      if(d<4.5&&GS.cheese){M.st='sigue';M.trail.length=0;toast(TXT.ratonSigue,2600);sfx('talk');}}}
  else if(M.st==='sigue'){
    if(!GS.cheese){M.st='casa';}
    M.trail.push({x:S.pos.x,y:S.y,z:S.pos.z});if(M.trail.length>200)M.trail.shift();
    const k=Math.max(0,M.trail.length-50),p=M.trail[k];
    if(lift.riding){M.x=S.pos.x+0.6;M.z=S.pos.z+0.3;M.y=S.y;M.trail.length=0;}
    else if(p){const dx=p.x-M.x,dz=p.z-M.z;if(Math.hypot(dx,dz)>0.02)M.yaw=Math.atan2(dx,dz);
      if(Math.hypot(dx,dz)>6){M.x=p.x;M.z=p.z;}else{M.x+=dx*Math.min(1,dt*6);M.z+=dz*Math.min(1,dt*6);}M.y+=(p.y-M.y)*Math.min(1,dt*8);}
    M.g.position.y=M.y+Math.abs(Math.sin(t*14))*0.03;}
  else if(M.st==='corre'){M.t+=dt;const tg=M.path[M.pi],dx=tg.x-M.x,dz=tg.z-M.z,d=Math.hypot(dx,dz);M.y=OY+BY;
    M.yaw=Math.atan2(dx,dz);const sp=2.2*dt;
    if(d<sp){M.x=tg.x;M.z=tg.z;
      if(M.pi===1&&!M.bit){M.bit=1;BIGP.jaw.rotation.x=-1;sfx('door');M.tuft.visible=false;M.wait=0.6;
        // la planta arranca un pelo y lo escupe hacia Bruna
        const tuft=new THREE.Group();mk(SPH(0.05,8,6),LM('#c8c8d2'),0,0,0,tuft);mk(SPH(0.035,8,6),LM('#9a9aa6'),0.04,0.02,0,tuft);tuft.position.set(OX+BIGP.x,OY+BY+1.6,OZ+BIGP.z);scene.add(tuft);
        const to=new THREE.Vector3(lerp(OX+BIGP.x,S.pos.x,0.55),OY+BY+0.15,lerp(OZ+BIGP.z,S.pos.z,0.55));M.spit={g:tuft,from:tuft.position.clone(),to,t:0};}
      if(M.wait>0){M.wait-=dt;}else M.pi++;
      if(M.pi>=M.path.length){M.st='come';M.t=0;}}
    else{M.x+=dx/d*sp;M.z+=dz/d*sp;}
    M.g.position.y=M.y+Math.abs(Math.sin(t*16))*0.03;}
  else if(M.st==='come'){M.t+=dt;M.g.position.y=M.y+Math.abs(Math.sin(t*10))*0.01;if(M.t>3){dropCheese.visible=false;M.g.visible=false;M.st='fuera';M.bit=0;}}
  else if(M.st==='fuera'){if(mode!=='tower'||S.y-OY>-2.6){mouseHome();M.tuft.visible=!GS.got.pelo;}}
  if(M.spit){const s=M.spit;s.t+=dt/0.8;const u=Math.min(1,s.t);s.g.position.lerpVectors(s.from,s.to,u);s.g.position.y+=Math.sin(u*PI)*0.8;
    if(u>=1){scene.remove(s.g);M.spit=null;const g=new THREE.Group();mk(SPH(0.06,8,6),LM('#c8c8d2'),0,0,0,g);mk(SPH(0.04,8,6),LM('#9a9aa6'),0.05,0.02,0,g);
      g.position.copy(s.to);TW.worldToLocal(g.position);G[-1].add(g);registerItem('pelo',g,{halo:0.7});toast(TXT.peloOk,3000);sfx('pick');}}
  M.g.position.x=M.x;M.g.position.z=M.z;M.g.rotation.y=M.yaw;M.tail.rotation.y=Math.sin(t*8)*0.4;
  M.g.visible=M.g.visible&&(M.st!=='casa'||mode==='tower');
  // el ratón solo se ve si estamos en el torreón o en su planta
  if(M.st==='casa')M.g.visible=mode==='tower'&&!isBase&&S.y-OY>L(2)-1;
  if(GS.got.pelo)M.tuft.visible=false;
}

Object.assign(window.__j,{MOUSE,BABA,BIGP,PANTRY,HOLE,dodge});
