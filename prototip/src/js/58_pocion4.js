/* =====================================================================
   POCIÓN 4 · AEOLUM POGICOLUM — lo que tiene de especial
   - Risa de rana: coger el bolet pelut, hacerle cosquillas a la rana de tres ojos (frotar con el dedo) y atrapar las burbujas.
   - Escamas de pez raro: semillas del árbol gigante (cuelgan encima de la seta gigante: hay que rebotar) y pescar
     en el estanque con la ventana de «Estira!» corta.
   - Agua hasta la raya: llenar el bote manteniendo pulsado y soltar justo en la raya.
   - Flor de loto (estanque) y escarcha (terraza, se funde si tardas).
   - Premio: la escoba de la terraza (vuelo).
   ===================================================================== */
const p4on=()=>PLAY&&GS.pot===3&&(GS.phase==='recoger'||GS.phase==='caldero');
const shoreAt=(a,k)=>{const r=pondR(a)*k;return {x:POND.x+Math.sin(a)*r,z:POND.z+Math.cos(a)*r};};
const FROG=frogs[0],FR={st:null,t:0,bub:[]};
GS.seeds=GS.seeds||0;

/* ---------- bolet de capell pelut (para las cosquillas) ---------- */
const HAIRY=(()=>{const a=Math.atan2(FROG.x-POND.x,FROG.z-POND.z)+0.45,p=shoreAt(a,1.18),[x,z]=freeSpot(p.x,p.z,0.3),g=new THREE.Group();
  g.position.set(x,gY(x,z),z);world.add(g);mk(new THREE.CylinderGeometry(0.05,0.07,0.3,8),LM('#f3e6cf'),0,0.15,0,g);
  const cap=mk(new THREE.SphereGeometry(0.17,14,10,0,TAU,0,PI/2),LM('#c98a5a'),0,0.28,0,g);cap.scale.y=0.7;
  for(let i=0;i<24;i++){const a2=i*2.4,e=0.3+(i%4)*0.25,h=mk(new THREE.ConeGeometry(0.01,0.08,4),LM('#f0d8c0'),Math.sin(a2)*Math.cos(e)*0.16,0.28+Math.sin(e)*0.11,Math.cos(a2)*Math.cos(e)*0.16,g);h.lookAt(g.position.x+Math.sin(a2)*2,g.position.y+3,g.position.z+Math.cos(a2)*2);h.rotateX(PI/2);}
  g.scale.setScalar(1.6);g.traverse(o=>{if(o.isMesh)o.castShadow=true;});return {g,x,z};})();
const handHairy=new THREE.Group();{mk(new THREE.CylinderGeometry(0.02,0.025,0.12,6),LM('#f3e6cf'),0,0,0,handHairy);const c=mk(new THREE.SphereGeometry(0.06,10,8,0,TAU,0,PI/2),LM('#c98a5a'),0,0.06,0,handHairy);c.scale.y=0.7;
  handHairy.position.set(-0.14,0,0.26);handHairy.visible=false;B.chest.add(handHairy);}
TARGETS.rialla=v=>{if(!GS.hairy){v.set(HAIRY.x,gY(HAIRY.x,HAIRY.z)+0.4,HAIRY.z);return true;}FROG.g.getWorldPosition(v);return true;};

/* ---------- llavors de l'arbre gran: cuelgan encima de la seta gigante ---------- */
const SEEDM=MUSH.reduce((a,m)=>(Math.hypot(m.x-GT.x,m.z-GT.z)<40&&m.top>a.top)?m:a,{top:-1e9});
const SEEDS={g:new THREE.Group(),away:0};
{const g=SEEDS.g,y=SEEDM.top+5.2;g.position.set(SEEDM.x,y,SEEDM.z);world.add(g);
 mk(new THREE.CylinderGeometry(0.03,0.03,9,5),LM('#5d4a2a'),0,4.5,0,g);
 for(let i=0;i<5;i++){const a=i*1.26,s=mk(SPH(1,10,8),LM('#c8a050',{emissive:'#a07820',emissiveIntensity:0.35}),Math.sin(a)*0.22,-0.1-(i%2)*0.15,Math.cos(a)*0.22,g);s.scale.set(0.09,0.14,0.07);}
 halo(g,0,0,0,1.6,'#ffe08a',0.45);g.visible=false;}
