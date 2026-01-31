import { GoogleGenAI, Type } from "@google/genai";

const getAIClient = async () => {
    // Check for API key wrapper if implemented, or just use process.env
    // In this mocked environment, we assume process.env is set or user sets it via window.aistudio
    const win = window as any;
    if (win.aistudio && typeof win.aistudio.hasSelectedApiKey === 'function') {
        const hasKey = await win.aistudio.hasSelectedApiKey();
        if (!hasKey) {
             // We can't force open here easily without user interaction in some flows, 
             // but strictly following instructions we should check.
        }
    }
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const askFarmingAssistant = async (question: string, context?: string) => {
  const ai = await getAIClient();
  
  // Using Gemini 3 Pro Preview with Thinking for complex farming advice
  // and Google Search for up-to-date prices/weather
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Context: User is a Nigerian farmer. Question: ${question}. ${context ? `Additional Context: ${context}` : ''}`,
    config: {
      tools: [{ googleSearch: {} }],
      thinkingConfig: { thinkingBudget: 1024 }, // Moderate thinking for balance
    }
  });

  return {
    text: response.text,
    grounding: response.candidates?.[0]?.groundingMetadata?.groundingChunks
  };
};

export const generateProductDescription = async (productName: string, category: string) => {
    const ai = await getAIClient();
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-lite-latest', // Fast model for simple text
        contents: `Write a short, enticing sales description for a ${category} product named "${productName}" for the Nigerian market.`
    });
    return response.text;
}

export const generateMarketingImage = async (prompt: string, aspectRatio: '1:1' | '16:9' = '1:1') => {
  const ai = await getAIClient();
  
  // Verify key for Veo/Pro Image models
  const win = window as any;
  if (win.aistudio && win.aistudio.openSelectKey) {
     const hasKey = await win.aistudio.hasSelectedApiKey();
     if(!hasKey) await win.aistudio.openSelectKey();
  }

  // Using Gemini 3 Pro Image Preview
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-image-preview',
    contents: {
        parts: [{ text: prompt }]
    },
    config: {
        imageConfig: {
            imageSize: '1K',
            aspectRatio: aspectRatio
        }
    }
  });

  // Extract image
  for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
          return `data:image/png;base64,${part.inlineData.data}`;
      }
  }
  return null;
};

export const generateMarketingVideo = async (prompt: string) => {
    const ai = await getAIClient();
    
    const win = window as any;
    if (win.aistudio && win.aistudio.openSelectKey) {
        const hasKey = await win.aistudio.hasSelectedApiKey();
        if(!hasKey) await win.aistudio.openSelectKey();
    }

    let operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: prompt,
        config: {
            numberOfVideos: 1,
            resolution: '720p',
            aspectRatio: '16:9'
        }
    });

    while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 5000));
        operation = await ai.operations.getVideosOperation({ operation: operation });
    }

    const uri = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (uri) {
        return `${uri}&key=${process.env.API_KEY}`;
    }
    return null;
}