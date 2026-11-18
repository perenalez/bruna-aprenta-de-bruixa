// Monta la prueba «moviment estil Alba» igual que tools/build.mjs monta el juego:
// proves/alba/js/*.js (orden alfabético) dentro de un único IIFE, inyectado en proves/alba/index.html.
// Salida: dist/prova-alba.html (three r128 desde CDN) y dist/prova-alba.local.html (vendor/three.min.js).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..', '..');            // prototip/
const jsDir = path.join(here, 'js');
const files = fs.readdirSync(jsDir).filter(f => f.endsWith('.js')).sort();
// --- la Bruna del juego: se copia de src/js en cada montaje (siempre la versión actual) ---
function brunaJoc() {
  try {
    const util = fs.readFileSync(path.join(root, 'src', 'js', '01_utilidades.js'), 'utf8');
    const mod = fs.readFileSync(path.join(root, 'src', 'js', '40_bruna_modelo.js'), 'utf8');
    const u1 = util.indexOf('const mk='), u2 = util.indexOf('const mRab=');
    const m1 = mod.indexOf('const L1='), m2 = mod.indexOf('const B=buildBruna()');
    if (u1 < 0 || u2 < 0 || m1 < 0 || m2 < 0) throw new Error('no trobo buildBruna() o les utilitats');
    return `/* ===== Bruna del joc (copiada de src/js/01_utilidades.js i 40_bruna_modelo.js) ===== */
const BRUNA_JOC = (() => {
  const PI = Math.PI, TAU = Math.PI * 2;
  const LM = (c, o) => new THREE.MeshLambertMaterial(Object.assign({ color: c }, o || {}));
${util.slice(u1, u2)}
${mod.slice(m1, m2)}
  return { build: buildBruna, STAND, HIPW };
})();`;
  } catch (e) {
    console.warn('Avís: la prova es munta sense la Bruna del joc (' + e.message + ')');
    return 'const BRUNA_JOC = null;';
  }
}
const js = files.map(f => (f.startsWith('45_') ? brunaJoc() + '\n' : '') + `/* ===== ${f} ===== */\n` + fs.readFileSync(path.join(jsDir, f), 'utf8')).join('\n');
const bundle = '(()=>{\n' + js + '\n})();';
try { new Function(bundle); } catch (e) { console.error('Error de sintaxis en la prueba Alba:', e.message); process.exit(1); }
const html = fs.readFileSync(path.join(here, 'index.html'), 'utf8').split('/*@@BUNDLE@@*/').join(bundle);
const CDN = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
fs.mkdirSync(path.join(root, 'dist'), { recursive: true });
fs.writeFileSync(path.join(root, 'dist', 'prova-alba.html'), html);
fs.writeFileSync(path.join(root, 'dist', 'prova-alba.local.html'), html.split(CDN).join('../vendor/three.min.js'));
console.log(`OK · prova Alba · ${files.length} mòduls · ${(bundle.length / 1024).toFixed(0)} KB → dist/prova-alba(.local).html`);