TARGETS.escates=v=>{if(GS.seeds>0){v.set(POND.x,WY,POND.z);return true;}v.copy(SEEDS.g.position);return true;};

/* ---------- el estanque: flor de loto, pez dorado, pescar y llenar el bote ---------- */
const LOTUS_A=Math.atan2(-0.6-POND.x,10.5-POND.z)+0.5;
{const p=shoreAt(LOTUS_A,0.84),g=new THREE.Group();g.position.set(p.x,WY+0.04,p.z);world.add(g);
 mk(new THREE.CircleGeometry(0.42,18),LM('#4f8a4a',{side:THREE.DoubleSide}),0,0,0,g).rotation.x=-PI/2;
 for(let i=0;i<8;i++){const a=i/8*TAU,pt=mk(SPH(1,10,8),LM('#ff9fd8',{emissive:'#ff6fc0',emissiveIntensity:0.3}),Math.sin(a)*0.12,0.12,Math.cos(a)*0.12,g);pt.scale.set(0.07,0.13,0.035);pt.rotation.y=a;pt.rotation.x=0.4;}
 mk(SPH(0.06,10,8),LM('#ffe066',{emissive:'#ffc000',emissiveIntensity:0.4}),0,0.15,0,g);
 registerItem('lotus',g,{nobob:true,halo:1.1});if(GS.got.lotus||GS.done.includes(3))g.visible=false;}
const goldFish=new THREE.Group();{const m=LM('#ffb030',{emissive:'#ff9000',emissiveIntensity:0.5});mk(SPH(1,12,8),m,0,0,0,goldFish).scale.set(0.12,0.1,0.25);
  const t=mk(new THREE.ConeGeometry(0.1,0.16,4),m,0,0,-0.28,goldFish);t.rotation.x=-PI/2;goldFish.scale.setScalar(1.5);world.add(goldFish);}
const FISH={st:null,t:0,at:0,p:new THREE.Vector3(),rod:null,line:null,bob:null};
{const rod=new THREE.Group();const r=mk(new THREE.CylinderGeometry(0.008,0.014,1.3,6),LM('#8a5d3a'),0,0.6,0,rod);rod.rotation.x=1.0;rod.position.set(0.12,0,0.2);rod.visible=false;B.chest.add(rod);FISH.rod=rod;FISH.tip=new THREE.Object3D();FISH.tip.position.set(0,1.25,0);rod.add(FISH.tip);
 FISH.bob=mk(SPH(0.06,10,8),LM('#ff5f6a'),0,0,0,world);FISH.bob.visible=false;
 const lg=new THREE.BufferGeometry();lg.setAttribute('position',new THREE.Float32BufferAttribute([0,0,0,0,0,0],3));FISH.line=new THREE.Line(lg,new THREE.LineBasicMaterial({color:'#efe8da'}));FISH.line.visible=false;FISH.line.frustumCulled=false;scene.add(FISH.line);}
TARGETS.aigua=v=>{const p=shoreAt(LOTUS_A-0.4,1.12);v.set(p.x,gY(p.x,p.z),p.z);return true;};

/* ---------- escarcha en la terraza ---------- */
const FROST={g:new THREE.Group(),x:-3.0,z:-4.0,regrow:0};
{const g=FROST.g;g.position.set(FROST.x,L(3)+0.02,FROST.z);G[3].add(g);const m=LM('#e8f6ff',{emissive:'#a8d8ff',emissiveIntensity:0.5,transparent:true,opacity:0.92});
 for(let i=0;i<9;i++){const a=i*0.7,c=mk(new THREE.ConeGeometry(0.05+(i%3)*0.02,0.25+(i%4)*0.08,5),m,Math.sin(a)*0.15*(i%3),0.12,Math.cos(a)*0.15*(i%3),g);c.rotation.set((i%3-1)*0.4,a,(i%2-0.5)*0.5);}
 mk(new THREE.CircleGeometry(0.4,16),LM('#f4fbff',{transparent:true,opacity:0.7}),0,0.005,0,g).rotation.x=-PI/2;
 registerItem('gebre',g,{nobob:true,halo:1.0});if(GS.got.gebre||GS.done.includes(3))g.visible=false;}
