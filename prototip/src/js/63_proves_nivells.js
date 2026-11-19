/* =====================================================================
   ZONA DE PROVES · «PROVAR NIVELLS» (encàrrec pas 4; abans «Saltar nivells»)
   Pantalla amb un botó per nivell (Nivell 1 … Nivell 5): només s'activen els que existeixen al codi (ara, el 1).
   En triar-ne un, comença una partida de prova en aquell nivell (?prova=nivell1): de zero i sense desar res.
   Dins, el botó «Proves» obre un panell amb interruptors per activar o desactivar cada habilitat
   (conjurs, bolets, plantes, turbo, escombra, sabates, barret, vestit, gat) i per donar per fetes les pocions.
   Les habilitats canvien a l'instant; les pocions fetes tornen a començar la prova (amb els premis ja aconseguits).
   ===================================================================== */
const NIVELLS=[1,2,3,4,5].map(n=>({n,ok:n===1}));        // n'hi ha un sol al codi: el nivell 1 (les 5 pocions)
const NV_HAB=[['sol','Conjur «Sol»'],['lluvia','Conjur «Pluja»'],['llum','Conjur «Llum»'],['setas','Bolets saltadors'],['plantas','Plantes amables'],['turbo','Turbo (fruita)'],['escoba','Escombra (volar)']];
const NV_ROBA=[['barret','Barret'],['vestit','Vestit de bruixa'],['sabates','Sabates màgiques (doble salt)'],['gat','Gat']];
{const css=document.createElement('style');css.textContent=`
#pnv,#pnvp{position:fixed;z-index:40;font-family:Fredoka,"Trebuchet MS",system-ui,sans-serif;color:#fff}
#pnv{inset:0;display:none;align-items:center;justify-content:center;padding:20px;background:rgba(60,30,100,.55);backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px)}
#pnv.on{display:flex}
#pnv .card,#pnvp{background:linear-gradient(170deg,#8f6ad0,#6a4aa8);border:2px solid rgba(255,255,255,.4);box-shadow:0 8px 0 rgba(50,25,90,.6),0 18px 40px rgba(30,10,50,.45)}
#pnv .card{width:100%;max-width:360px;border-radius:24px;padding:22px 20px 18px;text-align:center}
#pnv h3,#pnvp h3{margin:0 0 6px;font-size:24px;font-weight:700}#pnv p{margin:0 0 14px;font-size:15px;line-height:1.35;opacity:.92}
#pnv button,#pnvp button{font-family:inherit;cursor:pointer;touch-action:manipulation;border:0}
#pnv .lv{display:grid;grid-template-columns:repeat(5,1fr);gap:8px;margin-bottom:16px}
#pnv .lv button{aspect-ratio:1;border-radius:16px;background:linear-gradient(#ffd75e,#f7b12c);color:#5a2e10;font-weight:700;font-size:26px;box-shadow:inset 0 2px 0 rgba(255,250,210,.7),0 4px 0 #c27a1c;display:flex;flex-direction:column;align-items:center;justify-content:center;line-height:1}
#pnv .lv button small{font-size:10px;font-weight:600;margin-top:3px}
#pnv .lv button:disabled{background:rgba(255,255,255,.16);color:rgba(255,255,255,.6);box-shadow:none;cursor:default}
#pnv .sub{display:flex;flex-direction:column;gap:8px;margin-bottom:16px}
#pnv .sub button{display:flex;align-items:center;gap:12px;text-align:left;border-radius:14px;padding:11px 14px;background:rgba(255,255,255,.16);color:#fff;font-size:16px;font-weight:600}
#pnv .sub button b{flex:none;background:linear-gradient(#ffd75e,#f7b12c);color:#5a2e10;border-radius:10px;padding:4px 8px;font-size:15px}
#pnv .back,#pnvp .back{background:rgba(255,255,255,.18);color:#fff;font-weight:600;font-size:15px;padding:9px 22px;border-radius:999px}
#pnvb{position:fixed;left:calc(env(safe-area-inset-left) + 10px);top:calc(env(safe-area-inset-top) + 56px);z-index:25;background:rgba(90,60,160,.9);color:#fff;border:2px solid rgba(255,255,255,.5);border-radius:999px;font:700 14px Fredoka,system-ui;padding:8px 16px;cursor:pointer}
#pnvp{left:calc(env(safe-area-inset-left) + 10px);top:calc(env(safe-area-inset-top) + 100px);bottom:calc(env(safe-area-inset-bottom) + 170px);width:min(330px,calc(100vw - 20px));border-radius:20px;padding:14px;display:none;flex-direction:column;gap:8px;overflow-y:auto}
#pnvp.on{display:flex}#pnvp h4{margin:6px 0 0;font-size:14px;opacity:.85;font-weight:600}#pnvp .sub{font-size:12px;opacity:.85;margin:0}
#pnvp label{display:flex;align-items:center;justify-content:space-between;gap:10px;background:rgba(255,255,255,.13);border-radius:12px;padding:8px 10px;font-size:14px;font-weight:600}
#pnvp input[type=checkbox]{appearance:none;-webkit-appearance:none;width:42px;height:24px;border-radius:999px;background:rgba(0,0,0,.25);position:relative;flex:none;cursor:pointer;transition:background .2s}
#pnvp input[type=checkbox]:after{content:'';position:absolute;left:3px;top:3px;width:18px;height:18px;border-radius:50%;background:#fff;transition:left .2s}
#pnvp input[type=checkbox]:checked{background:#ffd75e}#pnvp input[type=checkbox]:checked:after{left:21px}
#pnvp .apply{background:linear-gradient(#ffd75e,#f7b12c);color:#5a2e10;font-weight:700;font-size:15px;padding:9px 14px;border-radius:999px;box-shadow:0 3px 0 #c27a1c}`;document.head.appendChild(css);}

