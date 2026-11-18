/* =====================================================================
   PORTADA — pantalla inicial del juego (encàrrec v.1, pas 1)
   Escena 3D propia (TSC) compuesta como referencias/portada-referencia.png, con los modelos del juego:
   Bruna en plano medio mirando al espectador con la varita levantada, el caldero delante a la izquierda,
   el Conill al lado, el torreón a la izquierda y el unicornio a la derecha (cortados por el borde),
   árboles de copa naranja, setas blancas y azuladas y cielo de atardecer lila → rosa → melocotón.
   Piezas que no existen en el juego y son solo de la portada: la varita con estrella y el torreón con tejado.
   Textos y botones en HTML (#tscreen). «Juga» arranca el juego igual que antes.
   «Accedir a la zona de proves» abre #tproves: botón «Testejar» → lista de pruebas (desactivadas, «Aviat»).
   ?sinportada en la URL la salta (para pruebas).
   ===================================================================== */
const TITLE={on:PLAY&&!/[?&]sinportada/.test(location.search),t:0,
  // cámara de la portada (pensada para un móvil vertical, aspecto 0.46)
  cam:{x:0,y:0.55,z:2.75,lx:0.05,ly:1.08,fov:44,fovH:40,asp:0.46}};
const TSC=new THREE.Scene();
const TS={trees:[],tower:null,caul:null,bruna:null,bunny:null,uni:null,wand:null,star:null,swirl:null,parts:[],steam:[],bubbles:[],twinkles:[],liq:null,glow:null};
const titleScene=()=>TITLE.on?TSC:null;

// textura de destello de cuatro puntas (para las chispas)
const sparkTex=canvasTex(64,64,(g,w,h)=>{const c=w/2;g.fillStyle='#fff';g.beginPath();
  for(let i=0;i<8;i++){const a=i/8*TAU-PI/2,r=i%2?5:31;g.lineTo(c+Math.cos(a)*r,c+Math.sin(a)*r);}g.closePath();g.fill();
  const gr=g.createRadialGradient(c,c,0,c,c,14);gr.addColorStop(0,'rgba(255,255,255,1)');gr.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=gr;g.fillRect(0,0,w,h);},1,1);
const sprite=(tex,color,size,op)=>{const s=new THREE.Sprite(new THREE.SpriteMaterial({map:tex,color,blending:THREE.AdditiveBlending,depthWrite:false,transparent:true,opacity:op===undefined?1:op,fog:false}));s.scale.setScalar(size);return s;};

