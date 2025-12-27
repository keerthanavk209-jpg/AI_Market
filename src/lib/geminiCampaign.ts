// lib/geminiCampaign.ts
import { GoogleGenAI } from "@google/genai";

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

export async function generateCampaignContent(type: string, details: {
  title: string;
  description: string;
  targetAudience: string;
  budget: string;
  duration: string;
}): Promise<string> {
  const prompt = `Generate a concise, creative ${type} based on the following campaign details:

Campaign Title: ${details.title}
Description: ${details.description}
Target Audience: ${details.targetAudience}
Budget: ${details.budget}
Duration: ${details.duration}`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are an expert marketing AI copywriter. Generate creative and compelling campaign content. Avoid markdown formatting, bullet points, or emojis. Write in plain, professional English. Keep it direct and structured, not list-based.",
        temperature: 0.8,
      },
    });

    const raw = response.text ?? 'No content returned';
    return raw.trim();
  } catch (err: any) {
    console.error("Campaign Gemini Error:", err.message);
    throw new Error("Failed to generate campaign content.");
  }
}

export async function generateCampaignContentStream(
  type: string,
  details: {
    title: string;
    description: string;
    targetAudience: string;
    budget: string;
    duration: string;
  },
  onChunk: (text: string) => void
): Promise<void> {
  const prompt = `Generate a concise, creative ${type} based on the following campaign details:

Campaign Title: ${details.title}
Description: ${details.description}
Target Audience: ${details.targetAudience}
Budget: ${details.budget}
Duration: ${details.duration}`;

  try {
    const response = await ai.models.generateContentStream({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are an expert marketing AI copywriter. Generate creative and compelling campaign content. Avoid markdown formatting, bullet points, or emojis. Write in plain, professional English. Keep it direct and structured, not list-based.",
        temperature: 0.8,
      },
    });

    for await (const chunk of response) {
      if (chunk.text) {
        onChunk(chunk.text);
      }
    }
  } catch (err: any) {
    console.error("Campaign Gemini Error:", err.message);
    throw new Error("Failed to generate campaign content.");
  }
}
