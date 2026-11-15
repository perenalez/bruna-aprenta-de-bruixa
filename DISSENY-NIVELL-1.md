# Bruna · Aprenta de bruixa — Disseny del nivell 1 (encàrrec per a Claude Code)

2026-11-14 · Pere

> Còpia del document viu de claude.ai, actualitzada el 2026-11-15. Les imatges de referència (personatges i espais) només són allà. Si es canvia el document, cal tornar a copiar-lo aquí.

## Resum

Aquest document és l'encàrrec per construir el nivell 1 de *Bruna · Aprenta de bruixa* a Claude Code: què és el joc, què existeix ja i què cal fer, en aquest ordre.

- **El joc:** una nena aprenent de bruixa es perd pel bosc, troba un torreó i la bruixa que hi viu li diu que l'esperava. Per tornar a casa ha de fer pocions que la converteixen en bruixa. És 3D, per a navegador i pensat per a mòbil.
- **Què existeix:** el personatge amb el moviment validat, i els espais (bosc del llac, torreó i sala de les pocions) com a prototips on es pot caminar. El prototip nou ja té el vol amb escombra, el turbo amb fruita, els bolets que fan saltar i el planeig. Pescar, agafar aigua, el llibre i el caldero eren als prototips antics i cal refer-los.
- **Què falta:** tot el joc: sac, llibreta, caldero, pocions, ingredients, accions, el Conill acompanyant i la bruixa adulta.
- **Com usar-lo:** llegeix-lo de dalt a baix. Les seccions «Nivell 1: pocions i ingredients», «Les accions complexes» i «Sistema de joc» són el contingut; «Decisions i què queda obert» recull el que està tancat, assumit i pendent; l'última és el pla de construcció.
- **Si hi ha dubtes:** pregunta a Pere abans d'inventar. Les decisions assumides estan marcades com a tals.

## Premissa i estructura

El joc té 5 nivells; per passar de nivell cal fer 5 pocions, i cada poció demana recollir 5 ingredients. Aquest document defineix només el nivell 1.

**Premissa.** Bruna, nena aprenent de bruixa, es perd pel bosc i troba un torreó. Des de dins una veu li diu: «Bruna, t'he estat esperant, entra, que t'he estat esperant des que vas néixer», i la porta s'obre sola. La bruixa vol fer-la la seva aprenent i li dona tasques perquè es converteixi en bruixa i pugui tornar a casa.

**Bucle de cada poció**

1. La bruixa adulta dona la tasca a la sala del tron.
2. Bruna llegeix la recepta al llibre de la cuina del caldero; els 5 elements surten com a siluetes a la seva llibreta.
3. Recull els 5 elements pel torreó i el bosc, amb les pistes del Conill.
4. Els tira al caldero. A la poció 1 no es barreja; a les altres, sí.
5. La poció canvia alguna cosa visible al món i la bruixa reacciona.

Cada poció dona a Bruna una peça de roba de bruixa i un poder nou. La bruixa adulta li explica el poder i queda apuntat al diari de la llibreta.

**Dificultat creixent.** Cada poció és més difícil que l'anterior en tres eixos: on és l'ingredient, què cal fer per aconseguir-lo i com el descriu el llibre (explícit al principi, endevinalla més endavant). A cada poció, tret de la primera, 2 ingredients demanen una acció complexa i els altres 3 només es recullen.

**Peces de Bruixa (decidit per Pere).** Bruna comença amb roba normal i es va vestint de bruixa poció a poció, mentre guanya un poder a cada una. Al nivell 1: barret (poció 1), vestit (2), sabates amb ales (3), escombra (4), i el certificat de bruixa i el Gat (5). El Gat substitueix la polsera arcoíris i és l'últim pas per ser bruixa de debò.

## Estil visual i moviment

L'estil és el del joc *Alba: A Wildlife Adventure*: formes planes i masses de color, sense facetes de polígon visibles i amb ombrejat suau. Pere ha donat captures i gameplays d'Alba com a referència.

