/* =====================================================================
   EL BOSQUE DEL LAGO — entorno
   ===================================================================== */
const world=new THREE.Group();scene.add(world);
camera.far=500;
scene.background=new THREE.Color('#40398f');
const FOGC=new THREE.Color('#7667c2');
scene.fog=new THREE.Fog(FOGC,30,150);
const HEMI_OUT=['#c4b6ff','#8a9a66',1.0];hemi.color.set(HEMI_OUT[0]);hemi.groundColor.set(HEMI_OUT[1]);hemi.intensity=HEMI_OUT[2];
sun.color.set('#ffe2f2');sun.intensity=0.5;
Object.assign(sun.shadow.camera,{left:-11,right:11,top:11,bottom:-11,near:1,far:60});sun.shadow.camera.updateProjectionMatrix();

function TRS(x,y,z,rx,ry,rz,sx,sy,sz){
  if(sx===undefined)sx=1;if(sy===undefined)sy=sx;if(sz===undefined)sz=sx;
  return new THREE.Matrix4().compose(new THREE.Vector3(x,y,z),new THREE.Quaternion().setFromEuler(new THREE.Euler(rx||0,ry||0,rz||0)),new THREE.Vector3(sx,sy,sz));
}
const uTime={value:0};
function swayify(m){
  m.onBeforeCompile=sh=>{sh.uniforms.uTime=uTime;
    sh.vertexShader='attribute float sway;\nuniform float uTime;\n'+sh.vertexShader.replace('#include <begin_vertex>',
      '#include <begin_vertex>\n float sw=sin(uTime*1.7+position.x*0.9+position.z*1.3)+0.5*sin(uTime*2.9+position.x*2.1);\n transformed.x+=sw*sway*0.07;transformed.z+=cos(uTime*1.3+position.z*0.8+position.x*0.4)*sway*0.05;');};
  return m;
}
const mLit=swayify(TOON('#ffffff',{vertexColors:true}));
function nearFade(m,d0,d1){const ob=m.onBeforeCompile;m.onBeforeCompile=sh=>{ob(sh);
  sh.fragmentShader=sh.fragmentShader.replace('void main() {','void main() {\n if((1.0/gl_FragCoord.w)<'+d0.toFixed(2)+'+'+d1.toFixed(2)+'*fract(sin(dot(gl_FragCoord.xy,vec2(12.9898,78.233)))*43758.5453))discard;');};return m;}
const mLeaf=nearFade(swayify(TOON('#ffffff',{vertexColors:true})),4.2,1.6);
const mTrunk=nearFade(swayify(TOON('#ffffff',{vertexColors:true})),1.2,0.6);
const mFol=swayify(TOON('#ffffff',{vertexColors:true,side:THREE.DoubleSide}));
const mFlat=swayify(TOON('#ffffff',{vertexColors:true},true));
const mGlow=swayify(new THREE.MeshBasicMaterial({vertexColors:true}));
const mFar=swayify(new THREE.MeshBasicMaterial({vertexColors:true}));
function Batch(){
  const pos=[],nor=[],col=[],sw=[],v=new THREE.Vector3(),c=new THREE.Color(),n3=new THREE.Matrix3();
  const B={base:null,sw:null,
    add(geo,color,x,y,z,rx,ry,rz,sx,sy,sz){
      const g=geo.index?geo.toNonIndexed():geo,m=TRS(x,y,z,rx,ry,rz,sx,sy,sz);
      if(B.base)m.premultiply(B.base);
      n3.getNormalMatrix(m);c.set(color);
      const p=g.attributes.position,n=g.attributes.normal;
      for(let i=0;i<p.count;i++){
        v.fromBufferAttribute(p,i).applyMatrix4(m);pos.push(v.x,v.y,v.z);
        sw.push(B.sw?Math.max(0,v.y-B.sw[0])*B.sw[1]:0);
        v.fromBufferAttribute(n,i).applyMatrix3(n3).normalize();nor.push(v.x,v.y,v.z);
        col.push(c.r,c.g,c.b);
      }
      return B;
    },
    mesh(mat,shadow,parent){
      const g=new THREE.BufferGeometry();
      g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));
      g.setAttribute('normal',new THREE.Float32BufferAttribute(nor,3));
      g.setAttribute('color',new THREE.Float32BufferAttribute(col,3));
      g.setAttribute('sway',new THREE.Float32BufferAttribute(sw,1));
      const me=new THREE.Mesh(g,mat||mLit);me.castShadow=shadow!==false;(parent||world).add(me);return me;
    }};
  return B;
}
const BOX=new THREE.BoxGeometry(1,1,1);
const CYL=n=>new THREE.CylinderGeometry(1,1,1,n||12);
const C5=CYL(5),C6=CYL(6),C10=CYL(10);
const COL=[];
const lerp=(a,b,t)=>a+(b-a)*t;

/* ---------- forma del terreno ---------- */
const POND={x:7.5,z:5.5},WY=-0.2;
const pondR=a=>5.3+0.9*Math.sin(2*a+1)+0.5*Math.sin(3*a+0.5);
function pondD(x,z){const dx=x-POND.x,dz=z-POND.z;return Math.hypot(dx,dz)/pondR(Math.atan2(dx,dz));}
const pathX=z=>{const k=smooth(-34,-10,z);return (-1+1.9*Math.sin(z*0.11+0.3))*k+0.9*Math.sin(z*0.2)*(1-k);};
const OZ=-56,OX=pathX(-47),OY=3.8;const TOWER={x:OX,z:OZ};
