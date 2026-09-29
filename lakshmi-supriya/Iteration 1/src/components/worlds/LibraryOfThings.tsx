/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Archive, ArrowRight, Folder, FileText, Camera, Bookmark, Key, Tag, Compass, Sparkles, Activity } from 'lucide-react';
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
 * SMRITIKA: The Library of Living Memory
 * Distinct Layout: Burma Teakwood Apothecary Drawer Bureau (Vertical Heavy Timber Cabinet)
 * Law of Reality: Objects remember (REVEAL)
 * Physics: Tactile Damped with Wood-Friction Inertia
 */
export const LibraryOfThings: React.FC<WorldProps> = ({
  worldData,
  onSelectProject,
  onLeaveWorld,
  onShapeshiftTo,
  isSpringActive,
  onTriggerSpring,
}) => {
  const [openDrawerId, setOpenDrawerId] = useState<string | null>(worldData.projects[0]?.id || null);
  const [developedPhotos, setDevelopedPhotos] = useState<Record<string, boolean>>({
    [worldData.projects[0]?.id || '']: true,
  });

  const handleToggleDrawer = (projectId: string) => {
    audioEngine.playTactileClick();
    if (openDrawerId === projectId) {
      setOpenDrawerId(null);
    } else {
      setOpenDrawerId(projectId);
      setTimeout(() => {
        setDevelopedPhotos((prev) => ({ ...prev, [projectId]: true }));
      }, 350);
    }
  };

  return (
    <div className={`relative min-h-screen w-full bg-[#140E0A] text-[#EDE4D8] px-4 sm:px-8 pt-24 pb-28 ${isSpringActive ? 'animate-spring-rebound' : ''}`}>
      {/* Woodgrain & Parchment Backdrop Texture */}
      <div className="absolute inset-0 bg-noise opacity-40 pointer-events-none" />
      <div className="absolute top-10 right-10 w-96 h-96 rounded-full bg-amber-900/20 blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto space-y-8">
        {/* Bespoke Bureau Pediment & Engraved Brass Plaque */}
        <header className="rounded-t-3xl bg-gradient-to-b from-[#2B1B12] via-[#21150E] to-[#1A100B] border-4 border-b-0 border-[#5C3A24] p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          {/* Decorative Cabinet Cornice Moldings */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-[#7D4E31] border-b border-[#3D2314]" />

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.25em] text-amber-400/90">
                <Archive className="w-3.5 h-3.5" />
                <span>Smṛti Catalog · Bureau of Preserved Time · Section A-42</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-serif text-[#F8F1E7] tracking-tight font-normal">
                {worldData.studentName}
              </h1>
              <p className="text-sm sm:text-base text-[#C2A892] max-w-2xl font-serif italic leading-relaxed">
                "{worldData.summarySnippet}"
              </p>
            </div>

            {/* In-World Bureau Physics Spring Latch */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => {
                  audioEngine.playTactileClick();
                  onTriggerSpring?.();
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-mono transition-all cursor-pointer shadow-lg ${
                  isSpringActive
                    ? 'bg-amber-400 text-stone-950 border-amber-300 ring-2 ring-amber-400/50 scale-105'
                    : 'bg-[#331F14] hover:bg-[#42291A] text-amber-200 border-[#7A4E31]'
                }`}
                title="Test Bureau Drawer Spring Tension"
              >
                <Activity className={`w-3.5 h-3.5 ${isSpringActive ? 'animate-spin' : 'text-amber-400'}`} />
                <span>{isSpringActive ? 'Spring Released · Recoiling...' : 'Test Spring (Drawer Latch)'}</span>
              </button>

              {onLeaveWorld && (
                <button
                  onClick={() => {
                    audioEngine.playTactileClick();
                    onLeaveWorld();
                  }}
                  className="px-3.5 py-2 rounded-xl bg-[#1C120B] hover:bg-[#281A10] border border-[#5C3A24] text-xs font-mono text-[#D4B598] transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Compass className="w-3.5 h-3.5 text-amber-400" />
                  <span>Mandala</span>
                </button>
              )}
            </div>
          </div>

          {/* Archival Classification Metadata Strip */}
          <div className="mt-6 pt-4 border-t border-[#4A2D1B] flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-[#A88864]">
            <div className="flex items-center gap-3">
              <span className="text-amber-300">Law:</span>
              <span className="text-[#EDE4D8] font-semibold">{worldData.worldSystem?.lawOfReality || 'Objects remember'}</span>
              <span>·</span>
              <span className="text-amber-300">Storage:</span>
              <span className="text-[#EDE4D8]">{worldData.storageArtefact}</span>
            </div>
            <div className="text-[11px] text-[#A88864]">
              <span>Tension: 160 · Damping: 24 (Teak Friction)</span>
            </div>
          </div>
        </header>

        {/* The Vertical Mahogany Cabinet Stack */}
        <div className="rounded-b-3xl bg-[#1A110B] border-4 border-t-0 border-[#5C3A24] p-4 sm:p-8 shadow-2xl space-y-5">
          {worldData.projects.map((project, idx) => {
            const isOpen = openDrawerId === project.id;
            const isDeveloped = developedPhotos[project.id];

            return (
              <div
                key={project.id}
                className={`transition-all duration-500 rounded-2xl border-2 ${
                  isOpen
                    ? 'border-amber-500/90 bg-[#261810] shadow-2xl translate-x-1 sm:translate-x-3'
                    : 'border-[#4A2F1D] bg-[#1E130D] hover:border-[#734A2F]'
                } ${isSpringActive ? 'animate-spring-vibrate' : ''}`}
              >
                {/* Teak Drawer Front Face with Brass Pull */}
                <div
                  onClick={() => handleToggleDrawer(project.id)}
                  className="p-5 sm:p-6 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 select-none"
                >
                  <div className="flex items-center gap-4">
                    {/* Brass Index Label Plate with Rivets */}
                    <div className="px-3 py-1.5 rounded bg-[#2D1B12] border border-[#8C5832] shadow-inner text-center min-w-[70px]">
                      <div className="text-[9px] font-mono uppercase text-[#A88864]">CABINET</div>
                      <div className="text-xs font-mono font-bold text-amber-300">#0{idx + 1}</div>
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <Tag className="w-3.5 h-3.5 text-amber-400" />
                        <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-semibold">
                          {project.artefact || project.artefactType}
                        </span>
                        <span className="text-xs font-mono text-[#A88864]">· {project.year}</span>
                      </div>
                      <h2 className="text-lg sm:text-xl font-serif text-[#F8F1E7] mt-0.5 font-medium group-hover:text-amber-200">
                        {project.title}
                      </h2>
                    </div>
                  </div>

                  {/* Brass Drawer Cup Pull */}
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-[#A88864] hidden sm:inline">
                      {isOpen ? '[Drawer Extended]' : '[Pull Handle]'}
                    </span>
                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-transform duration-300 ${
                      isOpen ? 'border-amber-400 bg-amber-400/20 rotate-90 text-amber-300' : 'border-[#734A2F] text-[#A88864]'
                    }`}>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                {/* Extended Drawer Interior Compartment */}
                {isOpen && (
                  <div className="px-5 pb-6 sm:px-8 sm:pb-8 pt-2 border-t border-[#4A2F1D] animate-fadeIn space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                      {/* Left: Vintage Daguerreotype Photograph Specimen */}
                      <div className="md:col-span-5 bg-[#140D08] p-4 rounded-xl border border-[#5C3A24] space-y-3">
                        <div className="flex items-center justify-between text-[11px] font-mono text-[#A88864]">
                          <span className="flex items-center gap-1">
                            <Camera className="w-3 h-3 text-amber-400" />
                            <span>Developing Emulsion</span>
                          </span>
                          <span>Silver Halide</span>
                        </div>

                        <div className={`relative h-48 rounded-lg overflow-hidden border border-[#3D2314] flex items-center justify-center transition-all duration-1000 ${
                          isDeveloped ? 'bg-[#291B13]' : 'bg-[#100A06] filter grayscale'
                        }`}>
                          <div className="text-center p-4">
                            <Archive className="w-8 h-8 text-amber-500/40 mx-auto mb-2" />
                            <p className="text-xs font-mono text-amber-200/90 italic">
                              "{project.summary}"
                            </p>
                          </div>
                          <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/70 text-[9px] font-mono text-amber-300">
                            FIELD ARTEFACT
                          </div>
                        </div>
                      </div>

                      {/* Right: Archival Field Dossier & Relic Access */}
                      <div className="md:col-span-7 space-y-4">
                        <div className="space-y-2">
                          <div className="text-xs font-mono uppercase text-amber-400 flex items-center gap-1.5">
                            <FileText className="w-3.5 h-3.5" />
                            <span>Preserved Documentation & Field Ephemera</span>
                          </div>
                          <p className="text-sm text-[#D9C5B2] leading-relaxed font-serif">
                            {project.summary}
                          </p>
                        </div>

                        {project.tags && (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {project.tags.map((tag, tIdx) => (
                              <span
                                key={tIdx}
                                className="px-2 py-0.5 rounded bg-[#2D1B12] border border-[#6B4228] text-[10px] font-mono text-[#C4A482]"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}

                        <div className="pt-3">
                          <button
                            onClick={() => {
                              audioEngine.playTactileClick();
                              onSelectProject(project);
                            }}
                            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-stone-950 font-mono text-xs font-bold transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                          >
                            <span>Open Detailed Relic Dossier</span>
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
