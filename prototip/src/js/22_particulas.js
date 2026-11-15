const DUSTC='#ece2f7';
/* ---------- partículas: polvo, hierba, gotas, ondas ---------- */
const parts=[],pool={dust:[],blade:[],drop:[],ring:[]};
const pGeo={dust:new THREE.IcosahedronGeometry(1,1),blade:(()=>{const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute([-0.25,0,0,0.25,0,0,0.05,1,0],3));return g;})(),drop:new THREE.SphereGeometry(1,6,5),ring:(()=>{const g=new THREE.RingGeometry(0.82,1,24);g.rotateX(-PI/2);return g;})()};
function emit(type,x,y,z,n,o){
  o=o||{};
  for(let i=0;i<n;i++){
    let p=pool[type].pop();
    if(!p){if(parts.length>170)return;const m=new THREE.Mesh(pGeo[type],new THREE.MeshBasicMaterial({transparent:true,depthWrite:false,side:type==='blade'?THREE.DoubleSide:THREE.FrontSide}));scene.add(m);p={m,type,v:new THREE.Vector3(),w:new THREE.Vector3()};}
    const a=o.dir!==undefined?o.dir+rr(-(o.spread||1.2),o.spread||1.2):rr(0,TAU),sp=(o.sp||1)*rr(0.5,1.1);
    p.t=0;p.m.visible=true;p.m.position.set(x+rr(-.06,.06),y,z+rr(-.06,.06));
    if(type==='dust'){p.life=rr(0.45,0.75);p.size=(o.size||0.11)*rr(0.7,1.25);p.v.set(Math.sin(a)*sp*0.7,rr(0.25,0.6),Math.cos(a)*sp*0.7);p.m.material.color.set(o.color||DUSTC);}
    else if(type==='blade'){p.life=rr(0.5,0.9);p.size=rr(0.1,0.2);p.v.set(Math.sin(a)*sp,rr(1.4,3.0)*(o.up||1),Math.cos(a)*sp);p.w.set(rr(-9,9),rr(-9,9),rr(-9,9));p.m.material.color.set(o.color||pick(['#7d9a52','#6f8f4e','#a9aa50','#8fa04e','#8a78a8']));p.m.rotation.set(rr(0,6),rr(0,6),rr(0,6));}
    else if(type==='drop'){p.life=rr(0.4,0.7);p.size=rr(0.018,0.04)*(o.size||1);p.v.set(Math.sin(a)*sp,rr(1.6,3.2)*(o.up||1),Math.cos(a)*sp);p.m.material.color.set(pick(['#f2fdff','#c9f1f5','#ffffff']));}
    else{p.life=o.life||0.9;p.size=o.size||0.7;p.m.position.y=WL+0.012;p.m.material.color.set('#eafcff');}
    parts.push(p);
  }
}
function stepParts(dt){
  for(let i=parts.length-1;i>=0;i--){
    const p=parts[i],m=p.m;p.t+=dt;const u=p.t/p.life;
    if(u>=1){m.visible=false;pool[p.type].push(p);parts.splice(i,1);continue;}
    if(p.type==='dust'){p.v.multiplyScalar(Math.exp(-dt*3.2));m.position.addScaledVector(p.v,dt);const s=p.size*(0.35+1.0*Math.sqrt(u));m.scale.set(s,s*0.85,s);m.material.opacity=0.9*(1-u*u);}
    else if(p.type==='blade'){p.v.y-=9.5*dt;p.v.x*=Math.exp(-dt*1.5);p.v.z*=Math.exp(-dt*1.5);m.position.addScaledVector(p.v,dt);m.rotation.x+=p.w.x*dt;m.rotation.y+=p.w.y*dt;m.rotation.z+=p.w.z*dt;m.scale.setScalar(p.size);m.material.opacity=u<0.75?1:(1-u)/0.25;}
    else if(p.type==='drop'){p.v.y-=11*dt;m.position.addScaledVector(p.v,dt);m.scale.setScalar(p.size);m.material.opacity=m.position.y<WL?0:0.95;}
    else{const s=p.size*(0.2+0.95*u);m.scale.set(s,1,s);m.material.opacity=0.75*(1-u);}
  }
}
function burst(surf,x,y,z,k,dir){
  if(surf==='water'){emit('drop',x,WL+0.02,z,Math.round(5+7*k),{sp:0.9+k,up:0.7+0.5*k,size:1+0.4*k});emit('ring',x,0,z,1,{size:0.5+0.5*k});if(k>0.5)emit('ring',x,0,z,1,{size:0.9+0.5*k,life:1.2});}
  else if(surf==='grass'){if(k>0.45){emit('blade',x,y+0.05,z,Math.round(2+5*k),{sp:0.8+k,dir,spread:1.4,up:0.6+0.5*k});}if(k>0.8)emit('dust',x,y+0.04,z,2,{sp:0.5,size:0.08});}
  else if(surf==='stone'){if(k>0.45)emit('dust',x,y+0.04,z,Math.round(1+2*k),{sp:0.35+0.4*k,size:0.07,color:'#d6cbe0',dir,spread:1.6});}
  else emit('dust',x,y+0.04,z,Math.round(2+4*k),{sp:0.5+0.7*k,size:0.1+0.06*k,dir,spread:1.6});
}
