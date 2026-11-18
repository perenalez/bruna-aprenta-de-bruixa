/* =====================================================================
   PRUEBA «MOVIMENT ESTIL ALBA» — montaje
   Renderer, luces, mundo, hierba, personaje, bucle y API de depuración.
   Personajes (decisión de Pere, 18-11-2026): por defecto la Bruna del
   juego (45_bruna_joc.js); el botón «Personatge» cambia a la Bruixa
   esculpida con capa (40_personatge.js). Si la página define
   window.ALBA_PERSONATGE (función que devuelve un rig), se añade a la
   lista: así «Crea el teu personatge» enchufa el suyo sin tocar la lógica.
   ===================================================================== */
const LOW = esTactil || Math.min(screen.width, screen.height) < 700;
const Q = { grass: LOW ? 16000 : 34000, flowers: LOW ? 500 : 1100, shadow: LOW ? 1024 : 2048, dpr: Math.min(devicePixelRatio || 1, LOW ? 1.6 : 2), terrainSeg: LOW ? 140 : 200, samples: LOW ? 2 : 4, extraTrees: LOW ? 6 : 14, flies: LOW ? 8 : 14 };
const $ = id => document.getElementById(id);
const barra = v => { $('bar').style.width = (v * 100).toFixed(0) + '%'; };
const respir = () => new Promise(r => setTimeout(r, 0));
document.querySelectorAll(esTactil ? '.desk' : '.touch').forEach(e => e.style.display = 'none');

const canvas = $('c');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: 'high-performance' });
renderer.setPixelRatio(Q.dpr); renderer.setSize(innerWidth, innerHeight, false);
renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
const scene = new THREE.Scene();
scene.fog = new THREE.Fog('#f0e1c2', 28, 140);
const camera = new THREE.PerspectiveCamera(42, innerWidth / innerHeight, .1, 900);
const hemi = new THREE.HemisphereLight('#dcedff', '#bba57a', .62); scene.add(hemi);
const sun = new THREE.DirectionalLight('#fff3e0', .95);
sun.castShadow = true; sun.shadow.mapSize.set(Q.shadow, Q.shadow);
Object.assign(sun.shadow.camera, { left: -16, right: 16, top: 16, bottom: -16, near: 1, far: 80 });
sun.shadow.bias = -.0006; sun.shadow.normalBias = .035;
scene.add(sun, sun.target);
const SUN_OFF = new THREE.Vector3(-16, 26, 11);

const ctl = crearControl(canvas, { joy: $('joy'), knob: $('knob'), jump: $('bjump'), hint: $('hint') });
const camT = new THREE.Vector3();
let rig, pl, post, parts, papallones, esc = 1;
// lista de personajes: el primero es el que sale al empezar
let FABRIQUES = [brunaJoc, brunaEsculpida], rigs = [], actual = 0;
function posarPersonatge(i, progreso) {
  if (rig) scene.remove(rig.root);
  actual = i;
  if (!rigs[i]) rigs[i] = FABRIQUES[i](progreso);
  rig = rigs[i]; esc = rig.esc ?? rig.hipY / .30;
  scene.add(rig.root);
  if (pl) { rig.root.position.set(pl.x, pl.y, pl.z); rig.root.rotation.y = pl.yaw; }
  $('pers').textContent = 'Personatge: ' + (rig.nom || (i + 1));
}
const mundo = { ground: MON.heightAt, canStand: (x, z) => MON.heightAt(x, z) > MON.SEA - .15, obstacles: [] };

async function iniciar() {
  await respir();
  if (typeof window.ALBA_PERSONATGE === 'function') FABRIQUES.unshift(window.ALBA_PERSONATGE);
  FABRIQUES = FABRIQUES.filter(f => f !== brunaJoc || !!BRUNA_JOC);
  rigs = FABRIQUES.map(() => null);
  posarPersonatge(0, v => barra(v * .8));
  $('pers').style.display = FABRIQUES.length > 1 ? '' : 'none';
  await respir(); barra(.85);
  mundo.obstacles = MON.construir(scene, Q, VENT.uTime);
  barra(.92); await respir();
  scene.add(herbaInstanciada({ count: Q.grass, area: [-50, -50, 50, 50], ground: MON.heightAt, density: MON.grassDensity, tall: MON.tallAt, obstacles: mundo.obstacles }));
  scene.add(florsInstanciades({ count: Q.flowers, area: [-45, -45, 45, 45], ground: MON.heightAt, spot: MON.flowerSpot, tall: MON.tallAt }));
  parts = crearParticules(scene, MON.heightAt);
  papallones = crearPapallones(scene, MON.heightAt, Q.flies);
  post = crearPostproces(renderer, { samples: Q.samples });
  pl = crearJugador(0, 11, Math.PI, MON.heightAt);
  camT.set(pl.x, pl.y + .75, pl.z);
  barra(1); window.__alba.tCarrega = Math.round(performance.now());
  $('load').style.opacity = 0; setTimeout(() => $('load').remove(), 700);
  $('hud').classList.add('on'); setTimeout(() => $('hint').style.opacity = 0, 9000);
  last = performance.now(); requestAnimationFrame(bucle);
}

