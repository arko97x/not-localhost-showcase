// 3D Physical Y2K DVD Wallet Model & Simulation
import * as THREE from 'three';
import { DISCS, createDiscTexture } from './discsData.js';
import { 
  createNonWovenFabricTexture, 
  createZipperTexture, 
  createIridescentDiscMaterial,
  createWalletLabelTexture,
  createContactShadowTexture
} from './materials.js';
import { sounds } from './audio.js';

export class DVDWallet {
  constructor(scene) {
    this.scene = scene;
    this.currentIndex = 0; // 0 to 14
    this.isOpen = false;   // START CLOSED! Floating in the center of the screen
    this.isEjected = false;
    this.ejectedDiscIndex = -1;

    // Root groups
    this.group = new THREE.Group();
    this.scene.add(this.group);

    // Floating offset group for idle bobbing & posture
    this.floatPivot = new THREE.Group();
    this.group.add(this.floatPivot);

    this.baseGroup = new THREE.Group();
    this.lidGroup = new THREE.Group();
    this.spineGroup = new THREE.Group();
    this.sleevesGroup = new THREE.Group();

    this.floatPivot.add(this.baseGroup);
    this.floatPivot.add(this.lidGroup);
    this.floatPivot.add(this.spineGroup);
    this.floatPivot.add(this.sleevesGroup);

    // Shared assets & textures
    this.nonWovenTex = createNonWovenFabricTexture();
    this.zipperTex = createZipperTexture();
    this.labelTex = createWalletLabelTexture();
    this.shadowTex = createContactShadowTexture();
    this.iridescentMat = createIridescentDiscMaterial();

    // Sleeves & Discs arrays
    this.sleeves = [];
    this.discMeshes = [];
    this.discTextures = [];

    // Flip angles
    this.LID_OPEN_ANGLE = 2.0; // ~115 degrees open backwards
    this.lidCurrentAngle = 0;   // Start closed
    this.lidTargetAngle = 0;

    // Contact shadow mesh underneath floating wallet
    this.initShadow();

    // Build the 3D model
    this.initMaterials();
    this.buildCase();
    this.build15SleevesAndDiscs();
    this.updateSleeveAngles(false);

    // Initial closed orientation
    this.floatPivot.rotation.x = 0.28; // Tilted slightly toward viewer
    this.floatPivot.rotation.y = -0.15;
  }