function buildTitleScene(){
  const S0=TSC;
  // cielo: degradado fijo en pantalla (lila arriba, rosa y melocotón abajo)
  S0.background=canvasTex(4,512,(g,w,h)=>{const gr=g.createLinearGradient(0,0,0,h);
    gr.addColorStop(0,'#6f55b8');gr.addColorStop(0.3,'#9a68c0');gr.addColorStop(0.55,'#d982b4');gr.addColorStop(0.75,'#f5a0a8');gr.addColorStop(1,'#ffc79a');g.fillStyle=gr;g.fillRect(0,0,w,h);},1,1);
  S0.fog=new THREE.Fog('#e89ab4',9,34);
  // luz cálida y suave: cielo rosado, rebote verde, sol de atardecer desde la derecha y relleno frontal
  S0.add(new THREE.HemisphereLight('#ffe2f0','#6f8a50',0.85));
  const sun=new THREE.DirectionalLight('#ffd2a6',0.75);sun.position.set(6,8,5);S0.add(sun);
  const fill=new THREE.DirectionalLight('#f4d8ff',0.35);fill.position.set(-3,2,8);S0.add(fill);
  // nubes rosadas arriba a la izquierda
  const cm=LM('#f2b6d6',{emissive:'#d890c0',emissiveIntensity:0.3});
  [[-7,8.5,-16,2.4],[-4.6,9.6,-17,2.0],[-9,10.3,-18,2.2],[6,10.8,-20,1.6],[8,10.2,-20,1.3]].forEach(([x,y,z,s])=>{for(let i=0;i<4;i++){const b=mk(ico(1,1),cm,x+(i-1.5)*s*0.5,y+Math.sin(i*2)*0.2*s,z,S0);b.scale.set(s*0.5,s*0.32,s*0.4);}});
  // suelo verde, colinas y camino
  const ground=mk(new THREE.CircleGeometry(60,40),LM('#7fa458'),0,0,-10,S0);ground.rotation.x=-PI/2;
  [[-14,-24,12,'#86a85c'],[10,-26,14,'#7a9c56'],[2,-34,16,'#8eaa66'],[-26,-30,14,'#94a86a']].forEach(([x,z,r,c])=>{const h=mk(ico(1,2),LM(c),x,-r*0.55,z,S0);h.scale.set(r,r*0.8,r*0.7);});
  const path=mk(new THREE.PlaneGeometry(1.5,22),LM('#d6bb86'),2.2,0.012,-6,S0);path.rotation.x=-PI/2;path.rotation.z=-0.55;
  // hierba: matas de conos
  const gm=[LM('#6a9a48'),LM('#5a8a3e'),LM('#86b05a')];
  for(let i=0;i<70;i++){const x=rr(-5,5),z=rr(-6,1.6);if(Math.abs(x)<0.5&&z>-0.6)continue;const t=new THREE.Group();t.position.set(x,0,z);S0.add(t);
    for(let k=0;k<3;k++){const c=mk(new THREE.ConeGeometry(0.035,rr(0.16,0.3),4),pick(gm),rr(-0.05,0.05),0.1,rr(-0.05,0.05),t);c.rotation.z=rr(-0.4,0.4);}}
  // árboles del juego con copa naranja (mismas piezas: tronco curvado y copas de bolas)
  const orange=PAL.orange,bark=LM('#6d4c66');
  const tTree=(x,z,s,pal)=>{const g=new THREE.Group();g.position.set(x,0,z);g.scale.setScalar(s);S0.add(g);TS.trees.push(g);
    const tp=[[0,0,0],[0.15,1.2,0],[-0.2,2.5,0.05],[0.15,3.6,0]].map(p=>new THREE.Vector3(p[0],p[1],p[2]));
    mk(taperTube(tp,0.42,0.18,8,12).g,bark,0,0,0,g);
    const P=pal||orange;[[0,4.2,0,2.3],[-1.2,3.6,0.3,1.6],[1.3,3.7,-0.2,1.7],[0.2,5.0,-0.1,1.5]].forEach(([cx,cy,cz,w],i)=>{
      const b=mk(blobs[i%3],LM(P[i%3]),cx,cy,cz,g);b.scale.set(w,w*0.62,w*0.85);});};
  tTree(-1.6,-9,0.55);tTree(2.4,-8,0.6);tTree(5.2,-11,0.7);tTree(-5.5,-13,0.75);tTree(0.6,-14,0.7);tTree(8,-15,0.8,PAL.lila);tTree(-9,-14,0.8,PAL.lila);
  // torreón de piedra con tejado naranja, ventanas encendidas y balcón de madera (solo portada)
  {const g=new THREE.Group();g.position.set(-2.4,0,-8);g.rotation.y=0.35;g.scale.setScalar(0.5);S0.add(g);TS.tower=g;
   const st=LM('#cfc6bc'),st2=LM('#b5aba2'),rf=LM('#d9823e'),rf2=LM('#b2622c'),wd=LM('#8a5e3c'),wd2=LM('#6b4429');
   mk(new THREE.CylinderGeometry(2.6,2.9,8.4,20),st,0,4.2,0,g);mk(new THREE.CylinderGeometry(3.0,3.0,0.45,20),st2,0,8.5,0,g);
   for(let i=0;i<18;i++){const a=rr(-1.2,1.6),y=rr(0.8,8);mk(new THREE.BoxGeometry(0.75,0.34,0.1),st2,Math.sin(a)*2.7,y,Math.cos(a)*2.7,g).rotation.y=a;}
   mk(new THREE.ConeGeometry(3.6,4.8,20),rf,0,11.1,0,g);mk(new THREE.TorusGeometry(3.15,0.18,6,24),rf2,0,8.85,0,g).rotation.x=PI/2;
   const lit=LM('#ffd47a',{emissive:'#ffb43c',emissiveIntensity:1});
   [[0.5,6.6],[0.15,3.2],[0.9,1.4]].forEach(([a,y])=>{const w=mk(new THREE.BoxGeometry(0.7,1.1,0.12),lit,Math.sin(a)*2.62,y,Math.cos(a)*2.62,g);w.rotation.y=a;halo(g,Math.sin(a)*3.1,y,Math.cos(a)*3.1,2.2,'#ffc060',0.45);});
   const bal=new THREE.Group();bal.position.set(0.9,5.0,2.75);bal.rotation.y=0.3;g.add(bal);mk(new THREE.BoxGeometry(3.4,0.18,1.3),wd,0,0,0,bal);
   for(let i=0;i<9;i++)mk(new THREE.BoxGeometry(0.09,0.75,0.09),wd2,-1.6+i*0.4,0.42,0.6,bal);mk(new THREE.BoxGeometry(3.4,0.1,0.12),wd2,0,0.8,0.6,bal);
   for(let i=0;i<3;i++)mk(new THREE.BoxGeometry(0.12,0.12,1.3),wd2,-1.4+i*1.4,-0.15,0,bal);}
  // ---- primer plano: el caldero negro con brillo lila ----
  const c=new THREE.Group();c.position.set(-0.08,0,0.55);c.scale.setScalar(0.33);S0.add(c);TS.caul=c;
  mk(new THREE.LatheGeometry([[0.001,0.2],[0.3,0.21],[0.52,0.32],[0.66,0.52],[0.7,0.72],[0.64,0.92],[0.56,1.02],[0.62,1.06],[0.66,1.1],[0.6,1.12],[0.54,1.08]].map(p=>new THREE.Vector2(p[0],p[1])),24),LM('#2b262e'),0,0,0,c);
  mk(new THREE.TorusGeometry(0.63,0.045,8,26),LM('#3a343e'),0,1.09,0,c).rotation.x=PI/2;
  for(let i=0;i<3;i++){const a=i*2.094+0.5,l=mk(new THREE.CylinderGeometry(0.05,0.04,0.3,6),LM('#2b262e'),Math.sin(a)*0.4,0.1,Math.cos(a)*0.4,c);l.rotation.set(Math.cos(a)*0.2,0,-Math.sin(a)*0.2);}
  TS.liq=mk(new THREE.CircleGeometry(0.57,24),new THREE.MeshBasicMaterial({color:'#c46cf2'}),0,1.05,0,c);TS.liq.rotation.x=-PI/2;
  TS.glow=halo(c,0,1.25,0,1.9,'#d88aff',0.55);halo(c,0,1.1,0.1,1.0,'#ffd0ff',0.4);
  const pl=new THREE.PointLight('#d890ff',1.0,4,1.6);pl.position.set(0,1.5,0.3);c.add(pl);
  for(let i=0;i<10;i++){const m=sprite(glowTex,pick(['#e0a8ff','#f0c8ff','#c98aff']),0.3);c.add(m);TS.steam.push({m,ph:i/10,r:rr(0.35,0.6),a:rr(0,TAU)});}
  const bm=new THREE.MeshBasicMaterial({color:'#f2d2ff',transparent:true,opacity:0.9});
  for(let i=0;i<6;i++){const m=new THREE.Mesh(SPH(1,10,8),bm);c.add(m);TS.bubbles.push({m,ph:i/6,x:rr(-0.38,0.38),z:rr(-0.38,0.38),r:rr(0.05,0.09)});}
  for(let i=0;i<8;i++){const a=i/8*TAU,s=mk(ico(1,0),LM('#8a7f7c'),Math.sin(a)*0.85,0.07,Math.cos(a)*0.85,c);s.scale.set(0.16,0.1,0.14);}
  // ---- Bruna: modelo del juego, sombrero y vestido de bruja, mirando al espectador ----
  const b=buildBruna();b.root.position.set(0.04,0,0);b.root.rotation.y=-0.12;S0.add(b.root);TS.bruna=b;
  solveLeg(b.legL,HIPW,STAND,0,0.1,AH,0.02,0);solveLeg(b.legR,-HIPW,STAND,0,-0.1,AH,0.02,0);b.pelvis.position.y=STAND;
  const hat=mkHat();hat.position.set(0,0.2,-0.01);hat.rotation.set(-0.12,0,0.08);b.head.add(hat);
  const dark=LM('#2f2440'),dark2=LM('#3a2a52',{side:THREE.DoubleSide});b.root.traverse(o=>{if(o.isMesh&&o.material&&o.material.map)o.material=o.material.side===THREE.DoubleSide?dark2:dark;});
  // varita (solo portada): palo de madera y estrella luminosa, en la mano que queda a la derecha de la pantalla
  const w=new THREE.Group();b.armL.hd.add(w);w.position.set(0,-0.05,0.01);w.rotation.set(0,0,PI);
  mk(new THREE.CylinderGeometry(0.008,0.012,0.36,6),LM('#7a4a2a'),0,0.14,0,w);
  const shp=new THREE.Shape();for(let i=0;i<10;i++){const a=i/10*TAU+PI/2,r=i%2?0.04:0.092;i?shp.lineTo(Math.cos(a)*r,Math.sin(a)*r):shp.moveTo(Math.cos(a)*r,Math.sin(a)*r);}
  const sg=new THREE.ExtrudeGeometry(shp,{depth:0.018,bevelEnabled:true,bevelThickness:0.008,bevelSize:0.006,bevelSegments:1});sg.center();
  const star=mk(sg,new THREE.MeshBasicMaterial({color:'#ffe46a'}),0,0.36,0,w);TS.star=star;
  halo(w,0,0.36,0.02,0.36,'#fff0a0',0.8);halo(w,0,0.36,0.01,0.7,'#ff9ad8',0.3);
  TS.wand=w;
  // estela en espiral rosa/lila alrededor de la estrella
  {const sw=new THREE.Group();TS.swirl=sw;sw.scale.setScalar(0.55);S0.add(sw);const pts=[];for(let i=0;i<=60;i++){const u=i/60,a=u*TAU*1.6;pts.push(new THREE.Vector3(Math.cos(a)*(0.08+u*0.3),-u*0.5+Math.sin(a*0.5)*0.03,Math.sin(a)*(0.08+u*0.3)*0.5));}
   const cur=new THREE.CatmullRomCurve3(pts);
   [[0.012,'#ffb4ea',0.85],[0.03,'#c99aff',0.3]].forEach(([r,col,op])=>sw.add(new THREE.Mesh(new THREE.TubeGeometry(cur,90,r,5,false),new THREE.MeshBasicMaterial({color:col,transparent:true,opacity:op,blending:THREE.AdditiveBlending,depthWrite:false,fog:false}))));}
  // partículas que salen de la varita
  const PC=['#fff1a0','#ffd25a','#ff9ad8','#c99aff'];
  for(let i=0;i<22;i++){const s=sprite(i%3?glowTex:sparkTex,pick(PC),0.05);S0.add(s);TS.parts.push({s,ph:i/22,sp:rr(0.7,1.2),dx:rr(-0.35,0.35),dz:rr(-0.15,0.15),sz:rr(0.04,0.09)});}
  // ---- el Conill, junto al caldero ----
  const k=buildBunny();k.root.scale.setScalar(1.4);k.root.position.set(-0.43,0,0.0);k.root.rotation.y=0.4;S0.add(k.root);TS.bunny=k;
  // ---- el unicornio del juego, a la derecha ----
  const u=uni.g.clone();u.position.set(1.08,0,-1.2);u.rotation.y=-1.05;u.scale.setScalar(0.6);S0.add(u);TS.uni=u;
  // setas blancas y azuladas
  const mush=(x,z,s,col)=>{const m=new THREE.Group();m.position.set(x,0,z);m.scale.setScalar(s);S0.add(m);mk(new THREE.CylinderGeometry(0.05,0.07,0.3,8),LM('#f5ede0'),0,0.15,0,m);
    const cap=mk(new THREE.SphereGeometry(0.2,14,8,0,TAU,0,PI/2),LM(col,{emissive:col,emissiveIntensity:0.25}),0,0.28,0,m);cap.scale.y=0.6;};
  mush(-1.25,0.55,0.75,'#f4f2ff');mush(-1.05,0.95,0.55,'#cfdcff');mush(-1.5,0.1,0.6,'#dfe8ff');mush(0.75,0.75,0.5,'#cfdcff');mush(1.35,-0.1,0.55,'#f4f2ff');mush(-0.1,1.2,0.4,'#e8eeff');
  // destellos de ambiente
  for(let i=0;i<16;i++){const s=sprite(sparkTex,pick(['#ffffff','#ffe9a8','#f0c8ff']),0.08,0);s.position.set(rr(-2.5,2.5),rr(0.5,3.2),rr(-3,0.3));S0.add(s);TS.twinkles.push({s,ph:rr(0,TAU),sp:rr(0.4,0.9),sz:rr(0.06,0.14)});}
}

