/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { HelpCircle, ArrowRight, Shuffle, Hash, Edit3, Compass, Activity, Pin } from 'lucide-react';
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
 * JIGNASU: The Dialectical Question Matrix & Mind-Map
 * Distinct Layout: Investigator's Interrogation Corkboard with Pinned Index Cards & Red Yarn
 * Law of Reality: Questions reshape reality (REARRANGE)
 * Physics: Spring Elastic with Socratic Scatter & Snap
 */
export const QuestionArchive: React.FC<WorldProps> = ({
  worldData,
  onSelectProject,
  onLeaveWorld,
  onShapeshiftTo,
  isSpringActive,
  onTriggerSpring,
}) => {
  const [activeQuestionIdx, setActiveQuestionIdx] = useState<number>(0);

  const dialecticalQuestions = [
    'Does the interface reveal or conceal the hand of the archivist?',
    'What happens to institutional memory when the database is powered down?',
    'Is a thread an element of structure, or an invitation to unravel?',
  ];

  return (
    <div className={`relative min-h-screen w-full bg-[#181613] text-[#F3EED9] px-4 sm:px-8 pt-24 pb-28 ${isSpringActive ? 'animate-spring-rebound' : ''}`}>
      {/* Scholar Parchment & Corkboard Texture Backdrop */}
      <div className="absolute inset-0 bg-noise opacity-30 pointer-events-none" />
      <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto space-y-8">
        {/* Pinned Thesis Statement Paper Header with Wooden Pegs */}
        <header className="rounded-3xl bg-[#211E1A] border-4 border-[#453E35] p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.25em] text-amber-400">
                <Pin className="w-3.5 h-3.5 text-red-500" />
                <span>Epistemological Inquiry Board · Thesis Folio #10</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-mono text-white tracking-tight font-bold">
                {worldData.studentName}
              </h1>
              <p className="text-sm sm:text-base text-[#D6CEBC] max-w-2xl font-serif italic leading-relaxed">
                "{worldData.summarySnippet}"
              </p>
            </div>

            {/* In-World Socratic Scatter/Snap Spring Trigger */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => {
                  audioEngine.playTactileClick();
                  onTriggerSpring?.();
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-mono transition-all cursor-pointer shadow-lg ${
                  isSpringActive
                    ? 'bg-amber-400 text-stone-950 border-amber-300 ring-2 ring-amber-400/50 scale-105'
                    : 'bg-[#2E2922] hover:bg-[#3D372E] text-amber-200 border-[#5C5346]'
                }`}
                title="Test Dialectical Spring / Scatter & Snap Hypotheses"
              >
                <Activity className={`w-3.5 h-3.5 ${isSpringActive ? 'animate-spin' : 'text-amber-400'}`} />
                <span>{isSpringActive ? 'Hypotheses Scattered & Snapped!' : 'Test Spring (Scatter/Snap)'}</span>
              </button>

              {onLeaveWorld && (
                <button
                  onClick={() => {
                    audioEngine.playTactileClick();
                    onLeaveWorld();
                  }}
                  className="px-3.5 py-2 rounded-xl bg-[#26221D] hover:bg-[#332E27] border border-[#544B3F] text-xs font-mono text-[#D6CEBC] transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Compass className="w-3.5 h-3.5 text-amber-400" />
                  <span>Mandala</span>
                </button>
              )}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#38322A] flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-[#A89F8D]">
            <div className="flex items-center gap-3">
              <span className="text-amber-400 font-bold">Dialectical Law:</span>
              <span className="text-white font-semibold">{worldData.worldSystem?.lawOfReality || 'Questions reshape reality'}</span>
              <span>·</span>
              <span className="text-amber-400 font-bold">Folio:</span>
              <span className="text-white">{worldData.storageArtefact}</span>
            </div>
            <div className="text-[11px]">
              <span>Tension: 200 · Elastic Magnetic Snap</span>
            </div>
          </div>
        </header>

        {/* Dialectical Inquiry Constellation Grid */}
        <div className="space-y-6">
          {/* Active Question Banner */}
          <div className="rounded-2xl bg-[#25211B] border-2 border-[#544B3F] p-4 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center gap-2 text-amber-400 font-bold uppercase">
              <HelpCircle className="w-4 h-4" />
              <span>Core Dialectical Inquiry:</span>
            </div>
            <span className="text-sm font-serif italic text-[#F3EED9]">
              "{dialecticalQuestions[activeQuestionIdx % dialecticalQuestions.length]}"
            </span>
          </div>

          {/* Pinned Proposition Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {worldData.projects.map((project, idx) => (
              <div
                key={project.id}
                onClick={() => {
                  audioEngine.playTactileClick();
                  onSelectProject(project);
                }}
                className={`rounded-2xl border-2 transition-all duration-300 p-6 cursor-pointer select-none bg-[#201D17] border-[#4A4237] hover:border-amber-400 shadow-xl relative ${
                  isSpringActive ? 'animate-spring-vibrate' : ''
                }`}
              >
                {/* Red Pin Tack Graphic */}
                <div className="absolute -top-3 left-6 w-6 h-6 rounded-full bg-red-600 border-2 border-white shadow-md flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-white/70" />
                </div>

                <div className="flex items-center justify-between pb-3 border-b border-[#38322A] font-mono text-xs text-amber-400 pt-1">
                  <span className="font-bold uppercase tracking-wider">
                    PROPOSITION 0{idx + 1}
                  </span>
                  <span>{project.year}</span>
                </div>

                <div className="py-4 space-y-2">
                  <h2 className="text-xl font-mono font-bold text-white group-hover:text-amber-200">
                    {project.title}
                  </h2>
                  <p className="text-xs text-[#C7BEAA] font-mono leading-relaxed line-clamp-3">
                    {project.summary}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#38322A] flex items-center justify-between text-xs font-mono text-amber-400">
                  <span className="flex items-center gap-1">
                    <span>Examine Evidence</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                  <span className="text-[10px] text-[#8C8372]">Node #{idx + 1}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
