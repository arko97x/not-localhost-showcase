# SHAPESHIFTER — Living Shared World & Transformation Engine

An architectural blueprint for a state-based digital showcase system where one underlying website transforms its entire visual identity, spatial physics, and archive language according to the creative DNA of the designer inhabiting it.

---

### User Review & Critical Decisions

> [!IMPORTANT]
> The foundational prototype implements the **Shared World**, **Lakshmi / Sutradhara / The Living Study**, and **Mayavin / The Mirror Palace**, connected by an expressive **Transformation Engine** and backed by a structured data model and interactive **Creative DNA Forge**.

- **Confirmed Decision 1 (Shared World Navigation)**: Spatial cosmic mandala with radial student nodes, orbiting energy lines, and interactive spatial focus rather than a conventional thumbnail grid.
- **Confirmed Decision 2 (Sensory Atmosphere)**: Organic, ambient soundscapes powered by procedural Web Audio API (warm tape/paper hum for the Study, crystalline harmonic resonance for the Mirror Palace, deep cosmic drone for the Mandala) with persistent mute/volume controls.
- **Confirmed Decision 3 (Extensibility & Forge)**: Integrated "Creative DNA Forge" modal allowing visitors and students to test entering creative DNA parameters, previewing how new student worlds and Shapeshifter archetypes synthesize.

---

## 1. Overview & Core Concept

**SHAPESHIFTER** is not a portfolio website. It is a shared digital universe for Experience Design students. The website itself is a single reactive state machine whose surface, typography, physics, and interaction metaphors morph completely based on whose body of work is active:

1. **The Shared World (Akāśa / Mandala)**: The celestial common space where the cohort lives in relationship. An interactive cosmic mandala with radial student nodes connected by luminous *sutras* (threads).
2. **Lakshmi Supriya / SUTRADHARA (The Gatherer of Threads)**: The Living Study. An intensely active, tactile researcher's studio where work lives as physical artefacts (journey maps pinned to walls, thermal receipts feeding from a printer, field sketchbooks, Chamba calendars, and laptop screens) bound together by an unbroken red thread.
3. **Mayavin / THE SHAPER OF ILLUSION**: The Mirror Palace. A radically contrasting digital world of refractive mirrors, perceptual distortions, and digital echoes, proving that the underlying engine can inhabit opposite aesthetic and physical dimensions.
4. **The Transformation Engine**: Seamless, choreographed transitions inspired by environmental animation (tactile weight, breathing stillness) and elemental transformation (continuity of motion, objects folding and unfolding across states).

---

## 2. User Experience & Visual Design

### Key User Flows

```text
       ┌────────────────────────────────────────────────────────┐
       │             SHARED WORLD (COSMIC MANDALA)              │
       │    Radial Student Nodes · Sutra Threads · Axis Core    │
       └───────────────────────────┬────────────────────────────┘
                                   │
                    Select Student / Node Activation
                                   │
                                   ▼
       ┌────────────────────────────────────────────────────────┐
       │                 TRANSFORMATION ENGINE                  │
       │  Camera Zoom · Mandala Dissolution · Particle Morph    │
       │     Archetype Title Reveal: "SUTRADHARA / MAYAVIN"     │
       └───────────────────────────┬────────────────────────────┘
                                   │
               ┌───────────────────┴───────────────────┐
               ▼                                       ▼
 ┌───────────────────────────┐           ┌───────────────────────────┐
 │   LAKSHMI / THE STUDY     │           │   MAYAVIN / MIRROR PALACE │
 │ Tactile Research Room     │           │ Crystalline Refractions   │
 │ • Chamba Calendar & Notes │           │ • Illusion Shards         │
 │ • Hospital Journey Map    │           │ • Mirror Echoes           │
 │ • Thermal Receipt Printer │           │ • Perceptual Distortions  │
 │ • Saha Screen Device      │           │ • Code Glitch Relics      │
 │ • Red Thread Connections  │           │ • Interactive Prism Angle │
 └─────────────┬─────────────┘           └─────────────┬─────────────┘
               │                                       │
               ▼                                       ▼
 ┌───────────────────────────┐           ┌───────────────────────────┐
 │   PROJECT MODAL VIEWER    │           │   PROJECT MODAL VIEWER    │
 │ In-World Framed Dossier   │           │ Refractive Prismatic View │
 └─────────────┬─────────────┘           └─────────────┬─────────────┘
               │                                       │
               └───────────────────┬───────────────────┘
                                   │ Return / Shapeshift to Other World
                                   ▼
       ┌────────────────────────────────────────────────────────┐
       │           CREATIVE DNA FORGE (EXTENSIBILITY)           │
       │   Input Work Tags -> Generate Archetype & Test World   │
       └────────────────────────────────────────────────────────┘
```

