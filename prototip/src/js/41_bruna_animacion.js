/* --- trayectoria de un pie en el ciclo --- */
const ease=t=>t*t*(3-2*t);
function footCycle(p,duty,SL,lift,run,out){
  if(p<duty){const u=p/duty;out.z=SL*(0.5-u);const hs=u<0.16?(1-u/0.16):0,to=u>0.68?(u-0.68)/0.32:0;
    out.pitch=-0.42*hs*(1-run*0.7)+0.75*to*to;out.y=Math.sin(Math.max(0,out.pitch))*0.085;out.c=true;}
  else{const s=(p-duty)/(1-duty);out.z=SL*(-0.5+ease(s))-run*0.12*Math.sin(s*PI)*(1-s);out.y=lift*Math.pow(Math.sin(PI*Math.pow(s,0.8)),0.9)+0.04*(1-s)*(1-s);
    out.pitch=0.75*(1-s)*(1-s)+run*0.5*Math.sin(s*PI)*(1-s)-0.42*s*s*s*(1-run*0.7);out.c=false;}
}
const fc={z:0,y:0,pitch:0,c:false};
function solveLeg(leg,hx,hy,hz,fx,fy,fz,pitch){
  let dx=fx-hx,dy=fy-hy,dz=fz-hz,d=Math.hypot(dx,dy,dz);const mx=L1+L2-0.003;
  if(d>mx){const k=mx/d;dx*=k;dy*=k;dz*=k;d=mx;}if(d<0.12)d=0.12;
  const dyz=Math.hypot(dx,dy),a=Math.atan2(dz,dyz),roll=Math.atan2(dx,-dy);
  const kn=PI-Math.acos(clamp((L1*L1+L2*L2-d*d)/(2*L1*L2),-1,1)),ha=a+Math.acos(clamp((L1*L1+d*d-L2*L2)/(2*L1*d),-1,1));
  leg.hip.position.set(hx,hy,hz);leg.hip.rotation.set(-ha,0,roll);leg.knee.rotation.x=kn;leg.foot.rotation.x=pitch+ha-kn;leg.foot.rotation.z=-roll;
}
function animate(dt){
  S.t+=dt;const t=S.t,v=S.speed,inW=sat(S.depth/0.3);
  const w=ease(sat(v/0.5)),run=ease(sat((v-WALK*1.3)/(RUN*0.92-WALK*1.3))),grounded=!S.air;
  // --- ciclo de pasos ---
  // carrera con turbo y sabates màgiques: zancadas larguísimas, el pie apenas toca el suelo y el cuerpo flota
  const dash=P.dash=(P.dash||0)+(((S.dash||(S.air&&P.dash>0.5&&S.speed>8))?1:0)-(P.dash||0))*(1-Math.exp(-dt*6));
  const duty=lerp(lerp(0.6,0.27,run),0.12,dash),SL=(0.14+0.36*sat(v/WALK)+0.2*run)*(1-0.25*inW)*(1+0.18*dash),f=v>0.05?0.86*v*duty/SL:0;
  const ph0=S.ph;S.ph=(S.ph+f*dt)%1;
  const lift=(0.035+0.035*sat(v/WALK)+0.1*run)+0.14*inW+0.1*dash;
  const twist=Math.sin(S.ph*TAU)*(0.07+0.05*run)*w;                         // pelvis: adelanta la cadera del pie que avanza
  // objetivo de la pelvis (rebote vertical)
  const hb=0.5-0.5*Math.cos((S.ph-duty/2)*2*TAU),bobW=-Math.cos(S.ph*2*TAU)*0.013*w*(1-run),bobR=(2*hb-1)*0.05*run;
  const sq=stepS(SP.squat,S.prep>=0?0.2:0,dt);
  let py=STAND-0.034*w+bobW+bobR-clamp(sq,-0.05,0.2)+Math.sin(t*1.9)*0.004*(1-w)+dash*0.075*hb;   // con dash, vuela entre zancada y zancada
  const airK=P.air===undefined?0:P.air;P.air=airK+((S.air?1:0)-airK)*(1-Math.exp(-dt*(S.air?14:20)));
  // pies
  py=lerp(py,0.44+Math.sin(t*2.2)*0.006,FL.k);                                 // sentada en la escoba
  const legs=[B.legL,B.legR],hipX=HIPW*(1-0.25*run),F=[{},{}];
  for(let i=0;i<2;i++){
    const L=legs[i],p=(S.ph+(i?0.5:0))%1;footCycle(p,duty,SL,lift,run,fc);
    const rest=0.012*(i?-1:1);
    let fx=L.s*(hipX+0.012*(1-w)),fz=lerp(rest,fc.z+0.03*run,w),fy=fc.y*w,pt=fc.pitch*w;
    // pegado al suelo en pendiente
    const yaw=S.yaw,wx=S.pos.x+Math.cos(yaw)*fx+Math.sin(yaw)*fz,wz=S.pos.z-Math.sin(yaw)*fx+Math.cos(yaw)*fz;
    const gd=clamp(groundY(wx,wz,S.y)-S.y,-0.16,0.16);
    // en el aire: una rodilla arriba al subir, piernas estiradas al caer
    const up=sat(S.vy/4+0.5),ax=L.s*hipX*0.95,ay=lerp(i?0.14:0.07,i?0.2:0.26,up)+py-STAND+0.02,az=lerp(i?-0.05:0.06,i?-0.1:0.13,up),ap=lerp(0.5,0.75,up);
    F[i].x=lerp(fx,ax,P.air);F[i].y=lerp(fy+gd*(1-P.air)+AH,ay+AH,P.air);F[i].z=lerp(fz,az,P.air);F[i].p=lerp(pt,ap,P.air);
    // pisada: partículas según el suelo
    const c=fc.c&&grounded&&w>0.6;
    if(c&&!L.contact&&S.prep<0){const k=sat(v/RUN);let s2=surfHere(wx,wz,S.y);
      sfxStep(s2,k);
      if(s2==='water'||v>1.0||s2==='path'||s2==='sand'||s2==='wood')burst(s2,wx,groundY(wx,wz,S.y),wz,s2==='water'?0.25+0.75*k:(0.2+0.8*k)*(s2==='grass'&&v<2.4?0:1),S.yaw+PI);}
    if(c&&!L.contact&&dash>0.5)emit('dust',wx,groundY(wx,wz,S.y)+0.04,wz,4,{sp:1.3,size:0.06,color:pick(['#ffe36a','#fff3b0','#c98aff','#ff9ad8'])});   // chispas de las sabates
    L.contact=c;
  }
  if(FL.k>0.01)flightLegs(F);
  // la pelvis no puede subir más de lo que dan las piernas
  pelvisVy+=((py-pelvisY)/Math.max(dt,1e-4)-pelvisVy)*(1-Math.exp(-dt*14));pelvisY=py;
  // --- torso ---
  const lean=stepS(SP.lean,0.05*w+0.2*run+0.16*dash+clamp(S.acc*0.03,-0.22,0.22)-(S.skid>0?0.45:0)+(S.prep>=0?0.2:0),dt);
  const bank=stepS(SP.bank,clamp(-S.turn*v*0.035,-0.4,0.4),dt);
  const sway=Math.sin(S.ph*TAU)*0.011*w*(1-run*0.5),roll=Math.cos(S.ph*TAU)*0.032*w;
  B.pelvis.position.set(sway,pelvisY,-lean*0.05);
  B.pelvis.rotation.set(lean*0.55+P.air*(S.vy>0?-0.1:0.12),twist,roll*0.6+bank*0.6);
  if(FL.k>0.01){B.pelvis.rotation.x=lerp(B.pelvis.rotation.x,0.12,FL.k);B.pelvis.rotation.y*=1-FL.k;B.pelvis.rotation.z*=1-FL.k;}
  // aixafar i estirar estil Alba: molla que s'estira en saltar i s'aixafa en aterrar
  if(S.sqKick){P.sqV=(P.sqV||0)+S.sqKick;S.sqKick=0;}
  P.sqV=(P.sqV||0)+(-(P.sq||0)*140-(P.sqV||0)*11)*dt;P.sq=clamp((P.sq||0)+P.sqV*dt,-0.35,0.35);
  const st=1+clamp(SP.squat.v*-0.02,-0.06,0.07)+P.air*clamp(S.vy*0.012,-0.02,0.05),sqa=P.sq*(1-FL.k);
  B.pelvis.scale.set(1/Math.sqrt(st)*(1-sqa*0.3),st*(1+sqa*0.5),1/Math.sqrt(st)*(1-sqa*0.3));
  // barret amb molla estil Alba: es tomba endavant en frenar, enrere en accelerar i de costat als girs
  if(hatB.visible){const tx=-0.08-clamp(S.acc,-8,8)*0.02-(S.air?S.vy*0.015:0),tz=0.1+bank*0.6;
    P.hvx=(P.hvx||0)+(-((P.hx??-0.08)-tx)*90-(P.hvx||0)*7)*dt;P.hx=(P.hx??-0.08)+P.hvx*dt;
    P.hvz=(P.hvz||0)+(-((P.hz??0.1)-tz)*90-(P.hvz||0)*7)*dt;P.hz=(P.hz??0.1)+P.hvz*dt;
    hatB.rotation.x=clamp(P.hx,-0.5,0.35);hatB.rotation.z=clamp(P.hz,-0.4,0.6);}
  B.chest.rotation.set(lerp(lean*0.45+Math.sin(t*1.9)*0.012*(1-w),0.18+Math.min(FL.vh,9)*0.012,FL.k),-twist*1.4*(1-FL.k),(-roll*0.9+bank*0.5)*(1-FL.k));
  const hipsX=sway,ct=Math.cos(twist),sn=Math.sin(twist);
  for(let i=0;i<2;i++){const s=legs[i].s;solveLeg(legs[i],hipsX+s*HIPW*ct,pelvisY,-lean*0.05-s*HIPW*sn,F[i].x,F[i].y,F[i].z,F[i].p);}
  // --- brazos: balanceo al andar, abiertos como un avión al correr ---
  const sw=Math.cos(S.ph*TAU),tg={
    aL:sw*0.5*w*(1-run)+0.3*run+0.03,aR:-sw*0.5*w*(1-run)+0.3*run+0.03,
    zL:0.2+1.1*run+Math.sin(S.ph*2*TAU-0.6)*0.045*run+bank*0.9*run,zR:-(0.2+1.1*run+Math.sin(S.ph*2*TAU-0.6)*0.045*run-bank*0.9*run),
    eL:-(0.22+0.25*w*(1-run)+Math.max(0,-sw)*0.45*w*(1-run))+0.1*run,eR:-(0.22+0.25*w*(1-run)+Math.max(0,sw)*0.45*w*(1-run))+0.1*run,
    hx:-lean*0.75+Math.sin(t*0.9)*0.03*(1-w),hy:clamp(S.turn*0.07,-0.5,0.5)+Math.sin(t*0.55)*0.3*(1-w),hz:-bank*0.5+roll*0.25};
  if(inW>0.2&&!S.air){tg.zL+=0.45*inW*(1-run);tg.zR-=0.45*inW*(1-run);}
  if(S.prep>=0){tg.aL=tg.aR=0.9;tg.zL=0.35;tg.zR=-0.35;tg.eL=tg.eR=-0.5;tg.hx=0.15;}
  if(S.air){const up=sat(S.vy/4+0.5),fl=Math.sin(t*9)*0.05*(1-up);
    tg.aL=tg.aR=lerp(-0.2,-0.5,up);tg.zL=lerp(1.75,2.45,up)+fl;tg.zR=-(lerp(1.75,2.45,up)+fl);tg.eL=tg.eR=-0.25;tg.hx=lerp(0.22,-0.2,up);tg.hy=0;}
  if(S.skid>0){tg.aL=-0.7;tg.aR=-0.5;tg.zL=1.0;tg.zR=-1.0;tg.hx=0.1;}
  if(act&&act.type==='pet'){const q=act.t;tg.aR=-1.95+Math.sin(q*5)*0.15;tg.zR=-0.1;tg.eR=-0.3+Math.sin(q*5+1)*0.28;tg.hx=-0.3;tg.hy=0;tg.aL=0.05;}
  flightArms(tg);glidePose(tg);
  if(lift.riding){tg.zL=0.45;tg.zR=-0.45;tg.hx=lift.tgt<-1?0.28:-0.3;tg.hy=0;}
  const k=1-Math.exp(-dt*(S.air?10:9));for(const q in tg)P[q]=P[q]===undefined?tg[q]:P[q]+(tg[q]-P[q])*k;
  B.armL.sh.rotation.set(P.aL,0,P.zL);B.armL.el.rotation.x=P.eL;B.armR.sh.rotation.set(P.aR,0,P.zR);B.armR.el.rotation.x=P.eR;
  B.head.rotation.set(P.hx,P.hy+0.36*twist,P.hz);
  [B.armL,B.armR].forEach(a=>{a.fg.rotation.z=-a.s*(0.3-0.22*run+0.25*P.air);a.hd.rotation.z=a.s*0.15*run;});
  // --- secundarios con muelle: pelo, mochila, falda ---
  const vyT=S.vy*0.8+pelvisVy*0.22;
  B.hairB.rotation.x=clamp(stepS(SP.hairB,clamp(v*0.085+S.acc*0.02-vyT*0.07,-0.25,1.1),dt),-0.3,1.3)-P.hx*0.6;
  B.hairB.rotation.z=stepS(SP.hairZ,clamp(S.turn*v*0.02,-0.4,0.4),dt);
  B.hairS[0].rotation.x=clamp(stepS(SP.hairL,clamp(v*0.07-vyT*0.08,-0.2,1),dt),-0.3,1.2);B.hairS[1].rotation.x=clamp(stepS(SP.hairR,clamp(v*0.075-vyT*0.075,-0.2,1),dt),-0.3,1.2);
  B.hairS[0].rotation.z=0.1+Math.max(0,-vyT)*0.05+SP.hairZ.x*0.6;B.hairS[1].rotation.z=-0.1-Math.max(0,-vyT)*0.05+SP.hairZ.x*0.6;
  SP.pack.v-=clamp((pelvisVy-lastPelvisW)*0.22,-1.5,1.5);lastPelvisW=pelvisVy;B.pack.position.y=0.1+clamp(stepS(SP.pack,0,dt),-0.035,0.035)-(S.air?clamp(S.vy*0.004,-0.03,0.03):0);
  B.skirt.rotation.x=stepS(SP.skirtX,-v*0.035-S.acc*0.01+Math.sin(S.ph*2*TAU)*0.018*w,dt);B.skirt.rotation.z=-roll*0.8;
  const fl=1+clamp(stepS(SP.flare,clamp(-vyT*0.07,0,0.5)+run*0.06,dt),-0.05,0.5);B.skirt.scale.set(fl,1-(fl-1)*0.3,fl);
  // parpadeo
  S.blinkT-=dt;let bl=1;if(S.blinkT<0){bl=0.08;if(S.blinkT<-0.11)S.blinkT=rr(2,4.5);}
  B.eyes.forEach(e=>e.scale.y+=(bl-e.scale.y)*(1-Math.exp(-dt*40)));
  B.root.position.set(S.pos.x,S.y,S.pos.z);B.root.rotation.y=S.yaw;
  flightBody(dt);glideBody(dt);
  stepParts(dt);
}
