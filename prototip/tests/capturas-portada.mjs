// Captura de la portada (mòbil vertical i ordinador) i comparació al costat de la imatge de referència.
// Ús: node tools/build.mjs && node tests/capturas-portada.mjs  → docs/portada/*.png
import { abrirJuego } from './_navegador.mjs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = f => path.join(root, 'docs/portada', f);
for (const [w, h, f] of [[390, 844, 'movil.png'], [1200, 720, 'ordinador.png']]) {
  const { browser, page } = await abrirJuego({ width: w, height: h, congelar: false });
  await page.waitForTimeout(2500);
  await page.screenshot({ path: out(f) });
  await browser.close();
}
const { browser, page } = await abrirJuego({ width: 900, height: 900, congelar: true });
const ref = pathToFileURL(path.join(root, '..', 'referencias', 'portada-referencia.png')).href, mov = pathToFileURL(out('movil.png')).href;
await page.setContent(`<body style="margin:0;background:#2a2238;font:600 18px system-ui;color:#fff;display:flex;gap:24px;padding:20px;align-items:flex-start">
<figure style="margin:0;text-align:center"><img src="${ref}" style="height:820px;width:auto;clip-path:inset(11.4% 0 11.6% 0);margin:-94px 0 -96px"><figcaption>Referència</figcaption></figure>
<figure style="margin:0;text-align:center"><img src="${mov}" style="height:820px"><figcaption>Portada nova (3D)</figcaption></figure></body>`);
await page.waitForTimeout(500);
await page.screenshot({ path: out('comparacio.png'), fullPage: true });
await browser.close();
console.log('✓ Captures a docs/portada/');
