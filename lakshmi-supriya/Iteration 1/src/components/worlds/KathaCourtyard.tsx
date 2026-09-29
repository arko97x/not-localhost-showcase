/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Sparkles, ArrowRight, DoorOpen, SunMedium, Film, Clapperboard, Columns, Wind, Compass, Activity, Bell } from 'lucide-react';
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
 * KATHAKA: The Sandstone Haveli Courtyard & Stepwell Theatre
 * Distinct Layout: Rajasthani Haveli Colonnade Courtyard with Theatrical Stage Curtains & Jaali Screens
 * Law of Reality: Spaces narrate (NARRATE)
 * Physics: Gravitational Slow with Heavy Pendulum Swing
 */
export const KathaCourtyard: React.FC<WorldProps> = ({
  worldData,
  onSelectProject,
  onLeaveWorld,
  onShapeshiftTo,
  isSpringActive,
  onTriggerSpring,
}) => {
  const [currentSceneIdx, setCurrentSceneIdx] = useState(0);

  const activeProject = worldData.projects[currentSceneIdx] || worldData.projects[0];

  const handleNextScene = () => {
    audioEngine.playTactileClick();
    setCurrentSceneIdx((prev) => (prev + 1) % worldData.projects.length);
  };

  return (
    <div className={`relative min-h-screen w-full bg-[#180A04] text-[#FDE68A] px-4 sm:px-8 pt-24 pb-28 ${isSpringActive ? 'animate-spring-rebound' : ''}`}>
      {/* Terracotta and Sandstone Sun-Drenched Backdrop */}
      <div className="absolute inset-0 bg-noise opacity-30 pointer-events-none" />
      <div className="absolute top-12 left-1/3 w-[600px] h-[600px] bg-amber-600/15 rounded-full blur-[160px] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto space-y-8">
        {/* Haveli Colonnade Archway Header */}
        <header className="rounded-3xl bg-gradient-to-b from-[#2E1408] via-[#240F06] to-[#1A0A04] border-4 border-[#8B3B18] p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.25em] text-amber-400">
                <DoorOpen className="w-3.5 h-3.5" />
                <span>Haveli Jharokha · Performance Courtyard · Raag Sandhya</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-serif text-[#FFFBEB] tracking-tight font-normal">
                {worldData.studentName}
              </h1>
              <p className="text-sm sm:text-base text-[#FDBA74] max-w-2xl font-serif italic leading-relaxed">
                "{worldData.summarySnippet}"
              </p>
            </div>

            {/* In-World Temple Bell Pendulum Spring Trigger */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => {
                  audioEngine.playTactileClick();
                  onTriggerSpring?.();
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-mono transition-all cursor-pointer shadow-lg ${
                  isSpringActive
                    ? 'bg-amber-400 text-stone-950 border-amber-300 ring-2 ring-amber-400/50 scale-105'
                    : 'bg-[#3D1A0B] hover:bg-[#4E220E] text-amber-200 border-[#99421A]'
                }`}
                title="Ring Haveli Temple Bell / Test Pendulum Gravity"
              >
                <Bell className={`w-3.5 h-3.5 ${isSpringActive ? 'animate-bounce text-stone-950' : 'text-amber-400'}`} />
                <span>{isSpringActive ? 'Temple Bell Pendulum Swinging!' : 'Test Spring (Bell Pendulum)'}</span>
              </button>

              {onLeaveWorld && (
                <button
                  onClick={() => {
                    audioEngine.playTactileClick();
                    onLeaveWorld();
                  }}
                  className="px-3.5 py-2 rounded-xl bg-[#240F06] hover:bg-[#341609] border border-[#8B3B18] text-xs font-mono text-[#FDBA74] transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Compass className="w-3.5 h-3.5 text-amber-400" />
                  <span>Mandala</span>
                </button>
              )}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#5C240E] flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-[#FCA5A5]/80">
            <div className="flex items-center gap-3">
              <span className="text-amber-300">Dramatic Law:</span>
              <span className="text-[#FFFBEB] font-semibold">{worldData.worldSystem?.lawOfReality || 'Spaces narrate'}</span>
              <span>·</span>
              <span className="text-amber-300">Artefact:</span>
              <span className="text-[#FFFBEB]">{worldData.storageArtefact}</span>
            </div>
            <div className="text-[11px] text-[#FDBA74]">
              <span>Gravity Inertia: 0.8g · Limewash Sandstone Facade</span>
            </div>
          </div>
        </header>

        {/* Theatrical Scene Arena Stage Frame */}
        <div className="rounded-3xl bg-[#200D06] border-4 border-[#783014] p-6 sm:p-10 shadow-2xl space-y-6">
          {/* Billowing Muslin Canopy Act Selector */}
          <div className="rounded-2xl bg-[#2C1309] border border-[#8C3A19] p-3 sm:p-4 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-[#FED7AA]">
            <div className="flex items-center gap-2 font-bold uppercase text-amber-300">
              <Wind className="w-4 h-4 animate-pulse" />
              <span>Chanderi Muslin Canopy:</span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-[#D97706]">Select Act:</span>
              {worldData.projects.map((p, idx) => (
                <button
                  key={p.id}
                  onClick={() => {
                    audioEngine.playTactileClick();
                    setCurrentSceneIdx(idx);
                  }}
                  className={`px-3 py-1 rounded-lg border text-xs font-mono transition-all cursor-pointer ${
                    currentSceneIdx === idx
                      ? 'bg-amber-500 text-stone-950 font-bold border-amber-300 shadow-md'
                      : 'bg-[#180A04] border-[#692911] text-[#FED7AA] hover:border-amber-400'
                  }`}
                >
                  Act 0{idx + 1}
                </button>
              ))}
            </div>
          </div>

          {/* Central Theatrical Haveli Courtyard Stage */}
          {activeProject && (
            <div className={`rounded-3xl bg-gradient-to-b from-[#281107] to-[#190903] border-2 border-[#8B3B18] p-6 sm:p-10 shadow-2xl space-y-6 ${
              isSpringActive ? 'animate-spring-vibrate' : ''
            }`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#5C240E]">
                <div className="flex items-center gap-3">
                  <div className="px-3.5 py-1.5 rounded-xl bg-amber-950 border border-amber-600/80 text-amber-300 font-mono text-xs font-bold">
                    PRATHAMA ANKA · SCENE 0{currentSceneIdx + 1}
                  </div>
                  <span className="text-xs font-mono uppercase text-[#FDBA74] tracking-wider font-semibold">
                    {activeProject.artefact || activeProject.artefactType}
                  </span>
                </div>
                <span className="text-xs font-mono text-[#FCA5A5]">
                  Chronicle Year: {activeProject.year}
                </span>
              </div>

              <div className="space-y-4 py-2">
                <h2 className="text-2xl sm:text-4xl font-serif text-[#FFFBEB] font-medium leading-snug">
                  {activeProject.title}
                </h2>
                <p className="text-base sm:text-lg text-[#FDE68A]/90 font-serif leading-relaxed italic">
                  "{activeProject.summary}"
                </p>
              </div>

              {/* Haveli Jaali Screen Footing & Dossier Portal */}
              <div className="pt-6 border-t border-[#5C240E] flex flex-col sm:flex-row items-center justify-between gap-4">
                <button
                  onClick={handleNextScene}
                  className="px-4 py-2 rounded-xl bg-[#33150A] hover:bg-[#451C0D] border border-[#8C3A19] text-[#FED7AA] font-mono text-xs transition-colors cursor-pointer flex items-center gap-2"
                >
                  <Clapperboard className="w-3.5 h-3.5 text-amber-400" />
                  <span>Advance to Next Act ({((currentSceneIdx + 1) % worldData.projects.length) + 1}/{worldData.projects.length})</span>
                </button>

                <button
                  onClick={() => {
                    audioEngine.playTactileClick();
                    onSelectProject(activeProject);
                  }}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-mono text-xs font-bold transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Witness Complete Scene Narrative</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
