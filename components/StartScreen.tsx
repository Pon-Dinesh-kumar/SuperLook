/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState } from 'react';
import { UploadIcon } from './icons';

interface StartScreenProps {
  onFileSelect: (files: FileList | null) => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onFileSelect }) => {
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFileSelect(e.target.files);
  };

  return (
    <div 
      className={`w-full max-w-7xl mx-auto text-center p-8 transition-all duration-300 rounded-lg border-2 ${isDraggingOver ? 'border-dashed border-[var(--cyber-cyan)] bg-[var(--cyber-cyan)]/10' : 'border-transparent'}`}
      onDragOver={(e) => { e.preventDefault(); setIsDraggingOver(true); }}
      onDragLeave={() => setIsDraggingOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDraggingOver(false);
        onFileSelect(e.dataTransfer.files);
      }}
    >
      <div className="flex flex-col items-center gap-6 animate-fade-in">
        <h1 className="text-5xl font-black tracking-[0.3em] text-gray-100 sm:text-6xl md:text-7xl">
          WARDROBE
        </h1>
        <p className="max-w-2xl text-lg text-gray-400">
          Load a character portrait to begin customization.
        </p>

        <div className="mt-8">
            <label htmlFor="image-upload-start" className="relative inline-block px-10 py-5 text-lg font-bold text-[var(--cyber-cyan)] uppercase tracking-widest border-2 border-[var(--cyber-cyan)] cursor-pointer group transition-all duration-300 hover:bg-[var(--cyber-cyan)]/20">
                <span className="relative z-10 flex items-center">
                  <UploadIcon className="w-5 h-5 mr-3" />
                  Access Wardrobe
                </span>
                <span className="absolute top-0 left-0 w-full h-full cyber-glitch bg-[var(--cyber-red)] mix-blend-screen opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            </label>
            <input id="image-upload-start" type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
            <p className="mt-4 text-sm text-gray-500">or drag and drop a file</p>
        </div>
      </div>
    </div>
  );
};

export default StartScreen;