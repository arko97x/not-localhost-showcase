/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Heart, ArrowRight, Droplets, Flower2, Sprout, Compass, Activity } from 'lucide-react';
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
 * SEVIKA: The Herbal Sanctuary & Ayurvedic Dispensary
 * Distinct Layout: Botanical Herbarium Cabinet with Water Droplet Basins & Pressed Medicinal Leaves
 * Law of Reality: Attention produces growth (GROW)
 * Physics: Fluid Wave with Capillary Turgor Pressure
 */
export const HealingGarden: React.FC<WorldProps> = ({
  worldData,
  onSelectProject,
  onLeaveWorld,
  onShapeshiftTo,
  isSpringActive,
  onTriggerSpring,
}) => {
  return (
    <div className={`relative min-h-screen w-full bg-[#081711] text-[#E6F4EA] px-4 sm:px-8 pt-24 pb-28 ${isSpringActive ? 'animate-spring-rebound' : ''}`}>
      {/* Botanical Moss & Leaf Texture Backdrop */}
      <div className="absolute inset-0 bg-noise opacity-30 pointer-events-none" />
      <div className="absolute top-20 right-1/3 w-[550px] h-[550px] bg-emerald-600/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto space-y-8">
        {/* Carved Teakwood Herbarium Plaque Header */}
        <header className="rounded-3xl bg-gradient-to-b from-[#10291F] via-[#0D221A] to-[#0A1A14] border-4 border-[#1E4D3B] p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.25em] text-emerald-400">
                <Sprout className="w-3.5 h-3.5" />
                <span>Ayurvedic Herbarium · Dispensary of Living Care · Sector 12</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-serif text-[#F2FBF5] tracking-tight font-normal">
                {worldData.studentName}
              </h1>
              <p className="text-sm sm:text-base text-emerald-200/80 max-w-2xl font-serif italic leading-relaxed">
                "{worldData.summarySnippet}"
              </p>
            </div>

            {/* In-World Water Droplet Capillary Spring Trigger */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => {
                  audioEngine.playTactileClick();
                  onTriggerSpring?.();
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-mono transition-all cursor-pointer shadow-lg ${
                  isSpringActive
                    ? 'bg-emerald-400 text-stone-950 border-emerald-300 ring-2 ring-emerald-400/50 scale-105'
                    : 'bg-[#133327] hover:bg-[#1A4233] text-emerald-200 border-[#2A634E]'
                }`}
                title="Pump Water Droplet / Test Capillary Turgor Pressure"
              >
                <Activity className={`w-3.5 h-3.5 ${isSpringActive ? 'animate-spin' : 'text-emerald-400'}`} />
                <span>{isSpringActive ? 'Water Droplets Rippling & Leaves Blooming!' : 'Test Spring (Capillary Droplet)'}</span>
              </button>

              {onLeaveWorld && (
                <button
                  onClick={() => {
                    audioEngine.playTactileClick();
                    onLeaveWorld();
                  }}
                  className="px-3.5 py-2 rounded-xl bg-[#0D221A] hover:bg-[#143025] border border-[#1E4D3B] text-xs font-mono text-emerald-200 transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Compass className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Mandala</span>
                </button>
              )}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#16382B] flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-emerald-400/70">
            <div className="flex items-center gap-3">
              <span className="text-emerald-300">Growth Law:</span>
              <span className="text-white font-semibold">{worldData.worldSystem?.lawOfReality || 'Attention produces growth'}</span>
              <span>·</span>
              <span className="text-emerald-300">Sanctuary:</span>
              <span className="text-white">{worldData.storageArtefact}</span>
            </div>
            <div className="text-[11px]">
              <span>Turgor Osmosis: 1.2 MPa · Medicinal Herb Pressings</span>
            </div>
          </div>
        </header>

        {/* Dried Herbarium Pressings & Unguent Jars Grid */}
        <div className="rounded-3xl bg-[#0B1E17] border-4 border-[#1B4434] p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
            {worldData.projects.map((project, idx) => (
              <div
                key={project.id}
                onClick={() => {
                  audioEngine.playTactileClick();
                  onSelectProject(project);
                }}
                className={`rounded-2xl border-2 transition-all duration-300 p-6 backdrop-blur-md cursor-pointer select-none bg-[#0F261D] border-[#1C4636] hover:border-emerald-400 shadow-xl ${
                  isSpringActive ? 'animate-spring-vibrate' : ''
                }`}
              >
                <div className="flex items-center justify-between pb-3 border-b border-[#16382B] font-mono text-xs text-emerald-400">
                  <span className="font-bold uppercase tracking-wider text-emerald-300">
                    HERBARIUM SPECIMEN #{idx + 1}
                  </span>
                  <span>{project.year}</span>
                </div>

                <div className="py-4 space-y-2">
                  <h2 className="text-xl font-serif text-[#F2FBF5] group-hover:text-emerald-200 font-medium">
                    {project.title}
                  </h2>
                  <p className="text-xs text-emerald-200/80 font-serif leading-relaxed line-clamp-3">
                    {project.summary}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#16382B] flex items-center justify-between text-xs font-mono text-emerald-400">
                  <span className="flex items-center gap-1">
                    <span>Gather Prescription</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                  <span className="text-[10px] text-emerald-500">Jar #{idx + 1}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
