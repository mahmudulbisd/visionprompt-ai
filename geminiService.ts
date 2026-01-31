
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

/**
 * Service to interact with Gemini AI for image analysis.
 * Uses the latest Gemini 3 Flash model for prompt generation.
 */
export const generatePromptFromImage = async (
  base64Image: string,
  mimeType: string
): Promise<string> => {
  const API_KEY = process.env.API_KEY || "";
  
  try {
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    
    // Extract raw base64 data from Data URL
    const dataOnly = base64Image.split(',')[1] || base64Image;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: dataOnly,
            },
          },
          {
            text: "Analyze this image in extreme detail. Generate a high-quality, creative 'prompt' that could be used in an AI image generator (like Midjourney or DALL-E) to recreate this image. Focus on artistic style, camera settings, lighting, color palette, composition, and specific subject details. Keep the output as a single, powerful descriptive paragraph.",
          },
        ],
      },
    });

    if (!response.text) {
      throw new Error("Gemini returned an empty response.");
    }

    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    
    if (errorMessage.includes("API_KEY_INVALID") || errorMessage.includes("401")) {
      throw new Error("Invalid Gemini API Key. Please check your environment configuration.");
    }
    
    throw new Error(`Failed to generate prompt: ${errorMessage}`);
  }
};
