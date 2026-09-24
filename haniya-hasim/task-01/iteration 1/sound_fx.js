/**
 * Web Audio API Offline Celestial Sound Synthesizer
 * Generates celestial drones, astrolabe clockwork ratchets, and harmonic chime chords
 * completely offline with zero external audio assets.
 */

class CelestialAudio {
  constructor() {
    this.ctx = null;
    this.isEnabled = true;
    this.ambientGain = null;
    this.ambientOscs = [];
  }

  ensureContext() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleSound() {
    this.isEnabled = !this.isEnabled;
    if (!this.isEnabled && this.ambientGain) {
      this.ambientGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.1);
    } else if (this.isEnabled) {
      this.ensureContext();
      this.playChime();
    }
    return this.isEnabled;
  }

  // Astrolabe Gear Ratchet Ticking
  playGearClick() {
    if (!this.isEnabled) return;
    this.ensureContext();

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(180 + Math.random() * 40, t);
    osc.frequency.exponentialRampToValueAtTime(40, t + 0.04);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(800, t);
    filter.Q.setValueAtTime(3.0, t);

    gain.gain.setValueAtTime(0.08, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.04);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.05);
  }

  // Harmonic Celestial Alignment Chime (Tibetan Singing Bowl / Bell Chord)
  playChime() {
    if (!this.isEnabled) return;
    this.ensureContext();

    const t = this.ctx.currentTime;
    // Harmonic Pentatonic Celestial Chord: F3, C4, G4, A4, E5
    const freqs = [174.61, 261.63, 392.00, 440.00, 659.25];

    freqs.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, t);

      // Subtle celestial vibrato
      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      lfo.frequency.setValueAtTime(4.5 + idx * 0.4, t);
      lfoGain.gain.setValueAtTime(1.5, t);
      lfo.connect(osc.frequency);
      lfo.start(t);
      lfo.stop(t + 3.5);

      // Gentle strike attack & long ethereal exponential decay
      const peakGain = 0.12 / (idx + 1);
      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(peakGain, t + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 3.2 + idx * 0.4);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 3.6 + idx * 0.4);
    });
  }

  // Start Subtle Ambient Astral Resonance
  // Start Subtle Ambient Astral Resonance (Calming 432Hz Tibetan Solfeggio Resonance)
  startAmbientDrone() {
    if (!this.isEnabled) return;
    this.ensureContext();
    if (this.ambientGain) return; // already active

    const t = this.ctx.currentTime;
    this.ambientGain = this.ctx.createGain();
    this.ambientGain.gain.setValueAtTime(0.0001, t);
    this.ambientGain.gain.linearRampToValueAtTime(0.012, t + 3.5);

    // Warm Lowpass Filter for soft, meditative warmth
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(380, t);

    // LFO for slow breathing wave effect (0.12 Hz)
    const lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();
    lfo.frequency.setValueAtTime(0.12, t);
    lfoGain.gain.setValueAtTime(80, t);
    lfo.connect(filter.frequency);
    lfo.start(t);

    // 432Hz Harmonic Resonance Frequencies: A2 (108Hz), E3 (162Hz), A3 (216Hz), C#4 (270Hz)
    const baseFreqs = [108.0, 162.0, 216.0, 270.0];
    baseFreqs.forEach((f) => {
      const osc = this.ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, t);
      osc.connect(filter);
      osc.start(t);
      this.ambientOscs.push(osc);
    });

    filter.connect(this.ambientGain);
    this.ambientGain.connect(this.ctx.destination);
  }

  stopAmbientDrone() {
    if (this.ambientGain && this.ctx) {
      try {
        this.ambientGain.gain.setValueAtTime(this.ambientGain.gain.value, this.ctx.currentTime);
        this.ambientGain.gain.linearRampToValueAtTime(0.0001, this.ctx.currentTime + 0.3);
      } catch (e) {}
      setTimeout(() => {
        this.ambientOscs.forEach(osc => { try { osc.stop(); } catch(e){} });
        this.ambientOscs = [];
        this.ambientGain = null;
      }, 350);
    }
  }

  silenceAllAudio() {
    this.stopAmbientDrone();
    this.stopFairyNoise();
    this.stopGazeBells();
  }

  // Calming Welcome Chord on Instruction Screen Entry
  playInstructionAwakenChord() {
    if (!this.isEnabled) return;
    this.ensureContext();

    const t = this.ctx.currentTime;
    // Calming A Major 9 / Ethereal chord: A3, E4, G#4, C#5, E5, G#5
    const chord = [216.00, 324.00, 412.50, 540.00, 648.00, 825.00];

    chord.forEach((freq, idx) => {
      const delay = idx * 0.09;
      const noteTime = t + delay;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, noteTime);

      const maxGain = 0.025 / (idx * 0.3 + 1);
      gain.gain.setValueAtTime(0.0001, noteTime);
      gain.gain.linearRampToValueAtTime(maxGain, noteTime + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.0001, noteTime + 4.5);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(noteTime);
      osc.stop(noteTime + 4.8);
    });
  }

  // Resonant Harmonic Awakening Chord Sequence
  playAwakenChime() {
    if (!this.isEnabled) return;
    this.ensureContext();

    const t = this.ctx.currentTime;
    // Ascending shimmer chord: C4, G4, C5, E5, G5, B5, D6
    const chord = [261.63, 392.00, 523.25, 659.25, 783.99, 987.77, 1174.66];
    
    chord.forEach((freq, idx) => {
      const noteTime = t + idx * 0.08;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, noteTime);

      gain.gain.setValueAtTime(0.0001, noteTime);
      gain.gain.linearRampToValueAtTime(0.028 / (idx * 0.3 + 1), noteTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, noteTime + 3.8);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(noteTime);
      osc.stop(noteTime + 4.0);
    });
  }

  // Retro 2000s OS Alert Popup Sound
  playPopupAlert() {
    if (!this.isEnabled) return;
    this.ensureContext();
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(440, t);
    osc.frequency.setValueAtTime(880, t + 0.08);

    gain.gain.setValueAtTime(0.06, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.25);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.26);
  }

  // 1. Enchanting & Soft Fairy Dust Sparkles (Crystalline High Register & Stereo Panning)
  startFairyNoise() {
    if (!this.isEnabled) return;
    this.ensureContext();
    if (this.fairyInterval) return;

    // High crystalline pentatonic scale: E6, G6, A6, B6, D7, E7, G7
    const fairyNotes = [1318.51, 1567.98, 1760.00, 1975.53, 2349.32, 2637.02, 3135.96];

    const triggerFairySparkle = () => {
      if (!this.isEnabled || !this.ctx) return;
      const t = this.ctx.currentTime;
      const freq = fairyNotes[Math.floor(Math.random() * fairyNotes.length)];

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);
      // Subtle upward shimmer pitch-glide
      osc.frequency.exponentialRampToValueAtTime(freq * 1.015, t + 0.6);

      // Very soft envelope for calm, soothing fairy dust feel
      const peak = 0.0010 + Math.random() * 0.0008;
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.linearRampToValueAtTime(peak, t + 0.12);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 1.2);

      // Stereo panner if supported for spatial fairy dust dance
      let destination = this.ctx.destination;
      if (this.ctx.createStereoPanner) {
        const panner = this.ctx.createStereoPanner();
        panner.pan.setValueAtTime((Math.random() - 0.5) * 1.2, t);
        osc.connect(panner);
        panner.connect(gain);
      } else {
        osc.connect(gain);
      }

      gain.connect(destination);

      osc.start(t);
      osc.stop(t + 1.3);
    };

    triggerFairySparkle();
    // Slowed from 380ms down to 3200ms for a peaceful, unhurried pace
    this.fairyInterval = setInterval(triggerFairySparkle, 3200);
  }

  stopFairyNoise() {
    if (this.fairyInterval) {
      clearInterval(this.fairyInterval);
      this.fairyInterval = null;
    }
  }

  // 2. Bells Chiming during "Seeing Into Your Life" Gaze Screen
  startGazeBells() {
    if (!this.isEnabled) return;
    this.ensureContext();
    this.stopGazeBells();

    const gazeBellFreqs = [523.25, 659.25, 783.99, 1046.50, 1318.51];
    let step = 0;

    const ringGazeBell = () => {
      if (!this.isEnabled || !this.ctx) return;
      const t = this.ctx.currentTime;
      const freq = gazeBellFreqs[step % gazeBellFreqs.length];
      step++;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.linearRampToValueAtTime(0.008, t + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 3.0);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 3.2);
    };

    ringGazeBell();
    // Slowed from 1400ms to 3600ms for serene, meditative bell resonance
    this.gazeBellInterval = setInterval(ringGazeBell, 3600);
  }

  stopGazeBells() {
    if (this.gazeBellInterval) {
      clearInterval(this.gazeBellInterval);
      this.gazeBellInterval = null;
    }
  }

  // 3. Grand Final Bell Chime (Plays when prediction manifests on screen)
  playFinalPredictionChime() {
    if (!this.isEnabled) return;
    this.ensureContext();

    const t = this.ctx.currentTime;
    const finalChord = [130.81, 196.00, 261.63, 329.63, 392.00, 493.88, 587.33, 783.99];

    finalChord.forEach((freq, idx) => {
      const delay = idx * 0.08;
      const noteTime = t + delay;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, noteTime);

      const maxGain = 0.018 / (idx * 0.3 + 1);
      gain.gain.setValueAtTime(0.0001, noteTime);
      gain.gain.linearRampToValueAtTime(maxGain, noteTime + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.0001, noteTime + 6.0 + idx * 0.3);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(noteTime);
      osc.stop(noteTime + 6.5);
    });
  }

  // 4. Liquid Swirl Vortex Sound Effect (Fired on Face Detection Transition)
  playSwirlTransitionSound() {
    if (!this.isEnabled) return;
    this.ensureContext();

    const t = this.ctx.currentTime;
    const duration = 1.4;

    // Smooth sine wave pitch glide for gentle fluid swell (no harsh sawtooth)
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(140, t);
    osc.frequency.exponentialRampToValueAtTime(420, t + 0.7);
    osc.frequency.exponentialRampToValueAtTime(200, t + duration);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(280, t);
    filter.frequency.exponentialRampToValueAtTime(900, t + 0.6);
    filter.frequency.exponentialRampToValueAtTime(200, t + duration);
    filter.Q.setValueAtTime(1.2, t);

    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.linearRampToValueAtTime(0.012, t + 0.4);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + duration);

    // Ethereal chord cascade at the peak of the swirl
    const freqs = [329.63, 440.00, 554.37, 659.25];
    freqs.forEach((freq, idx) => {
      const noteTime = t + 0.4 + idx * 0.08;
      const chimeOsc = this.ctx.createOscillator();
      const chimeGain = this.ctx.createGain();

      chimeOsc.type = 'sine';
      chimeOsc.frequency.setValueAtTime(freq, noteTime);

      chimeGain.gain.setValueAtTime(0.0001, noteTime);
      chimeGain.gain.linearRampToValueAtTime(0.015, noteTime + 0.08);
      chimeGain.gain.exponentialRampToValueAtTime(0.0001, noteTime + 3.0);

      chimeOsc.connect(chimeGain);
      chimeGain.connect(this.ctx.destination);

      chimeOsc.start(noteTime);
      chimeOsc.stop(noteTime + 3.2);
    });
  }
}

