/* =====================================================================
   ZONA DE PROVES · «MÓN SUBMARÍ (NIVELL 2)» — previa (encàrrec ENCARGO-NIVELL-2-PREVIA.md, pas 1)
   ?prova=submari. Fa servir el motor de nedar de 66_proves_aigua.js (AQ.sub) amb un món propi:
     · superfície: mar obert i l'illa de l'arc de Sant Martí amb l'unicorn (punt d'arribada i de tornada);
     · fons marí (~8,5 m) amb les quatre zones de la làmina (referencias/mapa-nivell-2.jpg), unides per camins de sorra:
       la casa submarina, el bosc d'algues, la cova (cristalls blaus) i el vaixell enfonsat (amb tresors).
   Pas 1 = formes bàsiques per veure el mapa i nedar-hi. Fauna, detall de zones, poders i arribada: passos 2–5.
   Sense el Conill (no és al nivell 2).
   ===================================================================== */
const SUBZ={casa:{x:-15,z:9},bosc:{x:-2,z:-18},cova:{x:17,z:-15},vaixell:{x:15,z:11}};
const SUB_DEPTH=-8.5;
function subFloor(x,z){
  const r=Math.hypot(x,z);
  let y=SUB_DEPTH+0.6*Math.sin(x*0.13)*Math.cos(z*0.11)+0.35*Math.sin(x*0.37+z*0.29)+Math.max(0,r-36)*0.55;
  // el pilar de l'illa: el fons puja a sota seu
  y+=Math.max(0,5.2-r)*0.9;
  return y;
}
// camins de sorra clara del centre a cada zona (segment fins a la zona)
function subPathD(x,z){let m=1e9;for(const k in SUBZ){const Z=SUBZ[k],l2=Z.x*Z.x+Z.z*Z.z,u=clamp((x*Z.x+z*Z.z)/l2,0,1),px=Z.x*u,pz=Z.z*u;m=Math.min(m,Math.hypot(x-px,z-pz));}return m;}
function subFloorColor(x,z,c){const p=sat(1-(subPathD(x,z)-1.2)/1.4);c.set('#7fae8a').lerp(new THREE.Color('#e9dcae'),p*0.85);
  if(Math.hypot(x,z)>34)c.lerp(new THREE.Color('#6a8a90'),0.4);}
