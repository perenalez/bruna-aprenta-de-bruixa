/* =====================================================================
   CONTROL Y CÁMARA — los mismos controles que el juego (decisión de Pere)
   ---------------------------------------------------------------------
   Móvil: joystick fijo abajo a la izquierda (#joy, mismos tamaños y
   estilos que src/index.html), botón «Saltar» abajo a la derecha.
   Joystick a medias = caminar; casi a fondo (≥0,7) = correr, igual que
   stepMove() del juego. Un dedo en la pantalla gira la cámara, dos dedos
   hacen zoom.
   Ordenador: WASD/flechas, Mayúsculas corre, Espacio salta, arrastrar
   gira la cámara, rueda = zoom.
   La cámara sigue con retraso suave y nunca baja del terreno.
   ===================================================================== */
const esTactil = matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window;

function crearControl(canvas, ui) {
  const keys = {};
  const st = { jump: false, held: false, btnHeld: false, turboBtn: false, yaw: Math.PI, pitch: .42, dist: 6.2, forcar: null };
  const input = { x: 0, y: 0 };
  addEventListener('keydown', e => { keys[e.code] = true; if (e.code === 'Space') { e.preventDefault(); if (!e.repeat) st.jump = true; } if (e.code.startsWith('Arrow')) e.preventDefault(); });
  addEventListener('keyup', e => { keys[e.code] = false; });
  // botón Saltar (mantenerlo apretado = salto más alto y suave)
  ui.jump.addEventListener('pointerdown', e => { st.jump = true; st.btnHeld = true; ui.jump.setPointerCapture && ui.jump.setPointerCapture(e.pointerId); e.preventDefault(); });
  const upJ = () => { st.btnHeld = false; }; ui.jump.addEventListener('pointerup', upJ); ui.jump.addEventListener('pointercancel', upJ);
  // botó «Turbo» (mantenir premut) · tecla T
  if (ui.turbo) { ui.turbo.addEventListener('pointerdown', e => { st.turboBtn = true; ui.turbo.setPointerCapture && ui.turbo.setPointerCapture(e.pointerId); e.preventDefault(); });
    const upT = () => { st.turboBtn = false; }; ui.turbo.addEventListener('pointerup', upT); ui.turbo.addEventListener('pointercancel', upT); }
  // joystick fijo
  { let jid = null; const JR = 50;
    const mv = e => { const r = ui.joy.getBoundingClientRect(); let dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2); const l = Math.hypot(dx, dy); if (l > JR) { dx *= JR / l; dy *= JR / l; } ui.knob.style.transform = `translate(${dx}px,${dy}px)`; input.x = dx / JR; input.y = dy / JR; };
    ui.joy.addEventListener('pointerdown', e => { jid = e.pointerId; ui.joy.setPointerCapture(jid); mv(e); if (ui.hint) ui.hint.style.opacity = 0; e.preventDefault(); });
    ui.joy.addEventListener('pointermove', e => { if (e.pointerId === jid) mv(e); });
    const end = e => { if (e.pointerId === jid) { jid = null; ui.knob.style.transform = ''; input.x = input.y = 0; } };
    ui.joy.addEventListener('pointerup', end); ui.joy.addEventListener('pointercancel', end); }
  // cámara: un dedo gira, dos dedos zoom; rueda del ratón = zoom
  { const ptrs = new Map(); let pd = 0;
    const dist2 = () => { const a = [...ptrs.values()]; return Math.hypot(a[0].x - a[1].x, a[0].y - a[1].y); };
    canvas.addEventListener('pointerdown', e => { canvas.setPointerCapture(e.pointerId); ptrs.set(e.pointerId, { x: e.clientX, y: e.clientY }); if (ptrs.size === 2) pd = dist2(); });
    canvas.addEventListener('pointermove', e => { const p = ptrs.get(e.pointerId); if (!p) return; const dx = e.clientX - p.x, dy = e.clientY - p.y; p.x = e.clientX; p.y = e.clientY;
      if (ptrs.size === 1) { st.yaw -= dx * .0065; st.pitch = clamp(st.pitch + dy * .005, .1, 1.1); }
      else if (ptrs.size === 2) { const d = dist2(); if (pd > 0) st.dist = clamp(st.dist * pd / d, 2.5, 14); pd = d; } });
    const up = e => { ptrs.delete(e.pointerId); pd = 0; }; canvas.addEventListener('pointerup', up); canvas.addEventListener('pointercancel', up);
    canvas.addEventListener('wheel', e => { st.dist = clamp(st.dist * (1 + e.deltaY * .001), 2.5, 14); e.preventDefault(); }, { passive: false }); }

  // entrada del fotograma en coordenadas de mundo (relativa a la cámara)
  // mag: 0 = quieta · ≤0,5 = caminar · 1 = correr (ver pasJugador)
  function leer() {
    let ix = 0, iz = 0, mag = 0;
    const kx = (keys.KeyD || keys.ArrowRight ? 1 : 0) - (keys.KeyA || keys.ArrowLeft ? 1 : 0);
    const kz = (keys.KeyS || keys.ArrowDown ? 1 : 0) - (keys.KeyW || keys.ArrowUp ? 1 : 0);
    const m = Math.hypot(input.x, input.y);
    if (st.forcar) { ix = st.forcar.x; iz = st.forcar.y; mag = st.forcar.mag; }
    else if (kx || kz) { ix = kx; iz = kz; mag = (keys.ShiftLeft || keys.ShiftRight) ? 1 : .5; }
    else if (m > .12) { ix = input.x; iz = input.y; mag = m < .7 ? .5 * clamp(m / .55, .4, 1) : 1; }
    const l = Math.hypot(ix, iz); if (l > 0) { ix /= l; iz /= l; }
    const fx = -Math.sin(st.yaw), fz = -Math.cos(st.yaw), rx = Math.cos(st.yaw), rz = -Math.sin(st.yaw);
    const out = { dx: rx * ix - fx * iz, dz: rz * ix - fz * iz, mag, jump: st.jump, held: !!(keys.Space || st.btnHeld), turbo: !!(keys.KeyT || st.turboBtn || st.turboForcat) };
    st.jump = false;
    return out;
  }
  return { st, leer, keys };
}

function seguirCamera(camera, st, target, pl, ground, dt, altura = .75) {
  target.x = damp(target.x, pl.x, 6, dt); target.y = damp(target.y, pl.y + altura, 6, dt); target.z = damp(target.z, pl.z, 6, dt);
  const cx = target.x + Math.sin(st.yaw) * Math.cos(st.pitch) * st.dist, cz = target.z + Math.cos(st.yaw) * Math.cos(st.pitch) * st.dist;
  const cy = Math.max(target.y + Math.sin(st.pitch) * st.dist, ground(cx, cz) + .6);
  camera.position.set(cx, cy, cz); camera.lookAt(target);
}
