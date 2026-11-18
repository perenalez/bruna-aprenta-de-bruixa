/* =====================================================================
   PERSONATGE MODULAR (zona de proves · «Crea el teu personatge», encàrrec pas 3)
   Parteix del ninot de la Bruna (buildBruna: mateix esquelet i mateixa animació) i el vesteix segons un «look»:
     {nom, pell, pentinat, cabell, sl:{dalt, baix, sencer, cap, mitjons, vestit, capa, davantal,
                                      polsc, polsb, ulleres, arrac, cara, sabates}}
   applyLook(rig, look) s'aplica a un ninot acabat de fer (buildBruna()). Pensat per reutilitzar-lo
   (p. ex. la pinta màgica del nivell 2). No toca el model original de la Bruna del joc.
   ===================================================================== */
const PC_PELL=[['mclar','Molt clar','#f6dcc8'],['rosat','Clar rosat','#f0c4ae'],['daurat','Clar daurat','#ecc394'],['migclar','Mig clar','#d8a478'],['oliva','Oliva','#c49a68'],
  ['bruclar','Bru clar','#b9764e'],['bru','Bru','#9a5f3c'],['brufosc','Bru fosc','#7a4a2e'],['fosc','Fosc','#5c3622'],['mfosc','Molt fosc','#3e2418']];
const PC_PENTINAT=[['curt_llis','Curt llis'],['curt_arrissat','Curt arrissat'],['rapat','Rapat amb serrell'],['melena','Mitja melena'],['llarg_llis','Llarg llis'],
  ['llarg_ondulat','Llarg ondulat'],['cua','Cua de cavall'],['trenes','Dues trenes'],['monyos','Dos monyos'],['afro','Afro']];
const PC_CABELL=[['negre','Negre','#221c1e'],['castany','Castany','#5a3a28'],['ros','Ros','#d9b26a'],['groc','Groc','#f2d23a'],['pelroig','Pèl-roig','#c4522a'],
  ['blanc','Blanc','#f2f0ec'],['lila','Lila','#b38ae6'],['blau','Blau','#4a7fe0'],['rosa','Rosa','#ff8fc8'],['arc','Arc de Sant Martí','arc']];
// [id, nom, slot]
const PC_ROBA=[['flors','Samarreta de flors','dalt'],['cotxes','Samarreta de cotxes','dalt'],['pops','Samarreta de pops','dalt'],['estelada','Samarreta de l\'estelada','dalt'],
  ['dessuadora','Dessuadora amb caputxa','dalt'],['texans','Pantalons texans','baix'],['curts','Pantalons curts de ratlles','baix'],['fflors','Faldilla de flors','baix'],
  ['volants','Faldilla de volants','baix'],['vpics','Vestit de pics','sencer']];
const PC_BRUIXA=[['mliles','Mitges de ratlles liles','mitjons'],['bestrella','Barret amb estrella','cap'],['blluna','Barret amb lluna','cap'],['vnegre','Vestit tot negre','vestit'],
  ['vllunes','Vestit de llunes i estrelles','vestit'],['cmorada','Capa morada','capa'],['cnit','Capa de nit estrellada','capa'],['mverdes','Mitges de ratlles verdes i negres','mitjons'],
  ['davantal','Davantal de pocions','davantal'],['btort','Barret punxegut tort amb pedaços','cap']];
const PC_COMPL=[['pcolors','Polseres de colors','polsc'],['pcascavells','Polsera de cascavells','polsb'],['dflors','Diadema de flors','cap'],['dgat','Diadema d\'orelles de gat','cap'],
  ['urodones','Ulleres rodones','ulleres'],['uestrella','Ulleres d\'estrella','ulleres'],['arracades','Arracades de lluna','arrac'],['cara','Cara pintada de colors','cara'],
  ['gorro','Gorro de neu amb borla','cap'],['plomes','Barret de plomes','cap']];
const PC_SABATES=[['vambes','Vambes'],['pallasso','Sabates de pallasso'],['talo','Sabates de taló'],['spics','Sabates de pics'],['negres','Sabates negres senzilles'],
  ['ballarina','Sabatilles de ballarina'],['sardana','Espardenyes de sardana'],['espardenyes','Espardenyes'],['avarques','Avarques'],['crocs','Crocs']];
const PC_MITJONS=[['vermells','Vermells','#e23b3b'],['grocs','Grocs','#f2d23a'],['blaus','Blaus','#3f6fe0'],['verds','Verds','#4fbf5a'],['liles','Liles','#b07ae0'],
  ['rosa','Rosa','#ff8fc8'],['ratlles','De ratlles',null],['mpics','De pics',null],['marc','Arc de Sant Martí',null],['desap','Desaparellats',null]];
