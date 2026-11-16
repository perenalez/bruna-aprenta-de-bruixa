/* =====================================================================
   PORTADA — pantalla inicial del juego
   Un decorado propio (con las mismas piezas y el mismo estilo del juego) compuesto como la ilustración de referencia:
   torreón a la izquierda, árbol gigante de colores en el centro, casa del árbol y casita a la derecha, riachuelo con puente,
   cielo rosa de atardecer. Delante: Bruna de bruja remueve el caldero (humo lila), el Conillet a su lado y el unicornio.
   La cámara se balancea suavemente a izquierda y derecha para que se note la profundidad.
   Textos y botón «Juga». ?sinportada en la URL la salta (para pruebas).
   ===================================================================== */
const TITLE={on:PLAY&&!/[?&]sinportada/.test(location.search),t:0,cam:{y:2.2,z:6.6,ly:2.7,lz:-6,sway:1.4,fovH:42,fovV:64}};
const TSC=new THREE.Scene();
const TS={smoke:[],spark:[],flames:[],flies:[],bruna:null,bunny:null,spoon:null,uni:null};
const titleScene=()=>TITLE.on?TSC:null;

function buildTitleScene(){
  const S0=TSC;S0.fog=new THREE.Fog('#f2a6c0',28,75);
  S0.add(new THREE.HemisphereLight('#ffe0ee','#7a8a58',0.95));
  const dl=new THREE.DirectionalLight('#ffd0a8',0.65);dl.position.set(-8,12,6);S0.add(dl);
  // cielo: degradado de atardecer
  {const tex=canvasTex(8,256,(g,w,h)=>{const gr=g.createLinearGradient(0,0,0,h);gr.addColorStop(0,'#c86a9a');gr.addColorStop(0.45,'#f08aa8');gr.addColorStop(0.7,'#ffb59a');gr.addColorStop(1,'#ffd9a8');g.fillStyle=gr;g.fillRect(0,0,w,h);},1,1);
   const m=new THREE.Mesh(new THREE.SphereGeometry(90,24,16),new THREE.MeshBasicMaterial({map:tex,side:THREE.BackSide,fog:false}));m.position.y=-20;S0.add(m);
   const st=new THREE.MeshBasicMaterial({color:'#fff6e0',fog:false});for(let i=0;i<40;i++){const a=rr(-1.3,1.3),e=rr(0.25,0.9),s=mk(new THREE.OctahedronGeometry(rr(0.08,0.22),0),st,Math.sin(a)*80*Math.cos(e),Math.sin(e)*80-20,-Math.cos(a)*80*Math.cos(e),S0);s.userData.tw=rr(0,6);TS.flies.push({m:s,tw:true});}}
  // suelo, camino y montañas
  const ground=mk(new THREE.CircleGeometry(70,40),LM('#7f9a58'),0,0,-20,S0);ground.rotation.x=-PI/2;
  const path=mk(new THREE.PlaneGeometry(1.65,40),LM('#c8b27e'),0.3,0.01,-6,S0);path.rotation.x=-PI/2;path.rotation.z=0.12;
  const mt=[[-32,-55,14,20,'#9a7ab8'],[-12,-62,16,26,'#b08ac4'],[14,-60,15,22,'#9a7ab8'],[34,-52,13,18,'#a888c0']];
  mt.forEach(([x,z,r,h,c])=>{mk(new THREE.ConeGeometry(r,h,7),LM(c),x,h/2-1,z,S0);mk(new THREE.ConeGeometry(r*0.35,h*0.33,7),LM('#f4e4f4'),x,h-1-h*0.16,z,S0);});
  // riachuelo con puente de piedra (izquierda, al fondo)
  {const w=mk(new THREE.PlaneGeometry(40,2.4),new THREE.MeshBasicMaterial({color:'#8fb8e8'}),-6,0.02,-16,S0);w.rotation.x=-PI/2;w.rotation.z=0.25;
   const br=new THREE.Group();br.position.set(-3.6,0,-15);br.rotation.y=0.25;S0.add(br);const stn=LM('#c9bfae');
   mk(new THREE.TorusGeometry(1.6,0.45,8,16,PI),stn,0,0,0,br);mk(new THREE.BoxGeometry(4.2,0.25,1.2),stn,0,1.75,0,br);[-1,1].forEach(s=>mk(new THREE.BoxGeometry(4.2,0.35,0.12),LM('#8a6a44'),0,2.0,s*0.55,br));}
  // árbol gigante con copa de colores
  {const g=new THREE.Group();g.position.set(1.2,0,-22);S0.add(g);const bark=LM('#6e4c3e'),bark2=LM('#5a3c32');
   mk(new THREE.LatheGeometry([[0.001,0],[3.4,0],[2.2,1.2],[1.7,4],[1.5,8],[1.7,11],[2.4,13],[0.001,13.4]].map(p=>new THREE.Vector2(p[0],p[1])),18),bark,0,0,0,g);
   for(let i=0;i<7;i++){const a=i/7*TAU+0.3,r=mk(new THREE.CylinderGeometry(0.25,0.7,4.5,7),bark2,Math.sin(a)*2.6,0.7,Math.cos(a)*2.6,g);r.rotation.set(Math.cos(a)*1.25,0,-Math.sin(a)*1.25);}
   [[-3,11.5,0.6],[3.4,11,-0.5],[0,12,1.8]].forEach(([x,y,rz])=>{const b=mk(new THREE.CylinderGeometry(0.4,0.8,6,7),bark,x*0.6,y,0,g);b.rotation.z=rz;});
   const cols=['#8a4fb0','#c05a7a','#e87a4a','#f0a050','#6a8a4a','#a050a0','#d86a6a','#7a5ab8'];
   for(let i=0;i<26;i++){const a=rr(0,TAU),r=rr(1,8.5),y=rr(13,20)-r*0.25,b=mk(new THREE.IcosahedronGeometry(rr(2.4,3.8),1),LM(pick(cols)),Math.sin(a)*r*1.25,y,Math.cos(a)*r*0.6,g);b.scale.y=0.8;}
   // casa del árbol (derecha)
   const h=new THREE.Group();h.position.set(6.8,8.2,1.2);g.add(h);const wd=LM('#7a6a5a'),wd2=LM('#5a4a3e'),moss=LM('#6a8a4a');
   mk(new THREE.CylinderGeometry(2.0,2.0,0.25,12),wd2,0,0,0,h);mk(new THREE.BoxGeometry(2.4,2.0,2.0),wd,0,1.1,0,h);
   [-1,1].forEach(s=>{const r=mk(new THREE.BoxGeometry(1.6,0.14,2.4),moss,s*0.65,2.45,0,h);r.rotation.z=-s*0.6;});mk(new THREE.BoxGeometry(0.6,0.9,0.05),LM('#2a2030'),0,0.6,1.01,h);
   mk(new THREE.BoxGeometry(0.4,0.4,0.05),LM('#ffd890',{emissive:'#ffb040',emissiveIntensity:0.7}),0.7,1.3,1.01,h);
   for(let k=0;k<9;k++)mk(new THREE.BoxGeometry(0.6,0.06,0.1),wd2,1.6,-0.6-k*0.9,1.4,h);
   [-0.25,0.25].forEach(o=>mk(new THREE.CylinderGeometry(0.03,0.03,8.2,5),wd2,1.6+o,-4.1,1.4,h));}
  // torreón (izquierda): piedra, tejado cónico de madera, ventana encendida, balcón
  {const g=new THREE.Group();g.position.set(-7.2,0,-13);S0.add(g);const st=LM('#cfc4b4'),st2=LM('#b8ac9c'),rf=LM('#a8783a'),rf2=LM('#8a5d2a');
   mk(new THREE.CylinderGeometry(3.0,3.3,9,18),st,0,4.5,0,g);mk(new THREE.CylinderGeometry(3.4,3.4,0.4,18),st2,0,9.1,0,g);
   for(let i=0;i<14;i++){const a=i/14*TAU,y=rr(1,8);mk(new THREE.BoxGeometry(0.7,0.35,0.1),st2,Math.sin(a)*3.12,y,Math.cos(a)*3.12,g).rotation.y=a;}
   mk(new THREE.ConeGeometry(4.2,5.5,18),rf,0,12.0,0,g);for(let i=0;i<8;i++){const a=i/8*TAU,b=mk(new THREE.BoxGeometry(0.12,5.6,0.1),rf2,Math.sin(a)*2.1,12,Math.cos(a)*2.1,g);b.rotation.set(Math.cos(a)*0.65,0,-Math.sin(a)*0.65);}
   const win=mk(new THREE.BoxGeometry(0.8,1.3,0.1),LM('#ffd070',{emissive:'#ffb030',emissiveIntensity:0.9}),0.9,7.0,2.95,g);win.rotation.y=0.3;halo(g,1.0,7.0,3.2,2.4,'#ffc060',0.5);
   mk(new THREE.BoxGeometry(1.6,2.6,0.1),LM('#7a5234'),0.6,1.3,3.2,g).rotation.y=0.2;
   const bal=new THREE.Group();bal.position.set(1.5,5.6,2.6);bal.rotation.y=0.45;g.add(bal);mk(new THREE.BoxGeometry(3.0,0.15,1.4),LM('#8a6a44'),0,0,0,bal);
   for(let i=0;i<7;i++)mk(new THREE.BoxGeometry(0.08,0.7,0.08),LM('#6b4a30'),-1.4+i*0.47,0.4,0.65,bal);mk(new THREE.BoxGeometry(3.0,0.08,0.08),LM('#6b4a30'),0,0.75,0.65,bal);
   for(let i=0;i<6;i++){const v=mk(new THREE.CylinderGeometry(0.06,0.06,rr(3,6),5),LM('#5d7a3a'),Math.sin(i)*3.1,rr(2,6),Math.cos(i)*3.1,g);v.rotation.z=rr(-.2,.2);}}
  // casita de piedra con tejado de musgo (derecha)
  {const g=new THREE.Group();g.position.set(8.5,0,-9);g.rotation.y=-0.5;S0.add(g);mk(new THREE.BoxGeometry(4,2.6,3.2),LM('#b8ac9c'),0,1.3,0,g);
   [-1,1].forEach(s=>{const r=mk(new THREE.BoxGeometry(2.5,0.2,3.6),LM('#6f8a48'),s*1.0,3.0,0,g);r.rotation.z=-s*0.62;});
   mk(new THREE.BoxGeometry(0.9,1.6,0.08),LM('#5a3c2a'),-0.6,0.8,1.62,g);mk(new THREE.BoxGeometry(0.7,0.6,0.08),LM('#2a2030'),0.9,1.6,1.62,g);}
  // árboles de los lados
  [[-15,-8,'#6a8ab8'],[15,-14,'#5a7ab0'],[12,-20,'#9a6ab8'],[-16,-20,'#7a5aa8'],[-6,-26,'#c06a8a']].forEach(([x,z,c])=>{mk(new THREE.CylinderGeometry(0.3,0.5,4,7),LM('#5a3c32'),x,2,z,S0);for(let i=0;i<4;i++)mk(new THREE.IcosahedronGeometry(rr(1.6,2.4),1),LM(c),x+rr(-1.5,1.5),4.5+rr(0,1.5),z+rr(-1,1),S0);});
  // ---- primer plano: el caldero ----
  const c=new THREE.Group();c.position.set(0.1,0,0);S0.add(c);
  mk(new THREE.LatheGeometry([[0.001,0.2],[0.3,0.21],[0.52,0.32],[0.66,0.52],[0.7,0.72],[0.64,0.92],[0.56,1.02],[0.62,1.06],[0.66,1.1],[0.6,1.12],[0.54,1.08]].map(p=>new THREE.Vector2(p[0],p[1])),24),LM('#2b262e'),0,0,0,c);
  mk(new THREE.TorusGeometry(0.63,0.045,8,26),LM('#3a343e'),0,1.09,0,c).rotation.x=PI/2;
  const liq=mk(new THREE.CircleGeometry(0.56,24),new THREE.MeshBasicMaterial({color:'#c06af0'}),0,1.04,0,c);liq.rotation.x=-PI/2;
  for(let i=0;i<3;i++){const a=i*2.094+0.5,l=mk(new THREE.CylinderGeometry(0.05,0.04,0.3,6),LM('#2b262e'),Math.sin(a)*0.4,0.1,Math.cos(a)*0.4,c);l.rotation.set(Math.cos(a)*0.2,0,-Math.sin(a)*0.2);}
  for(let i=0;i<8;i++){const a=i/8*TAU,s=mk(ico(1,0),LM('#8a7f7c'),Math.sin(a)*0.85,0.07,Math.cos(a)*0.85,c);s.scale.set(0.16,0.1,0.14);}
  const fm=['#f0652a','#ffa52e','#ffe27a'].map(col=>new THREE.MeshBasicMaterial({color:col}));
  for(let i=0;i<9;i++){const a=i/9*TAU,f=mk(new THREE.ConeGeometry(0.12,0.4,6),fm[i%3],Math.sin(a)*0.45,0.15,Math.cos(a)*0.45,c);TS.flames.push({m:f,ph:i*0.9});}
  halo(c,0,0.3,0,2.4,'#ff9a48',0.55);halo(c,0,1.3,0,2.6,'#d08aff',0.6);
  const fl=new THREE.PointLight('#ff9a48',1.3,6,1.5);fl.position.set(0,0.6,0.7);c.add(fl);const pl=new THREE.PointLight('#d08aff',1.1,7,1.5);pl.position.set(0,1.8,0.3);c.add(pl);
  const sm=new THREE.MeshBasicMaterial({color:'#e8c0ff',transparent:true,depthWrite:false,fog:false});
  for(let i=0;i<16;i++){const m=new THREE.Mesh(ico(1,1),sm.clone());c.add(m);TS.smoke.push({m,ph:i/16,r:rr(0.09,0.16)});}
  for(let i=0;i<18;i++){const m=new THREE.Mesh(new THREE.OctahedronGeometry(0.035,0),new THREE.MeshBasicMaterial({color:pick(['#ffffff','#ffe9ff','#f0d8ff']),fog:false}));c.add(m);TS.spark.push({m,ph:i/18,a:rr(0,TAU),r:rr(0.1,0.6)});}
  // Bruna de bruja con el cucharón
  const b=buildBruna();b.root.position.set(-1.05,0,0.25);b.root.rotation.y=0.75;b.root.scale.setScalar(1.15);S0.add(b.root);TS.bruna=b;
  const hat=mkHat();hat.position.set(0,0.2,-0.01);hat.rotation.set(-0.08,0,0.1);b.head.add(hat);
  const dark=LM('#2f2440'),dark2=LM('#3a2a52',{side:THREE.DoubleSide});b.root.traverse(o=>{if(o.isMesh&&o.material&&o.material.map)o.material=o.material.side===THREE.DoubleSide?dark2:dark;});
  const sp=new THREE.Group();mk(new THREE.CylinderGeometry(0.018,0.022,0.85,6),LM('#a8743a'),0,-0.25,0,sp);const bowl=mk(SPH(0.06,10,8),LM('#a8743a'),0,-0.68,0,sp);bowl.scale.set(1,0.6,1.3);b.armR.hd.add(sp);TS.spoon=sp;
  // el Conillet a su lado
  const k=buildBunny();k.root.scale.setScalar(1.45);k.root.position.set(-1.5,0,1.25);k.root.rotation.y=0.45;S0.add(k.root);TS.bunny=k;
  // el unicornio (una copia del del juego)
  const u=uni.g.clone();u.position.set(1.75,0,-0.45);u.rotation.y=-1.25;u.scale.setScalar(1.0);S0.add(u);TS.uni=u;
  // setas que brillan, flores y luciérnagas
  const mush=(x,z,s,col)=>{const m=new THREE.Group();m.position.set(x,0,z);m.scale.setScalar(s);S0.add(m);mk(new THREE.CylinderGeometry(0.05,0.07,0.32,8),LM('#f3e6cf'),0,0.16,0,m);
    const cap=mk(new THREE.SphereGeometry(0.2,14,8,0,TAU,0,PI/2),LM(col,{emissive:col,emissiveIntensity:0.5}),0,0.3,0,m);cap.scale.y=0.6;for(let i=0;i<6;i++){const a=i*1.1;mk(SPH(0.025,6,5),LM('#ffe066',{emissive:'#ffd040',emissiveIntensity:0.6}),Math.sin(a)*0.13,0.37,Math.cos(a)*0.13,m);}halo(m,0,0.35,0,0.9,col,0.35);};
  mush(1.15,1.05,1.3,'#3f8aff');mush(1.5,0.75,0.85,'#3f8aff');mush(-0.25,1.5,0.9,'#ff6fb0');mush(2.9,0.2,1.1,'#5fb0ff');mush(-2.6,-0.8,1.2,'#5fb0ff');mush(3.6,-3,1.4,'#b07ae0');
  for(let i=0;i<22;i++){const x=rr(-4.5,4.5),z=rr(-2,2.8),f=new THREE.Group();f.position.set(x,0,z);S0.add(f);mk(new THREE.CylinderGeometry(0.01,0.012,0.3,4),LM('#5f8a3a'),0,0.15,0,f);
    const col=pick(['#ff8fd0','#c98aff','#ffd06a','#ff9fb0','#a0c8ff']);for(let p=0;p<5;p++){const pt=mk(SPH(1,6,5),LM(col),Math.sin(p*1.26)*0.05,0.31,Math.cos(p*1.26)*0.05,f);pt.scale.set(0.04,0.015,0.06);pt.rotation.y=p*1.26;}}
  const gm=new THREE.MeshBasicMaterial({color:'#fff4b0',fog:false});for(let i=0;i<26;i++){const m=mk(SPH(0.03,6,5),gm,rr(-6,6),rr(0.3,3),rr(-6,3),S0);TS.flies.push({m,b:m.position.clone(),ph:rr(0,6)});}
}

