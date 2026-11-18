// Encàrrec v.1, pas 2: ingredient lila que desapareix, gat que camina i va a l'escombra, botons de llocs que es
// desbloquegen, llum segons l'hora, Conill amb taques i cua arc de Sant Martí, doble salt amb les sabates màgiques.
// (La volta de 360° de la càmera es prova a portada.mjs.)
import { abrirJuego } from './_navegador.mjs';
const fallos = [];
const ok = (c, m) => { if (!c) fallos.push(m); };
const { browser, page, errores } = await abrirJuego();
await page.evaluate(() => { localStorage.clear(); });

// 2.1 · el pot violeta de l'escala no torna a aparèixer un cop agafat (ni en passar per l'escala)
const lila = await page.evaluate(() => {
  const j = window.__j, p = j.POTS.violeta, w = new THREE.Vector3();
  j.teleport('Trono'); j.step(5); p.g.getWorldPosition(w);
  j.S.pos.set(w.x + 0.6, 0, w.z); j.S.y = w.y - 0.3; j.step(10);
  const abans = p.g.visible;
  p.g.visible = false; j.GS.phase = 'recoger'; j.giveIngredient('violeta');
  j.step(60);
  return { abans, despres: p.g.visible, desat: !!JSON.parse(localStorage.getItem('bruna-nivel1-v1') || '{}').got?.violeta, accio: j.potionActions() };
});
ok(lila.abans, 'el pot violeta no es veia abans d\'agafar-lo (prova mal plantejada)');
ok(!lila.despres, 'el pot violeta torna a aparèixer després d\'agafar-lo');
ok(lila.desat, 'el pot violeta no queda desat com a agafat');
ok(!(lila.accio || []).includes('coger'), 'encara surt «Agafar» al lloc del pot violeta');

// 2.3 · botons de llocs: cap al començament; apareix en entrar-hi caminant i es desa
const llocs = await page.evaluate(() => {
  const j = window.__j, vis = () => [...document.querySelectorAll('#chips button')].filter(b => b.style.display !== 'none').map(b => b.textContent);
  j.teleport('Bosque'); j.step(3); j.placesStep(); j.GS.places.length = 0; j.placeChips(); j.placesStep();
  const inici = vis();
  // caminar fins al clar del torreó: es posa a 8 m i s'acosta
  j.S.pos.set(j.OX, 0, j.OZ + 20.5); j.S.y = j.gY(j.S.pos.x, j.S.pos.z); j.placesStep();
  for (let i = 0; i < 40; i++) { j.S.pos.z -= 0.2; j.S.y = j.gY(j.S.pos.x, j.S.pos.z); j.placesStep(); }
  return { inici, despres: vis(), desat: JSON.parse(localStorage.getItem('bruna-nivel1-v1') || '{}').places };
});
ok(llocs.inici.length === 0, 'al començament ja hi ha botons de llocs: ' + llocs.inici.join(', '));
ok(llocs.despres.includes('Torreó'), 'en entrar caminant al clar del torreó no apareix el botó «Torreó»');
ok((llocs.desat || []).includes('Torreón'), 'el lloc desbloquejat no es desa amb la partida');

// 2.4 · llum segons l'hora
const hores = await page.evaluate(() => {
  const j = window.__j, r = {};
  for (const h of [3, 6.75, 12, 20.25, 21.5, 23]) { j.setHour(h); r[h] = { bg: '#' + j.DAY.pal.bg.replace('#', ''), stars: j.DAY.pal.stars }; }
  j.setHour(null); return r;
});
ok(hores[3].bg === '#40398f' && hores[23].bg === '#40398f', 'de nit no és la llum de nit de sempre');
ok(hores[12].stars === 0 && hores[12].bg !== '#40398f', 'a migdia no és de dia');
ok(hores[6.75].bg !== hores[12].bg && hores[20.25].bg !== hores[12].bg && hores[21.5].bg !== hores[23].bg, 'falten l\'alba, la posta o el capvespre');

// 2.5 i 2.6 · Conill amb taques blanques i cua que canvia de color quan té missatge
const conill = await page.evaluate(() => {
  const j = window.__j; let taques = 0;
  j.BN.root.traverse(o => { if (o.isMesh && o.material.color && o.material.color.getHexString() === 'fbf6ec') taques++; });
  j.GS.unread = 1; j.step(1); const c1 = j.BN.tail.material.emissive.getHexString(), i1 = j.BN.tail.material.emissiveIntensity;
  j.step(90); const c2 = j.BN.tail.material.emissive.getHexString();
  j.GS.unread = 0; j.step(1); const i0 = j.BN.tail.material.emissiveIntensity;
  return { taques, c1, c2, i1, i0 };
});
ok(conill.taques >= 10, 'el Conill no té taques blanques (' + conill.taques + ')');
ok(conill.i1 > 0.5 && conill.c1 !== conill.c2, 'la cua no brilla canviant de color quan hi ha missatge');
ok(conill.i0 === 0, 'la cua continua brillant sense missatges');

