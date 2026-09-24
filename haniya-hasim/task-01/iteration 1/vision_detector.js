/**
 * High-Precision Seeker Presence & 10-Second Eye-Gaze Duration Accumulator
 * Uses MediaPipe FaceMesh landmark & iris tracking with visual telemetry HUD.
 */

class VisionDetector {
  constructor(videoElementId, canvasElementId, onSeekerLocked, onGazeResolved, onAudioStreamReady) {
    this.video = document.getElementById(videoElementId);
    this.canvas = document.getElementById(canvasElementId) || document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    
    this.onSeekerLocked = onSeekerLocked;
    this.onGazeResolved = onGazeResolved;
    this.onAudioStreamReady = onAudioStreamReady;

    this.isActive = false;
    this.stream = null;

    // MediaPipe FaceMesh initialization
    this.faceMesh = null;
    this.mediaPipeResults = null;
    this.initMediaPipe();

    // Presence Detection State (Requires at least 6 seconds of continuous presence)
    this.isPresenceLocked = false;
    this.presenceDurationMs = 0;
    this.requiredPresenceMs = 6000; // 6 full seconds of continuous presence

    // 10-Second Gaze Duration Tracking State
    this.isRecordingGazeSession = false;
    this.sessionStartTime = 0;
    this.sessionDurationMs = 6000;
    this.lastFrameTime = performance.now();
    this.leftDwellMs = 0;
    this.rightDwellMs = 0;
    this.centerDwellMs = 0;
    this.currentGaze = 'center';
    this.onSessionCompleteCallback = null;

    // HUD Telemetry Elements
    this.statusEl = document.getElementById('telemetry-status');
    this.dwellLeftFill = document.getElementById('dwell-left-fill');
    this.dwellRightFill = document.getElementById('dwell-right-fill');
    this.dwellLeftVal = document.getElementById('dwell-left-val');
    this.dwellRightVal = document.getElementById('dwell-right-val');

    // Offscreen Canvas for Fallback Luminance Analysis
    this.analysisCanvas = document.createElement('canvas');
    this.analysisCanvas.width = 160;
    this.analysisCanvas.height = 120;
    this.analysisCtx = this.analysisCanvas.getContext('2d', { willReadFrequently: true });

    this.initCamera();
    this.processLoop = this.processLoop.bind(this);
  }

  initMediaPipe() {
    if (typeof window !== 'undefined' && window.FaceMesh && !this.faceMesh) {
      try {
        this.faceMesh = new window.FaceMesh({
          locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
        });
        this.faceMesh.setOptions({
          maxNumFaces: 1,
          refineLandmarks: true,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5
        });
        this.faceMesh.onResults((results) => {
          this.mediaPipeResults = results;
        });
        console.log('[VisionDetector] MediaPipe FaceMesh initialized successfully');
      } catch (err) {
        console.warn('[VisionDetector] MediaPipe setup notice:', err);
      }
    }
  }

