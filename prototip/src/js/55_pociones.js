/* =====================================================================
   POCIONES — el esqueleto del juego del nivel 1
   - Partida guardada en el navegador (GS) y poderes (POW)
   - Sonido: música misteriosa y un sonidito por acción (Web Audio, sin archivos)
   - Libreta (receta, diario, chat con el Conillet), saco, libro de conjuros, caldero
   - Conillet: la cola parpadea con cada mensaje y, si lo pides, te guía (brilla y salta cerca)
   - Varita: despliega un botón por conjuro aprendido (Sol, Lluvia)
   - Poción 1 (Arcoíris) jugable de principio a fin
   Los datos (ingredientes, textos) están en 54_datos_pociones.js.
   ===================================================================== */
const PLAY=DEMO==='juego';                       // las demos de vuelo y turbo no guardan partida y lo tienen todo
const POW={sol:false,lluvia:false,setas:false,turbo:false,escoba:false};
if(!PLAY)Object.keys(POW).forEach(k=>POW[k]=true);
const SAVE='bruna-nivel1-v1';
const POW_EXTRA={plantas:false};Object.assign(POW,POW_EXTRA);if(!PLAY)POW.plantas=true;
const GS={pot:0,phase:'inicio',bag:[],got:{},layers:[],diary:[],chat:[],unread:0,clothes:[],wardOpen:false,hint:{},guide:null,done:[],cheese:false,flags:{}};
function saveGame(){if(!PLAY)return;try{localStorage.setItem(SAVE,JSON.stringify(GS));}catch(e){}}
function loadGame(){if(!PLAY)return;try{if(/[?&]reset/.test(location.search))localStorage.removeItem(SAVE);const s=localStorage.getItem(SAVE);if(s)Object.assign(GS,JSON.parse(s));}catch(e){}
  if(GS.phase==='fin1')GS.phase='fin';                                          // partidas guardadas con la versión anterior
  if(!GS.done.length&&GS.clothes.includes('barret'))GS.done=[0];}
loadGame();
const findIng=id=>{for(const p of NIVEL1.pociones)for(const i of p.ingredientes||[])if(i.id===id)return i;return null;};
const POT=()=>NIVEL1.pociones[GS.pot];

/* ---------- SONIDO ---------- */
const AU={ctx:null,on:true,noise:null};
try{AU.on=localStorage.getItem('bruna-sonido')!=='0';}catch(e){}
function audioInit(){
  if(AU.ctx){if(AU.ctx.state==='suspended')AU.ctx.resume();return;}
  const C=window.AudioContext||window.webkitAudioContext;if(!C)return;
  const c=new C();AU.ctx=c;
  AU.master=c.createGain();AU.master.gain.value=AU.on?1:0;AU.master.connect(c.destination);
  AU.fx=c.createGain();AU.fx.gain.value=0.8;AU.fx.connect(AU.master);
  AU.mus=c.createGain();AU.mus.gain.value=0.5;AU.mus.connect(AU.master);
  // eco suave para la música
  const dl=c.createDelay(1),fb=c.createGain(),lp=c.createBiquadFilter();dl.delayTime.value=0.39;fb.gain.value=0.38;lp.type='lowpass';lp.frequency.value=1800;
  AU.mus.connect(dl);dl.connect(lp);lp.connect(fb);fb.connect(dl);lp.connect(AU.master);
  const b=c.createBuffer(1,c.sampleRate,c.sampleRate),d=b.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;AU.noise=b;
  MUS.next=c.currentTime+0.3;setInterval(musicTick,60);
}
['pointerdown','keydown','touchstart'].forEach(ev=>addEventListener(ev,audioInit,{capture:true,passive:true}));
document.addEventListener('visibilitychange',()=>{if(!AU.ctx)return;if(document.hidden)AU.ctx.suspend();else AU.ctx.resume();});
function setSound(on){AU.on=on;try{localStorage.setItem('bruna-sonido',on?'1':'0');}catch(e){}if(AU.master)AU.master.gain.setTargetAtTime(on?1:0,AU.ctx.currentTime,0.05);$('bsnd').classList.toggle('off',!on);}
function tone(f,t0,dur,o){o=o||{};const c=AU.ctx,os=c.createOscillator(),g=c.createGain();os.type=o.type||'sine';os.frequency.setValueAtTime(f,t0);
  if(o.to)os.frequency.exponentialRampToValueAtTime(o.to,t0+dur);if(o.detune)os.detune.value=o.detune;const v=o.vol||0.2,a=o.attack||0.005;
  g.gain.setValueAtTime(0.0001,t0);g.gain.exponentialRampToValueAtTime(v,t0+a);g.gain.exponentialRampToValueAtTime(0.0001,t0+Math.max(dur,a+0.02));
  os.connect(g);g.connect(o.dest||AU.fx);os.start(t0);os.stop(t0+dur+0.05);}
function noise(t0,dur,o){o=o||{};const c=AU.ctx,s=c.createBufferSource(),f=c.createBiquadFilter(),g=c.createGain();s.buffer=AU.noise;s.loop=true;
  f.type=o.type||'bandpass';f.frequency.setValueAtTime(o.freq||1000,t0);if(o.to)f.frequency.exponentialRampToValueAtTime(o.to,t0+dur);f.Q.value=o.q||1;
  const v=o.vol||0.2,a=o.attack||0.003;g.gain.setValueAtTime(0.0001,t0);g.gain.exponentialRampToValueAtTime(v,t0+a);g.gain.exponentialRampToValueAtTime(0.0001,t0+Math.max(dur,a+0.02));
  s.connect(f);f.connect(g);g.connect(AU.fx);s.start(t0,Math.random()*0.5);s.stop(t0+dur+0.05);}