// 2.2 · el gat camina (potes que es dobleguen) i va assegut a l'escombra
const gat = await page.evaluate(() => {
  const j = window.__j, C = j.CAT; j.teleport('Bosque'); j.step(2);
  C.on = true; C.g.visible = true; C.x = j.S.pos.x + 4; C.z = j.S.pos.z; C.y = j.S.y;
  let maxHip = 0, maxKnee = 0;
  for (let i = 0; i < 40; i++) { j.step(1); C.legs.forEach(l => { maxHip = Math.max(maxHip, Math.abs(l.hip.rotation.x)); maxKnee = Math.max(maxKnee, Math.abs(l.kn.rotation.x)); }); }
  j.FL.state = 'fly'; j.step(2); const muntat = C.g.parent === j.B.root;
  j.FL.state = 'back'; j.step(2); const baixat = C.g.parent !== j.B.root;
  return { maxHip, maxKnee, muntat, baixat };
});
ok(gat.maxHip > 0.15 && gat.maxKnee > 0.1, 'el gat no mou les potes en caminar');
ok(gat.muntat, 'el gat no puja a l\'escombra amb la Bruna');
ok(gat.baixat, 'el gat no baixa de l\'escombra en aterrar');

// 2.8 · doble salt i planeig amb les sabates màgiques (i sense sabates, salt normal)
const salt = await page.evaluate(() => {
  const j = window.__j, S = j.S;
  const provar = (doble) => {
    j.teleport('Bosque'); j.step(5); const y0 = S.y; let top = y0, dbl = false;
    S.jumpReq = true; S.jumpHeld = true; j.step(1);
    for (let i = 0; i < 200; i++) {
      if (doble && S.air && S.vy < 0.5 && !dbl) { S.jumpReq = true; dbl = true; }
      j.step(1); top = Math.max(top, S.y); if (!S.air && i > 10) break;
    }
    S.jumpHeld = false; return { alt: top - y0, d: S.dbl };
  };
  const sense = provar(true);
  j.wearShoes(); const amb = provar(true);
  // planeig: després del doble salt, mantenint premut, cau lentament
  j.teleport('Bosque'); j.step(5); S.jumpReq = true; S.jumpHeld = true; j.step(1);
  for (let i = 0; i < 30 && !S.air; i++) j.step(1);
  for (let i = 0; i < 60 && S.vy > 0.3; i++) j.step(1);
  S.jumpReq = true; j.step(1); for (let i = 0; i < 40 && S.vy > -0.5; i++) j.step(1); for (let i = 0; i < 30; i++) j.step(1);
  const planeja = S.glide, vy = S.vy; S.jumpHeld = false; j.step(120);
  return { sense: sense.alt, amb: amb.alt, planeja, vy };
});
ok(salt.amb > salt.sense * 1.4, `el doble salt no puja més (amb sabates ${salt.amb.toFixed(2)} m, sense ${salt.sense.toFixed(2)} m)`);
ok(salt.planeja && salt.vy > -2, 'després del doble salt no planeja mantenint premut');

// v.1.2 · la primera vegada, en Conillet es posa davant, parla i guia la Bruna pel camí fins al torreó amb una llumeta
const guia = await page.evaluate(() => {
  const j = window.__j, S = j.S; for (let i = 0; i < 20 && j.dOn; i++) j.nextLine(); j.GS.phase = 'inicio'; j.GS.flags.guia = 0; j.GS.places.length = 0;
  j.teleport('Bosque'); j.step(30); j.startLead();
  for (let i = 0; i < 300 && j.LEAD.st === 'front'; i++) j.step(1);
  const parla = j.LEAD.st === 'talk' && document.getElementById('dlg').innerText.includes('Conillet');
  for (let i = 0; i < 6 && j.dOn; i++) j.nextLine();
  const guiant = j.LEAD.st === 'lead';
  // la Bruna camina pel camí cap al torreó; el conill ha d'anar per davant (més a prop del torreó que ella)
  let davant = 0, n = 0;
  for (let k = 0; k < 900 && j.LEAD.st === 'lead'; k++) {
    const z = S.pos.z - 0.06; S.pos.set(j.pathX ? j.pathX(z) : S.pos.x, 0, z); S.y = j.gY(S.pos.x, S.pos.z); j.step(1);
    if (k % 30 === 0 && k > 60) { n++; if (j.BN.z < S.pos.z - 0.5) davant++; }
  }
  const arriba = j.LEAD.st === 'arrived' || !j.LEAD.on;
  for (let i = 0; i < 6 && j.dOn; i++) j.nextLine();
  return { parla, guiant, davant, n, arriba, fi: !j.LEAD.on, desat: !!j.GS.flags.guia };
});
ok(guia.parla, 'en Conillet no es posa a parlar en començar');
ok(guia.guiant, 'després de parlar, en Conillet no comença a guiar');
ok(guia.n > 3 && guia.davant >= guia.n - 1, `en Conillet no va per davant de la Bruna (${guia.davant}/${guia.n})`);
ok(guia.arriba && guia.fi && guia.desat, 'en arribar al torreó la guia no s\'acaba o no es desa');

await browser.close();
if (errores.length) fallos.push('Errors:\n' + errores.join('\n'));
if (fallos.length) { console.error('✗ v.1:\n- ' + fallos.join('\n- ')); process.exit(1); }
console.log('✓ v.1: pot violeta, gat, llocs, hora del dia, Conill, doble salt, Conillet guia', JSON.stringify({ salt: { amb: +salt.amb.toFixed(2), sense: +salt.sense.toFixed(2) } }));
