/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Users, ArrowRight, Pin, MessageSquare, Compass, Activity, Megaphone } from 'lucide-react';
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
 * SANGATI: The Town Square Adda & Street Wall of Posters
 * Distinct Layout: Urban Town Square Bulletin Wall with Wheatpasted Risograph Flyers
 * Law of Reality: Objects respond socially (INTERACT)
 * Physics: Social Proximity / Wind Flutter & Communal Resonance
 */
export const CommonsSquare: React.FC<WorldProps> = ({
  worldData,
  onSelectProject,
  onLeaveWorld,
  onShapeshiftTo,
  isSpringActive,
  onTriggerSpring,
}) => {
  return (
    <div className={`relative min-h-screen w-full bg-[#121215] text-[#FAFAFA] px-4 sm:px-8 pt-24 pb-28 ${isSpringActive ? 'animate-spring-rebound' : ''}`}>
      {/* Concrete & Newsprint Backdrop Texture */}
      <div className="absolute inset-0 bg-noise opacity-30 pointer-events-none" />
      <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-rose-600/10 rounded-full blur-[160px] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto space-y-8">
        {/* Town Square Stencilled Bulletin Board Header */}
        <header className="rounded-3xl bg-[#1C1C22] border-4 border-[#3F3F4E] p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.25em] text-rose-400">
                <Users className="w-3.5 h-3.5" />
                <span>Town Square Adda · Public Noticeboard · Chowk Assembly</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-mono text-white tracking-tight font-black uppercase">
                {worldData.studentName}
              </h1>
              <p className="text-sm sm:text-base text-zinc-300 max-w-2xl font-sans leading-relaxed">
                "{worldData.summarySnippet}"
              </p>
            </div>

            {/* In-World Megaphone Siren Spring Trigger */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => {
                  audioEngine.playTactileClick();
                  onTriggerSpring?.();
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-mono transition-all cursor-pointer shadow-lg ${
                  isSpringActive
                    ? 'bg-rose-500 text-stone-950 border-rose-300 ring-2 ring-rose-400/50 scale-105'
                    : 'bg-[#2E1E28] hover:bg-[#3E2836] text-rose-200 border-[#6E3C5C]'
                }`}
                title="Test Public Resonance / Sound Megaphone"
              >
                <Activity className={`w-3.5 h-3.5 ${isSpringActive ? 'animate-spin' : 'text-rose-400'}`} />
                <span>{isSpringActive ? 'Public Megaphone Resonating!' : 'Test Spring (Public Siren)'}</span>
              </button>

              {onLeaveWorld && (
                <button
                  onClick={() => {
                    audioEngine.playTactileClick();
                    onLeaveWorld();
                  }}
                  className="px-3.5 py-2 rounded-xl bg-[#24242C] hover:bg-[#30303C] border border-[#484858] text-xs font-mono text-zinc-300 transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Compass className="w-3.5 h-3.5 text-rose-400" />
                  <span>Mandala</span>
                </button>
              )}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#31313E] flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-zinc-400">
            <div className="flex items-center gap-3">
              <span className="text-rose-400 font-bold">Social Law:</span>
              <span className="text-white font-semibold">{worldData.worldSystem?.lawOfReality || 'Objects respond socially'}</span>
              <span>·</span>
              <span className="text-amber-400 font-bold">Medium:</span>
              <span className="text-white">{worldData.storageArtefact}</span>
            </div>
            <div className="text-[11px] text-rose-400">
              <span>Proximity Radius: 24m · Wheatpaste Layers</span>
            </div>
          </div>
        </header>

        {/* Wheatpasted Street Posters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
          {worldData.projects.map((project, idx) => (
            <div
              key={project.id}
              onClick={() => {
                audioEngine.playTactileClick();
                onSelectProject(project);
              }}
              className={`rounded-2xl border-2 transition-all duration-300 p-6 cursor-pointer select-none bg-[#1A1A20] border-[#363644] hover:border-rose-400 shadow-xl relative ${
                isSpringActive ? 'animate-spring-vibrate' : ''
              }`}
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#2C2C38] font-mono text-xs text-rose-400">
                <span className="font-bold uppercase tracking-wider">
                  DISPATCH #{idx + 1}
                </span>
                <span>{project.year}</span>
              </div>

              <div className="py-4 space-y-2">
                <h2 className="text-xl font-sans font-bold text-white group-hover:text-rose-200">
                  {project.title}
                </h2>
                <p className="text-xs text-zinc-300 font-sans leading-relaxed line-clamp-3">
                  {project.summary}
                </p>
              </div>

              <div className="pt-3 border-t border-[#2C2C38] flex items-center justify-between text-xs font-mono text-rose-400">
                <span className="flex items-center gap-1">
                  <span>Read Manifesto</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
                <span className="text-[10px] text-zinc-500">Chowk #{idx + 1}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
