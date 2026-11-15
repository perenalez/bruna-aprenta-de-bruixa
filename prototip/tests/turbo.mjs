// Prueba de la demo «turbo»: setas saltarinas, planeo con el vestido, fruta → turbo, y volar desde cualquier sitio.
import { abrirJuego } from './_navegador.mjs';
import fs from 'node:fs';
const OUT = process.env.OUT || 'docs/turbo';
fs.mkdirSync(OUT, { recursive: true });
const { browser, page, errores } = await abrirJuego({ width: 430, height: 860, demo: 'turbo' });
const shot = async n => { await page.evaluate(() => window.__j.render()); await page.screenshot({ path: `${OUT}/${n}.png` }); };
const E = (f, a) => page.evaluate(f, a);
const fallos = [];
const ok = (c, m) => { console.log((c ? '✓ ' : '✗ ') + m); if (!c) fallos.push(m); };

let r = await E(() => { const j = window.__j; j.step(30); return { st: j.FL.state, n: j.MUSH.length, f: j.FRUIT.length, t: j.TURBO.v, mode: j.mode }; });
ok(r.st === 'back' && r.n >= 4 && r.f > 20, 'empieza junto a las setas con la escoba a la espalda ' + JSON.stringify(r));
await shot('01_inicio');

// 1. saltar a la seta bajita desde el suelo
r = await E(() => { const j = window.__j, S = j.S, M = j.MUSH[0]; S.pos.set(M.x + 1.9, 0, M.z); S.y = j.gY(S.pos.x, S.pos.z); S.speed = 0;
  S.yaw = S.tyaw = Math.atan2(M.x - S.pos.x, M.z - S.pos.z); j.cam.yaw = S.yaw + Math.PI; j.step(10);
  j.input.y = 0.5; S.jumpReq = true; S.jumpHeld = true; let bounced = false, maxY = -1e9;
  for (let i = 0; i < 200; i++) { j.step(1); if (S.bounced) { bounced = true; j.input.y = 0; } maxY = Math.max(maxY, S.y); if (bounced && S.vy < 0) break; }
  return { bounced, h: maxY - M.top }; });
ok(r.bounced && r.h > 4, 'un salto normal llega a la seta bajita y sale disparada ' + JSON.stringify(r));
await shot('02_rebote');
// 2. planear: con Espacio apretado cae despacio
r = await E(() => { const j = window.__j, S = j.S; S.jumpHeld = true; j.step(40); const vg = S.vy, glide = S.glide; j.cam.yaw = S.yaw + 1.6; j.cam.dist = 3.5; j.cam.pitch = 0.15; return { vg, glide }; });
await shot('03_planeo');
r = { ...r, ...(await E(() => { const j = window.__j, S = j.S; S.jumpHeld = false; j.step(30); return { vf: S.vy }; })) };
ok(r.glide && r.vg > -1.6 && r.vf < -3, 'planea con Espacio y cae rápido al soltar ' + JSON.stringify(r));
await E(() => { const j = window.__j; j.cam.dist = 5.8; j.cam.pitch = 0.32; let n = 0; while (j.S.air && n < 600) { j.step(1); n++; } });
// 3. cadena de setas: de la grande cae lejos planeando
r = await E(() => { const j = window.__j, S = j.S, M = j.MUSH[2]; S.pos.set(M.x, 0, M.z); S.y = M.top + 0.6; S.air = true; S.vy = -1; S.speed = 0; j.step(3);
  let top = S.y; for (let i = 0; i < 120; i++) { j.step(1); top = Math.max(top, S.y); }
  j.cam.yaw = Math.atan2(j.MUSH[0].x + 6 - S.pos.x, j.MUSH[0].z + 8 - S.pos.z) + Math.PI; j.input.y = 1; S.jumpHeld = true; const x0 = S.pos.x, z0 = S.pos.z; let n = 0, b = 0, gl = 0; while (S.air && n < 1200) { const bb = S.bounced, vy = S.vy; j.step(1); n++; if (S.vy > vy + 3) b++; if (S.glide) gl++; } j.input.y = 0; S.jumpHeld = false;
  return { top: top - j.gY(M.x, M.z), dist: Math.hypot(S.pos.x - x0, S.pos.z - z0), t: n / 60, rebotes: b, planeo: gl / 60 }; });
