/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Cloud, ArrowRight, Wind, Sparkles, Compass, Activity, Moon } from 'lucide-react';
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
 * SVAPNIKA: The Zero-Gravity Floating Dreamscape
 * Distinct Layout: Weightless Dream Chamber with Buoyant Floating Capsules & Lunar Updrafts
 * Law of Reality: Gravity is uncertain (DRIFT)
 * Physics: Gravitational Slow / Zero-G Buoyant Drift
 */
export const FloatingRoom: React.FC<WorldProps> = ({
  worldData,
  onSelectProject,
  onLeaveWorld,
  onShapeshiftTo,
  isSpringActive,
  onTriggerSpring,
}) => {
  const [buoyancyLevel, setBuoyancyLevel] = useState<number>(1);

  return (
    <div className={`relative min-h-screen w-full bg-[#090614] text-purple-100 px-4 sm:px-8 pt-24 pb-28 ${isSpringActive ? 'animate-spring-rebound' : ''}`}>
      {/* Weightless Floating Atmosphere */}
      <div className="absolute inset-0 bg-noise opacity-20 pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-purple-600/15 rounded-full blur-[170px] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto space-y-8">
        {/* Floating Gossamer Cloud Header */}
        <header className="rounded-3xl bg-purple-950/40 border-2 border-purple-500/30 p-6 sm:p-8 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.25em] text-purple-300">
                <Moon className="w-3.5 h-3.5 text-purple-300" />
                <span>Zero-Gravity Orbit · Dream Chamber · Micro-G 0.08m/s²</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-serif text-white tracking-tight font-normal">
                {worldData.studentName}
              </h1>
              <p className="text-sm sm:text-base text-purple-200/80 max-w-2xl font-serif italic leading-relaxed">
                "{worldData.summarySnippet}"
              </p>
            </div>

            {/* In-World Lunar Updraft Spring Trigger */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => {
                  audioEngine.playTactileClick();
                  onTriggerSpring?.();
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-mono transition-all cursor-pointer shadow-lg ${
                  isSpringActive
                    ? 'bg-purple-300 text-stone-950 border-purple-200 ring-2 ring-purple-300/50 scale-105'
                    : 'bg-purple-950/70 hover:bg-purple-900/70 text-purple-200 border-purple-600/50'
                }`}
                title="Send Lunar Updraft / Test Zero-Gravity Buoyancy"
              >
                <Activity className={`w-3.5 h-3.5 ${isSpringActive ? 'animate-spin' : 'text-purple-300'}`} />
                <span>{isSpringActive ? 'Thermal Updraft Fired · Floating!' : 'Test Spring (Lunar Updraft)'}</span>
              </button>

              {onLeaveWorld && (
                <button
                  onClick={() => {
                    audioEngine.playTactileClick();
                    onLeaveWorld();
                  }}
                  className="px-3.5 py-2 rounded-xl bg-purple-950/60 hover:bg-purple-900/80 border border-purple-700/40 text-xs font-mono text-purple-200 transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Compass className="w-3.5 h-3.5 text-purple-300" />
                  <span>Mandala</span>
                </button>
              )}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-purple-900/40 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-purple-300/70">
            <div className="flex items-center gap-3">
              <span className="text-purple-300">Dream Law:</span>
              <span className="text-white font-semibold">{worldData.worldSystem?.lawOfReality || 'Gravity is uncertain'}</span>
              <span>·</span>
              <span className="text-purple-300">Vessel:</span>
              <span className="text-white">{worldData.storageArtefact}</span>
            </div>
            <div className="text-[11px]">
              <span>Inertia: 0.12g · Drifting Silk Suspension</span>
            </div>
          </div>
        </header>

        {/* Buoyant Weightless Capsules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
          {worldData.projects.map((project, idx) => (
            <div
              key={project.id}
              onClick={() => {
                audioEngine.playTactileClick();
                onSelectProject(project);
              }}
              style={{
                transform: isSpringActive ? 'translateY(-18px) scale(1.03)' : 'translateY(0) scale(1)',
                transition: 'transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
              }}
              className="rounded-3xl border-2 transition-all duration-500 p-7 backdrop-blur-xl cursor-pointer select-none bg-purple-950/30 border-purple-500/30 hover:border-purple-300 hover:bg-purple-900/40 shadow-2xl group"
            >
              <div className="flex items-center justify-between pb-3 border-b border-purple-900/40 font-mono text-xs text-purple-300">
                <span className="font-bold uppercase tracking-wider text-purple-200">
                  {project.artefact || project.artefactType}
                </span>
                <span>{project.year}</span>
              </div>

              <div className="py-4 space-y-2">
                <h2 className="text-xl font-serif text-white group-hover:text-purple-200 font-medium">
                  {project.title}
                </h2>
                <p className="text-xs text-purple-200/80 font-serif leading-relaxed line-clamp-3">
                  {project.summary}
                </p>
              </div>

              <div className="pt-3 border-t border-purple-900/40 flex items-center justify-between text-xs font-mono text-purple-300">
                <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  <span>Enter Dream</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
                <span className="text-[10px] text-purple-400">Orb #{idx + 1}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
