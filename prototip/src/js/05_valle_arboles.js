/* ---------- árboles del valle y del bosque encantado ---------- */
const okSpot=(x,z,cl)=>{
  if(distPaths(x,z)<cl+1.2)return false;
  if(Math.hypot(x-OX,z-OZ)<20)return false;
  if(Math.hypot(x-GT.x,z-GT.z)<17)return false;
  if(Math.hypot(x-TH.x,z-TH.z)<6)return false;
  for(const p of PADS)if(Math.hypot(x-p.x,z-p.z)<p.r+cl+1.5)return false;
  if(z<-34&&Math.abs(x-RX(z))<RW+cl+1.5)return false;
  if(Math.abs(z-BZ)<cl+4&&Math.abs(x-RXB)<BL+cl+3)return false;
  return true;
};
{
  const PALS=['blue','lila','orange','teal','blue','lila','teal'];
  let n=0;
  // borde del valle: bosque denso (más denso al este, el bosque encantado)
  for(let i=0;i<900&&n<58;i++){
    const a=rr(0,Math.PI*2),east=Math.sin(a)>0.3;const e=rr(0.84,east?1.32:1.18);
    const x=VC.x+Math.sin(a)*e*VRX,z=VC.z+Math.cos(a)*e*VRZ;
    if(z>-44)continue;if(!okSpot(x,z,3))continue;
    let close=false;for(let k=COL.length-1;k>=Math.max(0,COL.length-60);k--){const c=COL[k];if(Math.hypot(c.x-x,c.z-z)<4.6){close=true;break;}}if(close)continue;
    tree(x,z,rr(1.15,1.55),pick(PALS),rr(0,6),rr(1.0,1.25));n++;
  }
  // algunos árboles sueltos dentro del valle
  for(let i=0;i<400&&n<70;i++){
    const a=rr(0,Math.PI*2),e=Math.sqrt(R())*0.8,x=VC.x+Math.sin(a)*e*VRX,z=VC.z+Math.cos(a)*e*VRZ;
    if(!okSpot(x,z,4))continue;
    let close=false;for(let k=COL.length-1;k>=Math.max(0,COL.length-80);k--){const c=COL[k];if(Math.hypot(c.x-x,c.z-z)<7){close=true;break;}}if(close)continue;
    tree(x,z,rr(1.0,1.3),pick(PALS),rr(0,6));n++;
  }
  tree(TH.x,TH.z,1.6,'blue',0.4,1.3);
}
