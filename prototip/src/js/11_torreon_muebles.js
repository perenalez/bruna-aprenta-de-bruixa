/* =====================================================================
   MOBILIARIO Y SALAS
   ===================================================================== */
const LB={},GB={};[-1,0,1,2,3].forEach(n=>{LB[n]=TBatch();GB[n]=TBatch();});
const CAUL={};          // calderos por planta: {g,lm} (lo usa 55_pociones.js)
const wM=(n,th,inset,rad)=>TRS(Math.sin(th)*((rad||RM)-inset),L(n),Math.cos(th)*((rad||RM)-inset),0,th+PI,0);
const at=(x,n,z,ry,s)=>TRS(x,L(n),z,0,ry||0,0,s||1);
const flameGeo=new THREE.LatheGeometry([[0.001,0],[0.4,0.07],[0.6,0.3],[0.5,0.56],[0.25,0.82],[0.0001,1.08]].map(p=>new THREE.Vector2(p[0],p[1])),7);
const mFl=['#f0652a','#ffa52e','#ffe27a','#b26cff','#e2b8ff'].map(c=>new THREE.MeshBasicMaterial({color:c}));
function tongue(parent,x,y,z,s,ci,sp){const m=new THREE.Mesh(flameGeo,mFl[ci]);m.position.set(x,y,z);m.scale.setScalar(s);parent.add(m);flames.push({m,s,ph:rr(0,6.28),sp:sp||rr(8,12)});return m;}
const _v=new THREE.Vector3();
const fl=(n,M,x,y,z,s,ci)=>{_v.set(x,y,z).applyMatrix4(M);tongue(G[n],_v.x,_v.y,_v.z,s,ci===undefined?2:ci,13);};
const colM=(k,M,x,z,r)=>{_v.set(x,0,z).applyMatrix4(M);col(k,_v.x,_v.z,r);};
const barrelG=new THREE.LatheGeometry([[0.001,0],[0.3,0],[0.355,0.22],[0.37,0.4],[0.355,0.58],[0.3,0.8],[0.001,0.8]].map(p=>new THREE.Vector2(p[0],p[1])),14);
const hemiG=new THREE.SphereGeometry(1,14,7,0,TAU,0,PI/2);
const BK=['#7a3b34','#4d5a3c','#6b4a2e','#3f4a66','#8a6a3a','#5a3340','#8c4a2a','#51614f','#3d3540'],PC=['#3f6fe0','#e23b3b','#c44fe0','#4fd04a','#f0d436','#ef6fb0','#38b8e8'];
const FURN={
  table(n,M,w,d,h,c){const b=LB[n];b.base=M;b.box(c||'#6b4a30',0,h,0,w,0.08,d);[[-1,-1],[1,-1],[-1,1],[1,1]].forEach(([i,j])=>b.box('#553924',i*(w/2-0.09),h/2,j*(d/2-0.09),0.09,h,0.09));b.box('#553924',0,h*0.3,0,w-0.2,0.05,0.05);
    const k=Math.max(1,Math.round(w/0.8));for(let i=0;i<k;i++)colM(n,M,(i-(k-1)/2)*(w/k),0,Math.min(w/k,d)*0.55);},
  stool(n,M){const b=LB[n];b.base=M;b.cyl('#806245',0,0.45,0,0.28,0.07);for(let i=0;i<3;i++){const a=i*2.094;b.add(C6,'#5f452e',Math.sin(a)*0.19,0.21,Math.cos(a)*0.19,Math.cos(a)*0.2,0,-Math.sin(a)*0.2,0.032,0.44,0.032);}colM(n,M,0,0,0.24);},
  barrel(n,M,open){const b=LB[n];b.base=M;b.add(barrelG,'#7a5536',0,0,0);[0.13,0.67].forEach(y=>b.cyl('#4a4548',0,y,0,0.342,0.05));b.cyl(open?'#3a2a1f':'#93714d',0,0.803,0,0.27,0.012);colM(n,M,0,0,0.37);},
  sack(n,M){const b=LB[n];b.base=M;b.add(ico(1,1),'#a98659',0,0.34,0,0,0,0.08,0.36,0.4,0.33);b.add(C6,'#977649',0,0.74,0,0,0,0.1,0.1,0.12,0.1);b.add(CONE6,'#b4915f',0.01,0.9,0,PI,0,0.1,0.15,0.12,0.15);colM(n,M,0,0,0.33);},
  chest(n,M){const b=LB[n];b.base=M;b.box('#7a5234',0,0.26,0,1.0,0.52,0.6);b.add(C14,'#8a5f3c',0,0.52,0,0,0,PI/2,0.3,1.0,0.3);[-0.36,0.36].forEach(x=>{b.box('#4a4548',x,0.27,0,0.08,0.55,0.62);b.add(C14,'#4a4548',x,0.52,0,0,0,PI/2,0.31,0.08,0.31);});b.box('#d9b24a',0,0.47,0.31,0.14,0.16,0.04);colM(n,M,-0.25,0,0.36);colM(n,M,0.25,0,0.36);},
  candle(n,M,h){const b=LB[n];b.base=M;b.cyl('#5a5258',0,0.012,0,0.075,0.024);b.cyl('#f0e6c8',0,(h||0.16)/2+0.02,0,0.028,h||0.16);fl(n,M,0,(h||0.16)+0.02,0,0.075);},
  book(n,M){const b=LB[n];b.base=M;b.box('#6d2f36',0,0.02,0,0.86,0.035,0.6);[-1,1].forEach(s=>{b.box('#ead7a4',s*0.205,0.065,0,0.4,0.07,0.54,0,0,-s*0.07);b.box('#f3e4b8',s*0.205,0.103,0,0.38,0.006,0.5,0,0,-s*0.07);
      for(let i=0;i<5;i++)b.box('#8a6a4a',s*0.205,0.108-0.0,(-0.18+i*0.09),0.28,0.004,0.012,0,0,-s*0.07);});},
  shelf(n,M,w,rows,top){const b=LB[n],g=GB[n];b.base=g.base=M;const hh=rows*0.5+0.14;
    [-1,1].forEach(s=>b.box('#7d573a',s*w/2,hh/2,0,0.09,hh,0.46));for(let r=0;r<=rows;r++)b.box('#6e4a30',0,0.1+r*0.5,0,w,0.06,0.44);b.box('#4b3222',0,hh/2,-0.2,w-0.02,hh-0.1,0.03);
    for(let r=0;r<=rows;r++){const y=0.13+r*0.5;let x=-w/2+0.12;while(x<w/2-0.14){const u=R();
      if(u<(r===rows?0.7:0.42)){const c=pick(PC),t=Math.floor(R()*3);x+=0.1;
        if(t===0){g.sph(c,x,y+0.075,0.05,0.078,0.072,0.078);b.cyl('#cfdcdf',x,y+0.17,0.05,0.024,0.09,8);}else if(t===1){g.add(C14,c,x,y+0.08,0.05,0,0,0,0.085,0.16,0.085);b.cyl('#cfdcdf',x,y+0.19,0.05,0.022,0.08,8);}else{g.cyl(c,x,y+0.06,0.05,0.066,0.115);b.cyl('#cfdcdf',x,y+0.14,0.05,0.066,0.045);}
        b.cyl('#9a6b42',x,y+(t===2?0.18:0.24),0.05,0.028,0.035,8);x+=0.13;}
      else if(u<0.82&&r<rows){const k=2+Math.floor(R()*4);for(let i=0;i<k&&x<w/2-0.12;i++){const t=rr(0.045,0.085),h=rr(0.27,0.38);x+=t/2;b.box(pick(BK),x,y+h/2,rr(-0.04,0.02),t,h,0.27);x+=t/2+0.006;}x+=0.03;}
      else{const k=1+Math.floor(R()*3),bw=rr(0.3,0.36);x+=bw/2;for(let i=0;i<k;i++)b.box(pick(BK),x,y+0.03+i*0.062,rr(0,0.04),bw,0.058,0.25,rr(-.2,.2));x+=bw/2+0.05;}}}
    const k=Math.round(w/0.5);for(let i=0;i<k;i++)colM(n,M,(i-(k-1)/2)*(w/k),0,0.32);},
  bed(n,M,canopy){const b=LB[n];b.base=M;const W='#4f3526',WD='#3d281d',sh=canopy?'#b989e0':'#d9a6e6',sh2=canopy?'#8e5fc0':'#b783d0';
    b.box(W,0,0.32,0,1.5,0.16,2.5);[[-1,-1],[1,-1],[-1,1],[1,1]].forEach(([i,j])=>b.box(WD,i*0.72,j<0?0.7:0.5,j*1.22,0.14,j<0?1.4:1.0,0.14));
    b.box(W,0,0.95,-1.22,1.4,0.75,0.1);b.box(W,0,0.6,1.22,1.4,0.5,0.1);b.box('#efe2f2',0,0.5,0,1.36,0.22,2.34);b.box(sh,0,0.56,0.35,1.42,0.16,1.7);b.box(sh2,0,0.63,-0.45,1.42,0.06,0.2);
    b.add(S12,'#9f7fc8',0,0.7,-0.88,0,0,0,0.42,0.12,0.24);
    if(canopy){[[-1,-1],[1,-1],[-1,1],[1,1]].forEach(([i,j])=>{b.box(WD,i*0.72,1.6,j*1.22,0.1,2.6,0.1);b.box('#7a4fb0',i*0.72,1.7,j*1.1,0.26,2.0,0.2);b.box('#6a409e',i*0.72,2.55,j*1.1,0.34,0.3,0.26);});
      b.box(WD,0,2.9,0,1.6,0.14,2.6);b.box('#7a4fb0',0,2.72,1.24,1.5,0.3,0.06);b.box('#7a4fb0',-0.74,2.72,0,0.06,0.3,2.5);b.box('#7a4fb0',0.74,2.72,0,0.06,0.3,2.5);b.add(CONE4,WD,0,2.97,0,0,PI/4,0,0.5,0.4,0.5);}
    colM(n,M,0,-0.65,0.9);colM(n,M,0,0.65,0.9);},
  teddy(n,M){const b=LB[n];b.base=M;const c='#f08ac0',d='#f7b3d6';b.sph(c,0,0.2,0,0.17,0.2,0.15);b.sph(c,0,0.5,0,0.15);b.sph(d,0,0.46,0.12,0.07,0.055,0.05);b.sph('#3a2030',0,0.485,0.165,0.02);
    [-1,1].forEach(s=>{b.sph(c,s*0.11,0.63,0,0.055);b.sph('#3a2030',s*0.055,0.53,0.135,0.016);b.sph(c,s*0.19,0.27,0.04,0.06,0.11,0.06);b.sph(c,s*0.1,0.06,0.13,0.07,0.06,0.11);});b.sph(d,0,0.2,0.12,0.09,0.11,0.05);},
  wardrobe(n,M,w,h,broom,noDoors){const b=LB[n];b.base=M;b.box('#5a3d2a',0,h/2,0,w,h,0.7);b.box('#4a3121',0,h+0.06,0,w+0.14,0.12,0.8);b.box('#4a3121',0,0.06,0,w+0.08,0.12,0.76);
    if(noDoors){b.box('#2a1c16',0,h/2,0.355,w-0.2,h-0.3,0.012);b.box('#6b4a33',0,1.0,0.42,w-0.24,0.04,0.17);b.box('#6b4a33',0,1.9,0.42,w-0.24,0.04,0.17);}   // armario que se abre: puertas aparte
    else if(broom){b.box('#2c1e18',0,h/2,0.3,w-0.2,h-0.3,0.12);for(let i=0;i<4;i++){const x=-w/2+0.3+i*(w-0.6)/3;b.cyl('#8a5d3a',x,h/2+0.15,0.38,0.025,h-0.9,6);b.add(CONE6,'#c9a04e',x,0.2,0.38,0,0,0,0.13,0.55,0.13);}b.box('#5a3d2a',-w/2-0.3,h/2,0.55,0.06,h-0.1,0.7,0.5);}
    else{[-1,1].forEach(s=>{b.box('#6b4a33',s*w/4,h/2,0.36,w/2-0.08,h-0.3,0.04);b.box('#4a4548',s*0.08,h/2,0.4,0.05,0.2,0.04);[0.55,h-0.55].forEach(y=>b.box('#4a4548',s*(w/2-0.2),y,0.39,0.3,0.07,0.03));});}
    const k=Math.round(w/0.6);for(let i=0;i<k;i++)colM(n,M,(i-(k-1)/2)*(w/k),0.05,0.42);},
  chair(n,M){const b=LB[n];b.base=M;b.box('#6b4a30',0,0.45,0,0.5,0.06,0.5);[[-1,-1],[1,-1],[-1,1],[1,1]].forEach(([i,j])=>b.box('#553924',i*0.21,j<0?0.55:0.22,j*0.21,0.06,j<0?1.1:0.44,0.06));b.box('#6b4a30',0,0.95,-0.21,0.5,0.2,0.05);b.box('#6b4a30',0,0.68,-0.21,0.5,0.1,0.05);colM(n,M,0,0,0.3);},
  brazier(n,M,ci){const b=LB[n];b.base=M;const c='#3f3a44';b.cyl(c,0,0.75,0,0.035,1.5,6);for(let i=0;i<3;i++){const a=i*2.094;b.add(C6,c,Math.sin(a)*0.2,0.12,Math.cos(a)*0.2,Math.cos(a)*1.0,0,-Math.sin(a)*1.0,0.025,0.5,0.025);}
    b.cyl(c,0,1.5,0,0.3,0.06);b.cyl(c,0,1.78,0,0.34,0.05);for(let i=0;i<6;i++){const a=i/6*TAU;b.box(c,Math.sin(a)*0.32,1.64,Math.cos(a)*0.32,0.03,0.3,0.03);}
    const o=ci||0;for(let i=0;i<4;i++){const a=i*1.57;fl(n,M,Math.sin(a)*0.13,1.52,Math.cos(a)*0.13,rr(0.3,0.4),o+(i%2));}fl(n,M,0,1.55,0,0.3,o+2-(o?1:0));colM(n,M,0,0,0.3);},
  banner(n,M){const b=LB[n];b.base=M;b.box('#3f3a44',0,3.5,0.1,1.5,0.06,0.06);b.box('#3a2748',0,2.45,0.08,1.2,2.0,0.03);b.add(CONE4,'#3a2748',0,1.45,0.08,PI,PI/4,0,0.85,0.7,0.02);b.box('#7a4fb0',0,2.5,0.1,1.0,1.8,0.01);
    b.add(new THREE.TorusGeometry(0.28,0.05,6,18),'#c79ae8',0,2.7,0.115,0,0,0);b.add(CONE4,'#c79ae8',0,2.0,0.115,0,PI/4,0,0.18,0.5,0.01);},
  sofa(n,M){const b=LB[n];b.base=M;const c='#5a3a7c',d='#4a2f68';b.box(c,0,0.3,0,2.6,0.4,0.95);b.box(d,0,0.7,-0.4,2.6,0.75,0.25);[-1,1].forEach(s=>b.box(d,s*1.3,0.5,0,0.28,0.7,0.95));
    for(let i=0;i<3;i++)b.box('#6a4590',-0.8+i*0.8,0.55,0.05,0.74,0.14,0.75);[[-0.85,'#f0c8e0'],[0,'#d9c0f0'],[0.8,'#f0c8e0']].forEach(([x,cc],i)=>b.box(cc,x,0.82,-0.2,0.42,0.34,0.14,0,-0.3,i-1?0.2:-0.15));
    [-0.85,0,0.85].forEach(x=>colM(n,M,x,0,0.55));},
  mirror(n,M){const b=LB[n],g=GB[n];b.base=g.base=M;b.box('#5a3d2a',0,0.72,0,1.2,0.08,0.55);[[-1,-1],[1,-1],[-1,1],[1,1]].forEach(([i,j])=>b.box('#4a3121',i*0.52,0.36,j*0.2,0.07,0.72,0.07));b.box('#4a3121',0,0.55,0,1.0,0.2,0.45);
    b.add(C14,'#7a4fb0',0,1.65,-0.18,PI/2,0,0,0.5,0.08,0.72);g.add(C14,'#cfe6f5',0,1.65,-0.13,PI/2,0,0,0.42,0.02,0.63);g.box('#f4d8ff',-0.1,1.75,-0.115,0.07,0.75,0.005,0,0,0.5);b.add(CONE4,'#7a4fb0',0,2.3,-0.18,0,PI/4,0,0.2,0.3,0.06);
    colM(n,M,-0.3,0,0.4);colM(n,M,0.3,0,0.4);},
  sconce(n,M,k){const b=LB[n];b.base=M;b.box('#3f3a44',0,0,0.12,0.08,0.3,0.24);b.box('#3f3a44',0,0.08,0.28,0.2+0.24*(k-1),0.04,0.06);for(let i=0;i<k;i++){const x=(i-(k-1)/2)*0.24;b.cyl('#f0e6c8',x,0.2,0.28,0.028,0.22,8);fl(n,M,x,0.31,0.28,0.085);}},
  window(n,M,bars){const b=LB[n],g=GB[n];b.base=g.base=M;g.box('#dff0ff',0,0,0.02,0.46,1.3,0.02);const c1='#aa9c88',c2='#9a8c79';b.box(c1,0,0.75,0.05,0.86,0.2,0.16);b.box(c2,0,-0.75,0.05,0.86,0.18,0.18);[-1,1].forEach(s=>{b.box(c2,s*0.33,0.33,0.05,0.2,0.64,0.16);b.box(c1,s*0.33,-0.33,0.05,0.2,0.64,0.16);});
    if(bars){[-0.1,0.1].forEach(x=>b.box('#3a3540',x,0,0.06,0.03,1.3,0.03));b.box('#3a3540',0,0.1,0.06,0.46,0.03,0.03);}},
  potions(n,pts){const b=LB[n],g=GB[n];b.base=g.base=null;pts.forEach(([x,z,s])=>{const c=pick(PC),y=L(n);g.sph(c,x,y+0.075*s,z,0.08*s,0.074*s,0.08*s);b.cyl('#cfdcdf',x,y+0.17*s,z,0.024*s,0.09*s,8);b.cyl('#9a6b42',x,y+0.235*s,z,0.028*s,0.035*s,8);});}
};
function rug(n,x,z,r,c,c2){const m=disc(G[n],TOON(c),r,L(n)+0.012,x,z);if(c2)disc(G[n],TOON(c2),r*0.86,L(n)+0.016,x,z);return m;}
// hiedra y telarañas
const leafG=new THREE.ShapeGeometry(new THREE.Shape([[0,-0.1],[0.1,-0.03],[0.065,0.04],[0,0.14],[-0.07,0.05],[-0.11,-0.03]].map(p=>new THREE.Vector2(p[0],p[1]))));
function vine(n,th0,y0,y1,rad){const b=LB[n];let th=th0,y=y0;const dir=y1>y0?1:-1,k=Math.abs(y1-y0)/0.2;
  for(let i=0;i<k;i++){const dth=(Math.sin(i*0.7+th0*5)*0.03+rr(-.012,.012))*7.5/(rad||RM);b.base=wM(n,th,0.03,rad);
    b.box('#6a5234',0,y,0,0.045,0.25,0.03);for(let j=0;j<3;j++){const s=rr(0.75,1.5);b.add(leafG,pick(['#5d7a3a','#4c6832','#6f8b45','#55703a']),rr(-.26,.26),y+rr(-.12,.12),0.03+rr(0,.07),rr(-.5,.3),rr(-.5,.5),rr(0,6.28),s,s,s);}
    th+=dth;y+=0.2*dir;}}
