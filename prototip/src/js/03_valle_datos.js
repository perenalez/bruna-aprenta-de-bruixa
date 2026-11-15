/* ---------- mundo ampliado: el valle del árbol gigante ---------- */
let WL=WY;
const VC={x:OX+6,z:-80},VRX=36,VRZ=32;
const valE=(x,z)=>Math.hypot((x-VC.x)/VRX,(z-VC.z)/VRZ);
const VF=(x,z)=>1-smooth(0.86,1.02,valE(x,z));
const VH=(x,z)=>OY+0.24*Math.sin(x*0.21+1)*Math.cos(z*0.17)+0.12*Math.sin(x*0.47+z*0.33)+0.7*smooth(0.6,0.98,valE(x,z));
const RX=z=>OX-23+2.5*Math.sin(z*0.07+1)+1.2*Math.sin(z*0.16+2),RW=2.6,WR=OY-0.55;
const BZ=-74,RXB=RX(BZ),BL=RW+2.3;
const deckY=x=>OY+0.12+0.45*Math.cos(Math.PI/2*clamp((x-RXB)/BL,-1,1));
const GT={x:OX+3,z:-91,y:0},CAVE_RIN=3.6,CAVE_ROUT=6.3,TUN=1.35;GT.y=VH(GT.x,GT.z);
const TH={x:OX+18,z:-104};
function mkHouse(x,z,w,d,h,fx,fz,big){const H={x,z,w,d,h,big,y:VH(x,z),yaw:Math.atan2(fx-x,fz-z),inside:false};H.c=Math.cos(H.yaw);H.s=Math.sin(H.yaw);return H;}
const hW=(H,lx,lz)=>[H.x+lx*H.c+lz*H.s,H.z-lx*H.s+lz*H.c];
const hL=(H,x,z)=>{const dx=x-H.x,dz=z-H.z;return [dx*H.c-dz*H.s,dx*H.s+dz*H.c];};
const H1=mkHouse(OX+26,-68,7,5.6,3.1,OX+9,-62,true),H2=mkHouse(OX+30,-87,5.4,4.6,2.8,OX+18,-80,false);
const HOUSES=[H1,H2];
const GARDEN=(()=>{const p=hW(H1,H1.w/2+3.3,0.3);return {x:p[0],z:p[1]};})();
const PADS=[{x:H1.x,z:H1.z,r:Math.hypot(H1.w,H1.d)/2+1.3,y:H1.y},{x:GARDEN.x,z:GARDEN.z,r:3.9,y:H1.y},{x:H2.x,z:H2.z,r:Math.hypot(H2.w,H2.d)/2+1.3,y:H2.y}];
const PATHS=[],addP=pts=>PATHS.push(pts);
addP([[OX+0.5,-46.5],[OX+8,-52],[OX+9.5,-62],[OX+6,-71]]);
addP([[OX+6,-71],[OX+4.5,-79],[GT.x,GT.z+8],[GT.x,GT.z+3]]);
addP([[OX+6,-71],[OX-4,-73],[OX-12,-74.6],[RXB+BL+0.6,BZ]]);
addP([[RXB-BL-0.6,BZ],[RXB-BL-2,BZ-8],[RX(-100)-5.5,-100],[RX(-116)-5.5,-116]]);
addP([[OX+9.5,-62],[OX+16,-65],hW(H1,0,H1.d/2+1.3)]);
addP([[OX+16,-65],[OX+19,-77],hW(H2,0,H2.d/2+1.3)]);
function distSeg(px,pz,ax,az,bx,bz){const vx=bx-ax,vz=bz-az,t=clamp(((px-ax)*vx+(pz-az)*vz)/(vx*vx+vz*vz),0,1);return Math.hypot(px-ax-vx*t,pz-az-vz*t);}
function distPaths(x,z){let m=1e9;for(const P of PATHS)for(let i=0;i<P.length-1;i++){const d=distSeg(x,z,P[i][0],P[i][1],P[i+1][0],P[i+1][1]);if(d<m)m=d;}return m;}
function extraH(x,z,h){
  const e=valE(x,z);
  if(e<1.12)h=lerp(VH(x,z),h,smooth(0.9,1.12,e));
  if(z<-34){const dr=Math.abs(x-RX(z));if(dr<RW+2.6){const k=smooth(-36,-44,z);h=lerp(h,lerp(WR-1.05,h,smooth(RW*0.45,RW+2.5,dr)),k);}}
  for(const p of PADS){const d=Math.hypot(x-p.x,z-p.z);if(d<p.r+3)h=lerp(p.y,h,smooth(p.r,p.r+3,d));}
  const dg=Math.hypot(x-GT.x,z-GT.z);if(dg<15)h=lerp(GT.y,h,smooth(8,15,dg));
  return h;
}
const C_PATH=new THREE.Color('#c6b862'),C_SOIL=new THREE.Color('#4a3a3a'),C_CAVE=new THREE.Color('#2e2632'),C_BANK=new THREE.Color('#6a6488'),C_BED=new THREE.Color('#3d3a70'),C_VAL=new THREE.Color('#7a9a55');
function extraC(x,z,h,c){
  const vf=VF(x,z);
  if(vf>0){const n=0.5+0.5*Math.sin(x*0.27+1.7*Math.sin(z*0.19))*Math.cos(z*0.23+Math.sin(x*0.13));c.lerp(C_VAL,vf*0.4*n);}
  const dp=distPaths(x,z);if(dp<2.4)c.lerp(C_PATH,(1-smooth(0.8,1.85,dp+0.25*Math.sin(x*1.3+z)))*0.9);
  if(z<-34){const dr=Math.abs(x-RX(z));if(dr<RW+3.4){c.lerp(C_BANK,(1-smooth(RW+1,RW+3.4,dr))*0.7);c.lerp(C_BED,1-smooth(RW*0.5,RW+0.6,dr));}}
  const dg=Math.hypot(x-GT.x,z-GT.z);if(dg<9.5){c.lerp(C_SOIL,(1-smooth(6.4,9.5,dg))*0.8);c.lerp(C_CAVE,1-smooth(3.2,3.9,dg));}
  for(const H of HOUSES){const l=hL(H,x,z);if(Math.abs(l[0])<H.w/2+0.9&&Math.abs(l[1])<H.d/2+0.9)c.lerp(C_SOIL,0.45);}
  return c;
}
