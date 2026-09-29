/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  FileText, 
  Map, 
  BookOpen, 
  Printer, 
  Laptop, 
  Compass, 
  ArrowRight, 
  Layers, 
  Eye,
  Lightbulb,
  CheckCircle2
} from 'lucide-react';
import { StudentWorld, ProjectNode } from '../types/shapeshifter';
import { audioEngine } from '../services/audioEngine';

interface LivingStudyProps {
  worldData: StudentWorld;
  onSelectProject: (project: ProjectNode) => void;
  onLeaveWorld: () => void;
  onShapeshiftTo: (worldId: string) => void;
}

export const LivingStudy: React.FC<LivingStudyProps> = ({
  worldData,
  onSelectProject,
  onLeaveWorld,
  onShapeshiftTo,
}) => {
  const [lampOn, setLampOn] = useState(true);
  const [showThreadOverlay, setShowThreadOverlay] = useState(true);
  const [activeReceiptIndex, setActiveReceiptIndex] = useState(0);

  const receiptFortunes = [
    '“The parrot does not read the sky; it reads the hand that trembles before the card.”',
    '“Every clinical corridor is an unspoken queue where time slows down.”',
    '“We measure the altitude of mountains by the breath of the weaver.”',
    '“Care is not a transaction; software for care must breathe at the speed of patience.”',
  ];

  const handlePrintNextReceipt = (e: React.MouseEvent) => {
    e.stopPropagation();
    audioEngine.playTactileClick();
    setActiveReceiptIndex((prev) => (prev + 1) % receiptFortunes.length);
  };

  const getProject = (id: string) => worldData.projects.find((p) => p.id === id);

  return (
    <div className="relative min-h-screen w-full bg-[#F7F4EE] text-[#2B2621] overflow-x-hidden pt-20 pb-24 transition-colors duration-1000">
      {/* Linen paper & desk texture backdrop */}
      <div className="absolute inset-0 bg-linen pointer-events-none opacity-90" />

      {/* Desk Lamp Ambient Lighting Cone */}
      <div 
        className={`absolute top-0 right-1/4 w-[700px] h-[700px] rounded-full blur-3xl pointer-events-none transition-opacity duration-1000 ${
          lampOn ? 'bg-amber-100/60 opacity-90' : 'bg-transparent opacity-0'
        }`} 
      />

      {/* Subtle Studio Studio Header Banner */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 mb-8 pt-4 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#2B2621]/15 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-mono text-red-600 mb-2">
            <span>SUTRADHARA</span>
            <span>·</span>
            <span>The Gatherer of Threads</span>
            <span>·</span>
            <span className="text-[#6B6358]">{worldData.storageArtefact}</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-serif font-normal text-[#2B2621] tracking-tight">
            Lakshmi Supriya
          </h1>

          <p className="text-sm sm:text-base text-[#574F44] max-w-2xl mt-2 font-serif italic leading-relaxed">
            “A research mind externalised into a study. Objects are not cards—they are living archive nodes connected by an unbroken red thread of inquiry.”
          </p>
        </div>

        {/* Study Environmental Controls */}
        <div className="flex items-center gap-3">
          {/* Desk Lamp Switch */}
          <button
            onClick={() => {
              audioEngine.playTactileClick();
              setLampOn(!lampOn);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs transition-colors cursor-pointer ${
              lampOn
                ? 'bg-amber-100 border-amber-300 text-amber-900 font-medium'
                : 'bg-stone-200 border-stone-300 text-stone-600'
            }`}
            title="Toggle Desk Lamp Ambient Lighting"
          >
            <Lightbulb className="w-3.5 h-3.5" />
            <span>{lampOn ? 'Desk Lamp Lit' : 'Desk Lamp Dim'}</span>
          </button>

          {/* Red Thread Highlight */}
          <button
            onClick={() => {
              audioEngine.playTactileClick();
              setShowThreadOverlay(!showThreadOverlay);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs transition-colors cursor-pointer ${
              showThreadOverlay
                ? 'bg-red-50 border-red-300 text-red-700 font-medium'
                : 'bg-stone-200 border-stone-300 text-stone-600'
            }`}
            title="Highlight Sutradhara Red Thread"
          >
            <Layers className="w-3.5 h-3.5 text-red-600" />
            <span>{showThreadOverlay ? 'Red Thread Visible' : 'Thread Quiet'}</span>
          </button>
        </div>
      </div>

      {/* Interactive Sutradhara Red Thread (SVG Connectors across the Room) */}
      {showThreadOverlay && (
        <div className="hidden lg:block absolute inset-0 pointer-events-none z-10">
          <svg className="w-full h-full">
            {/* Thread path from Chamba -> Hospital Journey -> Freeing Parrot -> Saha -> Menstruation */}
            <path
              d="M 320 280 Q 480 200, 680 290 T 400 680 T 780 720 T 1080 540"
              fill="none"
              stroke="#DC2626"
              strokeWidth="2.5"
              strokeDasharray="6 4"
              className="animate-thread"
            />
          </svg>
        </div>
      )}

      {/* The Living Study Grid of Tangible Physical Artefacts */}
      <div className="relative z-20 max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* ================= COLUMN 1: PINNED ON THE WALL ================= */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Artefact 1: Pinned Hospital Journey Map */}
          {getProject('hospital-journey') && (
            <div
              onClick={() => {
                audioEngine.playTactileClick();
                onSelectProject(getProject('hospital-journey')!);
              }}
              className="group relative bg-[#FFFDF8] rounded-xl border border-[#2B2621]/15 p-6 shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
            >
              {/* Studio Push-Pin Visual Detail */}
              <div className="absolute -top-3 left-8 w-6 h-6 rounded-full bg-red-600 shadow-md border-2 border-white flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-white/70" />
              </div>
              <div className="absolute -top-3 right-8 w-6 h-6 rounded-full bg-red-600 shadow-md border-2 border-white flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-white/70" />
              </div>

              <div className="flex items-center justify-between text-xs text-[#786E61] mb-3">
                <span className="font-mono text-red-600 font-semibold tracking-wider uppercase flex items-center gap-1.5">
                  <Map className="w-3.5 h-3.5" />
                  <span>Pinned on Studio Wall · Journey Map</span>
                </span>
                <span className="font-mono text-[11px]">4.8m Diagnostic Blueprint</span>
              </div>

              <h2 className="text-2xl font-serif text-[#2B2621] group-hover:text-red-700 transition-colors">
                Hospital Service Design: The Patient Journey
              </h2>

              <p className="text-xs text-[#5C5346] mt-1.5 leading-relaxed font-light">
                Shadowing 40 outpatient cohorts to trace hidden vulnerabilities, waiting room disorientation, and emotional stress contours across hospital transitions.
              </p>

              {/* Visual Map Rendering */}
              <div className="mt-4 relative rounded-lg overflow-hidden border border-[#2B2621]/10 bg-amber-50/40">
                <img
                  src={getProject('hospital-journey')?.image}
                  alt="Hospital Service Design Journey Map"
                  className="w-full h-48 object-cover group-hover:scale-102 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-4">
                  <div className="text-white text-xs">
                    <span className="font-mono text-[10px] text-red-300 block">Touchpoint Analysis:</span>
                    <span>Triage → Registration → Clinical Consultation → Diagnostic Queues</span>
                  </div>
                </div>
              </div>

              {/* Action Prompt */}
              <div className="mt-4 pt-3 border-t border-[#2B2621]/10 flex items-center justify-between text-xs text-red-700 font-medium">
                <span className="flex items-center gap-1">
                  <span>Inspect Blueprint & Field Case Study</span>
                </span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          )}

          {/* Artefact 2 & 3: Double Notebook & Editorial Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Chamba Fieldwork Publication / Calendar */}
            {getProject('chamba') && (
              <div
                onClick={() => {
                  audioEngine.playTactileClick();
                  onSelectProject(getProject('chamba')!);
                }}
                className="group bg-[#FFFDF8] rounded-xl border border-[#2B2621]/15 p-5 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
              >
                <div className="flex items-center justify-between text-xs text-[#786E61] mb-2 font-mono">
                  <span className="text-amber-800 uppercase flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Himalayan Fieldwork</span>
                  </span>
                  <span>2025</span>
                </div>

                <h3 className="text-lg font-serif text-[#2B2621] group-hover:text-red-700 transition-colors">
                  Chamba: Fieldwork & Living Memory
                </h3>

                <p className="text-xs text-[#5C5346] mt-1 font-light line-clamp-2">
                  Archival investigation into mountain valley craft rituals, Khadi cords, and cultural timekeeping.
                </p>

                <div className="mt-3 rounded-lg overflow-hidden border border-[#2B2621]/10 h-32 bg-stone-100">
                  <img
                    src={getProject('chamba')?.image}
                    alt="Chamba valley documentary photography"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>

                <div className="mt-3 flex items-center justify-between text-xs text-red-700 font-medium pt-2 border-t border-[#2B2621]/10">
                  <span>Unfold Calendar</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            )}

            {/* Hospital CX Field Observation Log */}
            {getProject('hospital-cx') && (
              <div
                onClick={() => {
                  audioEngine.playTactileClick();
                  onSelectProject(getProject('hospital-cx')!);
                }}
                className="group bg-[#FAF6EE] rounded-xl border border-[#2B2621]/20 p-5 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 relative"
                style={{
                  backgroundImage: 'radial-gradient(#C2410C 0.5px, transparent 0.5px)',
                  backgroundSize: '12px 12px',
                }}
              >
                {/* Visual binder spiral tab */}
                <div className="absolute -left-2 top-6 bottom-6 w-2 flex flex-col justify-around">
                  <div className="w-2 h-2 rounded-full bg-[#3B342C]" />
                  <div className="w-2 h-2 rounded-full bg-[#3B342C]" />
                  <div className="w-2 h-2 rounded-full bg-[#3B342C]" />
                </div>

                <div className="flex items-center justify-between text-xs text-[#786E61] mb-2 font-mono pl-2">
                  <span className="text-stone-700 uppercase flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5" />
                    <span>Field Sketchbook</span>
                  </span>
                  <span>12 Weeks</span>
                </div>

                <h3 className="text-lg font-serif text-[#2B2621] group-hover:text-red-700 transition-colors pl-2">
                  Hospital CX Field Log
                </h3>

                <p className="text-xs text-[#5C5346] mt-1 font-light line-clamp-3 pl-2">
                  Handwritten notes and rapid situational sketches chronicling how frontline nurses and attendants improvise micro-systems.
                </p>

                <div className="mt-6 pl-2 pt-3 border-t border-[#2B2621]/10 flex items-center justify-between text-xs text-red-700 font-medium">
                  <span>Open Field Notebook</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ================= COLUMN 2: ACTIVE DESK OBJECTS ================= */}
        <div className="lg:col-span-5 space-y-8">
          
          {/* Artefact 4: The Thermal Receipt Printer (Freeing the Parrot) */}
          {getProject('freeing-the-parrot') && (
            <div
              onClick={() => {
                audioEngine.playTactileClick();
                onSelectProject(getProject('freeing-the-parrot')!);
              }}
              className="group bg-[#2B2621] text-[#F7F4EE] rounded-xl border border-stone-800 p-6 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer"
            >
              <div className="flex items-center justify-between text-xs text-amber-300 mb-3 font-mono">
                <span className="flex items-center gap-1.5 uppercase">
                  <Printer className="w-3.5 h-3.5 text-amber-400" />
                  <span>Physical Hardware Artefact</span>
                </span>
                <span className="text-[10px] text-stone-400">203 DPI Heat Transfer</span>
              </div>

              <h2 className="text-2xl font-serif text-white group-hover:text-amber-300 transition-colors">
                Freeing the Parrot
              </h2>

              <p className="text-xs text-stone-300 mt-1 font-light leading-relaxed">
                Reconstructing street parrot divination through thermal receipt paper and generative language models.
              </p>

              {/* Streaming Receipt Animation Box */}
              <div className="mt-4 bg-[#FFFDF7] text-[#1A1815] p-4 rounded-lg shadow-inner font-mono text-[11px] border border-amber-900/30 relative overflow-hidden">
                <div className="text-[9px] uppercase tracking-widest text-stone-500 border-b border-dashed border-stone-300 pb-1 mb-2 flex justify-between">
                  <span>KILI JOSIYAM // DEV 0.9</span>
                  <span>TAP TO PRINT</span>
                </div>
                
                <p className="italic text-stone-900 min-h-[44px] leading-snug">
                  {receiptFortunes[activeReceiptIndex]}
                </p>

                <div className="mt-3 pt-2 border-t border-dashed border-stone-300 flex items-center justify-between text-[10px] text-stone-600">
                  <span>Scroll: #{activeReceiptIndex + 1} of 4</span>
                  <button
                    onClick={handlePrintNextReceipt}
                    className="px-2 py-0.5 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded text-[10px] font-semibold cursor-pointer"
                  >
                    Feed Paper ▾
                  </button>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-700/80 flex items-center justify-between text-xs text-amber-300 font-medium">
                <span>Explore Generative Divination</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          )}

          {/* Artefact 5: Saha Product Screen */}
          {getProject('saha') && (
            <div
              onClick={() => {
                audioEngine.playTactileClick();
                onSelectProject(getProject('saha')!);
              }}
              className="group bg-[#FFFDF8] rounded-xl border border-[#2B2621]/15 p-5 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer"
            >
              <div className="flex items-center justify-between text-xs text-[#786E61] mb-2 font-mono">
                <span className="text-red-700 uppercase flex items-center gap-1.5">
                  <Laptop className="w-3.5 h-3.5" />
                  <span>Digital Product Architecture</span>
                </span>
                <span>Mobile + Web</span>
              </div>

              <h3 className="text-xl font-serif text-[#2B2621] group-hover:text-red-700 transition-colors">
                Saha: Collaborative Health Platform
              </h3>

              <p className="text-xs text-[#5C5346] mt-1 font-light">
                Compassionate digital interfaces for family caregivers navigating chronic elder care handoffs.
              </p>

              {/* Device Frame Simulation */}
              <div className="mt-3 rounded-lg border border-stone-300 p-2.5 bg-stone-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold font-serif text-sm">
                  स
                </div>
                <div className="flex-1 text-[11px] leading-tight">
                  <div className="font-semibold text-stone-800">Saha Caregiver Hub</div>
                  <div className="text-stone-500">Medication Triage · Dignified Coordination</div>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between text-xs text-red-700 font-medium pt-2 border-t border-[#2B2621]/10">
                <span>View Product Case Study</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          )}

          {/* Artefact 6: Menstruation Research Specimen */}
          {getProject('menstruation-research') && (
            <div
              onClick={() => {
                audioEngine.playTactileClick();
                onSelectProject(getProject('menstruation-research')!);
              }}
              className="group bg-[#FFFDF8] rounded-xl border border-red-200/80 p-5 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer bg-gradient-to-br from-[#FFFDF8] to-red-50/30"
            >
              <div className="flex items-center justify-between text-xs text-red-700 mb-2 font-mono">
                <span className="uppercase">Editorial & Somatic Inquiry</span>
                <span>3 Volumes</span>
              </div>

              <h3 className="text-xl font-serif text-[#2B2621] group-hover:text-red-700 transition-colors">
                Menstruation as Lived Experience
              </h3>

              <p className="text-xs text-[#5C5346] mt-1 font-light">
                Challenging clinical sanitization by foregrounding somatic sensations, vernacular euphemisms, and maternal oral lineages.
              </p>

              <div className="mt-3 flex items-center justify-between text-xs text-red-700 font-medium pt-2 border-t border-red-200">
                <span>Examine Editorial Volumes</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          )}

        </div>

      </div>

      {/* World Transition Portal Bar at Bottom */}
      <div className="relative z-20 max-w-6xl mx-auto px-6 mt-16 pt-8 border-t border-[#2B2621]/15 flex flex-col sm:flex-row items-center justify-between gap-4">
        <button
          onClick={() => {
            audioEngine.playTactileClick();
            onLeaveWorld();
          }}
          className="flex items-center gap-2 text-xs font-mono tracking-wider uppercase text-[#6B6358] hover:text-[#2B2621] transition-colors cursor-pointer"
        >
          <Compass className="w-4 h-4" />
          <span>Fold Study · Return to Shared Mandala</span>
        </button>

        {/* Direct Shapeshift to Mayavin */}
        <button
          onClick={() => {
            audioEngine.playTactileClick();
            onShapeshiftTo('mayavin');
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#2B2621] text-white hover:bg-black text-xs font-medium transition-all shadow-md cursor-pointer group"
        >
          <span>Shapeshift to Mayavin · The Mirror Palace</span>
          <ArrowRight className="w-3.5 h-3.5 text-cyan-400 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};
