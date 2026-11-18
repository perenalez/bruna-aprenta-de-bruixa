# Bruna – Aprenta de bruixa · Encargo para Claude Code

## 0 · Instrucciones para Claude Code (leer primero)

Antes de empezar, lee el `CLAUDE.md` del proyecto: ahí está la estructura del código, la herramienta de montaje, las pruebas y las preferencias de Pere.

> **Nota:** Pere tiene otro documento de cambios con más indicaciones y hará uno conjunto. Si recibes los dos, combínalos; si algo se repite o se contradice, pregunta a Pere.

### Cómo trabajar: paso a paso, con confirmación

Hay mucho por hacer. **No lo hagas todo de golpe.** Trabaja **un paso cada vez**, en este orden:

| Paso | Qué | Dónde está el detalle |
| --- | --- | --- |
| **1** | Portada nueva (pantalla de inicio) y zona de proves | Apartado 1 |
| **2** | Correcciones y mejoras de la v1 → `v.1` | Apartado 2 |
| **3** | Testejar · "Crea el teu personatge" | Apartado 3.1 |
| **4** | Testejar · "Saltar nivells" | Apartado 3.2 |
| **5** | Testejar · "Nou motor de render" | Apartado 3.3 |

**La portada (paso 1) es lo primero:** se diseña, Pere da el OK y solo entonces se sigue con el resto.

**Al acabar cada paso:**
1. Pasa las pruebas automáticas (`npm test`), añade pruebas para lo nuevo y monta `dist/`.
2. Enséñale a Pere el resultado (qué has hecho, cómo probarlo, capturas si puedes).
3. **Para y espera su confirmación.** No empieces el paso siguiente hasta que Pere diga que sí. Si pide cambios, hazlos dentro del mismo paso.
4. Actualiza `CLAUDE.md` y `docs/historial.md` con lo hecho.

**Reglas generales:**
- **Idioma del juego: siempre catalán.** Todos los textos visibles (menús, botones, nombres de opciones, avisos) en catalán.
- Estilo visual del gameplay actual y de Alba: 3D low-poly, formas sencillas y ligeramente redondeadas, colores pastel, sombreado suave, sin contornos negros.
- Debe funcionar en navegador de ordenador y de móvil (joystick y botones táctiles; en teclado WASD, Maj, E, R, Espai).
- Las pruebas de la zona de proves van en módulos propios y no deben romper ni cambiar el juego normal.
- **No implementar el apartado 4** (ideas de futuro). Solo es referencia para no tomar decisiones que lo bloqueen.
- Si algo no está claro o falta información, pregunta a Pere antes de inventar.

---

## 1 · Paso 1 — Portada nueva y zona de proves

**MUY IMPORTANTE: en este paso SOLO se modifica la portada.** No tocar el juego, el gameplay, los escenarios, los personajes, los controles ni ninguna funcionalidad.

Objetivo: una portada más atractiva, cuidada y mágica, que parezca pertenecer exactamente al mismo videojuego. La sensación debe ser la de entrar en el mundo de Bruna: una pequeña aventura mágica, colorida y acogedora.

### 1.0 Imagen de referencia (la portada a igualar)

Archivo: **`referencias/portada-referencia.png`**. Es la imagen a igualar en composición, colores, luz y tipografía.

**Qué hay que copiar de la imagen:**
- Formato vertical para móvil.
- Cielo de atardecer degradado de lila/violeta arriba a rosa y melocotón abajo; luz cálida y suave.
- Arriba, centrado: el texto de bienvenida pequeño entre dos destellos de cuatro puntas lilas; debajo, **"Bruna"** muy grande en blanco/crema con trazos amarillos de "brillo" a cada lado; debajo, el subtítulo en negrita blanca y la frase pequeña.
- Bruna en el centro, grande, en plano medio, mirando al espectador y sonriendo, con sombrero puntiagudo y capa morados, levantando la varita con la mano derecha; en la punta de la varita una estrella luminosa con destellos y una estela rosa/lila en espiral.
- Caldero negro en primer plano abajo a la izquierda, con burbujas y vapor lila brillante.
- Torreón de piedra con tejado naranja a la izquierda, cortado por el borde, con ventanas iluminadas y balcón de madera.
- Conill a la izquierda abajo, junto al caldero; setas blancas y azuladas en el suelo; hierba verde y árboles de copas naranjas al fondo.
- Unicornio a la derecha, cortado por el borde.
- Botón **"Juga"** grande, en forma de píldora, amarillo/dorado con volumen, texto marrón oscuro y un destello de cuatro puntas delante, abajo en el centro.
- Créditos pequeños, abajo del todo, entre dos líneas finas horizontales.

