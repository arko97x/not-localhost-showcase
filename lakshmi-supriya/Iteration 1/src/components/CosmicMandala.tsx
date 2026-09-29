/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useCallback } from 'react';
import { Sparkles, ArrowRight, Layers, Compass, Grid, Orbit } from 'lucide-react';
import { StudentWorld, WorldId } from '../types/shapeshifter';
import { audioEngine } from '../services/audioEngine';
import { WorldNode } from './WorldNode';

interface CosmicMandalaProps {
  students: Record<string, StudentWorld>;
  onSelectStudent: (studentId: WorldId) => void;
  onOpenForge: () => void;
}

export const CosmicMandala: React.FC<CosmicMandalaProps> = ({
  students,
  onSelectStudent,
  onOpenForge,
}) => {
  // Strict Hover State Machine: null = completely quiet idle state
  const [hoveredStudentId, setHoveredStudentId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'orbital' | 'grid'>('orbital');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'active' | 'inquiry'>('all');

  const studentList = Object.values(students);

  // Partition students into inner orbit (5 nodes) and outer orbit (10 nodes)
  const innerOrbitStudents = studentList.slice(0, 5);
  const outerOrbitStudents = studentList.slice(5);

  const filteredStudents = studentList.filter((s) => {
    if (selectedFilter === 'active') return s.status === 'active';
    if (selectedFilter === 'inquiry') return s.projects.some((p) => p.researchQuestion);
    return true;
  });

  // Hover State Machine: triggers sound strictly ONCE per entry
  const handleHoverStart = useCallback((worldId: string) => {
    setHoveredStudentId((current) => {
      if (current === worldId) return current; // Already active: no sound, no state restart
      audioEngine.playWorldHover(worldId);
      return worldId;
    });
  }, []);

  const handleHoverEnd = useCallback((worldId: string) => {
    setHoveredStudentId((current) => {
      if (current === worldId) {
        audioEngine.stopCurrentHoverSound();
        return null;
      }
      return current;
    });
  }, []);

  const handleSelectStudent = (worldId: string) => {
    audioEngine.playTactileClick();
    onSelectStudent(worldId);
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-start overflow-hidden bg-[#07090E] text-slate-100 pt-20 pb-24 px-4 sm:px-6">
      {/* Background ambient cosmic glow & calm concentric rings (Completely static and non-reactive to cursor) */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div
          className="w-[1000px] h-[1000px] rounded-full border border-indigo-900/25 opacity-30 animate-pulse"
          style={{ animationDuration: '10s' }}
        />
        <div className="w-[820px] h-[820px] rounded-full border border-amber-500/15 border-dashed opacity-40" />
        <div className="w-[520px] h-[520px] rounded-full border border-slate-700/35 opacity-40" />
        <div className="w-[280px] h-[280px] rounded-full border border-amber-400/20 opacity-50" />

        {/* Soft cosmic nebula gradient */}
        <div className="absolute w-[700px] h-[700px] bg-gradient-to-tr from-indigo-950/30 via-purple-950/20 to-amber-950/20 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Hero Header Section */}
      <div className="relative z-10 text-center max-w-3xl mx-auto mb-6 mt-4 pointer-events-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] tracking-[0.2em] uppercase font-mono text-amber-300 bg-amber-950/40 border border-amber-800/40 mb-3">
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span>The Shared Digital Universe · Akāśa</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-serif tracking-tight text-white mb-3">
          One system. Many worlds.
        </h1>

        <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-xl mx-auto font-light">
          A living showcase for Experience Design students. The website itself shapeshifts its form, archive language, and spatial physics according to whose work you enter.
        </p>

        {/* View Switcher & Filter Controls */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
          <div className="inline-flex items-center p-1 rounded-xl bg-slate-900/90 border border-slate-800 backdrop-blur-md">
            <button
              onClick={() => {
                audioEngine.playTactileClick();
                setViewMode('orbital');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                viewMode === 'orbital'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Orbit className="w-3.5 h-3.5" />
              <span>Cosmic Mandala</span>
            </button>
            <button
              onClick={() => {
                audioEngine.playTactileClick();
                setViewMode('grid');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>Constellation Grid</span>
            </button>
          </div>

          <div className="inline-flex items-center p-1 rounded-xl bg-slate-900/90 border border-slate-800 text-xs">
            <button
              onClick={() => setSelectedFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                selectedFilter === 'all'
                  ? 'bg-slate-800 text-white font-medium'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All 15 Worlds
            </button>
            <button
              onClick={() => setSelectedFilter('active')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                selectedFilter === 'active'
                  ? 'bg-slate-800 text-emerald-300 font-medium'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Live Prototypes
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODE 1: ORBITAL MANDALA (Concentric Dual-Rings with Object-Specific Hover) */}
      {/* ========================================================================= */}
      {viewMode === 'orbital' ? (
        <div className="relative z-10 w-full max-w-6xl min-h-[740px] sm:min-h-[820px] flex items-center justify-center my-4 overflow-visible">
          {/* Central Sun / Bindu: Core Hub (Completely calm and non-reactive to cursor pass-through) */}
          <div className="relative z-20 flex flex-col items-center justify-center text-center p-6 rounded-full w-44 h-44 sm:w-52 sm:h-52 bg-slate-950/90 border border-amber-500/40 shadow-2xl backdrop-blur-xl select-none pointer-events-none">
            <div className="w-2.5 h-2.5 rounded-full bg-amber-400 mb-2 shadow-[0_0_14px_#F59E0B]" />
            <span className="text-[10px] tracking-[0.3em] uppercase text-amber-400 font-mono mb-0.5">
              Bindu · Axis
            </span>
            <h2 className="text-base sm:text-lg font-serif font-bold text-white tracking-wide">
              SHAPESHIFTER
            </h2>
            <p className="text-[11px] text-slate-400 mt-1 max-w-[130px] leading-tight font-light">
              One shared system manifesting 15 creative dimensions
            </p>
            <div className="mt-2.5 text-[10px] text-slate-500 font-mono flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Select node to enter</span>
            </div>
          </div>

          {/* SVG Thread Connectors from Bindu to all nodes */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
            {/* Inner Ring Connector Lines (5 nodes) */}
            {innerOrbitStudents.map((student, i) => {
              const angle = (i / 5) * 2 * Math.PI - Math.PI / 2;
              const radius = 240;
              const isHovered = hoveredStudentId === student.id;
              return (
                <line
                  key={`line-inner-${student.id}`}
                  x1="50%"
                  y1="50%"
                  x2={`calc(50% + ${Math.cos(angle) * radius}px)`}
                  y2={`calc(50% + ${Math.sin(angle) * radius}px)`}
                  stroke={isHovered ? student.accentColor : '#D4AF37'}
                  strokeWidth={isHovered ? 2 : 1}
                  strokeOpacity={isHovered ? 0.9 : 0.22}
                  strokeDasharray={isHovered ? 'none' : '4 4'}
                  className="transition-all duration-300"
                />
              );
            })}

            {/* Outer Ring Connector Lines (10 nodes) */}
            {outerOrbitStudents.map((student, i) => {
              const angle = ((i + 0.5) / 10) * 2 * Math.PI - Math.PI / 2;
              const radius = 385;
              const isHovered = hoveredStudentId === student.id;
              return (
                <line
                  key={`line-outer-${student.id}`}
                  x1="50%"
                  y1="50%"
                  x2={`calc(50% + ${Math.cos(angle) * radius}px)`}
                  y2={`calc(50% + ${Math.sin(angle) * radius}px)`}
                  stroke={isHovered ? student.accentColor : '#475569'}
                  strokeWidth={isHovered ? 1.5 : 0.75}
                  strokeOpacity={isHovered ? 0.8 : 0.15}
                  strokeDasharray={isHovered ? 'none' : '2 3'}
                  className="transition-all duration-300"
                />
              );
            })}
          </svg>

          {/* INNER ORBIT NODES (5 Nodes, 72° angular separation, Radius 240px) */}
          {innerOrbitStudents.map((student, i) => {
            const angle = (i / 5) * 2 * Math.PI - Math.PI / 2;
            const radius = 240;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;

            return (
              <WorldNode
                key={student.id}
                world={student}
                isHovered={hoveredStudentId === student.id}
                onHoverStart={handleHoverStart}
                onHoverEnd={handleHoverEnd}
                onSelect={handleSelectStudent}
                position={{ x, y }}
                variant="orbital-inner"
                nodeNumber={i + 1}
                popupPosition={y < 0 ? 'bottom' : 'top'}
              />
            );
          })}

          {/* OUTER ORBIT NODES (10 Nodes, 36° angular separation, Radius 385px) */}
          {outerOrbitStudents.map((student, i) => {
            const angle = ((i + 0.5) / 10) * 2 * Math.PI - Math.PI / 2;
            const radius = 385;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;

            return (
              <WorldNode
                key={student.id}
                world={student}
                isHovered={hoveredStudentId === student.id}
                onHoverStart={handleHoverStart}
                onHoverEnd={handleHoverEnd}
                onSelect={handleSelectStudent}
                position={{ x, y }}
                variant="orbital-outer"
                nodeNumber={i + 6}
                popupPosition={y < 0 ? 'bottom' : 'top'}
              />
            );
          })}
        </div>
      ) : (
        /* ========================================================================= */
        /* MODE 2: CONSTELLATION GRID (Spacious, Clear, Accessible 3-Column View)     */
        /* ========================================================================= */
        <div className="relative z-10 w-full max-w-5xl mx-auto my-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredStudents.map((student) => (
            <WorldNode
              key={`grid-${student.id}`}
              world={student}
              isHovered={hoveredStudentId === student.id}
              onHoverStart={handleHoverStart}
              onHoverEnd={handleHoverEnd}
              onSelect={handleSelectStudent}
              variant="grid"
            />
          ))}
        </div>
      )}

      {/* Quick Launch Cards for the Two Prototype Worlds */}
      <div className="relative z-10 max-w-4xl w-full mx-auto mt-10 grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Lakshmi Card */}
        <div
          onClick={() => {
            audioEngine.playTactileClick();
            onSelectStudent('lakshmi');
          }}
          className="group p-6 rounded-2xl bg-amber-950/20 border border-amber-700/30 hover:border-red-500/60 transition-all duration-300 cursor-pointer backdrop-blur-sm shadow-xl"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] tracking-widest uppercase font-mono text-red-400">
              SUTRADHARA · Living Study
            </span>
            <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Live Prototype 01
            </span>
          </div>
          <h3 className="text-2xl font-serif text-white group-hover:text-amber-200 transition-colors">
            Lakshmi Supriya
          </h3>
          <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
            An intensely active, messy research room where hospital maps, Chamba field notebooks, and thermal receipts connect via red threads.
          </p>
          <div className="mt-5 flex items-center justify-between text-xs text-red-400 font-medium">
            <span>Inhabit The Living Study</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform" />
          </div>
        </div>

        {/* Mayavin Card */}
        <div
          onClick={() => {
            audioEngine.playTactileClick();
            onSelectStudent('mayavin');
          }}
          className="group p-6 rounded-2xl bg-cyan-950/20 border border-cyan-700/30 hover:border-cyan-400/60 transition-all duration-300 cursor-pointer backdrop-blur-sm shadow-xl"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] tracking-widest uppercase font-mono text-cyan-400">
              MAYAVIN · Mirror Palace
            </span>
            <span className="text-[10px] text-cyan-400 font-mono flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              Live Prototype 02
            </span>
          </div>
          <h3 className="text-2xl font-mono text-white group-hover:text-cyan-200 transition-colors">
            Mayavin
          </h3>
          <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
            A refractive digital chamber questioning perception, machine hallucinations, and perspective-bound interfaces through mirrored shards.
          </p>
          <div className="mt-5 flex items-center justify-between text-xs text-cyan-400 font-medium">
            <span>Enter The Mirror Palace</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform" />
          </div>
        </div>
      </div>

      {/* Footer Info & Forge trigger */}
      <div className="relative z-10 mt-12 text-center text-xs text-slate-500 flex flex-wrap items-center justify-center gap-4">
        <span>Curated for Experience Design Class Showcase</span>
        <span>·</span>
        <button
          onClick={() => {
            audioEngine.playTactileClick();
            onOpenForge();
          }}
          className="text-amber-400 hover:text-amber-300 underline underline-offset-4 cursor-pointer"
        >
          Open Creative DNA Forge to configure new worlds
        </button>
      </div>
    </div>
  );
};
