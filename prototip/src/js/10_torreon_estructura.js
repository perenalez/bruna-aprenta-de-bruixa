/* =====================================================================
   EL TORREÓN — estructura
   ===================================================================== */
const TW=new THREE.Group();scene.add(TW);TW.position.set(OX,OY,OZ);

const H=4.4,RM=7.5,WT=0.6,TX=-10.6,TR=3.0,TRo=3.55,RB=9,BY=-5.2,LX=0,LZ=-4.4,LR=2.0,PI=Math.PI,TAU=PI*2;
const L=n=>n<0?BY:n*H,sat=x=>clamp(x,0,1);
const mVC=TOON('#ffffff',{vertexColors:true}),mVCd=TOON('#ffffff',{vertexColors:true,side:THREE.DoubleSide}),mGlowVC=new THREE.MeshBasicMaterial({vertexColors:true});
function TBatch(){
  const pos=[],nor=[],col=[],v=new THREE.Vector3(),c=new THREE.Color(),n3=new THREE.Matrix3();
  const B={base:null,
    add(geo,color,x,y,z,rx,ry,rz,sx,sy,sz){
      const g=geo.index?geo.toNonIndexed():geo,m=TRS(x,y,z,rx,ry,rz,sx,sy,sz);
      if(B.base)m.premultiply(B.base);
      n3.getNormalMatrix(m);c.set(color);
      const p=g.attributes.position,n=g.attributes.normal;
      for(let i=0;i<p.count;i++){
        v.fromBufferAttribute(p,i).applyMatrix4(m);pos.push(v.x,v.y,v.z);
        v.fromBufferAttribute(n,i).applyMatrix3(n3).normalize();nor.push(v.x,v.y,v.z);
        col.push(c.r,c.g,c.b);
      }
      return B;
    },
    box(c,x,y,z,sx,sy,sz,ry,rx,rz){return B.add(BOX,c,x,y,z,rx||0,ry||0,rz||0,sx,sy,sz);},
    cyl(c,x,y,z,r,h,n,rx,rz,r2){return B.add(n===6?C6:n===8?C8:C14,c,x,y,z,rx||0,0,rz||0,r,h,r2||r);},
    sph(c,x,y,z,sx,sy,sz){return B.add(S12,c,x,y,z,0,0,0,sx,sy===undefined?sx:sy,sz===undefined?sx:sz);},
    mesh(parent,mat){
      const g=new THREE.BufferGeometry();
      g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));
      g.setAttribute('normal',new THREE.Float32BufferAttribute(nor,3));
      g.setAttribute('color',new THREE.Float32BufferAttribute(col,3));
      const me=new THREE.Mesh(g,mat||mVC);me.castShadow=false;parent.add(me);return me;
    }};
  return B;
}
const C8=new THREE.CylinderGeometry(1,1,1,8),C14=new THREE.CylinderGeometry(1,1,1,14),S12=new THREE.SphereGeometry(1,12,9);
const CONE=n=>{const g=new THREE.ConeGeometry(1,1,n||6);g.translate(0,0.5,0);return g;},CONE6=CONE(6),CONE4=CONE(4);

