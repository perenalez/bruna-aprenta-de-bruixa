/* =====================================================================
   PERSONAJE — contrato de «rig» + Bruna esculpida por defecto
   ---------------------------------------------------------------------
   La lógica (50_locomocio.js) NO conoce el muñeco: solo mueve grupos.
   Cualquier personaje que cumpla este contrato se anima igual
   (el de «Crea el teu personatge», la Bruna del juego, el que sea):

     rig = {
       root,   // Group a los pies, mirando a +z. La lógica pone posición y giro.
       inner,  // Group hijo de root: aplastar/estirar e inclinación.
       hips,   // pelvis. hips.position.y = hipY en reposo.
       hipY,   // altura de la cadera en reposo (m). Escala toda la animación.
       legs: [derecha(-x), izquierda(+x)],  // pivote en la cadera, cuelgan hacia -y
       arms: [derecho(-x), izquierdo(+x)],  // pivote en el hombro, cuelgan hacia -y
       neck,   // pivote de la cabeza
       // opcionales (si faltan, simplemente no se animan):
       hat,    // pivote del sombrero (muelle)
       cape,   // pivote de la capa en la espalda (se levanta con la velocidad)
       eyes,   // array de grupos: parpadeo con scale.y
       mouth, mouthY,  // boca: se abre al correr/saltar (scale.y relativo a mouthY)
       esc,    // escala de velocidades y balanceo (por defecto hipY/0.30)
       camY,   // altura a la que mira la cámara (por defecto 0.75)
       knees, feet, legRest, kneeRest,  // piernas con rodilla: [dcha, izda], pose de reposo
       elbows, // codos [dcho, izdo]
       extra(dt, pl, t, wn, rn),        // muelles propios del personaje
       nom,    // nombre que se ve en el botón «Personatge»
     }
   ===================================================================== */
const PAL_BRUNA = [
  C('#e2a77e'), // 0 piel
  C('#452a22'), // 1 pelo
  C('#6c4a90'), // 2 vestido
  C('#5a3a7a'), // 3 sombrero
  C('#d06aa8'), // 4 cinta rosa
  C('#7e3a72'), // 5 capa
  C('#c9a6dc'), // 6 media clara
  C('#6a4386'), // 7 raya de la media
  C('#5a3a40'), // 8 bota
  C('#e98a8a'), // 9 mejilla
  C('#b788d0'), // 10 borde de la falda
  C('#432a5e'), // 11 cinturón
  C('#b97a58'), // 12 piel en sombra (oreja)
  C('#f2a6cf'), // 13 puño rosa
];

