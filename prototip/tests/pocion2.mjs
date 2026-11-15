// Juega la poción 2 (Magiculis Parinuris) a partir de una partida con la poción 1 hecha:
// la tarea en el trono, el bosque (polen, musgo, mariquita), el ratón con el queso, la baba (fallo y acierto),
// remover el caldero, los poderes y el vestido.
import { abrirJuego } from './_navegador.mjs';
const { browser, page, errores } = await abrirJuego({ congelar: false });
await page.evaluate(() => localStorage.setItem('bruna-nivel1-v1', JSON.stringify({ pot: 0, phase: 'fin', bag: [], got: {}, layers: ['rojo', 'amarillo', 'verde', 'azul', 'violeta'], diary: [], chat: [], unread: 0, clothes: ['barret'], wardOpen: true, hint: {}, guide: null, done: [0], cheese: false, flags: {} })));
await page.reload();
await page.waitForFunction(() => window.__j && window.__j.S, null, { timeout: 30000 });
await page.waitForTimeout(800);
await page.evaluate(() => { window.requestAnimationFrame = () => 0; });
let fallos = 0;
const ok = (c, m) => { console.log((c ? '✓ ' : '✗ ') + m); if (!c) fallos++; };
const IR = `const j=window.__j;const go=(x,z,y)=>{j.S.pos.set(j.OX+x,0,j.OZ+z);j.S.y=j.OY+y;j.S.vy=0;j.S.air=false;j.S.speed=0;j.step(20);};`;
const E = body => page.evaluate(new Function(IR + body));

let r = await E(`j.teleport('Trono');j.step(30);const d=j.dOn;for(let i=0;i<6&&j.dOn;i++)j.nextLine();go(2.6,2.0,8.8);j.ACT.leer();document.getElementById('closeRead').click();return {d,pot:j.GS.pot,ph:j.GS.phase,setas:j.POW.setas};`);
ok(r.d && r.pot === 1 && r.ph === 'recoger' && !r.setas, 'la voz encarga la poción 2 y se lee el libro ' + JSON.stringify(r));

r = await E(`const out={},v=new THREE.Vector3();
  for(const id of ['polen','musgo','mariquita']){let a=[];for(let k=0;k<15&&a[0]!=='coger';k++){j.step(40);j.POTS[id].g.getWorldPosition(v);j.S.pos.set(v.x+0.7,0,v.z+0.6);j.S.y=j.gY(j.S.pos.x,j.S.pos.z);j.step(2);
    j.POTS[id].g.getWorldPosition(v);j.S.pos.set(v.x+0.7,0,v.z+0.6);j.S.y=j.gY(j.S.pos.x,j.S.pos.z);a=j.actions();}out[id]=a[0];if(a[0]==='coger')j.ACT.coger();}
  return out;`);
ok(r.polen === 'coger' && r.musgo === 'coger' && r.mariquita === 'coger', 'en el bosque se cogen el polen, el musgo y la mariquita de siete puntos ' + JSON.stringify(r));

r = await E(`go(4.6,-0.9,8.8);const a=j.actions();if(a[0]==='queso')j.ACT.queso();go(j.HOLE.x*0.7,j.HOLE.z*0.7,8.8);j.step(10);const sigue=j.MOUSE.st;
  j.teleport('Trono');j.step(60);go(0,-3.8,0);const b=j.actions();if(b[0]==='bajar')j.ACT.bajar();j.step(300);const abajo=j.MOUSE.st;
  const B=j.BIGP;go(B.x*0.75,B.z*0.75,-5.2);const c=j.actions();if(c[0]==='dejarQueso'){j.ACT.dejarQueso();for(let i=0;i<20;i++)j.step(30);}
  const v=new THREE.Vector3();let d=[];if(j.POTS.pelo){j.POTS.pelo.g.getWorldPosition(v);j.S.pos.set(v.x+0.6,0,v.z);j.S.y=j.OY-5.2;j.step(5);d=j.actions();if(d[0]==='coger')j.ACT.coger();}
  return {a:a[0],sigue,abajo,c:c[0],d:d[0],pelo:!!j.GS.got.pelo,flags:j.GS.flags.pinzas};`);
ok(r.a === 'queso' && r.sigue === 'sigue' && r.abajo === 'sigue' && r.c === 'dejarQueso' && r.pelo && r.flags, 'el ratón sigue el queso hasta el sótano y la planta le arranca un pelo ' + JSON.stringify(r));

r = await E(`const B=j.BIGP;go(B.x*0.72,B.z*0.72,-5.2);j.ACT.ofrecer();const sinSol=j.BABA.st;j.cast('sol');j.step(10);const hot=j.BABA.hot>0;
  j.ACT.ofrecer();j.step(200);const tras=[+(j.S.pos.x-j.OX).toFixed(1),+(j.S.pos.z-j.OZ).toFixed(1)],fallo=!j.GS.got.baba;
  go(B.x*0.72,B.z*0.72,-5.2);j.ACT.ofrecer();let n=0;while(j.BABA.st==='prep'&&n<400){j.step(1);n++;}const boton=getComputedStyle(document.getElementById('dodge')).display;
  j.step(5);j.dodge();j.step(90);return {sinSol,hot,fallo,tras,boton,baba:!!j.GS.got.baba,ph:j.GS.phase};`);
ok(r.sinSol === null && r.hot && r.fallo && r.boton === 'block' && r.baba && r.ph === 'caldero', 'sin sol la planta no babea; si no esquivas te echa al ascensor; esquivando, baba ' + JSON.stringify(r));

r = await E(`go(1.9,0.9,8.8);let n=0;for(let i=0;i<6;i++){if(j.actions()[0]==='echar'){j.ACT.echar();j.step(60);n++;}}const ph=j.GS.phase,a=j.actions();if(a[0]==='remover'){j.ACT.remover();window.__stir(1);}return {n,ph,a:a[0]};`);
ok(r.n === 5 && r.ph === 'remover' && r.a === 'remover', 'se echan los 5 ingredientes y toca remover ' + JSON.stringify(r));

await page.waitForTimeout(3500);
r = await E(`const d=j.dOn;for(let i=0;i<6&&j.dOn;i++)j.nextLine();j.step(10);go(-0.3,-5.6,4.4);const a=j.actions();if(a[0]==='ponerse')j.ACT.ponerse();
  return {d,setas:j.POW.setas,plantas:j.POW.plantas,a:a[0],ph:j.GS.phase,ropa:j.GS.clothes};`);
ok(r.d && r.setas && r.plantas && r.a === 'ponerse' && r.ph === 'fin' && r.ropa.includes('vestit'), 'poción hecha: setas saltarinas, plantas amables y Bruna se pone el vestido ' + JSON.stringify(r));

await browser.close();
if (errores.length) { console.error('✗ Errores:\n' + errores.join('\n')); process.exit(1); }
if (fallos) process.exit(1);
console.log('\nPoción 2 completa');
