/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Sparkles, Wand2, Check, ArrowRight, Layers, RefreshCw } from 'lucide-react';
import { GeneratedArchetype, DNAForgeInput } from '../types/shapeshifter';
import { audioEngine } from '../services/audioEngine';

interface CreativeDNAForgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPreviewArchetypeWorld?: (generated: GeneratedArchetype, studentName: string) => void;
}

export const CreativeDNAForgeModal: React.FC<CreativeDNAForgeModalProps> = ({
  isOpen,
  onClose,
  onPreviewArchetypeWorld,
}) => {
  const [studentName, setStudentName] = useState('');
  const [selectedDisciplines, setSelectedDisciplines] = useState<string[]>(['Service Design', 'Ethnography']);
  const [selectedThemes, setSelectedThemes] = useState<string[]>(['Systems', 'Memory']);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>(['Paper', 'Notebooks']);
  const [customInquiry, setCustomInquiry] = useState('');
  const [generatedArchetype, setGeneratedArchetype] = useState<GeneratedArchetype | null>(null);
  const [isSynthesizing, setIsSynthesizing] = useState(false);

  if (!isOpen) return null;

  const disciplineOptions = [
    'Service Design',
    'Ethnography & Fieldwork',
    'Creative Coding & AI',
    'Editorial & Typography',
    'Physical Computing',
    'Spatial & Speculative UX',
    'Social Innovation',
    'Material Craft',
  ];

  const themeOptions = [
    'Memory & Archives',
    'Systems & Networks',
    'Care & Empathy',
    'Illusion & Perception',
    'Ritual & Sacred Time',
    'Somatic & Body',
    'Inquiry & Questioning',
    'Transformation & Change',
  ];

  const materialOptions = [
    'Paper & Receipts',
    'Glass & Mirrors',
    'Threads & Fabrics',
    'Notebooks & Maps',
    'Microcontrollers',
    'Clay & Earth',
    'Code & Shaders',
    'Oral Recordings',
  ];

  const toggleItem = (list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>, item: string) => {
    audioEngine.playTactileClick();
    if (list.includes(item)) {
      setList(list.filter((x) => x !== item));
    } else {
      setList([...list, item]);
    }
  };

  const handleSynthesize = () => {
    audioEngine.playTactileClick();
    setIsSynthesizing(true);
    setGeneratedArchetype(null);

    setTimeout(() => {
      // Deterministic creative interpretation based on inputs
      const allTokens = [...selectedDisciplines, ...selectedThemes, ...selectedMaterials].join(' ').toLowerCase();

      let archetype: GeneratedArchetype;

      if (allTokens.includes('illusion') || allTokens.includes('code') || allTokens.includes('glass')) {
        archetype = {
          shapeshifterName: 'MAYAVIN',
          shapeshifterMeaning: 'The Shaper of Illusion',
          creativeElement: 'Perception & Latent Space',
          storageArtefact: 'The Mirror Palace',
          archiveLanguage: 'Prismatic shards, optical distortions & algorithmic mirages',
          transformationBehavior: 'Surfaces shatter into mirror facets and chromatic dispersions',
          cosmologicalResonance: 'Māyā (The Play of Perception & Reality)',
          rationale: 'Your body of work takes the shape of questions regarding what is seen versus what is projected. The archive becomes a refractive chamber of mirrors.',
        };
      } else if (allTokens.includes('care') || allTokens.includes('somatic') || allTokens.includes('earth')) {
        archetype = {
          shapeshifterName: 'SEVIKA',
          shapeshifterMeaning: 'One Who Tends with Care',
          creativeElement: 'Dignity, Respite & Biological Rhythms',
          storageArtefact: 'The Healing Garden',
          archiveLanguage: 'Living botanical specimens, handwritten caregiver letters & shade pavilions',
          transformationBehavior: 'Lush shade washes over the screen, medicinal plants unfurl to disclose projects',
          cosmologicalResonance: 'Sevā (Selfless Attentive Stewardship)',
          rationale: 'Your body of work takes the shape of care systems and quiet restoration. The archive manifests as an organic garden tended through patience.',
        };
      } else if (allTokens.includes('memory') || allTokens.includes('archive') || allTokens.includes('recordings')) {
        archetype = {
          shapeshifterName: 'SMRITIKA',
          shapeshifterMeaning: 'Keeper of Living Memory',
          creativeElement: 'Ephemera & Oral Lineage',
          storageArtefact: 'The Library of Things',
          archiveLanguage: 'Deep wooden archival drawers, audio canisters & unsealed letters',
          transformationBehavior: 'Drawers slide open in resonance, memories awaken other drawers across the room',
          cosmologicalResonance: 'Smṛti (Living Recollection & Sacred Transmission)',
          rationale: 'Your body of work resonates with the preservation of fleeting human traces. Projects exist as drawer archives waiting for a curious hand.',
        };
      } else if (allTokens.includes('inquiry') || allTokens.includes('questioning') || allTokens.includes('fieldwork')) {
        archetype = {
          shapeshifterName: 'JIGNASU',
          shapeshifterMeaning: 'The Curious Seeker',
          creativeElement: 'Inquiry & Excavation',
          storageArtefact: 'The Question Archive',
          archiveLanguage: 'Unfolding question scrolls, lantern pathways & topological maps',
          transformationBehavior: 'Questions rearrange into glowing directional pathways across the dark',
          cosmologicalResonance: 'Anveṣaṇa (The Sacred Quest for Essence)',
          rationale: 'Your body of work takes the shape of questions that refuse easy settlement. The archive becomes a room mapped strictly by questions.',
        };
      } else {
        // Sutradhara archetype
        archetype = {
          shapeshifterName: 'SUTRADHARA',
          shapeshifterMeaning: 'The Gatherer of Threads',
          creativeElement: 'Connection & Systems of Care',
          storageArtefact: 'The Living Study',
          archiveLanguage: 'Pinned journey blueprints, thermal receipts, notebooks & red thread',
          transformationBehavior: 'Threads tighten, papers fold into flight, studio artefacts dissolve into lines',
          cosmologicalResonance: 'Sūtra (The Thread that Binds Knowledge)',
          rationale: 'Your body of work repeatedly gathers disparate human stories, systems, and materials into an interconnected field of inquiry.',
        };
      }

      setGeneratedArchetype(archetype);
      setIsSynthesizing(false);
      audioEngine.playGlassPing();
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto backdrop-blur-md bg-black/75 animate-fadeIn">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#090B10] border border-amber-500/40 text-slate-100 shadow-2xl p-6 sm:p-8">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-[0.2em] text-amber-400 mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Identity Synthesizer · Extensibility Engine</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif text-white">
              The Creative DNA Forge
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-xl font-light">
              Add a new student or experiment with your own practice. The system interprets creative patterns to propose a Shapeshifter Name, Storage Artefact, and Indian cosmological resonance.
            </p>
          </div>

          <button
            onClick={() => {
              audioEngine.playTactileClick();
              onClose();
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer border border-slate-800"
            aria-label="Close Forge"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Input Form */}
        <div className="space-y-6 text-xs">
          
          {/* Student Name */}
          <div>
            <label className="block text-slate-300 font-medium mb-1.5 uppercase font-mono tracking-wider text-[11px]">
              Student / Practitioner Name
            </label>
            <input
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder="e.g. Ishita Roy or Your Name"
              className="w-full px-3.5 py-2.5 rounded-lg bg-slate-900/80 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400 font-sans text-sm"
            />
          </div>

          {/* Disciplines */}
          <div>
            <label className="block text-slate-300 font-medium mb-1.5 uppercase font-mono tracking-wider text-[11px]">
              Dominant Disciplines & Modes of Practice
            </label>
            <div className="flex flex-wrap gap-2">
              {disciplineOptions.map((item) => {
                const active = selectedDisciplines.includes(item);
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => toggleItem(selectedDisciplines, setSelectedDisciplines, item)}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer border ${
                      active
                        ? 'bg-amber-500/20 border-amber-400 text-amber-200'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {item}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Themes */}
          <div>
            <label className="block text-slate-300 font-medium mb-1.5 uppercase font-mono tracking-wider text-[11px]">
              Core Inquiry Themes
            </label>
            <div className="flex flex-wrap gap-2">
              {themeOptions.map((item) => {
                const active = selectedThemes.includes(item);
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => toggleItem(selectedThemes, setSelectedThemes, item)}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer border ${
                      active
                        ? 'bg-red-500/20 border-red-400 text-red-200'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {item}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Materials */}
          <div>
            <label className="block text-slate-300 font-medium mb-1.5 uppercase font-mono tracking-wider text-[11px]">
              Recurring Materials & Mediums
            </label>
            <div className="flex flex-wrap gap-2">
              {materialOptions.map((item) => {
                const active = selectedMaterials.includes(item);
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => toggleItem(selectedMaterials, setSelectedMaterials, item)}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer border ${
                      active
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {item}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Question */}
          <div>
            <label className="block text-slate-300 font-medium mb-1.5 uppercase font-mono tracking-wider text-[11px]">
              Guiding Creative Inquiry (Optional)
            </label>
            <input
              type="text"
              value={customInquiry}
              onChange={(e) => setCustomInquiry(e.target.value)}
              placeholder="e.g. How can intangible oral stories be anchored in tangible domestic artefacts?"
              className="w-full px-3.5 py-2 rounded-lg bg-slate-900/80 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400 font-sans text-xs"
            />
          </div>

          {/* Synthesize Button */}
          <div className="pt-2">
            <button
              onClick={handleSynthesize}
              disabled={isSynthesizing}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-red-600 hover:from-amber-400 hover:to-red-500 text-slate-950 font-semibold text-sm transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSynthesizing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                  <span>Consulting Creative Archetypes...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4 text-slate-950" />
                  <span>Synthesize Shapeshifter Identity</span>
                </>
              )}
            </button>
          </div>

        </div>

        {/* Generated Archetype Result Card */}
        {generatedArchetype && (
          <div className="mt-8 p-6 rounded-xl bg-slate-950 border border-amber-500/50 shadow-2xl animate-fadeIn space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-[10px] uppercase tracking-widest text-amber-400 font-mono">
                Proposed Candidate Archetype
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                Authorship: Awaiting Student Review
              </span>
            </div>

            <div>
              <div className="text-xs uppercase text-slate-400 font-mono">
                {studentName || 'New Student'}
              </div>
              <h3 className="text-3xl font-serif font-bold text-white tracking-wide mt-0.5">
                {generatedArchetype.shapeshifterName}
              </h3>
              <p className="text-sm font-serif italic text-amber-300">
                {generatedArchetype.shapeshifterMeaning}
              </p>
            </div>

            <p className="text-xs text-slate-300 italic bg-slate-900/80 p-3 rounded-lg border border-slate-800">
              "{generatedArchetype.rationale}"
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
              <div>
                <span className="text-slate-500 block font-mono text-[10px] uppercase">
                  Storage Artefact
                </span>
                <span className="text-slate-200 font-medium font-serif text-sm">
                  {generatedArchetype.storageArtefact}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block font-mono text-[10px] uppercase">
                  Cosmological Principle
                </span>
                <span className="text-slate-200 font-medium">
                  {generatedArchetype.cosmologicalResonance}
                </span>
              </div>
              <div className="sm:col-span-2">
                <span className="text-slate-500 block font-mono text-[10px] uppercase">
                  Archive Language
                </span>
                <span className="text-slate-300">
                  {generatedArchetype.archiveLanguage}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-slate-500">
                Data schema ready for export to `studentsData.ts`
              </span>
              <button
                onClick={() => {
                  audioEngine.playTactileClick();
                  onClose();
                }}
                className="px-4 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-semibold text-xs transition-colors cursor-pointer"
              >
                Approve & Save Archetype
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
