/* =====================================================================
   MUNDO AMPLIADO — construcción
   ===================================================================== */
/* ---------- colisiones estáticas y suelo ---------- */
const BOXES=[];
function addBox(cx,cz,yaw,hw,hd){BOXES.push({x:cx,z:cz,c:Math.cos(yaw),s:Math.sin(yaw),hw,hd});}
function pushStatics(p,m){
  for(let it=0;it<2;it++){
    for(const b of BOXES){const dx=p.x-b.x,dz=p.z-b.z,R2=b.hw+b.hd+m;if(dx*dx+dz*dz>R2*R2)continue;
      let lx=dx*b.c-dz*b.s,lz=dx*b.s+dz*b.c;
      if(Math.abs(lx)<b.hw+m&&Math.abs(lz)<b.hd+m){const px=b.hw+m-Math.abs(lx),pz=b.hd+m-Math.abs(lz);if(px<pz)lx=Math.sign(lx||1)*(b.hw+m);else lz=Math.sign(lz||1)*(b.hd+m);
        p.x=b.x+lx*b.c+lz*b.s;p.z=b.z-lx*b.s+lz*b.c;}}
    const lx=p.x-GT.x,lz=p.z-GT.z,d=Math.hypot(lx,lz);
    if(d>CAVE_RIN-m&&d<CAVE_ROUT+m&&!(lz>0&&Math.abs(lx)<TUN+0.35)){const r=(d-(CAVE_RIN-m))<((CAVE_ROUT+m)-d)?CAVE_RIN-m:CAVE_ROUT+m;p.x=GT.x+lx/d*r;p.z=GT.z+lz/d*r;}
  }
}
const onBridge=(x,z)=>Math.abs(z-BZ)<1.25&&Math.abs(x-RXB)<BL;
function gY(x,z){let h=landH(x,z);if(onBridge(x,z))h=Math.max(h,deckY(x));return h;}
function waterAt(x,z){if(pondD(x,z)<1.06)return WY;if(z<-38&&Math.abs(x-RX(z))<RW+2.6)return WR;return -1e9;}
const waterDepth=(x,z)=>Math.max(0,waterAt(x,z)-gY(x,z));
const colW=(x,z,r)=>COL.push({x,z,r});
const colH=(H,lx,lz,r)=>{const p=hW(H,lx,lz);COL.push({x:p[0],z:p[1],r});};
const boxH=(H,lx,lz,hw,hd,yaw)=>{const p=hW(H,lx,lz);addBox(p[0],p[1],H.yaw+(yaw||0),hw,hd);};
const planeG=new THREE.PlaneGeometry(1,1),coneG7=(()=>{const g=new THREE.ConeGeometry(1,1,7);g.translate(0,0.5,0);return g;})(),octG=new THREE.OctahedronGeometry(1,0);
const mGlowB=new THREE.MeshBasicMaterial({vertexColors:true});

