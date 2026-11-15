/* =====================================================================
   DATOS DEL NIVEL 1 — pociones, ingredientes, premios y textos
   Añadir una poción o un nivel = añadir datos aquí (DISSENY-NIVELL-1.md).
   Solo la poción 1 tiene ya los ingredientes colocados en el mundo ("spot");
   las otras cuatro están definidas pero «en construcción».
   Tipos de spot: shelf (balda baja de la cocina), ward (dentro del armario de Bruna),
   lift (tarima del trono, se mueve con el ascensor), local (coordenadas del torreón).
   ===================================================================== */
const NIVEL1={
  nombre:'Nivel 1',
  pociones:[
    {id:'arcoiris',nombre:'Poción Arcoíris',poder:'Controla el clima',
     receta:'Cinco botes de colores, uno tras otro. No se remueve: así queda en capas, como un arcoíris.',
     mezclar:false,
     premio:{ropa:'barret',nombre:'el sombrero de bruja'},
     poderes:['sol','lluvia'],
     diario:['He hecho la poción Arcoíris: ¡controlo el clima!',
             'Para lanzar un conjuro: toca la varita y elige «Sol» o «Lluvia».',
             'El sol da calor. La lluvia riega las plantas.'],
     ingredientes:[
       {id:'rojo',nombre:'Bote rojo',color:'#e23b3b',sala:2,
        vaga:'Algo rojo descansa donde huele a sopa de bruja.',
        clara:'El bote rojo está en la estantería de la cocina del caldero, en una balda baja.',
        spot:{type:'shelf',lvl:2,x:-1.05,row:1}},
       {id:'amarillo',nombre:'Bote amarillo',color:'#f0d436',sala:3,
        vaga:'Algo amarillo toma el aire fresco, arriba del todo.',
        clara:'El bote amarillo está en la terraza, en lo alto del torreón.',
        spot:{type:'local',lvl:3,x:3.3,z:3.1}},
       {id:'verde',nombre:'Bote verde',color:'#4fd04a',sala:1,
        vaga:'Algo verde se esconde detrás de unas puertas que crujen.',
        clara:'El bote verde está dentro del armario de tu habitación. ¡Ábrelo!',
        spot:{type:'ward',lvl:1,x:0.45,y:1.02}},
       {id:'azul',nombre:'Bote azul',color:'#3f6fe0',sala:0,
        vaga:'Algo azul viaja arriba y abajo sin moverse del sitio.',
        clara:'El bote azul está en la tarima del trono, la que hace de ascensor.',
        spot:{type:'lift',x:1.25,z:0.55}},
       {id:'violeta',nombre:'Bote violeta',color:'#a050e0',sala:'t',
        vaga:'Algo violeta da vueltas y vueltas… como una escalera.',
        clara:'El bote violeta está en un hueco de la escalera de caracol.',
        spot:{type:'local',lvl:'t'}}
     ]},
    {id:'parinuris',nombre:'Magiculis Parinuris',poder:'Domina las plantas salvajes, como las setas y las carnívoras',
     receta:'Cinco cosas de plantas y bichos. Échalas al caldero y remueve con el dedo, dando vueltas, hasta que se mezcle todo.',
     mezclar:true,color:'#6fd06a',
     premio:{ropa:'vestit',nombre:'el vestido de bruja'},
     poderes:['setas','plantas'],
     diario:['He hecho la poción Magiculis Parinuris: ¡domino las plantas salvajes!',
             'Si salto encima de una seta gigante, salgo disparada hacia arriba. Al bajar, mantén «Saltar» para planear.',
             'Las plantas carnívoras ya no intentan comerme: ahora me hacen caricias.'],
     ingredientes:[
       {id:'baba',nombre:'Baba de planta carnívora',color:'#a8e05a',sala:'-1',accion:true,
        vaga:'Babean cuando tienen calor.',
        clara:'La planta carnívora más grande está en el dormitorio de la bruja (baja con el ascensor del trono). Lánzale «Sol» con la varita y, cuando babee, ofrécele el bote. ¡Esquívala!'},
       {id:'pelo',nombre:'Pelo de ratón',color:'#9a9aa6',sala:2,accion:true,
        vaga:'El ratón no quiere ser la merienda de nadie que haga la fotosíntesis… pero a veces se le olvida si tiene queso cerca.',
        clara:'Coge queso de la despensa de la cocina: el ratón te seguirá. Llévalo al dormitorio de la bruja y deja el queso detrás de la planta grande. ¡Ella hará de pinzas!'},
       {id:'polen',nombre:'Polen de las flores',color:'#ffd84a',sala:'out',
        vaga:'Algo dorado baila con el viento, cerca del agua.',
        clara:'Hay una flor grande que brilla junto al estanque de las ranas. Su polen es dorado.',
        spot:{type:'flor',x:-3.4,z:5.6}},
       {id:'musgo',nombre:'Musgo de las rocas',color:'#5f9a3a',sala:'out',
        vaga:'Algo verde y blandito duerme encima de una piedra.',
        clara:'En el claro del unicornio hay una roca con musgo verde por encima.',
        spot:{type:'roca',x:2.6,z:-6.4}},
       {id:'mariquita',nombre:'Mariquita de siete puntos',color:'#e23b3b',sala:'out',
        vaga:'Entre muchas que suben y bajan, solo una tiene siete puntos.',
        clara:'Las mariquitas suben por el tronco del árbol azul, a la izquierda del claro. Busca la que brilla: es la de siete puntos.',
        spot:{type:'mariquita'}}
     ]},
    {id:'arbolerums',nombre:'Magicus Arbolerums',poder:'Hace crecer los árboles frutales',pendiente:true,
     premio:{ropa:'sabates',nombre:'los zapatos con alas'},poderes:['turbo'],
     ingredientes:['Caca de unicornio','Gusano de tierra','Huesos de la cesta de fruta','Savia del árbol azul','Polvo de ala de mariposa'].map(n=>({nombre:n}))},
    {id:'aeolum',nombre:'Aeolum Pogicolum',poder:'Controla el agua y el aire',pendiente:true,
     premio:{ropa:'escombra',nombre:'la escoba'},poderes:['escoba'],
     ingredientes:['Risa de rana','Escamas de pez raro','Agua del lago hasta la raya','Flor de loto','Escarcha'].map(n=>({nombre:n}))},
    {id:'lumus',nombre:'Lumus Controlarum',poder:'Controla la luz',pendiente:true,
     premio:{ropa:'gat',nombre:'el certificado de bruja y el Gato'},poderes:[],
     ingredientes:['Pelo de unicornio','La cosa rara que brilla','Luciérnagas en un bote','Seta luminosa','Cera de la vela'].map(n=>({nombre:n}))}
  ]
};

