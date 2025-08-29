/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import { WardrobeIcon } from './icons';

const Header: React.FC = () => {
  return (
    <header className="w-full py-3 px-6 bg-[var(--cyber-bg)] border-b-2 border-[var(--cyber-border)] flex items-center justify-between z-50">
      <div className="flex items-center gap-4">
        <div className="w-[80px]">
          <div className="text-[var(--cyber-red)] text-xs font-bold tracking-[0.2em]">THE NIGHT CITY</div>
          <div className="text-white text-xs font-bold tracking-[0.2em]">CITIZEN DATABASES</div>
        </div>
        <div className="h-8 w-px bg-[var(--cyber-border)]"></div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-[var(--cyber-cyan)]"></div>
          <h1 className="text-xl font-black tracking-[0.3em] text-[var(--cyber-cyan)]">
            WARDROBE
          </h1>
        </div>
      </div>
      <div className="text-right">
        <p className="text-xs text-gray-400">USER: V_GUEST_77</p>
        <p className="text-xs text-gray-400">SESSION: 34A-RT5</p>
      </div>
    </header>
  );
};

export default Header;