const PC_DEFAULT={nom:'',pell:'migclar',pentinat:'melena',cabell:'castany',sl:{dalt:'flors',baix:'texans',sabates:'vambes',mitjons:'vermells'}};
const RAINBOW=['#e8443a','#f59a23','#f6d93a','#4fbf5a','#3f8fe0','#a45fd0'];

/* ---------- textures (es fan una vegada i es comparteixen) ---------- */
const PCT={};
function pcTex(id){if(PCT[id])return PCT[id];const T=(w,h,f,rx,ry)=>canvasTex(w,h,f,rx||1,ry||1),dot=(g,x,y,r,c)=>{g.fillStyle=c;g.beginPath();g.arc(x,y,r,0,7);g.fill();};
  const starP=(g,x,y,r,c)=>{g.fillStyle=c;g.beginPath();for(let i=0;i<10;i++){const a=i/10*TAU-PI/2,rr2=i%2?r*0.45:r;g.lineTo(x+Math.cos(a)*rr2,y+Math.sin(a)*rr2);}g.closePath();g.fill();};
  const moon=(g,x,y,r,c,bg)=>{dot(g,x,y,r,c);dot(g,x+r*0.45,y-r*0.2,r*0.85,bg);};
  const flowers=(bg,cols)=>(g,w,h)=>{g.fillStyle=bg;g.fillRect(0,0,w,h);[[16,16],[48,40],[20,52],[52,10]].forEach(([x,y],i)=>{for(let p=0;p<5;p++){const a=p/5*TAU;dot(g,x+Math.cos(a)*5,y+Math.sin(a)*5,4.2,cols[i%cols.length]);}dot(g,x,y,3,'#ffd23a');});};
  const stripes=(a,b,n)=>(g,w,h)=>{for(let i=0;i<n;i++){g.fillStyle=i%2?b:a;g.fillRect(0,i*h/n,w,h/n+1);}};
  const D={
    flors:()=>T(64,64,flowers('#fff6f0',['#ff7fae','#7fb6ff','#c98aff']),4,1.2),
    cotxes:()=>T(64,64,(g,w,h)=>{g.fillStyle='#bfe3ff';g.fillRect(0,0,w,h);[[8,14,'#e23b3b'],[36,42,'#f2b63a']].forEach(([x,y,c])=>{g.fillStyle=c;g.fillRect(x,y,22,8);g.fillRect(x+5,y-6,12,7);dot(g,x+5,y+9,3.5,'#333');dot(g,x+17,y+9,3.5,'#333');});},4,1.2),
    pops:()=>T(64,64,(g,w,h)=>{g.fillStyle='#ffe08a';g.fillRect(0,0,w,h);[[18,22],[46,48]].forEach(([x,y])=>{dot(g,x,y,8,'#ff7fae');g.strokeStyle='#ff7fae';g.lineWidth=3;for(let k=0;k<4;k++){g.beginPath();g.moveTo(x-6+k*4,y+5);g.quadraticCurveTo(x-9+k*5,y+14,x-4+k*4,y+16);g.stroke();}dot(g,x-3,y-1,1.6,'#333');dot(g,x+3,y-1,1.6,'#333');});},4,1.2),
    // estelada: barres vermelles sobre groc i, a davant (centre de la textura), el triangle vermell amb l'estrella
    estelada:()=>{const t=T(256,64,(g,w,h)=>{for(let i=0;i<9;i++){g.fillStyle=i%2?'#d8262e':'#f6cf2a';g.fillRect(0,i*h/9,w,h/9+1);}
      g.fillStyle='#d8262e';g.beginPath();g.moveTo(104,6);g.lineTo(104,58);g.lineTo(138,32);g.closePath();g.fill();starP(g,115,32,8,'#f6cf2a');});t.offset.x=0.5;return t;},
    dessuadora:()=>T(32,32,(g,w,h)=>{g.fillStyle='#5fb8a8';g.fillRect(0,0,w,h);}),
    texans:()=>T(64,64,(g,w,h)=>{g.fillStyle='#4a6fa5';g.fillRect(0,0,w,h);g.strokeStyle='rgba(255,255,255,.18)';for(let i=0;i<64;i+=4){g.beginPath();g.moveTo(i,0);g.lineTo(i+8,h);g.stroke();}g.strokeStyle='#e0b060';g.setLineDash([3,3]);g.beginPath();g.moveTo(31,0);g.lineTo(31,h);g.stroke();},2,2),
    curts:()=>T(16,64,stripes('#2f3f78','#f3efe6',8),1,1),
    fflors:()=>T(64,64,flowers('#ffb6d0',['#fff','#ffe36a','#c98aff']),5,1),
    volants:()=>T(16,64,stripes('#ff9fc8','#ffd0e4',6),1,1),
    vpics:()=>T(64,64,(g,w,h)=>{g.fillStyle='#7ec8f0';g.fillRect(0,0,w,h);[[16,16],[48,16],[0,48],[32,48],[64,48]].forEach(([x,y])=>dot(g,x,y,7,'#fff'));},5,1.4),
    vnegre:()=>T(16,16,(g,w,h)=>{g.fillStyle='#2a2133';g.fillRect(0,0,w,h);}),
    vllunes:()=>T(64,64,(g,w,h)=>{g.fillStyle='#2c2f6e';g.fillRect(0,0,w,h);moon(g,18,18,8,'#ffe36a','#2c2f6e');starP(g,46,44,7,'#ffe36a');starP(g,50,12,4,'#fff');starP(g,14,50,4,'#fff');},5,1.4),
    cmorada:()=>T(16,16,(g,w,h)=>{g.fillStyle='#7a4fb0';g.fillRect(0,0,w,h);}),
    cnit:()=>T(64,64,(g,w,h)=>{g.fillStyle='#1f2a5c';g.fillRect(0,0,w,h);[[10,12,4],[40,8,3],[28,34,5],[54,50,3],[12,52,3],[50,28,2]].forEach(([x,y,r],i)=>starP(g,x,y,r,i%2?'#fff':'#ffe36a'));},3,2),
    mliles:()=>T(16,64,stripes('#c9a0ea','#fbf6ff',8),1,3),
    mverdes:()=>T(16,64,stripes('#3fae4a','#1c1c1c',8),1,3),
    ratlles:()=>T(16,32,stripes('#ffffff','#e23b3b',4),1,1),
    mpics:()=>T(32,32,(g,w,h)=>{g.fillStyle='#fff';g.fillRect(0,0,w,h);[[8,8,'#e23b3b'],[24,24,'#3f6fe0'],[24,8,'#4fbf5a'],[8,24,'#f2b63a']].forEach(([x,y,c])=>dot(g,x,y,4,c));},3,1),
    marc:()=>T(8,64,(g,w,h)=>RAINBOW.forEach((c,i)=>{g.fillStyle=c;g.fillRect(0,i*h/6,w,h/6+1);}),1,1),
    arc:()=>T(8,64,(g,w,h)=>RAINBOW.forEach((c,i)=>{g.fillStyle=c;g.fillRect(0,i*h/6,w,h/6+1);}),1,1),
    vambes:()=>T(32,32,(g,w,h)=>{for(let i=0;i<4;i++)for(let j=0;j<4;j++){g.fillStyle=(i+j)%2?'#fff':'#1e1e24';g.fillRect(i*8,j*8,8,8);}},2,2),
    spics:()=>T(32,32,(g,w,h)=>{g.fillStyle='#3f6fe0';g.fillRect(0,0,w,h);dot(g,8,8,4,'#fff');dot(g,24,24,4,'#fff');},2,2),
    crocs:()=>T(32,32,(g,w,h)=>{g.fillStyle='#7ad04a';g.fillRect(0,0,w,h);dot(g,8,8,3,'#4f9a2e');dot(g,24,24,3,'#4f9a2e');dot(g,24,8,3,'#4f9a2e');dot(g,8,24,3,'#4f9a2e');},2,2),
  };
  return PCT[id]=D[id]?D[id]():null;}
