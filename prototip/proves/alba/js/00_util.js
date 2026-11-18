/* =====================================================================
   PRUEBA «ESTIL ALBA» — utilidades comunes
   Three.js r128 (global THREE). Todo el paquete comparte un solo IIFE.
   ===================================================================== */
const TAU = Math.PI * 2;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const lerp = (a, b, t) => a + (b - a) * t;
const smooth = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
const sstep = t => t * t * (3 - 2 * t);
// amortiguación independiente de los fps: acerca a → b con velocidad k (1/s)
const damp = (a, b, k, dt) => lerp(a, b, 1 - Math.exp(-k * dt));
const C = h => new THREE.Color(h);

function hash2(i, j) { let h = (Math.imul(i, 374761393) + Math.imul(j, 668265263)) | 0; h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0) / 4294967296; }
function hash3(i, j, k) { let h = (Math.imul(i, 374761393) + Math.imul(j, 668265263) + Math.imul(k, 1440662683)) | 0; h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0) / 4294967296; }
function vnoise(x, y) { const i = Math.floor(x), j = Math.floor(y), u = sstep(x - i), v = sstep(y - j); const a = hash2(i, j), b = hash2(i + 1, j), c = hash2(i, j + 1), d = hash2(i + 1, j + 1); return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v; }
function vnoise3(x, y, z) {
  const i = Math.floor(x), j = Math.floor(y), k = Math.floor(z), u = sstep(x - i), v = sstep(y - j), w = sstep(z - k);
  return lerp(lerp(lerp(hash3(i, j, k), hash3(i + 1, j, k), u), lerp(hash3(i, j + 1, k), hash3(i + 1, j + 1, k), u), v),
    lerp(lerp(hash3(i, j, k + 1), hash3(i + 1, j, k + 1), u), lerp(hash3(i, j + 1, k + 1), hash3(i + 1, j + 1, k + 1), u), v), w);
}
function fbm2(x, y, o = 4) { let s = 0, a = .5, f = 1, n = 0; for (let i = 0; i < o; i++) { s += vnoise(x * f, y * f) * a; n += a; a *= .5; f *= 2.03; } return s / n; }
function rngf(seed) { return function () { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }

// Fusiona geometrías (no indexadas) que tengan position, normal y color.
// r128 no trae BufferGeometryUtils en el núcleo, por eso va aquí.
function fusionar(list) {
  const gs = list.map(g => g.index ? g.toNonIndexed() : g);
  let n = 0; gs.forEach(g => n += g.attributes.position.count);
  const pos = new Float32Array(n * 3), nor = new Float32Array(n * 3), col = new Float32Array(n * 3);
  let o = 0;
  for (const g of gs) {
    if (!g.attributes.normal) g.computeVertexNormals();
    const c = g.attributes.position.count;
    pos.set(g.attributes.position.array.subarray(0, c * 3), o * 3);
    nor.set(g.attributes.normal.array.subarray(0, c * 3), o * 3);
    if (g.attributes.color) col.set(g.attributes.color.array.subarray(0, c * 3), o * 3); else col.fill(1, o * 3, (o + c) * 3);
    o += c;
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  g.setAttribute('normal', new THREE.BufferAttribute(nor, 3));
  g.setAttribute('color', new THREE.BufferAttribute(col, 3));
  return g;
}
// pinta toda una geometría de un color (atributo color por vértice)
function pintar(g, hex) { const c = C(hex), n = g.attributes.position.count, a = new Float32Array(n * 3); for (let i = 0; i < n; i++) { a[i * 3] = c.r; a[i * 3 + 1] = c.g; a[i * 3 + 2] = c.b; } g.setAttribute('color', new THREE.BufferAttribute(a, 3)); return g; }