**Qué NO hay que copiar de la imagen (manda este documento):**
- **Los textos de la imagen están en castellano y con errores. No usarlos.** Usar los textos en catalán del apartado 1.5.
- **Los créditos de la imagen ("Ayla i Pere") no valen.** Usar "Un joc creat per Ayla Sainz i Pere Nadal".
- **El animal de la derecha de la imagen parece una llama, sin cuerno.** Debe ser el **unicornio del juego**.
- **La imagen es una ilustración.** No pegarla como fondo ni redibujar a Bruna en ese estilo: la escena se monta en 3D con los **modelos originales del juego** (Bruna, Conill, unicornio, caldero, torreón, árboles, setas), colocados y encuadrados para que se parezca lo máximo posible a la imagen.
- **En la imagen falta el acceso secundario.** Añadir la tarjeta cuadrada "Accedir a la zona de proves" (apartado 1.6), más pequeña que "Juga", sin tapar a Bruna ni al caldero (p. ej. debajo o al lado de "Juga").

Si algo de la imagen no se puede conseguir con los modelos del juego, avisa a Pere y propón la alternativa más cercana antes de cambiar nada de los modelos.

### 1.1 Analizar antes de modificar
Localiza:
- La estructura actual de la pantalla de inicio y los componentes exclusivos de la portada.
- Los modelos 3D originales de Bruna, el Conill, el unicornio y el caldero.
- Materiales, texturas, iluminación y colores del gameplay.
- El motor gráfico y el sistema de animación actual.
- Los recursos que se puedan reutilizar directamente en la portada.

Usa los assets originales siempre que sea posible. **No inventes una nueva versión de Bruna** ni sustituyas los modelos por ilustraciones o personajes de otro estilo.

### 1.2 Dirección artística
Mantener exactamente la estética del gameplay:
- 3D low-poly, formas geométricas sencillas y ligeramente redondeadas.
- Personajes simpáticos y expresivos.
- Colores pastel, alegres y luminosos.
- Árboles con copas geométricas y volúmenes sencillos; setas de colores, vegetación y elementos naturales.
- Iluminación suave y sombras sencillas.
- Apariencia de videojuego indie de aventuras (referencia: el propio gameplay y Alba).

Nada de aspecto cinematográfico hiperrealista, de película de animación ni de ilustración 2D. Debe parecer una escena real del universo 3D que ya existe.

### 1.3 Composición de la escena
**Bruna** (protagonista absoluta):
- Bastante más grande que en la portada actual.
- Modelo 3D original, con su sombrero morado y su vestuario original.
- En primer plano, preferiblemente en el centro.
- Con la varita mágica levantada.
- Ligeramente orientada hacia el espectador, si técnicamente es posible.

**Elementos secundarios:**
- El Conill y el unicornio acompañan a Bruna.
- El caldero en primer plano.
- Árboles, setas y vegetación originales del juego.
- Profundidad colocando elementos en diferentes planos.
- Pocos elementos: que nada compita con Bruna. Composición equilibrada.

### 1.4 Magia y pequeñas animaciones (sutiles, ligeras, discretas)
- **Varita:** pequeñas partículas luminosas que salen de la punta (amarillos, dorados, rosas, violetas), suben suavemente y desaparecen poco a poco; variar un poco tamaño, velocidad y opacidad; pequeños destellos ocasionales.
- **Bruna:** respiración muy suave, pequeño movimiento vertical o balanceo, parpadeo ocasional si el modelo lo permite, movimiento sutil de la varita.
- **Caldero:** pequeñas burbujas, humo o partículas que suben lentamente, ligero brillo mágico en el interior.
- **Ambiente:** algunas partículas flotantes, pequeños destellos en puntos aleatorios, movimientos muy sutiles de mundo vivo.
- **Evitar:** rayos gigantes, explosiones, luces exageradas o efectos que desentonen con el low-poly.