/* ---------- texturas ---------- */
const stoneTex=canvasTex(2048,1024,(g,w,h)=>{
  const pal=['#8a7a6c','#75675f','#9c8a74','#6a5e5c','#877468','#a39380','#7b7078','#62585b','#93826f','#7f7166'];
  g.fillStyle='#3d3136';g.fillRect(0,0,w,h);
  const rows=8,rh=h/rows;
  for(let r=0;r<rows;r++){
    const y=r*rh,cuts=[rr(0,120)];
    while(true){const n=cuts[cuts.length-1]+rr(95,235);if(n>cuts[0]+w-80)break;cuts.push(n);}
    cuts.push(cuts[0]+w);
    for(let i=0;i<cuts.length-1;i++){
      const x=cuts[i],bw=cuts[i+1]-x,j=()=>rr(3,7);g.fillStyle=pick(pal);const a=j(),b=j(),c2=j(),d=j();
      [0,-w].forEach(o=>{g.beginPath();g.moveTo(x+o+a,y+b);g.lineTo(x+o+bw-c2,y+a);g.lineTo(x+o+bw-b,y+rh-d);g.lineTo(x+o+d,y+rh-c2);g.closePath();g.fill();});
    }
  }
},1,1);
const floorTex=canvasTex(1024,1024,(g,w,h)=>{
  const N=9,cs=w/N,seeds=[],pal=[[141,125,112],[124,109,102],[154,136,119],[133,116,104],[116,104,106],[147,130,111]];
  for(let j=0;j<N;j++)for(let i=0;i<N;i++){const p=pick(pal);seeds.push([(i+0.5+rr(-.4,.4))*cs,(j+0.5+rr(-.4,.4))*cs,p[0],p[1],p[2]]);}
  const img=g.createImageData(w,h),d=img.data;
  for(let y=0;y<h;y++){const cj=Math.floor(y/cs);
    for(let x=0;x<w;x++){const ci=Math.floor(x/cs);let d1=1e9,d2=1e9,s1=null;
      for(let j=cj-2;j<=cj+2;j++)for(let i=ci-2;i<=ci+2;i++){
        const s=seeds[((j+N)%N)*N+(i+N)%N],sx=s[0]+(i<0?-w:i>=N?w:0),sy=s[1]+(j<0?-h:j>=N?h:0),dd=(sx-x)*(sx-x)+(sy-y)*(sy-y);
        if(dd<d1){d2=d1;d1=dd;s1=s;}else if(dd<d2)d2=dd;}
      const e=Math.sqrt(d2)-Math.sqrt(d1)<3.6,k=(y*w+x)*4;
      d[k]=e?62:s1[2];d[k+1]=e?50:s1[3];d[k+2]=e?56:s1[4];d[k+3]=255;
    }}
  g.putImageData(img,0,0);
},2,2);
const mWallIn=TOON('#ffffff',{map:stoneTex,side:THREE.BackSide}),mWallB=TOON('#b9a6c9',{map:stoneTex,side:THREE.BackSide}),mWallOut=TOON('#c4b8d8',{map:stoneTex}),
  mFloor=TOON('#ffffff',{map:floorTex}),mFloorB=TOON('#c9b6d6',{map:floorTex}),mFloorT=TOON('#d9d0c2',{map:floorTex}),mCeil=TOON('#5a4232');

function wallSeg(parent,cx,rad,y0,y1,th0,len,mat){
  if(len<=0.001||y1<=y0)return null;
  const g=new THREE.CylinderGeometry(rad,rad,y1-y0,Math.max(3,Math.ceil(len/0.11)),1,true,th0,len),uv=g.attributes.uv,k=rad*TAU/14.5;
  for(let i=0;i<uv.count;i++)uv.setXY(i,(th0+uv.getX(i)*len)/TAU*k,(y0+uv.getY(i)*(y1-y0))/4.25);
  const m=new THREE.Mesh(g,mat);m.position.set(cx,(y0+y1)/2,0);m.receiveShadow=true;parent.add(m);return m;
}
function ringWall(parent,cx,rad,y0,y1,gaps,mat){
  gaps=gaps.slice().sort((a,b)=>a.th-b.th);
  if(!gaps.length){wallSeg(parent,cx,rad,y0,y1,0,TAU,mat);return;}
  for(let i=0;i<gaps.length;i++){const g=gaps[i],nx=gaps[(i+1)%gaps.length];let a0=g.th+g.ha,a1=nx.th-nx.ha;if(i===gaps.length-1)a1+=TAU;
    wallSeg(parent,cx,rad,y0,y1,a0,a1-a0,mat);
    if(g.top!==undefined&&y0+g.top<y1)wallSeg(parent,cx,rad,y0+g.top,y1,g.th-g.ha,2*g.ha,mat);}
}
function disc(parent,mat,rad,y,x,z,down){const g=new THREE.CircleGeometry(rad,64);g.rotateX(down?PI/2:-PI/2);const m=new THREE.Mesh(g,mat);m.position.set(x||0,y,z||0);m.receiveShadow=true;parent.add(m);return m;}