const webTex=canvasTex(256,256,(g,w,h)=>{g.clearRect(0,0,w,h);g.strokeStyle='#efe4d2';g.lineWidth=2.4;g.lineCap='round';const cx=w/2,cy=h/2,N=11,ang=[];
  for(let i=0;i<N;i++)ang.push(i/N*6.283+rr(-.1,.1));
  ang.forEach(a=>{g.beginPath();g.moveTo(cx,cy);g.lineTo(cx+Math.cos(a)*122,cy+Math.sin(a)*122);g.stroke();});
  for(let k=1;k<=5;k++){const r=k*22;g.beginPath();ang.forEach((a,i)=>{const x=cx+Math.cos(a)*r,y=cy+Math.sin(a)*r;i?g.lineTo(x,y):g.moveTo(x,y);});g.closePath();g.stroke();}},1,1);
const mWeb=new THREE.MeshBasicMaterial({map:webTex,transparent:true,opacity:.8,depthWrite:false});
function web(n,th,y,s,rad){const m=new THREE.Mesh(new THREE.PlaneGeometry(s,s),mWeb);m.position.set(0,y,0.07);m.rotation.z=rr(0,6);m.applyMatrix4(wM(n,th,0,rad));G[n].add(m);}
// caldero con fuego y vapor
function mkCauldron(n,x,z,s,liq){
  const b=LB[n],y=L(n);b.base=TRS(x,y,z,0,0,0,s*0.86);
  b.add(new THREE.LatheGeometry([[0.001,0.2],[0.3,0.21],[0.52,0.32],[0.66,0.52],[0.7,0.72],[0.64,0.92],[0.56,1.02],[0.62,1.06],[0.66,1.1],[0.6,1.12],[0.54,1.08]].map(p=>new THREE.Vector2(p[0],p[1])),22),'#2b262e',0,0,0);
  b.add(new THREE.TorusGeometry(0.63,0.045,8,26),'#3a343e',0,1.09,0,PI/2,0,0);
  for(let i=0;i<3;i++){const a=i*2.094+0.5;b.add(C6,'#2b262e',Math.sin(a)*0.36,0.13,Math.cos(a)*0.36,Math.cos(a)*0.2,0,-Math.sin(a)*0.2,0.055,0.3,0.055);}
  [1,-1].forEach(q=>b.add(new THREE.TorusGeometry(0.12,0.028,6,14),'#3a343e',q*0.72,0.78,0,0,PI/2,0));
  b.base=TRS(x,y,z,0,0,0,s);
  for(let i=0;i<9;i++){const a=i/9*TAU+rr(-.15,.15);b.add(ico(1,0),pick(['#6d6266','#7b6f6c','#5f5559']),Math.sin(a)*0.86,0.07,Math.cos(a)*0.86,rr(0,3),rr(0,3),0,rr(.11,.16),rr(.08,.11),rr(.11,.15));}
  [[0.4,0.3],[1.9,-0.25],[3.3,0.2]].forEach(([a,t])=>b.add(C6,'#5b3a26',0,0.07,0,PI/2+t*0.2,a,0,0.055,1.35,0.055));
  const g=new THREE.Group();g.position.set(x,y,z);g.scale.setScalar(s);G[n].add(g);
  const lm=new THREE.MeshBasicMaterial({color:liq||'#b06ae0'}),l=new THREE.Mesh(new THREE.CircleGeometry(0.48,24),lm);l.rotation.x=-PI/2;l.position.y=0.89;g.add(l);
  for(let i=0;i<8;i++){const a=i/8*TAU+0.3;tongue(g,Math.sin(a)*0.58,0.03,Math.cos(a)*0.58,rr(0.26,0.38),i%3===1?1:0);}
  for(let i=0;i<4;i++){const a=i/4*TAU;tongue(g,Math.sin(a)*0.33,0.03,Math.cos(a)*0.33,rr(0.2,0.26),i%2?2:1);}
  const puffs=[];for(let i=0;i<7;i++){const m=new THREE.Mesh(ico(1,1),new THREE.MeshBasicMaterial({color:'#ead4ff',transparent:true,depthWrite:false}));g.add(m);puffs.push({m,ph:i/7,x:rr(-.3,.3),z:rr(-.3,.3),r:rr(0.04,0.09),sw:rr(0,6)});}
  anims.push(t=>{for(const p of puffs){const u=(t*0.4+p.ph)%1;p.m.position.set(p.x+Math.sin(t*2+p.sw)*0.07,0.95+u*1.5,p.z+Math.cos(t*1.7+p.sw)*0.07);const k=p.r*(0.6+u*1.3);p.m.scale.set(k,k,k);p.m.material.opacity=Math.sin(u*PI)*0.85;}});
  col(n,x,z,0.98*s);
  return {g,lm,l};
}

