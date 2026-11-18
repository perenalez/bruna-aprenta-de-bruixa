/* =====================================================================
   LA BRUNA DEL JUEGO, ADAPTADA AL CONTRATO DE RIG
   ---------------------------------------------------------------------
   construir.mjs copia en BRUNA_JOC, en el momento de montar, buildBruna()
   de src/js/40_bruna_modelo.js y las utilidades de 01_utilidades.js que
   necesita: la prueba usa SIEMPRE el modelo actual del juego, sin copias
   a mano. Si no los encuentra, BRUNA_JOC = null y la prueba solo tiene
   la Bruixa esculpida.
   Aquí solo se traduce su jerarquía (legL/legR con rodilla, pelvis,
   chest, armL/armR con codo, head, pelo, falda, mochila) al contrato.
   ===================================================================== */
function brunaJoc() {
  if (!BRUNA_JOC) return null;
  const B = BRUNA_JOC.build();
  const { STAND, HIPW } = BRUNA_JOC;
  const root = new THREE.Group(), inner = new THREE.Group(); root.add(inner); inner.add(B.root);
  B.root.traverse(o => { if (o.isMesh && o.castShadow) o.receiveShadow = true; });
  B.pelvis.position.y = STAND;
  B.legR.hip.position.set(-HIPW, STAND, 0); B.legL.hip.position.set(HIPW, STAND, 0);
  // muelles sencillos para lo que en el juego mueve 41_bruna_animacion.js
  const S = { hb: 0, hbv: 0, hs: 0, hsv: 0, sk: 0, skv: 0 };
  const spr = (k, x, v, target, dt, K = 60, Cc = 9) => { S[v] += (-(S[x] - target) * K - S[v] * Cc) * dt; S[x] += S[v] * dt; return S[x]; };
  return {
    nom: 'Bruna', root, inner, hips: B.pelvis, hipY: STAND,
    esc: 1.15, camY: .9,
    legs: [B.legR.hip, B.legL.hip], knees: [B.legR.knee, B.legL.knee], feet: [B.legR.foot, B.legL.foot],
    legRest: -.28, kneeRest: .56,
    arms: [B.armR.sh, B.armL.sh], elbows: [B.armR.el, B.armL.el],
    neck: B.head, eyes: B.eyes,
    extra(dt, pl, t, wn, rn) {
      const air = !pl.grounded, fall = air && pl.vy < 0;
      if (B.hairB) B.hairB.rotation.x = spr(0, 'hb', 'hbv', .1 * wn + .4 * rn + (air ? (fall ? -.25 : .3) : 0), dt);
      const sway = spr(0, 'hs', 'hsv', clamp(-pl.yawVel * .06, -.3, .3) + Math.sin(pl.phase) * .06 * wn, dt);
      if (B.hairS) B.hairS.forEach((h, i) => { h.rotation.z = sway + (i ? -1 : 1) * .12 * rn; h.rotation.x = .25 * rn; });
      const fl = spr(0, 'sk', 'skv', .06 * rn + (fall ? .16 : 0), dt, 55, 11);
      if (B.skirt) { B.skirt.scale.set(1 + fl, 1, 1 + fl); B.skirt.rotation.x = .15 * rn; }
      if (B.pack) B.pack.rotation.x = clamp(-pl.squash * .6, -.3, .3);
    },
  };
}
