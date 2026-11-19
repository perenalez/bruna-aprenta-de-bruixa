/* =====================================================================
   LOCOMOCIÓN «ESTIL ALBA» — la lógica que le gusta a Pere
   ---------------------------------------------------------------------
   Dos partes independientes del muñeco:
     1) pasJugador(): física de movimiento (aceleración suave, giro
        amortiguado, salto flotante con pausa arriba, muelle de
        aplastar/estirar, colisiones con círculos).
     2) animarRig(): pose procedural sobre el contrato de rig
        (40_personatge.js). Todo amortiguado: nada de golpes secos.
   Todos los números ajustables están en ALBA_P.
   Las velocidades se escalan con el tamaño del personaje (hipY/0.30).
   ===================================================================== */
const ALBA_P = {
  walk: 2.4, run: 5.0,          // m/s para un personaje con cadera a 0,30 m
  accSuelo: 9, accAire: 3.5,    // rapidez con la que la velocidad alcanza la deseada (1/s)
  giro: 10,                     // rapidez del giro hacia la dirección de marcha (1/s)
  saltoV: 5.6,                  // velocidad inicial del salto
  gravedad: 15,
  gravedadMantenido: 9.5,       // subiendo con el botón apretado: salta más y más suave
  pausaArriba: .55,             // multiplica la gravedad cuando |vy| < 1.4 → «flota» arriba
  squashK: 140, squashC: 11,    // muelle de aplastar/estirar
  sombreroK: 90, sombreroC: 7,  // muelle del sombrero
  radio: .25,                   // radio del personaje para colisiones
  turbo: 7.4, dash: 11.3,       // turbo (botó «Turbo»); amb les bambes, cursa superràpida (com al joc: 8,5 i 13 m/s a la Bruna)
};

function crearJugador(x, z, yaw, ground) {
  return { x, z, y: ground(x, z), vx: 0, vz: 0, vy: 0, yaw, yawVel: 0, grounded: true, phase: 0, squash: 0, squashV: 0,
    hatX: -.12, hatZ: 0, hatVX: 0, hatVZ: 0, capeA: 0, blink: 2, airT: 0, ev: { step: false, land: false, jump: false } };
}

/* in = { dx, dz: dirección en el mundo (unitaria o 0), mag: 0..1 (≤0,5 camina, >0,5 corre),
          jump: se ha pulsado este fotograma, held: se mantiene }
   mundo = { ground(x,z), canStand(x,z), obstacles: [[x,z,r]...] } */
