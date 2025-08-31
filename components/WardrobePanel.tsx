/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import type { Category, ThemeCategory } from '../App';
import ClothingPanel from './OutfitPanel';
import ModificationsPanel from './AdjustmentPanel';
import EffectsPanel from './FilterPanel';
import EnvironmentPanel from './BackgroundPanel';
import ActionsPanel from './ActionsPanel';

interface WardrobePanelProps {
  activeCategory: Category;
  setActiveCategory: (category: Category) => void;
  onApplyOutfit: (prompt: string) => void;
  onApplyModification: (prompt: string) => void;
  onApplyEffect: (prompt: string) => void;
  onApplyEnvironment: (prompt: string) => void;
  onApplyAction: (prompt: string) => void;
  isLoading: boolean;
  themeCategory: ThemeCategory;
}

const WardrobePanel: React.FC<WardrobePanelProps> = (props) => {
  const { activeCategory, setActiveCategory, isLoading, themeCategory } = props;

  const categories: { id: Category, name: string }[] = [
    { id: 'clothing', name: 'Clothing' },
    { id: 'modifications', name: 'Modifications' },
    { id: 'effects', name: 'Effects' },
    { id: 'environment', name: 'Environment' },
    { id: 'actions', name: 'Actions' },
  ];

  const renderActivePanel = () => {
    switch(activeCategory) {
      case 'clothing':
        return <ClothingPanel onApplyOutfit={props.onApplyOutfit} isLoading={isLoading} presets={themeCategory.clothing} />;
      case 'modifications':
        return <ModificationsPanel onApplyModification={props.onApplyModification} isLoading={isLoading} presets={themeCategory.modifications} />;
      case 'effects':
        return <EffectsPanel onApplyEffect={props.onApplyEffect} isLoading={isLoading} presets={themeCategory.effects} />;
      case 'environment':
        return <EnvironmentPanel onApplyEnvironment={props.onApplyEnvironment} isLoading={isLoading} presets={themeCategory.environment} />;
      case 'actions':
        return <ActionsPanel onApplyAction={props.onApplyAction} isLoading={isLoading} presets={themeCategory.actions} />;
      default:
        return null;
    }
  }

  return (
    <div className="cyber-box h-full flex flex-col">
      <div className="p-4 border-b border-[var(--cyber-border)]">
        <h2 className="text-lg text-[var(--cyber-cyan)] font-bold uppercase tracking-[0.2em]">Inventory</h2>
      </div>
      
      <div className="flex items-center border-b border-[var(--cyber-border)]">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            disabled={isLoading}
            className={`flex-1 py-2 px-1 text-center text-sm uppercase tracking-wider font-semibold transition-all duration-200 border-b-2 ${
              activeCategory === cat.id
              ? 'border-[var(--cyber-cyan)] text-[var(--cyber-cyan)] bg-[var(--cyber-cyan)]/10'
              : 'border-transparent text-gray-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>
      
      <div className="flex-grow p-2 overflow-y-auto">
        {renderActivePanel()}
      </div>
    </div>
  );
};

export default WardrobePanel;
