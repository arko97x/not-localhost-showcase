/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Layers, ArrowRight, Sparkles, Feather, CircleDashed, Compass, Activity } from 'lucide-react';
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
 * BHUTIKA: The Raw Earth Specimen Table
 * Distinct Layout: Sculptor's Earthen Specimen Table with Stamped Clay Tablets & Viscosity Trays
 * Law of Reality: Materials respond (FORM)
 * Physics: Tactile Damped / Viscous Fluid Plasticity
 */
export const MaterialGarden: React.FC<WorldProps> = ({
  worldData,
  onSelectProject,
  onLeaveWorld,
  onShapeshiftTo,
  isSpringActive,
  onTriggerSpring,
}) => {
  const [activeMaterial, setActiveMaterial] = useState<string>('Terracotta Clay');

  const materials = [
    { name: 'Terracotta Clay', color: '#B45309', texture: 'Porous & Fired' },
    { name: 'Beaten Copper', color: '#D97706', texture: 'Hand-Hammered' },
    { name: 'River Silt', color: '#78716C', texture: 'Sedimentary Silt' },
    { name: 'Raw Mica Stone', color: '#A8A29E', texture: 'Crystalline Flakes' },
  ];

  return (
    <div className={`relative min-h-screen w-full bg-[#160E0A] text-[#F5EDE4] px-4 sm:px-8 pt-24 pb-28 ${isSpringActive ? 'animate-spring-rebound' : ''}`}>
      {/* Raw Earth Grain Backdrop Texture */}
      <div className="absolute inset-0 bg-noise opacity-40 pointer-events-none" />
      <div className="absolute top-20 right-1/3 w-[500px] h-[500px] bg-amber-800/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto space-y-8">
        {/* Stamped Clay Tablet Header */}
        <header className="rounded-3xl bg-gradient-to-b from-[#2B1B13] via-[#21140D] to-[#180E09] border-4 border-[#6E4226] p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.25em] text-amber-400">
                <Layers className="w-3.5 h-3.5" />
                <span>Clay & Mineral Laboratory · Specimen Table 07</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-serif text-[#FDF8F3] tracking-tight font-normal">
                {worldData.studentName}
              </h1>
              <p className="text-sm sm:text-base text-[#D4B59E] max-w-2xl font-serif italic leading-relaxed">
                "{worldData.summarySnippet}"
              </p>
            </div>

            {/* In-World Hydraulic Thumb Press / Viscosity Spring Trigger */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => {
                  audioEngine.playTactileClick();
                  onTriggerSpring?.();
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-mono transition-all cursor-pointer shadow-lg ${
                  isSpringActive
                    ? 'bg-amber-400 text-stone-950 border-amber-300 ring-2 ring-amber-400/50 scale-105'
                    : 'bg-[#382216] hover:bg-[#482D1D] text-amber-200 border-[#8A5432]'
                }`}
                title="Press Hydraulic Thumb / Test Material Plasticity"
              >
                <Activity className={`w-3.5 h-3.5 ${isSpringActive ? 'animate-spin' : 'text-amber-400'}`} />
                <span>{isSpringActive ? 'Clay Specimens Squished!' : 'Test Spring (Clay Plasticity)'}</span>
              </button>

              {onLeaveWorld && (
                <button
                  onClick={() => {
                    audioEngine.playTactileClick();
                    onLeaveWorld();
                  }}
                  className="px-3.5 py-2 rounded-xl bg-[#21140D] hover:bg-[#301C12] border border-[#6E4226] text-xs font-mono text-[#D4B59E] transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Compass className="w-3.5 h-3.5 text-amber-400" />
                  <span>Mandala</span>
                </button>
              )}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#4D2E1A] flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-[#B89680]">
            <div className="flex items-center gap-3">
              <span className="text-amber-400">Material Law:</span>
              <span className="text-[#FDF8F3] font-semibold">{worldData.worldSystem?.lawOfReality || 'Materials respond'}</span>
              <span>·</span>
              <span className="text-amber-400">Artefact:</span>
              <span className="text-[#FDF8F3]">{worldData.storageArtefact}</span>
            </div>
            <div className="text-[11px]">
              <span>Viscosity: 48 Pa·s · Damping: 32 (Tactile Settle)</span>
            </div>
          </div>
        </header>

        {/* Sculptor's Material Specimen Trays & Earthen Workpieces */}
        <div className="rounded-3xl bg-[#1C120B] border-4 border-[#5E3820] p-6 sm:p-8 shadow-2xl space-y-6">
          {/* Material Specimen Tray Selector */}
          <div className="rounded-2xl bg-[#26180E] border border-[#754627] p-3 sm:p-4 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-[#D4B59E]">
            <div className="flex items-center gap-2 font-bold uppercase text-amber-300">
              <Feather className="w-4 h-4" />
              <span>Specimen Medium:</span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {materials.map((m) => (
                <button
                  key={m.name}
                  onClick={() => {
                    audioEngine.playTactileClick();
                    setActiveMaterial(m.name);
                  }}
                  className={`px-3 py-1 rounded-lg border text-xs font-mono transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeMaterial === m.name
                      ? 'bg-amber-600 text-stone-950 font-bold border-amber-300 shadow-md'
                      : 'bg-[#180E08] border-[#5E3820] text-[#D4B59E] hover:border-amber-400'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: m.color }} />
                  <span>{m.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tactile Material Relics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
            {worldData.projects.map((project, idx) => (
              <div
                key={project.id}
                onClick={() => {
                  audioEngine.playTactileClick();
                  onSelectProject(project);
                }}
                className={`rounded-2xl border-2 transition-all duration-300 p-6 backdrop-blur-md cursor-pointer select-none bg-[#24160E] border-[#5E3820] hover:border-amber-500 shadow-xl ${
                  isSpringActive ? 'animate-spring-vibrate' : ''
                }`}
              >
                <div className="flex items-center justify-between pb-3 border-b border-[#4D2E1A] font-mono text-xs text-amber-400">
                  <span className="font-bold uppercase tracking-wider text-amber-300">
                    {project.artefact || project.artefactType}
                  </span>
                  <span>{project.year}</span>
                </div>

                <div className="py-4 space-y-2">
                  <h2 className="text-xl font-serif text-[#FDF8F3] group-hover:text-amber-200 font-medium">
                    {project.title}
                  </h2>
                  <p className="text-xs text-[#D4B59E] font-serif leading-relaxed line-clamp-3">
                    {project.summary}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#4D2E1A] flex items-center justify-between text-xs font-mono text-amber-400">
                  <span className="flex items-center gap-1">
                    <span>Touch Specimen</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                  <span className="text-[10px] text-[#A68067]">Tray #{idx + 1}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