- **Descartat:** els filtres de pintura (òli i pintura). Li va agradar l'estil pla.
- **Bruna:** cara una mica angular o triangular, barbeta marcada, braços menys rodons que les primeres versions. Les mans són de manopla: el polze separat i la resta de dits junts.
- **Moviment:** natural i flotant, no robòtic. Puja i baixa en caminar i saltar, amb gravetat amb lògica, i obre els braços en correr. Una versió amb massa salts marejava i es va suavitzar. Pere ha validat el moviment actual.
- **Entorn que reacciona:** pols en caminar, herba que vola en correr i esquitxades a l'aigua.
- **Contorns:** els dibuixos de Pere porten traç negre, però als prototips dels decorats no n'hi ha. Decidit per Pere: no calen contorns negres.
- **Referències de Pere:** les làmines de decorats mostren el que li agrada i quins elements hi ha a cada sala, no posicions exactes. Si hi ha incoherències, prima la lògica: portes i escales on cal, i espais més grans per moure's bé.

## Personatges

Hi ha dues figures que no s'han de confondre: **Bruixa** és Bruna vestida de bruixa, i la **bruixa adulta** és qui viu al torreó.

| Personatge | Què és | Aspecte | Paper al joc |
| --- | --- | --- | --- |
| Bruna | La protagonista, nena aprenent de bruixa | Estil pla, cara angular, mans de manopla. Té full de personatge | Jugable. Recull ingredients i fa les pocions |
| Bruixa | Bruna vestida de bruixa | Vestit negre de mànega llarga, sombrero amb banda, botes, escombra, cistella i polsera arcoíris | La seva forma final. Les peces es guanyen poció a poció; l'última és el Gat, no la polsera |
| Bruixa adulta | La bruixa del torreó | Només existeix a la làmina de Pere. No està construïda | Viu a la sala del tron, dona cada tasca i reacciona a cada poció |
| Conill | Acompanyant dels primers capítols. És un habitant d'aquest món i sap com funciona tot | Marró, panxa clara, orelles llargues amb interior rosa i llaç vermell de lunars. Es mou a salts. Quan té un missatge, la cua li parpelleja de verd fluorescent i sona un avís. Quan Bruna és a prop de l'ingredient, brilla tot ell i salta sense parar. | Dona pistes. A l'acció del cuc de terra, cava |
| Gat | Acompanyant, no ingredient | Gris fosc, pit clar, ulls grocs, sombrerito decantat amb llaç i cua en S | Peça final: és l'últim pas per ser bruixa de debò, en lloc de la polsera |
| Unicorn | Habitant del llac | Pastura i mira Bruna quan s'acosta. Ara no es desplaça | Dona caca (poció 3) i pèl (poció 5). Ha de passejar. Parla amb bafarades. Després de la poció 3, trenca les taules de la cova de l'arbre |
| Fauna del bosc | Granotes (rosa, lila amb taques, verda de tres ulls i una altra), conills que fugen, bitxo pelut que s'amaga, papallones, ocells, marietes, llucioles i 5 peixos | Cada animal ja reacciona a Bruna als prototips | Ingredients i entorn |
| Plantes carnívores | Al dormitori soterrat de la bruixa | Segueixen Bruna i mosseguen | Obstacle i ingredient (poció 2) |
| Ratolí | Nou, viu a la cuina | Per dissenyar | Ingredient (poció 2) |
| La cosa rara que brilla | Llum blavosa amb estela que fuig | Apareix a l'animació d'inici | Ingredient final del nivell 1. És una lluerna |
| La veu | La veu del torreó a l'animació d'inici | Només es sent | Probablement la bruixa adulta |

## Espais i què conté cada un

El joc passa a dos llocs: el bosc del llac i el torreó, que és on es fa gran part del joc. El torreó té una escala de caracol en una torreta pròpia, amb una porta a cada planta. Aquesta taula recull el que ja existeix als prototips.