// al recargar, el gebre que estaba en el saco ya se ha fundido
if(PLAY&&GS.pot===3&&GS.got.gebre&&!GS.layers.includes('gebre')){GS.got.gebre=false;GS.bag=GS.bag.filter(i=>i!=='gebre');if(GS.phase==='caldero')GS.phase='recoger';FROST.g.visible=true;}
{const el=document.createElement('div');el.id='frost';el.className='ui';document.body.appendChild(el);
 const css=document.createElement('style');css.textContent='#frost{left:50%;top:calc(env(safe-area-inset-top) + 120px);transform:translateX(-50%);display:none;background:#e8f6ff;color:#2a5a8a;font:800 15px system-ui;padding:6px 14px;border-radius:999px;box-shadow:0 3px 10px rgba(0,0,0,.35)}#frost.low{background:#ffd6d6;color:#a03030}'+
  '#tirar{left:50%;bottom:calc(env(safe-area-inset-bottom) + 190px);transform:translateX(-50%);display:none;border:0;border-radius:22px;background:#ffb030;color:#fff;font:900 26px system-ui;padding:20px 34px;box-shadow:0 5px 0 #a86a10,0 10px 30px rgba(0,0,0,.5);cursor:pointer;touch-action:manipulation;animation:pl .2s infinite alternate;z-index:13}'+
  '#ovMini .box{text-align:center;color:#fff;font:700 16px system-ui}#ovMini .box p{margin:0 0 14px;max-width:80vw}#belly{width:min(70vw,280px);height:min(70vw,280px);margin:0 auto;border-radius:50%;background:radial-gradient(circle at 50% 40%,#d8f0b0,#8fc06a);box-shadow:0 0 0 12px #6f9a50;touch-action:none;position:relative}'+
  '#jar{position:relative;width:140px;height:220px;margin:0 auto;border:5px solid #cfe6ff;border-top:0;border-radius:0 0 40px 40px;overflow:hidden;background:rgba(255,255,255,.08);touch-action:none}#jarW{position:absolute;left:0;right:0;bottom:0;height:0;background:linear-gradient(#9fd8ff,#4fa0e0)}#jarL{position:absolute;left:-5px;right:-5px;height:4px;background:#ff5f6a}'+
  '#holdB{margin-top:16px;border:0;border-radius:18px;background:#4fa0e0;color:#fff;font:800 18px system-ui;padding:16px 26px;touch-action:none;cursor:pointer}';document.head.appendChild(css);
 const b=document.createElement('button');b.id='tirar';b.className='ui';b.textContent=TXT.tira;document.body.appendChild(b);b.addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();pull();});
 const ov=document.createElement('div');ov.id='ovMini';ov.className='ov';document.body.appendChild(ov);ov.addEventListener('pointerdown',e=>e.stopPropagation());}
addEventListener('keydown',e=>{if(FISH.st==='bite'&&(e.key===' '||e.key.toLowerCase()==='e')){e.preventDefault();pull();}},{capture:true});

/* ---------- minijuegos en pantalla: cosquillas y llenar el bote ---------- */
let miniOn=false;
function tickleGame(){const ov=$('ovMini');miniOn=true;let n=0,lastDir=0,lastX=null;
  ov.innerHTML='<div class="box"><p>'+TXT.cosqTxt+'</p><div id="belly"></div></div>';ov.classList.add('on');const bel=$('belly');
  const done=()=>{if(!miniOn)return;miniOn=false;ov.classList.remove('on');frogLaugh();};
  bel.addEventListener('pointermove',e=>{if(lastX!==null){const dx=e.clientX-lastX;if(Math.abs(dx)>3){const d=Math.sign(dx);if(d!==lastDir){lastDir=d;n++;sfx('click');bel.style.transform='scale('+(1+0.03*(n%2))+')';if(n>=12)done();}}}lastX=e.clientX;});
  window.__tickle=done;}