const pcMat=(c,o)=>LM(c,o);
const texMat=(id,o)=>LM('#ffffff',Object.assign({map:pcTex(id)},o||{}));

/* ---------- classificar les peces del ninot ---------- */
function pcParts(rig){
  const P={};const add=(k,m)=>(P[k]=P[k]||[]).push(m);
  const armOf=new Map();[rig.armL,rig.armR].forEach(a=>{armOf.set(a.sh,'sh');armOf.set(a.el,'el');a.hd.traverse(o=>armOf.set(o,'hd'));});
  const legOf=new Map();[rig.legL,rig.legR].forEach(l=>{legOf.set(l.hip,'hip');legOf.set(l.knee,'knee');legOf.set(l.foot,'foot');});
  rig.root.traverse(o=>{if(!o.isMesh)return;const c=o.material.color?o.material.color.getHexString():'',par=o.parent,map=!!o.material.map;
    let inPack=false;for(let q=o;q;q=q.parent)if(q===rig.pack)inPack=true;
    if(inPack||['6f6e3c','807e48','5c5a30'].includes(c))return add('pack',o);
    if(c==='3a2628'){return add(o.scale.y<0.02&&par===rig.head?'brow':'hair',o);}
    if(c==='b9764e'){const k=armOf.get(par)||legOf.get(par);return add(k==='sh'?'uarm':k==='el'?'farm':k==='knee'?'shin':k==='foot'?'ankle':'skin',o);}
    if(c==='a5633f')return add('skinD',o);
    if(c==='333a55'){const k=legOf.get(par);return add(par===rig.pelvis?'hips':k==='hip'?'thigh':'knee',o);}
    if(c==='34303f')return add('shoe',o);if(c==='b79aa6')return add('sole',o);
    if(c==='e8506a')return add('bib',o);if(c==='6b2234')return add('bow',o);
    if(map){if(par===rig.skirt)return add('skirt',o);if(armOf.get(par)==='sh')return add('sleeve',o);if(armOf.get(par)==='el')return add('brace',o);
      if(par===rig.chest)return add(o.position.y<0.12?'torso':'shirt',o);}
    add('other',o);});
  return P;}

