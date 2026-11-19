/* =====================================================================
   ZONA DE PROVES · «PANTALLA D'INICI» — mini tutorial (en Pere, 19-11-2026)
   ?prova=inici: partida de prova nova (no es desa res).
     1. Demana el nom de qui juga (el del personatge creat, si n'hi ha).
     2. Volta de 360° de la càmera (60_portada.js: startIntro).
     3. En Conillet es posa de cara a la Bruna, saltironeja, brilla i parla (els textos d'en Pere).
     4. Mentre explica cada cosa, s'il·lumina la part de la pantalla de què parla:
        joystick (i espera que es mogui la Bruna), gestos de càmera (cercles al 40 %), saltar, llibreta.
     5. Acaba: «Segueix-me, que anem al torreó!» i el guia fins al torreó (55a_conillet_guia.js).
   ===================================================================== */
const TUT={on:INICI_PROVA,i:-1,nom:'',tail:false,t0:0,p0:null,cam0:null};
const tutTouch=matchMedia('(pointer:coarse)').matches;
// {N} = nom de qui juga · hl: element que s'il·lumina · gest: cercles de la càmera · wait: què ha de passar per seguir
const TUT_PASSOS=[
  {t:'Hola, hola! Què tal esteu, Bruna i {N}?'},
  {t:'Una mica perdudes, oi? No us amoineu: jo us acompanyaré durant tota l\'estona.'},
  {t:'Em dic Conillet i soc un conill màgic. Com podeu veure, som en un bosc una mica especial!'},
  {t:'Hi ha llocs secrets, torreons de bruixa, unicorns i granotes de tres ulls.'},
  {t:'Abans de començar, us explicaré breument com funciona aquest món.'},
  {t:'{N}, veuràs que a l\'esquerra de la pantalla hi ha una mena de controlador: és el que permet moure la Bruna. Prova de moure-la!',hl:'#joy',wait:'move',
   hint:tutTouch?'Arrossega el cercle del joystick':'Fes servir les tecles W A S D'},
  {t:'Molt bé! També pots canviar el punt de vista amb el dit: arrossega per girar l\'entorn i pessiga per apropar-te o allunyar-te, com quan amplies una foto. De vegades, canviant el punt de vista es veuen coses noves!',gest:true,wait:'cam',
   hint:tutTouch?'Gira o pessiga la pantalla':'Arrossega amb el ratolí o fes servir la roda'},
  {t:'També pots saltar, obrir portes i fer accions, com ara acariciar l\'unicorn.',hl:'#bjump'},
  {t:'En general, aquest joc va de fer pocions màgiques, i necessiten la teva ajuda per trobar tots els ingredients.'},
  {t:'Jo sempre seré al teu costat i et donaré pistes si no te\'n surts. Mira: la meva cua brilla quan tinc una pista per a tu.',tail:true},
  {t:'I a la teva llibreta (aquest botó) veuràs que la pestanya «Xat» s\'omple amb els meus consells.',hl:'#bnote'},
  {t:'Les altres dues pestanyes, «Poció» i «Diari», són per anar seguint la poció i per recordar els poders que et dona cada poció nova.',hl:'#bnote'},
  {t:'Crec que amb això ja podem anar tirant! Segueix-me, que anem al torreó!'},
];
{const css=document.createElement('style');css.textContent=`
#tut,#tutnom{font-family:Fredoka,"Trebuchet MS",system-ui,sans-serif;color:#fff}
#tut{position:fixed;left:50%;top:calc(env(safe-area-inset-top) + 64px);transform:translateX(-50%);width:min(440px,calc(100vw - 24px));z-index:35;display:none;
  background:linear-gradient(170deg,rgba(143,106,208,.96),rgba(106,74,168,.96));border:2px solid rgba(255,255,255,.45);border-radius:20px;padding:12px 14px 10px;box-shadow:0 6px 0 rgba(50,25,90,.55),0 14px 30px rgba(30,10,50,.35)}
#tut.on{display:block}#tut b{display:block;font-size:13px;letter-spacing:.5px;text-transform:uppercase;color:#ffd75e;margin-bottom:3px}
#tut p{margin:0;font-size:16px;line-height:1.35}#tut .ft{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-top:8px;min-height:34px}
#tut .hint{font-size:13px;opacity:.9;font-weight:600}#tut button{font-family:inherit;border:0;cursor:pointer;touch-action:manipulation;margin-left:auto;background:linear-gradient(#ffd75e,#f7b12c);color:#5a2e10;font-weight:700;font-size:15px;padding:7px 16px;border-radius:999px;box-shadow:0 3px 0 #c27a1c}
#tuthl{position:fixed;z-index:34;pointer-events:none;border-radius:50%;border:4px solid #ffd75e;box-shadow:0 0 0 6px rgba(255,215,94,.35),0 0 34px rgba(255,215,94,.9);display:none;animation:tuthl 1.1s ease-in-out infinite}
@keyframes tuthl{50%{transform:scale(1.1);box-shadow:0 0 0 12px rgba(255,215,94,.15),0 0 44px rgba(255,215,94,1)}}
#tutg{position:fixed;left:50%;top:55%;z-index:33;pointer-events:none;display:none}#tutg i{position:absolute;width:62px;height:62px;margin:-31px;border-radius:50%;background:rgba(255,255,255,.4);border:3px solid rgba(255,255,255,.6);animation:tutblink 1s ease-in-out infinite}
#tutg.drag .c1{animation:tutblink 1s ease-in-out infinite,tutdrag 2.4s ease-in-out infinite}#tutg.drag .c2{display:none}
#tutg.pinch .c1{animation:tutblink 1s ease-in-out infinite,tutpl 2.4s ease-in-out infinite}#tutg.pinch .c2{animation:tutblink 1s ease-in-out infinite,tutpr 2.4s ease-in-out infinite}
@keyframes tutblink{50%{opacity:.35}}@keyframes tutdrag{0%,100%{transform:translateX(-80px)}50%{transform:translateX(80px)}}
@keyframes tutpl{0%,100%{transform:translateX(-95px)}50%{transform:translateX(-22px)}}@keyframes tutpr{0%,100%{transform:translateX(95px)}50%{transform:translateX(22px)}}
#tutnom{position:fixed;inset:0;z-index:40;display:flex;align-items:center;justify-content:center;padding:20px;background:rgba(60,30,100,.55)}
#tutnom form{width:100%;max-width:340px;border-radius:24px;padding:22px 20px;text-align:center;background:linear-gradient(170deg,#8f6ad0,#6a4aa8);border:2px solid rgba(255,255,255,.4);box-shadow:0 8px 0 rgba(50,25,90,.6)}
#tutnom h3{margin:0 0 8px;font-size:24px}#tutnom p{margin:0 0 14px;font-size:15px}#tutnom input{width:100%;font:600 20px Fredoka,system-ui;padding:11px 14px;border-radius:14px;border:0;outline:none;color:#4a2a6a;text-align:center;margin-bottom:14px}
#tutnom button{border:0;cursor:pointer;font:700 20px Fredoka,system-ui;background:linear-gradient(#ffd75e,#f7b12c);color:#5a2e10;padding:10px 34px;border-radius:999px;box-shadow:0 4px 0 #c27a1c}
#tutback{position:fixed;right:calc(env(safe-area-inset-right) + 10px);top:calc(env(safe-area-inset-top) + 10px);z-index:25;background:rgba(90,60,160,.85);color:#fff;border:0;border-radius:999px;font:600 12px Fredoka,system-ui;padding:7px 12px;cursor:pointer}`;
 document.head.appendChild(css);}
