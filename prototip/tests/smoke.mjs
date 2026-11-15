// Carga el juego, deja correr unos segundos y falla si hay errores de JavaScript.
import { abrirJuego } from './_navegador.mjs';
const { browser, page, errores } = await abrirJuego({ congelar: false });
await page.waitForTimeout(3000);
const estado = await page.evaluate(() => ({ modo: window.__j.mode, zona: document.getElementById('cnt').textContent }));
await browser.close();
if (errores.length) { console.error('✗ Errores:\n' + errores.join('\n')); process.exit(1); }
console.log('✓ Carga sin errores', estado);
