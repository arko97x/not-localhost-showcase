// =============================================================================
// SPECULATIVE ARCHIVE — ENGINE & INTERACTIVE EXPERIENCES
// Minimalist Editorial Showcase & Live Prototype Flip Book
// =============================================================================

import { PROJECTS } from './data.js';

// Global Application State
const state = {
  currentMode: 'pins', // 'pins' | 'book'
  currentIndex: 0,
  soundEnabled: true,
  audioCtx: null,
  activeInteractiveCleanup: null,
  glimpseAnimId: null,
};

// =============================================================================
// AUDIO SUBSYSTEM: Minimalist Mechanical & Acoustic Ticks
// =============================================================================

function initAudio() {
  if (!state.audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      state.audioCtx = new AudioContext();
    }
  }
  if (state.audioCtx && state.audioCtx.state === 'suspended') {
    state.audioCtx.resume();
  }
}

function playMechanicalTick(type = 'click') {
  if (!state.soundEnabled) return;
  try {
    initAudio();
    if (!state.audioCtx) return;
    const ctx = state.audioCtx;
    const now = ctx.currentTime;

    if (type === 'click') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1200, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.035);
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.035);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.035);
    } else if (type === 'page') {
      // Soft mechanical flip
      const bufferSize = ctx.sampleRate * 0.05;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1800, now);
      filter.Q.setValueAtTime(3.0, now);
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start(now);
    }
  } catch (e) {
    // Audio context may require explicit user gesture
  }
}

// =============================================================================
// VIEW MANAGEMENT: Switch Between Pinned Overview & Flip Book Spread
// =============================================================================

const pinsView = document.getElementById('pinsView');
const bookView = document.getElementById('bookView');
const btnModePins = document.getElementById('btnModePins');
const btnModeBook = document.getElementById('btnModeBook');
const btnLogo = document.getElementById('btnLogo');
const btnCloseBook = document.getElementById('btnCloseBook');
const btnPrevPage = document.getElementById('btnPrevPage');
const btnNextPage = document.getElementById('btnNextPage');
const btnAudioToggle = document.getElementById('btnAudioToggle');

