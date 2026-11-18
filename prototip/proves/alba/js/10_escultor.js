/* =====================================================================
   ESCULTOR SDF — modelar con «arcilla» desde código
   ---------------------------------------------------------------------
   Se describe la pieza como una función de distancia (SDF): primitivas
   (esfera, elipsoide, cápsula) unidas con mezcla suave. Luego se extrae
   la superficie con «surface nets» → una única malla orgánica, sin las
   costuras de esferas y cilindros. Normales del gradiente (suaves) y
   color por vértice según qué primitiva manda en cada punto.

   Uso:
     const geo = esculpir((x,y,z)=>{ R0(); U(sEll(...), id); U(sCap(...), id2, .03); return D; },
                          pintura|null, [xmin,ymin,zmin], [xmax,ymax,zmax], paso, paleta);
   - U(d, id, k): unión (suave si k>0). SUB(d, k): resta.
   - pintura(x,y,z,id) → id: permite pintar zonas (mejillas, rayas…).
   - paso: tamaño de celda en metros (0.006–0.009 para un personaje).
   Pensado también para «Crea el teu personatge»: cada peinado o prenda
   puede ser una función SDF que se esculpe al elegirla.
   ===================================================================== */
let D = 1e9, ID = 0;
function R0() { D = 1e9; ID = 0; }
function U(d, id, k = 0) {
  if (k > 0) { const h = Math.max(k - Math.abs(D - d), 0) / k; const nd = Math.min(D, d) - h * h * k * .25; if (d < D) ID = id; D = nd; }
  else if (d < D) { D = d; ID = id; }
}
function SUB(d, k = 0) {
  if (k > 0) { const h = Math.max(k - Math.abs(D + d), 0) / k; D = Math.max(D, -d) + h * h * k * .25; } else D = Math.max(D, -d);
}
const len3 = (x, y, z) => Math.sqrt(x * x + y * y + z * z);
function sSph(x, y, z, cx, cy, cz, r) { return len3(x - cx, y - cy, z - cz) - r; }
function sEll(x, y, z, cx, cy, cz, rx, ry, rz) {
  const px = (x - cx) / rx, py = (y - cy) / ry, pz = (z - cz) / rz;
  const k0 = len3(px, py, pz), k1 = len3(px / rx, py / ry, pz / rz);
  return k0 * (k0 - 1) / (k1 || 1e-6);
}
// cápsula entre a y b con radio r1→r2
function sCap(x, y, z, ax, ay, az, bx, by, bz, r1, r2 = r1) {
  const px = x - ax, py = y - ay, pz = z - az, bxa = bx - ax, bya = by - ay, bza = bz - az;
  const h = clamp((px * bxa + py * bya + pz * bza) / (bxa * bxa + bya * bya + bza * bza), 0, 1);
  return len3(px - bxa * h, py - bya * h, pz - bza * h) - lerp(r1, r2, h);
}