### 1.5 Tipografía y textos (todo en catalán)
- **Título: BRUNA.** Mucho protagonismo. Tipografía con personalidad, redondeada y amable, estética de cuento mágico y aventura (como la de la imagen de referencia). Evitar fuentes genéricas.
- **Textos de bienvenida:**
  - "Hola! Benvingudes a la nostra aventura!"
  - "Bruna, l'aprenenta de bruixa"
  - "Segueix les passes fins convertir-te en una bruixa de veritat!"
- **Créditos**, abajo de la portada, con tipografía discreta pero legible:
  - **"Un joc creat per Ayla Sainz i Pere Nadal"**
- Número de versión **`v.1`**, muy discreto (p. ej. en una esquina).

### 1.6 Botones
**Botón principal: "Juga"**
- El elemento principal de interacción: grande, redondeado, amarillo/dorado, con ligera sensación de volumen y profundidad.
- Animación muy sutil de respiración o escala para llamar la atención.
- En una posición cómoda y accesible en el móvil.
- **Inicia el juego normal exactamente igual que hasta ahora.** No modificar la navegación ni el flujo de inicio.

**Acceso secundario: "Accedir a la zona de proves"**
- Más pequeño y claramente diferenciado del botón "Juga".
- Botón o tarjeta **cuadrada con esquinas ligeramente redondeadas**, misma estética mágica y low-poly.
- Lleva a una **zona de proves** independiente del acceso normal al juego.

**Dentro de la zona de proves: botón "Testejar"**
- Misma estética gráfica que el resto de la interfaz.
- "Testejar" abre la lista de pruebas, con un botón **"Tornar"**:
  1. "Crea el teu personatge"
  2. "Saltar nivells"
  3. "Nou motor de render"
  - Mientras no estén hechas, se ven en la lista pero desactivadas (con un "Aviat").
- No debe interferir con el funcionamiento del gameplay original.

### 1.7 Distribución (pensada para móvil)
Prioridades, en este orden:
1. Bruna, el elemento más grande y reconocible.
2. Título con jerarquía visual clara.
3. La escena 3D ocupa la mayor parte de la pantalla.
4. Botón "Juga" cómodo y accesible.
5. Textos legibles que no tapan al personaje.

Los botones no deben tapar a Bruna ni los elementos mágicos. La interfaz no debe ocupar demasiado espacio sobre la escena. Debe adaptarse a distintos tamaños de pantalla, respetando la orientación y dimensiones actuales.

### 1.8 Implementación técnica
- La portada funciona de forma independiente del gameplay; si hace falta, crear una escena o componente propio para ella.
- Crear o modificar solo los componentes de la pantalla de inicio.
- Reutilizar modelos y recursos existentes **sin modificar los originales**. Antes de tocar un archivo compartido con el gameplay, buscar una alternativa que lo deje intacto.
- Usar el sistema de animación que ya tiene el proyecto. No instalar dependencias si no son necesarias.
- No modificar escenas, cámara, controles ni lógica del juego.
- Rendimiento fluido en móvil: evitar animaciones costosas.

### 1.9 Orden de trabajo y comprobación
1. Analizar archivos y recursos.
2. Identificar qué assets originales se reutilizan.
3. Localizar los componentes exclusivos de la portada.
4. Diseñar la composición, comparándola con la imagen de referencia.
5. Implementar las animaciones mágicas.
6. Tipografía e interfaz.
7. Comprobar que se adapta bien a móvil.
8. Verificar que "Juga" sigue funcionando igual.
9. Comprobar que el gameplay sigue exactamente igual.
10. Enseñar a Pere una captura de la portada al lado de la imagen de referencia y **esperar su OK** antes de pasar al paso 2.

---

## 2 · Paso 2 — Correcciones y mejoras de la versión actual (→ `v.1`)

