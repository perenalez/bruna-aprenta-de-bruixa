// Prova automàtica de «moviment estil Alba» (Playwright + SwiftShader, com la resta de tests).
// Ús: node proves/alba/construir.mjs && node proves/alba/test.mjs
// Comprova: carrega sense errors, camina, corre més ràpid, salta i aterra, l'herba s'aparta
// (uniform uPlayer segueix el personatge) i desa captures a proves/alba/captures/.
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..', '..');
const outDir = path.join(here, 'captures'); fs.mkdirSync(outDir, { recursive: true });
const ok = (c, m) => { if (!c) { console.error('✗ ' + m); process.exitCode = 1; } else console.log('✓ ' + m); };

const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH || undefined,
  args: [...(process.env.NO_SANDBOX ? ['--no-sandbox'] : []), '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'],
});
const errores = [];
async function obrir(width, height, touch = false) {
  const ctx = await browser.newContext({ viewport: { width, height }, hasTouch: touch, isMobile: touch });
  const page = await ctx.newPage();
  page.on('pageerror', e => errores.push(e.message));
  page.on('console', m => { if (m.type() === 'error') errores.push(m.text()); });
  await page.goto(pathToFileURL(path.join(root, 'dist', 'prova-alba.local.html')).href);
  await page.waitForFunction(() => window.__alba && window.__alba.llest, null, { timeout: 120000 });
  await page.evaluate(() => { window.requestAnimationFrame = () => 0; });
  await page.waitForTimeout(300);
  return page;
}

const page = await obrir(1280, 720);
const p0 = await page.evaluate(() => ({ x: __alba.pl.x, z: __alba.pl.z }));
// caminar 1 s cap endavant
await page.evaluate(() => { __alba.input(0, -1, .5); __alba.step(60); });
const p1 = await page.evaluate(() => ({ x: __alba.pl.x, z: __alba.pl.z, sp: __alba.pl.sp }));
const dWalk = Math.hypot(p1.x - p0.x, p1.z - p0.z);
ok(dWalk > 1.2 && dWalk < 3, `camina (${dWalk.toFixed(2)} m en 1 s)`);
// córrer 1 s
await page.evaluate(() => { __alba.input(0, -1, 1); __alba.step(60); });
const p2 = await page.evaluate(() => ({ x: __alba.pl.x, z: __alba.pl.z, sp: __alba.pl.sp }));
ok(p2.sp > p1.sp * 1.6, `corre més ràpid (${p1.sp.toFixed(2)} → ${p2.sp.toFixed(2)} m/s)`);
await page.evaluate(() => __alba.render());
await page.screenshot({ path: path.join(outDir, '1_corrent.png') });
// l'herba rep la posició del personatge
const herba = await page.evaluate(() => { let n = 0; __alba.scene.traverse(o => { if (o.isInstancedMesh) n += o.count; });
  const u = __alba.VENT.uPlayer.value; return { n, d: Math.hypot(u.x - __alba.pl.x, u.z - __alba.pl.z), t: __alba.tCarrega }; });
ok(herba.n > 5000, `herba i flors instanciades (${herba.n} matolls)`);
ok(herba.d < .01, "l'herba sap on és el personatge (s'aparta al seu pas)");
console.log(`· temps de càrrega en headless (sense GPU): ${(herba.t / 1000).toFixed(1)} s`);
// saltar i aterrar
await page.evaluate(() => { __alba.input(0, 0, 0); __alba.step(40); __alba.saltar(); __alba.step(12); });
const air = await page.evaluate(() => ({ g: __alba.pl.grounded, h: __alba.pl.y - __alba.pl.gh }));
ok(!air.g && air.h > .3, `salta (${air.h.toFixed(2)} m sobre el terra)`);
await page.evaluate(() => __alba.render());
await page.screenshot({ path: path.join(outDir, '2_salt.png') });
await page.evaluate(() => __alba.step(120));
const land = await page.evaluate(() => __alba.pl.grounded);
ok(land, 'aterra');
// vista del món
await page.evaluate(() => { __alba.teleport(0, 11); __alba.camara(0.52, 0.2, 8); __alba.step(90); __alba.render(); });
await page.screenshot({ path: path.join(outDir, '3_mon.png') });
// primer pla de cada personatge (0 = Bruna del joc, 1 = Bruixa esculpida)
const noms = [];
for (const i of [0, 1]) {
  noms.push(await page.evaluate(i => __alba.personatge(i), i));
  await page.evaluate(() => { __alba.input(0, -1, .5); __alba.step(30); __alba.input(0, 0, 0); __alba.camara(Math.PI + 2.2, .15, 2.6); __alba.step(60); __alba.render(); });
  await page.screenshot({ path: path.join(outDir, `4_personatge_${i}.png`) });
  await page.evaluate(() => { __alba.input(-1, 0, 1); __alba.camara(Math.PI + 1.2, .15, 3); __alba.step(25); __alba.render(); });
  await page.screenshot({ path: path.join(outDir, `4_personatge_${i}_corrent.png`) });
  await page.evaluate(() => __alba.input(0, 0, 0));
}
ok(noms.join() === 'Bruna,Bruixa', `personatges disponibles: ${noms.join(' i ')}`);
await page.evaluate(() => __alba.personatge(0));
// botó «Motor: nou / actual»: canvia el render i l'herba deixa de moure's; «Sortir» torna a la llista de proves del joc
const mo = await page.evaluate(() => { const b = document.getElementById('motor'); const t0 = __alba.VENT.uTime.value;
  b.click(); __alba.step(30); __alba.render(); const r = { m: __alba.motor, txt: b.textContent, quieta: __alba.VENT.uTime.value === t0 || true, blur: getComputedStyle(document.getElementById('post')).display };
  const tA = __alba.VENT.uTime.value; __alba.step(30); r.ventAturat = __alba.VENT.uTime.value === tA;
  b.click(); __alba.step(30); r.torna = __alba.motor; r.ventMou = __alba.VENT.uTime.value !== tA; return r; });
ok(mo.m === 'actual' && mo.txt === 'Motor: actual' && mo.blur === 'none' && mo.ventAturat, 'el botó «Motor» passa al motor actual (sense postprocés i amb l\'herba quieta)');
ok(mo.torna === 'nou' && mo.ventMou, 'el botó «Motor» torna al motor nou');
await Promise.all([page.waitForNavigation({ timeout: 15000 }).catch(() => {}), page.evaluate(() => document.getElementById('sortir').click())]);
ok(/index(\.local)?\.html\?prova=zona/.test(page.url()), '«Sortir» torna a la llista de proves del joc (' + page.url().split('/').pop() + ')');
// mòbil horitzontal
const mob = await obrir(844, 390, true);
await mob.evaluate(() => { __alba.camara(-1.9, .3, 6); __alba.input(1, 0, 1); __alba.step(60); __alba.saltar(); __alba.step(10); __alba.render(); });
await mob.screenshot({ path: path.join(outDir, '5_mobil.png') });

ok(errores.length === 0, 'sense errors' + (errores.length ? ': ' + errores.join(' | ') : ''));
await browser.close();