const arp=(t,ns,gap,o)=>ns.forEach((f,i)=>tone(f,t+i*gap,o.dur||0.3,o));
function sfx(name,k){
  if(!AU.ctx||!AU.on)return;const t=AU.ctx.currentTime+0.01;k=k===undefined?1:k;
  switch(name){
    case 'jump':tone(300,t,0.2,{to:600,type:'triangle',vol:0.1});break;
    case 'land':noise(t,0.12,{freq:260,type:'lowpass',vol:0.08+0.14*k});if(k>0.3)tone(110,t,0.12,{to:55,vol:0.12*k});break;
    case 'door':tone(150,t,0.55,{to:95,type:'sawtooth',vol:0.025,attack:0.05});noise(t+0.45,0.18,{freq:240,type:'lowpass',vol:0.18});break;
    case 'open':tone(220,t,0.4,{to:150,type:'sawtooth',vol:0.02,attack:0.05});noise(t+0.3,0.1,{freq:500,type:'lowpass',vol:0.1});break;
    case 'lift':tone(70,t,1.4,{type:'triangle',vol:0.1,attack:0.25});arp(t+0.1,[523,659,784],0.09,{vol:0.05,dur:0.4,type:'triangle'});break;
    case 'fly':noise(t,0.9,{freq:350,to:1800,q:0.7,vol:0.18,attack:0.15});tone(380,t,0.5,{to:880,type:'triangle',vol:0.05});break;
    case 'turbo':noise(t,0.45,{freq:600,to:2600,q:1.2,vol:0.12,attack:0.05});tone(480,t,0.3,{to:1000,type:'square',vol:0.02});break;
    case 'boing':tone(170,t,0.35,{to:540,vol:0.2});tone(250,t+0.02,0.3,{to:720,type:'triangle',vol:0.07});break;
    case 'eat':tone(660,t,0.08,{vol:0.12});tone(990,t+0.07,0.1,{vol:0.1});break;
    case 'pick':arp(t,[784,1175,1568],0.08,{type:'triangle',vol:0.11,dur:0.4});break;
    case 'notify':tone(988,t,0.09,{vol:0.16,type:'sine'});tone(1480,t+0.12,0.14,{vol:0.14,type:'sine'});break;
    case 'write':for(let i=0;i<7;i++)noise(t+i*0.11+Math.random()*0.04,0.07,{freq:3500+Math.random()*2000,q:2,vol:0.045});break;
    case 'page':noise(t,0.28,{freq:2600,to:700,q:0.6,vol:0.09});break;
    case 'splash':tone(320,t,0.25,{to:110,vol:0.14});noise(t,0.35,{freq:900,to:280,vol:0.12});for(let i=0;i<3;i++)tone(400+Math.random()*300,t+0.15+i*0.09,0.08,{to:900,vol:0.05});break;
    case 'magic':arp(t,[660,880,1100,1320,1760],0.06,{type:'triangle',vol:0.07,dur:0.5});break;
    case 'success':arp(t,[523,659,784],0.13,{type:'triangle',vol:0.13,dur:0.4});tone(1046,t+0.4,1.1,{type:'triangle',vol:0.13});tone(1568,t+0.42,1.0,{vol:0.05});break;
    case 'talk':tone(480+Math.random()*120,t,0.07,{type:'triangle',vol:0.05});break;
    case 'sun':tone(392,t,1.4,{type:'triangle',vol:0.07,attack:0.3});tone(587,t+0.1,1.3,{type:'triangle',vol:0.05,attack:0.3});arp(t+0.2,[784,988,1175,1568],0.08,{vol:0.05,dur:0.5});break;
    case 'rain':noise(t,3.5,{freq:4000,type:'highpass',vol:0.06,attack:0.5});for(let i=0;i<12;i++)noise(t+0.3+Math.random()*3,0.03,{freq:2500+Math.random()*2000,q:3,vol:0.04});break;
    case 'pet':noise(t,0.6,{freq:140,to:70,type:'lowpass',q:6,vol:0.3,attack:0.02});tone(95,t,0.5,{type:'sawtooth',to:55,vol:0.05});break;
    case 'dig':for(let i=0;i<4;i++)noise(t+i*0.16,0.1,{freq:500,type:'lowpass',vol:0.12});break;
    case 'click':tone(820,t,0.04,{vol:0.05,type:'triangle'});break;
  }
}
let stepT=0;
function sfxStep(s,k){
  if(!AU.ctx||!AU.on||S.t-stepT<0.13)return;stepT=S.t;const t=AU.ctx.currentTime+0.005,v=0.03+0.06*k;
  if(s==='water'){noise(t,0.16,{freq:1300,to:450,q:1,vol:v*1.6});}
  else if(s==='wood'){tone(210,t,0.07,{type:'triangle',to:150,vol:v*1.3});noise(t,0.05,{freq:700,type:'lowpass',vol:v});}
  else if(s==='stone'){noise(t,0.045,{freq:1900,q:3,vol:v*1.2});tone(170,t,0.04,{vol:v*0.4});}
  else if(s==='grass'){noise(t,0.08,{freq:2600,q:0.6,vol:v*0.9});}
  else noise(t,0.07,{freq:1300,q:0.8,vol:v});
}
// música: acordes lentos de la menor + una cajita de música que va improvisando
const MUS={next:0,step:0,note:3};
const mtof=m=>440*Math.pow(2,(m-69)/12);
const CHORDS=[[57,60,64],[53,57,60],[50,53,57],[52,56,59]],SCALE=[69,72,74,76,79,81,84,86],EIGHTH=60/72/2;
function musicTick(){
  const c=AU.ctx;if(!c||c.state!=='running')return;
  while(MUS.next<c.currentTime+0.25){
    const t=MUS.next,s=MUS.step%32,bar=Math.floor(s/8),ch=CHORDS[bar];
    if(s%8===0){ch.forEach(n=>{tone(mtof(n),t,EIGHTH*8.4,{type:'triangle',vol:0.035,attack:0.9,dest:AU.mus});tone(mtof(n),t,EIGHTH*8.4,{type:'sine',vol:0.025,attack:1.1,detune:9,dest:AU.mus});});
      tone(mtof(ch[0]-12),t,EIGHTH*7,{vol:0.06,attack:0.08,dest:AU.mus});}
    if([0,3,5,6].includes(s%8)&&Math.random()<0.8){MUS.note=clamp(MUS.note+pick([-2,-1,1,1,2,-1,0]),0,SCALE.length-1);const f=mtof(SCALE[MUS.note]);
      tone(f,t,0.9,{vol:0.045,dest:AU.mus});tone(f*2,t,0.5,{vol:0.012,dest:AU.mus});}
    MUS.step++;MUS.next+=EIGHTH;
  }
}

