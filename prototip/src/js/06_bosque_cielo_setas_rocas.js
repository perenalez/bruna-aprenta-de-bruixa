trunkB.base=null;leafB.base=null;trunkB.mesh(mTrunk);leafB.mesh(mLeaf,false);
// siluetas lejanas (sin iluminación, se funden con la niebla)
{
  const b=Batch(),FC=['#3c3f7c','#474c92','#353a70','#4b4590'];
  for(let i=0;i<110;i++){const a=rr(0,6.2832),r=rr(27,58),x=Math.sin(a)*r,z=Math.cos(a)*r-6;
    if(z<-10&&Math.abs(x-pathX(Math.max(z,-45)))<9)continue;if(Math.hypot(x-TOWER.x,z-TOWER.z)<24||valE(x,z)<1.2)continue;
    const y=landH(x,z),s=rr(1.1,1.9),c=pick(FC);
    b.add(C5,c,x,y+3*s,z,0,0,0,0.3*s,6*s,0.3*s);b.add(blobs[i%3],c,x,y+6.4*s,z,0,rr(0,6),0,rr(2.6,3.6)*s,1.5*s,rr(2.4,3.2)*s);
    if(R()<0.6)b.add(blobs[(i+1)%3],pick(FC),x+rr(-2,2)*s,y+5*s,z+rr(-1,1),0,rr(0,6),0,2.2*s,1.0*s,2*s);}
  b.mesh(mFar,false);
}

/* ---------- cielo, estrellas, luna ---------- */
const sky=new THREE.Group();scene.add(sky);
const glowTex=canvasTex(64,64,(g,w,h)=>{const gr=g.createRadialGradient(32,32,0,32,32,32);gr.addColorStop(0,'rgba(255,255,255,1)');gr.addColorStop(0.25,'rgba(255,255,255,.55)');gr.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=gr;g.fillRect(0,0,w,h);},1,1);
function halo(parent,x,y,z,size,color,op){const s=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTex,color,blending:THREE.AdditiveBlending,depthWrite:false,transparent:true,opacity:op===undefined?0.6:op}));s.position.set(x,y,z);s.scale.setScalar(size);(parent||world).add(s);return s;}
{
  const g=new THREE.SphereGeometry(190,24,14),p=g.attributes.position,cols=new Float32Array(p.count*3),c=new THREE.Color();
  const c1=new THREE.Color('#d6b0f6'),c2=new THREE.Color('#8f80e2'),c3=new THREE.Color('#3d368c');
  for(let i=0;i<p.count;i++){const t=clamp(p.getY(i)/190,-0.2,1);
    if(t<0.22)c.copy(c1).lerp(c2,smooth(0,0.22,t));else c.copy(c2).lerp(c3,smooth(0.22,0.8,t));
    cols[i*3]=c.r;cols[i*3+1]=c.g;cols[i*3+2]=c.b;}
  g.setAttribute('color',new THREE.BufferAttribute(cols,3));
  sky.add(new THREE.Mesh(g,new THREE.MeshBasicMaterial({vertexColors:true,side:THREE.BackSide,fog:false,depthWrite:false})));
  const sp=[];for(let i=0;i<170;i++){const a=rr(0,6.2832),e=rr(0.12,1.4);sp.push(Math.sin(a)*Math.cos(e)*180,Math.sin(e)*180,Math.cos(a)*Math.cos(e)*180);}
  const sg=new THREE.BufferGeometry();sg.setAttribute('position',new THREE.Float32BufferAttribute(sp,3));
  sky.add(new THREE.Points(sg,new THREE.PointsMaterial({color:'#fff6e0',size:2.2,sizeAttenuation:false,fog:false,transparent:true,opacity:0.85,depthWrite:false})));
  const moon=new THREE.Mesh(new THREE.CircleGeometry(11,32),new THREE.MeshBasicMaterial({color:'#fbf2ff',fog:false,depthWrite:false}));
  moon.position.set(22,52,-170);moon.lookAt(0,0,0);sky.add(moon);
  const mh=halo(sky,22,52,-169,80,'#e9c8ff',0.5);mh.material.fog=false;
  sky.children.forEach((o,i)=>o.renderOrder=-10+i);
}