// Bruna bruja esculpida con SDF (la de la prueba). progreso(0..1) para la barra de carga.
function brunaEsculpida(progreso = () => { }) {
  const mat = new THREE.MeshLambertMaterial({ vertexColors: true });
  const root = new THREE.Group(), inner = new THREE.Group(); root.add(inner);
  const hipY = .30;
  const hips = new THREE.Group(); hips.position.y = hipY; inner.add(hips);
  const mk = (geo, parent) => { const m = new THREE.Mesh(geo, mat); m.castShadow = true; m.receiveShadow = true; parent.add(m); return m; };

  // cuerpo: torso + falda acampanada con pliegues
  mk(esculpir((x, y, z) => {
    R0();
    U(sCap(x, y, z, 0, .2, 0, 0, .33, 0, .082, .095), 2);
    U(sEll(x, y, z, 0, .335, -.005, .118, .055, .082), 2, .05);
    const r = Math.hypot(x, z * 1.08), a = Math.atan2(z, x), t = clamp((.22 - y) / .30, 0, 1);
    const Rr = lerp(.092, .215, Math.pow(t, .8)) * (1 + .055 * Math.sin(a * 9) * t);
    U(Math.max((r - Rr) * .9, y - .23, -.075 - y + .012 * Math.sin(a * 9)), 2, .03);
    U(sSph(x, y, z, 0, .33, .088, .018), 4, .006);
    return D;
  }, (x, y, z, id) => (id === 2 && y < -.045) ? 10 : (id === 2 && y > .195 && y < .228) ? 11 : id,
  [-.27, -.11, -.27], [.27, .43, .27], .0085, PAL_BRUNA), hips);
  progreso(.2);

  // capa
  const cape = new THREE.Group(); cape.position.set(0, .345, -.04); hips.add(cape);
  mk(esculpir((x, y, z) => {
    R0();
    const r = Math.hypot(x, (z + .02) * 1.15), a = Math.atan2(z, x), t = clamp(-y / .4, 0, 1);
    const Rr = lerp(.10, .25, Math.pow(t, .75)) * (1 + .05 * Math.sin(a * 7) * t);
    U(Math.max(Math.abs(r - Rr) - .011, z + .02 - .03 * t, y - .015, -.42 - y), 5);
    return D;
  }, null, [-.3, -.46, -.32], [.3, .05, .08], .0085, PAL_BRUNA), cape);
  progreso(.3);

  // piernas: media de rayas (pintura por altura) + bota
  const legGeo = esculpir((x, y, z) => {
    R0();
    U(sCap(x, y, z, 0, .02, 0, 0, -.2, 0, .042, .035), 6);
    U(sCap(x, y, z, 0, -.17, 0, 0, -.255, .005, .047, .05), 8, .015);
    U(sEll(x, y, z, 0, -.268, .03, .056, .042, .083), 8, .03);
    D = Math.max(D, -.30 - y);
    return D;
  }, (x, y, z, id) => (id === 6 && Math.sin(y * 95) > .25) ? 7 : id, [-.08, -.33, -.1], [.08, .06, .14], .0065, PAL_BRUNA);
  const legs = [-1, 1].map(s => { const g = new THREE.Group(); g.position.set(s * .056, 0, 0); hips.add(g); mk(legGeo, g); return g; });
  progreso(.4);

  // brazos: manga abullonada + manopla con pulgar separado
  const arms = [-1, 1].map(s => {
    const g = new THREE.Group(); g.position.set(s * .128, .315, 0); hips.add(g);
    mk(esculpir((x, y, z) => {
      R0();
      U(sEll(x, y, z, 0, -.035, 0, .056, .066, .056), 2);
      U(sCap(x, y, z, 0, -.06, 0, 0, -.175, .012, .036, .031), 2, .03);
      U(sCap(x, y, z, 0, -.17, .012, 0, -.18, .014, .036, .036), 13, .004);
      U(sEll(x, y, z, 0, -.222, .016, .036, .046, .03), 0, .02);
      U(sCap(x, y, z, -s * .022, -.2, .03, -s * .03, -.222, .042, .014, .012), 0, .012);
      return D;
    }, null, [-.09, -.29, -.08], [.09, .05, .1], .0055, PAL_BRUNA), g);
    return g;
  });
  progreso(.5);

  // cabeza + pelo rizado (una sola pieza: los rizos se funden con el cráneo)
  const neck = new THREE.Group(); neck.position.set(0, .37, 0); hips.add(neck);
  const hr = rngf(17), curls = [];
  for (let i = 0; i < 70; i++) {
    const a = hr() * TAU, el = -0.45 + hr() * 1.5;
    const x = Math.cos(a) * Math.cos(el) * .175, y = .18 + Math.sin(el) * .17, z = Math.sin(a) * Math.cos(el) * .17;
    if (z > .03 && y < .235) continue;      // la cara queda libre
    curls.push([x, y, z, .034 + hr() * .022]);
  }
  for (let i = 0; i < 26; i++) { const a = Math.PI * (.05 + hr() * .9) + Math.PI, y = -.04 + hr() * .16; curls.push([Math.cos(a) * (.16 + hr() * .03), y, Math.sin(a) * (.13 + hr() * .04) - .02, .04 + hr() * .02]); }
  for (let i = 0; i < 9; i++) { const x = -.13 + i * .0325; curls.push([x, .235 + Math.sin(i * 2.1) * .01, .128 - Math.abs(x) * .3, .03 + hr() * .008]); }
  [1, -1].forEach(s => { curls.push([s * .158, .1, .03, .034], [s * .162, .05, .02, .032], [s * .155, .0, .0, .03]); });
  mk(esculpir((x, y, z) => {
    R0();
    U(sEll(x, y, z, 0, .175, 0, .158, .152, .148), 0);
    U(sEll(x, y, z, 0, .115, .035, .128, .1, .118), 0, .06);
    U(sEll(x, y, z, 0, .07, .07, .06, .045, .055), 0, .06);    // barbilla marcada
    U(sSph(x, y, z, 0, .13, .152, .016), 0, .02);              // nariz
    U(sEll(x, y, z, .156, .14, -.005, .022, .036, .028), 12, .015);
    U(sEll(x, y, z, -.156, .14, -.005, .022, .036, .028), 12, .015);
    U(sCap(x, y, z, 0, -.05, -.005, 0, .06, 0, .043), 0, .03);
    const sk = D, skid = ID;
    let hd = sEll(x, y, z, 0, .195, -.012, .172, .165, .163);
    hd = Math.max(hd, -Math.max(.035 - z, y - (.218 + .012 * Math.cos(x * 34))));
    D = 1e9; ID = 1; U(hd, 1);
    for (const c of curls) U(sSph(x, y, z, c[0], c[1], c[2], c[3]), 1, .028);
    const hairD = D; D = sk; ID = skid; U(hairD, 1, .012);
    return D;
  }, (x, y, z, id) => (id === 0 && (Math.hypot(x - .085, y - .098, z - .118) < .03 || Math.hypot(x + .085, y - .098, z - .118) < .03)) ? 9 : id,
  [-.25, -.12, -.25], [.25, .43, .25], .0065, PAL_BRUNA), neck).receiveShadow = false;  // sin sombra del ala en la cara
  progreso(.75);

  // ojos grandes (manga ligero), cejas y boca
  const eyeMat = new THREE.MeshLambertMaterial({ color: '#2a1717' }), white = new THREE.MeshBasicMaterial({ color: '#ffffff' });
  const sph = (m, sx, sy, sz, x, y, z, p) => { const o = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 12), m); o.scale.set(sx, sy, sz); o.position.set(x, y, z); p.add(o); return o; };
  const eyes = [-1, 1].map(s => {
    const g = new THREE.Group(); g.position.set(s * .056, .148, .147); g.rotation.set(-.08, s * .38, 0); neck.add(g);
    sph(eyeMat, .027, .037, .012, 0, 0, 0, g); sph(white, .0085, .0085, .0085, -s * .007, .012, .011, g); sph(white, .004, .004, .004, s * .008, -.013, .011, g);
    return g;
  });
  const brow = new THREE.MeshLambertMaterial({ color: '#2e1b18' });
  [-1, 1].forEach(s => { const b = sph(brow, .022, .006, .006, s * .058, .203, .142, neck); b.rotation.set(0, s * .35, s * .15); });
  const mouth = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 8, 0, TAU, Math.PI / 2, Math.PI / 2), new THREE.MeshLambertMaterial({ color: '#7a2a36' }));
  mouth.scale.set(.022, .016, .008); mouth.position.set(0, .086, .152); mouth.rotation.x = -.15; neck.add(mouth);

  // sombrero de bruja con la punta doblada (pieza propia, con muelle)
  const hat = new THREE.Group(); hat.position.set(0, .3, -.015); hat.rotation.x = -.12; neck.add(hat);
  mk(esculpir((x, y, z) => {
    R0();
    const rr = x * x + z * z;
    U(sEll(x, y + .045 * rr / .09 - .004 * Math.sin(Math.atan2(z, x) * 5), z, 0, 0, 0, .3, .02, .29), 3);
    U(sCap(x, y, z, 0, .0, 0, 0, .2, -.02, .145, .085), 3, .03);
    U(sCap(x, y, z, 0, .2, -.02, 0, .3, -.06, .085, .05), 3, .04);
    U(sCap(x, y, z, 0, .3, -.06, .01, .35, -.15, .05, .03), 3, .03);
    U(sCap(x, y, z, .01, .35, -.15, .02, .34, -.24, .03, .014), 3, .02);
    return D;
  }, (x, y, z, id) => (id === 3 && y > .02 && y < .065 && Math.hypot(x, z) < .17) ? 4 : id, [-.33, -.06, -.33], [.33, .42, .33], .007, PAL_BRUNA), hat);
  progreso(.9);

  return { nom: 'Bruixa', root, inner, hips, hipY, legs, arms, neck, hat, cape, eyes, mouth, mouthY: .016 };
}