/* ---------- peces que s'afegeixen ---------- */
const hz=(x,y)=>0.195*Math.sqrt(Math.max(0,1-(x/0.215)**2-(y/0.2)**2));       // superfície aproximada de la cara
function starShape(r1,r2,inner){const s=new THREE.Shape();for(let i=0;i<10;i++){const a=i/10*TAU+PI/2,r=i%2?r2:r1;i?s.lineTo(Math.cos(a)*r,Math.sin(a)*r):s.moveTo(Math.cos(a)*r,Math.sin(a)*r);}
  if(inner){const h=new THREE.Path();for(let i=0;i<10;i++){const a=i/10*TAU+PI/2,r=(i%2?r2:r1)*inner;i?h.lineTo(Math.cos(a)*r,Math.sin(a)*r):h.moveTo(Math.cos(a)*r,Math.sin(a)*r);}s.holes.push(h);}return s;}
function pcHair(head,style,hm){const g=new THREE.Group();head.add(g);
  const sp=(x,y,z,sx,sy,sz,rx,ry,rz)=>{const m=mk(SPH(1,14,10),hm,x,y,z,g);m.scale.set(sx,sy,sz);m.rotation.set(rx||0,ry||0,rz||0);return m;};
  // casquet de dalt i peça del clatell (perquè el darrere del cap no quedi pelat)
  // casquet de dalt + «casc» que cobreix els costats i el darrere del cap fins sota les orelles (deixa la cara lliure),
  // perquè la pell del cap no surti per sobre dels cabells
  const cap=(k)=>{k=k||1;mk(new THREE.SphereGeometry(1,26,14,0,TAU,0,1.25),hm,0,0.022,-0.014,g).scale.set(0.236*k,0.218*k,0.226*k);
    const sh=mk(new THREE.SphereGeometry(1,28,16,PI/2+1.0,TAU-2.0,0,2.05),hm,0,0.01,-0.012,g);const kk=Math.max(k,1);sh.scale.set(0.232*kk,0.222*kk,0.228*kk);
    sp(0,-0.03,-0.08,0.214*k,0.175*k,0.15*k);};
  const fringe=()=>[1,-1].forEach(s=>sp(s*0.124,0.128,0.094,0.122,0.046,0.06,0.25,s*0.55,-s*0.62));
  const sides=(h)=>[1,-1].forEach(s=>sp(s*0.203,0.03-h*0.4,-0.005,0.045,h,0.1,0,0,-s*0.1));
  switch(style){
    case 'curt_llis':cap();fringe();sides(0.09);break;
    case 'curt_arrissat':cap(0.98);for(let i=0;i<34;i++){const a=i*2.4,e=0.15+((i*0.37)%1)*1.25;const x=Math.sin(a)*Math.cos(e)*0.225,y=Math.sin(e)*0.21+0.02,z=Math.cos(a)*Math.cos(e)*0.22-0.015;
      if(z>0.08&&y<0.12)continue;const r=0.055+0.012*Math.sin(i);sp(x,y,z,r,r,r);}break;
    case 'rapat':cap(0.97);sp(0,0.13,0.15,0.17,0.04,0.06,0.3);break;
    case 'melena':cap();fringe();[1,-1].forEach(s=>sp(s*0.19,-0.07,-0.01,0.07,0.17,0.15));sp(0,-0.06,-0.1,0.22,0.18,0.14);break;
    case 'llarg_llis':cap();fringe();sp(0,-0.22,-0.12,0.22,0.33,0.1);[1,-1].forEach(s=>sp(s*0.19,-0.18,0.0,0.055,0.3,0.08));break;
    case 'llarg_ondulat':cap();fringe();for(let i=0;i<6;i++)[1,-1].forEach(s=>sp(s*(0.09+(i%2)*0.03),-0.04-i*0.075,-0.13,0.12,0.07,0.09));[1,-1].forEach(s=>{for(let i=0;i<4;i++)sp(s*(0.19+(i%2)*0.02),-0.03-i*0.08,0.0,0.06,0.06,0.07);});break;
    case 'cua':cap();fringe();sides(0.06);mk(new THREE.TorusGeometry(0.035,0.012,6,12),pcMat('#e8506a'),0,0.06,-0.22,g);sp(0,0.04,-0.24,0.05,0.05,0.05);sp(0,-0.14,-0.27,0.065,0.2,0.065,0.25);break;
    case 'trenes':cap();[1,-1].forEach(s=>{sp(s*0.07,0.15,0.13,0.1,0.04,0.05,0.25,s*0.3,-s*0.3);for(let i=0;i<6;i++){const r=0.048-i*0.003;sp(s*(0.17+i*0.004),-0.06-i*0.065,0.02+i*0.006,r,r*1.15,r);}
      mk(new THREE.TorusGeometry(0.026,0.01,6,10),pcMat('#e8506a'),s*0.19,-0.47,0.06,g).rotation.x=PI/2;});break;
    case 'monyos':cap();fringe();sides(0.07);[1,-1].forEach(s=>sp(s*0.14,0.2,-0.05,0.095,0.09,0.095));break;
    case 'afro':sp(0,0.06,-0.1,0.32,0.3,0.27);break;}
  return g;}