const smoke=[];const winL=new THREE.PointLight('#ffb050',0.5,12,1.6);winL.position.set(OX,OY+2.8,OZ+10.5);scene.add(winL);
/* ---------- setas ---------- */
const litB=Batch(),glowB=Batch(),folB=Batch(),flatB=Batch();
const stemG=new THREE.LatheGeometry([[0.001,0],[0.34,0],[0.26,0.3],[0.2,0.7],[0.24,1],[0.001,1]].map(p=>new THREE.Vector2(p[0],p[1])),10);
const capG=new THREE.LatheGeometry([[0.001,0.52],[0.35,0.47],[0.68,0.32],[0.93,0.1],[1,0],[0.8,-0.05],[0.001,-0.02]].map(p=>new THREE.Vector2(p[0],p[1])),16);
const capH=r=>0.5*Math.pow(Math.max(0,1-r*r),0.62);
const spiralTex=canvasTex(256,256,(g,w,h)=>{g.fillStyle='#e23f9c';g.fillRect(0,0,w,h);g.strokeStyle='#ff9fd4';g.lineWidth=17;g.lineCap='round';g.beginPath();
  for(let i=0;i<=260;i++){const a=i/260*6.2832*3.1,r=4+i/260*118;const x=128+Math.cos(a)*r,y=128+Math.sin(a)*r;i?g.lineTo(x,y):g.moveTo(x,y);}g.stroke();},1,1);
