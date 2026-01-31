
import React from 'react';
import { GenerationState } from '../types';

interface PreviewSectionProps {
  previewUrl: string;
  imageName: string;
  onGenerate: () => void;
  onReset: () => void;
  genState: GenerationState;
}

const PreviewSection: React.FC<PreviewSectionProps> = ({
  previewUrl,
  imageName,
  onGenerate,
  onReset,
  genState,
}) => {
  const { isGenerating, currentPrompt, error } = genState;

  const copyToClipboard = () => {
    if (currentPrompt) {
      navigator.clipboard.writeText(currentPrompt);
      alert("Prompt copied to clipboard!");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        <div className="w-full md:w-1/2">
          <div className="relative group rounded-3xl overflow-hidden shadow-2xl bg-black border border-gray-200">
            <img 
              src={previewUrl} 
              alt="Preview" 
              className="w-full h-auto object-contain max-h-[500px]"
            />
            <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-xs text-white">
              {imageName}
            </div>
          </div>
          
          <div className="mt-4 flex justify-center">
            <button 
              onClick={onReset}
              className="text-gray-500 hover:text-red-500 text-sm font-medium transition-colors flex items-center space-x-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              <span>Discard Image</span>
            </button>
          </div>
        </div>

        <div className="w-full md:w-1/2 space-y-6">
          {!currentPrompt && !isGenerating ? (
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-6 text-center md:text-left">
              <h3 className="text-2xl font-bold text-gray-900">Ready to transform?</h3>
              <p className="text-gray-500 leading-relaxed">
                Click the button below and our Gemini AI will analyze every pixel to generate a high-fidelity prompt for you.
              </p>
              <button
                onClick={onGenerate}
                disabled={isGenerating}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-lg shadow-lg shadow-indigo-200 transition-all active:scale-95 flex items-center justify-center space-x-2"
              >
                <span>✨ Generate Prompt</span>
              </button>
            </div>
          ) : null}

          {isGenerating && (
            <div className="bg-white rounded-3xl p-12 border border-gray-100 shadow-sm flex flex-col items-center justify-center space-y-6">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 bg-indigo-50 rounded-full flex items-center justify-center">
                    <span className="text-indigo-600 animate-pulse text-xs font-bold">AI</span>
                  </div>
                </div>
              </div>
              <div className="text-center space-y-2">
                <h4 className="font-bold text-xl text-gray-900">Analyzing Image...</h4>
                <p className="text-gray-500 text-sm italic">Gemini is deconstructing lighting and composition...</p>
              </div>
            </div>
          )}

          {currentPrompt && !isGenerating && (
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-6 animate-in slide-in-from-right-4 duration-500">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-900">Generated Prompt</h3>
                <div className="flex space-x-2">
                  <button 
                    onClick={copyToClipboard}
                    className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                    title="Copy to clipboard"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                <p className="text-gray-700 leading-relaxed italic text-sm md:text-base">
                  "{currentPrompt}"
                </p>
              </div>

              <div className="flex flex-col space-y-3">
                <button
                  onClick={onGenerate}
                  className="w-full py-3 border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 rounded-xl font-semibold transition-all active:scale-95"
                >
                  Regenerate
                </button>
                <button
                  onClick={onReset}
                  className="w-full py-3 bg-gray-900 text-white hover:bg-gray-800 rounded-xl font-semibold transition-all active:scale-95"
                >
                  New Image
                </button>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl flex flex-col space-y-2">
              <div className="flex items-center space-x-3">
                <svg className="w-6 h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm font-bold">API Error</p>
              </div>
              <p className="text-xs">{error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PreviewSection;