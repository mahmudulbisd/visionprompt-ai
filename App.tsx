
import React, { useState, useEffect, useCallback } from 'react';
import { HistoryItem, GenerationState } from './types';
import { generatePromptFromImage } from './geminiService';
import UploadZone from './components/UploadZone';
import PreviewSection from './components/PreviewSection';
import HistorySection from './components/HistorySection';
import Header from './components/Header';

const STORAGE_KEY = 'vision_prompt_history_v1';
const HISTORY_LIMIT = 20;

const App: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [genState, setGenState] = useState<GenerationState>({
    isGenerating: false,
    error: null,
    currentPrompt: null,
  });

  // Load history on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  // Save history to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  }, [history]);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
    
    setGenState({
      isGenerating: false,
      error: null,
      currentPrompt: null,
    });
  };

  const handleGenerate = async () => {
    if (!previewUrl || !selectedFile) return;

    setGenState(prev => ({ ...prev, isGenerating: true, error: null }));

    try {
      const apiPromise = generatePromptFromImage(previewUrl, selectedFile.type);
      const delayPromise = new Promise(resolve => setTimeout(resolve, 1500));
      
      const [prompt] = await Promise.all([apiPromise, delayPromise]);

      setGenState({
        isGenerating: false,
        error: null,
        currentPrompt: prompt as string,
      });

      const newItem: HistoryItem = {
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        imageName: selectedFile.name,
        imageData: previewUrl,
        prompt: prompt as string,
      };

      setHistory(prev => {
        const updated = [newItem, ...prev];
        return updated.slice(0, HISTORY_LIMIT);
      });

    } catch (err) {
      setGenState({
        isGenerating: false,
        error: err instanceof Error ? err.message : "Something went wrong during generation.",
        currentPrompt: null,
      });
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setGenState({
      isGenerating: false,
      error: null,
      currentPrompt: null,
    });
  };

  const clearHistory = () => {
    if (confirm("Are you sure you want to clear your generation history?")) {
      setHistory([]);
    }
  };

  return (
    <div className="min-h-screen pb-20">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 mt-12 space-y-16">
        <section className="flex flex-col items-center">
          {!previewUrl ? (
            <div className="w-full max-w-xl">
              <UploadZone onFileSelect={handleFileSelect} />
            </div>
          ) : (
            <div className="w-full">
              <PreviewSection 
                previewUrl={previewUrl}
                imageName={selectedFile?.name || 'Image'}
                onGenerate={handleGenerate}
                onReset={handleReset}
                genState={genState}
              />
            </div>
          )}
        </section>

        <section>
          <HistorySection 
            history={history} 
            onClear={clearHistory}
          />
        </section>
      </main>

      <footer className="mt-20 py-8 text-center text-gray-400 text-sm border-t border-gray-100">
        <p>&copy; {new Date().getFullYear()} VisionPrompt AI. Powered by Gemini AI.</p>
      </footer>
    </div>
  );
};

export default App;
