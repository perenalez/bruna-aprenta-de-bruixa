// Recorre todo el mapa con el joystick virtual y comprueba que Bruna llega a cada punto
// (y que el conejo la sigue). Si algo se atasca, el test falla y dice dónde.
import { abrirJuego } from './_navegador.mjs';
const { browser, page, errores } = await abrirJuego();
const W = await page.evaluate(() => { const j = window.__j; return { OX: j.OX, OY: j.OY, OZ: j.OZ, GT: j.GT, H1: [j.H1.x, j.H1.z, j.H1.yaw, j.H1.d], H2: [j.H2.x, j.H2.z, j.H2.yaw, j.H2.d], RXB: j.RXB, BZ: j.BZ }; });
const puerta = (H, f) => { const [x, z, yaw, d] = H, lz = d / 2 + f; return [x + lz * Math.sin(yaw), z + lz * Math.cos(yaw)]; };
let fallos = 0;
async function ir(x, z, nombre, { tol = 0.7, max = 2400, local = false } = {}) {
  const r = await page.evaluate(([x, z, max, local]) => {
    const j = window.__j, S = j.S; if (local) { x += j.OX; z += j.OZ; } j.cam.yaw = 0; let n = 0;
    for (; n < max; n++) { const dx = x - S.pos.x, dz = z - S.pos.z, l = Math.hypot(dx, dz); if (l < 0.3) break; const k = Math.min(0.6, 0.25 + l * 0.2); j.input.x = dx / l * k; j.input.y = -dz / l * k; j.step(1, 1 / 30); }
    j.input.x = j.input.y = 0; j.step(30, 1 / 30);
    return { d: Math.hypot(x - S.pos.x, z - S.pos.z), y: S.y - j.OY, zona: document.getElementById('cnt').textContent, conejo: Math.hypot(j.BN.x - S.pos.x, j.BN.z - S.pos.z) };
  }, [x, z, max, local]);
  const ok = r.d < tol && r.conejo < 4;
  if (!ok) fallos++;
  console.log(`${ok ? '✓' : '✗'} ${nombre.padEnd(28)} dist ${r.d.toFixed(2)}  conejo a ${r.conejo.toFixed(1)} m  · ${r.zona}`);
}
const accion = (k, n) => page.evaluate(([k, n]) => { const j = window.__j; j.actions(); j.ACT[k](); j.step(n || 60, 1 / 30); }, [k, n]);
const { OX, OZ, GT, RXB, BZ } = W;
await page.evaluate(() => window.__j.teleport('Bosque'));
await ir(-1.2, -1.4, 'unicornio');
await ir(0.5, -20, 'camino del torreón');
await ir(OX, OZ + 11, 'puerta del torreón');
await ir(0, 8.4, 'ante la puerta cerrada', { local: true });
await accion('abrir');
await ir(0, 5, 'sala del trono', { local: true });
await ir(0, -3.3, 'sobre el trono', { local: true });
await accion('bajar', 220);
await ir(0, -0.8, 'dormitorio de la bruja', { local: true });
await ir(0, -3.5, 'volver al ascensor', { local: true });
await accion('subir', 220);
await ir(0, 6.2, 'salir por la puerta', { local: true });
await ir(OX, OZ + 11, 'claro del torreón');
await ir(OX + 8, -52, 'rodear el torreón');
await ir(OX + 9.5, -62, 'norte del torreón');
await ir(OX + 6, -71, 'cruce del valle');
await ir(GT.x, GT.z + 9, 'raíces del árbol');
await ir(GT.x, GT.z + 5, 'túnel de la cueva');
await ir(GT.x, GT.z + 0.4, 'dentro de la cueva');
await ir(GT.x, GT.z + 9, 'salir de la cueva');
await ir(OX + 16, -65, 'hacia las casas');
await ir(...puerta(W.H1, 1.3), 'puerta casa grande');
await ir(...puerta(W.H1, -1.0), 'dentro casa grande');
await ir(...puerta(W.H1, 1.5), 'salir casa grande');
await ir(OX + 19, -77, 'camino de la casita');
await ir(...puerta(W.H2, 1.3), 'puerta casita');
await ir(...puerta(W.H2, -1.0), 'dentro casita');
await ir(...puerta(W.H2, 1.6), 'salir casita');
await ir(OX + 6, -71, 'cruce otra vez');
await ir(OX - 12, -74.6, 'hacia el puente');
await ir(RXB, BZ, 'mitad del puente');
await ir(RXB - 5.6, BZ, 'otra orilla');
const rio = await page.evaluate(([RXB, BZ]) => { const j = window.__j, S = j.S; S.pos.set(RXB - 6, 0, BZ - 12); S.y = j.gY(S.pos.x, S.pos.z); j.step(5);
  for (let i = 0; i < 300; i++) { j.input.x = 1; j.input.y = 0; j.cam.yaw = 0; j.step(1, 1 / 30); } j.input.x = 0; j.step(5); return S.pos.x - RXB; }, [RXB, BZ]);
const cruza = rio > 2;
if (cruza) fallos++;
console.log(`${cruza ? '✗' : '✓'} el río no se puede cruzar sin el puente (x relativa ${rio.toFixed(1)})`);
await browser.close();
if (errores.length) { console.error('✗ Errores de JavaScript:\n' + errores.join('\n')); process.exit(1); }
if (fallos) { console.error(`✗ ${fallos} puntos con problemas`); process.exit(1); }
console.log('✓ Recorrido completo sin atascos');
