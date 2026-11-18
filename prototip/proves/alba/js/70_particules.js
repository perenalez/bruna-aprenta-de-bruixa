/* =====================================================================
   PARTÍCULAS — polvo al pisar/aterrizar, briznas que saltan al correr
   por la hierba alta, y mariposas que revolotean.
   (El juego ya tiene emit()/burst() en 22_particulas.js: aquí solo
   importa CUÁNDO se emite, que lo marcan los eventos de pasJugador.)
   ===================================================================== */
function crearParticules(scene, ground) {
  const parts = [];
  const cv = document.createElement('canvas'); cv.width = cv.height = 64;
  const g = cv.getContext('2d'), gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(.5, 'rgba(255,255,255,.5)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = gr; g.fillRect(0, 0, 64, 64);
  const tex = new THREE.CanvasTexture(cv);
  for (let i = 0; i < 50; i++) {
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, color: '#f3e3c2', transparent: true, depthWrite: false, opacity: 0 }));
    s.visible = false; scene.add(s); parts.push({ s, life: 0, max: 1, vx: 0, vy: 0, vz: 0, kind: 'pols' });
  }
  const bladeG = new THREE.PlaneGeometry(.05, .14);
  for (let i = 0; i < 40; i++) {
    const m = new THREE.Mesh(bladeG, new THREE.MeshLambertMaterial({ color: i % 2 ? '#e6c25a' : '#c9a33e', side: THREE.DoubleSide, transparent: true }));
    m.visible = false; scene.add(m); parts.push({ s: m, life: 0, max: 1, vx: 0, vy: 0, vz: 0, kind: 'herba', rx: 0, rz: 0 });
  }
  function emit(kind, x, y, z, n, spread = 1) {
    for (let k = 0; k < n; k++) {
      const p = parts.find(p => p.life <= 0 && p.kind === kind); if (!p) return;
      p.life = p.max = kind === 'pols' ? .7 + Math.random() * .5 : 1 + Math.random() * .6;
      p.s.position.set(x + (Math.random() - .5) * .2 * spread, y + .05, z + (Math.random() - .5) * .2 * spread);
      if (kind === 'pols') { p.vx = (Math.random() - .5) * .8 * spread; p.vy = .35 + Math.random() * .4; p.vz = (Math.random() - .5) * .8 * spread; p.size = .18 + Math.random() * .16; }
      else { const a = Math.random() * TAU; p.vx = Math.cos(a) * 1.4; p.vy = 2 + Math.random() * 1.8; p.vz = Math.sin(a) * 1.4; p.rx = (Math.random() - .5) * 14; p.rz = (Math.random() - .5) * 14; }
      p.s.visible = true;
    }
  }
  function step(dt) {
    for (const p of parts) {
      if (p.life <= 0) continue;
      p.life -= dt; const k = clamp(p.life / p.max, 0, 1);
      p.s.position.x += p.vx * dt; p.s.position.y += p.vy * dt; p.s.position.z += p.vz * dt;
      if (p.kind === 'pols') { p.vx *= .96; p.vz *= .96; p.vy *= .97; const s = p.size * (1.6 - k * .8); p.s.scale.set(s, s, s); p.s.material.opacity = k * .38; }
      else { p.vy -= 7 * dt; p.s.rotation.x += p.rx * dt; p.s.rotation.z += p.rz * dt; p.s.material.opacity = Math.min(1, k * 3); const gy = ground(p.s.position.x, p.s.position.z); if (p.s.position.y < gy) { p.s.position.y = gy; p.vx = p.vz = p.vy = 0; } }
      if (p.life <= 0) p.s.visible = false;
    }
  }
  return { emit, step };
}

function crearPapallones(scene, ground, n) {
  const wg = new THREE.CircleGeometry(.07, 10, 0, Math.PI); wg.rotateX(-Math.PI / 2);
  const cols = ['#ffffff', '#f6d36a', '#f08a3c', '#ffffff', '#cfe8ff'];
  const flies = [];
  for (let i = 0; i < n; i++) {
    const g = new THREE.Group(), m = new THREE.MeshLambertMaterial({ color: cols[i % cols.length], side: THREE.DoubleSide });
    const l = new THREE.Mesh(wg, m), r = new THREE.Mesh(wg, m); r.rotation.y = Math.PI; g.add(l, r);
    const a = Math.random() * TAU, d = 3 + Math.random() * 18;
    flies.push({ g, l, r, cx: Math.cos(a) * d, cz: Math.sin(a) * d, ph: Math.random() * 100, sp: .6 + Math.random() * .6 });
    scene.add(g);
  }
  return function step(t) {
    for (const f of flies) {
      const x = f.cx + Math.sin(t * .3 * f.sp + f.ph) * 3 + Math.sin(t * .9 + f.ph) * .6, z = f.cz + Math.cos(t * .25 * f.sp + f.ph * 1.3) * 3;
      const y = ground(x, z) + .7 + Math.sin(t * 2.1 + f.ph) * .3, px = f.g.position.x, pz = f.g.position.z;
      f.g.position.set(x, y, z); f.g.rotation.y = Math.atan2(x - px, z - pz);
      const fl = Math.sin(t * 22 * f.sp + f.ph) * .9; f.l.rotation.z = fl; f.r.rotation.z = -fl;
    }
  };
}