/* ---------- INTERFAZ ---------- */
{const css=document.createElement('style');css.textContent=`
#hud{left:calc(env(safe-area-inset-left) + 22px);bottom:calc(env(safe-area-inset-bottom) + 178px);display:flex;flex-direction:column;gap:10px}
.hb{position:relative;width:54px;height:54px;border:0;border-radius:16px;background:rgba(255,248,230,.92);box-shadow:0 3px 0 #b9975a,0 6px 14px rgba(0,0,0,.35);cursor:pointer;touch-action:manipulation;display:flex;align-items:center;justify-content:center;padding:0}
.hb:active{transform:translateY(2px)}.hb svg{width:34px;height:34px;stroke:#6d3b2e;fill:none;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round}
.hb.off{opacity:.55}.hb .bdg{position:absolute;top:-6px;right:-6px;min-width:22px;height:22px;border-radius:11px;background:#5fd36a;color:#fff;font:800 12px system-ui;display:none;align-items:center;justify-content:center;box-shadow:0 0 0 2px #fff}
#bwand{position:fixed;right:calc(env(safe-area-inset-right) + 34px);bottom:calc(env(safe-area-inset-bottom) + 150px);width:62px;height:62px;border-radius:50%;display:none}
#spells{right:calc(env(safe-area-inset-right) + 106px);bottom:calc(env(safe-area-inset-bottom) + 154px);display:none;gap:8px}
#spells.on{display:flex}#spells button{border:0;border-radius:14px;background:#efe3ff;color:#5b2d8a;font:800 14px system-ui;padding:12px 14px;box-shadow:0 3px 0 #9d86bd,0 6px 14px rgba(0,0,0,.35);cursor:pointer;touch-action:manipulation}
#dlg{left:50%;bottom:calc(env(safe-area-inset-bottom) + 176px);transform:translateX(-50%);width:min(92vw,520px);background:#fff8e6;border-radius:18px;padding:12px 16px 14px;box-shadow:0 4px 0 #b9975a,0 10px 30px rgba(0,0,0,.45);display:none;cursor:pointer;z-index:12}
#dlg.on{display:block;animation:dl .25s ease-out}@keyframes dl{from{transform:translate(-50%,20px);opacity:0}}
#dlg b{display:block;font:800 12px system-ui;color:#8a2337;letter-spacing:.5px;text-transform:uppercase;margin-bottom:4px}#dlg p{margin:0;font:600 16px/1.35 system-ui;color:#3b2c2a}
#dlg i{position:absolute;right:14px;bottom:8px;font:700 12px system-ui;color:#b9975a;font-style:normal;animation:pl .5s infinite alternate}
.ov{position:fixed;inset:0;z-index:20;display:none;align-items:center;justify-content:center;background:rgba(15,10,20,.62);padding:12px}
.ov.on{display:flex}
#nbk{width:min(94vw,520px);height:min(84vh,600px);background:#fbf3dc;border-radius:10px 18px 18px 10px;box-shadow:0 14px 40px rgba(0,0,0,.6),inset 22px 0 0 #e9dcb8;position:relative;display:flex;flex-direction:column;padding:12px 14px 12px 36px;font-family:"Bradley Hand","Segoe Print","Marker Felt","Comic Sans MS",cursive;color:#3f3530;animation:nb .45s cubic-bezier(.2,.9,.3,1.1)}
@keyframes nb{from{transform:translateY(60vh) rotate(-8deg)}}
#nbk:before{content:'';position:absolute;left:8px;top:16px;bottom:16px;width:12px;background:repeating-linear-gradient(#8a7a6a 0 6px,transparent 6px 22px);border-radius:6px}
.tabs{display:flex;gap:6px;margin-bottom:8px}.tabs button{flex:1;border:0;border-radius:10px 10px 4px 4px;background:#eadfc0;font:700 14px system-ui;color:#6d5a4a;padding:8px 4px;cursor:pointer;position:relative}
.tabs button.on{background:#ffd98a;color:#5a2e1a}.tabs .bdg{position:absolute;top:-6px;right:-4px;min-width:20px;height:20px;border-radius:10px;background:#5fd36a;color:#fff;font:800 11px system-ui;display:none;align-items:center;justify-content:center}
.pane{flex:1;overflow:auto;background:repeating-linear-gradient(#fbf3dc 0 30px,#cfe0ee 30px 31px);padding:6px 8px}
.pane h2{margin:2px 0 4px;font-size:24px;color:#5a2e1a}.pane .sub{font:600 13px system-ui;color:#7a6a5a;margin-bottom:10px}
.slots{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}
.slot{border:2px dashed #b8a98f;border-radius:12px;min-height:116px;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:6px;text-align:center;font-size:15px;line-height:1.15}
.slot svg{width:64px;height:64px}.slot.got{border-style:solid;border-color:#8a6a4a;background:rgba(255,255,255,.5)}
.slot .lbl{margin-top:4px}.slot.q{color:#b8a98f;font-size:34px}
.draw path,.draw ellipse,.draw rect{stroke-dasharray:300;stroke-dashoffset:300;animation:dr 1.4s ease forwards}.draw .fill{opacity:0;animation:fi .6s 1.2s forwards}
@keyframes dr{to{stroke-dashoffset:0}}@keyframes fi{to{opacity:.85}}
.entry{font-size:18px;margin:0 0 10px;line-height:1.35}.msg{background:#fff;border-radius:14px 14px 14px 4px;padding:8px 12px;margin:0 30px 10px 0;font:600 15px/1.35 system-ui;box-shadow:0 1px 3px rgba(0,0,0,.15)}
.msg b{display:block;font-size:11px;color:#3e9a46;text-transform:uppercase;letter-spacing:.5px}
.ask{display:block;width:100%;border:0;border-radius:12px;background:#5fd36a;color:#fff;font:800 15px system-ui;padding:12px;margin-top:6px;cursor:pointer}
.cls{position:absolute;top:-14px;right:-10px;width:44px;height:44px;border-radius:50%;border:0;background:#8a2337;color:#fff;font:800 20px system-ui;box-shadow:0 3px 8px rgba(0,0,0,.4);cursor:pointer}
.reset{margin-top:20px;border:0;background:none;color:#a08a74;font:600 12px system-ui;text-decoration:underline;cursor:pointer}
#sack{width:min(90vw,420px);background:#c9a874;border-radius:28px 28px 40px 40px;padding:18px;box-shadow:0 14px 40px rgba(0,0,0,.6),inset 0 -14px 0 rgba(0,0,0,.12);position:relative;animation:nb .35s ease-out}
#sack h2{margin:0 0 10px;font:800 18px system-ui;color:#4a2f1a;text-align:center}.items{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}
.it{background:#efe0c0;border-radius:14px;padding:8px 4px;text-align:center;font:700 12px system-ui;color:#4a2f1a}.it svg{width:48px;height:48px}
.empty{text-align:center;font:600 14px system-ui;color:#4a2f1a;padding:20px}
#mini{left:50%;top:calc(env(safe-area-inset-top) + 92px);transform:translateX(-50%);background:#fbf3dc;border-radius:12px;padding:8px 14px;box-shadow:0 6px 20px rgba(0,0,0,.4);display:none;align-items:center;gap:10px;font-family:"Bradley Hand","Segoe Print","Marker Felt","Comic Sans MS",cursive;font-size:17px;color:#3f3530;z-index:11}
#stirBox{text-align:center;color:#fff;font:700 16px system-ui}#stirBox p{margin:0 0 14px}#stirPot{position:relative;width:min(72vw,300px);height:min(72vw,300px);margin:0 auto;border-radius:50%;background:#2b262e;box-shadow:0 0 0 14px #3a343e,0 10px 30px rgba(0,0,0,.5);overflow:hidden;touch-action:none}#stirLiq{position:absolute;inset:16px;border-radius:50%}#stirSpoon{position:absolute;left:50%;top:50%;width:14px;height:46%;margin-left:-7px;background:#8a5d3a;border-radius:7px;transform-origin:50% 0}#stirBar{width:min(72vw,300px);height:12px;margin:18px auto 0;border-radius:6px;background:rgba(255,255,255,.25);overflow:hidden}#stirBar i{display:block;height:100%;width:0;background:#5fd36a}
#mini.on{display:flex;animation:dl .3s ease-out}#mini svg{width:56px;height:56px}
`;document.head.appendChild(css);}
const ICON={
  nb:'<svg viewBox="0 0 34 34"><rect x="7" y="4" width="21" height="26" rx="3"/><path d="M7 9h-3M7 15h-3M7 21h-3M7 27h-3M12 11h11M12 16h11M12 21h7"/></svg>',
  sack:'<svg viewBox="0 0 34 34"><path d="M12 8c-6 6-8 12-6 18 1 3 4 4 11 4s10-1 11-4c2-6 0-12-6-18"/><path d="M11 8h12M13 8l-2-4M21 8l2-4M15 4h4"/></svg>',
  snd:'<svg viewBox="0 0 34 34"><path d="M6 13h5l7-6v20l-7-6H6z"/><path d="M23 12c2 3 2 7 0 10M26 9c4 5 4 11 0 16"/></svg>',
  wand:'<svg viewBox="0 0 34 34"><path d="M8 28L22 14"/><path d="M24 4l1.6 4.2L30 9l-4 2.4.8 4.6-3.4-3-4 2 1.6-4.3-3.2-3.1 4.5-.2z"/></svg>'
};
const bottle=(c,cls)=>`<svg viewBox="0 0 64 64" class="${cls||''}"><ellipse class="fill" cx="32" cy="42" rx="16" ry="15" fill="${c}" stroke="none"/><path d="M26 10h12M27 10v14c-8 3-12 9-11 17 1 9 8 14 16 14s15-5 16-14c1-8-3-14-11-17V10" fill="none" stroke="#4a3a30" stroke-width="2.4" stroke-linecap="round"/><rect x="25" y="5" width="14" height="6" rx="2" fill="none" stroke="#4a3a30" stroke-width="2.2"/></svg>`;
const shadowBottle=()=>`<svg viewBox="0 0 64 64"><path d="M26 10h12M27 10v14c-8 3-12 9-11 17 1 9 8 14 16 14s15-5 16-14c1-8-3-14-11-17V10" fill="#d9ccb4" stroke="#b8a98f" stroke-width="2.4" stroke-dasharray="4 4"/></svg>`;
const hatSvg=`<svg viewBox="0 0 64 64"><path d="M8 48c10 4 38 4 48 0-6-2-11-3-14-3L36 10c-2-3-5-2-6 0l-8 35c-4 0-9 1-14 3z" fill="#3a2a4a" stroke="#4a3a30" stroke-width="2"/><path d="M23 40c6 1.5 13 1.5 18 0" stroke="#b07ae0" stroke-width="4" fill="none"/></svg>`;
{
  const hud=document.createElement('div');hud.id='hud';hud.className='ui';
  hud.innerHTML=`<button class="hb" id="bnote" aria-label="Libreta">${ICON.nb}<span class="bdg"></span></button><button class="hb" id="bsack" aria-label="Saco">${ICON.sack}</button><button class="hb" id="bsnd" aria-label="Sonido">${ICON.snd}</button>`;
  document.body.appendChild(hud);
  const w=document.createElement('button');w.id='bwand';w.className='hb ui';w.setAttribute('aria-label','Varita');w.innerHTML=ICON.wand;document.body.appendChild(w);
  const sp=document.createElement('div');sp.id='spells';sp.className='ui';document.body.appendChild(sp);
  const d=document.createElement('div');d.id='dlg';d.className='ui';d.innerHTML='<b></b><p></p><i>toca ▶</i>';document.body.appendChild(d);
  const mini=document.createElement('div');mini.id='mini';mini.className='ui';document.body.appendChild(mini);
  const nb=document.createElement('div');nb.id='ovNb';nb.className='ov';document.body.appendChild(nb);
  const sk=document.createElement('div');sk.id='ovSack';sk.className='ov';document.body.appendChild(sk);
  const rd=document.createElement('div');rd.id='read';document.body.appendChild(rd);
  const st=document.createElement('div');st.id='ovStir';st.className='ov';document.body.appendChild(st);st.addEventListener('pointerdown',e=>e.stopPropagation());
  const stop=e=>{e.stopPropagation();};
  [hud,w,sp,d,mini,nb,sk,rd].forEach(el=>{el.addEventListener('pointerdown',stop);el.addEventListener('touchstart',stop,{passive:true});});
  $('bnote').addEventListener('click',()=>{sfx('page');openNotebook(GS.unread?'chat':'pot');});
  $('bsack').addEventListener('click',()=>{sfx('click');openSack();});
  $('bsnd').addEventListener('click',()=>{audioInit();setSound(!AU.on);});
  w.addEventListener('click',()=>{sfx('click');sp.classList.toggle('on');});
  d.addEventListener('click',nextLine);
  nb.addEventListener('click',e=>{if(e.target===nb)closeOv(nb);});sk.addEventListener('click',e=>{if(e.target===sk)closeOv(sk);});
  $('bsnd').classList.toggle('off',!AU.on);
}
function closeOv(el){el.classList.remove('on');}
const anyOverlay=()=>$('ovNb').classList.contains('on')||$('ovSack').classList.contains('on')||$('read').classList.contains('on');

