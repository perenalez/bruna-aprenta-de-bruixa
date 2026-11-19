/* =====================================================================
   ZONA DE PROVES · «PROVES DE NOVES ACCIONS» → «NEDAR» (en Pere, 19-11-2026)
   ?prova=aigua: un espai aquàtic propi (escena AQS) amb físiques i moviments nous.
     · La Bruna comença dalt d'una fusta que sura; camina i, amb «Saltar», es tira a l'aigua.
     · A la superfície neda «a la granota»: braços que s'obren i es tanquen, cames que fan la puntada
       i avança a empentes amb cada braçada.
     · «Bussejar» (botó o tecla B) la fa anar a sota; «Saltar» mantingut la fa pujar; el joystick la mou.
     · Sota l'aigua té una barra d'aire (15 s). Si s'acaba, puja sola a la superfície (no passa res de dolent).
     · A prop de la fusta, «Saltar» la fa pujar-hi.
   Entorn senzill: fons de sorra, algues, coralls, roques i peixos que s'aparten quan t'hi acostes.
   No toca el joc: el bucle de 50_juego.js crida aquaStep() i dibuixa AQS quan AQ.on.
   ===================================================================== */
const AQ={on:AIGUA_PROVA,st:'raft',p:new THREE.Vector3(0,0.2,0),v:new THREE.Vector3(),yaw:PI,ph:0,t:0,air:15,airMax:15,pitch:0,
  dive:false,divePrev:false,diveBtn:false,aireT:-9,splashT:0,bubT:0,hv:0,walkPh:0,forced:false};
const AQS=new THREE.Scene();
const AQ_RAFT={x:0,z:0,hw:1.25,hd:1.55,top:0.2},AQ_R=24;
const aqWave=(x,z,t)=>0.045*Math.sin(x*0.45+t*1.3)+0.035*Math.sin(z*0.6-t*1.05)+0.02*Math.sin((x+z)*0.9+t*2.1);
const aqFloor=(x,z)=>-4.6+0.45*Math.sin(x*0.23)*Math.cos(z*0.19)+0.25*Math.sin(x*0.6+z*0.4)+Math.max(0,Math.hypot(x,z)-18)*0.35;
const AQX={water:null,raft:null,weeds:[],fish:[],bub:[],spl:[],rings:[],fogUp:new THREE.Color('#bfe6f5'),fogDn:new THREE.Color('#1f6f8a')};

