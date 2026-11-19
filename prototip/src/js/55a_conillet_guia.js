/* =====================================================================
   EL CONILLET GUIA FINS AL TORREÓ (v.1.2, petició d'en Pere)
   La primera vegada que es juga, en acabar la volta de la càmera, en Conillet es posa davant de la Bruna,
   li parla («Hola! Soc el teu Conillet…») i, amb una llumeta damunt del cap, va saltant pel camí fins al
   clar del torreó. Si la Bruna es queda enrere, l'espera. En arribar, li diu que entri i torna a seguir-la.
   Es guarda a la partida (GS.flags.guia) i no torna a passar. Els textos són a TXT (54_datos_pociones.js).
   ===================================================================== */
const LEAD={on:false,st:'',t:0,s:0,route:[],len:[]};
// ruta: el camí del bosc (pathX) des de l'inici fins davant de la porta del torreó
{const z0=9,z1=OZ+11.5;for(let z=z0;z>=z1;z-=1){LEAD.route.push({x:pathX(z),z});}
 let a=0;LEAD.len=LEAD.route.map((p,i)=>i?(a+=Math.hypot(p.x-LEAD.route[i-1].x,p.z-LEAD.route[i-1].z)):0);}
const LEAD_END=LEAD.route[LEAD.route.length-1];
// punt de la ruta a una distància s del començament, i distància de la ruta més propera a un punt
function routeAt(s){const R=LEAD.route,L=LEAD.len;s=clamp(s,0,L[L.length-1]);let i=1;while(i<L.length-1&&L[i]<s)i++;
  const a=R[i-1],b=R[i],k=(s-L[i-1])/Math.max(1e-6,L[i]-L[i-1]);return {x:a.x+(b.x-a.x)*k,z:a.z+(b.z-a.z)*k};}
function routeS(x,z){let best=1e9,bs=0;const R=LEAD.route;for(let i=1;i<R.length;i++){const a=R[i-1],b=R[i],dx=b.x-a.x,dz=b.z-a.z,l2=dx*dx+dz*dz;
  const k=clamp(((x-a.x)*dx+(z-a.z)*dz)/l2,0,1),px=a.x+dx*k,pz=a.z+dz*k,d=Math.hypot(x-px,z-pz);if(d<best){best=d;bs=LEAD.len[i-1]+Math.sqrt(l2)*k;}}return bs;}
// la llumeta damunt del cap (i una llum de debò perquè es vegi de nit)
const leadOrb=new THREE.Group();{mk(SPH(0.05,12,8),new THREE.MeshBasicMaterial({color:'#fff6c8'}),0,0,0,leadOrb);
  const h=halo(leadOrb,0,0,0,0.7,'#ffe27a',0.9);h.material.fog=false;halo(leadOrb,0,0,0,1.3,'#ffd0a0',0.3).material.fog=false;
  leadOrb.add(new THREE.PointLight('#ffe0a0',0.9,6,1.6));leadOrb.visible=false;scene.add(leadOrb);}
// on vol anar el conill ara (el fa servir bunnyStep a 42_conejo.js en lloc del rastre de la Bruna)
function leadTarget(){
  // davant de la Bruna però una mica de costat, perquè des de la càmera (darrere d'ella) es vegi
  if(LEAD.st==='front'){const f=2.6,sd=1.0,a=S.yaw;return {x:S.pos.x+Math.sin(a)*f+Math.cos(a)*sd,z:S.pos.z+Math.cos(a)*f-Math.sin(a)*sd,wait:false};}
  const sB=routeS(S.pos.x,S.pos.z),dB=Math.hypot(S.pos.x-BN.x,S.pos.z-BN.z);
  // va uns metres per davant de la Bruna; si ella s'ha quedat enrere (o s'ha desviat), s'atura i l'espera
  const ahead=dB>6.5?routeS(BN.x,BN.z):Math.max(LEAD.s,sB+3.2);LEAD.s=Math.max(LEAD.s,Math.min(ahead,LEAD.len[LEAD.len.length-1]));
  const p=routeAt(LEAD.s);return {x:p.x,z:p.z,wait:dB>6.5};
}
function startLead(){if(!PLAY||GS.flags.guia||GS.phase!=='inicio'||LEAD.on)return;LEAD.on=true;LEAD.st='front';LEAD.t=0;LEAD.s=routeS(S.pos.x,S.pos.z);}
function endLead(){LEAD.on=false;LEAD.st='';leadOrb.visible=false;GS.flags.guia=1;saveGame();}
function leadStep(dt){
  if(!LEAD.on)return;LEAD.t+=dt;
  // si la Bruna arriba d'una altra manera al torreó (o vola, o ja ha començat la història), s'acaba
  if(GS.phase!=='inicio'||FL.on||lift.riding){endLead();return;}
  leadOrb.visible=true;leadOrb.position.set(BN.x,BN.root.position.y+0.62+Math.sin(S.t*3)*0.05,BN.z);
  if(LEAD.st==='front'){
    // quan ja és davant de la Bruna (o han passat uns segons), li parla
    const d=Math.hypot(BN.x-S.pos.x,BN.z-S.pos.z);
    // amb el tutorial (65_tutorial.js) no diu res: el tutorial porta la conversa
    if((d<3.2&&BN.v<0.3&&LEAD.t>0.8)||LEAD.t>4){LEAD.st='talk';if(LEAD.tut)return;sfx('notify');say(TXT.conill,TXT.guia,()=>{LEAD.st='lead';LEAD.t=0;toast(TXT.guiaToast,3500);});}
  }else if(LEAD.st==='talk'&&LEAD.tut){
    // mentre parla al tutorial: de cara a la Bruna, saltironeja i brilla
    BN.root.position.y+=Math.abs(Math.sin(S.t*6))*0.14;
    BN.yaw+=wrapA(Math.atan2(S.pos.x-BN.x,S.pos.z-BN.z)-BN.yaw)*(1-Math.exp(-dt*8));BN.root.rotation.y=BN.yaw;   // de cara a la Bruna
  }else if(LEAD.st==='lead'){
    if(Math.hypot(S.pos.x-LEAD_END.x,S.pos.z-LEAD_END.z)<4.5){LEAD.st='arrived';say(TXT.conill,TXT.guiaFi,endLead);}
  }
}
Object.assign(window.__j,{LEAD,startLead,endLead,leadTarget});
