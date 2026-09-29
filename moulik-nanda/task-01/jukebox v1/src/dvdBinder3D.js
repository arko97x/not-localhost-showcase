// Physical CSS 3D DVD Binder Model & Physics Engine
import { DISCS, createDiscTexture } from './discsData.js';
import { sounds } from './audio.js';

export class DVDBinder3D {
  constructor(containerEl, onDiscChange) {
    this.container = containerEl;
    this.onDiscChange = onDiscChange;
    this.currentIndex = 0; // 0 to 14
    this.isOpen = false;   // Starts closed
    this.isEjected = false;

    // Track mouse parallax
    this.mouseX = 0;
    this.mouseY = 0;
    this.currentRotX = 0;
    this.currentRotY = 0;

    // DOM references
    this.binderEl = null;
    this.frontCoverEl = null;
    this.spineEl = null;
    this.sleeves = [];
    this.discElements = [];

    this.buildPhysicalBinder();
    this.initParallax();
    this.updateLayeredDepth();
  }

  buildPhysicalBinder() {
    this.container.innerHTML = '';

    // Outer 3D stage wrapper
    const stage = document.createElement('div');
    stage.className = 'binder-stage';

    // Shadow on the floor/background beneath the floating wallet
    this.floorShadow = document.createElement('div');
    this.floorShadow.className = 'binder-floor-shadow';
    stage.appendChild(this.floorShadow);

    // The Main 3D Binder Assembly
    this.binderEl = document.createElement('div');
    this.binderEl.className = 'physical-binder closed';
    stage.appendChild(this.binderEl);

    // 1. BACK COVER & INNER CAVITY
    const backCover = document.createElement('div');
    backCover.className = 'binder-back-cover';
    backCover.innerHTML = `
      <div class="cover-texture-face back-face"></div>
      <div class="cover-inner-lining"></div>
      <div class="zipper-edge bottom-zipper"></div>
      <div class="zipper-edge right-zipper"></div>
      <div class="zipper-edge top-zipper"></div>
    `;
    this.binderEl.appendChild(backCover);

    // 2. THE SPINE & VISIBLE HINGE
    this.spineEl = document.createElement('div');
    this.spineEl.className = 'binder-spine';
    this.spineEl.innerHTML = `
      <div class="spine-cylinder"></div>
      <div class="spine-rivet rivet-top"></div>
      <div class="spine-rivet rivet-mid"></div>
      <div class="spine-rivet rivet-bot"></div>
      <div class="spine-wrist-strap">
        <div class="strap-eyelet"></div>
        <div class="strap-ribbon"></div>
      </div>
      <!-- Internal Metal Binder Rings -->
      <div class="binder-ring ring-1"></div>
      <div class="binder-ring ring-2"></div>
    `;
    this.binderEl.appendChild(this.spineEl);

    // 3. SLEEVES CONTAINER (Holds all 15 layered physical DVD pages)
    this.sleevesContainer = document.createElement('div');
    this.sleevesContainer.className = 'sleeves-container';
    this.binderEl.appendChild(this.sleevesContainer);

    this.build15Sleeves();

    // 4. THE FRONT COVER (Hinged on the left around the spine!)
    this.frontCoverEl = document.createElement('div');
    this.frontCoverEl.className = 'binder-front-cover';
    this.frontCoverEl.innerHTML = `
      <!-- Outer Front Face (visible when closed) -->
      <div class="cover-texture-face front-outer">
        <!-- Frosted Circular Window -->
        <div class="frosted-window-frame">
          <div class="frosted-window-glass">
            <div class="window-disc-glint"></div>
          </div>
          <div class="window-rim-bolts">
            <span class="bolt b1"></span>
            <span class="bolt b2"></span>
            <span class="bolt b3"></span>
            <span class="bolt b4"></span>
          </div>
        </div>

        <!-- Physical Dymo / Metallic Label Sticker -->
        <div class="physical-label-sticker">
          <div class="sticker-border">
            <div class="sticker-line-1">DISCMAN '04</div>
            <div class="sticker-line-2">15-DISC WALLET</div>
            <div class="sticker-sub">MODEL: DW-15X • OPTICAL STORAGE</div>
          </div>
        </div>

        <!-- Perimeter Zipper Track & Slider -->
        <div class="zipper-edge top-zipper"></div>
        <div class="zipper-edge right-zipper"></div>
        <div class="zipper-edge bottom-zipper"></div>
        <div class="zipper-slider-pull">
          <div class="slider-box"></div>
          <div class="slider-tab"></div>
        </div>
      </div>

      <!-- Inner Face of Front Cover (visible when opened) -->
      <div class="cover-texture-face front-inner">
        <div class="inner-felt-pattern"></div>
        <div class="inner-window-back"></div>
      </div>
    `;

    // Clicking the front cover while closed opens the wallet!
    this.frontCoverEl.addEventListener('click', (e) => {
      if (!this.isOpen) {
        e.stopPropagation();
        this.openWallet();
      }
    });

    this.binderEl.appendChild(this.frontCoverEl);
    this.container.appendChild(stage);
  }

