# Bruna · El bosc encantat — guia per a Claude Code

Prototip jugable en 3D d'un joc de **Bruna Coop** (Barcelona). La protagonista és la **Bruna**, una nena de 9 anys curiosa, que no para quieta, amb vestit rosa de pics, samarreta de ratlles, motxilla verda i una polsera de l'arc de Sant Martí. L'acompanya el **Conill**, que porta un llacet de pics en una orella. Estil visual de referència: **Alba: A Wildlife Adventure** — masses de color planes, formes simples, ombrejat suau, moviment flotant i amable. Pensat per jugar-se **des del mòbil** (joystick virtual), però també funciona amb teclat.

Aquest paquet és l'exportació de l'última versió feta al xat amb Claude (un sol fitxer HTML). Aquí està separada en mòduls perquè es pugui continuar treballant.

## Com s'executa

```bash
npm install                     # només cal per als tests (Playwright)
npx playwright install chromium # una vegada
npm run build                   # src/ → dist/index.html (CDN) i dist/index.local.html (three.js local)
npm run serve                   # build + servidor a http://localhost:5173 (obre dist/index.local.html)
npm test                        # build + smoke + recorregut complet per tot el mapa
npm run capturas                # captura de cada zona a tests/capturas/
```

Per obrir-lo sense servidor, n'hi ha prou amb obrir `dist/index.local.html` al navegador. Per provar-lo al mòbil: `npm run serve` i obrir la IP de l'ordinador des del mòbil (a la mateixa xarxa wifi).

**Abans de donar per bona qualsevol canvi**, executa `npm test`. Si el canvi és visual, executa també `npm run capturas` i mira les imatges: el projecte s'ha validat sempre així (captures + recorregut automàtic), perquè el renderitzat es pot comprovar en headless amb SwiftShader.

## Arquitectura

- **Three.js r128** (global `THREE`, des de CDN o `vendor/three.min.js`). No hi ha framework, ni bundler, ni dependències en temps d'execució.
- `tools/build.mjs` concatena **`src/js/*.js` per ordre alfabètic** dins un sol IIFE `(()=>{ ... })();` i l'injecta a `src/index.html` (marcador `/*@@BUNDLE@@*/`). També en comprova la sintaxi.
- ⚠️ **L'ordre dels fitxers importa.** Tot comparteix un sol àmbit. Les `const` s'han de definir abans que les faci servir el codi que s'executa en carregar (TDZ). Les `function` es poden fer servir abans perquè s'eleven. Si afegeixes un mòdul, posa-li un número que el col·loqui al lloc correcte.
- Els comentaris del codi estan en **castellà**; la interfície i els textos del joc, en **català**.

### Mòduls (`src/js/`)

