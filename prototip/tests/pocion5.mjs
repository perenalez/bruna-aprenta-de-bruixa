// Juega la poción 5 (Lumus Controlarum) y el final del nivel a partir de una partida con las pociones 1 a 4 hechas:
// estornudo del unicornio, la cueva con tablas (el unicornio las rompe), setas luminosas, la luciérnaga (huye si corres),
// las luciérnagas del bote, la casa del árbol (plantar, «Pluja», trepar), remover, certificado y el gato.
import { abrirJuego } from './_navegador.mjs';
const { browser, page, errores } = await abrirJuego({ congelar: false });
await page.evaluate(() => localStorage.setItem('bruna-nivel1-v1', JSON.stringify({ pot: 3, phase: 'fin', bag: [], got: {}, layers: [], diary: [], chat: [], unread: 0, clothes: ['barret', 'vestit', 'sabates', 'escombra'], wardOpen: true, hint: {}, guide: null, done: [0, 1, 2, 3], cheese: false, flags: { uniHelp: 1 }, seeds: 2 })));
await page.reload();
await page.waitForFunction(() => window.__j && window.__j.S, null, { timeout: 30000 });
await page.waitForTimeout(800);
await page.evaluate(() => { window.requestAnimationFrame = () => 0; });
let fallos = 0;
const ok = (c, m) => { console.log((c ? '✓ ' : '✗ ') + m); if (!c) fallos++; };
const IR = `const j=window.__j;const go=(x,z,y)=>{j.S.pos.set(j.OX+x,0,j.OZ+z);j.S.y=j.OY+y;j.S.vy=0;j.S.air=false;j.S.speed=0;j.step(20);};
  const goW=(x,z)=>{j.S.pos.set(x,0,z);j.S.y=j.gY(x,z);j.S.vy=0;j.S.air=false;j.S.speed=0;j.step(20);};const talk=()=>{for(let i=0;i<8&&j.dOn;i++)j.nextLine();};`;
const E = body => page.evaluate(new Function(IR + body));

let r = await E(`j.teleport('Trono');j.step(30);const d=j.dOn;talk();go(2.6,2.0,8.8);j.ACT.leer();document.getElementById('closeRead').click();return {d,pot:j.GS.pot,ph:j.GS.phase};`);
ok(r.d && r.pot === 4 && r.ph === 'recoger', 'la voz encarga la última poción ' + JSON.stringify(r));

r = await E(`const P=j.SPICY;goW(P.x+0.8,P.z);const a=j.actions();if(a[0]==='picante')j.ACT.picante();const u=j.uniPos();goW(u.x+1.6,u.z+1.4);const b=j.actions();if(b[0]==='nariz')j.ACT.nariz();j.step(120);
  const pels=j.SNZ.st;const c=j.actions();if(c[0]==='pelos')j.ACT.pelos();return {a:a[0],b:b[0],pels,c:c[0],got:!!j.GS.got.peluni};`);
ok(r.a === 'picante' && r.b === 'nariz' && r.pels === 'pels' && r.c === 'pelos' && r.got, 'herba picant al nas: l’unicorn esternuda i s’atrapen els pèls ' + JSON.stringify(r));

r = await E(`goW(j.GT.x,j.PLANK_Z+3);j.cam.yaw=0;j.K.w=true;j.step(120);j.K.w=false;const bloqueada=j.S.pos.z>j.PLANK_Z;
  goW(j.GT.x,j.PLANK_Z+1.2);const a=j.actions();if(a[0]==='tablas')j.ACT.tablas();
  const u=j.uniPos();goW(u.x+1.6,u.z+1.4);const b=j.actions();if(b[0]==='ayuda')j.ACT.ayuda();talk();j.step(5);
  goW(j.GT.x,j.PLANK_Z+1.2);const c=j.actions();if(c[0]==='romper')j.ACT.romper();j.step(150);talk();const abierta=!!j.GS.flags.caveOpen;
  goW(j.GT.x,j.PLANK_Z+3);j.cam.yaw=0;j.K.w=true;j.step(450);j.K.w=false;const dentro=j.inCave,zf=+(j.S.pos.z-j.GT.z).toFixed(2),xf=+(j.S.pos.x-j.GT.x).toFixed(2),nb=j.BOXES.filter(b=>Math.abs(b.z-j.PLANK_Z)<0.01).length;
  return {zf,xf,nb,bloqueada,a:a[0],b:b[0],c:c[0],abierta,dentro};`);