function pasJugador(pl, inp, mundo, dt, esc = 1) {
  const P = ALBA_P;
  pl.ev.step = pl.ev.land = pl.ev.jump = false;
  const W = P.walk * esc, Rn = P.run * esc;
  let target = inp.mag <= .5 ? inp.mag / .5 * W : lerp(W, Rn, (inp.mag - .5) / .5);
  // turbo: més ràpid; amb les bambes màgiques, la cursa superràpida («dash»)
  const turbo = inp.turbo && inp.mag > 0;if (turbo) target = (pl.shoes ? P.dash : P.turbo) * esc;
  pl.dash = turbo && pl.shoes; pl.dashK = damp(pl.dashK || 0, pl.dash ? 1 : 0, 6, dt);
  const acc = pl.grounded ? P.accSuelo : P.accAire;
  pl.vx = damp(pl.vx, inp.dx * target, acc, dt); pl.vz = damp(pl.vz, inp.dz * target, acc, dt);
  const sp = Math.hypot(pl.vx, pl.vz);
  if (sp > .15 * esc) {
    const want = Math.atan2(pl.vx, pl.vz); let d = want - pl.yaw; d = Math.atan2(Math.sin(d), Math.cos(d));
    const ny = pl.yaw + d * (1 - Math.exp(-P.giro * dt)); pl.yawVel = damp(pl.yawVel, (ny - pl.yaw) / dt, 8, dt); pl.yaw = ny;
  } else pl.yawVel = damp(pl.yawVel, 0, 8, dt);
  let nx = pl.x + pl.vx * dt, nz = pl.z + pl.vz * dt;
  for (const [ox, oz, r] of mundo.obstacles) { const dx = nx - ox, dz = nz - oz, d = Math.hypot(dx, dz), rr = r + P.radio * esc; if (d < rr && d > 1e-6) { nx = ox + dx / d * rr; nz = oz + dz / d * rr; } }
  if (mundo.canStand(nx, nz)) { pl.x = nx; pl.z = nz; } else { pl.vx *= .5; pl.vz *= .5; }
  const gh = mundo.ground(pl.x, pl.z);
  if (inp.jump && pl.grounded) { pl.vy = P.saltoV * Math.sqrt(esc); pl.grounded = false; pl.squashV = 5; pl.ev.jump = true; pl.dbl = false; }
  // bambes màgiques: doble salt a l'aire (com al joc amb les sabates de la poció 3)
  else if (inp.jump && !pl.grounded && pl.shoes && !pl.dbl) { pl.vy = Math.max(pl.vy, P.saltoV * .95 * Math.sqrt(esc)); pl.dbl = true; pl.squashV = 4; pl.ev.dbl = true; }
  if (!pl.grounded) {
    let g = P.gravedad; if (pl.vy > 0 && inp.held) g = P.gravedadMantenido; if (Math.abs(pl.vy) < 1.4) g *= P.pausaArriba;
    pl.glide = pl.dbl && pl.vy < 0 && inp.held;                 // després del doble salt, mantenint «Saltar», planeja
    if (pl.glide) pl.vy = damp(pl.vy, -1.25, 5, dt); else pl.vy -= g * dt; pl.y += pl.vy * dt; pl.airT += dt;
    if (pl.y <= gh) { pl.y = gh; pl.grounded = true; pl.dbl = false; pl.glide = false; pl.squashV = -4.5 - Math.min(3, -pl.vy * .3); pl.vy = 0; pl.airT = 0; pl.ev.land = true; }
  } else {
    pl.y = damp(pl.y, gh, 25, dt);
    if (sp < .1 && gh < pl.y - .3) pl.grounded = false;      // se cae por un desnivel
  }
  pl.squashV += (-pl.squash * P.squashK - pl.squashV * P.squashC) * dt; pl.squash += pl.squashV * dt;
  // fase del paso: frecuencia que crece con la velocidad (zancadas más largas al correr)
  const prev = Math.sin(pl.phase);
  if (sp > .05) pl.phase += dt * (2.0 + sp / esc * .62) * Math.PI;
  if (pl.grounded && sp > .7 * esc && Math.sign(prev) !== Math.sign(Math.sin(pl.phase))) pl.ev.step = true;
  pl.sp = sp; pl.gh = gh;
}