function esculpir(fn, paint, b0, b1, h, pal) {
  const nx = Math.ceil((b1[0] - b0[0]) / h) + 1, ny = Math.ceil((b1[1] - b0[1]) / h) + 1, nz = Math.ceil((b1[2] - b0[2]) / h) + 1;
  const F = new Float32Array(nx * ny * nz);
  let p = 0;
  for (let k = 0; k < nz; k++) { const z = b0[2] + k * h; for (let j = 0; j < ny; j++) { const y = b0[1] + j * h; for (let i = 0; i < nx; i++) F[p++] = fn(b0[0] + i * h, y, z); } }
  const cx = nx - 1, cy = ny - 1, cz = nz - 1;
  const VI = new Int32Array(cx * cy * cz).fill(-1);
  const pos = [];
  const CO = [[0, 0, 0], [1, 0, 0], [0, 1, 0], [1, 1, 0], [0, 0, 1], [1, 0, 1], [0, 1, 1], [1, 1, 1]];
  const ED = [[0, 1], [2, 3], [4, 5], [6, 7], [0, 2], [1, 3], [4, 6], [5, 7], [0, 4], [1, 5], [2, 6], [3, 7]];
  const v = new Float32Array(8);
  for (let k = 0; k < cz; k++) for (let j = 0; j < cy; j++) for (let i = 0; i < cx; i++) {
    let mask = 0;
    for (let c = 0; c < 8; c++) { const o = CO[c]; v[c] = F[(i + o[0]) + nx * ((j + o[1]) + ny * (k + o[2]))]; if (v[c] < 0) mask |= 1 << c; }
    if (mask === 0 || mask === 255) continue;
    let sx = 0, sy = 0, sz = 0, n = 0;
    for (const [a, b] of ED) {
      if (((mask >> a) & 1) !== ((mask >> b) & 1)) {
        const t = v[a] / (v[a] - v[b]), A = CO[a], B = CO[b];
        sx += A[0] + (B[0] - A[0]) * t; sy += A[1] + (B[1] - A[1]) * t; sz += A[2] + (B[2] - A[2]) * t; n++;
      }
    }
    VI[i + cx * (j + cy * k)] = pos.length / 3;
    pos.push(b0[0] + (i + sx / n) * h, b0[1] + (j + sy / n) * h, b0[2] + (k + sz / n) * h);
  }
  const Cc = (i, j, k) => VI[i + cx * (j + cy * k)];
  const idx = [];
  const quad = (a, b, c, d) => { if (a < 0 || b < 0 || c < 0 || d < 0) return; idx.push(a, b, c, a, c, d); };
  for (let k = 0; k < nz; k++) for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
    const f0 = F[i + nx * (j + ny * k)] < 0;
    if (i < cx && j > 0 && k > 0 && j < cy && k < cz && f0 !== (F[i + 1 + nx * (j + ny * k)] < 0)) quad(Cc(i, j - 1, k - 1), Cc(i, j, k - 1), Cc(i, j, k), Cc(i, j - 1, k));
    if (j < cy && i > 0 && k > 0 && i < cx && k < cz && f0 !== (F[i + nx * (j + 1 + ny * k)] < 0)) quad(Cc(i - 1, j, k - 1), Cc(i, j, k - 1), Cc(i, j, k), Cc(i - 1, j, k));
    if (k < cz && i > 0 && j > 0 && i < cx && j < cy && f0 !== (F[i + nx * (j + ny * (k + 1))] < 0)) quad(Cc(i - 1, j - 1, k), Cc(i, j - 1, k), Cc(i, j, k), Cc(i - 1, j, k));
  }
  const nv = pos.length / 3, nor = new Float32Array(nv * 3), col = new Float32Array(nv * 3);
  const e = h * .5;
  for (let q = 0; q < nv; q++) {
    const x = pos[q * 3], y = pos[q * 3 + 1], z = pos[q * 3 + 2];
    const gx = fn(x + e, y, z) - fn(x - e, y, z), gy = fn(x, y + e, z) - fn(x, y - e, z), gz = fn(x, y, z + e) - fn(x, y, z - e);
    const l = Math.hypot(gx, gy, gz) || 1; nor[q * 3] = gx / l; nor[q * 3 + 1] = gy / l; nor[q * 3 + 2] = gz / l;
    fn(x, y, z); const id = paint ? paint(x, y, z, ID) : ID;
    const cc = pal[id] || pal[0]; col[q * 3] = cc.r; col[q * 3 + 1] = cc.g; col[q * 3 + 2] = cc.b;
  }
  // orienta cada triángulo según la normal del campo
  for (let t = 0; t < idx.length; t += 3) {
    const a = idx[t] * 3, b = idx[t + 1] * 3, c = idx[t + 2] * 3;
    const ux = pos[b] - pos[a], uy = pos[b + 1] - pos[a + 1], uz = pos[b + 2] - pos[a + 2];
    const wx = pos[c] - pos[a], wy = pos[c + 1] - pos[a + 1], wz = pos[c + 2] - pos[a + 2];
    const fx = uy * wz - uz * wy, fy = uz * wx - ux * wz, fz = ux * wy - uy * wx;
    if ((nor[a] + nor[b] + nor[c]) * fx + (nor[a + 1] + nor[b + 1] + nor[c + 1]) * fy + (nor[a + 2] + nor[b + 2] + nor[c + 2]) * fz < 0) { const tmp = idx[t + 1]; idx[t + 1] = idx[t + 2]; idx[t + 2] = tmp; }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('normal', new THREE.BufferAttribute(nor, 3));
  g.setAttribute('color', new THREE.BufferAttribute(col, 3));
  g.setIndex(idx);
  return g;
}
