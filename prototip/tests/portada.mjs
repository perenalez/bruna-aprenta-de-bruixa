// Portada (encàrrec v.1, pas 1): textos en català, crèdits, v.1, zona de proves amb «Testejar» i la llista
// de proves desactivades amb «Aviat», «Tornar», i que «Juga» comença el joc igual que abans.
import { abrirJuego } from './_navegador.mjs';
const { browser, page, errores } = await abrirJuego({ congelar: false });
const fallos = [];
const ok = (c, m) => { if (!c) fallos.push(m); };
await page.waitForTimeout(1200);
const t = await page.evaluate(() => ({
  on: window.__j.TITLE.on,
  texto: document.getElementById('tscreen')?.innerText || '',
  ver: document.getElementById('tver')?.textContent,
  hud: getComputedStyle(document.getElementById('joy')).visibility,
  bruna: !!window.__j.TS.bruna, star: !!window.__j.TS.star, uni: !!window.__j.TS.uni, conill: !!window.__j.TS.bunny,
}));
ok(t.on, 'la portada no surt');
for (const s of ['Hola! Benvingudes a la nostra aventura!', 'Bruna,', "l'aprenenta de bruixa", 'Segueix les passes fins convertir-te en una bruixa de veritat!', 'Juga', 'Accedir a la zona de proves', 'Un joc creat per Ayla Sainz i Pere Nadal'])
  ok(t.texto.includes(s), 'falta el text: ' + s);
ok(!/Laia/.test(t.texto), 'surt «Laia» en lloc d\'«Ayla»');
ok(t.ver === 'v.1.2', 'la versió no és v.1.2');
ok(t.hud === 'hidden', 'els controls del joc es veuen a la portada');
ok(t.bruna && t.star && t.uni && t.conill, 'falten models a l\'escena de la portada');
// zona de proves → Testejar → llista → Tornar
await page.click('#tgo');
const z = await page.evaluate(() => ({ on: document.getElementById('tproves').classList.contains('on'), txt: document.getElementById('tproves').innerText }));
ok(z.on && z.txt.includes('Testejar'), 'la zona de proves no s\'obre');
await page.click('#tproves [data-go=llista]');
const l = await page.evaluate(() => [...document.querySelectorAll('#tproves li button')].map(b => ({ t: b.innerText, off: b.disabled })));
ok(l.length === 4, 'la llista hauria de tenir 4 proves');
ok(l.some(b => b.t.includes('Crea el teu personatge') && !b.off), '«Crea el teu personatge» no està activada');
for (const n of ['Saltar nivells', 'Nou motor de render', 'Moviment estil Alba'])
  ok(l.some(b => b.t.includes(n) && b.t.includes('Aviat') && b.off), 'prova no desactivada o sense «Aviat»: ' + n);
await page.click('#tproves [data-go=zona]');
ok(await page.evaluate(() => document.getElementById('tproves').innerText.includes('Testejar')), '«Tornar» no torna a la zona');
await page.click('#tproves [data-go=""]');
ok(await page.evaluate(() => !document.getElementById('tproves').classList.contains('on') && window.__j.TITLE.on), '«Tornar» no torna a la portada');
// Juga: comença el joc com abans
await page.click('#tplay', { force: true });
await page.waitForFunction(() => !document.getElementById('tscreen'), null, { timeout: 15000 }).catch(() => {});
const g = await page.evaluate(() => ({ on: window.__j.TITLE.on, ts: !!document.getElementById('tscreen'), pr: !!document.getElementById('tproves'), ver: !!document.getElementById('tver'),
  hud: getComputedStyle(document.getElementById('joy')).visibility, fov: window.__j.camera.fov, intro: window.__j.INTRO.on }));
ok(!g.on && !g.ts && !g.pr && !g.ver, 'la portada no desapareix en prémer «Juga» ' + JSON.stringify(g));
ok(g.intro && g.hud === 'hidden', 'en començar no fa la volta de 360° amb els controls amagats');
await page.mouse.click(200, 300);
await page.waitForTimeout(300);
const f = await page.evaluate(() => ({ intro: window.__j.INTRO.on, hud: getComputedStyle(document.getElementById('joy')).visibility, dist: window.__j.cam.dist }));
ok(!f.intro && f.hud !== 'hidden', 'tocar la pantalla no salta la volta o els controls no tornen');
ok(Math.abs(f.dist - 7.6) < 0.01, 'la càmera no queda a la distància nova per defecte (7.6)');
ok(Math.abs(g.fov - 38) < 0.01, 'la càmera del joc no torna al seu angle');
await browser.close();
if (errores.length) fallos.push('Errors:\n' + errores.join('\n'));
if (fallos.length) { console.error('✗ Portada:\n- ' + fallos.join('\n- ')); process.exit(1); }
console.log('✓ Portada: textos, v.1.2, zona de proves (personatge actiu, 3 «Aviat»), Tornar, Juga i volta de 360°');
