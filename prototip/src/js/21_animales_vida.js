function animWorld(dt){
  const t=S.t;uTime.value=t;
  // unicornio
  {const u=uni,d=uniDist(),pet=act&&act.type==='pet';u.happy*=Math.exp(-dt*0.5);
    const near=d<4.2,ang=clamp(wrapA(Math.atan2(S.pos.x-UNI.x,S.pos.z-UNI.z)-UNI.yaw),-1.1,1.1);
    const tg={nk:pet?1.0+Math.sin(t*3)*0.08:near?0.95:2.32+Math.sin(t*2.3)*0.05,ny:(pet||near)?ang*0.85:Math.sin(t*0.3)*0.25,
      hp:pet?0.6+Math.sin(t*3+1)*0.12:near?0.45:1.2+Math.max(0,Math.sin(t*4.6))*0.1,
      tz:Math.sin(t*(1.6+u.happy*5))*(0.22+u.happy*0.35),tx:0.12+u.happy*0.25,sy:1+Math.sin(t*1.8)*0.008,
      fl:pet?0:Math.max(0,Math.sin(t*0.37)-0.93)*9};
    damp(u.P,tg,1-Math.exp(-dt*4.5));const P=u.P;
    u.neck.rotation.set(P.nk,0,0);u.neck.rotation.y=0;u.neck.rotateOnWorldAxis(tv.set(0,1,0),P.ny);
    u.head.rotation.x=-P.nk+P.hp;
    u.tail.rotation.set(P.tx,0,P.tz);u.body.scale.y=P.sy;
    u.legs[0].hip.rotation.x=-P.fl*0.5;u.legs[0].kn.rotation.x=P.fl*1.1;
    u.hornGlow.material.opacity=0.45+0.2*Math.sin(t*2.6)+u.happy*0.4;u.hornGlow.scale.setScalar(0.9+u.happy*0.9);
  }
  // conejos
  for(const r of rabbits){
    const dB=Math.hypot(r.x-S.pos.x,r.z-S.pos.z);
    if(dB<2.3&&!r.flee){r.flee=true;const ax=(r.x-S.pos.x)/(dB+1e-3),az=(r.z-S.pos.z)/(dB+1e-3);let tx=r.x+ax*4,tz=r.z+az*4;
      if(Math.hypot(tx-r.hx,tz-r.hz)>7){tx=r.hx+rr(-2,2);tz=r.hz+rr(-2,2);}const b=bound(tx,tz);r.tx=b[0];r.tz=b[1];r.wait=0;}
    const dx=r.tx-r.x,dz=r.tz-r.z,d=Math.hypot(dx,dz);let mv=0;
    if(d>0.12&&r.wait<=0){mv=1;const sp=r.flee?3.4:1.1;r.yaw+=wrapA(Math.atan2(dx,dz)-r.yaw)*(1-Math.exp(-dt*10));
      let nx=r.x+Math.sin(r.yaw)*sp*dt,nz=r.z+Math.cos(r.yaw)*sp*dt;
      for(const c of COL){const ex=nx-c.x,ez=nz-c.z,e=Math.hypot(ex,ez),mn=c.r+0.15;if(e<mn&&e>1e-5){nx=c.x+ex/e*mn;nz=c.z+ez/e*mn;}}
      if(pondD(nx,nz)<1.03){r.tx=r.x;r.tz=r.z;}else{r.x=nx;r.z=nz;}
      r.hop+=dt*(r.flee?15:9);}
    else{if(d<=0.12&&r.wait<=0){r.wait=rr(1.5,5);r.flee=false;}r.wait-=dt;
      if(r.wait<=0){const tx=r.hx+rr(-3,3),tz=r.hz+rr(-3,3),b=bound(tx,tz);if(pondD(b[0],b[1])>1.1){r.tx=b[0];r.tz=b[1];}else r.wait=1;}
      r.hop+=(Math.ceil(r.hop/Math.PI)*Math.PI-r.hop)*(1-Math.exp(-dt*12));}
    const h=Math.abs(Math.sin(r.hop));
    r.g.position.set(r.x,landH(r.x,r.z)+h*(r.flee?0.26:0.14)*mv,r.z);r.g.rotation.y=r.yaw;
    r.rig.rotation.x=-Math.cos(r.hop*2)*0.12*mv;
    r.head.rotation.y=mv?0:Math.sin(t*0.7+r.hx)*0.6;r.head.rotation.x=mv?0:Math.max(0,Math.sin(t*0.9+r.hz))*0.25;
    r.ears[0].rotation.x=r.ears[1].rotation.x=-h*0.5*mv+Math.sin(t*2.1+r.hx)*0.06;
  }
  // ranas
  for(const f of frogs){
    const dB=Math.hypot(f.x-S.pos.x,f.z-S.pos.z);f.st_t+=dt;
    f.throat.scale.set(0.14*(1+0.22*Math.max(0,Math.sin(t*3.2+f.x))),0.1*(1+0.3*Math.max(0,Math.sin(t*3.2+f.x))),0.11);
    if(f.st==='sit'){
      f.t-=dt;if(f.t<0){f.t=rr(3.5,9);f.j=1;}
      if(f.j>0){f.j-=dt*2.6;const u=1-Math.max(0,f.j);f.g.position.y=f.y+Math.sin(u*Math.PI)*0.2*f.s;}else f.g.position.y=f.y;
      if(f.shy&&dB<f.shy){f.st='dive';f.st_t=0;const dx=POND.x-f.x,dz=POND.z-f.z,l=Math.hypot(dx,dz)||1;f.dx=f.x+dx/l*1.7;f.dz=f.z+dz/l*1.7;f.g.rotation.y=Math.atan2(dx,dz);}
    }else if(f.st==='dive'){const u=clamp(f.st_t/0.55,0,1);
      f.g.position.set(lerp(f.x,f.dx,u),lerp(f.y,WY-0.25,u)+Math.sin(u*Math.PI)*0.7,lerp(f.z,f.dz,u));f.rig.rotation.x=u*1.1;
      if(u>=1){f.st='under';f.st_t=0;f.g.visible=false;ripple(f.dx,f.dz,1.2);ripple(f.dx,f.dz,0.6);f.away=0;}
    }else if(f.st==='under'){f.away=dB>f.shy+2.2?f.away+dt:0;if(f.away>2.5){f.st='back';f.st_t=0;f.g.visible=true;ripple(f.dx,f.dz,0.9);}}
    else if(f.st==='back'){const u=clamp(f.st_t/0.6,0,1);
      f.g.position.set(lerp(f.dx,f.x,u),lerp(WY-0.25,f.y,u)+Math.sin(u*Math.PI)*0.8,lerp(f.dz,f.z,u));f.rig.rotation.x=(1-u)*-0.6;f.g.rotation.y=f.yaw;
      if(u>=1){f.st='sit';f.rig.rotation.x=0;f.t=rr(3,6);}}
  }
  // bicho peludo: se esconde si te acercas
  {const d=Math.hypot(furry.x-S.pos.x,furry.z-S.pos.z),want=d<3.4?0:1;furry.up+=(want-furry.up)*(1-Math.exp(-dt*(want?1.5:8)));
    furry.g.position.y=furry.y0-0.75*(1-furry.up)+Math.sin(t*1.7)*0.04*furry.up;furry.g.rotation.z=Math.sin(t*0.9)*0.12*furry.up;furry.g.rotation.y=-0.5+Math.sin(t*0.5)*0.3;}
  // mariposas
  for(const b of butterflies){const a=t*0.42+b.ph;
    const x=b.x+Math.sin(a)*2.4+Math.sin(a*2.3)*0.6,z=b.z+Math.sin(a*0.83+b.ph)*2.4+Math.cos(a*1.9)*0.6,y=b.y+Math.sin(t*1.3+b.ph)*0.45+Math.abs(Math.sin(t*13+b.ph))*0.06;
    b.g.rotation.y=Math.atan2(x-b.px,z-b.pz);b.px=x;b.pz=z;b.g.position.set(x,landH(x,z)*0.5+y,z);
    const fl=0.15+Math.abs(Math.sin(t*13+b.ph))*1.15;b.wl.rotation.z=fl;b.wr.rotation.z=-fl;}
  // pájaros
  for(const b of birds){const a=t*b.sp+b.ph;b.g.position.set(b.cx+Math.sin(a)*b.r,b.h+Math.sin(a*2.1)*0.8,b.cz+Math.cos(a)*b.r);b.g.rotation.y=a+(b.sp>0?Math.PI/2:-Math.PI/2);b.g.rotation.z=(b.sp>0?-1:1)*0.25;
    const fl=Math.sin(t*7+b.ph)*0.65;b.wl.rotation.z=fl;b.wr.rotation.z=-fl;}
  // mariquitas subiendo y bajando por el tronco
  for(const l of bugs){const u=clamp(l.t+Math.sin(t*0.13+l.ph)*0.12,0.15,0.85),p=l.tr.curve.getPointAt(u),r=(0.5-0.3*Math.pow(u,0.8))+0.02,up=Math.cos(t*0.13+l.ph)>0?0:Math.PI;
    tv.set(p.x+Math.sin(l.ang)*r,p.y,p.z+Math.cos(l.ang)*r).applyMatrix4(l.tr.M);l.g.position.copy(tv);
    l.g.rotation.set(0,0,0);l.g.rotation.y=l.ang+l.tr.yaw;l.g.rotateX(Math.PI/2);l.g.rotateY(up);}
  // luciérnagas
  {const b=flies.base,p=flies.pos;for(let i=0;i<flies.N;i++){const ph=b[i*4+3];p[i*3]=b[i*4]+Math.sin(t*0.5+ph)*0.9+Math.sin(t*1.3+ph*2)*0.25;p[i*3+1]=b[i*4+1]+Math.sin(t*0.8+ph*1.7)*0.45;p[i*3+2]=b[i*4+2]+Math.cos(t*0.43+ph)*0.9;}
    flies.g.attributes.position.needsUpdate=true;}
  for(const g of glows)g.s.material.opacity=g.o*(0.75+0.25*Math.sin(t*1.8+g.ph));
  shL1.intensity=0.8+0.2*Math.sin(t*1.8);
  // ondas del agua
  for(let i=ripples.length-1;i>=0;i--){const r=ripples[i];r.t+=dt/r.d;
    if(r.t>=1){if(r.loop)r.t=0;else{world.remove(r.m);r.m.material.dispose();ripples.splice(i,1);continue;}}
    const s=r.size*(0.25+r.t*1.1);r.m.scale.set(s,1,s);r.m.material.opacity=Math.sin(r.t*Math.PI)*(r.loop?0.4:0.8);}
  // corazones
  for(const h of hearts){if(!h.s.visible)continue;h.t+=dt;const u=h.t/1.5;if(u>=1){h.s.visible=false;continue;}
    h.s.position.set(h.x+Math.sin(h.t*4+h.sw)*0.08,h.y+u*1.0,h.z);const s=0.22+0.18*Math.sin(Math.min(1,u*3)*1.57);h.s.scale.set(s,s,s);h.s.material.opacity=u<0.7?1:(1-u)/0.3;}
  // humo del torreón
  for(const s of smoke){const u=(t*0.09+s.ph)%1;s.m.position.set(-1.9+Math.sin(u*5+s.ph*6)*0.5+u*1.5,14.6+u*5.5,-0.6+Math.cos(u*4)*0.4);const k=0.3+u*1.0;s.m.scale.set(k,k*0.8,k);s.m.material.opacity=Math.sin(u*Math.PI)*0.65;}
}
