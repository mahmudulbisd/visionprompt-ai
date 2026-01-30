
import React from 'react';
import { HistoryItem } from '../types';

interface HistorySectionProps {
  history: HistoryItem[];
  onClear: () => void;
}

const HistorySection: React.FC<HistorySectionProps> = ({ history, onClear }) => {
  if (history.length === 0) return null;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
      <div className="flex justify-between items-end border-b border-gray-100 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Recent Generations</h2>
          <p className="text-gray-500 text-sm">Your last 20 generated prompts</p>
        </div>
        <button 
          onClick={onClear}
          className="text-gray-400 hover:text-red-500 text-xs font-semibold uppercase tracking-wider transition-colors"
        >
          Clear History
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {history.map((item) => (
          <div 
            key={item.id} 
            className="group glass rounded-3xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 hover:border-indigo-200"
          >
            <div className="flex gap-4">
              <div className="shrink-0">
                <div className="w-24 h-24 rounded-2xl overflow-hidden border border-gray-100 bg-gray-50">
                  <img 
                    src={item.imageData} 
                    alt={item.imageName} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
              </div>
              <div className="flex-1 min-w-0 flex flex-col justify-center">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    {new Date(item.timestamp).toLocaleDateString()}
                  </span>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(item.prompt);
                      alert("Copied!");
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1.5 bg-indigo-50 text-indigo-600 rounded-lg transition-opacity"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg>
                  </button>
                </div>
                <p className="text-gray-800 text-sm line-clamp-3 leading-relaxed">
                  {item.prompt}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistorySection;