/* ---------- diálogos (la voz, más adelante la bruja y el unicornio) ---------- */
const DQ=[];let dOn=false,dDone=null;
function say(who,lines,done){lines=[].concat(lines);lines.forEach((l,i)=>DQ.push({who,l,done:i===lines.length-1?done:null}));if(!dOn)nextLine();}
function nextLine(){
  if(dDone){const f=dDone;dDone=null;f();}
  const q=DQ.shift(),el=$('dlg');
  if(!q){dOn=false;el.classList.remove('on');return;}
  dOn=true;el.querySelector('b').textContent=q.who;el.querySelector('p').textContent=q.l;el.classList.remove('on');void el.offsetWidth;el.classList.add('on');sfx('talk');dDone=q.done;
}

/* ---------- el Conillet: mensajes en el chat de la libreta ---------- */
BN.tail.material=BN.tail.material.clone();BN.tail.material.emissive=new THREE.Color('#7dff6a');BN.tail.material.emissiveIntensity=0;
const bnGlow=halo(BN.root,0,0.22,0,1.3,'#9dff8a',0);
function conill(text,quiet){GS.chat.push(text);GS.unread++;saveGame();badges();if(!quiet){sfx('notify');toast('Conillet tiene un mensaje · mira la libreta',2600);}}
function badges(){
  const b=$('bnote').querySelector('.bdg');b.textContent=GS.unread;b.style.display=GS.unread?'flex':'none';
}

/* ---------- objetos de la poción 1 en el mundo ---------- */
const _w=new THREE.Vector3();
function mkPot(c,scale){
  const g=new THREE.Group(),glass=LM(c,{emissive:c,emissiveIntensity:0.35});
  mk(SPH(0.11,16,12),glass,0,0.11,0,g).scale.y=0.9;
  mk(new THREE.CylinderGeometry(0.035,0.045,0.12,10),LM('#d6e6ea'),0,0.25,0,g);
  // tapón dorado con una bolita brillante: distinto de los botes de decorado
  const cap=LM('#ffd23a',{emissive:'#ffb000',emissiveIntensity:0.6});
  mk(new THREE.CylinderGeometry(0.05,0.045,0.06,12),cap,0,0.33,0,g);
  mk(SPH(0.035,10,8),cap,0,0.39,0,g);
  g.scale.setScalar(scale||1.5);g.traverse(o=>{if(o.isMesh)o.castShadow=true;});
  g.userData.halo=halo(g,0,0.15,0,0.9,c,0.35);return g;
}
const WARD_M=wM(1,PI+0.05,0.5),WARD_W=2.0,WARD_H=2.9;
const POTS={};
function placePots(){
  const P=NIVEL1.pociones[0];
  for(const ing of P.ingredientes){const s=ing.spot,g=mkPot(ing.color);let parent=TW,base=null;
    if(s.type==='shelf'){base=wM(s.lvl,PI-0.8,0.42).multiply(TRS(s.x,0.13+s.row*0.5,0.14));parent=G[s.lvl];}
    else if(s.type==='ward'){base=WARD_M.clone().multiply(TRS(s.x,s.y,0.44));parent=G[s.lvl];g.scale.setScalar(1.3);}
    else if(s.type==='lift'){g.position.set(s.x,0.01,s.z);lift.g.add(g);}
    else if(s.lvl==='t'){g.position.set(TURRET_SPOT.x,TURRET_SPOT.y,TURRET_SPOT.z);TW.add(g);steps.push({m:g,y:TURRET_SPOT.y-0.3});}
    else{g.position.set(s.x,L(s.lvl),s.z);parent=G[s.lvl];}
    if(base)g.position.setFromMatrixPosition(base);
    if(parent!==TW&&s.type!=='lift')parent.add(g);
    g.userData.by=g.position.y;POTS[ing.id]={g,ing};
    if(GS.got[ing.id]||GS.pot>0)g.visible=false;}
}
// otras pociones registran aquí sus objetos recogibles (flor, roca, mariquita, pelo…)
function registerItem(id,g,o){o=o||{};if(!g.userData.halo&&!o.noHalo)g.userData.halo=halo(g,0,0.1,0,o.halo||0.8,findIng(id).color,0.3);
  g.userData.by=g.position.y;POTS[id]={g,ing:findIng(id),nobob:!!o.nobob};}
// dónde está cada cosa (para que el Conillet guíe): objetos recogibles o lo que registre cada poción
const TARGETS={};
function targetPos(id,v){if(POTS[id]&&POTS[id].g.visible){POTS[id].g.getWorldPosition(v);return true;}if(TARGETS[id])return TARGETS[id](v);return false;}
// hueco en la escalera de caracol: rellano del primer piso, junto a la pared de la torrecilla
const TURRET_SPOT={x:TX+2.18,y:L(1),z:0.72};
placePots();

// armario de Bruna: puertas que se abren
const ward={g:new THREE.Group(),doors:[],open:GS.wardOpen?1:0};
{ward.g.applyMatrix4(WARD_M);G[1].add(ward.g);const m=LM('#6b4a33'),mk2=LM('#4a4548');
 [-1,1].forEach(s=>{const h=new THREE.Group();h.position.set(s*(WARD_W/2-0.04),WARD_H/2,0.385);ward.g.add(h);
   const d=mk(new THREE.BoxGeometry(WARD_W/2-0.08,WARD_H-0.3,0.04),m,-s*(WARD_W/4-0.02),0,0,h);d.castShadow=true;
   mk(new THREE.BoxGeometry(0.05,0.2,0.04),mk2,-s*(WARD_W/2-0.2),0,0.03,h);
   [0.55-WARD_H/2,WARD_H/2-0.55].forEach(y=>mk(new THREE.BoxGeometry(0.3,0.07,0.03),mk2,-s*0.2,y,0.025,h));
   ward.doors.push({h,s});});}
