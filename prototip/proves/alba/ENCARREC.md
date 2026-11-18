# Prova «Moviment estil Alba» — encàrrec per a Claude Code

> Paquet preparat al xat amb Claude (17 i 18-11-2026) a partir de la prova 3D que en Pere va jugar
> el 16-11-2026. **Llegeix-lo sencer abans de tocar res.** Les decisions d'en Pere són a la secció 8.
> Si n'hi falta alguna, pregunta-la-hi. No inventis.

## 1. Què és i què li agrada a en Pere

És una prova 3D jugable: una illa daurada a l'estil d'*Alba: A Wildlife Adventure*, amb un personatge que camina, corre i salta.

En Pere en vol conservar **la lògica**, no el ninot. El personatge canviarà segons el que s'esculli a «Crea el teu personatge». Per això el paquet separa:

- **la lògica**, que és el que s'ha de mantenir:
  - el moviment i l'animació;
  - l'herba que s'aparta;
  - la llum i el desenfocament;
  - les partícules;
- **el personatge**, que es pot canviar: qualsevol model que compleixi el contracte de la secció 4.

Què fa que el moviment se senti «Alba»:

- **Acceleració i frenada suaus**: no s'atura en sec.
- **Gir amortit.** En les corbes s'inclina cap a dins.
- **Camina i corre.** Camina amb el joystick a mitges i corre amb el joystick a fons. En córrer s'inclina endavant i **obre els braços** «d'avió».
- **Salt flotant.** Si es manté premut, puja més suau. Prop del punt més alt la gravetat es redueix i queda un moment suspès.
- **Aixafar i estirar** amb molla: s'estira en saltar i s'aixafa en aterrar.
- **Molles secundàries:**
  - el barret i la capa (Bruixa);
  - els cabells, la faldilla i la motxilla (Bruna del joc).
