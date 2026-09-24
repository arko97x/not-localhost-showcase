/**
 * Mirror Mirror on the Wall — High-Sensitivity Audio & 10s Gaze Orchestrator
 * 5-6s Blank Night Sky -> 7-8s Mirror Call Hold (or Instant Voice Trigger) -> 10s Eye Gaze Measurement
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Particles Engine, Sunset Liquid Shader & Web Audio
  const particles = new NightSkyParticles('particles-canvas');
  const liquidSunset = new SunsetLiquidEngine('sunset-liquid-canvas');
  const audio = new CelestialAudio();

  // 2. DOM Elements
  const liveTimeEl = document.getElementById('live-time');
  const screensaverStage = document.getElementById('screensaver-stage');
  const instructionsStage = document.getElementById('instructions-stage');
  const callStage = document.getElementById('call-stage');
  const mirrorTitle = document.getElementById('mirror-title');
  const voiceFillFg = document.getElementById('voice-fill-fg');
  const voiceHintSub = document.getElementById('voice-hint-sub');
  const gazeStage = document.getElementById('gaze-stage');
  const prophecyStage = document.getElementById('prophecy-stage');
  const transitGlyph = document.getElementById('transit-glyph');
  const transitText = document.getElementById('transit-text');
  const prophecyQuote = document.getElementById('prophecy-quote');
  const consultAgainBtn = document.getElementById('consult-again-btn');
  const waveBars = document.querySelectorAll('.listening-wave-indicator .wave-bar');

  let isScreensaverActive = true;
  let isTransitioning = false;
  let isPresenceDetected = false;
  let isInstructionPhase = false;
  let isCallPhase = false;
  let isAwakened = false;
  let instructionStartTime = 0;
  let voiceFillPercent = 0.0;
  let audioContext = null;
  let analyser = null;
  let micStream = null;
  let autoAwakenTimer = null;
  let initialRevealTimer = null;
  let ambientNoiseFloor = 4.0;
  let noiseSampleCount = 0;

  // 3. Live Precision Clock Loop
  function updateClock() {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    const s = String(now.getSeconds()).padStart(2, '0');
    liveTimeEl.textContent = `${h}:${m}:${s}`;
  }
  updateClock();
  setInterval(updateClock, 1000);

  let isSensingActive = false;
  let sensingTimer = null;
  const sensingStage = document.getElementById('sensing-stage');
  const sensingText = document.getElementById('sensing-text');

  // Step 0 -> 1 Transition: Liquid Sunset Swirl Vortex Transition on Face Detection
  function triggerSwirlToNextScreen() {
    if (!isScreensaverActive || isTransitioning) return;
    isTransitioning = true;
    console.log('[Screensaver]: Face detected! Launching liquid swirl vortex transition...');

    // Play liquid swirl vortex audio effect
    audio.playSwirlTransitionSound();

    // Fade out screensaver title & text overlay
    if (screensaverStage) {
      screensaverStage.classList.remove('visible');
      screensaverStage.classList.add('hidden');
    }

    // Trigger GLSL / 2D Swirl Vortex Shader
    liquidSunset.triggerSwirl(() => {
      isScreensaverActive = false;
      isTransitioning = false;

      // Hide liquid canvas overlay with fade
      const liquidCanvas = document.getElementById('sunset-liquid-canvas');
      if (liquidCanvas) liquidCanvas.classList.add('swirled-out');

      // Reveal Maiden Call / Mirror Stage
      startPresenceReveal();
    });
  }

  // Step 1: Initial Instructions Stage (Holds instruction text for EXACTLY 12.0 seconds)
  function startPresenceReveal() {
    if (isPresenceDetected) return;
    isPresenceDetected = true;
    isInstructionPhase = true;
    instructionStartTime = performance.now();

    // Activate ambient audio & fairy dust sparkles once screensaver completes and instruction stage opens
    audio.startAmbientDrone();
    audio.startFairyNoise();
    audio.playInstructionAwakenChord();

    const topBar = document.getElementById('top-bar');
    if (topBar) topBar.classList.remove('hidden');

    if (instructionsStage) {
      instructionsStage.classList.remove('hidden');
      requestAnimationFrame(() => {
        instructionsStage.classList.add('visible');
      });
    }
    console.log('[Mirror]: Stage 1 Instruction screen active — Holding for EXACTLY 12.0 seconds...');

    // 12-Second Instruction Screen Hold Lock -> Transitions to Voice Call Screen
    if (autoAwakenTimer) clearTimeout(autoAwakenTimer);
    autoAwakenTimer = setTimeout(() => {
      console.log('[Mirror]: 12.0s instruction screen hold elapsed — Transitioning to Voice Call screen');
      showVoiceCallStage();
    }, 12000);
  }

  // Progressive Voice Fill Controller
  function setVoiceFillProgress(percent) {
    if (!isCallPhase || isAwakened) return;

    voiceFillPercent = Math.min(100.0, Math.max(0.0, percent));

    if (voiceFillFg) {
      voiceFillFg.style.setProperty('--voice-fill-percent', `${voiceFillPercent}%`);
    }

    if (voiceHintSub) {
      if (voiceFillPercent < 30) {
        voiceHintSub.textContent = 'call out aloud to fill the mirror...';
      } else if (voiceFillPercent < 70) {
        voiceHintSub.textContent = 'the mirror absorbs your voice...';
      } else if (voiceFillPercent < 100) {
        voiceHintSub.textContent = 'almost full... finish calling!';
      } else {
        voiceHintSub.textContent = '✦ mirror call complete ✦';
      }
    }

    if (voiceFillPercent >= 99.8) {
      voiceFillPercent = 100.0;
      console.log('[Voice Fill]: 100% complete! Awakening mirror calculation screen...');
      setTimeout(() => {
        awakenMirror();
      }, 350);
    }
  }

  function boostVoiceFill(addPercent) {
    if (!isCallPhase || isAwakened) return;
    setVoiceFillProgress(voiceFillPercent + addPercent);
  }

  // Step 2: Voice Call Stage ("mirror mirror on the wall")
  function showVoiceCallStage() {
    isInstructionPhase = false;
    isCallPhase = true;
    setVoiceFillProgress(0);

    if (instructionsStage) {
      instructionsStage.classList.remove('visible');
      instructionsStage.classList.add('hidden');
    }

    if (callStage) {
      callStage.classList.remove('hidden');
      requestAnimationFrame(() => {
        callStage.classList.add('visible');
      });
    }

    console.log('[Mirror]: Stage 2 Voice Call screen active ("mirror mirror on the wall")');
  }

  function onSeekerPresenceDetected() {
    console.log('[Vision]: Person / Face sensed by camera for 1.5s!');
    if (isScreensaverActive) {
      triggerSwirlToNextScreen();
    }
  }

  // Step 3: Mirror Awakening -> Calculating Screen ("seeing into your life...")
  function awakenMirror() {
    if (isAwakened) return;
    isAwakened = true;
    isCallPhase = false;

    if (autoAwakenTimer) {
      clearTimeout(autoAwakenTimer);
      autoAwakenTimer = null;
    }

    audio.playAwakenChime();
    audio.startGazeBells();

    if (instructionsStage) {
      instructionsStage.classList.remove('visible');
      instructionsStage.classList.add('hidden');
    }

    if (callStage) {
      callStage.classList.remove('visible');
      callStage.classList.add('hidden');
    }

    if (gazeStage) {
      gazeStage.classList.remove('hidden');
      requestAnimationFrame(() => {
        gazeStage.classList.add('visible');
      });
    }

    // Start 6-Second Eye-Gaze Duration Session (Strict 6000ms max)
    let isSessionResolved = false;
    const resolveGazeOnce = (winningDirection, telemetry) => {
      if (isSessionResolved) return;
      isSessionResolved = true;
      onGazeSessionResolved(winningDirection, telemetry);
    };

    if (vision) {
      vision.startGazeSession(6000, (winningDirection, telemetry) => {
        resolveGazeOnce(winningDirection, telemetry);
      });
    }

    // Strict 6.0 second hard cap timeout fallback
    setTimeout(() => {
      resolveGazeOnce('left', { leftSeconds: '3.10', rightSeconds: '2.90' });
    }, 6000);

    console.log('[Mirror]: Machine awakened! Now measuring strict 6.0 second eye gaze...');
  }

  // 6. Step 3: 10-Second Gaze Resolved -> Fetch Swiss Ephemeris Prophecy
  async function onGazeSessionResolved(winningDirection, telemetry) {
    audio.stopGazeBells();
    audio.playChime();
    console.log(`[Mirror]: 10-Second Gaze Complete! Winner: ${winningDirection.toUpperCase()}`);
    if (telemetry) {
      console.log(`[Telemetry] Left Eye: ${telemetry.leftSeconds}s | Right Eye: ${telemetry.rightSeconds}s`);
    }

    const directionParam = encodeURIComponent(winningDirection);
    const endpoints = [
      `/api/prediction?direction=${directionParam}`,
      `http://localhost:8000/api/prediction?direction=${directionParam}`,
      `http://127.0.0.1:8000/api/prediction?direction=${directionParam}`
    ];

    for (const url of endpoints) {
      try {
        const resp = await fetch(url);
        if (resp.ok) {
          const json = await resp.json();
          if (json && json.status === 'success' && json.data) {
            renderProphecy(json.data);
            return;
          }
        }
      } catch (e) {
        // try next endpoint
      }
    }

    console.warn('[Mirror]: Backend fetch error, utilizing local offline corpus fallback');
    await renderLocalFallback(winningDirection);
  }

  let reflectionTimer = null;

  function renderProphecy(data) {
    if (!data) return;

    audio.stopGazeBells();
    audio.playFinalPredictionChime();

    if (gazeStage) gazeStage.classList.remove('visible');

    const reflectionStage = document.getElementById('reflection-stage');
    if (reflectionStage) {
      reflectionStage.classList.remove('visible');
      reflectionStage.classList.add('hidden');
    }
    if (reflectionTimer) {
      clearTimeout(reflectionTimer);
      reflectionTimer = null;
    }

    setTimeout(() => {
      if (gazeStage) gazeStage.classList.add('hidden');
      if (prophecyStage) {
        prophecyStage.classList.remove('hidden');

        const predictionText = data.prediction_text || data.text || "The chart says one thing and your behaviour says another. Ask the direct question instead of decoding punctuation.";
        const transit = data.transit || "Sun in Virgo ✧ Jupiter in Taurus • 10th House of Ambition";
        const symbol = data.aspect_meta?.symbol || '✧';
        const orb = (data.aspect_meta && data.aspect_meta.orb !== undefined) ? data.aspect_meta.orb : 0.5;

        if (transitGlyph) transitGlyph.textContent = symbol;
        if (transitText) transitText.textContent = `${transit} (orb ${orb}°)`;
        if (prophecyQuote) prophecyQuote.textContent = `"${predictionText}"`;

        requestAnimationFrame(() => {
          prophecyStage.classList.add('visible');
        });

        // 40 Seconds after prediction display, trigger 2000s Preamble Popup Dialog (extended view time)
        reflectionTimer = setTimeout(() => {
          showRetroPreamblePopup();
        }, 40000);
      }
    }, 2000);
  }

  let popupCountdownInterval = null;

  function showRetroPreamblePopup() {
    const popupOverlay = document.getElementById('retro-popup-overlay');
    const timerText = document.getElementById('retro-timer-text');
    const timerFill = document.getElementById('retro-timer-fill');
    const okBtn = document.getElementById('retro-ok-btn');
    const closeBtn = document.getElementById('retro-close-btn');

    if (!popupOverlay) return;

    audio.playPopupAlert();
    popupOverlay.classList.remove('hidden');

    const startTime = performance.now();
    const totalMs = 60000; // 60 seconds (1 minute hold)

    if (popupCountdownInterval) clearInterval(popupCountdownInterval);
    popupCountdownInterval = setInterval(() => {
      const elapsed = performance.now() - startTime;
      const remainingMs = Math.max(0, totalMs - elapsed);
      const remainingSec = Math.ceil(remainingMs / 1000);
      const fillPercent = (remainingMs / totalMs) * 100;

      if (timerText) timerText.textContent = `System reconfiguration in ${remainingSec}s...`;
      if (timerFill) timerFill.style.width = `${fillPercent}%`;

      if (remainingMs <= 0) {
        dismissPopupAndReconfigure();
      }
    }, 100);

    function dismissPopupAndReconfigure() {
      if (popupCountdownInterval) {
        clearInterval(popupCountdownInterval);
        popupCountdownInterval = null;
      }
      popupOverlay.classList.add('hidden');
      startReconfiguration();
    }

    if (okBtn) {
      okBtn.onclick = () => dismissPopupAndReconfigure();
    }
    if (closeBtn) {
      closeBtn.onclick = () => dismissPopupAndReconfigure();
    }
  }

  function startReconfiguration() {
    console.log('[Mirror]: 60s preamble complete — Launching System Reconfiguration screen...');
    const reconfigStage = document.getElementById('reconfig-stage');

    if (prophecyStage) prophecyStage.classList.remove('visible');
    if (gazeStage) gazeStage.classList.remove('visible');

    setTimeout(() => {
      if (prophecyStage) prophecyStage.classList.add('hidden');
      if (gazeStage) gazeStage.classList.add('hidden');

      if (reconfigStage) {
        reconfigStage.classList.remove('hidden');
        requestAnimationFrame(() => {
          reconfigStage.classList.add('visible');
        });
      }

      audio.playGearClick();

      // Hold reconfiguration screen for 5 seconds
      setTimeout(() => {
        if (reconfigStage) reconfigStage.classList.remove('visible');
        setTimeout(() => {
          if (reconfigStage) reconfigStage.classList.add('hidden');
          restartMirror();
        }, 800);
      }, 5000);
    }, 600);
  }

  function restartMirror() {
    console.log('[Mirror]: Reconfiguration complete — Returning to Sunset Liquid Screensaver...');
    isAwakened = false;
    isPresenceDetected = false;
    isScreensaverActive = true;
    isTransitioning = false;
    isInstructionPhase = false;
    isCallPhase = false;
    instructionStartTime = 0;
    voiceFillPercent = 0.0;

    if (voiceFillFg) voiceFillFg.style.setProperty('--voice-fill-percent', '0%');

    audio.silenceAllAudio();

    const topBar = document.getElementById('top-bar');
    if (topBar) topBar.classList.add('hidden');

    if (autoAwakenTimer) {
      clearTimeout(autoAwakenTimer);
      autoAwakenTimer = null;
    }

    if (liquidSunset) liquidSunset.resetSwirl();
    const liquidCanvas = document.getElementById('sunset-liquid-canvas');
    if (liquidCanvas) liquidCanvas.classList.remove('swirled-out');

    if (instructionsStage) {
      instructionsStage.classList.remove('visible');
      instructionsStage.classList.add('hidden');
    }

    if (callStage) {
      callStage.classList.remove('visible');
      callStage.classList.add('hidden');
    }

    if (screensaverStage) {
      screensaverStage.classList.remove('hidden');
      requestAnimationFrame(() => {
        screensaverStage.classList.add('visible');
      });
    }
  }

  async function renderLocalFallback(direction) {
    const isLeft = direction === 'left';
    const jsonFile = isLeft ? 'corpus_left.json' : 'corpus_right.json';
    let chosen = null;

    console.log(`[Mirror]: Eye tracking criteria fulfilled for ${direction.toUpperCase()} gaze. Fetching ${jsonFile}...`);

    try {
      const resp = await fetch(jsonFile);
      if (resp.ok) {
        const data = await resp.json();
        const entries = data.entries || [];
        if (entries.length > 0) {
          chosen = entries[Math.floor(Math.random() * entries.length)];
          console.log(`[Mirror]: Selected entry #${chosen.id} from ${jsonFile}`);
        }
      }
    } catch (e) {
      console.warn(`[Mirror]: Error reading ${jsonFile} on demand:`, e);
    }

    if (!chosen) {
      chosen = {
        id: isLeft ? 1 : 59,
        text: isLeft 
          ? "The chart says one thing and your behaviour says another. Ask the direct question instead of decoding punctuation."
          : "your standing on the back of a truck with warm lights while David bowie plays and boom ur back at your bed with 10 tabs open..."
      };
    }

    const now = new Date();
    const transits = [
      "Sun in Virgo ✧ Jupiter in Taurus • 10th House of Ambition",
      "Mercury ⚹ Venus in your 3rd House of Communication",
      "Moon △ Mars in your 1st House of Self & Presence",
      "Jupiter △ Saturn in your 6th House of Routine & Discipline",
      "Neptune ⚹ Pluto in your 11th House of Alliances & Group Chats"
    ];
    const transitStr = transits[(now.getHours() + now.getMinutes()) % transits.length];

    renderProphecy({
      direction: direction,
      corpus_source: jsonFile,
      entry_id: chosen.id,
      prediction_text: chosen.text,
      transit: transitStr,
      aspect_meta: { symbol: "△", orb: 0.3 }
    });
  }

  // 7. Ultra-Sensitive On-Device Acoustic Voice Detector (Unified single permission stream)
  async function initDirectMicrophone(existingStream = null) {
    if (analyser) return; // Already connected to stream

    try {
      let stream = existingStream || micStream;
      if (!stream) {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
      }
      micStream = stream;

      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      audioContext = new AudioCtx();
      const source = audioContext.createMediaStreamSource(stream);
      analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.6;
      source.connect(analyser);

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      let voiceStreak = 0;

      function monitorAudioEnergy() {
        if (!analyser) return;
        analyser.getByteFrequencyData(dataArray);

        // Focus on vocal frequency range (~150Hz to 3500Hz: bins 4 to 45)
        let vocalSum = 0;
        let vocalBins = 0;
        for (let i = 3; i < 45; i++) {
          vocalSum += dataArray[i];
          vocalBins++;
        }
        const vocalLevel = vocalSum / vocalBins;

        // Overall energy level
        let totalSum = 0;
        for (let i = 0; i < bufferLength; i++) {
          totalSum += dataArray[i];
        }
        const totalLevel = totalSum / bufferLength;

        // Auto-calibrate ambient noise floor
        if (noiseSampleCount < 80) {
          ambientNoiseFloor = ambientNoiseFloor * 0.92 + vocalLevel * 0.08;
          noiseSampleCount++;
        }

        // Animate wave bars with live microphone energy
        const normalizedDiff = Math.max(0, vocalLevel - ambientNoiseFloor);
        const barHeight = Math.min(26, Math.max(3, 3 + normalizedDiff * 1.5));
        if (waveBars && waveBars.length > 0) {
          waveBars.forEach((bar, idx) => {
            const mod = 1 + Math.sin(Date.now() * 0.006 + idx * 1.4) * 0.3;
            bar.style.height = `${barHeight * mod}px`;
          });
        }

        // Smooth Acoustic Voice Progress Fill on Stage 3 (Voice Call)
        if (isCallPhase && !isAwakened) {
          const normalizedDiff = Math.max(0, vocalLevel - ambientNoiseFloor);
          if (normalizedDiff > 3.0) {
            boostVoiceFill(normalizedDiff * 0.08 + 0.12);
          }
        }

        requestAnimationFrame(monitorAudioEnergy);
      }

      monitorAudioEnergy();
      console.log('[Acoustic Engine]: Direct on-device microphone listener connected & monitoring live');
    } catch (err) {
      console.warn('[Acoustic Engine]: Mic direct access error:', err);
    }
  }

  // 8. Robust Web Speech Recognition (Triggers awakenMirror on ANY vocal input)
  function initSpeechAPI() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcript = event.results[i][0].transcript.toLowerCase().trim();
          console.log('[Speech API Heard]:', transcript);

          if (transcript.length > 0 && isCallPhase && !isAwakened) {
            let matchPoints = 0;
            if (transcript.includes('mirror')) matchPoints += 35;
            if ((transcript.match(/mirror/g) || []).length >= 2) matchPoints += 25;
            if (transcript.includes('on')) matchPoints += 15;
            if (transcript.includes('wall')) matchPoints += 25;

            if (matchPoints > 0) {
              boostVoiceFill(matchPoints);
            } else {
              boostVoiceFill(20);
            }
          }
        }
      };

      recognition.onend = () => {
        if (!isAwakened) {
          setTimeout(() => {
            try { recognition.start(); } catch (e) {}
          }, 200);
        }
      };

      recognition.start();
    } catch (e) {}
  }

  // 9. Initialize Vision Detector & Connect Shared Audio/Video Permission Stream
  const vision = new VisionDetector(
    'webcam-video',
    'vision-canvas',
    onSeekerPresenceDetected,
    null,
    (sharedStream) => {
      initDirectMicrophone(sharedStream);
    }
  );

  // 10. User Gesture Unlock (100% Silent during screensaver mode)
  function userGestureUnlock() {
    if (isScreensaverActive) {
      audio.silenceAllAudio();
    } else {
      audio.startAmbientDrone();
      audio.startFairyNoise();
    }
    if (audioContext && audioContext.state === 'suspended') {
      audioContext.resume();
    }
    initDirectMicrophone();
    initSpeechAPI();
  }

  window.addEventListener('click', userGestureUnlock, { once: true });
  window.addEventListener('touchstart', userGestureUnlock, { once: true });

  // Mouse movement on left/right screen half nudges dwell time during 10s hold
  window.addEventListener('mousemove', (e) => {
    if (vision && vision.isRecordingGazeSession) {
      if (e.clientX < window.innerWidth * 0.45) {
        vision.nudgeGaze('left', 60);
      } else if (e.clientX > window.innerWidth * 0.55) {
        vision.nudgeGaze('right', 60);
      }
    }
  });

  if (screensaverStage) {
    screensaverStage.style.cursor = 'pointer';
    screensaverStage.addEventListener('click', () => {
      userGestureUnlock();
      if (isScreensaverActive) {
        triggerSwirlToNextScreen();
      }
    });
  }

  if (instructionsStage) {
    instructionsStage.addEventListener('click', () => {
      userGestureUnlock();
    });
  }

  if (callStage) {
    callStage.style.cursor = 'pointer';
    callStage.addEventListener('click', () => {
      userGestureUnlock();
      if (isCallPhase && !isAwakened) {
        boostVoiceFill(35);
      }
    });
  }

  if (consultAgainBtn) {
    consultAgainBtn.addEventListener('click', () => {
      const reflectionStage = document.getElementById('reflection-stage');
      if (reflectionStage) {
        reflectionStage.classList.remove('visible');
        reflectionStage.classList.add('hidden');
      }
      if (reflectionTimer) {
        clearTimeout(reflectionTimer);
        reflectionTimer = null;
      }
      if (prophecyStage) prophecyStage.classList.remove('visible');
      setTimeout(() => {
        if (prophecyStage) prophecyStage.classList.add('hidden');
        if (gazeStage) {
          gazeStage.classList.remove('hidden');
          requestAnimationFrame(() => {
            gazeStage.classList.add('visible');
          });
        }
        if (vision) {
          vision.startGazeSession(10000, (winningDirection, telemetry) => {
            onGazeSessionResolved(winningDirection, telemetry);
          });
        }
      }, 1500);
    });
  }

  window.addEventListener('keydown', (e) => {
    userGestureUnlock();
    if (e.code === 'Space' || e.code === 'Enter') {
      if (isScreensaverActive) {
        triggerSwirlToNextScreen();
      } else if (isCallPhase && !isAwakened) {
        boostVoiceFill(35);
      }
    } else if (e.code === 'ArrowLeft') {
      if (vision && vision.isRecordingGazeSession) {
        vision.nudgeGaze('left', 600);
      }
    } else if (e.code === 'ArrowRight') {
      if (vision && vision.isRecordingGazeSession) {
        vision.nudgeGaze('right', 600);
      }
    }
  });

  // Attempt automatic mic startup
  initDirectMicrophone();
  initSpeechAPI();
});
