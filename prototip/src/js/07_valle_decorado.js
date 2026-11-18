/* ---------- decoración del valle: setas, flores, rocas, juncos, hierba ---------- */
{
  // setas grandes junto al torreón (como en el mapa) y en la entrada de la cueva
  shroom(OX+14.5,-45.5,1.6,1.1,'blue');shroom(OX+16,-44.5,0.8,0.6,'blue',0.1,1);shroom(OX+13.6,-43.6,0.85,0.8,'spiral',0,0.3);shroom(OX+16.5,-46.8,0.45,0.45,'spiral');shroom(OX+12.8,-45,0.4,0.3,'pink');
  shroom(GT.x-4.6,GT.z+10.5,1.1,0.7,'cyan');shroom(GT.x-5.4,GT.z+11.2,0.6,0.4,'cyan');shroom(GT.x+4.8,GT.z+10.8,0.9,0.6,'pink');shroom(GT.x+5.5,GT.z+10,0.5,0.35,'teal');
  shroom(H2.x-6,H2.z-5,0.9,0.55,'lila');shroom(H2.x-6.6,H2.z-4.2,0.5,0.35,'blue');shroom(TH.x-3.5,TH.z+3,0.8,0.5,'pink');shroom(TH.x-4.2,TH.z+3.6,0.45,0.3,'spiral');
  glows.push({s:halo(world,OX+14.5,landH(OX+14.5,-45.5)+1.9,-45.5,4,'#4f6aff',0.5),o:0.5,ph:1},{s:halo(world,GT.x-4.6,GT.y+1.3,GT.z+10.5,3,'#62dcf4',0.5),o:0.5,ph:2});
  let n=0;
  for(let i=0;i<600&&n<26;i++){const a=rr(0,Math.PI*2),e=Math.sqrt(R())*0.95,x=VC.x+Math.sin(a)*e*VRX,z=VC.z+Math.cos(a)*e*VRZ;if(!okSpot(x,z,1.5))continue;
    const t=pick(['blue','cyan','pink','lila','teal','spiral']);shroom(x,z,rr(0.4,0.9),rr(0.3,0.5),t,rr(-.1,.1),rr(0,6));shroom(x+rr(.5,.8),z+rr(-.5,.5),rr(0.25,0.45),rr(0.2,0.3),t);n++;}
  // flores luminosas a lo largo de los caminos
  n=0;for(let i=0;i<500&&n<22;i++){const P=pick(PATHS),k=Math.floor(R()*(P.length-1)),u=R(),x0=lerp(P[k][0],P[k+1][0],u),z0=lerp(P[k][1],P[k+1][1],u),a=rr(0,Math.PI*2),x=x0+Math.sin(a)*rr(1.8,3),z=z0+Math.cos(a)*rr(1.8,3);
    if(!okSpot(x,z,0.3)||valE(x,z)>0.98)continue;glowFlower(x,z,rr(0.7,1.4),pick(['#f0a0ff','#ff8fd8','#9fd8ff']),R()<0.4);n++;}
  // rocas: orillas del río y sueltas
  for(let z=-46;z>-118;z-=rr(4,8)){[-1,1].forEach(s=>{const x=RX(z)+s*(RW+rr(1.4,2.6));if(Math.abs(z-BZ)<4)return;if(R()<0.55)rock(x,z,rr(0.6,1.3),rr(0.4,0.9),rr(0.6,1.1),R()<0.7);});}
  n=0;for(let i=0;i<300&&n<14;i++){const a=rr(0,Math.PI*2),e=Math.sqrt(R())*0.95,x=VC.x+Math.sin(a)*e*VRX,z=VC.z+Math.cos(a)*e*VRZ;if(!okSpot(x,z,2))continue;rock(x,z,rr(0.5,1.4),rr(0.4,1.0),rr(0.5,1.2),true);n++;}
  n=0;for(let i=0;i<300&&n<12;i++){const a=rr(0,Math.PI*2),e=rr(0.6,0.97),x=VC.x+Math.sin(a)*e*VRX,z=VC.z+Math.cos(a)*e*VRZ;if(!okSpot(x,z,2.5))continue;bush(x,z,rr(0.8,1.25));n++;}
  // juncos y espadañas en las orillas
  for(let i=0;i<340;i++){const z=rr(-44,-122),s=R()<0.5?-1:1,x=RX(z)+s*rr(RW-0.4,RW+1.4),y=landH(x,z);if(Math.abs(z-BZ)<3.2)continue;
    const yy=Math.max(y,WR-0.05),h=rr(0.7,1.6);folB.base=null;folB.sw=[yy,1.4/h];folB.add(bladeG,pick(['#35645a','#2f5a58','#3f7460']),x,yy,z,rr(-.25,.25),rr(0,6.28),rr(-.2,.2),0.13,h,1);
    if(i%4===0){litB.base=null;litB.sw=[yy,1.4/h];litB.add(C5,'#4a6a50',x+0.1,yy+h*0.58,z,0,0,0,0.016,h*1.15,0.016);litB.add(C6,'#7c4636',x+0.1,yy+h*1.15,z,0,0,0,0.05,0.32,0.05);}}
  // hierba del valle
  const GC=['#5c7a4a','#6f8f4e','#4a6a58','#b5b85a','#8fa04e','#7a9a55'];
  n=0;for(let i=0;i<(HERBA_ALBA?0:9000)&&n<1500;i++){const a=rr(0,Math.PI*2),e=Math.sqrt(R())*0.99,x=VC.x+Math.sin(a)*e*VRX,z=VC.z+Math.cos(a)*e*VRZ;
    if(distPaths(x,z)<1.4||Math.hypot(x-OX,z-OZ)<9.5||Math.hypot(x-OX+10.6,z-OZ)<4.4||Math.hypot(x-GT.x,z-GT.z)<7.6)continue;
    if(z<-34&&Math.abs(x-RX(z))<RW+0.6)continue;let inH=false;for(const H of HOUSES){const l=hL(H,x,z);if(Math.abs(l[0])<H.w/2+0.4&&Math.abs(l[1])<H.d/2+0.4)inH=true;}if(inH)continue;
    const y=landH(x,z),h=rr(0.2,0.48)*(R()<0.12?1.9:1),c=pick(GC);folB.base=null;folB.sw=[y,1.6];
    for(let k=0;k<3;k++)folB.add(bladeG,c,x+rr(-.09,.09),y-0.02,z+rr(-.09,.09),rr(-.35,.35),rr(0,6.28),rr(-.3,.3),rr(0.07,0.11),h*rr(0.7,1.1),1);n++;}
}