function switchView(mode, targetIndex = state.currentIndex) {
  state.currentMode = mode;
  playMechanicalTick('page');

  if (mode === 'pins') {
    pinsView.classList.add('active-view');
    bookView.classList.remove('active-view');
    btnModePins.classList.add('active');
    btnModeBook.classList.remove('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (state.activeInteractiveCleanup) {
      state.activeInteractiveCleanup();
      state.activeInteractiveCleanup = null;
    }
  } else {
    pinsView.classList.remove('active-view');
    bookView.classList.add('active-view');
    btnModePins.classList.remove('active');
    btnModeBook.classList.add('active');
    renderSpread(targetIndex);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

// =============================================================================
// VIEW 1: PINNED OVERVIEW GRID & PROCEDURAL GLIMPSES
// =============================================================================

const pinsGrid = document.getElementById('pinsGrid');
const glimpseCanvases = [];

function renderPinsGrid() {
  pinsGrid.innerHTML = '';
  glimpseCanvases.length = 0;

  PROJECTS.forEach((proj, idx) => {
    const card = document.createElement('article');
    card.className = 'pin-card';
    card.setAttribute('data-index', idx);
    card.innerHTML = `
      <div class="card-top">
        <span class="card-index">${proj.index}</span>
        <span class="card-category">${proj.category}</span>
      </div>
      <div class="card-title-group">
        <h3 class="card-title">${proj.title}</h3>
        <p class="card-author">by @${proj.handle}</p>
      </div>
      <div class="card-glimpse-box">
        <canvas class="card-glimpse-canvas" id="glimpseCanvas_${idx}"></canvas>
      </div>
      <div class="card-bottom">
        <span class="card-metric">${proj.glimpse.metric}</span>
        <span class="card-action-hint">Open Spread ↗</span>
      </div>
    `;

    card.addEventListener('click', () => {
      playMechanicalTick('click');
      switchView('book', idx);
    });

    pinsGrid.appendChild(card);
  });

  // Setup glimpse canvas renderers
  requestAnimationFrame(() => {
    setupGlimpseCanvases();
  });
}

function setupGlimpseCanvases() {
  PROJECTS.forEach((proj, idx) => {
    const canvas = document.getElementById(`glimpseCanvas_${idx}`);
    if (canvas) {
      const rect = canvas.parentElement.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = (rect.width || 340) * dpr;
      canvas.height = (rect.height || 140) * dpr;
      const ctx = canvas.getContext('2d');
      ctx.scale(dpr, dpr);
      glimpseCanvases.push({
        canvas,
        ctx,
        type: proj.glimpse.type,
        width: rect.width || 340,
        height: rect.height || 140,
        proj,
      });
    }
  });

  startGlimpseLoop();
}

let glimpseTick = 0;
function startGlimpseLoop() {
  if (state.glimpseAnimId) cancelAnimationFrame(state.glimpseAnimId);

  function loop() {
    if (state.currentMode === 'pins') {
      glimpseTick += 0.025;
      glimpseCanvases.forEach((item, i) => {
        drawGlimpse(item, glimpseTick + i * 2);
      });
    }
    state.glimpseAnimId = requestAnimationFrame(loop);
  }
  state.glimpseAnimId = requestAnimationFrame(loop);
}

function drawGlimpse(item, t) {
  const { ctx, width, height, type } = item;
  ctx.fillStyle = '#060606';
  ctx.fillRect(0, 0, width, height);

  // Subtle background coordinate grid
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
  ctx.lineWidth = 1;
  const step = 20;
  ctx.beginPath();
  for (let x = 0; x < width; x += step) {
    ctx.moveTo(x, 0); ctx.lineTo(x, height);
  }
  for (let y = 0; y < height; y += step) {
    ctx.moveTo(0, y); ctx.lineTo(width, y);
  }
  ctx.stroke();

  // =========================================================================
  // 01: FREEING THE PARROT (msup96/Freeing_The_Parrot)
  // Physical-digital installation: Mechanical parrot in a ring/cage listening to
  // handwritten confessions, outputting a thermal Mirror Report tape.
  // =========================================================================
  if (type === 'parrot_cage') {
    const cx = 75;
    const cy = height / 2;

    // Perch Ring / Cage
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(cx, cy, 42, -Math.PI * 0.85, Math.PI * 0.85);
    ctx.stroke();

    // Cage top hook
    ctx.beginPath();
    ctx.moveTo(cx, cy - 42);
    ctx.lineTo(cx, 12);
    ctx.arc(cx - 5, 12, 5, 0, Math.PI);
    ctx.stroke();

    // Wooden Perch bar
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(cx - 30, cy + 12);
    ctx.lineTo(cx + 30, cy + 12);
    ctx.stroke();

    // Stylized Mechanical Parrot Silhouette
    const headBob = Math.sin(t * 1.6) * 3;
    const tilt = Math.sin(t * 1.2) * 0.1;
    ctx.save();
    ctx.translate(cx, cy + 10);
    ctx.rotate(tilt);

    // Parrot body & wings
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(0, -10, 10, 16, 0.2, 0, Math.PI * 2);
    ctx.fill();

    // Long tail feathers
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-4, 4);
    ctx.lineTo(-12, 34 + Math.sin(t * 2) * 2);
    ctx.moveTo(2, 4);
    ctx.lineTo(-4, 38 + Math.cos(t * 2) * 2);
    ctx.stroke();

    // Parrot head
    ctx.beginPath();
    ctx.arc(5, -28 + headBob, 8, 0, Math.PI * 2);
    ctx.fill();

    // Hooked beak
    ctx.fillStyle = '#cbd5e1';
    ctx.beginPath();
    ctx.moveTo(11, -29 + headBob);
    ctx.lineTo(19, -26 + headBob);
    ctx.lineTo(12, -22 + headBob);
    ctx.closePath();
    ctx.fill();

    // Glowing AI eye LED (blinks green/cyan)
    const eyeBlink = Math.sin(t * 3) > 0.92 ? 0.2 : 1;
    ctx.fillStyle = `rgba(56, 189, 248, ${eyeBlink})`;
    ctx.beginPath();
    ctx.arc(7, -30 + headBob, 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();

    // Audio acoustic pulse waves traveling into parrot
    for (let w = 1; w <= 3; w++) {
      const wRadius = ((t * 25 + w * 20) % 60) + 10;
      const alpha = Math.max(0, 1 - wRadius / 70);
      ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.4})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(cx, cy - 15, wRadius, -0.6, 0.6);
      ctx.stroke();
    }

    // Right Side: Thermal Confession Tape & Mirror Report
    const rx = 150;
    const rw = width - rx - 16;
    const ry = 18;
    const rh = height - 36;

    // Receipt Paper
    ctx.fillStyle = '#0d0d0d';
    ctx.fillRect(rx, ry, rw, rh);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.strokeRect(rx, ry, rw, rh);

    // Tape serrated top
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    for (let sx = rx + 4; sx < rx + rw - 4; sx += 8) {
      ctx.fillRect(sx, ry - 2, 4, 2);
    }

    // Monospace Receipt lines
    ctx.font = '9px "JetBrains Mono", monospace';
    ctx.fillStyle = '#38bdf8';
    ctx.fillText('> CONFESSION INPUT:', rx + 8, ry + 16);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.fillText('"I feel replaceable..."', rx + 8, ry + 30);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.fillText('---------------------', rx + 8, ry + 42);

    ctx.fillStyle = '#4ade80';
    ctx.fillText('NAVARASA: KARUNA 84%', rx + 8, ry + 56);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.fillText('MIRROR REPORT #402', rx + 8, ry + 70);

    // Live printing animation pulse
    const printIndicator = Math.floor(t * 3) % 2 === 0 ? '█' : ' ';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`PRINTING REC${printIndicator}`, rx + 8, ry + 84);
  }

  // =========================================================================
  // 02: THE SCRIBBLER (itsniko18/The-Scribbler)
  // Medieval envelope/letter with cursive calligraphy, human motor errors,
  // wax seal, and anti-surveillance OCR evasion.
  // =========================================================================
  else if (type === 'medieval_letter') {
    const lx = 20;
    const ly = 16;
    const lw = width - 40;
    const lh = height - 32;

    // Parchment Letter Card
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(lx, ly, lw, lh);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 1;
    ctx.strokeRect(lx, ly, lw, lh);

    // Envelope flap fold line
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.beginPath();
    ctx.moveTo(lx, ly);
    ctx.lineTo(lx + lw / 2, ly + 26);
    ctx.lineTo(lx + lw, ly);
    ctx.stroke();

    // Wax Seal in corner
    const wx = lx + lw - 26;
    const wy = ly + lh - 24;
    ctx.fillStyle = 'rgba(220, 38, 38, 0.85)';
    ctx.beginPath();
    ctx.arc(wx, wy, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#f87171';
    ctx.stroke();
    // Sigil inside wax seal
    ctx.font = '11px serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('☩', wx - 5, wy + 4);

    // Top Header: Anti-OCR Status
    ctx.font = '8.5px "JetBrains Mono", monospace';
    ctx.fillStyle = '#4ade80';
    ctx.fillText('OCR EVADED: 0% MACHINE CONFIDENCE', lx + 10, ly + 18);

    // Dynamic Cursive Calligraphy stroke
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.8;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const textBaselineY = ly + 46;
    ctx.beginPath();

    // Animated handwritten cursive flourish
    const points = 40;
    const drawCount = Math.min(points, Math.floor((t * 25) % (points + 15)));

    for (let p = 0; p < drawCount; p++) {
      const px = lx + 14 + p * 6;
      const wave = Math.sin(p * 0.45) * 8;
      const loop = (p % 6 === 0) ? -12 : (p % 4 === 0) ? 6 : 0;
      const tremor = Math.sin(p * 3.2 + t * 4) * 2;
      const py = textBaselineY + wave + loop + tremor;
      if (p === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    // Quill pen tip drawing in real time
    if (drawCount < points && drawCount > 0) {
      const qx = lx + 14 + drawCount * 6;
      const qy = textBaselineY + Math.sin(drawCount * 0.45) * 8;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(qx, qy);
      ctx.lineTo(qx + 12, qy - 18);
      ctx.stroke();
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(qx - 1, qy - 1, 3, 3);
    }

    // Second line of script
    ctx.font = '10px "Inter", sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
    ctx.fillText('“My dearest confidant, the machine cannot parse this tremor…”', lx + 14, ly + 72);

    // Scanner beam failing to read
    const scanX = lx + ((t * 80) % lw);
    ctx.strokeStyle = 'rgba(239, 68, 68, 0.35)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(scanX, ly); ctx.lineTo(scanX, ly + lh);
    ctx.stroke();
  }

  // =========================================================================
  // 03: CETACEAN TRANSLATOR V1 (ideaphoria/cetacean-translator-v1)
  // Deep marine abyss with swimming whale silhouette, echolocation click rings,
  // hydrophone coordinates, and Ollama translation subtitle.
  // =========================================================================
  else if (type === 'whale_sonar') {
    // Oceanic abyss gradient
    const grad = ctx.createLinearGradient(0, 0, 0, height);
    grad.addColorStop(0, '#040914');
    grad.addColorStop(1, '#020408');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Floating plankton / bubbles
    for (let b = 0; b < 10; b++) {
      const bx = (Math.sin(b * 3.4 + t * 0.4) * 0.5 + 0.5) * width;
      const by = (height - ((t * 20 + b * 18) % height));
      ctx.fillStyle = 'rgba(56, 189, 248, 0.35)';
      ctx.beginPath();
      ctx.arc(bx, by, 1.2, 0, Math.PI * 2);
      ctx.fill();
    }

    // Whale Silhouette
    const wx = width * 0.42;
    const wy = height / 2 + Math.sin(t * 1.5) * 6;
    ctx.save();
    ctx.translate(wx, wy);

    // Body
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(-70, 0); // nose
    ctx.quadraticCurveTo(-30, -22, 10, -12); // back
    ctx.quadraticCurveTo(45, -4, 65, -18 + Math.sin(t * 2) * 5); // fluke upper
    ctx.lineTo(60, 0);
    ctx.lineTo(65, 18 - Math.sin(t * 2) * 5); // fluke lower
    ctx.quadraticCurveTo(40, 4, 10, 10);
    ctx.quadraticCurveTo(-30, 16, -70, 0); // belly to nose
    ctx.closePath();
    ctx.fill();

    // Pectoral Fin
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.beginPath();
    ctx.moveTo(-15, 6);
    ctx.lineTo(-5, 22);
    ctx.lineTo(2, 12);
    ctx.closePath();
    ctx.fill();

    // Eye
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(-55, -2, 1.8, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();

    // Echolocation Click Rings (pulsing forward from head)
    const headX = wx - 70;
    const headY = wy;
    for (let s = 1; s <= 4; s++) {
      const sRad = ((t * 40 + s * 22) % 110) + 12;
      const alpha = Math.max(0, 1 - sRad / 120);
      ctx.strokeStyle = `rgba(56, 189, 248, ${alpha * 0.75})`;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(headX, headY, sRad, Math.PI * 0.75, Math.PI * 1.25);
      ctx.stroke();
    }

    // Bio-acoustic Telemetry HUD
    ctx.font = '8.5px "JetBrains Mono", monospace';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('DEPTH: 420m • FREQ: 28.4 kHz', 16, 20);

    // Ollama Translation Subtitle
    ctx.fillStyle = '#000000';
    ctx.fillRect(width * 0.3, height - 32, width * 0.65, 22);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.strokeRect(width * 0.3, height - 32, width * 0.65, 22);

    ctx.fillStyle = '#4ade80';
    ctx.fillText('OLLAMA: [CLAN CODA: "AFFIRM BEARING"]', width * 0.3 + 8, height - 18);
  }

  // =========================================================================
  // 04: DACIAN-ERA (Lichtzero/DACian-era)
  // Two-device architecture: Phone Reader sweeping radio frequencies and
  // laptop Field Receiver syncing archaeological broadcasts over WebSockets.
  // =========================================================================
  else if (type === 'dual_device') {
    // Left: Smartphone Reader Frame
    const px = 24;
    const py = 16;
    const pw = 68;
    const ph = height - 32;

    // Phone casing
    ctx.fillStyle = '#0e0e0e';
    ctx.fillRect(px, py, pw, ph);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 1.2;
    ctx.strokeRect(px, py, pw, ph);

    // Phone speaker slot
    ctx.fillStyle = '#fff';
    ctx.fillRect(px + pw / 2 - 8, py + 4, 16, 2);

    // Phone screen circular radio tuner
    const pcx = px + pw / 2;
    const pcy = py + ph / 2 - 2;
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(pcx, pcy, 18, 0, Math.PI * 2);
    ctx.stroke();

    // Tuner needle rotating
    const needleAngle = t * 2;
    ctx.beginPath();
    ctx.moveTo(pcx, pcy);
    ctx.lineTo(pcx + Math.cos(needleAngle) * 16, pcy + Math.sin(needleAngle) * 16);
    ctx.stroke();

    ctx.font = '7.5px "JetBrains Mono", monospace';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('14.82 MHz', px + 10, py + ph - 8);

    // Middle: Wireless Sync Data Waves (Node-WS)
    const midX = px + pw + 10;
    const rightX = width - 130;
    const dist = rightX - midX;

    for (let k = 0; k < 3; k++) {
      const waveX = midX + ((t * 40 + k * 25) % dist);
      ctx.fillStyle = '#22c55e';
      ctx.font = '10px monospace';
      ctx.fillText('⌁', waveX, height / 2 + (k % 2 === 0 ? -6 : 6));
    }

    ctx.font = '8px "JetBrains Mono", monospace';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.fillText('WS SYNC', midX + 6, height / 2 + 16);

    // Right: Laptop Field Receiver Monitor
    const lx = rightX;
    const ly = 20;
    const lw = width - lx - 20;
    const lh = height - 40;

    // Laptop screen
    ctx.fillStyle = '#050505';
    ctx.fillRect(lx, ly, lw, lh);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.strokeRect(lx, ly, lw, lh);

    // Laptop base / keyboard stand
    ctx.fillStyle = '#1c1c1c';
    ctx.fillRect(lx - 8, ly + lh, lw + 16, 4);

    // Field receiver text on screen
    ctx.font = '8px "JetBrains Mono", monospace';
    ctx.fillStyle = '#22c55e';
    ctx.fillText('[FIELD RECEIVER]', lx + 6, ly + 14);

    ctx.fillStyle = '#ffffff';
    ctx.fillText('LOCK: 14.82 MHz', lx + 6, ly + 28);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.fillText('NODE #42 ACTIVE', lx + 6, ly + 42);

    ctx.fillStyle = '#38bdf8';
    ctx.fillText('HEX: 0x5F4172', lx + 6, ly + 56);

    // Pulsing signal lock dot
    const lockPulse = Math.sin(t * 4) > 0;
    ctx.fillStyle = lockPulse ? '#22c55e' : '#14532d';
    ctx.beginPath();
    ctx.arc(lx + lw - 10, ly + 12, 3, 0, Math.PI * 2);
    ctx.fill();
  }

  // =========================================================================
  // 05: PHYSIOGNOMY PROFILING MACHINE (GGhushe/Physiognomy-Profiling-Machine)
  // Webcam facial landmark mesh tracking, height triangulation calipers,
  // and satirical style archetype dossier output.
  // =========================================================================
  else if (type === 'biometric_mesh') {
    const cx = width * 0.36;
    const cy = height / 2;

    // Head / Face Silhouette
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.ellipse(cx, cy, 34, 46, 0, 0, Math.PI * 2);
    ctx.stroke();

    // 3D Wireframe Face Mesh Landmarks (MediaPipe style)
    const meshPoints = [
      { x: cx - 16, y: cy - 14 }, // left brow
      { x: cx - 6, y: cy - 16 },
      { x: cx + 6, y: cy - 16 },
      { x: cx + 16, y: cy - 14 }, // right brow
      { x: cx - 14, y: cy - 6 },  // left eye outer
      { x: cx - 6, y: cy - 6 },   // left eye inner
      { x: cx + 6, y: cy - 6 },   // right eye inner
      { x: cx + 14, y: cy - 6 },  // right eye outer
      { x: cx, y: cy + 4 },       // nose tip
      { x: cx - 8, y: cy + 6 },   // nose left
      { x: cx + 8, y: cy + 6 },   // nose right
      { x: cx - 12, y: cy + 20 }, // mouth left
      { x: cx, y: cy + 18 },      // upper lip
      { x: cx + 12, y: cy + 20 }, // mouth right
      { x: cx, y: cy + 26 },      // lower lip
      { x: cx, y: cy + 38 },      // chin
    ];

    // Wireframe connection lines
    ctx.strokeStyle = 'rgba(34, 197, 94, 0.25)';
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    meshPoints.forEach((p, i) => {
      meshPoints.forEach((q, j) => {
        if (i < j && Math.hypot(p.x - q.x, p.y - q.y) < 18) {
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
        }
      });
    });
    ctx.stroke();

    // Green landmark dots
    ctx.fillStyle = '#22c55e';
    meshPoints.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 1.6, 0, Math.PI * 2);
      ctx.fill();
    });

    // Tracking Calipers & Crosshairs
    const caliperY = cy + Math.sin(t * 2) * 36;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(cx - 48, caliperY); ctx.lineTo(cx + 48, caliperY);
    ctx.stroke();

    // Right Side: Tall Order Height Meter & Satirical Dossier
    const dx = width * 0.64;

    // Height Triangulation ruler
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.beginPath();
    ctx.moveTo(dx, 16); ctx.lineTo(dx, height - 16);
    ctx.stroke();
    for (let ty = 20; ty < height - 16; ty += 12) {
      ctx.beginPath();
      ctx.moveTo(dx, ty); ctx.lineTo(dx + 5, ty);
      ctx.stroke();
    }

    // Biometric Readout
    ctx.font = '8.5px "JetBrains Mono", monospace';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('NEXUS-SCAN 2026', dx + 12, 26);

    ctx.fillStyle = '#4ade80';
    ctx.fillText('HEIGHT: 184.2 CM', dx + 12, 42);

    ctx.fillStyle = '#38bdf8';
    ctx.fillText('CRANIAL: 78.4mm', dx + 12, 56);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
    ctx.fillText('JAWLINE: 82% SHARP', dx + 12, 70);

    // Satirical Archetype Tag
    ctx.fillStyle = '#000';
    ctx.fillRect(dx + 12, 82, width - dx - 24, 22);
    ctx.strokeStyle = '#f87171';
    ctx.strokeRect(dx + 12, 82, width - dx - 24, 22);

    ctx.fillStyle = '#f87171';
    ctx.fillText('ARCHETYPE: TECHNOCRAT', dx + 16, 96);
  }

  // =========================================================================
  // 06: GOLDFISH ATGRAVITY & QUAD DREAM (theiniyaaalll-pixel/02_09_2026_GOLDFISH-ATGrvity)
  // Generative biophysics: swimming Japanese goldfish with flowing fins,
  // bubbles moving DOWNWARDS in inverted -1.0G anti-gravity fluid.
  // =========================================================================
  else if (type === 'goldfish_sim') {
    // Water tank subtle gradient
    const waterGrad = ctx.createLinearGradient(0, 0, 0, height);
    waterGrad.addColorStop(0, '#04070d');
    waterGrad.addColorStop(1, '#080d18');
    ctx.fillStyle = waterGrad;
    ctx.fillRect(0, 0, width, height);

    // Inverted Gravity: Bubbles float DOWNWARDS towards floor!
    for (let b = 0; b < 12; b++) {
      const bx = (b * 31 + Math.sin(t * 1.5 + b) * 10) % width;
      const by = ((t * 35 + b * 22) % height); // Moving down!
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(bx, by, (b % 3) + 1.5, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Fluid kinematic Goldfish
    const gx = width * 0.48 + Math.cos(t * 1.2) * 45;
    const gy = height / 2 + Math.sin(t * 1.8) * 18;
    const heading = Math.atan2(Math.cos(t * 1.8) * 18, -Math.sin(t * 1.2) * 45) + Math.PI;

    ctx.save();
    ctx.translate(gx, gy);
    ctx.rotate(heading);

    // Goldfish Ryukin round body
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(0, 0, 22, 14, 0, 0, Math.PI * 2);
    ctx.fill();

    // Red/Orange Ryukin crest markings
    ctx.fillStyle = 'rgba(239, 68, 68, 0.85)';
    ctx.beginPath();
    ctx.ellipse(-4, -4, 12, 7, 0.2, 0, Math.PI * 2);
    ctx.fill();

    // Eye
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(-14, -3, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(-14.8, -3.8, 0.8, 0, Math.PI * 2);
    ctx.fill();

    // Dorsal Fin
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.beginPath();
    ctx.moveTo(-6, -14);
    ctx.quadraticCurveTo(4, -26, 12, -12);
    ctx.closePath();
    ctx.fill();

    // Flowing Dual Translucent Caudal Tail Fins
    for (let fin = -1; fin <= 1; fin += 2) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.beginPath();
      ctx.moveTo(18, 0);
      const finWave = Math.sin(t * 4 + fin) * 12;
      ctx.quadraticCurveTo(34, fin * 12 + finWave, 52, fin * 20 + finWave * 1.5);
      ctx.quadraticCurveTo(38, fin * 6, 20, 2);
      ctx.closePath();
      ctx.fill();
    }

    ctx.restore();

    // Gravity Inversion Vector HUD
    ctx.font = '8.5px "JetBrains Mono", monospace';
    ctx.fillStyle = '#38bdf8';
    ctx.fillText('VECTOR: -1.0G (ANTI-GRAVITY FLUID)', 16, 20);

    // Downward gravity arrow
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(width - 24, 16); ctx.lineTo(width - 24, 34);
    ctx.lineTo(width - 28, 28);
    ctx.moveTo(width - 24, 34); ctx.lineTo(width - 20, 28);
    ctx.stroke();

    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.fillText('TONE.JS: 432 Hz SINE CHIME', 16, height - 16);
  }

  // =========================================================================
  // 07: TO THE FUTURE WORLD: NEUROSPACE (Ishita054/To-the-future-world)
  // Cognitive memory architecture: Memory photo frame dissolving into
  // compressed synaptic code packets.
  // =========================================================================
  else if (type === 'memory_synapse') {
    // Left: Polaroid Memory Photo Frame
    const fx = 20;
    const fy = 16;
    const fw = 80;
    const fh = height - 32;

    ctx.fillStyle = '#141414';
    ctx.fillRect(fx, fy, fw, fh);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.strokeRect(fx, fy, fw, fh);

    // Inner photo square
    ctx.fillStyle = '#050505';
    ctx.fillRect(fx + 6, fy + 6, fw - 12, fh - 28);

    // Nostalgic window rain silhouette inside memory photo
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 1;
    // Window cross
    ctx.beginPath();
    ctx.moveTo(fx + fw / 2, fy + 6); ctx.lineTo(fx + fw / 2, fy + fh - 22);
    ctx.moveTo(fx + 6, fy + (fh - 28) / 2); ctx.lineTo(fx + fw - 6, fy + (fh - 28) / 2);
    ctx.stroke();

    // Rain slant lines inside photo
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.5)';
    for (let r = 0; r < 6; r++) {
      const rx = fx + 12 + r * 10;
      ctx.beginPath();
      ctx.moveTo(rx, fy + 10); ctx.lineTo(rx - 6, fy + fh - 24);
      ctx.stroke();
    }

    // Memory label handwritten at bottom of photo
    ctx.font = '7.5px "JetBrains Mono", monospace';
    ctx.fillStyle = '#cbd5e1';
    ctx.fillText('1998 CALCUTTA', fx + 6, fy + fh - 10);

    // Center to Right: Memory Dissolving into Synaptic Network
    const sx = fx + fw + 16;
    const sw = width - sx - 16;

    // Floating neural synapse nodes
    const synapseNodes = [
      { x: sx + 10, y: 32 },
      { x: sx + 50, y: 22 },
      { x: sx + 100, y: 36 },
      { x: sx + 30, y: 70 },
      { x: sx + 80, y: 65 },
      { x: sx + 130, y: 55 },
      { x: sx + 60, y: 105 },
      { x: sx + 120, y: 95 },
    ];

    // Dendrite connection paths
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    synapseNodes.forEach((n1, i) => {
      synapseNodes.forEach((n2, j) => {
        if (i < j && Math.hypot(n1.x - n2.x, n1.y - n2.y) < 55) {
          ctx.moveTo(n1.x, n1.y);
          ctx.lineTo(n2.x, n2.y);
        }
      });
    });
    ctx.stroke();

    // Firing electrical impulses along synapses
    const pulseT = (t * 2) % synapseNodes.length;
    const activeNode = synapseNodes[Math.floor(pulseT)];
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.arc(activeNode.x, activeNode.y, 4, 0, Math.PI * 2);
    ctx.fill();

    synapseNodes.forEach((n) => {
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(n.x, n.y, 2.2, 0, Math.PI * 2);
      ctx.fill();
    });

    // Compression Telemetry Readout
    ctx.font = '8px "JetBrains Mono", monospace';
    ctx.fillStyle = '#4ade80';
    ctx.fillText('SYNAPTIC COMPRESSION: 16.0x', sx + 6, height - 24);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.fillText('18.4 KB → 1.1 KB PACKET', sx + 6, height - 12);
  }

  // =========================================================================
  // 08: MMOW (Haniny/MMOW)
  // Shared Virtual World: Open 2D infinite spatial canvas with multiple
  // live user avatars roaming, leaving pixel paths, and chatting.
  // =========================================================================
  else if (type === 'spatial_commons') {
    // 2D Spatial Grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 28) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
    }
    for (let y = 0; y < height; y += 28) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
    }

    // Multi-User Roaming Avatars
    const avatars = [
      { name: '@haniny', color: '#22c55e', bx: width * 0.3, by: height * 0.45, vx: Math.sin(t * 1.5) * 35, vy: Math.cos(t * 1.2) * 20 },
      { name: '@maya', color: '#38bdf8', bx: width * 0.7, by: height * 0.35, vx: Math.cos(t * 1.4) * 30, vy: Math.sin(t * 1.6) * 22 },
      { name: '@you', color: '#ffffff', bx: width * 0.5, by: height * 0.7, vx: Math.sin(t * 0.8) * 25, vy: Math.cos(t * 0.9) * 15 }
    ];

    avatars.forEach((av, idx) => {
      const ax = av.bx + av.vx;
      const ay = av.by + av.vy;

      // Pixel trail
      ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.fillRect(ax - 8, ay - 1, 6, 2);
      ctx.fillRect(ax - 14, ay, 4, 1);

      // Avatar circle
      ctx.fillStyle = av.color;
      ctx.beginPath();
      ctx.arc(ax, ay, 3.5, 0, Math.PI * 2);
      ctx.fill();

      // Username tag
      ctx.font = '8px "JetBrains Mono", monospace';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(av.name, ax + 6, ay - 4);

      // Chat speech bubble for @haniny
      if (idx === 0) {
        ctx.fillStyle = '#111111';
        ctx.fillRect(ax - 30, ay - 24, 76, 15);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.strokeRect(ax - 30, ay - 24, 76, 15);
        ctx.fillStyle = '#4ade80';
        ctx.fillText('"meet at (40,-12)"', ax - 26, ay - 14);
      }
    });

    // Permanent Waypoint Beacon
    const bx = width * 0.78;
    const by = height * 0.72;
    ctx.strokeStyle = '#38bdf8';
    ctx.strokeRect(bx - 4, by - 4, 8, 8);
    ctx.font = '8px "JetBrains Mono", monospace';
    ctx.fillStyle = '#38bdf8';
    ctx.fillText('📍 COMMONS EMBASSY', bx - 38, by + 16);

    // Top HUD
    ctx.font = '8px "JetBrains Mono", monospace';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.fillText('COMMUNAL CANVAS • 14 PEERS ONLINE', 14, 18);
  }

  // =========================================================================
  // 09: EC-AK-OU (imedhit/Ec-ak-ou)
  // Phonetic feedback & acoustic decay in virtual resonant chambers:
  // Spoken syllables ("E - C H - O - U") bouncing down a 3D architectural hall.
  // =========================================================================
  else if (type === 'chamber_decay') {
    // 3D Perspective Resonant Hallway
    const cx = width / 2;
    const cy = height / 2;
    const vpX = cx;
    const vpY = cy - 4; // Vanishing point

    // Perspective corner lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(10, 10); ctx.lineTo(vpX, vpY); // top-left
    ctx.moveTo(width - 10, 10); ctx.lineTo(vpX, vpY); // top-right
    ctx.moveTo(10, height - 10); ctx.lineTo(vpX, vpY); // bottom-left
    ctx.moveTo(width - 10, height - 10); ctx.lineTo(vpX, vpY); // bottom-right
    ctx.stroke();

    // Perspective chamber arch rings
    for (let f = 1; f <= 5; f++) {
      const z = f / 6;
      const x1 = 10 + (vpX - 10) * z;
      const y1 = 10 + (vpY - 10) * z;
      const x2 = (width - 10) - (width - 10 - vpX) * z;
      const y2 = (height - 10) - (height - 10 - vpY) * z;
      ctx.strokeStyle = `rgba(255, 255, 255, ${0.08 + (1 - z) * 0.15})`;
      ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);
    }

    // Phonetic Letters bouncing down the hall ("E - C H - O - U")
    const syllables = ['E', 'C H', 'O', 'U'];
    syllables.forEach((syl, idx) => {
      const travel = ((t * 1.5 + idx * 0.28) % 1);
      const sx = cx + Math.sin(t * 3 + idx * 2) * (1 - travel) * 55;
      const sy = cy + (travel * 0.3) * 20;
      const scale = Math.max(0.3, 1 - travel * 0.7);
      const alpha = Math.max(0.05, 1 - travel * 0.9);

      ctx.font = `bold ${Math.floor(16 * scale)}px "Space Grotesk", sans-serif`;
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
      ctx.fillText(syl, sx, sy);

      // Acoustic reflection ghost waves
      ctx.strokeStyle = `rgba(56, 189, 248, ${alpha * 0.5})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(sx + 8, sy - 4, (1 - travel) * 14 + 4, 0, Math.PI * 2);
      ctx.stroke();
    });

    // Chamber Telemetry HUD
    ctx.font = '8px "JetBrains Mono", monospace';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('CHAMBER: CATHEDRAL REVERB', 16, 20);

    ctx.fillStyle = '#38bdf8';
    ctx.fillText('RT60: 5.4s DECAY', 16, height - 16);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.fillText('PHONETIC REFLECTION LOOP', width - 150, height - 16);
  }
}

// =============================================================================
// VIEW 2: EDITORIAL FLIP BOOK SPREAD
// Left Page: Deep Research & Metadata
// Right Page: Live Interactive HTML Project Re-creation
// =============================================================================

const bookPageIndicator = document.getElementById('bookPageIndicator');
const bookHeaderCategory = document.getElementById('bookHeaderCategory');
const spreadIndex = document.getElementById('spreadIndex');
const spreadCategory = document.getElementById('spreadCategory');
const spreadTitle = document.getElementById('spreadTitle');
const spreadCreator = document.getElementById('spreadCreator');
const spreadHandle = document.getElementById('spreadHandle');
const spreadGithubLink = document.getElementById('spreadGithubLink');
const spreadTagline = document.getElementById('spreadTagline');
const spreadAbstract = document.getElementById('spreadAbstract');
const spreadMethod = document.getElementById('spreadMethod');
const spreadTechTags = document.getElementById('spreadTechTags');
const spreadOpenGithubBtn = document.getElementById('spreadOpenGithubBtn');
const spreadCloneUrl = document.getElementById('spreadCloneUrl');
const btnCopySpreadClone = document.getElementById('btnCopySpreadClone');
const liveInteractiveContainer = document.getElementById('liveInteractiveContainer');
const bookPagerPills = document.getElementById('bookPagerPills');
const frameHint = document.getElementById('frameHint');

function renderSpread(index) {
  if (index < 0) index = 0;
  if (index >= PROJECTS.length) index = PROJECTS.length - 1;
  state.currentIndex = index;

  const proj = PROJECTS[index];

  // Cleanup any previous live prototype event listeners / timers
  if (state.activeInteractiveCleanup) {
    state.activeInteractiveCleanup();
    state.activeInteractiveCleanup = null;
  }

  // Populate Top Header Meta
  bookPageIndicator.textContent = `${proj.index} / 09`;
  bookHeaderCategory.textContent = proj.category;

  // Populate Left Page Editorial Content
  spreadIndex.textContent = proj.index;
  spreadCategory.textContent = proj.category.toUpperCase();
  spreadTitle.textContent = proj.title;
  spreadCreator.textContent = proj.creator;
  spreadHandle.textContent = proj.handle;
  spreadGithubLink.href = proj.github;
  spreadTagline.textContent = `"${proj.tagline}"`;
  spreadAbstract.textContent = proj.abstract;
  spreadMethod.textContent = proj.method;

  // Tech tags
  spreadTechTags.innerHTML = '';
  proj.techStack.forEach((t) => {
    const tag = document.createElement('span');
    tag.className = 'tech-tag';
    tag.textContent = t;
    spreadTechTags.appendChild(tag);
  });

  // Links & Clone URL
  spreadOpenGithubBtn.href = proj.github;
  spreadCloneUrl.textContent = proj.github;
  btnCopySpreadClone.onclick = () => {
    navigator.clipboard.writeText(`git clone ${proj.github}`);
    btnCopySpreadClone.textContent = 'Copied!';
    setTimeout(() => {
      btnCopySpreadClone.textContent = 'Copy';
    }, 1500);
  };

  // Render Bottom Pager Pills
  renderPagerPills();

  // Populate Right Page with the Real Live Interactive HTML Conversion
  renderInteractiveApp(proj);
}

function renderPagerPills() {
  bookPagerPills.innerHTML = '';
  PROJECTS.forEach((p, idx) => {
    const pill = document.createElement('button');
    pill.className = `pager-pill ${idx === state.currentIndex ? 'active' : ''}`;
    pill.textContent = p.index;
    pill.title = p.title;
    pill.addEventListener('click', () => {
      playMechanicalTick('click');
      renderSpread(idx);
    });
    bookPagerPills.appendChild(pill);
  });
}

function renderInteractiveApp(proj) {
  liveInteractiveContainer.innerHTML = '';

  switch (proj.interactiveType) {
    case 'parrot_interactive':
      frameHint.textContent = 'Confess or unburden to the Navarasa machine';
      state.activeInteractiveCleanup = mountParrotInteractive(liveInteractiveContainer);
      break;
    case 'scribbler_interactive':
      frameHint.textContent = 'Calibrate human-error parameters to evade OCR';
      state.activeInteractiveCleanup = mountScribblerInteractive(liveInteractiveContainer);
      break;
    case 'cetacean_interactive':
      frameHint.textContent = 'Trigger hydrophone codas & synthesize translation';
      state.activeInteractiveCleanup = mountCetaceanInteractive(liveInteractiveContainer);
      break;
    case 'dacian_interactive':
      frameHint.textContent = 'Sweep radio frequency dial to lock artifact signal';
      state.activeInteractiveCleanup = mountDacianInteractive(liveInteractiveContainer);
      break;
    case 'physiognomy_interactive':
      frameHint.textContent = 'Adjust biometric calipers & generate dossier';
      state.activeInteractiveCleanup = mountPhysiognomyInteractive(liveInteractiveContainer);
      break;
    case 'goldfish_interactive':
      frameHint.textContent = 'Click to spawn fluid ripples or toggle gravity';
      state.activeInteractiveCleanup = mountGoldfishInteractive(liveInteractiveContainer);
      break;
    case 'neurospace_interactive':
      frameHint.textContent = 'Modulate synaptic memory compression slider';
      state.activeInteractiveCleanup = mountNeurospaceInteractive(liveInteractiveContainer);
      break;
    case 'mmow_interactive':
      frameHint.textContent = 'Drag to explore spatial plane & click to drop beacons';
      state.activeInteractiveCleanup = mountMMOWInteractive(liveInteractiveContainer);
      break;
    case 'ecakou_interactive':
      frameHint.textContent = 'Trigger vocal impulse to hear virtual chamber decay';
      state.activeInteractiveCleanup = mountEcakouInteractive(liveInteractiveContainer);
      break;
    default:
      liveInteractiveContainer.innerHTML = `<p style="color:var(--text-dim);">Interactive module initializing...</p>`;
  }
}

// =============================================================================
// PROTOTYPE 1: FREEING THE PARROT (Affective Computing & Navarasa Classifier)
// =============================================================================

function mountParrotInteractive(container) {
  container.innerHTML = `
    <div class="proto-wrapper">
      <div class="proto-intro-box">
        <p class="proto-desc">
          Accepts personal confessions, feeds semantic text into an Indian Navarasa emotional classification engine, and synthesizes a diagnostic Mirror Report.
        </p>
        <span class="proto-badge">Navarasa v2.4</span>
      </div>

      <div class="proto-card">
        <div class="proto-card-title">
          <span>Input Confession or Secret</span>
          <span style="font-size:10px; color:var(--text-dim);">Simulated Handwritten Input</span>
        </div>
        <textarea id="parrotInput" class="proto-textarea" placeholder="Type a confession, vulnerability, or quiet fear..."></textarea>
        
        <div class="proto-chips">
          <button class="proto-chip" data-sample="I find myself pretending to understand conversations just so people won't think I am falling behind.">"Pretending to understand..."</button>
          <button class="proto-chip" data-sample="The quiet late at night feels louder than any crowded room I have ever walked into.">"The quiet late at night..."</button>
          <button class="proto-chip" data-sample="I tell everyone I am resilient, but the truth is I am just numb to disappointment.">"Numb to disappointment..."</button>
        </div>

        <div class="proto-actions">
          <button id="btnParrotAnalyze" class="proto-btn proto-btn-primary">
            <span>Analyze Emotional Rasas</span>
            <span>✦</span>
          </button>
          <button id="btnParrotClear" class="proto-btn">Clear</button>
        </div>
      </div>

      <div class="proto-card">
        <div class="proto-card-title">
          <span>Navarasa Distribution (9 Classical States)</span>
          <span id="dominantRasaLabel" style="color:#ffffff;">Awaiting Input</span>
        </div>
        <div class="navarasa-list" id="navarasaBars">
          <!-- Populated by JS -->
        </div>
      </div>

      <div class="proto-card">
        <div class="proto-card-title">
          <span>Synthesized Mirror Report</span>
          <span class="proto-badge" id="reportIdBadge">REPORT #----</span>
        </div>
        <div class="proto-terminal" id="parrotTerminal">
<span class="term-dim">// The Parrot sits in silence. Type a statement above to begin affective extraction...</span>
        </div>
      </div>
    </div>
  `;

  const input = container.querySelector('#parrotInput');
  const btnAnalyze = container.querySelector('#btnParrotAnalyze');
  const btnClear = container.querySelector('#btnParrotClear');
  const barsContainer = container.querySelector('#navarasaBars');
  const terminal = container.querySelector('#parrotTerminal');
  const dominantRasaLabel = container.querySelector('#dominantRasaLabel');
  const reportIdBadge = container.querySelector('#reportIdBadge');
  const chips = container.querySelectorAll('.proto-chip');

  const RASAS = [
    { name: 'Karuna', label: 'Compassion / Sorrow', baseVal: 72 },
    { name: 'Shanta', label: 'Peace / Emptiness', baseVal: 48 },
    { name: 'Bhayanaka', label: 'Fear / Apprehension', baseVal: 64 },
    { name: 'Adbhuta', label: 'Wonder / Disbelief', baseVal: 18 },
    { name: 'Hasya', label: 'Mirth / Irony', baseVal: 24 },
    { name: 'Raudra', label: 'Fury / Resentment', baseVal: 32 },
    { name: 'Shringara', label: 'Love / Longing', baseVal: 45 },
    { name: 'Veera', label: 'Heroism / Defiance', baseVal: 15 },
    { name: 'Bibhatsa', label: 'Aversion / Weariness', baseVal: 52 },
  ];

  function renderBars(values = null) {
    barsContainer.innerHTML = '';
    RASAS.forEach((r, i) => {
      const val = values ? values[i] : Math.floor(Math.random() * 20 + 5);
      const item = document.createElement('div');
      item.className = 'navarasa-item';
      item.innerHTML = `
        <div class="navarasa-labels">
          <span>${r.name} <span style="color:var(--text-dim);">(${r.label})</span></span>
          <span>${val}%</span>
        </div>
        <div class="navarasa-track">
          <div class="navarasa-fill" style="width: ${val}%;"></div>
        </div>
      `;
      barsContainer.appendChild(item);
    });
  }

  renderBars();

  chips.forEach((c) => {
    c.addEventListener('click', () => {
      input.value = c.getAttribute('data-sample');
      playMechanicalTick('click');
      runAnalysis();
    });
  });

  btnClear.addEventListener('click', () => {
    input.value = '';
    renderBars();
    terminal.innerHTML = '<span class="term-dim">// The Parrot sits in silence. Type a statement above to begin affective extraction...</span>';
    dominantRasaLabel.textContent = 'Awaiting Input';
    reportIdBadge.textContent = 'REPORT #----';
  });

  btnAnalyze.addEventListener('click', () => {
    runAnalysis();
  });

  function runAnalysis() {
    playMechanicalTick('click');
    const text = input.value.trim();
    if (!text) {
      input.focus();
      return;
    }

    // Dynamic weights based on input length and sentiment keywords
    const hash = text.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
    const computedValues = RASAS.map((r, i) => {
      const seed = Math.sin(hash * 0.17 + i * 3.4);
      return Math.min(96, Math.max(12, Math.floor(Math.abs(seed) * 80 + 15)));
    });

    renderBars(computedValues);

    let maxIdx = 0;
    computedValues.forEach((v, i) => {
      if (v > computedValues[maxIdx]) maxIdx = i;
    });

    const dominant = RASAS[maxIdx];
    dominantRasaLabel.textContent = `Dominant: ${dominant.name} (${computedValues[maxIdx]}%)`;
    const repNum = Math.floor(1000 + Math.random() * 9000);
    reportIdBadge.textContent = `REPORT #${repNum}`;

    terminal.innerHTML = `
<span class="term-cyan">[OPTICAL SCRIPT PARSER]</span> Semantic confession verified (${text.length} chars).
<span class="term-dim">----------------------------------------------------------------------</span>
<span class="term-bold">CLASSIFICATION:</span> Dominant emotional locus identified as <span class="term-green">${dominant.name}</span> (${dominant.label}).
<span class="term-bold">ENTROPY FACTOR:</span> ${(Math.random() * 0.4 + 0.55).toFixed(3)} (High subjective vulnerability detected)
<span class="term-bold">SYNTHETIC VERDICT:</span>
"The system detects an acute friction between your external presentation and your internal state. You believe the machine is understanding your pain; however, the machine is merely mapping semantic frequency vectors. Your relief does not originate from our intelligence, but from the unbearable silence of human spaces."
<span class="term-dim">----------------------------------------------------------------------</span>
<span class="term-dim">// Mirror Report #${repNum} archived to affective memory pool.</span>
    `;
  }

  return () => {};
}