/* ---------- grupos por planta ---------- */
const G={},TG={};[-1,0,1,2,3].forEach(n=>{G[n]=new THREE.Group();TW.add(G[n]);});[0,1,2,3].forEach(n=>{TG[n]=new THREE.Group();TW.add(TG[n]);});
const EXT=new THREE.Group(),YARD=new THREE.Group(),turretTop=new THREE.Group();TW.add(EXT);TW.add(YARD);G[3].add(turretTop);
const DW=1.7,DH=2.7,W_TH=TAU*0.75,S_TH=0;       // puerta a la escalera (oeste) y entrada (sur)
const gapW={th:W_TH,ha:DW/2/RM,top:DH},gapS={th:S_TH,ha:DW/2/RM,top:DH},gapT={th:PI/2,ha:DW/2/TR+0.02,top:DH};
// plantas 0-2
for(let n=0;n<3;n++){
  ringWall(G[n],0,RM,L(n),L(n+1),n===0?[gapS,gapW]:[gapW],mWallIn);
  disc(G[n],mCeil,RM,L(n+1)-0.22,0,0,true);
  if(n>0)disc(G[n],mFloor,RM+0.02,L(n));
  ringWall(TG[n],TX,TR,L(n),L(n+1),[gapT],mWallIn);
}
ringWall(TG[3],TX,TR,L(3),L(3)+3.3,[gapT],mWallIn);
// suelo de la sala del trono con el hueco del ascensor
{
  const sh=new THREE.Shape();sh.absarc(0,0,RM+WT,0,TAU,false);const ho=new THREE.Path();ho.absarc(LX,-LZ,LR,0,TAU,true);sh.holes.push(ho);
  const g=new THREE.ShapeGeometry(sh,48),p=g.attributes.position,uv=g.attributes.uv;
  for(let i=0;i<p.count;i++)uv.setXY(i,p.getX(i)/(2*RM)+0.5,p.getY(i)/(2*RM)+0.5);
  g.rotateX(-PI/2);const m=new THREE.Mesh(g,mFloor);m.receiveShadow=true;G[0].add(m);
  wallSeg(G[0],LX,LR,-0.6,0,0,TAU,TOON('#4a3d44',{side:THREE.BackSide})).position.z=LZ;
  disc(TG[0],mFloor,TR,0.004,TX,0);
}
// sótano
ringWall(G[-1],0,RB,BY,-0.45,[],mWallB);disc(G[-1],mFloorB,RB,BY);
// terraza
disc(G[3],mFloorT,RM+WT,L(3)+0.002);
{
  const b=TBatch(),a0=W_TH-0.47,a1=W_TH+0.47;
  const g=new THREE.CylinderGeometry(RM+0.38,RM+0.38,0.95,80,1,true,a1,TAU-(a1-a0));const m=new THREE.Mesh(g,TOON('#a99bbd',{map:stoneTex,side:THREE.DoubleSide}));m.position.y=L(3)+0.475;G[3].add(m);
  for(let i=0;i<34;i++){const a=i/34*TAU;let d=Math.abs(wrapA(a-W_TH));if(d<0.5)continue;
    b.add(BOX,i%2?'#b3a6c6':'#a093b4',Math.sin(a)*(RM+0.38),L(3)+(i%2?1.2:1.0),Math.cos(a)*(RM+0.38),0,a,0,i%2?0.95:1.4,i%2?0.5:0.14,0.42);}
  b.mesh(G[3]);
}
// exterior
ringWall(EXT,0,RM+WT,-0.8,L(3)+0.05,[{th:S_TH,ha:DW/2/(RM+WT),top:DH+0.2}],mWallOut);
wallSeg(EXT,TX,TRo,-0.8,L(3),0,TAU,mWallOut);
ringWall(turretTop,TX,TRo,L(3),L(3)+3.3,[{th:PI/2,ha:DW/2/TRo+0.02,top:DH}],mWallOut);
{
  const b=TBatch();
  b.add(CONE(20),'#4b3f7c',TX,L(3)+3.3,0,0,0,0,TRo+0.5,4.6,TRo+0.5);b.add(CONE(10),'#4b3f7c',TX+0.5,L(3)+7.2,0,0,0,-0.5,0.8,2,0.8);
  b.cyl('#5a4d8e',TX,L(3)+3.3,0,TRo+0.45,0.16);
  b.mesh(turretTop);
  const e=TBatch();
  for(let i=0;i<3;i++)e.cyl('#8a7d9c',0,L(i+1)-0.4,0,RM+WT+0.08,0.22);
  e.cyl('#8a7d9c',TX,L(3)-0.4,0,TRo+0.08,0.22);
  e.mesh(EXT);
}
// peldaños de la escalera de caracol
const steps=[],NS=22,DPH=(320/NS)*PI/180,PH0=20*PI/180,PHD=PI/2;
{
  const mStep=TOON('#7a5536'),mStep2=TOON('#6b4a30'),mLand=TOON('#8a6540');
  const sg=new THREE.CylinderGeometry(TR-0.04,TR-0.04,0.16,3,1,false,0,DPH+0.012),lg=new THREE.CylinderGeometry(TR-0.03,TR-0.03,0.26,6,1,false,-PH0,2*PH0);
  for(let n=0;n<3;n++)for(let i=0;i<NS;i++){const m=new THREE.Mesh(sg,i%2?mStep:mStep2),y=L(n)+(i+0.5)/NS*H;m.position.set(TX,y-0.02,0);m.rotation.y=PHD+PH0+i*DPH;TW.add(m);steps.push({m,y});}
  for(let n=1;n<=3;n++){const m=new THREE.Mesh(lg,mLand);m.position.set(TX,L(n)-0.125,0);m.rotation.y=PHD;TW.add(m);steps.push({m,y:L(n)-0.3});}
  const post=new THREE.Mesh(new THREE.CylinderGeometry(0.42,0.5,L(3)+3.2,10),TOON('#5b3f2a'));post.position.set(TX,(L(3)+3.2)/2,0);TW.add(post);steps.push({m:post,y:-9});
}

