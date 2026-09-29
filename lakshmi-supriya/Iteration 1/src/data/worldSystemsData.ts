/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { WorldSystemConfig } from '../types/shapeshifter';

/**
 * 13 PERSONA WORLDS: VISUAL AESTHETIC & ANIMATION SYSTEMS
 * "13 different laws of reality."
 * The underlying website architecture remains shared. The world changes.
 */
export const WORLD_SYSTEMS: Record<string, WorldSystemConfig> = {
  // 1. SMRITIKA — The Keeper of Memory / The Library of Things
  smritika: {
    lawOfReality: 'Objects remember',
    motionPrinciple: 'REVEAL',
    visualLanguage: {
      colors: ['#F8F6F0', '#4A3525', '#6B2A2A', '#4A607A', '#EFE8D8'],
      typography: ['Cormorant Garamond', 'JetBrains Mono', 'Plus Jakarta Sans'],
      textures: ['weathered-index-card', 'tobacco-wood', 'faded-ink', 'varnished-teak'],
      imagery: ['developing-photographs', 'unsent-letters', 'archival-cassette-labels', 'typewriter-stamps'],
      paletteNames: ['Ivory', 'Tobacco Brown', 'Muted Maroon', 'Dusty Blue', 'Faded Paper'],
      atmosphereNotes: 'Warm archival atmosphere. Handled rather than pristine.',
    },
    materialLanguage: {
      primaryMaterials: ['yellowed-paper', 'teak-wood-drawers', 'cloth-folders', 'linen-envelopes'],
      surfaceTextures: ['handled-paper-edges', 'brass-drawer-pulls', 'typewritten-index-cards', 'pencil-marginalia'],
      culturalSubstrates: ['Partition epistolary archives', 'vernacular cassette recordings', 'family trunks (sandook)'],
      artefactForm: 'Archival drawer compartment and developing photographic plate',
      sensoryTouch: 'Soft dry paper friction, sliding wooden drawer resistance, tactile card lift',
    },
    motionGrammar: {
      principle: 'REVEAL',
      speedScale: 'slow-contemplative',
      keyBehaviors: [
        'Drawers sliding open horizontally with physical wood friction',
        'Photographs slowly developing from silver gelatin fog into visibility',
        'Paper edges lifting slightly as though stirred by a quiet draft',
        'Handwritten annotations appearing stroke-by-stroke upon inspection',
        'Memory fragments surfacing through layered archival folders',
      ],
      signatureAnimation: 'A drawer opens. Inside is another photograph. The photograph gradually becomes a doorway into another project.',
    },
    interactionPhysics: {
      model: 'memory-surface',
      cursorBehavior: 'Archival loupe with micro-magnification over handwritten marginalia',
      hoverReaction: 'Drawer pull glides forward 28px, index card lifts 8deg with soft paper shadow',
      activeReaction: 'Drawer slides fully open with damped deceleration, photo develops over 700ms',
      settleBehavior: 'Gradual nostalgic settling with low-friction tape damping',
    },
    transitionGrammar: {
      mode: 'drawer-to-doorway',
      departurePhenomenon: 'Archival drawers slide shut in quiet unison; parchment folds into envelope',
      arrivalPhenomenon: 'Archival index card develops into the new world space',
      specificHandoffs: {
        anveshin: 'A photograph fades into a dark surface. Its edges become rock. A beam of light appears. The visitor emerges into the Cave of Questions.',
      },
    },
    lightingBehaviour: {
      model: 'ambient-diffuse',
      description: 'Warm incandescent table lamp pooling over yellowed paper; corners fall into soft tobacco shadow',
    },
    environmentBehaviour: {
      spatialStructure: 'Tiered archival cabinetry with pull-out drawers and suspended index folders',
      backgroundField: 'Subtle wood grain and paper fibers with faint ambient dust motes',
      reactiveElements: ['brass-pulls', 'photo-plates', 'index-tabs', 'tape-spools'],
    },
    projectRevealBehaviour: {
      revealStyle: 'drawer-slide-and-photo-develop',
      transformationSteps: ['Drawer Glides Open', 'Index Card Rises', 'Silver Gelatin Emulsion Develops', 'Project Manifests'],
      description: 'Opening a drawer awakens dormant memory fragments that assemble into the project dossier',
    },
  },

  // 2. ANVESHIN — The Seeker / The Cave of Questions
  anveshin: {
    lawOfReality: 'Light reveals',
    motionPrinciple: 'DISCOVER',
    visualLanguage: {
      colors: ['#18181B', '#52525B', '#D97706', '#1E1B4B', '#047857'],
      typography: ['Playfair Display', 'JetBrains Mono', 'Plus Jakarta Sans'],
      textures: ['rough-slate', 'granite-strata', 'torchlight-falloff', 'mineral-chalk'],
      imagery: ['stepwell-aquifer-cores', 'chiseled-inscriptions', 'surveyor-triangulations', 'topographic-contour-maps'],
      paletteNames: ['Charcoal', 'Stone Grey', 'Ochre', 'Deep Indigo', 'Mineral Green'],
      atmosphereNotes: 'Dark mineral environment. Archaeological research site + intellectual excavation.',
    },
    materialLanguage: {
      primaryMaterials: ['chiseled-limestone', 'rough-basalt', 'brass-transit-levels', 'raw-ochre-chalk'],
      surfaceTextures: ['quarried-stone-relief', 'weathered-stepwell-granite', 'survey-marking-lines', 'mineral-veins'],
      culturalSubstrates: ['Western Indian stepwells (vavs)', 'subterranean water hydrology', 'epigraphic inscriptions'],
      artefactForm: 'Petroglyph stone fragment with etched survey markings',
      sensoryTouch: 'Rough stone drag, cold mineral density, sharp pencil scratch on slate',
    },
    motionGrammar: {
      principle: 'DISCOVER',
      speedScale: 'heavy-inertial',
      keyBehaviors: [
        'Cursor behaves as a torchlight beam illuminating only immediate vicinity',
        'Inscriptions in stone strata emerge into luminescence only when approached',
        'Precise white survey lines gradually redraw themselves across cavern walls',
        'Contour lines connect distant rock fragments like subterranean waterways',
        'Unattended areas fade softly into dark mineral shadow',
      ],
      signatureAnimation: 'The visitor illuminates a fragment. A faint line appears. Following the line reveals another fragment.',
    },
    interactionPhysics: {
      model: 'flashlight-excavation',
      cursorBehavior: 'Conical torchlight illumination beam with 260px soft radial radius',
      hoverReaction: 'Stone texture brightens under spotlight; hidden white epigraphy illuminates',
      activeReaction: 'Chisel stroke activates; topographic contours radiate outward across rock face',
      settleBehavior: 'Subterranean inertia with deep stone damping',
    },
    transitionGrammar: {
      mode: 'strata-fracture',
      departurePhenomenon: 'Cavern lantern dims; rock strata fissure into geometric grid lines',
      arrivalPhenomenon: 'A beam of light pierces dark stone, illuminating new architectural foundations',
      specificHandoffs: {
        karigara: 'Stone strata split along a chisel line, revealing wooden timber ribs and workshop clamps.',
      },
    },
    lightingBehaviour: {
      model: 'cursor-illumination-beam',
      description: 'Dynamic cursor-driven flashlight beam penetrating total dark mineral shadow; 0% ambient outside torch',
    },
    environmentBehaviour: {
      spatialStructure: 'Subterranean archaeological pit with layered depth planes and chiselled rock niches',
      backgroundField: 'Rough slate textures with etched survey elevation contours',
      reactiveElements: ['petroglyph-markers', 'torchlight-cone', 'contour-lines', 'strata-depth-markers'],
    },
    projectRevealBehaviour: {
      revealStyle: 'torchlight-excavation-reveal',
      transformationSteps: ['Darkness Holds Relic', 'Torch Illuminates Strata', 'Survey Contours Connect', 'Epigraph Decodes into Case Study'],
      description: 'Projects are uncovered from beneath rock layers rather than browsed',
    },
  },

  // 3. KARIGARA — The Craftsperson / The Workshop
  karigara: {
    lawOfReality: 'Objects assemble',
    motionPrinciple: 'ASSEMBLE',
    visualLanguage: {
      colors: ['#C2410C', '#E6D5B8', '#27272A', '#312E81', '#71717A'],
      typography: ['Syne', 'JetBrains Mono', 'Plus Jakarta Sans'],
      textures: ['sawdust-grain', 'machined-brass', 'chiseled-teak', 'blueprint-grid'],
      imagery: ['exploded-joinery-diagrams', 'bench-clamps', 'hand-filed-brackets', 'saw-guides'],
      paletteNames: ['Terracotta', 'Sawdust Beige', 'Charcoal', 'Indigo', 'Oxidised Metal'],
      atmosphereNotes: 'Intensely tactile workshop. Construction marks, unfinished surfaces, making is visible.',
    },
    materialLanguage: {
      primaryMaterials: ['seasoned-sheesham-timber', 'threaded-brass-screws', 'raw-cotton-twine', 'cold-rolled-steel'],
      surfaceTextures: ['hand-planed-wood-curls', 'sawdust-dusted-slate', 'scribed-measurement-lines', 'oiled-tool-steel'],
      culturalSubstrates: ['Traditional Indian carpenter guilds (sutradhars)', 'vernacular joinery (khatam)', 'toolmaking'],
      artefactForm: 'Exploded interlocking timber prototype awaiting final pin',
      sensoryTouch: 'Crisp wooden snap, mechanical thread friction, weighted solid timber heft',
    },
    motionGrammar: {
      principle: 'ASSEMBLE',
      speedScale: 'elastic-snappy',
      keyBehaviors: [
        'Dismantled component blocks snap into interlocking mortise-and-tenon joints',
        'Threaded brass screws turn and cinch down with mechanical spring tension',
        'Paper templates fold along scored creaselines to construct 3D forms',
        'Objects assemble as the visitor approaches and loosen when neglected',
        'Measurement callouts and cut lines pulse into alignment during inspection',
      ],
      signatureAnimation: 'Project fragments physically assemble from loose workshop pieces into the completed work.',
    },
    interactionPhysics: {
      model: 'mechanical-joinery',
      cursorBehavior: 'Calibrated brass caliper / scribe with alignment crosshairs',
      hoverReaction: 'Component parts snap 14px toward mutual joinery axis with mechanical spring click',
      activeReaction: 'Full assembly sequence triggers; dowels seat, clamp tightens, artefact stabilizes',
      settleBehavior: 'Solid wooden mechanical lock with zero overshoot',
    },
    transitionGrammar: {
      mode: 'component-disassembly',
      departurePhenomenon: 'Pins unlock; timber ribs disassemble into loose workshop stock',
      arrivalPhenomenon: 'Loose workshop parts fly into place, assembling the new world substrate',
      specificHandoffs: {
        tantuvid: 'A loose thread from the workshop is pulled. It stretches across the screen. It becomes one of the threads of the Loom.',
      },
    },
    lightingBehaviour: {
      model: 'tactile-workshop-warmth',
      description: 'Directional workbench clamp lamps casting crisp mechanical shadows over sawdust and timber edges',
    },
    environmentBehaviour: {
      spatialStructure: 'Workbench grid with pegboard mounting holes and magnetic tool rails',
      backgroundField: 'Warm sawdust beige with faint carpenter pencil scribes and metric mm-grids',
      reactiveElements: ['screws-turning', 'clamps-locking', 'timber-tabs', 'joinery-pins'],
    },
    projectRevealBehaviour: {
      revealStyle: 'physical-assembly-sequence',
      transformationSteps: ['Scattered Stock Pieces', 'Pins Align', 'Interlocking Snap', 'Finished Prototype Manifests'],
      description: 'The work constructs itself physically in front of the visitor before opening into documentation',
    },
  },

  // 4. KATHAKA — The Teller of Stories / The Kathā Courtyard
  kathaka: {
    lawOfReality: 'Spaces narrate',
    motionPrinciple: 'NARRATE',
    visualLanguage: {
      colors: ['#B45309', '#F5F5F0', '#9A3412', '#1E293B', '#FBBF24'],
      typography: ['Cormorant Garamond', 'Plus Jakarta Sans', 'Syne'],
      textures: ['faded-limewash', 'sunbaked-terracotta', 'indigo-shadow', 'gauze-curtain'],
      imagery: ['pata-chitra-panels', 'curtain-shadows', 'courtyard-doorways', 'folk-performance-props'],
      paletteNames: ['Terracotta Walls', 'Faded Limewash', 'Textile Canopies', 'Deep Blue Shadows', 'Warm Evening Light'],
      atmosphereNotes: 'Warm storytelling courtyard. Scenes, objects and moments rather than portfolio thumbnails.',
    },
    materialLanguage: {
      primaryMaterials: ['sunbaked-clay-tiles', 'chanderi-gauze-canopies', 'limewashed-stone', 'brass-ghungroos'],
      surfaceTextures: ['flaking-mineral-pigment', 'cracked-clay-pavers', 'shadow-dappled-plaster', 'sheer-draped-muslin'],
      culturalSubstrates: ['Indian courtyard theatre (akharas)', 'Pata-chitra scroll narrators', 'evening chaupal gatherings'],
      artefactForm: 'Framed theatrical scene aperture with layered fabric scrims',
      sensoryTouch: 'Soft billowing cotton, warm baked clay, rustling curtain hem',
    },
    motionGrammar: {
      principle: 'NARRATE',
      speedScale: 'flowing-continuous',
      keyBehaviors: [
        'Translucent fabric curtains billow gently across courtyard thresholds',
        'Deep blue shadows lengthen and shift, revealing hidden story scenes',
        'Photographic fragments seamlessly crossfade into illustrated storytelling spreads',
        'Stepping through an opening reveals another act of the spatial narrative',
        'Sequential story vignettes unfold in continuous panorama rather than separate pages',
      ],
      signatureAnimation: 'The visitor enters a doorway. The doorway does not lead to a new webpage. Instead, the courtyard subtly transforms into another scene.',
    },
    interactionPhysics: {
      model: 'theatrical-scrim',
      cursorBehavior: 'Warm lantern glow casting elongated shadows',
      hoverReaction: 'Muslin curtain parts 40px; courtyard scene shifts from dusk to golden twilight',
      activeReaction: 'Doorway aperture deepens; surrounding courtyard walls transform into the project arena',
      settleBehavior: 'Gentle textile swaying with natural wind damping',
    },
    transitionGrammar: {
      mode: 'courtyard-transform',
      departurePhenomenon: 'Canopies billow outward; evening shadows fold courtyard walls into a single doorway',
      arrivalPhenomenon: 'The doorway opens into a new horizon, scenery resolving as the curtains settle',
      specificHandoffs: {
        yatri: 'A courtyard doorway becomes the opening of a moving caravan.',
      },
    },
    lightingBehaviour: {
      model: 'evening-shadow-canopy',
      description: 'Warm golden hour sunlight filtering through billowing canopies, casting long indigo shadows',
    },
    environmentBehaviour: {
      spatialStructure: 'Open-air quadrangle with stepped plinths, curtain arches, and theatrical perspective',
      backgroundField: 'Sun-warmed limewash plaster with subtle mineral pigment staining',
      reactiveElements: ['swaying-canopies', 'shifting-shadows', 'framing-doorways', 'narrative-panels'],
    },
    projectRevealBehaviour: {
      revealStyle: 'scenic-courtyard-transition',
      transformationSteps: ['Curtain Parts', 'Shadow Deepens', 'Scene Metamorphosis', 'Act Unfolds'],
      description: 'A new project is entering another dramatic scene in the courtyard',
    },
  },

  // 5. TANTUVID — Weaver of Systems / The Loom
  tantuvid: {
    lawOfReality: 'Everything is connected',
    motionPrinciple: 'CONNECT',
    visualLanguage: {
      colors: ['#090A0F', '#F59E0B', '#06B6D4', '#EF4444', '#F8FAFC'],
      typography: ['JetBrains Mono', 'Syne', 'Plus Jakarta Sans'],
      textures: ['taut-silk-threads', 'reed-heeddle-lines', 'tensioned-warp', 'dark-void'],
      imagery: ['jacquard-loom-matrices', 'thread-intersections', 'system-cartographies', 'harmonic-vibrations'],
      paletteNames: ['Void Dark', 'Luminous Saffron', 'Electric Cyan', 'Crimson Warp', 'Raw Silk Weft'],
      atmosphereNotes: 'Extremely restrained. Dark backgrounds, luminous threads, warp/weft geometry. Structural.',
    },
    materialLanguage: {
      primaryMaterials: ['high-tension-silk-filament', 'polished-ebony-reed', 'steel-heeddle-wires', 'counterweight-brass'],
      surfaceTextures: ['hair-thin-luminous-lines', 'tight-warp-lattice', 'crimped-weft-intersections', 'knotted-junctions'],
      culturalSubstrates: ['Varanasi silk handloom matrices', 'Tantra (literally: loom/system)', 'network topology'],
      artefactForm: 'Luminous warp/weft intersection node tensioned by catenary thread lines',
      sensoryTouch: 'Plucked string resonance, taut elastic resistance, harmonic vibration',
    },
    motionGrammar: {
      principle: 'CONNECT',
      speedScale: 'elastic-snappy',
      keyBehaviors: [
        'Luminous thread lines span between project nodes like taut warp strings',
        'Hovering or dragging one node transmits a physical harmonic wave through all connected threads',
        'Tension ripples throughout the loom, gently tilting and pulling adjacent project nodes',
        'Complex system connections emerge into brightness as tension increases',
        'Threads split, merge, cross, and cinch down with mathematical precision',
      ],
      signatureAnimation: 'Touch one project. Its thread travels through the entire loom. Related projects gently move in response.',
    },
    interactionPhysics: {
      model: 'taut-thread-network',
      cursorBehavior: 'Weaver’s shuttle tip with dynamic thread-attraction field',
      hoverReaction: 'Plucks the intersecting thread: harmonic sinusoidal vibration ripples across loom',
      activeReaction: 'Tension snaps taut; related project nodes draw 30px closer along warp diagonals',
      settleBehavior: 'Harmonic dampening with standing wave decay',
    },
    transitionGrammar: {
      mode: 'thread-travel',
      departurePhenomenon: 'All warp threads tighten simultaneously into a single blinding linear filament',
      arrivalPhenomenon: 'The single filament splits into the spatial grid of the arriving world',
      specificHandoffs: {
        bhutika: 'The luminous thread relaxes its tension, dropping to earth and turning into a green root.',
      },
    },
    lightingBehaviour: {
      model: 'luminous-thread-glow',
      description: 'Total black void illuminated exclusively by self-luminous electroluminescent threads and laser nodes',
    },
    environmentBehaviour: {
      spatialStructure: 'Infinite dark loom matrix with structural warp/weft axes and suspended junction nodes',
      backgroundField: 'Deep midnight void with microscopic grid registration marks',
      reactiveElements: ['vibrating-threads', 'counterweight-nodes', 'tension-indicators', 'warp-heeddles'],
    },
    projectRevealBehaviour: {
      revealStyle: 'harmonic-thread-unfurling',
      transformationSteps: ['Thread Plucked', 'Tension Wave Propagates', 'Network Tightens', 'System Node Opens'],
      description: 'Projects exist as structural knots inside a singular vast living loom',
    },
  },

  // 6. BHUTIKA — Of Matter / The Material Garden
  bhutika: {
    lawOfReality: 'Materials respond',
    motionPrinciple: 'FORM',
    visualLanguage: {
      colors: ['#9A3412', '#475569', '#15803D', '#E2D9C8', '#3F2E1E'],
      typography: ['Playfair Display', 'Plus Jakarta Sans', 'Cormorant Garamond'],
      textures: ['raw-clay', 'cracked-slate', 'veined-leaf', 'absorbent-khadi-paper'],
      imagery: ['petrified-specimens', 'pigment-cakes', 'terracotta-impressions', 'geological-fossils'],
      paletteNames: ['Clay Red', 'Stone Slate', 'Leaf Green', 'Raw Paper', 'Earth Brown'],
      atmosphereNotes: 'Tactile enough to touch. Material archive + landscape. No glossy artificial polish.',
    },
    materialLanguage: {
      primaryMaterials: ['wet-terracotta-clay', 'quarried-river-stone', 'pressed-botanical-leaves', 'handmade-lokta-paper'],
      surfaceTextures: ['tactile-fingerprints-in-clay', 'fissured-rock-facets', 'cellulose-paper-deckle', 'leaf-skeleton-veins'],
      culturalSubstrates: ['Kumartuli clay sculptors', 'Indian natural mineral pigments (geru, neel)', 'Ayurvedic dravyas'],
      artefactForm: 'Embedded clay tablet and mineral stone slab containing raw specimens',
      sensoryTouch: 'Pliant clay give, rough stone friction, dry paper rustle, damp earth cool',
    },
    motionGrammar: {
      principle: 'FORM',
      speedScale: 'gradual-organic',
      keyBehaviors: [
        'Hovering over paper creates authentic tactile curling and paper rustle',
        'Dragging clay elements physically stretches and deforms the pliant material',
        'Clicking stone triggers micro-fissures that crack open to reveal embedded insights',
        'Botanical leaf elements flutter with organic wind and re-orient toward visitor presence',
        'Materials slowly re-form and settle back to their natural resting equilibrium',
      ],
      signatureAnimation: 'A material changes state instead of simply revealing a page.',
    },
    interactionPhysics: {
      model: 'material-state-response',
      cursorBehavior: 'Sculptor’s finger with pressure-sensitive deformation radius',
      hoverReaction: 'Paper edge curls up 12px; clay yields with plastic displacement contours',
      activeReaction: 'Stone slab fissures with a deep tactile crack; core mineral sample unfolds',
      settleBehavior: 'Viscoelastic gradual recovery to material rest state',
    },
    transitionGrammar: {
      mode: 'material-phase-change',
      departurePhenomenon: 'Clay dissolves into dry pigment powder; stone turns to fine earth',
      arrivalPhenomenon: 'Raw matter condenses from earth dust into solid physical structures',
      specificHandoffs: {
        rupantara: 'Clay begins changing shape. The shape becomes an alchemical object.',
      },
    },
    lightingBehaviour: {
      model: 'earth-sunlight',
      description: 'Soft outdoor morning daylight highlighting rough micro-textures and paper grain',
    },
    environmentBehaviour: {
      spatialStructure: 'Terraced organic garden plinths with stone slabs resting in damp earth',
      backgroundField: 'Warm raw unbleached cotton and earthen terrain with natural fiber inclusions',
      reactiveElements: ['stretching-clay', 'cracking-stone', 'rustling-paper', 'floating-leaves'],
    },
    projectRevealBehaviour: {
      revealStyle: 'material-state-fracture',
      transformationSteps: ['Material Touched', 'Tactile Deformation', 'Physical State Change', 'Core Specimen Revealed'],
      description: 'Ideas have physical substance and respond through elemental material reactions',
    },
  },

  // 7. DRASHTA — The Witness / The Observatory
  drashta: {
    lawOfReality: 'Looking changes visibility',
    motionPrinciple: 'OBSERVE',
    visualLanguage: {
      colors: ['#0A0F1D', '#030712', '#D4AF37', '#FFFBEB', '#94A3B8'],
      typography: ['Syne', 'JetBrains Mono', 'Playfair Display'],
      textures: ['machined-brass-astrolabe', 'dark-optical-glass', 'etched-graduations', 'celestial-slate'],
      imagery: ['Jantar-Mantar-instruments', 'reticle-crosshairs', 'parallax-apertures', 'star-declination-tables'],
      paletteNames: ['Midnight Blue', 'Deep Black', 'Observatory Brass', 'Cream Parchment', 'Muted Silver'],
      atmosphereNotes: 'Quiet, precise, slightly uncanny. Astronomical instruments and observatory architecture.',
    },
    materialLanguage: {
      primaryMaterials: ['optical-crown-glass', 'engraved-brass-quadrants', 'honed-black-granite', 'graduated-silver-arcs'],
      surfaceTextures: ['micro-machined-vernier-scales', 'anti-reflective-lens-coatings', 'precision-calibrated-lines', 'matte-slate'],
      culturalSubstrates: ['Jantar Mantar astronomical architecture (Jaipur/Delhi)', 'Siddhantic astronomy', 'sakshi (witness consciousness)'],
      artefactForm: 'Precision circular brass aperture with multi-leaf iris and coordinate reticle',
      sensoryTouch: 'Smooth oiled brass rotation, heavy optical glass clarity, click of vernier detents',
    },
    motionGrammar: {
      principle: 'OBSERVE',
      speedScale: 'slow-contemplative',
      keyBehaviors: [
        'Concentric circular apertures rotate smoothly to align with cursor gaze vector',
        'Telescopic reticles track movement with precision astronomical inertia',
        'Objects become visible and legible only when viewed directly through optical lenses',
        'Zooming reveals deeper semantic information layers rather than simple scale enlargement',
        'Celestial markers rearrange into navigational diagrams when sustained gaze is detected',
      ],
      signatureAnimation: 'The visitor looks at something. The environment notices the gaze. Another layer becomes visible.',
    },
    interactionPhysics: {
      model: 'gaze-tracking-aperture',
      cursorBehavior: 'Precision optical reticle with graduated degree markings and focal crosshairs',
      hoverReaction: 'Brass iris rotates 45deg; optical lens zooms into high-resolution semantic layer',
      activeReaction: 'Aperture locks focus; peripheral coordinates fade as hidden celestial layer resolves',
      settleBehavior: 'Heavy gyroscopic precision damping with zero wobble',
    },
    transitionGrammar: {
      mode: 'aperture-alignment',
      departurePhenomenon: 'Observatory iris contracts to a singular pinpoint star',
      arrivalPhenomenon: 'The pinpoint star expands through a brass telescope into the new world view',
      specificHandoffs: {
        svapnika: 'The brass lens unfocuses into soft moonlit atmospheric haze; gravity slowly releases.',
      },
    },
    lightingBehaviour: {
      model: 'celestial-aperture-focus',
      description: 'Pin-spotlight shafts piercing deep midnight blue, focusing exclusively on observed instruments',
    },
    environmentBehaviour: {
      spatialStructure: 'Monumental stone observatory platform open to the celestial sphere',
      backgroundField: 'Midnight blue with ultra-thin gold meridian lines and declination arcs',
      reactiveElements: ['rotating-apertures', 'tracking-reticles', 'focus-lenses', 'coordinate-vernier'],
    },
    projectRevealBehaviour: {
      revealStyle: 'optical-iris-magnification',
      transformationSteps: ['Gaze Detected', 'Brass Iris Opens', 'Optical Focus Achieved', 'Hidden Layer Disclosed'],
      description: 'Observation changes what can be seen; looking actively alters the reality',
    },
  },

  // 8. SVAPNIKA — Of Dreams / The Floating Room
  svapnika: {
    lawOfReality: 'Gravity is uncertain',
    motionPrinciple: 'DRIFT',
    visualLanguage: {
      colors: ['#0F172A', '#93C5FD', '#C4B5FD', '#F8FAFC', '#FBCFE8'],
      typography: ['Cormorant Garamond', 'Plus Jakarta Sans'],
      textures: ['translucent-silk-muslin', 'suspended-paper', 'lunar-haze', 'subtle-mist'],
      imagery: ['weightless-manuscripts', 'floating-parchment', 'drifting-fragments', 'half-remembered-mirages'],
      paletteNames: ['Moonlit Neutrals', 'Pale Blue', 'Lavender Grey', 'Cream Mist', 'Faded Pink'],
      atmosphereNotes: 'Softest world. Physics and atmosphere, not decorative surrealism. Half-remembered.',
    },
    materialLanguage: {
      primaryMaterials: ['sheer-malmal-muslin', 'unweighted-mulberry-paper', 'floating-silver-dust', 'lunar-glow'],
      surfaceTextures: ['ethereal-semitransparent-veil', 'weightless-deckle-edge', 'blurred-depth-planes', 'hazy-air'],
      culturalSubstrates: ['Svapna (the dream state in Indian philosophy)', 'Mughal night sky paintings', 'somnambulist memory'],
      artefactForm: 'Suspended weightless manuscript sheet hovering in slow ambient air current',
      sensoryTouch: 'Impalpable air resistance, zero-gravity float, soft breath displacement',
    },
    motionGrammar: {
      principle: 'DRIFT',
      speedScale: 'slow-contemplative',
      keyBehaviors: [
        'All project artefacts levitate with continuous slow gravitational drift',
        'Cursor movements create gentle air turbulence currents that push or draw objects',
        'Hovered artefacts drift slowly toward the visitor like half-remembered thoughts',
        'Neglected artefacts slowly recede into soft atmospheric lavender haze',
        'Waking one object sends a subtle gravitational ripple that nudges nearby items',
      ],
      signatureAnimation: 'The entire room gently changes gravitational direction as the visitor navigates.',
    },
    interactionPhysics: {
      model: 'zero-gravity-buoyancy',
      cursorBehavior: 'Gentle air-current disturbance emitter with viscous aerodynamic drag',
      hoverReaction: 'Suspended artefact drifts 35px closer and tilts -3deg along buoyancy axis',
      activeReaction: 'Room gravity tilts 5deg; surrounding floating artefacts slowly orbit the selected dream',
      settleBehavior: 'Fluid laminar drift with almost zero friction damping',
    },
    transitionGrammar: {
      mode: 'gravitational-dissolve',
      departurePhenomenon: 'Air currents accelerate; room dissolves into swirling lavender paper dust',
      arrivalPhenomenon: 'Floating particles gently coalesce and settle onto physical ground',
      specificHandoffs: {
        smritika: 'A floating photograph slowly settles onto a desk. The desk becomes an archival table.',
      },
    },
    lightingBehaviour: {
      model: 'moonlit-haze',
      description: 'Diffused cool lunar light scattering softly through multiple semi-transparent depth layers',
    },
    environmentBehaviour: {
      spatialStructure: 'Deep three-dimensional floating chamber with no distinct floor or ceiling',
      backgroundField: 'Layered atmospheric mist in pale blue and lavender with drifting dust motes',
      reactiveElements: ['floating-papers', 'air-turbulence-wakes', 'weightless-artefacts', 'lunar-shimmer'],
    },
    projectRevealBehaviour: {
      revealStyle: 'buoyant-approach-and-clarity',
      transformationSteps: ['Object Drifts in Mist', 'Visitor Nudges Current', 'Artefact Floats Forward', 'Dream Crystallizes'],
      description: 'The environment is half-remembered, floating into focus through gentle attention',
    },
  },

  // 9. JIGNASU — The Curious One / The Question Archive
  jignasu: {
    lawOfReality: 'Questions reorganise reality',
    motionPrinciple: 'REARRANGE',
    visualLanguage: {
      colors: ['#F8FAFC', '#09090B', '#DC2626', '#2563EB', '#F59E0B'],
      typography: ['JetBrains Mono', 'Playfair Display', 'Plus Jakarta Sans'],
      textures: ['dense-whiteboard', 'ruled-index-paper', 'highlighter-streak', 'ballpoint-ink'],
      imagery: ['wall-of-questions', 'interrogative-constellations', 'bracketed-theorems', 'annotated-taxonomies'],
      paletteNames: ['Clean Off-White', 'Ink Black', 'Red Annotation', 'Blue Question', 'Curiosity Amber'],
      atmosphereNotes: 'Visually obsessive. A researcher’s mind externalised. Dense but highly organised.',
    },
    materialLanguage: {
      primaryMaterials: ['high-contrast-index-cards', 'felt-tip-annotation-ink', 'red-surveyor-tape', 'graph-paper'],
      surfaceTextures: ['dense-ink-bleed-lines', 'micro-typewriter-serifs', 'circled-inquiry-rings', 'stacked-card-edges'],
      culturalSubstrates: ['Jijñāsā (the burning desire to know in Upanishadic inquiry)', 'scholarly debate (vāda)', 'field notebooks'],
      artefactForm: 'Tightly indexed card constellation surrounded by radiating interrogative arrows',
      sensoryTouch: 'Sharp paper flick, click of ballpoint pen, brisk index sorting speed',
    },
    motionGrammar: {
      principle: 'REARRANGE',
      speedScale: 'elastic-snappy',
      keyBehaviors: [
        'Thousands of miniature questions continuously re-cluster according to active curiosity',
        'Selecting one question causes related inquiries to gravitate toward it in real time',
        'Hovering an inquiry ripples tension across its semantic cluster',
        'Temporary inquiry constellations form dynamic connective pathways',
        'The entire archive structure dynamically reorganises itself around the active query',
      ],
      signatureAnimation: 'One question is selected. Hundreds of other questions reorganise themselves around it.',
    },
    interactionPhysics: {
      model: 'force-directed-curiosity-flocking',
      cursorBehavior: 'Magnetic query needle with semantic attraction pull',
      hoverReaction: 'Question card snaps 15px forward; satellite inquiries draw closer by 20%',
      activeReaction: 'Full archive reorganises: unselected questions re-orbit into new systemic clusters',
      settleBehavior: 'Snappy spring settling with elastic rebound',
    },
    transitionGrammar: {
      mode: 'constellation-rearrangement',
      departurePhenomenon: 'Question cards collapse inward into a single high-density point of interrogation',
      arrivalPhenomenon: 'The inquiry point explodes outward into the structured space of the arriving world',
      specificHandoffs: {
        drashta: 'A question becomes a point of light. The point becomes a star. The visitor enters the Observatory.',
      },
    },
    lightingBehaviour: {
      model: 'harsh-research-incandescent',
      description: 'High-contrast bright white archival lighting with sharp typographic clarity across cards',
    },
    environmentBehaviour: {
      spatialStructure: 'Infinite floor-to-ceiling modular question grid with elastic semantic connection cords',
      backgroundField: 'Clean off-white drafting surface with subtle millimeter graph rules',
      reactiveElements: ['question-cards', 'semantic-cluster-nodes', 'annotated-arrows', 'inquiry-pins'],
    },
    projectRevealBehaviour: {
      revealStyle: 'interrogative-constellation-clustering',
      transformationSteps: ['Question Posed', 'Satellites Converge', 'Constellation Locks', 'Case Dossier Emerges'],
      description: 'Curiosity creates structure; asking reorganises the universe of information',
    },
  },

  // 10. YATRI — The Traveller / The Caravan
  yatri: {
    lawOfReality: 'The world moves',
    motionPrinciple: 'TRAVEL',
    visualLanguage: {
      colors: ['#A16207', '#D97706', '#991B1B', '#312E81', '#FEF3C7'],
      typography: ['Playfair Display', 'Plus Jakarta Sans', 'JetBrains Mono'],
      textures: ['dusty-canvas', 'worn-leather-strap', 'stamped-ticket', 'sun-bleached-wood'],
      imagery: ['itinerary-waypoint-maps', 'railway-stamps', 'luggage-tags', 'road-elevation-profiles'],
      paletteNames: ['Dusty Road Ochre', 'Desert Sun', 'Faded Bus Red', 'Indigo Horizon', 'Parchment Ticket'],
      atmosphereNotes: 'Kinetic. Moving archive. The portfolio is a journey, not a destination.',
    },
    materialLanguage: {
      primaryMaterials: ['heavy-waxed-cotton-canvas', 'tanned-saddle-leather', 'perforated-ticket-paper', 'brass-trunk-latches'],
      surfaceTextures: ['dust-caked-fabric', 'weathered-odometer-dials', 'rubber-stamp-ink', 'creased-topographic-maps'],
      culturalSubstrates: ['Indian Railways journey culture', 'Himalayan caravan routes', 'nomadic pack architecture (jholas)'],
      artefactForm: 'Travel trunk crate with stamped route permits and tied field bundles',
      sensoryTouch: 'Heavy canvas drag, clicking odometer, creaking carriage wood, gritty road dust',
    },
    motionGrammar: {
      principle: 'TRAVEL',
      speedScale: 'kinetic-travel',
      keyBehaviors: [
        'A continuous distant horizon line slowly shifts and scrolls with visitor movement',
        'Survey map lines dynamically draw themselves between geographic waypoints',
        'Suspended travel artefacts sway with rhythmic momentum as if in a moving vehicle',
        'Scrolling acts as forward geographic propulsion along an itinerary',
        'Projects are picked up, packed into travelling trunks, and unloaded at destination stops',
      ],
      signatureAnimation: 'A project is picked up and packed into the caravan. The caravan moves to the next project.',
    },
    interactionPhysics: {
      model: 'moving-carriage-momentum',
      cursorBehavior: 'Compass needle tracking heading and travel velocity',
      hoverReaction: 'Luggage tag flutters in road wind; brass trunk latch clicks open 15px',
      activeReaction: 'Caravan accelerates; horizon shifts forward and project unfolds from travel pack',
      settleBehavior: 'Heavy rolling carriage momentum with road-sway inertia',
    },
    transitionGrammar: {
      mode: 'road-horizon-shift',
      departurePhenomenon: 'Caravan packs up; dust clouds sweep across the shifting road horizon',
      arrivalPhenomenon: 'The vehicle halts at a new geographic station; trunk doors swing open',
      specificHandoffs: {
        sangati: 'The travelling caravan arrives in the center of the town square, unpacking into the Commons.',
      },
    },
    lightingBehaviour: {
      model: 'open-road-dust',
      description: 'Warm afternoon highway sun with golden atmospheric dust haze and moving wheel shadows',
    },
    environmentBehaviour: {
      spatialStructure: 'Continuous linear highway panorama with moving horizon and road mile markers',
      backgroundField: 'Warm dusty ochre and desert canvas textures with route contour lines',
      reactiveElements: ['swaying-lanterns', 'odometer-counters', 'route-traces', 'luggage-tags'],
    },
    projectRevealBehaviour: {
      revealStyle: 'caravan-trunk-unpacking',
      transformationSteps: ['Stop Reached', 'Trunk Unlatched', 'Bundles Unrolled', 'Field Relic Documented'],
      description: 'The work is a moving archive encountered along an ongoing geographic expedition',
    },
  },

  // 11. SANGATI — One Who Creates Connection / The Commons
  sangati: {
    lawOfReality: 'Objects respond socially',
    motionPrinciple: 'INTERACT',
    visualLanguage: {
      colors: ['#EA580C', '#78350F', '#0284C7', '#16A34A', '#F8FAFC'],
      typography: ['Syne', 'Plus Jakarta Sans', 'JetBrains Mono'],
      textures: ['layered-wheatpaste-posters', 'cork-noticeboard', 'torn-paper-edges', 'chalked-brick'],
      imagery: ['public-square-broadsheets', 'community-notices', 'hand-stenciled-placards', 'overlapping-announcements'],
      paletteNames: ['Poster Vermilion', 'Noticeboard Wood', 'Public Chalk Blue', 'Park Bench Green', 'Wall Plaster'],
      atmosphereNotes: 'Open public square. Multiple visual voices, overlapping information. Public visual culture.',
    },
    materialLanguage: {
      primaryMaterials: ['wheatpasted-newsprint', 'cork-and-timber-noticeboard', 'painted-tin-placards', 'coloured-chalk'],
      surfaceTextures: ['torn-weathered-poster-layers', 'overlapping-paper-crinkles', 'drawing-pin-punctures', 'distressed-brick'],
      culturalSubstrates: ['Indian street wall posters (chiththi)', 'panchayat noticeboards', 'chai stall debate corners'],
      artefactForm: 'Layered public broadsheet pinned to collective community noticeboard',
      sensoryTouch: 'Crinkled newsprint texture, cork pin resistance, tactile paper flutter',
    },
    motionGrammar: {
      principle: 'INTERACT',
      speedScale: 'elastic-snappy',
      keyBehaviors: [
        'Posters overlap dynamically with realistic layered physical paper depth',
        'New information gently nudges older posters aside to find room on the wall',
        'Visitor interaction with one project causes neighboring notices to perk up and turn',
        'Multiple objects maintain simultaneous animated awareness of visitor cursor',
        'Social proximity dictates attraction or avoidance between neighboring elements',
      ],
      signatureAnimation: 'Visitor interacts with one project. Nearby projects notice. They rearrange themselves around it.',
    },
    interactionPhysics: {
      model: 'social-proximity-clustering',
      cursorBehavior: 'Community notice pin with radial social influence aura',
      hoverReaction: 'Notice peels forward 20px; neighboring posters lean away respectfully by 8deg',
      activeReaction: 'Notice pins to the collective center; surrounding flyers gather in a social ring',
      settleBehavior: 'Flapping paper settle with communal spring damping',
    },
    transitionGrammar: {
      mode: 'poster-peel-transition',
      departurePhenomenon: 'Noticeboard flyers flutter in a sudden wind; layers peel back to reveal base wall',
      arrivalPhenomenon: 'Fresh broadsheets paste themselves across the masonry, establishing the new world',
      specificHandoffs: {
        kathaka: 'A poster peels from the Commons wall. Its surface becomes the wall of the Courtyard.',
      },
    },
    lightingBehaviour: {
      model: 'public-daylight',
      description: 'Lively bustling civic daylight with crisp paper shadows and vibrant multi-poster contrast',
    },
    environmentBehaviour: {
      spatialStructure: 'Tiered public plaza wall with layered bulletin kiosks and civic message boards',
      backgroundField: 'Warm sunlit brick and weathered plaster with fragments of past announcements',
      reactiveElements: ['peeling-posters', 'social-clusters', 'chalk-annotations', 'pinboard-tacks'],
    },
    projectRevealBehaviour: {
      revealStyle: 'communal-broadsheet-unfolding',
      transformationSteps: ['Broadsheet Pinned', 'Crowd Notices Gather', 'Social Cluster Formed', 'Manifesto Unfolds'],
      description: 'Meaning emerges between things; projects are public conversations in relationship',
    },
  },

  // 12. SEVIKA — One Who Tends / The Healing Garden
  sevika: {
    lawOfReality: 'Attention produces growth',
    motionPrinciple: 'GROW',
    visualLanguage: {
      colors: ['#064E3B', '#78350F', '#FEF3C7', '#042F2E', '#A7F3D0'],
      typography: ['Cormorant Garamond', 'Plus Jakarta Sans'],
      textures: ['dappled-pool-water', 'smooth-river-pebble', 'living-moss', 'handwritten-field-diary'],
      imagery: ['herbal-botanical-plates', 'water-concentric-ripples', 'medicinal-root-systems', 'shaded-stone-cisterns'],
      paletteNames: ['Deep Forest Green', 'Muted Earth', 'Warm Cream', 'Shaded Water', 'Tender Shoot Mint'],
      atmosphereNotes: 'Quiet and sophisticated. Not stereotypical wellness. Attention produces growth.',
    },
    materialLanguage: {
      primaryMaterials: ['smooth-river-stone', 'still-cistern-water', 'living-medicinal-ferns', 'damp-loamy-earth'],
      surfaceTextures: ['water-surface-tension', 'cool-slate-patina', 'velveteen-moss-cushions', 'fibrous-root-veins'],
      culturalSubstrates: ['Ayurvedic medicinal herb gardens (aushadh vana)', 'temple step-cisterns (kalyani)', 'seva practices'],
      artefactForm: 'Submerged stone votive basin ringed by sprouting medicinal shoots',
      sensoryTouch: 'Cool liquid ripple, soft damp moss give, gentle botanical uncurling',
    },
    motionGrammar: {
      principle: 'GROW',
      speedScale: 'slow-contemplative',
      keyBehaviors: [
        'Water surfaces respond to presence with concentric fluid ripples that expand outward',
        'Botanical shoots and ferns slowly unfurl and grow taller with sustained attention',
        'Neglected projects do not die—they quietly become quieter and rest in calm shade',
        'Stone pathways slowly illuminate their course as the visitor pauses and lingers',
        'Environmental changes accumulate gently over time through caring engagement',
      ],
      signatureAnimation: 'Repeated engagement causes an environment element to slowly grow.',
    },
    interactionPhysics: {
      model: 'organic-botanical-accumulation',
      cursorBehavior: 'Gentle droplet creator generating expanding water ripple rings',
      hoverReaction: 'Water rings emanate 360deg; nearby fern fronds uncurl 25% toward the presence',
      activeReaction: 'Sustained presence causes botanical shoots to bloom, releasing project seeds',
      settleBehavior: 'Viscous water surface tension with gentle liquid decay',
    },
    transitionGrammar: {
      mode: 'root-submersion',
      departurePhenomenon: 'Water ripples into quiet stillness; green roots withdraw gently into damp loam',
      arrivalPhenomenon: 'Fresh water springs from stone fissures, nourishing the arriving landscape',
      specificHandoffs: {
        bhutika: 'A growing root travels beneath the ground. The soil becomes visible. The visitor emerges into the Material Garden.',
      },
    },
    lightingBehaviour: {
      model: 'dappled-pool-shade',
      description: 'Cool dappled shade with dancing water caustics reflected onto quiet stone walls',
    },
    environmentBehaviour: {
      spatialStructure: 'Enclosed stone medicinal garden centered around a reflective pool and stepped cisterns',
      backgroundField: 'Deep forest green and cool shaded earth with organic moisture gradients',
      reactiveElements: ['water-ripples', 'growing-tendrils', 'blooming-fronds', 'stone-stepping-paths'],
    },
    projectRevealBehaviour: {
      revealStyle: 'botanical-bloom-emergence',
      transformationSteps: ['Seed Lingers in Water', 'Presence Cultivates', 'Shoot Unfurls', 'Fruit of Inquiry Matures'],
      description: 'Projects appear as living things being tended rather than inertly displayed',
    },
  },

  // 13. RUPANTARA — Of Transformation / The Alchemical Chamber
  rupantara: {
    lawOfReality: 'Objects change form',
    motionPrinciple: 'TRANSFORM',
    visualLanguage: {
      colors: ['#1E1B4B', '#030712', '#B45309', '#FAF8F5', '#818CF8'],
      typography: ['Syne', 'Playfair Display', 'JetBrains Mono'],
      textures: ['patinated-copper', 'smoky-quartz', 'charcoal-drafting-paper', 'glowing-filament'],
      imagery: ['alchemical-distillation-coils', 'origami-polyhedra', 'metamorphic-strata', 'transmutation-crucibles'],
      paletteNames: ['Deep Indigo', 'Crucible Black', 'Alchemical Copper', 'Ivory Light', 'Ethereal Violet'],
      atmosphereNotes: 'Material + intentional + magical. SKETCH → OBJECT → IMAGE → MEMORY → STORY → SYSTEM.',
    },
    materialLanguage: {
      primaryMaterials: ['hand-hammered-copper', 'blown-borosilicate-glass', 'rough-graphite-sticks', 'silver-gelatin-plates'],
      surfaceTextures: ['heat-oxidised-copper-patina', 'smoky-glass-translucency', 'folded-creased-paper', 'subtle-smoke-wisps'],
      culturalSubstrates: ['Rasashastra (Indian alchemy / mercury-copper transmutation)', 'Rūpāntara (metamorphic form)', 'dhātu metallurgy'],
      artefactForm: 'Alchemical transmutation vessel holding an object undergoing continuous physical metamorphosis',
      sensoryTouch: 'Warm metallic heat, smooth polished quartz, crisp paper crease fold',
    },
    motionGrammar: {
      principle: 'TRANSFORM',
      speedScale: 'flowing-continuous',
      keyBehaviors: [
        'The fundamental transformation sequence: SKETCH → OBJECT → IMAGE → MEMORY → STORY → SYSTEM',
        'A project never simply opens—it physically mutates through successive material states',
        'A pencil sketch folds along geometric lines into a tangible copper vessel',
        'The copper vessel dissolves into a silver photographic plate which crystallizes into a diagram',
        'Every transition is a metamorphosis of the exact same physical artefact',
      ],
      signatureAnimation: 'Every transition is a transformation of the same object.',
    },
    interactionPhysics: {
      model: 'alchemical-metamorphic-morph',
      cursorBehavior: 'Transmutation wand emitting subtle copper sparks and heat distortion',
      hoverReaction: 'Object vibrates along crease lines, cycling between sketch lines and metallic facets',
      activeReaction: 'Transmutation crucible heats up; object morphs seamlessly to its next metamorphic state',
      settleBehavior: 'Crystalline consolidation into new material equilibrium',
    },
    transitionGrammar: {
      mode: 'object-transformation',
      departurePhenomenon: 'The current room folds along origami crease lines into a single geometric polyhedral jewel',
      arrivalPhenomenon: 'The polyhedral jewel unfolds its facets to become the architectural floor of the new world',
      specificHandoffs: {
        mayavin: 'The copper vessel shatters into mirror shards; refractive digital chromatic dispersion takes over.',
      },
    },
    lightingBehaviour: {
      model: 'alchemical-inner-glow',
      description: 'Deep indigo obscurity illuminated by inner copper embers, molten glowing filaments, and subtle smoke',
    },
    environmentBehaviour: {
      spatialStructure: 'Concentric circular alchemical chamber with suspended distillation rings and floating crucibles',
      backgroundField: 'Deep midnight indigo with faint sacred geometry fold lines and ethereal smoke wisps',
      reactiveElements: ['metamorphic-crucible', 'origami-creases', 'copper-embers', 'distillation-coils'],
    },
    projectRevealBehaviour: {
      revealStyle: 'five-stage-alchemical-transmutation',
      transformationSteps: ['Sketch Folds', 'Object Solidifies', 'Photograph Develops', 'System Diagrammanifests'],
      description: 'Nothing stays in one form; projects mutate through continuous material transmutations',
    },
  },
};