// =============================================================================
// PROTOTYPE 2: THE SCRIBBLER (Counter-Surveillance Steganography & OCR Evasion)
// =============================================================================

function mountScribblerInteractive(container) {
  container.innerHTML = `
    <div class="proto-wrapper">
      <div class="proto-intro-box">
        <p class="proto-desc">
          Encodes sensitive text into authentic handwritten cursive deconstructions. Calibrates motor tremors and ink irregularities to evade computer vision OCR models.
        </p>
        <span class="proto-badge">Stego-Cipher v3.1</span>
      </div>

      <div class="proto-card">
        <div class="proto-card-title">
          <span>Secret Text to Obfuscate</span>
          <span style="color:var(--text-dim);">Plaintext Payload</span>
        </div>
        <input type="text" id="scribblerInput" class="proto-input" value="THE ARCHIVE IS LISTENING IN SILENCE">
        
        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:14px; margin-top:6px;">
          <div class="proto-slider-group">
            <div class="proto-slider-header">
              <span class="proto-slider-label">Ink Tremor / Jitter</span>
              <span class="proto-slider-val" id="tremorVal">35%</span>
            </div>
            <input type="range" id="sliderTremor" class="proto-range" min="5" max="80" value="35">
          </div>

          <div class="proto-slider-group">
            <div class="proto-slider-header">
              <span class="proto-slider-label">Slant Distortion</span>
              <span class="proto-slider-val" id="slantVal">-18°</span>
            </div>
            <input type="range" id="sliderSlant" class="proto-range" min="-45" max="45" value="-18">
          </div>
        </div>

        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:14px;">
          <div class="proto-slider-group">
            <div class="proto-slider-header">
              <span class="proto-slider-label">Ligature Blur / Imperfection</span>
              <span class="proto-slider-val" id="blurVal">45%</span>
            </div>
            <input type="range" id="sliderBlur" class="proto-range" min="0" max="100" value="45">
          </div>

          <div class="proto-slider-group">
            <div class="proto-slider-header">
              <span class="proto-slider-label">Steganographic Salt Entropy</span>
              <span class="proto-slider-val" id="entropyVal">62%</span>
            </div>
            <input type="range" id="sliderEntropy" class="proto-range" min="10" max="100" value="62">
          </div>
        </div>
      </div>

      <div class="proto-card">
        <div class="proto-card-title">
          <span>Generated Calligraphic Canvas</span>
          <button id="btnRedrawScribble" class="proto-btn proto-btn-sm">Re-render Script</button>
        </div>
        <div class="proto-canvas-wrap" style="height: 180px;">
          <canvas id="scribblerCanvas" style="width:100%; height:100%; display:block;"></canvas>
        </div>
      </div>

      <div class="proto-card">
        <div class="proto-card-title">
          <span>Simulated OCR Counter-Surveillance Telemetry</span>
          <span class="proto-badge" id="ocrStatusBadge" style="color:#22c55e;">OCR EVADED</span>
        </div>
        <div class="proto-terminal" id="scribblerTerminal">
<span class="term-cyan">[TESSERACT / VISION ENGINE BENCHMARK]</span>
Analyzing calligraphic sample with deep convolutional character model...
- Confidence: <span class="term-green">8.4%</span> (Below detection threshold: 60%)
- Human Confidant Legibility: <span class="term-bold">HIGH (89%)</span>
- Detected Chars: <span class="term-dim">"~--~ ~rch~v~ ~s l~st~n~ng..."</span>
<span class="term-green">STATUS: SUCCESS. Plaintext successfully hidden within handwritten irregularities.</span>
        </div>
      </div>
    </div>
  `;

  const canvas = container.querySelector('#scribblerCanvas');
  const input = container.querySelector('#scribblerInput');
  const sliderTremor = container.querySelector('#sliderTremor');
  const sliderSlant = container.querySelector('#sliderSlant');
  const sliderBlur = container.querySelector('#sliderBlur');
  const sliderEntropy = container.querySelector('#sliderEntropy');
  const tremorVal = container.querySelector('#tremorVal');
  const slantVal = container.querySelector('#slantVal');
  const blurVal = container.querySelector('#blurVal');
  const entropyVal = container.querySelector('#entropyVal');
  const btnRedraw = container.querySelector('#btnRedrawScribble');
  const ocrBadge = container.querySelector('#ocrStatusBadge');
  const terminal = container.querySelector('#scribblerTerminal');

  function resizeCanvas() {
    const rect = canvas.parentElement.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    return { ctx, width: rect.width, height: rect.height };
  }

  function drawCursive() {
    const { ctx, width, height } = resizeCanvas();
    const text = input.value || 'UNTITLED CIPHER';
    const tremor = parseFloat(sliderTremor.value);
    const slant = (parseFloat(sliderSlant.value) * Math.PI) / 180;
    const blur = parseFloat(sliderBlur.value);
    const entropy = parseFloat(sliderEntropy.value);

    ctx.fillStyle = '#020202';
    ctx.fillRect(0, 0, width, height);

    // Grid baseline
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(20, height * 0.65);
    ctx.lineTo(width - 20, height * 0.65);
    ctx.stroke();

    // Render deformed cursive simulation
    ctx.save();
    ctx.translate(30, height * 0.65);
    ctx.transform(1, 0, Math.tan(slant), 1, 0, 0);

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2.2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    let curX = 0;
    const charSpacing = Math.min(22, (width - 60) / (text.length + 1));

    ctx.beginPath();
    ctx.moveTo(0, 0);

    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      const charCode = ch.charCodeAt(0);
      const randJitter = (Math.sin(i * 4.3 + entropy) * tremor) / 3;

      if (ch === ' ') {
        curX += charSpacing * 1.4;
        ctx.moveTo(curX, 0);
        continue;
      }

      // Procedural cursive flourish
      const h1 = -((charCode % 25) + 10) + randJitter;
      const h2 = (charCode % 12) - randJitter;
      const cp1x = curX + charSpacing * 0.3;
      const cp1y = h1;
      const cp2x = curX + charSpacing * 0.7;
      const cp2y = h2;
      const endX = curX + charSpacing;
      const endY = randJitter * 0.5;

      ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, endX, endY);

      // Micro-tremor loop
      if (i % 2 === 0) {
        ctx.arc(endX - 2, endY - 4, 3, 0, Math.PI * 2);
      }

      curX += charSpacing;
    }
    ctx.stroke();

    // Steganographic salt ink dots
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    const dotCount = Math.floor(entropy * 0.6);
    for (let d = 0; d < dotCount; d++) {
      const dx = (Math.sin(d * 12.3) * 0.5 + 0.5) * curX;
      const dy = (Math.cos(d * 8.7) * 0.5 + 0.5) * 60 - 30;
      ctx.fillRect(dx, dy, 1.5, 1.5);
    }

    ctx.restore();

    // Update OCR evasion metrics
    const evasionRatio = Math.min(99, Math.floor(tremor * 0.5 + Math.abs(parseFloat(sliderSlant.value)) * 0.8 + blur * 0.3));
    const confidence = Math.max(2, 100 - evasionRatio);
    ocrBadge.textContent = confidence < 30 ? 'OCR EVADED' : 'OCR VULNERABLE';
    ocrBadge.style.color = confidence < 30 ? '#22c55e' : '#f87171';

    terminal.innerHTML = `
<span class="term-cyan">[TESSERACT / VISION ENGINE BENCHMARK]</span>
Analyzing calligraphic sample with deep convolutional character model...
- Confidence: <span class="${confidence < 30 ? 'term-green' : 'term-red'}">${confidence}%</span> (Target evasion: &lt;30%)
- Slant Offset: <span class="term-bold">${sliderSlant.value}°</span>
- Steganographic Entropy: <span class="term-bold">${entropy}%</span>
- OCR Verdict: ${confidence < 30 ? '<span class="term-green">PASSED. Automated optical parsing defeated.</span>' : '<span class="term-red">WARNING: Machine vision models can reconstruct character shapes.</span>'}
    `;
  }

  [sliderTremor, sliderSlant, sliderBlur, sliderEntropy].forEach((s) => {
    s.addEventListener('input', () => {
      tremorVal.textContent = `${sliderTremor.value}%`;
      slantVal.textContent = `${sliderSlant.value}°`;
      blurVal.textContent = `${sliderBlur.value}%`;
      entropyVal.textContent = `${sliderEntropy.value}%`;
      drawCursive();
    });
  });

  input.addEventListener('input', drawCursive);
  btnRedraw.addEventListener('click', () => {
    playMechanicalTick('click');
    drawCursive();
  });

  window.addEventListener('resize', drawCursive);
  setTimeout(drawCursive, 40);

  return () => {
    window.removeEventListener('resize', drawCursive);
  };
}

