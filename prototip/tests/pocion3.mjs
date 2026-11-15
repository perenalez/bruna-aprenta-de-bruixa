// Juega la poción 3 (Magicus Arbolerums) a partir de una partida con las pociones 1 y 2 hechas:
// comidas para el unicornio (la manzana no sirve, las bayas sí), poner el bote a tiempo, empujar la roca y el gusano,
// huesos, savia y polvo de mariposa, remover, turbo y zapatos con alas.
import { abrirJuego } from './_navegador.mjs';
const { browser, page, errores } = await abrirJuego({ congelar: false });
await page.evaluate(() => localStorage.setItem('bruna-nivel1-v1', JSON.stringify({ pot: 1, phase: 'fin', bag: [], got: {}, layers: [], diary: [], chat: [], unread: 0, clothes: ['barret', 'vestit'], wardOpen: true, hint: {}, guide: null, done: [0, 1], cheese: false, flags: {} })));
await page.reload();
await page.waitForFunction(() => window.__j && window.__j.S, null, { timeout: 30000 });
await page.waitForTimeout(800);
await page.evaluate(() => { window.requestAnimationFrame = () => 0; });
let fallos = 0;
const ok = (c, m) => { console.log((c ? '✓ ' : '✗ ') + m); if (!c) fallos++; };
const IR = `const j=window.__j;const go=(x,z,y)=>{j.S.pos.set(j.OX+x,0,j.OZ+z);j.S.y=j.OY+y;j.S.vy=0;j.S.air=false;j.S.speed=0;j.step(20);};
  const goW=(x,z)=>{j.S.pos.set(x,0,z);j.S.y=j.gY(x,z);j.S.vy=0;j.S.air=false;j.S.speed=0;j.step(20);};const talk=()=>{for(let i=0;i<8&&j.dOn;i++)j.nextLine();};`;
const E = body => page.evaluate(new Function(IR + body));

let r = await E(`j.teleport('Trono');j.step(30);const d=j.dOn;talk();go(2.6,2.0,8.8);j.ACT.leer();document.getElementById('closeRead').click();return {d,pot:j.GS.pot,ph:j.GS.phase,turbo:j.POW.turbo};`);
ok(r.d && r.pot === 2 && r.ph === 'recoger' && !r.turbo, 'la voz encarga la poción 3 y se lee el libro ' + JSON.stringify(r));

r = await E(`const F=j.FOODS.manzana;goW(F.x+0.8,F.z);const a=j.actions();if(a[0]==='f_manzana')j.ACT.f_manzana();
  goW(j.UNI.x+1.6,j.UNI.z+1.2);const b=j.actions();if(b[0]==='dar')j.ACT.dar();const dijo=j.dOn;talk();j.step(30);
  return {a:a[0],b:b[0],dijo,st:j.UST.st,caca:!!j.GS.got.caca};`);
ok(r.a === 'f_manzana' && r.b === 'dar' && r.dijo && r.st === null && !r.caca, 'con la manzana el unicornio habla pero no hace caca ' + JSON.stringify(r));

r = await E(`const F=j.FOODS.baya;goW(F.x+1.0,F.z);const a=j.actions();if(a[0]==='f_baya')j.ACT.f_baya();
  goW(j.UNI.x+1.6,j.UNI.z+1.2);if(j.actions()[0]==='dar')j.ACT.dar();talk();const p=j.UST.st;j.step(300);const cola=j.UST.st,c=j.actions();
  if(c[0]==='bote')j.ACT.bote();j.step(200);const d=j.dOn;talk();return {a:a[0],p,cola,c:c[0],d,caca:!!j.GS.got.caca,help:j.GS.flags.uniHelp};`);
ok(r.a === 'f_baya' && r.p === 'paseo' && r.cola === 'cola' && r.c === 'bote' && r.d && r.caca && r.help, 'con bayas lilas da vueltas, levanta la cola y se llena el bote ' + JSON.stringify(r));

r = await E(`const R=j.ROCK,h=R.home;goW(h.x+1.7,h.z+0.6);const a=j.actions();if(a[0]==='empujar')j.ACT.empujar();j.step(90);const moved=R.moved;
  return {a:a[0],moved};`);
await page.waitForTimeout(1200);
r = await E(`const R=j.ROCK,h=R.home;j.step(160);const fuera=R.wst;goW(h.x+1.2,h.z+1.2);let a=j.actions();
  let miss=null;if(fuera!=='fuera'){miss='no';}
  if(a[0]==='gusano')j.ACT.gusano();return {fuera,a:a[0],gusano:!!j.GS.got.gusano};`);
ok(r.fuera === 'fuera' && r.a === 'gusano' && r.gusano, 'se empuja la roca, el Conillet cava y se coge el gusano ' + JSON.stringify(r));

r = await E(`const out={},v=new THREE.Vector3();go(-1.6+0.9,4.6-0.6,8.8);let a=j.actions();out.huesos=a[0];if(a[0]==='coger')j.ACT.coger();
  for(const id of ['savia','polvo']){let b=[];for(let k=0;k<20&&b[0]!=='coger';k++){j.step(20);j.POTS[id].g.getWorldPosition(v);goW(v.x+0.6,v.z+0.5);j.POTS[id].g.getWorldPosition(v);j.S.pos.set(v.x+0.6,0,v.z+0.5);j.S.y=j.gY(j.S.pos.x,j.S.pos.z);b=j.actions();}
    out[id]=b[0];if(b[0]==='coger')j.ACT.coger();}
  out.ph=j.GS.phase;return out;`);
ok(r.huesos === 'coger' && r.savia === 'coger' && r.polvo === 'coger' && r.ph === 'caldero', 'huesos de la cesta, savia del árbol azul y polvo de la mariposa dorada ' + JSON.stringify(r));

r = await E(`go(1.9,0.9,8.8);let n=0;for(let i=0;i<6;i++){if(j.actions()[0]==='echar'){j.ACT.echar();j.step(60);n++;}}const a=j.actions();if(a[0]==='remover'){j.ACT.remover();window.__stir(1);}return {n,a:a[0]};`);
ok(r.n === 5 && r.a === 'remover', 'al caldero y a remover ' + JSON.stringify(r));
await page.waitForTimeout(3500);
r = await E(`const d=j.dOn;talk();j.step(10);go(-0.3,-5.6,4.4);const a=j.actions();if(a[0]==='ponerse')j.ACT.ponerse();j.step(5);
  return {d,turbo:j.POW.turbo,boton:getComputedStyle(document.getElementById('bturbo')).display,a:a[0],ropa:j.GS.clothes,ph:j.GS.phase};`);
ok(r.d && r.turbo && r.boton !== 'none' && r.a === 'ponerse' && r.ropa.includes('sabates') && r.ph === 'fin', 'poción hecha: turbo con fruta y zapatos con alas ' + JSON.stringify(r));

await browser.close();
if (errores.length) { console.error('✗ Errores:\n' + errores.join('\n')); process.exit(1); }
if (fallos) process.exit(1);
console.log('\nPoción 3 completa');
