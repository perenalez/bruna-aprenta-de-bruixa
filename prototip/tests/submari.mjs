// Zona de proves · «Món submarí (nivell 2)», pas 1: illa de l'arc de Sant Martí amb l'unicorn, les quatre zones al fons,
// saltar a l'aigua, nedar, bussejar fins al fons, aire, pujar sola i tornar a l'illa. Sense tocar la partida.
import { abrirJuego } from './_navegador.mjs';
const fallos = [];
const ok = (c, m) => { if (!c) fallos.push(m); };
const { browser, page, errores } = await abrirJuego({ congelar: false });
await page.evaluate(() => localStorage.setItem('bruna-nivel1-v1', JSON.stringify({ pot: 0, phase: 'inicio', marca: 'partida-real' })));
await page.evaluate(() => { sessionStorage.setItem('bruna-proves', '1'); window.__j.provesView('llista'); });
await Promise.all([page.waitForNavigation({ timeout: 120000 }), page.click('#tproves [data-prova=submari]')]);
await page.waitForFunction(() => window.__j && window.__j.AQ && window.__j.AQX && window.__j.AQX.water, null, { timeout: 120000 });
const r = await page.evaluate(() => {
  const j = window.__j, A = j.AQ, X = j.AQX, out = {}; window.requestAnimationFrame = () => 0;
  out.mon = A.sub && !!X.uni && !!X.casa && !!X.cova && !!X.vaixell && X.weeds.length > 60;
  out.titol = document.querySelector('#title small').textContent;
  j.step(20); out.illa = A.st;
  // saltar de l'illa endavant
  j.S.jumpReq = true; j.input.y = 1; for (let i = 0; i < 600 && A.st !== 'surface'; i++) j.step(1); out.aigua = A.st;
  const p0 = A.p.clone(); j.step(120); out.neda = Math.hypot(A.p.x - p0.x, A.p.z - p0.z);
  // bussejar fins al fons
  j.input.y = 0; j.K.b = true; j.step(400); j.K.b = false; out.fons = A.p.y; out.sota = A.st; out.aire = A.air;
  A.air = 0.2; j.step(400); out.puja = A.st;
  // tornar a l'illa
  for (let i = 0; i < 2000 && Math.hypot(A.p.x, A.p.z) > j.AQ.p.y * 0 + 3.9; i++) { j.cam.yaw = Math.atan2(A.p.x, A.p.z); j.input.y = 1; j.step(1); }
  j.input.y = 0; j.S.jumpReq = true; j.step(5); out.torna = A.st;
  out.partida = JSON.parse(localStorage.getItem('bruna-nivel1-v1')).marca;
  return out;
});
ok(r.mon, 'falten l\'illa amb l\'unicorn o alguna de les quatre zones');
ok(/Nivell 2/.test(r.titol), 'no diu que és el nivell 2');
ok(r.illa === 'raft', 'no comença a l\'illa');
ok(r.aigua === 'surface' && r.neda > 1.5, 'no salta a l\'aigua o no neda');
ok(r.sota === 'under' && r.fons < -6.5, `no arriba al fons bussejant (${r.fons.toFixed(1)} m)`);
ok(r.puja === 'surface', 'quan s\'acaba l\'aire no puja sola');
ok(r.torna === 'raft', 'no pot tornar a pujar a l\'illa');
ok(r.partida === 'partida-real', 'la prova ha tocat la partida de «Juga»');
await browser.close();
if (errores.length) fallos.push('Errors:\n' + errores.join('\n'));
if (fallos.length) { console.error('✗ Submarí:\n- ' + fallos.join('\n- ')); process.exit(1); }
console.log('✓ Submarí: illa amb unicorn, 4 zones, saltar, nedar, bussejar fins al fons, aire i tornar a l\'illa', JSON.stringify({ fons: +r.fons.toFixed(1) }));
