// Captures de «Crea el teu personatge» → docs/personatge/
import { abrirJuego } from './_navegador.mjs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const out = f => path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'docs/personatge', f);
const { browser, page } = await abrirJuego({ congelar: false });
await page.evaluate(() => localStorage.setItem('bruna-personatge-v1', JSON.stringify({ nom: 'Ayla', pell: 'oliva', pentinat: 'trenes', cabell: 'pelroig', sl: { dalt: 'estelada', baix: 'volants', cap: 'dgat', capa: 'cmorada', mitjons: 'marc', sabates: 'crocs', polsc: 'pcolors' } })));
await page.evaluate(() => window.__j.openCreator());
for (const t of ['pentinat', 'roba', 'bruixa', 'compl']) {
  await page.click(`#pcre [data-tab=${t}]`); await page.waitForTimeout(2500); await page.screenshot({ path: out(`creador-${t}.png`) });
}
await page.click('#pcre [data-a=ok]'); await page.waitForTimeout(1500);
await page.evaluate(() => { const j = window.__j; j.cam.dist = 3.4; j.cam.yaw = 2.7; j.cam.pitch = 0.25; j.setHour(12); });
await page.waitForTimeout(1500); await page.screenshot({ path: out('joc.png') });
await browser.close(); console.log('✓ Captures a docs/personatge/');