/* ---------- l'escena ---------- */
function aqBuild(){
  const S0=AQS;S0.background=new THREE.Color('#bfe6f5');S0.fog=new THREE.Fog('#bfe6f5',30,110);
  S0.add(new THREE.HemisphereLight('#e4f6ff','#c8b48a',0.78));
  const sl=new THREE.DirectionalLight('#fff4e0',0.55);sl.position.set(6,14,4);sl.castShadow=true;sl.shadow.mapSize.set(1024,1024);
  Object.assign(sl.shadow.camera,{left:-8,right:8,top:8,bottom:-8,near:1,far:40});S0.add(sl,sl.target);AQX.sun=sl;
  // superfície de l'aigua (es mou amb ones) i fons de sorra
  {const g=new THREE.PlaneGeometry(90,90,45,45);g.rotateX(-PI/2);
   AQX.water=new THREE.Mesh(g,new THREE.MeshLambertMaterial({color:'#3a9cc6',transparent:true,opacity:0.68,side:THREE.DoubleSide,depthWrite:false}));AQX.water.renderOrder=2;S0.add(AQX.water);}
  {const g=new THREE.PlaneGeometry(90,90,60,60);g.rotateX(-PI/2);const p=g.attributes.position,col=[],c=new THREE.Color();
   for(let i=0;i<p.count;i++){const x=p.getX(i),z=p.getZ(i);p.setY(i,aqFloor(x,z));c.set('#e6d3a0').offsetHSL(0,0,(Math.sin(x*1.3)*Math.cos(z*1.1))*0.04);col.push(c.r,c.g,c.b);}
   g.setAttribute('color',new THREE.Float32BufferAttribute(col,3));g.computeVertexNormals();const m=new THREE.Mesh(g,new THREE.MeshLambertMaterial({vertexColors:true}));m.receiveShadow=true;S0.add(m);}
  // la fusta: taulons, travessers i cordes
  {const r=new THREE.Group();r.position.set(AQ_RAFT.x,0,AQ_RAFT.z);S0.add(r);AQX.raft=r;const wd=['#9a6b42','#a87850','#8a5d38'];
   for(let i=0;i<7;i++){const b=mk(new THREE.BoxGeometry(AQ_RAFT.hw*2,0.13,0.42),LM(wd[i%3]),0,0.12,-AQ_RAFT.hd+0.22+i*0.445,r);b.castShadow=b.receiveShadow=true;}
   [-1,1].forEach(s=>{const c=mk(new THREE.BoxGeometry(0.16,0.12,AQ_RAFT.hd*2+0.1),LM('#6b4429'),s*(AQ_RAFT.hw-0.3),0.0,0,r);c.castShadow=true;
     [-1,1].forEach(q=>{const k=mk(new THREE.TorusGeometry(0.09,0.025,6,12),LM('#d8c08a'),s*(AQ_RAFT.hw-0.3),0.13,q*(AQ_RAFT.hd-0.2),r);k.rotation.y=PI/2;});});}
  // nenúfars i una roqueta que surt de l'aigua (per orientar-se)
  for(let i=0;i<9;i++){const a=hrr(0,TAU),d=hrr(4,14),l=mk(new THREE.CircleGeometry(hrr(0.25,0.45),12,0.3,TAU-0.6),LM('#5fa84e',{side:THREE.DoubleSide}),Math.sin(a)*d,0.03,Math.cos(a)*d,S0);l.rotation.x=-PI/2;
    if(i%3===0)mk(SPH(0.08,8,6),LM('#ff9fd0'),l.position.x,0.08,l.position.z,S0);}
  {const g=new THREE.Group();g.position.set(-9,0,-11);S0.add(g);const rk=mk(ico(1,1),LM('#9a948a'),0,-1.2,0,g);rk.scale.set(2.4,2.0,2.0);mk(ico(1,1),LM('#7fa458'),0,0.55,0,g).scale.set(1.6,0.35,1.4);
   for(let i=0;i<3;i++)mk(new THREE.ConeGeometry(0.5,1.4,6),LM('#4f8a3a'),hrr(-0.8,0.8),1.1,hrr(-0.6,0.6),g);}
  // algues (segments encadenats que es dobleguen), coralls i roques del fons
  const wc=['#3f8a4a','#4f9a3e','#2f7a5a','#6aa84a'];
  for(let i=0;i<55;i++){const a=hrr(0,TAU),d=Math.sqrt(HR())*20+2,x=Math.sin(a)*d,z=Math.cos(a)*d,y=aqFloor(x,z);
    let par=new THREE.Group();par.position.set(x,y,z);par.rotation.y=hrr(0,TAU);S0.add(par);const segs=[],n=4+Math.floor(HR()*5),h=hrr(0.3,0.5),col=LM(wc[i%4],{side:THREE.DoubleSide});
    for(let k=0;k<n;k++){const s=new THREE.Group();s.position.y=k?h:0;par.add(s);mk(new THREE.BoxGeometry(0.13-k*0.008,h,0.025),col,0,h/2,0,s);segs.push(s);par=s;}
    AQX.weeds.push({segs,ph:hrr(0,TAU),sp:hrr(0.8,1.4)});}
  const cc=['#ff7f8f','#ff9f5a','#c98aff','#ffd25a','#ff6fb0'];
  for(let i=0;i<24;i++){const a=hrr(0,TAU),d=hrr(3,19),x=Math.sin(a)*d,z=Math.cos(a)*d,y=aqFloor(x,z),col=LM(cc[i%5]);
    for(let k=0;k<4;k++){const b=mk(ico(1,1),col,x+hrr(-0.3,0.3),y+hrr(0.05,0.35),z+hrr(-0.3,0.3),S0);b.scale.setScalar(hrr(0.12,0.28));}}
  for(let i=0;i<14;i++){const a=hrr(0,TAU),d=hrr(4,20),x=Math.sin(a)*d,z=Math.cos(a)*d,r=mk(ico(1,1),LM('#8f8a84'),x,aqFloor(x,z)+0.1,z,S0);r.scale.set(hrr(0.4,1.1),hrr(0.3,0.7),hrr(0.4,1.0));r.rotation.y=hrr(0,TAU);}
  // peixos
  const fc=['#ff9a3a','#ffd23a','#5fb0ff','#ff6f8f','#7fe0c0'];
  for(let i=0;i<18;i++){const g=new THREE.Group();S0.add(g);const c=LM(fc[i%5]),s=hrr(0.7,1.3);g.scale.setScalar(s);
    mk(SPH(1,12,8),c,0,0,0,g).scale.set(0.07,0.1,0.2);const tl=mk(new THREE.ConeGeometry(0.08,0.14,4),c,0,0,-0.22,g);tl.rotation.x=-PI/2;
    [1,-1].forEach(q=>mk(SPH(0.016,6,5),LM('#1a1213'),q*0.05,0.03,0.12,g));
    const a=hrr(0,TAU),d=hrr(3,15);AQX.fish.push({g,tl,cx:Math.sin(a)*d,cz:Math.cos(a)*d,r:hrr(1.5,4),y:hrr(-3.8,-0.8),w:hrr(0.25,0.55)*(HR()<0.5?1:-1),ph:hrr(0,TAU),off:new THREE.Vector3()});}
  // bombolles i esquitxos (reutilitzats)
  const bm=new THREE.MeshLambertMaterial({color:'#ffffff',transparent:true,opacity:0.7,emissive:'#bfe6ff',emissiveIntensity:0.3});
  for(let i=0;i<30;i++){const m=new THREE.Mesh(SPH(1,8,6),bm);m.visible=false;S0.add(m);AQX.bub.push({m,on:false,v:0});}
  const sm=new THREE.MeshBasicMaterial({color:'#ffffff',transparent:true,opacity:0.85});
  for(let i=0;i<40;i++){const m=new THREE.Mesh(SPH(1,6,5),sm);m.visible=false;S0.add(m);AQX.spl.push({m,on:false,v:new THREE.Vector3()});}
  for(let i=0;i<8;i++){const m=new THREE.Mesh(new THREE.RingGeometry(0.8,1,24),new THREE.MeshBasicMaterial({color:'#ffffff',transparent:true,opacity:0,side:THREE.DoubleSide,depthWrite:false}));m.rotation.x=-PI/2;S0.add(m);AQX.rings.push({m,t:9});}
  // la Bruna passa a aquesta escena
  scene.remove(B.root);AQS.add(B.root);B.root.rotation.order='YXZ';
}
function aqSplash(x,z,n,f){for(let i=0;i<n;i++){const s=AQX.spl.find(o=>!o.on);if(!s)break;s.on=true;s.m.visible=true;s.m.position.set(x+hrr(-0.3,0.3),0.05,z+hrr(-0.3,0.3));
    s.v.set(hrr(-1,1)*f,hrr(1.5,3.5)*f,hrr(-1,1)*f);s.m.scale.setScalar(hrr(0.03,0.07));}
  const r=AQX.rings.find(o=>o.t>1.2);if(r){r.t=0;r.m.position.set(x,0.06,z);}}