function animarRig(b, pl, dt, t, esc = 1) {
  const P = ALBA_P, sp = pl.sp / esc;
  const wn = clamp(sp / P.walk, 0, 1), rn = clamp((sp - P.walk) / (P.run - P.walk), 0, 1);
  const m = pl.grounded ? sstep(wn) : 0;
  const s = Math.sin(pl.phase), c = Math.cos(pl.phase);
  b.root.position.set(pl.x, pl.y, pl.z); b.root.rotation.y = pl.yaw;
  // inclinación hacia delante al correr y hacia dentro en las curvas
  const dk = pl.dashK || 0, lean = .06 * wn + .16 * rn + .14 * dk;
  const roll = clamp(-pl.yawVel * .05 * (.3 + rn), -.3, .3);
  b.inner.rotation.set(lean, 0, roll);
  const sq = clamp(pl.squash, -.5, .5); b.inner.scale.set(1 - sq * .35, 1 + sq * .6, 1 - sq * .35);
  // pelvis: balanceo flotante (amplitud pequeña: Pere pidió que no maree)
  const k = b.esc ?? b.hipY / .30;
  b.hips.position.y = b.hipY + ((Math.abs(c) - .6) * .028 * m * (1 + rn * .5) + (pl.grounded ? 0 : .02) + dk * .05 * Math.abs(c)) * k;   // amb el dash flota entre passes
  b.hips.rotation.y = s * .14 * m * (1 - rn * .4);
  b.hips.rotation.z = c * .035 * m;
  // piernas
  const amp = .55 + rn * .35 + dk * .25;
  const rest = b.legRest || 0;   // giro de cadera en reposo (rigs con rodilla, p. ej. la Bruna del juego)
  b.legs.forEach((g, i) => {
    const sg = i ? 1 : -1, u = g.userData;
    if (u.y0 === undefined) { u.y0 = g.position.y; u.sw = 0; u.lift = 0; }
    if (pl.grounded) { u.sw = sg * s * amp * m; u.lift = Math.max(0, -sg * c) * .055 * m * (1 + rn) * k; }
    else { u.sw = damp(u.sw, i ? -.55 : .35, 10, dt); u.lift = damp(u.lift, (i ? .06 : .02) * k, 10, dt); }
    g.rotation.x = u.sw + rest;
    g.position.y = u.y0 + u.lift;
    // opcionales: rodilla que se dobla al levantar el pie y pie que vuelve a quedar plano
    if (b.knees) {
      const lifted = pl.grounded ? u.lift / (.11 * k) : (i ? 1 : .4);
      const kn = b.knees[i]; kn.rotation.x = damp(kn.rotation.x, (b.kneeRest || 0) + clamp(lifted, 0, 1) * (.9 + rn * .4), 16, dt);
      if (b.feet) b.feet[i].rotation.x = -(g.rotation.x + kn.rotation.x) * .85;
    }
  });
  // braços (en Pere, 19-11): en córrer es mouen endavant i enrere al ritme de les passes, amb els colzes doblegats,
  // com quan es corre de debò. Només en la cursa superràpida amb les bambes s'obren en horitzontal, «d'avió».
  const breathe = Math.sin(t * 1.8) * .03;
  b.arms.forEach((g, i) => {
    const sg = i ? 1 : -1;
    let rx, rz;
    if (pl.grounded) { rx = -sg * s * (.5 + rn * .35) * m + breathe * .5 - rn * .12; rz = sg * (.12 + rn * .1 + breathe * .3); }
    else { rx = pl.glide ? -.4 : -.55; rz = sg * (pl.glide ? 1.0 : .5); }
    rx = lerp(rx, -.28 - sg * s * .06, dk); rz = lerp(rz, sg * (1.25 + Math.sin(pl.phase * 2) * .06), dk);
    g.rotation.x = damp(g.rotation.x, rx, 14, dt); g.rotation.z = damp(g.rotation.z, rz, 10, dt);
  });
  // opcional: codos ligeramente doblados (más al correr y en el aire)
  if (b.elbows) b.elbows.forEach(e => { e.rotation.x = damp(e.rotation.x, lerp(-(.25 + rn * 1.15 + (pl.grounded ? 0 : .2)), -.12, dk), 10, dt); });
  // cabeza
  b.neck.rotation.x = damp(b.neck.rotation.x, -lean * .7 + Math.sin(t * 1.8) * .015 + (pl.grounded ? 0 : -.12), 8, dt);
  b.neck.rotation.y = damp(b.neck.rotation.y, clamp(pl.yawVel * .08, -.4, .4), 6, dt);
  b.neck.rotation.z = -roll * .5;
  // sombrero con muelle (frenazos, giros, saltos)
  if (b.hat) {
    const ax = -(pl.vz * Math.cos(pl.yaw) + pl.vx * Math.sin(pl.yaw)) / esc;
    pl.hatVX += (-(pl.hatX - (-.12 + ax * .025 - pl.vy * .012)) * P.sombreroK - pl.hatVX * P.sombreroC) * dt; pl.hatX += pl.hatVX * dt;
    pl.hatVZ += (-(pl.hatZ - roll * .6) * P.sombreroK - pl.hatVZ * P.sombreroC) * dt; pl.hatZ += pl.hatVZ * dt;
    b.hat.rotation.x = pl.hatX + Math.abs(c) * .03 * m; b.hat.rotation.z = pl.hatZ;
  }
  // capa: se levanta con la velocidad y al caer
  if (b.cape) {
    pl.capeA = damp(pl.capeA, .12 + wn * .25 + rn * .75 + (pl.grounded ? 0 : (pl.vy < 0 ? .8 : .3)), 5, dt);
    b.cape.rotation.x = pl.capeA + Math.sin(t * 7 + pl.phase) * .05 * (wn + rn);
  }
  // parpadeo y boca
  pl.blink -= dt; const bl = pl.blink < .1 ? .12 : 1; if (pl.blink < 0) pl.blink = 2 + Math.random() * 3;
  if (b.eyes) b.eyes.forEach(e => e.scale.y = bl);
  if (b.mouth) b.mouth.scale.y = damp(b.mouth.scale.y, (rn > .3 || !pl.grounded ? 1.7 : 1) * b.mouthY, 8, dt);
  // opcional: muelles propios del personaje (pelo, falda, mochila…)
  if (b.extra) b.extra(dt, pl, t, wn, rn);
}
