
import { GoogleGenAI, Type } from "@google/genai";
import { TimeOfDay, Category } from "./types";

export const getMealRecommendation = async (
  time: TimeOfDay, 
  category: Category,
  minPrice: string,
  maxPrice: string,
  segmentColor: string
): Promise<{ dish: string; reason: string }> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const priceRange = (minPrice || maxPrice) 
    ? ` within the price range of ${minPrice || '0'} to ${maxPrice || 'any'} KRW` 
    : '';

  const prompt = `Recommend a specific ${time} meal from the category "${category}"${priceRange}. 
  Provide a short, fun, and appetizing reason why it matches the time and category. 
  DO NOT mention hexadecimal color codes, the word "hex", or specific color names (like ${segmentColor}) in your response. 
  Focus only on the flavor, vibe, and suitability for the chosen time.
  The response must be in Korean.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            dish: { type: Type.STRING },
            reason: { type: Type.STRING },
          },
          required: ["dish", "reason"],
        },
      },
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      dish: "맛있는 요리",
      reason: "시스템 연결이 원활하지 않아 추천이 조금 늦어지고 있어요."
    };
  }
};