// el barret de la bruixa del joc, amb un detall
function pcWitchHat(kind){
  if(kind==='btort'){const g=new THREE.Group(),c=pcMat('#5a4a3e'),pt=['#c8a060','#7aa06a','#d06a6a'];mk(new THREE.CylinderGeometry(0.37,0.38,0.025,24),c,0,0,0,g);
    mk(new THREE.CylinderGeometry(0.15,0.2,0.24,16),c,0,0.13,0,g);const up=mk(new THREE.ConeGeometry(0.15,0.36,16),c,0.08,0.38,0,g);up.rotation.z=-0.75;
    [[0.12,0.12,0.17,0],[-0.12,0.16,0.14,1],[0.15,0.36,0.06,2]].forEach(([x,y,z,i])=>{const p=mk(new THREE.BoxGeometry(0.07,0.06,0.01),pcMat(pt[i]),x,y,z,g);p.lookAt(x*3,y,z*3);});return g;}
  const g=mkHat();
  if(kind==='bestrella'){const s=mk(new THREE.ExtrudeGeometry(starShape(0.05,0.022),{depth:0.01,bevelEnabled:false}),new THREE.MeshBasicMaterial({color:'#ffe36a'}),0,0.06,0.205,g);}
  if(kind==='blluna'){const m=mk(new THREE.TorusGeometry(0.035,0.011,6,16,PI*1.3),new THREE.MeshBasicMaterial({color:'#ffe36a'}),0,0.07,0.21,g);m.rotation.z=-0.6;}
  return g;}