function aqBubble(x,y,z){const b=AQX.bub.find(o=>!o.on);if(!b)return;b.on=true;b.m.visible=true;b.m.position.set(x+hrr(-0.05,0.05),y,z+hrr(-0.05,0.05));b.v=hrr(0.6,1.0);b.m.scale.setScalar(hrr(0.025,0.05));}

/* ---------- entrada: la mateixa que el joc (joystick, teclat, botó «Saltar») + «Bussejar» ---------- */
function aqInput(){
  const kx=(K.d||K.arrowright?1:0)-(K.a||K.arrowleft?1:0),ky=(K.w||K.arrowup?1:0)-(K.s||K.arrowdown?1:0);
  let ix=input.x,iy=input.y,m=Math.hypot(ix,iy);if(kx||ky){ix=kx;iy=ky;m=1;}
  if(m<0.12)return {m:0,yaw:AQ.yaw};
  const l=Math.hypot(ix,iy);ix/=l;iy/=l;const sy=Math.sin(cam.yaw),cy=Math.cos(cam.yaw);
  return {m:Math.min(1,m),yaw:Math.atan2(-sy*iy+cy*ix,-cy*iy-sy*ix)};
}

/* ---------- poses ---------- */
function aqLegs(fn){[B.legL,B.legR].forEach(L=>{L.hip.position.set(L.s*HIPW,STAND,0);fn(L,L.s);});}
function aqStand(v,dt){   // a la fusta: caminar senzill
  const w=sat(v/1.2);AQ.walkPh+=v*dt*1.9;const p=AQ.walkPh*TAU;
  B.pelvis.position.set(0,STAND-0.02*w+Math.abs(Math.sin(p))*0.02*w,0);B.pelvis.rotation.set(0.04*w,0,0);B.chest.rotation.set(0.05*w,0,0);B.head.rotation.set(0,0,0);
  aqLegs((L,s)=>{const q=Math.sin(p+(s>0?0:PI));L.hip.rotation.set(-q*0.45*w,0,0);L.knee.rotation.x=Math.max(0,q)*0.7*w;L.foot.rotation.x=0;});
  [B.armL,B.armR].forEach(a=>{const q=Math.sin(p+(a.s>0?PI:0));a.sh.rotation.set(q*0.45*w,0,a.s*0.1);a.el.rotation.set(-0.2,0,0);});}