### Visual Identity & Theme Tokens

- **Shared World (Cosmic Mandala)**:
  - Deep cosmic space canvas (`#080A10`), starlight silver (`#E2E8F0`), celestial gold threads (`#D4AF37`), subtle indigo aura (`#1E1B4B`).
  - Typography: Refined serif display paired with clean sans.
- **Lakshmi / Sutradhara (The Living Study)**:
  - Earthy, warm, tactile research palette: Raw linen canvas (`#F7F4EE`), warm studio umber (`#2B2621`), terracotta accent (`#C2410C`), archival paper (`#FFFDF8`), and the unbroken red thread of inquiry (`#DC2626`).
  - Typography: Humanist editorial serif paired with thoughtful field notes typography.
- **Mayavin (The Mirror Palace)**:
  - Prismatic, refractive, monochromatic silver with chromatic aberration: Obsidian black (`#050508`), mirrored chrome (`#F1F5F9`), subtle chromatic spectral fringe (cyan `#06B6D4` / violet `#8B5CF6`).
  - Typography: Sharp geometric display with tabular monospace.

### Tactile Ambient Soundscapes (Web Audio API)

- Procedural Web Audio synthesizer requiring no external audio assets:
  - **Study**: Gentle warm analog tape hiss, soft low-frequency desk lamp resonance, and subtle paper-like click feedback on object interaction.
  - **Mirror Palace**: Crystalline high-frequency glass harmonic drone with ethereal bell-like resonance on hover and mirror shard rotation.
  - **Mandala**: Deep harmonic singing-bowl chord (528Hz base drone with subtle fifth interval) grounding the cosmic axis.
  - Global accessible mute toggle in top bar with volume memory.

---

## 3. Key Product Decisions & Trade-Offs

### Decision 1: Procedural CSS & SVG Spatial Rooms vs Heavy 3D WebGL
- **Chosen Approach**: Rich spatial CSS 3D transforms, SVG connection vectors, layered parallax, and dynamic canvas rendering over a heavy WebGL/Three.js bundle.
- **Why**: Zero loading latency, crisp typographic rendering, full accessibility, seamless DOM interaction for project dossiers, and absolute stability on all client devices without WebGL context loss.

### Decision 2: Central Reactive State Machine for Transformation
- **Chosen Approach**: A centralized `WorldEngineState` managing transitions (`isTransforming`, `activeWorldId`, `transitionPhase`, `cameraZoom`, `transitionPayload`).
- **Why**: Ensures that state transitions are cinematic and physically grounded. Objects in the departure world fold and collapse into the transformation vortex before the arrival world reconstitutes.

### Decision 3: Decoupled Student Data Schema
- **Chosen Approach**: All student worlds are defined through a typed `StudentWorldData` interface containing their Creative DNA, five attributes (Shapeshifter Name, Meaning, Creative Element, Storage Artefact, Archive Language), project nodes, coordinates, and visual language overrides.
- **Why**: Adding the other 13 students is strictly a data-definition task. The core engine renders any valid student data object automatically.

---

## 4. Technical Architecture & Data Strategy

### System & Component Hierarchy