/* ---------- el árbol gigante y la cueva ---------- */
const TREEX=new THREE.Group();world.add(TREEX);          // corteza exterior: se oculta dentro de la cueva
const CAVEI=new THREE.Group();world.add(CAVEI);
const caveGlow=[];
{
  const ridged=(pts,ps,pl,seg)=>{const g=new THREE.LatheGeometry(pts.map(p=>new THREE.Vector2(p[0],p[1])),seg||44,ps,pl),p=g.attributes.position;
    for(let i=0;i<p.count;i++){const x=p.getX(i),y=p.getY(i),z=p.getZ(i),a=Math.atan2(x,z),k=1+0.055*Math.sin(a*11+y*0.35)+0.03*Math.sin(a*23-y*0.8);p.setXYZ(i,x*k,y,z*k);}
    g.computeVertexNormals();return g;};
  const ga=Math.asin(TUN/5.9),BARK='#6e4c3e',BARKD='#5a3c32';
  const b=Batch();
  b.add(ridged([[7.6,-0.8],[7.1,0],[6.3,0.7],[5.75,1.8],[5.5,3.5]],ga,Math.PI*2-2*ga),BARK,GT.x,GT.y,GT.z);
  b.add(ridged([[5.5,3.5],[5.15,6],[4.8,10],[4.4,15],[4.0,19],[3.4,21.5],[0.6,22.2]],0,Math.PI*2),BARK,GT.x,GT.y,GT.z);
  b.add(BOX,BARKD,GT.x,GT.y+3.7,GT.z+4.95,0,0,0,TUN*2+0.9,0.55,3.2);
  b.mesh(mLit,true,TREEX);
  // raíces (las dos de la entrada forman un pasillo, y una raíz hace de arco por encima)
  const r=Batch();
  [0.64,-0.64,1.32,-1.36,1.98,-2.05,2.62,-2.72,Math.PI].forEach((a,i)=>{
    const L=rr(11.5,14),h0=rr(1.5,2.2);
    const P=[[5.1,h0],[7.4,h0*0.85],[9.6,0.55],[L,-0.55]].map(([rad,y],k)=>{const aa=a+(k>1?rr(-0.08,0.08):0);return new THREE.Vector3(GT.x+Math.sin(aa)*rad,GT.y+y,GT.z+Math.cos(aa)*rad);});
    const T=taperTube(P,rr(1.05,1.25),0.28,9,18);r.add(T.g,i%2?BARK:BARKD,0,0,0);
    for(let t=0.06;t<0.86;t+=0.06){const p=T.curve.getPointAt(t),rad=lerp(1.15,0.3,Math.pow(t,0.8));if(p.y-GT.y>rad*0.2-0.25)colW(p.x,p.z,rad*0.92);}
  });
  const arch=[[-0.58,7.3,1.25],[-0.32,7.75,2.9],[0,7.9,3.4],[0.32,7.75,2.9],[0.58,7.3,1.25]].map(([a,rad,y])=>new THREE.Vector3(GT.x+Math.sin(a)*rad,GT.y+y,GT.z+Math.cos(a)*rad));
  r.add(taperTube(arch,0.55,0.4,9,20).g,BARKD,0,0,0);
  // musgo sobre las raíces
  for(let i=0;i<26;i++){const a=rr(0,Math.PI*2),rad=rr(6,10);if(Math.abs(wrapA(a))<0.35)continue;r.add(blobs[i%3],pick(['#7d8f3f','#8a9a3c','#6f8a48']),GT.x+Math.sin(a)*rad,GT.y+rr(0.6,1.4),GT.z+Math.cos(a)*rad,0,rr(0,6),0,rr(0.4,0.8),0.12,rr(0.4,0.7));}
  r.mesh(mLit,true);
  // copa enorme de colores
  const c=Batch();c.sw=[GT.y+15,0.025];
  const CC=['#8a4fb0','#b05bd0','#e0743a','#c9473f','#f0a050','#9a5ac8','#d0608a'];
  for(let i=0;i<7;i++){const a=i/7*Math.PI*2+rr(-.2,.2),y0=rr(15,19.5),rad=rr(9.5,13),y1=rr(22,25.5);
    const st=new THREE.Vector3(GT.x+Math.sin(a)*3.4,GT.y+y0,GT.z+Math.cos(a)*3.4),mid=new THREE.Vector3(GT.x+Math.sin(a)*rad*0.55,GT.y+y0+2.6,GT.z+Math.cos(a)*rad*0.55),en=new THREE.Vector3(GT.x+Math.sin(a)*rad,GT.y+y1,GT.z+Math.cos(a)*rad);
    c.add(taperTube([st,mid,en],1.05,0.35,7,8).g,BARK,0,0,0);
    for(let k=0;k<3;k++){const w=rr(4.2,6.2),col=pick(CC),k2=Math.floor(R()*3);c.add(blobs[k2],col,en.x+rr(-2.5,2.5),en.y+rr(-0.5,2.2),en.z+rr(-2.5,2.5),0,rr(0,6),0,w,w*0.48,w*0.88);}}
  for(let k=0;k<6;k++){const w=rr(6,8.5),a=rr(0,Math.PI*2),rad=rr(0,5);c.add(blobs[k%3],pick(CC),GT.x+Math.sin(a)*rad,GT.y+rr(25.5,29),GT.z+Math.cos(a)*rad,0,rr(0,6),0,w,w*0.45,w*0.9);}
  c.mesh(mLit,true);
  // interior de la cueva
  const gi=Math.asin(TUN/CAVE_RIN),mIn=LM('#4a3644',{side:THREE.BackSide});
  const w1=new THREE.Mesh(ridged([[CAVE_RIN,-0.3],[CAVE_RIN+0.15,1.4],[CAVE_RIN,3.5]],gi,Math.PI*2-2*gi,36),mIn);w1.position.set(GT.x,GT.y,GT.z);w1.receiveShadow=true;CAVEI.add(w1);
  const w2=new THREE.Mesh(ridged([[CAVE_RIN,3.5],[CAVE_RIN-0.4,4.1],[CAVE_RIN-1.4,4.6],[0.3,4.85]],0,Math.PI*2,36),mIn);w2.position.set(GT.x,GT.y,GT.z);CAVEI.add(w2);
  const t=Batch();
  [-1,1].forEach(s=>{t.add(BOX,BARKD,GT.x+s*(TUN+0.175),GT.y+1.75,GT.z+4.95,0,0,0,0.35,3.5,3.1);addBox(GT.x+s*(TUN+0.175),GT.z+4.95,0,0.175,1.55);});
  // raíces colgando del techo
  for(let i=0;i<14;i++){const a=rr(0,Math.PI*2),rad=rr(0.4,3.0),x=GT.x+Math.sin(a)*rad,z=GT.z+Math.cos(a)*rad,top=GT.y+4.5-rad*0.25,len=rr(0.8,1.9);
    t.add(taperTube([new THREE.Vector3(x,top,z),new THREE.Vector3(x+rr(-.2,.2),top-len*0.5,z+rr(-.2,.2)),new THREE.Vector3(x+rr(-.3,.3),top-len,z+rr(-.3,.3))],0.09,0.02,5,6).g,'#7a5a46',0,0,0);}
  // musgo y piedras en el suelo
  for(let i=0;i<10;i++){const a=rr(0,Math.PI*2),rad=rr(1.2,3.1);t.add(blobs[i%3],pick(['#3f6a5a','#4f7a5a','#355a52']),GT.x+Math.sin(a)*rad,GT.y+0.02,GT.z+Math.cos(a)*rad,0,rr(0,6),0,rr(0.4,0.8),0.05,rr(0.4,0.7));}
  // piedra con una espiral que brilla (para algún nivel)
  t.add(rockG[2],'#6e6789',GT.x-1.1,GT.y+0.35,GT.z-1.6,0,0.5,0,0.62,0.7,0.5);colW(GT.x-1.1,GT.z-1.6,0.55);
  t.mesh(mLit,true,CAVEI);
  const g=Batch();
  // cristales al fondo
  for(let i=0;i<9;i++){const a=Math.PI+rr(-0.9,0.9),rad=rr(2.5,3.2),x=GT.x+Math.sin(a)*rad,z=GT.z+Math.cos(a)*rad,hh=rr(0.35,1.0);g.add(octG,pick(['#7fe8ff','#b88aff','#9ff0e0']),x,GT.y+hh*0.7,z,rr(-.4,.4),rr(0,3),rr(-.4,.4),hh*0.28,hh,hh*0.28);}
  colW(GT.x,GT.z-2.85,0.9);colW(GT.x-1.6,GT.z-2.3,0.6);colW(GT.x+1.6,GT.z-2.3,0.6);
  // setas que brillan junto a la pared
  for(let i=0;i<8;i++){const a=rr(0.6,Math.PI*2-0.6),rad=rr(2.9,3.3),x=GT.x+Math.sin(a)*rad,z=GT.z+Math.cos(a)*rad,s=rr(0.1,0.2);g.add(new THREE.SphereGeometry(1,10,6,0,Math.PI*2,0,Math.PI/2),pick(['#62dcf4','#ff7fc4','#b98cf0']),x,GT.y+s*1.3,z,0,0,0,s,s*0.7,s);}
  // espiral de la piedra
  {const pts=[];for(let i=0;i<=40;i++){const a=i/40*Math.PI*5,rad=0.04+i/40*0.26;pts.push(new THREE.Vector3(Math.cos(a)*rad,Math.sin(a)*rad,0));}
   const sp=new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts),60,0.022,4);g.base=TRS(GT.x-1.1,GT.y+0.55,GT.z-1.6+0.47,0,0.15,0);g.add(sp,'#8ff0ff',0,0,0);g.base=null;}
  // charquito luminoso
  const pool=new THREE.Mesh(new THREE.CircleGeometry(0.75,20),new THREE.MeshBasicMaterial({color:'#3fd0c8',transparent:true,opacity:0.85}));pool.rotation.x=-Math.PI/2;pool.position.set(GT.x+2.0,GT.y+0.03,GT.z-0.8);CAVEI.add(pool);colW(GT.x+2.0,GT.z-0.8,0.6);
  g.mesh(mGlowB,false,CAVEI);
  caveGlow.push(halo(CAVEI,GT.x,GT.y+0.8,GT.z-2.8,3.2,'#7fe8ff',0.45),halo(CAVEI,GT.x-1.1,GT.y+0.6,GT.z-1.1,1.6,'#8ff0ff',0.4),halo(CAVEI,GT.x+2,GT.y+0.3,GT.z-0.8,2,'#3fd0c8',0.35));
  [[2.4,3.6,0.9],[-2.2,3.8,0.8]].forEach(([dx,y,s])=>{const m=new THREE.Mesh(planeG,mWeb);m.position.set(GT.x+dx,GT.y+y,GT.z+2.4);m.scale.setScalar(s);m.rotation.y=Math.PI;CAVEI.add(m);});
}