const mSpiral=new THREE.MeshBasicMaterial({map:spiralTex});
const spiralCap=(()=>{const g=capG.clone(),p=g.attributes.position,uv=g.attributes.uv;for(let i=0;i<p.count;i++)uv.setXY(i,p.getX(i)*0.5+0.5,p.getZ(i)*0.5+0.5);return g;})();
function shroom(x,z,h,w,type,tilt,ty){
  const y=landH(x,z)-0.03,M=TRS(x,y,z,tilt||0,ty||0,0);
  litB.base=M;litB.sw=null;litB.add(stemG,'#e9d9c4',0,0,0,0,0,0,w*0.34,type==='spiral'?h*0.78:h,w*0.34);
  const capM=M.clone().multiply(TRS(0,h*0.97,0,0,0,0,w,w*0.95,w));
  glowB.base=capM;glowB.sw=null;
  if(type==='spiral'){const m=new THREE.Mesh(spiralCap,mSpiral);m.applyMatrix4(M.clone().multiply(TRS(0,h*0.97,0,0.5,0,0,w,w*0.55,w)));m.castShadow=true;world.add(m);
    litB.add(CYL(14),'#b5307c',0,h*0.95,0,0.5,0,0,w*0.8,0.03,w*0.8);return;}
  const C={blue:['#2b47e6','#f5e14a','#1c2fa6'],cyan:['#62dcf4',null,'#3aa6cc'],teal:['#3aa3a0','#f06ab2','#2a7f85'],pink:['#ef5fb6',null,'#c2408f'],lila:['#b98cf0','#f2e06a','#8a62c8']}[type];
  glowB.add(capG,C[0],0,0,0);
  glowB.add(CYL(14),C[2],0,-0.045,0,0,0,0,0.8,0.03,0.8);
  if(C[1])for(let i=0;i<9;i++){const a=i*2.4+rr(-.2,.2),r=0.2+0.66*((i*0.37)%1),s=rr(0.09,0.15);glowB.add(SPH(1,8,6),C[1],Math.sin(a)*r,capH(r)*1.02+0.01,Math.cos(a)*r,0,0,0,s,s*0.3,s);}
  COL.push({x,z,r:Math.max(0.16,w*0.22)});
}
// grupo delantero izquierdo (como en la lámina)
shroom(-6.2,10.2,1.5,1.05,'blue');shroom(-7.9,11.0,0.75,0.6,'blue',0.1,1);shroom(-4.9,11.0,0.75,0.82,'spiral',0,0.3);shroom(-5.7,11.7,0.4,0.45,'spiral',0,-0.4);
shroom(-8.3,8.1,1.0,0.5,'cyan');shroom(-7.7,8.4,0.55,0.32,'cyan');shroom(-5.6,7.2,0.3,0.22,'lila');
shroom(-5.4,3.0,0.85,0.5,'teal');shroom(-4.5,2.6,0.8,0.48,'spiral',0,0.5);
// al pie del árbol lila
shroom(2.3,-6.3,0.9,0.5,'blue',0.15);shroom(2.9,-5.6,0.5,0.42,'blue',-0.1,1);shroom(4.0,-6.0,0.45,0.42,'pink');shroom(4.6,-6.6,0.55,0.3,'pink');shroom(4.9,-7.6,1.1,0.42,'lila',0.1,2);shroom(3.5,-5.4,0.3,0.3,'spiral',0,0);shroom(5.3,-6.3,0.4,0.26,'cyan');
// más, repartidas
[[-11,-3,'cyan'],[-10.5,-4,'lila'],[11.5,-8,'blue'],[-2,14,'pink'],[13.5,-0.5,'teal'],[-13,2,'blue'],[0.5,-12.5,'cyan'],[-6,-9.5,'pink'],[2.8,-21,'blue'],[-3.2,-28,'cyan'],[3.4,-35,'lila']].forEach(([x,z,t])=>{shroom(x,z,rr(0.5,0.9),rr(0.3,0.5),t,rr(-.1,.1),rr(0,6));shroom(x+rr(.5,.8),z+rr(-.5,.5),rr(0.25,0.45),rr(0.2,0.3),t);});
const glows=[];
[[-6.2,10.2,1.9,4.2,'#4f6aff'],[-8.2,8.2,1.1,3.2,'#62dcf4'],[-5.0,11.2,0.9,2.6,'#ff5fc0'],[2.6,-6,1.0,3.0,'#4f6aff'],[4.3,-6.2,0.6,2.2,'#ff6fc8'],[-5,2.9,1.0,2.4,'#58d0c8'],[-11,-3.4,0.8,2.4,'#62dcf4'],[0.6,-12.4,0.8,2.2,'#62dcf4']].forEach(([x,z,y,s,c])=>glows.push({s:halo(world,x,landH(x,z)+y,z,s,c,0.5),o:0.5,ph:rr(0,6)}));
const shL1=new THREE.PointLight('#5f78ff',0.9,6.5,1.8);shL1.position.set(-6.4,1.9,10.6);scene.add(shL1);
const shL2=new THREE.PointLight('#ff6fc8',0.6,5,1.8);shL2.position.set(3.6,1.0,-5.6);scene.add(shL2);

