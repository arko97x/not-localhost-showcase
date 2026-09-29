/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { WorldId, StudentWorld, ProjectNode, TransformationState } from './types/shapeshifter';
import { STUDENTS_DATA, DEFAULT_STUDENT_WORLD_ID } from './data/studentsData';
import { HeaderNav } from './components/HeaderNav';
import { CosmicMandala } from './components/CosmicMandala';
import { LivingStudy } from './components/LivingStudy';
import { MirrorPalace } from './components/MirrorPalace';
import { DynamicStudentWorld } from './components/DynamicStudentWorld';
import { TransformationEngine } from './components/TransformationEngine';
import { ProjectModal } from './components/ProjectModal';
import { CreativeDNAForgeModal } from './components/CreativeDNAForgeModal';
import { audioEngine } from './services/audioEngine';

export default function App() {
  // Support initial deep linking while defaulting to Lakshmi / SUTRADHARA as a functional student world
  const [activeWorldId, setActiveWorldId] = useState<WorldId>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace('#', '');
      if (hash && (hash === 'shared' || STUDENTS_DATA[hash])) {
        return hash;
      }
      const param = new URLSearchParams(window.location.search).get('world');
      if (param && (param === 'shared' || STUDENTS_DATA[param])) {
        return param;
      }
    }
    return DEFAULT_STUDENT_WORLD_ID; // Ensures initial state maps to a functional student world
  });

  // Active functional student world context (typed guaranteed as StudentWorld)
  const [activeWorld, setActiveWorld] = useState<StudentWorld>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace('#', '');
      if (hash && STUDENTS_DATA[hash]) {
        return STUDENTS_DATA[hash];
      }
      const param = new URLSearchParams(window.location.search).get('world');
      if (param && STUDENTS_DATA[param]) {
        return STUDENTS_DATA[param];
      }
    }
    return STUDENTS_DATA[DEFAULT_STUDENT_WORLD_ID];
  });

  const [pendingWorldId, setPendingWorldId] = useState<WorldId | null>(null);
  const [activeProject, setActiveProject] = useState<ProjectNode | null>(null);
  const [isForgeOpen, setIsForgeOpen] = useState(false);

  const [transformation, setTransformation] = useState<TransformationState>({
    isTransforming: false,
    fromWorldId: activeWorldId,
    toWorldId: activeWorldId,
    phase: 'idle',
    progress: 0,
  });

  // Sync activeWorld with activeWorldId whenever activeWorldId is a valid student ID
  useEffect(() => {
    if (activeWorldId !== 'shared' && STUDENTS_DATA[activeWorldId]) {
      setActiveWorld(STUDENTS_DATA[activeWorldId]);
    }
  }, [activeWorldId]);

  // Start appropriate ambient soundscape on first user gesture
  useEffect(() => {
    const handleFirstInteraction = () => {
      if (activeWorldId === 'shared') {
        audioEngine.switchAtmosphere('cosmic');
      } else if (STUDENTS_DATA[activeWorldId]) {
        audioEngine.switchAtmosphere(STUDENTS_DATA[activeWorldId].visualTheme.ambientSoundType);
      }
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
    };
    window.addEventListener('click', handleFirstInteraction);
    window.addEventListener('keydown', handleFirstInteraction);

    return () => {
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
    };
  }, [activeWorldId]);

  // Initiate transformation to a new world
  const handleNavigateWorld = (targetWorldId: WorldId) => {
    if (targetWorldId === activeWorldId && !transformation.isTransforming) return;

    setActiveProject(null); // Close any open project
    setPendingWorldId(targetWorldId);

    // Update URL hash cleanly for bookmarking without page reload
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', `#${targetWorldId}`);
    }

    setTransformation({
      isTransforming: true,
      fromWorldId: activeWorldId,
      toWorldId: targetWorldId,
      phase: 'departure',
      progress: 0,
    });
  };

  // Called when transformation sequence completes
  const handleTransitionComplete = () => {
    if (pendingWorldId) {
      setActiveWorldId(pendingWorldId);
      const newWorld = STUDENTS_DATA[pendingWorldId];
      if (newWorld) {
        setActiveWorld(newWorld);
        audioEngine.switchAtmosphere(newWorld.visualTheme.ambientSoundType);
      } else {
        audioEngine.switchAtmosphere('cosmic');
      }
    }
    setTransformation((prev) => ({
      ...prev,
      isTransforming: false,
      phase: 'idle',
    }));
    setPendingWorldId(null);
  };

  const targetWorldForTransition: StudentWorld | null =
    transformation.toWorldId !== 'shared' ? STUDENTS_DATA[transformation.toWorldId] || null : null;

  return (
    <div className="min-h-screen w-full relative selection:bg-amber-400 selection:text-slate-900">
      {/* Persistent 3-Zone Top Navigation Bar */}
      <HeaderNav
        activeWorldId={activeWorldId}
        activeWorld={activeWorld}
        onNavigateWorld={handleNavigateWorld}
        onOpenForge={() => setIsForgeOpen(true)}
      />

      {/* Main Active State Render: The One Website Transforming */}
      <main className="w-full">
        {activeWorldId === 'shared' && (
          <CosmicMandala
            students={STUDENTS_DATA}
            onSelectStudent={(studentId) => handleNavigateWorld(studentId)}
            onOpenForge={() => setIsForgeOpen(true)}
          />
        )}

        {activeWorldId === 'lakshmi' && (
          <LivingStudy
            worldData={activeWorld}
            onSelectProject={(project) => setActiveProject(project)}
            onLeaveWorld={() => handleNavigateWorld('shared')}
            onShapeshiftTo={(target) => handleNavigateWorld(target)}
          />
        )}

        {activeWorldId === 'mayavin' && (
          <MirrorPalace
            worldData={activeWorld}
            onSelectProject={(project) => setActiveProject(project)}
            onLeaveWorld={() => handleNavigateWorld('shared')}
            onShapeshiftTo={(target) => handleNavigateWorld(target)}
          />
        )}

        {/* Dynamic World Engine for any other student world */}
        {activeWorldId !== 'shared' && activeWorldId !== 'lakshmi' && activeWorldId !== 'mayavin' && (
          <DynamicStudentWorld
            worldData={activeWorld}
            onSelectProject={(project) => setActiveProject(project)}
            onLeaveWorld={() => handleNavigateWorld('shared')}
            onShapeshiftTo={(target) => handleNavigateWorld(target)}
          />
        )}
      </main>

      {/* Expressive Transformation Engine Transition Overlay */}
      <TransformationEngine
        state={transformation}
        targetWorld={targetWorldForTransition}
        onTransitionComplete={handleTransitionComplete}
      />

      {/* In-World Project Dossier Modal */}
      {activeProject && (
        <ProjectModal
          project={activeProject}
          worldData={activeWorld}
          onClose={() => setActiveProject(null)}
        />
      )}

      {/* Creative DNA Forge Extensibility Modal */}
      <CreativeDNAForgeModal
        isOpen={isForgeOpen}
        onClose={() => setIsForgeOpen(false)}
      />
    </div>
  );
}
