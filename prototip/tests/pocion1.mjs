// Juega la poción 1 (Arcoíris) de principio a fin: la voz del trono, leer el libro, coger los 5 botes
// (el verde está en el armario), echarlos al caldero, el premio (sombrero) y los conjuros de la varita.
import { abrirJuego } from './_navegador.mjs';
const { browser, page, errores } = await abrirJuego();
let fallos = 0;
const ok = (c, m) => { console.log((c ? '✓ ' : '✗ ') + m); if (!c) fallos++; };
const E = f => page.evaluate(f);
const IR = `const go=(x,z,y)=>{j.S.pos.set(j.OX+x,0,j.OZ+z);j.S.y=j.OY+y;j.S.vy=0;j.S.air=false;j.S.speed=0;j.step(20);};`;

let r = await E(() => { const j = window.__j; return { ph: j.GS.phase, setas: j.POW.setas, escoba: j.broom.g.visible, wand: getComputedStyle(document.getElementById('bwand')).display }; });
ok(r.ph === 'inicio' && !r.setas && !r.escoba && r.wand === 'none', 'empieza sin tarea, sin escoba, sin setas saltarinas y sin varita ' + JSON.stringify(r));

r = await E(() => { const j = window.__j; j.teleport('Trono'); j.step(30); const d = j.dOn; for (let i = 0; i < 6 && j.dOn; i++) j.nextLine(); return { d, ph: j.GS.phase, chat: j.GS.chat.length, unread: j.GS.unread }; });
ok(r.d && r.ph === 'leer' && r.chat === 3 && r.unread === 3, 'en la sala del trono habla la voz y el Conillet deja 3 mensajes ' + JSON.stringify(r));

r = await E(new Function(`const j=window.__j;${IR}go(2.6,2.0,8.8);const a=j.actions();j.ACT.leer();document.getElementById('closeRead').click();return {a,ph:j.GS.phase};`));
ok(r.a[0] === 'leer' && r.ph === 'recoger', 'en la cocina se lee el libro y empieza la recogida ' + JSON.stringify(r));

r = await E(new Function(`const j=window.__j;${IR}const out={};
  for(const id of ['rojo','amarillo','azul','violeta','verde']){const v=new THREE.Vector3();j.POTS[id].g.getWorldPosition(v);
    const lx=v.x-j.OX,lz=v.z-j.OZ,d=Math.hypot(lx,lz)||1;let sx=lx-lx/d*0.9,sz=lz-lz/d*0.9;if(id==='violeta'){sx=lx+0.5;sz=lz-0.6;}
    go(sx,sz,Math.floor((v.y-j.OY+0.5)/4.4)*4.4);let a=j.actions();
    if(id==='verde'){out.armario=a[0];if(a[0]==='armario'){j.ACT.armario();j.step(60);a=j.actions();}}
    out[id]=a[0];if(a[0]==='coger')j.ACT.coger();}
  out.ph=j.GS.phase;out.bag=j.GS.bag.length;return out;`));
ok(['rojo', 'amarillo', 'azul', 'violeta', 'verde'].every(k => r[k] === 'coger') && r.armario === 'armario' && r.ph === 'caldero' && r.bag === 5, 'se cogen los 5 botes (el verde, abriendo el armario) ' + JSON.stringify(r));

r = await E(new Function(`const j=window.__j;${IR}go(1.9,0.9,8.8);let n=0;for(let i=0;i<5;i++){if(j.actions()[0]==='echar'){j.ACT.echar();j.step(60);n++;}}return {n,layers:j.GS.layers.length,ph:j.GS.phase};`));
ok(r.n === 5 && r.layers === 5 && r.ph === 'hecha', 'se echan los 5 botes al caldero, en capas ' + JSON.stringify(r));

await page.waitForTimeout(3000);
r = await E(() => { const j = window.__j; const d = j.dOn; for (let i = 0; i < 6 && j.dOn; i++) j.nextLine(); j.step(10);
  return { d, ph: j.GS.phase, sol: j.POW.sol, lluvia: j.POW.lluvia, wand: getComputedStyle(document.getElementById('bwand')).display, diario: j.GS.diary.length }; });
ok(r.d && r.ph === 'premio' && r.sol && r.lluvia && r.wand !== 'none' && r.diario === 3, 'poción hecha: la voz felicita, se aprenden Sol y Lluvia y se apuntan en el diario ' + JSON.stringify(r));

r = await E(new Function(`const j=window.__j;${IR}go(-0.3,-5.6,4.4);const a=j.actions();if(a[0]==='ponerse')j.ACT.ponerse();j.cast('sol');j.step(30);const sol=j.GS.phase;j.cast('lluvia');j.step(30);return {a,ph:j.GS.phase,ropa:j.GS.clothes};`));
ok(r.a[0] === 'ponerse' && r.ph === 'fin' && r.ropa.includes('barret'), 'en el armario está el sombrero y Bruna se lo pone ' + JSON.stringify(r));

r = await E(() => { const s = JSON.parse(localStorage.getItem('bruna-nivel1-v1') || '{}'); return { ph: s.phase, ropa: s.clothes }; });
ok(r.ph === 'fin' && r.ropa && r.ropa.includes('barret'), 'la partida queda guardada en el navegador ' + JSON.stringify(r));

await browser.close();
if (errores.length) { console.error('✗ Errores:\n' + errores.join('\n')); process.exit(1); }
if (fallos) process.exit(1);
console.log('\nPoción 1 completa');
