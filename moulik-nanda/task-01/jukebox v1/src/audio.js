// Web Audio API procedural tactile sound synthesizer for Y2K DVD Wallet
class SoundManager {
  constructor() {
    this.ctx = null;
    this.muted = true; // MUST NEVER autoplay unexpectedly; user explicitly enables
    this.ambientOsc = null;
    this.ambientGain = null;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.muted = !this.muted;
    if (!this.muted) {
      this.init();
      this.playOsdBeep(880, 0.08);
    } else {
      this.stopAmbientChord();
    }
    return !this.muted; // returns isSoundOn
  }

  // Physical wallet opening sound: plastic latch click + hinge friction + sleeve settle
  playOpen() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;

    // 1. Initial plastic latch snap
    const snap = this.ctx.createOscillator();
    const snapGain = this.ctx.createGain();
    snap.type = 'triangle';
    snap.frequency.setValueAtTime(1200, t);
    snap.frequency.exponentialRampToValueAtTime(180, t + 0.04);
    snapGain.gain.setValueAtTime(0.25, t);
    snapGain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
    snap.connect(snapGain);
    snapGain.connect(this.ctx.destination);
    snap.start(t);
    snap.stop(t + 0.06);

    // 2. Plastic hinge creak / slide friction (short filtered noise sweep)
    const bufSize = this.ctx.sampleRate * 0.35;
    const buf = this.ctx.createBuffer(1, bufSize, this.ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufSize * 0.5));
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buf;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(800, t + 0.04);
    filter.frequency.exponentialRampToValueAtTime(320, t + 0.35);
    filter.Q.setValueAtTime(3.0, t + 0.04);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.18, t + 0.04);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.ctx.destination);
    noise.start(t + 0.04);

    // 3. Gentle disc flutter settle
    const thud = this.ctx.createOscillator();
    const thudGain = this.ctx.createGain();
    thud.type = 'sine';
    thud.frequency.setValueAtTime(140, t + 0.28);
    thud.frequency.exponentialRampToValueAtTime(45, t + 0.42);
    thudGain.gain.setValueAtTime(0.15, t + 0.28);
    thudGain.gain.exponentialRampToValueAtTime(0.001, t + 0.42);
    thud.connect(thudGain);
    thudGain.connect(this.ctx.destination);
    thud.start(t + 0.28);
    thud.stop(t + 0.43);
  }

  // Physical wallet closing sound
  playClose() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;

    // Hinge swing sound
    const swing = this.ctx.createOscillator();
    const swingGain = this.ctx.createGain();
    swing.type = 'sine';
    swing.frequency.setValueAtTime(260, t);
    swing.frequency.exponentialRampToValueAtTime(80, t + 0.2);
    swingGain.gain.setValueAtTime(0.12, t);
    swingGain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
    swing.connect(swingGain);
    swingGain.connect(this.ctx.destination);
    swing.start(t);
    swing.stop(t + 0.21);

    // Chunky plastic clamshell clasp / snap
    const clasp = this.ctx.createOscillator();
    const claspGain = this.ctx.createGain();
    clasp.type = 'triangle';
    clasp.frequency.setValueAtTime(950, t + 0.22);
    clasp.frequency.exponentialRampToValueAtTime(90, t + 0.32);
    claspGain.gain.setValueAtTime(0.28, t + 0.22);
    claspGain.gain.exponentialRampToValueAtTime(0.001, t + 0.33);
    clasp.connect(claspGain);
    claspGain.connect(this.ctx.destination);
    clasp.start(t + 0.22);
    clasp.stop(t + 0.34);
  }

  // Tactile plastic sleeve flip
  playFlip() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    
    // Noise burst for vinyl sleeve crinkle
    const bufferSize = this.ctx.sampleRate * 0.16;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.4));
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1600, t);
    filter.frequency.exponentialRampToValueAtTime(500, t + 0.16);
    filter.Q.setValueAtTime(2.2, t);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.16);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    noise.start(t);

    // Subtle disc flap
    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(140, t + 0.04);
    osc.frequency.exponentialRampToValueAtTime(45, t + 0.15);

    oscGain.gain.setValueAtTime(0.14, t + 0.04);
    oscGain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);

    osc.connect(oscGain);
    oscGain.connect(this.ctx.destination);
    osc.start(t + 0.04);
    osc.stop(t + 0.16);
  }

  // Slide disc out of plastic pocket
  playSlideDisc() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const bufferSize = this.ctx.sampleRate * 0.25;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.45;
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(2400, t);
    filter.frequency.linearRampToValueAtTime(3800, t + 0.25);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.02, t);
    gain.gain.linearRampToValueAtTime(0.14, t + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    noise.start(t);
  }

  // Disc snap back into pocket
  playSnap() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(750, t);
    osc.frequency.exponentialRampToValueAtTime(140, t + 0.07);

    gain.gain.setValueAtTime(0.18, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.07);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.08);
  }

  // OSD Menu blip / click
  playOsdBeep(freq = 1200, dur = 0.05) {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, t);

    gain.gain.setValueAtTime(0.09, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + dur);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + dur + 0.01);
  }

  // Laser seek & motor whir for DVD preview
  playLaserSeek() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    // Optical drive chirp
    [0, 0.07, 0.14].forEach(offset => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(900 + Math.random() * 250, t + offset);
      osc.frequency.linearRampToValueAtTime(550, t + offset + 0.035);

      gain.gain.setValueAtTime(0.05, t + offset);
      gain.gain.exponentialRampToValueAtTime(0.001, t + offset + 0.035);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t + offset);
      osc.stop(t + offset + 0.04);
    });
  }

  // Retro DVD background ambient chord
  startAmbientChord() {
    if (this.muted || this.ambientOsc) return;
    this.init();
    if (!this.ctx) return;

    try {
      this.ambientGain = this.ctx.createGain();
      this.ambientGain.gain.setValueAtTime(0.025, this.ctx.currentTime);

      const notes = [220, 277.18, 329.63, 440];
      this.ambientOsc = notes.map(freq => {
        const osc = this.ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        osc.connect(this.ambientGain);
        osc.start();
        return osc;
      });
      this.ambientGain.connect(this.ctx.destination);
    } catch (_) {}
  }

  stopAmbientChord() {
    if (this.ambientOsc) {
      if (this.ambientGain) {
        this.ambientGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.15);
      }
      setTimeout(() => {
        if (this.ambientOsc) {
          this.ambientOsc.forEach(o => {
            try { o.stop(); } catch (_) {}
          });
          this.ambientOsc = null;
        }
      }, 200);
    }
  }
}

export const sounds = new SoundManager();