/* ---------- textos y botón ---------- */
{const css=document.createElement('style');css.textContent=`
@import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@500;700&display=swap');
#tscreen{position:fixed;inset:0;z-index:30;display:flex;flex-direction:column;align-items:center;justify-content:space-between;padding:calc(env(safe-area-inset-top) + 22px) 18px calc(env(safe-area-inset-bottom) + 20px);pointer-events:none;font-family:Fredoka,"Trebuchet MS",system-ui,sans-serif;color:#fff;text-align:center;transition:opacity .8s}
#tscreen.out{opacity:0}
#tscreen .hi{font-weight:500;font-size:clamp(16px,4.4vw,22px);text-shadow:0 2px 8px rgba(90,20,70,.75);letter-spacing:.3px}
#tscreen h1{margin:6px 0 4px;font-weight:700;font-size:clamp(38px,11vw,68px);line-height:1;color:#fff4fa;text-shadow:0 3px 0 #9a2a6a,0 6px 18px rgba(80,10,60,.6);letter-spacing:.5px}
#tscreen h1 small{display:block;font-size:.48em;color:#fff;font-weight:500;margin-top:6px;text-shadow:0 2px 0 #7a2a6a,0 4px 12px rgba(80,10,60,.6)}
#tscreen .sub{font-size:clamp(15px,4vw,20px);max-width:520px;text-shadow:0 2px 8px rgba(90,20,70,.85)}
#tscreen .bot{display:flex;flex-direction:column;align-items:center;gap:12px}
#tplay{pointer-events:auto;border:0;border-radius:999px;background:linear-gradient(#ffd84a,#ffb02e);color:#6a2a12;font:700 clamp(24px,6vw,32px) Fredoka,system-ui;padding:14px 56px;box-shadow:0 5px 0 #b9741a,0 10px 26px rgba(0,0,0,.4);cursor:pointer;animation:tp 1.2s ease-in-out infinite alternate;touch-action:manipulation}
#tplay:active{transform:translateY(3px);box-shadow:0 2px 0 #b9741a}
@keyframes tp{to{transform:scale(1.06)}}
#tscreen .cred{font-size:13px;text-shadow:0 1px 6px rgba(60,0,40,.9)}`;document.head.appendChild(css);}
function showTitleUI(on){['hud','joy','acts','chips','top','hint','bwand','spells','ctx','tbar','frost'].forEach(id=>{const e=$(id);if(e)e.style.visibility=on?'hidden':'';});}
if(TITLE.on){
  buildTitleScene();
  const d=document.createElement('div');d.id='tscreen';
  d.innerHTML=`<div><div class="hi">Hola! Benvingudes a la nostra aventura!</div><h1>Bruna,<small>l'aprenenta de bruixa</small></h1><div class="sub">Segueix les passes fins convertir-te en una bruixa de veritat!</div></div>
    <div class="bot"><button id="tplay">Juga</button><div class="cred">Un joc pensat i creat per Ayla i Pere.</div></div>`;
  document.body.appendChild(d);showTitleUI(true);
  d.addEventListener('pointerdown',e=>e.stopPropagation());
  $('tplay').addEventListener('click',startGame);
}
function startGame(){if(!TITLE.on)return;TITLE.on=false;audioInit();sfx('magic');$('tscreen').classList.add('out');setTimeout(()=>{const e=$('tscreen');if(e)e.remove();},900);
  showTitleUI(false);camera.fov=38;camera.updateProjectionMatrix();}