| Espai | Què conté | Accions i notes |
| --- | --- | --- |
| Bosc del llac | Clar amb llac (nenúfars, lotus i espadanyes), arbres blau, lila i taronja, bolets lluminosos, roques amb molsa, llucioles, herba, joncs i flors que es belluguen, fauna (vegeu Personatges). Un camí puja una colina fins al torreó, amb finestres enceses, fum lila i la lluna al darrere | Existien als prototips antics, i pescar i agafar aigua s'han de refer: acariciar l'unicorn, pescar (5 peixos; dos segons per prémer «Tirar!») i agafar aigua amb un pot. Es pot arribar a la porta del torreó, però no entrar abans de l'animació d'inici |
| Exterior del torreó | Porta, finestres enceses, fum lila i la caseta de l'escala que surt a la terrassa | La porta s'obre sola a l'animació d'inici |
| Soterrani: dormitori de la bruixa | Plantes carnívores que segueixen i mosseguen, porta de vidre al tub de l'ascensor. És la sala més completa | Baixar-hi és un risc. La planta fa fora Bruna sense que perdi res (assumit) |
| Planta baixa: sala del tron | El tron és l'ascensor: Bruna puja a la tarima, prem «Baixar» i baixa pel tub de vidre. Si l'ascensor és a l'altra planta, surt «Cridar» | Aquí viurà la bruixa adulta (no construïda). La poció 1 hi té el pot blau, a la tarima |
| Planta 1: habitació de Bruna | Hi ha armaris s'obren i tenen petites bosses, roba, motxil·les, pots, un planell, sbates. | Conté el pot verd de la poció 1, dins un armari |
| Planta 2: cuina del caldero | Caldero amb foc (bull i fa vapor), taula, barrils, tamboret, sacs, torxes a la porta, espelma, llibre i prestatgeria de 5 baldes amb pots; hi ha pots a terra. Les 3 baldes baixes s'arriben a abastar, les 2 altes no | Existien al prototip antic de la sala de les pocions i s'han de refer: agafar i deixar pots, llegir el llibre (sobre la taula, amb la recepta) i tirar un pot al caldero, que pren el color del pot. Es dona per fet que és la mateixa sala que la «sala de les pocions» del primer prototip |
| Terrassa i sala de festes | Caseta de l'escala | Conté el pot groc de la poció 1 i la gebre de la poció 4 |
| Escala de caracol | Torreta pròpia amb porta a cada planta | Als prototips anteriors Bruna lliscava per una rampa invisible, no trepitjava els esglaóns. Cal comprovar-ho amb el moviment nou |
| Mapa general del nivell | cosas a cambiar de la imatge. La casa de l'arbre, hauria d'estar a sobre de l'arbre gegant, no separada. El mapa generat 3D no estava ben fet, era una casa normal. Les branques que pengen de l'arbre gegant no deixen arribar a la casa volant. A les dues cases abandonades hi ha notes del seu antic habitant: «Aquesta casa no em sembla segura, en construiré una a l'arbre» i, a la més destruïda, «Sembla que la poció no ha sortit bé: he tornat a cremar la cabana». |  |

**Falta informació:** el detall de l'habitació de Bruna i de la terrassa està a les làmines de Pere, no en aquest document. Demana-les-hi abans de construir aquestes dues sales.

## Nivell 1: pocions i ingredients

El nivell 1 té 5 pocions de dificultat creixent i 25 ingredients, 9 dels quals demanen una acció complexa (detall a la secció següent). El to dels ingredients és absurd i graciós. Bruna els porta en un sac.

- **Poció 1, Arcoíris (controla el clima. Podrà fer petits núvols de pluja per regar plantes, o posar sols espaterrants que facin calor):** és el tutorial. Tot es recull dins del torreó i es tira al caldero sense barrejar, de manera que queda en capes de colors. Ensenya portes, escales, armaris, sac, llibreta i caldero.
  Guanya el barret i el poder del sol i la pluja.
- **Poció 2, Magiculis Parinuris (domina les plantes salvatges, com bolets i carnívores):** del torreó al bosc.
  Missatge en tenir llesta la poció: Ara els bolets et fan saltar molt amunt si saltes a sobre, i les plantes ja no intenten menjar-te, et fan carícies.
  Guanya el vestit.