| Fitxer | Què fa |
|---|---|
| `00_motor.js` | Helpers (`$`, `clamp`, `smooth`, `wrapA`, `rng`/`R`/`rr`/`pick`), renderer, escena, càmera, `TOON()` (és **Lambert**, el nom és històric), llums `hemi` i `sun` |
| `01_utilidades.js` | `canvasTex`, `mk`, `SPH`, `ico`, `RBox`, `prismG`, `jawGeo`, `surfFn`, textures (pics, ratlles) i materials del conill antic |
| `02_bosque_escena.js` | Grup `world`, boira, `Batch()` (geometria fusionada amb colors per vèrtex i atribut `sway` per al vent), materials `mLit/mLeaf/mFol/mFlat/mGlow/mFar`, `pondD`, `pathX`, posició del torreó (`OX,OY,OZ`) |
| `03_valle_datos.js` | Dades de la vall ampliada: el·lipse `VC/VRX/VRZ`, riu `RX(z)`, pont `BZ/RXB/BL`, arbre gegant `GT`, cases `H1/H2`, hort, `PATHS`, `extraH()` i `extraC()` (relleu i color del terreny) |
| `04_bosque_terreno_agua_arboles.js` | `landH(x,z)` (alçada del terreny), `bound()` (zona caminable), malla del terreny, estany, `taperTube`, `blobs`, `rockG`, `tree()` |
| `05_valle_arboles.js` | Arbres de la vall i del bosc encantat (fan servir `okSpot()` per no tapar camins ni edificis) |
| `06_bosque_cielo_setas_rocas.js` | Cel, lluna, estrelles, `halo()`, bolets, flors lluminoses, gespa, joncs, nenúfars, roques, arbustos |
| `07_valle_decorado.js` | Bolets, flors, roques, joncs del riu i gespa de la vall |
| `08_bosque_luciernagas.js` | Bolca les capes de decorat del bosc; cuques de llum |
| `10_torreon_estructura.js` | Torreó: grup `TW` (en coordenades **locals**), plantes `G[-1..3]`, torreta de l'escala `TG`, exterior `EXT`, esglaons, portes (`doors`, `DE`, `DT`), ascensor-tron (`lift`), `TBatch()` |
| `11_torreon_muebles.js` | Mobles de cada planta (`FURN.*`), calders, plantes carnívores, heura, teranyines, finestres il·luminades |
| `20_animales.js` | Unicorn, conills salvatges, granotes, bitxo pelut, papallones, ocells, marietes, cors |
| `21_animales_vida.js` | `animWorld(dt)`: comportament de tots aquests animals |
| `22_particulas.js` | `emit()` i `burst()` (pols, brins d'herba, gotes, ones) i `stepParts()` |
| `30_valle_construccion.js` | Construcció de l'arbre gegant i la cova, les cases (exterior i interior), l'hort, el pont, el riu, la muralla en ruïnes, la casa de l'arbre i les muntanyes. També col·lisions estàtiques (`BOXES`, `pushStatics`), `gY`, `waterAt`, `worldAnim`, `zoneKey`, `forestName`, `surfForest` |
| `40_bruna_modelo.js` | Model de la Bruna (`buildBruna`), constants `WALK/RUN/JUMPV`, estat `S`, càmera `cam`, molles `SP`, entrada (joystick, teclat, gestos de càmera) |
| `41_bruna_animacion.js` | Animació procedural: cicle de passes, IK de cames (`solveLeg`), bot, braços, molles de cabell, motxilla i faldilla, partícules a les petjades |
| `42_conejo.js` | El Conill: model nou i seguiment per **rastre** (quan la Bruna vola, puja a l'escombra i el posiciona `45_vuelo.js`) |
| `45_vuelo.js` | **Vol amb escombra** (vegeu més avall): escombra màgica, llançament des del terrat, física de vol, postura, aterratge, panell d'ajustos i inici de la prova al terrat (`FLIGHT_TEST`) |
| `46_turbo_setas.js` | **Turbo i fruita, bolets saltadors, planeig amb el vestit i volar des de qualsevol lloc** (vegeu més avall) |
| `50_juego.js` | Física combinada bosc/torreó, `stepMove`, accions (portes, ascensor, acariciar), teletransports, llums per zona, visibilitat, càmera, bucle i API de depuració `window.__j` |
| `54_datos_pociones.js` | **Dades del nivell 1** (`NIVEL1`, `TXT`): pocions, ingredients amb on són (`spot`) i pistes en dues capes, premis, poders i textos de la història. Afegir pocions = afegir dades aquí |
| `55_pociones.js` | **Esquelet del joc:** partida guardada (`GS`, a `localStorage`), poders (`POW`), so (música i `sfx()` amb Web Audio, sense fitxers), llibreta (poció, diari, xat amb el Conillet), sac, llibre, caldero amb capes, armari de la Bruna, barret, vareta (Sol i Pluja), el Conillet que guia, i la poció 1 sencera. Les accions entren per `potionActions()` dins `actions()` |

## Conceptes clau

**Coordenades.** Y amunt. Z negativa és el nord: es comença al bosc (z≈+10) i el camí va cap a −z fins al torreó (`OZ=-56`, `OY=3.8`). Més al nord hi ha la vall: l'arbre gegant `GT` a z≈−91, el riu a l'oest i les cases a l'est. L'angle `atan2(x,z)` amb 0 = +z (sud) és la convenció de tot el codi.

**Dos modes de física** (`mode` a `50_juego.js`):
- `'forest'`: s'activa a més de `CLEAR=14.5` m del centre del torreó.
  - Terra: `gY(x,z)`, que és `landH` més la coberta del pont.
  - Col·lisions:
    - cercles a `COL` (arbres, roques, mobles, arrels);
    - caixes orientades a `BOXES` (parets de les cases, tanques, baranes, muralla, túnel);
    - anell del tronc a `pushStatics`;
    - zona caminable de `bound()`;
    - aigua massa fonda (`waterDepth` > 0.42).
- `'tower'`: s'activa a prop del torreó. Tot va en coordenades **locals** del torreó (`toLoc`).
  - `keyAt(x,z,y)` diu a quina zona ets: `'out'`, nivell `0..3`, `'t'` (escala), `'d'` (porta) o `'-1'` (soterrani). Si torna `null`, la posició no es pot trepitjar.
  - `groundAt` dona l'alçada, inclosa la rampa de l'escala de cargol i l'ascensor.

**Visibilitat (vista tallada).** Les parets interiors fan servir `side: BackSide`, de manera que la paret propera a la càmera desapareix sola. Quan entres en un lloc:
- **Torreó:** s'amaguen les plantes de sobre i `EXT`.
- **Cases:** s'amaga `H.ext` (parets exteriors i teulada).
- **Cova:** s'amaga `TREEX` (l'escorça).

Les llums de cada zona són a `LIGHTS[clau]`. Les claus són: `out`, `0..3`, `-1`, `cave` i `house`.

**⚠️ Dues API de Batch diferents (ja ha provocat bugs):**
- `Batch()` (bosc i vall): `add(geo, color, x,y,z, rx,ry,rz, sx,sy,sz)` → primer la rotació i després l'escala.
- `TBatch()` (torreó): té helpers `box(c, x,y,z, sx,sy,sz, ry,rx,rz)`, `cyl(...)` i `sph(...)` → primer l'escala.

Si a `Batch().add(BOX, c, x,y,z, a,b,c)` hi passes només 3 números després de la posició, s'interpreten com a **rotació** amb escala 1 i surten cubs d'1 m.

**Animació de la Bruna.**
- **Locomoció:** és procedural, sense clips.
  - El cicle de passes depèn de la velocitat.
  - Els peus s'adapten al terra amb `groundY`.
  - La pelvis bota suau.
  - En córrer, obre els braços «d'avió».
  - El salt té anticipació, puja lent i cau més ràpid. Si es manté premut, salta més alt.
- **Moviment secundari:** cabell, motxilla i faldilla van amb molles (`spring/stepS`).
- **Criteri:** el que es busca és suavitat i flotació, com a Alba. Res de sacsejades ni de bots secs.

**El Conill** grava el rastre de la Bruna (`trail`) i el segueix a ~1 m, a saltets: arc de bot, morro amunt i avall, orelles amb molla i aixafament en aterrar. No té col·lisions pròpies; com que segueix el camí de la Bruna, passa per portes, escales i ponts. A l'ascensor s'hi puja amb ella. Si es queda a més de 9 m, reapareix al darrere.

**API de depuració** (`window.__j`): `step(n, dt)`, `render()`, `teleport(nom)`, `S`, `cam`, `K`, `input`, `ACT`, `actions()`, `lift`, `doors`, `BN`, `GT`, `H1`, `H2`, `landH`, `gY`, `groundY`, `waterAt`, `mode`, `key`, `inCave`, `OX/OY/OZ`. Els tests congelen el bucle (`requestAnimationFrame = () => 0`) i fan avançar el temps amb `step`.

Teletransports (botons de la dreta): Bosque, Estanque, Torreón, Trono, Terraza, Sótano, Puente, Árbol, Cueva, Casa, Casita.

## Vol amb escombra (`45_vuelo.js`)

Al joc complet s'ha d'activar a partir del **nivell 4**. Encara no hi ha sistema de nivells: ara `FLIGHT_TEST=true` fa començar al terrat amb el panell «⚙ Ajustes de vuelo». Per al joc normal, posa-ho a `false` i amaga l'escombra (`broom.g.visible`) fins al nivell 4.

- **Estat:** `FL.state` és `'stand'` (al suport del terrat), `'back'` (a l'esquena, penjada de `B.chest`) o `'fly'` (penjada de `B.root`, sota la Bruna). `FL.on` vol dir que vola; `FL.phase==='prep'` és l'ajupida de 0,3 s abans de saltar.
- **Llançar-se:** `canLaunch()` demana tenir l'escombra, estar al terrat (`L(3)`), a menys d'1,15 m de la vora i no mirant cap a la torreta de l'escala (`W_TH`). L'Espai (o l'acció «¡Lanzarse!») crida `startLaunch()`. El salt inicial té `vy=6.8` i `vh=2.8` cap a fora, durant 0,45 s amb gravetat.
- **Física (`FLY`):**
  - Espai/«Subir» premut porta `vy` cap a `FLY.up` (3,2); deixat anar, cap a `FLY.down` (−3,8). Ho fa amb acceleració `accUp/accDown`: és el que fa que «costi» i que calgui modular a polsos.
  - El joystick dona rumbe i velocitat (`speed` 7, al màxim `boost` 10) amb inèrcia. Sense joystick frena a `brake` (4 m/s²).
  - Sostre suau a `OY+40`.
- **Sòlids (`fSolids`):**
  - Torreó: cilindre. Es pot entrar al terrat per dalt, però no travessar les parets.
  - Torreta: fins a `L(3)+8.2`.
  - Arbre gegant: tronc amb radi segons l'alçada i copa com a el·lipsoide (centre `GT.y+25.5`, 15,5×6).
  - Cases fins al carener, `COL` prop del terra i límits del món.
- **Aterrar:** en tocar terra amb `vy<0`. A l'aigua de més de 0,3 m rebota («¡A la escoba no le gusta mojarse!»). Allà on no es pot caminar (`landable`) també rebota. Si `|vy|<1.6`, és un aterratge perfecte.
- **Postura:** a `41_bruna_animacion.js`, ponderada per `FL.k`. Fa servir `flightLegs`, `flightArms` i `flightBody`. Hi ha pitch i bank a `B.root.rotation` (ordre `'YXZ'`).
- **Conill:** si és a menys de 4,5 m quan la Bruna salta, puja a les palles (`BN.riding`).
- **Prova:** `tests/vuelo.mjs` (`npm run test:vuelo`) agafa l'escombra, salta, comprova pujar/baixar, el tronc, la copa, el riu, aterra al bosc i al terrat. Desa captures a `docs/vuelo/`.

## Pocions i poders (`54`, `55`)

- **Poders bloquejats fins que toquen** (només a `dist/index.html`; a les demos de vol i turbo hi ha tot): l'escombra (poció 4), els bolets saltadors (poció 2) i el turbo (poció 3). Es controlen amb `POW` (`flightActions`, `mushHit`). Sol i Pluja arriben amb la poció 1.
- **Partida:** es desa a `localStorage` (`bruna-nivel1-v1`). `?reset` a l'URL o «Empezar la partida de nuevo» al diari l'esborren.
- **Fases de la poció:** `inicio` → (sala del tron: parla la veu) `leer` → (llibre) `recoger` → (5 pots) `caldero` → (caldero) `hecha` → `premio` (barret a l'armari) → `fin1`.
- **Fases genèriques:** després de `fin`, en tornar a la sala del tron la veu encarrega la poció següent (`startPotion`). Si té `mezclar`, després del 5è ingredient cal `remover` (girar el dit sobre el caldero). El premi de cada poció és a `REWARD` (barret, vestit…).
- **Poció 2** (`56_pocion2.js`): flor amb pol·len, roca amb molsa i marieta de 7 punts al bosc (`registerItem`); despensa amb formatge i el ratolí que segueix la Bruna (`MOUSE`); la planta carnívora gran del soterrani (`BIGP`), que babeja amb el conjur Sol i s'ha d'esquivar (`BABA`, botó «¡ESQUIVA!»).
- **Poció 3** (`57_pocion3.js`): menjar per a l'unicorn (baies, poma, bolet, herba; només les baies lila funcionen), passeig, pet i cua aixecada per posar el pot (`UST`); la roca que s'empeny i el Conillet que cava el cuc (`ROCK`); pinyols a la cistella de la cuina, saba a l'arbre blau (`T1`) i la papallona daurada (`BFLY`). Premi: sabates amb ales (`wearShoes`). Poder: turbo amb fruita (`POW.turbo`, `turboOn()` a `46`).
- **Poció 4** (`58_pocion4.js`): bolet pelut i pessigolles a la granota de tres ulls (`FR`, minijoc de fregar) amb bombolles; llavors de l'arbre gran penjades damunt del bolet gegant més alt (`SEEDS`, s'agafen rebotant) i pesca a l'estany amb «Estira!» (`FISH`); omplir el pot fins a la ratlla (minijoc de mantenir premut); flor de lotus; gebre a la terrassa que es fon en 60 s (`FROST`). Premi: l'escombra de la terrassa (`REWARD.escombra`, `noWard`, `finishReward`). Remolins a l'estany quan està feta.
- **Proves:** `tests/pocion1.mjs` a `tests/pocion4.mjs` (`npm run test:pociones`).
- **Idioma:** el joc és en **català** (decisió del Pere). Els textos de la història són a `54_datos_pociones.js` (`TXT`); els noms dels botons de salt ràpid, a `TP_CA` (`50_juego.js`), perquè les claus internes (`Bosque`, `Trono`…) les fan servir els tests.
- **Simplificacions pendents:** la llibreta s'obre com una finestra (encara no amb la càmera a les mans de la Bruna) i la bruixa adulta encara és només una veu amb bafarades.

## Demos (`00a_demo.js`)

`tools/build.mjs` genera tres versions canviant la constant `DEMO`:
- `dist/index.html`: `'juego'`, el món complet.
- `dist/vuelo.html`: `'vuelo'`. Comença al terrat amb l'escombra al suport i té el panell d'ajustos.
- `dist/turbo.html`: `'turbo'`. Comença als bolets amb l'escombra a l'esquena, el turbo actiu i la fruita visible.

## Turbo, bolets i planeig (`46_turbo_setas.js`)

- **Turbo:**
  - Es fa servir amb `T` o el botó «Turbo» (cal mantenir-lo premut). Està actiu només si `TURBO_LEVEL` (ara `DEMO==='turbo'`).
  - A peu corre a 6,6 m/s i gasta 14/s. Amb l'escombra va a 16 m/s i gasta 18/s.
  - Cada fruita dona +20 (màxim 100). La fruita torna a créixer al cap de 30 s.
  - Està repartida pel camí, damunt dels bolets, en un anell al voltant del torreó i un altre al voltant de la copa, i en un camí aeri entre tots dos.
- **Bolets (`MUSH`):**
  - N'hi ha 6, situats amb `freeSpot()` (lluny de `COL`, de l'aigua, del camí i del torreó).
  - En caure-hi a sobre (`mushHit`, dins `stepMove`), la Bruna surt disparada amb `bv` (11–16 m/s); si es manté l'Espai, una mica més.
  - Mentre està en l'aire després de rebotar, la gravetat és 11/14,5.
- **Planeig:** passa quan cau amb l'Espai premut, després d'un bolet o si és a més d'1,6 m del terra (`glideNow`). Aleshores:
  - la `vy` tendeix a −1,25;
  - avança almenys a 4,6 m/s;
  - la faldilla s'obre com un paracaigudes (`glideBody`) i els braços es posen en creu (`glidePose`).
- **Volar des de qualsevol lloc:** cal tenir l'escombra a l'esquena.
  - A l'ordinador: Control+Majúscules+Espai. A terra fa el salt de llançament; a l'aire munta directament.
  - Al mòbil: en saltar, apareix el botó «Volar» mentre és a l'aire.
  - No es permet a dins de les cases, a la cova ni a l'interior del torreó (`canMountHere`).
- **Prova:** `tests/turbo.mjs` (`npm run test:turbo`).

## Direcció d'art i preferències del Pere

- **Referències:**
  - Les fitxes, el mapa i les il·lustracions de cada sala són a `referencia/imagenes/`. Són referència d'elements i ambient, no de posicions exactes. Si hi ha incoherències entre imatges (portes, escales), es prioritza que l'espai tingui lògica i funcioni.
  - L'estil d'Alba és a `estilo_alba_*`.
- **Aspecte:**
  - Masses de color, formes rodones però amb cert caràcter (barbeta marcada a la Bruna i mans de manyopla amb el polze separat).
  - Sense polígons visibles als personatges.
  - L'aspecte «pintura/oli» es va provar i es va descartar.
- **Pendent de decidir:** els contorns negres de les il·lustracions encara no s'han implementat.
- **Com vol que se li parli:** directament i sense condescendència. Si alguna cosa no encaixa amb les referències, s'ha de dir clarament i justificat. També s'ha de dir què s'ha verificat i com: captures o recorregut automàtic, en headless, no en un mòbil real.

## Limitacions conegudes i idees per continuar

- **Rendiment al mòbil:** no s'ha mesurat en un dispositiu real. És l'escena més gran, amb moltes geometries fusionades, ombres i 5 llums puntuals. Si va lenta, el primer que cal mirar és: menys gespa, `shadowMap` més petit, instancing per a la gespa i els arbres, i LOD.
- **Peus:** com que el cicle és procedural, rellisquen una mica en córrer.
- **Expressions:** la cara de la Bruna no canvia d'expressió.
- **Conill:** pot travessar una mica les cantonades.
- **Elements no interactius:** la casa de l'arbre i els armaris són decorat. Les cases tenen la porta fixa (entreoberta o caiguda).
- **Elements que es van perdre en ajuntar-ho tot:**
  - Pescar i agafar aigua, que existien al prototip `3_bosque_del_lago.html`.
  - L'animació de «la crida del torreó» (`4_animacion_llamada_torreon.html`).
- **Vol:**
  - L'escombra màgica brilla i flota, però al terrat hi ha dues escombres decoratives (batch) que s'hi assemblen i no es poden agafar.
  - Les branques sota la copa no són sòlides.
  - Només es pot enlairar des del terrat (és el disseny proposat). Per repetir, cal tornar-hi amb el xip «Terraza».
- **L'estany de les granotes:** és al principi del bosc, no al costat del torreó com al mapa.
- **Tècnica:** three.js r128 és antic. Si s'hi vol posar al dia (ES modules, Vite, three actual), compte amb:
  - `THREE.LuminanceFormat`, que ja no existeix;
  - els canvis de color i gestió de colors;
  - `onBeforeCompile`, que el fan servir els shaders de vent (`swayify`) i d'esvaïment proper (`nearFade`).

## Historial

Vegeu `docs/historial.md`: prototips anteriors, decisions preses i enllaços.
