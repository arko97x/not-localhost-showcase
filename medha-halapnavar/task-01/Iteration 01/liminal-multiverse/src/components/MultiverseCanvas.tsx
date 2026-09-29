import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { ProjectWorld } from '../data/projects';
import { sound } from '../utils/audio';

interface MultiverseCanvasProps {
  projects: ProjectWorld[];
  activeProjectId: string | null;
  hoveredProjectId: string | null;
  onSelectProject: (project: ProjectWorld) => void;
  onHoverProject: (project: ProjectWorld | null) => void;
  showOrbits: boolean;
  showStars: boolean;
}

// Custom iridescent thin-film shader matching the visual references
const IridescentShader = {
  vertexShader: `
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    varying vec2 vUv;
    varying vec3 vWorldPosition;
    uniform float uTime;
    uniform float uDistortion;

    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      
      // Subtle organic breathing of sphere surface
      vec3 pos = position;
      float displacement = sin(pos.x * 2.5 + uTime * 0.8) * cos(pos.y * 2.5 + uTime * 0.6) * sin(pos.z * 2.5) * uDistortion;
      pos += normal * displacement;
      
      vec4 worldPosition = modelMatrix * vec4(pos, 1.0);
      vWorldPosition = worldPosition.xyz;
      vec4 mvPosition = viewMatrix * worldPosition;
      vViewPosition = -mvPosition.xyz;
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  fragmentShader: `
    uniform vec3 uColorPrimary;
    uniform vec3 uColorSecondary;
    uniform vec3 uColorTertiary;
    uniform float uTime;
    uniform float uFresnelPower;
    uniform float uHover;
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    varying vec2 vUv;
    varying vec3 vWorldPosition;

    void main() {
      vec3 normal = normalize(vNormal);
      vec3 viewDir = normalize(vViewPosition);

      // Fresnel calculation (rim lighting)
      float fresnel = 1.0 - max(dot(viewDir, normal), 0.0);
      float fresnelFactor = pow(fresnel, uFresnelPower);

      // Dual chromatic rim lighting matching reference images:
      // Amber/warm solar rim from bottom-right, cyan/violet rim from top-left
      vec3 lightDir1 = normalize(vec3(1.0, -0.6, 0.8));
      vec3 lightDir2 = normalize(vec3(-0.9, 0.8, -0.5));
      
      float diff1 = max(dot(normal, lightDir1), 0.0);
      float diff2 = max(dot(normal, lightDir2), 0.0);

      // Iridescent dispersion shift
      float shift = dot(normal, viewDir) * 4.0 + uTime * 0.4 + vUv.y * 3.1415;
      vec3 iridescence = 0.5 + 0.5 * cos(shift + vec3(0.0, 2.094, 4.188));

      // Core blend between primary, secondary, and tertiary
      vec3 baseGrad = mix(uColorSecondary * 0.15, uColorPrimary, diff1 * 0.8 + 0.2);
      baseGrad = mix(baseGrad, uColorTertiary, diff2 * 0.6);

      // Iridescent oily film layer
      vec3 finalColor = mix(baseGrad, iridescence, fresnelFactor * 0.85);

      // Highlights and specular gloss
      vec3 halfVec1 = normalize(lightDir1 + viewDir);
      float spec1 = pow(max(dot(normal, halfVec1), 0.0), 32.0);
      vec3 halfVec2 = normalize(lightDir2 + viewDir);
      float spec2 = pow(max(dot(normal, halfVec2), 0.0), 48.0);
      
      finalColor += vec3(1.0, 0.95, 0.8) * spec1 * 0.7;
      finalColor += vec3(0.8, 0.95, 1.0) * spec2 * 0.8;

      // Glow on rim
      finalColor += uColorTertiary * fresnelFactor * 0.9;
      
      // Hover intensification
      finalColor += uColorPrimary * uHover * 0.35;

      gl_FragColor = vec4(finalColor, 0.95);
    }
  `
};

// FUNCTION: BUILD A TOWERING 3D WIZARD FIGURE STANDING UPON THE SPHERE
function buildWizardFigure(beaconColorHex: string, sphereRadius: number, stance: string) {
  const figureGroup = new THREE.Group();
  figureGroup.name = 'humanFigure';

  // Matte dark specular silhouette material with subtle edge sheen
  const silhouetteMat = new THREE.MeshStandardMaterial({
    color: 0x08080f,
    roughness: 0.35,
    metalness: 0.85,
    emissive: new THREE.Color(beaconColorHex),
    emissiveIntensity: 0.22,
  });

  const cloakMat = new THREE.MeshStandardMaterial({
    color: 0x04040a,
    roughness: 0.6,
    metalness: 0.6,
    emissive: new THREE.Color(beaconColorHex),
    emissiveIntensity: 0.16,
    side: THREE.DoubleSide,
  });

  const glowingMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(beaconColorHex),
    emissive: new THREE.Color(beaconColorHex),
    emissiveIntensity: 2.2,
    roughness: 0.1,
  });

  // TALL WIZARD DIMENSIONS (Height ~2.35 units, towering on the sphere!)
  const legHeight = 0.95;
  const torsoHeight = 0.85;
  const headRadius = 0.18;

  // HEAD
  const headGeo = new THREE.SphereGeometry(headRadius, 20, 20);
  const headMesh = new THREE.Mesh(headGeo, silhouetteMat);
  headMesh.position.y = legHeight + torsoHeight + headRadius * 1.1;
  figureGroup.add(headMesh);

  // OCULAR VISOR / OBSERVATION CREST
  const visorGeo = new THREE.BoxGeometry(0.24, 0.06, 0.15);
  const visorMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(beaconColorHex) });
  const visorMesh = new THREE.Mesh(visorGeo, visorMat);
  visorMesh.position.set(0, legHeight + torsoHeight + headRadius * 1.1, headRadius * 0.72);
  figureGroup.add(visorMesh);

  // WIZARD HOOD / COWL
  const cowlGeo = new THREE.ConeGeometry(0.26, 0.42, 16);
  const cowlMesh = new THREE.Mesh(cowlGeo, cloakMat);
  cowlMesh.position.y = legHeight + torsoHeight + headRadius * 1.95;
  cowlMesh.rotation.x = -0.15;
  figureGroup.add(cowlMesh);

  // TORSO / ROBES
  const torsoGeo = new THREE.CylinderGeometry(0.2, 0.28, torsoHeight, 16);
  const torsoMesh = new THREE.Mesh(torsoGeo, silhouetteMat);
  torsoMesh.position.y = legHeight + torsoHeight / 2;
  figureGroup.add(torsoMesh);

  // FLOWING CEREMONIAL WIZARD MANTLE / CLOAK
  const cloakGeo = new THREE.CylinderGeometry(
    0.28,
    0.72,
    torsoHeight + legHeight * 0.88,
    16,
    1,
    true,
    -Math.PI * 0.75,
    Math.PI * 1.5
  );
  const cloakMesh = new THREE.Mesh(cloakGeo, cloakMat);
  cloakMesh.position.set(0, legHeight * 0.58 + torsoHeight * 0.45, -0.05);
  cloakMesh.rotation.y = Math.PI;
  figureGroup.add(cloakMesh);

  // LEFT & RIGHT LEGS
  const legGeo = new THREE.CylinderGeometry(0.08, 0.065, legHeight, 12);
  const leftLeg = new THREE.Mesh(legGeo, silhouetteMat);
  leftLeg.position.set(-0.13, legHeight / 2, 0);
  figureGroup.add(leftLeg);

  const rightLeg = new THREE.Mesh(legGeo, silhouetteMat);
  rightLeg.position.set(0.13, legHeight / 2, 0);
  figureGroup.add(rightLeg);

  // ARMS & ORATOR GESTURE
  const armGeo = new THREE.CylinderGeometry(0.065, 0.055, torsoHeight * 0.9, 12);

  // Left arm raised in oration gesture (like casting a spell / greeting traveler)
  const leftArm = new THREE.Mesh(armGeo, silhouetteMat);
  leftArm.position.set(-0.35, legHeight + torsoHeight * 0.5, 0.15);
  leftArm.rotation.z = 0.55;
  leftArm.rotation.x = -0.4;
  figureGroup.add(leftArm);

  // Right arm holding wizard staff
  const rightArm = new THREE.Mesh(armGeo, silhouetteMat);
  rightArm.position.set(0.32, legHeight + torsoHeight * 0.55, 0.12);
  rightArm.rotation.z = -0.22;
  rightArm.rotation.x = -0.28;
  figureGroup.add(rightArm);

  // WIZARD STAFF / CELESTIAL PROBE CONDUIT
  const staffGroup = new THREE.Group();
  staffGroup.name = 'wizardStaff';
  staffGroup.position.set(0.44, 0, 0.28);

  const staffHeight = legHeight + torsoHeight + 1.0;
  const staffShaftGeo = new THREE.CylinderGeometry(0.03, 0.038, staffHeight, 12);
  const staffShaftMat = new THREE.MeshStandardMaterial({
    color: 0x242436,
    metalness: 0.95,
    roughness: 0.2,
    emissive: new THREE.Color(beaconColorHex),
    emissiveIntensity: 0.35,
  });
  const staffShaft = new THREE.Mesh(staffShaftGeo, staffShaftMat);
  staffShaft.position.y = staffHeight / 2;
  staffGroup.add(staffShaft);

  // Glowing Crystal Orb at top of staff
  const staffTopY = staffHeight;
  const staffOrbGeo = new THREE.OctahedronGeometry(0.22, 0);
  const staffOrb = new THREE.Mesh(staffOrbGeo, glowingMat);
  staffOrb.name = 'wizardStaffOrb';
  staffOrb.position.y = staffTopY + 0.15;
  staffGroup.add(staffOrb);

  // Rotating gimbal ring around staff crystal
  const staffRingGeo = new THREE.TorusGeometry(0.28, 0.022, 12, 32);
  const staffRing = new THREE.Mesh(staffRingGeo, glowingMat);
  staffRing.name = 'wizardStaffRing';
  staffRing.position.y = staffTopY + 0.15;
  staffGroup.add(staffRing);

  // Staff point light (casts subtle light onto wizard and sphere)
  const staffLight = new THREE.PointLight(new THREE.Color(beaconColorHex), 1.8, 6.0);
  staffLight.name = 'wizardStaffLight';
  staffLight.position.y = staffTopY + 0.15;
  staffGroup.add(staffLight);

  figureGroup.add(staffGroup);

  // FLOATING ARCANE HALO / GLYPH RING ABOVE HEAD
  const haloGeo = new THREE.RingGeometry(0.42, 0.48, 32);
  const haloMat = new THREE.MeshBasicMaterial({
    color: new THREE.Color(beaconColorHex),
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.85,
  });
  const haloMesh = new THREE.Mesh(haloGeo, haloMat);
  haloMesh.name = 'wizardHalo';
  haloMesh.rotation.x = Math.PI / 2;
  haloMesh.position.y = legHeight + torsoHeight + headRadius * 2.85;
  figureGroup.add(haloMesh);

  // Arcane Floor Seal / Plinth Glow
  const plinthGeo = new THREE.RingGeometry(0.12, 0.85, 32);
  const plinthMat = new THREE.MeshBasicMaterial({
    color: new THREE.Color(beaconColorHex),
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.5,
  });
  const plinthMesh = new THREE.Mesh(plinthGeo, plinthMat);
  plinthMesh.rotation.x = Math.PI / 2;
  plinthMesh.position.y = 0.02;
  figureGroup.add(plinthMesh);

  // Place figure directly on top zenith pole of the planet
  figureGroup.position.set(0, sphereRadius, 0);
  return figureGroup;
}

export const MultiverseCanvas: React.FC<MultiverseCanvasProps> = ({
  projects,
  activeProjectId,
  hoveredProjectId,
  onSelectProject,
  onHoverProject,
  showOrbits,
  showStars
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const planetMeshesRef = useRef<Map<string, {
    group: THREE.Group;
    sphereMesh: THREE.Mesh;
    rings: THREE.Group;
    figureGroup: THREE.Group;
    satellites: Array<{ mesh: THREE.Mesh; orbitRadius: number; speed: number; angle: number; tiltMatrix: THREE.Matrix4 }>;
    material: THREE.ShaderMaterial;
    project: ProjectWorld;
  }>>(new Map());

  // Camera animation state
  const cameraTargetPos = useRef(new THREE.Vector3(0, 8, 44));
  const cameraLookAtTarget = useRef(new THREE.Vector3(0, 0, 0));
  const cameraCurrentLookAt = useRef(new THREE.Vector3(0, 0, 0));
  
  // Drag / Orbit state
  const isDragging = useRef(false);
  const previousMousePosition = useRef({ x: 0, y: 0 });
  const orbitRotation = useRef({ x: 0.1, y: 0 });
  const targetOrbitRotation = useRef({ x: 0.1, y: 0 });
  const zoomLevel = useRef(44);
  const targetZoomLevel = useRef(44);

  // References for props to be used in animation loop
  const activeProjectIdRef = useRef(activeProjectId);
  const hoveredProjectIdRef = useRef(hoveredProjectId);
  const showOrbitsRef = useRef(showOrbits);
  const showStarsRef = useRef(showStars);
  const projectsRef = useRef(projects);

  useEffect(() => {
    activeProjectIdRef.current = activeProjectId;
  }, [activeProjectId]);

  useEffect(() => {
    hoveredProjectIdRef.current = hoveredProjectId;
  }, [hoveredProjectId]);

  useEffect(() => {
    showOrbitsRef.current = showOrbits;
    planetMeshesRef.current.forEach(({ rings }) => {
      rings.visible = showOrbits;
    });
    if (sceneRef.current) {
      const grandOrbits = sceneRef.current.getObjectByName('grandOrbitsGroup');
      if (grandOrbits) grandOrbits.visible = showOrbits;
    }
  }, [showOrbits]);

  useEffect(() => {
    showStarsRef.current = showStars;
    if (sceneRef.current) {
      const starfield = sceneRef.current.getObjectByName('starfield');
      if (starfield) starfield.visible = showStars;
    }
  }, [showStars]);

  useEffect(() => {
    projectsRef.current = projects;
  }, [projects]);

  // Handle active project camera transition
  useEffect(() => {
    if (activeProjectId) {
      const targetProj = projects.find((p) => p.id === activeProjectId);
      if (targetProj) {
        sound.playWarpTransition();
        const pPos = new THREE.Vector3(...targetProj.sphere.position);
        // Position camera directly facing the towering wizard figure standing at the zenith of the planet
        const figureCenter = pPos.clone().add(new THREE.Vector3(0, targetProj.sphere.radius + 1.35, 0));
        cameraTargetPos.current.copy(figureCenter).add(new THREE.Vector3(0, 0.4, 4.2));
        cameraLookAtTarget.current.copy(figureCenter);
      }
    } else {
      // Return to cosmic observatory view
      sound.playExitWarp();
      cameraTargetPos.current.set(
        Math.sin(targetOrbitRotation.current.y) * targetZoomLevel.current,
        targetOrbitRotation.current.x * 12 + 6,
        Math.cos(targetOrbitRotation.current.y) * targetZoomLevel.current
      );
      cameraLookAtTarget.current.set(0, 0, 0);
    }
  }, [activeProjectId, projects]);

  // Main Three.js initialization
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // SCENE
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.fog = new THREE.FogExp2(0x020205, 0.009);

    // CAMERA
    const width = container.clientWidth || window.innerWidth || 1200;
    const height = container.clientHeight || window.innerHeight || 800;
    const aspect = width / Math.max(1, height);
    const camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 1200);
    camera.position.set(0, 8, 44);
    cameraRef.current = camera;

    // RENDERER
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    rendererRef.current = renderer;
    container.appendChild(renderer.domElement);

    // AMBIENT & DIRECTIONAL LIGHTING
    const ambientLight = new THREE.AmbientLight(0x0d0d1f, 1.5);
    scene.add(ambientLight);

    const solarLight = new THREE.DirectionalLight(0xffeedd, 2.4);
    solarLight.position.set(20, 15, 20);
    scene.add(solarLight);

    const coldRimLight = new THREE.DirectionalLight(0x00e5ff, 2.0);
    coldRimLight.position.set(-20, -10, -15);
    scene.add(coldRimLight);

    // CELESTIAL STARFIELD & COSMIC DUST
    const starCount = 3500;
    const starGeometry = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);
    const starSizes = new Float32Array(starCount);

    const palette = [
      new THREE.Color('#ffffff'),
      new THREE.Color('#90caf9'),
      new THREE.Color('#ffcc80'),
      new THREE.Color('#ce93d8'),
      new THREE.Color('#80deea'),
    ];

    for (let i = 0; i < starCount; i++) {
      const radius = 60 + Math.random() * 180;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      starPositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      starPositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      starPositions[i * 3 + 2] = radius * Math.cos(phi);

      const color = palette[Math.floor(Math.random() * palette.length)];
      starColors[i * 3] = color.r;
      starColors[i * 3 + 1] = color.g;
      starColors[i * 3 + 2] = color.b;

      starSizes[i] = Math.random() * 2.2 + 0.6;
    }

    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeometry.setAttribute('color', new THREE.BufferAttribute(starColors, 3));
    starGeometry.setAttribute('size', new THREE.BufferAttribute(starSizes, 1));

    // Star point material
    const starMaterial = new THREE.PointsMaterial({
      size: 1.2,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });

    const starfield = new THREE.Points(starGeometry, starMaterial);
    starfield.name = 'starfield';
    scene.add(starfield);

    // DISTANT COSMIC NEBULA GLOW DISC
    const nebulaGeo = new THREE.RingGeometry(35, 120, 64);
    const nebulaMat = new THREE.MeshBasicMaterial({
      color: 0x100826,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
    });
    const nebula = new THREE.Mesh(nebulaGeo, nebulaMat);
    nebula.rotation.x = Math.PI / 2.3;
    nebula.position.y = -10;
    scene.add(nebula);

    // GRAND OVERLAPPING CELESTIAL ORBITAL PATHWAYS (matching Reference Images 2 & 3)
    const grandOrbitsGroup = new THREE.Group();
    grandOrbitsGroup.name = 'grandOrbitsGroup';

    const grandOrbitDefs = [
      { radius: 22, tube: 0.022, tiltX: 0.35, tiltY: 0.25, tiltZ: 0.15, color: '#00e5ff', opacity: 0.38 },
      { radius: 36, tube: 0.025, tiltX: -0.5, tiltY: 0.7, tiltZ: -0.4, color: '#ffb300', opacity: 0.4 },
    ];

    grandOrbitDefs.forEach((def) => {
      const gGeo = new THREE.TorusGeometry(def.radius, def.tube, 16, 256);
      const gMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(def.color),
        emissive: new THREE.Color(def.color),
        emissiveIntensity: 0.45,
        transparent: true,
        opacity: def.opacity,
        roughness: 0.2,
        metalness: 0.9,
      });
      const gMesh = new THREE.Mesh(gGeo, gMat);
      gMesh.rotation.set(def.tiltX, def.tiltY, def.tiltZ);
      grandOrbitsGroup.add(gMesh);
    });

    scene.add(grandOrbitsGroup);

    // FUNCTION: BUILD PLANET WITH IRIDESCENT SHADER, RINGS, AND SATELLITES
    function createPlanet(project: ProjectWorld) {
      const group = new THREE.Group();
      group.position.set(...project.sphere.position);
      group.name = `planet-${project.id}`;

      // 1. Sphere Mesh with Iridescent Shader
      const sphereGeo = new THREE.SphereGeometry(project.sphere.radius, 64, 64);
      const shaderMat = new THREE.ShaderMaterial({
        vertexShader: IridescentShader.vertexShader,
        fragmentShader: IridescentShader.fragmentShader,
        uniforms: {
          uTime: { value: 0 },
          uColorPrimary: { value: new THREE.Color(project.sphere.colorPrimary) },
          uColorSecondary: { value: new THREE.Color(project.sphere.colorSecondary) },
          uColorTertiary: { value: new THREE.Color(project.sphere.colorTertiary) },
          uFresnelPower: { value: project.sphere.fresnelPower },
          uDistortion: { value: project.sphere.surfaceDistortion },
          uHover: { value: 0 },
        },
        transparent: true,
      });

      const sphereMesh = new THREE.Mesh(sphereGeo, shaderMat);
      sphereMesh.userData = { projectId: project.id };
      group.add(sphereMesh);

      // Atmospheric Glow Outer Shell
      const atmosphereGeo = new THREE.SphereGeometry(project.sphere.radius * 1.05, 32, 32);
      const atmosphereMat = new THREE.ShaderMaterial({
        vertexShader: `
          varying vec3 vNormal;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform vec3 uColor;
          varying vec3 vNormal;
          void main() {
            float intensity = pow(0.65 - dot(vNormal, vec3(0, 0, 1.0)), 2.0);
            gl_FragColor = vec4(uColor, intensity * 0.45);
          }
        `,
        uniforms: {
          uColor: { value: new THREE.Color(project.sphere.colorTertiary) },
        },
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide,
        transparent: true,
      });
      const atmosphereMesh = new THREE.Mesh(atmosphereGeo, atmosphereMat);
      group.add(atmosphereMesh);

      // 2. Towering Wizard Figure standing on the world's zenith
      const figureGroup = buildWizardFigure(
        project.observerFigure.beaconColor,
        project.sphere.radius,
        project.observerFigure.stance
      );
      group.add(figureGroup);

      // 3. Delicate Orbital Wire Rings & Satellites (matching Images 2 & 3)
      const ringsGroup = new THREE.Group();
      ringsGroup.name = 'ringsGroup';
      const satellitesList: Array<{
        mesh: THREE.Mesh;
        orbitRadius: number;
        speed: number;
        angle: number;
        tiltMatrix: THREE.Matrix4;
      }> = [];

      project.sphere.rings.forEach((ringDef, rIndex) => {
        // Mathematical wire ring using TorusGeometry
        const ringGeo = new THREE.TorusGeometry(ringDef.radius, ringDef.tube, 16, 128);
        const ringMat = new THREE.MeshStandardMaterial({
          color: new THREE.Color(project.sphere.wireColor),
          metalness: 0.95,
          roughness: 0.2,
          emissive: new THREE.Color(project.sphere.wireColor),
          emissiveIntensity: 0.25,
        });

        const ringMesh = new THREE.Mesh(ringGeo, ringMat);
        ringMesh.rotation.set(ringDef.tiltX, ringDef.tiltY, ringDef.tiltZ);
        ringsGroup.add(ringMesh);

        // Satellites / Obelisks running along the rings
        if (ringDef.hasSatellite) {
          const satGeo = new THREE.SphereGeometry(0.16, 16, 16);
          const satMat = new THREE.MeshStandardMaterial({
            color: new THREE.Color(ringDef.satelliteColor),
            metalness: 0.9,
            roughness: 0.1,
            emissive: new THREE.Color(ringDef.satelliteColor),
            emissiveIntensity: 0.6,
          });
          const satMesh = new THREE.Mesh(satGeo, satMat);

          const tiltMatrix = new THREE.Matrix4();
          tiltMatrix.makeRotationFromEuler(new THREE.Euler(ringDef.tiltX, ringDef.tiltY, ringDef.tiltZ));

          satellitesList.push({
            mesh: satMesh,
            orbitRadius: ringDef.radius,
            speed: ringDef.speed * 1.5,
            angle: rIndex * 1.8,
            tiltMatrix,
          });
          group.add(satMesh);
        }
      });

      group.add(ringsGroup);
      scene.add(group);

      planetMeshesRef.current.set(project.id, {
        group,
        sphereMesh,
        rings: ringsGroup,
        figureGroup,
        satellites: satellitesList,
        material: shaderMat,
        project,
      });
    }

    // Build all initial planets
    projects.forEach(createPlanet);

    // MOUSE INTERACTION & RAYCASTING
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handlePointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      if (isDragging.current && !activeProjectIdRef.current) {
        const deltaX = e.clientX - previousMousePosition.current.x;
        const deltaY = e.clientY - previousMousePosition.current.y;

        targetOrbitRotation.current.y += deltaX * 0.005;
        targetOrbitRotation.current.x = Math.max(-0.6, Math.min(0.6, targetOrbitRotation.current.x + deltaY * 0.005));

        previousMousePosition.current = { x: e.clientX, y: e.clientY };
      }

      // Check hover when not in active project mode
      if (!activeProjectIdRef.current) {
        raycaster.setFromCamera(mouse, camera);
        const sphereList = Array.from(planetMeshesRef.current.values()).map((p) => p.sphereMesh);
        const intersects = raycaster.intersectObjects(sphereList, false);

        if (intersects.length > 0) {
          const hitSphere = intersects[0].object as THREE.Mesh;
          const hitProjectId = hitSphere.userData.projectId;
          const found = projectsRef.current.find((p) => p.id === hitProjectId);
          if (found && hoveredProjectIdRef.current !== hitProjectId) {
            sound.playHoverPing();
            onHoverProject(found);
          }
          container.style.cursor = 'pointer';
        } else {
          if (hoveredProjectIdRef.current) {
            onHoverProject(null);
          }
          container.style.cursor = isDragging.current ? 'grabbing' : 'grab';
        }
      }
    };

    const handlePointerDown = (e: MouseEvent) => {
      // Ignore if clicking on UI buttons
      if ((e.target as HTMLElement).closest('[data-ui-element="true"]')) return;

      isDragging.current = true;
      previousMousePosition.current = { x: e.clientX, y: e.clientY };
    };

    const handlePointerUp = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest('[data-ui-element="true"]')) {
        isDragging.current = false;
        return;
      }

      // Raycast click
      if (!activeProjectIdRef.current) {
        const rect = container.getBoundingClientRect();
        mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const sphereList = Array.from(planetMeshesRef.current.values()).map((p) => p.sphereMesh);
        const intersects = raycaster.intersectObjects(sphereList, false);

        if (intersects.length > 0) {
          const hitSphere = intersects[0].object as THREE.Mesh;
          const hitProjectId = hitSphere.userData.projectId;
          const clickedProj = projectsRef.current.find((p) => p.id === hitProjectId);
          if (clickedProj) {
            onSelectProject(clickedProj);
          }
        }
      }

      isDragging.current = false;
    };

    const handleWheel = (e: WheelEvent) => {
      if (activeProjectIdRef.current) return;
      e.preventDefault();
      targetZoomLevel.current = Math.max(14, Math.min(85, targetZoomLevel.current + e.deltaY * 0.03));
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointerup', handlePointerUp);
    container.addEventListener('wheel', handleWheel, { passive: false });

    // RESIZE LISTENER
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      if (w > 0 && h > 0) {
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      }
    };
    window.addEventListener('resize', handleResize);

    // ANIMATION LOOP
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth orbit rotation lerp
      orbitRotation.current.x += (targetOrbitRotation.current.x - orbitRotation.current.x) * 0.08;
      orbitRotation.current.y += (targetOrbitRotation.current.y - orbitRotation.current.y) * 0.08;
      zoomLevel.current += (targetZoomLevel.current - zoomLevel.current) * 0.08;

      // Update camera position
      if (!activeProjectIdRef.current) {
        // Idle cosmic floating drift
        const autoOrbit = elapsedTime * 0.02;
        const currentRotY = orbitRotation.current.y + autoOrbit;
        const currentRotX = orbitRotation.current.x;

        cameraTargetPos.current.set(
          Math.sin(currentRotY) * zoomLevel.current,
          currentRotX * 12 + Math.sin(elapsedTime * 0.2) * 0.8 + 4,
          Math.cos(currentRotY) * zoomLevel.current
        );
        cameraLookAtTarget.current.set(0, Math.sin(elapsedTime * 0.3) * 0.4, 0);
      }

      // Smooth camera interpolation towards targets
      camera.position.lerp(cameraTargetPos.current, 0.05);
      cameraCurrentLookAt.current.lerp(cameraLookAtTarget.current, 0.06);
      camera.lookAt(cameraCurrentLookAt.current);

      // Animate starfield subtle rotation
      if (starfield) {
        starfield.rotation.y = elapsedTime * 0.003;
        starfield.rotation.x = Math.sin(elapsedTime * 0.002) * 0.05;
      }

      // Animate grand overlapping celestial armillary orbits
      if (grandOrbitsGroup) {
        grandOrbitsGroup.rotation.y = elapsedTime * 0.0006;
        grandOrbitsGroup.rotation.z = Math.sin(elapsedTime * 0.0004) * 0.04;
      }

      // Animate planets, shaders, rings, satellites, and human figures
      planetMeshesRef.current.forEach((item, pId) => {
        const isHovered = hoveredProjectIdRef.current === pId;
        const isActive = activeProjectIdRef.current === pId;

        // Update shader uniforms
        item.material.uniforms.uTime.value = elapsedTime;
        const targetHover = isHovered || isActive ? 1.0 : 0.0;
        item.material.uniforms.uHover.value += (targetHover - item.material.uniforms.uHover.value) * 0.1;

        // Sphere axial slow rotation
        item.sphereMesh.rotation.y += 0.002;

        // Rings rotation
        item.rings.rotation.y += 0.001;

        // Wizard orator animation: staff crystal pulse, rotating gimbal ring, halo & oration sway
        if (item.figureGroup) {
          const halo = item.figureGroup.getObjectByName('wizardHalo');
          if (halo) {
            halo.scale.setScalar(1.0 + Math.sin(elapsedTime * 2.5) * 0.08);
            halo.rotation.z = elapsedTime * 0.6;
          }

          const staffOrb = item.figureGroup.getObjectByName('wizardStaffOrb');
          if (staffOrb) {
            staffOrb.rotation.y = elapsedTime * 2.0;
            staffOrb.rotation.x = Math.sin(elapsedTime * 1.8) * 0.35;
            const targetScale = isHovered || isActive ? 1.4 + Math.sin(elapsedTime * 6.0) * 0.2 : 1.0;
            staffOrb.scale.setScalar(targetScale);
          }

          const staffRing = item.figureGroup.getObjectByName('wizardStaffRing');
          if (staffRing) {
            staffRing.rotation.x = elapsedTime * 2.2;
            staffRing.rotation.y = elapsedTime * 1.4;
          }

          const staffLight = item.figureGroup.getObjectByName('wizardStaffLight') as THREE.PointLight | undefined;
          if (staffLight) {
            staffLight.intensity = isHovered || isActive ? 3.5 + Math.sin(elapsedTime * 8.0) * 1.0 : 1.8;
          }

          // Idle orator swaying gesture
          item.figureGroup.rotation.y = Math.sin(elapsedTime * 0.45) * 0.12;
        }

        // Update satellites along their inclined orbital paths
        item.satellites.forEach((sat) => {
          sat.angle += sat.speed;
          const rawPos = new THREE.Vector3(
            Math.cos(sat.angle) * sat.orbitRadius,
            0,
            Math.sin(sat.angle) * sat.orbitRadius
          );
          rawPos.applyMatrix4(sat.tiltMatrix);
          sat.mesh.position.copy(rawPos);
        });
      });

      renderer.render(scene, camera);
    };

    animate();

    // CLEANUP
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
      container.removeEventListener('wheel', handleWheel);
      window.removeEventListener('resize', handleResize);

      if (rendererRef.current?.domElement) {
        if (rendererRef.current.domElement.parentNode === container) {
          container.removeChild(rendererRef.current.domElement);
        }
        rendererRef.current.dispose();
      }
      planetMeshesRef.current.clear();
    };
  }, []);

  // Update dynamic projects list if new project is added
  useEffect(() => {
    if (!sceneRef.current) return;
    const scene = sceneRef.current;

    projects.forEach((proj) => {
      if (!planetMeshesRef.current.has(proj.id)) {
        // Build new planet on the fly!
        const group = new THREE.Group();
        group.position.set(...proj.sphere.position);
        group.name = `planet-${proj.id}`;

        const sphereGeo = new THREE.SphereGeometry(proj.sphere.radius, 64, 64);
        const shaderMat = new THREE.ShaderMaterial({
          vertexShader: IridescentShader.vertexShader,
          fragmentShader: IridescentShader.fragmentShader,
          uniforms: {
            uTime: { value: 0 },
            uColorPrimary: { value: new THREE.Color(proj.sphere.colorPrimary) },
            uColorSecondary: { value: new THREE.Color(proj.sphere.colorSecondary) },
            uColorTertiary: { value: new THREE.Color(proj.sphere.colorTertiary) },
            uFresnelPower: { value: proj.sphere.fresnelPower },
            uDistortion: { value: proj.sphere.surfaceDistortion },
            uHover: { value: 0 },
          },
          transparent: true,
        });

        const sphereMesh = new THREE.Mesh(sphereGeo, shaderMat);
        sphereMesh.userData = { projectId: proj.id };
        group.add(sphereMesh);

        // Towering Wizard Figure
        const figureGroup = buildWizardFigure(
          proj.observerFigure.beaconColor,
          proj.sphere.radius,
          proj.observerFigure.stance
        );
        group.add(figureGroup);

        // Rings
        const ringsGroup = new THREE.Group();
        proj.sphere.rings.forEach((ringDef) => {
          const ringMesh = new THREE.Mesh(
            new THREE.TorusGeometry(ringDef.radius, ringDef.tube, 16, 128),
            new THREE.MeshStandardMaterial({
              color: new THREE.Color(proj.sphere.wireColor),
              metalness: 0.9,
              roughness: 0.2,
              emissive: new THREE.Color(proj.sphere.wireColor),
              emissiveIntensity: 0.25,
            })
          );
          ringMesh.rotation.set(ringDef.tiltX, ringDef.tiltY, ringDef.tiltZ);
          ringsGroup.add(ringMesh);
        });
        group.add(ringsGroup);

        scene.add(group);
        planetMeshesRef.current.set(proj.id, {
          group,
          sphereMesh,
          rings: ringsGroup,
          figureGroup,
          satellites: [],
          material: shaderMat,
          project: proj,
        });
      }
    });
  }, [projects]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full overflow-hidden select-none bg-[#020205]"
    />
  );
};
