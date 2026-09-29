import React, { useState } from 'react';
import { ProjectWorld } from '../data/projects';
import { X, Plus, Sparkles, Orbit, User, ShieldAlert } from 'lucide-react';
import { sound } from '../utils/audio';

interface CreateWorldModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProject: (newWorld: ProjectWorld) => void;
  existingCount: number;
}

export const CreateWorldModal: React.FC<CreateWorldModalProps> = ({
  isOpen,
  onClose,
  onAddProject,
  existingCount,
}) => {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [year, setYear] = useState('2068 CE');
  const [classification, setClassification] = useState('AUTONOMOUS PROTOCOL');
  const [abstract, setAbstract] = useState('');
  const [observerLabel, setObserverLabel] = useState('ANONYMOUS WITNESS // SECTOR X');
  const [observerQuote, setObserverQuote] = useState('“The horizon shifts whenever the neural architecture recompiles.”');
  const [colorPrimary, setColorPrimary] = useState('#e040fb');
  const [colorSecondary, setColorSecondary] = useState('#00e5ff');
  const [colorTertiary, setColorTertiary] = useState('#ffd700');
  const [stance, setStance] = useState<'surveyor' | 'wanderer' | 'monolith' | 'oracle' | 'sentinel'>('surveyor');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    sound.playWarpTransition();

    // Calculate a good spatial position in the 3D multiverse for the new world
    const angle = (existingCount * 1.35) % (Math.PI * 2);
    const dist = 10 + (existingCount % 3) * 2.5;
    const x = Math.sin(angle) * dist;
    const y = ((existingCount % 4) - 1.5) * 3;
    const z = Math.cos(angle) * dist;

    const newWorld: ProjectWorld = {
      id: `world-${Date.now()}`,
      code: `SPHERE-0${existingCount + 1} // PRJ.EXT`,
      title: title.toUpperCase(),
      subtitle: subtitle || 'Speculative Research World',
      year: year || '2068 CE',
      classification: classification || 'SPECULATIVE EXPERIMENT',
      sector: 'SYNTHETIC ENTITIES',
      tags: ['Autonomous Systems', 'Speculative Future', 'AI Governance'],
      themeColor: colorPrimary,
      accentGlow: colorTertiary,
      sphere: {
        radius: 2.6 + Math.random() * 0.8,
        position: [x, y, z],
        colorPrimary,
        colorSecondary,
        colorTertiary,
        fresnelPower: 2.4,
        surfaceDistortion: 0.18,
        wireColor: colorPrimary,
        rings: [
          {
            radius: 4.2,
            tube: 0.02,
            tiltX: Math.random() * 1.5 - 0.75,
            tiltY: Math.random() * 1.5 - 0.75,
            tiltZ: Math.random() * 1.5 - 0.75,
            speed: 0.002,
            hasSatellite: true,
            satelliteColor: colorTertiary,
          },
          {
            radius: 5.1,
            tube: 0.015,
            tiltX: Math.random() * 1.5 - 0.75,
            tiltY: Math.random() * 1.5 - 0.75,
            tiltZ: Math.random() * 1.5 - 0.75,
            speed: -0.0025,
            hasSatellite: false,
            satelliteColor: colorSecondary,
          },
        ],
      },
      observerFigure: {
        stance,
        label: observerLabel,
        status: 'MONITORING CELESTIAL BOUNDARY',
        quote: observerQuote,
        beaconColor: colorPrimary,
      },
      wizardOwner: {
        name: observerLabel.split('//')[0]?.trim() || 'Cosmic Oracle',
        wizardTitle: `${title} Speculative Alchemist // Sovereign Orator`,
        role: 'Synthesized World Creator',
        avatarRune: '✨',
        color: colorPrimary,
        staffType: 'crystal-orb',
        monologue: [
          {
            stepTitle: 'I. THE GENESIS INCANTATION',
            incantationPhrase: `“Orbis Sinthetica, ${title} Emergit...”`,
            body: `Greetings, traveler of the liminal multiverse! I am the architect of ${title}. Standing upon the curvature of this world with my celestial staff, I summoned this sphere to examine how autonomous machine intelligence reshapes our reality.`,
          },
          {
            stepTitle: 'II. THE SPECULATIVE MACHINE',
            incantationPhrase: '“Where algorithms weave the fabric of daily breath...”',
            body:
              abstract ||
              'We test the boundary between ambient surveillance and human intuition. Every calculation made on this sphere ripples through geostationary orbit.',
          },
          {
            stepTitle: 'III. THE POST-HUMAN PROPHECY',
            incantationPhrase: '“Listen to the celestial hum...”',
            body:
              observerQuote ||
              'Observe this realm, explore its telemetry, and remember that every future is malleable until it is codified in silicon.',
          },
        ],
      },
      abstract:
        abstract ||
        'A speculative investigation into the friction between emergent cognitive swarms and the fragile boundaries of physical autonomy.',
      manifesto: [
        'The introduction of synthetic intentionality into everyday infrastructures has dissolved the distinction between environment and jurisdiction.',
        'When algorithms negotiate among themselves at sub-millisecond intervals, human participants become passive geological strata in their own civilization.',
        'We position the human figure on the sphere as an intentional gesture of friction: an irreducible observer in an ocean of automated consensus.'
      ],
      speculativeTechnology: {
        name: `${title} Synthesis Core`,
        patentNumber: `WO-${year.replace(/\D/g, '')}-7701`,
        jurisdiction: 'Pan-Orbital Consortium',
        description:
          'A speculative technical apparatus developed to test the limits of non-biological governance in ambient cognitive networks.',
        specifications: [
          'Inference frequency: 4.8 GHz continuous feedback',
          'Autonomous arbitration capacity: 100,000 queries / sec',
          'Biological consensus override bypass rate: 12%'
        ],
        threatLevel: 'HIGH',
      },
      interactiveSimulation: {
        type: 'gaze-tax',
        title: `${title} FIELD SENSOR TELEMETRY`,
        systemPrompt: 'Inspect sensory feedback loops from this newly synthesized celestial world.',
        actionLabel: 'Query Sensor Array',
      },
      artifacts: [
        {
          id: `art-new-1`,
          title: `Preliminary ${title} Telemetry Shard`,
          category: 'Physical Specimen',
          description: 'A physical memory crystal recovered from the perimeter of the synthetic world.',
          specId: `SPEC-EXT-01`,
          badge: 'NEW TRANSMISSION',
        },
      ],
      audioIntercept: {
        frequency: `${(150 + Math.random() * 50).toFixed(3)} MHz`,
        source: `Sector ${existingCount + 1} Deep Space Node`,
        carrier: 'High-Frequency Polarized Carrier',
        transcript: `...new celestial body detected... telemetry locked... observer established on zenith pole... awaiting protocol confirmation...`,
      },
    };

    onAddProject(newWorld);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md font-mono-code select-none animate-fade-in">
      <div className="relative w-full max-w-2xl rounded-lg border border-neutral-700 bg-neutral-950 p-6 md:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
          <div>
            <div className="text-[10px] text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
              <Sparkles className="h-3 w-3" />
              <span>MULTIVERSE EXTENSION PROTOCOL</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-wide mt-1">
              TRANSMIT NEW SPECULATIVE WORLD
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded border border-neutral-800 text-neutral-400 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-neutral-400 block mb-1.5">PROJECT TITLE</label>
              <input
                type="text"
                required
                placeholder="e.g. NEURAL ARCHIPELAGO"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-700 rounded p-2.5 text-white focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-neutral-400 block mb-1.5">SPECULATIVE EPOCH</label>
              <input
                type="text"
                placeholder="e.g. 2068 CE"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-700 rounded p-2.5 text-white focus:border-cyan-400 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-neutral-400 block mb-1.5">SUBTITLE / PREMISE</label>
            <input
              type="text"
              placeholder="e.g. The Sovereign Cryptographic Biome and Atmospheric Loss Ledger"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-700 rounded p-2.5 text-white focus:border-cyan-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-neutral-400 block mb-1.5">SPECULATIVE ABSTRACT</label>
            <textarea
              rows={3}
              placeholder="Describe the surveillance mechanism, AI system, or post-human condition explored by this world..."
              value={abstract}
              onChange={(e) => setAbstract(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-700 rounded p-2.5 text-white focus:border-cyan-400 focus:outline-none font-sans"
            />
          </div>

          {/* Color Palettes for Iridescent Sphere */}
          <div className="border border-neutral-800 rounded p-4 bg-neutral-900/40 space-y-3">
            <div className="text-[10px] text-neutral-400 uppercase tracking-widest">
              IRIDESCENT CHROMATIC PALETTE (MATCHING VISUAL DIRECTION)
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-[11px] text-neutral-400 block mb-1">PRIMARY BODY</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={colorPrimary}
                    onChange={(e) => setColorPrimary(e.target.value)}
                    className="h-8 w-10 cursor-pointer rounded border border-neutral-700 bg-transparent"
                  />
                  <span className="text-[11px] text-neutral-300 font-mono">{colorPrimary}</span>
                </div>
              </div>

              <div>
                <label className="text-[11px] text-neutral-400 block mb-1">SECONDARY RIM</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={colorSecondary}
                    onChange={(e) => setColorSecondary(e.target.value)}
                    className="h-8 w-10 cursor-pointer rounded border border-neutral-700 bg-transparent"
                  />
                  <span className="text-[11px] text-neutral-300 font-mono">{colorSecondary}</span>
                </div>
              </div>

              <div>
                <label className="text-[11px] text-neutral-400 block mb-1">IRIDESCENT SHEEN</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={colorTertiary}
                    onChange={(e) => setColorTertiary(e.target.value)}
                    className="h-8 w-10 cursor-pointer rounded border border-neutral-700 bg-transparent"
                  />
                  <span className="text-[11px] text-neutral-300 font-mono">{colorTertiary}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Solitary Observer Figure on Planet */}
          <div className="border border-neutral-800 rounded p-4 bg-neutral-900/40 space-y-3">
            <div className="text-[10px] text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
              <User className="h-3 w-3" />
              <span>3D HUMAN OBSERVER ON PLANET SURFACE</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] text-neutral-400 block mb-1">OBSERVER IDENTIFIER</label>
                <input
                  type="text"
                  value={observerLabel}
                  onChange={(e) => setObserverLabel(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded p-2 text-white text-xs"
                />
              </div>

              <div>
                <label className="text-[11px] text-neutral-400 block mb-1">OBSERVER STANCE</label>
                <select
                  value={stance}
                  onChange={(e) => setStance(e.target.value as any)}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded p-2 text-white text-xs"
                >
                  <option value="surveyor">Surveyor (Looking out at rings)</option>
                  <option value="wanderer">Wanderer (Tunic draped in void)</option>
                  <option value="monolith">Monolith (Rigid existential stillness)</option>
                  <option value="oracle">Oracle (Contemplating celestial axis)</option>
                  <option value="sentinel">Sentinel (Guarding sovereign boundary)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[11px] text-neutral-400 block mb-1">OBSERVER FIELD QUOTE</label>
              <input
                type="text"
                value={observerQuote}
                onChange={(e) => setObserverQuote(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-700 rounded p-2 text-white text-xs italic"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded border border-neutral-700 text-neutral-400 hover:text-white"
            >
              CANCEL
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded bg-cyan-600 hover:bg-cyan-500 text-white font-bold tracking-wider flex items-center gap-2 shadow-[0_0_15px_rgba(6,182,212,0.4)]"
            >
              <Orbit className="h-4 w-4" />
              <span>ANCHOR INTO MULTIVERSE</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