  build15Sleeves() {
    this.sleeves = [];
    this.discElements = [];

    for (let i = 0; i < 15; i++) {
      const discData = DISCS[i];

      // Physical Sleeve Page
      const sleeve = document.createElement('div');
      sleeve.className = `sleeve-page sleeve-${i}`;
      sleeve.dataset.index = i;

      // Generate procedural disc canvas texture
      const { canvas } = createDiscTexture(i);

      sleeve.innerHTML = `
        <!-- Hinge Binding Tab with reinforced eyelets -->
        <div class="sleeve-hinge-tab">
          <div class="sleeve-eyelet eyelet-top"></div>
          <div class="sleeve-eyelet eyelet-bot"></div>
        </div>

        <!-- Non-Woven Cloth Backing Sheet -->
        <div class="sleeve-cloth-backing">
          <div class="cloth-dimples"></div>
        </div>

        <!-- The DVD Disc inside the pocket -->
        <div class="dvd-disc" data-index="${i}">
          <div class="disc-iridescent-sheen"></div>
          <div class="disc-canvas-container"></div>
          <div class="disc-clear-hub">
            <div class="disc-spindle-hole"></div>
          </div>
        </div>

        <!-- Clear Polypropylene Front Pocket with Thumb Notch Cutout -->
        <div class="sleeve-plastic-pocket">
          <div class="pocket-thumb-notch"></div>
          <div class="plastic-specular-glare"></div>
          <div class="pocket-reinforced-trim"></div>
        </div>
      `;

      // Mount the high-res canvas artwork directly into the disc element
      const canvasMount = sleeve.querySelector('.disc-canvas-container');
      canvasMount.appendChild(canvas);

      const discEl = sleeve.querySelector('.dvd-disc');
      this.discElements.push(discEl);

      // Sleeve click interactions
      sleeve.addEventListener('click', (e) => {
        e.stopPropagation();
        if (!this.isOpen) {
          this.openWallet();
          return;
        }

        const clickedIndex = parseInt(sleeve.dataset.index, 10);
        if (clickedIndex === this.currentIndex) {
          // Clicked active disc -> toggle Eject / Inspect!
          this.toggleEjectActiveDisc();
        } else if (clickedIndex > this.currentIndex) {
          // Clicked upcoming disc stack on right -> flip forward to it!
          this.goToDisc(clickedIndex);
        } else {
          // Clicked turned disc stack on left -> flip backward to it!
          this.goToDisc(clickedIndex);
        }
      });

      this.sleevesContainer.appendChild(sleeve);
      this.sleeves.push(sleeve);
    }
  }