/* ---------- textos, botones y zona de proves ---------- */
const SPARK4='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 0C13 7 17 11 24 12C17 13 13 17 12 24C11 17 7 13 0 12C7 11 11 7 12 0Z"/></svg>';
const RAYS='<svg viewBox="0 0 40 40" aria-hidden="true"><path d="M6 9L20 15M3 21H19M6 33L20 27"/></svg>';
{const css=document.createElement('style');css.textContent=`
@import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&display=swap');
#tscreen{position:fixed;inset:0;z-index:30;display:flex;flex-direction:column;align-items:center;justify-content:space-between;padding:calc(env(safe-area-inset-top) + 26px) 16px calc(env(safe-area-inset-bottom) + 12px);pointer-events:none;font-family:Fredoka,"Trebuchet MS",system-ui,sans-serif;color:#fff;text-align:center;transition:opacity .8s}
#tscreen.out{opacity:0}
#tscreen .top{display:flex;flex-direction:column;align-items:center}
#tscreen .hi{display:flex;align-items:center;gap:12px;font-weight:500;font-size:clamp(14px,4.1vw,20px);text-shadow:0 1px 6px rgba(70,30,110,.55)}
#tscreen .hi svg{width:15px;height:15px;fill:#e8c4ff;filter:drop-shadow(0 0 4px #f0d0ff)}
#tscreen h1{display:flex;align-items:center;gap:10px;margin:2px 0 0;font-weight:700;font-size:clamp(62px,19vw,112px);line-height:1.02;color:#fff6ea;text-shadow:0 3px 0 #b789c9,0 6px 16px rgba(70,20,100,.45);letter-spacing:.5px}
#tscreen h1 svg{width:.4em;height:.4em;fill:none;stroke:#ffd23f;stroke-width:4;stroke-linecap:round;filter:drop-shadow(0 0 4px rgba(255,210,63,.6))}
#tscreen h1 svg.r{transform:scaleX(-1)}
#tscreen h2{margin:0;font-weight:700;font-size:clamp(20px,6vw,32px);line-height:1.15;text-shadow:0 2px 0 rgba(120,60,140,.55),0 3px 10px rgba(70,20,100,.45)}
#tscreen .sub{margin-top:10px;font-weight:500;font-size:clamp(14px,3.9vw,19px);max-width:340px;line-height:1.3;text-shadow:0 1px 6px rgba(80,30,90,.7)}
#tscreen .bot{width:100%;max-width:460px;display:flex;flex-direction:column;align-items:center;gap:10px}
#tscreen .row{width:100%;display:grid;grid-template-columns:1fr auto 1fr;align-items:center}
#tplay{grid-column:2;pointer-events:auto;display:flex;align-items:center;gap:10px;border:0;border-radius:999px;background:linear-gradient(#ffd75e,#f7b12c);color:#5a2e10;font:700 clamp(28px,8vw,40px) Fredoka,system-ui;padding:12px 46px 14px;box-shadow:inset 0 3px 0 rgba(255,250,210,.7),inset 0 -4px 0 rgba(200,110,20,.35),0 5px 0 #c27a1c,0 10px 24px rgba(70,20,60,.35);cursor:pointer;animation:tp 1.6s ease-in-out infinite alternate;touch-action:manipulation}
#tplay svg{width:.62em;height:.62em;fill:#5a2e10}
#tplay:active{transform:translateY(3px) scale(.98);box-shadow:inset 0 3px 0 rgba(255,250,210,.7),0 2px 0 #c27a1c}
@keyframes tp{to{transform:scale(1.045)}}
#tgo{grid-column:3;justify-self:end;pointer-events:auto;width:76px;height:76px;margin-right:2px;border-radius:16px;border:2px solid rgba(255,255,255,.55);background:linear-gradient(160deg,rgba(150,110,220,.85),rgba(100,70,170,.85));color:#fff;font:600 10.5px/1.15 Fredoka,system-ui;padding:6px 4px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;box-shadow:0 4px 0 rgba(60,30,110,.6),0 8px 16px rgba(50,10,70,.3);cursor:pointer;touch-action:manipulation}
#tgo svg{width:18px;height:18px;fill:#ffe58a}
#tgo:active{transform:translateY(2px)}
#tscreen .cred{display:flex;align-items:center;gap:12px;width:100%;max-width:400px;font-weight:500;font-size:12.5px;text-shadow:0 1px 5px rgba(50,20,40,.85)}
#tscreen .cred:before,#tscreen .cred:after{content:'';flex:1;height:1px;background:rgba(255,255,255,.65)}
#tver{position:fixed;right:calc(env(safe-area-inset-right) + 10px);top:calc(env(safe-area-inset-top) + 8px);font:500 11px Fredoka,system-ui;color:rgba(255,255,255,.7);z-index:31;pointer-events:none}
#tproves{position:fixed;inset:0;z-index:32;display:none;align-items:center;justify-content:center;padding:20px;background:rgba(60,30,100,.55);backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);font-family:Fredoka,"Trebuchet MS",system-ui,sans-serif;color:#fff}
#tproves.on{display:flex}
#tproves .card{width:100%;max-width:360px;border-radius:24px;padding:22px 20px 18px;background:linear-gradient(170deg,#8f6ad0,#6a4aa8);border:2px solid rgba(255,255,255,.4);box-shadow:0 8px 0 rgba(50,25,90,.6),0 18px 40px rgba(30,10,50,.45);text-align:center}
#tproves h3{margin:0 0 6px;font-size:26px;font-weight:700}
#tproves p{margin:0 0 16px;font-size:15px;line-height:1.35;opacity:.92}
#tproves button{font-family:inherit;cursor:pointer;touch-action:manipulation;border:0}
#tproves .main{display:inline-flex;align-items:center;gap:8px;border-radius:999px;background:linear-gradient(#ffd75e,#f7b12c);color:#5a2e10;font-weight:700;font-size:22px;padding:10px 34px 12px;box-shadow:inset 0 2px 0 rgba(255,250,210,.7),0 4px 0 #c27a1c}
#tproves .main svg{width:16px;height:16px;fill:#5a2e10}
#tproves ul{list-style:none;margin:0 0 16px;padding:0;display:flex;flex-direction:column;gap:8px}
#tproves li button{width:100%;display:flex;align-items:center;justify-content:space-between;gap:10px;border-radius:14px;padding:12px 14px;background:rgba(255,255,255,.14);color:#fff;font-size:16px;font-weight:600;text-align:left}
#tproves li button:disabled{cursor:default;opacity:.62}
#tproves li em{flex:none;font-style:normal;font-size:12px;font-weight:600;padding:3px 9px;border-radius:999px;background:rgba(255,230,140,.9);color:#5a2e10}
#tproves .back{margin-top:12px;background:rgba(255,255,255,.18);color:#fff;font-weight:600;font-size:16px;padding:9px 26px;border-radius:999px}
@media (min-aspect-ratio:1/1){#tscreen{align-items:flex-start;padding-left:calc(env(safe-area-inset-left) + 5vw);background:linear-gradient(90deg,rgba(80,50,150,.6),rgba(80,50,150,.35) 38%,rgba(80,50,150,0) 58%)}#tscreen .top{align-items:flex-start;text-align:left;width:46vw}#tscreen .sub{max-width:none}#tscreen h1{font-size:clamp(48px,11vh,120px)}#tscreen .bot{max-width:46vw;align-items:flex-start}#tscreen .row{display:flex;gap:16px}#tscreen .cred{max-width:46vw}}
@media (min-aspect-ratio:1/1) and (max-height:520px){#tscreen .sub{display:none}#tscreen h1{font-size:clamp(40px,13vh,70px)}#tplay{font-size:26px;padding:8px 34px 10px}#tgo{width:60px;height:60px;font-size:9px}}`;document.head.appendChild(css);}
// pruebas de la zona de proves (se activan a medida que se hacen)
const PROVES=[{id:'personatge',lab:'Crea el teu personatge'},{id:'nivells',lab:'Saltar nivells'},{id:'render',lab:'Nou motor de render'},{id:'alba',lab:'Moviment estil Alba'}];
function showTitleUI(on){['hud','joy','acts','chips','top','hint','bwand','spells','ctx','tbar','frost'].forEach(id=>{const e=$(id);if(e)e.style.visibility=on?'hidden':'';});}
function provesView(v){const p=$('tproves');if(!p)return;p.classList.toggle('on',!!v);if(!v)return;
  const c=p.querySelector('.card');
  if(v==='zona')c.innerHTML=`<h3>Zona de proves</h3><p>Aquí provem coses noves abans de posar-les al joc. El que facis aquí no canvia la teva partida.</p>
    <button class="main" data-go="llista">${SPARK4}Testejar</button><br><button class="back" data-go="">Tornar</button>`;
  else c.innerHTML=`<h3>Testejar</h3><p>Tria una prova.</p><ul>${PROVES.map(t=>`<li><button disabled data-prova="${t.id}">${t.lab}<em>Aviat</em></button></li>`).join('')}</ul>
    <button class="back" data-go="zona">Tornar</button>`;}