- **Poció 3, Magicus Arbolerums (fa créixer els arbres fruiters i permet collir més fruites):** bosc. Quan l'unicorn fa la caca, li diu que li pot ajudar en el que sigui, que té molta força en les potes del darrere. (les podrà fer servir quan la Bruna li demani obrir la cova de l'arbre, que està amb taulons i tancada inicialment)
  Missatge en tenir llesta la poció: Ara que has vist la importància de menjar bé, et dono el poder de cultivar verdures i fruites! Quan menges fruites, pots córrer molt més ràpid, com un turbo, diguem, que es gasta si no menja fruita o verdura.
  Guanya unes sabates amb ales que li permeten córrer molt.
- **Poció 4, Aeolum Pogicolum (controla l'aigua i l'aire, pot fer créixer l'aigua i petits remolins):** llac i terrassa superior del torreó. En aquesta, aprèn a volar amb l'escombra.
  Ara que has descobert com funciona l'aire, el vent i l'aigua, és hora que aprenguis a volar. Agafa una escombra del terrat i salta!
  Guanya l'escombra.
- **Poció 5, Lumus Controlarum (controla la llum):** la més complexa, amb tres accions. Tanca el nivell.
  Guanya el certificat de bruixa i el Gat. Ja és una bruixa total.

| Poció | Ingredient | Tipus | On i com |
| --- | --- | --- | --- |
| 1 Arcoíris | Pot vermell | Recollir | Balda baixa de la cuina del caldero |
| 1 Arcoíris | Pot groc | Recollir | Terrassa |
| 1 Arcoíris | Pot verd | Recollir | Dins un armari de l'habitació de Bruna (el primer armari que s'obre) |
| 1 Arcoíris | Pot blau | Recollir | Tarima del tron |
| 1 Arcoíris | Pot violeta | Recollir | Nínxol de l'escala |
| 2 Parinuris | Baba de planta carnívora | **Acció** | Soterrani |
| 2 Parinuris | Pèl de ratolí | **Acció** | Cuina i soterrani: Bruna atrau el ratolí amb formatge fins a la planta carnívora |
| 2 Parinuris | Pol·len de les flors | Recollir | Clar del bosc, flors que es belluguen |
| 2 Parinuris | Molsa de les roques | Recollir | Clar del bosc |
| 2 Parinuris | Marieta de set punts | Recollir | Troncs dels arbres, entre altres marietes |
| 3 Arbolerums | Caca d'unicorn | **Acció** | Riba del llac |
| 3 Arbolerums | Cuc de terra | **Acció** | Sota la roca gran, amb el Conill |
| 3 Arbolerums | Pinyols de la cistella de fruita | Recollir | Cuina |
| 3 Arbolerums | Saba de l'arbre blau | Recollir | Clar del bosc |
| 3 Arbolerums | Pols d'ala de papallona | Recollir | Clar del bosc |
| 4 Aeolum | Rialla de granota | **Acció** | Granota de tres ulls, a la riba |
| 4 Aeolum | Escates de peix rar | **Acció** | Llac, pescant |
| 4 Aeolum | Aigua del llac fins a la ratlla | Recollir | Llac |
| 4 Aeolum | Flor de lotus | Recollir | Llac |
| 4 Aeolum | Gebre | Recollir | Terrassa. Es fon si Bruna triga a portar-lo |
| 5 Lumus | Pèl d'unicorn | **Acció** | Riba del llac |
| 5 Lumus | La cosa rara que brilla | **Acció** | Clariana del bosc, al final del nivell |
| 5 Lumus | Llucioles en un pot | Recollir | Clar del bosc |
| 5 Lumus | Bolet lluminós | Recollir | Cova de l'arbre gegant, un cop l'unicorn n'ha trencat les taules |
| 5 Lumus | Cera de l'espelma | Acció | Casa de l'arbre gegant |

Pere va delegar l'elecció dels 25 ingredients entre 7 candidats per poció, perquè tots li semblaven bons. El llibre del prototip porta una recepta de prova (caca d'unicorn i ulls de granota) que s'ha de substituir per aquestes.

## Les accions complexes

Les pocions 2 a 4 tenen 2 ingredients que es consegueixen amb una acció, i la 5 en té 3, i el Conill hi dona la pista. Les accions són el que més valor aporta al joc: no s'han de reduir a un botó «Agafar». Els objectes intermedis (baies, bolet, herba picant, formatge, llavors i tapa) no compten entre els 25 ingredients, però s'han de fer.

