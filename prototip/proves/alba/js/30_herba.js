/* =====================================================================
   HIERBA INSTANCIADA CON VIENTO Y QUE SE APARTA AL PASAR
   ---------------------------------------------------------------------
   - Una «mata» (9 briznas curvas) repetida miles de veces con
     InstancedMesh: una sola llamada de dibujo.
   - Vertex shader inyectado en MeshLambertMaterial (onBeforeCompile):
       · viento: dos senos desfasados según la posición de la mata;
       · empuje: las matas a menos de ~1,1 m del personaje se doblan
         hacia fuera y se aplastan (uniform VENT.uPlayer).
     La flexión crece con aH² (0 en la base, 1 en la punta).
   - Color: degradado base→punta por vértice × tinte por instancia (aTint).
   - Normales todas hacia arriba: luz suave y uniforme, como en Alba.
   - Compatible con r128 (no usa transpose(), ni instanceColor).
   API genérica: se le pasan funciones de suelo y densidad, así que
   sirve igual para la isla de la prueba que para landH() del juego.
   ===================================================================== */
const VENT = { uTime: { value: 0 }, uPlayer: { value: new THREE.Vector3(0, -99, 0) } };

function materialVent(push) {
  const m = new THREE.MeshLambertMaterial({ vertexColors: true, side: THREE.DoubleSide });
  m.onBeforeCompile = sh => {
    sh.uniforms.uTime = VENT.uTime; sh.uniforms.uPlayer = VENT.uPlayer;
    sh.vertexShader = sh.vertexShader
      .replace('#include <common>', `#include <common>
        uniform float uTime; uniform vec3 uPlayer; attribute float aH; attribute vec3 aTint;`)
      .replace('#include <color_vertex>', `#include <color_vertex>
        #ifdef USE_COLOR
          vColor.xyz *= aTint;
        #endif`)
      .replace('#include <begin_vertex>', `#include <begin_vertex>
        {
          vec4 iw = modelMatrix * instanceMatrix * vec4(0., 0., 0., 1.);
          float k = aH * aH;
          float w = sin(uTime * 1.5 + iw.x * .22 + iw.z * .15) * .6 + sin(uTime * 2.9 + iw.x * .7 - iw.z * .4) * .25;
          vec3 off = vec3(w * .16, 0., w * .09) * k;
          ${push ? `vec2 d = iw.xz - uPlayer.xz; float dist = length(d);
          float pu = (1. - smoothstep(.2, 1.15, dist)) * step(abs(iw.y - uPlayer.y), 1.2);
          off.xz += normalize(d + 1e-4) * pu * .5 * k; off.y -= pu * .3 * k;` : ''}
          // de mundo a local de la instancia (solo giro en Y + escala uniforme)
          mat3 im = mat3(instanceMatrix); float s2 = dot(im[0], im[0]);
          transformed += vec3(dot(im[0], off), dot(im[1], off), dot(im[2], off)) / s2;
        }`);
  };
  m.customProgramCacheKey = () => 'vent' + push;
  return m;
}

function geometriaMata(blades, hgt, wid, cols) {
  const pos = [], col = [], ah = [], nor = [], idx = [];
  const base = C(cols[0]), mid = C(cols[1]), tip = C(cols[2]);
  const r = rngf(5), tmp = new THREE.Color();
  for (let b = 0; b < blades; b++) {
    const a = r() * TAU, rr0 = Math.sqrt(r()) * .13, ox = Math.cos(a) * rr0, oz = Math.sin(a) * rr0;
    const lean = .15 + r() * .35, la = r() * TAU, h = hgt * (.7 + r() * .5), w = wid * (.8 + r() * .4);
    const fx = Math.cos(la + Math.PI / 2), fz = Math.sin(la + Math.PI / 2);
    const s0 = pos.length / 3, segs = 3;
    for (let s = 0; s <= segs; s++) {
      const t = s / segs, ww = w * (1 - t * .85) * (s === segs ? 0 : 1);
      const bx = ox + Math.cos(la) * lean * t * t * h, bz = oz + Math.sin(la) * lean * t * t * h, by = t * h;
      pos.push(bx - fx * ww, by, bz - fz * ww, bx + fx * ww, by, bz + fz * ww);
      tmp.copy(base).lerp(mid, smooth(0, .5, t)).lerp(tip, smooth(.5, 1, t));
      for (let q = 0; q < 2; q++) { col.push(tmp.r, tmp.g, tmp.b); ah.push(t); nor.push(0, 1, 0); }
    }
    for (let s = 0; s < segs; s++) { const a0 = s0 + s * 2; idx.push(a0, a0 + 1, a0 + 3, a0, a0 + 3, a0 + 2); }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
  g.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3)); g.setAttribute('aH', new THREE.Float32BufferAttribute(ah, 1)); g.setIndex(idx);
  return g;
}

/* opts: { count, area:[x0,z0,x1,z1], ground(x,z), density(x,z)→0..1, tall(x,z)→0..1,
           obstacles:[[x,z,r]], seed, cols:[base,medio,punta], push:true } */
