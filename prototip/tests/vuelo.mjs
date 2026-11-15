// Prueba de la escoba: coger, lanzarse desde la terraza, subir/bajar con Espacio, volar con el joystick y aterrizar.
import { abrirJuego } from './_navegador.mjs';
import fs from 'node:fs';
const OUT = process.env.OUT || 'docs/vuelo';
fs.mkdirSync(OUT, { recursive: true });
const { browser, page, errores } = await abrirJuego({ width: 430, height: 860, demo: 'vuelo' });
const shot = async n => { await page.evaluate(() => window.__j.render()); await page.screenshot({ path: `${OUT}/${n}.png` }); };
const E = f => page.evaluate(f);
const fallos = [];
const ok = (c, m) => { console.log((c ? '✓ ' : '✗ ') + m); if (!c) fallos.push(m); };

// 1. empieza en la terraza con la escoba al lado
let r = await E(() => { const j = window.__j; j.step(30); return { a: j.actions(), y: j.S.y - j.OY, st: j.FL.state }; });
ok(r.a.includes('escoba') && r.st === 'stand', 'en la terraza se ofrece «Coger la escoba» ' + JSON.stringify(r));
await shot('01_terraza_escoba');
// sin escoba, Espacio en el borde = salto normal
r = await E(() => { const j = window.__j; j.S.pos.set(j.OX, 0, j.OZ + 7.3); j.S.yaw = j.S.tyaw = 0; j.step(20);
  const c = j.canLaunch(); j.S.jumpReq = true; j.S.jumpHeld = true; j.step(10); j.S.jumpHeld = false; const fl = j.FL.on || !!j.FL.phase; j.step(80); return { c, fl, y: j.S.y - j.OY }; });
ok(!r.c && !r.fl && Math.abs(r.y - 13.2) < 0.05, 'sin escoba no se puede lanzar y sigue en la terraza ' + JSON.stringify(r));
// 2. coger la escoba
r = await E(() => { const j = window.__j; j.teleport('Terraza'); j.step(5); const b = window.__j; b.S.pos.set(b.OX - 2.0, 0, b.OZ + 5.0); b.step(10);
  const a = b.actions(); if (a[0] === 'escoba') b.ACT.escoba(); b.step(10); return { a, st: b.FL.state }; });
ok(r.st === 'back', 'la escoba pasa a la espalda ' + JSON.stringify(r));
// 3. ir al borde y pulsar Espacio
r = await E(() => { const j = window.__j; j.S.pos.set(j.OX + 0.4, 0, j.OZ + 7.25); j.S.yaw = j.S.tyaw = 0.05; j.step(20);
  return { c: j.canLaunch(), a: j.actions() }; });
ok(r.c && r.a.includes('lanzarse'), 'en el borde se puede lanzar ' + JSON.stringify(r));
await shot('02_borde');
const y0 = await E(() => window.__j.S.y);
await E(() => { const j = window.__j; j.S.jumpReq = true; j.S.jumpHeld = true; j.step(12); j.S.jumpHeld = false; j.step(10); });
await shot('03_salto');
r = await E(() => { const j = window.__j; j.step(20); return { on: j.FL.on, y: j.S.y, d: Math.hypot(j.S.pos.x - j.OX, j.S.pos.z - j.OZ) }; });
ok(r.on && r.d > 7.9, 'se lanza fuera del parapeto ' + JSON.stringify(r));
// 4. soltar = baja; mantener = sube
const alt = await E(() => { const j = window.__j, o = [];
  for (let i = 0; i < 90; i++) { j.step(1); } o.push(j.S.y);              // 1.5 s sin apretar
  j.S.jumpHeld = true; for (let i = 0; i < 150; i++) j.step(1); o.push(j.S.y); // 2.5 s apretando
  j.S.jumpHeld = false; for (let i = 0; i < 90; i++) j.step(1); o.push(j.S.y);
  return o; });
ok(alt[0] < y0 + 0.5 && alt[1] > alt[0] + 3 && alt[2] < alt[1], 'soltar baja y mantener sube ' + alt.map(v => v.toFixed(2)).join(' → '));