Al acabar este paso, la versión pasa a llamarse **`v.1`**: en la portada, en `package.json` (`"version": "1.0.0"`) y en `docs/historial.md`.

### 2.1 Errores
- **Ingrediente lila que no desaparece.** El ingrediente lila de la poción que está junto a la puerta de la habitación de Bruna no desaparece al cogerlo y sigue activo en esa zona todo el rato.
  - *Debe:* desaparecer al cogerlo, quitar su zona de interacción y quedar guardado como recogido (también al recargar la partida).

### 2.2 Gato (final del nivel 1, al conseguir la quinta poción)
- **No camina bien:** tiene las patas rectas y no hay animación de caminar.
  - *Debe:* animación de caminar de gato (patas que se doblan y alternan, cuerpo y cola que se balancean), coherente con la velocidad a la que se mueve.
- **En la escoba va volando a su lado.**
  - *Debe:* ir **subido en la escoba** con Bruna (sentado detrás de ella o delante), moviéndose con ella.
  - *Mantener:* cuando Bruna se hace gigante con los boletes, el gato salta con ella. Eso le gusta a Pere y no se toca.

### 2.3 Jugabilidad: botones de lugares que se desbloquean
- **Ahora:** los botones de arriba a la derecha (Terrassa, etc.) llevan a cada sitio desde el principio.
- **Debe:**
  - Al empezar una partida no hay ningún botón de lugar.
  - Cada botón aparece la primera vez que Bruna entra caminando en ese lugar (p. ej. al entrar al torreón y a la sala del tron aparecen "Torre" y "Tron").
  - Una vez desbloqueado, el botón sirve para ir allí directamente desde cualquier sitio (p. ej. desde el bosque volver a la sala del tron).
  - Los lugares desbloqueados se guardan con la partida.

### 2.4 Visual: luz según la hora real
- La iluminación del juego depende de la hora real del dispositivo en que se juega.
- Referencias de Pere: **7:00 de día**, **21:00 casi de noche**, **22:00 noche cerrada**.
- *Propuesta para implementar (ajustable):*
  - 22:00 – 6:00 → noche (luz azul oscura, luna, bolets y luciérnagas brillan más, ventanas del torreón encendidas).
  - 6:00 – 7:30 → amanecer (cálido, rosado).
  - 7:30 – 19:30 → día.
  - 19:30 – 21:00 → atardecer (naranja).
  - 21:00 – 22:00 → anochecer (casi de noche).
  - Transiciones suaves entre franjas, no de golpe.
- Que la noche siga siendo jugable: se tiene que ver a Bruna y los objetos importantes.

### 2.5 Visual: el Conill de Bruna
- El conejito que acompaña a Bruna se debe distinguir de los otros conejos del bosque.
- *Debe:* mantener el marrón actual con **manchitas blancas por todo el cuerpo**. Conserva el lazo rojo de lunares.

### 2.6 Visual: aviso de mensaje del Conill (cola arcoíris)
- **Ahora:** cuando el Conill tiene un mensaje o pista que dar, la cola brilla solo en amarillo y cuesta verla.
- **Debe:** cuando tiene un mensaje, la cola brilla y va cambiando de color recorriendo los colores del arcoíris, en bucle y de forma suave, hasta que Bruna recibe el mensaje. Tiene que verse bien también de noche (ver 2.4).

### 2.7 Cámara: inicio de partida con vuelta de 360°
- **Ahora:** el juego empieza con Bruna parada y la cámara muy cerca, a su espalda.
- **Debe:**
  - Al empezar la partida, la cámara hace un **planeo por el mapa con una vuelta de 360° alrededor de Bruna**, mostrando el entorno.
  - El movimiento termina **a la espalda de Bruna**, pero **más alejado que ahora**: Bruna se ve más pequeña y se ve más entorno.
  - Esa distancia más abierta pasa a ser el **punto de cámara por defecto** al jugar.
  - Los controles (joystick, botones) se tienen que ver bien con el nuevo encuadre. Durante la vuelta pueden estar ocultos y aparecer al acabar.
  - Movimiento suave y lento, de unos pocos segundos (ajustable). Se puede saltar tocando la pantalla o pulsando una tecla.