// =============================================================================
// PROTOTYPE 3: CETACEAN TRANSLATOR V1 (Marine Bio-Acoustics & Neural Translation)
// =============================================================================

function mountCetaceanInteractive(container) {
  container.innerHTML = `
    <div class="proto-wrapper">
      <div class="proto-intro-box">
        <p class="proto-desc">
          Interspecies marine hydrophone research station. Decomposes whale and dolphin click-trains via real-time FFT spectrograms and translates bio-acoustic codas into syntactic cognitive models.
        </p>
        <span class="proto-badge">Hydrophone v1.08</span>
      </div>

      <div class="proto-card">
        <div class="proto-card-title">
          <span>Hydrophone Feed Selection</span>
          <span style="color:var(--text-dim);">Oceanic Depth: 450m</span>
        </div>
        <div class="proto-chips">
          <button class="proto-chip active" id="chipCoda1">Feed A: Sperm Whale Coda [5-Click Train]</button>
          <button class="proto-chip" id="chipCoda2">Feed B: Humpback Harmonic Whistle [24 kHz]</button>
          <button class="proto-chip" id="chipCoda3">Feed C: Orca Pod Cohesion Pulse</button>
        </div>

        <div class="proto-actions" style="margin-top:4px;">
          <button id="btnPlayHydrophone" class="proto-btn proto-btn-primary">
            <span>Transmit Acoustic Pulse</span>
            <span>▶</span>
          </button>
          <button id="btnTranslateOllama" class="proto-btn">
            <span>Query Ollama Model</span>
            <span>✦</span>
          </button>
        </div>
      </div>

      <div class="proto-card">
        <div class="proto-card-title">
          <span>Real-time FFT Spectrogram (0 - 48 kHz)</span>
          <span id="hydroFreqLabel" style="color:#ffffff;">PEAK: 28.4 kHz</span>
        </div>
        <div class="proto-canvas-wrap" style="height: 160px;">
          <canvas id="cetaceanCanvas" style="width:100%; height:100%; display:block;"></canvas>
        </div>
      </div>

      <div class="proto-card">
        <div class="proto-card-title">
          <span>Interspecies Syntactic Translation Engine</span>
          <span class="proto-badge" id="codaIdBadge">CODA: #SW-401</span>
        </div>
        <div class="proto-terminal" id="cetaceanTerminal">
<span class="term-cyan">[HYDROPHONE SENSOR ACTIVE]</span>
Click "Transmit Acoustic Pulse" or "Query Ollama Model" to capture marine dialect...
        </div>
      </div>
    </div>
  `;

  const canvas = container.querySelector('#cetaceanCanvas');
  const btnPlay = container.querySelector('#btnPlayHydrophone');
  const btnTranslate = container.querySelector('#btnTranslateOllama');
  const terminal = container.querySelector('#cetaceanTerminal');
  const freqLabel = container.querySelector('#hydroFreqLabel');
  const codaBadge = container.querySelector('#codaIdBadge');
  const chip1 = container.querySelector('#chipCoda1');
  const chip2 = container.querySelector('#chipCoda2');
  const chip3 = container.querySelector('#chipCoda3');

  let activePreset = 1;
  let animId = null;

  function setPreset(p) {
    activePreset = p;
    [chip1, chip2, chip3].forEach((c, idx) => {
      c.style.background = idx + 1 === p ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.04)';
      c.style.color = idx + 1 === p ? '#fff' : 'var(--text-muted)';
    });
    freqLabel.textContent = p === 1 ? 'PEAK: 28.4 kHz' : p === 2 ? 'PEAK: 14.2 kHz' : 'PEAK: 34.8 kHz';
    codaBadge.textContent = p === 1 ? 'CODA: #SW-401' : p === 2 ? 'CODA: #HB-882' : 'CODA: #OR-109';
  }

  chip1.addEventListener('click', () => { playMechanicalTick('click'); setPreset(1); });
  chip2.addEventListener('click', () => { playMechanicalTick('click'); setPreset(2); });
  chip3.addEventListener('click', () => { playMechanicalTick('click'); setPreset(3); });
  setPreset(1);

  // Synthesize acoustic whale sound via Web Audio API
  function playCetaceanSound() {
    initAudio();
    if (!state.audioCtx) return;
    const ctx = state.audioCtx;
    const now = ctx.currentTime;

    if (activePreset === 1) {
      // 5-click train
      for (let k = 0; k < 5; k++) {
        const tClick = now + k * 0.08;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(1800, tClick);
        osc.frequency.exponentialRampToValueAtTime(300, tClick + 0.02);
        gain.gain.setValueAtTime(0.12, tClick);
        gain.gain.exponentialRampToValueAtTime(0.0001, tClick + 0.02);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(tClick);
        osc.stop(tClick + 0.02);
      }
    } else if (activePreset === 2) {
      // Humpback melodic sweep
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(420, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.3);
      osc.frequency.exponentialRampToValueAtTime(320, now + 0.6);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.6);
    } else {
      // Orca pulse
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(1400, now);
      osc.frequency.linearRampToValueAtTime(600, now + 0.25);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.25);
    }
  }

  btnPlay.addEventListener('click', () => {
    playCetaceanSound();
    terminal.innerHTML = `
<span class="term-cyan">[ACOUSTIC PULSE TRANSMITTED]</span>
Recording received on Hydrophone Array #3 (Depth: 450m).
Spectrogram energy peak registered at ${activePreset === 1 ? '28.4 kHz' : activePreset === 2 ? '14.2 kHz' : '34.8 kHz'}.
Awaiting neural tokenizer...
    `;
  });

  btnTranslate.addEventListener('click', () => {
    playMechanicalTick('click');
    playCetaceanSound();
    terminal.innerHTML = `<span class="term-dim">// Tokenizing bio-acoustic audio vectors through local Ollama LLM...</span>`;

    setTimeout(() => {
      if (activePreset === 1) {
        terminal.innerHTML = `
<span class="term-green">[OLLAMA SYNTACTIC TRANSLATION COMPLETED]</span>
<span class="term-bold">ACOUSTIC SIGNATURE:</span> Sperm Whale Matrilineal Coda [5-Click Regular]
<span class="term-bold">CONFIDENCE:</span> 94.2%
<span class="term-bold">DECODED COGNITIVE INTENT:</span>
"[MATRILINEAL NAVIGATION BEACON]: Descending below twilight zone (420m). Cohesion inquiry to clan member #04: 'Affirm your bearing relative to thermal layer.'"
<span class="term-dim">----------------------------------------------------------------------</span>
<span class="term-dim">Bio-cybernetic packet appended to interspecies open ontology.</span>
        `;
      } else if (activePreset === 2) {
        terminal.innerHTML = `
<span class="term-green">[OLLAMA SYNTACTIC TRANSLATION COMPLETED]</span>
<span class="term-bold">ACOUSTIC SIGNATURE:</span> Humpback Harmonic Unit [Looping Ascending Frequency]
<span class="term-bold">CONFIDENCE:</span> 88.7%
<span class="term-bold">DECODED COGNITIVE INTENT:</span>
"[SEASONAL SPATIAL MAPPING]: High bathymetric density detected along shelf. Communal memory song motif: 'Path of historical ice shelf opening.'"
        `;
      } else {
        terminal.innerHTML = `
<span class="term-green">[OLLAMA SYNTACTIC TRANSLATION COMPLETED]</span>
<span class="term-bold">ACOUSTIC SIGNATURE:</span> Orca Dialect Pulse [Clan A-25 Cohesion Call]
<span class="term-bold">CONFIDENCE:</span> 96.0%
<span class="term-bold">DECODED COGNITIVE INTENT:</span>
"[HUNTING COHORT SYNCHRONY]: Flank formation established. Sub-surface velocity adjustment requested for juvenile member."
        `;
      }
    }, 600);
  });

  // Animated Spectrogram Waterfall
  function runSpectrogram() {
    const rect = canvas.parentElement.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    let t = 0;
    function draw() {
      t += 0.04;
      ctx.fillStyle = '#030303';
      ctx.fillRect(0, 0, rect.width, rect.height);

      const columns = 60;
      const colW = rect.width / columns;

      for (let i = 0; i < columns; i++) {
        const freqOffset = (i / columns) * Math.PI * 4;
        const wave = Math.sin(t * 2 + freqOffset) * Math.cos(t + i * 0.2);
        const barH = Math.abs(wave) * (rect.height * 0.85);

        const intensity = Math.min(255, Math.floor(Math.abs(wave) * 220 + 35));
        ctx.fillStyle = `rgb(${intensity}, ${intensity}, ${intensity})`;
        ctx.fillRect(i * colW, rect.height - barH, colW - 1, barH);
      }

      // Horizontal frequency guidelines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 1;
      [0.25, 0.5, 0.75].forEach((p) => {
        ctx.beginPath();
        ctx.moveTo(0, rect.height * p);
        ctx.lineTo(rect.width, rect.height * p);
        ctx.stroke();
      });

      animId = requestAnimationFrame(draw);
    }
    draw();
  }

  setTimeout(runSpectrogram, 40);

  return () => {
    if (animId) cancelAnimationFrame(animId);
  };
}