const tutEl=id=>{let e=$(id);if(!e){e=document.createElement('div');e.id=id;document.body.appendChild(e);}return e;};
function tutNomGuardat(){try{const l=JSON.parse(localStorage.getItem('bruna-personatge-v1')||'null');return l&&l.nom?l.nom:'';}catch(e){return '';}}
// 1. el nom
function tutAskName(){const d=tutEl('tutnom');
  d.innerHTML=`<form><h3>Com et dius?</h3><p>En Conillet et vol saludar pel teu nom.</p><input id="tutn" maxlength="16" autocomplete="off" placeholder="El teu nom" value="${tutNomGuardat().replace(/"/g,'&quot;')}"><button type="submit">Som-hi!</button></form>`;
  d.addEventListener('pointerdown',e=>e.stopPropagation());
  d.querySelector('form').addEventListener('submit',e=>{e.preventDefault();TUT.nom=$('tutn').value.trim()||'amiga';d.remove();audioInit();sfx('magic');startIntro();});}
// 3. comença quan acaba la volta de la càmera
function tutStart(){TUT.i=-1;LEAD.tut=true;LEAD.on=true;LEAD.st='front';LEAD.t=0;LEAD.s=routeS(S.pos.x,S.pos.z);TUT.t0=performance.now();TUT.wait=true;}
function tutShow(){const P=TUT_PASSOS[TUT.i],c=tutEl('tut');sfx('talk');
  c.innerHTML=`<b>${TXT.conill}</b><p>${P.t.split('{N}').join(TUT.nom)}</p><div class="ft"><span class="hint">${P.hint||''}</span>${P.wait?'':'<button>Següent ▶</button>'}</div>`;
  c.classList.add('on');const bt=c.querySelector('button');if(bt)bt.addEventListener('click',e=>{e.stopPropagation();tutNext();});
  TUT.tail=!!P.tail;TUT.p0={x:S.pos.x,z:S.pos.z};TUT.cam0={yaw:cam.yaw,dist:cam.dist};TUT.ts=performance.now();
  const g=tutEl('tutg');g.innerHTML='<i class="c1"></i><i class="c2"></i>';g.style.display=P.gest?'block':'none';g.className='drag';
  if(P.wait==='move'){LEAD.on=false;LEAD.st='';leadOrb.visible=false;}     // ara en Conillet segueix la Bruna
}
function tutNext(){TUT.i++;if(TUT.i<TUT_PASSOS.length){tutShow();return;}tutEnd();}
// 5. al torreó!
function tutEnd(){['tut','tutg','tuthl'].forEach(id=>{const e=$(id);if(e)e.style.display='none';});TUT.on=false;TUT.tail=false;
  LEAD.tut=false;LEAD.on=true;LEAD.st='lead';LEAD.t=0;LEAD.s=routeS(S.pos.x,S.pos.z);toast(TXT.guiaToast,3500);}
