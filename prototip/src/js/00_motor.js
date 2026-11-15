const $=id=>document.getElementById(id);
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const smooth=(a,b,x)=>{const t=clamp((x-a)/(b-a),0,1);return t*t*(3-2*t);};
const wrapA=a=>{while(a>Math.PI)a-=Math.PI*2;while(a<-Math.PI)a+=Math.PI*2;return a;};
function rng(s){return()=>{s|=0;s=s+0x6D2B79F5|0;let t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
const R=rng(23);
const rr=(a,b)=>a+(b-a)*R();
const pick=a=>a[Math.floor(R()*a.length)%a.length];

/* ---------- renderer / escena ---------- */
const canvas=$('c');
const renderer=new THREE.WebGLRenderer({canvas,antialias:true});
renderer.setPixelRatio(Math.min(devicePixelRatio||1,2));
renderer.shadowMap.enabled=true;
renderer.shadowMap.type=THREE.PCFSoftShadowMap;
const scene=new THREE.Scene();
scene.background=new THREE.Color('#1a141f');
const camera=new THREE.PerspectiveCamera(38,1,0.1,200);

const toonGrad=(()=>{const d=new Uint8Array([150,205,255]);const t=new THREE.DataTexture(d,3,1,THREE.LuminanceFormat);t.minFilter=t.magFilter=THREE.NearestFilter;t.generateMipmaps=false;t.needsUpdate=true;return t;})();
const TOON=(c,o,flat)=>{const m=new THREE.MeshLambertMaterial(Object.assign({color:c},o||{}));if(flat)m.flatShading=true;return m;};
const LM=(c,o)=>new THREE.MeshLambertMaterial(Object.assign({color:c},o||{}));

const hemi=new THREE.HemisphereLight('#b9aee6','#8a6a4e',0.74);
scene.add(hemi);
const sun=new THREE.DirectionalLight('#dfe4ff',0.3);
sun.castShadow=true;
const mapSize=matchMedia('(pointer:coarse)').matches?1024:2048;
sun.shadow.mapSize.set(mapSize,mapSize);
Object.assign(sun.shadow.camera,{left:-6.5,right:6.5,top:6.5,bottom:-6.5,near:1,far:26});
sun.shadow.bias=-0.0007;sun.shadow.normalBias=0.04;
sun.position.set(-3,10,3.5);
scene.add(sun);scene.add(sun.target);