// =============================================================================
// PROTOTYPE 4: DACIAN-ERA: DIGISITE ARTIFACT READER (Archaeological Telemetry)
// =============================================================================

function mountDacianInteractive(container) {
  container.innerHTML = `
    <div class="proto-wrapper">
      <div class="proto-intro-box">
        <p class="proto-desc">
          Speculative digital archaeology system. Sweep the radio frequency dial to find, lock onto, and decode forgotten telemetry transmissions trapped in abandoned silicon strata.
        </p>
        <span class="proto-badge">Receiver: Node-WS</span>
      </div>

      <div class="proto-card">
        <div class="radio-dial-display">
          <span style="font-family:var(--font-mono); font-size:11px; color:var(--text-dim); margin-bottom:4px;">TUNER FREQUENCY</span>
          <div class="radio-freq-big" id="radioFreqDisplay">14.82 MHz</div>
          <div class="radio-lock-indicator">
            <span class="lock-dot" id="radioLockDot"></span>
            <span id="radioLockLabel">STATIC NOISE / SEARCHING</span>
          </div>
        </div>

        <div class="proto-slider-group" style="margin-top:10px;">
          <div class="proto-slider-header">
            <span class="proto-slider-label">RF Frequency Band Sweep (8.00 MHz - 24.00 MHz)</span>
            <span class="proto-slider-val" id="rfSliderVal">14.82 MHz</span>
          </div>
          <input type="range" id="radioSlider" class="proto-range" min="800" max="2400" value="1482">
        </div>

        <div class="proto-actions" style="margin-top:6px;">
          <button id="btnAutoTune" class="proto-btn proto-btn-primary">
            <span>Auto-Scan Archaeological Bands</span>
            <span>⚡</span>
          </button>
          <button id="btnLogArtifact" class="proto-btn">Log Artifact to Field Receiver</button>
        </div>
      </div>

      <div class="proto-card">
        <div class="proto-card-title">
          <span>Carrier Signal Waveform</span>
          <span id="carrierSignalStrength">STRENGTH: 94%</span>
        </div>
        <div class="proto-canvas-wrap" style="height: 140px;">
          <canvas id="dacianCanvas" style="width:100%; height:100%; display:block;"></canvas>
        </div>
      </div>

      <div class="proto-card">
        <div class="proto-card-title">
          <span>Decoded Silicon Artifact Stream</span>
          <span class="proto-badge" id="artifactSiteBadge">SECTOR 04-B</span>
        </div>
        <div class="proto-terminal" id="dacianTerminal">
<!-- Populated by JS -->
        </div>
      </div>
    </div>
  `;

  const slider = container.querySelector('#radioSlider');
  const freqDisplay = container.querySelector('#radioFreqDisplay');
  const sliderVal = container.querySelector('#rfSliderVal');
  const lockDot = container.querySelector('#radioLockDot');
  const lockLabel = container.querySelector('#radioLockLabel');
  const signalStrength = container.querySelector('#carrierSignalStrength');
  const terminal = container.querySelector('#dacianTerminal');
  const canvas = container.querySelector('#dacianCanvas');
  const btnAuto = container.querySelector('#btnAutoTune');
  const btnLog = container.querySelector('#btnLogArtifact');

  // Archaeological artifact nodes
  const TARGET_NODES = [
    { freq: 1145, name: 'Digisite Node #09: Corrupted Sensor Beacon', sector: 'SECTOR 01-A' },
    { freq: 1482, name: 'Digisite Node #42: Abandoned Cellular Handshake', sector: 'SECTOR 04-B' },
    { freq: 2104, name: 'Digisite Node #77: Thermal Relay Diagnostic Packet', sector: 'SECTOR 09-F' },
  ];

  let animId = null;
  let currentFreq = 1482;

  function updateRadio(val) {
    currentFreq = parseInt(val, 10);
    const mhz = (currentFreq / 100).toFixed(2);
    freqDisplay.textContent = `${mhz} MHz`;
    sliderVal.textContent = `${mhz} MHz`;

    // Check proximity to any target node
    let matched = null;
    let minDiff = 9999;
    TARGET_NODES.forEach((node) => {
      const diff = Math.abs(currentFreq - node.freq);
      if (diff < minDiff) {
        minDiff = diff;
        matched = node;
      }
    });

    if (minDiff <= 15) {
      // Locked onto signal
      lockDot.classList.add('locked');
      lockLabel.textContent = `CARRIER LOCKED: ${matched.name}`;
      lockLabel.style.color = '#22c55e';
      const pct = Math.floor(100 - minDiff * 4);
      signalStrength.textContent = `STRENGTH: ${pct}%`;

      terminal.innerHTML = `
<span class="term-green">[BROADCAST SYNC ESTABLISHED]</span> Synchronized via Node.js WebSocket.
<span class="term-bold">TARGET ARTIFACT:</span> ${matched.name}
<span class="term-bold">COORDINATES:</span> 44.4268° N, 26.1025° E (Digisite Stratum 3)
<span class="term-bold">PAYLOAD HEX:</span> <span class="term-cyan">0x5F41 0x7263 0x6869 0x7665 0x5F32 0x3032 0x36</span>
<span class="term-bold">MESSAGE FRAGMENT:</span>
"Telemetry log: Station operating on residual solar capacitors. Data links severed since 2024. If this packet is received, the physical antenna mast has collapsed."
<span class="term-dim">----------------------------------------------------------------------</span>
<span class="term-dim">Artifact ready to be recorded in persistent field archive.</span>
      `;
    } else {
      lockDot.classList.remove('locked');
      lockLabel.textContent = 'STATIC INTERFERENCE / SCANNING BANDS';
      lockLabel.style.color = 'var(--text-dim)';
      signalStrength.textContent = `STRENGTH: ${Math.max(4, Math.floor(20 - minDiff * 0.1))}%`;

      terminal.innerHTML = `
<span class="term-dim">[WHITE NOISE CARRIER]</span>
Scanning ${(currentFreq / 100).toFixed(2)} MHz... No coherent digital artifact locked.
Rotate tuner slider to locate archaeological resonance nodes (Hint: ~11.45 MHz, ~14.82 MHz, ~21.04 MHz).
      `;
    }
  }

  slider.addEventListener('input', (e) => {
    updateRadio(e.target.value);
  });

  btnAuto.addEventListener('click', () => {
    playMechanicalTick('click');
    const randomTarget = TARGET_NODES[Math.floor(Math.random() * TARGET_NODES.length)];
    slider.value = randomTarget.freq;
    updateRadio(randomTarget.freq);
  });

  btnLog.addEventListener('click', () => {
    playMechanicalTick('click');
    alert(`Artifact successfully logged to Field Receiver database!`);
  });

  updateRadio(1482);

  // Animated Oscilloscope Canvas
  function runOscilloscope() {
    const rect = canvas.parentElement.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    let t = 0;
    function draw() {
      t += 0.05;
      ctx.fillStyle = '#020202';
      ctx.fillRect(0, 0, rect.width, rect.height);

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, rect.height / 2);
      ctx.lineTo(rect.width, rect.height / 2);
      ctx.stroke();

      const isLocked = lockDot.classList.contains('locked');
      ctx.strokeStyle = isLocked ? '#22c55e' : '#ffffff';
      ctx.lineWidth = isLocked ? 2 : 1.2;
      ctx.beginPath();

      for (let x = 0; x < rect.width; x += 2) {
        let y = rect.height / 2;
        if (isLocked) {
          y += Math.sin(x * 0.06 + t * 4) * 28 * Math.cos(t * 0.5);
        } else {
          y += (Math.random() - 0.5) * 22 + Math.sin(x * 0.15 + t * 6) * 6;
        }
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      animId = requestAnimationFrame(draw);
    }
    draw();
  }

  setTimeout(runOscilloscope, 40);

  return () => {
    if (animId) cancelAnimationFrame(animId);
  };
}