**2a. Baba de planta carnívora** (soterrani)

- *Pista:* «Baveguen quan tenen calor.»
- Bruna ha de posar un sol perquè tingui calor la planta, fent servir l'aprenentatge anterior. Haurà de sostenir el pot davant de la planta, que la persegueix, i esquiva perquè mossegui el pot i no ella.
- Si falla, la planta la fa fora cap a l'ascensor sense que perdi res.

**2b. Pèl de ratolí** (cuina i soterrani)

- *Pista:* «El ratolí no vol ser el berenar de ningú que faci la fotosintesis, però de vegades se n'oblida quan té a la vora formatge.»
- Bruna diu que necessitaria unes pinces per treure-li els pèls, i el Conill li dona una pista: «Pot tenir boca una cosa que fa la fotosíntesi?». Bruna agafa formatge de la despensa i, amb el formatge, atrau el ratolí escales avall fins al soterrani. El deixa darrere de la planta carnívora més gran, la mateixa que li ha donat la baba.
- El ratolí s'apropa i la planta li mossega el pèl en passar. Com no li agrada, l'escup i Bruna el recull.

**3a. Caca d'unicorn** (riba del llac)

- *Pista:* «No en té ganes perquè no ha menjat la fruita que li agrada.»
- Bruna agafa baies de l'arbust de la riba i les hi ofereix a la mà. Ha de provar varies fruites i bolets, en cada una li dona una petita pista. Per exemple, si li dona un bolet, diu, eeecs, que asco, et creus que estic tocat del bolet? o si li dona una poma, diu, gràcies, la poma es astringent i molt sana. Si li dona una baia lila diu: Gràcies, estàn bones per cagar-se! I es tira un pet i fa la caca. Diu, ups, que peste! Però si li dona herba, gira el cap i diu, ei maca, que no sòc pas un caball, jo. Que t'has cregut?
- L'unicorn les menja i ha de caminar uns passos fent voltes i tirnat-se un pet (ara està quiet). Bruna li posa el pot a sota quan aixeca la cua i surt caca en forma de arc de sant martí, com una caca de l'Arare.  Quan li diu gràcies, feia tres dies que no feia caca. Li diu que li pot ajudar, que té molta força en les potes del darrere i pot trencar coses. L'opció de demanar-li ajuda només surt si Bruna ja ha vist les taules de la cova de l'arbre i ha parlat amb ell.

**3b. Cuc de terra** (clar del bosc)

- *Pista:* «Jo sé cavar, però no puc moure aquesta roca.»
- Bruna empeny la roca i el Conill cava. El cuc surt i s'amaga en pocs segons: ha d'agafar-lo ràpid.
- És l'únic cas en què el Conill actua, no només dona pistes.

**4a. Rialla de granota** (riba del llac)

- *Pista:* «La de tres ulls no fuig, però no riu mai. Fes-li pessigolles amb un bolet de capell pelut.»
- Bruna arrenca un bolet i fa el gest de pessigolles amb el dit.
- La granota riu en bombolles i Bruna les atrapa amb el pot.

**4b. Escates de peix rar** (llac)

- *Pista:* «El daurat no pica amb res, només amb llavors del gran arbre.»
- Bruna ha de saltar molt alt per agafar les llavors de l'arbre gran, i n'agafa diverses. Durant la pesca que ja funciona, apareix la finestra de «Tirar!» més curta.
- Bruna torna el peix a l'aigua i li queda una escata al pot.

**5a. Pèl d'unicorn** (riba del llac)

- *Pista:* «Brilla quan esternuda.»
- Bruna agafa una herba picant i l'hi acosta al nas amb el gest de la carícia.
- L'unicorn esternuda, els pèls volen i Bruna els atrapa amb el pot.

**5b. La cosa rara que brilla** (clariana del bosc)

- *Pista:* «Fuig dels que corren, però busca altres llums.»
- Bruna deixa a terra un bolet lluminós a la clariana i s'asseu quieta. La lluerna s'acosta atreta per la llum i Bruna la tanca en un pot amb una tapa. El bolet només creix a la cova de l'arbre gegant, que l'unicorn ha d'obrir. Pista del Conill: «Sota els arbres enormes hi creixen bolets molt rars per simbiosi: l'arbre i el bolet s'ajuden i es donen menjar l'un a l'altre.»
- És el revers de la persecució de l'animació d'inici: allà corria, aquí espera.

