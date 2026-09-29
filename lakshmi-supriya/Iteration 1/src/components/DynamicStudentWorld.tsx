/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Compass, ArrowRight, Layers, Sparkles, Activity, Gauge, Zap } from 'lucide-react';
import { StudentWorld, ProjectNode } from '../types/shapeshifter';
import { audioEngine } from '../services/audioEngine';
import { useSpatialPhysics } from '../hooks/useSpatialPhysics';

// 13 World Reality Systems Components
import { LibraryOfThings } from './worlds/LibraryOfThings';
import { CaveOfQuestions } from './worlds/CaveOfQuestions';
import { WorkshopOfElements } from './worlds/WorkshopOfElements';
import { KathaCourtyard } from './worlds/KathaCourtyard';
import { LoomOfSystems } from './worlds/LoomOfSystems';
import { MaterialGarden } from './worlds/MaterialGarden';
import { ObservatoryOfWitness } from './worlds/ObservatoryOfWitness';
import { FloatingRoom } from './worlds/FloatingRoom';
import { QuestionArchive } from './worlds/QuestionArchive';
import { CaravanOfTravel } from './worlds/CaravanOfTravel';
import { CommonsSquare } from './worlds/CommonsSquare';
import { HealingGarden } from './worlds/HealingGarden';
import { AlchemicalChamber } from './worlds/AlchemicalChamber';

interface DynamicStudentWorldProps {
  worldData: StudentWorld;
  onSelectProject: (project: ProjectNode) => void;
  onLeaveWorld: () => void;
  onShapeshiftTo: (worldId: string) => void;
}

