/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Procedural Web Audio API soundscapes with zero external media files
class AudioEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private masterGain: GainNode | null = null;
  private currentDroneOsc1: OscillatorNode | null = null;
  private currentDroneOsc2: OscillatorNode | null = null;
  private currentDroneGain: GainNode | null = null;
  private noiseNode: AudioNode | null = null;
  private activeSoundType: 'study' | 'glass' | 'cosmic' | 'none' = 'none';

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.4, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(muted ? 0 : 0.4, this.ctx.currentTime, 0.1);
    }
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public playTactileClick() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx || !this.masterGain) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, this.ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    } catch {
      // Audio autoplay policy fallback
    }
  }

  public playGlassPing() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx || !this.masterGain) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1240, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1860, this.ctx.currentTime + 0.12);

      gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.35);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.36);
    } catch {
      // Ignore
    }
  }

  private currentHoverNodes: { osc?: OscillatorNode; gain?: GainNode } = {};

  /**
   * Node-Specific Hover Sound:
   * Triggered ONCE when the pointer enters a specific world node.
   * Completely silent for empty space or repeated movements inside the same node.
   */
  public playWorldHover(worldId: string) {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx || !this.masterGain) return;

      // Stop previous hover tone immediately so sounds never stack
      this.stopCurrentHoverSound();

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      // Distinct, subtle acoustic frequencies derived from the 15 worlds' creative DNA
      const hoverProfiles: Record<
        string,
        { freq: number; type: OscillatorType; duration: number; gainVal: number; filterFreq?: number }
      > = {
        smritika: { freq: 440, type: 'triangle', duration: 0.18, gainVal: 0.05, filterFreq: 600 },
        anveshin: { freq: 220, type: 'sawtooth', duration: 0.22, gainVal: 0.04, filterFreq: 380 },
        karigara: { freq: 587.33, type: 'triangle', duration: 0.15, gainVal: 0.06, filterFreq: 900 },
        kathaka: { freq: 329.63, type: 'sine', duration: 0.2, gainVal: 0.05, filterFreq: 520 },
        tantuvid: { freq: 523.25, type: 'sine', duration: 0.25, gainVal: 0.05, filterFreq: 1100 },
        bhutika: { freq: 196, type: 'triangle', duration: 0.2, gainVal: 0.05, filterFreq: 320 },
        drashta: { freq: 880, type: 'sine', duration: 0.14, gainVal: 0.04, filterFreq: 1200 },
        svapnika: { freq: 659.25, type: 'sine', duration: 0.28, gainVal: 0.04, filterFreq: 800 },
        jignasu: { freq: 392, type: 'triangle', duration: 0.12, gainVal: 0.05, filterFreq: 750 },
        yatri: { freq: 739.99, type: 'sine', duration: 0.18, gainVal: 0.04, filterFreq: 950 },
        sangati: { freq: 493.88, type: 'sine', duration: 0.18, gainVal: 0.05, filterFreq: 700 },
        sevika: { freq: 698.46, type: 'sine', duration: 0.22, gainVal: 0.05, filterFreq: 850 },
        rupantara: { freq: 622.25, type: 'triangle', duration: 0.2, gainVal: 0.05, filterFreq: 880 },
        lakshmi: { freq: 432, type: 'triangle', duration: 0.22, gainVal: 0.06, filterFreq: 580 },
        mayavin: { freq: 1174.66, type: 'sine', duration: 0.16, gainVal: 0.04, filterFreq: 1400 },
      };

      const profile = hoverProfiles[worldId] || { freq: 440, type: 'sine', duration: 0.18, gainVal: 0.05 };

      osc.type = profile.type;
      osc.frequency.setValueAtTime(profile.freq, now);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(profile.gainVal, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + profile.duration);

      if (profile.filterFreq) {
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(profile.filterFreq, now);
        osc.connect(filter);
        filter.connect(gain);
      } else {
        osc.connect(gain);
      }

      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + profile.duration + 0.02);

      this.currentHoverNodes = { osc, gain };
    } catch {
      // Audio autoplay policy fallback
    }
  }

  public stopCurrentHoverSound() {
    try {
      if (this.currentHoverNodes.gain && this.ctx) {
        this.currentHoverNodes.gain.gain.cancelScheduledValues(this.ctx.currentTime);
        this.currentHoverNodes.gain.gain.setValueAtTime(0.0001, this.ctx.currentTime);
      }
      if (this.currentHoverNodes.osc) {
        this.currentHoverNodes.osc.stop();
        this.currentHoverNodes.osc.disconnect();
      }
    } catch {
      // Cleanup safe
    }
    this.currentHoverNodes = {};
  }

  public getSonicProfile(targetWorld: any): {
    id: string;
    name: string;
    harmonicKey: string;
    elementMatch: string;
    description: string;
    departureFreqs: number[];
    departureSweep: 'up' | 'down' | 'unravel' | 'dispersal';
    departureOscType: OscillatorType;
    arrivalFreqs: number[];
    arrivalOscType: OscillatorType;
    filterType: BiquadFilterType;
    filterFreq: number;
  } {
    if (!targetWorld) {
      // Returning to Akāśa / Shared Cosmic Mandala
      return {
        id: 'shared',
        name: 'Akāśa Cosmic Singlet',
        harmonicKey: '136.1Hz Om fundamental & 528Hz Solfeggio',
        elementMatch: 'Cosmic Akāśa / Bindu Axis',
        description: 'Deep celestial harmonic pulse ascending into the common cosmic field',
        departureFreqs: [136.1, 204.15, 272.2],
        departureSweep: 'up',
        departureOscType: 'sine',
        arrivalFreqs: [264, 528, 792, 1056],
        arrivalOscType: 'sine',
        filterType: 'lowpass',
        filterFreq: 650,
      };
    }

    const elements: string[] = Array.isArray(targetWorld.creativeElement)
      ? targetWorld.creativeElement
      : [];
    const elementsStr = elements.join(' ').toLowerCase();
    const id = (targetWorld.id || '').toLowerCase();
    const principle = (targetWorld.cosmologyPrinciple || '').toLowerCase();

    // 1. Perception / Illusion / Latent Space / Machine Vision (e.g. Mayavin)
    if (
      id === 'mayavin' ||
      elementsStr.includes('illusion') ||
      elementsStr.includes('perception') ||
      elementsStr.includes('latent') ||
      elementsStr.includes('machine') ||
      principle.includes('māyā')
    ) {
      return {
        id: 'crystalline-illusion',
        name: 'Crystalline Shimmer & Latent Dispersion',
        harmonicKey: 'E minor Pentatonic · 880Hz / 1760Hz Glass Octaves',
        elementMatch: 'Perception, Illusion & Latent Space',
        description: 'Rapid optical frequency dispersal followed by sharp prismatic glass harmonics',
        departureFreqs: [880, 1174, 1567, 1975],
        departureSweep: 'dispersal',
        departureOscType: 'sine',
        arrivalFreqs: [880, 1320, 1760, 2200],
        arrivalOscType: 'triangle',
        filterType: 'highpass',
        filterFreq: 680,
      };
    }

    // 2. Research / Systems / Storytelling / Threads (e.g. Lakshmi / Sutradhara)
    if (
      id === 'lakshmi' ||
      elementsStr.includes('research') ||
      elementsStr.includes('threads') ||
      elementsStr.includes('systems') ||
      principle.includes('sūtra')
    ) {
      return {
        id: 'sutra-threads',
        name: 'Acoustic Thread & Archival Settle',
        harmonicKey: 'A Major Warm Harmonics · 432Hz Natural Resonance',
        elementMatch: 'Research, Systems & Thread Storytelling',
        description: 'Tactile thread-tension unraveling resolving into a warm acoustic wooden chord',
        departureFreqs: [216, 324, 432],
        departureSweep: 'unravel',
        departureOscType: 'triangle',
        arrivalFreqs: [216, 432, 540, 648, 864],
        arrivalOscType: 'sine',
        filterType: 'lowpass',
        filterFreq: 520,
      };
    }

    // 3. Memory / Ephemera / Archiving / Letters (e.g. Smritika)
    if (
      id === 'smritika' ||
      elementsStr.includes('memory') ||
      elementsStr.includes('ephemera') ||
      elementsStr.includes('archive') ||
      principle.includes('smṛti')
    ) {
      return {
        id: 'memory-ephemera',
        name: 'Epistolary Flutter & Tape Warble',
        harmonicKey: 'D Minor Archival · 293.66Hz Nostalgic Tape Flutter',
        elementMatch: 'Memory, Ephemera & Oral History',
        description: 'Faint cassette hiss frequency sweep resolving into a nostalgic minor chord',
        departureFreqs: [293.66, 349.23, 440],
        departureSweep: 'unravel',
        departureOscType: 'triangle',
        arrivalFreqs: [293.66, 440, 523.25, 659.25],
        arrivalOscType: 'sine',
        filterType: 'bandpass',
        filterFreq: 540,
      };
    }

    // 4. Inquiry / Excavation / Geology / Stone (e.g. Anveshin)
    if (
      id === 'anveshin' ||
      elementsStr.includes('inquiry') ||
      elementsStr.includes('excavation') ||
      elementsStr.includes('geology') ||
      elementsStr.includes('cartography') ||
      principle.includes('anveṣaṇa')
    ) {
      return {
        id: 'cavern-excavation',
        name: 'Subterranean Stone Resonance & Lantern Bell',
        harmonicKey: 'C Modal Cavern · 130.8Hz Deep Stone Fundamental',
        elementMatch: 'Inquiry, Excavation & Cartography',
        description: 'Low-frequency seismic descent followed by ringing mineral cavern harmonics',
        departureFreqs: [130.81, 196, 261.63],
        departureSweep: 'down',
        departureOscType: 'sawtooth',
        arrivalFreqs: [130.81, 261.63, 392, 523.25],
        arrivalOscType: 'sine',
        filterType: 'lowpass',
        filterFreq: 380,
      };
    }

    // 5. Craft / Materiality / Making / Workshop (e.g. Karigara)
    if (
      id === 'karigara' ||
      elementsStr.includes('material') ||
      elementsStr.includes('craft') ||
      elementsStr.includes('making') ||
      elementsStr.includes('tradition') ||
      principle.includes('karma')
    ) {
      return {
        id: 'craft-forge',
        name: 'Anvil Harmonics & Material Forge',
        harmonicKey: 'G Pentatonic · 392Hz Metallic Bodied Strike',
        elementMatch: 'Materiality, Making & Craft Traditions',
        description: 'Tactile tool friction pulse resolving into ringing resonant metallic harmonics',
        departureFreqs: [196, 293.66, 392],
        departureSweep: 'dispersal',
        departureOscType: 'triangle',
        arrivalFreqs: [392, 587.33, 783.99, 1174.66],
        arrivalOscType: 'triangle',
        filterType: 'bandpass',
        filterFreq: 820,
      };
    }

    // 6. Narrative / Voice / Theatre / Performance (e.g. Kathaka)
    if (
      id === 'kathaka' ||
      elementsStr.includes('narrative') ||
      elementsStr.includes('voice') ||
      elementsStr.includes('theatre') ||
      elementsStr.includes('orality') ||
      principle.includes('kāvya')
    ) {
      return {
        id: 'theatre-voice',
        name: 'Polyphonic Choral Swell & Breath Motif',
        harmonicKey: 'F Major Resonance · 349.2Hz Vocalized Formant',
        elementMatch: 'Voice, Performance & Theatre',
        description: 'Vocal breath sweep dissolving into a lush polyphonic vocal triad',
        departureFreqs: [174.61, 261.63, 349.23],
        departureSweep: 'up',
        departureOscType: 'sine',
        arrivalFreqs: [349.23, 440, 523.25, 698.46],
        arrivalOscType: 'sine',
        filterType: 'lowpass',
        filterFreq: 640,
      };
    }

    // Fallback default for other archetypes
    return {
      id: id || 'archetype-generic',
      name: `${targetWorld.shapeshifterName || 'Archetype'} Harmonic Alignment`,
      harmonicKey: 'Harmonic 5-Tone Spectrum',
      elementMatch: elements.slice(0, 3).join(', ') || 'Practice Elements',
      description: 'Cosmological frequency realignment matching the student’s archive language',
      departureFreqs: [261.63, 329.63, 392],
      departureSweep: 'up',
      departureOscType: 'sine',
      arrivalFreqs: [261.63, 392, 523.25, 659.25],
      arrivalOscType: 'sine',
      filterType: 'lowpass',
      filterFreq: 600,
    };
  }

  /**
   * Sonic Cue: Triggered at the beginning of departure phase.
   * Distinct procedural acoustic signature departing toward target world's creative DNA.
   */
  public playDepartureCue(targetWorld: any) {
    if (this.isMuted) return this.getSonicProfile(targetWorld);
    try {
      this.initContext();
      if (!this.ctx || !this.masterGain) return this.getSonicProfile(targetWorld);

      const profile = this.getSonicProfile(targetWorld);
      const now = this.ctx.currentTime;

      // Filter envelope
      const filter = this.ctx.createBiquadFilter();
      filter.type = profile.filterType;
      filter.frequency.setValueAtTime(profile.filterFreq, now);

      const departureGain = this.ctx.createGain();
      departureGain.gain.setValueAtTime(0, now);
      departureGain.gain.linearRampToValueAtTime(0.09, now + 0.05);
      departureGain.gain.exponentialRampToValueAtTime(0.001, now + 0.65);

      filter.connect(departureGain);
      departureGain.connect(this.masterGain);

      // Synthesize departure frequencies according to sweep pattern
      profile.departureFreqs.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        osc.type = profile.departureOscType;

        const offset = idx * 0.04;
        const startFreq = freq;
        let endFreq = freq;

        if (profile.departureSweep === 'dispersal') {
          endFreq = freq * 1.6;
        } else if (profile.departureSweep === 'unravel') {
          endFreq = freq * 0.7;
        } else if (profile.departureSweep === 'down') {
          endFreq = freq * 0.5;
        } else if (profile.departureSweep === 'up') {
          endFreq = freq * 1.5;
        }

        osc.frequency.setValueAtTime(startFreq, now + offset);
        osc.frequency.exponentialRampToValueAtTime(Math.max(40, endFreq), now + offset + 0.55);

        osc.connect(filter);
        osc.start(now + offset);
        osc.stop(now + offset + 0.65);
      });

      return profile;
    } catch {
      return this.getSonicProfile(targetWorld);
    }
  }

  /**
   * Sonic Cue: Triggered at the beginning of arrival phase.
   * Distinct procedural acoustic chord blossoming upon reaching target world's creative DNA.
   */
  public playArrivalCue(targetWorld: any) {
    if (this.isMuted) return this.getSonicProfile(targetWorld);
    try {
      this.initContext();
      if (!this.ctx || !this.masterGain) return this.getSonicProfile(targetWorld);

      const profile = this.getSonicProfile(targetWorld);
      const now = this.ctx.currentTime;

      const arrivalGain = this.ctx.createGain();
      arrivalGain.gain.setValueAtTime(0, now);
      arrivalGain.gain.linearRampToValueAtTime(0.11, now + 0.06);
      arrivalGain.gain.exponentialRampToValueAtTime(0.001, now + 0.95);

      const filter = this.ctx.createBiquadFilter();
      filter.type = profile.filterType;
      filter.frequency.setValueAtTime(profile.filterFreq * 1.2, now);
      filter.connect(arrivalGain);
      arrivalGain.connect(this.masterGain);

      // Play arrival chord staggered across harmonics
      profile.arrivalFreqs.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        osc.type = profile.arrivalOscType;

        const noteDelay = idx * 0.05;
        osc.frequency.setValueAtTime(freq, now + noteDelay);

        // Subtle micro-pitch shimmer for arrival depth
        if (profile.departureSweep === 'dispersal') {
          osc.frequency.linearRampToValueAtTime(freq * 1.01, now + noteDelay + 0.8);
        }

        osc.connect(filter);
        osc.start(now + noteDelay);
        osc.stop(now + noteDelay + 0.95);
      });

      return profile;
    } catch {
      return this.getSonicProfile(targetWorld);
    }
  }

  public playTransitionChime() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx || !this.masterGain) return;

      const freqs = [432, 540, 648];
      freqs.forEach((f, idx) => {
        if (!this.ctx || !this.masterGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, this.ctx.currentTime + idx * 0.08);
        gain.gain.setValueAtTime(0, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.08, this.ctx.currentTime + idx * 0.08 + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + idx * 0.08 + 0.8);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(this.ctx.currentTime + idx * 0.08);
        osc.stop(this.ctx.currentTime + idx * 0.08 + 0.85);
      });
    } catch {
      // Ignore
    }
  }

  public switchAtmosphere(type: 'study' | 'glass' | 'cosmic' | 'none') {
    if (this.activeSoundType === type) return;
    this.activeSoundType = type;

    try {
      this.initContext();
      if (!this.ctx || !this.masterGain) return;

      // Stop current drones smoothly
      if (this.currentDroneGain) {
        this.currentDroneGain.gain.setTargetAtTime(0.0001, this.ctx.currentTime, 0.4);
        const prevOsc1 = this.currentDroneOsc1;
        const prevOsc2 = this.currentDroneOsc2;
        const prevGain = this.currentDroneGain;
        setTimeout(() => {
          try {
            prevOsc1?.stop();
            prevOsc2?.stop();
            prevOsc1?.disconnect();
            prevOsc2?.disconnect();
            prevGain?.disconnect();
          } catch {
            // Cleanup
          }
        }, 600);
      }

      if (this.noiseNode) {
        try {
          this.noiseNode.disconnect();
          this.noiseNode = null;
        } catch {
          // Cleanup
        }
      }

      if (type === 'none') return;

      const newGain = this.ctx.createGain();
      newGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      newGain.connect(this.masterGain);
      this.currentDroneGain = newGain;

      if (type === 'study') {
        // Warm low hum (A 110Hz + E 165Hz) with subtle warmth
        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        osc1.type = 'triangle';
        osc1.frequency.setValueAtTime(110, this.ctx.currentTime);
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(164.8, this.ctx.currentTime);

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(320, this.ctx.currentTime);

        osc1.connect(filter);
        osc2.connect(filter);
        filter.connect(newGain);

        osc1.start();
        osc2.start();
        this.currentDroneOsc1 = osc1;
        this.currentDroneOsc2 = osc2;

        newGain.gain.setTargetAtTime(0.07, this.ctx.currentTime, 0.6);
      } else if (type === 'glass') {
        // Crystalline harmonics (E5 659Hz + B5 987Hz)
        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(659.25, this.ctx.currentTime);
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(987.77, this.ctx.currentTime);

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.setValueAtTime(450, this.ctx.currentTime);

        osc1.connect(filter);
        osc2.connect(filter);
        filter.connect(newGain);

        osc1.start();
        osc2.start();
        this.currentDroneOsc1 = osc1;
        this.currentDroneOsc2 = osc2;

        newGain.gain.setTargetAtTime(0.04, this.ctx.currentTime, 0.8);
      } else if (type === 'cosmic') {
        // Deep singing-bowl frequency (136.1Hz Om / cosmic tone + 272.2Hz octave)
        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(136.1, this.ctx.currentTime);
        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(272.2, this.ctx.currentTime);

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(380, this.ctx.currentTime);

        osc1.connect(filter);
        osc2.connect(filter);
        filter.connect(newGain);

        osc1.start();
        osc2.start();
        this.currentDroneOsc1 = osc1;
        this.currentDroneOsc2 = osc2;

        newGain.gain.setTargetAtTime(0.06, this.ctx.currentTime, 0.8);
      }
    } catch {
      // Audio policy safe
    }
  }

  /**
   * Dynamic Spring Physics Sound:
   * Generates dynamic acoustic spring recoil / oscillation based on world physics behavior.
   */
  public playSpringOscillation(behavior: string = 'spring-elastic') {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx || !this.masterGain) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      if (behavior === 'spring-elastic') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(160, now);
        osc.frequency.exponentialRampToValueAtTime(380, now + 0.08);
        osc.frequency.exponentialRampToValueAtTime(190, now + 0.22);
        osc.frequency.exponentialRampToValueAtTime(260, now + 0.38);
        osc.frequency.exponentialRampToValueAtTime(210, now + 0.55);

        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.65);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(now);
        osc.stop(now + 0.7);
      } else if (behavior === 'crystalline-snappy') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(620, now);
        osc.frequency.exponentialRampToValueAtTime(1240, now + 0.05);
        osc.frequency.exponentialRampToValueAtTime(480, now + 0.16);

        gain.gain.setValueAtTime(0.09, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.36);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(now);
        osc.stop(now + 0.4);
      } else {
        // tactile / gravitational / fluid
        osc.type = 'sine';
        osc.frequency.setValueAtTime(120, now);
        osc.frequency.exponentialRampToValueAtTime(240, now + 0.12);
        osc.frequency.exponentialRampToValueAtTime(105, now + 0.48);

        gain.gain.setValueAtTime(0.14, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(now);
        osc.stop(now + 0.65);
      }
    } catch {
      // Audio fallback safe
    }
  }
}


export const audioEngine = new AudioEngine();
