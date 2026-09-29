/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { VisualLanguage } from './shapeshifter';

/**
 * Supported 13 persona world identifiers (excluding foundational Lakshmi & Mayavin)
 */
export type PersonaWorldId =
  | 'smritika'
  | 'anveshin'
  | 'karigara'
  | 'kathaka'
  | 'tantuvid'
  | 'bhutika'
  | 'drashta'
  | 'svapnika'
  | 'jignasu'
  | 'yatri'
  | 'sangati'
  | 'sevika'
  | 'rupantara';

/**
 * 13 Motion Principles as defined in the SHAPESHIFTER motion grammar specification
 */
export type MotionPrinciple =
  | 'REVEAL'
  | 'DISCOVER'
  | 'ASSEMBLE'
  | 'NARRATE'
  | 'CONNECT'
  | 'FORM'
  | 'OBSERVE'
  | 'DRIFT'
  | 'REARRANGE'
  | 'TRAVEL'
  | 'INTERACT'
  | 'GROW'
  | 'TRANSFORM';

/**
 * The 13 distinct Laws of Reality
 */
export type LawOfReality =
  | 'Objects remember'
  | 'Light reveals'
  | 'Objects assemble'
  | 'Spaces narrate'
  | 'Everything is connected'
  | 'Materials respond'
  | 'Looking changes visibility'
  | 'Gravity is uncertain'
  | 'Questions reorganise reality'
  | 'The world moves'
  | 'Objects respond socially'
  | 'Attention produces growth'
  | 'Objects change form';

/**
 * Architectural spatial layout paradigms for the 13 persona worlds
 */
export type WorldLayoutType =
  | 'archival-drawer-cabinet' // Smritika: Tiered wooden drawers and file envelopes
  | 'archaeological-trench' // Anveshin: Vertical depth strata with torch beam
  | 'workbench-tool-rail' // Karigara: Carpenter's bench with pegboard & vice clamps
  | 'colonnade-courtyard' // Kathaka: Theatrical quadrangle with stepped plinths & canopies
  | 'jacquard-loom-matrix' // Tantuvid: Vertical warp & weft frame with taut cords
  | 'terraced-material-beds' // Bhutika: Multi-substrate landscape (clay, stone, paper, leaf)
  | 'astronomical-meridian' // Drashta: Circular quadrant with rotating iris & astrolabe
  | 'zero-gravity-void' // Svapnika: Multi-depth levitation plane with air currents
  | 'question-wall-matrix' // Jignasu: Dense force-directed query cluster with margin tape
  | 'highway-panorama' // Yatri: Horizontal moving road with odometer & waypoint trunks
  | 'public-broadside-wall' // Sangati: Overlapping wheatpaste posters & community pins
  | 'stepped-temple-cistern' // Sevika: Stone kalyani basin with living fern beds & pool ripples
  | 'transmutation-crucible'; // Rupantara: 5-stage metamorphic crucible apparatus

/**
 * Material Language schema representing cultural substrates and physical touch
 */
export interface PersonaMaterialLanguage {
  primaryMaterials: string[];
  surfaceTextures: string[];
  culturalSubstrates: string[];
  artefactForm: string;
  sensoryTouch: string;
  weightDensity: 'ethereal-weightless' | 'paper-light' | 'timber-balanced' | 'stone-heavy' | 'metallic-dense';
}

/**
 * Motion Grammar schema defining animation behaviors and signature interactions
 */
export interface PersonaMotionGrammar {
  principle: MotionPrinciple;
  speedScale:
    | 'slow-contemplative'
    | 'elastic-snappy'
    | 'heavy-inertial'
    | 'flowing-continuous'
    | 'kinetic-travel'
    | 'gradual-organic';
  keyBehaviors: string[];
  signatureAnimation: string;
  reducedMotionFallback: string;
}

/**
 * Interaction Physics schema detailing reactive forces and cursor behaviors
 */
export interface PersonaInteractionPhysics {
  model: string;
  cursorBehavior: string;
  hoverReaction: string;
  activeReaction: string;
  settleBehavior: string;
  dampingFactor: number; // 0.0 - 1.0
  springTension: number; // 100 - 400
}

/**
 * Transition Grammar schema for departure, arrival, and specific peer handoffs
 */
export interface PersonaTransitionGrammar {
  mode: string;
  departurePhenomenon: string;
  arrivalPhenomenon: string;
  specificHandoffs?: Partial<Record<PersonaWorldId | 'shared' | 'lakshmi' | 'mayavin', string>>;
}

/**
 * Lighting and optical model for the environment
 */
export interface PersonaLightingBehaviour {
  model: string;
  description: string;
  spotlightIntensity: number; // 0.0 - 1.0
  ambientDarkness: number; // 0.0 - 1.0
}

/**
 * Environmental and background spatial structure
 */
export interface PersonaEnvironmentBehaviour {
  spatialStructure: string;
  backgroundField: string;
  layoutType: WorldLayoutType;
  reactiveElements: string[];
}

