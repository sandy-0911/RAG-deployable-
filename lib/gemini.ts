import { GoogleGenAI } from "@google/genai";

// Ensure API Key is present. In production, this comes from Vercel Env Vars.
const apiKey = process.env.API_KEY;

if (!apiKey) {
  throw new Error("Missing API_KEY environment variable");
}

export const ai = new GoogleGenAI({ apiKey });