// sombrero: en el armario cuando toca, y en la cabeza de Bruna cuando se lo pone
function mkHat(){const g=new THREE.Group(),c=LM('#2f2440'),band=LM('#8a5cc0');
  mk(new THREE.CylinderGeometry(0.36,0.37,0.025,28),c,0,0,0,g);
  const lo=mk(new THREE.CylinderGeometry(0.15,0.2,0.26,20),c,0,0.14,0,g);
  mk(new THREE.CylinderGeometry(0.205,0.205,0.06,20),band,0,0.05,0,g);
  const up=mk(new THREE.ConeGeometry(0.15,0.34,18),c,0.04,0.42,0,g);up.rotation.z=-0.35;
  g.traverse(o=>{if(o.isMesh)o.castShadow=true;});return g;}
const hatW=mkHat();hatW.position.setFromMatrixPosition(WARD_M.clone().multiply(TRS(-0.45,1.03,0.45)));hatW.rotation.y=PI+0.05;G[1].add(hatW);
const hatB=mkHat();hatB.position.set(0.0,0.2,-0.01);hatB.rotation.set(-0.08,0,0.1);B.head.add(hatB);
// vestido de bruja: colgado en el armario y, puesto, cambia la ropa de Bruna (negro de manga larga)
const dressW=new THREE.Group();{const c=LM('#2f2440'),p=LM('#7a4fb0');
  mk(new THREE.CylinderGeometry(0.12,0.34,0.75,18),c,0,-0.38,0,dressW);mk(new THREE.CylinderGeometry(0.1,0.12,0.25,14),c,0,0.1,0,dressW);
  [1,-1].forEach(s=>{const a=mk(new THREE.CylinderGeometry(0.045,0.06,0.45,10),c,s*0.17,-0.05,0,dressW);a.rotation.z=s*0.35;});
  mk(new THREE.CylinderGeometry(0.125,0.125,0.04,14),p,0,-0.06,0,dressW);mk(new THREE.TorusGeometry(0.06,0.008,6,12,PI),LM('#9a9aa6'),0,0.3,0,dressW);
  dressW.position.setFromMatrixPosition(WARD_M.clone().multiply(TRS(0.35,1.78,0.45)));dressW.rotation.y=PI+0.05;dressW.visible=false;G[1].add(dressW);}
const dressSaved=[];
function wearDress(){if(dressSaved.length)return;const c=LM('#2f2440'),s=LM('#3a2a52',{side:THREE.DoubleSide});
  B.root.traverse(o=>{if(o.isMesh&&o.material&&o.material.map&&o!==hatB){dressSaved.push([o,o.material]);o.material=o.material.side===THREE.DoubleSide?s:c;}});}
// premios de cada poción: qué aparece en el armario y qué pasa al ponérselo
const REWARD={barret:{w:hatW,lab:'Ponerse el sombrero',wear(){hatB.visible=true;}},vestit:{w:dressW,lab:'Ponerse el vestido',wear:wearDress}};
// libro de conjuros (sobre la mesa de la cocina) y caldero
const BOOK=new THREE.Vector3().setFromMatrixPosition(at(3.5,2,2.6,-0.6).multiply(TRS(-0.15,0.76,0)));
const bookGlow=halo(G[2],BOOK.x,BOOK.y+0.25,BOOK.z,1.4,'#ffe08a',0);
const KC={x:0.3,z:-0.4,s:1.15};
const layerMeshes=[];
function addLayer(c,i){const r0=0.47*(1-0.18*i),r1=Math.max(0.0,0.47*(1-0.18*(i+1)));
  const m=new THREE.Mesh(i<4?new THREE.RingGeometry(r1,r0,28):new THREE.CircleGeometry(r0,28),new THREE.MeshBasicMaterial({color:c}));
  m.rotation.x=-PI/2;m.position.y=0.895+i*0.002;CAUL[2].g.add(m);layerMeshes.push(m);}
// el arcoíris en el cielo: lo que cambia en el mundo con la poción 1
const rainbow=new THREE.Group();
{const RC=['#ff5f6a','#ff9a4a','#ffd84a','#7fe07a','#5fb0ff','#7a6aff','#c98aff'];
 RC.forEach((c,i)=>{const m=new THREE.Mesh(new THREE.TorusGeometry(46-i*1.6,0.8,6,64,PI),new THREE.MeshBasicMaterial({color:c,transparent:true,opacity:0.5,depthWrite:false,fog:false}));rainbow.add(m);});
 rainbow.position.set(OX,OY-6,OZ-30);scene.add(rainbow);rainbow.visible=false;}
// columna de luz al terminar la poción
const beam=new THREE.Mesh(new THREE.CylinderGeometry(0.5,0.9,30,20,1,true),new THREE.MeshBasicMaterial({color:'#fff3c0',transparent:true,opacity:0,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide}));
beam.position.set(KC.x,L(2)+15,KC.z);TW.add(beam);

/* ---------- acciones de la poción ---------- */
let ctxPot=null,flying=null,stirOn=false;
const curIngs=()=>POT().ingredientes||[];
const inPot=id=>curIngs().some(i=>i.id===id);
function potionActions(){
  if(!PLAY||dOn||flying||stirOn)return null;
  const ph=GS.phase,busy=ph==='recoger'||ph==='caldero';
  // cosas que se recogen (en el torreón o en el bosque)
  if(busy){
    for(const id in POTS){const p=POTS[id];if(GS.got[id]||!p.g.visible||!inPot(id))continue;if(p.ing.spot&&p.ing.spot.type==='ward'&&!GS.wardOpen)continue;
      p.g.getWorldPosition(_w);const dx=_w.x-S.pos.x,dz=_w.z-S.pos.z,dy=_w.y-S.y;
      if(Math.hypot(dx,dz)<1.45&&dy>-0.6&&dy<2.3){ctxPot=p;ctxCap=p.ing.nombre;ctxA.set(_w.x,_w.y+0.9,_w.z);return ['coger'];}}
    const ex=potionExtraActions();if(ex)return ex;            // acciones complejas de cada poción (56_pocion2.js…)
  }
  if(mode!=='tower')return null;
  const l=toLoc(S.pos.x,S.pos.z,S.y),lx=l.x,lz=l.z,ly=l.y;
  // armario de Bruna
  if(Math.abs(ly-L(1))<0.6){_w.setFromMatrixPosition(WARD_M.clone().multiply(TRS(0,0,0.9)));
    if(Math.hypot(lx-_w.x,lz-_w.z)<1.7){ctxCap='Armario';ctxA.set(_w.x+OX,OY+L(1)+2.6,_w.z+OZ);
      if(!GS.wardOpen)return ['armario'];
      if(ph==='premio'){LAB.ponerse=REWARD[POT().premio.ropa].lab;return ['ponerse'];}}}
  // libro
  if(ph!=='inicio'&&Math.abs(ly-L(2))<0.6&&Math.hypot(lx-BOOK.x,lz-BOOK.z)<1.8){ctxCap='Libro de conjuros';ctxA.set(BOOK.x+OX,BOOK.y+OY+0.9,BOOK.z+OZ);return ['leer'];}
  // caldero
  if(Math.abs(ly-L(2))<0.6&&Math.hypot(lx-KC.x,lz-KC.z)<2.3){
    ctxA.set(KC.x+OX,OY+L(2)+2.2,KC.z+OZ);
    if(busy&&GS.bag.some(inPot)&&GS.layers.length<5){ctxCap='Caldero · '+GS.layers.length+'/5';return ['echar'];}
    if(ph==='remover'){ctxCap='Caldero';return ['remover'];}}
  return null;
}
Object.assign(LAB,{coger:'Coger',armario:'Abrir el armario',ponerse:'Ponérselo',leer:'Leer',echar:'Echar al caldero',remover:'Remover'});
// dar un ingrediente: lo apunta en la libreta y, si ya están todos, toca ir al caldero
function giveIngredient(id,x,y,z){const ing=findIng(id);if(!ing||GS.got[id])return;GS.got[id]=true;GS.bag.push(id);sfx('pick');
  if(x!==undefined)for(let i=0;i<10;i++)emit('dust',x,y+0.2,z,1,{sp:1.2,size:0.07,color:ing.color});
  if(GS.guide===id)GS.guide=null;
  miniDraw(ing);saveGame();
  if(curIngs().every(i=>GS.got[i.id])&&GS.phase==='recoger'){GS.phase='caldero';saveGame();setTimeout(()=>conill(TXT.todo),2600);}}