/* ---------- casas abandonadas ---------- */
function buildHouse(H){
  H.ext=new THREE.Group();H.int=new THREE.Group();world.add(H.ext);world.add(H.int);
  const M=TRS(H.x,H.y,H.z,0,H.yaw,0),w=H.w,d=H.d,h=H.h,T=0.3,DW=1.3,DH=2.25,SB=1.1,rh=h*0.62;
  const e=Batch(),it=Batch();e.base=M;it.base=M;
  const ST=['#8a8290','#7a7282','#958c9a','#847b8c'],WD=['#7a5a44','#6b4d3a','#86644b'],WDd='#4f3a2c';
  const wallE=(cx,cz,lx,lz)=>{e.add(BOX,pick(ST),cx,SB/2,cz,0,0,0,lx,SB,lz);e.add(BOX,pick(WD),cx,SB+(h-SB)/2,cz,0,0,0,lx-0.03,h-SB,lz-0.03);};
  const fl=(w+T)/2-DW/2;
  wallE(0,-d/2,w+T,T);wallE(-w/2,0,T,d);wallE(w/2,0,T,d);wallE(-(DW/2+fl/2),d/2,fl,T);wallE(DW/2+fl/2,d/2,fl,T);
  e.add(BOX,WDd,0,DH+(h-DH)/2,d/2,0,0,0,DW+0.1,h-DH,T);
  // entramado de madera
  [[-w/2,-d/2],[w/2,-d/2],[-w/2,d/2],[w/2,d/2]].forEach(([x,z])=>e.add(BOX,WDd,x,h/2,z,0,0,0,0.36,h,0.36));
  [SB,h-0.06].forEach(y=>{e.add(BOX,WDd,0,y,-d/2,0,0,0,w+0.36,0.14,0.36);e.add(BOX,WDd,0,y,d/2,0,0,0,w+0.36,0.14,0.36);e.add(BOX,WDd,-w/2,y,0,0,0,0,0.36,0.14,d);e.add(BOX,WDd,w/2,y,0,0,0,0,0.36,0.14,d);});
  [-1,1].forEach(s=>e.add(BOX,WDd,s*(DW/2+0.08),DH/2,d/2,0,0,0,0.14,DH,0.38));
  // hastiales y tejado (con agujero en la casa grande)
  const gs=new THREE.Shape([new THREE.Vector2(-w/2-0.15,0),new THREE.Vector2(w/2+0.15,0),new THREE.Vector2(0,rh)]),gg=new THREE.ExtrudeGeometry(gs,{depth:T,bevelEnabled:false});gg.translate(0,0,-T/2);
  e.add(gg,pick(WD),0,h,d/2);e.add(gg,pick(WD),0,h,-d/2);
  const RC=['#5a4636','#4f3d30','#625040'],ex=w/2+0.5,ey=h-0.3*rh/(w/2),len=Math.hypot(ex,rh+0.3-(ey-h)),ang=Math.atan2(h+rh+0.06-ey,ex),N=6,dd=(d+0.9)/N;
  [-1,1].forEach(s=>{for(let k=0;k<N;k++){if(H.big&&s>0&&(k===2||k===3))continue;const z=-(d+0.9)/2+dd*(k+0.5);e.add(BOX,pick(RC),s*ex/2,(ey+h+rh+0.06)/2,z,0,0,-s*ang,len,0.16,dd+0.02);}});
  if(H.big){const k0=2;for(let q=0;q<3;q++){const z=-(d+0.9)/2+dd*(k0+0.3+q*0.6);e.add(BOX,WDd,ex/2,(ey+h+rh)/2-0.1,z,0,0,-ang,len*0.8,0.08,0.09);}
    e.add(BOX,pick(RC),ex*0.75,(ey*3+h+rh)/4,-(d+0.9)/2+dd*2.6,0,0.2,-ang-0.15,len*0.45,0.14,dd*0.9);}
  e.add(BOX,WDd,0,h+rh+0.08,0,0,0,0,0.22,0.22,d+1.0);
  for(let i=0;i<9;i++){const s=R()<0.5?-1:1,u=rr(0.15,0.85),z=rr(-d/2,d/2);if(H.big&&s>0&&z>-0.9&&z<0.6)continue;e.add(blobs[i%3],pick(['#6f8a48','#7d8f3f','#5d7a3a']),s*ex*(1-u),ey+(h+rh-ey)*u+0.12,z,0,rr(0,6),-s*ang,rr(0.4,0.8),0.12,rr(0.4,0.9));}
  if(H.big){e.add(BOX,'#7a7282',w/2-1.1,h+rh*0.6,-d/4,0,0,0,0.7,rh*1.5,0.7);e.add(BOX,'#5f5866',w/2-1.1,h+rh*1.37,-d/4,0,0,0,0.8,0.14,0.8);}
  // ventanas
  const win=(x,z,ry)=>{e.base=M.clone().multiply(TRS(x,1.65,z,0,ry,0));
    e.add(BOX,'#1c1824',0,0,0.01,0,0,0,0.9,0.8,0.04);[[0,0.45,1.05,0.1],[0,-0.45,1.1,0.12],[-0.5,0,0.1,0.9],[0.5,0,0.1,0.9]].forEach(([a,b2,c2,d2])=>e.add(BOX,WDd,a,b2,0.05,0,0,0,c2,d2,0.1));
    e.add(BOX,pick(WD),-0.75,-0.15,0.15,0,0.6,0.35,0.45,0.85,0.05);e.base=M;
    it.base=M.clone().multiply(TRS(x,1.65,z,0,ry+Math.PI,0));it.add(BOX,'#1c1824',0,0,0.32,0,0,0,0.9,0.8,0.02);[[0,0.45,1.0,0.08],[0,-0.45,1.0,0.1],[-0.48,0,0.08,0.9],[0.48,0,0.08,0.9]].forEach(([a,b2,c2,d2])=>it.add(BOX,WDd,a,b2,0.34,0,0,0,c2,d2,0.06));it.base=M;};
  win(-w/2-0.16,0.2,-Math.PI/2);win(w/2+0.16,-0.3,Math.PI/2);if(H.big)win(1.9,-d/2-0.16,Math.PI);
  // puerta: entornada en la casa grande, caída en la casita
  if(H.big){e.base=M.clone().multiply(TRS(-DW/2+0.05,0,d/2+0.12,0,-1.85,0));e.add(BOX,'#6b4a33',DW/2-0.05,DH/2,0,0,0,0,DW-0.12,DH-0.1,0.08);[0.5,DH-0.5].forEach(y=>e.add(BOX,'#3f3a44',DW/2,y,0.05,0,0,0,DW-0.1,0.08,0.04));e.base=M;}
  else{e.add(BOX,'#6b4a33',0.4,0.06,d/2+1.4,0,0.35,0.06,DW-0.1,0.08,DH-0.2);}
  e.mesh(mLit,true,H.ext);
  // ---- interior ----
  const IS='#6f6872',IW='#7a5c46',iw=w-T,id=d-T;
  const wallI=(x,z,ry,len,y0,y1,col)=>it.add(planeG,col,x,(y0+y1)/2,z,0,ry,0,len,y1-y0,1);
  [[0,-id/2,0,iw],[-iw/2,0,Math.PI/2,id],[iw/2,0,-Math.PI/2,id]].forEach(([x,z,ry,len])=>{wallI(x,z,ry,len,0,SB,IS);wallI(x,z,ry,len,SB,h,IW);});
  const fw=iw/2-DW/2;[-1,1].forEach(s=>{wallI(s*(DW/2+fw/2),id/2,Math.PI,fw,0,SB,IS);wallI(s*(DW/2+fw/2),id/2,Math.PI,fw,SB,h,IW);});wallI(0,id/2,Math.PI,DW,DH,h,IW);
  [[0,-id/2+0.05,iw,0.1],[0,id/2-0.05,iw,0.1]].forEach(([x,z,a,b2])=>it.add(BOX,WDd,x,h-0.06,z,0,0,0,a,0.12,b2));[-1,1].forEach(s=>it.add(BOX,WDd,s*(iw/2-0.05),h-0.06,0,0,0,0,0.1,0.12,id));
  // suelo de tablas (faltan algunas)
  const nb=Math.floor(id/0.3);for(let i=0;i<nb;i++){const z=-id/2+0.15+i*0.3;if(R()<0.09)continue;if(!H.big&&i>nb*0.55&&i<nb*0.75)continue;it.add(BOX,pick(['#8a6a50','#7d5f47','#957358','#6f5440']),0,0.05,z,0,0,rr(-.01,.01),iw,0.06,0.28);}
  return {it,M,IS,IW,WDd,iw,id};
}
function webAt(H,lx,y,lz,ry,s){const p=hW(H,lx,lz),m=new THREE.Mesh(planeG,mWeb);m.position.set(p[0],H.y+y,p[1]);m.rotation.y=H.yaw+ry;m.scale.setScalar(s);H.int.add(m);}
function houseCol(H){const w=H.w,d=H.d,T=0.3,DW=1.3,fl=(w+T)/2-DW/2;
  boxH(H,0,-d/2,w/2+0.15,0.15);boxH(H,-w/2,0,0.15,d/2+0.15);boxH(H,w/2,0,0.15,d/2+0.15);
  boxH(H,-(DW/2+fl/2),d/2,fl/2,0.15);boxH(H,DW/2+fl/2,d/2,fl/2,0.15);}
{
  // casa grande
  const H=H1,{it,M}=buildHouse(H);houseCol(H);const w=H.w,d=H.d,b=it;
  const at=(x,z,ry)=>{b.base=M.clone().multiply(TRS(x,0,z,0,ry||0,0));};
  // cama rota
  at(-w/2+1.05,-d/2+1.35,0);b.add(BOX,'#4f3526',0,0.3,0,0,0,0,1.3,0.14,2.2);b.add(BOX,'#3d281d',0,0.75,-1.08,0,0,0,1.3,0.9,0.12);[[-0.6,-1.05],[0.6,-1.05],[-0.6,1.05]].forEach(([x,z])=>b.add(BOX,'#3d281d',x,0.2,z,0,0,0,0.1,0.4,0.1));
  b.add(BOX,'#3d281d',0.58,0.08,1.05,0,0,1.1,0.1,0.4,0.1);b.add(BOX,'#c9b9a6',0,0.43,0,0,0,0.04,1.2,0.14,2.0);b.add(BOX,'#6d5a8a',0.05,0.53,0.4,0.05,0.1,0.03,1.25,0.06,1.1);colH(H,-w/2+1.05,-d/2+0.8,0.7);colH(H,-w/2+1.05,-d/2+1.9,0.7);
  // chimenea
  at(1.2,-d/2+0.45,0);b.add(BOX,'#7a7282',0,0.7,0,0,0,0,1.7,1.4,0.6);b.add(BOX,'#1c1824',0,0.5,0.28,0,0,0,0.9,0.7,0.06);b.add(BOX,'#5f5866',0,1.42,0.05,0,0,0,1.9,0.12,0.75);b.add(BOX,'#7a7282',0,2.25,-0.1,0,0,0,0.9,1.6,0.4);
  b.add(blobs[1],'#8a8290',0,0.08,0.15,0,0,0,0.35,0.08,0.2);b.add(C6,'#3f2c22',-0.15,0.12,0.15,0,0.4,Math.PI/2,0.05,0.5,0.05);colH(H,1.2,-d/2+0.45,0.6);colH(H,0.65,-d/2+0.45,0.45);colH(H,1.75,-d/2+0.45,0.45);
  // mesa, sillas, botellas
  at(1.4,0.55,0.15);b.add(BOX,'#6b4a30',0,0.75,0,0,0,0,1.5,0.08,0.85);[[-1,-1],[1,-1],[-1,1],[1,1]].forEach(([i,j])=>b.add(BOX,'#553924',i*0.65,0.37,j*0.33,0,0,0,0.08,0.74,0.08));
  [[-0.4,0.1,'#4f7a4a'],[-0.2,-0.15,'#7a5a3a'],[0.35,0.05,'#4f6a7a']].forEach(([x,z,c])=>{b.add(C6,c,x,0.91,z,0,0,0,0.05,0.24,0.05);b.add(C6,c,x,1.06,z,0,0,0,0.02,0.08,0.02);});
  b.add(C6,'#4f7a4a',0.1,0.83,0.2,0,0.3,Math.PI/2,0.05,0.24,0.05);b.add(C6,'#cfc8b8',0.55,0.8,-0.2,0,0,0,0.12,0.02,0.12);colH(H,1.05,0.5,0.5);colH(H,1.75,0.6,0.5);
  at(1.5,1.55,0.4);b.add(BOX,'#6b4a30',0,0.45,0,0,0,0,0.5,0.06,0.5);[[-1,-1],[1,-1],[-1,1],[1,1]].forEach(([i,j])=>b.add(BOX,'#553924',i*0.21,j<0?0.55:0.22,j*0.21,0,0,0,0.06,j<0?1.1:0.44,0.06));b.add(BOX,'#6b4a30',0,0.95,-0.21,0,0,0,0.5,0.2,0.05);colH(H,1.5,1.55,0.3);
  at(0.3,0.0,1.2);b.base.multiply(TRS(0,0.25,0,Math.PI/2,0,0));b.add(BOX,'#6b4a30',0,0.45,0,0,0,0,0.5,0.06,0.5);[[-1,-1],[1,-1],[-1,1],[1,1]].forEach(([i,j])=>b.add(BOX,'#553924',i*0.21,j<0?0.55:0.22,j*0.21,0,0,0,0.06,j<0?1.1:0.44,0.06));colH(H,0.3,0.0,0.35);
  // estante con tarros
  at(w/2-0.4,-0.8,-Math.PI/2);[0.9,1.45,2.0].forEach(y=>b.add(BOX,'#6e4a30',0,y,0,0,0,0,1.6,0.06,0.35));[-0.78,0.78].forEach(x=>b.add(BOX,'#5a3d2a',x,1.2,0,0,0,0,0.06,2.2,0.35));
  for(let i=0;i<7;i++){const y=[0.9,1.45,2.0][i%3]+0.12,x=-0.6+(i*0.37)%1.2;b.add(C6,pick(['#8a9aa0','#9a8a70','#7a8a6a','#a07a8a']),x,y,0,0,0,0,0.07,0.2,0.07);}
  colH(H,w/2-0.4,-0.8,0.45);colH(H,w/2-0.4,-0.1,0.4);colH(H,w/2-0.4,-1.5,0.4);
  // barril, cajas, escoba
  at(w/2-0.65,d/2-0.7,0);b.add(C14,'#7a5536',0,0.4,0,0,0,0,0.35,0.8,0.35);b.add(C14,'#4a4548',0,0.65,0,0,0,0,0.36,0.05,0.36);colH(H,w/2-0.65,d/2-0.7,0.4);
  at(-w/2+0.7,d/2-0.75,0.3);b.add(BOX,'#8a6a4a',0,0.3,0,0,0,0,0.6,0.6,0.6);b.add(BOX,'#7a5a3a',0.1,0.85,0,0,0.4,0,0.5,0.5,0.5);colH(H,-w/2+0.7,d/2-0.75,0.45);
  at(-w/2+0.25,0.9,0);b.base.multiply(TRS(0,0,0,0,0,-0.18));b.add(C6,'#8a5d3a',0,0.75,0,0,0,0,0.025,1.4,0.025);b.add(CONE6,'#c9a04e',0,0,0,0,0,0,0.13,0.45,0.1);
  // alfombra rota y luz de luna por el agujero del tejado
  b.base=M;b.add(C14,'#6a4a6a',-0.6,0.09,0.6,0,0,0,1.1,0.01,0.8);
  const shaft=new THREE.Mesh(new THREE.CylinderGeometry(0.5,1.0,H.h+1.2,10,1,true),new THREE.MeshBasicMaterial({color:'#dce6ff',transparent:true,opacity:0.1,depthWrite:false,side:THREE.DoubleSide}));
  const sp=hW(H,1.6,-0.1);shaft.position.set(sp[0],H.y+(H.h+1.2)/2,sp[1]);shaft.rotation.z=0.12;H.int.add(shaft);
  const patch=new THREE.Mesh(new THREE.CircleGeometry(1,18),new THREE.MeshBasicMaterial({color:'#e6efff',transparent:true,opacity:0.18,depthWrite:false}));patch.rotation.x=-Math.PI/2;patch.position.set(sp[0],H.y+0.1,sp[1]);H.int.add(patch);
  // hiedra que entra por la ventana
  b.base=M;for(let i=0;i<16;i++)b.add(leafG,pick(['#5d7a3a','#4c6832','#6f8b45']),-w/2+0.2,rr(1.1,2.4),0.2+rr(-0.6,0.6),0,Math.PI/2+rr(-.4,.4),rr(0,6),rr(0.9,1.5),rr(0.9,1.5),1);
  it.base=null;it.mesh(mLit,true,H.int).receiveShadow=true;
  webAt(H,-w/2+0.45,H.h-0.45,-d/2+0.45,Math.PI/4,1.0);webAt(H,w/2-0.45,H.h-0.45,d/2-0.45,-Math.PI*0.75,0.9);webAt(H,-w/2+0.45,H.h-0.5,d/2-0.45,Math.PI*0.75,0.8);
  // huerto con valla
  const g=Batch(),gx=H.w/2+3.3,gz=0.3,GW=5.2,GD=5.4;g.base=M;
  const post=(x,z,lean)=>g.add(BOX,'#7a5a44',x,0.5,z,lean||0,0,rr(-.06,.06),0.12,1.0,0.12);
  const rail=(x0,z0,x1,z1,y)=>{const L2=Math.hypot(x1-x0,z1-z0);g.add(BOX,'#86644b',(x0+x1)/2,y,(z0+z1)/2,0,Math.atan2(x1-x0,z1-z0),rr(-.04,.04),0.06,0.08,L2);};
  const side=(x0,z0,x1,z1,gap)=>{const L2=Math.hypot(x1-x0,z1-z0),n2=Math.ceil(L2/0.9);for(let i=0;i<=n2;i++){const u=i/n2,x=lerp(x0,x1,u),z=lerp(z0,z1,u);if(gap&&Math.abs(u-0.5)<0.14)continue;post(x,z,R()<0.15?0.25:0);}
    if(gap){[[0,0.36],[0.64,1]].forEach(([a,c2])=>{[0.4,0.8].forEach(y=>rail(lerp(x0,x1,a),lerp(z0,z1,a),lerp(x0,x1,c2),lerp(z0,z1,c2),y));});}
    else [0.4,0.8].forEach(y=>rail(x0,z0,x1,z1,y));};
  const X0=gx-GW/2,X1=gx+GW/2,Z0=gz-GD/2,Z1=gz+GD/2;
  side(X0,Z0,X1,Z0);side(X1,Z0,X1,Z1);side(X0,Z1,X1,Z1,true);side(X0,Z0,X0,Z1);
  boxH(H,gx,Z0,GW/2,0.08);boxH(H,X1,gz,0.08,GD/2);boxH(H,X0,gz,0.08,GD/2);boxH(H,X0+GW*0.18,Z1,GW*0.18,0.08);boxH(H,X1-GW*0.18,Z1,GW*0.18,0.08);
  for(let r2=0;r2<3;r2++){const x=X0+1+r2*1.6;g.add(BOX,'#4a3a32',x,0.04,gz-0.4,0,0,0,0.8,0.08,GD-1.8);for(let k=0;k<5;k++){const z=Z0+1.1+k*0.75;
    if(r2===1&&k%2===0){g.add(blobs[k%3],'#e0832e',x,0.2,z,0,rr(0,6),0,0.24,0.2,0.24);g.add(C6,'#5d7a3a',x,0.42,z,0,0,0.3,0.02,0.1,0.02);colH(H,x,z,0.22);}
    else{g.add(blobs[k%3],pick(['#5d8a3a','#6f9a45','#4c7a32']),x,0.18,z,0,rr(0,6),0,0.22,0.16,0.22);}}}
  // espantapájaros
  g.add(C6,'#7a5a44',X1-0.9,0.9,Z0+1.0,0,0,0,0.04,1.8,0.04);g.add(BOX,'#7a5a44',X1-0.9,1.35,Z0+1.0,0,0.3,0,0.9,0.05,0.05);g.add(BOX,'#8a6a8a',X1-0.9,1.15,Z0+1.0,0,0.3,0,0.45,0.55,0.2);
  g.add(blobs[0],'#d9c08a',X1-0.9,1.75,Z0+1.0,0,0,0,0.17,0.19,0.17);g.add(CONE(8),'#3a3240',X1-0.9,1.88,Z0+1.0,0.1,0,0.15,0.2,0.3,0.2);colH(H,X1-0.9,Z0+1.0,0.25);
  g.base=null;g.mesh(mLit,true);
}
{
  // casita
  const H=H2,{it,M}=buildHouse(H);houseCol(H);const w=H.w,d=H.d,b=it;
  const at=(x,z,ry)=>{b.base=M.clone().multiply(TRS(x,0,z,0,ry||0,0));};
  // mesa con un libro viejo
  at(-0.5,-0.4,0.1);b.add(BOX,'#6b4a30',0,0.72,0,0,0,0,1.3,0.08,0.8);[[-1,-1],[1,-1],[-1,1],[1,1]].forEach(([i,j])=>b.add(BOX,'#553924',i*0.56,0.36,j*0.32,0,0,0,0.08,0.72,0.08));
  b.add(BOX,'#5c2f3a',0,0.79,0,0.3,0,0,0.5,0.04,0.36);b.add(BOX,'#e8d6a8',0,0.82,0,0.3,0,0,0.46,0.03,0.32);b.add(C6,'#9a8a70',0.45,0.86,-0.15,0,0,0,0.06,0.18,0.06);colH(H,-0.5,-0.4,0.6);
  // armario con una puerta abierta
  at(1.2,-d/2+0.45,0);b.add(BOX,'#5a3d2a',0,1.0,0,0,0,0,1.1,2.0,0.6);b.add(BOX,'#2c1e18',0,1.0,0.27,0,0,0,0.95,1.8,0.06);[0.6,1.2].forEach(y=>b.add(BOX,'#6e4a30',0,y,0.1,0,0,0,0.95,0.05,0.4));
  [-0.25,0.1,0.3].forEach(x=>b.add(C14,'#cfc8b8',x,1.33,0.1,Math.PI/2,0,0,0.12,0.02,0.12));b.base.multiply(TRS(0.55,0,0.3,0,-1.2,0));b.add(BOX,'#6b4a33',-0.24,1.0,0,0,0,0,0.5,1.85,0.05);colH(H,0.95,-d/2+0.45,0.45);colH(H,1.45,-d/2+0.45,0.45);
  // rueca
  at(-w/2+0.9,-d/2+0.9,0.6);b.add(new THREE.TorusGeometry(0.42,0.03,6,22),'#7a5a44',0,0.8,0,0,Math.PI/2,0);b.add(C6,'#5a3d2a',0,0.8,0,0,0,Math.PI/2,0.04,0.2,0.04);
  [[-1,0.2],[1,0.2],[0,-0.3]].forEach(([s,z])=>b.add(BOX,'#5a3d2a',s*0.1,0.4,z,0.2*s,0,0,0.05,0.8,0.05));b.add(BOX,'#6b4a30',0,0.35,-0.2,0,0,0,0.25,0.06,0.6);colH(H,-w/2+0.9,-d/2+0.9,0.5);
  // cajas, sacos, escalera de mano
  at(w/2-0.6,0.9,0.2);b.add(BOX,'#8a6a4a',0,0.3,0,0,0,0,0.6,0.6,0.6);b.add(BOX,'#7a5a3a',-0.05,0.85,0.05,0,0.5,0,0.5,0.5,0.5);colH(H,w/2-0.6,0.9,0.45);
  at(w/2-0.55,-0.4,0);b.add(ico(1,1),'#a98659',0,0.32,0,0,0,0.1,0.3,0.34,0.28);colH(H,w/2-0.55,-0.4,0.3);
  at(-w/2+0.35,0.9,Math.PI/2);b.base.multiply(TRS(0,0,0,-0.22,0,0));[-0.22,0.22].forEach(x=>b.add(BOX,'#7a5a44',x,1.25,0,0,0,0,0.06,2.5,0.06));for(let k=0;k<6;k++)b.add(BOX,'#86644b',0,0.3+k*0.4,0,0,0,0,0.44,0.05,0.05);
  // agujero en el suelo con hierba
  b.base=M;for(let i=0;i<14;i++)b.add(bladeG,pick(['#5c7a4a','#6f8f4e']),rr(-0.8,0.8),0.0,d*0.15+rr(-0.3,0.3),rr(-.3,.3),rr(0,6),0,0.1,rr(0.3,0.6),1);
  it.base=null;it.mesh(mLit,true,H.int).receiveShadow=true;
  webAt(H,-w/2+0.45,H.h-0.45,-d/2+0.45,Math.PI/4,0.9);webAt(H,w/2-0.45,H.h-0.45,-d/2+0.45,-Math.PI/4,1.0);
}

