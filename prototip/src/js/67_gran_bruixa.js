/* =====================================================================
   LA GRAN BRUIXA (prova, en Pere, 19-11-2026) — referència: la fitxa «La Gran Bruixa»
   Molt gran, vestit llarg negre amb vores lila, capa lila, barret morat amb sivella, cabell negre molt arrissat,
   sabates de taló lila fosc i un ceptre fosc amb una bola de foc fosca (flames lila).
   De moment només a les proves (Provar nivells i Pantalla d'inici): espera la Bruna a la sala del tron
   al costat del tron, i és ELLA qui parla (el torreó ja no parla: TXT.voz = «La Gran Bruixa»).
   Quan parla: mou la boca, assenteix i fa gestos amb la mà; si la Bruna s'acosta, la mira.
   ===================================================================== */
const GBX={on:PLAY&&PROVA.on&&(NIVELL_PROVA||INICI_PROVA),g:null,head:null,mouth:null,armL:null,armR:null,flames:[],orb:null,light:null,t:0,talk:0,
  pos:{x:1.55,z:-1.45},yaw:-0.3};
function buildGranBruixa(){
  const g=new THREE.Group(),skin=LM('#9a6644'),skinD=LM('#86573a'),dress=LM('#231b28'),trim=LM('#7a4fa2'),cape=LM('#8c62b4',{side:THREE.DoubleSide}),
    hatM=LM('#3b2549'),band=LM('#271731'),hair=LM('#141115'),shoe=LM('#4a2a5c'),wood=LM('#3a2b2e'),white=LM('#fbf6ee'),black=LM('#1a1213');
  // vestit llarg (perfil de torn) amb vora lila a baix i a les mànigues
  mk(new THREE.LatheGeometry([[0.001,0.08],[0.46,0.08],[0.44,0.4],[0.38,0.8],[0.33,1.05],[0.35,1.25],[0.31,1.42],[0.17,1.5],[0.001,1.52]].map(p=>new THREE.Vector2(p[0],p[1])),28),dress,0,0,0,g);
  mk(new THREE.CylinderGeometry(0.465,0.47,0.12,28,1,true),trim,0,0.12,0,g);
  // sabates de taló
  [1,-1].forEach(s=>{mk(RBox(0.13,0.08,0.24,0.04),shoe,s*0.13,0.04,0.12,g);mk(new THREE.BoxGeometry(0.05,0.08,0.05),shoe,s*0.13,0.02,0.02,g);});
  // capa per darrere, amb coll
  mk(new THREE.CylinderGeometry(0.3,0.6,1.42,24,1,true,PI*0.6,PI*0.8),cape,0,0.78,0,g).rotation.y=0;
  mk(new THREE.TorusGeometry(0.19,0.035,6,18),cape,0,1.47,0,g).rotation.x=PI/2;mk(SPH(0.03,8,6),LM('#c9a6ff',{emissive:'#7a4fa2',emissiveIntensity:0.4}),0,1.45,0.19,g);
  // braços: espatlla → colze (màniga ampla amb puny lila) → mà
  const arm=s=>{const sh=new THREE.Group();sh.position.set(s*0.3,1.4,0);g.add(sh);
    mk(new THREE.CylinderGeometry(0.075,0.09,0.36,12),dress,0,-0.18,0,sh);const el=new THREE.Group();el.position.y=-0.36;sh.add(el);
    mk(new THREE.CylinderGeometry(0.09,0.14,0.32,12),dress,0,-0.16,0,el);mk(new THREE.CylinderGeometry(0.145,0.145,0.07,12,1,true),trim,0,-0.3,0,el);
    const hd=mk(SPH(0.065,10,8),skin,0,-0.38,0,el);hd.scale.set(0.9,1.1,0.8);return {sh,el,hd,s};};
  const armL=arm(1),armR=arm(-1);
  // ceptre a la mà dreta: fusta torta, urpa, bola fosca i flames lila
  // (el ceptre és dret al costat, recolzat a terra, i la mà l'agafa a mitja alçada, com a la fitxa)
  {const st=new THREE.Group();st.position.set(-0.5,0,0.24);g.add(st);GBX.staff=st;
   const pts=[];for(let i=0;i<=8;i++){const u=i/8;pts.push(new THREE.Vector3(Math.sin(u*9)*0.03,u*2.12,Math.cos(u*7)*0.03));}
   mk(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts),24,0.03,6),wood,0,0,0,st);
   for(let i=0;i<4;i++){const a=i/4*TAU,c=mk(new THREE.ConeGeometry(0.02,0.16,5),wood,Math.sin(a)*0.07,2.2,Math.cos(a)*0.07,st);c.rotation.set(Math.cos(a)*0.6,0,-Math.sin(a)*0.6);}
   GBX.orb=mk(SPH(0.09,16,12),LM('#2a1038',{emissive:'#5a1f8a',emissiveIntensity:0.6}),0,2.28,0,st);
   const fm=['#b26bff','#7a3fd0','#e0b0ff'].map(c=>new THREE.MeshBasicMaterial({color:c,transparent:true,opacity:0.85,depthWrite:false}));
   for(let i=0;i<9;i++){const a=i/9*TAU,f=mk(new THREE.ConeGeometry(0.05,0.22,5),fm[i%3],Math.sin(a)*0.07,2.36,Math.cos(a)*0.07,st);f.rotation.set(Math.cos(a)*0.4,0,-Math.sin(a)*0.4);GBX.flames.push({m:f,ph:i*0.7});}
   halo(st,0,2.3,0,1.1,'#b26bff',0.55);GBX.light=new THREE.PointLight('#b26bff',0.9,6,1.6);GBX.light.position.set(0,2.3,0);st.add(GBX.light);}
  // cap: cara, nas gran, ulls, somriure; cabell negre molt arrissat
  const head=new THREE.Group();head.position.set(0,1.72,0.02);g.add(head);
  mk(SPH(0.2,22,16),skin,0,0,0,head).scale.set(1,1.08,0.98);
  mk(new THREE.CylinderGeometry(0.075,0.09,0.14,12),skin,0,-0.2,0,head);
  const nose=mk(SPH(1,12,10),skinD,0,-0.015,0.2,head);nose.scale.set(0.05,0.06,0.07);
  [1,-1].forEach(s=>{const e=new THREE.Group();e.position.set(s*0.075,0.045,0.17);head.add(e);mk(SPH(0.04,12,10),white,0,0,0,e).scale.z=0.5;mk(SPH(0.022,10,8),black,0,0,0.014,e).scale.z=0.5;
    const br=mk(SPH(1,8,6),hair,s*0.08,0.11,0.17,head);br.scale.set(0.05,0.012,0.012);br.rotation.z=-s*0.15;
    const ck=mk(SPH(0.035,10,8),LM('#c46a5a'),s*0.12,-0.05,0.14,head);ck.scale.z=0.3;});
  GBX.mouth=mk(new THREE.TorusGeometry(0.06,0.012,6,14,PI*0.75),LM('#5a2328'),0,-0.09,0.165,head);GBX.mouth.rotation.z=-PI/2-PI*0.375;
  for(let i=0;i<46;i++){const a=hrr(-PI*0.62,PI*0.62)+PI,e=hrr(-0.9,1.1),r=0.23+hrr(0,0.09),x=Math.sin(a)*Math.cos(e)*r*1.15,y=Math.sin(e)*r*0.9-0.06,z=Math.cos(a)*Math.cos(e)*r;
    const rad=hrr(0.07,0.12);mk(SPH(rad,8,6),hair,x,y,z-0.03,head);}
  for(let i=0;i<22;i++){const s=i%2?1:-1,y=hrr(-0.45,-0.05),x=s*hrr(0.12,0.3),z=hrr(-0.25,0.0);mk(SPH(hrr(0.08,0.12),8,6),hair,x,y,z,head);}
  // barret morat: ala, con tort, cinta i sivella
  {const h=new THREE.Group();h.position.set(0,0.17,-0.01);h.rotation.set(-0.05,0,0.06);head.add(h);
   mk(new THREE.CylinderGeometry(0.5,0.52,0.03,30),hatM,0,0,0,h);mk(new THREE.CylinderGeometry(0.2,0.27,0.3,22),hatM,0,0.15,0,h);
   const up=mk(new THREE.ConeGeometry(0.2,0.48,20),hatM,0.05,0.53,-0.02,h);up.rotation.z=-0.35;
   mk(new THREE.CylinderGeometry(0.272,0.272,0.07,22),band,0,0.06,0,h);mk(new THREE.BoxGeometry(0.11,0.08,0.02),LM('#6a4a8a'),0,0.06,0.275,h);mk(new THREE.BoxGeometry(0.06,0.04,0.025),band,0,0.06,0.278,h);}
  g.traverse(o=>{if(o.isMesh&&!(o.material.isMeshBasicMaterial))o.castShadow=true;});
  GBX.head=head;GBX.armL=armL;GBX.armR=armR;
  // postura de repòs: mà dreta agafant el ceptre al davant, l'esquerra avall
  armR.sh.rotation.set(-0.3,0,-0.32);armR.el.rotation.set(-0.7,0,0.1);armL.sh.rotation.set(0,0,0.12);armL.el.rotation.set(-0.2,0,0);
  return g;
}
function gbStep(dt){
  if(!GBX.on||!GBX.g)return;GBX.t+=dt;const t=GBX.t;
  // parla quan el diàleg és seu
  const dl=$('dlg'),mine=dl&&dl.classList.contains('on')&&dl.querySelector('b')&&dl.querySelector('b').textContent===TXT.voz;
  GBX.talk+=((mine?1:0)-GBX.talk)*(1-Math.exp(-dt*6));
  // respira; mira la Bruna si és a prop (coordenades del torreó)
  GBX.g.scale.y=1+Math.sin(t*1.4)*0.006;
  const l=toLoc(S.pos.x,S.pos.z,S.y),dx=l.x-GBX.pos.x,dz=l.z-GBX.pos.z,d=Math.hypot(dx,dz),near=mode==='tower'&&l.y<2&&d<7;
  const look=near?clamp(wrapA(Math.atan2(dx,dz)-GBX.yaw),-0.9,0.9):Math.sin(t*0.35)*0.3;
  GBX.head.rotation.y+=(look-GBX.head.rotation.y)*(1-Math.exp(-dt*3));
  GBX.head.rotation.x=-0.05+GBX.talk*Math.sin(t*4.2)*0.05;
  GBX.mouth.scale.set(1,1+GBX.talk*(0.5+0.5*Math.sin(t*13))*1.2,1);
  // gestos de la mà esquerra quan parla
  GBX.armL.sh.rotation.x+=((-0.9*GBX.talk-0.05+Math.sin(t*2.1)*0.25*GBX.talk)-GBX.armL.sh.rotation.x)*(1-Math.exp(-dt*5));
  GBX.armL.sh.rotation.z+=((0.12+0.35*GBX.talk)-GBX.armL.sh.rotation.z)*(1-Math.exp(-dt*5));
  GBX.armL.el.rotation.x+=((-0.2-0.9*GBX.talk)-GBX.armL.el.rotation.x)*(1-Math.exp(-dt*5));
  // foc fosc del ceptre
  for(const f of GBX.flames){const k=1+0.3*Math.sin(t*9+f.ph)+0.15*Math.sin(t*15.7+f.ph*2);f.m.scale.set(1,k,1);}
  GBX.light.intensity=0.8+0.25*Math.sin(t*7)+0.4*GBX.talk;GBX.orb.material.emissiveIntensity=0.5+0.3*Math.sin(t*3)+0.4*GBX.talk;
  // no es pot travessar
  if(near&&d<0.85&&d>1e-3){const k=0.85/d;const wx=GBX.pos.x+dx*k,wz=GBX.pos.z+dz*k;S.pos.x+=wx-l.x;S.pos.z+=wz-l.z;}
}
if(GBX.on){
  TXT.voz='La Gran Bruixa';   // a les proves, la que parla és ella (no el torreó)
  GBX.g=buildGranBruixa();GBX.g.position.set(GBX.pos.x,L(0),GBX.pos.z);GBX.g.rotation.y=GBX.yaw;G[0].add(GBX.g);
}
Object.assign(window.__j,{GBX,buildGranBruixa});