Object.assign(ACT,{
  coger(){const p=ctxPot;if(!p||GS.got[p.ing.id])return;p.g.getWorldPosition(_w);p.g.visible=false;giveIngredient(p.ing.id,_w.x,_w.y,_w.z);},
  armario(){GS.wardOpen=true;saveGame();sfx('open');},
  ponerse(){const P=POT(),r=P.premio.ropa,R=REWARD[r];if(!R)return;R.w.visible=false;R.wear();GS.clothes.push(r);GS.phase='fin';saveGame();sfx('magic');
    for(let i=0;i<14;i++)emit('dust',S.pos.x,S.y+1.4,S.pos.z,1,{sp:1.4,size:0.08,color:pick(['#c98aff','#ffd84a','#fff3b0'])});
    GS.diary.push('Ya tengo '+P.premio.nombre+'.');saveGame();setTimeout(()=>conill([TXT.fin,TXT.fin2,TXT.fin3][GS.pot]||TXT.fin2),1200);},
  leer(){openBook();},
  echar(){const i=GS.bag.findIndex(inPot);if(i<0)return;const id=GS.bag.splice(i,1)[0],ing=findIng(id);
    const g=mkPot(ing.color,1.3);scene.add(g);g.position.set(S.pos.x,S.y+1.1,S.pos.z);
    flying={g,t:0,from:g.position.clone(),to:new THREE.Vector3(KC.x+OX,OY+L(2)+1.05,KC.z+OZ),ing};S.tyaw=Math.atan2(flying.to.x-S.pos.x,flying.to.z-S.pos.z);sfx('jump');saveGame();},
  remover(){openStir();}
});
function landInCauldron(ing){
  GS.layers.push(ing.id);addLayer(ing.color,GS.layers.length-1);CAUL[2].lm.color.set(ing.color);sfx('splash');
  for(let i=0;i<14;i++)emit('dust',KC.x+OX,OY+L(2)+1.1,KC.z+OZ,1,{sp:1.6,size:0.09,color:ing.color});
  saveGame();
  if(GS.layers.length===5){if(POT().mezclar){GS.phase='remover';saveGame();toast(TXT.remover,4000);}else potionDone();}
}
function clearCauldron(){layerMeshes.forEach(m=>CAUL[2].g.remove(m));layerMeshes.length=0;CAUL[2].lm.color.set('#b06ae0');}
function mixCauldron(c){layerMeshes.forEach(m=>m.material.color.set(c));CAUL[2].lm.color.set(c);}
let beamT=-1;
function potionDone(){
  GS.phase='hecha';const P=POT();P.poderes.forEach(p=>POW[p]=true);if(!GS.done.includes(GS.pot))GS.done.push(GS.pot);saveGame();
  setTimeout(()=>{sfx('success');beamT=0;if(GS.pot===0)rainbow.visible=true;
    setTimeout(()=>say(TXT.voz,TXT.felicita[GS.pot],()=>{
      P.diario.forEach(t=>GS.diary.push(t));GS.phase='premio';saveGame();wandUI();
      sfx('magic');setTimeout(()=>conill([TXT.regalo,TXT.regalo2,TXT.regalo3][GS.pot]||TXT.regalo2),900);}),1600);},700);
}
// empezar la poción siguiente: la voz la encarga en la sala del trono
function startPotion(i){GS.pot=i;GS.phase='leer';GS.got={};GS.bag=[];GS.layers=[];GS.hint={};GS.guide=null;clearCauldron();saveGame();}

/* ---------- remover el caldero con el dedo ---------- */
function openStir(){
  const ov=$('ovStir');stirOn=true;let turns=0,last=null;const need=3*TAU,c0=POT().color||'#6fd06a';
  ov.innerHTML='<div id="stirBox"><p>'+TXT.remover+'</p><div id="stirPot"><div id="stirLiq"></div><div id="stirSpoon"></div></div><div id="stirBar"><i></i></div></div>';
  ov.classList.add('on');const pot=$('stirPot'),liq=$('stirLiq'),sp=$('stirSpoon'),bar=ov.querySelector('#stirBar i');
  const cols=GS.layers.map(id=>findIng(id).color);liq.style.background='conic-gradient('+cols.map((c,i)=>c+' '+(i*20)+'% '+((i+1)*20)+'%').join(',')+')';
  const ang=e=>{const r=pot.getBoundingClientRect();return Math.atan2(e.clientY-(r.top+r.height/2),e.clientX-(r.left+r.width/2));};
  const mv=e=>{if(!stirOn)return;const a=ang(e);if(last!==null){let d=a-last;if(d>PI)d-=TAU;if(d<-PI)d+=TAU;turns+=Math.abs(d);
      if(Math.random()<0.25)sfx('splash');}
    last=a;const u=Math.min(1,turns/need);bar.style.width=(u*100)+'%';liq.style.transform='rotate('+(turns*57.3)+'deg)';sp.style.transform='rotate('+(a*57.3+90)+'deg)';
    liq.style.filter='saturate('+(1-u*0.5)+')';liq.style.boxShadow='inset 0 0 0 999px '+c0+Math.round(u*255).toString(16).padStart(2,'0');
    if(u>=1)finish();};
  const finish=()=>{if(!stirOn)return;stirOn=false;ov.removeEventListener('pointermove',mv);setTimeout(()=>{ov.classList.remove('on');mixCauldron(c0);potionDone();},500);};
  ov.addEventListener('pointerdown',e=>{last=ang(e);});ov.addEventListener('pointermove',mv);
  window.__stir=n=>{turns=need*n;mv({clientX:0,clientY:0});};      // para las pruebas automáticas
}

/* ---------- libro de conjuros ---------- */
function openBook(){
  const P=POT(),rd=$('read');sfx('page');
  const right=P.pendiente?'<h3>Próximamente</h3><p>Esta poción aún está en construcción.</p>':
    '<h3>Ingredientes</h3><ul>'+P.ingredientes.map(i=>`<li style="display:flex;align-items:center;gap:8px;justify-content:center"><span style="width:16px;height:16px;border-radius:50%;background:${i.color};display:inline-block;border:2px solid #4a2f22"></span>${i.nombre}</li>`).join('')+'</ul>';
  rd.innerHTML=`<div id="spread"><div class="pg"><h3>Libro de conjuros</h3><h2>${P.nombre}</h2><p style="font-size:17px;margin:0">${P.poder}.</p><p style="font-size:16px;margin:0;opacity:.85">${P.receta||''}</p></div><div class="pg">${right}</div></div><button id="closeRead">${GS.phase==='leer'?'Apuntar en la libreta':'Cerrar'}</button>`;
  rd.classList.add('on');
  $('closeRead').addEventListener('click',()=>{rd.classList.remove('on');
    if(GS.phase==='leer'){GS.phase='recoger';saveGame();sfx('write');setTimeout(()=>{openNotebook('pot');setTimeout(()=>conill(TXT.leido),900);},300);}});
}

