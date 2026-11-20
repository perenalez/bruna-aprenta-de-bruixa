# Bruna · Encargo para Claude Code: previa del Nivel 2 (món submarí)

## 0 · Qué es este encargo (leer primero)

Antes de empezar, lee el `CLAUDE.md` del proyecto: ahí está la estructura del código, la herramienta de montaje, las pruebas y las preferencias de Pere.

**Objetivo:** construir una **previa jugable del mundo del nivel 2** dentro de la **zona de proves**, para ver:
- cómo es el mundo submarino (mapa, zonas, ambiente);
- cómo quedan los animales y efectos (burbujas, peces, pulpo, pez grande, ostra con perla...);
- cómo funciona **cada poder de las 5 pociones**, **sin tener que hacer las pociones**: se activan directamente desde un panel, como si ya estuvieran resueltas.

**No es el nivel 2 final.** No hay historia, ni pociones que recoger, ni ingredientes. Es un espacio de prueba para validar el mundo y los poderes.

**Reglas:**
- **Idioma: siempre catalán** en todo lo visible.
- Estilo del juego y de Alba: 3D low-poly, formas sencillas y ligeramente redondeadas, colores pastel, sombreado suave, **sin contornos negros**.
- Funciona en navegador de ordenador y de **móvil** (joystick y botones táctiles; teclado WASD, Maj, E, Espai).
- Va en **módulos propios** de la zona de proves. **No tocar el juego normal** (nivel 1, controles, cámara, partidas guardadas).
- Reutiliza a Bruna y su sistema de animación existente. Los modelos nuevos (tortuga, peces, pulpo, etc.) se hacen en el mismo estilo.
- Rendimiento fluido en móvil: cuidado con la cantidad de peces, burbujas y partículas.
- **Trabaja por pasos** (apartado 7): al acabar cada uno, pasa `npm test`, monta `dist/`, enséñale a Pere capturas y **espera su OK** antes de seguir.
- Si algo no está claro, pregunta a Pere antes de inventar.

---

## 1 · Acceso desde la zona de proves

- En la lista de pruebas de **«Testejar»** añadir: **«Món submarí (nivell 2)»**.
- La prueba no guarda nada en la partida de «Juga».

---

## 2 · Llegada (secuencia de entrada)

Es el **inverso de la salida del nivel 1** (ver prototipo «Sortida en unicorn» si existe en la zona de proves):

1. Cielo; un **puntito blanco** baja desde lo alto por un **camino de arcoíris**.
2. Al acercarse se ve que son **Bruna montada en el unicornio**.
3. Aterrizan en una **pequeña isla de arcoíris** (isla redonda con franjas de colores del arcoíris en la arena o la roca). Alrededor, **todo es agua**.
4. Bruna baja del unicornio. **El unicornio se queda en la isla** (es el punto de regreso).
5. Una **tortuguita** asoma la cabeza del agua y habla (bocadillo de texto):
   > «Bruna! Vine, que t'ensenyo a nedar. Has de prémer **Salta** per caure a l'aigua. Un cop a l'aigua, pots nedar per sobre. Si vols anar a sota, prem **Bussejar** i baixaràs. Però ves molt ràpida, que se t'acaba l'aire! Tranquil·la: amb la primera poció t'ajudarem a respirar millor.»
6. Botón **«Saltar la intro»** visible desde el principio, para ir directamente a jugar.

---

## 3 · El mundo: mapa y zonas

Referencia: **`referencias/mapa-nivell-2.jpg`** (lámina de Pere). Es referencia de ambiente y elementos, **no de posiciones exactas**: prioriza que se pueda nadar bien entre zonas.

**Ojo:** en la lámina aparecen un **conejo** en el bosque de algas y un dibujo de niño con conejo en una esquina. **No incluirlos**: el Conill no está en el nivel 2.

### Estructura general
- **Superficie:** mar abierto con la **isla de arcoíris** (y el unicornio). Desde la superficie se ve el fondo a través del agua.
- **Fondo marino** (debajo): las cuatro zonas de la lámina, conectadas por caminos de arena clara.
- Rayos de luz que bajan desde la superficie, agua turquesa, más oscura cuanto más hondo.

### Zonas

| Zona | Qué tiene (según la lámina) | En la previa |
| --- | --- | --- |
| **L'illa de l'arc de Sant Martí** | (No sale en la lámina.) Isla pequeña de colores en la superficie | Punto de llegada. El unicornio está aquí. |
| **La casa submarina** | Casa de piedra con tejado de madera y una gran caracola encima, ojos de buey, estrellas de mar en las paredes, chimenea, puerta de madera, jardín de algas y corales, setas de colores al lado | **Casa de Bruna en el nivel 2.** Se puede entrar. Dentro, un **armario** para cambiarse (ver apartado 5, bañador y gafas). |
| **El bosc d'algues** | Algas muy altas, verdes y amarillas, que se mecen; piedras con musgo; setas luminosas | Bruna puede nadar entre las algas, que se apartan un poco a su paso. |
| **La cova** | Cueva en una roca grande, con **cristales azules brillantes**, corales y burbujas que salen | Se puede entrar. Dentro, oscuro con los cristales como luz. De momento vacía (Pere decidirá qué hay). |
| **El vaixell enfonsat (amb tresors)** | Barco pirata hundido, mástiles rotos, velas rotas, ancla, cañón, **cofres con monedas de oro**, copas | Se puede nadar alrededor y por la cubierta. Los cofres se pueden abrir («Obre el cofre») y salen monedas brillando. |
| Alrededores | Arrecifes de coral de colores, estrellas de mar, una corriente de agua | Ambiente. |

---

## 4 · Fauna y efectos del mundo