function aqTuck(){B.pelvis.position.set(0,STAND,0);B.pelvis.rotation.set(0,0,0);B.chest.rotation.set(0,0,0);
  aqLegs(L=>{L.hip.rotation.set(-0.7,0,0);L.knee.rotation.x=1.1;L.foot.rotation.x=0.2;});[B.armL,B.armR].forEach(a=>{a.sh.rotation.set(0,0,a.s*1.3);a.el.rotation.set(-0.3,0,0);});}
// braçada a la granota: c = fase (0..1), k = intensitat (0 = surant quieta)
function aqStroke(c,k,under){
  const lerp2=(a,b,u)=>a+(b-a)*u;let rx,rz,el;
  if(c<0.35){const u=c/0.35;rx=lerp2(-2.9,-1.9,u);rz=lerp2(0.15,1.15,u);el=-0.2*u;}                // els braços s'obren
  else if(c<0.55){const u=(c-0.35)/0.2;rx=lerp2(-1.9,-1.2,u);rz=lerp2(1.15,0.3,u);el=-lerp2(0.2,1.6,u);} // es tanquen sota el pit
  else if(c<0.7){const u=(c-0.55)/0.15;rx=lerp2(-1.2,-2.9,u);rz=lerp2(0.3,0.15,u);el=-lerp2(1.6,0,u);}   // estirar endavant
  else{rx=-2.9;rz=0.15;el=0;}                                                                           // lliscar
  rx=lerp2(-2.6,rx,k);rz=lerp2(0.4+0.2*Math.sin(c*TAU),rz,k);
  [B.armL,B.armR].forEach(a=>{a.sh.rotation.set(rx,0,a.s*rz);a.el.rotation.set(el*k,0,0);});
  let hx=0.05,hz=0.08,kn=0.05;
  if(c>=0.4&&c<0.6){const u=(c-0.4)/0.2;hx=-0.9*u;hz=0.7*u;kn=2.0*u;}                               // cames que s'arrauleixen
  else if(c>=0.6&&c<0.75){const u=(c-0.6)/0.15;hx=-0.9*(1-u);hz=0.7*(1-u)+0.25*Math.sin(u*PI);kn=2.0*(1-u);}   // puntada de granota
  hx*=k;hz=hz*k+0.15*(1-k);kn=kn*k+0.4*(1-k)*Math.max(0,Math.sin(c*TAU*2));
  B.pelvis.position.set(0,STAND,0);B.pelvis.rotation.set(0,0,0);
  aqLegs((L,s)=>{L.hip.rotation.set(hx,0,s*hz);L.knee.rotation.x=kn;L.foot.rotation.x=0.9;});
  B.chest.rotation.set(-0.08*Math.sin(c*TAU)*k,0,0);B.head.rotation.set(under?-0.55:-0.6,0,0);   // el cap mira endavant
}
// col·loca la Bruna estirada: P és el centre del cos
const _aqo=new THREE.Vector3(),_aqe=new THREE.Euler(0,0,0,'YXZ');
function aqPlaceProne(P,pitch,yaw,roll){B.root.rotation.set(pitch,yaw,roll||0);_aqe.set(pitch,yaw,roll||0);_aqo.set(0,0.62,0).applyEuler(_aqe);B.root.position.copy(P).sub(_aqo);}

