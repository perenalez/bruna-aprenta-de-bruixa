// Zona de proves · «Proves de noves accions» → «Nedar»: fusta, salt a l'aigua, nedar a la granota,
// bussejar amb l'aire que s'acaba, pujar sola si s'acaba l'aire i tornar a la fusta.
import { abrirJuego } from './_navegador.mjs';
const fallos = [];
const ok = (c, m) => { if (!c) fallos.push(m); };
const { browser, page, errores } = await abrirJuego({ congelar: false });
await page.evaluate(() => localStorage.setItem('bruna-nivel1-v1', JSON.stringify({ pot: 0, phase: 'inicio', marca: 'partida-real' })));
// el menú «Proves de noves accions» porta a «Nedar»
await page.evaluate(() => { sessionStorage.setItem('bruna-proves', '1'); window.__j.provesView('llista'); });
await page.click('#tproves [data-prova=accions]');
const menu = await page.evaluate(() => document.getElementById('tproves').innerText);
ok(/Proves de noves accions/.test(menu) && /Nedar/.test(menu), 'el menú «Proves de noves accions» no mostra «Nedar»');
await Promise.all([page.waitForNavigation({ timeout: 120000 }), page.click('#tproves [data-acc=aigua]')]);
await page.waitForFunction(() => window.__j && window.__j.AQ && window.__j.AQX && window.__j.AQX.water, null, { timeout: 120000 });
const r = await page.evaluate(() => {
  const j = window.__j, A = j.AQ, out = {}; window.requestAnimationFrame = () => 0;
  j.step(20); out.raft = A.st; out.boto = !!document.getElementById('bdive');
  // saltar endavant de la fusta
  j.S.jumpReq = true; j.input.y = 1; j.step(90); out.aigua = A.st;
  // nedar endavant: avança i la fase de la braçada corre
  const p0 = A.p.clone(), ph = []; for (let i = 0; i < 120; i++) { j.step(1); if (i % 10 === 0) ph.push(+A.ph.toFixed(2)); }
  out.neda = Math.hypot(A.p.x - p0.x, A.p.z - p0.z); out.fases = new Set(ph.map(v => Math.floor(v * 4))).size;
  out.cap = A.p.y > -0.4;
  // bussejar
  j.K.b = true; j.step(90); j.K.b = false; out.sota = A.st; out.fons = A.p.y; const a0 = A.air;
  j.step(120); out.aireBaixa = A.air < a0;
  // esgotar l'aire: puja sola
  A.air = 0.2; j.step(240); out.puja = A.st; out.aire = A.air;
  // tornar a la fusta: nedar cap a la fusta i «Saltar»
  out.tr = []; let ii = 0;
  for (let i = 0; i < 1800 && j.AQ_RAFT && Math.max(Math.abs(A.p.x) - j.AQ_RAFT.hw, Math.abs(A.p.z) - j.AQ_RAFT.hd) > 0.45; i++) { const dx = -A.p.x, dz = -A.p.z; j.cam.yaw = Math.atan2(-dx, -dz); j.input.y = 1; j.step(1); ii = i; if (i % 100 === 0) out.tr.push([+A.p.x.toFixed(1), +A.p.z.toFixed(1), A.st, +A.yaw.toFixed(2), +A.hv.toFixed(2)]); }
  out.ii = ii;
  j.input.y = 0; out.abans = { st: A.st, x: +A.p.x.toFixed(2), z: +A.p.z.toFixed(2), y: +A.p.y.toFixed(2) }; j.S.jumpReq = true; j.step(5); out.fusta = A.st;
  j.input.y = 0; out.partida = JSON.parse(localStorage.getItem('bruna-nivel1-v1')).marca;
  return out;
});
ok(r.raft === 'raft' && r.boto, 'no comença a la fusta amb el botó «Bussejar»');
ok(r.aigua === 'surface', 'en saltar de la fusta no cau a l\'aigua (' + r.aigua + ')');
ok(r.neda > 1.5 && r.fases >= 3 && r.cap, `no neda a la superfície amb braçades (${r.neda.toFixed(2)} m, ${r.fases} fases)`);
ok(r.sota === 'under' && r.fons < -1.5, 'en bussejar no baixa sota l\'aigua');
ok(r.aireBaixa, 'sota l\'aigua no baixa l\'aire');
ok(r.puja === 'surface' && r.aire > 0.2, 'quan s\'acaba l\'aire no puja sola a respirar');
ok(r.fusta === 'raft', 'no pot tornar a pujar a la fusta ' + JSON.stringify([r.abans, r.ii, r.tr]));
ok(r.partida === 'partida-real', 'la prova ha tocat la partida de «Juga»');
await browser.close();
if (errores.length) fallos.push('Errors:\n' + errores.join('\n'));
if (fallos.length) { console.error('✗ Aigua:\n- ' + fallos.join('\n- ')); process.exit(1); }
console.log('✓ Aigua: fusta, salt, braçada de granota, bussejar, aire, pujar a respirar i tornar a la fusta', JSON.stringify({ neda: +r.neda.toFixed(1) }));
