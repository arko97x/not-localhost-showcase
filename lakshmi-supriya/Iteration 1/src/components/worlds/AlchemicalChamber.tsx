/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Flame, ArrowRight, RefreshCw, Layers, Sparkles, Compass, Activity } from 'lucide-react';
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
 * RUPANTARA: The Alchemical Crucible & Metamorphosis Forge
 * Distinct Layout: Metallurgical Crucible Forge with 5 Transmutation Stages & Blast Heat Bellows
 * Law of Reality: Objects change form (TRANSFORM)
 * Physics: Crystalline Snappy with Catalytic Phase-Shift Flash
 */
export const AlchemicalChamber: React.FC<WorldProps> = ({
  worldData,
  onSelectProject,
  onLeaveWorld,
  onShapeshiftTo,
  isSpringActive,
  onTriggerSpring,
}) => {
  const [activeStage, setActiveStage] = useState<number>(0);

  const alchemicalStages = [
    { name: 'Nigredo', meaning: 'Deconstruction & Charcoal Base', color: '#4B5563' },
    { name: 'Albedo', meaning: 'Purification & White Vapor', color: '#E2E8F0' },
    { name: 'Citrinitas', meaning: 'Solar Phosphor & Illumination', color: '#FBBF24' },
    { name: 'Rubedo', meaning: 'Philosophical Vermilion', color: '#EF4444' },
    { name: 'Aurum', meaning: 'Finished Transmuted Gold', color: '#EAB308' },
  ];

  return (
    <div className={`relative min-h-screen w-full bg-[#0A0512] text-[#F3E8FF] px-4 sm:px-8 pt-24 pb-28 ${isSpringActive ? 'animate-spring-rebound' : ''}`}>
      {/* Metallurgical Forge & Embers Backdrop Texture */}
      <div className="absolute inset-0 bg-noise opacity-30 pointer-events-none" />
      <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-amber-600/15 rounded-full blur-[170px] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto space-y-8">
        {/* Cast-Iron Furnace Faceplate Header */}
        <header className="rounded-3xl bg-gradient-to-b from-[#1C0D2B] via-[#150A21] to-[#0E0616] border-4 border-[#5E2B8C] p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.25em] text-amber-400">
                <Flame className="w-3.5 h-3.5 text-orange-500 animate-pulse" />
                <span>Crucible Blast Furnace · Forge Temperature 1280°C · Vessel 13</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-serif text-white tracking-tight font-normal">
                {worldData.studentName}
              </h1>
              <p className="text-sm sm:text-base text-purple-200/80 max-w-2xl font-serif italic leading-relaxed">
                "{worldData.summarySnippet}"
              </p>
            </div>

            {/* In-World Furnace Bellows Blast Spring Trigger */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => {
                  audioEngine.playTactileClick();
                  onTriggerSpring?.();
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-mono transition-all cursor-pointer shadow-lg ${
                  isSpringActive
                    ? 'bg-amber-400 text-stone-950 border-amber-300 ring-2 ring-amber-400/50 scale-105'
                    : 'bg-[#2B1242] hover:bg-[#3B195A] text-amber-200 border-[#7B3BB8]'
                }`}
                title="Pump Furnace Bellows / Test Catalytic Heat Spring"
              >
                <Activity className={`w-3.5 h-3.5 ${isSpringActive ? 'animate-spin' : 'text-amber-400'}`} />
                <span>{isSpringActive ? 'Catalytic Heat Flash Fired!' : 'Test Spring (Furnace Bellows)'}</span>
              </button>

              {onLeaveWorld && (
                <button
                  onClick={() => {
                    audioEngine.playTactileClick();
                    onLeaveWorld();
                  }}
                  className="px-3.5 py-2 rounded-xl bg-[#170B24] hover:bg-[#231136] border border-[#5E2B8C] text-xs font-mono text-purple-200 transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Compass className="w-3.5 h-3.5 text-amber-400" />
                  <span>Mandala</span>
                </button>
              )}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#3A1A57] flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-purple-400/70">
            <div className="flex items-center gap-3">
              <span className="text-amber-400">Transmutation Law:</span>
              <span className="text-white font-semibold">{worldData.worldSystem?.lawOfReality || 'Objects change form'}</span>
              <span>·</span>
              <span className="text-amber-400">Crucible:</span>
              <span className="text-white">{worldData.storageArtefact}</span>
            </div>
            <div className="text-[11px] text-amber-300">
              <span>Reaction Heat: 1280°C · Catalytic Phase-Shift</span>
            </div>
          </div>
        </header>

        {/* 5-Stage Metamorphosis Crucibles Deck */}
        <div className="rounded-3xl bg-[#130722] border-4 border-[#4E2374] p-6 sm:p-8 shadow-2xl space-y-6">
          {/* Alchemical Stage Indicator Bar */}
          <div className="rounded-2xl bg-[#1C0A32] border border-[#6B319E] p-3 sm:p-4 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-purple-200">
            <div className="flex items-center gap-2 font-bold uppercase text-amber-300">
              <RefreshCw className="w-4 h-4 animate-spin" style={{ animationDuration: '18s' }} />
              <span>Transmutation Stage:</span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {alchemicalStages.map((stage, idx) => (
                <button
                  key={stage.name}
                  onClick={() => {
                    audioEngine.playTactileClick();
                    setActiveStage(idx);
                  }}
                  className={`px-3 py-1 rounded-lg border text-xs font-mono transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeStage === idx
                      ? 'bg-amber-500 text-stone-950 font-bold border-amber-300 shadow-md'
                      : 'bg-[#10051C] border-[#5E2B8C] text-purple-200 hover:border-amber-400'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: stage.color }} />
                  <span>{stage.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Transmuted Crucible Relics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
            {worldData.projects.map((project, idx) => (
              <div
                key={project.id}
                onClick={() => {
                  audioEngine.playTactileClick();
                  onSelectProject(project);
                }}
                className={`rounded-2xl border-2 transition-all duration-300 p-6 backdrop-blur-md cursor-pointer select-none bg-[#1A092E] border-[#53267C] hover:border-amber-400 shadow-xl ${
                  isSpringActive ? 'animate-spring-vibrate' : ''
                }`}
              >
                <div className="flex items-center justify-between pb-3 border-b border-[#3A1957] font-mono text-xs text-amber-400">
                  <span className="font-bold uppercase tracking-wider text-amber-300">
                    CRUCIBLE #{idx + 1}
                  </span>
                  <span>{project.year}</span>
                </div>

                <div className="py-4 space-y-2">
                  <h2 className="text-xl font-serif text-white group-hover:text-amber-200 font-medium">
                    {project.title}
                  </h2>
                  <p className="text-xs text-purple-200/80 font-serif leading-relaxed line-clamp-3">
                    {project.summary}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#3A1957] flex items-center justify-between text-xs font-mono text-amber-400">
                  <span className="flex items-center gap-1">
                    <span>Extract Vessel</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                  <span className="text-[10px] text-purple-400">Stage #{activeStage + 1}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