ok(r.bloqueada && r.a === 'tablas' && r.b === 'ayuda' && r.c === 'romper' && r.abierta && r.dentro, 'la cova està tapada; l’unicorn ajuda i trenca les taules; es pot entrar ' + JSON.stringify(r));

r = await E(`const v=new THREE.Vector3();j.POTS.bolet.g.getWorldPosition(v);goW(v.x+0.7,v.z+0.4);const a=j.actions();if(a[0]==='coger')j.ACT.coger();
  const F=new THREE.Vector3();j.FFLY.getWorldPosition(F);goW(F.x+0.6,F.z+0.4);const b=j.actions();if(b[0]==='coger')j.ACT.coger();
  return {a:a[0],bolet:!!j.GS.got.bolet,bait:!!j.GS.bait,b:b[0],ll:!!j.GS.got.llucioles};`);
ok(r.a === 'coger' && r.bolet && r.bait && r.b === 'coger' && r.ll, 'dos bolets lluminosos (ingredient i esquer) i lluernes al pot ' + JSON.stringify(r));

r = await E(`const Q=j.QUIET;goW(Q.x+1.2,Q.z);const a=j.actions();if(a[0]==='dejarBolet')j.ACT.dejarBolet();j.step(120);const mitad=j.LL.still>1;
  j.S.speed=4;j.step(1);const huye=j.LL.still===0;j.S.speed=0;j.step(420);const posada=j.LL.st;const b=j.actions();if(b[0]==='tapar')j.ACT.tapar();
  return {a:a[0],mitad,huye,posada,b:b[0],got:!!j.GS.got.lluerna};`);
ok(r.a === 'dejarBolet' && r.mitad && r.huye && r.posada === 'posada' && r.b === 'tapar' && r.got, 'la lluerna: s’acosta si estàs quieta, fuig si corres, i es tapa el pot ' + JSON.stringify(r));

r = await E(`const S0=j.SOIL;goW(S0.x+1.0,S0.z+0.5);const a=j.actions();if(a[0]==='plantar')j.ACT.plantar();j.cast('lluvia');j.step(240);const b=j.actions();
  if(b[0]==='trepar')j.ACT.trepar();let top=0;for(let i=0;i<500&&j.CLIMB.st;i++){j.step(1);top=Math.max(top,j.S.y-S0.y);}
  return {a:a[0],grown:!!j.GS.flags.grown,b:b[0],top:+top.toFixed(1),cera:!!j.GS.got.cera,baix:+(j.S.y-S0.y).toFixed(1),ph:j.GS.phase};`);
ok(r.a === 'plantar' && r.grown && r.b === 'trepar' && r.top > 10 && r.cera && r.baix < 1 && r.ph === 'caldero', 'casa de l’arbre: plantar, pluja, enfilar-se i cera ' + JSON.stringify(r));

r = await E(`go(1.9,0.9,8.8);let n=0;for(let i=0;i<6;i++){if(j.actions()[0]==='echar'){j.ACT.echar();j.step(60);n++;}}const a=j.actions();if(a[0]==='remover'){j.ACT.remover();window.__stir(1);}return {n,a:a[0]};`);
ok(r.n === 5 && r.a === 'remover', 'al calder i a remenar ' + JSON.stringify(r));
await page.waitForTimeout(3500);
r = await E(`const d=j.dOn;talk();j.step(10);const cert=!!document.getElementById('cert');const okb=document.getElementById('certOk');if(okb)okb.click();j.step(30);
  return {d,cert,llum:j.POW.llum,gat:j.GS.clothes.includes('gat'),cat:j.CAT.on,ph:j.GS.phase};`);
ok(r.d && r.cert && r.llum && r.gat && r.cat && r.ph === 'fin', 'final del nivell: certificat de bruixa, el Gat la segueix i el conjur «Llum» ' + JSON.stringify(r));
r = await E(`j.teleport('Trono');j.step(30);const d=j.dOn,txt=document.querySelector('#dlg p').textContent;talk();return {d,txt};`);
ok(r.d && /nivell 1/.test(r.txt), 'a la sala del tron, la veu diu que s’ha acabat el nivell ' + JSON.stringify(r));

await browser.close();
if (errores.length) { console.error('✗ Errores:\n' + errores.join('\n')); process.exit(1); }
if (fallos) process.exit(1);
console.log('\nPoción 5 completa · fin del nivel 1');
