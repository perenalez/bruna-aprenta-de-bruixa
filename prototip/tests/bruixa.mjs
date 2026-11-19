// La Gran Bruixa (prova): a «Provar nivells» 1.1 espera la Bruna a la sala del tron i és ella qui parla.
// Al joc normal encara no hi és (la veu continua sent la del torreó fins que en Pere ho aprovi).
import { abrirJuego } from './_navegador.mjs';
const fallos = [];
const ok = (c, m) => { if (!c) fallos.push(m); };
const { browser, page, errores } = await abrirJuego({ congelar: false });
const normal = await page.evaluate(() => ({ on: window.__j.GBX.on, veu: document.title && true }));
ok(!normal.on, 'la Gran Bruixa surt al joc normal (de moment només a les proves)');
await page.goto(page.url().split('?')[0] + '?prova=nivell1&poc=1', { timeout: 120000 });
await page.waitForFunction(() => window.__j && window.__j.GBX && window.__j.S, null, { timeout: 120000 });
const r = await page.evaluate(async () => {
  const j = window.__j; window.requestAnimationFrame = () => 0;
  const out = { on: j.GBX.on, ph: j.GS.phase, alSaló: !!j.GBX.g && j.GBX.g.parent && j.GBX.g.parent.visible !== undefined };
  j.teleport('Trono'); j.step(40); await new Promise(r => setTimeout(r, 200)); j.step(20);
  const d = document.getElementById('dlg'); out.qui = d.querySelector('b').textContent; out.text = d.querySelector('p').textContent; out.parla = j.GBX.talk;
  return out;
});
ok(r.on && r.alSaló, 'la Gran Bruixa no és a la sala del tron a la prova 1.1');
ok(r.ph === 'inicio' || r.ph === 'leer', 'la prova 1.1 no comença abans que l\'encarregui la poció 1');
ok(r.qui === 'La Gran Bruixa' && /esperant/.test(r.text), 'no és la Gran Bruixa qui parla: ' + r.qui);
ok(r.parla > 0.4, 'la Gran Bruixa no mou la boca ni fa gestos mentre parla');
await browser.close();
if (errores.length) fallos.push('Errors:\n' + errores.join('\n'));
if (fallos.length) { console.error('✗ Bruixa:\n- ' + fallos.join('\n- ')); process.exit(1); }
console.log('✓ Bruixa: a la sala del tron a la prova 1.1, parla ella, mou la boca i fa gestos; no surt al joc normal');
