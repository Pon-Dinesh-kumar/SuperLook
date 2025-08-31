/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import type { Preset } from '../App';

interface EffectsPanelProps {
  onApplyEffect: (prompt: string) => void;
  isLoading: boolean;
  presets: Preset[];
}

const EffectsPanel: React.FC<EffectsPanelProps> = ({ onApplyEffect, isLoading, presets }) => {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 p-1 animate-fade-in">
      {presets.map(preset => (
        <button
          key={preset.name}
          onClick={() => onApplyEffect(preset.prompt)}
          disabled={isLoading}
          className="relative group aspect-square border border-[var(--cyber-border)] hover:border-[var(--cyber-border-active)] transition-all duration-200 focus:outline-none focus:border-[var(--cyber-cyan)] disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label={`Apply ${preset.name}`}
        >
          <img src={preset.imageUrl} alt={preset.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/60 group-hover:bg-black/40 transition-all duration-200"></div>
          <div className="absolute bottom-0 left-0 p-2">
             <h4 className="text-white font-semibold text-xs uppercase tracking-wider text-left">{preset.name}</h4>
          </div>
          <div className="absolute top-1 right-1 h-3 w-3 border-2 border-[var(--cyber-cyan)] bg-[var(--cyber-bg)] opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </button>
      ))}
    </div>
  );
};

export default EffectsPanel;