export const DynamicStudentWorld: React.FC<DynamicStudentWorldProps> = ({
  worldData,
  onSelectProject,
  onLeaveWorld,
  onShapeshiftTo,
}) => {
  const [springPulseActive, setSpringPulseActive] = useState(false);

  // Hook applying unique CSS transition properties and spring physics
  const { containerStyle, physicsInfo, getInteractiveSpringProps } = useSpatialPhysics(
    worldData.spatialPhysics
  );

  const handleTestSpringPulse = () => {
    audioEngine.playTactileClick();
    audioEngine.playSpringOscillation(worldData.spatialPhysics?.behavior);
    setSpringPulseActive(true);
    setTimeout(() => setSpringPulseActive(false), 850);
  };

  const renderWorldReality = () => {
    const commonProps = {
      worldData,
      onSelectProject,
      onLeaveWorld,
      onShapeshiftTo,
      isSpringActive: springPulseActive,
      onTriggerSpring: handleTestSpringPulse,
    };

    switch (worldData.id) {
      case 'smritika':
        return <LibraryOfThings {...commonProps} />;
      case 'anveshin':
        return <CaveOfQuestions {...commonProps} />;
      case 'karigara':
        return <WorkshopOfElements {...commonProps} />;
      case 'kathaka':
        return <KathaCourtyard {...commonProps} />;
      case 'tantuvid':
        return <LoomOfSystems {...commonProps} />;
      case 'bhutika':
        return <MaterialGarden {...commonProps} />;
      case 'drashta':
        return <ObservatoryOfWitness {...commonProps} />;
      case 'svapnika':
        return <FloatingRoom {...commonProps} />;
      case 'jignasu':
        return <QuestionArchive {...commonProps} />;
      case 'yatri':
        return <CaravanOfTravel {...commonProps} />;
      case 'sangati':
        return <CommonsSquare {...commonProps} />;
      case 'sevika':
        return <HealingGarden {...commonProps} />;
      case 'rupantara':
        return <AlchemicalChamber {...commonProps} />;
      default:
        // Fallback for unknown world
        return (
          <div className="relative z-20 max-w-6xl mx-auto px-6 pt-24 pb-28">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
              <div>
                <h1 className="text-4xl font-serif text-white">{worldData.studentName}</h1>
                <p className="text-sm text-slate-300 italic mt-1 font-serif">"{worldData.summarySnippet}"</p>
              </div>
              <button
                onClick={handleTestSpringPulse}
                className="px-3 py-1.5 rounded-lg bg-amber-500/20 border border-amber-400/50 text-amber-300 text-xs font-mono"
              >
                Test Spring
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {worldData.projects.map((project, index) => {
                const springProps = getInteractiveSpringProps(index);
                return (
                  <div
                    key={project.id}
                    onClick={() => {
                      audioEngine.playTactileClick();
                      onSelectProject(project);
                    }}
                    {...springProps}
                    style={{
                      ...springProps.style,
                      transform: springPulseActive
                        ? `${springProps.style.transform || ''} scale(1.04) translateY(-10px)`
                        : springProps.style.transform,
                    }}
                    className="rounded-xl border border-white/10 bg-slate-900/80 p-6 shadow-xl hover:border-white/30 cursor-pointer backdrop-blur-md"
                  >
                    <div className="text-xs text-amber-400 font-mono mb-2">{project.artefact}</div>
                    <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">{project.summary}</p>
                  </div>
                );
              })}
            </div>
          </div>
        );
    }
  };

  return (
    <div
      style={containerStyle}
      className={`relative min-h-screen w-full text-slate-100 overflow-x-hidden ${worldData.visualTheme.bgClass} ${
        springPulseActive ? 'animate-spring-rebound' : ''
      }`}
    >
      {/* World-Specific Dynamic Reality Engine (Each world controls its own layout completely) */}
      {renderWorldReality()}

      {/* Floating Spatial Physics & Navigation Dock (Subtle bottom-right HUD) */}
      <aside aria-label="Spatial Physics & Quick Shapeshift Dock" className="fixed bottom-6 right-6 z-40 flex items-center gap-2 p-1.5 rounded-2xl bg-slate-950/85 border border-white/10 shadow-2xl backdrop-blur-xl">
        <button
          onClick={handleTestSpringPulse}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-mono transition-all cursor-pointer shadow-md ${
            springPulseActive
              ? 'bg-amber-400 text-stone-950 border-amber-300 font-bold scale-105'
              : 'bg-slate-900/90 hover:bg-slate-800 text-amber-300 border-slate-700/80'
          }`}
          title={`Test Spatial Physics Spring (${physicsInfo.name})`}
        >
          <Activity className={`w-3.5 h-3.5 ${springPulseActive ? 'animate-spin text-stone-950' : 'text-amber-400 animate-pulse'}`} />
          <span>{springPulseActive ? 'Oscillating...' : 'Test Spring'}</span>
        </button>

        <div className="h-4 w-px bg-white/10" />

        <button
          onClick={() => {
            audioEngine.playTactileClick();
            onShapeshiftTo('lakshmi');
          }}
          className="px-2.5 py-1.5 rounded-xl bg-red-950/50 hover:bg-red-900/60 border border-red-700/40 text-red-200 text-xs font-mono transition-colors cursor-pointer"
          title="Shapeshift directly to Lakshmi Supriya (The Living Study)"
        >
          Lakshmi
        </button>

        <button
          onClick={() => {
            audioEngine.playTactileClick();
            onShapeshiftTo('mayavin');
          }}
          className="px-2.5 py-1.5 rounded-xl bg-cyan-950/50 hover:bg-cyan-900/60 border border-cyan-700/40 text-cyan-200 text-xs font-mono transition-colors cursor-pointer"
          title="Shapeshift directly to Mayavin (The Mirror Palace)"
        >
          Mayavin
        </button>

        <div className="h-4 w-px bg-white/10" />

        <button
          onClick={() => {
            audioEngine.playTactileClick();
            onLeaveWorld();
          }}
          className="px-2.5 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-mono transition-colors cursor-pointer flex items-center gap-1"
          title="Return to Cosmic Mandala"
        >
          <Compass className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden sm:inline">Mandala</span>
        </button>
      </aside>
    </div>
  );
};
