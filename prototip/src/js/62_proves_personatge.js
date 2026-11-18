/* =====================================================================
   ZONA DE PROVES · «CREA EL TEU PERSONATGE» (encàrrec pas 3)
   Pantalla amb pestanyes (Nom · Pell · Pentinat · Cabell · Roba · Bruixa · Complements · Sabates · Mitjons),
   fitxes amb una miniatura 3D de cada peça, vista prèvia 3D que es pot girar, «Aleatori» i «Fet!».
   «Fet!» obre una partida de prova al clar de l'estany amb el personatge (no es desa ni toca la partida de «Juga»).
   El personatge es guarda al dispositiu (localStorage 'bruna-personatge-v1').
   Obrir-la directament: ?prova=personatge
   ===================================================================== */
const PCR={open:false,look:null,tab:'nom',doll:null,rot:0.35,drag:null,thumbs:{},game:null,raf:0};
const PC_KEY='bruna-personatge-v1';
const PC_TABS=[['nom','Nom'],['pell','Pell'],['pentinat','Pentinat'],['cabell','Cabell'],['roba','Roba'],['bruixa','Bruixa'],['compl','Complements'],['sabates','Sabates'],['mitjons','Mitjons']];
// fitxes de cada pestanya: [id, nom, slot o tipus]
function pcItems(tab){switch(tab){
  case 'pell':return PC_PELL.map(p=>({id:p[0],nom:p[1],key:'pell',color:p[2]}));
  case 'pentinat':return PC_PENTINAT.map(p=>({id:p[0],nom:p[1],key:'pentinat'}));
  case 'cabell':return PC_CABELL.map(p=>({id:p[0],nom:p[1],key:'cabell',color:p[2]}));
  case 'roba':return PC_ROBA.map(p=>({id:p[0],nom:p[1],slot:p[2]}));
  case 'bruixa':return PC_BRUIXA.map(p=>({id:p[0],nom:p[1],slot:p[2]}));
  case 'compl':return PC_COMPL.map(p=>({id:p[0],nom:p[1],slot:p[2]}));
  case 'sabates':return PC_SABATES.map(p=>({id:p[0],nom:p[1],slot:'sabates'}));
  case 'mitjons':return PC_MITJONS.map(p=>({id:p[0],nom:p[1],slot:'mitjons',color:p[2]}));}return [];}
const pcSel=(it,L)=>it.key?L[it.key]===it.id:(L.sl[it.slot]===it.id);
// triar una peça segons les normes de l'encàrrec
function pcPick(it){const L=PCR.look;
  if(it.key){L[it.key]=it.id;return;}
  const s=it.slot;if(L.sl[s]===it.id){delete L.sl[s];return;}          // tornar a tocar la peça la treu
  L.sl[s]=it.id;
  if(s==='sencer'){delete L.sl.dalt;delete L.sl.baix;}               // la peça sencera substitueix dalt i baix
  if(s==='dalt'||s==='baix')delete L.sl.sencer;}
// personatge a l'atzar
function pcRandom(){const p=a=>a[Math.floor(Math.random()*a.length)],ch=k=>Math.random()<k;
  const L={nom:PCR.look?PCR.look.nom:'',pell:p(PC_PELL)[0],pentinat:p(PC_PENTINAT)[0],cabell:p(PC_CABELL)[0],sl:{}};
  const R=(list,slot)=>p(list.filter(x=>x[2]===slot))[0];
  if(ch(0.25))L.sl.sencer='vpics';else{L.sl.dalt=R(PC_ROBA,'dalt');if(ch(0.9))L.sl.baix=R(PC_ROBA,'baix');}
  ['cap','vestit','capa'].forEach(s=>{if(ch(0.28)){const o=PC_BRUIXA.filter(x=>x[2]===s);if(o.length)L.sl[s]=p(o)[0];}});if(ch(0.2))L.sl.davantal='davantal';
  ['polsc','polsb','ulleres','arrac','cara'].forEach(s=>{if(ch(0.25))L.sl[s]=p(PC_COMPL.filter(x=>x[2]===s))[0];});
  if(!L.sl.cap&&ch(0.25))L.sl.cap=p(PC_COMPL.filter(x=>x[2]==='cap'))[0];
  if(ch(0.92))L.sl.sabates=p(PC_SABATES)[0];
  if(ch(0.2))L.sl.mitjons=p(PC_BRUIXA.filter(x=>x[2]==='mitjons'))[0];else if(ch(0.75))L.sl.mitjons=p(PC_MITJONS)[0];
  return L;}
