// Zona de proves · «Crea el teu personatge» (encàrrec pas 3): pestanyes, fitxes, normes de combinació,
// aleatori, desat al dispositiu i «Fet!» (partida de prova que no desa la partida de «Juga»).
import { abrirJuego } from './_navegador.mjs';
const fallos = [];
const ok = (c, m) => { if (!c) fallos.push(m); };
const { browser, page, errores } = await abrirJuego({ congelar: false });
await page.evaluate(() => { localStorage.removeItem('bruna-personatge-v1'); localStorage.setItem('bruna-nivel1-v1', JSON.stringify({ pot: 0, phase: 'inicio', marca: 'partida-real' })); });
// s'obre des de la zona de proves
await page.click('#tgo');
await page.click('#tproves [data-go=llista]');
await page.click('#tproves [data-prova=personatge]');
await page.waitForTimeout(800);
const r = await page.evaluate(async () => {
  const j = window.__j, out = { open: j.PCR.open };
  out.tabs = [...document.querySelectorAll('#pcre .tabs button')].map(b => b.textContent);
  out.n = {};
  for (const t of ['pell', 'pentinat', 'cabell', 'roba', 'bruixa', 'compl', 'sabates', 'mitjons']) {
    document.querySelector(`#pcre [data-tab=${t}]`).click(); out.n[t] = document.querySelectorAll('#pcre .grid .it').length;
  }
  await new Promise(r => setTimeout(r, 1500));
  out.thumbs = [...document.querySelectorAll('#pcre .grid img')].filter(i => i.src.startsWith('data:image/png')).length;
  // normes
  const L = j.PCR.look, pick = (tab, id) => { j.PCR.tab = tab; document.querySelector(`#pcre [data-tab=${tab}]`).click(); document.querySelector(`#pcre [data-it=${id}]`).click(); };
  pick('roba', 'flors'); pick('roba', 'texans'); pick('roba', 'vpics'); out.sencer = [L.sl.dalt, L.sl.baix, L.sl.sencer];
  pick('roba', 'cotxes'); out.dalt = [L.sl.dalt, L.sl.sencer];
  pick('compl', 'gorro'); pick('bruixa', 'bestrella'); out.cap = L.sl.cap;
  pick('mitjons', 'blaus'); pick('bruixa', 'mliles'); out.mitges = L.sl.mitjons;
  pick('compl', 'urodones'); pick('compl', 'pcolors'); pick('compl', 'arracades'); out.multi = [L.sl.ulleres, L.sl.polsc, L.sl.arrac, L.sl.cap];
  pick('sabates', L.sl.sabates || 'vambes'); out.descalc = L.sl.sabates;
  document.querySelector('#pcre [data-tab=nom]').click(); const inp = document.getElementById('pcnom'); inp.value = 'Ayla'; inp.dispatchEvent(new Event('input'));
  out.desat = JSON.parse(localStorage.getItem('bruna-personatge-v1') || '{}');
  // aleatori: 30 personatges vàlids
  let bons = 0; for (let i = 0; i < 30; i++) { const R = j.pcRandom(); const ok1 = !(R.sl.sencer && (R.sl.dalt || R.sl.baix)) && R.pell && R.pentinat && R.cabell; try { j.buildDoll(R); if (ok1) bons++; } catch (e) { out.err = e.message; } }
  out.random = bons;
  return out;
});
ok(r.open, 'el creador no s\'obre des de la zona de proves');
ok(r.tabs.join() === 'Nom,Pell,Pentinat,Cabell,Roba,Bruixa,Complements,Sabates,Mitjons', 'pestanyes: ' + r.tabs.join());
for (const t in r.n) ok(r.n[t] === 10, `la pestanya ${t} no té 10 opcions (${r.n[t]})`);
ok(r.thumbs >= 4, 'no es fan les miniatures de les fitxes');
ok(!r.sencer[0] && !r.sencer[1] && r.sencer[2] === 'vpics', 'el vestit sencer no substitueix dalt i baix');
ok(r.dalt[0] === 'cotxes' && !r.dalt[1], 'una peça de dalt no treu el vestit sencer');
ok(r.cap === 'bestrella', 'el barret no substitueix el gorro');
ok(r.mitges === 'mliles', 'les mitges no substitueixen els mitjons');
ok(r.multi[0] === 'urodones' && r.multi[1] === 'pcolors' && r.multi[2] === 'arracades', 'no es poden combinar diversos complements');
ok(!r.descalc, 'no es poden treure les sabates');
ok(r.desat.nom === 'Ayla' && r.desat.sl && r.desat.sl.dalt === 'cotxes', 'el personatge no es desa al dispositiu');
ok(r.random === 30, 'l\'aleatori fa personatges no vàlids ' + (r.err || ''));
// Fet!: partida de prova al clar de l'estany, sense desar la partida de «Juga»
await page.click('#pcre [data-a=ok]');
await page.waitForTimeout(1500);
const f = await page.evaluate(async () => {
  const j = window.__j; j.input.y = 1; await new Promise(r => setTimeout(r, 800)); const sp = j.S.speed; j.input.y = 0;
  j.GS.pot = 3; j.GS.places.push('Casa'); try { j.giveIngredient && 0; } catch (e) {}
  return { prova: j.TITLE.on === false, brunaAmagada: !j.B.root.visible, ninot: !!j.PCR.game && !!j.PCR.game.root.parent, sp, nom: document.querySelector('#title b').textContent,
    zona: document.getElementById('cnt') && document.getElementById('cnt').textContent, partida: JSON.parse(localStorage.getItem('bruna-nivel1-v1')).marca,
    sync: Math.abs(j.PCR.game.legL.hip.rotation.x - j.B.legL.hip.rotation.x) < 1e-6 };
});
ok(f.prova && f.brunaAmagada && f.ninot, 'en prémer «Fet!» no surt el personatge al joc');
ok(f.sp > 0.1 && f.sync, 'el personatge no es mou amb els controls');
ok(f.nom === 'Ayla', 'no surt el nom del personatge');
ok(/estany/.test(f.zona || ''), 'no apareix al clar de l\'estany (' + f.zona + ')');
ok(f.partida === 'partida-real', 'la prova ha sobreescrit la partida de «Juga»');
await browser.close();
if (errores.length) fallos.push('Errors:\n' + errores.join('\n'));
if (fallos.length) { console.error('✗ Personatge:\n- ' + fallos.join('\n- ')); process.exit(1); }
console.log('✓ Personatge: 9 pestanyes amb 10 opcions, miniatures, normes, aleatori, desat i «Fet!» sense tocar la partida');
