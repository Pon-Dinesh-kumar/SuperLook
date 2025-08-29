/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/


import React, { useState, useCallback, useRef, useEffect } from 'react';
// FIX: Fix typo in function name from `removeImagebackground` to `removeImageBackground`.
import { generateFilteredImage, generateAdjustedImage, generateOutfitImage, generateBackgroundImage, removeImageBackground, generateActionImage } from './services/geminiService';
import Header from './components/Header';
import Spinner from './components/Spinner';
import StartScreen from './components/StartScreen';
import WardrobePanel from './components/WardrobePanel';
import WardrobeOutfitsPanel from './components/WardrobeOutfitsPanel';
import { EyeIcon } from './components/icons';


// Helper to convert a data URL string to a File object
const dataURLtoFile = (dataurl: string, filename: string): File => {
    const arr = dataurl.split(',');
    if (arr.length < 2) throw new Error("Invalid data URL");
    const mimeMatch = arr[0].match(/:(.*?);/);
    if (!mimeMatch || !mimeMatch[1]) throw new Error("Could not parse MIME type from data URL");

    const mime = mimeMatch[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {type:mime});
}

// Helper function to create user-friendly API error messages
const getApiErrorMessage = (err: unknown, context: string): string => {
  let message = `Failed to ${context}. An unknown error occurred.`;
  if (err instanceof Error) {
      // Check for specific keywords related to quota errors
      if (err.message.includes('429') || /quota|RESOURCE_EXHAUSTED/i.test(err.message)) {
          message = "API Quota Exceeded. You've made too many requests recently. Please wait a moment before trying again, or check your API key's plan and billing details.";
      } else {
          message = `Failed to ${context}. ${err.message}`;
      }
  }
  return message;
}


export type Category = 'clothing' | 'modifications' | 'effects' | 'environment' | 'actions';
interface HistoryItem {
  file: File;
  backgroundUrl: string | null;
}


