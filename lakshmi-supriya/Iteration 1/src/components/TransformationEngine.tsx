/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { Sparkles, Layers, Orbit, Volume2, Radio, Music } from 'lucide-react';
import { TransformationState, StudentWorld } from '../types/shapeshifter';
import { audioEngine } from '../services/audioEngine';

interface TransformationEngineProps {
  state: TransformationState;
  targetWorld: StudentWorld | null;
  onTransitionComplete: () => void;
}

export const TransformationEngine: React.FC<TransformationEngineProps> = ({
  state,
  targetWorld,
  onTransitionComplete,
}) => {
  const [stage, setStage] = useState<'dissolving' | 'transmuting' | 'reconstituting'>('dissolving');
  const [sonicProfile, setSonicProfile] = useState<any>(null);

  useEffect(() => {
    if (!state.isTransforming) return;

    // 1. Departure Phase (0 - 600ms):
    // Trigger specific departure sonic cue customized to target world's creative DNA
    setStage('dissolving');
    const profile = audioEngine.playDepartureCue(targetWorld);
    setSonicProfile(profile);

    // 2. Transmutation Conduit (600ms - 1500ms):
    // Blend atmosphere soundscape toward target world
    const t1 = setTimeout(() => {
      setStage('transmuting');
      if (targetWorld) {
        audioEngine.switchAtmosphere(targetWorld.visualTheme.ambientSoundType);
      } else {
        audioEngine.switchAtmosphere('cosmic');
      }
    }, 600);

    // 3. Arrival Phase (1500ms - 2400ms):
    // Trigger specific arrival harmonic chord tailored to target world's creative DNA
    const t2 = setTimeout(() => {
      setStage('reconstituting');
      audioEngine.playArrivalCue(targetWorld);
    }, 1500);

    // 4. Completion (2400ms)
    const t3 = setTimeout(() => {
      onTransitionComplete();
    }, 2400);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [state.isTransforming, targetWorld, onTransitionComplete]);

  if (!state.isTransforming) return null;

  const getSpecificTransitionNarrative = (fromId: string, toId: string): string | null => {
    const pair = `${fromId}->${toId}`;
    const transitions: Record<string, string> = {
      'smritika->anveshin': 'A photograph fades into a dark surface. Its edges become rock. A beam of light appears. The visitor emerges into the Cave of Questions.',
      'karigara->tantuvid': 'A loose thread from the workshop is pulled. It stretches across the screen. It becomes one of the threads of the Loom.',
      'kathaka->yatri': 'A courtyard doorway becomes the opening of a moving caravan.',
      'bhutika->rupantara': 'Clay begins changing shape. The shape becomes an alchemical object.',
      'jignasu->drashta': 'A question becomes a point of light. The point becomes a star. The visitor enters the Observatory.',
      'svapnika->smritika': 'A floating photograph slowly settles onto a desk. The desk becomes an archival table.',
      'sangati->kathaka': 'A poster peels from the Commons wall. Its surface becomes the wall of the Courtyard.',
      'sevika->bhutika': 'A growing root travels beneath the ground. The soil becomes visible. The visitor emerges into the Material Garden.',
    };
    return transitions[pair] || null;
  };

  const specificHandoff = getSpecificTransitionNarrative(state.fromWorldId, state.toWorldId);
  const isGoingToStudy = state.toWorldId === 'lakshmi';
  const isGoingToMirror = state.toWorldId === 'mayavin';
  const isGoingToShared = state.toWorldId === 'shared';
  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center transition-all duration-700 pointer-events-auto"
      style={{
        backgroundColor:
          stage === 'dissolving'
            ? 'rgba(8, 10, 16, 0.95)'
            : stage === 'transmuting'
            ? isGoingToStudy
              ? 'rgba(247, 244, 238, 0.98)'
              : isGoingToMirror
              ? 'rgba(5, 6, 10, 0.98)'
              : 'rgba(7, 9, 14, 0.98)'
            : isGoingToStudy
            ? '#F7F4EE'
            : isGoingToMirror
            ? '#05060A'
            : '#07090E',
        color: isGoingToStudy && stage !== 'dissolving' ? '#2B2621' : '#F8FAFC',
      }}
    >
      {/* Dynamic Animated Particles / Sūtra Threads in Transmutation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Expanding Cosmic Rings */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full border border-amber-500/20 animate-ping opacity-30"
          style={{ animationDuration: '3s' }}
        />

        {/* Animated Elemental Beams */}
        <div
          className="absolute inset-0 transition-opacity duration-700"
          style={{
            opacity: stage === 'transmuting' ? 0.8 : 0.2,
            background: isGoingToStudy
              ? 'radial-gradient(circle at center, rgba(220,38,38,0.15) 0%, transparent 70%)'
              : isGoingToMirror
              ? 'radial-gradient(circle at center, rgba(6,182,212,0.2) 0%, rgba(139,92,246,0.15) 50%, transparent 80%)'
              : 'radial-gradient(circle at center, rgba(212,175,55,0.2) 0%, transparent 75%)',
          }}
        />
      </div>

      {/* Center Cinematic Transmutation Card */}
      <div className="relative z-10 text-center max-w-xl px-6 animate-fadeIn">
        {/* Micro Kicker with Phase Indicator */}
        <div
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] uppercase tracking-[0.25em] font-mono mb-4 border shadow-sm backdrop-blur-md"
          style={{
            borderColor:
              isGoingToStudy && stage !== 'dissolving'
                ? 'rgba(220,38,38,0.3)'
                : 'rgba(255,255,255,0.2)',
            backgroundColor:
              isGoingToStudy && stage !== 'dissolving'
                ? 'rgba(220,38,38,0.06)'
                : 'rgba(255,255,255,0.06)',
            color: isGoingToStudy && stage !== 'dissolving' ? '#DC2626' : '#FBBF24',
          }}
        >
          {isGoingToShared ? (
            <>
              <Orbit className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '10s' }} />
              <span>Folding World · Returning to Akāśa</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span>
                {stage === 'dissolving'
                  ? 'Departure Phase · Dissolving State'
                  : stage === 'transmuting'
                  ? 'Transmutation Conduit'
                  : 'Arrival Phase · Reconstituting State'}
              </span>
            </>
          )}
        </div>

        {/* Central Manifestation Header */}
        {targetWorld ? (
          <div>
            <h2 className="text-xs sm:text-sm font-mono tracking-widest uppercase opacity-60 mb-1">
              Entering the realm of
            </h2>
            <h1 className="text-3xl sm:text-5xl font-serif font-bold tracking-tight mb-2">
              {targetWorld.studentName}
            </h1>
            <div
              className="text-xl sm:text-2xl font-serif italic mb-4"
              style={{ color: targetWorld.accentColor }}
            >
              {targetWorld.shapeshifterName}
              <span className="text-sm not-italic opacity-80 ml-2 font-mono">
                — {targetWorld.shapeshifterMeaning}
              </span>
            </div>

            {specificHandoff ? (
              <div className="p-3.5 my-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs font-serif italic text-amber-200/95 leading-relaxed max-w-lg mx-auto shadow-sm">
                "{specificHandoff}"
              </div>
            ) : (
              <p className="text-xs sm:text-sm opacity-75 max-w-md mx-auto leading-relaxed">
                {targetWorld.transformationBehavior}
              </p>
            )}

            <div className="mt-5 flex flex-wrap items-center justify-center gap-3 text-xs font-mono opacity-80">
              <div className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-amber-400" />
                <span>Storage Artefact: {targetWorld.storageArtefact}</span>
              </div>
              <span>·</span>
              <div className="flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-amber-400" />
                <span>Cosmology: {targetWorld.cosmologyPrinciple}</span>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <h1 className="text-3xl sm:text-5xl font-serif font-bold tracking-tight mb-3">
              The Shared World
            </h1>
            <p className="text-xs sm:text-sm opacity-75 max-w-md mx-auto leading-relaxed font-light">
              Individual artefacts dissolve back into the common cosmic mandala. All practices remain in relationship.
            </p>
          </div>
        )}

        {/* Distinct Creative DNA Sonic Cue Banner */}
        {sonicProfile && (
          <div
            className="mt-6 py-2.5 px-4 rounded-xl border text-left font-mono transition-all duration-500 backdrop-blur-md"
            style={{
              backgroundColor:
                isGoingToStudy && stage !== 'dissolving'
                  ? 'rgba(220,38,38,0.06)'
                  : 'rgba(15,23,42,0.65)',
              borderColor:
                isGoingToStudy && stage !== 'dissolving'
                  ? 'rgba(220,38,38,0.2)'
                  : 'rgba(255,255,255,0.12)',
            }}
          >
            <div className="flex items-center justify-between text-[11px] mb-1">
              <div className="flex items-center gap-1.5 font-semibold text-amber-300">
                <Volume2 className="w-3.5 h-3.5 animate-pulse" />
                <span>
                  {stage === 'dissolving'
                    ? 'Departure Sonic Cue'
                    : stage === 'transmuting'
                    ? 'Atmospheric Morph'
                    : 'Arrival Sonic Cue'}
                </span>
              </div>
              <span className="text-[10px] opacity-60 uppercase">
                {sonicProfile.elementMatch}
              </span>
            </div>

            <div className="text-xs font-medium text-slate-200">
              {sonicProfile.name}
            </div>

            <div className="flex items-center gap-2 mt-1 text-[10px] opacity-70">
              <Music className="w-3 h-3 text-amber-400" />
              <span>{sonicProfile.harmonicKey}</span>
            </div>

            {/* Micro soundwave reactive bars */}
            <div className="flex items-center gap-1 mt-2.5 h-2">
              {[40, 75, 100, 60, 90, 45, 80, 50, 95, 30].map((h, i) => (
                <div
                  key={i}
                  className="w-1 rounded-full transition-all duration-300"
                  style={{
                    height:
                      stage === 'transmuting'
                        ? `${h * 0.4}%`
                        : stage === 'reconstituting'
                        ? `${h}%`
                        : `${h * 0.7}%`,
                    backgroundColor:
                      targetWorld ? targetWorld.accentColor : '#F59E0B',
                    opacity: 0.8,
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Dynamic Progress Indicator */}
        <div className="mt-6 w-48 h-1 mx-auto rounded-full bg-slate-700/30 overflow-hidden">
          <div
            className="h-full transition-all duration-700"
            style={{
              width:
                stage === 'dissolving'
                  ? '33%'
                  : stage === 'transmuting'
                  ? '66%'
                  : '100%',
              backgroundColor: targetWorld ? targetWorld.accentColor : '#D4AF37',
            }}
          />
        </div>
      </div>
    </div>
  );
};