- Es solo un cambio de cámara inicial; no cambia nada más del inicio de partida.

### 2.8 Sabates màgiques: doble salto y planeo
- **Ahora:** con los zapatos mágicos activados, Bruna hace el salto normal.
- **Debe:**
  - Con los zapatos mágicos activados, Bruna puede hacer **doble salto**: pulsar saltar otra vez en el aire hace un segundo salto.
  - Después del doble salto puede **planear un poco** (bajada lenta), manteniendo pulsado el botón de saltar.
  - Un pequeño efecto visual en el segundo salto (chispas o destello en los zapatos) para que se note.
  - Sin los zapatos mágicos, el salto sigue como ahora.

---

## 3 · Zona de proves · "Testejar" (pasos 3, 4 y 5)

Las pruebas son zonas aisladas: lo que se haga en ellas no afecta a la partida de "Juga". Cada una es un paso con su propia confirmación.

### 3.1 Paso 3 — "Crea el teu personatge"

Ventana para crear un personaje y ponerle nombre. Pantalla con una pestaña por apartado y una vista previa del personaje en 3D, que se actualiza al momento y se puede girar.

El muñeco base es bastante asexual: **no se elige niño o niña**. La combinación de pelo, ropa y complementos es lo que acaba de definir qué tipo de personaje es.

**Requisitos:**
- Pestañas: Nom · Pell · Pentinat · Cabell · Roba · Bruixa · Complements · Sabates · Mitjons.
- Cada pestaña muestra sus opciones como fichas con un dibujo o miniatura y el nombre en catalán.
- **Roba:** se combina una pieza de dalt y una de baix, o una sencera (que sustituye a las dos). Se puede no llevar pantalones.
- **Bruixa:** los barrets sustituyen a los gorros de Complements (solo una prenda en la cabeza a la vez). Las mitges sustituyen a los mitjons. Los vestits/capes se ponen encima de la roba.
- **Complements:** se pueden combinar varios a la vez, salvo los de cabeza (solo uno).
- Botón **"Aleatori"** que crea un personaje al azar.
- Botón **"Fet!"**: el personaje aparece en un espacio pequeño (p. ej. el claro del lago) y se puede mover con los controles normales, para ver cómo queda en movimiento.
- El personaje creado se guarda en el dispositivo.
- Pensado para reutilizarlo más adelante (ver apartado 4, peine mágico): el sistema de pelo y ropa debe ser modular.

**Objetivo de la prueba:** ver cómo funciona en la práctica la personalización: si se entiende, si es divertida y cómo quedan las combinaciones en movimiento.

#### Nom
- Campo de texto para escribir el nombre del personaje.

#### Pell (10)
1. Molt clar
2. Clar rosat
3. Clar daurat
4. Mig clar
5. Oliva
6. Bru clar
7. Bru
8. Bru fosc
9. Fosc
10. Molt fosc

#### Pentinat (10)
1. Curt llis
2. Curt arrissat
3. Rapat amb serrell
4. Mitja melena
5. Llarg llis
6. Llarg ondulat
7. Cua de cavall
8. Dues trenes
9. Dos monyos
10. Afro

#### Cabell, color (10)
1. Negre
2. Castany
3. Ros
4. Groc
5. Pèl-roig
6. Blanc
7. Lila
8. Blau
9. Rosa
10. Arc de Sant Martí

#### Roba (10)
1. Samarreta de flors (dalt)
2. Samarreta de cotxes (dalt)
3. Samarreta de pops (dalt)
4. Samarreta de l'estelada: estelada roja, triangle vermell amb l'estrella i les 4 barres (dalt)
5. Dessuadora amb caputxa (dalt)
6. Pantalons texans (baix)
7. Pantalons curts de ratlles (baix)
8. Faldilla de flors (baix)
9. Faldilla de volants (baix)
10. Vestit de pics (sencer)

