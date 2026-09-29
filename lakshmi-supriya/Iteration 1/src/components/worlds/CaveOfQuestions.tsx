/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { Compass, ArrowRight, MapPin, Eye, Mountain, Sparkles, Navigation, Activity } from 'lucide-react';
import { StudentWorld, ProjectNode } from '../../types/shapeshifter';
import { audioEngine } from '../../services/audioEngine';

interface WorldProps {
  worldData: StudentWorld;
  onSelectProject: (project: ProjectNode) => void;
  onLeaveWorld?: () => void;
  onShapeshiftTo?: (worldId: string) => void;
  isSpringActive?: boolean;
  onTriggerSpring?: () => void;
}

/**
 * ANVESHIN: The Subterranean Archaeological Trench
 * Distinct Layout: Subterranean Basalt Stratigraphy with Interactive Torchlight & Depth Gauge
 * Law of Reality: Light reveals (DISCOVER)
 * Physics: Crystalline Snappy with Seismic Shockwave Recoil
 */
export const CaveOfQuestions: React.FC<WorldProps> = ({
  worldData,
  onSelectProject,
  onLeaveWorld,
  onShapeshiftTo,
  isSpringActive,
  onTriggerSpring,
}) => {
  const [torchPos, setTorchPos] = useState<{ x: number; y: number }>({ x: 450, y: 320 });
  const [activeStratumId, setActiveStratumId] = useState<string | null>(worldData.projects[0]?.id || null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setTorchPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const depthStrata = [
    { label: 'Datum 0.0m', name: 'Upper Weathered Alluvium', depth: '0m', color: '#10B981' },
    { label: '-12.0m Depth', name: 'Stepwell Aquifer Level', depth: '-12m', color: '#059669' },
    { label: '-24.0m Depth', name: 'Basalt Epigraphic Cavity', depth: '-24m', color: '#047857' },
    { label: '-36.0m Depth', name: 'Subterranean Reservoir Vault', depth: '-36m', color: '#065F46' },
  ];

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className={`relative min-h-screen w-full bg-[#05070A] text-emerald-100 px-4 sm:px-8 pt-24 pb-28 overflow-hidden cursor-crosshair select-none ${
        isSpringActive ? 'animate-spring-rebound' : ''
      }`}
    >
      {/* Dynamic Flashlight Spotlight Cone following pointer */}
      <div
        className="pointer-events-none absolute inset-0 z-20 transition-opacity duration-200"
        style={{
          background: isSpringActive
            ? `radial-gradient(circle 480px at ${torchPos.x}px ${torchPos.y}px, rgba(16, 185, 129, 0.15) 0%, rgba(5, 7, 10, 0.6) 50%, rgba(3, 4, 6, 0.98) 85%)`
            : `radial-gradient(circle 320px at ${torchPos.x}px ${torchPos.y}px, transparent 0%, rgba(5, 7, 10, 0.45) 55%, rgba(3, 4, 6, 0.97) 90%)`,
        }}
      />

      {/* Basalt Rock Texture Noise Backdrop */}
      <div className="absolute inset-0 bg-noise opacity-30 pointer-events-none" />

      <div className="relative z-30 max-w-6xl mx-auto space-y-8">
        {/* Trench Rock Face Header with Geological Markings */}
        <header className="rounded-3xl bg-slate-950/90 border-2 border-emerald-900/50 p-6 sm:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-2 h-full bg-emerald-500/80" />

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pl-2">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.25em] text-emerald-400">
                <Mountain className="w-3.5 h-3.5 text-emerald-400" />
                <span>Geological Trench Excavation · Stratum Cut · Sector 23°N</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-serif text-white tracking-tight font-normal">
                {worldData.studentName}
              </h1>
              <p className="text-sm sm:text-base text-emerald-200/80 max-w-2xl font-serif italic leading-relaxed">
                "{worldData.summarySnippet}"
              </p>
            </div>

            {/* In-World Seismic Spring Geophone Trigger */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => {
                  audioEngine.playTactileClick();
                  onTriggerSpring?.();
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-mono transition-all cursor-pointer shadow-lg ${
                  isSpringActive
                    ? 'bg-emerald-400 text-slate-950 border-emerald-300 ring-2 ring-emerald-400/50 scale-105'
                    : 'bg-emerald-950/70 hover:bg-emerald-900/70 text-emerald-200 border-emerald-700/60'
                }`}
                title="Test Seismic Geophone Spring Shockwave"
              >
                <Activity className={`w-3.5 h-3.5 ${isSpringActive ? 'animate-spin' : 'text-emerald-400'}`} />
                <span>{isSpringActive ? 'Seismic Shockwave Fired!' : 'Test Spring (Seismic Pulse)'}</span>
              </button>

              {onLeaveWorld && (
                <button
                  onClick={() => {
                    audioEngine.playTactileClick();
                    onLeaveWorld();
                  }}
                  className="px-3.5 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-xs font-mono text-emerald-300 transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Compass className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Mandala</span>
                </button>
              )}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-emerald-950 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-slate-400 pl-2">
            <div className="flex items-center gap-3">
              <span className="text-emerald-400">Law:</span>
              <span className="text-white font-semibold">{worldData.worldSystem?.lawOfReality || 'Light reveals'}</span>
              <span>·</span>
              <span className="text-emerald-400">Artefact:</span>
              <span className="text-white">{worldData.storageArtefact}</span>
            </div>
            <div className="text-[11px] text-emerald-400/80">
              <span>Coordinates: 23°13'N 72°37'E · Datum: -36.0m</span>
            </div>
          </div>
        </header>

        {/* Stratigraphic Layout: Left Column Strata Gauge, Right Column Exposed Relic Cavities */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Depth Strata Gauge Column */}
          <div className="lg:col-span-4 rounded-3xl bg-slate-950/85 border-2 border-emerald-900/40 p-5 space-y-5 font-mono text-xs backdrop-blur-md shadow-xl">
            <div className="flex items-center gap-2 pb-3 border-b border-emerald-950 text-emerald-400 font-bold uppercase tracking-wider text-[11px]">
              <Mountain className="w-4 h-4" />
              <span>Stratigraphic Depth Log</span>
            </div>

            <div className="space-y-4">
              {depthStrata.map((stratum, i) => (
                <div key={i} className="space-y-1.5 p-2 rounded-xl bg-slate-900/40 border border-slate-800/60">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-emerald-300 font-bold">{stratum.label}</span>
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: stratum.color }} />
                  </div>
                  <div className="text-xs text-slate-300 font-sans">{stratum.name}</div>
                  <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                    <div className="h-full transition-all duration-700" style={{ width: `${(i + 1) * 25}%`, backgroundColor: stratum.color }} />
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/30 text-[11px] text-emerald-300/90 leading-relaxed font-sans">
              <span className="font-bold font-mono">Torch Interaction:</span> Move your cursor across the stone wall to illuminate subterranean epigraphs and hidden relics.
            </div>
          </div>

          {/* Right Column: Exposed Archaeological Epigraph Vaults */}
          <div className="lg:col-span-8 space-y-5">
            {worldData.projects.map((project, idx) => {
              const isSelected = activeStratumId === project.id;

              return (
                <div
                  key={project.id}
                  onClick={() => {
                    audioEngine.playTactileClick();
                    setActiveStratumId(project.id);
                  }}
                  className={`rounded-3xl border-2 transition-all duration-300 p-6 sm:p-7 backdrop-blur-md cursor-pointer select-none ${
                    isSelected
                      ? 'bg-slate-950/95 border-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.2)]'
                      : 'bg-slate-950/70 border-slate-800/80 hover:border-emerald-800/70'
                  } ${isSpringActive ? 'animate-spring-vibrate' : ''}`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
                    <div className="flex items-center gap-3">
                      <div className="px-3 py-1 rounded-lg bg-emerald-950 border border-emerald-700/60 text-emerald-300 font-mono text-xs font-bold">
                        LAYER -0{idx + 1}
                      </div>
                      <span className="text-xs font-mono uppercase text-emerald-400 font-semibold tracking-wider">
                        {project.artefact || project.artefactType}
                      </span>
                    </div>
                    <span className="text-xs font-mono text-slate-400">
                      {project.year} · Datum Level
                    </span>
                  </div>

                  <div className="pt-4 space-y-3">
                    <h2 className="text-xl sm:text-2xl font-serif text-white group-hover:text-emerald-200 font-normal">
                      {project.title}
                    </h2>
                    <p className="text-sm text-slate-300 font-serif leading-relaxed line-clamp-3">
                      {project.summary}
                    </p>

                    <div className="pt-3 flex flex-wrap items-center justify-between gap-4">
                      <div className="flex flex-wrap gap-1.5">
                        {project.tags?.map((tag, tIdx) => (
                          <span
                            key={tIdx}
                            className="px-2 py-0.5 rounded bg-slate-900 border border-emerald-900/50 text-[10px] font-mono text-emerald-300"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          audioEngine.playTactileClick();
                          onSelectProject(project);
                        }}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-mono text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer ml-auto"
                      >
                        <span>Examine Relic</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
