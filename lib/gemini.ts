
import { GoogleGenAI } from "@google/genai";

/**
 * We wrap the initialization in a function or a safe getter 
 * to prevent top-level crashes if the environment variable is missing.
 */
export const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
};

// For backward compatibility with files expecting a direct export
export const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || 'MISSING_KEY' });