  // Update physical layered depth, rotations, offsets, shadows & scale for all 15 sleeves
  updateLayeredDepth() {
    const K = this.currentIndex;

    this.sleeves.forEach((sleeve, i) => {
      const discEl = this.discElements[i];

      if (!this.isOpen) {
        // --- CLOSED STATE ---
        // Sleeves neatly stacked in the tray with Sleeve 0 on top, Sleeve 14 on bottom
        const transZ = 22 - i * 1.3;
        sleeve.style.transform = `rotateY(0deg) translateZ(${transZ}px) scale(1)`;
        sleeve.style.zIndex = 30 - i;
        sleeve.style.filter = `brightness(${0.9 + (1 - i / 14) * 0.1})`;
        sleeve.style.boxShadow = `0 2px 6px rgba(0, 0, 0, 0.35)`;
        discEl.classList.remove('ejected');
        return;
      }

      // --- OPEN STATE ---
      if (i < K) {
        // Discs turned to the left side (stacked against the open front cover):
        // The most recently turned disc is (K - 1) which MUST sit ON TOP of the left stack!
        const offsetUnderTop = (K - 1) - i; // 0 for the most recent page, 1 for the one beneath it, etc.
        // Keep all turned sleeves strictly parallel at -126deg to eliminate plane intersection/clipping
        const rotY = -126;
        // In CSS 3D with negative rotY, cos(-126deg) is negative (~-0.588).
        // Increasing transZ moves the sleeve deeper into the screen (further from camera),
        // ensuring top turned sleeve (offsetUnderTop=0) is strictly closest to the viewer!
        const transZ = -8 + offsetUnderTop * 1.8;
        const transX = -offsetUnderTop * 0.8;
        const transY = offsetUnderTop * 0.3;
        const scale = Math.max(0.88, 1 - offsetUnderTop * 0.006);
        const brightness = Math.max(0.65, 0.95 - offsetUnderTop * 0.025);

        sleeve.style.transform = `rotateY(${rotY}deg) translateZ(${transZ}px) translateX(${transX}px) translateY(${transY}px) scale(${scale})`;
        
        // Preserve flight zIndex if currently flipping
        if (!sleeve.classList.contains('is-flipping')) {
          sleeve.style.zIndex = 80 - offsetUnderTop; // Top page has zIndex 80, next has 79, etc.
        }
        sleeve.style.filter = `brightness(${brightness})`;
        sleeve.style.boxShadow = `-4px 6px 14px rgba(0, 0, 0, 0.5)`;
        discEl.classList.remove('ejected');
      } else if (i === K) {
        // Active Disc: Sits closest to the viewer on the right stack, fully illuminated
        sleeve.style.transform = `rotateY(0deg) translateZ(35px) translateX(0px) translateY(0px) scale(1.04)`;
        if (!sleeve.classList.contains('is-flipping')) {
          sleeve.style.zIndex = 120; // Topmost on the right stack
        }
        sleeve.style.filter = `brightness(1.08) drop-shadow(0 15px 25px rgba(0,0,0,0.65))`;
        sleeve.style.boxShadow = `0 18px 38px rgba(0, 0, 0, 0.7), 0 0 25px rgba(0, 210, 211, 0.15)`;

        if (this.isEjected) {
          discEl.classList.add('ejected');
        } else {
          discEl.classList.remove('ejected');
        }
      } else {
        // Discs in upcoming stack on the right:
        // Layered stepped depth in Z, slightly offset in X so upcoming edges peek out!
        const ahead = i - K; // 1, 2, 3...
        const transZ = 35 - ahead * 2.4;
        const transX = ahead * 3.2;
        const transY = ahead * 0.6;
        const scale = Math.max(0.85, 1 - ahead * 0.012);
        const brightness = Math.max(0.5, 1.0 - ahead * 0.04);

        sleeve.style.transform = `rotateY(0deg) translateZ(${transZ}px) translateX(${transX}px) translateY(${transY}px) scale(${scale})`;
        if (!sleeve.classList.contains('is-flipping')) {
          sleeve.style.zIndex = 120 - ahead;
        }
        sleeve.style.filter = `brightness(${brightness})`;
        sleeve.style.boxShadow = `2px 4px 10px rgba(0, 0, 0, 0.45)`;
        discEl.classList.remove('ejected');
      }
    });

    if (this.onDiscChange) {
      this.onDiscChange(this.currentIndex, this.isOpen, this.isEjected);
    }
  }

  // Open the physical wallet around its hinge
  openWallet() {
    if (this.isOpen) return;
    this.isOpen = true;
    sounds.playOpen();

    this.binderEl.classList.remove('closed');
    this.binderEl.classList.add('open');

    // Swing front cover open around the left spine hinge
    this.frontCoverEl.style.transform = `rotateY(-138deg) translateZ(0px)`;
    
    // Once open, cover settles behind turned pages on left
    setTimeout(() => {
      if (this.isOpen) {
        this.frontCoverEl.style.zIndex = '15';
      }
    }, 450);

    this.updateLayeredDepth();
  }