/* ---------- PLANTA 0 · sala del trono ---------- */
{
  const n=0;let M;
  FURN.brazier(n,at(-3.1,n,-3.2));FURN.brazier(n,at(3.1,n,-3.2));
  FURN.banner(n,wM(n,PI-0.66,0.04));FURN.banner(n,wM(n,PI+0.66,0.04));
  M=at(4.3,n,1.7,-0.5);FURN.table(n,M,1.5,0.9,0.72);FURN.book(n,M.clone().multiply(TRS(-0.15,0.76,0)));FURN.candle(n,M.clone().multiply(TRS(0.58,0.76,-0.28)),0.24);
  M=at(5.7,n,-1.3);FURN.barrel(n,M);LB[n].base=M;LB[n].sph('#efe8da',0,0.98,0,0.17,0.16,0.19);LB[n].sph('#efe8da',0,0.86,0.06,0.11,0.08,0.11);[-1,1].forEach(s=>LB[n].sph('#2a2030',s*0.07,0.99,0.15,0.04));
  FURN.barrel(n,at(-4.6,n,-4.4));FURN.barrel(n,at(-5.5,n,-3.5,0,0.9),true);FURN.chest(n,at(-3.5,n,-5.6,0.5));FURN.chest(n,at(4.9,n,4.4,-2.3));
  FURN.sack(n,at(-5.0,n,3.7,0.4));FURN.sack(n,at(-5.7,n,2.8,1.7,0.85));FURN.potions(n,[[-4.3,4.3,1.3],[-3.2,-4.6,1.1],[-2.8,-5.0,1.0],[5.6,3.2,1.2]]);
  FURN.sconce(n,wM(n,0.42,0.02).multiply(TRS(0,2.3,0)),3);FURN.sconce(n,wM(n,-0.42,0.02).multiply(TRS(0,2.3,0)),3);
  FURN.window(n,wM(n,2.15,0.02).multiply(TRS(0,2.7,0)));FURN.window(n,wM(n,-2.3,0.02).multiply(TRS(0,2.7,0)));
  const mr=TOON('#4a3d52');[[-1.6,3.4,0.3],[2.3,5.0,-0.2]].forEach(([x,z,a])=>{const m=new THREE.Mesh(new THREE.PlaneGeometry(2.6,1.7),mr);m.rotation.set(-PI/2,0,a);m.position.set(x,0.012,z);G[n].add(m);});
  vine(n,1.2,0.05,3.2);vine(n,1.32,0.05,2.0);vine(n,-1.0,4.2,1.6);vine(n,PI-0.2,4.2,2.6);vine(n,-2.75,0.05,3.6);vine(n,2.75,4.2,2.2);
  web(n,0.9,3.7,1.2);web(n,PI+1.2,3.75,1.1);web(n,-0.8,3.8,1.0);web(n,PI-1.3,3.7,1.2);
}
/* ---------- PLANTA 1 · la habitación de Bruna ---------- */
{
  const n=1;let M;
  rug(n,0.2,0.8,2.9,'#9c78ae','#b08cc0');
  M=at(4.6,n,-1.0,-PI/2);FURN.bed(n,M);FURN.teddy(n,M.clone().multiply(TRS(0,0.66,-0.55,0,0.3,0)));
  M=at(5.3,n,-3.4);FURN.table(n,M,0.6,0.5,0.55,'#5a3d2a');FURN.candle(n,M.clone().multiply(TRS(0,0.59,0)),0.22);
  FURN.wardrobe(n,wM(n,PI+0.05,0.5),2.0,2.9,false,true);
  LB[n].base=wM(n,PI+0.05,0.5);LB[n].sph('#a98659',-0.5,3.2,0,0.22,0.2,0.2);GB[n].base=wM(n,PI+0.05,0.5);GB[n].sph('#4fd0a0',0.3,3.1,0,0.1);GB[n].sph('#c44fe0',0.55,3.07,0.05,0.08);
  M=wM(n,0.55,0.75);FURN.table(n,M,1.7,0.8,0.74);LB[n].base=M;LB[n].box('#7a2f3a',-0.4,0.8,0,0.4,0.05,0.28,0.2);LB[n].box('#f1e3bd',0.25,0.785,0.05,0.5,0.01,0.35,-0.15);LB[n].add(CONE4,'#b9a0e0',0.62,0.8,-0.15,0.5,0,0.3,0.02,0.34,0.006);GB[n].base=M;GB[n].sph('#c44fe0',-0.68,0.86,-0.2,0.07);
  FURN.stool(n,M.clone().multiply(TRS(0.1,0,0.85)));
  M=at(3.2,n,2.0,-2.3);FURN.chair(n,M);LB[n].base=M;LB[n].box('#f2a0cc',0,0.52,0.02,0.4,0.08,0.36);LB[n].box('#f2a0cc',0,0.85,-0.17,0.44,0.5,0.06);
  LB[n].base=at(2.3,n,1.1,0.6);[-1,1].forEach(s=>LB[n].sph('#f2a0cc',s*0.12,0.05,0,0.09,0.06,0.15));
  FURN.barrel(n,at(-4.0,n,-5.3));FURN.sack(n,at(-4.9,n,-4.5,1));
  FURN.sconce(n,wM(n,W_TH+0.4,0.02).multiply(TRS(0,2.3,0)),3);FURN.sconce(n,wM(n,W_TH-0.4,0.02).multiply(TRS(0,2.3,0)),3);
  FURN.window(n,wM(n,PI/2+0.35,0.02).multiply(TRS(0,2.6,0)),true);FURN.window(n,wM(n,-0.5,0.02).multiply(TRS(0,2.6,0)),true);
  vine(n,PI-0.9,4.2,2.3);vine(n,1.25,0.05,2.6);vine(n,-1.05,0.05,3.4);vine(n,PI+0.9,4.2,2.9);vine(n,2.3,4.2,3.0);
  web(n,0.1,3.8,1.1);web(n,PI+1.3,3.8,1.2);web(n,PI-1.7,3.75,1.0);
}
/* ---------- PLANTA 2 · la cocina del caldero ---------- */
{
  const n=2;let M;
  CAUL[n]=mkCauldron(n,0.3,-0.4,1.15);
  LB[n].base=TRS(1.25,L(n),0.3,0,-2.1,0).multiply(TRS(0,0.04,0,0.3,0,0));LB[n].cyl('#8a5d3a',0,0.72,0,0.03,1.35,6);LB[n].sph('#7b5233',0,0.05,0,0.15,0.05,0.19);
  FURN.shelf(n,wM(n,PI-0.8,0.42),3.4,4,true);
  M=at(3.5,n,2.6,-0.6);FURN.table(n,M,1.5,0.9,0.72);FURN.book(n,M.clone().multiply(TRS(-0.15,0.76,0)));FURN.candle(n,M.clone().multiply(TRS(0.58,0.76,-0.28)),0.24);
  FURN.barrel(n,at(-0.6,n,-6.3));FURN.barrel(n,at(0.4,n,-6.5,0,0.92),true);FURN.barrel(n,at(5.6,n,3.4,0,1.05));FURN.sack(n,at(0.4,n,-6.5,0,0.5).multiply(TRS(0,1.3,0)));COLS[n].pop();
  FURN.sack(n,at(-4.9,n,3.6,0.4));FURN.sack(n,at(-5.5,n,2.7,1.7,0.85));FURN.stool(n,at(-3.2,n,-2.4));
  FURN.potions(n,[[-2.6,-3.0,1.2],[-3.0,-3.5,1.15],[-2.3,-3.6,1.1],[5.0,4.4,1.2],[-4.2,4.3,1.3],[2.4,3.6,1.1]]);
  M=wM(n,PI-0.8,0.42);LB[n].base=M;LB[n].cyl('#3d2c20',1.85,2.2,0.12,0.008,0.3,6);for(let i=0;i<7;i++)LB[n].add(CONE6,pick(['#8a6f3a','#756a34','#9a7d45']),1.85+rr(-.07,.07),2.0+rr(-.08,.05),0.12+rr(-.05,.05),PI+rr(-.3,.3),0,rr(-.3,.3),0.05,rr(0.3,0.45),0.05);
  FURN.window(n,wM(n,PI+0.7,0.02).multiply(TRS(0,2.6,0)));FURN.window(n,wM(n,0.9,0.02).multiply(TRS(0,2.6,0)));
  FURN.sconce(n,wM(n,W_TH-0.4,0.02).multiply(TRS(0,2.3,0)),2);
  vine(n,PI+1.05,0.05,3.2);vine(n,PI+0.3,0.9,2.8);vine(n,0.5,4.2,1.4);vine(n,-0.6,4.2,2.2);vine(n,1.9,0.05,2.4);vine(n,-1.0,0.05,1.5);
  web(n,PI+1.35,3.7,1.25);web(n,PI,3.8,1.0);web(n,1.5,3.75,1.1);web(n,-0.2,3.8,1.0);
}
/* ---------- PLANTA 3 · terraza y sala de fiestas ---------- */
{
  const n=3,b=LB[n],g=GB[n],y=L(n),PA=[0.55,1.6,2.65,3.7,-0.5],BC=['#ff5f7a','#ffd24a','#5fd0ff','#7fe07a','#c98aff','#ff9a4a'];
  b.base=g.base=null;
  const pp=PA.map(a=>[Math.sin(a)*(RM-0.15),Math.cos(a)*(RM-0.15)]);
  pp.forEach(([x,z])=>{b.cyl('#5b3f2a',x,y+1.75,z,0.07,3.5,6);b.sph('#7a5536',x,y+3.5,z,0.1);col(n,x,z,0.12);});
  for(let i=0;i<pp.length;i++){const A=pp[i],B2=pp[(i+1)%pp.length],flags=i===1||i===3,K=flags?9:11;
    for(let k=0;k<=K;k++){const u=k/K,x=lerp(A[0],B2[0],u),z=lerp(A[1],B2[1],u),yy=y+3.4-Math.sin(u*PI)*0.75;
      if(k<K){const u2=(k+1)/K,x2=lerp(A[0],B2[0],u2),z2=lerp(A[1],B2[1],u2),y2=y+3.4-Math.sin(u2*PI)*0.75,d=Math.hypot(x2-x,z2-z,y2-yy);
        b.add(BOX,'#2f2a38',(x+x2)/2,(yy+y2)/2,(z+z2)/2,0,Math.atan2(x2-x,z2-z),0,0.014,0.03,d);}
      if(k>0&&k<K){if(flags)b.add(CONE4,BC[k%6],x,yy-0.02,z,PI,Math.atan2(B2[0]-A[0],B2[1]-A[1])+PI/4,0,0.2,0.36,0.02);else{g.sph(BC[k%6],x,yy-0.1,z,0.085);b.cyl('#2f2a38',x,yy-0.03,z,0.025,0.06,6);}}}}
  // la cuerda: cilindros tumbados
  [[5.6,3.6],[-2.6,-6.0]].forEach(([x,z],i)=>{b.cyl('#2f2a38',x,y+2.75,z,0.01,0.7,6);b.box('#3f3a44',x,y+2.42,z,0.24,0.04,0.24);g.box('#ffb85a',x,y+2.24,z,0.2,0.32,0.2);b.box('#3f3a44',x,y+2.06,z,0.24,0.04,0.24);});
  [[-5.6,-4.6,0.9],[-5.0,-5.2,0.7]].forEach(([x,z,a])=>{b.base=TRS(x,y,z,0,a,0).multiply(TRS(0,0,0,0.35,0,0));b.cyl('#8a5d3a',0,1.2,0,0.03,1.7,6);b.add(CONE6,'#c9a04e',0,0,0,0,0,0,0.2,0.6,0.2);b.cyl('#6b4a30',0,0.58,0,0.09,0.08,6);});
  let M=at(2.4,n,-1.8,0.4);FURN.table(n,M,2.2,1.0,0.72);b.base=g.base=M;
  b.cyl('#f4e3c8',0,0.86,0,0.3,0.2);b.cyl('#f29ac4',0,0.98,0,0.31,0.05);g.sph('#e23b3b',0,1.05,0,0.05);[-0.7,0.65].forEach((x,i)=>{b.cyl('#efe8da',x,0.82,0.2-i*0.4,0.06,0.1,8);b.cyl('#efe8da',x+0.25,0.82,-0.25+i*0.4,0.06,0.1,8);});
  [-1,1].forEach(s=>{const m2=M.clone().multiply(TRS(0,0,s*0.95));b.base=m2;b.box('#6b4a30',0,0.42,0,1.9,0.07,0.36);[-0.8,0.8].forEach(x=>b.box('#553924',x,0.21,0,0.08,0.42,0.3));colM(n,m2,-0.5,0,0.3);colM(n,m2,0.5,0,0.3);});
  b.base=null;for(let i=0;i<90;i++){const a=rr(0,TAU),r=Math.sqrt(R())*(RM-0.3);b.box(pick(BC),Math.sin(a)*r,y+0.012,Math.cos(a)*r,rr(0.06,0.14),0.006,0.035,rr(0,6));}
  vine(n,W_TH+0.75,0.9,0.1,RM+0.36);vine(n,1.1,0.9,0.1,RM+0.36);
}
/* ---------- SÓTANO · el dormitorio de la bruja ---------- */
const plants=[];
{
  const n=-1,by=BY;let M;
  rug(n,-0.4,3.6,3.3,'#7f5f9c','#9274ae');
  M=at(-0.4,n,2.4);FURN.sofa(n,M);M=at(-0.4,n,4.4);FURN.table(n,M,1.7,0.9,0.45,'#5a3d2a');
  LB[n].base=M;[-0.5,0.1].forEach(x=>LB[n].cyl('#efe8da',x,0.55,0.15,0.07,0.1,8));LB[n].box('#7a2f3a',0.55,0.52,0.2,0.36,0.08,0.26,0.3);LB[n].cyl('#3f3a44',0.2,0.6,-0.2,0.03,0.24,6);LB[n].box('#3f3a44',0.2,0.72,-0.2,0.44,0.03,0.03);[-0.2,0,0.2].forEach(x=>{LB[n].cyl('#f0e6c8',0.2+x,0.82,-0.2,0.022,0.18,8);fl(n,M,0.2+x,0.91,-0.2,0.07);});
  // cama con dosel sobre tarima
  LB[n].base=at(5.3,n,-3.4,-0.75);LB[n].box('#6f6274',0,0.12,0,3.0,0.24,4.0);LB[n].box('#7d7082',0,0.3,-0.2,2.5,0.14,3.4);
  FURN.bed(n,at(5.3,n,-3.4,-0.75).multiply(TRS(0,0.37,-0.2,0,0,0,1.15)),true);col(n,5.3,-3.4,1.9);col(n,4.3,-2.2,1.3);col(n,6.2,-4.5,1.3);
  mkCauldron(n,-5.9,1.0,0.85,'#c06af0');
  M=at(-5.0,n,4.6,0.9);FURN.table(n,M,1.9,0.8,0.7);LB[n].base=GB[n].base=M;
  [[-0.7,0],[-0.4,0.15],[0.0,-0.1],[0.35,0.12]].forEach(([x,z],i)=>{GB[n].sph(PC[(i*2+2)%7],x,0.8,z,0.07);LB[n].cyl('#cfdcdf',x,0.89,z,0.022,0.08,8);});LB[n].add(hemiG,'#d8d2c8',0.7,0.86,-0.05,PI,0,0,0.13,0.12,0.13);LB[n].cyl('#d8d2c8',0.76,0.9,-0.02,0.02,0.2,6,0,0.5);
  FURN.mirror(n,wM(n,PI+0.95,0.55,RB));FURN.stool(n,wM(n,PI+0.95,1.35,RB));
  FURN.wardrobe(n,wM(n,PI+0.5,0.5,RB),2.2,3.0,true);
  FURN.shelf(n,wM(n,PI-0.45,0.42,RB),2.4,4,true);
  M=wM(n,-1.25,0.5,RB);FURN.table(n,M,1.6,0.7,0.75);LB[n].base=GB[n].base=M;[[-0.5,'#f0d436'],[-0.2,'#ef6fb0'],[0.15,'#38b8e8']].forEach(([x,c])=>{GB[n].cyl(c,x,0.86,0,0.07,0.12);LB[n].cyl('#9a6b42',x,0.94,0,0.055,0.03);});LB[n].add(hemiG,'#b9b0a6',0.5,0.88,0,PI,0,0,0.14,0.12,0.14);
  FURN.sconce(n,wM(n,-1.9,0.02,RB).multiply(TRS(0,2.4,0)),3);FURN.sconce(n,wM(n,1.3,0.02,RB).multiply(TRS(0,2.4,0)),3);FURN.sconce(n,wM(n,0.2,0.02,RB).multiply(TRS(0,2.4,0)),3);
  // jaula colgante
  {const b=LB[n];b.base=TRS(3.3,by+2.2,-1.2);b.cyl('#3f3a44',0,1.5,0,0.012,2.0,6);b.cyl('#3f3a44',0,0,0,0.5,0.05);b.cyl('#3f3a44',0,1.0,0,0.5,0.04);b.add(CONE(12),'#3f3a44',0,1.0,0,0,0,0,0.5,0.4,0.5);for(let i=0;i<12;i++){const a=i/12*TAU;b.box('#3f3a44',Math.sin(a)*0.48,0.5,Math.cos(a)*0.48,0.02,1.0,0.02);}
    b.sph('#b06ae0',-0.12,0.42,0,0.1,0.13,0.1);b.sph('#3fb0e0',0.15,0.5,0.05,0.1,0.13,0.1);b.sph('#e2534a',0.15,0.62,0.09,0.06);b.sph('#8a5a3a',0.0,0.2,0.1,0.11,0.1,0.1);b.box('#6b4a30',0,0.32,0,0.8,0.03,0.03);}
  // plantas carnívoras
  const mG=TOON('#7fb04a'),mG2=TOON('#5d8a3a'),mRed=TOON('#b02a3a'),mPot=TOON('#a8573a'),mSoil=TOON('#3a2a22'),mTooth=TOON('#f6f0e0');
  function plant(x,z,s,y0){
    const g=new THREE.Group();g.position.set(x,by+(y0||0),z);g.scale.setScalar(s);G[n].add(g);
    mk(new THREE.CylinderGeometry(0.3,0.22,0.4,10),mPot,0,0.2,0,g);mk(new THREE.CylinderGeometry(0.33,0.33,0.07,10),mPot,0,0.4,0,g);mk(new THREE.CylinderGeometry(0.27,0.27,0.02,10),mSoil,0,0.44,0,g);
    for(let i=0;i<3;i++){const a=i*2.1+1,l=mk(S12,mG2,Math.sin(a)*0.3,0.6,Math.cos(a)*0.3,g);l.scale.set(0.12,0.04,0.34);l.rotation.set(-0.5,a,0);}
    const st=new THREE.Group();st.position.y=0.44;g.add(st);mk(new THREE.CylinderGeometry(0.055,0.07,0.75,6),mG2,0,0.37,0,st);
    const st2=new THREE.Group();st2.position.y=0.74;st.add(st2);mk(new THREE.CylinderGeometry(0.05,0.055,0.5,6),mG2,0,0.25,0,st2);
    const head=new THREE.Group();head.position.y=0.52;st2.add(head);
    const lo=mk(hemiG,mG,0,0,0.12,head);lo.scale.set(0.3,0.2,0.4);lo.rotation.x=PI;
    const li=new THREE.Mesh(new THREE.CircleGeometry(1,14),mRed);li.rotation.x=-PI/2;li.scale.set(0.27,0.37,1);li.position.set(0,0.005,0.12);head.add(li);
    const jaw=new THREE.Group();jaw.position.set(0,0.01,-0.24);head.add(jaw);
    const up=mk(hemiG,mG,0,0,0.36,jaw);up.scale.set(0.3,0.22,0.4);
    const ui=new THREE.Mesh(new THREE.CircleGeometry(1,14),mRed);ui.rotation.x=PI/2;ui.scale.set(0.27,0.37,1);ui.position.set(0,-0.005,0.36);jaw.add(ui);
    for(let i=0;i<7;i++){const a=(i-3)*0.36,tx=Math.sin(a)*0.27,tz=Math.cos(a)*0.36;const t1=mk(CONE4,mTooth,tx,0,0.12+tz,head);t1.scale.set(0.035,0.11,0.035);const t2=mk(CONE4,mTooth,tx,0,0.36+tz,jaw);t2.scale.set(0.035,0.11,0.035);t2.rotation.x=PI;}
    [1,-1].forEach(q=>mk(S12,mG2,q*0.2,0.03,-0.1,head).scale.set(0.06,0.03,0.12));
    plants.push({g,st,st2,head,jaw,x,z,ph:rr(0,6),yaw:rr(0,6),snap:0});col(n,x,z,0.34*s);
  }
  plant(6.9,2.4,1.5);plant(5.6,4.9,1.9);plant(7.4,0.2,1.2);plant(3.9,5.9,1.3);plant(-7.3,-2.3,1.3);
  LB[n].base=null;[[6.3,3.8],[4.8,6.4],[-6.6,-3.6],[7.7,-1.4]].forEach(([x,z])=>{LB[n].cyl('#8a4a34',x,by+0.15,z,0.2,0.3);for(let i=0;i<4;i++){const a=i*1.6+x;LB[n].add(S12,'#5d8a3a',x+Math.sin(a)*0.12,by+0.55,z+Math.cos(a)*0.12,-0.3,a,0,0.05,0.3,0.1);}GB[n].add(S12,pick(['#c98aff','#ff8fd8']),x,by+0.95,z,0,0,0,0.07,0.13,0.07);LB[n].cyl('#5d8a3a',x,by+0.6,z,0.015,0.6,6);col(n,x,z,0.22);});
  vine(n,0.9,3.2,0.9,RB);vine(n,-0.5,4.6,2.2,RB);vine(n,2.2,4.6,1.8,RB);vine(n,PI+1.5,4.6,2.6,RB);vine(n,PI-1.2,0.05,3.0,RB);vine(n,-2.5,4.6,2.0,RB);
  web(n,2.6,3.9,1.2,RB);web(n,-1.0,4.0,1.2,RB);web(n,PI+0.1,4.0,1.0,RB);
}
// la hiedra del sótano usa alturas relativas al suelo del sótano: wM(-1,…) ya parte de BY
[-1,0,1,2,3].forEach(n=>{LB[n].base=null;GB[n].base=null;LB[n].mesh(G[n],mVCd);GB[n].mesh(G[n],mGlowVC);});

/* ---------- ventanas encendidas ---------- */
{
  const e=TBatch();[[2.2,1,2.7],[-2.3,2,2.6],[PI/2+0.35,1,2.6],[0.9,2,2.6],[PI+0.7,2,2.6],[-0.5,1,2.6],[2.15,0,2.7],[-2.3,0,2.7]].forEach(([a,n,y])=>{e.base=TRS(Math.sin(a)*(RM+WT+0.02),L(n)+y,Math.cos(a)*(RM+WT+0.02),0,a,0);e.box('#ffd66e',0,0,0,0.5,1.3,0.04);});
  e.base=TRS(TX-TRo-0.02,L(1)+1.5,0,0,-PI/2,0);e.box('#ffd66e',0,0,0,0.45,1.1,0.04);e.base=TRS(TX,L(2)+2,TRo+0.02,0,0,0);e.box('#ffd66e',0,0,0,0.45,1.1,0.04);
  e.mesh(EXT,mGlowVC);
}