/* ---------- puertas ---------- */
const doors=[];
function mkDoor(key,lvl,x,z,ry,name){
  const g=new THREE.Group();g.position.set(x,L(lvl),z);g.rotation.y=ry;G[lvl].add(g);
  const hinge=new THREE.Group();hinge.position.set(-DW/2+0.04,0,0);g.add(hinge);
  const b=TBatch(),w=DW-0.08;
  b.box('#7a5435',w/2,DH/2-0.02,0,w,DH-0.06,0.1);
  [-0.42,0,0.42].forEach(o=>b.box('#5a3c26',w/2+o,DH/2,0,0.018,DH-0.08,0.11));
  [0.5,DH-0.55].forEach(y=>b.box('#4a4548',w/2,y,0,w+0.01,0.1,0.13));
  [1,-1].forEach(s=>b.add(new THREE.TorusGeometry(0.085,0.02,6,12),'#3f3a44',w-0.25,1.25,s*0.085,0,0,0));
  b.mesh(hinge);
  const f=TBatch(),ST=['#a39582','#948673','#ab9c87'];
  [-1,1].forEach(s=>{for(let i=0;i<4;i++)f.box(ST[(i+(s>0?1:0))%3],s*(DW/2+0.17),0.34+i*0.68,0,0.34,0.66,0.78);});
  for(let i=0;i<5;i++)f.box(ST[i%3],-DW/2+0.17+i*(DW/4),DH+0.17,0,DW/4+0.1,0.34,0.8);
  f.mesh(g);
  const d={key,lvl,x,z,ry,name,hinge,open:0,tgt:0};doors.push(d);return d;
}
const DE=mkDoor('E',0,0,RM+WT/2,0,'Porta del torreó');
const DT=[0,1,2,3].map(n=>mkDoor('T'+n,n,-7.78,0,PI/2,['Porta de l\'escala','Porta de l\'habitació de la Bruna','Porta de la cuina','Porta de la terrassa'][n]));
const inDoorRect=(d,x,z,m)=>d.key==='E'?(Math.abs(x)<DW/2-m&&z>6.9&&z<8.75):(x>-8.6&&x<-6.5&&Math.abs(z)<DW/2-m);

