function landH(x,z){
  let h=0.2*Math.sin(x*0.31+1)*Math.cos(z*0.27)+0.1*Math.sin(x*0.7+z*0.5);
  h+=3.8*smooth(-21,-45,z);
  const r=Math.hypot(x,z),lat=Math.abs(x-pathX(z)),open=z<-8?1-smooth(4.5,10,lat):0;
  h+=smooth(18.5,30,r)*1.4*(1-open)+smooth(4.5,12,lat)*smooth(-12,-20,z)*1.3;
  const d=pondD(x,z);if(d<1.06)h=lerp(-0.95,h,smooth(0.72,1.06,d));
  h=extraH(x,z,h);
  const dtw=Math.hypot(x-OX,z-OZ);if(dtw<21){h=lerp(OY,h,smooth(15.5,21,dtw));const dtu=Math.hypot(x-OX+10.6,z-OZ);h-=0.7*Math.max(1-smooth(7.0,8.0,dtw),1-smooth(2.6,3.4,dtu));}
  return h;
}
function bound(x,z){
  let bx=x,bz=z,bd=1e9;const tryP=(px,pz)=>{const d=(px-x)*(px-x)+(pz-z)*(pz-z);if(d<bd){bd=d;bx=px;bz=pz;}};
  {let ax=x,az=Math.min(z,17);const r=Math.hypot(ax,az);if(r>16.3){ax=ax*16.3/r;az=az*16.3/r;}tryP(ax,az);}
  {const cz=clamp(z,-46.5,-9),cx=clamp(x,pathX(cz)-3.1,pathX(cz)+3.1);tryP(cx,cz);}
  {let ex=x-OX,ez=z-OZ;const r=Math.hypot(ex,ez);if(r>15){ex*=15/r;ez*=15/r;}tryP(OX+ex,OZ+ez);}
  {let ex=(x-VC.x)/(VRX-1.6),ez=(z-VC.z)/(VRZ-1.6);const r=Math.hypot(ex,ez);if(r>1){ex/=r;ez/=r;}tryP(VC.x+ex*(VRX-1.6),VC.z+ez*(VRZ-1.6));}
  x=bx;z=bz;
  const d=pondD(x,z);if(d<0.55){x=POND.x+(x-POND.x)*0.55/d;z=POND.z+(z-POND.z)*0.55/d;}
  return [x,z];
}
{
  const g=new THREE.PlaneGeometry(196,240,236,290);g.rotateX(-Math.PI/2);g.translate(0,0,-48);
  const p=g.attributes.position,cols=new Float32Array(p.count*3),c=new THREE.Color();
  const LIT=new THREE.Color('#a9aa50'),VIO=new THREE.Color('#77648c'),PATH=new THREE.Color('#c6b862'),MUD=new THREE.Color('#5d5878'),DEEP=new THREE.Color('#2b5263'),FAR=new THREE.Color('#3b4a6a'),HILL=new THREE.Color('#6f7a5a');
  for(let i=0;i<p.count;i++){
    const x=p.getX(i),z=p.getZ(i);p.setY(i,landH(x,z));
    const n=0.5+0.5*Math.sin(x*0.33+2*Math.sin(z*0.21))*Math.cos(z*0.29+1.3*Math.sin(x*0.17));
    c.set('#5f7a56').lerp(LIT,smooth(0.42,0.68,n)).lerp(VIO,smooth(0.3,0.08,n)*0.75);
    const lat=Math.abs(x-pathX(z)),r=Math.hypot(x,z),open=z<-8?1-smooth(4.5,10,lat):0;
    const dtw=Math.hypot(x-OX,z-OZ),clr=1-smooth(15,21,dtw);c.lerp(FAR,Math.max(smooth(19,32,r)*(1-open),smooth(5,11,lat)*smooth(-12,-20,z))*(1-clr)*(1-VF(x,z)));c.lerp(PATH,clr*(1-smooth(8.3,9.8,dtw))*0.7);
    if(z<17.5&&z>OZ+7.8)c.lerp(PATH,(1-smooth(0.7+0.35*Math.sin(z*0.9),1.9+0.4*Math.sin(z*0.6+1),lat))*0.92);
    const d=pondD(x,z);if(d<1.2){c.lerp(MUD,smooth(1.2,1.0,d)*0.8);c.lerp(DEEP,smooth(0.97,0.8,d));}
    extraC(x,z,0,c);cols[i*3]=c.r;cols[i*3+1]=c.g;cols[i*3+2]=c.b;
  }
  g.setAttribute('color',new THREE.BufferAttribute(cols,3));g.computeVertexNormals();
  const m=new THREE.Mesh(g,TOON('#ffffff',{vertexColors:true}));m.receiveShadow=true;world.add(m);
}

