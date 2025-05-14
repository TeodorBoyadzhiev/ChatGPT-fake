import { GoogleGenAI, HarmCategory, HarmBlockThreshold } from "@google/genai";

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
  },
];

export const ai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_PUBLIC_KEY,
});

export async function main(text: string): Promise<string> {
  const chat = ai.chats.create({
    model: "gemini-2.0-flash",
    config: {
      safetySettings: safetySettings,
    },
    history: [
      {
        role: "user",
        parts: [{ text: "Hello" }],
      },
      {
        role: "model",
        parts: [{ text: "Great to meet you. What would you like to know?" }],
      },
    ],
  });

  const stream = await chat.sendMessageStream({
    message: text || "I have 2 dogs in my house.",
  });

  let accumulatedText = "";
  for await (const chunk of stream) {
    accumulatedText += chunk.text;
  }

  return accumulatedText;
}