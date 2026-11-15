// Saca una captura de cada zona en tests/capturas/ (para revisar el aspecto sin jugar).
import { abrirJuego } from './_navegador.mjs';
import fs from 'node:fs';
const { browser, page } = await abrirJuego({ width: 900, height: 640 });
fs.mkdirSync(new URL('./capturas/', import.meta.url), { recursive: true });
const vistas = [
  ['bosque', 'Bosque', 0.12, 0.32, 5.8], ['estanque', 'Estanque', -1.9, 0.3, 5.5], ['torreon', 'Torreón', 0.25, 0.3, 24],
  ['trono', 'Trono', 0.3, 0.75, 13], ['terraza', 'Terraza', 0.3, 0.6, 15], ['sotano', 'Sótano', 0.2, 0.75, 15],
  ['puente', 'Puente', 1.1, 0.35, 9], ['arbol', 'Árbol', 0.15, 0.18, 16], ['cueva', 'Cueva', 0.2, 0.75, 7],
  ['casa', 'Casa', 0.6, 0.85, 8], ['casita', 'Casita', 0.4, 0.85, 7],
];
await page.evaluate(() => document.querySelectorAll('.ui').forEach(e => e.style.display = 'none'));
for (const [n, tp, yaw, pitch, dist] of vistas) {
  await page.evaluate(([tp, yaw, pitch, dist]) => { const j = window.__j; j.teleport(tp); j.cam.yaw = yaw; j.cam.pitch = pitch; j.cam.dist = dist; j.step(40, 1 / 30); j.render(); }, [tp, yaw, pitch, dist]);
  await page.screenshot({ path: new URL(`./capturas/${n}.png`, import.meta.url).pathname });
  console.log('📸', n);
}
await browser.close();