/* ---------- agua ---------- */
const ripples=[];
const ringGeo=new THREE.RingGeometry(0.86,1,28);ringGeo.rotateX(-Math.PI/2);
function ripple(x,z,size,loop){
  const m=new THREE.Mesh(ringGeo,new THREE.MeshBasicMaterial({color:'#bfeee2',transparent:true,opacity:0,depthWrite:false}));
  m.position.set(x,WY+0.012,z);world.add(m);const r={m,t:loop?rr(0,1):0,size:size||0.8,loop:!!loop,d:loop?rr(2.2,3.6):1.1};ripples.push(r);return r;
}
{
  const N=56,pos=[0,0,0],col=[],idx=[],c=new THREE.Color('#2f7384');col.push(c.r,c.g,c.b);c.set('#58a69b');
  for(let i=0;i<N;i++){const a=i/N*6.2832,r=pondR(a)*1.02;pos.push(Math.sin(a)*r,0,Math.cos(a)*r);col.push(c.r,c.g,c.b);idx.push(0,1+i,1+(i+1)%N);}
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('color',new THREE.Float32BufferAttribute(col,3));g.setIndex(idx);
  const m=new THREE.Mesh(g,new THREE.MeshBasicMaterial({vertexColors:true,transparent:true,opacity:0.9}));m.position.set(POND.x,WY,POND.z);world.add(m);
}

/* ---------- geometrías de apoyo ---------- */
function taperTube(pts,r0,r1,rs,N){
  const curve=new THREE.CatmullRomCurve3(pts),fr=curve.computeFrenetFrames(N,false),pos=[],idx=[];
  for(let i=0;i<=N;i++){const t=i/N,p=curve.getPointAt(t),r=r0+(r1-r0)*Math.pow(t,0.8),n=fr.normals[i],b=fr.binormals[i];
    for(let j=0;j<rs;j++){const a=j/rs*6.2832,c=Math.cos(a)*r,s=Math.sin(a)*r;pos.push(p.x+c*n.x+s*b.x,p.y+c*n.y+s*b.y,p.z+c*n.z+s*b.z);}}
  for(let i=0;i<N;i++)for(let j=0;j<rs;j++){const a=i*rs+j,b=i*rs+(j+1)%rs,c=a+rs,d=b+rs;idx.push(a,c,b,b,c,d);}
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setIndex(idx);g.computeVertexNormals();
  const p0=curve.getPointAt(0),nx=g.attributes.normal.getX(0),ny=g.attributes.normal.getY(0),nz=g.attributes.normal.getZ(0);
  if(nx*(pos[0]-p0.x)+ny*(pos[1]-p0.y)+nz*(pos[2]-p0.z)<0){for(let i=0;i<idx.length;i+=3){const t=idx[i+1];idx[i+1]=idx[i+2];idx[i+2]=t;}g.setIndex(idx);g.computeVertexNormals();}
  return {g,curve};
}
const blobs=[0,1,2].map(k=>{const g=new THREE.IcosahedronGeometry(1,2),p=g.attributes.position;
  for(let i=0;i<p.count;i++){let x=p.getX(i),y=p.getY(i),z=p.getZ(i);const f=1+0.16*Math.sin(x*4.1+k*2)*Math.cos(z*3.7+k)+0.1*Math.sin(y*5+x*3+k);
    x*=f;z*=f;y*=f;if(y<-0.35)y=-0.35-(y+0.35)*0.25;p.setXYZ(i,x,y,z);}
  const m=new THREE.Mesh(g);const g2=g.toNonIndexed();g2.computeVertexNormals();
  // normales suaves por posición
  const map={},q=g2.attributes.position,nn=g2.attributes.normal;
  for(let i=0;i<q.count;i++){const key=q.getX(i).toFixed(3)+q.getY(i).toFixed(3)+q.getZ(i).toFixed(3);(map[key]=map[key]||[]).push(i);}
  for(const key in map){const a=map[key];let x=0,y=0,z=0;a.forEach(i=>{x+=nn.getX(i);y+=nn.getY(i);z+=nn.getZ(i);});const l=Math.hypot(x,y,z)||1;a.forEach(i=>nn.setXYZ(i,x/l,y/l,z/l));}
  return g2;});
const icoF=d=>{const g=new THREE.IcosahedronGeometry(1,d||0);return g;};
const rockG=[0,1,2].map(k=>{const g=new THREE.IcosahedronGeometry(1,1),p=g.attributes.position;
  for(let i=0;i<p.count;i++){const x=p.getX(i),y=p.getY(i),z=p.getZ(i),f=1+0.22*Math.sin(x*3.3+k*1.7+z*2.1)+0.12*Math.cos(y*4+k);p.setXYZ(i,x*f,Math.max(-0.3,y*f*0.8),z*f);}
  g.computeVertexNormals();return g;});

