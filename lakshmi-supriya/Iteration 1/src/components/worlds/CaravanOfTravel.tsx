/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navigation, ArrowRight, Compass, Ticket, Milestone, Activity, Train } from 'lucide-react';
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
 * YATRI: The Expedition Ledger & Railway Route Map
 * Distinct Layout: Indian Railways Journey Ticket & Stamped Expedition Ledger with Route Milestones
 * Law of Reality: The world moves (TRAVEL)
 * Physics: Gravitational with Railway Carriage Suspension Jolt
 */
export const CaravanOfTravel: React.FC<WorldProps> = ({
  worldData,
  onSelectProject,
  onLeaveWorld,
  onShapeshiftTo,
  isSpringActive,
  onTriggerSpring,
}) => {
  const [activeStationIdx, setActiveStationIdx] = useState<number>(0);

  return (
    <div className={`relative min-h-screen w-full bg-[#140F0A] text-[#FDE68A] px-4 sm:px-8 pt-24 pb-28 ${isSpringActive ? 'animate-spring-rebound' : ''}`}>
      {/* Dusty Overland Route Map Backdrop */}
      <div className="absolute inset-0 bg-noise opacity-35 pointer-events-none" />
      <div className="absolute top-20 right-1/4 w-[550px] h-[550px] bg-amber-700/15 rounded-full blur-[160px] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto space-y-8">
        {/* Stamped Indian Railways Transit Ticket Header */}
        <header className="rounded-3xl bg-gradient-to-b from-[#291B10] via-[#21150C] to-[#170E08] border-4 border-[#78461E] p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.25em] text-amber-400">
                <Ticket className="w-3.5 h-3.5" />
                <span>Indian Railways Route Permit · Grand Trunk Line · KM 1482</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-serif text-[#FFFBEB] tracking-tight font-normal">
                {worldData.studentName}
              </h1>
              <p className="text-sm sm:text-base text-[#FDBA74] max-w-2xl font-serif italic leading-relaxed">
                "{worldData.summarySnippet}"
              </p>
            </div>

            {/* In-World Railway Carriage Handbrake Spring Trigger */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => {
                  audioEngine.playTactileClick();
                  onTriggerSpring?.();
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-mono transition-all cursor-pointer shadow-lg ${
                  isSpringActive
                    ? 'bg-amber-400 text-stone-950 border-amber-300 ring-2 ring-amber-400/50 scale-105'
                    : 'bg-[#382313] hover:bg-[#472E19] text-amber-200 border-[#8F5525]'
                }`}
                title="Pull Carriage Handbrake / Test Suspension Jolt"
              >
                <Activity className={`w-3.5 h-3.5 ${isSpringActive ? 'animate-spin' : 'text-amber-400'}`} />
                <span>{isSpringActive ? 'Carriage Suspension Jolted!' : 'Test Spring (Handbrake)'}</span>
              </button>

              {onLeaveWorld && (
                <button
                  onClick={() => {
                    audioEngine.playTactileClick();
                    onLeaveWorld();
                  }}
                  className="px-3.5 py-2 rounded-xl bg-[#21150C] hover:bg-[#301F12] border border-[#78461E] text-xs font-mono text-[#FDBA74] transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Compass className="w-3.5 h-3.5 text-amber-400" />
                  <span>Mandala</span>
                </button>
              )}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#543015] flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-[#FCA5A5]/80">
            <div className="flex items-center gap-3">
              <span className="text-amber-400">Transit Law:</span>
              <span className="text-[#FFFBEB] font-semibold">{worldData.worldSystem?.lawOfReality || 'The world moves'}</span>
              <span>·</span>
              <span className="text-amber-400">Vessel:</span>
              <span className="text-[#FFFBEB]">{worldData.storageArtefact}</span>
            </div>
            <div className="text-[11px] text-[#FDBA74]">
              <span>Inertia Momentum: 1.4 · Steel Rail Suspension</span>
            </div>
          </div>
        </header>

        {/* Milestone Station Track Grid */}
        <div className="rounded-3xl bg-[#1C130B] border-4 border-[#693C18] p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
            {worldData.projects.map((project, idx) => (
              <div
                key={project.id}
                onClick={() => {
                  audioEngine.playTactileClick();
                  onSelectProject(project);
                }}
                className={`rounded-2xl border-2 transition-all duration-300 p-6 backdrop-blur-md cursor-pointer select-none bg-[#24170E] border-[#5E3616] hover:border-amber-400 shadow-xl ${
                  isSpringActive ? 'animate-spring-vibrate' : ''
                }`}
              >
                <div className="flex items-center justify-between pb-3 border-b border-[#472910] font-mono text-xs text-amber-400">
                  <span className="font-bold uppercase tracking-wider text-amber-300">
                    STATION 0{idx + 1}
                  </span>
                  <span>{project.year}</span>
                </div>

                <div className="py-4 space-y-2">
                  <h2 className="text-xl font-serif text-[#FFFBEB] group-hover:text-amber-200 font-medium">
                    {project.title}
                  </h2>
                  <p className="text-xs text-[#FDBA74]/90 font-serif leading-relaxed line-clamp-3">
                    {project.summary}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#472910] flex items-center justify-between text-xs font-mono text-amber-400">
                  <span className="flex items-center gap-1">
                    <span>Inspect Waypoint</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                  <span className="text-[10px] text-[#C48C5E]">KM +{idx * 420}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
