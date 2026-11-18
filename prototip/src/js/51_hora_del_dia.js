/* =====================================================================
   LUZ SEGÚN LA HORA REAL (encàrrec v.1, 2.4)
   La luz de fuera depende de la hora del dispositivo, con transiciones suaves entre franjas:
     22:00–6:00 noche (la de siempre: azul-lila, luna, estrellas, luciérnagas, ventana del torreón encendida)
     6:00–7:30 amanecer (rosado) · 7:30–19:30 día · 19:30–21:00 atardecer (naranja) · 21:00–22:00 anochecer
   Cada paleta tiene un punto de referencia; entre dos puntos se mezcla poco a poco.
   La luz de día NO es más fuerte que la de noche (si no, lo blanco —el unicornio, el camino— se «quema»):
   el día se nota en los colores (cielo azul, luz neutra), con la suma de luces por debajo de 1.
   Para probar: ?hora=21.5 en la URL (o window.__j.setHour(21.5); null vuelve a la hora real).
   ===================================================================== */
const PALS={
  night:{bg:'#40398f',fog:'#7667c2',sky:['#d6b0f6','#8f80e2','#3d368c'],hemi:['#c4b6ff','#8a9a66',1.0],sun:['#ffe2f2',0.5],stars:0.85,moon:1,flies:1,win:0.5,pts:1},
  dawn:{bg:'#b48ac8',fog:'#e6a8c0',sky:['#ffd2b0','#f0a2c4','#8070c4'],hemi:['#f4d4e2','#8a9a6a',0.78],sun:['#ffc8a0',0.45],stars:0.2,moon:0.35,flies:0.35,win:0.3,pts:0.6},
  day:{bg:'#8ec4ee',fog:'#bcdcf2',sky:['#f2f8ff','#b4d8f6','#6ca4e6'],hemi:['#dde6f6','#7f9a5c',0.72],sun:['#fff0dc',0.42],stars:0,moon:0,flies:0.06,win:0,pts:0.15},
  sunset:{bg:'#9a68b0',fog:'#e89a9c',sky:['#ffc488','#f2869c','#6e56ac'],hemi:['#f0ccc0','#8a9462',0.8],sun:['#ffb880',0.45],stars:0.15,moon:0.3,flies:0.5,win:0.35,pts:0.8},
  dusk:{bg:'#4c4396',fog:'#8674c4',sky:['#dcb0ec','#9282dc','#423a92'],hemi:['#c8b8f6','#8a9a66',1.0],sun:['#ffd8e8',0.55],stars:0.6,moon:0.85,flies:0.85,win:0.45,pts:1}
};
// [hora, paleta]: la luz es exactamente esa paleta en esa hora y se mezcla con la siguiente
const DAYK=[[0,'night'],[6,'night'],[6.75,'dawn'],[7.5,'day'],[19.5,'day'],[20.25,'sunset'],[21.25,'dusk'],[22,'night'],[24,'night']];
const DAY={force:null,hour:0,pal:null};
{const m=/[?&]hora=([\d.]+)/.exec(location.search);if(m)DAY.force=+m[1]%24;}
function realHour(){const d=new Date();return d.getHours()+d.getMinutes()/60+d.getSeconds()/3600;}
const _ca=new THREE.Color(),_cb=new THREE.Color();
function mixPal(h){
  let i=0;while(i<DAYK.length-2&&h>=DAYK[i+1][0])i++;
  const [h0,a]=DAYK[i],[h1,b]=DAYK[i+1],u=smooth(0,1,h1>h0?(h-h0)/(h1-h0):0),A=PALS[a],B=PALS[b];
  const c=(x,y)=>'#'+_ca.set(x).lerp(_cb.set(y),u).getHexString(),n=(x,y)=>x+(y-x)*u;
  return {bg:c(A.bg,B.bg),fog:c(A.fog,B.fog),sky:A.sky.map((x,k)=>c(x,B.sky[k])),hemi:[c(A.hemi[0],B.hemi[0]),c(A.hemi[1],B.hemi[1]),n(A.hemi[2],B.hemi[2])],
    sun:[c(A.sun[0],B.sun[0]),n(A.sun[1],B.sun[1])],stars:n(A.stars,B.stars),moon:n(A.moon,B.moon),flies:n(A.flies,B.flies),win:n(A.win,B.win),pts:n(A.pts,B.pts)};
}
// partes del cielo (06_bosque_cielo_setas_rocas.js): esfera con degradado, estrellas, luna y su halo
const SKY={dome:sky.children[0],stars:sky.children[1],moon:sky.children[2],moonHalo:sky.children[3],key:''};
SKY.moon.material.transparent=true;
function paintSky(cols){const key=cols.join();if(key===SKY.key)return;SKY.key=key;
  const g=SKY.dome.geometry,p=g.attributes.position,col=g.attributes.color,c=new THREE.Color(),c1=new THREE.Color(cols[0]),c2=new THREE.Color(cols[1]),c3=new THREE.Color(cols[2]);
  for(let i=0;i<p.count;i++){const t=clamp(p.getY(i)/190,-0.2,1);if(t<0.22)c.copy(c1).lerp(c2,smooth(0,0.22,t));else c.copy(c2).lerp(c3,smooth(0.22,0.8,t));col.setXYZ(i,c.r,c.g,c.b);}
  col.needsUpdate=true;}
let dayT=99;
function dayStep(dt){
  dayT+=dt;if(dayT<0.25)return;dayT=0;              // cuatro veces por segundo es más que suficiente
  const h=DAY.force!==null?DAY.force:realHour();DAY.hour=h;const P=DAY.pal=mixPal(h);
  scene.background.set(P.bg);FOGC.set(P.fog);scene.fog.color.copy(FOGC);paintSky(P.sky);
  // la luz de fuera la aplica towerAnim (50_juego.js) a partir de LIGHTS: se cambian los valores de fuera y de la terraza
  [LIGHTS.out,LIGHTS[3]].forEach(L=>{L[2]=P.hemi[0];L[3]=P.hemi[1];L[4]=P.hemi[2];});
  // las luces cálidas de fuera (ventanas, farolillos) casi no se notan de día
  LIGHTS.out[0][4]=0.55*P.pts;LIGHTS.out[1][4]=0.2*P.pts;LIGHTS[3][0][4]=0.6*P.pts;LIGHTS[3][1][4]=0.6*P.pts;
  sun.color.set(P.sun[0]);sun.intensity=P.sun[1];
  SKY.stars.material.opacity=P.stars;SKY.stars.visible=P.stars>0.01;SKY.moon.material.opacity=P.moon;SKY.moon.visible=P.moon>0.01;SKY.moonHalo.material.opacity=0.5*P.moon;
  flies.p.material.opacity=P.flies;flies.p.visible=P.flies>0.02;winL.intensity=P.win;
}
Object.assign(window.__j,{DAY,dayStep,mixPal,setHour:h=>{DAY.force=h===null?null:h%24;dayT=99;dayStep(0);}});
