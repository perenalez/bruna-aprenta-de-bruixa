/* =====================================================================
   MUNDO DE LA PRUEBA — una isla dorada estilo Alba
   Terreno con caminos, pinos y olivos con copas de borde de hojas,
   rocas facetadas, agaves, valla, torreón en la colina, mar y cielo.
   Es solo el escenario de la prueba: en el juego real el terreno es
   landH()/gY() y los árboles los de 04/05. Lo reutilizable de aquí son
   taperTube/canopyBlob (copas con hojas en el borde) y el mar.
   ===================================================================== */
const MON = (() => {
  const PATHS = [
    [[0, 12], [2.5, 5], [1, -2], [-4, -8], [-10, -14], [-16, -19.5]],
    [[2.5, 5], [9, 8], [17, 11], [25, 13], [33, 13]],
    [[1, -2], [8, -6], [15, -12], [20, -20]],
  ];
  const SEGS = [];
  PATHS.forEach(p => { for (let i = 0; i < p.length - 1; i++) SEGS.push([p[i][0], p[i][1], p[i + 1][0], p[i + 1][1]]); });
  function pathDist(x, z) {
    let m = 1e9;
    for (const [ax, az, bx, bz] of SEGS) {
      const dx = bx - ax, dz = bz - az; const t = clamp(((x - ax) * dx + (z - az) * dz) / (dx * dx + dz * dz), 0, 1);
      const w = Math.hypot(x - ax - dx * t, z - az - dz * t); if (w < m) m = w;
    }
    return m + (vnoise(x * .6, z * .6) - .5) * .5;
  }
  const TOWER = [-20, -24];
  const SEA = -.45;
  function islandR(x, z) { const a = Math.atan2(z, x); return 44 + (vnoise(Math.cos(a) * 1.7 + 7, Math.sin(a) * 1.7 + 3) - .5) * 20; }
  function heightAt(x, z) {
    const r = Math.hypot(x, z), Ri = islandR(x, z);
    let h = .35 + fbm2(x * .03 + 11, z * .03 + 5) * 3.6 + (vnoise(x * .15, z * .15) - .5) * .35;
    h += 5.2 * Math.exp(-((x - TOWER[0]) ** 2 + (z - TOWER[1]) ** 2) / 140);
    h -= 1.6 * Math.exp(-(x * x + (z - 6) ** 2) / 200);
    const pd = pathDist(x, z); h -= (1 - smooth(0, 2.2, pd)) * .12;
    return lerp(h, -2.8, smooth(Ri - 12, Ri + 3, r));
  }

  function terreno(seg) {
    const S = 130, N = seg;
    const g = new THREE.PlaneGeometry(S, S, N, N); g.rotateX(-Math.PI / 2);
    const p = g.attributes.position, col = new Float32Array(p.count * 3);
    const cGr = C('#d9b456'), cGr2 = C('#ead07a'), cGr3 = C('#c39d48'), cGreen = C('#9aa046'), cDirt = C('#e1bd85'), cDirt2 = C('#d4ad78'), cSand = C('#efdcaa'), cWet = C('#b9dccd'), cDeep = C('#5aaebe');
    const tmp = new THREE.Color(), dirt = new THREE.Color();
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i), z = p.getZ(i); const h = heightAt(x, z); p.setY(i, h);
      const n = fbm2(x * .08, z * .08, 3), n2 = vnoise(x * .4, z * .4);
      tmp.copy(cGr).lerp(cGr2, smooth(.45, .7, n)).lerp(cGr3, smooth(.6, .9, n2) * .5).lerp(cGreen, smooth(.55, .8, fbm2(x * .05 + 40, z * .05)) * .55);
      dirt.copy(cDirt).lerp(cDirt2, n2 * .6);
      tmp.lerp(dirt, 1 - smooth(.9, 1.6, pathDist(x, z)));
      tmp.lerp(cSand, 1 - smooth(.05, .7, h - SEA));
      if (h < SEA) tmp.copy(cWet).lerp(cDeep, smooth(0, 1.6, SEA - h));
      col[i * 3] = tmp.r; col[i * 3 + 1] = tmp.g; col[i * 3 + 2] = tmp.b;
    }
    g.setAttribute('color', new THREE.BufferAttribute(col, 3));
    g.computeVertexNormals();
    const m = new THREE.Mesh(g, new THREE.MeshLambertMaterial({ vertexColors: true }));
    m.receiveShadow = true;
    return m;
  }

  /* --- tronco retorcido: tubo con radio que se estrecha y bulto aleatorio --- */
  function taperTube(pts, r0, r1, radial, colA, colB, seed) {
    const curve = new THREE.CatmullRomCurve3(pts);
    const segs = Math.max(6, pts.length * 5);
    const fr = curve.computeFrenetFrames(segs, false);
    const pos = [], col = [], idx = [];
    const tmp = new THREE.Color();
    for (let s = 0; s <= segs; s++) {
      const t = s / segs, P = curve.getPointAt(t), N = fr.normals[s], B = fr.binormals[s];
      const rad = lerp(r0, r1, Math.pow(t, .8)) * (1 + (s === 0 ? .35 : 0));
      for (let k = 0; k <= radial; k++) {
        const a = k / radial * TAU, wob = 1 + (vnoise(a * 1.3 + seed, t * 6) - .5) * .35;
        const cx = Math.cos(a) * rad * wob, cy = Math.sin(a) * rad * wob;
        pos.push(P.x + N.x * cx + B.x * cy, P.y + N.y * cx + B.y * cy, P.z + N.z * cx + B.z * cy);
        tmp.copy(colA).lerp(colB, vnoise(k * .9, s * .7 + seed) * .8); col.push(tmp.r, tmp.g, tmp.b);
      }
    }
    for (let s = 0; s < segs; s++) for (let k = 0; k < radial; k++) { const a = s * (radial + 1) + k, b = a + radial + 1; idx.push(a, b, a + 1, b, b + 1, a + 1); }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3)); g.setIndex(idx); g.computeVertexNormals();
    return g;
  }
  /* --- copa: masa con ruido + «tarjetas» de hojas en el borde que rompen la silueta --- */
  function canopyBlob(cx, cy, cz, sx, sy, sz, seed, cols) {
    const g = new THREE.IcosahedronGeometry(1, 3);
    const p = g.attributes.position, col = new Float32Array(p.count * 3), dirs = [];
    const tmp = new THREE.Color();
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i), y = p.getY(i), z = p.getZ(i);
      const n = vnoise3(x * 1.8 + seed, y * 1.8, z * 1.8 - seed);
      const d = .82 + n * .35 + (vnoise3(x * 4 + seed, y * 4, z * 4) - .5) * .12;
      const yy = y < 0 ? y * .55 : y;
      p.setXYZ(i, cx + x * sx * d, cy + yy * sy * d, cz + z * sz * d);
      dirs.push(x, y, z);
      tmp.copy(cols[1]).lerp(cols[0], smooth(-.1, .9, y) * .8).lerp(cols[2], smooth(.1, -.9, y)); tmp.offsetHSL(0, 0, (n - .5) * .06);
      col[i * 3] = tmp.r; col[i * 3 + 1] = tmp.g; col[i * 3 + 2] = tmp.b;
    }
    g.setAttribute('color', new THREE.BufferAttribute(col, 3));
    g.computeVertexNormals();
    // normales suavizadas hacia la esfera: luz más blanda, como follaje
    const nn = g.attributes.normal, v = new THREE.Vector3(), w = new THREE.Vector3();
    for (let i = 0; i < nn.count; i++) { v.set(nn.getX(i), nn.getY(i), nn.getZ(i)).lerp(w.set(dirs[i * 3], dirs[i * 3 + 1], dirs[i * 3 + 2]), .65).normalize(); nn.setXYZ(i, v.x, v.y, v.z); }
    const cpos = [], ccol = [], cnor = [], cidx = [];
    const r = rngf(seed * 13 + 1);
    const ncards = Math.round(26 * (sx + sz));
    for (let i = 0; i < ncards; i++) {
      const a = r() * TAU, e = (r() - .35) * 1.2;
      const dx = Math.cos(a) * Math.cos(e), dy = Math.sin(e), dz = Math.sin(a) * Math.cos(e);
      const px = cx + dx * sx * 1.02, py = cy + (dy < 0 ? dy * .55 : dy) * sy * 1.02, pz = cz + dz * sz * 1.02;
      const s = .22 + r() * .2, tx = -Math.sin(a), tz = Math.cos(a), base = cpos.length / 3;
      const ang = (r() - .5) * 1.4, ca = Math.cos(ang), sa = Math.sin(ang);
      for (const [u, ww] of [[0, 0], [s * .5, s * .35], [0, s * 1.1], [-s * .5, s * .35]]) {
        const uu = u * ca - ww * sa, w2 = u * sa + ww * ca;
        cpos.push(px + tx * uu + dx * w2 * .5, py + w2 * .7 + dy * w2 * .3, pz + tz * uu + dz * w2 * .5);
        tmp.copy(cols[1]).lerp(cols[0], smooth(-.1, .9, dy) * .8).lerp(cols[2], smooth(.1, -.9, dy)); tmp.offsetHSL(0, 0, (r() - .5) * .06);
        ccol.push(tmp.r, tmp.g, tmp.b); cnor.push(dx, dy, dz);
      }
      cidx.push(base, base + 1, base + 2, base, base + 2, base + 3);
    }
    const cg = new THREE.BufferGeometry(); cg.setAttribute('position', new THREE.Float32BufferAttribute(cpos, 3)); cg.setAttribute('color', new THREE.Float32BufferAttribute(ccol, 3)); cg.setAttribute('normal', new THREE.Float32BufferAttribute(cnor, 3)); cg.setIndex(cidx);
    return [g, cg];
  }
  function arbres(spots) {
    const trunks = [], leaves = [];
    const bark = C('#7a5b4c'), bark2 = C('#5d4238');
    const PALS = [[C('#8ea24a'), C('#5f7a34'), C('#3c5328')], [C('#a3aa52'), C('#6f8238'), C('#46582a')], [C('#7f9a54'), C('#4f6b3a'), C('#33472a')]];
    spots.forEach(([x, z, sc, seed]) => {
      const y0 = heightAt(x, z) - .1, r = rngf(seed);
      const pine = r() < .55, pal = PALS[Math.floor(r() * PALS.length)];
      const lean = (r() - .5) * .5, la = r() * TAU;
      if (pine) {
        const H = (4.2 + r() * 2.2) * sc, pts = [];
        for (let k = 0; k <= 5; k++) { const t = k / 5; pts.push(new THREE.Vector3(x + Math.cos(la) * lean * H * t * t + Math.sin(t * 5 + seed) * .15, y0 + t * H, z + Math.sin(la) * lean * H * t * t + Math.cos(t * 4 + seed) * .15)); }
        trunks.push(taperTube(pts, .22 * sc, .07 * sc, 8, bark, bark2, seed));
        const top = pts[5], nb = 3 + Math.floor(r() * 2);
        for (let b = 0; b < nb; b++) {
          const ba = la + b / nb * TAU + r() * .5, bl = (1.1 + r() * .8) * sc;
          const start = pts[3 + (b % 2)].clone();
          const end = new THREE.Vector3(top.x + Math.cos(ba) * bl, top.y + (.1 + r() * .5) * sc, top.z + Math.sin(ba) * bl);
          trunks.push(taperTube([start, start.clone().lerp(end, .5).add(new THREE.Vector3(0, .35 * sc, 0)), end], .09 * sc, .035 * sc, 6, bark, bark2, seed + b));
          leaves.push(...canopyBlob(end.x, end.y + .25 * sc, end.z, (1.2 + r() * .5) * sc, (.5 + r() * .2) * sc, (1.1 + r() * .5) * sc, seed + b * 7, pal));
        }
        leaves.push(...canopyBlob(top.x, top.y + .35 * sc, top.z, 1.6 * sc, .6 * sc, 1.5 * sc, seed + 99, pal));
      } else {
        const H = (2.2 + r() * 1.2) * sc, pts = [];
        for (let k = 0; k <= 4; k++) { const t = k / 4; pts.push(new THREE.Vector3(x + Math.sin(t * 4 + seed) * .25 * sc, y0 + t * H, z + Math.cos(t * 3 + seed) * .25 * sc)); }
        trunks.push(taperTube(pts, .26 * sc, .12 * sc, 8, bark, bark2, seed));
        const top = pts[4], nb = 3 + Math.floor(r() * 3);
        for (let b = 0; b < nb; b++) {
          const ba = b / nb * TAU + r(), bl = (1 + r() * .9) * sc;
          const end = new THREE.Vector3(top.x + Math.cos(ba) * bl, top.y + (.4 + r() * .9) * sc, top.z + Math.sin(ba) * bl);
          trunks.push(taperTube([pts[3].clone(), top.clone().lerp(end, .5), end], .11 * sc, .04 * sc, 6, bark, bark2, seed + b));
          leaves.push(...canopyBlob(end.x, end.y + .2 * sc, end.z, (.9 + r() * .4) * sc, (.65 + r() * .25) * sc, (.9 + r() * .4) * sc, seed + b * 5, pal));
        }
      }
    });
    const tm = new THREE.Mesh(fusionar(trunks), new THREE.MeshLambertMaterial({ vertexColors: true }));
    const lm = new THREE.Mesh(fusionar(leaves), new THREE.MeshLambertMaterial({ vertexColors: true, side: THREE.DoubleSide }));
    tm.castShadow = tm.receiveShadow = true; lm.castShadow = lm.receiveShadow = true;
    const grp = new THREE.Group(); grp.add(tm, lm); return grp;
  }
  function roques(spots) {
    const geos = [];
    spots.forEach(([x, z, s, seed]) => {
      let g = new THREE.IcosahedronGeometry(1, 1);
      const p = g.attributes.position, r = rngf(seed);
      const sx = s * (1 + r() * .6), sy = s * (.55 + r() * .35), sz = s * (.9 + r() * .5);
      for (let i = 0; i < p.count; i++) {
        const vx = p.getX(i), vy = p.getY(i), vz = p.getZ(i);
        const d = .8 + vnoise3(vx * 1.4 + seed, vy * 1.4, vz * 1.4) * .45;
        p.setXYZ(i, x + vx * sx * d, heightAt(x, z) - .15 * s + (vy < -.2 ? -.2 : vy) * sy * d, z + vz * sz * d);
      }
      if (g.index) g = g.toNonIndexed();
      g.computeVertexNormals();   // facetada a propósito: las rocas de Alba lo son
      const n = g.attributes.position.count, col = new Float32Array(n * 3), nn = g.attributes.normal;
      const base = C(r() < .5 ? '#e0cfb3' : '#cdb9a0'), top = C('#f1e6d2'), tmp = new THREE.Color();
      for (let i = 0; i < n; i++) { tmp.copy(base).lerp(top, clamp(nn.getY(i), 0, 1) * .5); tmp.offsetHSL(0, 0, (hash2(i, seed) - .5) * .05); col[i * 3] = tmp.r; col[i * 3 + 1] = tmp.g; col[i * 3 + 2] = tmp.b; }
      g.setAttribute('color', new THREE.BufferAttribute(col, 3));
      geos.push(g);
    });
    const m = new THREE.Mesh(fusionar(geos), new THREE.MeshLambertMaterial({ vertexColors: true }));
    m.castShadow = m.receiveShadow = true; return m;
  }
  function atzavares(spots) {
    const geos = [];
    spots.forEach(([x, z, s, seed]) => {
      const r = rngf(seed), y0 = heightAt(x, z) - .05;
      const pos = [], col = [], idx = [];
      const c0 = C('#6e9a86'), c1 = C('#a9c7a8');
      const nl = 11 + Math.floor(r() * 5);
      for (let l = 0; l < nl; l++) {
        const a = l / nl * TAU + r() * .3, up = .35 + r() * .9, Ln = (.6 + r() * .5) * s, Wd = .09 * s;
        const dx = Math.cos(a), dz = Math.sin(a), tx = -dz, tz = dx, b = pos.length / 3;
        for (let k = 0; k <= 4; k++) {
          const t = k / 4, hh = Math.sin(up) * Ln * t - t * t * Ln * .25, out = Math.cos(up) * Ln * t + t * t * .1 * Ln;
          const w = Wd * (1 - t) * (k === 4 ? 0 : 1);
          pos.push(x + dx * out - tx * w, y0 + hh, z + dz * out - tz * w, x + dx * out + tx * w, y0 + hh + w * .4, z + dz * out + tz * w);
          const cc = c0.clone().lerp(c1, t); col.push(cc.r, cc.g, cc.b, cc.r, cc.g, cc.b);
        }
        for (let k = 0; k < 4; k++) { const q = b + k * 2; idx.push(q, q + 1, q + 3, q, q + 3, q + 2); }
      }
      const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3)); g.setIndex(idx); g.computeVertexNormals();
      geos.push(g);
    });
    const m = new THREE.Mesh(fusionar(geos), new THREE.MeshLambertMaterial({ vertexColors: true, side: THREE.DoubleSide }));
    m.castShadow = m.receiveShadow = true; return m;
  }
  function torreo() {
    const grp = new THREE.Group();
    const [tx, tz] = TOWER, y0 = heightAt(tx, tz) - .4;
    const prof = []; for (let i = 0; i <= 12; i++) { const t = i / 12; prof.push(new THREE.Vector2(2.35 - t * .25 + Math.sin(t * 9) * .03, t * 7.2)); }
    let g = new THREE.LatheGeometry(prof, 36);
    const p = g.attributes.position, col = new Float32Array(p.count * 3), tmp = new THREE.Color();
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i), y = p.getY(i), z = p.getZ(i), a = Math.atan2(z, x);
      const row = Math.floor(y * 2.4), brick = Math.floor((a + Math.PI) * 4 + row * .5);
      const d = 1 + (vnoise3(x * 1.2, y * 1.2, z * 1.2) - .5) * .05;
      p.setXYZ(i, x * d, y, z * d);
      tmp.set('#d9cfc8').lerp(C('#b6a7a6'), hash2(row, brick) * .8).lerp(C('#96a76a'), smooth(.8, 0, y) * vnoise(a * 3, 1) * .8);
      col[i * 3] = tmp.r; col[i * 3 + 1] = tmp.g; col[i * 3 + 2] = tmp.b;
    }
    g.setAttribute('color', new THREE.BufferAttribute(col, 3)); g.computeVertexNormals();
    const body = new THREE.Mesh(g, new THREE.MeshLambertMaterial({ vertexColors: true })); body.castShadow = body.receiveShadow = true;
    const rp = []; for (let i = 0; i <= 14; i++) { const t = i / 14; rp.push(new THREE.Vector2(Math.max(.02, (1 - t) * 3.1 * (1 - .12 * Math.sin(t * Math.PI))), t * 3.8)); }
    g = new THREE.LatheGeometry(rp, 36);
    const rpos = g.attributes.position, rcol = new Float32Array(rpos.count * 3);
    for (let i = 0; i < rpos.count; i++) {
      const y = rpos.getY(i), t = y / 3.8, x = rpos.getX(i), z = rpos.getZ(i);
      rpos.setXYZ(i, x - t * t * t * .9, y, z + t * t * t * .3);
      tmp.set('#d48a4a').lerp(C('#a85e34'), (Math.floor(y * 3) % 2) * .35 + hash2(Math.floor(y * 3), Math.floor(Math.atan2(z, x) * 6)) * .2);
      rcol[i * 3] = tmp.r; rcol[i * 3 + 1] = tmp.g; rcol[i * 3 + 2] = tmp.b;
    }
    g.setAttribute('color', new THREE.BufferAttribute(rcol, 3)); g.computeVertexNormals();
    const roof = new THREE.Mesh(g, new THREE.MeshLambertMaterial({ vertexColors: true })); roof.position.y = 7.0; roof.castShadow = true;
    const win = new THREE.MeshBasicMaterial({ color: '#ffd27a' }), dark = new THREE.MeshLambertMaterial({ color: '#4a3530' });
    const arc = (w, h) => { const s = new THREE.Shape(); s.moveTo(-w / 2, 0); s.lineTo(w / 2, 0); s.lineTo(w / 2, h - w / 2); s.absarc(0, h - w / 2, w / 2, 0, Math.PI, false); s.lineTo(-w / 2, 0); return new THREE.ShapeGeometry(s, 8); };
    [[.4, 4.8, win, .7, 1.1], [2.5, 3.2, win, .6, 1], [1.4, 0, dark, 1.2, 2.1]].forEach(([a, y, m, w, h]) => {
      const mm = new THREE.Mesh(arc(w, h), m), rr = 2.33 - y / 7.2 * .25;
      mm.position.set(Math.cos(a) * rr * 1.01, y + .4, Math.sin(a) * rr * 1.01); mm.lookAt(Math.cos(a) * 9, y + .4, Math.sin(a) * 9); grp.add(mm);
    });
    grp.add(body, roof); grp.position.set(tx, y0, tz); grp.rotation.y = .9;
    return grp;
  }
  function tanca() {
    const geos = [], r = rngf(12);
    const pts = [[3.6, 6], [8, 9.6], [14, 12.6], [19, 14.6]];
    for (let s = 0; s < pts.length - 1; s++) {
      const [ax, az] = pts[s], [bx, bz] = pts[s + 1], Ln = Math.hypot(bx - ax, bz - az), n = Math.ceil(Ln / 1.6);
      for (let i = 0; i <= n; i++) {
        const t = i / n, x = lerp(ax, bx, t), z = lerp(az, bz, t), y = heightAt(x, z);
        const post = new THREE.BoxGeometry(.11, .8, .11); post.rotateZ((r() - .5) * .15); post.rotateX((r() - .5) * .15); post.translate(x, y + .35, z); geos.push(post);
      }
      const ang = Math.atan2(bz - az, bx - ax);
      [.55, .25].forEach(hh => { const rail = new THREE.BoxGeometry(Ln, .06, .05); rail.rotateY(-ang); rail.translate((ax + bx) / 2, (heightAt(ax, az) + heightAt(bx, bz)) / 2 + hh, (az + bz) / 2); geos.push(rail); });
    }
    const m = new THREE.Mesh(fusionar(geos.map(g => pintar(g.toNonIndexed(), '#b79b7c'))), new THREE.MeshLambertMaterial({ vertexColors: true }));
    m.castShadow = m.receiveShadow = true; return m;
  }
  function mar(uTime) {
    const g = new THREE.PlaneGeometry(700, 700, 1, 1); g.rotateX(-Math.PI / 2);
    const m = new THREE.MeshStandardMaterial({ color: '#3aa3c0', roughness: .25, metalness: 0, transparent: true, opacity: .8 });
    m.onBeforeCompile = sh => {
      sh.uniforms.uTime = uTime;
      sh.vertexShader = sh.vertexShader.replace('void main() {', 'varying vec3 vWP;\nvoid main() {').replace('#include <worldpos_vertex>', '#include <worldpos_vertex>\nvWP = (modelMatrix * vec4(transformed, 1.)).xyz;');
      sh.fragmentShader = sh.fragmentShader.replace('#include <common>', '#include <common>\nuniform float uTime;\nvarying vec3 vWP;')
        .replace('#include <normal_fragment_maps>', `#include <normal_fragment_maps>
          { float a = sin(vWP.x*1.3 + uTime*1.2)*.5 + sin(vWP.z*1.7 - uTime*.9)*.5 + sin((vWP.x+vWP.z)*3.1 + uTime*2.)*.25;
            float b = cos(vWP.z*1.1 + uTime)*.5 + cos((vWP.x-vWP.z)*2.3 - uTime*1.4)*.3;
            normal = normalize(normal + vec3(a, 0., b) * .08); }`);
    };
    const sea = new THREE.Mesh(g, m); sea.position.y = SEA; sea.receiveShadow = true;
    return sea;
  }
  function cel() {
    const m = new THREE.ShaderMaterial({
      side: THREE.BackSide, depthWrite: false, fog: false,
      uniforms: { top: { value: C('#6fb2df') }, mid: { value: C('#b9dcec') }, hor: { value: C('#fbe7c6') }, sunDir: { value: new THREE.Vector3(-.5, .45, .3).normalize() } },
      vertexShader: 'varying vec3 vD; void main(){ vD = normalize(position); gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.); }',
      fragmentShader: `uniform vec3 top, mid, hor, sunDir; varying vec3 vD;
        void main(){ float h = vD.y; vec3 c = mix(hor, mid, smoothstep(-.02, .18, h)); c = mix(c, top, smoothstep(.18, .7, h));
        c += vec3(1.,.85,.6) * pow(max(dot(vD, sunDir), 0.), 24.) * .35; gl_FragColor = vec4(c, 1.); }`,
    });
    return new THREE.Mesh(new THREE.SphereGeometry(450, 32, 16), m);
  }

  // Construye todo y devuelve los obstáculos (círculos [x,z,r]) para colisiones y para no plantar hierba encima.
  function construir(scene, Q, uTime) {
    const obstacles = [];
    scene.add(cel()); scene.add(mar(uTime)); scene.add(terreno(Q.terrainSeg));
    const r = rngf(2024), treeSpots = [];
    const fixed = [[-6, 2, 1.1], [7, -1, 1.2], [-3, -14, 1.0], [12, 3, .9], [-12, -6, 1.2], [5, 16, 1.0], [-9, 12, 1.1], [16, -4, 1.0], [-24, -12, 1.3], [-14, -30, 1.1], [22, 6, 1.1], [26, -8, 1.0], [-28, 2, 1.2], [-20, 14, 1.0], [10, -18, 1.2], [0, -25, 1.1], [30, 18, .9], [-32, -18, 1.0]];
    fixed.forEach(([x, z, s], i) => { if (pathDist(x, z) > 2.2 && heightAt(x, z) > 0) { treeSpots.push([x, z, s, 100 + i * 17]); obstacles.push([x, z, .5 * s]); } });
    for (let i = 0; i < Q.extraTrees; i++) { const x = (r() - .5) * 70, z = (r() - .5) * 70; if (Math.hypot(x, z) < islandR(x, z) - 10 && pathDist(x, z) > 3 && Math.hypot(x - TOWER[0], z - TOWER[1]) > 6 && Math.hypot(x, z - 12) > 4) { const s = .8 + r() * .5; treeSpots.push([x, z, s, 900 + i * 31]); obstacles.push([x, z, .5 * s]); } }
    scene.add(arbres(treeSpots));
    const rocks = [[4.5, 9, .9, 1], [-3.5, 6, .6, 2], [9, 1, 1.3, 3], [-8, -2, .8, 4], [2, -9, 1.1, 5], [-14, -16, 1.6, 6], [18, 9, 1.0, 7], [-18, 6, 1.4, 8], [14, -14, .9, 9], [27, 12, 1.8, 10], [-5, 19, 1.2, 11], [-22, -20, 1.2, 12]];
    rocks.forEach(([x, z, s]) => obstacles.push([x, z, s * 1.05]));
    scene.add(roques(rocks));
    const ag = [[6, 11, 1, 1], [-2, 9, .8, 2], [11, 5, 1.1, 3], [-7, -4, .9, 4], [3.5, -6, 1, 5], [-11, -11, 1.2, 6], [16, 10, .9, 7], [21, -2, 1, 8], [-16, 2, 1.1, 9]];
    ag.forEach(([x, z, s]) => obstacles.push([x, z, s * .45]));
    scene.add(atzavares(ag));
    scene.add(torreo()); obstacles.push([TOWER[0], TOWER[1], 2.6]);
    scene.add(tanca());
    return obstacles;
  }
  // Densidad de hierba en (x,z): 0 = nada; se usa en 30_herba.js
  function grassDensity(x, z) {
    const h = heightAt(x, z); if (h < SEA + .35) return 0;
    const pd = pathDist(x, z); if (pd < 1.15) return 0;
    if (Math.hypot(x - TOWER[0], z - TOWER[1]) < 3.6) return 0;
    if (Math.hypot(x, z) > islandR(x, z) - 2) return 0;
    return clamp(.25 + smooth(.4, .62, fbm2(x * .06 + 3, z * .06 + 9, 3)) * .9 - (1 - smooth(1.15, 2.2, pd)) * .5, 0, 1);
  }
  function tallAt(x, z) { return smooth(.5, .68, fbm2(x * .05 + 21, z * .05 + 2, 3)); }
  function flowerSpot(x, z) { return Math.hypot(x, z) < islandR(x, z) - 4 && vnoise(x * .18 + 8, z * .18 + 1) > .62 && grassDensity(x, z) > 0; }

  return { heightAt, pathDist, islandR, SEA, TOWER, construir, grassDensity, tallAt, flowerSpot, taperTube, canopyBlob };
})();