const App: React.FC = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isInitializing, setIsInitializing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<Category>('clothing');
  const [pageBackgroundUrl, setPageBackgroundUrl] = useState<string | null>(null);
  
  const [isComparing, setIsComparing] = useState<boolean>(false);
  const imgRef = useRef<HTMLImageElement>(null);

  const currentHistoryItem = history[historyIndex] ?? null;
  const currentImage = currentHistoryItem?.file ?? null;
  const originalImage = history[0]?.file ?? null;

  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);

  // Sync page background with current history item
  useEffect(() => {
    setPageBackgroundUrl(currentHistoryItem?.backgroundUrl ?? null);
  }, [currentHistoryItem]);

  // Effect to create and revoke object URLs safely for the current image
  useEffect(() => {
    if (currentImage) {
      const url = URL.createObjectURL(currentImage);
      setCurrentImageUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setCurrentImageUrl(null);
    }
  }, [currentImage]);
  
  // Effect to create and revoke object URLs safely for the original image
  useEffect(() => {
    if (originalImage) {
      const url = URL.createObjectURL(originalImage);
      setOriginalImageUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setOriginalImageUrl(null);
    }
  }, [originalImage]);


  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  const addImageToHistory = useCallback((newImageFile: File, newBackgroundUrl?: string | null) => {
    const newHistory = history.slice(0, historyIndex + 1);
    const backgroundToKeep = newBackgroundUrl !== undefined ? newBackgroundUrl : (currentHistoryItem?.backgroundUrl ?? null);
    newHistory.push({ file: newImageFile, backgroundUrl: backgroundToKeep });
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex, currentHistoryItem]);

  const handleImageUpload = useCallback(async (file: File) => {
    setError(null);
    setIsInitializing(true);
    try {
      const noBgDataUrl = await removeImageBackground(file);
      const initialFile = dataURLtoFile(noBgDataUrl, `nobg-${file.name}`);
      setHistory([{ file: initialFile, backgroundUrl: null }]);
      setHistoryIndex(0);
    } catch (err) {
      setError(getApiErrorMessage(err, 'remove background'));
      console.error(err);
      // Fallback to original image if background removal fails
      setHistory([{ file, backgroundUrl: null }]);
      setHistoryIndex(0);
    } finally {
      setIsInitializing(false);
    }
  }, []);

  
  const handleApplyFilter = useCallback(async (filterPrompt: string) => {
    if (!currentImage) {
      setError('No image loaded to apply an effect to.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
        const filteredImageUrl = await generateFilteredImage(currentImage, filterPrompt);
        const newImageFile = dataURLtoFile(filteredImageUrl, `filtered-${Date.now()}.png`);
        addImageToHistory(newImageFile);
    } catch (err) {
        setError(getApiErrorMessage(err, 'apply the effect'));
        console.error(err);
    } finally {
        setIsLoading(false);
    }
  }, [currentImage, addImageToHistory]);
  
  const handleApplyModification = useCallback(async (adjustmentPrompt: string) => {
    if (!currentImage) {
      setError('No image loaded to apply a modification to.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
        const adjustedImageUrl = await generateAdjustedImage(currentImage, adjustmentPrompt);
        const newImageFile = dataURLtoFile(adjustedImageUrl, `adjusted-${Date.now()}.png`);
        addImageToHistory(newImageFile);
    } catch (err) {
        setError(getApiErrorMessage(err, 'apply the modification'));
        console.error(err);
    } finally {
        setIsLoading(false);
    }
  }, [currentImage, addImageToHistory]);

  const handleApplyOutfit = useCallback(async (outfitPrompt: string) => {
    if (!currentImage) {
      setError('No image loaded to try an outfit on.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
        const styledImageUrl = await generateOutfitImage(currentImage, outfitPrompt);
        const newImageFile = dataURLtoFile(styledImageUrl, `styled-${Date.now()}.png`);
        addImageToHistory(newImageFile);
    } catch (err) {
        setError(getApiErrorMessage(err, 'apply the outfit'));
        console.error(err);
    } finally {
        setIsLoading(false);
    }
  }, [currentImage, addImageToHistory]);

  const handleApplyEnvironment = useCallback(async (prompt: string) => {
    if (!currentImage) {
      setError('No image loaded to change the environment of.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
        const backgroundImageUrl = await generateBackgroundImage(currentImage, prompt);
        const newImageFile = dataURLtoFile(backgroundImageUrl, `background-${Date.now()}.png`);
        // FIX: The new page background should be the generated image, not the preset imageUrl.
        addImageToHistory(newImageFile, backgroundImageUrl);
    } catch (err) {
        setError(getApiErrorMessage(err, 'change the environment'));
        console.error(err);
    } finally {
        setIsLoading(false);
    }
  }, [currentImage, addImageToHistory]);
  
  const handleApplyAction = useCallback(async (actionPrompt: string) => {
    if (!currentImage) {
      setError('No image loaded to apply an action to.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
        const actionImageUrl = await generateActionImage(currentImage, actionPrompt);
        const newImageFile = dataURLtoFile(actionImageUrl, `action-${Date.now()}.png`);
        addImageToHistory(newImageFile);
    } catch (err) {
        setError(getApiErrorMessage(err, 'apply the action'));
        console.error(err);
    } finally {
        setIsLoading(false);
    }
  }, [currentImage, addImageToHistory]);

  const handleReset = useCallback(() => {
    if (history.length > 0) {
      setHistoryIndex(0);
      setError(null);
    }
  }, [history]);

  const handleUploadNew = useCallback(() => {
      setHistory([]);
      setHistoryIndex(-1);
      setError(null);
      setPageBackgroundUrl(null);
  }, []);

  const handleDownload = useCallback(() => {
      if (currentImage) {
          const link = document.createElement('a');
          link.href = URL.createObjectURL(currentImage);
          link.download = `cyberlook-${currentImage.name}`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(link.href);
      }
  }, [currentImage]);
  
  const handleFileSelect = (files: FileList | null) => {
    if (files && files[0]) {
      handleImageUpload(files[0]);
    }
  };

  const renderContent = () => {
    if (isInitializing) {
        return (
            <div className="absolute inset-0 bg-black/80 z-50 flex flex-col items-center justify-center gap-4 animate-fade-in">
                <Spinner />
                <p className="text-[var(--cyber-cyan)] uppercase tracking-widest">Isolating Character Matrix...</p>
            </div>
        );
    }

    if (error) {
       return (
           <div className="text-center animate-fade-in cyber-box p-8 max-w-2xl mx-auto flex flex-col items-center gap-4">
            <h2 className="text-2xl font-bold text-[var(--cyber-red)] uppercase tracking-widest">System Error</h2>
            <p className="text-md text-gray-300">{error}</p>
            <button
                onClick={() => setError(null)}
                className="mt-4 bg-[var(--cyber-red)] text-black font-bold py-2 px-8 uppercase tracking-widest transition-colors hover:bg-white"
              >
                Acknowledge
            </button>
          </div>
        );
    }
    
    if (!currentImageUrl) {
      return <StartScreen onFileSelect={handleFileSelect} />;
    }

    const imageDisplay = (
      <div className="relative h-full w-full flex items-center justify-center cyber-box">
          {/* Base image is the original, always at the bottom */}
          {originalImageUrl && (
              <img
                  key={originalImageUrl}
                  src={originalImageUrl}
                  alt="Original"
                  className="max-h-full max-w-full object-cover"
              />
          )}
          {/* The current image is an overlay that fades in/out for comparison */}
          <img
              ref={imgRef}
              key={currentImageUrl}
              src={currentImageUrl}
              alt="Current"
              className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-200 ease-in-out ${isComparing ? 'opacity-0' : 'opacity-100'}`}
          />
      </div>
    );


    return (
      <div className="w-full h-full p-4 md:p-6 grid grid-cols-12 gap-4 animate-fade-in">
          {(isLoading || isInitializing) && (
              <div className="absolute inset-0 bg-black/80 z-50 flex flex-col items-center justify-center gap-4 animate-fade-in">
                  <Spinner />
                  <p className="text-[var(--cyber-cyan)] uppercase tracking-widest">
                    {isInitializing ? 'Isolating Character Matrix...' : 'Processing Augmentation...'}
                  </p>
              </div>
          )}

        {/* Left Panel: Wardrobe Outfits */}
        <div className="col-span-12 md:col-span-2">
            <WardrobeOutfitsPanel 
              historyCount={history.length}
              currentIndex={historyIndex}
              onSelectIndex={setHistoryIndex}
            />
        </div>

        {/* Center Panel: Character Preview */}
        <div className="col-span-12 md:col-span-5 h-full relative">
            {imageDisplay}
        </div>

        {/* Right Panel: Customization */}
        <div className="col-span-12 md:col-span-5">
            <WardrobePanel 
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
              onApplyOutfit={handleApplyOutfit}
              onApplyModification={handleApplyModification}
              onApplyEffect={handleApplyFilter}
              onApplyEnvironment={handleApplyEnvironment}
              onApplyAction={handleApplyAction}
              isLoading={isLoading}
            />
        </div>
        
        {/* Bottom Right Actions */}
        <div className="col-span-12 flex items-center justify-end gap-2 p-2">
          {canUndo && (
            <button 
                onMouseDown={() => setIsComparing(true)}
                onMouseUp={() => setIsComparing(false)}
                onMouseLeave={() => setIsComparing(false)}
                onTouchStart={() => setIsComparing(true)}
                onTouchEnd={() => setIsComparing(false)}
                className="flex items-center justify-center text-center bg-black/20 border border-[var(--cyber-border)] text-[var(--cyber-cyan)] font-semibold py-2 px-4 uppercase tracking-wider text-sm transition-all hover:bg-[var(--cyber-cyan)] hover:text-black"
                aria-label="Press and hold to see original image"
            >
                <EyeIcon className="w-4 h-4 mr-2" />
                Compare
            </button>
          )}
          <button 
              onClick={handleReset}
              disabled={!canUndo || isLoading}
              className="text-center bg-black/20 border border-[var(--cyber-border)] text-[var(--cyber-cyan)] font-semibold py-2 px-4 uppercase tracking-wider text-sm transition-all hover:bg-[var(--cyber-cyan)] hover:text-black disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Reset
          </button>
          <button 
              onClick={handleUploadNew}
              disabled={isLoading}
              className="text-center bg-black/20 border border-[var(--cyber-border)] text-[var(--cyber-cyan)] font-semibold py-2 px-4 uppercase tracking-wider text-sm transition-all hover:bg-[var(--cyber-cyan)] hover:text-black disabled:opacity-50 disabled:cursor-not-allowed"
          >
              New Character
          </button>
          <button 
              onClick={handleDownload}
              disabled={isLoading}
              className="bg-[var(--cyber-cyan)] text-black font-bold py-2 px-4 uppercase tracking-wider text-sm transition-all hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
              Download
          </button>
        </div>
      </div>
    );
  };
  
  return (
    <div className="min-h-screen text-gray-100 flex flex-col relative" style={{ height: '100vh' }}>
      {/* Full-page background */}
      {pageBackgroundUrl && (
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center transition-opacity duration-500 animate-fade-in" 
          style={{ backgroundImage: `url(${pageBackgroundUrl})` }}
        >
          <div className="absolute inset-0 bg-black/50"></div>
        </div>
      )}

      <div className="relative z-10 flex flex-col h-full">
        <Header />
        <main className="flex-grow w-full max-w-[1920px] mx-auto flex justify-center items-center">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;