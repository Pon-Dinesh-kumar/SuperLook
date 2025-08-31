/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import type { Theme } from '../App';

interface HeaderProps {
  themes: Theme[];
  activeTheme: Theme;
  onThemeChange: (theme: Theme) => void;
}

const Header: React.FC<HeaderProps> = ({ themes, activeTheme, onThemeChange }) => {
  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

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
        <div className="h-8 w-px bg-[var(--cyber-border)]"></div>
        <div className="relative">
          <select
            value={activeTheme}
            onChange={(e) => onThemeChange(e.target.value as Theme)}
            className="appearance-none bg-[var(--cyber-bg)] border border-[var(--cyber-border)] text-[var(--cyber-cyan)] text-sm uppercase tracking-widest font-bold py-2 pl-3 pr-8 focus:outline-none focus:border-[var(--cyber-cyan)] focus:ring-0"
            aria-label="Select Theme"
          >
            {themes.map(theme => (
              <option key={theme} value={theme}>{capitalize(theme)}</option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[var(--cyber-cyan)]">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
          </div>
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
