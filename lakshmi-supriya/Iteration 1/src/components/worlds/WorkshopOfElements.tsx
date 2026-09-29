/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Wrench, ArrowRight, CheckCircle2, RotateCw, Hammer, Ruler, Scissors, Compass, Cog, Activity } from 'lucide-react';
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
 * KARIGARA: The Blueprint Drafting Workbench & Joinery Shop
 * Distinct Layout: Industrial Blueprint Cutting Mat with ISO Title Block, Tool Rack & Snap Joints
 * Law of Reality: Objects assemble (ASSEMBLE)
 * Physics: Spring Elastic with High Rebound & Metallic Click
 */
export const WorkshopOfElements: React.FC<WorldProps> = ({
  worldData,
  onSelectProject,
  onLeaveWorld,
  onShapeshiftTo,
  isSpringActive,
  onTriggerSpring,
}) => {
  const [assembledStates, setAssembledStates] = useState<Record<string, boolean>>({
    [worldData.projects[0]?.id || '']: true,
  });

  const handleToggleAssembly = (projectId: string) => {
    audioEngine.playTactileClick();
    setAssembledStates((prev) => ({
      ...prev,
      [projectId]: !prev[projectId],
    }));
  };

  const workshopTools = [
    { name: 'Brass Calipers', icon: Compass },
    { name: 'Tenon Saw', icon: Scissors },
    { name: 'Bench Vice', icon: Wrench },
    { name: 'Thread Die', icon: Cog },
    { name: 'Drafting Square', icon: Ruler },
  ];

  return (
    <div className={`relative min-h-screen w-full bg-[#081324] text-cyan-50 px-4 sm:px-8 pt-24 pb-28 ${isSpringActive ? 'animate-spring-rebound' : ''}`}>
      {/* Blueprint Grid Backdrop Pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-25"
        style={{
          backgroundImage: `linear-gradient(#00ADB5 1px, transparent 1px), linear-gradient(90deg, #00ADB5 1px, transparent 1px)`,
          backgroundSize: '28px 28px',
        }}
      />
      <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto space-y-8">
        {/* ISO 9001 Technical Drafting Schematic Header Block */}
        <header className="rounded-3xl bg-[#0B1A30]/95 border-2 border-cyan-500/40 p-6 sm:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
          {/* Engineering Title Block Frame Corner */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.25em] text-cyan-400">
                <Wrench className="w-3.5 h-3.5" />
                <span>Schematic DWG-2026 · Tolerance ±0.02mm · Scale 1:1</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-mono uppercase tracking-tight text-white font-bold">
                {worldData.studentName}
              </h1>
              <p className="text-sm sm:text-base text-cyan-200/80 max-w-2xl font-mono leading-relaxed">
                "{worldData.summarySnippet}"
              </p>
            </div>

            {/* In-World Micrometer Spring Elasticity Actuator */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => {
                  audioEngine.playTactileClick();
                  onTriggerSpring?.();
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-mono transition-all cursor-pointer shadow-lg ${
                  isSpringActive
                    ? 'bg-cyan-400 text-slate-950 border-cyan-300 ring-2 ring-cyan-400/50 scale-105'
                    : 'bg-cyan-950/80 hover:bg-cyan-900/80 text-cyan-200 border-cyan-600/50'
                }`}
                title="Test Workbench Spring Elasticity & Snap-Lock"
              >
                <Activity className={`w-3.5 h-3.5 ${isSpringActive ? 'animate-spin' : 'text-cyan-400'}`} />
                <span>{isSpringActive ? 'High-Tension Snap Active!' : 'Test Spring (Elasticity)'}</span>
              </button>

              {onLeaveWorld && (
                <button
                  onClick={() => {
                    audioEngine.playTactileClick();
                    onLeaveWorld();
                  }}
                  className="px-3.5 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-cyan-700/40 text-xs font-mono text-cyan-300 transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Compass className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Mandala</span>
                </button>
              )}
            </div>
          </div>

          {/* Technical Drawing Spec Bar */}
          <div className="mt-6 pt-4 border-t border-cyan-900/60 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-cyan-400/70">
            <div className="flex items-center gap-3">
              <span className="text-cyan-300 font-bold">Assembly Law:</span>
              <span className="text-white">{worldData.worldSystem?.lawOfReality || 'Objects assemble'}</span>
              <span>·</span>
              <span className="text-cyan-300 font-bold">Storage:</span>
              <span className="text-white">{worldData.storageArtefact}</span>
            </div>
            <div className="text-[11px]">
              <span>Tension: 240 N/m · Snap Force: 9.8N · Material: Sheesham & Steel</span>
            </div>
          </div>
        </header>

        {/* Workbench Tool Rail & Metric Cutting Mat */}
        <div className="rounded-3xl bg-[#091528]/90 border-2 border-cyan-600/30 p-5 sm:p-7 backdrop-blur-md shadow-2xl space-y-6">
          {/* Magnetic Tool Rail */}
          <div className="rounded-2xl bg-[#0C1E38] border border-cyan-500/30 p-3 sm:p-4 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center gap-2 text-cyan-400 font-bold uppercase tracking-wider text-[11px]">
              <Ruler className="w-4 h-4" />
              <span>Magnetic Tool Fixtures:</span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {workshopTools.map((t, idx) => {
                const IconComp = t.icon;
                return (
                  <div
                    key={idx}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#071324] border border-cyan-700/50 text-cyan-300 text-[11px] shadow-inner"
                  >
                    <IconComp className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{t.name}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Millimeter Scale Ruler Strip */}
          <div className="w-full h-6 rounded bg-[#0A1A32] border border-cyan-600/40 flex items-center justify-between px-3 text-[9px] font-mono text-cyan-400/70 overflow-hidden select-none">
            <span>| 0mm</span>
            <span>· 50mm</span>
            <span>| 100mm</span>
            <span>· 150mm</span>
            <span>| 200mm</span>
            <span>· 250mm</span>
            <span>| 300mm</span>
            <span>· 350mm</span>
            <span>| 400mm</span>
            <span>· 450mm</span>
            <span>| 500mm</span>
          </div>

          {/* Isometric Assembly Part Stations Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {worldData.projects.map((project, idx) => {
              const isAssembled = assembledStates[project.id];

              return (
                <div
                  key={project.id}
                  className={`rounded-2xl border-2 transition-all duration-300 p-6 backdrop-blur-sm ${
                    isAssembled
                      ? 'bg-[#0E223F] border-cyan-400 shadow-[0_0_25px_rgba(0,173,181,0.2)]'
                      : 'bg-[#0A182C] border-cyan-900/60'
                  } ${isSpringActive ? 'animate-spring-vibrate' : ''}`}
                >
                  <div className="flex items-center justify-between pb-3 border-b border-cyan-900/60 font-mono text-xs text-cyan-400">
                    <span className="font-bold uppercase tracking-wider text-cyan-300">
                      PART REF: KAR-0{idx + 1}
                    </span>
                    <span>{project.year}</span>
                  </div>

                  <div className="py-4 space-y-2">
                    <h2 className="text-xl font-mono font-bold text-white group-hover:text-cyan-200">
                      {project.title}
                    </h2>
                    <p className="text-xs text-cyan-200/80 font-mono leading-relaxed line-clamp-3">
                      {project.summary}
                    </p>
                  </div>

                  {/* Mechanical Joinery State Controller */}
                  <div className="pt-3 border-t border-cyan-900/60 flex items-center justify-between gap-3">
                    <button
                      onClick={() => handleToggleAssembly(project.id)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-mono transition-colors cursor-pointer ${
                        isAssembled
                          ? 'bg-cyan-950 border-cyan-400 text-cyan-300'
                          : 'bg-slate-900 border-slate-700 text-slate-400'
                      }`}
                    >
                      {isAssembled ? <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" /> : <RotateCw className="w-3.5 h-3.5" />}
                      <span>{isAssembled ? 'Joined (Locked)' : 'Exploded View'}</span>
                    </button>

                    <button
                      onClick={() => {
                        audioEngine.playTactileClick();
                        onSelectProject(project);
                      }}
                      className="px-4 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
                    >
                      <span>Inspect Drawing</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
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
