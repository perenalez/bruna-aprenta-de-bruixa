// Arranca Chromium (Playwright) y abre el juego en modo de prueba: el bucle propio queda congelado
// y el tiempo se avanza a mano con window.__j.step(n, dt).
import { chromium } from 'playwright';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export async function abrirJuego({ width = 430, height = 860, congelar = true, demo = 'index' } = {}) {
  const browser = await chromium.launch({
    executablePath: process.env.CHROME_PATH || undefined,
    args: [...(process.env.NO_SANDBOX ? ['--no-sandbox'] : []), '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'],
  });
  const page = await browser.newPage({ viewport: { width, height } });
  const errores = [];
  page.on('pageerror', e => errores.push(e.message));
  page.on('console', m => { if (m.type() === 'error') errores.push(m.text()); });
  await page.goto(pathToFileURL(path.join(root, 'dist', demo + '.local.html')).href);
  await page.waitForFunction(() => window.__j && window.__j.S, null, { timeout: 30000 });
  await page.waitForTimeout(800);
  if (congelar) await page.evaluate(() => { window.requestAnimationFrame = () => 0; });
  return { browser, page, errores };
}