// =============================================================================
// PROTOTYPE 5: PHYSIOGNOMY PROFILING MACHINE (NEXUS SCAN Biometric Satire)
// =============================================================================

function mountPhysiognomyInteractive(container) {
  container.innerHTML = `
    <div class="proto-wrapper">
      <div class="proto-intro-box">
        <p class="proto-desc">
          NEXUS SCAN: A satirical algorithmic probe into the resurgence of 19th-century phrenology through facial landmark meshes and automated corporate style categorization.
        </p>
        <span class="proto-badge">NEXUS-CALIPER v9</span>
      </div>

      <div class="proto-card">
        <div class="proto-card-title">
          <span>Camera Reticle & Facial Wireframe</span>
          <span style="color:#22c55e;">FEED: SIMULATED VISION MESH</span>
        </div>
        
        <div class="biometric-reticle-wrap">
          <canvas id="reticleCanvas" style="width:100%; height:100%; display:block;"></canvas>
          <div class="reticle-hud-overlay">
            <div>FOV: 78.4° HORIZONTAL</div>
            <div>MESH DENSITY: 468 FACEMESH POINTS</div>
            <div id="reticleDistance">DISTANCE: 0.84 METERS</div>
          </div>
          <div class="reticle-hud-right">
            <div>EST. HEIGHT: <span id="reticleHeight">182.4 CM</span></div>
            <div>SYMMETRY: <span id="reticleSymmetry">91.8%</span></div>
          </div>
        </div>

        <div class="proto-actions" style="margin-top:10px;">
          <button id="btnScanMesh" class="proto-btn proto-btn-primary">
            <span>Execute Caliper Measurement</span>
            <span>✦</span>
          </button>
          <button id="btnRandomizeFace" class="proto-btn">Simulate Subject Jitter</button>
        </div>
      </div>

      <div class="proto-card">
        <div class="proto-card-title">
          <span>Biometric Caliper Tuning</span>
          <span style="color:var(--text-dim);">Subject Parameters</span>
        </div>
        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:14px;">
          <div class="proto-slider-group">
            <div class="proto-slider-header">
              <span class="proto-slider-label">Cranial Cephalic Index</span>
              <span class="proto-slider-val" id="cephalicVal">78.2</span>
            </div>
            <input type="range" id="sliderCephalic" class="proto-range" min="65" max="95" value="78">
          </div>
          <div class="proto-slider-group">
            <div class="proto-slider-header">
              <span class="proto-slider-label">Jawline Severity Quotient</span>
              <span class="proto-slider-val" id="jawlineVal">82%</span>
            </div>
            <input type="range" id="sliderJawline" class="proto-range" min="20" max="100" value="82">
          </div>
        </div>
      </div>

      <div class="proto-card">
        <div class="proto-card-title">
          <span>Satirical Biometric Dossier</span>
          <span class="proto-badge" id="dossierBadge">NEXUS DOSSIER #804</span>
        </div>
        <div class="proto-terminal" id="physiognomyTerminal">
<span class="term-cyan">[NEXUS-SCAN 2026 INITIALIZED]</span>
Subject calibrated in front of optic mesh. Press "Execute Caliper Measurement" to compile psychological categorization.
        </div>
      </div>
    </div>
  `;

  const canvas = container.querySelector('#reticleCanvas');
  const btnScan = container.querySelector('#btnScanMesh');
  const btnRand = container.querySelector('#btnRandomizeFace');
  const terminal = container.querySelector('#physiognomyTerminal');
  const sliderCephalic = container.querySelector('#sliderCephalic');
  const sliderJawline = container.querySelector('#sliderJawline');
  const cephalicVal = container.querySelector('#cephalicVal');
  const jawlineVal = container.querySelector('#jawlineVal');
  const reticleHeight = container.querySelector('#reticleHeight');
  const reticleSymmetry = container.querySelector('#reticleSymmetry');
  const dossierBadge = container.querySelector('#dossierBadge');

  let animId = null;
  let faceJitter = 0;

  sliderCephalic.addEventListener('input', () => {
    cephalicVal.textContent = sliderCephalic.value;
  });
  sliderJawline.addEventListener('input', () => {
    jawlineVal.textContent = `${sliderJawline.value}%`;
  });

  btnRand.addEventListener('click', () => {
    playMechanicalTick('click');
    faceJitter += 10;
    reticleHeight.textContent = `${(165 + Math.random() * 25).toFixed(1)} CM`;
    reticleSymmetry.textContent = `${(80 + Math.random() * 18).toFixed(1)}%`;
  });

  const ARCHETYPES = [
    {
      title: 'Avant-Garde Nihilist prone to Unsolicited Framework Rewrites',
      risk: 'LOW COMPLIANCE',
      traits: ['Prefers obscure European typography', 'Scoffs at semantic HTML', 'Drinks unroasted espresso in brutalist ceramics'],
      verdict: 'Recommend assigning to non-critical internal tools.'
    },
    {
      title: 'Corporate Technocrat with Hyper-Specific Beverage Preferences',
      risk: 'ELEVATED BUREAUCRATIC RIGIDITY',
      traits: ['Uses acronyms that do not exist', 'Maintains 42 browser tabs on cognitive pacing', 'Believes quarterly OKRs are a spiritual practice'],
      verdict: 'Ideal candidate for middle-management status sync committee.'
    },
    {
      title: 'Subterranean Creative Technologist living on grant funding',
      risk: 'CHAOTIC INTELLECTUAL DRIFT',
      traits: ['Spends 3 weeks calibrating cursor shaders', 'Has strong opinions on 1970s synthesizers', 'Leaves documentation in cryptic poetry'],
      verdict: 'Do not expose to VC presentations.'
    }
  ];

  btnScan.addEventListener('click', () => {
    playMechanicalTick('click');
    const randomArchetype = ARCHETYPES[Math.floor(Math.random() * ARCHETYPES.length)];
    const dNum = Math.floor(100 + Math.random() * 900);
    dossierBadge.textContent = `NEXUS DOSSIER #${dNum}`;

    terminal.innerHTML = `
<span class="term-green">[BIOMETRIC CALIPER CLASSIFICATION COMPLETE]</span>
<span class="term-bold">PRESUMED ARCHETYPE:</span> <span class="term-cyan">${randomArchetype.title}</span>
<span class="term-bold">SECURITY EVALUATION:</span> ${randomArchetype.risk}
<span class="term-bold">CALIPER METRICS:</span> Cephalic index ${sliderCephalic.value} / Jawline severity ${sliderJawline.value}%
<span class="term-bold">DIAGNOSTIC BEHAVIORAL TRAITS:</span>
${randomArchetype.traits.map(t => `  • ${t}`).join('\n')}
<span class="term-dim">----------------------------------------------------------------------</span>
<span class="term-bold">SATIRICAL VERDICT:</span> "${randomArchetype.verdict}"
    `;
  });

  function drawReticle() {
    const rect = canvas.parentElement.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    let t = 0;
    function render() {
      t += 0.03;
      ctx.fillStyle = '#020202';
      ctx.fillRect(0, 0, rect.width, rect.height);

      const cx = rect.width / 2;
      const cy = rect.height / 2;

      // Targeting crosshairs
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(cx - 80, cy); ctx.lineTo(cx + 80, cy);
      ctx.moveTo(cx, cy - 70); ctx.lineTo(cx, cy + 70);
      ctx.stroke();

      // Facial oval
      const cVal = parseFloat(sliderCephalic.value) / 78;
      const jVal = parseFloat(sliderJawline.value) / 80;
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.ellipse(cx, cy, 45 * cVal, 60 * jVal, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Mesh landmarks
      const points = [
        { x: cx - 20, y: cy - 15 }, // left eye
        { x: cx + 20, y: cy - 15 }, // right eye
        { x: cx, y: cy + 5 },       // nose tip
        { x: cx - 18, y: cy + 30 }, // mouth left
        { x: cx + 18, y: cy + 30 }, // mouth right
      ];

      ctx.fillStyle = '#22c55e';
      points.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
        ctx.fill();
      });

      // Scanning caliper line
      const scanY = cy + Math.sin(t * 2) * 55;
      ctx.strokeStyle = 'rgba(34, 197, 94, 0.6)';
      ctx.beginPath();
      ctx.moveTo(cx - 50, scanY);
      ctx.lineTo(cx + 50, scanY);
      ctx.stroke();

      animId = requestAnimationFrame(render);
    }
    render();
  }

  setTimeout(drawReticle, 40);

  return () => {
    if (animId) cancelAnimationFrame(animId);
  };
}

// =============================================================================
// PROTOTYPE 6: GOLDFISH ATGRAVITY & QUAD DREAM (Generative Fluid Biophysics)
// =============================================================================