/* ---------- puente ---------- */
{
  const b=Batch();
  for(let x=RXB-BL;x<=RXB+BL+0.01;x+=0.34){const y=deckY(x);b.add(BOX,pick(['#8a6a50','#7d5f47','#957358']),x,y-0.06,BZ+rr(-0.04,0.04),0,rr(-.02,.02),rr(-.03,.03),0.31,0.1,2.3+rr(-0.12,0.08));}
  const N=14;for(let i=0;i<N;i++){const x0=RXB-BL+i*(2*BL/N),x1=x0+2*BL/N,y0=deckY(x0),y1=deckY(x1);[-0.85,0.85].forEach(dz=>b.add(BOX,'#5f4634',(x0+x1)/2,(y0+y1)/2-0.17,BZ+dz,0,0,Math.atan2(y1-y0,x1-x0),Math.hypot(x1-x0,y1-y0)+0.02,0.14,0.16));
    [-1.2,1.2].forEach(dz=>b.add(BOX,'#86644b',(x0+x1)/2,(y0+y1)/2+0.95,BZ+dz,0,0,Math.atan2(y1-y0,x1-x0),Math.hypot(x1-x0,y1-y0)+0.03,0.1,0.1));}
  for(let i=0;i<=7;i++){const x=RXB-BL+i*(2*BL/7),y=deckY(x);[-1.2,1.2].forEach(dz=>{b.add(BOX,'#6b4d3a',x,y+0.45,BZ+dz,0,0,0,0.16,1.05,0.16);b.add(BOX,'#7a5a44',x,y+1.02,BZ+dz,0,0,0,0.2,0.08,0.2);});}
  [-1.5,1.5].forEach(dx=>[-0.95,0.95].forEach(dz=>b.add(C6,'#4f3a2c',RXB+dx,(WR-1+deckY(RXB+dx))/2,BZ+dz,0,0,0,0.13,deckY(RXB+dx)-WR+1,0.13)));
  b.mesh(mLit,true).receiveShadow=true;
  addBox(RXB,BZ+1.2,0,BL,0.08);addBox(RXB,BZ-1.2,0,BL,0.08);
}