/* ---------- libreta: poción, diario y chat ---------- */
let nbTab='pot';
function openNotebook(tab){nbTab=tab||nbTab;renderNotebook();$('ovNb').classList.add('on');}
function renderNotebook(){
  const P=POT(),read=!['inicio','leer','tarea'].includes(GS.phase),ov=$('ovNb');
  let body='';
  if(nbTab==='pot'){
    if(GS.phase==='inicio')body='<h2>Mi libreta</h2><div class="sub">Aquí apuntaré las recetas, lo que aprenda y los mensajes del Conillet.</div><p class="entry">Todavía no tengo ninguna tarea. Quizá en el torreón…</p>';
    else{body=`<h2>${P.nombre}</h2><div class="sub">${read?'Lo que necesito (toca un hueco vacío para pedir pista)':'Lee el libro de conjuros en la cocina del caldero para saber qué necesitas.'}</div><div class="slots">`+
      P.ingredientes.map(i=>{const got=GS.got[i.id];
        if(!read)return '<div class="slot q">?</div>';
        return `<div class="slot ${got?'got':''}" data-ask="${got?'':i.id}">${got?bottle(i.color):shadowBottle()}<div class="lbl">${i.nombre}</div></div>`;}).join('')+'</div>';
      if(GS.layers.length)body+=`<p class="entry" style="margin-top:12px">En el caldero: ${GS.layers.length} de 5.</p>`;}
  }else if(nbTab==='diary'){
    body='<h2>Diario</h2>'+(GS.diary.length?GS.diary.map(t=>`<p class="entry">· ${t}</p>`).join(''):'<p class="entry">Aún no he aprendido ningún conjuro.</p>')+'<button class="reset" id="rst">Empezar la partida de nuevo</button>';
  }else{
    body='<h2>Chat con Conillet</h2>'+(GS.chat.length?GS.chat.map(t=>`<div class="msg"><b>${TXT.conill}</b>${t}</div>`).join(''):'<p class="entry">Aún no hay mensajes.</p>');
    const miss=missing();if(miss&&(GS.phase==='recoger'))body+=`<button class="ask" id="askC">Conillet, ¿dónde está ${miss.nombre.toLowerCase().replace('bote','el bote')}?</button>`;
    GS.unread=0;saveGame();badges();
  }
  ov.innerHTML=`<div id="nbk"><button class="cls" id="nbX">✕</button><div class="tabs"><button data-t="pot" class="${nbTab==='pot'?'on':''}">Poción</button><button data-t="diary" class="${nbTab==='diary'?'on':''}">Diario</button><button data-t="chat" class="${nbTab==='chat'?'on':''}">Chat<span class="bdg">${GS.unread}</span></button></div><div class="pane">${body}</div></div>`;
  ov.querySelectorAll('.tabs button').forEach(b=>b.addEventListener('click',()=>{sfx('page');nbTab=b.dataset.t;renderNotebook();}));
  const cb=ov.querySelector('.tabs [data-t=chat] .bdg');cb.style.display=GS.unread&&nbTab!=='chat'?'flex':'none';
  $('nbX').addEventListener('click',()=>closeOv(ov));
  ov.querySelectorAll('[data-ask]').forEach(s=>{if(s.dataset.ask)s.addEventListener('click',()=>{askHint(s.dataset.ask);nbTab='chat';renderNotebook();});});
  const a=$('askC');if(a)a.addEventListener('click',()=>{askHint(missing().id);renderNotebook();});
  const r=$('rst');if(r)r.addEventListener('click',()=>{if(confirm('¿Seguro? Se borrará la partida y empezarás desde el bosque.')){try{localStorage.removeItem(SAVE);}catch(e){}location.reload();}});
  const pane=ov.querySelector('.pane');if(nbTab==='chat')pane.scrollTop=pane.scrollHeight;
}
const missing=()=>{const P=POT();if(P.pendiente)return null;
  const here=curKey;return P.ingredientes.filter(i=>!GS.got[i.id]).sort((a,b)=>(a.sala===here?-1:0)-(b.sala===here?-1:0))[0]||null;};
// pistas en dos capas: primero vaga; si insistes, la clara y te guía
function askHint(id){const ing=POT().ingredientes.find(i=>i.id===id);if(!ing)return;
  const n=(GS.hint[id]||0)+1;GS.hint[id]=n;
  if(n===1)conill(ing.vaga+' (Si no lo encuentras, pregúntame otra vez.)',true);
  else{conill(ing.clara+' Te acompaño: cuanto más cerca, más brillo y más salto.',true);GS.guide=id;}
  GS.unread=0;sfx('notify');saveGame();badges();}
// mini-libreta: el dibujo a lápiz al conseguir un ingrediente (la recompensa)
let miniT=0;
function miniDraw(ing){const m=$('mini');m.innerHTML=bottle(ing.color,'draw')+'<span>'+ing.nombre+'<br><small style="font-size:13px;opacity:.7">apuntado en la libreta</small></span>';
  m.classList.remove('on');void m.offsetWidth;m.classList.add('on');sfx('write');clearTimeout(miniT);miniT=setTimeout(()=>m.classList.remove('on'),3200);}

/* ---------- saco ---------- */
function openSack(){const ov=$('ovSack'),P=POT();
  const items=GS.bag.map(id=>P.ingredientes.find(i=>i.id===id)).filter(Boolean);
  ov.innerHTML=`<div id="sack"><button class="cls" id="skX">✕</button><h2>El saco</h2>${items.length?'<div class="items">'+items.map(i=>`<div class="it">${bottle(i.color)}<div>${i.nombre}</div></div>`).join('')+'</div>':'<div class="empty">El saco está vacío.</div>'}</div>`;
  ov.classList.add('on');$('skX').addEventListener('click',()=>closeOv(ov));}

/* ---------- varita y conjuros ---------- */
const SPELL_LAB={sol:'Sol',lluvia:'Lluvia'};
function wandUI(){const list=Object.keys(SPELL_LAB).filter(k=>POW[k]&&(PLAY||true));
  $('bwand').style.display=list.length?'flex':'none';
  $('spells').innerHTML=list.map(k=>`<button data-s="${k}">${SPELL_LAB[k]}</button>`).join('');
  $('spells').querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>{cast(b.dataset.s);$('spells').classList.remove('on');}));}
const spell={type:null,t:0};
const sunG=new THREE.Group();{mk(SPH(0.32,20,14),new THREE.MeshBasicMaterial({color:'#ffd84a'}),0,0,0,sunG);halo(sunG,0,0,0,3.2,'#ffcf5a',0.7);
  for(let i=0;i<10;i++){const r=mk(new THREE.ConeGeometry(0.06,0.26,6),new THREE.MeshBasicMaterial({color:'#ffe680'}),Math.sin(i/10*TAU)*0.48,Math.cos(i/10*TAU)*0.48,0,sunG);r.rotation.z=-i/10*TAU;}
  sunG.visible=false;scene.add(sunG);}
const sunL=new THREE.PointLight('#ffcf7a',0,12,1.4);scene.add(sunL);
const cloudG=new THREE.Group();{const m=LM('#e9ecf6',{emissive:'#9aa4c8',emissiveIntensity:0.3});[[0,0,0,0.5],[0.45,-0.05,0.1,0.38],[-0.45,-0.05,-0.05,0.4],[0.15,0.2,-0.1,0.38],[-0.2,0.15,0.15,0.34]].forEach(([x,y,z,r])=>mk(SPH(r,14,10),m,x,y,z,cloudG));cloudG.visible=false;scene.add(cloudG);}
const drops=[];{const m=new THREE.MeshBasicMaterial({color:'#bfe4ff',transparent:true,opacity:0.8});for(let i=0;i<40;i++){const d=new THREE.Mesh(new THREE.BoxGeometry(0.02,0.22,0.02),m);d.visible=false;scene.add(d);drops.push({m:d,y:0,x:0,z:0});}}
function cast(k){spell.type=k;spell.t=0;onCast(k);
  if(k==='sol'){sfx('sun');sunG.visible=true;}
  if(k==='lluvia'){sfx('rain');cloudG.visible=true;drops.forEach(d=>{d.x=rr(-0.7,0.7);d.z=rr(-0.5,0.5);d.y=rr(0,2.2);d.m.visible=true;});}
  for(let i=0;i<12;i++)emit('dust',S.pos.x,S.y+1.2,S.pos.z,1,{sp:1.3,size:0.07,color:k==='sol'?'#ffd84a':'#bfe4ff'});}