function waterGame(){const ov=$('ovMini');miniOn=true;let lv=0,hold=false;const LINE=0.7,TOL=0.06;
  ov.innerHTML='<div class="box"><p>'+TXT.aguaTxt+'</p><div id="jar"><div id="jarW"></div><div id="jarL" style="bottom:'+(LINE*100)+'%"></div></div><button id="holdB">'+TXT.llenar+'</button></div>';ov.classList.add('on');
  const w=$('jarW'),hb=$('holdB');let iv=setInterval(()=>{if(hold){lv=Math.min(1,lv+0.012);w.style.height=(lv*100)+'%';if(R()<0.3)sfx('water');}},30);
  const release=()=>{if(!hold||!miniOn)return;hold=false;const d=lv-LINE;
    if(Math.abs(d)<=TOL){miniOn=false;clearInterval(iv);toast(TXT.aguaOk,2500);setTimeout(()=>{ov.classList.remove('on');giveIngredient('aigua',S.pos.x,S.y+1,S.pos.z);},500);}
    else{toast(d<0?TXT.aguaMas:TXT.aguaMenos,2200);lv=0;w.style.height='0%';}};
  hb.addEventListener('pointerdown',e=>{e.preventDefault();hold=true;});hb.addEventListener('pointerup',release);hb.addEventListener('pointerleave',release);hb.addEventListener('pointercancel',release);
  window.__water=v=>{hold=true;lv=v;release();};}
function frogLaugh(){FR.st='riu';FR.t=0;toast(TXT.rie,3000);sfx('giggle');}

/* ---------- pescar ---------- */
function startFish(){if(GS.seeds<=0){toast(TXT.sinSemillas,3000);return;}
  const a=Math.atan2(POND.x-S.pos.x,POND.z-S.pos.z);S.tyaw=a;S.speed=0;act={type:'fish',t:0};
  FISH.p.set(S.pos.x+Math.sin(a)*2.6,WY+0.02,S.pos.z+Math.cos(a)*2.6);FISH.st='wait';FISH.t=0;FISH.at=rr(1.6,3.6);FISH.rod.visible=true;FISH.bob.visible=true;FISH.line.visible=true;sfx('jump');}
function pull(){if(FISH.st!=='bite')return;FISH.st='catch';FISH.t=0;$('tirar').style.display='none';sfx('splash');}
function endFish(){FISH.st=null;act=null;FISH.rod.visible=false;FISH.bob.visible=false;FISH.line.visible=false;$('tirar').style.display='none';}