function pcLoad(){try{const s=JSON.parse(localStorage.getItem(PC_KEY)||'null');if(s&&s.sl)return s;}catch(e){}return JSON.parse(JSON.stringify(PC_DEFAULT));}
function pcSave(){try{localStorage.setItem(PC_KEY,JSON.stringify(PCR.look));}catch(e){}}

/* ---------- escena 3D de la vista prèvia (i de les miniatures) ---------- */
const PCS=new THREE.Scene();
{PCS.add(new THREE.HemisphereLight('#f6eeff','#8a7a9a',0.72));const d=new THREE.DirectionalLight('#fff2e6',0.45);d.position.set(1.5,3,3);PCS.add(d);
 const f=new THREE.DirectionalLight('#d8c8ff',0.2);f.position.set(-2,1,-2);PCS.add(f);
 const fl=mk(new THREE.CircleGeometry(0.62,32),pcMat('#c4b4ec'),0,0,0,PCS);fl.rotation.x=-PI/2;}
const pcCam=new THREE.PerspectiveCamera(30,1,0.05,30);
function pcPose(r){solveLeg(r.legL,HIPW,STAND,0,0.1,AH,0.02,0);solveLeg(r.legR,-HIPW,STAND,0,-0.1,AH,0.02,0);r.pelvis.position.y=STAND;
  r.armL.sh.rotation.z=0.16;r.armR.sh.rotation.z=-0.16;r.armL.el.rotation.x=-0.15;r.armR.el.rotation.x=-0.15;}
function pcRebuild(){disposeDoll(PCR.doll);PCR.doll=buildDoll(PCR.look);pcPose(PCR.doll);PCS.add(PCR.doll.root);}
let pcR=null,pcTR=null;
function pcRenderer(){if(pcR)return;const cv=$('pcview');pcR=new THREE.WebGLRenderer({canvas:cv,antialias:true,alpha:true});pcR.setPixelRatio(Math.min(devicePixelRatio,2));}
// miniatura de cada fitxa: el ninot base amb només aquella peça, enquadrat segons el tipus
const PC_FRAME={pentinat:[0,0.98,0,1.15,1.25,0.12],dalt:[0,0.74,0,1.05,0.3,0.05],baix:[0,0.36,0,1.3,0.3,0.1],roba:[0,0.62,0,2.0,0.35,0.05],bruixa:[0,0.75,0,2.4,0.55,0.08],compl:[0,0.98,0,1.0,0.3,0.08],
  sabates:[0,0.06,0.04,0.7,0.6,0.5],mitjons:[0,0.17,0,0.8,0.5,0.3],cap:[0,1.22,0,1.3,0.35,0.12],cames:[0,0.32,0,1.4,0.4,0.15],cara:[0,1.02,0,0.72,0.15,0.05],braç:[0.19,0.47,0.02,0.62,0.95,0.15]};
function pcThumb(tab,it){
  const key=tab+':'+it.id;if(PCR.thumbs[key])return PCR.thumbs[key];
  if(!pcTR){pcTR=new THREE.WebGLRenderer({antialias:true,alpha:true,preserveDrawingBuffer:true});pcTR.setPixelRatio(1);pcTR.setSize(120,120);}
  const L={nom:'',pell:'migclar',pentinat:'curt_llis',cabell:'castany',sl:{}};
  if(it.key)L[it.key]=it.id;else{L.sl[it.slot]=it.id;}
  let fr=PC_FRAME[tab];
  if(tab==='roba')fr=it.slot==='baix'?PC_FRAME.baix:it.slot==='dalt'?PC_FRAME.dalt:PC_FRAME.roba;
  if(it.slot==='cap')fr=PC_FRAME.cap;else if(it.slot==='mitjons'&&tab==='bruixa')fr=PC_FRAME.cames;else if(['ulleres','arrac','cara'].includes(it.slot))fr=PC_FRAME.cara;else if(['polsc','polsb'].includes(it.slot))fr=PC_FRAME.braç;
  const was=PCR.doll&&PCR.doll.root.visible;if(PCR.doll)PCR.doll.root.visible=false;
  const r=buildDoll(L);pcPose(r);PCS.add(r.root);
  const [tx,ty,tz,d,yaw,el]=fr;pcCam.aspect=1;pcCam.updateProjectionMatrix();
  pcCam.position.set(tx+Math.sin(yaw)*Math.cos(el)*d,ty+Math.sin(el)*d,tz+Math.cos(yaw)*Math.cos(el)*d);pcCam.lookAt(tx,ty,tz);
  pcTR.render(PCS,pcCam);const url=pcTR.domElement.toDataURL('image/png');
  disposeDoll(r);if(PCR.doll)PCR.doll.root.visible=was;
  return PCR.thumbs[key]=url;}
