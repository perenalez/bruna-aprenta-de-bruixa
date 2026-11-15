// Juega la poción 4 (Aeolum Pogicolum) a partir de una partida con las pociones 1, 2 y 3 hechas:
// cosquillas a la rana y burbujas, semillas del árbol gigante (rebotando en la seta), pescar el pez dorado,
// agua hasta la raya, flor de loto, escarcha (y que se funde si tardas), remover y la escoba de la terraza.
import { abrirJuego } from './_navegador.mjs';
const { browser, page, errores } = await abrirJuego({ congelar: false });
await page.evaluate(() => localStorage.setItem('bruna-nivel1-v1', JSON.stringify({ pot: 2, phase: 'fin', bag: [], got: {}, layers: [], diary: [], chat: [], unread: 0, clothes: ['barret', 'vestit', 'sabates'], wardOpen: true, hint: {}, guide: null, done: [0, 1, 2], cheese: false, flags: {} })));
await page.reload();
await page.waitForFunction(() => window.__j && window.__j.S, null, { timeout: 30000 });
await page.waitForTimeout(800);
await page.evaluate(() => { window.requestAnimationFrame = () => 0; });
let fallos = 0;
const ok = (c, m) => { console.log((c ? '✓ ' : '✗ ') + m); if (!c) fallos++; };
const IR = `const j=window.__j;const go=(x,z,y)=>{j.S.pos.set(j.OX+x,0,j.OZ+z);j.S.y=j.OY+y;j.S.vy=0;j.S.air=false;j.S.speed=0;j.step(20);};
  const goW=(x,z)=>{j.S.pos.set(x,0,z);j.S.y=j.gY(x,z);j.S.vy=0;j.S.air=false;j.S.speed=0;j.step(20);};const talk=()=>{for(let i=0;i<8&&j.dOn;i++)j.nextLine();};
  const shore=(a,k)=>j.shoreAt(a,k);`;
const E = body => page.evaluate(new Function(IR + body));

let r = await E(`const broomAntes=j.broom.g.visible;j.teleport('Trono');j.step(30);const d=j.dOn;talk();go(2.6,2.0,8.8);j.ACT.leer();document.getElementById('closeRead').click();return {d,pot:j.GS.pot,ph:j.GS.phase,broomAntes};`);
ok(r.d && r.pot === 3 && r.ph === 'recoger' && !r.broomAntes, 'la voz encarga la poción 4 (todavía sin escoba) ' + JSON.stringify(r));

r = await E(`const H=j.HAIRY;goW(H.x+0.8,H.z);const a=j.actions();if(a[0]==='peludo')j.ACT.peludo();
  const F=new THREE.Vector3();j.FROG.g.getWorldPosition(F);const ang=Math.atan2(F.x-j.POND.x,F.z-j.POND.z),p=shore(ang,1.12);goW(p.x,p.z);
  const b=j.actions();if(b[0]==='cosquillas'){j.ACT.cosquillas();window.__tickle();}j.step(30);const riu=j.FR.st,c=j.actions();if(c[0]==='burbujas')j.ACT.burbujas();
  return {a:a[0],dist:Math.hypot(F.x-j.S.pos.x,F.z-j.S.pos.z).toFixed(2),b:b[0],riu,c:c[0],rialla:!!j.GS.got.rialla};`);
ok(r.a === 'peludo' && r.b === 'cosquillas' && r.riu === 'riu' && r.c === 'burbujas' && r.rialla, 'bolet pelut, pessigolles a la granota i bombolles al pot ' + JSON.stringify(r));

r = await E(`const p=shore(j.LOTUS_A-0.4,1.12);goW(p.x,p.z);const a=j.actions();let pes=null;if(a.includes('pescar')){j.ACT.pescar();pes=j.FISH.st;}
  const M=j.SEEDM;j.S.pos.set(M.x,0,M.z);j.S.y=M.top+0.6;j.S.air=true;j.S.vy=-1;j.S.speed=0;j.S.jumpHeld=true;let n=0,top=0;while(j.S.air&&n<900){j.step(1);n++;top=Math.max(top,j.S.y-M.top);}j.S.jumpHeld=false;
  return {a,pes,seeds:j.GS.seeds,top:top.toFixed(1)};`);