/* ---------- árboles ---------- */
const PAL={blue:['#4f88d2','#345aa2','#74abe6'],lila:['#c9a0ea','#8f80d2','#e6baf4'],orange:['#ea8648','#c35e52','#f7a652'],teal:['#3f6f92','#2f5078','#4f8aa8']};
const trunkB=Batch(),leafB=Batch(),trees=[];
function tree(x,z,s,pal,yaw,sp){
  const y0=landH(x,z)-0.15,P=PAL[pal],M=TRS(x,y0,z,0,yaw||0,0,s);
  sp=sp||1;
  const j=()=>rr(-0.28,0.28);
  const tp=[[0,0,0],[0.18+j(),1.2,j()],[-0.3+j(),2.5,j()],[0.22+j(),3.7,j()],[0.05+j(),4.7,j()]].map(p=>new THREE.Vector3(p[0],p[1],p[2]));
  const T=taperTube(tp,0.5,0.2,8,14);
  trunkB.base=M;trunkB.sw=[y0+1,0.05];
  trunkB.add(T.g,'#6d4c66',0,0,0);
  // raíces
  for(let i=0;i<4;i++){const a=i*1.57+rr(0,1);trunkB.add(C6,'#5b3f58',Math.sin(a)*0.45,0.12,Math.cos(a)*0.45,0.9*Math.cos(a),0,-0.9*Math.sin(a),0.13,0.9,0.13);}
  leafB.base=M;leafB.sw=[y0+1,0.055];
  const canopy=(cx,cy,cz,w)=>{const k=Math.floor(R()*3),ry=rr(0,6);
    leafB.add(blobs[(k+1)%3],P[1],cx,cy-0.28,cz,0,ry,0,w*0.95,w*0.36,w*0.8);
    leafB.add(blobs[k],P[0],cx,cy,cz,0,ry,0,w,w*0.4,w*0.84);
    leafB.add(blobs[(k+2)%3],P[2],cx-w*0.22,cy+w*0.2,cz-w*0.08,0,ry+1,0,w*0.58,w*0.22,w*0.5);};
  const nb=3,a0=rr(0,6.28);
  for(let i=0;i<nb;i++){
    const a=a0+i*2.1+rr(-.3,.3),st=T.curve.getPointAt(0.45+i*0.14),L=(1.7+rr(0,0.9))*sp;
    const bp=[st.clone(),st.clone().add(new THREE.Vector3(Math.sin(a)*L*0.5,0.5+rr(0,.3),Math.cos(a)*L*0.5)),st.clone().add(new THREE.Vector3(Math.sin(a)*L,1.0+rr(0,.6),Math.cos(a)*L))];
    trunkB.add(taperTube(bp,0.17,0.07,6,6).g,'#6d4c66',0,0,0);
    canopy(bp[2].x,bp[2].y+0.25,bp[2].z,rr(1.5,2.1)*sp);
  }
  canopy(tp[4].x,tp[4].y+0.45,tp[4].z,rr(1.9,2.5)*sp);
  COL.push({x,z,r:0.5*s});
  const t={x,z,s,y0,yaw:yaw||0,curve:T.curve,M};trees.push(t);return t;
}
const T1=tree(-8.5,-1.5,1.25,'blue',0.3,1.2);
tree(3.6,-8.2,1.2,'lila',1.2,1.15);tree(12.2,-3.8,1.25,'orange',2.2,1.2);
tree(-12.5,6.5,1.1,'teal',0);tree(-4.5,-13.5,1.1,'lila',0.7);tree(9.5,-13.2,1.15,'orange',3);
tree(-13.5,-8.5,1.2,'blue',1.9);tree(15.3,3.6,1.1,'orange',4);tree(-9,13.5,1.15,'blue',5);
tree(14,11.5,1.05,'teal',2.5);tree(5,15.8,1.1,'lila',1);tree(-15.8,0.5,1.15,'lila',3.3);
// corredor hacia el torreón y anillo exterior
for(let z=-14;z>-41;z-=4.6){[-1,1].forEach((s,i)=>{const x=pathX(z)+s*rr(6.3,8.2),zz=z+rr(-1,1);if(Math.hypot(x-OX,zz-OZ)>17.5)tree(x,zz,rr(1.0,1.3),pick(['blue','lila','orange','teal']),rr(0,6));});}
for(let i=0;i<26;i++){const a=i/26*6.2832+rr(-.08,.08),r=rr(19.5,23.5),x=Math.sin(a)*r,z=Math.cos(a)*r;if(z<-8&&Math.abs(x-pathX(z))<8.5)continue;tree(x,z,rr(1.15,1.5),pick(['blue','teal','lila','teal','orange']),rr(0,6));COL.pop();}