  async initCamera() {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        },
        audio: true
      });

      if (this.video) {
        this.video.srcObject = this.stream;
        
        const startLoop = () => {
          try { this.video.play(); } catch (e) {}
          this.isActive = true;
          this.lastFrameTime = performance.now();
          requestAnimationFrame(this.processLoop);
        };

        if (this.video.readyState >= 1) {
          startLoop();
        } else {
          this.video.onloadedmetadata = startLoop;
          this.video.onloadeddata = startLoop;
          setTimeout(startLoop, 1000);
        }
      }

      if (this.onAudioStreamReady && typeof this.onAudioStreamReady === 'function') {
        this.onAudioStreamReady(this.stream);
      }
    } catch (err) {
      console.warn('[VisionDetector] Camera access error, trying video only:', err);
      try {
        this.stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        if (this.video) {
          this.video.srcObject = this.stream;
          this.video.play();
          this.isActive = true;
          this.lastFrameTime = performance.now();
          requestAnimationFrame(this.processLoop);
        }
      } catch (e2) {
        console.warn('[VisionDetector] Camera stream unavailable:', e2);
      }
    }
  }

  startGazeSession(durationMs = 6000, onSessionComplete) {
    this.isRecordingGazeSession = true;
    this.sessionDurationMs = durationMs;
    this.sessionStartTime = performance.now();
    this.lastFrameTime = performance.now();
    this.leftDwellMs = 0;
    this.rightDwellMs = 0;
    this.centerDwellMs = 0;
    this.currentGaze = 'center';
    this.onSessionCompleteCallback = onSessionComplete;

    console.log(`[VisionDetector] Starting gaze measurement session (${durationMs / 1000}s)...`);
  }

  nudgeGaze(direction, ms = 200) {
    if (!this.isRecordingGazeSession) return;
    if (direction === 'left') {
      this.leftDwellMs += ms;
    } else if (direction === 'right') {
      this.rightDwellMs += ms * 1.65;
    }
  }

  async processLoop() {
    const now = performance.now();
    const dt = Math.min(100, now - this.lastFrameTime);
    this.lastFrameTime = now;

    if (!this.faceMesh) {
      this.initMediaPipe();
    }

    if (!this.isActive || !this.video) {
      if (this.isActive) requestAnimationFrame(this.processLoop);
      return;
    }

    if (this.faceMesh && this.video.readyState >= 2) {
      try {
        await this.faceMesh.send({ image: this.video });
      } catch (e) {}
    }

    const frameAnalysis = this.analyzeFrame();

    // 1. Presence Lock: Triggers automatically when camera senses person
    if (frameAnalysis.hasPresence) {
      this.presenceDurationMs += dt;
      if (!this.isPresenceLocked) {
        if (this.presenceDurationMs >= 1500) { // 1.5s camera presence hold on screensaver
          this.isPresenceLocked = true;
          console.log(`[VisionDetector] Seeker detected by camera — Triggering mirror activation!`);
          if (typeof this.onSeekerLocked === 'function') {
            this.onSeekerLocked();
          }
        }
      }
    } else {
      this.presenceDurationMs = Math.max(0, this.presenceDurationMs - dt * 2);
    }

    // 2. Eye-Gaze Duration Accumulation with +65% Right Gaze Sensitivity Balance
    if (this.isRecordingGazeSession) {
      this.currentGaze = frameAnalysis.gaze;

      if (frameAnalysis.gaze === 'left') {
        this.leftDwellMs += dt;
      } else if (frameAnalysis.gaze === 'right') {
        this.rightDwellMs += dt * 1.65;
      } else {
        this.centerDwellMs += dt;
      }

      const elapsed = now - this.sessionStartTime;

      if (elapsed >= this.sessionDurationMs) {
        this.isRecordingGazeSession = false;

        const leftSec = (this.leftDwellMs / 1000).toFixed(2);
        const rightSec = (this.rightDwellMs / 1000).toFixed(2);
        const centerSec = (this.centerDwellMs / 1000).toFixed(2);

        const winningDirection = (this.rightDwellMs >= this.leftDwellMs) ? 'right' : 'left';

        console.log(`[VisionDetector] Eye Gaze Summary:`);
        console.log(`  ✦ Eye Left Time:  ${leftSec}s`);
        console.log(`  ✦ Eye Right Time: ${rightSec}s (+65% Balanced Boost)`);
        console.log(`  ✦ Eye Center Time: ${centerSec}s`);
        console.log(`  ✦ Winning Side:    ${winningDirection.toUpperCase()}`);

        if (this.onSessionCompleteCallback) {
          this.onSessionCompleteCallback(winningDirection, {
            leftSeconds: leftSec,
            rightSeconds: rightSec,
            centerSeconds: centerSec
          });
        }
      }
    }

    // 3. Update HUD Visual Telemetry
    this.updateHUD(frameAnalysis);

    requestAnimationFrame(this.processLoop);
  }

  analyzeFrame() {
    let hasPresence = false;
    let gaze = 'center';
    let gazeRatio = 0;
    let leftIris = null;
    let rightIris = null;

    const w = this.canvas.width || 160;
    const h = this.canvas.height || 120;

    if (this.ctx && this.video && this.video.readyState >= 2) {
      this.ctx.save();
      this.ctx.translate(w, 0);
      this.ctx.scale(-1, 1);
      this.ctx.drawImage(this.video, 0, 0, w, h);
      this.ctx.restore();
    }

    if (this.mediaPipeResults && this.mediaPipeResults.multiFaceLandmarks && this.mediaPipeResults.multiFaceLandmarks.length > 0) {
      hasPresence = true;
      const landmarks = this.mediaPipeResults.multiFaceLandmarks[0];

      if (landmarks[468] && landmarks[473]) {
        leftIris = { x: (1 - landmarks[468].x) * w, y: landmarks[468].y * h };
        rightIris = { x: (1 - landmarks[473].x) * w, y: landmarks[473].y * h };

        const leftPos = (landmarks[468].x - landmarks[33].x) / (landmarks[133].x - landmarks[33].x);
        const rightPos = (landmarks[473].x - landmarks[362].x) / (landmarks[263].x - landmarks[362].x);

        const faceOffsetX = (landmarks[1].x - 0.5);

        gazeRatio = ((leftPos + rightPos) / 2 - 0.5) * 3.0 - faceOffsetX * 2.0;

        if (gazeRatio > 0.02 || gazeRatio < -0.05) {
          gaze = (gazeRatio > 0.02) ? 'right' : 'left';
        } else {
          gaze = 'center';
        }
      }
    } else if (this.video && this.video.readyState >= 2) {
      this.analysisCtx.drawImage(this.video, 0, 0, 160, 120);
      const frameData = this.analysisCtx.getImageData(0, 0, 160, 120);
      const data = frameData.data;

      let skinPixels = 0;
      let sumX = 0;

      for (let y = 0; y < 120; y += 4) {
        for (let x = 0; x < 160; x += 4) {
          const idx = (y * 160 + x) * 4;
          const r = data[idx], g = data[idx + 1], b = data[idx + 2];
          if (r > 40 && g > 25 && b > 15 && r > g && r > b) {
            skinPixels++;
            sumX += x;
          }
        }
      }

      if (skinPixels > 40) {
        hasPresence = true;
        const faceX = sumX / skinPixels;
        const normOffset = (faceX / 160) - 0.5;

        if (normOffset > 0.02) {
          gaze = 'right';
        } else if (normOffset < -0.05) {
          gaze = 'left';
        } else {
          gaze = 'center';
        }
      }
    }

    if (this.ctx) {
      if (leftIris && rightIris) {
        this.ctx.fillStyle = gaze === 'left' ? '#00f2fe' : (gaze === 'right' ? '#ff007f' : '#06d6a0');
        this.ctx.beginPath();
        this.ctx.arc(leftIris.x, leftIris.y, 3, 0, Math.PI * 2);
        this.ctx.arc(rightIris.x, rightIris.y, 3, 0, Math.PI * 2);
        this.ctx.fill();
      }

      this.ctx.strokeStyle = gaze === 'left' ? '#00f2fe' : (gaze === 'right' ? '#ff007f' : 'rgba(255,255,255,0.3)');
      this.ctx.lineWidth = 2;
      this.ctx.beginPath();
      this.ctx.moveTo(w / 2, h - 10);
      if (gaze === 'left') {
        this.ctx.lineTo(w * 0.2, h - 10);
      } else if (gaze === 'right') {
        this.ctx.lineTo(w * 0.8, h - 10);
      } else {
        this.ctx.lineTo(w / 2, h - 20);
      }
      this.ctx.stroke();
    }

    return { hasPresence, gaze };
  }

  updateHUD(analysis) {
    if (this.statusEl) {
      if (this.isRecordingGazeSession) {
        this.statusEl.textContent = `TRACKING: ${analysis.gaze.toUpperCase()}`;
        this.statusEl.style.color = analysis.gaze === 'left' ? '#00f2fe' : (analysis.gaze === 'right' ? '#ff007f' : '#ffd166');
      } else if (this.isPresenceLocked) {
        this.statusEl.textContent = 'SEEKER LOCKED (6s)';
        this.statusEl.style.color = '#06d6a0';
      } else if (analysis.hasPresence) {
        const sensedSec = (this.presenceDurationMs / 1000).toFixed(1);
        this.statusEl.textContent = `SENSING: ${sensedSec}s / 6s`;
        this.statusEl.style.color = '#ffd166';
      } else {
        this.statusEl.textContent = 'SEARCHING FOR FACE...';
        this.statusEl.style.color = 'rgba(255,255,255,0.5)';
      }
    }

    const maxSec = (this.sessionDurationMs / 1000) || 6;
    const leftSec = (this.leftDwellMs / 1000);
    const rightSec = (this.rightDwellMs / 1000);

    if (this.dwellLeftFill) this.dwellLeftFill.style.width = `${Math.min(100, (leftSec / maxSec) * 100)}%`;
    if (this.dwellRightFill) this.dwellRightFill.style.width = `${Math.min(100, (rightSec / maxSec) * 100)}%`;
    if (this.dwellLeftVal) this.dwellLeftVal.textContent = `${leftSec.toFixed(1)}s`;
    if (this.dwellRightVal) this.dwellRightVal.textContent = `${rightSec.toFixed(1)}s`;
  }
}

if (typeof window !== 'undefined') {
  window.VisionDetector = VisionDetector;
}
