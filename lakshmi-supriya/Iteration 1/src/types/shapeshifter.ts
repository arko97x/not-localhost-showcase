/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type WorldId = 'shared' | 'lakshmi' | 'mayavin' | string;

export type ArtefactType =
  | 'pinned-map'
  | 'thermal-receipt'
  | 'notebook'
  | 'screen'
  | 'publication'
  | 'mirror-shard'
  | 'prism'
  | 'specimen'
  | 'relic'
  | 'loom-thread'
  | 'drawer'
  | 'caravan-item'
  | 'observation-lens';

export interface ProjectSpatialCoords {
  x: number; // percentage (0 - 100) or pixel anchor
  y: number;
  rotate?: number;
  depth?: number;
}

export interface ProjectNode {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  type?: string; // alias for category/mode
  year: string;
  artefactType: ArtefactType;
  artefact?: string; // descriptive artefact name
  image?: string;
  summary: string;
  researchQuestion: string;
  context: string;
  process: string[];
  outcomes: string[];
  reflection: string;
  methods: string[];
  tags: string[];
  spatialCoords: ProjectSpatialCoords;
  position?: ProjectSpatialCoords; // alias for spatialCoords
  interaction?: string; // interaction description
}

export interface WorldMetadata {
  type: string;
  title: string;
  atmosphere: string;
  movement: string;
}

export interface VisualLanguage {
  colors: string[];
  typography: string[];
  textures: string[];
  imagery: string[];
  paletteNames?: string[];
  atmosphereNotes?: string;
}

export interface MaterialLanguage {
  primaryMaterials: string[];
  surfaceTextures: string[];
  culturalSubstrates: string[];
  artefactForm: string;
  sensoryTouch: string;
}

export interface MotionGrammar {
  principle: 'REVEAL' | 'DISCOVER' | 'ASSEMBLE' | 'NARRATE' | 'CONNECT' | 'FORM' | 'OBSERVE' | 'DRIFT' | 'REARRANGE' | 'TRAVEL' | 'INTERACT' | 'GROW' | 'TRANSFORM' | 'SUTRA' | 'MAYA';
  speedScale: 'slow-contemplative' | 'elastic-snappy' | 'heavy-inertial' | 'flowing-continuous' | 'kinetic-travel' | 'gradual-organic';
  keyBehaviors: string[];
  signatureAnimation: string;
}

export interface InteractionPhysics {
  model: string;
  cursorBehavior: string;
  hoverReaction: string;
  activeReaction: string;
  settleBehavior: string;
}

export interface TransitionGrammar {
  mode: string;
  departurePhenomenon: string;
  arrivalPhenomenon: string;
  specificHandoffs?: Record<string, string>;
}

export interface LightingBehaviour {
  model: string;
  description: string;
}

export interface EnvironmentBehaviour {
  spatialStructure: string;
  backgroundField: string;
  reactiveElements: string[];
}

export interface ProjectRevealBehaviour {
  revealStyle: string;
  transformationSteps?: string[];
  description: string;
}

export interface WorldSystemConfig {
  lawOfReality: string;
  motionPrinciple: MotionGrammar['principle'];
  visualLanguage: VisualLanguage;
  materialLanguage: MaterialLanguage;
  motionGrammar: MotionGrammar;
  interactionPhysics: InteractionPhysics;
  transitionGrammar: TransitionGrammar;
  lightingBehaviour: LightingBehaviour;
  environmentBehaviour: EnvironmentBehaviour;
  projectRevealBehaviour: ProjectRevealBehaviour;
}

export type PhysicsBehavior =
  | 'spring-elastic'
  | 'gravitational-slow'
  | 'crystalline-snappy'
  | 'tactile-damped'
  | 'fluid-wave'
  | 'kinetic-magnetic';

export interface SpatialPhysics {
  behavior: PhysicsBehavior;
  tension?: number; // spring stiffness (e.g. 120 - 400)
  friction?: number; // damping friction (e.g. 10 - 40)
  mass?: number; // mass inertia (e.g. 0.5 - 2.5)
  transitionTimingFunction: string; // CSS cubic-bezier
  transitionDuration: string; // e.g. "350ms", "800ms"
  hoverTransform: string; // e.g. "translateY(-8px) scale(1.03)"
  perspectiveDepth?: string; // e.g. "1200px"
  particleDriftSpeed?: number;
  description?: string;
}

export interface StudentWorld {
  id: string;
  name: string; // Brief Section 37 primary name
  studentName: string;
  shapeshifterName: string;
  shapeshifterMeaning: string;
  subtitle?: string; // alias for shapeshifterMeaning
  creativeElement: string | string[];
  themes?: string[]; // Brief Section 36
  storageArtefact: string;
  storage_world?: string; // Brief Section 36
  archiveLanguage: string;
  transformationBehavior: string;
  transition_behaviour?: string; // Brief Section 36
  cosmologyPrinciple: string; // e.g. "Sūtra", "Māyā", "Smṛti"
  summarySnippet: string;
  accentColor: string;
  // Brief Section 37 structured objects
  world: WorldMetadata;
  visualLanguage: VisualLanguage;
  visualTheme: {
    bgClass: string;
    ambientSoundType: 'study' | 'glass' | 'cosmic';
    accentHex: string;
    fontFamilyDisplay: string;
    fontFamilyBody: string;
  };
  spatialPhysics?: SpatialPhysics;
  // Extended 8 Laws of Reality dimensions
  materialLanguage?: MaterialLanguage;
  motionGrammar?: MotionGrammar;
  interactionPhysics?: InteractionPhysics;
  transitionGrammar?: TransitionGrammar;
  lightingBehaviour?: LightingBehaviour;
  environmentBehaviour?: EnvironmentBehaviour;
  projectRevealBehaviour?: ProjectRevealBehaviour;
  worldSystem?: WorldSystemConfig;
  projects: ProjectNode[];
  status: 'active' | 'preview';
}

export interface TransformationState {
  isTransforming: boolean;
  fromWorldId: WorldId;
  toWorldId: WorldId;
  phase: 'idle' | 'departure' | 'dissolving' | 'reconstituting' | 'arrival';
  progress: number;
}

export interface DNAForgeInput {
  studentName: string;
  disciplines: string[];
  inquiryThemes: string[];
  recurringMaterials: string[];
  customQuestion?: string;
}

export interface GeneratedArchetype {
  shapeshifterName: string;
  shapeshifterMeaning: string;
  creativeElement: string;
  storageArtefact: string;
  archiveLanguage: string;
  transformationBehavior: string;
  cosmologicalResonance: string;
  rationale: string;
}