**5c. Cera de l'espelma (casa de l'arbre gegant)**

- Per aconseguir-ho, cal fer una sèrie de coses. Primer buscar una llavor de l'arbre gran (pot tenir-la guardada d'abans, que també l'ha fet servir), plantar-la, fer un conjur d'aigua i pluja, que creixi, i pujar per aquesta planta fins la casa. A dins troba l'espelma. Les branques que pengen de l'arbre no deixen arribar-hi volant: si ho prova, Bruna diu que les branques no la deixen passar i que hi haurà d'arribar des de terra. La pluja pot sortir del poder de la poció 1 o del de la 4.

## Sistema de joc

El joc es juga en tercera persona amb càmera darrere de Bruna; només la llibreta passa a plans subjectius. Pere va descartar la primera persona per a tot el joc: ha invertit molt en veure Bruna moure's.

- **Sac:** guarda els objectes físics: ingredients i objectes intermedis (baies, formatge, bolet, herba picant, tapa). Es pot consultar per veure quines coses es tenen.
- **Llibre de conjurs (cuina del caldero):** conté les receptes fixes. Només es llegeix allà. En llegir una recepta, els 5 elements apareixen a la llibreta com a siluetes. Als primers nivells els ingredients són explícits; després, endevinalles.
- **Llibreta:** s'obre amb una icona i la càmera baixa a les mans de Bruna, que treuen la llibreta i el llapis. Té una pàgina per poció amb 5 buits. Quan Bruna aconsegueix un ingredient, es dibuixa a llapis al buit (aquesta animació és la recompensa). Les pistes del Conill s'hi dibuixen també i no ocupen buit. També té un diari, on Bruna apunta el que ha après i com s'activa cada poder, i un «Xat amb el Conillet», on surten escrits els missatges del Conill. Es pot consultar sempre amb un botó amb el dibuix d'una llibreta.
- **Caldero:** a la poció 1, els pots es tiren sense barrejar i el líquid queda en capes. A les altres, Bruna barreja amb un gest circular del dit, que va bé al mòbil. Quan la poció està llesta, canvia alguna cosa visible, un raig, fum, etc, al món i la bruixa adulta reacciona.
- **Conill i pistes, en dues capes:** quan té un missatge, la cua li parpelleja de verd fluorescent i sona un avís, com una notificació de mòbil, i el missatge surt escrit al «Xat amb el Conillet» de la llibreta. Primer és una pista vaga; si Bruna insisteix o espera uns segons, la pista explícita. No parla en veu alta: es comunica amb gestos i amb aquests missatges escrits. Apareix a la poció 1 per ensenyar la interfície. El conill pot guiar a la Bruna a l'espai on deu estar l'ingredient, sino serà complicat de trobar cada cosa en un espai tan gran. Indica l'espai o l'habitació, i pot donar alguna pista si se li demana, tipus, fred fred, calent calent, et cremes, a mida que s'apropa al lloc exacte o s'allunya, per`només si es demana. Quan Bruna és a prop del lloc exacte, brilla tot el Conill i salta sense parar.
- **Errors sense càstig:** si una acció falla, Bruna pot tornar-ho a provar.
- **Controls:** joystick i botons d'acció al mòbil; al teclat, WASD per moure's, Maj per correr, E i R per a les accions. Un botó de vareta màgica desplega a sota un botó per a cada conjur que Bruna ja sap fer.
- **Accions que existien als prototips antics (al prototip nou només hi ha portes, ascensor, acariciar l'unicorn i l'escombra):** agafar i deixar pots, llegir el llibre, tirar al caldero, acariciar l'unicorn, pescar, agafar aigua i obrir portes i ascensor.

## So

El joc té música i cada acció fa un soroll petit. Tot ha de sonar suau i amable, com es mou Bruna.

- **Música:** una cançoneta de to misteriós que sona de fons i es repeteix sense cansar.
- **Avís del Conill:** un so propi semblant al d'un missatge de mòbil, quan li parpelleja la cua.
- **Moviment:** passes en caminar i en córrer, que canvien segons el terra (herba, pedra, fusta, aigua), el salt i l'aterratge.
- **Poders:** el turbo, el rebot als bolets, el planeig, enlairar-se i volar amb l'escombra, i cada conjur de la vareta.
- **Objectes i llocs:** obrir i tancar portes, l'ascensor, agafar i deixar coses, tirar al caldero, remenar, obrir la llibreta i dibuixar-hi a llapis.
- **Personatges:** l'unicorn (menjar, pet, esternut), la planta que mossega, la rialla de la granota i el ratolí.

## Què demana el disseny a l'espai

Per fer possibles les 25 captures, cada escena ha de tenir aquests elements. Tot el que ja existeix als prototips es reutilitza.

| Escena | Necessita |
| --- | --- |
| Soterrani | Una zona on la planta carnívora segueixi Bruna i hi hagi espai per esquivar, i un camí des de la cuina per on el ratolí segueixi el formatge |
| Cuina del caldero | Despensa amb formatge, cistella de fruita i prestatgeria. Les 2 baldes altes de moment no tenen res |
| Terrassa | Pot groc i gebre que es fon amb el temps |
| Habitació de Bruna | Armaris que s'obren. Allà apareixen les robes (barret, bambes, vestit) de cada poció. |
| Sala del tron | Tarima, ascensor i lloc per a la bruixa adulta |
| Escala de caracol | Nínxol amb el pot violeta i esglaóns que Bruna trepitgi |
| Bosc, riba del llac | Arbust de baies lila, bolets de capell pelut a l'abast, granota de tres ulls fixa a la riba, peix daurat i una zona de passeig per a l'unicorn |
| Bosc, clar | Roca grossa sobre terra tova (cuc), un racó d'herba picant, flors per al pol·len, arbre blau per a la saba, papallones, marietes als troncs, bolets lluminosos i llucioles |
| Bosc, clariana | Un racó tranquil per esperar la llum del final del nivell, amb lloc per deixar-hi el bolet lluminós |
| Límit del bosc | Una barrera màgica després del llac que manté el bosc petit (assumit) |
| L'arbre i la cova interior tancada | Per trencar les taules cal l'unicorn. En apropar-se a les fustes que no deixen passar, la Bruna pot tenir un missatge d'obrir, però diu un missatge, ostres, caldria molta força per trencar això, sola no puc. |

**Necessitats de producció:** l'unicorn ha de poder caminar, el Conill ha de poder cavar, i les accions necessiten animacions noves.

## Decisions i què queda obert

Hi ha decisions que Pere ha pres, valors per defecte que s'han assumit perquè no ha contestat, i preguntes pendents. Si vols contradir una decisió assumida, avisa'l.

**Tancades per Pere**

- Estructura 5 nivells × 5 pocions × 5 ingredients; cada poció dona una peça de roba de bruixa i un poder.
- La poció 1 és el tutorial: només agafar i tirar al caldero. Les pocions 2 a 4 tenen 2 accions complexes, i la 5 en té 3.
- El Conill és l'acompanyant dels primers capítols i dona pistes. El Gat no és un ingredient.
- El Gat és la peça final per ser bruixa de debò, en lloc de la polsera arcoíris.
- La cosa rara que brilla és una lluerna.
- No calen contorns negres.
- Llibreta en plans subjectius. Es descarta la idea de punts o fotos d'animals.
- Els 25 ingredients (Pere va delegar l'elecció entre 7 candidats per poció).
- Estil pla tipus Alba i moviment de Bruna validats.
- El joc es juga al navegador, des de qualsevol lloc, amb prioritat al mòbil.
- El joc és per a la família i els amics.
- Les pocions donen poders: sol i pluja (1), bolets que fan saltar i plantes que no mosseguen (2), turbo amb fruita (3) i volar amb l'escombra (4).
- L'unicorn i la bruixa adulta parlen amb bafarades de text. El Conill no parla: els seus missatges surten al «Xat amb el Conillet» de la llibreta.
- Els conjurs es llancen amb un botó de vareta màgica que en desplega un per conjur.
- La casa de l'arbre és a dalt de l'arbre gegant, i les branques no deixen arribar-hi volant.
- Bruna agafa diverses llavors de l'arbre gran.
- Les 2 baldes altes de la cuina de moment no tenen res.
- Aquest document és només el nivell 1, amb 5 pocions. Els nivells 2 a 5 encara no estan definits.
- Bruna agafa dos bolets lluminósos a la cova: un és ingredient i l'altre fa de cebo per a la lluerna.
- El joc té música i un so per a cada acció (vegeu «So»).

**Assumides, per defecte**

- La bruixa adulta viu a la sala del tron i dona cada tasca.
- El bosc és obert però petit, amb una barrera màgica després del llac.
- La sala de les pocions del primer prototip i la cuina del caldero són la mateixa sala.
- On són els 5 pots de la poció 1 per les sales del torreó és una proposta que pot canviar.
- L'ordre dels ingredients al caldero no importa al nivell 1.

**Pendents**

- Si el nivell passa de dia o de nit: a l'animació d'inici hi ha lluna i finestres enceses.
- El detall de l'habitació de Bruna i de la terrassa, que és a les làmines.

## Estat tècnic i pla de construcció

Els prototips són pàgines HTML amb Three.js i funcionen al navegador, però són peces enganxades, no un projecte. Cal convertir-los en un projecte net i construir-hi el joc a sobre.

**Estat dels prototips**

- Cada escena es munta enganxant fragments (capçalera, personatge i cues de codi). L'exportació reorganitzada ja és a la carpeta prototip/ del projecte, amb mòduls, build i tests.
- Three.js es carrega des d'una CDN externa (versió r128).
- Tot es genera per codi: geometries simples i textures de canvas. No hi ha models, textures ni so externs.
- S'han provat en un navegador d'escriptori amb mida de mòbil. Falta provar-los en un mòbil real; el bosc és l'escena més pesada.

**Pla de construcció**

1. Obre el projecte exportat i prova'l en un mòbil real. Si va justet, optimitza abans d'afegir contingut.
2. Munta el projecte amb Vite i Three.js empaquetat (sense CDN), amb carpetes per personatge, escenes, físiques, interaccions, interfície i dades. Posa'l sota git des del principi, amb un commit per poció.
3. Defineix les pocions i els ingredients en un fitxer de dades, no al codi, perquè afegir els nivells 2 a 5 sigui afegir dades.
4. Construeix l'esquelet del joc: estat (sac, llibreta, progrés de pocions), cartell d'acció genèric, llibre, caldero, llibreta en pla subjectiu i el Conill amb pistes en dues capes.
5. Fes la poció 1 completa. És la primera peça realment jugable i valida l'esquelet.
6. Fes les pocions 2 a 5 una a una, començant per les seves accions.
7. Afegeix la bruixa adulta, integra l'animació d'inici i fes el final del nivell (el certificat i el Gat).
8. Publica el joc a **GitHub Pages** (decidit per Pere). Amb el pla gratuït el repositori ha de ser públic i la web és pública a internet: l'enllaç no es troba per casualitat, però qui el tingui hi entra. S'ha triat perquè el joc té URL pròpia i es pot instal·lar a la pantalla d'inici del mòbil, i així les partides guardades aguanten (a l'iPhone, Safari esborra l'emmagatzematge als set dies si el joc no s'obre des de la pantalla d'inici). Es va descartar itch.io, que permet contrasenya però posa el joc dins d'un marc i no es pot instal·lar.
9. El guardat de partida va al navegador de cada dispositiu, no entre dispositius. Cal que el joc es pugui instal·lar a la pantalla d'inici (manifest amb display standalone o fullscreen). La música i els sons entren amb l'esquelet del joc (vegeu «So»).

**Com treballar amb Pere.** És director creatiu, no programador: explica els passos en llenguatge senzill i ensenya el resultat en un enllaç que pugui obrir al mòbil. Vol feedback directe i raonat sobre el que no encaixa, i prefereix que l'inspirin abans que no que li ho facin tot. Escriu en català i en castellà.
