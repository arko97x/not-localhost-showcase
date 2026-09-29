/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  Compass, 
  Sliders, 
  Eye, 
  Terminal, 
  Layers, 
  Maximize2 
} from 'lucide-react';
import { StudentWorld, ProjectNode } from '../types/shapeshifter';
import { audioEngine } from '../services/audioEngine';

interface MirrorPalaceProps {
  worldData: StudentWorld;
  onSelectProject: (project: ProjectNode) => void;
  onLeaveWorld: () => void;
  onShapeshiftTo: (worldId: string) => void;
}

export const MirrorPalace: React.FC<MirrorPalaceProps> = ({
  worldData,
  onSelectProject,
  onLeaveWorld,
  onShapeshiftTo,
}) => {
  const [prismAngle, setPrismAngle] = useState(38);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isAnamorphicSnapped, setIsAnamorphicSnapped] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 20;
    setMousePos({ x, y });

    // If mouse is near center, snap anamorphic illusion
    if (Math.abs(x) < 3 && Math.abs(y) < 3) {
      if (!isAnamorphicSnapped) {
        audioEngine.playGlassPing();
        setIsAnamorphicSnapped(true);
      }
    } else {
      if (isAnamorphicSnapped) {
        setIsAnamorphicSnapped(false);
      }
    }
  };

  const getProject = (id: string) => worldData.projects.find((p) => p.id === id);

  return (
    <div
      onMouseMove={handleMouseMove}
      className="relative min-h-screen w-full bg-[#05060A] text-slate-100 overflow-x-hidden pt-20 pb-24 transition-colors duration-1000 font-mono"
    >
      {/* Prismatic Mirror Grid & Chromatic Aberration Backdrop */}
      <div className="absolute inset-0 bg-mirror-grid pointer-events-none opacity-40" />

      {/* Dynamic Chromatic Dispersion Glow based on prismAngle */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-[140px] pointer-events-none transition-all duration-300"
        style={{
          background: `radial-gradient(circle, rgba(6,182,212,0.18) 0%, rgba(139,92,246,0.15) ${prismAngle}%, rgba(236,72,153,0.1) 70%, transparent 100%)`,
        }}
      />

      {/* Header Banner */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 mb-8 pt-4 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-cyan-500/20 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-cyan-400 mb-2">
            <span>MAYAVIN</span>
            <span>//</span>
            <span>The Shaper of Illusion</span>
            <span>//</span>
            <span className="text-slate-400">{worldData.storageArtefact}</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-sans font-bold text-white tracking-tight uppercase"
            style={{ fontFamily: 'Syne, sans-serif' }}
          >
            Mayavin
          </h1>

          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mt-2 font-mono leading-relaxed">
            “An unstable digital chamber where code questions perception, truth, and technological mimicry. Reality is an anamorphic angle waiting to be resolved.”
          </p>
        </div>

        {/* Prismatic Controls */}
        <div className="flex items-center gap-4 bg-slate-900/80 p-3 rounded-xl border border-cyan-500/30 backdrop-blur-md">
          <div className="flex items-center gap-2 text-xs text-cyan-300">
            <Sliders className="w-3.5 h-3.5" />
            <span className="text-[11px] uppercase tracking-wider">Prism Refraction:</span>
          </div>
          <input
            type="range"
            min="10"
            max="80"
            value={prismAngle}
            onChange={(e) => {
              setPrismAngle(Number(e.target.value));
              audioEngine.playTactileClick();
            }}
            className="w-32 accent-cyan-400 cursor-pointer"
          />
          <span className="text-xs font-mono text-cyan-400 w-8">{prismAngle}°</span>
        </div>
      </div>

      {/* Anamorphic Focal Sweet Spot Alert */}
      {isAnamorphicSnapped && (
        <div className="relative z-30 max-w-xl mx-auto mb-6 px-4 py-2 rounded-lg bg-cyan-950/80 border border-cyan-400 text-center text-xs text-cyan-200 animate-pulse flex items-center justify-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>Focal Sweet Spot Aligned: Perspective distortion collapsed into coherent signal.</span>
        </div>
      )}

      {/* The Prismatic Mirror Shard Grid */}
      <div className="relative z-20 max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Shard 1: Latent Echoes (Deep Generative Mirror) */}
        {getProject('latent-echoes') && (
          <div
            onClick={() => {
              audioEngine.playGlassPing();
              onSelectProject(getProject('latent-echoes')!);
            }}
            className="lg:col-span-8 group relative rounded-2xl border border-cyan-500/30 bg-slate-950/80 p-6 shadow-2xl hover:border-cyan-400 transition-all duration-500 cursor-pointer backdrop-blur-xl overflow-hidden"
            style={{
              transform: `perspective(1000px) rotateX(${mousePos.y * 0.3}deg) rotateY(${mousePos.x * 0.3}deg)`,
            }}
          >
            {/* Prismatic Shard Facet Line */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-cyan-500/20 to-transparent pointer-events-none" />
            
            <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
              <span className="text-cyan-400 tracking-wider uppercase font-semibold flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5" />
                <span>Recursive Feedback Apparatus</span>
              </span>
              <span className="text-[11px] text-slate-500">Cycle #1000 Drift</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-sans font-bold text-white group-hover:text-cyan-300 transition-colors uppercase tracking-wide"
              style={{ fontFamily: 'Syne, sans-serif' }}
            >
              Latent Echoes: Generative Hallucination Loops
            </h2>

            <p className="text-xs text-slate-400 mt-2 font-mono leading-relaxed">
              Feeding machine-generated interpretations recursively back into vision models until the image dissolves into latent dream states.
            </p>

            {/* Visual Mirror Surface */}
            <div className="mt-5 relative rounded-xl overflow-hidden border border-cyan-500/30 bg-black/60 h-64 group-hover:border-cyan-400/70 transition-all duration-300">
              <img
                src={getProject('latent-echoes')?.image}
                alt="Mirror Palace crystalline refractions"
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 filter contrast-125"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#05060A] via-transparent to-transparent flex items-end p-5">
                <div className="text-xs text-cyan-200">
                  <span className="text-[10px] text-cyan-400 block tracking-wider uppercase">Recursive Neural Entropy:</span>
                  <span>Diffusion Model → CLIP Decoder → Semantic Drift Matrix</span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-cyan-400 font-medium">
              <span>Inspect Neural Hallucination Pipeline</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </div>
          </div>
        )}

        {/* Shard 2: Refractive Memory (Physical Glass Prisms) */}
        {getProject('refractive-memory') && (
          <div
            onClick={() => {
              audioEngine.playGlassPing();
              onSelectProject(getProject('refractive-memory')!);
            }}
            className="lg:col-span-4 group relative rounded-2xl border border-purple-500/30 bg-slate-950/80 p-5 shadow-xl hover:border-purple-400 transition-all duration-500 cursor-pointer backdrop-blur-xl"
            style={{
              transform: `perspective(1000px) rotateX(${-mousePos.y * 0.4}deg) rotateY(${-mousePos.x * 0.4}deg)`,
            }}
          >
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span className="text-purple-400 uppercase tracking-wider font-semibold">
                Snell’s Law Interface
              </span>
              <span>2025</span>
            </div>

            <h3 className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors uppercase tracking-tight"
              style={{ fontFamily: 'Syne, sans-serif' }}
            >
              Refractive Memory: Optical Distortion
            </h3>

            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Physical crystal prisms refracting state archives, proving truth is bent by the lens of who illuminates the narrative.
            </p>

            <div className="mt-4 p-4 rounded-lg bg-purple-950/30 border border-purple-800/40 text-[11px] text-purple-200">
              <div className="text-[10px] uppercase text-purple-400 mb-1">Index of Refraction:</div>
              <div>η = 1.52 (Crown Glass Caustics Simulated)</div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-purple-400 font-medium">
              <span>Inspect Prismatic Exhibit</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        )}

        {/* Shard 3: Anamorphic Interface */}
        {getProject('anamorphic-interface') && (
          <div
            onClick={() => {
              audioEngine.playGlassPing();
              onSelectProject(getProject('anamorphic-interface')!);
            }}
            className="lg:col-span-6 group relative rounded-2xl border border-cyan-500/30 bg-slate-950/80 p-5 shadow-xl hover:border-cyan-400 transition-all duration-500 cursor-pointer backdrop-blur-xl"
            style={{
              transform: `perspective(1000px) rotateX(${mousePos.y * 0.25}deg) rotateY(${mousePos.x * 0.25}deg)`,
            }}
          >
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span className="text-cyan-400 uppercase tracking-wider font-semibold">
                Perspective-Bound UI
              </span>
              <span>Gaze Locked</span>
            </div>

            <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors uppercase tracking-tight"
              style={{ fontFamily: 'Syne, sans-serif' }}
            >
              Anamorphic Interface
            </h3>

            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              A digital interface designed to appear completely shattered except from one precise physical coordinate in space.
            </p>

            <div className="mt-4 flex items-center justify-between text-[11px] text-slate-400 bg-slate-900/60 p-3 rounded-lg border border-slate-800">
              <span>Current Vantage Deviation:</span>
              <span className="font-mono text-cyan-300">
                ΔX: {mousePos.x.toFixed(1)}° · ΔY: {mousePos.y.toFixed(1)}°
              </span>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-cyan-400 font-medium">
              <span>Examine Spatial Experiment</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        )}

        {/* Shard 4: Digital Shroud */}
        {getProject('digital-shroud') && (
          <div
            onClick={() => {
              audioEngine.playGlassPing();
              onSelectProject(getProject('digital-shroud')!);
            }}
            className="lg:col-span-6 group relative rounded-2xl border border-pink-500/30 bg-slate-950/80 p-5 shadow-xl hover:border-pink-400 transition-all duration-500 cursor-pointer backdrop-blur-xl"
            style={{
              transform: `perspective(1000px) rotateX(${-mousePos.y * 0.25}deg) rotateY(${-mousePos.x * 0.25}deg)`,
            }}
          >
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span className="text-pink-400 uppercase tracking-wider font-semibold">
                Adversarial Biometrics
              </span>
              <span>Wearable Counter-Surveillance</span>
            </div>

            <h3 className="text-xl font-bold text-white group-hover:text-pink-300 transition-colors uppercase tracking-tight"
              style={{ fontFamily: 'Syne, sans-serif' }}
            >
              Digital Shroud: Algorithmic Camouflage
            </h3>

            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Reflective wearable surfaces and specular makeup patterns designed to confuse facial recognition models while dazzling human observers.
            </p>

            <div className="mt-4 flex items-center justify-between text-[11px] text-slate-400 bg-pink-950/20 p-3 rounded-lg border border-pink-900/30">
              <span>Biometric Evasion Ratio:</span>
              <span className="font-mono text-pink-300">94.2% Invariant Failure</span>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-pink-400 font-medium">
              <span>View Wearable Prototypes</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        )}

      </div>

      {/* World Transition Portal Bar */}
      <div className="relative z-20 max-w-6xl mx-auto px-6 mt-16 pt-8 border-t border-cyan-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
        <button
          onClick={() => {
            audioEngine.playTactileClick();
            onLeaveWorld();
          }}
          className="flex items-center gap-2 text-xs font-mono tracking-wider uppercase text-slate-400 hover:text-cyan-400 transition-colors cursor-pointer"
        >
          <Compass className="w-4 h-4" />
          <span>Exit Mirror Chamber // Return to Mandala</span>
        </button>

        {/* Direct Shapeshift to Lakshmi */}
        <button
          onClick={() => {
            audioEngine.playTactileClick();
            onShapeshiftTo('lakshmi');
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-950 border border-cyan-500/40 text-cyan-200 hover:bg-cyan-900/60 text-xs font-medium transition-all shadow-md cursor-pointer group"
        >
          <span>Shapeshift to Lakshmi · The Living Study</span>
          <ArrowRight className="w-3.5 h-3.5 text-red-400 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};
