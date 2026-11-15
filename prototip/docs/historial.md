# Historial del prototip

Els fitxers HTML de cada etapa són a `referencia/prototipos_anteriores/`. Cada un funciona sol: s'obre al navegador i carrega three.js des de CDN.

| # | Prototip | Què es va provar | Decisions |
|---|---|---|---|
| 1 | Personatges | Bruna, Bruna bruixa, el Gat i el Conill en pestanyes, amb el mode Escena/Model | Primer s'havia fet en polígons visibles. Es va passar a formes més rodones, es va provar un filtre de pintura impressionista («Óleo», «Pintura») i **es va descartar**: s'aposta pel pla. La cara de la Bruna, menys rodona, amb barbeta marcada. |
| 2 | Sala de les pocions | Calder amb foc, prestatgeria, objectes que es poden agafar, llibre amb el botó «Leer» (conjur: caca d'unicorn i ulls de granota), abocar pocions al calder | — |
| 3 | Bosc del llac | Claror amb l'estany, l'unicorn (acariciar-lo), pescar, agafar aigua, el camí fins al torreó | — |
| 4 | Animació «La crida del torreó» | Seqüència: la Bruna veu una llum, la persegueix, es perd, arriba al torreó i una veu li diu que entri | La veu és la síntesi del dispositiu; caldria gravar-la o generar-la. |
| 5 | Torreó | 5 plantes a partir de la secció, escala de cargol en una torreta pròpia, portes que s'obren, el tron fa d'ascensor fins al dormitori de la bruixa | Per coherència: escala de cargol en lloc de la recta de la sala del tron i treure les trapes. |
| 6 | Prova de personatge (estil Alba) | Bruna refeta de zero amb ombrejat suau i animació procedural natural. Partícules segons el terra (pols, herba, esquitxos) | Primera versió «massa saltironejant». Es va suavitzar: menys passes per segon, bot de corba suau, salt més flotant. Mans de manyopla. |
| 7 | **El bosc encantat (aquest projecte)** | Tot junt: el bosc, el torreó real al final del camí i la vall nova segons el mapa (arbre gegant amb cova, riu i pont, dues cases abandonades on es pot entrar, muralla en ruïnes, casa de l'arbre decorativa), més el Conill que segueix la Bruna | L'estil de decorat passa de bandes de color dures (toon) a ombrejat suau (Lambert), com a la prova 6. |

## Enllaços als artefactes de claude.ai (privats del Pere)

- Personatges: https://claude.ai/artifact/5dctt3yYx2E1mJsfo7s1VC
- Sala de les pocions: https://claude.ai/artifact/NJxiDWp7TgwSfannQPBPwK
- Bosc del llac: https://claude.ai/artifact/UyvQvDdmyry9cTFvsbb65s
- Animació: https://claude.ai/artifact/RJU9ofbrEnqDBn3hVGk1b3
- Torreó: https://claude.ai/artifact/B99ARQEPgcjFfPUtdzRQwN
- Prova de personatge: https://claude.ai/artifact/Sw1iTWnLcarGJ1V4vcS5XT
- **El bosc encantat (actual):** https://claude.ai/artifact/Dg2WJ3G9fq1cG6ggFGkHED

## Notes per a properes passes que es van comentar

- **Torreó:** la bruixa adulta encara no existeix com a personatge; el tron és buit.
- **Cova:** queda preparada per a algun nivell. Hi ha una pedra amb una espiral que brilla i espai lliure.
- **Mascotes:** a la fitxa, el Gat és la «mascota normal» i el Conill la «mascota de bruixa». Al joc només hi ha el Conill.
- **Prova de vol amb escombra:** https://claude.ai/artifact/XpDQejCu928DaFEXY2cbtb (mòdul `45_vuelo.js`, `FLIGHT_TEST=true`)
- **Turbo, bolets i planeig:** https://claude.ai/artifact/TspWLUg9gcaRkUF1Q8wEyp (`dist/turbo.html`, mòdul `46_turbo_setas.js`)
