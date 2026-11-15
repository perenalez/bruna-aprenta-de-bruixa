/* ---------- utilidades ---------- */
const mk=(geo,mat,x,y,z,parent)=>{const m=new THREE.Mesh(geo,mat);m.position.set(x,y,z);m.castShadow=true;if(parent)parent.add(m);return m;};
function canvasTex(w,h,draw,rx,ry){const c=document.createElement('canvas');c.width=w;c.height=h;draw(c.getContext('2d'),w,h);const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(rx,ry);t.anisotropy=4;return t;}
const dotsTex=canvasTex(128,128,(g,w,h)=>{g.fillStyle='#e8506a';g.fillRect(0,0,w,h);g.fillStyle='#3a2a3f';[[0,96],[128,96],[64,96],[32,32],[96,32]].forEach(([x,y])=>{g.beginPath();g.arc(x,y,11,0,7);g.fill();});},6,2.5);
const stripe=(ry)=>canvasTex(8,64,(g,w,h)=>{g.fillStyle='#f3efe6';g.fillRect(0,0,w,h/2);g.fillStyle='#464a78';g.fillRect(0,h/2,w,h/2);},1,ry);
const SPH=(r,w,h)=>new THREE.SphereGeometry(r,w||20,h||14);
const prismG=(a,b,l)=>new THREE.CylinderGeometry(a,b,l,6,1);
const ico=(r,d)=>new THREE.IcosahedronGeometry(r,d||0);
function RBox(w,h,d,r,seg){
  seg=seg||5;const g=new THREE.BoxGeometry(w,h,d,seg,seg,seg),p=g.attributes.position,n=g.attributes.normal;
  const hx=w/2-r,hy=h/2-r,hz=d/2-r,v=new THREE.Vector3(),c=new THREE.Vector3();
  for(let i=0;i<p.count;i++){v.fromBufferAttribute(p,i);c.set(clamp(v.x,-hx,hx),clamp(v.y,-hy,hy),clamp(v.z,-hz,hz));v.sub(c).normalize();
    p.setXYZ(i,c.x+v.x*r,c.y+v.y*r,c.z+v.z*r);n.setXYZ(i,v.x,v.y,v.z);}
  return g;
}
// cabeza con mandíbula: esfera deformada, mentón marcado
function jawGeo(rx,ry,rz,jawK,chinK){
  const g=new THREE.SphereGeometry(1,40,30),p=g.attributes.position;
  for(let i=0;i<p.count;i++){
    let x=p.getX(i),y=p.getY(i),z=p.getZ(i);
    const t=Math.max(0,-y),jaw=Math.pow(t,1.25);
    x*=1-jawK*jaw;z*=1-jawK*0.5*jaw;
    if(y<0)y*=1+chinK*Math.pow(t,1.4);
    if(z>0)z*=1+chinK*0.6*smooth(0.45,0.95,t);
    x*=1+0.07*Math.exp(-Math.pow((y+0.15)/0.28,2));
    p.setXYZ(i,x*rx,y*ry,z*rz);
  }
  g.computeVertexNormals();return g;
}
function surfFn(geo){const sk=new THREE.Mesh(geo);sk.updateMatrixWorld(true);const rc=new THREE.Raycaster();
  return(x,y)=>{rc.set(new THREE.Vector3(x,y,2),new THREE.Vector3(0,0,-1));const h=rc.intersectObject(sk)[0];return h?h.point.z:0.2;};}

const mRab=TOON('#c68a46'),mRabD=TOON('#b17335'),mRabL=TOON('#e8c799'),mRabIn=TOON('#ee9d8f'),mNoseP=TOON('#d98a86');