  // Close the physical wallet
  closeWallet() {
    if (!this.isOpen) return;
    if (this.isEjected) {
      this.returnEjectedDisc();
    }
    this.isOpen = false;
    this.currentIndex = 0; // Reset stack to front disc when closed
    sounds.playClose();

    this.binderEl.classList.remove('open');
    this.binderEl.classList.add('closed');

    // Swing front cover shut OVER all sleeves!
    this.frontCoverEl.style.zIndex = '350';
    this.frontCoverEl.style.transform = `rotateY(0deg) translateZ(32px)`;

    this.updateLayeredDepth();
  }

  toggleOpenClose() {
    if (this.isOpen) {
      this.closeWallet();
    } else {
      this.openWallet();
    }
    return this.isOpen;
  }

  // Flip to Next DVD
  flipNext() {
    if (!this.isOpen) {
      this.openWallet();
      return true;
    }
    if (this.isAnimating) return false;
    if (this.isEjected) {
      this.returnEjectedDisc();
    }
    if (this.currentIndex < 14) {
      this.isAnimating = true;
      const turningSleeve = this.sleeves[this.currentIndex];

      sounds.playFlip();

      // Lift turning sleeve above both stacks during flight
      turningSleeve.style.zIndex = '350';
      turningSleeve.classList.add('is-flipping');

      this.currentIndex++;
      this.updateLayeredDepth();

      setTimeout(() => {
        turningSleeve.classList.remove('is-flipping');
        this.updateLayeredDepth();
        this.isAnimating = false;
      }, 550);

      return true;
    }
    return false;
  }

  // Flip to Previous DVD
  flipPrev() {
    if (!this.isOpen) {
      this.openWallet();
      return true;
    }
    if (this.isAnimating) return false;
    if (this.isEjected) {
      this.returnEjectedDisc();
    }
    if (this.currentIndex > 0) {
      this.isAnimating = true;
      this.currentIndex--;
      const returningSleeve = this.sleeves[this.currentIndex];

      sounds.playFlip();

      // Lift returning sleeve above both stacks during flight
      returningSleeve.style.zIndex = '350';
      returningSleeve.classList.add('is-flipping');

      this.updateLayeredDepth();

      setTimeout(() => {
        returningSleeve.classList.remove('is-flipping');
        this.updateLayeredDepth();
        this.isAnimating = false;
      }, 550);

      return true;
    }
    return false;
  }

  // Direct jump to disc index
  goToDisc(index) {
    if (!this.isOpen) {
      this.openWallet();
    }
    const target = Math.max(0, Math.min(14, index));
    if (target !== this.currentIndex) {
      if (this.isEjected) {
        this.returnEjectedDisc();
      }
      sounds.playFlip();
      this.currentIndex = target;
      this.updateLayeredDepth();
      return true;
    }
    return false;
  }

  // Eject active disc for floating inspection
  ejectActiveDisc() {
    if (!this.isOpen) {
      this.openWallet();
      return true;
    }
    if (this.isEjected) {
      this.returnEjectedDisc();
      return false;
    }

    this.isEjected = true;
    sounds.playSlideDisc();
    this.updateLayeredDepth();
    return true;
  }

  returnEjectedDisc() {
    if (!this.isEjected) return;
    this.isEjected = false;
    sounds.playSnap();
    this.updateLayeredDepth();
  }

  toggleEjectActiveDisc() {
    if (this.isEjected) {
      this.returnEjectedDisc();
    } else {
      this.ejectActiveDisc();
    }
  }

  // Interactive 3D Parallax with mouse movement
  initParallax() {
    window.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;

      // Subtle parallax angles (±10 deg)
      this.mouseX = x * 12;
      this.mouseY = -y * 8;
    });

    const updateParallax = () => {
      requestAnimationFrame(updateParallax);

      // Smooth damping interpolation
      this.currentRotX += (this.mouseY - this.currentRotX) * 0.08;
      this.currentRotY += (this.mouseX - this.currentRotY) * 0.08;

      if (this.binderEl) {
        if (!this.isOpen) {
          // Closed state: Floating idle tilt + mouse parallax
          this.binderEl.style.transform = `
            rotateX(${16 + this.currentRotX}deg) 
            rotateY(${-12 + this.currentRotY}deg)
            rotateZ(-2deg)
          `;
        } else {
          // Open state: Angled viewing posture + mouse parallax
          this.binderEl.style.transform = `
            rotateX(${12 + this.currentRotX}deg) 
            rotateY(${8 + this.currentRotY}deg)
            rotateZ(0deg)
          `;
        }
      }
    };
    updateParallax();
  }
}