/* ---------- triar el nivell ---------- */
function openLevels(){if(typeof provesView==='function')provesView('');let d=$('pnv');
  if(!d){d=document.createElement('div');d.id='pnv';document.body.appendChild(d);d.addEventListener('pointerdown',e=>e.stopPropagation());
    d.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;sfx('click');
      if(b.dataset.nv){nvSub(+b.dataset.nv);return;}
      if(b.dataset.poc){location.href=location.pathname+'?prova=nivell1&poc='+b.dataset.poc;return;}
      if(b.dataset.inici){location.href=location.pathname+'?prova=inici';return;}
      if(b.dataset.a==='nivells'){openLevels();return;}
      if(b.dataset.a==='back'){d.classList.remove('on');provesView('llista');}});}
  d.innerHTML=`<div class="card"><h3>Provar nivells</h3><p>Tria un nivell per jugar-lo de prova, amb tot el dels nivells anteriors ja aconseguit. No es desa ni toca la teva partida.</p>
    <div class="lv">${NIVELLS.map(l=>`<button data-nv="${l.n}" ${l.ok?'':'disabled'} aria-label="Nivell ${l.n}">${l.n}<small>${l.ok?'Nivell':'Aviat'}</small></button>`).join('')}</div>
    <button class="back" data-a="back">Tornar</button></div>`;
  d.classList.add('on');}
// subnivells: una entrada per cada poció del nivell
function nvSub(n){const d=$('pnv');
  d.innerHTML=`<div class="card"><h3>Nivell ${n}</h3><p>Tria per quina poció vols començar. Les anteriors ja estaran fetes, amb els seus premis.</p>
    <div class="sub"><button data-inici="1"><b>${n}.0</b><span>Pantalla d'inici (tutorial)</span></button>${NIVEL1.pociones.map((P,i)=>`<button data-poc="${i+1}"><b>${n}.${i+1}</b><span>${P.nombre}</span></button>`).join('')}</div>
    <button class="back" data-a="nivells">Tornar</button></div>`;}
PROVA_OPEN.nivells=openLevels;
if(PLAY&&/[?&]prova=zona/.test(location.search))setTimeout(()=>provesView('llista'),300);

