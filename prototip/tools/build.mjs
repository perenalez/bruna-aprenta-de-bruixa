// Monta src/js/*.js (en orden alfabético) dentro de un único IIFE y lo inyecta en src/index.html.
// Genera dist/index.html (three.js desde CDN) y dist/index.local.html (three.js de vendor/, sin internet).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const jsDir = path.join(root, 'src', 'js');
const files = fs.readdirSync(jsDir).filter(f => f.endsWith('.js')).sort();
const js = files.map(f => `/* ===== ${f} ===== */\n` + fs.readFileSync(path.join(jsDir, f), 'utf8')).join('\n');
const bundle = '(()=>{\n' + js + '\n})();';

try { new Function(bundle); }
catch (e) { console.error('Error de sintaxis en el bundle:', e.message); process.exit(1); }

const tpl = fs.readFileSync(path.join(root, 'src', 'index.html'), 'utf8');
const CDN = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
fs.mkdirSync(path.join(root, 'dist'), { recursive: true });
// una versión por demo: index = juego completo; vuelo y turbo = pruebas de mecánicas
const DEMOS = { index: 'juego', vuelo: 'vuelo', turbo: 'turbo' };
for (const [name, demo] of Object.entries(DEMOS)) {
  const b = bundle.split("/*@@DEMO@@*/'juego'").join(`'${demo}'`);
  const html = tpl.split('/*@@BUNDLE@@*/').join(b);   // split/join: evita que "$&" del código se interprete
  fs.writeFileSync(path.join(root, 'dist', name + '.html'), html);
  fs.writeFileSync(path.join(root, 'dist', name + '.local.html'), html.split(CDN).join('../vendor/three.min.js'));
}
// imágenes (portada…): src/img → dist/img
{const src=path.join(root,'src','img'),dst=path.join(root,'dist','img');if(fs.existsSync(src)){fs.mkdirSync(dst,{recursive:true});for(const f of fs.readdirSync(src))fs.copyFileSync(path.join(src,f),path.join(dst,f));}}
console.log(`OK · ${files.length} módulos · ${(bundle.length / 1024).toFixed(0)} KB → dist/{index,vuelo,turbo}.html (+ .local.html)`);