/* ---------- el río ---------- */
const foam=[];
{
  const pos=[],col=[],idx=[],cA=new THREE.Color('#a79fe8'),cB=new THREE.Color('#7068cc');let row=0;
  for(let z=-40;z>=-172;z-=1.5){const x=RX(z),hw=RW+1.4;[[x-hw,cA],[x,cB],[x+hw,cA]].forEach(([xx,c])=>{pos.push(xx,WR,z);col.push(c.r,c.g,c.b);});
    if(row>0){const a=(row-1)*3,b=row*3;idx.push(a,b,a+1,a+1,b,b+1,a+1,b+1,a+2,a+2,b+1,b+2);}row++;}
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('color',new THREE.Float32BufferAttribute(col,3));g.setIndex(idx);
  const m=new THREE.Mesh(g,new THREE.MeshBasicMaterial({vertexColors:true,transparent:true,opacity:0.92,side:THREE.DoubleSide,depthWrite:false}));m.renderOrder=1;world.add(m);
  const fg=new THREE.PlaneGeometry(0.09,1);fg.rotateX(-Math.PI/2);
  for(let i=0;i<30;i++){const f=new THREE.Mesh(fg,new THREE.MeshBasicMaterial({color:'#efeaff',transparent:true,opacity:0.5,depthWrite:false}));f.scale.z=rr(1.2,2.6);f.renderOrder=2;world.add(f);foam.push({m:f,ph:rr(0,130),off:rr(-RW+0.4,RW-0.4),sp:rr(1.0,1.6)});}
}