// piloto automático para las pruebas: rumbo con el joystick y altura con «Espacio» a pulsos
await E(() => {
  window.__fly = (tx, tz, alt, secs) => { const j = window.__j, S = j.S, log = []; let minTrunk = 1e9;
    for (let i = 0; i < secs * 60; i++) {
      const yaw = Math.atan2(tx - S.pos.x, tz - S.pos.z), dd = Math.hypot(tx - S.pos.x, tz - S.pos.z); j.cam.yaw = yaw + Math.PI; j.input.x = 0;
      j.input.y = dd > j.FL.vh * j.FL.vh / 8 + 0.5 ? 1 : 0;                // frena a tiempo (sin joystick frena a 4 m/s²)
      S.jumpHeld = S.y < alt; j.step(1);
      minTrunk = Math.min(minTrunk, Math.hypot(S.pos.x - j.GT.x, S.pos.z - j.GT.z) + (S.y - j.GT.y > 22.5 ? 99 : 0));
      if (i % 30 === 0) log.push([+S.pos.x.toFixed(1), +S.y.toFixed(1), +S.pos.z.toFixed(1)]);
      if ((dd < 2 && j.FL.vh < 1.5) || !j.FL.on) break; }
    j.input.y = 0; return { log, minTrunk, on: j.FL.on, x: S.pos.x, y: S.y, z: S.pos.z }; };
});
r = await E(() => window.__fly(window.__j.OX + 18, window.__j.OZ - 6, window.__j.OY + 22, 6));
await shot('04_vuelo_torreon');
// 5. hacia el árbol gigante a poca altura: el tronco no se atraviesa
r = await E(() => { const j = window.__j; return window.__fly(j.GT.x, j.GT.z, j.GT.y + 12, 14); });
ok(r.on && r.minTrunk > 4.5, 'el tronco del árbol bloquea (distancia mínima ' + r.minTrunk.toFixed(2) + ')');
await shot('05_arbol');
// 6. por encima de la copa
r = await E(() => { const j = window.__j; const a = window.__fly(j.GT.x, j.GT.z + 30, j.GT.y + 33, 10); return a; });
r = await E(() => { const j = window.__j; return window.__fly(j.GT.x, j.GT.z - 25, j.GT.y + 33, 12); });
ok(r.on, 'pasa por encima de la copa ' + JSON.stringify(r.log.slice(-2)));
await shot('06_sobre_copa');
// 7. río: la escoba rebota
r = await E(() => { const j = window.__j; window.__fly(j.RXB, j.BZ - 10, j.OY + 6, 12); const S = j.S, o = [];
  j.input.y = 0; S.jumpHeld = false; for (let i = 0; i < 400; i++) { j.step(1); o.push(S.y); }
  return { on: j.FL.on, minY: Math.min(...o), w: j.waterAt(S.pos.x, S.pos.z), g: j.gY(S.pos.x, S.pos.z), x: S.pos.x, z: S.pos.z }; });
ok(r.on && r.minY >= r.w - 0.01, 'sobre el río no se moja y sigue en el aire ' + JSON.stringify(r));
await shot('07_rio');
// 8. aterrizar en el bosque, cerca del puente
r = await E(() => { const j = window.__j; window.__fly(j.RXB + j.BL + 6, j.BZ + 4, j.OY + 5, 10); const S = j.S;
  j.input.y = 0; S.jumpHeld = false; let n = 0; while (j.FL.on && n < 900) { j.step(1); n++; }
  j.step(30); return { on: j.FL.on, dy: S.y - j.gY(S.pos.x, S.pos.z), st: j.FL.state, n, bn: Math.hypot(j.BN.x - S.pos.x, j.BN.z - S.pos.z) }; });
ok(!r.on && Math.abs(r.dy) < 0.05 && r.st === 'back', 'aterriza en el bosque con la escoba a la espalda ' + JSON.stringify(r));
ok(r.bn < 3, 'el conejo baja de la escoba al lado de Bruna ' + r.bn.toFixed(2));
await shot('08_aterrizaje');
// 9. andar después de aterrizar y volver a la terraza para repetir
r = await E(() => { const j = window.__j; j.K.w = true; j.step(90); j.K.w = false; const sp = j.S.speed; j.teleport('Terraza'); j.step(10);
  j.S.pos.set(j.OX - 7.25, 0, j.OZ + 0.3); j.step(5); const toward = j.canLaunch(); j.S.pos.set(j.OX + 7.25, 0, j.OZ); j.step(5); return { sp, toward, side: j.canLaunch() }; });
ok(r.side && !r.toward, 'desde la terraza se puede volver a saltar (no hacia la torre de la escalera) ' + JSON.stringify(r));
// 10. aterrizar en la terraza
r = await E(() => { const j = window.__j; j.S.jumpReq = true; j.S.jumpHeld = true; j.step(40);
  window.__fly(j.OX + 30, j.OZ, j.OY + 22, 5); window.__fly(j.OX + 1, j.OZ + 1, j.OY + 20, 10);
  const S = j.S; j.input.y = 0; S.jumpHeld = false; let n = 0; while (j.FL.on && n < 900) { j.step(1); n++; } j.step(20);
  return { on: j.FL.on, y: S.y - j.OY, key: j.key }; });
ok(!r.on && Math.abs(r.y - 13.2) < 0.05, 'se puede aterrizar en la terraza ' + JSON.stringify(r));
await shot('09_vuelta_terraza');

await browser.close();
if (errores.length) { console.error('✗ Errores JS:\n' + errores.join('\n')); process.exit(1); }
console.log(fallos.length ? `\n${fallos.length} fallos` : '\nTodo bien');
process.exit(fallos.length ? 1 : 0);
