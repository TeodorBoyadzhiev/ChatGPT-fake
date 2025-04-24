import { GoogleGenAI } from "@google/genai";

const safetySettings = [
  {
    category: "HARM_CATEGORY_HARASSMENT",
    threshold: "BLOCK_LOW_AND_ABOVE",
  },
  {
    category: "HARM_CATEGORY_HATE_SPEECH",
    threshold: "BLOCK_LOW_AND_ABOVE",
  },
];

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function main(text) {
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: text || "How does AI work?",
    config: {
      safetySettings: safetySettings,
    },
  });
  console.log(response.text);
  return response.text;
}

await main();