if(TITLE.on){
  buildTitleScene();
  const d=document.createElement('div');d.id='tscreen';
  d.innerHTML=`<div class="top"><div class="hi">${SPARK4}<span>Hola! Benvingudes a la nostra aventura!</span>${SPARK4}</div>
    <h1>${RAYS}<span>Bruna,</span>${RAYS.replace('<svg','<svg class="r"')}</h1><h2>l'aprenenta de bruixa</h2>
    <div class="sub">Segueix les passes fins convertir-te en una bruixa de veritat!</div></div>
    <div class="bot"><div class="row"><button id="tplay">${SPARK4}<span>Juga</span></button>
      <button id="tgo" aria-label="Accedir a la zona de proves">${SPARK4}<span>Accedir a la zona de proves</span></button></div>
      <div class="cred">Un joc creat per Ayla Sainz i Pere Nadal</div></div>`;
  document.body.appendChild(d);
  const v=document.createElement('div');v.id='tver';v.textContent='v.1.2';document.body.appendChild(v);
  const p=document.createElement('div');p.id='tproves';p.innerHTML='<div class="card"></div>';document.body.appendChild(p);
  p.addEventListener('click',e=>{const t=e.target.closest('[data-go]');if(t){sfx('click');provesView(t.dataset.go);}else if(e.target===p)provesView('');});
  [d,p].forEach(e=>e.addEventListener('pointerdown',ev=>ev.stopPropagation()));
  showTitleUI(true);
  $('tplay').addEventListener('click',startGame);
  $('tgo').addEventListener('click',()=>{audioInit();sfx('click');provesView('zona');});
}
function startGame(){if(!TITLE.on)return;TITLE.on=false;audioInit();sfx('magic');$('tscreen').classList.add('out');
  setTimeout(()=>{['tscreen','tver','tproves'].forEach(id=>{const e=$(id);if(e)e.remove();});},900);
  camera.fov=38;camera.updateProjectionMatrix();startIntro();}