function pcLoop(){if(!PCR.open)return;PCR.raf=requestAnimationFrame(pcLoop);
  const cv=$('pcview'),w=cv.clientWidth,h=cv.clientHeight;if(!w||!h)return;
  if(cv.width!==Math.round(w*pcR.getPixelRatio())||cv.height!==Math.round(h*pcR.getPixelRatio()))pcR.setSize(w,h,false);
  const t=performance.now()/1000,r=PCR.doll;
  if(r){if(!PCR.drag)PCR.rot+=0.004;r.root.rotation.y=PCR.rot;r.chest.scale.y=1+Math.sin(t*1.6)*0.01;r.eyes.forEach(e=>e.scale.y=(t%3.6)>3.48?0.12:1);
    r.head.rotation.y=Math.sin(t*0.6)*0.12;}
  pcCam.aspect=w/h;pcCam.fov=w/h<0.8?34:28;pcCam.updateProjectionMatrix();
  const d=w/h<0.8?3.15:3.0;pcCam.position.set(0,0.9,d);pcCam.lookAt(0,0.78,0);pcR.render(PCS,pcCam);}

/* ---------- interfície ---------- */
{const css=document.createElement('style');css.textContent=`
#pcre{position:fixed;inset:0;z-index:40;display:none;flex-direction:column;font-family:Fredoka,"Trebuchet MS",system-ui,sans-serif;color:#fff;background:linear-gradient(170deg,#7a5ab8,#c47ab4 60%,#f2a69c);padding:calc(env(safe-area-inset-top) + 8px) 10px calc(env(safe-area-inset-bottom) + 10px)}
#pcre.on{display:flex}
#pcre button{font-family:inherit;cursor:pointer;touch-action:manipulation;border:0}
#pcre .hd{display:flex;align-items:center;gap:10px;margin-bottom:6px}#pcre .hd h3{margin:0;font-size:20px;font-weight:700;flex:1;text-align:center;padding-right:68px}
#pcre .back{background:rgba(255,255,255,.2);color:#fff;font-weight:600;font-size:14px;padding:7px 14px;border-radius:999px}
#pcre .bd{flex:1;min-height:0;display:flex;flex-direction:column;gap:8px}
#pcre .view{position:relative;flex:0 0 40%;min-height:180px;border-radius:20px;background:radial-gradient(circle at 50% 40%,rgba(255,255,255,.35),rgba(255,255,255,.06));touch-action:none}
#pcview{width:100%;height:100%;display:block}
#pcre .nm{position:absolute;left:12px;right:0;bottom:8px;text-align:left!important;text-align:center;font-weight:700;font-size:20px;text-shadow:0 2px 6px rgba(60,20,80,.5);pointer-events:none}
#pcre .rot{position:absolute;right:10px;bottom:8px;font-size:11px;opacity:.8;pointer-events:none}
#pcre .panel{flex:1;min-height:0;display:flex;flex-direction:column;background:rgba(60,30,100,.35);border-radius:20px;padding:8px}
#pcre .tabs{display:flex;gap:6px;overflow-x:auto;padding-bottom:6px;flex:none;scrollbar-width:none}#pcre .tabs::-webkit-scrollbar{display:none}
#pcre .tabs button{flex:none;background:rgba(255,255,255,.16);color:#fff;font-weight:600;font-size:14px;padding:7px 13px;border-radius:999px}
#pcre .tabs button.on{background:#ffd75e;color:#5a2e10}
#pcre .grid{flex:1;min-height:0;overflow-y:auto;display:grid;grid-template-columns:repeat(auto-fill,minmax(88px,1fr));gap:8px;align-content:start;padding:2px}
#pcre .it{position:relative;display:flex;flex-direction:column;align-items:center;gap:3px;background:rgba(255,255,255,.14);border-radius:14px;padding:6px 4px 7px;color:#fff;font-size:11.5px;font-weight:600;line-height:1.15;text-align:center;border:2px solid transparent}
#pcre .it.on{background:rgba(255,255,255,.3);border-color:#ffd75e}
#pcre .it img,#pcre .it .sw{width:64px;height:64px;border-radius:12px;background:rgba(255,255,255,.25)}
#pcre .it .sw{border-radius:50%;box-shadow:inset 0 -4px 0 rgba(0,0,0,.12)}
#pcre .it .ok{position:absolute;top:4px;right:6px;color:#ffd75e;font-size:14px}
#pcre .nomf{grid-column:1/-1;display:flex;flex-direction:column;gap:8px;padding:10px 6px;font-size:15px}
#pcre .nomf input{font:600 18px Fredoka,system-ui;padding:12px 14px;border-radius:14px;border:0;outline:none;color:#4a2a6a}
#pcre .hint{grid-column:1/-1;font-size:12px;opacity:.85;padding:0 4px}
#pcre .ft{display:flex;gap:10px;justify-content:center;margin-top:8px;flex:none}
#pcre .rnd{background:rgba(255,255,255,.22);color:#fff;font-weight:700;font-size:18px;padding:10px 22px;border-radius:999px}
#pcre .ok2{background:linear-gradient(#ffd75e,#f7b12c);color:#5a2e10;font-weight:700;font-size:20px;padding:10px 36px;border-radius:999px;box-shadow:inset 0 2px 0 rgba(255,250,210,.7),0 4px 0 #c27a1c}
@media (min-aspect-ratio:1/1){#pcre .bd{flex-direction:row}#pcre .view{flex:0 0 42%}}
#pvback{position:fixed;left:calc(env(safe-area-inset-left) + 10px);top:calc(env(safe-area-inset-top) + 56px);z-index:25;background:rgba(90,60,160,.85);color:#fff;border:0;border-radius:999px;font:600 13px Fredoka,system-ui;padding:8px 14px;cursor:pointer}`;
 document.head.appendChild(css);}
