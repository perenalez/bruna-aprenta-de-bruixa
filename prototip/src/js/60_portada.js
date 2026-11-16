/* =====================================================================
   PORTADA — pantalla inicial del juego
   La ilustración de Pere (img/portada.jpg) de fondo, que se desliza muy despacio a izquierda y derecha,
   con los textos, el botón «Juga» y los créditos.
   - Vertical: la imagen llena la pantalla.
   - Horizontal: la imagen entera en el centro y una copia desenfocada rellena los lados.
   ?sinportada en la URL la salta (para pruebas).
   (La versión anterior, con un decorado 3D propio, está en el historial de git: «Portada del joc».)
   ===================================================================== */
const TITLE={on:PLAY&&!/[?&]sinportada/.test(location.search)};
const titleScene=()=>null;          // el bucle de 50_juego.js lo consulta: la portada ya no tiene escena 3D
function titleStep(){}

{const css=document.createElement('style');css.textContent=`
@import url('https://fonts.googleapis.com/css2?family=Cherry+Swash:wght@700&family=Fredoka:wght@600&family=Kalam:wght@700&display=swap');
#tscreen{position:fixed;inset:0;z-index:30;overflow:hidden;background:#d8789a;transition:opacity .8s;color:#fff8ea;text-align:center}
#tscreen.out{opacity:0;pointer-events:none}
#tscreen .bg,#tscreen .blur{position:absolute;inset:-4%;background:url(img/portada.jpg) center/cover no-repeat;animation:kb 18s ease-in-out infinite alternate}
#tscreen .blur{display:none;filter:blur(18px) brightness(.85);inset:-10%}
@keyframes kb{from{transform:translateX(-2.5%) scale(1.04)}to{transform:translateX(2.5%) scale(1.07)}}
@media (orientation:landscape){#tscreen .blur{display:block}#tscreen .bg{inset:0;background-size:contain}}
#tscreen .shade{position:absolute;inset:0;background:linear-gradient(rgba(70,20,60,.45),rgba(70,20,60,0) 34%,rgba(70,20,60,0) 70%,rgba(50,10,40,.55))}
#tscreen .txt{position:absolute;left:0;right:0;top:0;padding:calc(env(safe-area-inset-top) + 20px) 16px 0}
#tscreen .hi{font:600 clamp(16px,4.6vw,24px) Fredoka,"Trebuchet MS",sans-serif;-webkit-text-stroke:4px #4a1a3a;paint-order:stroke fill;text-shadow:0 3px 10px rgba(40,0,30,.5)}
#tscreen h1{margin:4px 0 0;font:700 clamp(46px,14vw,96px)/1 "Cherry Swash",Georgia,serif;color:#fff3dc;-webkit-text-stroke:7px #3a1230;paint-order:stroke fill;text-shadow:0 5px 0 #3a1230,0 10px 24px rgba(40,0,30,.5);letter-spacing:.5px}
#tscreen h2{margin:2px 0 6px;font:700 clamp(24px,7.2vw,50px)/1.05 "Cherry Swash",Georgia,serif;color:#fff3dc;-webkit-text-stroke:5px #3a1230;paint-order:stroke fill;text-shadow:0 4px 0 #3a1230,0 8px 18px rgba(40,0,30,.5)}
#tscreen .sub{max-width:560px;margin:0 auto;font:600 clamp(16px,4.6vw,24px)/1.25 Fredoka,"Trebuchet MS",sans-serif;-webkit-text-stroke:4px #4a1a3a;paint-order:stroke fill}
#tscreen .bot{position:absolute;left:0;right:0;bottom:0;padding:0 16px calc(env(safe-area-inset-bottom) + 18px);display:flex;flex-direction:column;align-items:center;gap:12px}
#tplay{border:0;border-radius:999px;background:linear-gradient(#ffd84a,#ffae2a);color:#5a2210;font:700 clamp(26px,7vw,38px) "Cherry Swash",Georgia,serif;padding:12px 60px 14px;box-shadow:0 0 0 4px #3a1230,0 7px 0 3px #3a1230,0 12px 28px rgba(0,0,0,.45);cursor:pointer;animation:tp 1.2s ease-in-out infinite alternate;touch-action:manipulation}
#tplay:active{transform:translateY(4px)}
@keyframes tp{to{transform:scale(1.06)}}
#tscreen .cred{font:700 clamp(15px,4.2vw,22px) Kalam,"Comic Sans MS",cursive;-webkit-text-stroke:4px #3a1230;paint-order:stroke fill}`;document.head.appendChild(css);}
function showTitleUI(on){['hud','joy','acts','chips','top','hint','bwand','spells','ctx','tbar','frost'].forEach(id=>{const e=$(id);if(e)e.style.visibility=on?'hidden':'';});}
if(TITLE.on){
  const d=document.createElement('div');d.id='tscreen';
  d.innerHTML=`<div class="blur"></div><div class="bg"></div><div class="shade"></div>
    <div class="txt"><div class="hi">Hola! Benvingudes a la nostra aventura!</div><h1>Bruna,</h1><h2>l'aprenenta de bruixa</h2>
      <div class="sub">Segueix les passes fins convertir-te en una bruixa de veritat!</div></div>
    <div class="bot"><button id="tplay">Juga</button><div class="cred">Un joc pensat i creat per Ayla i Pere.</div></div>`;
  document.body.appendChild(d);showTitleUI(true);
  d.addEventListener('pointerdown',e=>e.stopPropagation());
  $('tplay').addEventListener('click',startGame);
}
function startGame(){if(!TITLE.on)return;TITLE.on=false;audioInit();sfx('magic');$('tscreen').classList.add('out');setTimeout(()=>{const e=$('tscreen');if(e)e.remove();},900);showTitleUI(false);}
Object.assign(window.__j,{TITLE,startGame});