/* ---------- cada fotograma ---------- */
function aqOnRaft(x,z,m){return Math.abs(x-AQ_RAFT.x)<AQ_RAFT.hw-(m||0)&&Math.abs(z-AQ_RAFT.z)<AQ_RAFT.hd-(m||0);}
function aqRaftDist(x,z){const dx=Math.max(0,Math.abs(x-AQ_RAFT.x)-AQ_RAFT.hw),dz=Math.max(0,Math.abs(z-AQ_RAFT.z)-AQ_RAFT.hd);return Math.hypot(dx,dz);}
function aquaStep(dt){
  AQ.t+=dt;S.t+=dt;const t=AQ.t,inp=aqInput(),P=AQ.p,raftY=AQ_RAFT.top+aqWave(0,0,t)*0.6;
  const dive=K.b||AQ.diveBtn,diveReq=dive&&!AQ.divePrev;AQ.divePrev=dive;const jumpReq=S.jumpReq;S.jumpReq=false;
  const turn=(rate)=>{if(inp.m>0)AQ.yaw+=wrapA(inp.yaw-AQ.yaw)*(1-Math.exp(-dt*rate));};
  if(AQ.st==='raft'){
    turn(9);const v=2.0*inp.m;AQ.hv+=(v-AQ.hv)*(1-Math.exp(-dt*8));
    P.x+=Math.sin(AQ.yaw)*AQ.hv*dt;P.z+=Math.cos(AQ.yaw)*AQ.hv*dt;P.y=raftY;
    if(jumpReq){AQ.st='air';AQ.v.set(Math.sin(AQ.yaw)*Math.max(AQ.hv,1.6),4.4,Math.cos(AQ.yaw)*Math.max(AQ.hv,1.6));sfx('jump');}
    else if(!aqOnRaft(P.x,P.z,-0.05)){AQ.st='air';AQ.v.set(Math.sin(AQ.yaw)*AQ.hv,0,Math.cos(AQ.yaw)*AQ.hv);}
    B.root.rotation.set(0,AQ.yaw,0);B.root.position.copy(P);aqStand(AQ.hv,dt);
    AQ.air=Math.min(AQ.airMax,AQ.air+dt*5);
  }else if(AQ.st==='air'){
    AQ.v.y-=12*dt;P.addScaledVector(AQ.v,dt);
    if(AQ.v.y<0&&aqOnRaft(P.x,P.z)&&P.y<=raftY){P.y=raftY;AQ.st='raft';AQ.hv=0;sfx('land',0.4);}
    else if(P.y<=-0.1){   // cau a l'aigua: esquitxada i a nedar
      AQ.st='surface';const f=Math.min(1.6,0.6-AQ.v.y*0.15);aqSplash(P.x,P.z,18,f);sfx('splash');
      P.y=-0.2-Math.min(0.6,-AQ.v.y*0.08);AQ.v.y=Math.min(0,AQ.v.y*0.25);AQ.hv=Math.hypot(AQ.v.x,AQ.v.z)*0.5;AQ.pitch=0.4;}
    B.root.rotation.set(0,AQ.yaw,0);B.root.position.copy(P);aqTuck();
  }else{
    // nedar: a la superfície o sota l'aigua
    const under=AQ.st==='under';turn(under?3.5:3);
    const swimV=(under?2.2:1.8)*inp.m;
    AQ.ph=(AQ.ph+dt*(inp.m>0?0.8+0.35*inp.m:0.3))%1;
    const c=AQ.ph,pulse=c<0.35?0.6*Math.sin(c/0.35*PI):(c>=0.6&&c<0.8?1.3*Math.sin((c-0.6)/0.2*PI):0.15);
    AQ.hv+=(swimV*(0.45+pulse)-AQ.hv)*(1-Math.exp(-dt*4));
    P.x+=Math.sin(AQ.yaw)*AQ.hv*dt;P.z+=Math.cos(AQ.yaw)*AQ.hv*dt;
    const surfY=-0.02+aqWave(P.x,P.z,t);   // amb el cos més alt, el cap queda ben fora de l'aigua
    if(!under){
      P.y+=(surfY-P.y)*(1-Math.exp(-dt*4));AQ.v.y=0;
      if(diveReq){AQ.st='under';AQ.v.y=-2.2;aqSplash(P.x,P.z,6,0.5);sfx('splash');}
      else if(jumpReq&&aqRaftDist(P.x,P.z)<0.95){   // pujar a la fusta
        AQ.st='raft';const nx=clamp(P.x,AQ_RAFT.x-AQ_RAFT.hw+0.35,AQ_RAFT.x+AQ_RAFT.hw-0.35),nz=clamp(P.z,AQ_RAFT.z-AQ_RAFT.hd+0.35,AQ_RAFT.z+AQ_RAFT.hd-0.35);
        P.set(nx,raftY,nz);AQ.hv=0;aqSplash(nx,nz,8,0.6);sfx('jump');}
      AQ.air=Math.min(AQ.airMax,AQ.air+dt*5);AQ.forced=false;
      AQ.pitch+=(1.0-AQ.pitch)*(1-Math.exp(-dt*3));   // a la superfície, més dreta
      AQ.splashT-=dt;if(inp.m>0&&AQ.splashT<0&&c>0.55&&c<0.62){AQ.splashT=0.5;aqSplash(P.x-Math.sin(AQ.yaw)*0.5,P.z-Math.cos(AQ.yaw)*0.5,3,0.35);}
    }else{
      // sota l'aigua: «Bussejar» baixa, «Saltar» puja, si no, sura una mica cap amunt
      AQ.air-=dt;if(AQ.air<=0&&!AQ.forced){AQ.forced=true;toast('Necessites aire! Puja a respirar',2500);}
      const vt=AQ.forced?2.6:(dive?-1.8:(S.jumpHeld?1.9:0.3));AQ.v.y+=(vt-AQ.v.y)*(1-Math.exp(-dt*3));
      P.y+=AQ.v.y*dt;const fl=aqFloor(P.x,P.z)+0.4;if(P.y<fl){P.y=fl;AQ.v.y=Math.max(0,AQ.v.y);}
      if(P.y>=surfY-0.05&&AQ.v.y>0){AQ.st='surface';P.y=surfY;aqSplash(P.x,P.z,5,0.5);if(AQ.air<AQ.airMax*0.3)sfx('splash');}
      AQ.pitch+=((1.57-clamp(AQ.v.y*0.28,-0.55,0.6))-AQ.pitch)*(1-Math.exp(-dt*3));
      AQ.bubT-=dt;if(AQ.bubT<0){AQ.bubT=hrr(0.35,0.8);const hx=P.x+Math.sin(AQ.yaw)*0.55,hz=P.z+Math.cos(AQ.yaw)*0.55;for(let i=0;i<3;i++)aqBubble(hx,P.y+0.1,hz);}
    }
    const r=Math.hypot(P.x,P.z);if(r>AQ_R){P.x*=AQ_R/r;P.z*=AQ_R/r;}
    // la fusta és sòlida a prop de la superfície: no es pot nedar a través seu
    if(AQ.st!=='raft'&&P.y>-0.9){const m=0.35,dx=P.x-AQ_RAFT.x,dz=P.z-AQ_RAFT.z,ox=AQ_RAFT.hw+m-Math.abs(dx),oz=AQ_RAFT.hd+m-Math.abs(dz);
      if(ox>0&&oz>0){if(ox<oz)P.x+=Math.sign(dx||1)*ox;else P.z+=Math.sign(dz||1)*oz;}}
    if(AQ.st==='raft'){B.root.rotation.set(0,AQ.yaw,0);B.root.position.copy(P);aqStand(0,dt);}   // acaba de pujar a la fusta
    else{aqPlaceProne(P,AQ.pitch,AQ.yaw,Math.sin(c*TAU)*0.06*inp.m);aqStroke(c,inp.m>0?1:0,under);}
  }
  // fusta i aigua que es mouen
  AQX.raft.position.y=aqWave(0,0,t)*0.6;AQX.raft.rotation.set(Math.sin(t*0.9)*0.025,0,Math.sin(t*0.7)*0.03);
  {const p=AQX.water.geometry.attributes.position;for(let i=0;i<p.count;i++)p.setY(i,aqWave(p.getX(i),p.getZ(i),t));p.needsUpdate=true;}
  for(const w of AQX.weeds)w.segs.forEach((s,k)=>{s.rotation.z=Math.sin(t*w.sp+w.ph+k*0.6)*0.12;s.rotation.x=Math.cos(t*w.sp*0.8+w.ph+k*0.5)*0.08;});
  // peixos: voltes tranquil·les; s'aparten si la Bruna s'acosta
  for(const f of AQX.fish){const a=f.ph+t*f.w,x=f.cx+Math.sin(a)*f.r,z=f.cz+Math.cos(a)*f.r,y=f.y+Math.sin(t*0.7+f.ph)*0.2;
    const dx=x-P.x,dy=y-P.y,dz=z-P.z,d=Math.hypot(dx,dy,dz),flee=d<2.2?(2.2-d)*1.4:0;
    f.off.x+=((d>1e-3?dx/d*flee:0)-f.off.x)*(1-Math.exp(-dt*3));f.off.y+=((d>1e-3?dy/d*flee*0.5:0)-f.off.y)*(1-Math.exp(-dt*3));f.off.z+=((d>1e-3?dz/d*flee:0)-f.off.z)*(1-Math.exp(-dt*3));
    f.g.position.set(x+f.off.x,Math.min(-0.3,y+f.off.y),z+f.off.z);f.g.rotation.y=a+(f.w>0?PI/2:-PI/2);f.tl.rotation.y=Math.sin(t*9+f.ph)*0.5;}
  for(const b of AQX.bub){if(!b.on)continue;b.m.position.y+=b.v*dt;b.m.position.x+=Math.sin(t*5+b.v*9)*0.003;if(b.m.position.y>-0.02){b.on=false;b.m.visible=false;}}
  for(const s of AQX.spl){if(!s.on)continue;s.v.y-=9*dt;s.m.position.addScaledVector(s.v,dt);if(s.m.position.y<-0.05){s.on=false;s.m.visible=false;}}
  for(const r of AQX.rings){r.t+=dt;const u=r.t/1.2;r.m.scale.setScalar(0.3+u*1.6);r.m.material.opacity=u<1?0.6*(1-u):0;}
  // càmera que segueix la Bruna (els gestos de sempre la giren i apropen)
  const tgt=AQ.st==='raft'||AQ.st==='air'?_aqo.set(P.x,P.y+0.8,P.z):_aqo.set(P.x,P.y+0.25,P.z);
  AQ.camT=AQ.camT||tgt.clone();AQ.camT.lerp(tgt,1-Math.exp(-dt*5));
  const cp=Math.cos(cam.pitch),sp=Math.sin(cam.pitch);camera.position.set(AQ.camT.x+Math.sin(cam.yaw)*cp*cam.dist,AQ.camT.y+sp*cam.dist,AQ.camT.z+Math.cos(cam.yaw)*cp*cam.dist);
  const fy=aqFloor(camera.position.x,camera.position.z)+0.3;if(camera.position.y<fy)camera.position.y=fy;camera.lookAt(AQ.camT);
  AQX.sun.position.set(AQ.camT.x+6,AQ.camT.y+14,AQ.camT.z+4);AQX.sun.target.position.copy(AQ.camT);
  // sota l'aigua tot es veu blau verd i amb boira
  const sub=camera.position.y<aqWave(camera.position.x,camera.position.z,t);
  AQS.background.copy(sub?AQX.fogDn:AQX.fogUp);AQS.fog.color.copy(AQS.background);AQS.fog.near=sub?1:30;AQS.fog.far=sub?22:110;
  // barra d'aire
  const bar=$('aqair');if(bar){const show=AQ.st==='under'||AQ.air<AQ.airMax-0.05;bar.style.opacity=show?1:0;bar.querySelector('i').style.width=(AQ.air/AQ.airMax*100).toFixed(1)+'%';bar.classList.toggle('poc',AQ.air<AQ.airMax*0.3);}
  const bd=$('bdive');if(bd)bd.textContent=AQ.st==='under'?'Baixar':'Bussejar';
}

