
import React, { useState, useRef } from 'react';

interface UploadZoneProps {
  onFileSelect: (file: File) => void;
}

const UploadZone: React.FC<UploadZoneProps> = ({ onFileSelect }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        onFileSelect(file);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div className="text-center space-y-6 animate-in fade-in duration-700 slide-in-from-bottom-4">
      <div className="space-y-2">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
          Image to Prompt <span className="gradient-text">Generator</span>
        </h1>
        <p className="text-gray-500 text-lg">
          Upload an image and let AI craft the perfect prompt for you.
        </p>
      </div>

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`
          relative group cursor-pointer border-2 border-dashed rounded-3xl p-12 transition-all duration-300
          ${isDragging 
            ? 'border-indigo-500 bg-indigo-50 scale-[1.02]' 
            : 'border-gray-200 bg-white hover:border-indigo-400 hover:bg-gray-50'
          }
        `}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />
        
        <div className="flex flex-col items-center space-y-4">
          <div className={`
            p-4 rounded-2xl transition-all duration-300
            ${isDragging ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-400 group-hover:bg-indigo-100 group-hover:text-indigo-600'}
          `}>
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          
          <div className="space-y-1">
            <p className="text-lg font-semibold text-gray-700">
              Drag & drop your image here
            </p>
            <p className="text-sm text-gray-400">
              Supports PNG, JPG, JPEG, WEBP (Max 10MB)
            </p>
          </div>
          
          <button className="px-6 py-2.5 bg-indigo-600 text-white rounded-full font-medium text-sm shadow-md hover:bg-indigo-700 transition-colors">
            Or browse files
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadZone;