/* ---------- dins la partida de prova: el panell ---------- */
const NV={on:NIVELL_PROVA,fetes:NIVELL_PROVA?GS.done.slice():[]};
// poció en curs (si l'última feta ja està acabada, la següent que encarregarà la veu)
const nvCur=()=>Math.min(NIVEL1.pociones.length-1,GS.phase==='fin'&&GS.done.includes(GS.pot)?GS.pot+1:GS.pot);
const nvHas=k=>k==='escoba'?POW.escoba&&FL.state!=='stand':!!POW[k];
function nvSetHab(k,on){
  if(k==='escoba'){POW.escoba=on;if(on){broom.g.visible=true;if(FL.state==='stand')broomTo('back');}else{if(FL.on||FL.phase)endFlight();broomTo('stand');broom.g.visible=false;}}
  else POW[k]=on;
  if(k==='setas'&&on)badges();wandUI();}
function nvRoba(k){return k==='sabates'?shoesOn:k==='gat'?CAT.on:GS.clothes.includes(k);}
function nvSetRoba(k,on){const has=GS.clothes.includes(k);if(on&&!has)GS.clothes.push(k);if(!on&&has)GS.clothes.splice(GS.clothes.indexOf(k),1);
  if(k==='vestit'){on?wearDress():unwearDress();}
  if(k==='sabates'){on?wearShoes():unwearShoes();}
  if(k==='gat'){if(on)catAppear();else{CAT.on=false;CAT.g.visible=false;}}}
function nvPanel(){let p=$('pnvp');
  if(!p){p=document.createElement('div');p.id='pnvp';document.body.appendChild(p);p.addEventListener('pointerdown',e=>e.stopPropagation());
    p.addEventListener('change',e=>{const i=e.target;if(i.dataset.hab)nvSetHab(i.dataset.hab,i.checked);if(i.dataset.roba)nvSetRoba(i.dataset.roba,i.checked);
      if(i.dataset.pot){const n=+i.dataset.pot;NV.fetes=i.checked?[...new Set([...NV.fetes,n])]:NV.fetes.filter(x=>x!==n);p.querySelector('.apply').style.display='';}});
    p.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;sfx('click');
      if(b.dataset.a==='apply')location.href=location.pathname+'?prova=nivell1&fetes='+NV.fetes.sort((a,b)=>a-b).join(',');
      if(b.dataset.a==='back')location.href=location.pathname+'?prova=zona';
      if(b.dataset.a==='close')p.classList.remove('on');});}
  p.innerHTML=`<h3>Nivell 1.${nvCur()+1} · proves</h3><p class="sub">${NIVEL1.pociones[nvCur()].nombre} · partida de prova: no es desa res.</p>
    <h4>Habilitats</h4>${NV_HAB.map(([k,l])=>`<label>${l}<input type="checkbox" data-hab="${k}" ${nvHas(k)?'checked':''}></label>`).join('')}
    <h4>Roba i companys</h4>${NV_ROBA.map(([k,l])=>`<label>${l}<input type="checkbox" data-roba="${k}" ${nvRoba(k)?'checked':''}></label>`).join('')}
    <h4>Pocions fetes</h4><p class="sub">Marca-les i prem «Aplicar»: la prova torna a començar amb els premis d'aquestes pocions.</p>
    ${NIVEL1.pociones.map((P,i)=>`<label>${i+1}. ${P.nombre}<input type="checkbox" data-pot="${i}" ${NV.fetes.includes(i)?'checked':''}></label>`).join('')}
    <button class="apply" data-a="apply" style="display:none">Aplicar i tornar a començar</button>
    <button class="back" data-a="close">Tancar</button><button class="back" data-a="back">Tornar a la zona de proves</button>`;
  p.classList.add('on');}
if(NV.on){
  showTitleUI(false);camera.fov=38;camera.updateProjectionMatrix();
  const sm=document.querySelector('#title small');if(sm&&sm.firstChild&&sm.firstChild.nodeType===3)sm.firstChild.textContent='Prova · Nivell 1.'+(nvCur()+1)+' · ';
  const b=document.createElement('button');b.id='pnvb';b.textContent='🧪 Proves';document.body.appendChild(b);
  b.addEventListener('pointerdown',e=>e.stopPropagation());b.addEventListener('click',()=>{sfx('click');const p=$('pnvp');if(p&&p.classList.contains('on'))p.classList.remove('on');else nvPanel();});
}
Object.assign(window.__j,{NV,openLevels,nvPanel,nvSetHab,nvSetRoba,nvRoba});
