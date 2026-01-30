
/**
 * Service to interact with AI models for image analysis.
 * Updated to use OpenAI GPT-4o vision model as requested.
 */
export const generatePromptFromImage = async (
  base64Image: string,
  mimeType: string
): Promise<string> => {
  const API_KEY = process.env.API_KEY || "";
  
  try {
    // Stripping the data URL prefix if it exists to get raw base64 data
    const dataOnly = base64Image.split(',')[1] || base64Image;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "user",
            content: [
              { 
                type: "text", 
                text: "Analyze this image in extreme detail. Generate a high-quality, creative 'prompt' that could be used in an AI image generator (like Midjourney or DALL-E) to recreate this image. Focus on artistic style, camera settings, lighting, color palette, composition, and specific subject details. Keep the output as a single, powerful descriptive paragraph." 
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:${mimeType};base64,${dataOnly}`,
                },
              },
            ],
          },
        ],
        max_tokens: 500
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `OpenAI API error: ${response.statusText}`);
    }

    const result = await response.json();
    return result.choices[0]?.message?.content?.trim() || "Failed to generate a prompt. Please try again.";
  } catch (error) {
    console.error("AI API Error:", error);
    
    // Check for specific common OpenAI errors
    if (error instanceof Error && error.message.includes("401")) {
      return "Authentication error: The provided API key is invalid or has expired.";
    }
    
    return `An error occurred while generating the prompt. (${error instanceof Error ? error.message : 'Unknown error'})`;
  }
};