/**
 * Project reveal and transformation behavior
 */
export interface PersonaProjectRevealBehaviour {
  revealStyle: string;
  transformationSteps?: string[];
  description: string;
}

/**
 * Complete, type-safe Persona World Reality Specification
 */
export interface PersonaWorldConfig {
  id: PersonaWorldId;
  name: string;
  shapeshifterName: string;
  shapeshifterMeaning: string;
  storageArtefact: string;
  lawOfReality: LawOfReality;
  motionPrinciple: MotionPrinciple;
  layoutType: WorldLayoutType;
  visualLanguage: VisualLanguage & {
    paletteNames: string[];
    atmosphereNotes: string;
  };
  materialLanguage: PersonaMaterialLanguage;
  motionGrammar: PersonaMotionGrammar;
  interactionPhysics: PersonaInteractionPhysics;
  transitionGrammar: PersonaTransitionGrammar;
  lightingBehaviour: PersonaLightingBehaviour;
  environmentBehaviour: PersonaEnvironmentBehaviour;
  projectRevealBehaviour: PersonaProjectRevealBehaviour;
}

/**
 * Persona-Specific Reality Config Schemas ensuring strictly typed access
 */
export interface SmritikaRealityConfig extends PersonaWorldConfig {
  id: 'smritika';
  motionPrinciple: 'REVEAL';
  lawOfReality: 'Objects remember';
  layoutType: 'archival-drawer-cabinet';
}

export interface AnveshinRealityConfig extends PersonaWorldConfig {
  id: 'anveshin';
  motionPrinciple: 'DISCOVER';
  lawOfReality: 'Light reveals';
  layoutType: 'archaeological-trench';
}

export interface KarigaraRealityConfig extends PersonaWorldConfig {
  id: 'karigara';
  motionPrinciple: 'ASSEMBLE';
  lawOfReality: 'Objects assemble';
  layoutType: 'workbench-tool-rail';
}

export interface KathakaRealityConfig extends PersonaWorldConfig {
  id: 'kathaka';
  motionPrinciple: 'NARRATE';
  lawOfReality: 'Spaces narrate';
  layoutType: 'colonnade-courtyard';
}

export interface TantuvidRealityConfig extends PersonaWorldConfig {
  id: 'tantuvid';
  motionPrinciple: 'CONNECT';
  lawOfReality: 'Everything is connected';
  layoutType: 'jacquard-loom-matrix';
}

export interface BhutikaRealityConfig extends PersonaWorldConfig {
  id: 'bhutika';
  motionPrinciple: 'FORM';
  lawOfReality: 'Materials respond';
  layoutType: 'terraced-material-beds';
}

export interface DrashtaRealityConfig extends PersonaWorldConfig {
  id: 'drashta';
  motionPrinciple: 'OBSERVE';
  lawOfReality: 'Looking changes visibility';
  layoutType: 'astronomical-meridian';
}

export interface SvapnikaRealityConfig extends PersonaWorldConfig {
  id: 'svapnika';
  motionPrinciple: 'DRIFT';
  lawOfReality: 'Gravity is uncertain';
  layoutType: 'zero-gravity-void';
}

export interface JignasuRealityConfig extends PersonaWorldConfig {
  id: 'jignasu';
  motionPrinciple: 'REARRANGE';
  lawOfReality: 'Questions reorganise reality';
  layoutType: 'question-wall-matrix';
}

export interface YatriRealityConfig extends PersonaWorldConfig {
  id: 'yatri';
  motionPrinciple: 'TRAVEL';
  lawOfReality: 'The world moves';
  layoutType: 'highway-panorama';
}

export interface SangatiRealityConfig extends PersonaWorldConfig {
  id: 'sangati';
  motionPrinciple: 'INTERACT';
  lawOfReality: 'Objects respond socially';
  layoutType: 'public-broadside-wall';
}

export interface SevikaRealityConfig extends PersonaWorldConfig {
  id: 'sevika';
  motionPrinciple: 'GROW';
  lawOfReality: 'Attention produces growth';
  layoutType: 'stepped-temple-cistern';
}

export interface RupantaraRealityConfig extends PersonaWorldConfig {
  id: 'rupantara';
  motionPrinciple: 'TRANSFORM';
  lawOfReality: 'Objects change form';
  layoutType: 'transmutation-crucible';
}

/**
 * Union of all specific persona configs
 */
export type AnyPersonaWorldConfig =
  | SmritikaRealityConfig
  | AnveshinRealityConfig
  | KarigaraRealityConfig
  | KathakaRealityConfig
  | TantuvidRealityConfig
  | BhutikaRealityConfig
  | DrashtaRealityConfig
  | SvapnikaRealityConfig
  | JignasuRealityConfig
  | YatriRealityConfig
  | SangatiRealityConfig
  | SevikaRealityConfig
  | RupantaraRealityConfig;