// cada 100 ms: esperar que en Conillet arribi davant, comprovar les accions, moure la llum i els cercles
setInterval(()=>{if(!TUT.on||TUT.i<-1)return;
  if(TUT.wait){if(LEAD.st==='talk'||performance.now()-TUT.t0>6000){TUT.wait=false;tutNext();}return;}
  if(TUT.i<0)return;const P=TUT_PASSOS[TUT.i];
  const hl=tutEl('tuthl'),el=P.hl&&document.querySelector(P.hl);
  if(el&&el.getClientRects().length&&getComputedStyle(el).visibility!=='hidden'&&getComputedStyle(el).display!=='none'){const r=el.getBoundingClientRect(),pad=10,sz=Math.max(r.width,r.height)+pad*2;
    Object.assign(hl.style,{display:'block',left:(r.left+r.width/2-sz/2)+'px',top:(r.top+r.height/2-sz/2)+'px',width:sz+'px',height:sz+'px'});}else hl.style.display='none';
  if(P.gest){const g=$('tutg');g.className=((performance.now()-TUT.ts)%4800)<2400?'drag':'pinch';}
  const el2=performance.now()-TUT.ts;
  if(P.wait==='move'&&Math.hypot(S.pos.x-TUT.p0.x,S.pos.z-TUT.p0.z)>2.5)tutNext();
  else if(P.wait==='cam'){const moved=Math.abs(cam.yaw-TUT.cam0.yaw)>0.7||Math.abs(cam.dist-TUT.cam0.dist)>1.2;
    if(moved&&el2>1500)tutNext();else if(el2>7000&&!$('tut').querySelector('button')){const f=$('tut').querySelector('.ft');const b=document.createElement('button');b.textContent='Següent ▶';b.addEventListener('click',e=>{e.stopPropagation();tutNext();});f.appendChild(b);}}
},100);
PROVA_OPEN.inici=()=>{location.href=location.pathname+'?prova=inici';};
if(TUT.on){
  showTitleUI(true);camera.fov=38;camera.updateProjectionMatrix();
  const sm=document.querySelector('#title small');if(sm&&sm.firstChild&&sm.firstChild.nodeType===3)sm.firstChild.textContent='Prova · Pantalla d\'inici · ';
  const b=document.createElement('button');b.id='tutback';b.textContent='← Zona de proves';document.body.appendChild(b);
  b.addEventListener('pointerdown',e=>e.stopPropagation());b.addEventListener('click',()=>{location.href=location.pathname+'?prova=zona';});
  setTimeout(tutAskName,200);
}
Object.assign(window.__j,{TUT,tutNext,tutStart,TUT_PASSOS});