/* ---------- flores luminosas, hierba, juncos, nenúfares ---------- */
const bladeG=(()=>{const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute([-0.5,0,0,0.5,0,0,0.15,1,0],3));g.setAttribute('normal',new THREE.Float32BufferAttribute([0,1,0.3,0,1,0.3,0,1,0.3],3));return g;})();
const petalG=(()=>{const g=new THREE.ConeGeometry(0.5,1,4);g.translate(0,0.5,0);return g;})();
function glowFlower(x,z,h,col,star){
  const y=landH(x,z);folB.sw=[y,1.1/h*0.9];folB.base=null;
  folB.add(C5,'#3f6f5a',x,y+h/2,z,0,0,0.05,0.022,h,0.022);
  folB.add(bladeG,'#356a58',x,y,z,0.5,rr(0,6),0,0.2,h*0.75,1);folB.add(bladeG,'#2f5d55',x,y,z,-0.5,rr(0,6),0,0.2,h*0.6,1);
  glowB.base=null;glowB.sw=[y,1.1/h*0.9];
  if(star){for(let i=0;i<5;i++){const a=i*1.2566;glowB.add(petalG,col,x,y+h,z,1.2*Math.cos(a),0,-1.2*Math.sin(a),0.1,0.2,0.05);}glowB.add(SPH(1,8,6),'#ffe36a',x,y+h+0.02,z,0,0,0,0.05);}
  else{glowB.add(SPH(1,10,8),col,x,y+h+0.06,z,0,0,0,0.085,0.15,0.085);glowB.add(SPH(1,8,6),'#ffe9ff',x,y+h+0.15,z,0,0,0,0.045,0.07,0.045);}
  glows.push({s:halo(world,x,y+h+0.1,z,1.5,col,0.55),o:0.55,ph:rr(0,6)});
}
[[-7.2,3.6,1.5],[-6.4,4.3,1.0],[-5.9,2.0,0.85],[-11.2,4.4,1.2],[-3.6,7.6,0.7],[1.5,-10.5,1.0],[-9.5,-6.5,1.1]].forEach(([x,z,h])=>glowFlower(x,z,h,'#f0a0ff'));
[[13.3,-0.9,1.3],[14.0,6.2,1.0],[-1.8,-22,1.0],[2.4,-30,1.1],[-3.0,-37,1.0]].forEach(([x,z,h])=>glowFlower(x,z,h,'#ff8fd8',true));
{
  const GC=['#5c7a4a','#6f8f4e','#4a6a58','#b5b85a','#8fa04e'];
  let n=0;
  for(let i=0;i<2600&&n<520;i++){
    const x=rr(-19,19),z=rr(-44,19);const[bx,bz]=bound(x,z);if(Math.hypot(bx-x,bz-z)>2.5)continue;
    if(Math.abs(x-pathX(z))<1.6||pondD(x,z)<1.08)continue;if(Math.hypot(x-OX,z-OZ)<9||Math.hypot(x-OX+10.6,z-OZ)<4.3)continue;
    const y=landH(x,z),h=rr(0.22,0.5),c=pick(GC);folB.sw=[y,1.6];folB.base=null;
    for(let k=0;k<3;k++)folB.add(bladeG,c,x+rr(-.08,.08),y-0.02,z+rr(-.08,.08),rr(-.35,.35),rr(0,6.28),rr(-.3,.3),rr(0.07,0.11),h*rr(0.7,1.1),1);
    n++;
  }
  // juncos y espadañas en la orilla
  function reeds(x,z,n,tall){
    for(let i=0;i<n;i++){const px=x+rr(-.6,.6),pz=z+rr(-.6,.6),y=Math.max(landH(px,pz),WY-0.05),h=tall*rr(0.75,1.15);
      folB.sw=[y,1.5/h];folB.base=null;
      folB.add(bladeG,pick(['#35645a','#2f5a58','#3f7460']),px,y,pz,rr(-.25,.25),rr(0,6.28),rr(-.2,.2),0.13,h,1);
      if(i%3===0){litB.sw=[y,1.5/h];litB.base=null;const hh=h*1.15;
        litB.add(C5,'#4a6a50',px+0.1,y+hh/2,pz,0,0,0,0.016,hh,0.016);litB.add(C6,'#7c4636',px+0.1,y+hh,pz,0,0,0,0.05,0.32,0.05);litB.add(C5,'#4a6a50',px+0.1,y+hh+0.24,pz,0,0,0,0.008,0.18,0.008);}
    }
  }
  reeds(12.9,7.2,14,2.3);reeds(11.6,10.3,12,2.6);reeds(10.6,0.4,10,1.9);reeds(2.7,3.0,8,1.5);reeds(13.2,3.4,8,2.0);reeds(6.5,11.2,7,1.4);reeds(4.4,0.9,6,1.3);
  // nenúfares y lotos
  const padG=new THREE.CircleGeometry(1,14,0.25,5.8);padG.rotateX(-Math.PI/2);
  const pad=(x,z,s)=>{litB.sw=null;litB.base=null;litB.add(padG,pick(['#7fae5a','#6f9f58','#8ab860']),x,WY+0.02,z,0,rr(0,6),0,s,1,s);ripple(x,z,s*1.5,true);};
  const lotus=(x,z,s,c1,c2)=>{glowB.sw=null;glowB.base=TRS(x,WY+0.03,z,0,rr(0,6),0,s);
    for(let i=0;i<8;i++){const a=i/8*6.2832;glowB.add(petalG,c1,Math.sin(a)*0.1,0,Math.cos(a)*0.1,1.05*Math.cos(a),0,-1.05*Math.sin(a),0.22,0.5,0.1);}
    for(let i=0;i<6;i++){const a=i/6*6.2832+0.4;glowB.add(petalG,c2,Math.sin(a)*0.05,0.03,Math.cos(a)*0.05,0.5*Math.cos(a),0,-0.5*Math.sin(a),0.18,0.42,0.1);}
    glowB.add(SPH(1,8,6),'#ffd95a',0,0.12,0,0,0,0,0.09);glowB.base=null;pad(x+0.1,z-0.1,s*0.75);};
  pad(6.0,6.6,0.75);pad(9.6,3.4,0.8);pad(8.2,4.9,0.45);pad(7.0,3.0,0.5);pad(10.6,5.6,0.4);
  lotus(8.3,7.2,1.0,'#ff7fc4','#ffb3dc');lotus(8.9,2.6,0.75,'#c9a0f5','#e6ccff');lotus(10.4,4.3,0.55,'#ff7fc4','#ffb3dc');
  glows.push({s:halo(world,8.3,WY+0.3,7.2,1.6,'#ff7fc4',0.35),o:0.35,ph:1});
}