- **Balanceig de pelvis petit**: no ha de marejar (és una petició expressa d'en Pere).
- **Herba** que es mou amb el vent i **s'aparta i s'aixafa** quan el personatge hi passa per sobre.
- **Partícules:**
  - pols a cada petjada, en saltar i en aterrar;
  - brins d'herba que salten en córrer per l'herba alta;
  - papallones.
- **Imatge:**
  - desenfocament tipus maqueta: el fons, i una mica el primer pla;
  - gradació càlida i vinyeta;
  - boira càlida;
  - ombres suaus que segueixen el personatge.

## 2. Contingut del paquet (`prototip/proves/alba/`)

| Fitxer | Què hi ha |
|---|---|
| `js/00_util.js` | Ajudants (`clamp`, `damp`, soroll, `rngf`) i `fusionar()`, que fa la fusió de geometries (r128 no porta `BufferGeometryUtils` al nucli) |
| `js/10_escultor.js` | **Escultor SDF**: primitives amb unió suau i extracció de superfície («surface nets»). En surt una sola malla orgànica per peça. Pot servir per a «Crea el teu personatge» |
| `js/20_mon.js` | L'illa de la prova: terreny, camins, pins i oliveres (`taperTube`, `canopyBlob` amb **vora de fulles**), roques, atzavares, tanca, torreó, mar i cel. **Només és decorat de la prova** |
| `js/30_herba.js` | **Herba instanciada amb vent i empenta** (`herbaInstanciada`, `florsInstanciades`, `VENT`). L'API és genèrica: rep funcions de terra i de densitat |
| `js/40_personatge.js` | **Contracte del rig** i la **Bruixa** esculpida, amb barret i capa |
| `js/45_bruna_joc.js` | **La Bruna del joc** adaptada al contracte (vegeu més avall) |
| `js/50_locomocio.js` | **La lògica**: `ALBA_P` (tots els valors ajustables), `crearJugador`, `pasJugador` (física) i `animarRig` (pose) |
| `js/60_postproces.js` | Desenfocament, gradació i vinyeta, amb un *render target* propi (sense `EffectComposer`) |
| `js/70_particules.js` | Pols, brins d'herba i papallones |
| `js/80_control.js` | **Els mateixos controls que el joc**, una còpia de `40_bruna_modelo.js`: joystick fix a baix a l'esquerra i botó «Saltar». Un dit gira la càmera i dos dits fan zoom. Teclat WASD, Maj i Espai. També hi ha la càmera de seguiment |
| `js/90_prova.js` | Muntatge, llista de personatges, bucle i API de depuració `window.__alba` |
| `index.html` | Plantilla amb la interfície en català. Els controls tenen els mateixos estils que `src/index.html` (`#joy`, `#knob`, `.rb`, `#bjump`) |
| `construir.mjs` | Munta `js/*.js` com `tools/build.mjs` i genera `dist/prova-alba.html` i `dist/prova-alba.local.html` |
| `test.mjs` | Prova automàtica. Desa captures a `captures/`. Comprova: <ul><li>camina, corre, salta i aterra;</li><li>l'herba;</li><li>els dos personatges;</li><li>que no hi ha errors.</li></ul> |
| `referencia-original.html` | La versió exacta que va jugar en Pere (three r170, ES modules), per comparar-hi l'aspecte |

**La Bruna del joc no està copiada a mà.**

- Cada vegada que es munta, `construir.mjs` llegeix `buildBruna()` de `src/js/40_bruna_modelo.js` i les utilitats que fa servir (de `const mk=` fins a `const mRab=` de `01_utilidades.js`).
- Les embolica en `BRUNA_JOC`. Així, si es canvia la Bruna del joc, la prova la recull sola.
- Si un dia es reorganitzen aquells fitxers i els marcadors no hi són, la prova es munta igualment amb només la Bruixa i ho avisa per consola. En aquest cas, cal actualitzar `brunaJoc()` de `construir.mjs`.
- L'adaptador (`45_bruna_joc.js`) fa la correspondència amb el contracte:
  - `legL/legR.hip` → `legs`;
  - `knee` → `knees`;
  - `foot` → `feet`;
  - `pelvis` → `hips`, amb `hipY = STAND`;
  - `armL/armR.sh` → `arms`;
  - `el` → `elbows`;
  - `head` → `neck`.
- Hi afegeix molles senzilles per a `hairB`, `hairS`, `skirt` i `pack`. **Això no és l'IK ni les molles de `41_bruna_animacion.js`**, és una aproximació per a la prova.

**Estat verificat al xat (18-11-2026):**

- `construir.mjs` + `test.mjs` passen amb **three r128**, en Chromium headless amb SwiftShader, muntant amb el `src/js` real del joc.
- Resultats:
  - camina a 2,5 m/s i corre a 5,75 m/s (Bruna del joc, `esc` = 1,15);
  - salt de 0,88 m;
  - aterra;
  - 35.100 matolls;
  - personatges «Bruna» i «Bruixa»;
  - 0 errors.
- També s'ha comprovat que `construir.mjs` funciona dins la carpeta del projecte (en una còpia, sense escriure a `dist/`).
- **No s'ha provat en un mòbil real.**

## 3. On encaixa al joc i quan s'ha de fer

**Decisió d'en Pere (18-11-2026): és una prova nova a la llista de «Testejar», «Moviment estil Alba».**

- És el **pas 6** de l'encàrrec general, apartat 3.4.
- Com tots els passos, no s'hi comença a treballar fins que en Pere digui que toca, i en acabar s'espera el seu OK.

### Passos

1. **Executar-la tal com està:**
   - `node proves/alba/construir.mjs`, `node proves/alba/test.mjs` i obrir `dist/prova-alba.local.html`;
   - revisar les captures de `captures/`.
2. **Integrar-la al build:**
   - `tools/build.mjs` ha de cridar `proves/alba/construir.mjs`, perquè `npm run build` també generi `dist/prova-alba*.html`.
   - Afegeix `test:alba` a `package.json` i inclou-lo a `npm test`.
   - Afegeix `proves/alba/captures/` a `.gitignore`.
3. **Publicar-la:** a `tools/publicar-proves.sh`, afegeix `prova-alba.html` a la línia `cp`.
4. **Entrada a la llista de «Testejar»:**
   - «Moviment estil Alba», darrere de les tres que ja hi ha.
   - Mentre no estigui feta, es veu desactivada amb «Aviat».
   - El botó «Sortir» de la prova torna a la llista.
5. **Personatges** (ja fet al paquet):
   - surt la **Bruna del joc**;
   - el botó «Personatge» canvia a la **Bruixa** amb capa;
   - quan existeixi «Crea el teu personatge», el personatge creat s'afegirà a la llista amb `window.ALBA_PERSONATGE` (secció 4).
6. **Comprovar el desenfocament** (secció 8, punt 3) i ensenyar-la a en Pere: un enllaç per obrir-la al mòbil. Demana-li quants fps marca i si el moviment se sent igual que al xat. **Després, espera el seu OK.**

## 4. Contracte del rig (com connectar-hi qualsevol personatge)

La lògica només mou grups. Un personatge és un objecte així:

```js
{
  nom,             // el que es veu al botó «Personatge»
  root,            // Group als peus, mirant cap a +z (la lògica en posa la posició i el gir)
  inner,           // fill de root: aixafar/estirar i inclinació
  hips, hipY,      // pelvis i alçada de maluc en repòs (m)
  legs: [dreta(-x), esquerra(+x)],   // pivot al maluc, pengen cap a -y
  arms: [dreta(-x), esquerra(+x)],   // pivot a l'espatlla, pengen cap a -y
  neck,            // pivot del cap
  // opcionals (si no hi són, no s'animen):
  esc,             // escala de velocitats i balanceig (per defecte hipY/0.30)
  camY,            // alçada on mira la càmera (per defecte 0.75)
  knees, feet, legRest, kneeRest,  // cames amb genoll i postura de repòs
  elbows,          // colzes
  hat, cape, eyes: [...], mouth, mouthY,
  extra(dt, pl, t, wn, rn),        // molles pròpies del personatge
}
```

Per afegir el personatge de «Crea el teu personatge», defineix **`window.ALBA_PERSONATGE = () => rig`**. Es posarà el primer de la llista.

On es desa el personatge creat ho decidirà el pas 3 de l'encàrrec. Aquí només cal llegir-lo i muntar-ne el rig.

## 5. Diferències tècniques ja resoltes (r170 → r128)

| Original r170 | Al paquet r128 |
|---|---|
| `EffectComposer` + `OutputPass` | *render target* propi + quad (`60_postproces.js`). Fa servir multisample si hi ha WebGL2 |
| `mergeGeometries` | `fusionar()` |
| `instanceColor` | atribut instanciat `aTint`, que es multiplica a `vColor` |
| `transpose()` al shader | producte amb tres `dot()` (equivalent) |
| `MeshStandardMaterial` al personatge | `MeshLambertMaterial`, com la resta del joc |
| `NeutralToneMapping`, llums «físiques» | sense *tone mapping*. Llums retocades per al mode antic: `hemi` 0,62 i `sun` 0,95 |
| `CapsuleGeometry` (celles) | esfera escalada |

L'aspecte és molt proper però no idèntic: r128 es veu una mica més saturat i groc. Si en Pere ho nota, ajusta primer les llums de `90_prova.js` i `sat` del postprocés.

## 6. Peces que es podrien portar al joc principal (es valoraran al final)

**Decisió d'en Pere: es valoraran al final. No en portis cap ara.** Les apunto perquè la feina d'aquesta prova no les bloquegi:

1. Herba instanciada amb empenta (`30_herba.js`) per al bosc i la vall. Seria una sola crida de dibuix, i ja és a les «idees per continuar» de `prototip/CLAUDE.md`.
2. Postprocés (`60_postproces.js`), segons com hagi anat la prova de desenfocament.
3. Sensacions de la locomoció per incorporar a `41_bruna_animacion.js` sense substituir-lo:
   - la pausa al punt alt del salt;
   - la inclinació a les corbes;
   - aixafar/estirar.
4. Copes amb vora de fulles (`canopyBlob`).
5. Escultor SDF per a «Crea el teu personatge».

## 7. Criteris d'acceptació

- [ ] `npm run build` genera també `dist/prova-alba.html` i `dist/prova-alba.local.html`, amb la Bruna del joc inclosa (sense l'avís «es munta sense la Bruna del joc»).
- [ ] `npm test` passa sencer, inclosa `test:alba`, sense errors a la consola.
- [ ] Des de «Testejar» s'obre la prova, i «Sortir» hi torna.
- [ ] Surt la Bruna del joc, i el botó «Personatge» canvia a la Bruixa i torna.
- [ ] Els controls són els del joc: joystick fix, «Saltar», un dit per a la càmera i dos dits per al zoom.
- [ ] Tots els textos visibles són en **català**.
- [ ] La prova del desenfocament està feta (secció 8, punt 3) i en Pere n'ha vist el resultat.
- [ ] En Pere l'ha provada en un mòbil real i ha dit quants fps marca.

## 8. Decisions d'en Pere (18-11-2026)

1. **On va:** prova nova «Moviment estil Alba» a la llista de «Testejar» (pas 6). ✅
2. **Personatge:** de moment, **el personatge bàsic que ja tenim (la Bruna del joc)**, amb **l'opció de canviar a la Bruixa** de la prova, amb capa i barret. ✅ Fet al paquet.
3. **Controls: els que ja teníem**, perquè li semblen més clars. ✅ Fet al paquet: joystick fix i botó «Saltar».
4. **Desenfocament: es prova, per veure si afecta la usabilitat.**
   - Es manté actiu, amb el botó «Desenfocament: sí/no».
   - En provar-ho, comprova i explica-li a en Pere:
     - si es llegeixen bé els botons i textos;
     - si es veu bé on va el personatge quan la càmera és baixa o lluny;
     - si marca la diferència de fps entre amb i sense.
   - La decisió final és d'en Pere.
5. **Peces per portar al joc principal:** es valoraran al final (secció 6). ✅