/* ---------- inicio de partida: la cámara da una vuelta de 360° alrededor de Bruna (encàrrec v.1, 2.7) ----------
   Empieza alta y lejos, gira despacio y acaba a su espalda, a la distancia por defecto (cam.dist).
   Los controles se ocultan durante la vuelta; tocar la pantalla o pulsar una tecla la salta. */
const INTRO={on:false,t:0,T:7,end:{yaw:0,pitch:0,dist:0}};
function startIntro(){INTRO.on=true;INTRO.t=0;INTRO.t0=performance.now();INTRO.end={yaw:S.yaw+PI,pitch:cam.pitch,dist:cam.dist};introCam(0);}
function endIntro(){if(!INTRO.on)return;INTRO.on=false;Object.assign(cam,INTRO.end);showTitleUI(false);startLead();}   // la primera vegada, en Conillet la guia
function introCam(u){const e=u*u*(3-2*u),E=INTRO.end;
  // comença molt amunt (vista d'ocell, ~65°) i lluny, i baixa mentre gira fins a l'esquena de la Bruna
  cam.yaw=E.yaw-(1-e)*TAU;cam.dist=E.dist*(2.3-1.3*e);cam.pitch=E.pitch+(1-e)*0.78;}
function introStep(dt){if(!INTRO.on)return;INTRO.t+=dt;const u=Math.min(1,INTRO.t/INTRO.T);introCam(u);if(u>=1)endIntro();}
const introSkip=()=>{if(INTRO.on&&performance.now()-INTRO.t0>300)endIntro();};   // (no salta con el mismo toque de «Juga»)
addEventListener('pointerdown',introSkip,true);addEventListener('keydown',introSkip,true);