/* ---------- acciones ---------- */
function p4Actions(){
  if(!p4on()||FISH.st||miniOn)return null;
  if(mode!=='forest')return null;
  FROG.g.getWorldPosition(_w);const dF=Math.hypot(S.pos.x-_w.x,S.pos.z-_w.z);
  if(!GS.got.rialla){
    if(FR.st==='riu'&&dF<3.0){ctxCap='Granota de tres ulls';ctxA.set(_w.x,_w.y+1.0,_w.z);return ['burbujas'];}
    if(GS.hairy&&!FR.st&&dF<3.0){ctxCap='Granota de tres ulls';ctxA.set(_w.x,_w.y+1.0,_w.z);return ['cosquillas'];}
    if(!GS.hairy&&Math.hypot(S.pos.x-HAIRY.x,S.pos.z-HAIRY.z)<1.6){ctxCap='Bolet pelut';ctxA.set(HAIRY.x,gY(HAIRY.x,HAIRY.z)+1.2,HAIRY.z);return ['peludo'];}}
  const pd=pondD(S.pos.x,S.pos.z);
  if(pd>0.9&&pd<1.4){const a=[];if(!GS.got.aigua)a.push('llenar');if(!GS.got.escates)a.push('pescar');
    if(a.length){ctxCap='Estany';return a;}}
  return null;
}
Object.assign(LAB,{peludo:TXT.peludo,cosquillas:TXT.cosquillas,burbujas:TXT.burbujas,llenar:TXT.llenar,pescar:TXT.pescar});
Object.assign(ACT,{
  peludo(){GS.hairy=true;saveGame();sfx('pick');},
  cosquillas(){FROG.g.getWorldPosition(_w);S.tyaw=Math.atan2(_w.x-S.pos.x,_w.z-S.pos.z);tickleGame();},
  burbujas(){FR.st=null;FR.bub.forEach(b=>world.remove(b.m));FR.bub.length=0;giveIngredient('rialla',S.pos.x,S.y+1,S.pos.z);},
  llenar(){waterGame();},
  pescar(){startFish();}
});
// la escoba de la terraza es el premio de esta poción
{const prev=ACT.escoba;ACT.escoba=()=>{prev();if(PLAY&&GS.pot===3&&GS.phase==='premio')finishReward();};}
REWARD.escombra={w:new THREE.Group(),noWard:true,lab:'',wear(){}};
if(PLAY&&GS.clothes.includes('escombra'))broomTo('back');

/* ---------- remolinos sobre el estanque (lo que cambia en el mundo con la poción 4) ---------- */
const swirls=[];{const m=new THREE.MeshBasicMaterial({color:'#dff4ff',transparent:true,opacity:0.5,depthWrite:false});
  [[-1.5,0.5],[1.8,-1.2]].forEach(([dx,dz])=>{const g=new THREE.Group();for(let i=0;i<14;i++){const p=mk(SPH(0.06,6,5),m,0,0,0,g);p.userData.i=i;}g.position.set(POND.x+dx,WY,POND.z+dz);g.visible=false;world.add(g);swirls.push(g);});}