function applyLook(rig,look){
  const P=pcParts(rig),L=look,S=L.sl||{},set=(k,mat)=>(P[k]||[]).forEach(m=>{m.material=mat;}),hide=k=>(P[k]||[]).forEach(m=>{m.visible=false;});
  const skin=(PC_PELL.find(p=>p[0]===L.pell)||PC_PELL[3])[2],sk=pcMat(skin),skD=pcMat('#'+new THREE.Color(skin).multiplyScalar(0.86).getHexString());
  rig.root.traverse(o=>{if(o.isMesh&&o.material.color&&(o.material.color.getHexString()==='b9764e'))o.material=sk;});
  set('skinD',skD);['skin','uarm','farm','shin','ankle'].forEach(k=>set(k,sk));
  ['hair','pack','bow','bib','brace'].forEach(hide);
  // base: samarreta interior blanca i calçotets blancs; sense pantalons es veuen les cames
  const under=pcMat('#f4f1ea');set('torso',under);set('shirt',under);set('sleeve',sk);set('hips',under);set('thigh',sk);set('knee',sk);hide('skirt');
  rig.skirt.scale.set(1,1,1);
  const dalt=S.sencer?null:S.dalt,baix=S.sencer?null:S.baix;
  if(dalt){const m=texMat(dalt);set('torso',m);set('shirt',m);set('sleeve',m);
    if(dalt==='dessuadora'){set('uarm',m);const hood=mk(new THREE.SphereGeometry(1,16,10,0,TAU,0,1.6),texMat('dessuadora',{side:THREE.DoubleSide}),0,0.24,-0.09,rig.chest);hood.scale.set(0.15,0.11,0.1);hood.rotation.x=-1.9;
      const pk=mk(new THREE.BoxGeometry(0.12,0.05,0.01),pcMat('#4fa898'),0,0.05,0.098,rig.chest);}}
  if(baix==='texans'||baix==='curts'){const m=texMat(baix);set('hips',m);set('thigh',m);if(baix==='texans'){set('knee',m);set('shin',m);}}
  if(baix==='fflors'||baix==='volants'){const m=texMat(baix,{side:THREE.DoubleSide});(P.skirt||[]).forEach(o=>{o.visible=true;o.material=m;});
    if(baix==='volants'){const r=mk(new THREE.TorusGeometry(0.205,0.022,6,28),pcMat('#ffd0e4'),0,-0.29,0,rig.skirt);r.rotation.x=PI/2;}}
  if(S.sencer==='vpics'){const m=texMat('vpics',{side:THREE.DoubleSide});set('torso',m);set('shirt',m);(P.skirt||[]).forEach(o=>{o.visible=true;o.material=m;});}
  // bruixa: vestit (per sobre de la roba, llarg i de màniga llarga)
  if(S.vestit){const m=texMat(S.vestit,{side:THREE.DoubleSide});['torso','shirt','sleeve','uarm','farm'].forEach(k=>set(k,m));(P.skirt||[]).forEach(o=>{o.visible=true;o.material=m;});rig.skirt.scale.set(1.08,1.55,1.08);}
  // cames: mitges (bruixa) o mitjons
  const legSkin=k=>(P[k]||[]).filter(o=>o.material===sk);
  const mj=S.mitjons;
  if(mj==='mliles'||mj==='mverdes'){const m=texMat(mj);['thigh','knee','shin','ankle'].forEach(k=>legSkin(k).forEach(o=>o.material=m));if(!baix&&!S.sencer)set('hips',m);}
  else if(mj){[rig.legL,rig.legR].forEach((lg,i)=>{let m;const C=PC_MITJONS.find(x=>x[0]===mj);
      if(mj==='desap')m=pcMat(i?'#3f6fe0':'#f2b63a');else if(C&&C[2])m=pcMat(C[2]);else m=texMat(mj==='ratlles'?'ratlles':mj==='mpics'?'mpics':'marc');
      const s=mk(new THREE.CylinderGeometry(0.046,0.044,0.07,12),m,0,-0.19,0,lg.knee);
      lg.foot.children.filter(o=>o.isMesh&&o.material===sk).forEach(o=>o.material=m);});}
  // sabates
  const sb=S.sabates;
  if(!sb){set('shoe',sk);set('sole',skD);}
  else{const SH={vambes:[texMat('vambes'),pcMat('#f4f2ea')],pallasso:[pcMat('#e23b3b'),pcMat('#f2d23a')],talo:[pcMat('#d23a6a'),pcMat('#8a1f3e')],spics:[texMat('spics'),pcMat('#f4f2ea')],
      negres:[pcMat('#222026'),pcMat('#3a3640')],ballarina:[pcMat('#ffb6d0'),pcMat('#f08aac')],sardana:[pcMat('#f6f2e6'),pcMat('#c9a46a')],espardenyes:[pcMat('#e8d6b0'),pcMat('#a8865a')],
      avarques:[pcMat('#8a5a3a'),pcMat('#5a4030')],crocs:[texMat('crocs'),pcMat('#5aa83a')]}[sb];
    set('shoe',SH[0]);set('sole',SH[1]);
    [rig.legL,rig.legR].forEach(lg=>{const sh=(P.shoe||[]).find(o=>o.parent===lg.foot),so=(P.sole||[]).find(o=>o.parent===lg.foot);
      if(sb==='pallasso'){[sh,so].forEach(o=>{o.scale.set(1.25,1.1,1.55);o.position.z=0.07;});}
      if(sb==='crocs'){[sh,so].forEach(o=>o.scale.set(1.18,1.15,1.08));mk(new THREE.TorusGeometry(0.05,0.008,5,12,PI),SH[1],0,0.0,-0.03,lg.foot).rotation.y=PI/2;}
      if(sb==='ballarina'){sh.scale.y=0.72;mk(SPH(0.016,8,6),pcMat('#ff7fae'),0,0.012,0.13,lg.foot);}
      if(sb==='talo')mk(new THREE.BoxGeometry(0.035,0.05,0.035),SH[1],0,-0.07,-0.04,lg.foot);
      if(sb==='espardenyes')so.scale.y=1.7;
      if(sb==='sardana'||sb==='avarques'){const rb=pcMat(sb==='sardana'?'#1e1e24':'#5a4030');for(let i=0;i<(sb==='sardana'?3:1);i++){const t=mk(new THREE.TorusGeometry(0.046,0.006,5,16),rb,0,-0.205+i*0.035,0,lg.knee);t.rotation.set(PI/2+(i%2?0.3:-0.3),0,0);}}});}
  // capa
  if(S.capa){const m=texMat(S.capa,{side:THREE.DoubleSide});const c=mk(new THREE.CylinderGeometry(0.13,0.3,0.66,20,1,true,PI*0.55,PI*0.9),m,0,-0.12,-0.02,rig.chest);
    mk(new THREE.TorusGeometry(0.08,0.02,6,16),m,0,0.22,0,rig.chest).rotation.x=PI/2;mk(SPH(0.018,8,6),pcMat('#ffd23a'),0,0.22,0.08,rig.chest);}
  // davantal amb pots
  if(S.davantal){const m=pcMat('#f2e6cc',{side:THREE.DoubleSide});const top=mk(new THREE.PlaneGeometry(0.13,0.12),m,0,0.07,0.1,rig.chest);
    const low=mk(new THREE.PlaneGeometry(0.26,0.26),m,0,-0.06,0.2,rig.pelvis);low.rotation.x=-0.28;
    ['#e23b3b','#4fbf5a','#3f6fe0'].forEach((cl,i)=>{const b=mk(SPH(0.018,8,6),pcMat(cl,{emissive:cl,emissiveIntensity:0.3}),-0.06+i*0.06,-0.04,0.21,rig.pelvis);b.scale.y=1.3;});}
  // cabell
  const hm=L.cabell==='arc'?LM('#ffffff',{map:pcTex('arc'),side:THREE.DoubleSide}):LM((PC_CABELL.find(c=>c[0]===L.cabell)||PC_CABELL[1])[2],{side:THREE.DoubleSide});
  pcHair(rig.head,L.pentinat||'melena',hm);set('brow',L.cabell==='arc'?pcMat('#a45fd0'):hm);
  const lift=L.pentinat==='afro'?0.1:L.pentinat==='monyos'?0.06:0;
  // cap: barrets de bruixa o complements de cap (només un)
  const H=rig.head,cp=S.cap;
  if(cp==='bestrella'||cp==='blluna'||cp==='btort'){const h=pcWitchHat(cp);h.position.set(0,0.2+lift,-0.01);h.rotation.set(-0.08,0,0.1);H.add(h);}
  if(cp==='dflors'||cp==='dgat'){const b=mk(new THREE.TorusGeometry(0.222,0.012,6,24,PI),pcMat(cp==='dgat'?'#2a2430':'#7ac05a'),0,0.03+lift*0.5,0.0,H);b.rotation.x=-0.35;
    if(cp==='dflors')[-1.1,-0.55,0,0.55,1.1].forEach((a,i)=>{const x=Math.sin(a)*0.222,y=0.03+Math.cos(a)*0.222*0.94+lift*0.5,z=-Math.cos(a)*0.222*0.34;const col=['#ff7fae','#ffe36a','#c98aff','#7fb6ff','#ff9a4a'][i];
      for(let p=0;p<5;p++){const q=p/5*TAU;mk(SPH(0.016,8,6),pcMat(col),x+Math.cos(q)*0.02,y+Math.sin(q)*0.02,z+0.01,H);}mk(SPH(0.012,8,6),pcMat('#ffd23a'),x,y,z+0.02,H);});
    else[1,-1].forEach(s=>{const e=mk(new THREE.ConeGeometry(0.055,0.11,4),pcMat('#2a2430'),s*0.12,0.24+lift,-0.03,H);e.rotation.z=-s*0.35;const e2=mk(new THREE.ConeGeometry(0.03,0.07,4),pcMat('#ff9fc8'),s*0.118,0.235+lift,-0.0,H);e2.rotation.z=-s*0.35;});}
  if(cp==='gorro'){const g=mk(new THREE.SphereGeometry(1,20,10,0,TAU,0,PI/2),pcMat('#e04050'),0,0.05+lift,-0.01,H);g.scale.set(0.245,0.25,0.24);
    mk(new THREE.TorusGeometry(0.235,0.03,6,24),pcMat('#f4f1ea'),0,0.06+lift,-0.01,H).rotation.x=PI/2;mk(SPH(0.06,10,8),pcMat('#f4f1ea'),0,0.31+lift,-0.01,H);}
  if(cp==='plomes'){const g=new THREE.Group();g.position.set(0,0.17+lift,-0.01);g.rotation.set(-0.08,0,-0.08);H.add(g);const c=pcMat('#3a7a6a');
    mk(new THREE.CylinderGeometry(0.31,0.31,0.02,24),c,0,0,0,g);mk(new THREE.CylinderGeometry(0.17,0.19,0.14,20),c,0,0.07,0,g);mk(new THREE.CylinderGeometry(0.192,0.192,0.03,20),pcMat('#e8b04a'),0,0.02,0,g);
    ['#e23b3b','#ffd23a','#3f8fe0'].forEach((col,i)=>{const f=mk(SPH(1,10,8),pcMat(col),0.18,0.12+i*0.02,-0.02-i*0.03,g);f.scale.set(0.02,0.12,0.04);f.rotation.z=-0.5-i*0.2;});}
  // ulleres
  if(S.ulleres==='urodones'){const m=pcMat('#3a2a2a');[1,-1].forEach(s=>{mk(new THREE.TorusGeometry(0.05,0.007,6,20),m,s*0.088,-0.004,hz(0.088,0)+0.025,H);const t=mk(new THREE.CylinderGeometry(0.005,0.005,0.17,5),m,s*0.17,0.0,0.1,H);t.rotation.x=PI/2;});
    const br=mk(new THREE.CylinderGeometry(0.005,0.005,0.08,5),m,0,0.004,hz(0,0)+0.02,H);br.rotation.z=PI/2;}
  if(S.ulleres==='uestrella'){const m=new THREE.MeshBasicMaterial({color:'#ff6fb0',side:THREE.DoubleSide});const g=new THREE.ShapeGeometry(starShape(0.075,0.04,0.7));
    [1,-1].forEach(s=>mk(g,m,s*0.088,-0.004,hz(0.088,0)+0.028,H));const br=mk(new THREE.CylinderGeometry(0.006,0.006,0.06,5),m,0,0.0,hz(0,0)+0.022,H);br.rotation.z=PI/2;}
  if(S.arrac)[1,-1].forEach(s=>{const a=mk(new THREE.TorusGeometry(0.024,0.007,6,14,PI*1.3),pcMat('#f2c43a',{emissive:'#a07010',emissiveIntensity:0.3}),s*0.218,-0.085,0.0,H);a.rotation.set(0,s*PI/2,-0.4);});
  if(S.cara){const cols=['#e23b3b','#3f8fe0','#f2c43a'];[1,-1].forEach(s=>[0,1].forEach(i=>{const x=s*(0.11+i*0.03),y=-0.055-i*0.012;const m=mk(SPH(1,8,6),pcMat(cols[i]),x,y,hz(x,y)+0.004,H);m.scale.set(0.028,0.008,0.004);m.rotation.set(0,s*0.6,s*0.2);}));
    const f=mk(SPH(1,8,6),pcMat(cols[2]),0,0.11,hz(0,0.11)+0.004,H);f.scale.set(0.008,0.03,0.004);}
  // polseres
  if(S.polsc)[rig.armL,rig.armR].forEach(a=>{const b=mk(new THREE.TorusGeometry(0.036,0.011,6,16),LM('#fff',{map:pcTex('marc')}),0,-FA+0.015,0,a.el);b.rotation.x=PI/2;});
  if(S.polsb){const el=rig.armL.el,g=pcMat('#e8b83a',{emissive:'#8a6010',emissiveIntensity:0.3});const b=mk(new THREE.TorusGeometry(0.037,0.008,6,16),g,0,-FA+0.02,0,el);b.rotation.x=PI/2;
    for(let i=0;i<5;i++){const a=i/5*TAU;mk(SPH(0.012,8,6),g,Math.sin(a)*0.045,-FA+0.008,Math.cos(a)*0.045,el);}}
  rig.root.traverse(o=>{if(o.isMesh&&o.visible)o.castShadow=true;});
  rig.look=JSON.parse(JSON.stringify(look));
  return rig;}
function buildDoll(look){const r=buildBruna();applyLook(r,look);return r;}
function disposeDoll(r){if(!r)return;r.root.traverse(o=>{if(o.isMesh){o.geometry.dispose();}});if(r.root.parent)r.root.parent.remove(r.root);}
Object.assign(window.__j,{applyLook,buildDoll,PC_DEFAULT});