#### Bruixa (10)
1. Mitges de ratlles liles
2. Barret amb estrella
3. Barret amb lluna
4. Vestit tot negre
5. Vestit de llunes i estrelles
6. Capa morada
7. Capa de nit estrellada
8. Mitges de ratlles verdes i negres
9. Davantal de pocions
10. Barret punxegut tort amb pedaços

#### Complements (10)
1. Polseres de colors
2. Polsera de cascavells
3. Diadema de flors
4. Diadema d'orelles de gat
5. Ulleres rodones
6. Ulleres d'estrella
7. Arracades de lluna
8. Cara pintada de colors (estil princesa Mononoke)
9. Gorro de neu amb borla
10. Barret de plomes

#### Sabates (10)
1. Vambes (tipus Vans)
2. Sabates de pallasso
3. Sabates de taló
4. Sabates de pics
5. Sabates negres senzilles
6. Sabatilles de ballarina
7. Espardenyes de sardana (de vetes)
8. Espardenyes
9. Avarques
10. Crocs

#### Mitjons (10)
1. Vermells
2. Grocs
3. Blaus
4. Verds
5. Liles
6. Rosa
7. De ratlles
8. De pics
9. Arc de Sant Martí
10. Desaparellats (un de cada color)

### 3.2 Paso 4 — "Saltar nivells"

Para jugar desde cualquier nivel sin tener que hacer antes las pociones, y así ver cómo funcionan los efectos, conjuros y habilidades de cada nivel.

**Requisitos:**
- Pantalla con un botón por nivel (**Nivell 1 … Nivell 5**). Solo se activan los niveles que ya existen en el código; el resto se ven desactivados.
- Al elegir un nivel, la partida empieza en ese nivel con todo lo de los niveles anteriores ya conseguido (objetos, habilidades y recompensas: sombrero, escoba, sabates màgiques, etc.).
- Dentro de un nivel, un panel de prueba con interruptores para activar o desactivar cada efecto o habilidad (p. ej. escoba, sabates màgiques, boletes gigantes) y para dar por hecha cada poción.
- Es una partida de prueba: no se guarda ni sobrescribe la partida de "Juga".

### 3.3 Paso 5 — "Nou motor de render"

Espacio de prueba para el nuevo motor de renderizado en el que está trabajando Pere.

> **PENDIENTE: Pere aporta los archivos o la descripción del nuevo motor** (dónde está el código, qué cambia respecto al render actual y qué quiere comparar). Claude Code: no inventes el motor. Si no tienes ese material, prepara solo el hueco en la lista ("Nou motor de render") y una escena de prueba vacía, y pregunta a Pere.

Cuando esté el material, la prueba debería:
- Cargar una escena conocida del juego (p. ej. el claro del lago con Bruna y el Conill) con el nuevo motor.
- Tener un botón para **cambiar entre render actual y render nuevo** en la misma escena, para compararlos.
- Mostrar los FPS, para ver el rendimiento en ordenador y en móvil.
- No afectar al render del juego normal hasta que Pere decida adoptarlo.

---

## 4 · Ideas de futuro (NO implementar)

Solo referencia, para que las decisiones de ahora no las bloqueen.

### Nivel 2 · Recompensas de las pociones
- **Pinta màgica (peine mágico):** al cogerlo aparece un botón para elegir peinado. Se muestran varias imágenes de peinados y se puede elegir el color (p. ej. amarillo) y el largo (p. ej. corto). Reutilizará el sistema de "Crea el teu personatge".
- **Corretja de l'unicorn:** al usar la poción en el botón de la varita mágica, el unicornio se transforma en un unicornio con alas. La recompensa es una correa con los colores del arcoíris: Bruna baja, se la pone al unicornio y puede volar con él.
  - Con el unicornio se vuela igual que con la escoba.
  - El unicornio también puede caminar por encima del arcoíris.

### Dos montañas nuevas
- **Muntanya nevada (blanca):** con la cueva del Yeti. El Yeti vive allí y es bueno.
- **Muntanya verda:** llena de plantas y quizá algunos insectos.
- **Cómo se llega:** volando o caminando. Caminando cuesta más, porque hay que subir hasta arriba para encontrar lo que se necesita. Las dos formas deben ser posibles (Pere siempre irá volando).