let last = 0, tAcc = 0, fpsT = 0, fpsN = 0;
// «Motor: nou / actual» (decisió d'en Pere, 18-11-2026): la mateixa escena amb el motor nou (postprocés,
// herba amb vent i empenta) o dibuixada com el joc d'ara (sense postprocés i amb l'herba quieta), per comparar fps.
// Es guarda la mitjana d'fps de cada motor.
const MOTOR = { nou: true, tVent: 0, stats: { nou: [0, 0], actual: [0, 0] } };
function pas(dt) {
  tAcc += dt; const t = tAcc;
  if (MOTOR.nou) VENT.uTime.value = t;            // amb el motor actual l'herba no es mou
  const inp = ctl.leer();
  pasJugador(pl, inp, mundo, dt, esc);
  animarRig(rig, pl, dt, t, esc);
  // partículas según los eventos de la locomoción
  const fx = pl.x + Math.sin(pl.yaw) * .05, fz = pl.z + Math.cos(pl.yaw) * .05;
  if (pl.ev.jump) parts.emit('pols', pl.x, pl.gh, pl.z, 5, 1.4);
  if (pl.ev.land) parts.emit('pols', pl.x, pl.gh, pl.z, 7, 1.8);
  if (pl.ev.step) {
    const rn = clamp((pl.sp / esc - ALBA_P.walk) / (ALBA_P.run - ALBA_P.walk), 0, 1);
    parts.emit('pols', fx, pl.gh, fz, rn > .3 ? 2 : 1, .7);
    if (rn > .4 && MON.tallAt(pl.x, pl.z) > .3 && MON.grassDensity(pl.x, pl.z) > .3) parts.emit('herba', fx, pl.gh + .2, fz, 3);
  }
  parts.step(dt); papallones(t);
  seguirCamera(camera, ctl.st, camT, pl, MON.heightAt, dt, rig.camY ?? .75);
  sun.position.copy(camT).add(SUN_OFF); sun.target.position.copy(camT);
  if (MOTOR.nou) VENT.uPlayer.value.set(pl.x, pl.y, pl.z); else VENT.uPlayer.value.set(0, -99, 0);
}
function bucle(now) {
  const dt = Math.min(.05, (now - last) / 1000); last = now;
  pas(dt); dibuixar();
  fpsT += dt; fpsN++;
  if (fpsT > .5) { const f = fpsN / fpsT, k = MOTOR.nou ? 'nou' : 'actual', st = MOTOR.stats[k]; st[0] += fpsN; st[1] += fpsT;
    $('fps').textContent = Math.round(f) + ' fps'; fpsT = 0; fpsN = 0; mostrarStats(); }
  requestAnimationFrame(bucle);
}
addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight, false); post && post.setSize();
});
camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix();
function dibuixar() { if (MOTOR.nou) post.render(scene, camera); else renderer.render(scene, camera); }
function mostrarStats() { const m = k => { const s = MOTOR.stats[k]; return s[1] > 1 ? Math.round(s[0] / s[1]) + ' fps' : '—'; };
  $('stats').innerHTML = '<span>Mitjana · nou: ' + m('nou') + ' · actual: ' + m('actual') + '</span>'; }
$('motor').addEventListener('click', e => { MOTOR.nou = !MOTOR.nou; fpsT = 0; fpsN = 0;
  e.currentTarget.textContent = 'Motor: ' + (MOTOR.nou ? 'nou' : 'actual'); $('post').style.display = MOTOR.nou ? '' : 'none'; });
// «Sortir» torna a la llista de proves del joc
$('sortir').addEventListener('click', () => { location.href = './index' + (/\.local\.html/.test(location.pathname) ? '.local' : '') + '.html?prova=zona'; });
$('pers').addEventListener('click', () => posarPersonatge((actual + 1) % FABRIQUES.length));
$('post').addEventListener('click', e => { post.enabled = !post.enabled; e.currentTarget.textContent = 'Desenfocament: ' + (post.enabled ? 'sí' : 'no'); });

// API de depuración (mismo estilo que window.__j del juego): los tests congelan el bucle
// (requestAnimationFrame = () => 0) y avanzan el tiempo con step(n, dt).
window.__alba = {
  get pl() { return pl; }, get rig() { return rig; }, ctl, P: ALBA_P, MON, VENT, scene, camera, tCarrega: 0,
  step(n = 1, dt = 1 / 60) { for (let i = 0; i < n; i++) pas(dt); },
  render() { dibuixar(); },
  get motor() { return MOTOR.nou ? 'nou' : 'actual'; }, MOTOR,
  personatge(i) { posarPersonatge(i); return rig.nom; },
  input(x, y, mag) { ctl.st.forcar = (x || y) ? { x, y, mag } : null; },
  saltar() { ctl.st.jump = true; },
  teleport(x, z) { pl.x = x; pl.z = z; pl.y = MON.heightAt(x, z); camT.set(x, pl.y + .75, z); },
  camara(yaw, pitch, dist) { ctl.st.yaw = yaw; ctl.st.pitch = pitch; ctl.st.dist = dist; },
  get llest() { return !!pl; },
};
iniciar();