function mountGoldfishInteractive(container) {
  container.innerHTML = `
    <div class="proto-wrapper">
      <div class="proto-intro-box">
        <p class="proto-desc">
          Biophysical fluid simulation and synthetic organism memory. Organisms swim in non-Euclidean dream dimensions where gravitational vectors can be computationally inverted.
        </p>
        <span class="proto-badge">Tone.js & WebGL Synesthesia</span>
      </div>

      <div class="proto-card">
        <div class="proto-card-title">
          <span>Interactive Fluid Canvas</span>
          <span id="gravityVectorLabel" style="color:#ffffff;">GRAVITY: 1.0G (DOWN)</span>
        </div>
        <div class="proto-canvas-wrap" style="height: 220px; cursor: crosshair;">
          <canvas id="goldfishCanvas" style="width:100%; height:100%; display:block;"></canvas>
        </div>
        <div style="font-family:var(--font-mono); font-size:10.5px; color:var(--text-dim); margin-top:2px;">
          ✦ Click or drag anywhere on the tank above to spawn fluid ripples & attract fish.
        </div>
      </div>

      <div class="proto-card">
        <div class="proto-card-title">
          <span>Biophysical Vector Modulation</span>
          <span style="color:var(--text-dim);">Gravitational Parameters</span>
        </div>
        <div class="proto-actions">
          <button id="btnInvertGravity" class="proto-btn proto-btn-primary">
            <span>Invert Gravity (Anti-Gravity Mode)</span>
            <span>↺</span>
          </button>
          <button id="btnZeroGravity" class="proto-btn">Zero-G Drift</button>
          <button id="btnSpawnFish" class="proto-btn">+ Spawn Organism</button>
        </div>
      </div>

      <div class="proto-card">
        <div class="proto-card-title">
          <span>Algorithmic Synthesizer Output</span>
          <span class="proto-badge">TONE.JS AUDIO CHIME</span>
        </div>
        <div class="proto-terminal" id="goldfishTerminal">
<span class="term-cyan">[FLUID KINEMATICS ACTIVE]</span>
Organism swim velocities directly modulate generative acoustic frequencies.
Click on the fluid to disturb the aquatic equilibrium.
        </div>
      </div>
    </div>
  `;

  const canvas = container.querySelector('#goldfishCanvas');
  const btnInvert = container.querySelector('#btnInvertGravity');
  const btnZero = container.querySelector('#btnZeroGravity');
  const btnSpawn = container.querySelector('#btnSpawnFish');
  const gravLabel = container.querySelector('#gravityVectorLabel');
  const terminal = container.querySelector('#goldfishTerminal');

  let gravity = 0.35;
  let animId = null;

  // Sound chime when fish interacts
  function playFishChime(freq = 432) {
    if (!state.soundEnabled) return;
    initAudio();
    if (!state.audioCtx) return;
    const ctx = state.audioCtx;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.5, now + 0.12);
    gain.gain.setValueAtTime(0.04, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.15);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.15);
  }

  btnInvert.addEventListener('click', () => {
    playMechanicalTick('click');
    gravity = -gravity;
    gravLabel.textContent = gravity < 0 ? 'GRAVITY: -1.0G (INVERTED ANTI-GRAVITY)' : 'GRAVITY: 1.0G (DOWN)';
    gravLabel.style.color = gravity < 0 ? '#38bdf8' : '#ffffff';
    playFishChime(520);
    terminal.innerHTML = `<span class="term-cyan">[GRAVITATIONAL INVERSION]</span> Fluid vector flipped to ${gravity < 0 ? '-1.0G' : '1.0G'}. Synthetic organism kinematics recalibrating.`;
  });

  btnZero.addEventListener('click', () => {
    playMechanicalTick('click');
    gravity = 0;
    gravLabel.textContent = 'GRAVITY: 0.0G (ZERO-G DREAM DRIFT)';
    gravLabel.style.color = '#a855f7';
    playFishChime(320);
    terminal.innerHTML = `<span class="term-cyan">[ZERO GRAVITY]</span> Buoyancy neutral. Organisms swimming freely in 2D dream plane.`;
  });

  const fishList = [];
  const ripples = [];

  function createFish(x, y) {
    fishList.push({
      x: x || 100,
      y: y || 100,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      history: [],
      hue: Math.random() > 0.5 ? '#ffffff' : '#cbd5e1'
    });
  }

  for (let k = 0; k < 6; k++) {
    createFish(50 + k * 40, 60 + k * 20);
  }

  btnSpawn.addEventListener('click', () => {
    playMechanicalTick('click');
    createFish(canvas.width / 4, canvas.height / 4);
    playFishChime(640);
  });

  canvas.addEventListener('pointerdown', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    ripples.push({ x: mx, y: my, r: 2, maxR: 45, alpha: 1 });
    playFishChime(440 + Math.random() * 200);

    // Attract fish to click point
    fishList.forEach((f) => {
      f.vx += (mx - f.x) * 0.04;
      f.vy += (my - f.y) * 0.04;
    });
  });

  function runSimulation() {
    const rect = canvas.parentElement.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    function update() {
      ctx.fillStyle = '#030303';
      ctx.fillRect(0, 0, rect.width, rect.height);

      // Ripples
      for (let i = ripples.length - 1; i >= 0; i--) {
        const rip = ripples[i];
        rip.r += 1.2;
        rip.alpha -= 0.025;
        if (rip.alpha <= 0) {
          ripples.splice(i, 1);
        } else {
          ctx.strokeStyle = `rgba(255, 255, 255, ${rip.alpha * 0.4})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(rip.x, rip.y, rip.r, 0, Math.PI * 2);
          ctx.stroke();
        }
      }

      // Fish Organisms
      fishList.forEach((f) => {
        f.vy += gravity * 0.08;
        f.vx += (Math.random() - 0.5) * 0.3;
        f.vy += (Math.random() - 0.5) * 0.3;
        f.vx *= 0.96;
        f.vy *= 0.96;

        f.x += f.vx;
        f.y += f.vy;

        // Wall bounds
        if (f.x < 15) { f.x = 15; f.vx = -f.vx * 0.8; }
        if (f.x > rect.width - 15) { f.x = rect.width - 15; f.vx = -f.vx * 0.8; }
        if (f.y < 15) { f.y = 15; f.vy = -f.vy * 0.8; }
        if (f.y > rect.height - 15) { f.y = rect.height - 15; f.vy = -f.vy * 0.8; }

        // Trail history
        f.history.unshift({ x: f.x, y: f.y });
        if (f.history.length > 12) f.history.pop();

        // Draw flowing tail
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        f.history.forEach((pt, idx) => {
          if (idx === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        });
        ctx.stroke();

        // Fish Body
        ctx.fillStyle = f.hue;
        ctx.beginPath();
        ctx.arc(f.x, f.y, 3.5, 0, Math.PI * 2);
        ctx.fill();
      });

      animId = requestAnimationFrame(update);
    }
    update();
  }

  setTimeout(runSimulation, 40);

  return () => {
    if (animId) cancelAnimationFrame(animId);
  };
}

// =============================================================================
// PROTOTYPE 7: TO THE FUTURE WORLD: NEUROSPACE (Synaptic Memory Compression)
// =============================================================================

function mountNeurospaceInteractive(container) {
  container.innerHTML = `
    <div class="proto-wrapper">
      <div class="proto-intro-box">
        <p class="proto-desc">
          NeuroSpace: Cognitive memory archiving framework. Models subjective human memories as compressed synaptic mathematical packets and tests recall degradation across loss tolerances.
        </p>
        <span class="proto-badge">Synaptic Protocol v2.8</span>
      </div>

      <div class="proto-card">
        <div class="proto-card-title">
          <span>Select Memory Packet to Compress</span>
          <span style="color:var(--text-dim);">Episodic Recall Subject</span>
        </div>
        <div class="proto-chips">
          <button class="proto-chip active" id="chipMem1">Memory #01: Childhood Monsoons (1998)</button>
          <button class="proto-chip" id="chipMem2">Memory #02: First Departure Flight (2014)</button>
          <button class="proto-chip" id="chipMem3">Memory #03: The Unspoken Apology (2022)</button>
        </div>

        <div class="proto-slider-group" style="margin-top:10px;">
          <div class="proto-slider-header">
            <span class="proto-slider-label">Synaptic Compression Ratio (1.0x Raw Recall → 16.0x Sparse Matrix)</span>
            <span class="proto-slider-val" id="compressionRatioVal">4.2x COMPRESSION</span>
          </div>
          <input type="range" id="sliderCompression" class="proto-range" min="10" max="160" value="42">
        </div>
      </div>

      <div class="proto-card">
        <div class="proto-card-title">
          <span>Synaptic Lattice Density Visualization</span>
          <span id="synapseNodeCount">ACTIVE SYNAPSES: 128 NODES</span>
        </div>
        <div class="proto-canvas-wrap" style="height: 150px;">
          <canvas id="neuroCanvas" style="width:100%; height:100%; display:block;"></canvas>
        </div>
      </div>

      <div class="proto-card">
        <div class="proto-card-title">
          <span>Reconstructed Cognitive Recall Stream</span>
          <span class="proto-badge" id="memorySizeBadge">SIZE: 4.2 KB</span>
        </div>
        <div class="proto-terminal" id="neuroTerminal">
<!-- Populated by JS -->
        </div>
      </div>
    </div>
  `;

  const slider = container.querySelector('#sliderCompression');
  const ratioVal = container.querySelector('#compressionRatioVal');
  const nodeCountLabel = container.querySelector('#synapseNodeCount');
  const sizeBadge = container.querySelector('#memorySizeBadge');
  const terminal = container.querySelector('#neuroTerminal');
  const canvas = container.querySelector('#neuroCanvas');
  const chip1 = container.querySelector('#chipMem1');
  const chip2 = container.querySelector('#chipMem2');
  const chip3 = container.querySelector('#chipMem3');

  let activeMem = 1;
  let animId = null;

  const MEMORIES = {
    1: {
      raw: "The afternoon rain beat against the rusted tin veranda in Calcutta. The smell of wet clay rose from the road while my grandmother peeled oranges by the kerosene lamp. Time felt unquantifiable.",
      medium: "Rain against tin roof in Calcutta. Wet clay road scent. Grandmother peeling citrus by lantern light. Time feels suspended.",
      sparse: "[COORDINATE: 1998 CALCUTTA] [PRECIPITATION: HIGH] [CITRUS / KEROSENE ODOR] [AFFECTION RETENTION: 92%]"
    },
    2: {
      raw: "Looking out through the scratched double-pane window at 30,000 feet. The city lights of Bombay receded into an abstract grid of amber dust. I gripped the armrest and knew nothing would be familiar again.",
      medium: "Airplane window at altitude. Bombay streetlights receding into amber dust grid. Gripping armrest before unknown horizon.",
      sparse: "[COORDINATE: 2014 AIRSPACE] [DEPARTURE TRANSIT] [AMBER GROUND GRID] [NOSTALGIA SNR: 0.74]"
    },
    3: {
      raw: "We stood on the rain-slicked crosswalk under the flickering neon sign. I had the words prepared for three weeks, but when you looked at me, my throat locked up. We just said goodbye instead.",
      medium: "Wet crosswalk under neon sign. Words rehearsed for weeks remained unsaid. A formal goodbye instead of the truth.",
      sparse: "[COORDINATE: 2022 INTERSECTION] [UNSPOKEN VOCALIZATION: SUPPRESSED] [EMOTIONAL LOSS FACTOR: 0.88]"
    }
  };

  function updateRecall() {
    const ratio = parseFloat(slider.value) / 10;
    ratioVal.textContent = `${ratio.toFixed(1)}x COMPRESSION`;
    const memData = MEMORIES[activeMem];

    let recallText = '';
    if (ratio < 3.5) {
      recallText = `<span class="term-bold">RAW SENSORY RECALL (HIGH FIDELITY):</span>\n"${memData.raw}"`;
      sizeBadge.textContent = `${(18.4 / ratio).toFixed(1)} KB`;
      nodeCountLabel.textContent = `ACTIVE SYNAPSES: ${Math.floor(256 / ratio)} NODES`;
    } else if (ratio < 9.0) {
      recallText = `<span class="term-cyan">SYNAPSE QUANTIZATION (INTERMEDIATE LOSS):</span>\n"${memData.medium}"\n\n<span class="term-dim">Sensory adjectives discarded; core episodic sequence preserved.</span>`;
      sizeBadge.textContent = `${(18.4 / ratio).toFixed(1)} KB`;
      nodeCountLabel.textContent = `ACTIVE SYNAPSES: ${Math.floor(256 / ratio)} NODES`;
    } else {
      recallText = `<span class="term-green">EXTREME SYNAPTIC REDUCTION (STRUCTURAL TELEMETRY):</span>\n${memData.sparse}\n\n<span class="term-red">Subjective emotional texture deleted to ensure infinite biological archival lifetime.</span>`;
      sizeBadge.textContent = `${(18.4 / ratio).toFixed(1)} KB`;
      nodeCountLabel.textContent = `ACTIVE SYNAPSES: ${Math.floor(256 / ratio)} NODES`;
    }

    terminal.innerHTML = recallText;
  }

  [chip1, chip2, chip3].forEach((c, idx) => {
    c.addEventListener('click', () => {
      playMechanicalTick('click');
      activeMem = idx + 1;
      [chip1, chip2, chip3].forEach((b, bIdx) => {
        b.style.background = bIdx + 1 === activeMem ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.04)';
        b.style.color = bIdx + 1 === activeMem ? '#fff' : 'var(--text-muted)';
      });
      updateRecall();
    });
  });

  slider.addEventListener('input', updateRecall);
  updateRecall();

  function drawSynapseNetwork() {
    const rect = canvas.parentElement.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    let t = 0;
    function render() {
      t += 0.03;
      ctx.fillStyle = '#020202';
      ctx.fillRect(0, 0, rect.width, rect.height);

      const ratio = parseFloat(slider.value) / 10;
      const count = Math.max(8, Math.floor(35 / (ratio * 0.35)));

      const nodes = [];
      for (let k = 0; k < count; k++) {
        const nx = ((Math.sin(k * 1.8 + t * 0.2) * 0.45) + 0.5) * rect.width;
        const ny = ((Math.cos(k * 2.3 + t * 0.15) * 0.4) + 0.5) * rect.height;
        nodes.push({ x: nx, y: ny });
      }

      ctx.strokeStyle = `rgba(255, 255, 255, ${Math.max(0.08, 0.35 / ratio)})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      nodes.forEach((n1, i) => {
        nodes.forEach((n2, j) => {
          if (i < j && Math.hypot(n1.x - n2.x, n1.y - n2.y) < 90) {
            ctx.moveTo(n1.x, n1.y);
            ctx.lineTo(n2.x, n2.y);
          }
        });
      });
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      nodes.forEach(n => {
        ctx.beginPath();
        ctx.arc(n.x, n.y, 2.5, 0, Math.PI * 2);
        ctx.fill();
      });

      animId = requestAnimationFrame(render);
    }
    render();
  }

  setTimeout(drawSynapseNetwork, 40);

  return () => {
    if (animId) cancelAnimationFrame(animId);
  };
}

// =============================================================================
// PROTOTYPE 8: MMOW (Shared Virtual World & Spatial Network Commons)
// =============================================================================

function mountMMOWInteractive(container) {
  container.innerHTML = `
    <div class="proto-wrapper">
      <div class="proto-intro-box">
        <p class="proto-desc">
          Open-world spatial network commons. Drag to navigate across the infinite 2D plane, observe simulated real-time peer vectors, and click to drop persistent spatial waypoints.
        </p>
        <span class="proto-badge">Peer Commons v1.4</span>
      </div>

      <div class="proto-card">
        <div class="spatial-hud">
          <div>COORDINATES: <span class="spatial-coords" id="mmowCoords">X: 000, Y: 000</span></div>
          <div>ACTIVE PEERS ONLINE: <span style="color:#22c55e;">14 NODES</span></div>
        </div>

        <div class="proto-canvas-wrap" style="height: 220px; cursor: grab;">
          <canvas id="mmowCanvas" style="width:100%; height:100%; display:block;"></canvas>
        </div>

        <div class="proto-actions" style="margin-top:10px;">
          <button id="btnDropBeacon" class="proto-btn proto-btn-primary">
            <span>Drop Persistent Beacon</span>
            <span>📍</span>
          </button>
          <button id="btnCenterOrigin" class="proto-btn">Return to Origin (0,0)</button>
        </div>
      </div>

      <div class="proto-card">
        <div class="proto-card-title">
          <span>Spatial Network Log</span>
          <span class="proto-badge">COMMONS LOG</span>
        </div>
        <div class="proto-terminal" id="mmowTerminal">
<span class="term-cyan">[SPATIAL PEER COMMONS CONNECTED]</span>
Drag the canvas above to traverse coordinates. Click to place persistent geometric beacons.
        </div>
      </div>
    </div>
  `;

  const canvas = container.querySelector('#mmowCanvas');
  const coordsLabel = container.querySelector('#mmowCoords');
  const btnBeacon = container.querySelector('#btnDropBeacon');
  const btnCenter = container.querySelector('#btnCenterOrigin');
  const terminal = container.querySelector('#mmowTerminal');

  let panX = 0;
  let panY = 0;
  let isDragging = false;
  let lastMouseX = 0;
  let lastMouseY = 0;
  let animId = null;

  const beacons = [
    { x: 40, y: -30, text: 'COMMONS EMBASSY' },
    { x: -120, y: 80, text: 'ARCHIVE VAULT' },
  ];

  // Simulated peer avatars
  const peers = [
    { x: 30, y: 40, label: 'peer-99', vx: 0.4, vy: 0.2 },
    { x: -80, y: -60, label: 'peer-12', vx: -0.3, vy: 0.5 },
    { x: 140, y: -90, label: 'peer-47', vx: 0.2, vy: -0.4 },
  ];

  canvas.addEventListener('pointerdown', (e) => {
    isDragging = true;
    canvas.style.cursor = 'grabbing';
    lastMouseX = e.clientX;
    lastMouseY = e.clientY;
  });

  window.addEventListener('pointermove', (e) => {
    if (!isDragging) return;
    const dx = e.clientX - lastMouseX;
    const dy = e.clientY - lastMouseY;
    lastMouseX = e.clientX;
    lastMouseY = e.clientY;
    panX += dx;
    panY += dy;
    coordsLabel.textContent = `X: ${Math.round(-panX)}, Y: ${Math.round(-panY)}`;
  });

  window.addEventListener('pointerup', () => {
    if (isDragging) {
      isDragging = false;
      canvas.style.cursor = 'grab';
    }
  });

  btnCenter.addEventListener('click', () => {
    playMechanicalTick('click');
    panX = 0;
    panY = 0;
    coordsLabel.textContent = 'X: 000, Y: 000';
  });

  btnBeacon.addEventListener('click', () => {
    playMechanicalTick('click');
    const bx = Math.round(-panX);
    const by = Math.round(-panY);
    const label = `BEACON [${bx}, ${by}]`;
    beacons.push({ x: bx, y: by, text: label });
    terminal.innerHTML = `
<span class="term-green">[PERSISTENT BEACON BROADCAST]</span>
Beacon registered on spatial coordinate [X: ${bx}, Y: ${by}].
Broadcasting to all 14 active peers across the mesh network.
    `;
  });

  function runSpatialCanvas() {
    const rect = canvas.parentElement.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    function render() {
      ctx.fillStyle = '#030303';
      ctx.fillRect(0, 0, rect.width, rect.height);

      const cx = rect.width / 2 + panX;
      const cy = rect.height / 2 + panY;

      // Coordinate Grid Lines
      const gridSpacing = 40;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 1;

      const startX = cx % gridSpacing;
      for (let x = startX; x < rect.width; x += gridSpacing) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, rect.height);
        ctx.stroke();
      }

      const startY = cy % gridSpacing;
      for (let y = startY; y < rect.height; y += gridSpacing) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(rect.width, y);
        ctx.stroke();
      }

      // Origin Axes
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.beginPath();
      ctx.moveTo(cx, 0); ctx.lineTo(cx, rect.height);
      ctx.moveTo(0, cy); ctx.lineTo(rect.width, cy);
      ctx.stroke();

      // Origin Marker
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(cx - 3, cy - 3, 6, 6);
      ctx.font = '10px "JetBrains Mono"';
      ctx.fillStyle = 'rgba(255,255,255,0.6)';
      ctx.fillText('(0,0)', cx + 8, cy + 12);

      // Beacons
      beacons.forEach((b) => {
        const bx = cx + b.x;
        const by = cy + b.y;
        ctx.strokeStyle = '#38bdf8';
        ctx.strokeRect(bx - 5, by - 5, 10, 10);
        ctx.fillStyle = '#38bdf8';
        ctx.fillText(b.text, bx + 10, by + 4);
      });

      // Peer Avatars
      peers.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -200 || p.x > 200) p.vx = -p.vx;
        if (p.y < -150 || p.y > 150) p.vy = -p.vy;

        const px = cx + p.x;
        const py = cy + p.y;
        ctx.fillStyle = '#22c55e';
        ctx.beginPath();
        ctx.arc(px, py, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = 'rgba(255,255,255,0.5)';
        ctx.fillText(p.label, px + 7, py + 3);
      });

      animId = requestAnimationFrame(render);
    }
    render();
  }

  setTimeout(runSpatialCanvas, 40);

  return () => {
    if (animId) cancelAnimationFrame(animId);
  };
}

