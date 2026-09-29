/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Volume2, VolumeX, Sparkles, Orbit, Compass } from 'lucide-react';
import { WorldId, StudentWorld } from '../types/shapeshifter';
import { audioEngine } from '../services/audioEngine';

interface HeaderNavProps {
  activeWorldId: WorldId;
  activeWorld: StudentWorld | null;
  onNavigateWorld: (worldId: WorldId) => void;
  onOpenForge: () => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  activeWorldId,
  activeWorld,
  onNavigateWorld,
  onOpenForge,
}) => {
  const [isMuted, setIsMuted] = useState(false);

  const toggleSound = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    audioEngine.setMuted(nextMuted);
    if (!nextMuted) {
      audioEngine.playTactileClick();
    }
  };

  const isSharedWorld = activeWorldId === 'shared';

  return (
    <header className="fixed top-0 left-0 right-0 z-40 h-16 border-b transition-colors duration-700 backdrop-blur-md px-6 flex items-center justify-between"
      style={{
        backgroundColor: isSharedWorld
          ? 'rgba(8, 10, 16, 0.85)'
          : activeWorldId === 'lakshmi'
          ? 'rgba(247, 244, 238, 0.9)'
          : 'rgba(6, 7, 11, 0.88)',
        borderColor: isSharedWorld
          ? 'rgba(255, 255, 255, 0.08)'
          : activeWorldId === 'lakshmi'
          ? 'rgba(43, 38, 33, 0.12)'
          : 'rgba(6, 182, 212, 0.2)',
        color: activeWorldId === 'lakshmi' ? '#2B2621' : '#F8FAFC',
      }}
    >
      {/* Zone 1: Wordmark */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => {
            audioEngine.playTactileClick();
            onNavigateWorld('shared');
          }}
          className="text-left group cursor-pointer focus:outline-none"
        >
          <span className="text-sm tracking-[0.25em] font-semibold uppercase block group-hover:opacity-80 transition-opacity">
            SHAPESHIFTER
          </span>
        </button>

        {/* Quiet divider */}
        <span className="opacity-30 text-xs" aria-hidden="true">/</span>

        {/* Current State Indicator */}
        <div className="flex items-center gap-2 text-xs">
          {isSharedWorld ? (
            <span className="flex items-center gap-1.5 opacity-80">
              <Orbit className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: '24s' }} />
              <span>Shared World · Cosmic Mandala</span>
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <span className="font-medium">{activeWorld?.studentName}</span>
              <span className="opacity-40">·</span>
              <span
                className="font-serif italic tracking-wide text-sm"
                style={{ color: activeWorld?.accentColor }}
              >
                {activeWorld?.shapeshifterName}
              </span>
              <span className="opacity-40 hidden md:inline">({activeWorld?.shapeshifterMeaning})</span>
            </span>
          )}
        </div>
      </div>

      {/* Zone 2: Navigation Links / State Switches */}
      <nav className="hidden lg:flex items-center gap-6 text-xs font-medium tracking-wider uppercase">
        <button
          onClick={() => {
            audioEngine.playTactileClick();
            onNavigateWorld('shared');
          }}
          className={`transition-colors hover:opacity-100 ${
            isSharedWorld ? 'opacity-100 font-semibold' : 'opacity-60'
          }`}
        >
          Common Mandala
        </button>

        <button
          onClick={() => {
            audioEngine.playTactileClick();
            onNavigateWorld('lakshmi');
          }}
          className={`transition-colors hover:opacity-100 flex items-center gap-1.5 ${
            activeWorldId === 'lakshmi' ? 'opacity-100 font-semibold text-red-600' : 'opacity-60'
          }`}
        >
          <span>Lakshmi</span>
          <span className="text-[10px] lowercase italic font-serif opacity-75">sutradhara</span>
        </button>

        <button
          onClick={() => {
            audioEngine.playTactileClick();
            onNavigateWorld('mayavin');
          }}
          className={`transition-colors hover:opacity-100 flex items-center gap-1.5 ${
            activeWorldId === 'mayavin' ? 'opacity-100 font-semibold text-cyan-400' : 'opacity-60'
          }`}
        >
          <span>Mayavin</span>
          <span className="text-[10px] lowercase italic font-mono opacity-75">illusion</span>
        </button>
      </nav>

      {/* Zone 3: Actions */}
      <div className="flex items-center gap-3">
        {/* Creative DNA Forge */}
        <button
          onClick={() => {
            audioEngine.playTactileClick();
            onOpenForge();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs transition-all duration-200 cursor-pointer"
          style={{
            backgroundColor: activeWorldId === 'lakshmi' ? 'rgba(43, 38, 33, 0.08)' : 'rgba(255, 255, 255, 0.08)',
            border: activeWorldId === 'lakshmi' ? '1px solid rgba(43, 38, 33, 0.15)' : '1px solid rgba(255, 255, 255, 0.15)',
          }}
          title="Open Creative DNA Forge: Synthesize new student archetypes"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden sm:inline">Creative DNA Forge</span>
        </button>

        {/* Ambient Sound Toggle */}
        <button
          onClick={toggleSound}
          className="p-2 rounded transition-colors cursor-pointer focus:outline-none"
          style={{
            backgroundColor: activeWorldId === 'lakshmi' ? 'rgba(43, 38, 33, 0.06)' : 'rgba(255, 255, 255, 0.06)',
          }}
          title={isMuted ? 'Unmute atmospheric soundscape' : 'Mute atmospheric soundscape'}
          aria-label={isMuted ? 'Unmute sound' : 'Mute sound'}
        >
          {isMuted ? (
            <VolumeX className="w-4 h-4 opacity-50" />
          ) : (
            <Volume2 className="w-4 h-4 text-emerald-400 animate-pulse" />
          )}
        </button>

        {/* Return to Shared World Quick Action */}
        {!isSharedWorld && (
          <button
            onClick={() => {
              audioEngine.playTactileClick();
              onNavigateWorld('shared');
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded transition-colors cursor-pointer"
            style={{
              backgroundColor: activeWorldId === 'lakshmi' ? '#2B2621' : '#FFFFFF',
              color: activeWorldId === 'lakshmi' ? '#F7F4EE' : '#080A10',
            }}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Leave World</span>
          </button>
        )}
      </div>
    </header>
  );
};
