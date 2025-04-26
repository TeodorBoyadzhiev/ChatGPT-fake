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

export const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_PUBLIC_KEY });

export async function main(text, setAnswer) {
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

  const stream1 = await chat.sendMessageStream({
    message: text || "I have 2 dogs in my house.",
  });

  let accumutaledText = "";
  for await (const chunk of stream1) {
    accumutaledText += chunk.text;
    setAnswer(accumutaledText);
  }
}