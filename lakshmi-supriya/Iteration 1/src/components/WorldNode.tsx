/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ArrowRight, Layers, Sparkles, Compass, Radio } from 'lucide-react';
import { StudentWorld } from '../types/shapeshifter';

interface WorldNodeProps {
  world: StudentWorld;
  isHovered: boolean;
  onHoverStart: (worldId: string) => void;
  onHoverEnd: (worldId: string) => void;
  onSelect: (worldId: string) => void;
  position?: { x: number; y: number };
  variant: 'orbital-inner' | 'orbital-outer' | 'grid';
  nodeNumber?: number;
  popupPosition?: 'top' | 'bottom';
}

export const WorldNode: React.FC<WorldNodeProps> = ({
  world,
  isHovered,
  onHoverStart,
  onHoverEnd,
  onSelect,
  position,
  variant,
  nodeNumber,
  popupPosition = 'bottom',
}) => {
  const isActive = world.status === 'active';

  // Level 2 Micro-response rendering specific to each persona's creative DNA
  const renderMicroResponse = () => {
    if (!isHovered) return null;

    switch (world.id) {
      case 'smritika':
        return (
          <div className="absolute -top-1.5 -right-1.5 px-2 py-0.5 rounded bg-[#2D1F15] border border-amber-600/70 text-[9px] font-mono text-amber-300 shadow-sm animate-fadeIn">
            <span>photo develops ↗</span>
          </div>
        );
      case 'anveshin':
        return (
          <div className="absolute -top-1.5 -right-1.5 px-2 py-0.5 rounded bg-slate-950 border border-emerald-500/70 text-[9px] font-mono text-emerald-300 shadow-sm animate-fadeIn">
            <span>torch illuminates ◉</span>
          </div>
        );
      case 'karigara':
        return (
          <div className="absolute -top-1.5 -right-1.5 px-2 py-0.5 rounded bg-[#2B1B10] border border-amber-500/70 text-[9px] font-mono text-amber-300 shadow-sm animate-fadeIn">
            <span>pin seats ⚙</span>
          </div>
        );
      case 'kathaka':
        return (
          <div className="absolute -top-1.5 -right-1.5 px-2 py-0.5 rounded bg-[#33180E] border border-red-500/70 text-[9px] font-mono text-red-200 shadow-sm animate-fadeIn">
            <span>curtain parts ☖</span>
          </div>
        );
      case 'tantuvid':
        return (
          <div className="absolute -top-1.5 -right-1.5 px-2 py-0.5 rounded bg-slate-950 border border-cyan-500/70 text-[9px] font-mono text-cyan-300 shadow-sm animate-fadeIn">
            <span>thread tightens 〰</span>
          </div>
        );
      case 'bhutika':
        return (
          <div className="absolute -top-1.5 -right-1.5 px-2 py-0.5 rounded bg-[#20150E] border border-amber-600/70 text-[9px] font-mono text-amber-300 shadow-sm animate-fadeIn">
            <span>fissure forms ☵</span>
          </div>
        );
      case 'drashta':
        return (
          <div className="absolute -top-1.5 -right-1.5 px-2 py-0.5 rounded bg-[#070B16] border border-amber-400/70 text-[9px] font-mono text-amber-300 shadow-sm animate-fadeIn">
            <span>iris rotates ⊚</span>
          </div>
        );
      case 'svapnika':
        return (
          <div className="absolute -top-1.5 -right-1.5 px-2 py-0.5 rounded bg-[#10142A] border border-indigo-400/70 text-[9px] font-mono text-indigo-300 shadow-sm animate-fadeIn">
            <span>drifts 4px ↑</span>
          </div>
        );
      case 'jignasu':
        return (
          <div className="absolute -top-1.5 -right-1.5 px-2 py-0.5 rounded bg-red-950 border border-red-500 text-[9px] font-mono text-red-300 shadow-sm animate-fadeIn">
            <span>query re-orbits ?</span>
          </div>
        );
      case 'yatri':
        return (
          <div className="absolute -top-1.5 -right-1.5 px-2 py-0.5 rounded bg-[#2D1F10] border border-amber-500 text-[9px] font-mono text-amber-300 shadow-sm animate-fadeIn">
            <span>route extends ➔</span>
          </div>
        );
      case 'sangati':
        return (
          <div className="absolute -top-1.5 -right-1.5 px-2 py-0.5 rounded bg-orange-950 border border-orange-500 text-[9px] font-mono text-orange-300 shadow-sm animate-fadeIn">
            <span>neighbors lean 👥</span>
          </div>
        );
      case 'sevika':
        return (
          <div className="absolute -top-1.5 -right-1.5 px-2 py-0.5 rounded bg-[#062018] border border-emerald-500 text-[9px] font-mono text-emerald-300 shadow-sm animate-fadeIn">
            <span>water ripples ≋</span>
          </div>
        );
      case 'rupantara':
        return (
          <div className="absolute -top-1.5 -right-1.5 px-2 py-0.5 rounded bg-[#120F2B] border border-indigo-500 text-[9px] font-mono text-indigo-300 shadow-sm animate-fadeIn">
            <span>transmutes ✦</span>
          </div>
        );
      case 'lakshmi':
        return (
          <div className="absolute -top-1.5 -right-1.5 px-2 py-0.5 rounded bg-red-950 border border-red-500 text-[9px] font-mono text-red-300 shadow-sm animate-fadeIn">
            <span>sūtra taut ─</span>
          </div>
        );
      case 'mayavin':
        return (
          <div className="absolute -top-1.5 -right-1.5 px-2 py-0.5 rounded bg-cyan-950 border border-cyan-400 text-[9px] font-mono text-cyan-300 shadow-sm animate-fadeIn">
            <span>refraction ❖</span>
          </div>
        );
      default:
        return null;
    }
  };

  // Dedicated Anchored Popup tied strictly to THIS world node
  const renderAnchoredPopup = () => {
    if (!isHovered) return null;

    return (
      <div
        className={`absolute pointer-events-none z-50 w-72 p-3.5 rounded-xl bg-slate-900/98 border backdrop-blur-xl shadow-2xl transition-all duration-200 animate-fadeIn text-left ${
          popupPosition === 'top'
            ? 'bottom-full mb-3 left-1/2 -translate-x-1/2'
            : 'top-full mt-3 left-1/2 -translate-x-1/2'
        }`}
        style={{
          borderColor: world.accentColor,
          boxShadow: `0 12px 30px -4px rgba(0, 0, 0, 0.8), 0 0 20px ${world.accentColor}25`,
        }}
      >
        {/* Subtle arrow pointer to the node */}
        <div
          className={`absolute left-1/2 -translate-x-1/2 w-2.5 h-2.5 rotate-45 bg-slate-900 border ${
            popupPosition === 'top'
              ? 'bottom-[-6px] border-b border-r'
              : 'top-[-6px] border-t border-l'
          }`}
          style={{ borderColor: world.accentColor }}
        />

        <div className="flex items-center justify-between text-[10px] font-mono mb-1">
          <span
            className="uppercase tracking-wider font-semibold"
            style={{ color: world.accentColor }}
          >
            {world.shapeshifterName}
          </span>
          <span className="text-slate-400">
            {world.cosmologyPrinciple.split(' ')[0]}
          </span>
        </div>

        <div className="text-xs font-serif italic text-white line-clamp-2 mb-2 leading-relaxed">
          "{world.summarySnippet}"
        </div>

        <div className="pt-2 border-t border-slate-800 text-[10px] font-mono flex items-center justify-between text-slate-400">
          <span className="truncate max-w-[150px]">{world.storageArtefact}</span>
          <span className="text-amber-300 font-medium">Click to enter →</span>
        </div>
      </div>
    );
  };

  // GRID VARIANT
  if (variant === 'grid') {
    return (
      <div
        onPointerEnter={() => onHoverStart(world.id)}
        onPointerLeave={() => onHoverEnd(world.id)}
        onClick={() => onSelect(world.id)}
        className={`group relative p-5 rounded-2xl border backdrop-blur-md transition-all duration-300 cursor-pointer select-none ${
          isHovered
            ? 'scale-[1.02] shadow-2xl z-30'
            : isActive
            ? 'bg-slate-900/85 border-amber-500/30 shadow-lg'
            : 'bg-slate-950/70 border-slate-800'
        }`}
        style={{
          borderColor: isHovered
            ? world.accentColor
            : isActive
            ? 'rgba(212, 175, 55, 0.35)'
            : 'rgba(255, 255, 255, 0.08)',
          backgroundColor: isHovered ? 'rgba(15, 23, 42, 0.98)' : undefined,
          boxShadow: isHovered ? `0 0 24px ${world.accentColor}30` : undefined,
        }}
      >
        {renderMicroResponse()}

        <div className="flex items-center justify-between text-xs mb-3">
          <span
            className="font-mono text-[10px] uppercase tracking-wider font-semibold"
            style={{ color: world.accentColor }}
          >
            {world.cosmologyPrinciple}
          </span>
          {isActive ? (
            <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live Experience
            </span>
          ) : (
            <span className="text-[10px] text-slate-500 font-mono">
              {world.projects.length} artefacts
            </span>
          )}
        </div>

        <h3 className="text-lg font-serif text-white group-hover:text-amber-200 transition-colors">
          {world.studentName}
        </h3>

        <div className="text-xs font-serif italic text-amber-300/90 mt-0.5">
          {world.shapeshifterName} · {world.shapeshifterMeaning}
        </div>

        <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed font-light">
          {world.summarySnippet}
        </p>

        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
          <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
            <Layers className="w-3 h-3 text-slate-500" />
            <span className="truncate max-w-[140px]">{world.storageArtefact}</span>
          </div>
          <span
            className="flex items-center gap-1 font-medium group-hover:translate-x-1 transition-transform"
            style={{ color: world.accentColor }}
          >
            <span>Enter</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    );
  }

  // ORBITAL VARIANTS (Inner and Outer Rings)
  const isInner = variant === 'orbital-inner';
  const widthClass = isInner ? 'w-48' : 'w-44';

  return (
    <div
      className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-300 select-none"
      style={{
        left: position ? `calc(50% + ${position.x}px)` : '50%',
        top: position ? `calc(50% + ${position.y}px)` : '50%',
        zIndex: isHovered ? 50 : isInner ? 30 : 25,
      }}
      onPointerEnter={() => onHoverStart(world.id)}
      onPointerLeave={() => onHoverEnd(world.id)}
    >
      <button
        onClick={() => onSelect(world.id)}
        className={`group relative text-left ${widthClass} p-3 rounded-xl border backdrop-blur-md transition-all duration-300 cursor-pointer shadow-lg ${
          isHovered ? 'scale-105' : isInner ? '' : 'opacity-85 hover:opacity-100'
        }`}
        style={{
          backgroundColor: isHovered
            ? 'rgba(15, 23, 42, 0.98)'
            : isInner
            ? 'rgba(15, 23, 42, 0.82)'
            : 'rgba(15, 23, 42, 0.72)',
          borderColor: isHovered
            ? world.accentColor
            : isActive
            ? 'rgba(212, 175, 55, 0.35)'
            : 'rgba(255, 255, 255, 0.12)',
          boxShadow: isHovered ? `0 0 24px ${world.accentColor}40` : undefined,
        }}
      >
        {renderMicroResponse()}
        {renderAnchoredPopup()}

        <div className="flex items-center justify-between gap-1.5 mb-1 text-[10px] font-mono">
          <span
            className="uppercase tracking-wider font-semibold truncate"
            style={{ color: world.accentColor }}
          >
            {world.cosmologyPrinciple.split(' ')[0]}
          </span>
          {isActive ? (
            <span className="flex items-center gap-1 text-[9px] text-emerald-400 shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live
            </span>
          ) : (
            <span className="text-[9px] text-slate-500 shrink-0">
              {isInner ? 'Inner Orbit' : `Node ${nodeNumber || ''}`}
            </span>
          )}
        </div>

        <h3 className="text-xs sm:text-sm font-semibold text-white group-hover:text-amber-200 transition-colors truncate">
          {world.studentName}
        </h3>

        <div className="text-[11px] font-serif italic text-amber-200/80 truncate mt-0.5">
          {world.shapeshifterName}
        </div>

        <div className="text-[10px] text-slate-400 font-light mt-1 flex items-center gap-1 truncate">
          <Layers className="w-2.5 h-2.5 text-slate-500 shrink-0" />
          <span className="truncate">{world.storageArtefact}</span>
        </div>

        <div className="mt-2 pt-1.5 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
          <span className="text-slate-500 font-mono">{world.projects.length} Works</span>
          <span
            className="flex items-center gap-0.5 font-medium group-hover:translate-x-0.5 transition-transform"
            style={{ color: world.accentColor }}
          >
            <span>Enter</span>
            <ArrowRight className="w-2.5 h-2.5" />
          </span>
        </div>
      </button>
    </div>
  );
};
