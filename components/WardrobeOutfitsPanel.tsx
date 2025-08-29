/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';

interface WardrobeOutfitsPanelProps {
  historyCount: number;
  currentIndex: number;
  onSelectIndex: (index: number) => void;
}

const WardrobeOutfitsPanel: React.FC<WardrobeOutfitsPanelProps> = ({ historyCount, currentIndex, onSelectIndex }) => {
  return (
    <div className="cyber-box h-full flex flex-col">
      <div className="p-4 border-b border-[var(--cyber-border)]">
        <h2 className="text-lg text-[var(--cyber-cyan)] font-bold uppercase tracking-[0.2em]">Outfits</h2>
      </div>
      <div className="p-4 flex-grow flex flex-col gap-2 overflow-y-auto">
        {Array.from({ length: historyCount }, (_, i) => (
          <button
            key={i}
            onClick={() => onSelectIndex(i)}
            className={`w-full flex items-center gap-4 p-2 text-left border transition-all duration-200 ${
              currentIndex === i
              ? 'bg-[var(--cyber-cyan)]/20 border-[var(--cyber-cyan)]'
              : 'border-transparent hover:bg-white/10'
            }`}
          >
            <div className={`w-10 h-10 flex items-center justify-center font-bold text-lg border-2 ${
                currentIndex === i ? 'border-[var(--cyber-cyan)] text-[var(--cyber-cyan)]' : 'border-[var(--cyber-border)] text-gray-400'
            }`}>
              {i + 1}
            </div>
            <span className={`uppercase font-semibold tracking-wider ${
                currentIndex === i ? 'text-white' : 'text-gray-400'
            }`}>
              {i === 0 ? 'Original Loadout' : `Outfit Slot ${i+1}`}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default WardrobeOutfitsPanel;