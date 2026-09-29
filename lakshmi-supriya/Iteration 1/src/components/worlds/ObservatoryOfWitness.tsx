/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Eye, ArrowRight, Disc, Crosshair, Sparkles, Compass, Activity, Sliders } from 'lucide-react';
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
 * DRASHTA: The Astronomical Astrolabe & Celestial Observatory
 * Distinct Layout: Brass Astrolabe Rings with Optical Crosshair Sighting & Aperture Shutter
 * Law of Reality: Observation changes visibility (OBSERVE)
 * Physics: Crystalline Snappy with Crisp Optical Click Recoil
 */
export const ObservatoryOfWitness: React.FC<WorldProps> = ({
  worldData,
  onSelectProject,
  onLeaveWorld,
  onShapeshiftTo,
  isSpringActive,
  onTriggerSpring,
}) => {
  const [focalLength, setFocalLength] = useState<number>(85);
  const [activeReticleId, setActiveReticleId] = useState<string | null>(worldData.projects[0]?.id || null);

  return (
    <div className={`relative min-h-screen w-full bg-[#020611] text-sky-100 px-4 sm:px-8 pt-24 pb-28 ${isSpringActive ? 'animate-spring-rebound' : ''}`}>
      {/* Astrolabe Constellation Grid Backdrop */}
      <div className="absolute inset-0 bg-noise opacity-20 pointer-events-none" />
      <div className="absolute top-1/4 left-1/3 w-[600px] h-[600px] bg-sky-500/10 rounded-full blur-[180px] pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto space-y-8">
        {/* Brass Astrolabe Azimuth Ring Header */}
        <header className="rounded-3xl bg-slate-950/95 border-2 border-amber-500/40 p-6 sm:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.25em] text-amber-400">
                <Crosshair className="w-3.5 h-3.5 text-amber-400" />
                <span>Jantar Mantar Astrolabe · Celestial Azimuth 142° · Reticle F/{focalLength}</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-serif text-white tracking-tight font-normal">
                {worldData.studentName}
              </h1>
              <p className="text-sm sm:text-base text-sky-200/80 max-w-2xl font-serif italic leading-relaxed">
                "{worldData.summarySnippet}"
              </p>
            </div>

            {/* In-World Optical Aperture Spring Trigger */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => {
                  audioEngine.playTactileClick();
                  onTriggerSpring?.();
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-mono transition-all cursor-pointer shadow-lg ${
                  isSpringActive
                    ? 'bg-amber-400 text-slate-950 border-amber-300 ring-2 ring-amber-400/50 scale-105'
                    : 'bg-amber-950/70 hover:bg-amber-900/70 text-amber-200 border-amber-700/60'
                }`}
                title="Snap Optical Aperture Diaphragm / Test Shutter Recoil"
              >
                <Activity className={`w-3.5 h-3.5 ${isSpringActive ? 'animate-spin' : 'text-amber-400'}`} />
                <span>{isSpringActive ? 'Aperture Diaphragm Snapped!' : 'Test Spring (Snap Shutter)'}</span>
              </button>

              {onLeaveWorld && (
                <button
                  onClick={() => {
                    audioEngine.playTactileClick();
                    onLeaveWorld();
                  }}
                  className="px-3.5 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-xs font-mono text-sky-300 transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Compass className="w-3.5 h-3.5 text-amber-400" />
                  <span>Mandala</span>
                </button>
              )}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-900 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-slate-400">
            <div className="flex items-center gap-3">
              <span className="text-amber-400">Optical Law:</span>
              <span className="text-white font-semibold">{worldData.worldSystem?.lawOfReality || 'Observation changes visibility'}</span>
              <span>·</span>
              <span className="text-sky-400">Optic Relic:</span>
              <span className="text-white">{worldData.storageArtefact}</span>
            </div>
            <div className="text-[11px] text-amber-300/80">
              <span>Aperture Recoil: 12ms · Brass Azimuth Scale</span>
            </div>
          </div>
        </header>

        {/* Observatory Telescope Reticle Deck */}
        <div className="rounded-3xl bg-slate-950/90 border-2 border-slate-800 p-6 sm:p-8 backdrop-blur-md shadow-2xl space-y-6">
          {/* Vernier Optical Zoom Calibration Bar */}
          <div className="rounded-2xl bg-slate-900/80 border border-slate-700 p-4 flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
            <div className="flex items-center gap-2 text-amber-400 font-bold uppercase tracking-wider text-[11px]">
              <Eye className="w-4 h-4" />
              <span>Vernier Sighting Calibration:</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-slate-400">Lens Focal:</span>
              {[50, 85, 135, 200].map((f) => (
                <button
                  key={f}
                  onClick={() => {
                    audioEngine.playTactileClick();
                    setFocalLength(f);
                  }}
                  className={`px-3 py-1 rounded-lg border text-xs font-mono transition-all cursor-pointer ${
                    focalLength === f
                      ? 'bg-amber-500 text-slate-950 font-bold border-amber-300'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-amber-400'
                  }`}
                >
                  {f}mm
                </button>
              ))}
            </div>
          </div>

          {/* Sighting Reticle Relics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
            {worldData.projects.map((project, idx) => (
              <div
                key={project.id}
                onClick={() => {
                  audioEngine.playTactileClick();
                  onSelectProject(project);
                }}
                className={`rounded-2xl border-2 transition-all duration-300 p-6 backdrop-blur-md cursor-pointer select-none bg-slate-900/70 border-slate-800 hover:border-amber-400 shadow-xl ${
                  isSpringActive ? 'animate-spring-vibrate' : ''
                }`}
              >
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 font-mono text-xs text-sky-400">
                  <span className="font-bold text-amber-400 uppercase tracking-wider">
                    {project.artefact || project.artefactType}
                  </span>
                  <span>{project.year}</span>
                </div>

                <div className="py-4 space-y-2">
                  <h2 className="text-xl font-serif text-white group-hover:text-amber-200 font-medium">
                    {project.title}
                  </h2>
                  <p className="text-xs text-slate-300 font-serif leading-relaxed line-clamp-3">
                    {project.summary}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-amber-400">
                  <span className="flex items-center gap-1">
                    <span>Focus Aperture</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                  <span className="text-[10px] text-slate-500">Reticle #{idx + 1}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
