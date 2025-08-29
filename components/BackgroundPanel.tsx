/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';

interface EnvironmentPanelProps {
  onApplyEnvironment: (prompt: string) => void;
  isLoading: boolean;
}

const EnvironmentPanel: React.FC<EnvironmentPanelProps> = ({ onApplyEnvironment, isLoading }) => {

  const presets = [
    { name: 'Neon Alley', prompt: 'a dark, rainy alley in a futuristic city, lit by vibrant neon signs', imageUrl: 'https://i.imgur.com/VUMx61N.png' },
    { name: 'Spaceship Hangar', prompt: 'a vast, industrial spaceship hangar with a large vessel in the background', imageUrl: 'https://i.imgur.com/cFDJpA2.png' },
    { name: 'Rooftop View', prompt: 'a high-rise rooftop overlooking a sprawling cyberpunk city at night', imageUrl: 'https://i.imgur.com/fJ3h4iG.png' },
    { name: 'Desert Wasteland', prompt: 'a desolate, post-apocalyptic desert wasteland with a single sun', imageUrl: 'https://i.imgur.com/3g8h5pS.png' },
    { name: 'Mega-Tower', prompt: 'the luxurious penthouse of a mega-tower, with floor-to-ceiling windows', imageUrl: 'https://i.imgur.com/2s4s5Jt.png' },
    { name: 'Undercity Market', prompt: 'a crowded, bustling undercity market filled with strange vendors', imageUrl: 'https://i.imgur.com/sTqSgDB.jpeg' },
    { name: 'Orbital Station', prompt: 'an orbital space station, with a view of the Earth below', imageUrl: 'https://i.imgur.com/7XyXR2q.png' },
    { name: 'Bio-Dome Garden', prompt: 'a lush, synth-organic garden inside a massive bio-dome', imageUrl: 'https://i.imgur.com/5J3BCs5.png' },
  ];
  
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 p-1 animate-fade-in">
      {presets.map(preset => (
        <button
          key={preset.name}
          onClick={() => onApplyEnvironment(preset.prompt)}
          disabled={isLoading}
          className="relative group aspect-square border border-[var(--cyber-border)] hover:border-[var(--cyber-border-active)] transition-all duration-200 focus:outline-none focus:border-[var(--cyber-cyan)] disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label={`Apply ${preset.name} background`}
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

export default EnvironmentPanel;