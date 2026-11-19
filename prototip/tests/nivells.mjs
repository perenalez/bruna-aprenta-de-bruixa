// Zona de proves · «Saltar nivells» (encàrrec pas 4): nivells (només l'1 actiu), partida de prova amb pocions fetes,
// interruptors d'habilitats, «Aplicar» i que no es toca la partida de «Juga».
import { abrirJuego } from './_navegador.mjs';
const fallos = [];
const ok = (c, m) => { if (!c) fallos.push(m); };
const { browser, page, errores } = await abrirJuego({ congelar: false });
await page.evaluate(() => localStorage.setItem('bruna-nivel1-v1', JSON.stringify({ pot: 0, phase: 'inicio', marca: 'partida-real' })));
await page.evaluate(() => sessionStorage.setItem('bruna-proves', '1'));   // contrasenya ja posada
await page.click('#tgo'); await page.click('#tproves [data-go=llista]'); await page.click('#tproves [data-prova=nivells]');
const lv = await page.evaluate(() => [...document.querySelectorAll('#pnv .lv button')].map(b => ({ t: b.textContent, off: b.disabled })));
ok(lv.length === 5, 'hi hauria d\'haver 5 nivells');
ok(!lv[0].off && lv.slice(1).every(b => b.off && /Aviat/.test(b.t)), 'només el nivell 1 hauria d\'estar actiu');
// subnivells: Nivell 1 → una entrada per cada poció
await page.click('#pnv [data-nv="1"]');
const sub = await page.evaluate(() => [...document.querySelectorAll('#pnv [data-poc]')].map(b => b.textContent));
ok(sub.length === 5 && sub[0].startsWith('1.1') && /Arco/.test(sub[0]) && sub[4].startsWith('1.5'), 'no surten els 5 subnivells: ' + sub.join(' | '));
await Promise.all([page.waitForNavigation(), page.click('#pnv [data-poc="3"]')]);
await page.waitForFunction(() => window.__j && window.__j.S && window.__j.NV, null, { timeout: 30000 });
const p3 = await page.evaluate(() => ({ pot: window.__j.GS.pot, ph: window.__j.GS.phase, done: window.__j.GS.done.join(), cl: window.__j.GS.clothes.join(), lab: document.querySelector('#title small').textContent }));
ok(p3.pot === 2 && p3.ph === 'leer' && p3.done === '0,1' && p3.cl === 'barret,vestit', 'el subnivell 1.3 no comença amb la poció 3 i les dues anteriors fetes: ' + JSON.stringify(p3));
ok(/Nivell 1\.3/.test(p3.lab), 'no diu que és el nivell 1.3');
// entrar al nivell 1 amb les pocions 1–4 fetes
const base = page.url().split('?')[0];
await page.goto(base + '?prova=nivell1&fetes=0,1,2,3');
await page.waitForFunction(() => window.__j && window.__j.S && window.__j.NV, null, { timeout: 30000 });
await page.waitForTimeout(800);
const s = await page.evaluate(() => { const j = window.__j; return { pot: j.GS.pot, ph: j.GS.phase, done: j.GS.done, cl: j.GS.clothes, pow: { ...j.POW }, fl: j.FL.state, title: j.TITLE.on,
  chips: [...document.querySelectorAll('#chips button')].filter(b => b.style.display !== 'none').length, boto: !!document.getElementById('pnvb') }; });
ok(!s.title && s.boto, 'la prova no comença directament al joc amb el botó «Proves»');
ok(s.pot === 3 && s.ph === 'fin' && s.done.join() === '0,1,2,3', 'les pocions fetes no queden com a fetes: ' + JSON.stringify(s));
ok(['barret', 'vestit', 'sabates', 'escombra'].every(c => s.cl.includes(c)), 'falten premis: ' + s.cl.join());
ok(s.pow.sol && s.pow.setas && s.pow.turbo && s.pow.escoba && s.pow.plantas && !s.pow.llum, 'els poders no corresponen a les pocions fetes');
ok(s.fl === 'back', 'l\'escombra no és a l\'esquena');
ok(s.chips === 12, 'a la prova haurien de sortir tots els botons de llocs');
// interruptors
await page.click('#pnvb');
const t = await page.evaluate(async () => {
  const j = window.__j, flip = (sel) => { const i = document.querySelector('#pnvp ' + sel); i.checked = !i.checked; i.dispatchEvent(new Event('change', { bubbles: true })); };
  flip('[data-hab=escoba]'); flip('[data-hab=llum]'); flip('[data-roba=sabates]'); flip('[data-roba=gat]');
  await new Promise(r => setTimeout(r, 300));
  return { escoba: j.POW.escoba, broom: j.FL.state, llum: [...document.querySelectorAll('#spells button')].some(b => b.textContent === 'Llum'), sabates: j.nvRoba('sabates'), gat: j.CAT.on };
});
ok(!t.escoba && t.broom === 'stand', 'no es pot treure l\'escombra');
ok(t.llum, 'en activar «Llum» no surt a la vareta');
ok(!t.sabates, 'no es poden treure les sabates màgiques');
ok(t.gat, 'no es pot activar el gat');
// aplicar pocions: marcar la 5a i tornar a començar
await page.evaluate(() => { const i = document.querySelector('#pnvp [data-pot="4"]'); i.checked = true; i.dispatchEvent(new Event('change', { bubbles: true })); });
await Promise.all([page.waitForNavigation(), page.click('#pnvp .apply')]);
await page.waitForFunction(() => window.__j && window.__j.S && window.__j.NV, null, { timeout: 30000 });
const a = await page.evaluate(() => ({ url: location.search, done: window.__j.GS.done, gat: window.__j.CAT.on, partida: JSON.parse(localStorage.getItem('bruna-nivel1-v1')).marca }));
ok(/fetes=0,1,2,3,4/.test(a.url) && a.done.length === 5 && a.gat, '«Aplicar» no torna a començar amb les 5 pocions fetes');
ok(a.partida === 'partida-real', 'la prova ha sobreescrit la partida de «Juga»');
await browser.close();
if (errores.length) fallos.push('Errors:\n' + errores.join('\n'));
if (fallos.length) { console.error('✗ Nivells:\n- ' + fallos.join('\n- ')); process.exit(1); }
console.log('✓ Nivells: nivell 1 actiu, subnivells per poció, pocions fetes amb premis i poders, interruptors, «Aplicar» i partida intacta');