ok(r.top > 12 && r.dist > 15, 'desde la seta grande sube alto y planea lejos ' + JSON.stringify(r));

// 4. fruta → turbo
r = await E(() => { const j = window.__j, S = j.S; j.TURBO.v = 10; const f = j.FRUIT.find(f => f.alive && f.y - j.gY(f.x, f.z) < 1);
  S.pos.set(f.x, 0, f.z); S.y = j.gY(f.x, f.z); S.air = false; S.speed = 0; j.step(5); return { t: j.TURBO.v, alive: f.alive }; });
ok(!r.alive && r.t >= 29, 'comer fruta llena el turbo ' + JSON.stringify(r));
await shot('04_fruta');
// 5. turbo a pie: más rápido y se gasta hasta vaciarse
r = await E(() => { const j = window.__j, S = j.S; j.teleport('Bosque'); j.step(5); j.TURBO.v = 30; j.K.w = true; j.TURBO.held = true; j.step(60);
  const sp = S.speed, t1 = j.TURBO.v; j.step(150); const t2 = j.TURBO.v, sp2 = S.speed; j.K.w = false; j.TURBO.held = false; j.step(60); return { sp, t1, t2, sp2 }; });
ok(r.sp > 5.5 && r.t1 < 30 && r.t2 === 0 && r.sp2 < 4, 'turbo a pie: corre más y se gasta ' + JSON.stringify(r));

// 6. volar desde el suelo con Control+Mayús+Espacio
r = await E(() => { const j = window.__j, S = j.S; j.teleport('Bosque'); j.step(10); return j.canMountHere(); });
await page.keyboard.down('Control'); await page.keyboard.down('Shift'); await page.keyboard.down(' ');
r = await E(() => { const j = window.__j; j.step(40); return { on: j.FL.on, h: j.S.y - j.gY(j.S.pos.x, j.S.pos.z) }; });
await page.keyboard.up(' '); await page.keyboard.up('Shift'); await page.keyboard.up('Control');
await E(() => { const j = window.__j; j.K.shift = false; j.K.control = false; });
ok(r.on && r.h > 1, 'Control+Mayús+Espacio despega desde el bosque ' + JSON.stringify(r));
// 7. turbo en vuelo
r = await E(() => { const j = window.__j, S = j.S; j.TURBO.v = 100; j.input.y = 1; j.TURBO.held = true; for (let i = 0; i < 150; i++) { S.jumpHeld = S.y < j.OY + 14; j.step(1); }
  const v = j.FL.vh; j.TURBO.held = false; return { v, t: j.TURBO.v }; });
ok(r.v > 14 && r.t < 100, 'el turbo acelera la escoba ' + JSON.stringify(r));
await shot('05_turbo_vuelo');
r = await E(() => { const j = window.__j, S = j.S; j.input.y = 0; S.jumpHeld = false; let n = 0; while (j.FL.on && n < 1500) { j.step(1); n++; } return { on: j.FL.on }; });
// 8. móvil: al saltar con la escoba aparece «Volar»
r = await E(() => { const j = window.__j, S = j.S; j.teleport('Bosque'); j.step(10); S.jumpReq = true; S.jumpHeld = true; j.step(12);
  return { vis: getComputedStyle(document.getElementById('bfly')).display, air: S.air }; });
ok(r.vis !== 'none', 'al saltar aparece el botón «Volar» ' + JSON.stringify(r));
await shot('06_boton_volar');
await page.dispatchEvent('#bfly', 'pointerdown');
r = await E(() => { const j = window.__j; j.step(10); j.S.jumpHeld = false; return { on: j.FL.on, vis: getComputedStyle(document.getElementById('bfly')).display }; });
ok(r.on && r.vis === 'none', 'pulsar «Volar» en el aire monta la escoba ' + JSON.stringify(r));
await E(() => { const j = window.__j; let n = 0; while (j.FL.on && n < 1500) { j.step(1); n++; } });
// 9. dentro de una casa no se puede
r = await E(() => { const j = window.__j; j.teleport('Casa'); j.step(10); return j.canMountHere(); });
ok(r === false, 'dentro de la casa no deja volar');

await browser.close();
if (errores.length) { console.error('✗ Errores JS:\n' + errores.join('\n')); process.exit(1); }
console.log(fallos.length ? `\n${fallos.length} fallos` : '\nTodo bien');
process.exit(fallos.length ? 1 : 0);