// =============================================================================
// PROTOTYPE 9: EC-AK-OU (Phonetic Feedback & Acoustic Decay)
// =============================================================================

function mountEcakouInteractive(container) {
  container.innerHTML = `
    <div class="proto-wrapper">
      <div class="proto-intro-box">
        <p class="proto-desc">
          Sound art and acoustic decay experiment. Simulates virtual resonant geometries and multi-tap delay networks to explore how spoken phonemes dissolve into ambient reverberation.
        </p>
        <span class="proto-badge">Acoustic Decay v2.2</span>
      </div>

      <div class="proto-card">
        <div class="proto-card-title">
          <span>Resonant Virtual Chamber Geometry</span>
          <span style="color:var(--text-dim);">Chamber Volume: 4,200 m³</span>
        </div>
        <div class="proto-chips">
          <button class="proto-chip active" id="chipChamber1">Cathedral Gallery [RT60: 5.4s]</button>
          <button class="proto-chip" id="chipChamber2">Subterranean Concrete Silo [RT60: 8.2s]</button>
          <button class="proto-chip" id="chipChamber3">Silicon Resonance Duct [RT60: 1.8s]</button>
        </div>

        <div class="proto-slider-group" style="margin-top:10px;">
          <div class="proto-slider-header">
            <span class="proto-slider-label">Feedback Decay Duration</span>
            <span class="proto-slider-val" id="decayDurationVal">5.4s DECAY</span>
          </div>
          <input type="range" id="sliderDecay" class="proto-range" min="10" max="85" value="54">
        </div>

        <div class="proto-actions" style="margin-top:8px;">
          <button id="btnTriggerPhoneme1" class="proto-btn proto-btn-primary">
            <span>Trigger Phoneme: "E-CHO"</span>
            <span>▶</span>
          </button>
          <button id="btnTriggerPhoneme2" class="proto-btn">Trigger: "A-KOU"</button>
          <button id="btnTriggerPhoneme3" class="proto-btn">Trigger: "RE-VERB"</button>
        </div>
      </div>

      <div class="proto-card">
        <div class="proto-card-title">
          <span>Acoustic Waveform Decay Monitor</span>
          <span id="reverbPeakLabel">PEAK AMPLITUDE: -14 dB</span>
        </div>
        <div class="proto-canvas-wrap" style="height: 150px;">
          <canvas id="ecakouCanvas" style="width:100%; height:100%; display:block;"></canvas>
        </div>
      </div>

      <div class="proto-card">
        <div class="proto-card-title">
          <span>Phonetic Entropy Stream</span>
          <span class="proto-badge">REVERB CONVOLVER</span>
        </div>
        <div class="proto-terminal" id="ecakouTerminal">
<span class="term-cyan">[VIRTUAL RESONANT CHAMBER INITIALIZED]</span>
Click any "Trigger Phoneme" button above to synthesize acoustic reflections.
        </div>
      </div>
    </div>
  `;

  const slider = container.querySelector('#sliderDecay');
  const decayVal = container.querySelector('#decayDurationVal');
  const btn1 = container.querySelector('#btnTriggerPhoneme1');
  const btn2 = container.querySelector('#btnTriggerPhoneme2');
  const btn3 = container.querySelector('#btnTriggerPhoneme3');
  const chip1 = container.querySelector('#chipChamber1');
  const chip2 = container.querySelector('#chipChamber2');
  const chip3 = container.querySelector('#chipChamber3');
  const terminal = container.querySelector('#ecakouTerminal');
  const canvas = container.querySelector('#ecakouCanvas');

  let animId = null;
  let activeChamber = 1;
  let decayIntensity = 0;

  function updateDecayText() {
    const sec = (parseFloat(slider.value) / 10).toFixed(1);
    decayVal.textContent = `${sec}s DECAY`;
  }
  slider.addEventListener('input', updateDecayText);

  function playAcousticDecay(phonemeName, basePitch = 280) {
    decayIntensity = 1.0;
    initAudio();
    if (!state.audioCtx) return;
    const ctx = state.audioCtx;
    const now = ctx.currentTime;
    const decayTime = parseFloat(slider.value) / 10;

    // Multi-tap reverberant decay synthesis
    const taps = 5;
    for (let k = 0; k < taps; k++) {
      const delay = k * 0.14;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(basePitch * (1 + k * 0.05), now + delay);
      osc.frequency.exponentialRampToValueAtTime(basePitch * 0.5, now + delay + 0.3);

      const tapGain = (0.12 / (k + 1)) * (decayTime / 5);
      gain.gain.setValueAtTime(tapGain, now + delay);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + delay + 0.35 + (decayTime * 0.2));

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + delay);
      osc.stop(now + delay + 0.35 + (decayTime * 0.2));
    }

    terminal.innerHTML = `
<span class="term-green">[PHONETIC IMPULSE INJECTED]</span>
Phoneme "${phonemeName}" dispatched into ${activeChamber === 1 ? 'Cathedral Gallery' : activeChamber === 2 ? 'Subterranean Silo' : 'Silicon Duct'}.
Decay duration: <span class="term-cyan">${decayTime}s</span>.
Phonetic clarity index: <span class="term-bold">${Math.max(12, Math.floor(100 - decayTime * 12))}%</span>.
The spoken syllables break down into diffuse harmonic wall reflections.
    `;
  }

  btn1.addEventListener('click', () => playAcousticDecay('E-CHO', 340));
  btn2.addEventListener('click', () => playAcousticDecay('A-KOU', 260));
  btn3.addEventListener('click', () => playAcousticDecay('RE-VERB', 420));

  [chip1, chip2, chip3].forEach((c, idx) => {
    c.addEventListener('click', () => {
      playMechanicalTick('click');
      activeChamber = idx + 1;
      [chip1, chip2, chip3].forEach((b, bIdx) => {
        b.style.background = bIdx + 1 === activeChamber ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.04)';
        b.style.color = bIdx + 1 === activeChamber ? '#fff' : 'var(--text-muted)';
      });
      slider.value = activeChamber === 1 ? 54 : activeChamber === 2 ? 82 : 18;
      updateDecayText();
    });
  });

  function runWaveform() {
    const rect = canvas.parentElement.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    let t = 0;
    function render() {
      t += 0.04;
      ctx.fillStyle = '#020202';
      ctx.fillRect(0, 0, rect.width, rect.height);

      if (decayIntensity > 0.01) {
        decayIntensity *= 0.985;
      }

      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.3;
      ctx.beginPath();

      for (let x = 0; x < rect.width; x += 2) {
        const env = Math.sin(x * 0.05 + t * 4) * Math.exp(-x / (rect.width * 0.8));
        const amp = 35 * (0.15 + decayIntensity * 0.85);
        const y = rect.height / 2 + env * amp;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      animId = requestAnimationFrame(render);
    }
    render();
  }

  setTimeout(runWaveform, 40);

  return () => {
    if (animId) cancelAnimationFrame(animId);
  };
}

// =============================================================================
// GLOBAL EVENT LISTENERS & NAVIGATION
// =============================================================================

function setupNavigation() {
  btnModePins.addEventListener('click', () => switchView('pins'));
  btnModeBook.addEventListener('click', () => switchView('book'));
  btnLogo.addEventListener('click', (e) => {
    e.preventDefault();
    switchView('pins');
  });
  btnCloseBook.addEventListener('click', () => switchView('pins'));

  btnPrevPage.addEventListener('click', () => {
    if (state.currentIndex > 0) {
      playMechanicalTick('page');
      renderSpread(state.currentIndex - 1);
    }
  });

  btnNextPage.addEventListener('click', () => {
    if (state.currentIndex < PROJECTS.length - 1) {
      playMechanicalTick('page');
      renderSpread(state.currentIndex + 1);
    }
  });

  // Sound toggle
  btnAudioToggle.addEventListener('click', () => {
    state.soundEnabled = !state.soundEnabled;
    btnAudioToggle.textContent = `Sound: ${state.soundEnabled ? 'On' : 'Off'}`;
    playMechanicalTick('click');
  });

  // Keyboard navigation: Left / Right arrows to turn pages, Esc to return to pins
  window.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    if (e.key === 'ArrowRight') {
      if (state.currentMode === 'book' && state.currentIndex < PROJECTS.length - 1) {
        playMechanicalTick('page');
        renderSpread(state.currentIndex + 1);
      }
    } else if (e.key === 'ArrowLeft') {
      if (state.currentMode === 'book' && state.currentIndex > 0) {
        playMechanicalTick('page');
        renderSpread(state.currentIndex - 1);
      }
    } else if (e.key === 'Escape') {
      switchView('pins');
    }
  });
}

// =============================================================================
// INITIALIZATION
// =============================================================================

document.addEventListener('DOMContentLoaded', () => {
  renderPinsGrid();
  setupNavigation();
});
