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
    {id:'parinuris',nombre:'Magiculis Parinuris',poder:'Domina las plantas salvajes',pendiente:true,
     premio:{ropa:'vestit',nombre:'el vestido de bruja'},poderes:['setas'],
     ingredientes:['Baba de planta carnívora','Pelo de ratón','Polen de las flores','Musgo de las rocas','Mariquita de siete puntos'].map(n=>({nombre:n}))},
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
  fin:'¡Qué bien te queda el sombrero! La poción 2 está en construcción. Mientras tanto, prueba la varita.'
};