/* ---------- cada fotograma: cámara que se balancea y la escena viva ---------- */
function titleStep(dt){
  if(!TITLE.on)return;TITLE.t+=dt;const t=TITLE.t,C=TITLE.cam;
  const port=camera.aspect<1,sw=Math.sin(t*0.35)*C.sway;
  camera.position.set(sw,C.y+(port?0:0.9)+Math.sin(t*0.5)*0.1,C.z+(port?3.0:6.0));camera.lookAt(sw*0.2,C.ly+(port?1.6:0.9),C.lz);
  const fov=port?C.fovV:C.fovH;if(Math.abs(camera.fov-fov)>0.01){camera.fov=fov;camera.updateProjectionMatrix();}
  // Bruna remueve
  const b=TS.bruna,a=t*2.4;
  b.armR.sh.rotation.set(-1.0+Math.sin(a)*0.18,0,0.25+Math.cos(a)*0.15);b.armR.el.rotation.set(-0.6+Math.cos(a)*0.15,0,0);
  b.armL.sh.rotation.set(-0.8+Math.sin(a)*0.12,0,-0.3+Math.cos(a)*0.1);b.armL.el.rotation.set(-0.7,0,0);
  TS.spoon.rotation.set(0.6+Math.sin(a)*0.2,0,Math.cos(a)*0.2);
  b.head.rotation.set(0.1+Math.sin(t*0.9)*0.05,-0.35+Math.sin(t*0.6)*0.25,0);b.pelvis.position.y=Math.sin(a*2)*0.006;
  b.eyes.forEach(e=>e.scale.y=(Math.sin(t*0.8)>0.985)?0.15:1);
  // Conillet
  const k=TS.bunny;k.head.rotation.y=Math.sin(t*0.7)*0.4;k.nose.position.y=-0.018+Math.sin(t*14)*0.002;k.ears.forEach((e,i)=>e.g.rotation.x=Math.sin(t*1.3+i)*0.15);
  k.root.position.y=Math.max(0,Math.sin(t*1.7))>0.97?0.05:0;
  // unicornio: respira
  TS.uni.position.y=Math.sin(t*1.2)*0.015;
  // fuego, humo, chispas y luciérnagas
  for(const f of TS.flames){const s=1+0.25*Math.sin(t*11+f.ph);f.m.scale.set(1,s,1);}
  for(const s of TS.smoke){const u=(t*0.22+s.ph)%1,a2=u*TAU*1.4+s.ph*6;s.m.position.set(Math.sin(a2)*(0.12+u*0.5),1.15+u*3.0,Math.cos(a2)*(0.12+u*0.35));s.m.scale.setScalar(s.r*(0.6+u*2.2));s.m.material.opacity=Math.sin(u*PI)*0.5;}
  for(const s of TS.spark){const u=(t*0.3+s.ph)%1;s.m.position.set(Math.sin(s.a+t)*s.r*(0.3+u),1.2+u*2.4,Math.cos(s.a+t)*s.r*(0.3+u));s.m.rotation.y=t*3;s.m.scale.setScalar(Math.sin(u*PI)*1.4+0.01);}
  for(const f of TS.flies){if(f.tw){f.m.scale.setScalar(0.6+0.4*Math.sin(t*2+f.m.userData.tw));continue;}f.m.position.set(f.b.x+Math.sin(t*0.5+f.ph)*0.6,f.b.y+Math.sin(t*0.8+f.ph*1.7)*0.3,f.b.z+Math.cos(t*0.43+f.ph)*0.6);}
}
Object.assign(window.__j,{TITLE,TS,TSC,startGame,camera});
