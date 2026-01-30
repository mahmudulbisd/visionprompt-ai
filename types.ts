
export interface HistoryItem {
  id: string;
  timestamp: number;
  imageName: string;
  imageData: string; // Base64 data URL
  prompt: string;
}

export interface GenerationState {
  isGenerating: boolean;
  error: string | null;
  currentPrompt: string | null;
}