/* ---------- cada fotograma: encuadre según la pantalla y la escena viva (todo muy sutil) ---------- */
function titleCam(){
  // cámara baja que mira un poco hacia arriba (como la ilustración); en pantallas más estrechas que un móvil
  // normal se aleja para que no se corte a Bruna, y en horizontal se acerca un poco y se ve más paisaje
  // (en horizontal los textos van a la izquierda y la cámara se desplaza para que Bruna quede a la derecha)
  const C=TITLE.cam,wide=camera.aspect>1,k=camera.aspect<C.asp?C.asp/camera.aspect:wide?0.85:1;
  const ox=wide?-0.42*C.z*k*Math.tan((C.fovH)*PI/360)*camera.aspect:0;
  camera.position.set(C.x+ox,C.ly+(C.y-C.ly)*k,C.z*k);camera.lookAt(C.lx+ox,C.ly,0);
  const fov=camera.aspect>1?C.fovH:C.fov;
  if(Math.abs(camera.fov-fov)>0.01){camera.fov=fov;camera.updateProjectionMatrix();}
}
const _tv=new THREE.Vector3();
function titleStep(dt){
  introStep(dt);if(!TITLE.on)return;TITLE.t+=dt;const t=TITLE.t;
  titleCam();
  // Bruna: respira, balanceo suave, parpadeo y la varita que se mueve un poco
  const b=TS.bruna;
  b.chest.scale.set(1+Math.sin(t*1.6)*0.008,1+Math.sin(t*1.6)*0.012,1);b.root.rotation.z=Math.sin(t*0.7)*0.012;
  b.armL.sh.rotation.set(-0.35+Math.sin(t*1.1)*0.04,0,2.05+Math.sin(t*0.9)*0.05);b.armL.el.rotation.set(-0.2,0,0.85+Math.sin(t*1.3)*0.06);
  b.armR.sh.rotation.set(0.05,0,-0.2+Math.sin(t*1.6)*0.015);b.armR.el.rotation.set(-0.25,0,0);
  b.head.rotation.set(0.04+Math.sin(t*0.8)*0.02,0.12+Math.sin(t*0.5)*0.06,0.06);
  const bl=(t%4.2)>4.05;b.eyes.forEach(e=>e.scale.y=bl?0.12:1);
  // estrella de la varita, espiral y partículas
  TS.star.rotation.y=Math.sin(t*1.5)*0.5;TS.star.scale.setScalar(1+Math.sin(t*3)*0.07);
  TS.star.getWorldPosition(_tv);TS.swirl.position.copy(_tv);TS.swirl.rotation.y=t*0.9;
  for(const p of TS.parts){const u=(t*0.32*p.sp+p.ph)%1;p.s.position.set(_tv.x+p.dx*u*0.8+Math.sin(t*2+p.ph*9)*0.03,_tv.y-0.02+u*0.75,_tv.z+p.dz*u);
    p.s.material.opacity=Math.sin(u*PI)*(0.6+0.4*Math.sin(t*7+p.ph*20));p.s.scale.setScalar(p.sz*(1-u*0.5));}
  // caldero: vapor lila, burbujas y brillo
  for(const s of TS.steam){const u=(t*0.18+s.ph)%1,a=s.a+u*3;s.m.position.set(Math.sin(a)*(0.08+u*0.25),1.15+u*1.3,Math.cos(a)*(0.08+u*0.15));s.m.scale.setScalar(s.r*(0.6+u*0.9));s.m.material.opacity=Math.sin(u*PI)*0.55;}
  for(const s of TS.bubbles){const u=(t*0.6+s.ph)%1;s.m.position.set(s.x,1.05+u*0.08,s.z);s.m.scale.setScalar(s.r*Math.sin(u*PI));}
  TS.glow.material.opacity=0.5+Math.sin(t*1.4)*0.1;
  // Conill y unicornio
  const k=TS.bunny;k.head.rotation.y=Math.sin(t*0.6)*0.3;k.nose.position.y=-0.018+Math.sin(t*14)*0.002;k.ears.forEach((e,i)=>e.g.rotation.x=Math.sin(t*1.3+i)*0.12);
  TS.uni.position.y=Math.sin(t*1.2)*0.01;
  // destellos de ambiente
  for(const s of TS.twinkles){const v=Math.max(0,Math.sin(t*s.sp+s.ph));s.s.material.opacity=v*v*0.9;s.s.scale.setScalar(s.sz*(0.5+v*0.5));}
}
Object.assign(window.__j,{TITLE,TS,TSC,INTRO,endIntro,startGame,provesView,camera});