/* ---------- muralla en ruinas alrededor del torreón ---------- */
{
  const b=Batch(),ST=['#9a92a8','#8a8298','#a69eb4','#7f7890'];
  for(let a=-0.6;a>-2.35;a-=0.096){if(R()<0.22)continue;
    const r=17+rr(-0.15,0.15),x=OX+Math.sin(a)*r,z=OZ+Math.cos(a)*r,y=landH(x,z)-0.1,hh=rr(0.45,1.7);b.base=TRS(x,y,z,0,a,0);
    for(let k=0;k*0.42<hh;k++){const hk=Math.min(0.42,hh-k*0.42);b.add(BOX,pick(ST),rr(-0.06,0.06),k*0.42+hk/2,0,0,rr(-.05,.05),0,1.5+rr(-0.15,0.1),hk-0.02,0.62);}
    if(R()<0.3)for(let i=0;i<4;i++)b.add(leafG,pick(['#5d7a3a','#4c6832','#6f8b45']),rr(-0.6,0.6),hh+0.02,rr(-0.3,0.3),-Math.PI/2+rr(-.3,.3),rr(0,6),rr(0,6),1.3,1.3,1.3);
    addBox(x,z,a,0.8,0.33);
    if(R()<0.25){b.base=null;const ra=a+rr(-0.08,0.08),rr2=r+rr(1,2.2);b.add(BOX,pick(ST),OX+Math.sin(ra)*rr2,landH(OX+Math.sin(ra)*rr2,OZ+Math.cos(ra)*rr2)+0.12,OZ+Math.cos(ra)*rr2,rr(-.3,.3),rr(0,3),rr(-.3,.3),0.7,0.38,0.5);}
  }
  b.base=null;b.mesh(mLit,true).receiveShadow=true;
}

