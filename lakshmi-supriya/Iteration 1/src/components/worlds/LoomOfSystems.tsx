/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Network, ArrowRight, Activity, Zap, Compass, Sparkles, Sliders } from 'lucide-react';
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
 * TANTUVID: The Jacquard Handloom & Harmonic Thread Matrix
 * Distinct Layout: Full-Screen Jacquard Handloom Canvas with Taut Silk Warp Strings & Shuttles
 * Law of Reality: Everything is connected (CONNECT)
 * Physics: Spring Elastic with Sinusoidal Thread Strum
 */
export const LoomOfSystems: React.FC<WorldProps> = ({
  worldData,
  onSelectProject,
  onLeaveWorld,
  onShapeshiftTo,
  isSpringActive,
  onTriggerSpring,
}) => {
  const [activeThreadIdx, setActiveThreadIdx] = useState<number>(0);
  const [shuttlePosition, setShuttlePosition] = useState<number>(50);

  const warpThreads = [
    { name: 'Kosa Raw Silk', color: '#F59E0B', freq: 440 },
    { name: 'Peacock Indigo', color: '#06B6D4', freq: 523 },
    { name: 'Madder Root', color: '#EF4444', freq: 659 },
    { name: 'Forest Tussar', color: '#10B981', freq: 784 },
    { name: 'Golden Zari', color: '#EAB308', freq: 880 },
  ];

  const handleStrumThread = (idx: number) => {
    audioEngine.playTactileClick();
    setActiveThreadIdx(idx);
    setShuttlePosition((idx / (warpThreads.length - 1)) * 80 + 10);
  };

  return (
    <div className={`relative min-h-screen w-full bg-[#050811] text-indigo-100 px-4 sm:px-8 pt-24 pb-28 ${isSpringActive ? 'animate-spring-rebound' : ''}`}>
      {/* Taut Loom Frame Backing */}
      <div className="absolute inset-0 bg-noise opacity-30 pointer-events-none" />
      <div className="absolute top-1/4 right-1/4 w-[550px] h-[550px] bg-indigo-600/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto space-y-8">
        {/* Handloom Reed-Beater Header Frame */}
        <header className="rounded-3xl bg-slate-950/95 border-2 border-indigo-500/40 p-6 sm:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.25em] text-indigo-400">
                <Network className="w-3.5 h-3.5 text-indigo-400" />
                <span>Jacquard Loom · Warp & Weft Ledger · 120 Ends/Inch</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-serif text-white tracking-tight font-normal">
                {worldData.studentName}
              </h1>
              <p className="text-sm sm:text-base text-indigo-200/80 max-w-2xl font-serif italic leading-relaxed">
                "{worldData.summarySnippet}"
              </p>
            </div>

            {/* In-World Strum Warp Foot Treadle Spring Trigger */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => {
                  audioEngine.playTactileClick();
                  onTriggerSpring?.();
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-mono transition-all cursor-pointer shadow-lg ${
                  isSpringActive
                    ? 'bg-indigo-400 text-slate-950 border-indigo-300 ring-2 ring-indigo-400/50 scale-105'
                    : 'bg-indigo-950/80 hover:bg-indigo-900/80 text-indigo-200 border-indigo-700/60'
                }`}
                title="Strum Loom Warp Strings / Test Harmonic Tension"
              >
                <Activity className={`w-3.5 h-3.5 ${isSpringActive ? 'animate-spin' : 'text-indigo-400'}`} />
                <span>{isSpringActive ? 'Silk Warp Strings Strummed!' : 'Test Spring (Strum Loom)'}</span>
              </button>

              {onLeaveWorld && (
                <button
                  onClick={() => {
                    audioEngine.playTactileClick();
                    onLeaveWorld();
                  }}
                  className="px-3.5 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-xs font-mono text-indigo-300 transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Compass className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Mandala</span>
                </button>
              )}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-indigo-950 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-indigo-300/70">
            <div className="flex items-center gap-3">
              <span className="text-amber-400">Connection Law:</span>
              <span className="text-white font-semibold">{worldData.worldSystem?.lawOfReality || 'Everything is connected'}</span>
              <span>·</span>
              <span className="text-cyan-400">Woven Relic:</span>
              <span className="text-white">{worldData.storageArtefact}</span>
            </div>
            <div className="text-[11px]">
              <span>Tension: 220 N · Warp Count: 5 Tonal Channels</span>
            </div>
          </div>
        </header>

        {/* The Loom Warp Canvas with Interactive Taut Strings */}
        <div className="rounded-3xl bg-slate-950/90 border-2 border-indigo-900/50 p-6 sm:p-8 backdrop-blur-md shadow-2xl space-y-6">
          {/* Strummable Warp Strings Bar */}
          <div className="rounded-2xl bg-indigo-950/50 border border-indigo-800/40 p-4 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-indigo-300">
              <div className="flex items-center gap-2 uppercase tracking-wider font-bold">
                <Sliders className="w-4 h-4 text-amber-400" />
                <span>Warp Silk Strings (Click to Strum):</span>
              </div>
              <span className="text-[11px] text-indigo-400">
                Active Thread: {warpThreads[activeThreadIdx].name}
              </span>
            </div>

            {/* Visual String Array */}
            <div className="h-16 flex items-center justify-around gap-2 px-4 py-2 bg-slate-950/80 rounded-xl border border-indigo-950">
              {warpThreads.map((thread, idx) => (
                <div
                  key={idx}
                  onClick={() => handleStrumThread(idx)}
                  className="group relative flex-1 h-full flex flex-col items-center justify-center cursor-pointer"
                >
                  <div
                    className={`w-1 rounded-full transition-all duration-300 ${
                      activeThreadIdx === idx || isSpringActive
                        ? 'h-full scale-y-110 shadow-[0_0_12px_currentColor]'
                        : 'h-4/5 opacity-60 group-hover:opacity-100 group-hover:h-full'
                    }`}
                    style={{ backgroundColor: thread.color, color: thread.color }}
                  />
                  <span className="text-[9px] font-mono mt-1 text-slate-400 group-hover:text-white">
                    {thread.name.split(' ')[0]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Woven Tapestry Relics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
            {worldData.projects.map((project, idx) => (
              <div
                key={project.id}
                onClick={() => {
                  audioEngine.playTactileClick();
                  onSelectProject(project);
                }}
                className={`rounded-2xl border-2 transition-all duration-300 p-6 backdrop-blur-md cursor-pointer select-none bg-slate-950/80 border-indigo-900/60 hover:border-indigo-400 shadow-xl ${
                  isSpringActive ? 'animate-spring-vibrate' : ''
                }`}
              >
                <div className="flex items-center justify-between pb-3 border-b border-indigo-950 font-mono text-xs text-indigo-300">
                  <span className="font-bold text-amber-400 uppercase tracking-wider">
                    {project.artefact || project.artefactType}
                  </span>
                  <span>{project.year}</span>
                </div>

                <div className="py-4 space-y-2">
                  <h2 className="text-xl font-serif text-white group-hover:text-indigo-200 font-medium">
                    {project.title}
                  </h2>
                  <p className="text-xs text-slate-300 font-serif leading-relaxed line-clamp-3">
                    {project.summary}
                  </p>
                </div>

                <div className="pt-3 border-t border-indigo-950 flex items-center justify-between text-xs font-mono text-indigo-400">
                  <span className="flex items-center gap-1">
                    <span>Inspect Tapestry</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                  <span className="text-[10px] text-slate-500">Node #{idx + 1}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