/* ---------- ascensor: la tarima del trono ---------- */
const lift={y:0,tgt:0,riding:false,g:new THREE.Group(),door:0};
lift.g.position.set(LX,0,LZ);TW.add(lift.g);
const tubeDoor=new THREE.Group();
{
  const b=TBatch();
  b.cyl('#6a5878',0,-0.14,0,LR-0.02,0.28);b.cyl('#75658c',0,0.004,0,LR-0.25,0.01);b.cyl('#4a4050',0,0.003,0,LR-0.02,0.008);
  for(let i=0;i<12;i++){const a=i/12*TAU;b.box('#3f3644',Math.sin(a)*(LR-0.13),0.012,Math.cos(a)*(LR-0.13),0.12,0.02,0.12,a);}
  // trono
  const P='#7a55a8',PD='#55397f',WD='#4a3340',WD2='#5c4250';
  b.box(WD,0,0.28,-0.95,1.5,0.56,1.15);b.box(P,0,0.6,-0.9,1.2,0.14,0.95);
  b.box(WD2,0,1.9,-1.42,1.5,3.2,0.22);b.box(P,0,1.85,-1.3,1.12,2.5,0.08);
  b.add(CONE4,WD2,0,3.5,-1.42,0,PI/4,0,0.62,0.9,0.16);
  [-1,1].forEach(s=>{b.box(WD,s*0.72,0.75,-0.92,0.2,0.5,1.05);b.box(PD,s*0.72,1.03,-0.92,0.26,0.1,1.1);
    b.add(CONE4,WD2,s*0.72,3.5,-1.42,0,0,-s*0.12,0.1,0.75,0.1);b.add(CONE4,WD2,s*0.5,3.5,-1.42,0,0,s*0.3,0.05,0.6,0.05);b.add(CONE4,WD2,s*0.95,3.3,-1.42,0,0,-s*0.6,0.045,0.6,0.045);});
  for(let i=0;i<3;i++)for(let j=0;j<2;j++)b.sph(PD,-0.3+j*0.6,1.2+i*0.65,-1.255,0.05,0.05,0.03);
  b.box(P,0,0.38,-0.36,1.0,0.1,0.1);
  b.mesh(lift.g);
  // tubo de cristal en el sótano, con puerta
  const mGl=new THREE.MeshBasicMaterial({color:'#bfe3e6',transparent:true,opacity:0.2,side:THREE.DoubleSide,depthWrite:false});
  const ga=0.5,tube=new THREE.Mesh(new THREE.CylinderGeometry(LR+0.12,LR+0.12,-0.5-BY,36,1,true,ga,TAU-2*ga),mGl);tube.position.set(LX,(BY-0.5)/2,LZ);G[-1].add(tube);
  const t=TBatch();
  [BY+0.06,-0.55].forEach(y=>t.cyl('#55505c',LX,y,LZ,LR+0.2,0.14));t.cyl('#3f3944',LX,BY+0.02,LZ,LR+0.45,0.05);
  [-ga,ga].forEach(a=>t.box('#55505c',LX+Math.sin(a)*(LR+0.12),(BY-0.5)/2,LZ+Math.cos(a)*(LR+0.12),0.1,-0.5-BY,0.1,a));
  for(let i=0;i<6;i++){const a=ga+0.4+i*0.95;t.box('#55505c',LX+Math.sin(a)*(LR+0.13),(BY-0.5)/2,LZ+Math.cos(a)*(LR+0.13),0.05,-0.5-BY,0.05,a);}
  t.mesh(G[-1]);
  tubeDoor.position.set(LX+Math.sin(-ga)*(LR+0.12),BY,LZ+Math.cos(-ga)*(LR+0.12));G[-1].add(tubeDoor);
  const dw=2*Math.sin(ga)*(LR+0.12),gd=new THREE.Mesh(new THREE.PlaneGeometry(dw,2.6),mGl.clone());gd.material.opacity=0.32;gd.position.set(dw/2,1.3,0);tubeDoor.add(gd);
  const fr=TBatch();fr.box('#55505c',dw/2,2.62,0,dw,0.07,0.06);fr.box('#55505c',dw/2,0.04,0,dw,0.07,0.06);fr.box('#55505c',dw,1.3,0,0.06,2.6,0.06);fr.box('#55505c',0.02,1.3,0,0.06,2.6,0.06);fr.mesh(tubeDoor);
}
const COLS={out:[],'-1':[],0:[],1:[],2:[],3:[]};
const col=(k,x,z,r)=>COLS[k].push({x,z,r});
const flames=[],anims=[];
