import { GoogleGenAI } from "@google/genai";

// Initialize the GoogleGenAI client with the API key from environment variables.
// Following the guideline to use the named parameter for apiKey.
export const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Helper to get the AI client instance.
 * Maintained for backward compatibility with ragService.ts.
 */
export const getAiClient = () => ai;
