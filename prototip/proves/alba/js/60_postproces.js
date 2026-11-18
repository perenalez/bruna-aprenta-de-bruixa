/* =====================================================================
   POSTPROCESO — desenfoque tipo «tilt-shift», gradación cálida, viñeta
   ---------------------------------------------------------------------
   La escena se pinta en una textura (con antialiasing multisample si
   hay WebGL2) y un quad a pantalla completa aplica:
     · desenfoque arriba (fondo) y un poco abajo (primer plano) según la
       altura en pantalla: es lo que da el aire «maqueta» de Alba;
     · saturación +10 % y tono cálido; · viñeta suave.
   Sin EffectComposer: r128 no lo trae en el núcleo y así no hay
   dependencias. post.render(scene, camera) sustituye a renderer.render.
   ===================================================================== */
function crearPostproces(renderer, o = {}) {
  const size = new THREE.Vector2();
  const ms = renderer.capabilities.isWebGL2 && THREE.WebGLMultisampleRenderTarget;
  const rt = ms ? new THREE.WebGLMultisampleRenderTarget(1, 1, { format: THREE.RGBAFormat }) : new THREE.WebGLRenderTarget(1, 1, { format: THREE.RGBAFormat });
  if (ms) rt.samples = o.samples ?? 4;
  const U = {
    tDiffuse: { value: rt.texture }, res: { value: new THREE.Vector2(1, 1) },
    focusY: { value: o.focusY ?? .45 }, blur: { value: o.blur ?? 1 }, sat: { value: o.sat ?? 1.1 },
    warm: { value: new THREE.Vector3(1.03, 1.0, .96) }, vig: { value: o.vig ?? .5 },
  };
  const mat = new THREE.ShaderMaterial({
    uniforms: U, depthTest: false, depthWrite: false,
    vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0., 1.); }',
    fragmentShader: `uniform sampler2D tDiffuse; uniform vec2 res; uniform float focusY, blur, sat, vig; uniform vec3 warm; varying vec2 vUv;
      void main(){
        vec2 uv = vUv; vec4 col = texture2D(tDiffuse, uv);
        float d = uv.y > focusY ? (uv.y - focusY) * 1.15 : (focusY - uv.y) * .8;
        float b = smoothstep(.22, .62, d) * blur;
        if (b > .01) {
          vec4 acc = col; float w = 1.;
          for (int i = 0; i < 14; i++) { float fi = float(i); float a = fi * 2.39996; float r = sqrt(fi + .5) / 3.8;
            acc += texture2D(tDiffuse, uv + vec2(cos(a), sin(a)) * r * b * vec2(res.y / res.x, 1.) * .011); w += 1.; }
          col = acc / w;
        }
        vec3 c = col.rgb; float l = dot(c, vec3(.299, .587, .114));
        c = mix(vec3(l), c, sat) * warm;
        vec2 q = uv - .5; c *= 1. - dot(q, q) * vig;
        gl_FragColor = vec4(c, 1.);
      }`,
  });
  const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), mat); quad.frustumCulled = false;
  const qs = new THREE.Scene(); qs.add(quad);
  const qc = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  function setSize() { renderer.getDrawingBufferSize(size); rt.setSize(size.x, size.y); U.res.value.copy(size); }
  setSize();
  return {
    uniforms: U, setSize, enabled: true,
    render(scene, camera) {
      if (!this.enabled) { renderer.setRenderTarget(null); renderer.render(scene, camera); return; }
      renderer.setRenderTarget(rt); renderer.render(scene, camera);
      renderer.setRenderTarget(null); renderer.render(qs, qc);
    },
  };
}
