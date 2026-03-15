/**
 * animation.js
 * Three.js sphere animation — rotating bumpy glowing Points sphere.
 * Called from page.tsx via: initAnimation()
 * Requires window.THREE to be available (loaded via CDN before this runs).
 */

export function initAnimation() {
  if (typeof window === "undefined" || !window.THREE) return;

  const THREE = window.THREE;

  const canvas = document.getElementById("bg-canvas");
  if (!canvas) return;

  // Prevent double-init
  if (canvas._threeInitialized) return;
  canvas._threeInitialized = true;

  // ── Renderer ──────────────────────────────────────────────────────────────
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: false,
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.setSize(window.innerWidth, window.innerHeight);

  // ── Scene / Camera ────────────────────────────────────────────────────────
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );
  camera.position.z = 4.5;

  // ── Shaders ───────────────────────────────────────────────────────────────
  const vertexShader = /* glsl */ `
    uniform float uTime;
    attribute float aScale;
    varying vec3 vPosition;
    varying float vDistortion;

    // Classic 3-D Simplex noise helpers (compact version)
    vec3 mod289(vec3 x) { return x - floor(x * (1.0/289.0)) * 289.0; }
    vec4 mod289(vec4 x) { return x - floor(x * (1.0/289.0)) * 289.0; }
    vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
    vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

    float snoise(vec3 v) {
      const vec2 C = vec2(1.0/6.0, 1.0/3.0);
      const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
      vec3 i  = floor(v + dot(v, C.yyy));
      vec3 x0 = v - i + dot(i, C.xxx);
      vec3 g = step(x0.yzx, x0.xyz);
      vec3 l = 1.0 - g;
      vec3 i1 = min(g.xyz, l.zxy);
      vec3 i2 = max(g.xyz, l.zxy);
      vec3 x1 = x0 - i1 + C.xxx;
      vec3 x2 = x0 - i2 + C.yyy;
      vec3 x3 = x0 - D.yyy;
      i = mod289(i);
      vec4 p = permute(permute(permute(
        i.z + vec4(0.0, i1.z, i2.z, 1.0))
        + i.y + vec4(0.0, i1.y, i2.y, 1.0))
        + i.x + vec4(0.0, i1.x, i2.x, 1.0));
      float n_ = 0.142857142857;
      vec3 ns = n_ * D.wyz - D.xzx;
      vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
      vec4 x_ = floor(j * ns.z);
      vec4 y_ = floor(j - 7.0 * x_);
      vec4 x  = x_ * ns.x + ns.yyyy;
      vec4 y  = y_ * ns.x + ns.yyyy;
      vec4 h  = 1.0 - abs(x) - abs(y);
      vec4 b0 = vec4(x.xy, y.xy);
      vec4 b1 = vec4(x.zw, y.zw);
      vec4 s0 = floor(b0) * 2.0 + 1.0;
      vec4 s1 = floor(b1) * 2.0 + 1.0;
      vec4 sh = -step(h, vec4(0.0));
      vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
      vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
      vec3 p0 = vec3(a0.xy, h.x);
      vec3 p1 = vec3(a0.zw, h.y);
      vec3 p2 = vec3(a1.xy, h.z);
      vec3 p3 = vec3(a1.zw, h.w);
      vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
      p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
      vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
      m = m * m;
      return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
    }

    void main() {
      vPosition = position;

      // Bumpy distortion using simplex noise
      float noise = snoise(position * 1.6 + vec3(0.0, 0.0, uTime * 0.18));
      float distortion = noise * 0.14;
      vDistortion = distortion;

      vec3 newPosition = position + normalize(position) * distortion;

      vec4 mvPosition = modelViewMatrix * vec4(newPosition, 1.0);
      gl_PointSize = aScale * (160.0 / -mvPosition.z);
      gl_Position = projectionMatrix * mvPosition;
    }
  `;

  const fragmentShader = /* glsl */ `
    uniform float uTime;
    varying vec3 vPosition;
    varying float vDistortion;

    void main() {
      // Circular soft point
      vec2 uv = gl_PointCoord - 0.5;
      float dist = length(uv);
      if (dist > 0.5) discard;

      float alpha = 1.0 - smoothstep(0.1, 0.5, dist);

      // Colour — cyan core fading to deep blue
      float t = clamp(vDistortion * 3.0 + 0.5, 0.0, 1.0);
      vec3 colA = vec3(0.04, 0.72, 0.85);   // #06b6d4 cyan
      vec3 colB = vec3(0.12, 0.15, 0.62);   // deep indigo
      vec3 col  = mix(colB, colA, t);

      // Pulse glow
      float glow = sin(uTime * 0.9 + vPosition.x * 3.14) * 0.15 + 0.85;
      col *= glow;

      gl_FragColor = vec4(col, alpha * 0.45);
    }
  `;

  // ── Geometry ──────────────────────────────────────────────────────────────
  const COUNT = 4000;
  const geo = new THREE.BufferGeometry();
  const positions = new Float32Array(COUNT * 3);
  const scales = new Float32Array(COUNT);

  for (let i = 0; i < COUNT; i++) {
    // Fibonacci sphere distribution
    const phi = Math.acos(1 - (2 * (i + 0.5)) / COUNT);
    const theta = Math.PI * (1 + Math.sqrt(5)) * i;
    positions[i * 3]     = Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = Math.cos(phi);
    scales[i] = Math.random() * 0.9 + 0.4;
  }

  geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geo.setAttribute("aScale",   new THREE.BufferAttribute(scales, 1));

  // ── Material ──────────────────────────────────────────────────────────────
  const uniforms = {
    uTime: { value: 0 },
  };

  const mat = new THREE.ShaderMaterial({
    uniforms,
    vertexShader,
    fragmentShader,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  const sphere = new THREE.Points(geo, mat);
  scene.add(sphere);

  // ── Mouse parallax ───────────────────────────────────────────────────────
  let mouseX = 0, mouseY = 0;
  const onMouseMove = (e) => {
    mouseX = (e.clientX / window.innerWidth  - 0.5) * 0.6;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 0.6;
  };
  window.addEventListener("mousemove", onMouseMove);

  // ── Resize ────────────────────────────────────────────────────────────────
  const onResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  };
  window.addEventListener("resize", onResize);

  // ── Animation loop ────────────────────────────────────────────────────────
  let frameId;
  const clock = new THREE.Clock();

  const animate = () => {
    frameId = requestAnimationFrame(animate);
    const elapsed = clock.getElapsedTime();

    uniforms.uTime.value = elapsed;

    sphere.rotation.y = elapsed * 0.06 + mouseX * 0.4;
    sphere.rotation.x = elapsed * 0.025 + mouseY * 0.3;

    renderer.render(scene, camera);
  };
  animate();

  // ── Cleanup helper (called on component unmount) ──────────────────────────
  return () => {
    cancelAnimationFrame(frameId);
    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("resize", onResize);
    renderer.dispose();
    canvas._threeInitialized = false;
  };
}
