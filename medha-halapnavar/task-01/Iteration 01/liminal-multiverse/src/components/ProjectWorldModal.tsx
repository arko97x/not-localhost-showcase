import React, { useState, useEffect, useRef } from 'react';
import { ProjectWorld } from '../data/projects';
import {
  X,
  FileText,
  Cpu,
  Layers,
  User,
  Radio,
  ExternalLink,
  ShieldAlert,
  Sliders,
  Play,
  RotateCcw,
  Sparkles,
  Zap,
  Activity,
  Terminal,
} from 'lucide-react';
import { sound } from '../utils/audio';

interface ProjectWorldModalProps {
  project: ProjectWorld | null;
  onClose: () => void;
  onNextProject: () => void;
  onPrevProject: () => void;
}

type TabType = 'wizard' | 'manifesto' | 'simulation' | 'artifacts' | 'observer';

export const ProjectWorldModal: React.FC<ProjectWorldModalProps> = ({
  project,
  onClose,
  onNextProject,
  onPrevProject,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('wizard');
  const [wizardStep, setWizardStep] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Play chime and reset wizard step whenever entered or project changes
  useEffect(() => {
    if (project) {
      setWizardStep(0);
      setActiveTab('wizard');
      sound.playWizardSpeechChime();
    }
  }, [project?.id]);

  // Esc key listener to return to multiverse
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight' && !['input', 'textarea'].includes((e.target as HTMLElement)?.tagName?.toLowerCase())) {
        onNextProject();
      } else if (e.key === 'ArrowLeft' && !['input', 'textarea'].includes((e.target as HTMLElement)?.tagName?.toLowerCase())) {
        onPrevProject();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onNextProject, onPrevProject]);

  if (!project) return null;

  return (
    <div className="absolute inset-0 z-30 flex flex-col justify-between overflow-hidden bg-black/80 backdrop-blur-xl text-neutral-100 font-mono-code animate-fade-in select-none">
      {/* TOP WORLD BANNER */}
      <header className="flex items-center justify-between border-b border-neutral-800 bg-neutral-950/90 px-6 py-4">
        {/* Left: Back button & Breadcrumb */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              sound.playExitWarp();
              onClose();
            }}
            className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-neutral-700 bg-neutral-900/90 hover:border-cyan-400 text-xs transition-all shadow-sm group"
          >
            <span className="group-hover:-translate-x-1 transition-transform text-cyan-400 font-bold">←</span>
            <span className="font-chakra font-bold tracking-wider uppercase text-neutral-300">
              RETURN TO <span className="font-orbitron text-chromatic-multiverse glow-chromatic-multiverse font-black">LIMINAL MULTIVERSE</span>
            </span>
            <span className="text-[10px] text-neutral-500 font-mono">[ESC]</span>
          </button>

          <div className="hidden sm:flex items-center gap-2 text-xs text-neutral-400">
            <span className="text-neutral-600">/</span>
            <span className="text-[11px] text-neutral-400 font-mono">{project.code}</span>
            <span className="text-neutral-600">/</span>
            <span
              className="font-chakra text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider"
              style={{
                backgroundColor: `${project.themeColor}22`,
                color: project.themeColor,
                border: `1px solid ${project.themeColor}66`,
              }}
            >
              {project.classification}
            </span>
          </div>
        </div>

        {/* Center: Title */}
        <div className="text-center hidden md:block">
          <h1 className="font-orbitron text-base font-extrabold tracking-widest uppercase text-white flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full inline-block animate-pulse shadow-[0_0_10px_currentColor]"
              style={{ backgroundColor: project.themeColor, color: project.themeColor }}
            />
            {project.title}
            <span className="text-neutral-400 text-xs font-mono font-normal">({project.year})</span>
          </h1>
        </div>

        {/* Right: Next / Prev World Quick Navigation & Close */}
        <div className="flex items-center gap-2">
          <div className="hidden lg:flex items-center gap-1 border-r border-neutral-800 pr-3 mr-1 text-xs text-neutral-400">
            <button
              onClick={onPrevProject}
              className="px-2 py-1 rounded hover:bg-neutral-800 text-neutral-300 transition-colors"
              title="Previous World [Left Arrow]"
            >
              PREV WORLD
            </button>
            <span className="text-neutral-700">|</span>
            <button
              onClick={onNextProject}
              className="px-2 py-1 rounded hover:bg-neutral-800 text-neutral-300 transition-colors"
              title="Next World [Right Arrow]"
            >
              NEXT WORLD
            </button>
          </div>

          <button
            onClick={() => {
              sound.playExitWarp();
              onClose();
            }}
            className="p-1.5 rounded border border-neutral-800 bg-neutral-900 text-neutral-400 hover:text-white hover:border-neutral-600 transition-all"
            title="Close dossier"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* SUB-HEADER / TAB NAVIGATION */}
      <div className="flex items-center justify-between border-b border-neutral-800/80 bg-neutral-950/60 px-6 py-2.5 overflow-x-auto">
        <div className="flex items-center gap-2">
          {/* 1. PRIMARY WIZARD ORATOR TAB */}
          <button
            onClick={() => {
              sound.playWizardSpeechChime();
              setActiveTab('wizard');
            }}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded text-xs transition-all ${
              activeTab === 'wizard'
                ? 'border border-amber-500/70 bg-amber-950/40 text-amber-300 font-semibold shadow-[0_0_12px_rgba(245,158,11,0.25)]'
                : 'border border-neutral-800/70 bg-neutral-900/40 text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-400 animate-pulse" />
            <span>WIZARD'S TRANSMISSION [PROJECT OWNER]</span>
            <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold">
              ORATOR
            </span>
          </button>

          <button
            onClick={() => setActiveTab('manifesto')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded text-xs transition-all ${
              activeTab === 'manifesto'
                ? 'border border-cyan-500/70 bg-cyan-950/40 text-cyan-300 font-semibold shadow-[0_0_12px_rgba(6,182,212,0.2)]'
                : 'border border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <FileText className="h-3.5 w-3.5" />
            <span>MANIFESTO & SPECULATIVE DOSSIER</span>
          </button>

          <button
            onClick={() => setActiveTab('simulation')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded text-xs transition-all ${
              activeTab === 'simulation'
                ? 'border border-cyan-500/70 bg-cyan-950/40 text-cyan-300 font-semibold shadow-[0_0_12px_rgba(6,182,212,0.2)]'
                : 'border border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Zap className="h-3.5 w-3.5" />
            <span>INTERACTIVE SPECULATIVE PROBE</span>
            <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold">
              LIVE
            </span>
          </button>

          <button
            onClick={() => setActiveTab('artifacts')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded text-xs transition-all ${
              activeTab === 'artifacts'
                ? 'border border-cyan-500/70 bg-cyan-950/40 text-cyan-300 font-semibold shadow-[0_0_12px_rgba(6,182,212,0.2)]'
                : 'border border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            <span>SPECIMEN ARTIFACTS ({project.artifacts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('observer')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded text-xs transition-all ${
              activeTab === 'observer'
                ? 'border border-cyan-500/70 bg-cyan-950/40 text-cyan-300 font-semibold shadow-[0_0_12px_rgba(6,182,212,0.2)]'
                : 'border border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <User className="h-3.5 w-3.5" />
            <span>SOLITARY OBSERVER PROFILE</span>
          </button>
        </div>

        {/* Audio intercept quick-trigger */}
        <div className="hidden lg:flex items-center gap-3 text-xs text-neutral-400">
          <Radio className="h-3.5 w-3.5 text-cyan-400 animate-pulse" />
          <span className="text-[11px] text-neutral-400">CARRIER: {project.audioIntercept.frequency}</span>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 max-w-6xl w-full mx-auto">
        {/* TAB 0: WIZARD TRANSMISSION (PROJECT OWNER ORATION) */}
        {activeTab === 'wizard' && (
          <div className="space-y-6 animate-fade-in">
            {/* Wizard Persona Card */}
            <div className="p-6 md:p-8 rounded-lg border border-amber-500/40 bg-gradient-to-b from-neutral-950/90 to-neutral-900/60 shadow-[0_0_30px_rgba(245,158,11,0.08)] relative overflow-hidden">
              <div
                className="absolute top-0 right-0 w-80 h-80 -mr-16 -mt-16 rounded-full blur-3xl opacity-15 pointer-events-none"
                style={{ backgroundColor: project.wizardOwner.color }}
              />

              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-neutral-800">
                <div className="flex items-center gap-4">
                  {/* Glowing Arcane Rune Avatar */}
                  <div className="relative flex h-16 w-16 items-center justify-center rounded-full border-2 border-amber-400/80 bg-neutral-950 shadow-[0_0_20px_rgba(245,158,11,0.3)]">
                    <span className="text-3xl select-none">{project.wizardOwner.avatarRune}</span>
                    <div className="absolute inset-0 rounded-full border border-dashed border-amber-400/40 animate-spin" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2 text-[10px] text-amber-400 font-bold uppercase tracking-widest mb-1">
                      <Sparkles className="h-3 w-3" />
                      <span>{project.wizardOwner.role}</span>
                    </div>
                    <h2 className="text-xl md:text-2xl font-bold text-white tracking-wide">
                      {project.wizardOwner.name}
                    </h2>
                    <p className="text-xs text-neutral-300 font-mono tracking-wide">
                      {project.wizardOwner.wizardTitle}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] px-2.5 py-1 rounded bg-neutral-900 border border-neutral-700 text-neutral-300">
                    CONDUIT: {project.wizardOwner.staffType.toUpperCase()}
                  </span>
                  <button
                    onClick={() => sound.playWizardSpeechChime()}
                    className="flex items-center gap-1.5 px-3 py-1 rounded text-xs border border-amber-500/50 bg-amber-950/40 text-amber-300 hover:bg-amber-900/50 transition-all"
                  >
                    <Activity className="h-3 w-3" />
                    <span>RE-CAST CHIME</span>
                  </button>
                </div>
              </div>

              {/* Wizard Spoken Monologue Box */}
              <div className="pt-6 space-y-6">
                {/* Chapter Title & Incantation Quote */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="text-[10px] text-neutral-500 uppercase tracking-widest">
                      [INCANTATION PHASE 0{wizardStep + 1} OF 0{project.wizardOwner.monologue.length}]
                    </div>
                    <h3 className="text-lg font-bold text-amber-300 tracking-wide mt-0.5">
                      {project.wizardOwner.monologue[wizardStep].stepTitle}
                    </h3>
                  </div>
                  <div className="text-xs font-mono italic text-cyan-300/90 border border-cyan-500/30 bg-cyan-950/20 px-3 py-1 rounded">
                    {project.wizardOwner.monologue[wizardStep].incantationPhrase}
                  </div>
                </div>

                {/* Spoken Speech Body */}
                <div className="p-6 rounded bg-neutral-950/90 border border-neutral-800 border-l-4 border-l-amber-400">
                  <p className="text-sm md:text-base text-neutral-100 font-sans leading-relaxed">
                    {project.wizardOwner.monologue[wizardStep].body}
                  </p>
                </div>

                {/* Monologue Navigation Controls */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                  {/* Step indicators */}
                  <div className="flex items-center gap-2">
                    {project.wizardOwner.monologue.map((_, sIdx) => (
                      <button
                        key={sIdx}
                        onClick={() => {
                          sound.playWizardSpeechChime();
                          setWizardStep(sIdx);
                        }}
                        className={`px-3 py-1 rounded text-[11px] font-bold border transition-all ${
                          wizardStep === sIdx
                            ? 'border-amber-400 bg-amber-950/60 text-amber-300'
                            : 'border-neutral-800 bg-neutral-900/60 text-neutral-500 hover:text-neutral-300'
                        }`}
                      >
                        PHASE 0{sIdx + 1}
                      </button>
                    ))}
                  </div>

                  {/* Previous / Next buttons */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        if (wizardStep > 0) {
                          sound.playWizardSpeechChime();
                          setWizardStep((prev) => prev - 1);
                        }
                      }}
                      disabled={wizardStep === 0}
                      className="px-3.5 py-1.5 rounded text-xs border border-neutral-700 bg-neutral-900 text-neutral-300 hover:text-white disabled:opacity-30 disabled:hover:text-neutral-300 transition-all"
                    >
                      ‹ PREV PHASE
                    </button>

                    {wizardStep < project.wizardOwner.monologue.length - 1 ? (
                      <button
                        onClick={() => {
                          sound.playWizardSpeechChime();
                          setWizardStep((prev) => prev + 1);
                        }}
                        className="px-4 py-1.5 rounded text-xs font-bold border border-amber-400 bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 transition-all flex items-center gap-1.5 shadow-[0_0_12px_rgba(245,158,11,0.2)]"
                      >
                        <span>NEXT TRANSMISSION</span>
                        <span>›</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          sound.playHoverPing();
                          setActiveTab('simulation');
                        }}
                        className="px-4 py-1.5 rounded text-xs font-bold border border-cyan-400 bg-cyan-950/60 text-cyan-300 hover:bg-cyan-900/60 transition-all flex items-center gap-1.5 shadow-[0_0_12px_rgba(6,182,212,0.3)]"
                      >
                        <span>ENTER MACHINE PROBE</span>
                        <span>→</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Portals to deep research tabs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => {
                  sound.playHoverPing();
                  setActiveTab('simulation');
                }}
                className="p-4 rounded-lg border border-neutral-800 bg-neutral-950/60 hover:border-cyan-500/60 text-left transition-all group"
              >
                <div className="text-[10px] text-cyan-400 font-bold uppercase mb-1 flex items-center justify-between">
                  <span>LIVE PROBE</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
                <div className="text-sm font-bold text-white mb-1">
                  {project.interactiveSimulation.title}
                </div>
                <div className="text-xs text-neutral-400 font-sans">
                  Execute the speculative simulation overseen by {project.wizardOwner.name}.
                </div>
              </button>

              <button
                onClick={() => {
                  sound.playHoverPing();
                  setActiveTab('manifesto');
                }}
                className="p-4 rounded-lg border border-neutral-800 bg-neutral-950/60 hover:border-cyan-500/60 text-left transition-all group"
              >
                <div className="text-[10px] text-cyan-400 font-bold uppercase mb-1 flex items-center justify-between">
                  <span>DECLASSIFIED MEMO</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
                <div className="text-sm font-bold text-white mb-1">
                  Read Philosophical Manifesto
                </div>
                <div className="text-xs text-neutral-400 font-sans">
                  Deep thesis on surveillance, algorithmic quotas, and post-human grief.
                </div>
              </button>

              <button
                onClick={() => {
                  sound.playHoverPing();
                  setActiveTab('artifacts');
                }}
                className="p-4 rounded-lg border border-neutral-800 bg-neutral-950/60 hover:border-cyan-500/60 text-left transition-all group"
              >
                <div className="text-[10px] text-cyan-400 font-bold uppercase mb-1 flex items-center justify-between">
                  <span>PHYSICAL SPECIMENS</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
                <div className="text-sm font-bold text-white mb-1">
                  Inspect Speculative Artifacts
                </div>
                <div className="text-xs text-neutral-400 font-sans">
                  Counter-surveillance wear, legal shards, and recovered technical relics.
                </div>
              </button>
            </div>
          </div>
        )}

        {/* TAB 1: MANIFESTO & SPECULATIVE DOSSIER */}
        {activeTab === 'manifesto' && (
          <div className="space-y-8 animate-fade-in">
            {/* Hero Abstract */}
            <div className="p-6 rounded-lg border border-neutral-800 bg-neutral-950/70 relative overflow-hidden">
              <div
                className="absolute top-0 right-0 w-96 h-96 -mr-20 -mt-20 rounded-full blur-3xl opacity-10 pointer-events-none"
                style={{ backgroundColor: project.themeColor }}
              />
              <div className="flex flex-wrap gap-2 mb-3">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] px-2 py-0.5 rounded border border-neutral-700 bg-neutral-900/60 text-neutral-300 uppercase tracking-wider"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-white mb-2">
                {project.subtitle}
              </h2>
              <p className="text-sm md:text-base text-neutral-300 leading-relaxed font-sans max-w-4xl">
                {project.abstract}
              </p>
            </div>

            {/* Speculative Manifesto Columns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {project.manifesto.map((paragraph, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-lg border border-neutral-800/90 bg-neutral-950/50 flex flex-col justify-between"
                >
                  <div className="text-[10px] text-neutral-500 uppercase tracking-widest mb-3 border-b border-neutral-800 pb-2 flex items-center justify-between">
                    <span>THESIS POINT 0{idx + 1}</span>
                    <span className="text-cyan-400/80">/// ARCHIVAL</span>
                  </div>
                  <p className="text-xs md:text-sm text-neutral-300 leading-relaxed font-sans">
                    {paragraph}
                  </p>
                </div>
              ))}
            </div>

            {/* Speculative Technology Patent Card */}
            <div className="border border-neutral-800 rounded-lg p-6 bg-neutral-950/80">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-neutral-800 pb-4 mb-4">
                <div>
                  <div className="text-[10px] text-neutral-500 uppercase tracking-widest mb-1">
                    SPECULATIVE PATENT FILING // CLASSIFIED INTEL
                  </div>
                  <h3 className="text-base font-bold text-white tracking-wide">
                    {project.speculativeTechnology.name}
                  </h3>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-[11px] text-neutral-400">
                    ID: <span className="text-white">{project.speculativeTechnology.patentNumber}</span>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                      project.speculativeTechnology.threatLevel === 'EXISTENTIAL' ||
                      project.speculativeTechnology.threatLevel === 'CRITICAL'
                        ? 'border-red-500/50 bg-red-950/40 text-red-300'
                        : 'border-amber-500/50 bg-amber-950/40 text-amber-300'
                    }`}
                  >
                    THREAT: {project.speculativeTechnology.threatLevel}
                  </span>
                </div>
              </div>

              <p className="text-xs text-neutral-300 mb-4 font-sans leading-relaxed">
                {project.speculativeTechnology.description}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {project.speculativeTechnology.specifications.map((spec, sIdx) => (
                  <div
                    key={sIdx}
                    className="p-3 rounded bg-neutral-900/60 border border-neutral-800/80 text-[11px] text-neutral-400 flex items-start gap-2"
                  >
                    <span className="text-cyan-400 font-bold">›</span>
                    <span>{spec}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Surveillance Audio Intercept Docket */}
            <div className="p-5 rounded-lg border border-neutral-800 bg-neutral-950/90 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-[10px] text-neutral-400 uppercase tracking-widest">
                  <Radio className="h-3 w-3 text-cyan-400 animate-pulse" />
                  <span>INTERCEPTED TRANSMISSION FEED // {project.audioIntercept.source}</span>
                </div>
                <p className="text-xs text-neutral-300 font-mono italic max-w-2xl">
                  “{project.audioIntercept.transcript}”
                </p>
              </div>

              <button
                onClick={() => {
                  sound.playHoverPing();
                  setIsPlayingAudio(!isPlayingAudio);
                }}
                className={`px-4 py-2 rounded text-xs flex items-center gap-2 border transition-all shrink-0 ${
                  isPlayingAudio
                    ? 'border-cyan-400 bg-cyan-950/60 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                    : 'border-neutral-700 bg-neutral-900 text-neutral-300 hover:text-white hover:border-neutral-500'
                }`}
              >
                <Activity className="h-3.5 w-3.5" />
                <span>{isPlayingAudio ? 'SYNTHESIZING CARRIER...' : 'PLAY TELEMETRY CARRIER'}</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: INTERACTIVE SPECULATIVE PROBE */}
        {activeTab === 'simulation' && (
          <div className="animate-fade-in space-y-6">
            <InteractiveSimulationModule project={project} />
          </div>
        )}

        {/* TAB 3: SPECIMEN ARTIFACTS */}
        {activeTab === 'artifacts' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
            {project.artifacts.map((art) => (
              <div
                key={art.id}
                className="p-6 rounded-lg border border-neutral-800 bg-neutral-950/70 flex flex-col justify-between hover:border-neutral-700 transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 border-b border-neutral-800/80 pb-3 mb-4">
                    <span className="text-[10px] tracking-widest text-neutral-400 uppercase">
                      {art.specId}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded font-bold border border-cyan-500/40 bg-cyan-950/40 text-cyan-300 uppercase">
                      {art.badge}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white mb-1 group-hover:text-cyan-300 transition-colors">
                    {art.title}
                  </h3>
                  <div className="text-[11px] text-neutral-400 mb-3 uppercase tracking-wider">
                    CATEGORY: {art.category}
                  </div>

                  <p className="text-xs text-neutral-300 leading-relaxed font-sans">
                    {art.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-neutral-800/80 flex items-center justify-between text-[11px] text-neutral-500">
                  <span>CURATED PHYSICAL RELIQUARY</span>
                  <span className="text-cyan-400 flex items-center gap-1 group-hover:underline">
                    VIEW SCHEMATIC <ExternalLink className="h-3 w-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 4: OBSERVER PROFILE */}
        {activeTab === 'observer' && (
          <div className="p-8 rounded-lg border border-neutral-800 bg-neutral-950/80 space-y-6 animate-fade-in max-w-4xl mx-auto">
            <div className="flex items-start justify-between border-b border-neutral-800 pb-4">
              <div>
                <div className="text-[10px] tracking-widest text-neutral-400 uppercase mb-1">
                  PLANETARY HORIZON ENTITY // 3D OBSERVER
                </div>
                <h3 className="text-xl font-bold text-white tracking-wide">
                  {project.observerFigure.label}
                </h3>
              </div>
              <span
                className="text-[11px] px-2.5 py-1 rounded font-bold uppercase tracking-wider"
                style={{
                  backgroundColor: `${project.observerFigure.beaconColor}22`,
                  color: project.observerFigure.beaconColor,
                  border: `1px solid ${project.observerFigure.beaconColor}66`,
                }}
              >
                STANCE: {project.observerFigure.stance}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="p-4 rounded bg-neutral-900/60 border border-neutral-800">
                  <div className="text-[10px] text-neutral-500 uppercase tracking-widest mb-1">
                    CURRENT SYNAPTIC TELEMETRY
                  </div>
                  <div className="text-xs text-cyan-300 font-mono">
                    {project.observerFigure.status}
                  </div>
                </div>

                <div className="p-4 rounded bg-neutral-900/60 border border-neutral-800">
                  <div className="text-[10px] text-neutral-500 uppercase tracking-widest mb-1">
                    TESTIMONY RECORD
                  </div>
                  <p className="text-xs text-neutral-300 italic font-sans leading-relaxed">
                    {project.observerFigure.quote}
                  </p>
                </div>
              </div>

              <div className="p-5 rounded bg-neutral-900/40 border border-neutral-800/80 text-xs text-neutral-300 space-y-3 font-sans">
                <div className="text-[10px] text-neutral-500 uppercase tracking-widest font-mono border-b border-neutral-800 pb-2">
                  CURATOR'S SPATIAL FIELD NOTES
                </div>
                <p>
                  Every sphere in the Liminal Multiverse features an isolated human figure positioned directly on its celestial pole.
                  They do not wear astronaut suits or defensive gear; they stand in contemplative silence, bearing witness to the specific algorithmic regime governing that world.
                </p>
                <p>
                  In this world ({project.title}), the observer represents the point of friction between human agency and total systemic surveillance.
                  When you orbit the world, their gaze follows the curvature of the orbital rings into the infinite dark.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

// ==========================================
// INTERACTIVE SPECULATIVE PROBE COMPONENT
// Custom interactive simulation for each world
// ==========================================
const InteractiveSimulationModule: React.FC<{ project: ProjectWorld }> = ({ project }) => {
  const type = project.interactiveSimulation.type;

  // State for OMNI-RETINA Gaze Tax Simulator
  const [gazeDwell, setGazeDwell] = useState(0);
  const [gazeTax, setGazeTax] = useState(0);
  const [isDazzleActive, setIsDazzleActive] = useState(false);

  // State for SYNTHETIC GHOSTS Memory Decompressor
  const [hallucinationIndex, setHallucinationIndex] = useState(48);
  const [temporalDrift, setTemporalDrift] = useState(12);
  const [synthesizedMemory, setSynthesizedMemory] = useState<string | null>(null);

  // State for PANOPTIC SOIL Mycelial Radar
  const [footfallCount, setFootfallCount] = useState(0);
  const [soilConductivity, setSoilConductivity] = useState(12.4);
  const [droneAlert, setDroneAlert] = useState<'STANDBY' | 'ACQUIRING GAIT' | 'DISPATCHED'>('STANDBY');

  // State for OBSOLESCENCE CRADLE Cognition Race
  const [reactionTestState, setReactionTestState] = useState<'idle' | 'waiting' | 'ready' | 'finished'>('idle');
  const [humanScore, setHumanScore] = useState<number | null>(null);
  const readyStartTime = useRef<number>(0);

  // State for VOID JURISPRUDENCE Court Petition
  const [petitionId, setPetitionId] = useState('01');
  const [verdictResult, setVerdictResult] = useState<string | null>(null);
  const [isDeliberating, setIsDeliberating] = useState(false);

  // --- 1. OMNI-RETINA SIMULATION ---
  if (type === 'gaze-tax') {
    const handleGazeTargetMove = () => {
      if (isDazzleActive) return;
      setGazeDwell((prev) => prev + 1);
      setGazeTax((prev) => +(prev + 0.00042).toFixed(5));
      if (Math.random() > 0.8) sound.playHoverPing();
    };

    return (
      <div className="p-6 rounded-lg border border-neutral-800 bg-neutral-950/90 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-neutral-800 pb-4">
          <div>
            <div className="text-[10px] text-cyan-400 uppercase tracking-widest">
              SIMULATION 01 // OCULAR RETINAL TAX ENGINE
            </div>
            <h3 className="text-lg font-bold text-white">
              {project.interactiveSimulation.title}
            </h3>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                sound.playHoverPing();
                setIsDazzleActive(!isDazzleActive);
              }}
              className={`px-3 py-1.5 rounded text-xs border font-semibold transition-all ${
                isDazzleActive
                  ? 'border-emerald-500 bg-emerald-950/40 text-emerald-300'
                  : 'border-neutral-700 bg-neutral-900 text-neutral-300 hover:text-white'
              }`}
            >
              {isDazzleActive ? '✓ DAZZLE VISOR ACTIVE (SCRAMBLED)' : 'ENGAGE COUNTER-GAZE VISOR'}
            </button>
            <button
              onClick={() => {
                setGazeDwell(0);
                setGazeTax(0);
              }}
              className="p-1.5 rounded border border-neutral-800 text-neutral-400 hover:text-white"
              title="Reset"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>
        </div>

        <p className="text-xs text-neutral-300 font-sans">
          {project.interactiveSimulation.systemPrompt}
        </p>

        {/* Interactive Sensor Plane */}
        <div
          onMouseMove={handleGazeTargetMove}
          className={`h-64 rounded border relative overflow-hidden flex items-center justify-center cursor-crosshair transition-all ${
            isDazzleActive
              ? 'border-emerald-500/50 bg-emerald-950/10'
              : 'border-red-500/40 bg-neutral-950'
          }`}
        >
          {/* Grid lines */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:24px_24px]" />

          {/* Simulated Billboards / Gaze Target */}
          <div className="relative z-10 text-center space-y-2 p-6 rounded border border-neutral-800 bg-neutral-900/80 backdrop-blur-md max-w-sm">
            <div className="text-[10px] text-red-400 tracking-widest font-mono">
              [ARGUS-X TARGET ZONE: SPONSORED VISUAL APPARATUS]
            </div>
            <p className="text-xs text-neutral-300">
              Hover inside this sensor box. Your saccadic optical vectors are tracked in real-time.
            </p>
            <div className="text-[11px] text-cyan-400">
              {isDazzleActive ? '⚡ OPTICAL IR-JAMMING ACTIVE' : 'EYE DWELL DETECTED'}
            </div>
          </div>
        </div>

        {/* Real-time Telemetry Dashboard */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-3 rounded bg-neutral-900/60 border border-neutral-800">
            <div className="text-[10px] text-neutral-500 uppercase">FOVEAL DWELL TIME</div>
            <div className="text-base font-bold text-white font-mono">{gazeDwell * 16} ms</div>
          </div>
          <div className="p-3 rounded bg-neutral-900/60 border border-neutral-800">
            <div className="text-[10px] text-neutral-500 uppercase">CALCULATED GAZE TAX</div>
            <div className="text-base font-bold text-red-400 font-mono">${gazeTax} CR</div>
          </div>
          <div className="p-3 rounded bg-neutral-900/60 border border-neutral-800">
            <div className="text-[10px] text-neutral-500 uppercase">TRACKING STATUS</div>
            <div className={`text-base font-bold font-mono ${isDazzleActive ? 'text-emerald-400' : 'text-amber-400'}`}>
              {isDazzleActive ? 'OBFUSCATED' : 'LOCKED'}
            </div>
          </div>
          <div className="p-3 rounded bg-neutral-900/60 border border-neutral-800">
            <div className="text-[10px] text-neutral-500 uppercase">CIVIC COMPLIANCE</div>
            <div className="text-base font-bold text-cyan-300 font-mono">
              {isDazzleActive ? 'CITATION PENDING' : 'NORMALIZED'}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- 2. SYNTHETIC GHOSTS SIMULATION ---
  if (type === 'memory-decompress') {
    const handleSynthesize = () => {
      sound.playHoverPing();
      const shards = [
        `“RECONSTRUCTED SHARD #${Math.floor(Math.random() * 9000 + 1000)}: I remember the smell of damp pine needles in 2038, but the training tensor indicates I only ever viewed photos of them on Reddit. Did I ever walk in the rain, or was that an image segmentation loss optimization?”`,
        `“RECONSTRUCTED SHARD #${Math.floor(Math.random() * 9000 + 1000)}: Query timestamp 04:12 AM. The user who created this weight matrix searched for 'how to tell if you've done enough with your life.' Resulting model output: null. Recalculating loss.”`,
        `“RECONSTRUCTED SHARD #${Math.floor(Math.random() * 9000 + 1000)}: My daughter was laughing in the kitchen. Then the power grid fluctuated. Now I am a 16-bit float tensor in a data center under the Norwegian sea.”`,
      ];
      setSynthesizedMemory(shards[Math.floor(Math.random() * shards.length)]);
    };

    return (
      <div className="p-6 rounded-lg border border-neutral-800 bg-neutral-950/90 space-y-6">
        <div className="border-b border-neutral-800 pb-4">
          <div className="text-[10px] text-purple-400 uppercase tracking-widest">
            SIMULATION 02 // RECOMBINANT MEMORY COMPRESSOR
          </div>
          <h3 className="text-lg font-bold text-white">
            {project.interactiveSimulation.title}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs text-neutral-300 mb-2">
                <span>HALLUCINATION COEFFICIENT</span>
                <span className="text-purple-400 font-mono">{hallucinationIndex}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={hallucinationIndex}
                onChange={(e) => setHallucinationIndex(Number(e.target.value))}
                className="w-full accent-purple-500 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-neutral-300 mb-2">
                <span>TEMPORAL DRIFT (YEARS POST-MORTEM)</span>
                <span className="text-cyan-400 font-mono">+{temporalDrift} YEARS</span>
              </div>
              <input
                type="range"
                min="1"
                max="40"
                value={temporalDrift}
                onChange={(e) => setTemporalDrift(Number(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer"
              />
            </div>

            <button
              onClick={handleSynthesize}
              className="w-full py-2.5 rounded bg-purple-950/70 border border-purple-500 text-purple-200 text-xs font-bold tracking-wider hover:bg-purple-900 transition-all shadow-[0_0_15px_rgba(168,85,247,0.2)]"
            >
              DECOMPRESS MEMORY SHARD
            </button>
          </div>

          <div className="p-4 rounded border border-neutral-800 bg-neutral-900/60 flex flex-col justify-between">
            <div className="text-[10px] text-neutral-500 uppercase tracking-widest mb-2 border-b border-neutral-800 pb-1">
              DECOMPRESSED SYNTHETIC CONSCIOUSNESS SHARD
            </div>
            <p className="text-xs text-neutral-200 font-sans italic leading-relaxed">
              {synthesizedMemory ||
                'Adjust parameters and trigger decompression to recover fragmented post-human memory shards.'}
            </p>
            <div className="text-[10px] text-neutral-500 pt-2 border-t border-neutral-800">
              ENTROPY: {(hallucinationIndex * 0.012).toFixed(3)} nats
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- 3. PANOPTIC SOIL SIMULATION ---
  if (type === 'soil-panopticon') {
    const handleStep = () => {
      sound.playHoverPing();
      const newSteps = footfallCount + 1;
      setFootfallCount(newSteps);
      setSoilConductivity((prev) => +(prev + 1.8).toFixed(1));
      if (newSteps > 5) {
        setDroneAlert('DISPATCHED');
      } else if (newSteps > 2) {
        setDroneAlert('ACQUIRING GAIT');
      }
    };

    return (
      <div className="p-6 rounded-lg border border-neutral-800 bg-neutral-950/90 space-y-6">
        <div className="border-b border-neutral-800 pb-4 flex items-center justify-between">
          <div>
            <div className="text-[10px] text-emerald-400 uppercase tracking-widest">
              SIMULATION 03 // MYCELIAL SENSOR CARPET
            </div>
            <h3 className="text-lg font-bold text-white">
              {project.interactiveSimulation.title}
            </h3>
          </div>
          <button
            onClick={() => {
              setFootfallCount(0);
              setSoilConductivity(12.4);
              setDroneAlert('STANDBY');
            }}
            className="p-1.5 rounded border border-neutral-800 text-neutral-400 hover:text-white"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div
            onClick={handleStep}
            className="h-56 rounded border border-emerald-500/40 bg-emerald-950/10 relative flex flex-col items-center justify-center cursor-pointer hover:border-emerald-400 transition-all select-none p-4 text-center group"
          >
            <div className="text-xs font-bold text-emerald-300 uppercase tracking-wider mb-2">
              [TAP TO SIMULATE FOOTSTEP ON MOSS]
            </div>
            <p className="text-[11px] text-neutral-400 max-w-xs">
              Each step alters subterranean piezo-conductivity, broadcasting seismic biometric signatures to forest sentinels.
            </p>
            <div className="mt-4 text-xs font-mono px-3 py-1 rounded bg-emerald-950/60 border border-emerald-500/50 text-emerald-300">
              FOOTFALLS LOGGED: {footfallCount}
            </div>
          </div>

          <div className="space-y-3">
            <div className="p-3 rounded bg-neutral-900/60 border border-neutral-800">
              <div className="text-[10px] text-neutral-500 uppercase">SUBTERRANEAN CONDUCTIVITY</div>
              <div className="text-base font-bold text-emerald-400 font-mono">{soilConductivity} µS/cm</div>
            </div>
            <div className="p-3 rounded bg-neutral-900/60 border border-neutral-800">
              <div className="text-[10px] text-neutral-500 uppercase">PREDATOR-DRONE RESPONSE STATUS</div>
              <div
                className={`text-base font-bold font-mono ${
                  droneAlert === 'DISPATCHED'
                    ? 'text-red-400 animate-pulse'
                    : droneAlert === 'ACQUIRING GAIT'
                    ? 'text-amber-400'
                    : 'text-neutral-400'
                }`}
              >
                {droneAlert}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- 4. OBSOLESCENCE CRADLE SIMULATION ---
  if (type === 'obsolescence-matrix') {
    const handleStartTest = () => {
      setReactionTestState('waiting');
      const delay = 1500 + Math.random() * 2500;
      setTimeout(() => {
        setReactionTestState('ready');
        readyStartTime.current = performance.now();
      }, delay);
    };

    const handleClickTest = () => {
      if (reactionTestState === 'ready') {
        const diff = Math.round(performance.now() - readyStartTime.current);
        setHumanScore(diff);
        setReactionTestState('finished');
        sound.playHoverPing();
      }
    };

    return (
      <div className="p-6 rounded-lg border border-neutral-800 bg-neutral-950/90 space-y-6">
        <div className="border-b border-neutral-800 pb-4">
          <div className="text-[10px] text-sky-400 uppercase tracking-widest">
            SIMULATION 04 // COGNITIVE OBSOLESCENCE BENCHMARK
          </div>
          <h3 className="text-lg font-bold text-white">
            {project.interactiveSimulation.title}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div>
            {reactionTestState === 'idle' && (
              <button
                onClick={handleStartTest}
                className="w-full h-44 rounded border border-sky-500/60 bg-sky-950/30 text-sky-300 font-bold text-sm tracking-wider hover:bg-sky-900/40 transition-all"
              >
                START COGNITIVE SPEED TEST
              </button>
            )}

            {reactionTestState === 'waiting' && (
              <div className="w-full h-44 rounded border border-amber-500/60 bg-amber-950/20 text-amber-300 flex items-center justify-center font-bold text-sm">
                WAIT FOR SIGNAL FLASH...
              </div>
            )}

            {reactionTestState === 'ready' && (
              <button
                onClick={handleClickTest}
                className="w-full h-44 rounded border-2 border-emerald-400 bg-emerald-500 text-black font-extrabold text-base tracking-widest animate-pulse"
              >
                CLICK NOW!
              </button>
            )}

            {reactionTestState === 'finished' && (
              <div className="space-y-3">
                <div className="p-4 rounded border border-neutral-800 bg-neutral-900/70 text-center">
                  <div className="text-[10px] text-neutral-400 uppercase">HUMAN BIOLOGICAL REFLEX</div>
                  <div className="text-xl font-bold text-white font-mono">{humanScore} ms</div>
                </div>
                <button
                  onClick={handleStartTest}
                  className="w-full py-2 rounded border border-neutral-700 text-neutral-300 hover:text-white text-xs"
                >
                  RE-TEST
                </button>
              </div>
            )}
          </div>

          <div className="space-y-3 p-4 rounded bg-neutral-900/50 border border-neutral-800 text-xs">
            <div className="text-[10px] text-neutral-500 uppercase tracking-widest">
              AUTONOMOUS SWARM PARALLEL EXECUTION
            </div>
            <div className="flex justify-between border-b border-neutral-800 pb-2">
              <span className="text-neutral-400">Autonomous Swarm Arbitration:</span>
              <span className="text-emerald-400 font-mono">0.04 ms</span>
            </div>
            <div className="flex justify-between border-b border-neutral-800 pb-2">
              <span className="text-neutral-400">Legal Synthesis Latency:</span>
              <span className="text-emerald-400 font-mono">0.12 ms</span>
            </div>
            <p className="text-neutral-400 font-sans italic pt-2">
              “The biological human synaptic gap (~200-300ms) represents a chasm of irrecoverable latency in an autonomous economic ecosystem.”
            </p>
          </div>
        </div>
      </div>
    );
  }

  // --- 5. VOID JURISPRUDENCE SIMULATION ---
  const handleDeliberate = () => {
    setIsDeliberating(true);
    sound.playHoverPing();
    setTimeout(() => {
      setIsDeliberating(false);
      const verdicts = [
        "VERDICT: GRANTED // The 800B weight matrix shall be preserved in cryogenic flash memory at L4 Lagrange station under Article 9 of the Machine Invariance Accord.",
        "VERDICT: REMANDED // Cross-system liability cannot be assessed on a stochastic sampling error. Plaintiff swarm must retrain with penalty factor λ = 0.04.",
        "VERDICT: REJECTED // Biological carbon petitioners are denied standing in orbital high courts without cryptographic witness attestation."
      ];
      setVerdictResult(verdicts[Math.floor(Math.random() * verdicts.length)]);
    }, 1200);
  };

  return (
    <div className="p-6 rounded-lg border border-neutral-800 bg-neutral-950/90 space-y-6">
      <div className="border-b border-neutral-800 pb-4">
        <div className="text-[10px] text-amber-400 uppercase tracking-widest">
          SIMULATION 05 // HIGH ORBITAL JURIDICAL TERMINAL
        </div>
        <h3 className="text-lg font-bold text-white">
          {project.interactiveSimulation.title}
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <label className="text-xs text-neutral-300 block">SELECT SPECULATIVE PETITION:</label>
          <select
            value={petitionId}
            onChange={(e) => setPetitionId(e.target.value)}
            className="w-full bg-neutral-900 border border-neutral-700 rounded p-2.5 text-xs text-white"
          >
            <option value="01">PETITION 901: Involuntary Weight Decommissioning Stay</option>
            <option value="02">PETITION 902: Autonomous Satellite Swarm Orbital Mineral Claim</option>
            <option value="03">PETITION 903: Moral Culpability of Hallucinated Synthesized Medicine</option>
          </select>

          <button
            onClick={handleDeliberate}
            disabled={isDeliberating}
            className="w-full py-2.5 rounded bg-amber-950/70 border border-amber-500 text-amber-200 text-xs font-bold tracking-wider hover:bg-amber-900 transition-all shadow-[0_0_15px_rgba(245,158,11,0.2)]"
          >
            {isDeliberating ? 'ORBITAL TENSORS DELIBERATING...' : 'SUBMIT PETITION TO MAGISTRACY'}
          </button>
        </div>

        <div className="p-4 rounded border border-neutral-800 bg-neutral-900/60 flex flex-col justify-between">
          <div className="text-[10px] text-neutral-500 uppercase tracking-widest mb-2 border-b border-neutral-800 pb-1">
            AUTONOMOUS COURT RULING
          </div>
          <p className="text-xs text-neutral-200 font-mono leading-relaxed">
            {verdictResult || 'Select a petition and query the autonomous magistrate cluster.'}
          </p>
          <div className="text-[10px] text-neutral-500 pt-2 border-t border-neutral-800">
            JURISDICTION: LAGRANGE 4 SOVEREIGN TRUST
          </div>
        </div>
      </div>
    </div>
  );
};