function subFog(camY,under){if(!under)return;const k=sat(-camY/9);AQS.background.set('#2a95a8').lerp(new THREE.Color('#123f5e'),k);AQS.fog.color.copy(AQS.background);AQS.fog.near=1;AQS.fog.far=34-k*8;}
function subBuild(S0){
  const L2=(c,o)=>LM(c,o);
  // ---- l'illa de l'arc de Sant Martí: pilar de roca i cim amb franges de colors ----
  {const top=AQ_ISLE.top,R=AQ_ISLE.r;
   const tex=canvasTex(256,256,(g,w,h)=>{const C=['#ff7f7f','#ffb36a','#ffe27a','#8fe08a','#7fc0ff','#b79aff'];for(let i=0;i<6;i++){g.fillStyle=C[i];g.beginPath();g.arc(128,128,128-i*15,0,TAU);g.fill();}g.fillStyle='#f6e7c0';g.beginPath();g.arc(128,128,40,0,TAU);g.fill();},1,1);
   const disc=mk(new THREE.CylinderGeometry(R,R+0.25,0.3,40),[L2('#d8c49a'),new THREE.MeshLambertMaterial({map:tex}),L2('#d8c49a')],0,top-0.15,0,S0);disc.receiveShadow=true;
   const yb=subFloor(R+1.5,0);mk(new THREE.CylinderGeometry(R+0.2,R+2.2,top-0.3-yb,24),L2('#8f8678'),0,(top-0.3+yb)/2,0,S0);
   for(let i=0;i<10;i++){const a=i/10*TAU+0.3,r=mk(ico(1,1),L2('#a39a8a'),Math.sin(a)*(R+0.3),top-0.35,Math.cos(a)*(R+0.3),S0);r.scale.set(0.5,0.32,0.45);}
   // l'unicorn s'hi queda (punt de tornada)
   const u=uni.g.clone();u.position.set(0.9,top,-1.0);u.rotation.y=-2.4;u.scale.setScalar(0.85);S0.add(u);AQX.uni=u;}
  // ---- la casa submarina (formes bàsiques) ----
  {const Z=SUBZ.casa,g=new THREE.Group();g.position.set(Z.x,subFloor(Z.x,Z.z),Z.z);g.rotation.y=0.9;S0.add(g);AQX.casa=g;
   const st=L2('#8fa0b0'),wd=L2('#8a5d3a');
   mk(new THREE.BoxGeometry(3.4,2.6,3.0),st,0,1.3,0,g);
   const roof=mk(new THREE.ConeGeometry(2.8,1.6,4),wd,0,3.4,0,g);roof.rotation.y=PI/4;
   const shell=mk(new THREE.ConeGeometry(0.85,2.0,18),L2('#f4c8b8'),0.4,4.5,0,g);shell.rotation.z=-1.1;
   for(let i=0;i<4;i++){const t=mk(new THREE.TorusGeometry(0.75-i*0.16,0.1,6,18),L2('#eab0a0'),0.4+i*0.38,4.5+i*0.2,0,g);t.rotation.y=PI/2;t.rotation.x=0.3;}
   mk(new THREE.CylinderGeometry(0.25,0.3,1.2,10),L2('#9aa8b4'),-1.0,3.9,-0.6,g);
   [[-0.9,1.5],[0.9,1.5]].forEach(([x,y])=>{const w=mk(new THREE.TorusGeometry(0.32,0.07,8,18),L2('#b8a07a'),x,y,1.51,g);mk(new THREE.CircleGeometry(0.3,18),L2('#9fd8ff',{emissive:'#3f8ab0',emissiveIntensity:0.4}),x,y,1.5,g);});
   mk(new THREE.BoxGeometry(0.9,1.5,0.1),L2('#6b4429'),0,0.75,1.52,g);
   ['#ff7f8f','#ffd25a','#8fe08a','#b79aff'].forEach((c,i)=>{const s=mk(new THREE.ShapeGeometry(starShape(0.18,0.08)),L2(c,{side:THREE.DoubleSide}),-1.3+i*0.85,2.2-(i%2)*0.5,1.53,g);});
   [[2.4,1.0,'#3f6fe0'],[2.9,0.2,'#ff6fb0'],[2.2,-0.8,'#3f6fe0']].forEach(([x,z,c])=>{mk(new THREE.CylinderGeometry(0.12,0.16,0.9,8),L2('#f4ecdc'),x,0.45,z,g);const cp=mk(new THREE.SphereGeometry(0.55,14,8,0,TAU,0,PI/2),L2(c,{emissive:c,emissiveIntensity:0.25}),x,0.85,z,g);cp.scale.y=0.6;});}
  // ---- el bosc d'algues: algues molt altes verdes i grogues ----
  {const Z=SUBZ.bosc,cols=['#5fae4a','#b8c84a','#3f8a5a','#8fbf3a'];
   for(let i=0;i<34;i++){const a=hrr(0,TAU),d=Math.sqrt(HR())*6.5,x=Z.x+Math.sin(a)*d,z=Z.z+Math.cos(a)*d,y=subFloor(x,z);
     let par=new THREE.Group();par.position.set(x,y,z);par.rotation.y=hrr(0,TAU);S0.add(par);const segs=[],n=8+Math.floor(HR()*6),h=hrr(0.55,0.75),col=L2(cols[i%4],{side:THREE.DoubleSide});
     for(let k=0;k<n;k++){const s=new THREE.Group();s.position.y=k?h:0;par.add(s);mk(new THREE.BoxGeometry(0.34-k*0.012,h,0.03),col,0,h/2,0,s);segs.push(s);par=s;}
     AQX.weeds.push({segs,ph:hrr(0,TAU),sp:hrr(0.5,0.9)});}
   for(let i=0;i<8;i++){const a=hrr(0,TAU),d=hrr(1,7),x=Z.x+Math.sin(a)*d,z=Z.z+Math.cos(a)*d,r=mk(ico(1,1),L2('#7f8a7a'),x,subFloor(x,z)+0.2,z,S0);r.scale.set(hrr(0.6,1.2),hrr(0.4,0.8),hrr(0.6,1.1));mk(ico(1,1),L2('#5f9a4a'),x,subFloor(x,z)+0.5,z,S0).scale.set(0.6,0.15,0.55);}}
  // ---- la cova: roca gran amb entrada fosca i cristalls blaus brillants ----
  {const Z=SUBZ.cova,y=subFloor(Z.x,Z.z),g=new THREE.Group();g.position.set(Z.x,y,Z.z);g.rotation.y=Math.atan2(-Z.x,-Z.z);S0.add(g);AQX.cova=g;
   const rk=mk(ico(1,2),L2('#6f7a8a'),0,2.4,-1,g);rk.scale.set(6,4.6,5);
   const mouth=mk(new THREE.SphereGeometry(1,20,14,0,TAU,0,PI/2),new THREE.MeshBasicMaterial({color:'#0b1622'}),0,0,3.6,g);mouth.scale.set(2.2,3.0,1.2);mouth.rotation.x=-PI/2;
   const cm=new THREE.MeshLambertMaterial({color:'#7fe8ff',emissive:'#3fc0ff',emissiveIntensity:0.9});
   [[-2.4,0.3,3.6,0.6],[2.5,0.2,3.4,0.7],[-1.8,0.2,3.9,0.4],[3.0,1.4,3.0,0.45],[-3.2,1.6,2.6,0.5]].forEach(([x,yy,z,s])=>{for(let k=0;k<3;k++){const c=mk(new THREE.OctahedronGeometry(s*(1-k*0.25),0),cm,x+k*0.25,yy+s*1.1,z+k*0.1,g);c.scale.y=1.9;c.rotation.z=(k-1)*0.4;}});
   halo(g,0,1.4,4,4,'#5fd8ff',0.35);const pl=new THREE.PointLight('#5fd8ff',1.2,10,1.6);pl.position.set(0,1.5,3.5);g.add(pl);}
  // ---- el vaixell enfonsat (amb tresors) ----
  {const Z=SUBZ.vaixell,y=subFloor(Z.x,Z.z),g=new THREE.Group();g.position.set(Z.x,y+0.4,Z.z);g.rotation.set(0,-0.7,0.22);S0.add(g);AQX.vaixell=g;
   const wd=L2('#7a5534'),wd2=L2('#5e3f26');
   mk(new THREE.BoxGeometry(7,1.6,2.6),wd,0,0.6,0,g);const bow=mk(new THREE.ConeGeometry(1.3,2.2,4),wd,4.3,0.6,0,g);bow.rotation.z=-PI/2;bow.rotation.x=PI/4;bow.scale.set(1,1,0.7);
   mk(new THREE.BoxGeometry(2,1.2,2.6),wd2,-2.6,1.8,0,g);mk(new THREE.BoxGeometry(6.6,0.12,2.4),wd2,0.2,1.42,0,g);
   const m1=mk(new THREE.CylinderGeometry(0.12,0.15,4.2,8),wd2,0.8,3.4,0,g);m1.rotation.z=0.25;mk(new THREE.CylinderGeometry(0.1,0.13,2.4,8),wd2,-1.2,2.6,0,g).rotation.z=-0.4;
   const sail=mk(new THREE.PlaneGeometry(1.8,1.4),L2('#e8dcc0',{side:THREE.DoubleSide}),1.0,3.8,0.1,g);sail.rotation.set(0.2,0.3,0.4);
   for(let i=0;i<4;i++){const cn=mk(new THREE.CylinderGeometry(0.12,0.12,0.5,8),L2('#3a3a40'),-1.6+i*1.2,0.6,1.35,g);cn.rotation.x=PI/2;}
   // àncora, canó i cofres amb monedes al costat
   const ox=Z.x-3.5,oz=Z.z+3.2,oy=subFloor(ox,oz);const an=new THREE.Group();an.position.set(ox,oy+0.9,oz);an.rotation.z=0.4;S0.add(an);
   mk(new THREE.CylinderGeometry(0.08,0.08,1.6,8),L2('#4a4a52'),0,0,0,an);mk(new THREE.TorusGeometry(0.5,0.08,6,16,PI),L2('#4a4a52'),0,-0.75,0,an).rotation.z=PI;
   [[Z.x+2.5,Z.z+4.2],[Z.x-1,Z.z+4.8]].forEach(([x,z],i)=>{const cy=subFloor(x,z),c=new THREE.Group();c.position.set(x,cy,z);c.rotation.y=i*0.8;S0.add(c);
     mk(new THREE.BoxGeometry(0.9,0.55,0.6),wd,0,0.28,0,c);const lid=mk(new THREE.BoxGeometry(0.9,0.12,0.6),wd2,0,0.62,-0.2,c);lid.rotation.x=-0.9;lid.position.z=-0.25;
     for(let k=0;k<10;k++)mk(new THREE.CylinderGeometry(0.07,0.07,0.02,10),L2('#ffd23a',{emissive:'#b08010',emissiveIntensity:0.4}),hrr(-0.35,0.35),0.57+hrr(0,0.05),hrr(-0.2,0.2),c);
     for(let k=0;k<6;k++)mk(new THREE.CylinderGeometry(0.07,0.07,0.02,10),L2('#ffd23a',{emissive:'#b08010',emissiveIntensity:0.4}),hrr(-0.9,0.9),0.02,hrr(0.4,0.9),c);});}
  // ---- esculls de corall de colors pels voltants ----
  const cc=['#ff7f8f','#ff9f5a','#c98aff','#ffd25a','#ff6fb0','#5fd0c0'];
  for(let i=0;i<30;i++){const a=hrr(0,TAU),d=hrr(26,36),x=Math.sin(a)*d,z=Math.cos(a)*d,y=subFloor(x,z),col=L2(cc[i%6]);
    for(let k=0;k<5;k++){const b=mk(new THREE.CylinderGeometry(hrr(0.08,0.16),hrr(0.18,0.28),hrr(0.6,1.6),7),col,x+hrr(-0.6,0.6),y+0.4,z+hrr(-0.6,0.6),S0);b.rotation.set(hrr(-0.3,0.3),0,hrr(-0.3,0.3));}}
}
PROVA_OPEN.submari=()=>{location.href=location.pathname+'?prova=submari';};
Object.assign(window.__j,{SUBZ,subFloor});
