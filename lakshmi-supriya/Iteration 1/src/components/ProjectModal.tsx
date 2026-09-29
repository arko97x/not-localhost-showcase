/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { X, ArrowLeft, CheckCircle2, Compass, Sparkles, BookOpen } from 'lucide-react';
import { ProjectNode, StudentWorld } from '../types/shapeshifter';
import { audioEngine } from '../services/audioEngine';

interface ProjectModalProps {
  project: ProjectNode | null;
  worldData: StudentWorld;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({
  project,
  worldData,
  onClose,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        audioEngine.playTactileClick();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!project) return null;

  const isStudy = worldData.id === 'lakshmi';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto backdrop-blur-md bg-black/60 animate-fadeIn">
      {/* Modal Container styling matches world aesthetic */}
      <div
        className={`relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl transition-all duration-300 ${
          isStudy
            ? 'bg-[#FFFDF8] text-[#2B2621] border border-[#2B2621]/20 font-sans'
            : 'bg-[#08090E] text-slate-100 border border-cyan-500/40 font-mono prism-glow'
        }`}
      >
        {/* Sticky Header */}
        <div
          className={`sticky top-0 z-20 flex items-center justify-between px-6 py-4 border-b backdrop-blur-md ${
            isStudy
              ? 'bg-[#FFFDF8]/95 border-[#2B2621]/15 text-[#2B2621]'
              : 'bg-[#08090E]/95 border-cyan-500/20 text-slate-100'
          }`}
        >
          <div className="flex items-center gap-3 text-xs">
            <span
              className="font-mono uppercase tracking-wider font-semibold"
              style={{ color: worldData.accentColor }}
            >
              {worldData.shapeshifterName} ARCHIVE
            </span>
            <span className="opacity-30">/</span>
            <span className="opacity-75">{project.category}</span>
            <span className="opacity-30">/</span>
            <span className="opacity-60">{project.year}</span>
          </div>

          <button
            onClick={() => {
              audioEngine.playTactileClick();
              onClose();
            }}
            className="p-1.5 rounded-lg opacity-70 hover:opacity-100 transition-opacity cursor-pointer border border-current/20"
            title="Close dossier (ESC)"
            aria-label="Close dossier"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-10 space-y-8">
          
          {/* Title Area */}
          <div>
            <div className="text-xs uppercase tracking-widest opacity-60 mb-1 font-mono">
              Artefact Node: {project.artefactType}
            </div>
            <h1
              className={`text-3xl sm:text-4xl font-bold tracking-tight ${
                isStudy ? 'font-serif text-[#2B2621]' : 'text-white'
              }`}
            >
              {project.title}
            </h1>
            <p className="text-base sm:text-lg opacity-80 mt-1 font-serif italic">
              {project.subtitle}
            </p>
          </div>

          {/* Featured Visual Asset (if available) */}
          {project.image && (
            <div
              className={`rounded-xl overflow-hidden border shadow-inner ${
                isStudy ? 'border-[#2B2621]/15 bg-stone-100' : 'border-cyan-500/30 bg-black'
              }`}
            >
              <img
                src={project.image}
                alt={project.title}
                className="w-full max-h-96 object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          )}

          {/* Research Question Banner */}
          <div
            className={`p-5 rounded-xl border ${
              isStudy
                ? 'bg-amber-50/70 border-amber-200/80 text-[#3D352B]'
                : 'bg-cyan-950/30 border-cyan-800/40 text-cyan-200'
            }`}
          >
            <div className="text-[11px] font-mono uppercase tracking-wider opacity-70 mb-1 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Core Inquiry / Question</span>
            </div>
            <p className="text-base sm:text-lg font-serif italic leading-relaxed">
              "{project.researchQuestion}"
            </p>
          </div>

          {/* Summary & Context */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm leading-relaxed">
            <div>
              <h2 className="text-xs font-mono uppercase tracking-wider opacity-60 mb-2">
                Context & Setting
              </h2>
              <p className="opacity-90 font-light">{project.context}</p>
            </div>
            <div>
              <h2 className="text-xs font-mono uppercase tracking-wider opacity-60 mb-2">
                Conceptual Overview
              </h2>
              <p className="opacity-90 font-light">{project.summary}</p>
            </div>
          </div>

          {/* Process & Methods */}
          <div className="space-y-4 pt-4 border-t border-current/10">
            <h2 className="text-xs font-mono uppercase tracking-wider opacity-60">
              Iterative Process & Fieldwork
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {project.process.map((step, idx) => (
                <div
                  key={idx}
                  className={`p-3.5 rounded-lg border text-xs leading-relaxed flex items-start gap-2.5 ${
                    isStudy
                      ? 'bg-white/80 border-[#2B2621]/10'
                      : 'bg-slate-900/60 border-slate-800'
                  }`}
                >
                  <span
                    className="font-mono text-[10px] font-bold mt-0.5"
                    style={{ color: worldData.accentColor }}
                  >
                    0{idx + 1}.
                  </span>
                  <span className="opacity-90 font-light">{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Outcomes & Tangible Deliverables */}
          <div className="space-y-4 pt-4 border-t border-current/10">
            <h2 className="text-xs font-mono uppercase tracking-wider opacity-60">
              Outcomes & Tangible Artefacts
            </h2>
            <div className="space-y-2">
              {project.outcomes.map((outcome, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs">
                  <CheckCircle2
                    className="w-4 h-4 shrink-0 mt-0.5"
                    style={{ color: worldData.accentColor }}
                  />
                  <span className="opacity-90 font-light">{outcome}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Reflection */}
          {project.reflection && (
            <div
              className={`p-4 rounded-xl border text-xs italic ${
                isStudy
                  ? 'bg-[#F2ECE1] border-[#2B2621]/15 text-[#42392F]'
                  : 'bg-slate-900 border-slate-700 text-slate-300'
              }`}
            >
              <div className="text-[10px] font-mono not-italic uppercase tracking-widest opacity-60 mb-1">
                Reflective Synthesis
              </div>
              <p className="font-serif text-sm">“{project.reflection}”</p>
            </div>
          )}

          {/* Methods Tags (Clean Unboxed metadata with typographic separators) */}
          <div className="pt-4 border-t border-current/10 flex flex-wrap items-center gap-2 text-xs opacity-75 font-mono">
            <span className="opacity-50">Methods:</span>
            {project.methods.map((method, idx) => (
              <React.Fragment key={method}>
                <span>{method}</span>
                {idx < project.methods.length - 1 && <span aria-hidden="true">·</span>}
              </React.Fragment>
            ))}
          </div>

        </div>

        {/* Modal Footer */}
        <div
          className={`px-6 py-4 border-t flex items-center justify-between text-xs ${
            isStudy
              ? 'bg-[#FAF6EE] border-[#2B2621]/15'
              : 'bg-[#0B0D14] border-cyan-500/20'
          }`}
        >
          <span className="opacity-60 font-mono">
            Exploring {worldData.studentName}’s World
          </span>

          <button
            onClick={() => {
              audioEngine.playTactileClick();
              onClose();
            }}
            className="flex items-center gap-1.5 font-medium px-4 py-1.5 rounded transition-all cursor-pointer"
            style={{
              backgroundColor: isStudy ? '#2B2621' : '#06B6D4',
              color: isStudy ? '#FFFDF8' : '#05060A',
            }}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to {worldData.storageArtefact}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