  initMaterials() {
    // Smoky translucent dark charcoal/blue Y2K acrylic exterior
    this.shellMat = new THREE.MeshPhysicalMaterial({
      color: 0x141a24,
      roughness: 0.24,
      metalness: 0.15,
      transmission: 0.35,
      opacity: 0.92,
      transparent: true,
      ior: 1.48,
      clearcoat: 0.6,
      clearcoatRoughness: 0.15,
      flatShading: true
    });

    // Dark rubberized/icy blue rim trim
    this.trimMat = new THREE.MeshStandardMaterial({
      color: 0x2b3846,
      roughness: 0.6,
      metalness: 0.2,
      flatShading: true
    });

    // Inner velvet/matte lining
    this.innerLiningMat = new THREE.MeshStandardMaterial({
      color: 0x0c1015,
      roughness: 0.95,
      metalness: 0.05,
      flatShading: true
    });

    // Chrome/steel metal hardware
    this.metalMat = new THREE.MeshStandardMaterial({
      color: 0xccd6e0,
      roughness: 0.2,
      metalness: 0.9,
      flatShading: true
    });

    // Zipper track
    this.zipperMat = new THREE.MeshStandardMaterial({
      color: 0x1f2832,
      roughness: 0.5,
      metalness: 0.65,
      map: this.zipperTex
    });

    // Frosted clear circular window on front
    this.windowMat = new THREE.MeshPhysicalMaterial({
      color: 0x90caf9,
      transmission: 0.72,
      opacity: 0.65,
      transparent: true,
      roughness: 0.25,
      ior: 1.45,
      thickness: 0.15
    });

    // Clear plastic sleeve pocket
    this.pocketPlasticMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.85,
      opacity: 0.45,
      transparent: true,
      roughness: 0.12,
      ior: 1.5,
      clearcoat: 0.8
    });

    // Non-woven fabric sleeve backing
    this.sleeveBackMat = new THREE.MeshStandardMaterial({
      map: this.nonWovenTex,
      roughness: 0.8,
      metalness: 0.05
    });

    // Physical sticker badge material
    this.labelMat = new THREE.MeshStandardMaterial({
      map: this.labelTex,
      roughness: 0.35,
      metalness: 0.4
    });
  }

  initShadow() {
    const shadowGeo = new THREE.PlaneGeometry(24, 24);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: this.shadowTex,
      transparent: true,
      opacity: 0.6,
      depthWrite: false
    });
    this.shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    this.shadowMesh.rotation.x = -Math.PI / 2;
    this.shadowMesh.position.y = -6.5; // Hovering above desk plane
    this.group.add(this.shadowMesh);
  }

  buildCase() {
    const W = 16.5;
    const D = 16.5;
    const H = 2.4;

    // --- 1. BOTTOM BASE TRAY ---
    const baseGeo = new THREE.BoxGeometry(W, H, D, 4, 2, 4);
    const baseMesh = new THREE.Mesh(baseGeo, this.shellMat);
    baseMesh.position.set(0, -H / 2, 0);
    baseMesh.castShadow = true;
    baseMesh.receiveShadow = true;
    this.baseGroup.add(baseMesh);

    // Base inner cavity
    const baseInnerGeo = new THREE.BoxGeometry(W - 0.8, H - 0.2, D - 0.8);
    const baseInner = new THREE.Mesh(baseInnerGeo, this.innerLiningMat);
    baseInner.position.set(0, -H / 2 + 0.15, 0);
    this.baseGroup.add(baseInner);

    // Bottom Rim / Trim
    const baseRimGeo = new THREE.BoxGeometry(W + 0.2, 0.35, D + 0.2);
    const baseRim = new THREE.Mesh(baseRimGeo, this.trimMat);
    baseRim.position.set(0, -0.18, 0);
    this.baseGroup.add(baseRim);

    // Bottom Zipper Track
    const zipperBotGeo = new THREE.BoxGeometry(W + 0.35, 0.3, D + 0.35);
    const zipperBot = new THREE.Mesh(zipperBotGeo, this.zipperMat);
    zipperBot.position.set(0, -0.05, 0);
    this.baseGroup.add(zipperBot);

    // --- 2. TOP LID (Hinged at back spine z = -D/2) ---
    this.lidGroup.position.set(0, 0, -D / 2); // Pivot at back edge

    const lidInnerContainer = new THREE.Group();
    lidInnerContainer.position.set(0, 0, D / 2); // Offset center
    this.lidGroup.add(lidInnerContainer);

    // Top Lid Outer Shell
    const lidGeo = new THREE.BoxGeometry(W, H, D, 4, 2, 4);
    const lidMesh = new THREE.Mesh(lidGeo, this.shellMat);
    lidMesh.position.set(0, H / 2, 0);
    lidMesh.castShadow = true;
    lidMesh.receiveShadow = true;
    lidInnerContainer.add(lidMesh);

    // Top Inner Lining
    const lidInnerGeo = new THREE.BoxGeometry(W - 0.8, H - 0.2, D - 0.8);
    const lidInner = new THREE.Mesh(lidInnerGeo, this.innerLiningMat);
    lidInner.position.set(0, H / 2 - 0.15, 0);
    lidInnerContainer.add(lidInner);

    // Top Rim / Trim
    const lidRimGeo = new THREE.BoxGeometry(W + 0.2, 0.35, D + 0.2);
    const lidRim = new THREE.Mesh(lidRimGeo, this.trimMat);
    lidRim.position.set(0, 0.18, 0);
    lidInnerContainer.add(lidRim);

    // Top Zipper Track
    const zipperTopGeo = new THREE.BoxGeometry(W + 0.35, 0.3, D + 0.35);
    const zipperTop = new THREE.Mesh(zipperTopGeo, this.zipperMat);
    zipperTop.position.set(0, 0.05, 0);
    lidInnerContainer.add(zipperTop);

    // Frosted clear circular window on the lid face
    const windowGeo = new THREE.CylinderGeometry(5.4, 5.4, 0.2, 32);
    const windowMesh = new THREE.Mesh(windowGeo, this.windowMat);
    windowMesh.position.set(0, H + 0.05, -1.2);
    lidInnerContainer.add(windowMesh);

    // Window decorative trim ring
    const windowTrimGeo = new THREE.TorusGeometry(5.4, 0.3, 8, 32);
    const windowTrim = new THREE.Mesh(windowTrimGeo, this.trimMat);
    windowTrim.rotation.x = Math.PI / 2;
    windowTrim.position.set(0, H + 0.1, -1.2);
    lidInnerContainer.add(windowTrim);

    // PHYSICAL LABEL STICKER (Direct user requirement: "DISCMAN '04" / "15-DISC WALLET")
    const labelGeo = new THREE.PlaneGeometry(9.0, 3.2);
    const labelMesh = new THREE.Mesh(labelGeo, this.labelMat);
    labelMesh.rotation.x = -Math.PI / 2;
    labelMesh.position.set(0, H + 0.12, 5.5);
    lidInnerContainer.add(labelMesh);

    // 4 Corner Metal Rivets
    [
      [-5.5, -5.5], [5.5, -5.5],
      [-5.5, 5.5], [5.5, 5.5]
    ].forEach(([rx, rz]) => {
      const rivetGeo = new THREE.CylinderGeometry(0.32, 0.32, 0.25, 8);
      const rivet = new THREE.Mesh(rivetGeo, this.metalMat);
      rivet.position.set(rx, H + 0.08, rz);
      lidInnerContainer.add(rivet);
    });

    // --- 3. CENTRAL SPINE ---
    const spineGeo = new THREE.CylinderGeometry(H, H, W, 12, 1, false, 0, Math.PI);
    const spineMesh = new THREE.Mesh(spineGeo, this.shellMat);
    spineMesh.rotation.z = Math.PI / 2;
    spineMesh.position.set(0, 0, -D / 2);
    this.spineGroup.add(spineMesh);

    // 2 Internal Metal Binder Rings
    [-3.5, 3.5].forEach(rx => {
      const ringGeo = new THREE.TorusGeometry(1.0, 0.18, 8, 16);
      const ring = new THREE.Mesh(ringGeo, this.metalMat);
      ring.position.set(rx, 0.2, -D / 2 + 1.2);
      ring.rotation.y = Math.PI / 2;
      this.spineGroup.add(ring);
    });

    // --- 4. WRIST STRAP WITH EYELET ---
    const strapGroup = new THREE.Group();
    strapGroup.position.set(-W / 2 - 0.2, 0, -D / 4);

    const eyeletGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.4, 12);
    const eyelet = new THREE.Mesh(eyeletGeo, this.metalMat);
    eyelet.rotation.z = Math.PI / 2;
    strapGroup.add(eyelet);

    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(-1.6, -0.6, 2.0),
      new THREE.Vector3(-2.6, -1.8, 5.5),
      new THREE.Vector3(-1.8, -2.4, 7.0),
      new THREE.Vector3(-1.0, -2.0, 5.2),
      new THREE.Vector3(0, -0.5, 1.0)
    ]);
    const strapGeo = new THREE.TubeGeometry(curve, 18, 0.35, 6, false);
    const strapMesh = new THREE.Mesh(strapGeo, this.trimMat);
    strapGroup.add(strapMesh);
    this.spineGroup.add(strapGroup);

    // --- 5. ZIPPER SLIDER ---
    this.zipperSlider = new THREE.Group();
    const sliderBodyGeo = new THREE.BoxGeometry(0.8, 0.7, 0.9);
    const sliderBody = new THREE.Mesh(sliderBodyGeo, this.metalMat);
    this.zipperSlider.add(sliderBody);

    const pullTabGeo = new THREE.BoxGeometry(0.4, 1.4, 0.15);
    const pullTab = new THREE.Mesh(pullTabGeo, this.metalMat);
    pullTab.position.set(0, -0.8, 0.3);
    pullTab.rotation.x = 0.3;
    this.zipperSlider.add(pullTab);

    this.zipperSlider.position.set(-W / 2, 0, -D / 2 + 1);
    this.floatPivot.add(this.zipperSlider);
  }

  build15SleevesAndDiscs() {
    const sleeveW = 14.2;
    const sleeveD = 14.2;
    const discRadius = 5.6;
    const pivotZ = -7.0; // Anchored near the spine

    const discGeo = new THREE.CylinderGeometry(discRadius, discRadius, 0.08, 36);

    for (let i = 0; i < 15; i++) {
      const sleevePivot = new THREE.Group();
      sleevePivot.position.set(0, 0.15, pivotZ);

      const pageGroup = new THREE.Group();
      pageGroup.position.set(0, 0, sleeveD / 2 + 0.3);
      sleevePivot.add(pageGroup);

      // 1. Non-woven fabric backing plate
      const backGeo = new THREE.BoxGeometry(sleeveW, 0.06, sleeveD, 4, 1, 4);
      const backMesh = new THREE.Mesh(backGeo, this.sleeveBackMat);
      backMesh.castShadow = true;
      backMesh.receiveShadow = true;
      pageGroup.add(backMesh);

      // 2. Transparent poly pocket
      const pocketGeo = new THREE.BoxGeometry(sleeveW - 0.2, 0.04, sleeveD - 0.2);
      const pocketMesh = new THREE.Mesh(pocketGeo, this.pocketPlasticMat);
      pocketMesh.position.set(0, 0.1, 0);
      pageGroup.add(pocketMesh);

      // Sleeve fabric perimeter borders
      const borderMat = this.trimMat;
      const leftBorder = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.09, sleeveD), borderMat);
      leftBorder.position.set(-sleeveW / 2 + 0.25, 0.04, 0);
      pageGroup.add(leftBorder);

      const rightBorder = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.09, sleeveD), borderMat);
      rightBorder.position.set(sleeveW / 2 - 0.25, 0.04, 0);
      pageGroup.add(rightBorder);

      const bottomBorder = new THREE.Mesh(new THREE.BoxGeometry(sleeveW, 0.09, 0.5), borderMat);
      bottomBorder.position.set(0, 0.04, sleeveD / 2 - 0.25);
      pageGroup.add(bottomBorder);

      // 3. The Low-Poly DVD Disc inside this sleeve
      const { texture } = createDiscTexture(i);
      this.discTextures.push(texture);

      const discMatTop = new THREE.MeshStandardMaterial({
        map: texture,
        roughness: 0.25,
        metalness: 0.15,
        transparent: true
      });

      const discMaterials = [
        this.metalMat,        // Side edge
        discMatTop,           // Top face (Cover art)
        this.iridescentMat    // Bottom face (Rainbow diffraction grating!)
      ];

      const discMesh = new THREE.Mesh(discGeo, discMaterials);
      discMesh.position.set(0, 0.07, 0);
      discMesh.castShadow = true;
      discMesh.userData = {
        discIndex: i,
        sleeveIndex: i,
        isDisc: true,
        baseLocalPos: new THREE.Vector3(0, 0.07, 0),
        baseLocalRot: new THREE.Euler(0, 0, 0)
      };

      pageGroup.add(discMesh);
      this.discMeshes.push(discMesh);

      sleevePivot.userData = {
        sleeveIndex: i,
        currentAngle: 0,
        targetAngle: 0,
        pageGroup: pageGroup,
        discMesh: discMesh
      };

      this.sleevesGroup.add(sleevePivot);
      this.sleeves.push(sleevePivot);
    }
  }

  // Update target angles for 15 sleeves: physical stack effect
  updateSleeveAngles(animate = true) {
    if (!this.isOpen) {
      // Case closed: all 15 sleeves compressed flat inside bottom tray
      this.sleeves.forEach((sleeve, i) => {
        sleeve.userData.targetAngle = (i * 0.003);
      });
      this.lidTargetAngle = 0;
      return;
    }

    // Case is open:
    this.lidTargetAngle = this.LID_OPEN_ANGLE;

    this.sleeves.forEach((sleeve, i) => {
      if (i < this.currentIndex) {
        // Sleeves before currentIndex are stacked against the open top lid!
        // Slight incremental offset creates the visible stacked page edges
        const offset = (this.currentIndex - 1 - i) * 0.016;
        sleeve.userData.targetAngle = this.LID_OPEN_ANGLE - 0.09 - offset;
      } else {
        // Current active sleeve and remaining sleeves rest in bottom tray stack
        const offset = (i - this.currentIndex) * 0.014;
        sleeve.userData.targetAngle = offset;
      }
    });
  }

  // Open the physical wallet with tactile animation
  openWallet() {
    if (this.isOpen) return;
    this.isOpen = true;
    sounds.playOpen();
    this.updateSleeveAngles(true);
  }

  // Close the physical wallet
  closeWallet() {
    if (!this.isOpen) return;
    if (this.isEjected) {
      this.returnEjectedDisc();
    }
    this.isOpen = false;
    sounds.playClose();
    this.updateSleeveAngles(true);
  }

  // Toggle open / close
  toggleOpenClose() {
    if (this.isOpen) {
      this.closeWallet();
    } else {
      this.openWallet();
    }
    return this.isOpen;
  }

  // Flip forward to next DVD
  flipNext() {
    if (!this.isOpen) {
      this.openWallet();
      return true;
    }
    if (this.isEjected) {
      this.returnEjectedDisc();
    }
    if (this.currentIndex < 14) {
      this.currentIndex++;
      sounds.playFlip();
      this.updateSleeveAngles(true);
      return true;
    }
    return false;
  }

  // Flip backward to previous DVD
  flipPrev() {
    if (!this.isOpen) {
      this.openWallet();
      return true;
    }
    if (this.isEjected) {
      this.returnEjectedDisc();
    }
    if (this.currentIndex > 0) {
      this.currentIndex--;
      sounds.playFlip();
      this.updateSleeveAngles(true);
      return true;
    }
    return false;
  }

  // Jump directly to specific DVD index (0 to 14)
  goToDisc(index) {
    if (!this.isOpen) {
      this.openWallet();
    }
    const target = Math.max(0, Math.min(14, index));
    if (target !== this.currentIndex) {
      if (this.isEjected) {
        this.returnEjectedDisc();
      }
      this.currentIndex = target;
      sounds.playFlip();
      this.updateSleeveAngles(true);
      return true;
    }
    return false;
  }

  // Eject active disc from pocket into 3D inspection floating mode
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
    this.ejectedDiscIndex = this.currentIndex;
    sounds.playSlideDisc();
    return true;
  }

  // Return inspected disc back into sleeve pocket
  returnEjectedDisc() {
    if (!this.isEjected) return;
    this.isEjected = false;
    sounds.playSnap();
    this.ejectedDiscIndex = -1;
  }

  // Per-frame physics, animations, and idle floating bob
  update(delta, time) {
    // 1. Iridescent Shader uniform time
    if (this.iridescentMat.uniforms) {
      this.iridescentMat.uniforms.uTime.value = time;
    }

    // 2. Idle floating & bobbing motion
    if (!this.isOpen) {
      // CLOSED STATE: Slow, hypnotic vertical bobbing & tiny rotational drift
      const bobY = Math.sin(time * 1.5) * 0.35;
      const tiltZ = Math.sin(time * 0.9) * 0.025;
      const tiltX = 0.28 + Math.sin(time * 0.7) * 0.02;

      this.floatPivot.position.y += (bobY - this.floatPivot.position.y) * Math.min(1.0, delta * 6.0);
      this.floatPivot.rotation.x += (tiltX - this.floatPivot.rotation.x) * Math.min(1.0, delta * 5.0);
      this.floatPivot.rotation.z += (tiltZ - this.floatPivot.rotation.z) * Math.min(1.0, delta * 5.0);
      this.floatPivot.rotation.y += (-0.15 - this.floatPivot.rotation.y) * Math.min(1.0, delta * 5.0);

      // Contact shadow breathes inversely with vertical bob
      if (this.shadowMesh) {
        const shadowScale = 1.0 - bobY * 0.08;
        this.shadowMesh.scale.set(shadowScale, shadowScale, 1.0);
        this.shadowMesh.material.opacity = 0.55 - bobY * 0.08;
      }
    } else {
      // OPEN STATE: Settle into comfortable open browsing angle
      const targetY = 0.3;
      const targetRotX = 0.42; // Tilted slightly for optimal disc view
      const targetRotY = 0.0;
      const targetRotZ = 0.0;

      this.floatPivot.position.y += (targetY - this.floatPivot.position.y) * Math.min(1.0, delta * 6.0);
      this.floatPivot.rotation.x += (targetRotX - this.floatPivot.rotation.x) * Math.min(1.0, delta * 6.0);
      this.floatPivot.rotation.y += (targetRotY - this.floatPivot.rotation.y) * Math.min(1.0, delta * 6.0);
      this.floatPivot.rotation.z += (targetRotZ - this.floatPivot.rotation.z) * Math.min(1.0, delta * 6.0);

      if (this.shadowMesh) {
        this.shadowMesh.scale.set(1.2, 1.2, 1.0);
        this.shadowMesh.material.opacity = 0.65;
      }
    }

    // 3. Smooth lid rotation around back hinge
    const lidDiff = this.lidTargetAngle - this.lidCurrentAngle;
    this.lidCurrentAngle += lidDiff * Math.min(1.0, delta * 7.5);
    this.lidGroup.rotation.x = -this.lidCurrentAngle;

    // 4. Smooth sleeve flip with organic page flex
    this.sleeves.forEach((sleeve, i) => {
      const target = sleeve.userData.targetAngle;
      const current = sleeve.userData.currentAngle;
      const diff = target - current;

      if (Math.abs(diff) > 0.001) {
        sleeve.userData.currentAngle += diff * Math.min(1.0, delta * 9.0);
        sleeve.rotation.x = -sleeve.userData.currentAngle;

        // Dynamic page flex / curl while flipping:
        const normalizedProg = sleeve.userData.currentAngle / (this.LID_OPEN_ANGLE || 2.0);
        const curl = Math.sin(normalizedProg * Math.PI) * 0.14;
        sleeve.userData.pageGroup.rotation.x = (diff > 0 ? -curl : curl);
      } else {
        sleeve.userData.currentAngle = target;
        sleeve.rotation.x = -target;
        sleeve.userData.pageGroup.rotation.x = 0;
      }
    });

    // 5. Disc Inspection / Ejection animation
    this.discMeshes.forEach((disc, idx) => {
      if (this.isEjected && idx === this.ejectedDiscIndex) {
        // Slide disc out of pocket into floating 3D showcase
        disc.position.z += (11.5 - disc.position.z) * Math.min(1.0, delta * 6.0);
        disc.position.y += (6.0 - disc.position.y) * Math.min(1.0, delta * 6.0);
        disc.rotation.y += delta * 1.4; // Gentle continuous spin
        disc.rotation.x = 0.22;
      } else {
        // Active disc in open state nudges forward by a tiny subtle amount (0.2) to emphasize selection!
        const nudgeZ = (this.isOpen && idx === this.currentIndex) ? 0.35 : 0;
        const nudgeY = (this.isOpen && idx === this.currentIndex) ? 0.15 : 0;

        disc.position.z += (disc.userData.baseLocalPos.z + nudgeZ - disc.position.z) * Math.min(1.0, delta * 10.0);
        disc.position.y += (disc.userData.baseLocalPos.y + nudgeY - disc.position.y) * Math.min(1.0, delta * 10.0);
        disc.rotation.y += (disc.userData.baseLocalRot.y - disc.rotation.y) * Math.min(1.0, delta * 10.0);
        disc.rotation.x += (disc.userData.baseLocalRot.x - disc.rotation.x) * Math.min(1.0, delta * 10.0);
      }
    });

    // 6. Zipper slider movement
    const zipProgress = this.isOpen ? 1.0 : 0.0;
    this.zipperSlider.position.z += ((-7.0 + zipProgress * 14.0) - this.zipperSlider.position.z) * Math.min(1.0, delta * 8.0);
  }
}
