// lib/gemini.ts
import { GoogleGenAI } from "@google/genai";

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

export async function getGeminiResponse(prompt: string): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are a professional AI Marketing Assistant. Respond concisely and clearly. Avoid using markdown (*, -, etc), no bullet points, no headings. Just give a brief and direct answer.",
        temperature: 0.7,
      },
    });

    const rawText = response.text ?? 'No response';
    return rawText.trim();
  } catch (err: any) {
    console.error('Gemini API error:', err.message);
    throw err;
  }
}

export async function getGeminiResponseStream(
  prompt: string,
  onChunk: (text: string) => void
): Promise<void> {
  try {
    const response = await ai.models.generateContentStream({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are a professional AI Marketing Assistant. Respond concisely and clearly. Avoid using markdown (*, -, etc), no bullet points, no headings. Just give a brief and direct answer.",
        temperature: 0.7,
      },
    });

    for await (const chunk of response) {
      if (chunk.text) {
        onChunk(chunk.text);
      }
    }
  } catch (err: any) {
    console.error('Gemini API streaming error:', err.message);
    throw err;
  }
}