const PC_HINT={roba:'Pots combinar una peça de dalt i una de baix, o un vestit sencer. Torna a tocar una peça per treure-la.',
  bruixa:'Els barrets substitueixen els gorros de Complements. Les mitges substitueixen els mitjons. Vestits i capes van per sobre de la roba.',
  compl:'Pots posar-ne diversos alhora, però només una cosa al cap.',sabates:'Torna a tocar-les per anar descalç.',mitjons:'Torna a tocar-los per treure\'ls.'};
function pcBuildUI(){if($('pcre'))return;const d=document.createElement('div');d.id='pcre';
  d.innerHTML=`<div class="hd"><button class="back" data-a="back">Tornar</button><h3>Crea el teu personatge</h3></div>
   <div class="bd"><div class="view"><canvas id="pcview"></canvas><div class="nm"></div><div class="rot">↻ arrossega per girar</div></div>
   <div class="panel"><div class="tabs">${PC_TABS.map(t=>`<button data-tab="${t[0]}">${t[1]}</button>`).join('')}</div><div class="grid"></div></div></div>
   <div class="ft"><button class="rnd" data-a="rnd">🎲 Aleatori</button><button class="ok2" data-a="ok">Fet!</button></div>`;
  document.body.appendChild(d);
  d.addEventListener('pointerdown',e=>e.stopPropagation());
  d.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;sfx('click');
    if(b.dataset.tab){PCR.tab=b.dataset.tab;pcRenderTab();return;}
    if(b.dataset.it){const it=pcItems(PCR.tab).find(x=>x.id===b.dataset.it);if(it){pcPick(it);pcChanged();}return;}
    if(b.dataset.a==='back')closeCreator();if(b.dataset.a==='rnd'){PCR.look=pcRandom();pcChanged();sfx('magic');}if(b.dataset.a==='ok')playTest();});
  const v=d.querySelector('.view');
  v.addEventListener('pointerdown',e=>{PCR.drag={x:e.clientX,r:PCR.rot};v.setPointerCapture(e.pointerId);});
  v.addEventListener('pointermove',e=>{if(PCR.drag)PCR.rot=PCR.drag.r+(e.clientX-PCR.drag.x)*0.012;});
  const up=()=>{PCR.drag=null;};v.addEventListener('pointerup',up);v.addEventListener('pointercancel',up);}
