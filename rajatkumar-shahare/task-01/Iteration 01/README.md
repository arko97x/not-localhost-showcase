# Speculative Archive — 9 Speculative Works & Editorial Flip-Book

> An editorial flip-book and spatial showcase of 9 physical-digital research projects and speculative systems by contemporary creators, built in the minimalist, stark monochrome aesthetic of [gilhuybrecht.com](https://gilhuybrecht.com/).

---

## Overview

**Speculative Archive** is a curated web exhibition presenting nine cutting-edge creative technology projects spanning affective computing, counter-surveillance steganography, interspecies bio-cybernetics, archaeological telemetry, satirical biometrics, generative fluid dynamics, cognitive memory compression, spatial virtual commons, and acoustic feedback.

The interface offers two complementary view modes:
1. **Pinned Overview**: A stark 3×3 grid displaying live, animated algorithmic glimpses that faithfully depict each project's core interaction or physical manifestation.
2. **Two-Page Flip-Book Spread**: An open editorial book layout inspired by print monographs:
   - **Left Page**: In-depth curatorial notes, creator credits, research abstracts, engineering methodologies, and one-click GitHub clone snippets.
   - **Right Page**: The actual project converted into a **live, fully interactive HTML prototype** running directly inside the page.

---

## Curated Projects & Live Interactive Modules

| # | Project | Creator | Research Domain | Live Interactive Re-creation |
|---|---|---|---|---|
| **01** | [Freeing the Parrot](https://github.com/msup96/Freeing_The_Parrot) | [@msup96](https://github.com/msup96) | Affective Computing & Machine Ethics | **Navarasa Confession Engine**: Input personal confessions, parse semantic text through 9 classical Indian Rasas, and generate a diagnostic Mirror Report. |
| **02** | [The Scribbler](https://github.com/itsniko18/The-Scribbler) | [@itsniko18](https://github.com/itsniko18) | Counter-Surveillance Steganography | **Calligraphic Glitch Cipher**: Type secret text, calibrate motor tremor and slant distortion sliders, and draw cursive script on canvas while evading simulated OCR. |
| **03** | [Cetacean Translator v1](https://github.com/ideaphoria/cetacean-translator-v1) | [@ideaphoria](https://github.com/ideaphoria) | Interspecies Bio-Cybernetics | **Hydrophone Sonar Station**: Synthesize underwater clicks and whistles via Web Audio API, view real-time FFT waterfall spectrograms, and query the Ollama translation console. |
| **04** | [DACian-era](https://github.com/Lichtzero/DACian-era) | [@Lichtzero](https://github.com/Lichtzero) | Archaeological Telemetry | **Dual-Device RF Tuner**: Sweep radio frequency bands (8–24 MHz) with authentic carrier static, lock onto archaeological nodes, and decode lost telemetry packets. |
| **05** | [Physiognomy Machine](https://github.com/GGhushe/Physiognomy-Profiling-Machine) | [@GGhushe](https://github.com/GGhushe) | Critical AI & Biometric Satire | **NEXUS SCAN Caliper Quest**: Track 3D facial landmark meshes, adjust cranial and jawline calipers, and generate satirical personality dossiers. |
| **06** | [Goldfish ATGravity & Quad Dream](https://github.com/theiniyaaalll-pixel/02_09_2026_GOLDFISH-ATGrvity) | [@theiniyaaalll-pixel](https://github.com/theiniyaaalll-pixel) | Generative Synesthesia & Biophysics | **Fluid Gravity Tank**: Interact with fluid ripples, toggle standard gravity, zero-g drift, or inverted anti-gravity (-1.0G), and trigger pentatonic audio chimes. |
| **07** | [To The Future World: NeuroSpace](https://github.com/Ishita054/To-the-future-world) | [@Ishita054](https://github.com/Ishita054) | Cognitive Memory Architecture | **Synaptic Memory Compression**: Select episodic memories, modulate compression sliders from 1.0x to 16.0x, and observe how subjective nostalgia degrades into sparse mathematical coordinates. |
| **08** | [MMOW (Shared Virtual World)](https://github.com/Haniny/MMOW.git) | [@Haniny](https://github.com/Haniny) | Spatial Network Commons | **Infinite Spatial Commons**: Drag to traverse an open 2D coordinate plane, observe simulated real-time peer vectors, and drop persistent coordinate waypoints. |
| **09** | [Ec-ak-ou](https://github.com/imedhit/Ec-ak-ou.git) | [@imedhit](https://github.com/imedhit) | Phonetic Feedback & Acoustic Decay | **Virtual Resonant Chamber**: Choose acoustic geometries (*Cathedral Gallery, Silo, Duct*), inject spoken syllables (`E-CHO`, `A-KOU`), and hear multi-tap delay reverberation. |

---

## Design System & Aesthetics

- **Minimalist Stark Monochrome**: Deep black background (`#000000`), off-black book pages (`#070707` and `#0b0b0b`), hairline borders (`rgba(255, 255, 255, 0.12)`), and crisp white typographic hierarchy.
- **Typography**: 
  - `Space Grotesk`: Editorial titles and section headers
  - `Inter`: Curatorial prose and documentation
  - `JetBrains Mono`: Telemetry data, coordinates, terminal readouts, and metrics
- **Tactile Audio Engine**: Subtly synthesized mechanical clicks and paper page-turn sounds via the native **Web Audio API** (toggleable via the top navigation bar).
- **Responsive Layout**: Seamlessly transitions from high-resolution two-page spreads down to single-column responsive layouts on mobile devices.

---

## Keyboard Shortcuts & Navigation

| Key / Control | Action |
|---|---|
| **`→` (Right Arrow)** | Turn to next project spread |
| **`←` (Left Arrow)** | Turn to previous project spread |
| **`Escape`** | Close book and return to Pinned Overview |
| **Click Pin Card** | Open Flip-Book spread directly to that project |
| **Bottom Pager Pills (`01`–`09`)** | Jump directly to any project page |
| **`Sound: On / Off`** | Toggle tactile mechanical audio effects |

---

## File Architecture

```
iteration 1/
├── index.html       # Semantic layout (site header, 9-pin grid, 2-page flip-book spread)
├── style.css        # Minimalist design system, typography tokens, grid & interactive styles
├── data.js          # Curated project metadata, research abstracts, and interaction config
├── app.js           # Core engine: 9 animated procedural glimpses, book router & 9 live interactive apps
└── README.md        # Comprehensive project documentation and guide
```

---

## Running Locally

Because this project uses standard ES Modules (`import { PROJECTS } from './data.js'`), run it using any local HTTP server:

### Option 1: Python 3 (Built-in)
```bash
python3 -m http.server 3000
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Option 2: Node.js (npx)
```bash
npx serve .
```

### Option 3: VS Code / IDE
Install the **Live Server** extension and click **"Go Live"**.

---

## Original Repository References

- **Freeing the Parrot**: https://github.com/msup96/Freeing_The_Parrot
- **The Scribbler**: https://github.com/itsniko18/The-Scribbler
- **Cetacean Translator v1**: https://github.com/ideaphoria/cetacean-translator-v1
- **DACian-era**: https://github.com/Lichtzero/DACian-era
- **Physiognomy Profiling Machine**: https://github.com/GGhushe/Physiognomy-Profiling-Machine
- **Goldfish ATGravity & Quad Dream**: https://github.com/theiniyaaalll-pixel/02_09_2026_GOLDFISH-ATGrvity
- **To The Future World: NeuroSpace**: https://github.com/Ishita054/To-the-future-world
- **MMOW**: https://github.com/Haniny/MMOW.git
- **Ec-ak-ou**: https://github.com/imedhit/Ec-ak-ou.git

---

## License

MIT License. Open for educational and speculative archival purposes.