Todo en low-poly y con movimientos suaves. Que el mundo se sienta vivo.

- **Burbujas:**
  - de Bruna al bucear (salen de la boca, más con el poder 1 y 4);
  - del suelo, de la cueva y de la chimenea de la casa;
  - suben y se deshacen al llegar a la superficie.
- **Bancos de peces pequeños:** varios grupos de peces de colores que nadan juntos y **se apartan cuando Bruna pasa cerca**.
- **Peces sueltos** de colores nadando por las zonas.
- **Un pulpo:** vive junto a la cueva o el barco. Mueve los tentáculos; si Bruna se acerca, se esconde o cambia de color.
- **Un pez muy grande** (tipo ballena o mero gigante, simpático): pasa lentamente de vez en cuando por encima de la zona, haciendo sombra.
- **La tortuguita:** acompaña a Bruna por todo el nivel, nadando a su lado (como el Conill en el nivel 1).
- **Una ostra gigante:** en el fondo, cerca de la casa o del bosque de algas.
  - Cerrada por defecto.
  - Al acercarse, botón **«Obre l'ostra»**: se abre lentamente y dentro hay una **perla grande brillante**.
  - Se puede volver a cerrar.
- **Estrellas de mar** en las rocas y **algas** que se mecen.
- **Rayos de luz** desde la superficie que se mueven suavemente.
- **Partículas** pequeñas flotando en el agua.

---

## 5 · Poderes de las 5 pociones (probar directamente)

En la previa **no hay que hacer las pociones**. Hay un **panel de proves** (botón en una esquina, p. ej. «Poders») con un interruptor por poder, para activarlos y desactivarlos en cualquier momento.

### Mecánicas base (sin ningún poder)
- **Nadar en superficie:** con el joystick, como caminar, flotando.
- **Saltar al agua:** desde la isla, con Salta.
- **Bucear:** botón **«Bussejar»** para bajar; botón **«Pujar»** (o soltar) para subir.
- **Aire limitado:** bajo el agua aparece un **indicador de aire** que se va gastando. Al salir a la superficie se recupera. Si se acaba, Bruna sube sola a la superficie (sin castigo).

### Los poderes

| Interruptor | Poder | Qué tiene que pasar en la previa |
| --- | --- | --- |
| **Poció 1 · Ulleres i tub** | Gafas de buceo con tubo | Bruna lleva **gafas y tubo**. Puede nadar en la superficie **con la cara dentro del agua** sin gastar aire y ver el fondo con claridad (el agua se ve más nítida). Al bajar, el aire **se sigue gastando**. |
| **Poció 2 · Banyador** | Bañador | Bruna lleva **bañador**. *(Por decidir por Pere si da algo más. Propuesta para probar: nada un poco más rápido y el aire dura algo más.)* Poner los dos efectos como opción activable para que Pere los pruebe. |
| **Poció 3 · Parlar amb els animals** | Hablar con los animales bajo el agua | Al acercarse a un pez, al pulpo o al pez grande aparece **«Parla»** y el animal responde con un bocadillo (frases de prueba en catalán, divertidas). Sin este poder, solo hacen burbujas o se van. |
| **Poció 4 · Respirar sota l'aigua** | Respirar bajo el agua | **El indicador de aire desaparece**: puede quedarse en el fondo todo el tiempo. |
| **Poció 5 · Sirena** | Se convierte en sirena | Transformación con destello y burbujas: las piernas se convierten en **cola de sirena** (colores del arcoíris o turquesa). Nada **mucho más rápido**, con movimiento ondulante, y puede ir a cualquier sitio. Incluye respirar bajo el agua. |

- Los poderes se pueden combinar (p. ej. 1 + 3).
- Al desactivar un poder, Bruna vuelve a como estaba.
- **En la casa submarina**, el armario permite ponerse o quitarse el bañador y las gafas a mano (si el poder está activo).

---

## 6 · Cámara y controles

- Cámara en tercera persona detrás de Bruna, como en el nivel 1, que se adapta al nadar y bucear (algo más alejada en el fondo para ver el entorno).
- Botones táctiles: joystick, **Salta**, **Bussejar**, **Pujar**, botón de acción contextual (Obre l'ostra, Obre el cofre, Parla, Entra) y botón **«Poders»**.
- Teclado: WASD para moverse, Espai saltar/subir, Maj o C para bucear, E para la acción.

---

## 7 · Orden de trabajo (paso a paso, con OK de Pere)

1. **Mundo y nado básico:** superficie, isla de arcoíris con el unicornio, fondo marino con las 4 zonas (formas básicas), nadar, saltar al agua, bucear, subir, indicador de aire. → **OK de Pere**
2. **Fauna y efectos:** burbujas, bancos de peces, peces sueltos, pulpo, pez grande, tortuguita acompañante, ostra con perla, rayos de luz, algas que se mecen. → **OK de Pere**
3. **Zonas con detalle:** casa submarina (entrar, armario), bosque de algas, cueva con cristales, barco hundido con cofres. → **OK de Pere**
4. **Panel de poderes:** los 5 poderes con sus interruptores. → **OK de Pere**
5. **Llegada:** secuencia de entrada con el unicornio y el diálogo de la tortuga, con «Saltar la intro». → **OK de Pere**

Al acabar cada paso: `npm test`, pruebas nuevas para lo hecho, montar `dist/`, capturas para Pere y actualizar `CLAUDE.md` y `docs/historial.md`.

---

## 8 · Fuera de esta previa (no hacer)

- Historia del nivel 2, piratas y sirenas como personajes, pociones con ingredientes, pistas de la tortuga, salida hacia el nivel 3.
- Qué hay dentro de la cueva (de momento vacía).
