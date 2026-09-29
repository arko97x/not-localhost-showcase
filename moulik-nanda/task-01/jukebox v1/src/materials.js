// 3D Materials and Shaders for the Low-Poly DVD Holder & Discs
import * as THREE from 'three';

// Procedural texture for the physical label sticker on the wallet front cover
export function createWalletLabelTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 180;
  const ctx = canvas.getContext('2d');

  // Brushed aluminum / silver metallic sticker background
  const grad = ctx.createLinearGradient(0, 0, 512, 180);
  grad.addColorStop(0, '#bcc5cf');
  grad.addColorStop(0.3, '#e2e7ec');
  grad.addColorStop(0.7, '#9ea9b5');
  grad.addColorStop(1, '#7a8591');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 180);

  // Sticker dark border & corner notches
  ctx.strokeStyle = '#34495e';
  ctx.lineWidth = 6;
  ctx.strokeRect(6, 6, 500, 168);

  // Inner black embossed frame
  ctx.fillStyle = '#0f171e';
  ctx.fillRect(18, 18, 476, 144);

  // Pixel/Monospace typography: "DISCMAN '04" and "15-DISC WALLET"
  ctx.fillStyle = '#00f0ff';
  ctx.font = 'bold 44px "Courier New", "Consolas", monospace';
  ctx.textAlign = 'center';
  ctx.fillText("DISCMAN '04", 256, 75);

  ctx.fillStyle = '#e0f8ff';
  ctx.font = 'bold 26px "Courier New", "Consolas", monospace';
  ctx.letterSpacing = '3px';
  ctx.fillText("15-DISC WALLET", 256, 115);

  // Tiny serial / specs in bottom right
  ctx.fillStyle = '#576574';
  ctx.font = '14px monospace';
  ctx.fillText("MODEL: DW-15X • OPTICAL MEDIA STORAGE", 256, 145);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// Procedural texture for the non-woven cloth sleeve backing
export function createNonWovenFabricTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  // Base soft white/off-white cloth
  ctx.fillStyle = '#f0f3f5';
  ctx.fillRect(0, 0, 256, 256);

  // Classic diamond dimpled pattern of non-woven polypropylene
  ctx.fillStyle = '#dcdfe3';
  const size = 12;
  for (let y = 0; y < 256; y += size) {
    for (let x = 0; x < 256; x += size) {
      const offsetX = (y / size) % 2 === 0 ? 0 : size / 2;
      ctx.beginPath();
      ctx.arc((x + offsetX) % 256, y, 2.2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Soft noise for fabric fiber feel
  const imgData = ctx.getImageData(0, 0, 256, 256);
  const data = imgData.data;
  for (let i = 0; i < data.length; i += 4) {
    const noise = (Math.random() - 0.5) * 12;
    data[i] = Math.min(255, Math.max(0, data[i] + noise));
    data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise));
    data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise));
  }
  ctx.putImageData(imgData, 0, 0);

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(4, 4);
  return tex;
}

// Procedural zipper teeth bump texture
export function createZipperTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 16;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#1c242c';
  ctx.fillRect(0, 0, 128, 16);

  // Alternating metal zipper teeth with icy sheen
  ctx.fillStyle = '#7a92a3';
  for (let x = 0; x < 128; x += 8) {
    ctx.fillRect(x, 1, 4, 14);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(10, 1);
  return tex;
}

// Custom iridescent shader for the optical data side of CDs/DVDs
export function createIridescentDiscMaterial() {
  const customMaterial = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uLightPos: { value: new THREE.Vector3(5, 10, 5) }
    },
    vertexShader: `
      varying vec3 vNormal;
      varying vec3 vViewPosition;
      varying vec2 vUv;
      varying vec3 vWorldPosition;

      void main() {
        vUv = uv;
        vNormal = normalize(normalMatrix * normal);
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        vViewPosition = -mvPosition.xyz;
        vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      uniform float uTime;
      uniform vec3 uLightPos;
      varying vec3 vNormal;
      varying vec3 vViewPosition;
      varying vec2 vUv;
      varying vec3 vWorldPosition;

      // Rainbow spectrum mapping function
      vec3 rainbow(float t) {
        return 0.5 + 0.5 * cos(6.28318 * (t + vec3(0.0, 0.33, 0.67)));
      }

      void main() {
        vec3 N = normalize(vNormal);
        vec3 V = normalize(vViewPosition);
        vec3 L = normalize(uLightPos - vWorldPosition);

        // CD groove diffraction: radial distance angle
        vec2 p = vUv - vec2(0.5);
        float dist = length(p);
        float angle = atan(p.y, p.x);

        // Clamping hub / clear hole
        if (dist < 0.08) {
          discard;
        }

        // Hub ring
        if (dist < 0.16) {
          gl_FragColor = vec4(0.85, 0.9, 0.95, 0.35);
          return;
        }

        // Anisotropic diffraction grating effect
        vec3 tangent = normalize(vec3(-p.y, 0.0, p.x));
        float VdotT = dot(V, tangent);
        float LdotT = dot(L, tangent);
        float diffraction = abs(VdotT - LdotT);

        // Base metallic silver reflection
        float NdotV = max(0.0, dot(N, V));
        float fresnel = pow(1.0 - NdotV, 3.0);
        vec3 baseSilver = vec3(0.75, 0.78, 0.82) * (0.6 + 0.4 * dot(N, L));

        // Spectral rainbow color from grating
        float shift = fract(diffraction * 3.5 + dist * 2.0);
        vec3 rainbowColor = rainbow(shift) * 1.35;

        // Combine silver with brilliant holographic rainbow sheen
        vec3 finalColor = mix(baseSilver, rainbowColor, 0.65) + vec3(fresnel * 0.4);
        
        // Specular glint
        vec3 H = normalize(L + V);
        float spec = pow(max(0.0, dot(N, H)), 32.0);
        finalColor += vec3(spec * 0.8);

        gl_FragColor = vec4(finalColor, 1.0);
      }
    `,
    side: THREE.DoubleSide
  });

  return customMaterial;
}

// Procedural soft contact shadow texture
export function createContactShadowTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  const grad = ctx.createRadialGradient(128, 128, 20, 128, 128, 120);
  grad.addColorStop(0, 'rgba(0, 0, 0, 0.75)');
  grad.addColorStop(0.5, 'rgba(0, 0, 0, 0.35)');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 256);

  const tex = new THREE.CanvasTexture(canvas);
  return tex;
}