```text
┌────────────────────────────────────────────────────────────────────────┐
│                                App.tsx                                 │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                     Navigation Bar (Top Bar)                     │  │
│  │   SHAPESHIFTER · World State Indicator · Sound Toggle · Forge    │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                    Transformation Orchestrator                   │  │
│  │   Active State: [Mandala] | [Living Study] | [Mirror Palace]     │  │
│  │   Transition Curtain · Elemental Particle Conduit · Camera Zoom  │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│         │                             │                        │       │
│         ▼                             ▼                        ▼       │
│  ┌──────────────┐             ┌──────────────┐          ┌────────────┐ │
│  │ CosmicMandala│             │ LivingStudy  │          │MirrorPalace│ │
│  │ (Common)     │             │ (Lakshmi)    │          │(Mayavin)   │ │
│  │ • Orbit Nodes│             │ • Desk Lamp  │          │• Prisms    │ │
│  │ • Sutra Rays │             │ • Red Thread │          │• Echoes    │ │
│  │ • Core Sun   │             │ • Pinned Map │          │• Shards    │ │
│  │ • World Gate │             │ • Printer    │          │• Glitch    │ │
│  └──────────────┘             └──────┬───────┘          └─────┬──────┘ │
│                                      │                        │        │
│                                      ▼                        ▼        │
│                               ┌──────────────────────────────────────┐ │
│                               │         ProjectViewerModal           │ │
│                               │  Deep Dossier: Case Study, Images,   │ │
│                               │  Process, Research & Outcomes        │ │
│                               └──────────────────────────────────────┘ │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                      Creative DNA Forge Modal                    │  │
│  │  Live Input: Student Name, Keywords, Practice -> Archetype Spec  │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────┘
```

### Data Model Schema (`src/types/shapeshifter.ts`)

```typescript
export interface ProjectNode {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  year: string;
  artefactType: 'pinned-map' | 'thermal-receipt' | 'notebook' | 'screen' | 'publication' | 'mirror-shard' | 'prism';
  summary: string;
  researchQuestion: string;
  process: string[];
  outcomes: string[];
  tags: string[];
  spatialCoords: { x: number; y: number; rotate?: number };
}

export interface StudentWorld {
  id: string;
  studentName: string;
  shapeshifterName: string;
  shapeshifterMeaning: string;
  creativeElement: string;
  storageArtefact: string;
  archiveLanguage: string;
  transformationBehavior: string;
  visualTheme: {
    background: string;
    textPrimary: string;
    textSecondary: string;
    accent: string;
    fontFamilyDisplay: string;
    ambientSoundType: 'study' | 'glass' | 'cosmic';
  };
  projects: ProjectNode[];
}
```

---

## 5. Implementation Sequence & Next Steps

1. **Phase 1: Setup & Data Engine**:
   - Establish `types/shapeshifter.ts` and structured student datasets for Lakshmi (`SUTRADHARA`) and Mayavin (`MAYAVIN`), plus preview stubs for future students.
   - Implement the procedural Web Audio soundscape engine (`services/audioEngine.ts`).
2. **Phase 2: Common World (The Cosmic Mandala)**:
   - Build `CosmicMandala.tsx` featuring the rotating radial cosmological nodes, glowing sutras, and intuitive student discovery.
3. **Phase 3: Lakshmi's World (The Living Study)**:
   - Build `LivingStudy.tsx` with desk lamp lighting, pinned journey maps, thermal receipt printer feed, interactive notebooks, screen artefacts, and connected red thread.
4. **Phase 4: Mayavin's World (The Mirror Palace)**:
   - Build `MirrorPalace.tsx` with refractive mirror polygons, perceptual mouse-tracking distortion, and prismatic project shards.
5. **Phase 5: Transformation Engine & Project Viewer**:
   - Build smooth dimensional transitions with spatial folding, particle conduits, and title cards.
   - Build the contextual `ProjectViewerModal` preserving each world's spatial aesthetic.
6. **Phase 6: Creative DNA Forge & Polish**:
   - Implement the interactive Forge tool to test and preview any new student's creative DNA.
   - Verify layout responsiveness, accessibility, and build compilation.
