/* =====================================================================
   HERBA ESTIL ALBA (fase B del paquet proves/alba, a petició d'en Pere)
   Substitueix les mates d'herba del bosc i de la vall (06, 07: HERBA_ALBA) per herba instanciada:
     · moltes més mates en una sola crida de dibuix (InstancedMesh);
     · es mou amb el vent i s'aparta i s'aixafa quan la Bruna hi passa (VENT.uPlayer);
     · respecta camins, estany, riu, torreó, arbre gegant i cases (mateixes zones que l'herba d'abans).
   Adaptat de proves/alba/js/30_herba.js (three r128). Menys mates al mòbil.
   ===================================================================== */
const VENT={uTime:{value:0},uPlayer:{value:new THREE.Vector3(0,-99,0)}};
// generador aleatori propi: així l'herba no canvia la posició de res més del món (que fa servir R())
const HR=(()=>{let sd=917;return ()=>{sd|=0;sd=sd+0x6D2B79F5|0;let t=Math.imul(sd^sd>>>15,1|sd);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};})();
const hrr=(a,b)=>a+(b-a)*HR();
function materialVent(){
  const m=new THREE.MeshLambertMaterial({vertexColors:true,side:THREE.DoubleSide});
  m.onBeforeCompile=sh=>{
    sh.uniforms.uTime=VENT.uTime;sh.uniforms.uPlayer=VENT.uPlayer;
    sh.vertexShader=sh.vertexShader
      .replace('#include <common>',`#include <common>
        uniform float uTime; uniform vec3 uPlayer; attribute float aH; attribute vec3 aTint;`)
      .replace('#include <color_vertex>',`#include <color_vertex>
        #ifdef USE_COLOR
          vColor.xyz *= aTint;
        #endif`)
      .replace('#include <begin_vertex>',`#include <begin_vertex>
        {
          vec4 iw = modelMatrix * instanceMatrix * vec4(0., 0., 0., 1.);
          float k = aH * aH;
          float w = sin(uTime * 1.5 + iw.x * .22 + iw.z * .15) * .6 + sin(uTime * 2.9 + iw.x * .7 - iw.z * .4) * .25;
          vec3 off = vec3(w * .14, 0., w * .08) * k;
          vec2 d = iw.xz - uPlayer.xz; float dist = length(d);
          float pu = (1. - smoothstep(.2, 1.0, dist)) * step(abs(iw.y - uPlayer.y), 1.2);
          off.xz += normalize(d + 1e-4) * pu * .45 * k; off.y -= pu * .28 * k;
          mat3 im = mat3(instanceMatrix); float s2 = dot(im[0], im[0]);
          transformed += vec3(dot(im[0], off), dot(im[1], off), dot(im[2], off)) / s2;
        }`);
  };
  m.customProgramCacheKey=()=>'vent-joc';
  return m;
}
// una mata: unes quantes fulles corbes amb degradat de color de la base a la punta
function herbaMata(blades,hgt,wid,cols){
  const pos=[],col=[],ah=[],nor=[],idx=[],base=new THREE.Color(cols[0]),mid=new THREE.Color(cols[1]),tip=new THREE.Color(cols[2]),tmp=new THREE.Color();
  for(let b=0;b<blades;b++){
    const a=HR()*TAU,r0=Math.sqrt(HR())*0.12,ox=Math.cos(a)*r0,oz=Math.sin(a)*r0,lean=0.15+HR()*0.35,la=HR()*TAU,h=hgt*(0.7+HR()*0.5),w=wid*(0.8+HR()*0.4);
    const fx=Math.cos(la+PI/2),fz=Math.sin(la+PI/2),s0=pos.length/3,segs=3;
    for(let s=0;s<=segs;s++){const t=s/segs,ww=w*(1-t*0.85)*(s===segs?0:1),bx=ox+Math.cos(la)*lean*t*t*h,bz=oz+Math.sin(la)*lean*t*t*h,by=t*h;
      pos.push(bx-fx*ww,by,bz-fz*ww,bx+fx*ww,by,bz+fz*ww);tmp.copy(base).lerp(mid,smooth(0,0.5,t)).lerp(tip,smooth(0.5,1,t));
      for(let q=0;q<2;q++){col.push(tmp.r,tmp.g,tmp.b);ah.push(t);nor.push(0,1,0);}}
    for(let s=0;s<segs;s++){const a0=s0+s*2;idx.push(a0,a0+1,a0+3,a0,a0+3,a0+2);}
  }
  const g=new THREE.BufferGeometry();
  g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('color',new THREE.Float32BufferAttribute(col,3));
  g.setAttribute('normal',new THREE.Float32BufferAttribute(nor,3));g.setAttribute('aH',new THREE.Float32BufferAttribute(ah,1));g.setIndex(idx);
  return g;
}
// on hi pot haver herba: les mateixes zones que l'herba d'abans (bosc i vall), sense camins, aigua ni edificis
function herbaOK(x,z){
  if(waterAt(x,z)>landH(x,z)-0.03)return false;
  if(Math.hypot(x-OX,z-OZ)<9.5||Math.hypot(x-OX+10.6,z-OZ)<4.4)return false;
  if(z>-46){const[bx,bz]=bound(x,z);if(Math.hypot(bx-x,bz-z)>2.5)return false;if(Math.abs(x-pathX(z))<1.5||pondD(x,z)<1.1)return false;return true;}
  if(valE(x,z)>0.99)return false;
  if(distPaths(x,z)<1.3||Math.hypot(x-GT.x,z-GT.z)<7.6)return false;
  if(z<-34&&Math.abs(x-RX(z))<RW+0.6)return false;
  for(const H of HOUSES){const l=hL(H,x,z);if(Math.abs(l[0])<H.w/2+0.4&&Math.abs(l[1])<H.d/2+0.4)return false;}
  return true;
}
const HERBA=(()=>{
  if(!HERBA_ALBA)return null;
  const mob=matchMedia('(pointer:coarse)').matches,N=mob?11000:20000;
  const geo=herbaMata(7,0.4,0.018,['#3c5a30','#6f8f4e','#b9c46e']),tint=new Float32Array(N*3);
  geo.setAttribute('aTint',new THREE.InstancedBufferAttribute(tint,3));
  const mesh=new THREE.InstancedMesh(geo,materialVent(),N);mesh.receiveShadow=true;mesh.frustumCulled=false;
  const m4=new THREE.Matrix4(),q=new THREE.Quaternion(),sc=new THREE.Vector3(),ps=new THREE.Vector3(),up=new THREE.Vector3(0,1,0),c=new THREE.Color();
  // zones: el bosc (rectangle) i la vall (el·lipse); es reparteixen segons l'àrea
  const zones=[{w:0.42,p:()=>[hrr(-19,19),hrr(-44,19)]},{w:0.58,p:()=>{const a=hrr(0,TAU),e=Math.sqrt(HR())*0.99;return [VC.x+Math.sin(a)*e*VRX,VC.z+Math.cos(a)*e*VRZ];}}];
  let n=0,tries=0;
  while(n<N&&tries<N*6){tries++;const Z=HR()<zones[0].w?zones[0]:zones[1],[x,z]=Z.p();if(!herbaOK(x,z))continue;
    const tall=Math.max(0,Math.sin(x*0.21+z*0.13)*Math.sin(x*0.07-z*0.19))*1.3,s=(0.55+HR()*0.45)*(1+tall*0.8);
    ps.set(x,landH(x,z)-0.02,z);q.setFromAxisAngle(up,HR()*TAU);sc.set(s,s*(0.85+HR()*0.35),s);m4.compose(ps,q,sc);mesh.setMatrixAt(n,m4);
    c.setHSL(0.24+HR()*0.06,0.38+HR()*0.14,0.5+HR()*0.12);tint[n*3]=c.r*1.35;tint[n*3+1]=c.g*1.35;tint[n*3+2]=c.b*1.35;n++;}
  mesh.count=n;mesh.instanceMatrix.needsUpdate=true;geo.attributes.aTint.needsUpdate=true;world.add(mesh);
  return mesh;
})();
// cada fotograma: vent i on és la Bruna (perquè l'herba s'aparti)
function herbaStep(){if(!HERBA)return;VENT.uTime.value=S.t;VENT.uPlayer.value.set(S.pos.x,S.y,S.pos.z);}