/* ---------- casa del árbol (decorado) ---------- */
{
  const y0=landH(TH.x,TH.z),py=y0+4.3,b=Batch();
  b.add(C14,'#7d5f47',TH.x,py,TH.z,0,0,0,2.4,0.22,2.4);
  for(let i=0;i<10;i++){const a=i/10*Math.PI*2;b.add(BOX,'#6b4d3a',TH.x+Math.sin(a)*2.25,py+0.45,TH.z+Math.cos(a)*2.25,0,a,0,0.12,0.8,0.12);}
  b.base=TRS(TH.x+0.4,py+0.11,TH.z-0.3,0,0.5,0);
  b.add(BOX,'#7a5a44',0,1.0,0,0,0,0,2.2,2.0,1.9);b.add(BOX,'#1c1824',0,1.1,0.96,0,0,0,0.6,1.2,0.04);b.add(BOX,'#1c1824',1.11,1.3,0,0,0,0,0.04,0.5,0.6);
  [-1,1].forEach(s=>b.add(BOX,'#5a4636',s*0.6,2.35,0,0,0,-s*0.62,1.35,0.12,2.3));b.add(blobs[0],'#6f8a48',0.4,2.5,0.3,0,0,-0.6,0.5,0.1,0.6);
  b.base=null;
  // escalera de cuerda
  const lx=TH.x+1.4,lz=TH.z+1.9;[-0.22,0.22].forEach(o=>b.add(C6,'#a08860',lx+o,y0+py/2-y0/2,lz,0,0,0,0.02,py-y0,0.02));for(let k=0;k<11;k++)b.add(BOX,'#86644b',lx,y0+0.3+k*0.38,lz,0,0,0,0.5,0.05,0.07);
  // escalones en espiral alrededor del tronco
  for(let k=0;k<9;k++){const a=k*0.62+2.2,yy=y0+0.4+k*0.44;b.add(BOX,'#7d5f47',TH.x+Math.sin(a)*1.05,yy,TH.z+Math.cos(a)*1.05,0,a,0,0.7,0.1,0.4);}
  b.mesh(mLit,true);
}