function spellStep(dt){
  if(!spell.type)return;spell.t+=dt;const T=7,u=spell.t/T,fade=Math.min(1,spell.t*2,(T-spell.t)*1.5);
  if(spell.type==='sol'){sunG.position.set(S.pos.x,S.y+2.7+Math.sin(spell.t*2)*0.08,S.pos.z);sunG.rotation.z=spell.t*0.8;sunG.scale.setScalar(Math.max(0.01,fade));
    sunL.position.copy(sunG.position);sunL.intensity=1.6*fade;}
  if(spell.type==='lluvia'){cloudG.position.set(S.pos.x,S.y+2.8,S.pos.z);cloudG.scale.setScalar(Math.max(0.01,fade));
    for(const d of drops){d.y-=dt*5;if(d.y<0){d.y=2.3;d.x=rr(-0.7,0.7);d.z=rr(-0.5,0.5);if(fade>0.5&&R()<0.3)emit('ring',S.pos.x+d.x,0,S.pos.z+d.z,1,{size:0.25,life:0.5});}
      d.m.position.set(S.pos.x+d.x,S.y+0.4+d.y,S.pos.z+d.z);d.m.visible=fade>0.2;}}
  if(u>=1){spell.type=null;sunG.visible=false;sunL.intensity=0;cloudG.visible=false;drops.forEach(d=>d.m.visible=false);}
}

/* ---------- bucle del juego ---------- */
let tAcc=0,guideBand=-1;
function gameStep(dt){
  tAcc+=dt;const t=S.t;
  // armario
  ward.open+=((GS.wardOpen?1:0)-ward.open)*(1-Math.exp(-dt*4));for(const d of ward.doors)d.h.rotation.y=d.s*ward.open*1.9;
  // cosas recogibles: flotan y brillan (las de la poción en curso, más)
  const busy=GS.phase==='recoger'||GS.phase==='caldero';
  for(const id in POTS){const p=POTS[id];if(!p.g.visible)continue;
    if(!p.nobob){p.g.position.y=p.g.userData.by+0.03+Math.sin(t*2+id.length)*0.025;p.g.rotation.y=t*0.6;}
    if(p.g.userData.halo)p.g.userData.halo.material.opacity=busy&&inPot(id)?0.35+0.2*Math.sin(t*3):0.08;}
  // libro: brilla mientras toca leerlo
  bookGlow.material.opacity=GS.phase==='leer'?0.45+0.25*Math.sin(t*3):0;
  // premios: en el armario cuando toca
  const rw=GS.phase==='premio'?POT().premio.ropa:null;
  for(const k in REWARD){const R=REWARD[k];R.w.visible=k===rw;if(R.w.visible)R.w.rotation.y=PI+0.05+Math.sin(t)*0.2;}
  hatB.visible=GS.clothes.includes('barret');
  // bote volando al caldero
  if(flying){flying.t+=dt/0.7;const u=Math.min(1,flying.t);flying.g.position.lerpVectors(flying.from,flying.to,u);flying.g.position.y+=Math.sin(u*PI)*1.2;flying.g.rotation.z=u*8;
    if(u>=1){scene.remove(flying.g);const ing=flying.ing;flying=null;landInCauldron(ing);}}
  // columna de luz
  if(beamT>=0){beamT+=dt;beam.material.color.set(GS.pot===0?'#fff3c0':(POT().color||'#c0ffc0'));beam.material.opacity=Math.min(0.55,beamT)*(beamT<4?1:Math.max(0,1-(beamT-4)));beam.rotation.y=beamT;if(beamT>5){beamT=-1;beam.material.opacity=0;}}
  if(rainbow.visible)rainbow.children.forEach((m,i)=>m.material.opacity=0.42+0.08*Math.sin(t*0.7+i*0.5));
  // poción 2 hecha: las setas brillan más y las carnívoras hacen caricias
  if(POW.setas&&!MUSH.glow){MUSH.glow=1;MUSH.forEach(M=>M.cap.traverse(o=>{if(o.isMesh&&o.material.emissive)o.material.emissiveIntensity=0.5;}));}
  if(POW.plantas&&mode==='tower')for(const p of plants){if(p===BIGP&&babaBusy())continue;p.jaw.rotation.x=-0.1-0.06*Math.sin(t*2+p.ph);p.st.rotation.x=0.15+0.08*Math.sin(t*1.3+p.ph);}
  // Conillet: la cola parpadea si hay mensajes sin leer
  BN.tail.material.emissiveIntensity=GS.unread?(Math.sin(t*9)>0?1.4:0.1):0;
  // te guía: brilla entero y salta cuando estás cerca
  let glow=0;
  if(GS.guide&&!GS.got[GS.guide]&&targetPos(GS.guide,_w)){
    const d=Math.hypot(_w.x-S.pos.x,_w.z-S.pos.z)+Math.abs(_w.y-S.y)*2.5;glow=sat(1-d/16);
    const band=d<3?3:d<7?2:d<12?1:0;if(band!==guideBand&&tAcc>1){if(band>guideBand&&band>0)toast(['','Conillet: templado…','Conillet: ¡caliente, caliente!','Conillet: ¡que te quemas!'][band],1600);guideBand=band;}
    if(d<3&&!FL.on){BN.root.position.y+=Math.abs(Math.sin(t*7))*0.3;}}
  bnGlow.material.opacity+=(glow*0.9-bnGlow.material.opacity)*(1-Math.exp(-dt*4));
  spellStep(dt);
  potionExtraStep(dt);
  // historia
  if(PLAY&&!dOn&&mode==='tower'&&curKey===0){
    if(GS.phase==='inicio'){GS.phase='leer';saveGame();say(TXT.voz,TXT.bienvenida,()=>{TXT.hola.forEach((l,i)=>conill(l,i>0));});}
    else if(GS.phase==='fin'){const n=GS.pot+1,P=NIVEL1.pociones[n];
      if(P&&!P.pendiente&&TXT.tarea[n]){startPotion(n);GS.phase='tarea';say(TXT.voz,TXT.tarea[n],()=>{GS.phase='leer';saveGame();});}
      else if(!GS.flags.toldBuild){GS.flags.toldBuild=1;saveGame();say(TXT.voz,TXT.construccion);}}}
}

/* ---------- arranque ---------- */
if(PLAY){
  if(GS.phase==='tarea')GS.phase='leer';
  // reconstruir la partida guardada
  GS.done.forEach(i=>(NIVEL1.pociones[i].poderes||[]).forEach(k=>POW[k]=true));
  if(GS.phase==='hecha')GS.phase='premio';
  GS.layers.forEach((id,i)=>{const ing=findIng(id);if(ing){addLayer(ing.color,i);CAUL[2].lm.color.set(ing.color);}});
  if(GS.done.includes(GS.pot)&&POT().mezclar)mixCauldron(POT().color);
  if(GS.done.includes(0))rainbow.visible=true;
  if(GS.clothes.includes('vestit'))wearDress();
  if(!POW.escoba){broom.g.visible=false;}
}
hatB.visible=GS.clothes.includes('barret');
wandUI();badges();
Object.assign(window.__j,{GS,POW,NIVEL1,POTS,potionActions,keyAt,groundAt,openNotebook,openBook,askHint,cast,sfx,nextLine,TURRET_SPOT,ward,giveIngredient,startPotion,plants,REWARD});
Object.defineProperty(window.__j,'dOn',{get:()=>dOn});
Object.defineProperty(window.__j,'stirOn',{get:()=>stirOn});
