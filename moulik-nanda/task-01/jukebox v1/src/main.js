// Main application controller for the Physical Y2K DVD Binder
import { DVDBinder3D } from './dvdBinder3D.js';
import { DISCS } from './discsData.js';
import { sounds } from './audio.js';

class App {
  constructor() {
    this.viewportEl = document.getElementById('binder-viewport');
    
    // Initialize the physical 3D DVD binder
    this.binder = new DVDBinder3D(this.viewportEl, (index, isOpen, isEjected) => {
      this.updateHUD(index, isOpen, isEjected);
    });

    this.initUI();
    this.initGesturesAndKeys();
    this.updateHUD(this.binder.currentIndex, this.binder.isOpen, this.binder.isEjected);
  }

  initUI() {
    // Generate 15 VCR/LED scrubber segments in bottom navigation
    const track = document.getElementById('vcr-track-display');
    track.innerHTML = '';
    for (let i = 0; i < 15; i++) {
      const seg = document.createElement('div');
      seg.className = `vcr-segment ${i === 0 ? 'active' : ''}`;
      seg.title = `${i + 1}. ${DISCS[i].title} (${DISCS[i].year})`;
      seg.addEventListener('click', (e) => {
        e.stopPropagation();
        this.binder.goToDisc(i);
      });
      track.appendChild(seg);
    }

    // Media Control Buttons
    document.getElementById('btn-nav-prev').addEventListener('click', (e) => {
      e.stopPropagation();
      this.binder.flipPrev();
    });

    document.getElementById('btn-nav-next').addEventListener('click', (e) => {
      e.stopPropagation();
      this.binder.flipNext();
    });

    document.getElementById('btn-close-wallet').addEventListener('click', (e) => {
      e.stopPropagation();
      this.binder.closeWallet();
    });

    // Eject / Inspect Disc
    document.getElementById('btn-osd-eject').addEventListener('click', (e) => {
      e.stopPropagation();
      this.binder.toggleEjectActiveDisc();
    });

    // Play Preview
    document.getElementById('btn-osd-play').addEventListener('click', (e) => {
      e.stopPropagation();
      this.openCRTPlayer();
    });
    document.getElementById('btn-quick-play').addEventListener('click', (e) => {
      e.stopPropagation();
      this.openCRTPlayer();
    });

    // Sound toggle
    const soundBtn = document.getElementById('btn-sound');
    soundBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isSoundOn = sounds.toggleMute();
      soundBtn.textContent = isSoundOn ? 'SOUND: ON' : 'SOUND: OFF';
      soundBtn.classList.toggle('active', isSoundOn);
    });

    // Help modal
    const helpBtn = document.getElementById('btn-help');
    const helpModal = document.getElementById('help-modal');
    const helpClose = document.getElementById('help-btn-close');
    helpBtn.addEventListener('click', () => helpModal.classList.add('visible'));
    helpClose.addEventListener('click', () => helpModal.classList.remove('visible'));
    helpModal.addEventListener('click', (e) => {
      if (e.target === helpModal) helpModal.classList.remove('visible');
    });

    // CRT TV modal
    const crtModal = document.getElementById('crt-modal');
    const crtClose = document.getElementById('crt-btn-close');
    crtClose.addEventListener('click', () => this.closeCRTPlayer());
    crtModal.addEventListener('click', (e) => {
      if (e.target === crtModal) this.closeCRTPlayer();
    });

    // CRT Menu button interactions
    document.getElementById('crt-menu-play').addEventListener('click', () => {
      sounds.playOsdBeep(1200, 0.06);
      document.getElementById('crt-tv-format').textContent = 'DVD-VIDEO [PLAYING ▶]';
    });

    document.getElementById('crt-menu-scenes').addEventListener('click', () => {
      sounds.playOsdBeep(980, 0.06);
      const disc = DISCS[this.binder.currentIndex];
      alert(`📑 SCENE SELECTION:\n• ${disc.chapters.slice(0, 4).join('\n• ')}`);
    });

    document.getElementById('crt-menu-special').addEventListener('click', () => {
      sounds.playOsdBeep(1400, 0.06);
      const disc = DISCS[this.binder.currentIndex];
      alert(`⭐ SPECIAL BONUS FEATURES:\n\n${disc.easterEgg}`);
    });

    document.getElementById('crt-menu-audio').addEventListener('click', () => {
      sounds.playOsdBeep(1100, 0.06);
      const disc = DISCS[this.binder.currentIndex];
      alert(`🔊 AUDIO CONFIGURATION:\n• Audio: ${disc.audio}\n• Region: ${disc.region}`);
    });
  }

  updateHUD(idx, isOpen, isEjected) {
    const disc = DISCS[idx];

    const closedPrompt = document.getElementById('closed-prompt-container');
    const discPanel = document.getElementById('disc-osd-panel');
    const bottomDock = document.getElementById('bottom-nav-dock');
    const statusText = document.getElementById('system-status-text');

    if (!isOpen) {
      closedPrompt.style.display = 'block';
      discPanel.classList.remove('visible');
      bottomDock.classList.remove('visible');
      statusText.textContent = 'DISCMAN-04 // 15-DISC OPTICAL WALLET // CLOSED [CLICK TO OPEN]';
    } else {
      closedPrompt.style.display = 'none';
      discPanel.classList.add('visible');
      bottomDock.classList.add('visible');
      statusText.textContent = `DISCMAN-04 // OPTICAL DISC ${String(idx + 1).padStart(2, '0')}/15 // TRACK READY`;
    }

    // Update OSD info box
    document.getElementById('osd-index-tag').textContent = `DISC ${String(idx + 1).padStart(2, '0')} / 15`;
    document.getElementById('osd-format-tag').textContent = disc.format;
    document.getElementById('osd-disc-title').textContent = disc.title.toUpperCase();
    document.getElementById('osd-disc-meta').textContent = `${disc.year} • ${disc.runtime} • ${disc.region}`;
    document.getElementById('osd-disc-synopsis').textContent = disc.synopsis;

    // Button states
    document.getElementById('btn-nav-prev').disabled = (idx === 0);
    document.getElementById('btn-nav-next').disabled = (idx === 14);

    const ejectBtn = document.getElementById('btn-osd-eject');
    ejectBtn.textContent = isEjected ? '⬇ RETURN DISC' : '⏏ EJECT DISC';

    document.getElementById('osd-counter-readout').textContent = `DISC ${String(idx + 1).padStart(2, '0')} / 15`;

    // Update VCR timeline segments
    const segments = document.querySelectorAll('.vcr-segment');
    segments.forEach((seg, i) => {
      seg.classList.toggle('active', i === idx);
    });
  }

  openCRTPlayer() {
    const idx = this.binder.currentIndex;
    const disc = DISCS[idx];

    document.getElementById('crt-tv-title').textContent = disc.title.toUpperCase();
    document.getElementById('crt-tv-meta').textContent = `${disc.year} • ${disc.aspect} • ${disc.runtime}`;
    document.getElementById('crt-tv-format').textContent = `${disc.format} [MENU]`;
    document.getElementById('crt-tv-audio').textContent = disc.audio.toUpperCase();
    document.getElementById('crt-tv-region').textContent = disc.region;

    document.getElementById('crt-modal').classList.add('visible');
    sounds.playLaserSeek();
    sounds.startAmbientChord();
  }

  closeCRTPlayer() {
    document.getElementById('crt-modal').classList.remove('visible');
    sounds.stopAmbientChord();
    sounds.playSnap();
  }

  initGesturesAndKeys() {
    // Keyboard Shortcuts
    window.addEventListener('keydown', (e) => {
      if (document.getElementById('crt-modal').classList.contains('visible')) {
        if (e.key === 'Escape') this.closeCRTPlayer();
        return;
      }
      if (document.getElementById('help-modal').classList.contains('visible')) {
        if (e.key === 'Escape') document.getElementById('help-modal').classList.remove('visible');
        return;
      }

      switch (e.key) {
        case 'ArrowRight':
        case ' ':
          if (!this.binder.isOpen) {
            this.binder.openWallet();
          } else {
            this.binder.flipNext();
          }
          break;
        case 'ArrowLeft':
          if (this.binder.isOpen) {
            this.binder.flipPrev();
          }
          break;
        case 'o':
        case 'O':
          this.binder.toggleOpenClose();
          break;
        case 'e':
        case 'E':
        case 'i':
        case 'I':
          this.binder.toggleEjectActiveDisc();
          break;
        case 'p':
        case 'P':
        case 'Enter':
          this.openCRTPlayer();
          break;
        case 'm':
        case 'M':
          document.getElementById('btn-sound').click();
          break;
        case 'Escape':
          if (this.binder.isOpen) {
            this.binder.closeWallet();
          }
          break;
      }
    });

    // Touch & Mouse Drag / Swipe Detection with Momentum
    let dragStartX = 0;
    let dragStartY = 0;
    let dragStartTime = 0;
    let isDown = false;

    window.addEventListener('pointerdown', (e) => {
      // Ignore clicks on UI buttons
      if (e.target.closest('#ui-overlay') || e.target.closest('#crt-modal') || e.target.closest('#help-modal')) {
        return;
      }
      isDown = true;
      dragStartX = e.clientX;
      dragStartY = e.clientY;
      dragStartTime = performance.now();
    });

    window.addEventListener('pointerup', (e) => {
      if (!isDown) return;
      isDown = false;

      const dx = e.clientX - dragStartX;
      const dy = e.clientY - dragStartY;
      const dt = performance.now() - dragStartTime;

      // Horizontal swipe gesture
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.2 && dt < 450) {
        if (this.binder.isOpen) {
          if (dx < 0) {
            this.binder.flipNext();
          } else {
            this.binder.flipPrev();
          }
        } else {
          this.binder.openWallet();
        }
      }
    });

    // Mouse Wheel / Trackpad Scroll to snoop through discs
    let wheelAccumulator = 0;
    let lastWheelTime = 0;

    window.addEventListener('wheel', (e) => {
      if (!this.binder.isOpen) return;
      if (e.target.closest('#crt-modal') || e.target.closest('#help-modal')) return;

      const now = performance.now();
      if (now - lastWheelTime < 240) return;

      wheelAccumulator += e.deltaY || e.deltaX;
      if (Math.abs(wheelAccumulator) > 35) {
        if (wheelAccumulator > 0) {
          this.binder.flipNext();
        } else {
          this.binder.flipPrev();
        }
        wheelAccumulator = 0;
        lastWheelTime = now;
      }
    }, { passive: true });
  }
}

// Boot application
window.addEventListener('DOMContentLoaded', () => {
  new App();
});
