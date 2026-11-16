# Bruna · Aprenta de bruixa

Joc 3D per a navegador, amb prioritat al mòbil. L'encàrrec complet és a
`DISSENY-NIVELL-1.md`: **llegeix-lo abans de fer res**.

## Estat

- El disseny del nivell 1 està tancat (vegeu el document).
- `prototip/` conté el prototip jugable del bosc encantat (Three.js r128,
  mòduls a `src/js/`, build a `dist/`, tests amb Playwright). Té el seu propi
  `prototip/CLAUDE.md` amb l'arquitectura: llegeix-lo abans de tocar el codi.
- Fet: moviment de la Bruna i el Conill, bosc, vall, torreó, cases, cova, vol
  amb escombra, turbo, bolets saltadors i planeig.
- El nivell 1 és jugable sencer: les 5 pocions, en català, amb tests automàtics.
  Pendent: la bruixa adulta (ara és una veu), la llibreta en pla subjectiu i Vite.

## Publicació

- Repositori públic: https://github.com/perenalez/bruna-aprenta-de-bruixa
- **Versió de proves** (GitHub Pages, branca `gh-pages`, carpeta `proves/`):
  https://perenalez.github.io/bruna-aprenta-de-bruixa/proves/
- Per publicar els canvis: `bash prototip/tools/publicar-proves.sh` (munta el joc i el puja).
  Fa servir l'eina `gh` de `.eines/` (no és al repositori; sessió iniciada com a `perenalez`).
- La versió estable es farà quan en Pere hagi revisat el nivell 1.
- Els prototips anteriors en HTML solt són a `prototip/referencia/`.

## Primers passos

1. Llegeix `DISSENY-NIVELL-1.md` sencer.
2. Mira què hi ha a `prototip/` i prova-ho en un mòbil real abans d'afegir res.
3. Segueix el pla de construcció de l'última secció del document.

## Com treballar amb en Pere

És director creatiu, no programador. Explica-li els passos en llenguatge
senzill i ensenya-li el resultat en un enllaç que pugui obrir al mòbil. Vol
feedback directe i raonat sobre el que no encaixa, i prefereix que l'inspirin
abans que no que li ho facin tot. Escriu en català i en castellà.

Si una decisió no és al document, pregunta-li. No inventis.