/* ---------- menú «Proves de noves accions» i arrencada ---------- */
PROVA_OPEN.accions=()=>{const p=$('tproves');p.classList.add('on');
  p.querySelector('.card').innerHTML=`<h3>Proves de noves accions</h3><p>Accions noves per provar abans de posar-les al joc.</p>
    <ul><li><button data-acc="aigua">Nedar · espai aquàtic<em class="go">Prova-ho</em></button></li></ul><button class="back" data-go="llista">Tornar</button>`;};
document.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('[data-acc]');if(b){sfx('click');location.href=location.pathname+'?prova='+b.dataset.acc;}});
if(AQ.on){
  aqBuild();showTitleUI(false);camera.fov=42;camera.updateProjectionMatrix();cam.dist=5.2;cam.pitch=0.3;cam.yaw=0;
  ['hud','chips','bwand','spells','ctx','tbar','frost'].forEach(id=>{const e=$(id);if(e)e.style.display='none';});
  const sm=document.querySelector('#title small');if(sm&&sm.firstChild&&sm.firstChild.nodeType===3)sm.firstChild.textContent='Prova · Nedar · ';const cn=$('cnt');if(cn)cn.textContent='l\'espai aquàtic';
  const css=document.createElement('style');css.textContent=`
#bdive{width:70px;height:70px;font-size:12px}
#aqair{position:fixed;left:50%;top:calc(env(safe-area-inset-top) + 62px);transform:translateX(-50%);z-index:20;display:flex;align-items:center;gap:8px;font:700 13px Fredoka,system-ui;color:#fff;text-shadow:0 1px 3px rgba(0,40,60,.6);transition:opacity .4s;opacity:0;pointer-events:none}
#aqair b{display:block;width:150px;height:12px;border-radius:9px;background:rgba(255,255,255,.35);overflow:hidden;box-shadow:0 1px 4px rgba(0,40,60,.35)}#aqair i{display:block;height:100%;background:linear-gradient(90deg,#7fe0ff,#bff4ff);border-radius:9px}
#aqair.poc i{background:linear-gradient(90deg,#ff7f6a,#ffb08a)}
#aqback{position:fixed;right:calc(env(safe-area-inset-right) + 10px);top:calc(env(safe-area-inset-top) + 10px);z-index:25;background:rgba(40,110,140,.85);color:#fff;border:0;border-radius:999px;font:600 12px Fredoka,system-ui;padding:7px 12px;cursor:pointer}`;document.head.appendChild(css);
  const air=document.createElement('div');air.id='aqair';air.innerHTML='Aire <b><i></i></b>';document.body.appendChild(air);
  const bd=document.createElement('button');bd.id='bdive';bd.className='rb';bd.textContent='Bussejar';$('acts').insertBefore(bd,$('bjump'));
  bd.addEventListener('pointerdown',e=>{AQ.diveBtn=true;bd.setPointerCapture(e.pointerId);e.preventDefault();e.stopPropagation();});
  const up=()=>{AQ.diveBtn=false;};bd.addEventListener('pointerup',up);bd.addEventListener('pointercancel',up);
  const bk=document.createElement('button');bk.id='aqback';bk.textContent='← Zona de proves';document.body.appendChild(bk);
  bk.addEventListener('pointerdown',e=>e.stopPropagation());bk.addEventListener('click',()=>{location.href=location.pathname+'?prova=zona';});
  $('hint').textContent=matchMedia('(pointer:coarse)').matches?'Camina fins a la vora de la fusta i prem «Saltar» per tirar-te a l\'aigua':'WASD: moure\'s · Espai: saltar / pujar · B: bussejar';
  $('hint').style.opacity=1;setTimeout(()=>{$('hint').style.opacity=0;},9000);
}
Object.assign(window.__j,{AQ,AQX,aquaStep,aqFloor,AQ_RAFT});
