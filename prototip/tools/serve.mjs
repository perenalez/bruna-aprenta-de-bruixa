// Servidor estático mínimo (sin dependencias). Uso: node tools/serve.mjs [puerto]
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const port = Number(process.argv[2]) || 5173;
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.jpg': 'image/jpeg', '.png': 'image/png', '.json': 'application/json' };
http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  if (p === '/') p = '/dist/index.local.html';
  let f = path.join(root, p);
  if (!fs.existsSync(f) && fs.existsSync(path.join(root, 'dist', p))) f = path.join(root, 'dist', p);   // img/… junto al juego
  if (!f.startsWith(root) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); return res.end('404'); }
  res.writeHead(200, { 'Content-Type': types[path.extname(f)] || 'application/octet-stream' });
  fs.createReadStream(f).pipe(res);
}).listen(port, () => console.log(`http://localhost:${port}  (también accesible desde el móvil en la misma red con la IP del ordenador)`));