/* Textos de la historia (la voz del torreón y el Conillet) */
const TXT={
  voz:'La voz del torreón',
  conill:'Conillet',
  bienvenida:['Bruna… te estaba esperando. Te he esperado desde que naciste.',
              'Para volver a casa tendrás que convertirte en bruja. Te enseñaré.',
              'Tu primera tarea: la poción Arcoíris. Sube a la cocina del caldero y lee el libro de conjuros.'],
  hola:['¡Hola, Bruna! Soy Conillet. Te ayudaré con pistas.',
        'Cuando me brille la cola, tengo un mensaje para ti: míralo en tu libreta.',
        'La libreta es el botón de arriba a la izquierda.'],
  leido:'¡Ya sabes qué necesitas! Están dibujados en tu libreta. Si no encuentras algo, pregúntame en el chat.',
  todo:'¡Ya tienes los cinco botes! Vuelve a la cocina y échalos al caldero, uno detrás de otro.',
  hecha:['¡Lo has conseguido, Bruna! La poción Arcoíris ya es tuya.',
         'Ahora puedes llamar al sol y a la lluvia con tu varita.',
         'Y en tu armario te espera un regalo…'],
  regalo:'¡Mira en el armario de tu habitación! Hay algo para ti.',
  fin:'¡Qué bien te queda el sombrero! Prueba la varita y, cuando quieras, vuelve a la sala del trono: la voz tiene otra tarea para ti.',
  // tareas que da la voz en la sala del trono (índice = poción)
  tarea:[null,
    ['Muy bien, Bruna. Ya sabes llamar al sol y a la lluvia.',
     'Ahora aprenderás a dominar las plantas salvajes: la poción Magiculis Parinuris.',
     'Esta vez no basta con recoger: algunas cosas tendrás que ingeniártelas. Lee el libro en la cocina.']],
  felicita:[null,
    ['¡Magnífico! Las plantas ya te obedecen.',
     'Las setas gigantes te harán saltar muy alto y las carnívoras te harán caricias.',
     'En tu armario hay algo nuevo para ti.']],
  construccion:'La siguiente poción todavía está en construcción. ¡Pronto podrás seguir!',
  remover:'Remueve con el dedo: dibuja círculos sobre el caldero',
  // poción 2
  pinzas:'Bruna: «Necesitaría unas pinzas para quitarle un pelo… ¿Dónde he visto yo algo que pellizque?»',
  pistaPinzas:'¿Puede tener boca algo que hace la fotosíntesis? 🌱',
  ratonSigue:'¡El ratón huele el queso y te sigue!',
  babea:'¡Con el calor, la planta babea! Ofrécele el bote, y esquívala cuando se lance.',
  calor:'La planta tiene frío. Quizá con un poco de sol…',
  esquiva:'¡ESQUIVA!',
  fallo:'¡Ñac! La planta te ha echado hasta el ascensor. No pasa nada: inténtalo otra vez.',
  babaOk:'¡La planta ha mordido el bote y lo ha llenado de baba!',
  peloOk:'¡La planta le ha arrancado un pelo al ratón y lo ha escupido!',
  regalo2:'¡Mira otra vez en el armario de tu habitación!',
  fin2:'¡Estás guapísima de bruja! Prueba a saltar encima de una seta gigante del bosque.'
};
TXT.felicita[0]=TXT.hecha;     // la poción 1 usa el texto «hecha»