/* ---------- montañas al fondo ---------- */
{
  const b=Batch();
  [[-120,-178,48,62],[-60,-198,42,74],[-5,-210,50,86],[50,-200,44,68],[105,-185,52,60],[155,-140,44,52],[-160,-130,46,56],[-30,-182,30,46],[80,-172,30,42],[20,-188,28,40]].forEach(([x,z,r,h])=>{
    b.add(coneG7,'#6f68a8',x,-2,z,0,rr(0,3),0,r,h,r*0.9);b.add(coneG7,'#d4cdf0',x,h*0.66-2,z,0,rr(0,3),0,r*0.36,h*0.36,r*0.33);});
  b.mesh(new THREE.MeshBasicMaterial({vertexColors:true,fog:false}),false);
}

/* ---------- zonas, nombres, vida ---------- */
let inCave=false;
const caveTest=(x,z)=>{const lx=x-GT.x,lz=z-GT.z,d=Math.hypot(lx,lz);return d<CAVE_RIN+0.15||(lz>0&&Math.abs(lx)<TUN+0.3&&d<CAVE_ROUT-0.7);};
function worldAnim(dt){
  const t=S.t;
  inCave=mode==='forest'&&!FL.on&&caveTest(S.pos.x,S.pos.z);TREEX.visible=!inCave;
  for(const H of HOUSES){const l=hL(H,S.pos.x,S.pos.z);H.inside=mode==='forest'&&!FL.on&&Math.abs(l[0])<H.w/2-0.05&&Math.abs(l[1])<H.d/2+0.05;H.ext.visible=!H.inside;}
  for(const f of foam){const z=-168+((t*f.sp+f.ph)%126);f.m.position.set(RX(z)+f.off,WR+0.015,z);f.m.material.opacity=0.45*Math.min(1,(z+168)/6,(-42-z)/6);}
  caveGlow.forEach((h,i)=>h.material.opacity=0.32+0.14*Math.sin(t*1.7+i*2));
}
function zoneKey(){
  if(inCave)return 'cave';
  for(const H of HOUSES)if(H.inside){const c=hW(H,0.6,-0.2);LIGHTS.house[0][0]=c[0]-OX;LIGHTS.house[0][1]=H.y+2.4-OY;LIGHTS.house[0][2]=c[1]-OZ;const w2=hW(H,-H.w/2+0.4,0.2);LIGHTS.house[1][0]=w2[0]-OX;LIGHTS.house[1][1]=H.y+1.7-OY;LIGHTS.house[1][2]=w2[1]-OZ;return 'house';}
  return 'out';
}
function forestName(){
  const x=S.pos.x,z=S.pos.z;
  if(inCave)return 'la cova de l\'arbre';if(H1.inside)return 'la casa abandonada';if(H2.inside)return 'la caseta abandonada';
  if(onBridge(x,z))return 'el pont';if(z<-38&&Math.abs(x-RX(z))<RW+5)return 'el riu';
  if(Math.hypot(x-GT.x,z-GT.z)<16)return 'l\'arbre gegant';
  if(Math.hypot(x-H1.x,z-H1.z)<11||Math.hypot(x-H2.x,z-H2.z)<9||Math.hypot(x-TH.x,z-TH.z)<7)return 'les cases abandonades';
  if(valE(x,z)<1.02&&z<-46)return 'el bosc encantat';
  if(pondD(x,z)<1.6)return 'l\'estany de les granotes';
  return z<-12?'el camí del torreó':'el bosc';
}
function surfForest(x,z){
  if(waterAt(x,z)>gY(x,z)+0.015)return 'water';
  if(onBridge(x,z))return 'wood';
  for(const H of HOUSES){const l=hL(H,x,z);if(Math.abs(l[0])<H.w/2&&Math.abs(l[1])<H.d/2)return 'wood';}
  if(Math.hypot(x-GT.x,z-GT.z)<CAVE_ROUT+1)return 'path';
  if((Math.abs(x-pathX(z))<1.15&&z>OZ+8)||distPaths(x,z)<1.0)return 'path';
  return 'grass';
}