/* ---------- bucle ---------- */
function p4Step(dt){
  const t=S.t,on=p4on();
  handHairy.visible=!!GS.hairy&&!GS.got.rialla&&GS.pot===3;HAIRY.g.visible=!GS.hairy&&!GS.got.rialla;
  // la escoba aparece en la terraza cuando ya se puede volar
  if(PLAY&&POW.escoba&&FL.state==='stand'&&!broom.g.visible)broom.g.visible=true;
  // rana: se ríe
  if(FR.st==='riu'){FR.t+=dt;FROG.throat.scale.set(0.14*(1+0.35*Math.abs(Math.sin(t*14))),0.1,0.11);FROG.rig.position.y=Math.abs(Math.sin(t*12))*0.04;
    if(R()<dt*7){FROG.g.getWorldPosition(_w);const m=mk(SPH(rr(0.06,0.12),10,8),new THREE.MeshBasicMaterial({color:'#dfffd0',transparent:true,opacity:0.6}),_w.x+rr(-.2,.2),_w.y+0.5,_w.z+rr(-.2,.2),world);FR.bub.push({m,t:0});}
    if(Math.floor(FR.t*2)!==Math.floor((FR.t-dt)*2))sfx('giggle');
    if(FR.t>6){FR.st=null;FROG.rig.position.y=0;}}
  for(let i=FR.bub.length-1;i>=0;i--){const b=FR.bub[i];b.t+=dt;b.m.position.y+=dt*0.6;b.m.position.x+=Math.sin(t*3+i)*dt*0.2;if(b.t>3){world.remove(b.m);FR.bub.splice(i,1);}}
  // llavors: aparecen con la tarea y se cogen al pasar (en el aire, rebotando en la seta)
  const wantSeeds=on&&!GS.got.escates;SEEDS.g.visible=wantSeeds&&SEEDS.away<=0;if(SEEDS.away>0)SEEDS.away-=dt;
  if(SEEDS.g.visible){SEEDS.g.rotation.y=Math.sin(t*0.8)*0.3;const p=SEEDS.g.position;if(Math.hypot(S.pos.x-p.x,S.y+0.7-p.y,S.pos.z-p.z)<1.4){GS.seeds+=3;saveGame();SEEDS.away=20;sfx('pick');toast(TXT.semillas,2600);
    for(let i=0;i<10;i++)emit('dust',p.x,p.y,p.z,1,{sp:1.3,size:0.07,color:'#ffe08a'});}}
  // pez dorado
  goldFish.visible=on&&!GS.got.escates&&FISH.st!=='catch';if(goldFish.visible){const a=t*0.5;goldFish.position.set(POND.x+Math.sin(a)*2.4,WY-0.18,POND.z+Math.cos(a)*1.8);goldFish.rotation.y=a+PI/2;}
  // pesca
  if(FISH.st){FISH.t+=dt;const b=FISH.bob;b.position.copy(FISH.p);
    if(FISH.st==='wait'){b.position.y+=Math.sin(t*3)*0.02;if(FISH.t>FISH.at){FISH.st='bite';FISH.t=0;$('tirar').style.display='block';toast(TXT.pica,900);sfx('notify');}}
    else if(FISH.st==='bite'){b.position.y-=0.12+Math.sin(t*30)*0.04;if(FISH.t>0.75){endFish();toast(TXT.escapa,2500);}}
    else if(FISH.st==='catch'){const u=Math.min(1,FISH.t/0.8);const g=goldFish;g.visible=true;g.position.set(lerp(FISH.p.x,S.pos.x,u*0.6),WY+Math.sin(u*PI)*1.6,lerp(FISH.p.z,S.pos.z,u*0.6));g.rotation.z=u*6;
      if(FISH.t>1.4){endFish();GS.seeds=Math.max(0,GS.seeds-1);giveIngredient('escates',S.pos.x,S.y+1,S.pos.z);toast(TXT.pez,4000);emit('ring',FISH.p.x,0,FISH.p.z,1,{size:0.8});}}
    if(FISH.st){FISH.tip.getWorldPosition(_w);const P=FISH.line.geometry.attributes.position;P.setXYZ(0,_w.x,_w.y,_w.z);P.setXYZ(1,b.position.x,b.position.y,b.position.z);P.needsUpdate=true;}}
  // escarcha: se funde si tardas
  const el=$('frost');
  if(PLAY&&GS.pot===3&&GS.bag.includes('gebre')){if(!GS.frostT)GS.frostT=S.t+60;const left=Math.ceil(GS.frostT-S.t);el.style.display='block';el.textContent=TXT.gebreQueda+left+' s';el.classList.toggle('low',left<=15);
    if(left<=0){GS.bag=GS.bag.filter(i=>i!=='gebre');GS.got.gebre=false;GS.frostT=0;if(GS.phase==='caldero')GS.phase='recoger';saveGame();toast(TXT.gebreFon,4000);FROST.regrow=4;}}
  else{el.style.display='none';if(!GS.bag.includes('gebre'))GS.frostT=0;}
  if(FROST.regrow>0){FROST.regrow-=dt;if(FROST.regrow<=0)FROST.g.visible=true;}
  if(FROST.g.visible&&on)FROST.g.rotation.y=Math.sin(t)*0.1;
  // remolinos cuando la poción está hecha
  const sw=PLAY?GS.done.includes(3):false;swirls.forEach((g,k)=>{g.visible=sw;if(sw)g.children.forEach(c=>{const i=c.userData.i,a=t*(2+k)+i*0.6,r=0.15+i*0.05;c.position.set(Math.sin(a)*r,i*0.12,Math.cos(a)*r);});});
}
// cuando se coge el gebre empieza a fundirse (se oye y se avisa)
{const prev=giveIngredient;giveIngredient=function(id,x,y,z){prev(id,x,y,z);if(id==='gebre'){GS.frostT=S.t+60;toast(TXT.gebreCoge,3500);}};}
Object.assign(window.__j,{FR,FISH,SEEDS,SEEDM,HAIRY,FROST,FROG,LOTUS_A,shoreAt,pondR,POND,pull});