function pcRenderTab(){const d=$('pcre');d.querySelectorAll('.tabs button').forEach(b=>b.classList.toggle('on',b.dataset.tab===PCR.tab));
  const g=d.querySelector('.grid'),L=PCR.look;
  if(PCR.tab==='nom'){g.innerHTML=`<div class="nomf"><label for="pcnom">Com es diu el teu personatge?</label><input id="pcnom" maxlength="16" autocomplete="off" placeholder="Escriu un nom" value="${(L.nom||'').replace(/"/g,'&quot;')}"></div>`;
    $('pcnom').addEventListener('input',e=>{L.nom=e.target.value;pcSave();pcName();});return;}
  const items=pcItems(PCR.tab);
  g.innerHTML=(PC_HINT[PCR.tab]?`<div class="hint">${PC_HINT[PCR.tab]}</div>`:'')+items.map(it=>{const on=pcSel(it,L);
    const pic=it.color!==undefined&&it.color!==null?`<span class="sw" style="background:${it.color==='arc'?'linear-gradient('+RAINBOW.join(',')+')':it.color}"></span>`:`<img alt="" data-th="${it.id}">`;
    return `<button class="it${on?' on':''}" data-it="${it.id}">${on?'<span class="ok">✓</span>':''}${pic}<span>${it.nom}</span></button>`;}).join('');
  // les miniatures es fan una a una perquè la pantalla no es quedi aturada
  const tab=PCR.tab,imgs=[...g.querySelectorAll('img[data-th]')];let i=0;
  const next=()=>{if(PCR.tab!==tab||i>=imgs.length||!PCR.open)return;const im=imgs[i++],it=items.find(x=>x.id===im.dataset.th);im.src=pcThumb(tab,it);setTimeout(next,0);};next();}
function pcName(){const n=$('pcre').querySelector('.nm');n.textContent=PCR.look.nom||'';}
function pcChanged(){pcSave();pcRebuild();pcRenderTab();pcName();}
function openCreator(){pcBuildUI();PCR.look=pcLoad();PCR.open=true;$('pcre').classList.add('on');pcRenderer();pcRebuild();pcRenderTab();pcName();if(typeof provesView==='function')provesView('');pcLoop();}
function closeCreator(){PCR.open=false;cancelAnimationFrame(PCR.raf);$('pcre').classList.remove('on');if(TITLE.on)provesView('llista');}

/* ---------- «Fet!»: partida de prova al clar de l'estany ---------- */
// el personatge segueix l'esquelet de la Bruna del joc (que s'amaga): mateixos controls i mateixa animació
function playTest(){
  pcSave();PCR.open=false;cancelAnimationFrame(PCR.raf);$('pcre').classList.remove('on');
  PROVA.on=true;                                                  // no es desa res de la partida de «Juga»
  if(TITLE.on){TITLE.on=false;['tscreen','tver','tproves'].forEach(id=>{const e=$(id);if(e)e.remove();});}
  showTitleUI(false);camera.fov=38;camera.updateProjectionMatrix();
  $('chips').style.display='none';const tb=document.querySelector('#title b');if(tb)tb.textContent=PCR.look.nom||'El teu personatge';
  const sm=document.querySelector('#title small');if(sm&&sm.firstChild&&sm.firstChild.nodeType===3)sm.firstChild.textContent='Zona de proves · ';
  disposeDoll(PCR.game);PCR.game=buildDoll(PCR.look);scene.add(PCR.game.root);B.root.visible=false;
  teleport('Estanque');S.yaw=S.tyaw=PI;cam.yaw=0;
  if(!$('pvback')){const b=document.createElement('button');b.id='pvback';b.textContent='← Tornar al creador';document.body.appendChild(b);
    b.addEventListener('pointerdown',e=>e.stopPropagation());
    b.addEventListener('click',()=>{location.href=location.pathname+'?prova=personatge';});}
}
const _pairs=[];
function provaStep(){const g=PCR.game;if(!g)return;
  if(!_pairs.length){const P=(a,b)=>_pairs.push([a,b]);P(B.root,g.root);P(B.pelvis,g.pelvis);P(B.chest,g.chest);P(B.head,g.head);
    ['legL','legR'].forEach(k=>['hip','knee','foot'].forEach(j=>P(B[k][j],g[k][j])));['armL','armR'].forEach(k=>['sh','el','hd','fg'].forEach(j=>P(B[k][j],g[k][j])));
    B.eyes.forEach((e,i)=>P(e,g.eyes[i]));}
  for(const [a,b] of _pairs){b.position.copy(a.position);b.quaternion.copy(a.quaternion);b.scale.copy(a.scale);}
  g.skirt.rotation.copy(B.skirt.rotation);}
PROVA_OPEN.personatge=openCreator;
if(PLAY&&/[?&]prova=personatge/.test(location.search))setTimeout(openCreator,300);
Object.assign(window.__j,{PCR,openCreator,closeCreator,playTest,pcPick,pcRandom,pcItems});
