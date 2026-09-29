import React, { useState, useEffect } from 'react';
import { ProjectWorld } from '../data/projects';
import { Volume2, VolumeX, Eye, EyeOff, Sparkles, Compass, Plus, ArrowRight, Radio, ShieldAlert } from 'lucide-react';
import { sound } from '../utils/audio';

interface MultiverseHUDProps {
  projects: ProjectWorld[];
  activeProject: ProjectWorld | null;
  hoveredProject: ProjectWorld | null;
  onSelectProject: (project: ProjectWorld) => void;
  showOrbits: boolean;
  setShowOrbits: (show: boolean) => void;
  showStars: boolean;
  setShowStars: (show: boolean) => void;
  onOpenCreateModal: () => void;
  onResetView: () => void;
}

export const MultiverseHUD: React.FC<MultiverseHUDProps> = ({
  projects,
  activeProject,
  hoveredProject,
  onSelectProject,
  showOrbits,
  setShowOrbits,
  showStars,
  setShowStars,
  onOpenCreateModal,
  onResetView,
}) => {
  const [isMuted, setIsMuted] = useState(true);
  const [telemetryTime, setTelemetryTime] = useState('');
  const [randomFrequency, setRandomFrequency] = useState('142.880');

  useEffect(() => {
    const updateClock = () => {
      const d = new Date();
      const yr = d.getFullYear() + 28; // Speculative future epoch
      const mo = String(d.getMonth() + 1).padStart(2, '0');
      const da = String(d.getDate()).padStart(2, '0');
      const hr = String(d.getHours()).padStart(2, '0');
      const mi = String(d.getMinutes()).padStart(2, '0');
      const se = String(d.getSeconds()).padStart(2, '0');
      const ms = String(Math.floor(d.getMilliseconds() / 10)).padStart(2, '0');
      setTelemetryTime(`EPOCH ${yr}.${mo}.${da} // ${hr}:${mi}:${se}.${ms} UTC`);
    };
    updateClock();
    const interval = setInterval(updateClock, 100);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const freqInterval = setInterval(() => {
      const base = 140 + Math.random() * 80;
      setRandomFrequency(base.toFixed(3));
    }, 2800);
    return () => clearInterval(freqInterval);
  }, []);

  const toggleSound = () => {
    const active = sound.toggleMute();
    setIsMuted(!active);
  };

  // Sector filtering & Carousel scroll for 15 planets
  const [selectedSector, setSelectedSector] = useState<'ALL' | 'BIOMETRICS & PERCEPTION' | 'SYNTHETIC ENTITIES' | 'PLANETARY ALGORITHMS'>('ALL');
  const dockScrollRef = React.useRef<HTMLDivElement>(null);

  const filteredProjects = React.useMemo(() => {
    if (selectedSector === 'ALL') return projects;
    return projects.filter((p) => p.sector === selectedSector);
  }, [projects, selectedSector]);

  const scrollDock = (direction: 'left' | 'right') => {
    if (dockScrollRef.current) {
      const scrollAmt = direction === 'left' ? -260 : 260;
      dockScrollRef.current.scrollBy({ left: scrollAmt, behavior: 'smooth' });
    }
  };

  // If inside a project world, hide the general multiverse HUD controls
  if (activeProject) return null;

  return (
    <div className="pointer-events-none absolute inset-0 z-20 flex flex-col justify-between p-6 select-none font-mono-code">
      {/* TOP BAR */}
      <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-neutral-800/80 pb-4 backdrop-blur-xs">
        {/* Collective Branding */}
        <div className="flex items-center gap-3.5">
          <div className="relative flex h-11 w-11 items-center justify-center rounded border border-cyan-500/50 bg-neutral-950/90 shadow-[0_0_20px_rgba(0,240,255,0.25)]">
            <div className="absolute h-2.5 w-2.5 rounded-full bg-cyan-400 animate-ping opacity-80" />
            <div className="h-1.5 w-1.5 rounded-full bg-cyan-300" />
            {/* Orbital ring */}
            <div className="absolute inset-0 rounded-full border border-cyan-400/40 scale-125 animate-spin [animation-duration:12s]" />
          </div>

          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="font-orbitron text-lg md:text-2xl font-black tracking-[0.24em] uppercase text-chromatic-multiverse glow-chromatic-multiverse select-none transition-all">
                LIMINAL MULTIVERSE
              </h1>
              <span className="font-chakra text-[10px] px-2 py-0.5 rounded-full border border-emerald-400/50 text-emerald-300 bg-emerald-950/40 font-bold tracking-widest shadow-[0_0_12px_rgba(0,255,163,0.25)]">
                OBSERVATORY 2050
              </span>
            </div>
            <p className="font-chakra text-[10px] md:text-[11px] text-neutral-400 tracking-[0.16em] uppercase font-medium mt-0.5">
              SPECULATIVE DESIGN COLLECTIVE // SURVEILLANCE • SYNTHETIC COGNITION • UNCANNY FUTURES
            </p>
          </div>
        </div>

        {/* Real-time Telemetry & Global Controls */}
        <div className="flex flex-wrap items-center gap-3 pointer-events-auto">
          {/* Telemetry Indicator */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded border border-neutral-800 bg-neutral-950/70 text-[11px] text-neutral-400">
            <Radio className="h-3 w-3 text-cyan-400 animate-pulse" />
            <span>{telemetryTime}</span>
            <span className="text-neutral-600">|</span>
            <span className="text-amber-400/90">{randomFrequency} MHz</span>
          </div>

          {/* Audio Synthesizer Toggle */}
          <button
            onClick={toggleSound}
            data-ui-element="true"
            title={isMuted ? 'Activate Speculative Audio Drone' : 'Mute Audio Synthesizer'}
            className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs transition-all border ${
              !isMuted
                ? 'border-cyan-500/60 bg-cyan-950/40 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.25)]'
                : 'border-neutral-800 bg-neutral-900/60 text-neutral-400 hover:border-neutral-700 hover:text-neutral-200'
            }`}
          >
            {!isMuted ? (
              <>
                <Volume2 className="h-3.5 w-3.5 text-cyan-400 animate-pulse" />
                <span className="text-[11px] tracking-wider">AUDIO DRONE [LIVE]</span>
                <span className="flex gap-0.5 items-end h-3">
                  <span className="w-0.5 h-2 bg-cyan-400 animate-bounce" />
                  <span className="w-0.5 h-3 bg-cyan-400 animate-bounce delay-75" />
                  <span className="w-0.5 h-1 bg-cyan-400 animate-bounce delay-150" />
                </span>
              </>
            ) : (
              <>
                <VolumeX className="h-3.5 w-3.5 text-neutral-400" />
                <span className="text-[11px] tracking-wider">AUDIO OFF</span>
              </>
            )}
          </button>

          {/* Toggle Orbits */}
          <button
            onClick={() => setShowOrbits(!showOrbits)}
            data-ui-element="true"
            title="Toggle Orbital Rings"
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs transition-all border ${
              showOrbits
                ? 'border-neutral-700 bg-neutral-900/60 text-neutral-200'
                : 'border-neutral-800/80 bg-neutral-950/40 text-neutral-500'
            }`}
          >
            {showOrbits ? <Eye className="h-3 w-3 text-cyan-400" /> : <EyeOff className="h-3 w-3" />}
            <span className="text-[11px]">ORBITS</span>
          </button>

          {/* Toggle Stars */}
          <button
            onClick={() => setShowStars(!showStars)}
            data-ui-element="true"
            title="Toggle Celestial Starfield"
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs transition-all border ${
              showStars
                ? 'border-neutral-700 bg-neutral-900/60 text-neutral-200'
                : 'border-neutral-800/80 bg-neutral-950/40 text-neutral-500'
            }`}
          >
            <Sparkles className={`h-3 w-3 ${showStars ? 'text-amber-400' : ''}`} />
            <span className="text-[11px]">STARS</span>
          </button>

          {/* Reset Camera View */}
          <button
            onClick={onResetView}
            data-ui-element="true"
            title="Reset Spatial Camera Vantage"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs border border-neutral-800 bg-neutral-900/60 text-neutral-300 hover:border-neutral-700 hover:text-white transition-all"
          >
            <Compass className="h-3 w-3 text-cyan-400" />
            <span className="text-[11px]">ALIGN</span>
          </button>

          {/* Add New Speculative World */}
          <button
            onClick={onOpenCreateModal}
            data-ui-element="true"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs border border-cyan-500/50 bg-cyan-950/30 text-cyan-300 hover:bg-cyan-900/50 hover:border-cyan-400 transition-all shadow-[0_0_12px_rgba(6,182,212,0.2)]"
          >
            <Plus className="h-3.5 w-3.5" />
            <span className="text-[11px] tracking-wider font-semibold uppercase">+ TRANSMIT WORLD</span>
          </button>
        </div>
      </header>

      {/* CENTER / HOVER CARD: Displays detailed speculative data when hovering a 3D sphere */}
      <div className="flex-1 flex items-center justify-end pointer-events-none pr-4">
        {hoveredProject ? (
          <div
            data-ui-element="true"
            onClick={() => onSelectProject(hoveredProject)}
            className="pointer-events-auto cursor-pointer max-w-sm w-full p-5 rounded-lg border border-neutral-700/80 bg-neutral-950/90 shadow-[0_8px_32px_rgba(0,0,0,0.8)] backdrop-blur-md transition-all duration-300 transform translate-y-0 opacity-100 hover:border-cyan-500/80 group"
          >
            {/* Header / Classification */}
            <div className="flex items-center justify-between gap-2 border-b border-neutral-800 pb-2.5 mb-3">
              <span className="text-[10px] tracking-widest text-neutral-400 uppercase">
                {hoveredProject.code}
              </span>
              <span
                className="text-[9px] px-2 py-0.5 rounded font-mono font-bold tracking-wider"
                style={{
                  backgroundColor: `${hoveredProject.themeColor}22`,
                  color: hoveredProject.themeColor,
                  border: `1px solid ${hoveredProject.themeColor}66`,
                }}
              >
                {hoveredProject.year}
              </span>
            </div>

            {/* Title & Subtitle */}
            <h2 className="font-orbitron text-lg font-bold tracking-wider text-white mb-1 group-hover:text-cyan-300 transition-colors uppercase">
              {hoveredProject.title}
            </h2>
            <p className="text-xs text-neutral-300 mb-3 leading-relaxed font-sans">
              {hoveredProject.subtitle}
            </p>

            {/* Wizard Project Owner Status Banner */}
            <div className="p-2.5 rounded bg-neutral-900/90 border border-amber-500/40 mb-3 flex items-start gap-2.5">
              <span className="text-xl shrink-0 select-none mt-0.5">
                {hoveredProject.wizardOwner?.avatarRune || '🔮'}
              </span>
              <div>
                <div className="font-chakra text-[10px] font-bold tracking-wider uppercase text-amber-300 flex items-center gap-1.5">
                  <Sparkles className="h-2.5 w-2.5" />
                  <span>PROJECT OWNER // {hoveredProject.wizardOwner?.name}</span>
                </div>
                <div className="text-[10px] text-neutral-300 font-mono">
                  {hoveredProject.wizardOwner?.wizardTitle}
                </div>
              </div>
            </div>

            {/* Observer Quote */}
            <p className="text-[11px] italic text-neutral-400/90 mb-4 border-l-2 border-amber-500/70 pl-2.5 leading-snug">
              {hoveredProject.observerFigure.quote}
            </p>

            {/* Action Callout */}
            <div className="flex items-center justify-between pt-2 border-t border-neutral-800/80 text-xs">
              <span className="font-chakra text-[10px] text-neutral-400 uppercase tracking-widest">
                WIZARD ORATOR READY
              </span>
              <span className="font-chakra flex items-center gap-1.5 text-amber-300 font-bold text-[11px] tracking-wider group-hover:translate-x-1 transition-transform uppercase">
                ENTER & HEAR ORATION <ArrowRight className="h-3 w-3" />
              </span>
            </div>
          </div>
        ) : (
          <div className="hidden md:flex flex-col items-end text-neutral-500 text-[11px] tracking-widest space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
              <span className="font-chakra uppercase">SPATIAL NAVIGATION ACTIVE</span>
            </div>
            <p className="font-mono text-[10px] text-neutral-500">
              DRAG TO ORBIT // WHEEL TO ZOOM // CLICK ANY CELESTIAL BODY TO ENTER
            </p>
          </div>
        )}
      </div>

      {/* BOTTOM FOOTER & PLANET QUICK-SELECT DOCK */}
      <footer className="border-t border-neutral-800/80 pt-3 flex flex-col gap-2.5 backdrop-blur-xs">
        {/* Top dock controls: Instructions + Sector Category Tabs */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-[11px]">
          <div className="flex items-center gap-3 text-neutral-400">
            <span className="font-chakra px-2.5 py-0.5 rounded-full border border-neutral-800 bg-neutral-950/80 text-neutral-300 uppercase tracking-wider font-semibold">
              DESKTOP OBSERVATORY
            </span>
            <span className="hidden sm:inline text-neutral-600">•</span>
            <span className="hidden sm:inline text-neutral-400 font-chakra uppercase tracking-wider">
              {projects.length} WORLDS ANCHORED
            </span>
          </div>

          {/* Sector Category Filter Tabs */}
          <div className="flex items-center gap-1.5 pointer-events-auto flex-wrap">
            <button
              onClick={() => setSelectedSector('ALL')}
              data-ui-element="true"
              className={`font-chakra px-2.5 py-1 rounded text-[10px] tracking-wider uppercase font-semibold transition-all border ${
                selectedSector === 'ALL'
                  ? 'border-cyan-400 bg-cyan-950/50 text-cyan-300 shadow-[0_0_10px_rgba(0,240,255,0.2)]'
                  : 'border-neutral-800 bg-neutral-950/70 text-neutral-400 hover:text-white'
              }`}
            >
              ALL [15]
            </button>
            <button
              onClick={() => setSelectedSector('BIOMETRICS & PERCEPTION')}
              data-ui-element="true"
              className={`font-chakra px-2.5 py-1 rounded text-[10px] tracking-wider uppercase font-semibold transition-all border ${
                selectedSector === 'BIOMETRICS & PERCEPTION'
                  ? 'border-amber-400 bg-amber-950/50 text-amber-300 shadow-[0_0_10px_rgba(255,184,0,0.2)]'
                  : 'border-neutral-800 bg-neutral-950/70 text-neutral-400 hover:text-white'
              }`}
            >
              BIOMETRICS & PERCEPTION [5]
            </button>
            <button
              onClick={() => setSelectedSector('SYNTHETIC ENTITIES')}
              data-ui-element="true"
              className={`font-chakra px-2.5 py-1 rounded text-[10px] tracking-wider uppercase font-semibold transition-all border ${
                selectedSector === 'SYNTHETIC ENTITIES'
                  ? 'border-purple-400 bg-purple-950/50 text-purple-300 shadow-[0_0_10px_rgba(168,85,247,0.2)]'
                  : 'border-neutral-800 bg-neutral-950/70 text-neutral-400 hover:text-white'
              }`}
            >
              SYNTHETIC ENTITIES [5]
            </button>
            <button
              onClick={() => setSelectedSector('PLANETARY ALGORITHMS')}
              data-ui-element="true"
              className={`font-chakra px-2.5 py-1 rounded text-[10px] tracking-wider uppercase font-semibold transition-all border ${
                selectedSector === 'PLANETARY ALGORITHMS'
                  ? 'border-emerald-400 bg-emerald-950/50 text-emerald-300 shadow-[0_0_10px_rgba(0,255,163,0.2)]'
                  : 'border-neutral-800 bg-neutral-950/70 text-neutral-400 hover:text-white'
              }`}
            >
              PLANETARY ALGORITHMS [5]
            </button>
          </div>
        </div>

        {/* Planet Quick-Select Selector Carousel */}
        <div className="relative flex items-center pointer-events-auto">
          <button
            onClick={() => scrollDock('left')}
            data-ui-element="true"
            className="hidden sm:flex shrink-0 items-center justify-center w-7 h-8 rounded border border-neutral-800 bg-neutral-950/90 text-neutral-400 hover:text-white hover:border-cyan-400 transition-all mr-1.5"
            title="Scroll left"
          >
            ‹
          </button>

          <div
            ref={dockScrollRef}
            className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1 w-full"
            style={{ scrollBehavior: 'smooth' }}
          >
            {filteredProjects.map((proj) => {
              const globalIdx = projects.findIndex((p) => p.id === proj.id);
              return (
                <button
                  key={proj.id}
                  onClick={() => onSelectProject(proj)}
                  data-ui-element="true"
                  className="group shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-full border border-neutral-800 bg-neutral-950/90 hover:border-cyan-400 hover:bg-neutral-900/90 text-neutral-300 hover:text-white transition-all text-xs shadow-xs"
                >
                  <span
                    className="w-2 h-2 rounded-full group-hover:scale-125 transition-transform"
                    style={{ backgroundColor: proj.themeColor }}
                  />
                  <span className="font-orbitron text-[10px] text-neutral-400 group-hover:text-cyan-400 font-bold">
                    {String(globalIdx + 1).padStart(2, '0')}
                  </span>
                  <span className="font-chakra text-[11px] tracking-wider uppercase font-semibold whitespace-nowrap">
                    {proj.title}
                  </span>
                </button>
              );
            })}
          </div>

          <button
            onClick={() => scrollDock('right')}
            data-ui-element="true"
            className="hidden sm:flex shrink-0 items-center justify-center w-7 h-8 rounded border border-neutral-800 bg-neutral-950/90 text-neutral-400 hover:text-white hover:border-cyan-400 transition-all ml-1.5"
            title="Scroll right"
          >
            ›
          </button>
        </div>
      </footer>
    </div>
  );
};
