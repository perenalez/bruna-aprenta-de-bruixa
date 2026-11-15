litB.base=null;litB.mesh(mLit);glowB.mesh(mGlow,false);folB.mesh(mFol,false);flatB.mesh(mFlat);

/* ---------- luciérnagas ---------- */
const flies=(()=>{const N=220,base=new Float32Array(N*4),pos=new Float32Array(N*3);
  for(let i=0;i<N;i++){let x,z;if(i<86){x=rr(-17,17);z=rr(-16,17);}else if(i<120){z=rr(-42,-14);x=pathX(z)+rr(-5,5);}else{const a=rr(0,6.283),r=Math.sqrt(R())*0.95;x=VC.x+Math.sin(a)*r*VRX;z=VC.z+Math.cos(a)*r*VRZ;}
    base[i*4]=x;base[i*4+1]=landH(x,z)+rr(0.3,3.2);base[i*4+2]=z;base[i*4+3]=rr(0,6.28);}
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(pos,3));
  const p=new THREE.Points(g,new THREE.PointsMaterial({map:glowTex,color:'#fff0a8',size:0.34,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false}));p.frustumCulled=false;world.add(p);
  return {N,base,pos,g};})();
