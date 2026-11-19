// Zona de proves · «Pantalla d'inici»: nom, volta de 360°, en Conillet de cara a la Bruna que parla,
// passos amb llum (joystick, gestos, llibreta), espera que es mogui la Bruna i la càmera, i acaba guiant cap al torreó.
import { abrirJuego } from './_navegador.mjs';
const fallos = [];
const ok = (c, m) => { if (!c) fallos.push(m); };
const { browser, page, errores } = await abrirJuego({ congelar: false });
await page.evaluate(() => localStorage.setItem('bruna-nivel1-v1', JSON.stringify({ pot: 0, phase: 'inicio', marca: 'partida-real' })));
await page.goto(page.url().split('?')[0] + '?prova=inici', { timeout: 120000 });
await page.waitForFunction(() => window.__j && window.__j.TUT && document.getElementById('tutn'), null, { timeout: 120000 });
await page.fill('#tutn', 'Ayla'); await page.click('#tutnom button');
const r = await page.evaluate(async () => {
  const j = window.__j, wait = ms => new Promise(r => setTimeout(r, ms)), out = {};
  out.intro = j.INTRO.on; out.hud = getComputedStyle(document.getElementById('joy')).visibility;
  window.requestAnimationFrame = () => 0; j.endIntro();
  for (let k = 0; k < 40 && j.TUT.i < 0; k++) { j.step(10); await wait(120); }
  out.p0 = document.querySelector('#tut p')?.textContent || '';
  const d = new THREE.Vector3(j.BN.x - j.S.pos.x, 0, j.BN.z - j.S.pos.z), fwd = new THREE.Vector3(Math.sin(j.S.yaw), 0, Math.cos(j.S.yaw));
  out.dbg = { dot: +d.dot(fwd).toFixed(2), dist: +d.length().toFixed(2), st: j.LEAD.st, by: +j.BN.yaw.toFixed(2), sy: +j.S.yaw.toFixed(2), cy: +j.cam.yaw.toFixed(2) };
  out.davant = d.dot(fwd) > 0.5; out.mira = Math.cos(j.BN.yaw - Math.atan2(j.S.pos.x - j.BN.x, j.S.pos.z - j.BN.z)) > 0.7;
  for (let k = 0; k < 6; k++) j.tutNext();
  await wait(300); out.p5 = document.querySelector('#tut p').textContent; out.hlJoy = getComputedStyle(document.getElementById('tuthl')).display;
  out.boto5 = !!document.querySelector('#tut button');
  j.K.w = true; j.step(70); j.K.w = false; await wait(400); out.i6 = j.TUT.i; out.gest = getComputedStyle(document.getElementById('tutg')).display;
  j.cam.yaw += 1.2; await wait(1800); out.i7 = j.TUT.i;
  j.tutNext(); j.tutNext(); await wait(200); out.cua = j.TUT.tail && j.BN.tail.material.emissiveIntensity >= 0;
  j.tutNext(); await wait(300); out.hlNote = getComputedStyle(document.getElementById('tuthl')).display;
  j.tutNext(); j.tutNext(); j.tutNext(); await wait(200);
  out.fi = { tut: j.TUT.on, lead: j.LEAD.on, st: j.LEAD.st };
  out.partida = JSON.parse(localStorage.getItem('bruna-nivel1-v1')).marca;
  return out;
});
ok(r.intro && r.hud === 'hidden', 'no fa la volta de 360° amb els controls amagats');
ok(r.p0.includes('Ayla') && !r.p0.includes('Bruna i'), 'en Conillet no saluda qui juga pel nom: ' + r.p0);
ok(r.davant && r.mira, 'en Conillet no és davant de la Bruna mirant-la ' + JSON.stringify(r.dbg));
ok(/controlador/.test(r.p5) && r.hlJoy === 'block' && !r.boto5, 'el pas del joystick no il·lumina el joystick o no espera que es mogui la Bruna');
ok(r.i6 === 7 && r.gest === 'block', 'en moure la Bruna no passa al pas de la càmera amb els cercles');
ok(r.i7 === 8, 'en girar la càmera no passa al pas següent');
ok(r.cua, 'no s\'encén la cua quan en parla');
ok(r.hlNote === 'block', 'no s\'il·lumina la llibreta');
ok(!r.fi.tut && r.fi.lead && r.fi.st === 'lead', 'en acabar no el guia cap al torreó: ' + JSON.stringify(r.fi));
ok(r.partida === 'partida-real', 'el tutorial ha sobreescrit la partida de «Juga»');
await browser.close();
if (errores.length) fallos.push('Errors:\n' + errores.join('\n'));
if (fallos.length) { console.error('✗ Tutorial:\n- ' + fallos.join('\n- ')); process.exit(1); }
console.log('✓ Tutorial: nom, 360°, Conillet de cara, joystick, gestos, cua, llibreta i guia fins al torreó');