function herbaInstanciada(o) {
  const geo = geometriaMata(9, .42, .017, o.cols || ['#a88a3e', '#e0c26c', '#f8ebb4']);
  const tint = new Float32Array(o.count * 3);
  geo.setAttribute('aTint', new THREE.InstancedBufferAttribute(tint, 3));
  const mesh = new THREE.InstancedMesh(geo, materialVent(o.push !== false), o.count);
  mesh.receiveShadow = true; mesh.frustumCulled = false;
  const r = rngf(o.seed || 31), m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), sc = new THREE.Vector3(), ps = new THREE.Vector3(), up = new THREE.Vector3(0, 1, 0), c = new THREE.Color(), olive = C('#a7a64a');
  const [x0, z0, x1, z1] = o.area;
  let n = 0, tries = 0;
  while (n < o.count && tries < o.count * 8) {
    tries++;
    const x = lerp(x0, x1, r()), z = lerp(z0, z1, r());
    const d = o.density(x, z); if (r() > d) continue;
    if (o.obstacles && o.obstacles.some(b => Math.hypot(x - b[0], z - b[1]) < b[2] * .8)) continue;
    const tall = o.tall ? o.tall(x, z) : 0;
    const s = (.55 + r() * .5) * (1 + tall * .9) * (.6 + d * .5);
    ps.set(x, o.ground(x, z) - .02, z); q.setFromAxisAngle(up, r() * TAU); sc.set(s, s * (.85 + r() * .35), s);
    m4.compose(ps, q, sc); mesh.setMatrixAt(n, m4);
    c.setHSL(.12 + r() * .025 - tall * .01, .42 + r() * .12, .62 + r() * .12); if (vnoise(x * .1 + 50, z * .1) > .7) c.lerp(olive, .4);
    // el tinte multiplica el degradado: se normaliza para no oscurecer de más
    tint[n * 3] = c.r * 1.25; tint[n * 3 + 1] = c.g * 1.25; tint[n * 3 + 2] = c.b * 1.25;
    n++;
  }
  mesh.count = n; mesh.instanceMatrix.needsUpdate = true; geo.attributes.aTint.needsUpdate = true;
  return mesh;
}

/* flores rojas/blancas/lila con tallo, mismo viento y empuje */
function florsInstanciades(o) {
  const pos = [], col = [], ah = [], nor = [], idx = [];
  const add = (x, y, z, cc, h) => { pos.push(x, y, z); col.push(cc.r, cc.g, cc.b); ah.push(h); nor.push(0, 1, 0); return pos.length / 3 - 1; };
  const H = .32, stem = C('#6b7d34'), white = C('#ffffff');
  const a0 = add(-.008, 0, 0, stem, 0), a1 = add(.008, 0, 0, stem, 0), a2 = add(.006, H, 0, stem, 1), a3 = add(-.006, H, 0, stem, 1);
  idx.push(a0, a1, a2, a0, a2, a3);
  const cen = add(0, H + .012, 0, C('#2a1a1a'), 1), ring = [];
  for (let i = 0; i < 10; i++) { const a = i / 10 * TAU, rr = i % 2 ? .035 : .055; ring.push(add(Math.cos(a) * rr, H + (i % 2 ? .008 : .018), Math.sin(a) * rr, white, 1)); }
  for (let i = 0; i < 10; i++) idx.push(cen, ring[i], ring[(i + 1) % 10]);
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
  g.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3)); g.setAttribute('aH', new THREE.Float32BufferAttribute(ah, 1)); g.setIndex(idx);
  const tint = new Float32Array(o.count * 3); g.setAttribute('aTint', new THREE.InstancedBufferAttribute(tint, 3));
  const mesh = new THREE.InstancedMesh(g, materialVent(true), o.count);
  const r = rngf(77), m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), sc = new THREE.Vector3(), ps = new THREE.Vector3(), eu = new THREE.Euler();
  const cols = ['#e8483a', '#e8483a', '#f06a3a', '#f6f0e0', '#c88ae0'].map(C);
  const [x0, z0, x1, z1] = o.area;
  let n = 0, tries = 0;
  while (n < o.count && tries < o.count * 30) {
    tries++;
    const x = lerp(x0, x1, r()), z = lerp(z0, z1, r());
    if (!o.spot(x, z)) continue;
    const s = .7 + r() * .6;
    ps.set(x, o.ground(x, z) - .02, z); q.setFromEuler(eu.set((r() - .5) * .3, r() * TAU, (r() - .5) * .3)); sc.set(s, s * (.8 + (o.tall ? o.tall(x, z) : 0) * 1.2), s);
    m4.compose(ps, q, sc); mesh.setMatrixAt(n, m4);
    const cc = cols[Math.floor(r() * cols.length)]; tint[n * 3] = cc.r; tint[n * 3 + 1] = cc.g; tint[n * 3 + 2] = cc.b; n++;
  }
  mesh.count = n; mesh.frustumCulled = false; mesh.receiveShadow = true; g.attributes.aTint.needsUpdate = true;
  return mesh;
}