ok(r.a.includes('llenar') && r.a.includes('pescar') && r.pes === null && r.seeds >= 3, 'a la vora de l’estany: omplir i pescar; sense llavors no pica; rebotant al bolet s’agafen les llavors ' + JSON.stringify(r));

r = await E(`const p=shore(j.LOTUS_A-0.4,1.12);goW(p.x,p.z);j.ACT.pescar();let n=0;while(j.FISH.st==='wait'&&n<400){j.step(1);n++;}const bite=j.FISH.st,boton=getComputedStyle(document.getElementById('tirar')).display;
  j.step(60);const escapa=j.FISH.st;j.ACT.pescar();n=0;while(j.FISH.st==='wait'&&n<400){j.step(1);n++;}j.step(5);j.pull();j.step(120);
  return {bite,boton,escapa,escates:!!j.GS.got.escates};`);
ok(r.bite === 'bite' && r.boton === 'block' && r.escapa === null && r.escates, 'pescant: si no estires s’escapa; estirant a temps, escata ' + JSON.stringify(r));

r = await E(`const p=shore(j.LOTUS_A-0.4,1.12);goW(p.x,p.z);j.ACT.llenar();window.__water(0.95);const pass1=!j.GS.got.aigua;window.__water(0.7);j.step(5);
  const q=shore(j.LOTUS_A,1.08);goW(q.x,q.z);const a=j.actions();if(a[0]==='coger')j.ACT.coger();
  return {pass1,aigua:!!j.GS.got.aigua,a:a[0],lotus:!!j.GS.got.lotus};`);
await page.waitForTimeout(700);
ok(r.pass1 && r.a === 'coger' && r.lotus, 'massa aigua es vessa; flor de lotus ' + JSON.stringify(r));
r = await E(`return {aigua:!!j.GS.got.aigua};`);
ok(r.aigua, 'aigua just fins a la ratlla ' + JSON.stringify(r));

r = await E(`go(j.FROST.x+0.8,j.FROST.z,13.2);let a=j.actions();if(a[0]==='coger')j.ACT.coger();const t0=j.GS.frostT>0;j.S.t+=61;j.step(2);const fos=!j.GS.got.gebre;
  j.step(300);go(j.FROST.x+0.8,j.FROST.z,13.2);a=j.actions();if(a[0]==='coger')j.ACT.coger();
  go(1.9,0.9,8.8);let n=0;for(let i=0;i<6;i++){if(j.actions()[0]==='echar'){j.ACT.echar();j.step(60);n++;}}const b=j.actions();if(b[0]==='remover'){j.ACT.remover();window.__stir(1);}
  return {t0,fos,n,b:b[0]};`);
ok(r.t0 && r.fos && r.n === 5 && r.b === 'remover', 'el gebre es fon si tardes; es torna a agafar i tot al calder ' + JSON.stringify(r));

await page.waitForTimeout(3500);
r = await E(`const d=j.dOn;talk();j.step(10);const vis=j.broom.g.visible;j.teleport('Terraza');j.step(5);const b=j.window;
  j.S.pos.set(j.OX-2.0,0,j.OZ+5.0);j.S.y=j.OY+13.2;j.step(10);const a=j.actions();if(a[0]==='escoba')j.ACT.escoba();j.step(5);
  return {d,vis,a:a[0],st:j.FL.state,ph:j.GS.phase,ropa:j.GS.clothes,escoba:j.POW.escoba};`);
ok(r.d && r.vis && r.a === 'escoba' && r.st === 'back' && r.ph === 'fin' && r.ropa.includes('escombra') && r.escoba, 'poció feta: l’escombra apareix a la terrassa i la Bruna l’agafa ' + JSON.stringify(r));

await browser.close();
if (errores.length) { console.error('✗ Errores:\n' + errores.join('\n')); process.exit(1); }
if (fallos) process.exit(1);
console.log('\nPoción 4 completa');
