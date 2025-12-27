
import { GoogleGenAI } from "@google/genai";

/**
 * Safely retrieves the AI client instance.
 * Returns null if the API_KEY is missing, allowing consumers to handle 
 * the error politely in the UI.
 */
export const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey || apiKey === 'MISSING_KEY') return null;
  
  try {
    return new GoogleGenAI({ apiKey });
  } catch (e) {
    console.error("Failed to initialize GoogleGenAI:", e);
    return null;
  }
};

// Default export for backward compatibility with existing route logic
// Note: We use a placeholder string that is checked in the getAiClient function.
export const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || 'MISSING_KEY' });