/* ---------- rocas y arbustos ---------- */
function rock(x,z,sx,sy,sz,moss,yOff){
  const y=Math.max(landH(x,z),WY-0.25)+(yOff||0),k=Math.floor(R()*3),ry=rr(0,6);
  flatB.base=null;flatB.sw=null;flatB.add(rockG[k],pick(['#7b7496','#8a84a6','#6e6789']),x,y+sy*0.25,z,0,ry,0,sx,sy,sz);
  if(moss){litB.base=null;litB.sw=null;litB.add(blobs[k],pick(['#8a9a3c','#7d8f3f','#9aa646']),x,y+sy*0.86,z,0,ry,0,sx*0.72,sy*0.16,sz*0.72);}
  COL.push({x,z,r:Math.min(sx,sz)*0.85});return y+sy*1.02;
}
rock(9.6,-0.5,1.3,0.9,1.0,true);rock(12.9,1.4,1.7,1.25,1.3,true);rock(4.0,1.5,0.6,0.4,0.5,true);rock(2.7,7.6,0.55,0.35,0.6,true);rock(3.4,8.3,0.35,0.22,0.3);
rock(1.0,2.6,0.75,0.5,0.6,true);rock(13.6,8.8,1.0,0.7,0.9,true);rock(-10,10,0.7,0.5,0.6,true);rock(-13.2,-3,0.9,0.6,0.8,true);rock(6.5,-11,0.8,0.5,0.7,true);
rock(-3.5,-19,0.7,0.5,0.6,true);rock(3.6,-25.5,0.9,0.6,0.7,true);rock(-3.6,-33,0.7,0.5,0.7,true);
const ROCK_F=rock(4.9,10.9,1.0,0.6,0.9,true);
const ROCK_W=(()=>{const x=10.3,z=8.2;flatB.add(rockG[1],'#7b7496',x,WY-0.1,z,0,1,0,1.25,0.42,1.05);return WY+0.2;})();
function bush(x,z,s){const y=landH(x,z);litB.base=null;litB.sw=[y,0.12];
  for(let i=0;i<5;i++){const a=i*1.3,r=i?0.7*s:0;litB.add(blobs[i%3],pick(['#2f5d5a','#3a6f62','#2a5258','#44786a']),x+Math.sin(a)*r,y+0.45*s+rr(0,.3)*s,z+Math.cos(a)*r,0,rr(0,6),0,rr(.8,1.1)*s,rr(.6,.8)*s,rr(.8,1.0)*s);}
  COL.push({x,z,r:1.0*s});}
const BUSH={x:9.2,z:-3.6};
bush(BUSH.x,BUSH.z,1.25);bush(11.3,-1.6,0.9);bush(-11.5,9.8,1.1);bush(-14,-5,1.2);bush(-13.2,11.5,1.0);bush(7.5,-15,1.1);bush(14.6,7.5,0.9);bush(-6.5,-15.5,1.1);bush(15.5,-6,1.2);
