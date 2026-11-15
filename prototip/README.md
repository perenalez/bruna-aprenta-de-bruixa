# Bruna · El bosc encantat

Prototip jugable en 3D (three.js) de la Bruna al bosc encantat, amb el torreó de la bruixa, l'arbre gegant i la seva cova, el riu i el pont, les cases abandonades i el Conill, que la segueix.

**Per jugar ara mateix:** obre `dist/index.local.html` amb el navegador.

**Per treballar-hi amb Claude Code:** obre aquesta carpeta i llegeix `CLAUDE.md`. Ordres principals:

```bash
npm install && npx playwright install chromium
npm run serve      # http://localhost:5173
npm test           # comprova que es carregui sense errors i que tot el mapa es pugui recórrer
npm run capturas   # captures de cada zona a tests/capturas/
```

**Controls**

- **Mòbil:** el joystick serveix per caminar (si l'empenys fins al fons, corre) i el botó «Saltar» per saltar (mantingut, salta més alt). Arrossegant gires la càmera, i amb dos dits fas zoom.
- **Teclat:**
  - WASD: moure's.
  - Majúscules: córrer.
  - Espai: saltar.
  - E: portes, ascensor i acariciar l'unicorn.
- **Proves ràpides:** els botons de la dreta porten directament a cada lloc.

**Estructura**

```
src/index.html        plantilla (HTML + CSS de la interfície)
src/js/NN_*.js        codi del joc, en l'ordre en què es munta
tools/build.mjs       munta dist/
tools/serve.mjs       servidor local
tests/                proves automàtiques amb Playwright
vendor/three.min.js   three.js r128 (MIT)
dist/                 joc muntat
docs/                 historial i captures de l'estat actual
referencia/           fitxes, mapa, il·lustracions i prototips anteriors
```
