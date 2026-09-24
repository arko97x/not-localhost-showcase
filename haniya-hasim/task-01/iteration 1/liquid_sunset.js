/**
 * Dainty Chrome Lava Lamp Sunset Liquid Engine — Mirror Mirror Screensaver
 * Renders small, dainty, aesthetic glossy metallic lava droplets floating vertically
 * on a pure black (#000000) background. Triggers whirlpool vortex transition on face detection.
 */

class SunsetLiquidEngine {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.gl = null;
    this.program = null;
    this.useWebGL = false;
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    // Transition State
    this.swirlAmount = 0.0;
    this.targetSwirl = 0.0;
    this.isSwirling = false;
    this.onSwirlComplete = null;

    this.time = 0;
    this.lastTime = performance.now();
    this.mouse = { x: 0.5, y: 0.5, targetX: 0.5, targetY: 0.5 };

    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());
    window.addEventListener('mousemove', (e) => {
      this.mouse.targetX = e.clientX / window.innerWidth;
      this.mouse.targetY = 1.0 - (e.clientY / window.innerHeight);
    });

    try {
      this.gl = this.canvas.getContext('webgl') || this.canvas.getContext('experimental-webgl');
      if (this.gl) {
        this.initWebGL();
        this.useWebGL = true;
        console.log('[SunsetLiquidEngine]: Dainty Chrome Lava WebGL Shader initialized');
      }
    } catch (e) {
      console.warn('[SunsetLiquidEngine]: WebGL fallback to 2D:', e);
    }

    if (!this.useWebGL) {
      this.ctx2d = this.canvas.getContext('2d');
    }

    this.render = this.render.bind(this);
    requestAnimationFrame(this.render);
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;

    if (this.useWebGL && this.gl) {
      this.gl.viewport(0, 0, this.width, this.height);
    }
  }

  initWebGL() {
    const gl = this.gl;

    const vsSource = `
      attribute vec2 a_position;
      varying vec2 v_uv;
      void main() {
        v_uv = a_position * 0.5 + 0.5;
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    const fsSource = `
      precision highp float;
      varying vec2 v_uv;
      uniform vec2 u_resolution;
      uniform float u_time;
      uniform float u_swirl;
      uniform vec2 u_mouse;

      // Dainty Small Lava Lamp Field (Aspect-Ratio Corrected)
      float lavaField(vec2 p, float t, float aspect) {
        float density = 0.0;

        // Dainty Droplet 1: Small rising droplet (x ~ 0.38)
        float y1 = fract(t * 0.06);
        vec2 pos1 = vec2(0.38 + 0.04 * sin(t * 0.8), y1);
        vec2 d1 = (p - pos1); d1.x *= aspect;
        float stretch1 = 1.0 + 0.25 * sin(t * 2.0);
        d1.y *= stretch1;
        density += 0.0038 / (dot(d1, d1) + 0.001);

        // Dainty Droplet 2: Small falling droplet (x ~ 0.52)
        float y2 = fract(-t * 0.05 + 0.45);
        vec2 pos2 = vec2(0.52 + 0.05 * cos(t * 0.7), y2);
        vec2 d2 = (p - pos2); d2.x *= aspect;
        float stretch2 = 1.0 + 0.25 * cos(t * 1.7);
        d2.y *= stretch2;
        density += 0.0045 / (dot(d2, d2) + 0.0012);

        // Dainty Droplet 3: Medium elegant drop rising (x ~ 0.62)
        float y3 = fract(t * 0.04 + 0.72);
        vec2 pos3 = vec2(0.62 + 0.03 * sin(t * 0.9 + 1.0), y3);
        vec2 d3 = (p - pos3); d3.x *= aspect;
        density += 0.0055 / (dot(d3, d3) + 0.0014);

        // Dainty Droplet 4: Tiny bead detaching (x ~ 0.44)
        float y4 = fract(-t * 0.08 + 0.15);
        vec2 pos4 = vec2(0.44 + 0.03 * cos(t * 1.2), y4);
        vec2 d4 = (p - pos4); d4.x *= aspect;
        density += 0.002 / (dot(d4, d4) + 0.0006);

        // Dainty Droplet 5: Small teardrop rising (x ~ 0.48)
        float y5 = fract(t * 0.07 + 0.22);
        vec2 pos5 = vec2(0.48 + 0.035 * sin(t * 1.1 + 2.5), y5);
        vec2 d5 = (p - pos5); d5.x *= aspect;
        density += 0.0035 / (dot(d5, d5) + 0.0009);

        // Dainty Droplet 6: Second small falling bead (x ~ 0.58)
        float y6 = fract(-t * 0.065 + 0.85);
        vec2 pos6 = vec2(0.58 + 0.04 * sin(t * 0.95), y6);
        vec2 d6 = (p - pos6); d6.x *= aspect;
        density += 0.0028 / (dot(d6, d6) + 0.0008);

        // Mouse interactive dainty droplet
        vec2 posM = vec2(u_mouse.x, u_mouse.y);
        vec2 dM = (p - posM); dM.x *= aspect;
        density += 0.0025 / (dot(dM, dM) + 0.0008);

        return density;
      }

      void main() {
        vec2 uv = v_uv;
        float aspect = u_resolution.x / u_resolution.y;

        // WHIRLPOOL VORTEX TRANSITION MATH
        vec2 center = vec2(0.5, 0.5);
        vec2 st = uv - center;
        st.x *= aspect;

        float dist = length(st);
        float angle = atan(st.y, st.x);

        // Powerful spiraling whirlpool twist
        float whirlpoolTwist = u_swirl * 26.0 * exp(-dist * 1.6);
        angle += whirlpoolTwist;

        // Inward whirlpool suction collapse into central singularity
        dist = mix(dist, pow(dist, 1.4 + u_swirl * 3.8) * (1.0 - u_swirl * 0.9), u_swirl * 0.9);

        vec2 swirledST = vec2(cos(angle), sin(angle)) * dist;
        swirledST.x /= aspect;
        vec2 p = swirledST + center;

        float t = u_time * 0.85;
        float density = lavaField(p, t, aspect);

        // Pure Deep Black Background (#000000)
        vec3 finalColor = vec3(0.0);

        if (density > 1.2) {
          // Compute Surface Normals for Glossy Metallic Chrome Reflections
          float eps = 0.0025;
          float dR = lavaField(p + vec2(eps, 0.0), t, aspect);
          float dL = lavaField(p - vec2(eps, 0.0), t, aspect);
          float dU = lavaField(p + vec2(0.0, eps), t, aspect);
          float dD = lavaField(p - vec2(0.0, eps), t, aspect);

          vec3 normal = normalize(vec3(dL - dR, dD - dU, 0.28));

          // Glossy Chrome Lighting & Specular Reflection
          vec3 lightDir = normalize(vec3(0.65, 0.8, 1.3));
          vec3 viewDir  = vec3(0.0, 0.0, 1.0);
          vec3 halfVector = normalize(lightDir + viewDir);

          float spec = pow(max(0.0, dot(normal, halfVector)), 42.0);
          float fresnel = pow(1.0 - max(0.0, dot(normal, viewDir)), 3.0);

          // Sunset Gradient Palette Mapping across Vertical Axis (p.y)
          vec3 colYellow = vec3(1.0, 0.85, 0.1);  // Glowing Gold Top
          vec3 colOrange = vec3(1.0, 0.38, 0.0);  // Fiery Sunset Orange
          vec3 colCyan   = vec3(0.0, 0.78, 0.98); // Luminous Cyan Center
          vec3 colRed    = vec3(0.96, 0.08, 0.14); // Rich Fiery Ruby Red
          vec3 colViolet = vec3(0.32, 0.08, 0.58); // Deep Violet Blue Base

          float yGrad = clamp(p.y, 0.0, 1.0);
          vec3 liquidBase;

          if (yGrad < 0.25) {
            liquidBase = mix(colViolet, colRed, yGrad / 0.25);
          } else if (yGrad < 0.55) {
            liquidBase = mix(colRed, colCyan, (yGrad - 0.25) / 0.3);
          } else if (yGrad < 0.8) {
            liquidBase = mix(colCyan, colOrange, (yGrad - 0.55) / 0.25);
          } else {
            liquidBase = mix(colOrange, colYellow, (yGrad - 0.8) / 0.2);
          }

          // Metallic Specular Reflection Coating
          vec3 chromeReflection = mix(vec3(0.95, 0.98, 1.0), vec3(1.0, 0.95, 0.75), spec);
          vec3 chromeLiquid = mix(liquidBase, chromeReflection, fresnel * 0.7 + spec * 0.8);

          // Crisp Anti-Aliased Dainty Droplet Edge
          float edgeAlpha = smoothstep(1.2, 1.6, density);
          finalColor = mix(vec3(0.0), chromeLiquid, edgeAlpha);
        }

        // Subtle analog film grain texture
        float grain = (fract(sin(dot(v_uv, vec2(12.9898, 78.233))) * 43758.5453) - 0.5) * 0.02;
        finalColor = max(vec3(0.0), finalColor + grain);

        // Whirlpool Vortex Sinkhole Dissolve
        float collapseFade = 1.0 - smoothstep(0.72, 1.0, u_swirl);
        finalColor *= collapseFade;

        gl_FragColor = vec4(finalColor, 1.0);
      }
    `;

    const createShader = (type, source) => {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('[Shader Error]:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vs = createShader(gl.VERTEX_SHADER, vsSource);
    const fs = createShader(gl.FRAGMENT_SHADER, fsSource);
    if (!vs || !fs) return;

    this.program = gl.createProgram();
    gl.attachShader(this.program, vs);
    gl.attachShader(this.program, fs);
    gl.linkProgram(this.program);

    if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
      console.error('[Program Link Error]:', gl.getProgramInfoLog(this.program));
      return;
    }

    gl.useProgram(this.program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -1, -1,
       1, -1,
      -1,  1,
      -1,  1,
       1, -1,
       1,  1,
    ]), gl.STATIC_DRAW);

    const aPosition = gl.getAttribLocation(this.program, 'a_position');
    gl.enableVertexAttribArray(aPosition);
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

    this.uResolution = gl.getUniformLocation(this.program, 'u_resolution');
    this.uTime = gl.getUniformLocation(this.program, 'u_time');
    this.uSwirl = gl.getUniformLocation(this.program, 'u_swirl');
    this.uMouse = gl.getUniformLocation(this.program, 'u_mouse');
  }

  triggerSwirl(onComplete) {
    if (this.isSwirling) return;
    this.isSwirling = true;
    this.targetSwirl = 1.0;
    this.onSwirlComplete = onComplete;
    console.log('[SunsetLiquidEngine]: Whirlpool Vortex Transition Triggered!');
  }

  resetSwirl() {
    this.swirlAmount = 0.0;
    this.targetSwirl = 0.0;
    this.isSwirling = false;
    this.onSwirlComplete = null;
  }

  render() {
    const now = performance.now();
    const dt = (now - this.lastTime) / 1000;
    this.lastTime = now;
    this.time += dt;

    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.05;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.05;

    if (this.isSwirling) {
      this.swirlAmount += (this.targetSwirl - this.swirlAmount) * (dt * 2.5);
      if (this.swirlAmount >= 0.96) {
        this.swirlAmount = 1.0;
        if (this.onSwirlComplete) {
          const callback = this.onSwirlComplete;
          this.onSwirlComplete = null;
          callback();
        }
      }
    }

    if (this.useWebGL && this.gl && this.program) {
      const gl = this.gl;
      gl.useProgram(this.program);

      gl.uniform2f(this.uResolution, this.width, this.height);
      gl.uniform1f(this.uTime, this.time);
      gl.uniform1f(this.uSwirl, this.swirlAmount);
      gl.uniform2f(this.uMouse, this.mouse.x, this.mouse.y);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
    } else if (this.ctx2d) {
      this.render2d(dt);
    }

    requestAnimationFrame(this.render);
  }

  render2d(dt) {
    const ctx = this.ctx2d;
    const w = this.width;
    const h = this.height;

    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, w, h);

    if (this.swirlAmount >= 0.98) return;

    ctx.save();

    if (this.swirlAmount > 0.01) {
      ctx.translate(w / 2, h / 2);
      ctx.rotate(this.swirlAmount * Math.PI * 6);
      const scale = Math.max(0.01, 1 - this.swirlAmount * 0.92);
      ctx.scale(scale, scale);
      ctx.translate(-w / 2, -h / 2);
      ctx.globalAlpha = Math.max(0, 1 - this.swirlAmount * 1.2);
    }

    const t = this.time * 0.8;
    const centerX = w * 0.5;

    // Draw dainty 2D vertical lava droplets
    const drops = [
      { x: centerX - 60, y: ((t * 60) % (h + 100)) - 50, r: 18 },
      { x: centerX + 40, y: (h + 50 - ((t * 50) % (h + 100))), r: 22 },
      { x: centerX - 20, y: (((t * 40) + 300) % (h + 100)) - 50, r: 25 },
      { x: centerX + 80, y: ((t * 70 + 150) % (h + 100)) - 50, r: 14 }
    ];

    const gradient = ctx.createLinearGradient(0, 0, 0, h);
    gradient.addColorStop(0.0, '#FFD000');
    gradient.addColorStop(0.3, '#FF6B00');
    gradient.addColorStop(0.6, '#00C6FF');
    gradient.addColorStop(0.85, '#E6122B');
    gradient.addColorStop(1.0, '#280852');

    ctx.fillStyle = gradient;

    drops.forEach((d) => {
      ctx.beginPath();
      ctx.arc(d.x + Math.sin(d.y * 0.02 + t) * 15, d.y, d.r, 0, Math.PI * 2);
      ctx.shadowColor = 'rgba(0, 198, 255, 0.6)';
      ctx.shadowBlur = 18;
      ctx.fill();
    });

    ctx.restore();
  }
}

if (typeof window !== 'undefined') {
  window.SunsetLiquidEngine = SunsetLiquidEngine;
}
