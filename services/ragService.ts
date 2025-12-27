import { getAiClient } from '../lib/gemini';
import { queryVectorDB } from '../lib/pinecone';
import { ChatMessage } from '../types';

/**
 * Enhanced RAG service with robust error handling and polite status reporting.
 */
export async function getExpertAnswer(question: string, history: ChatMessage[]) {
  const ai = getAiClient();
  
  // 1. Check for Gemini API Key
  if (!ai) {
    return "I'm truly sorry, but I'm currently unable to process your request because my **API Key** hasn't been configured yet. 🤖\n\nPlease ensure the `API_KEY` environment variable is set up in your project settings so I can start helping you with your DSA journey!";
  }

  const PINECONE_CONFIGURED = !!(process.env.PINECONE_API_KEY && process.env.PINECONE_HOST);

  try {
    // 2. Query Transformation (Requires AI)
    let standaloneQuery = question;
    if (history && history.length > 1) {
      try {
        const transformResponse = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: [
            ...history.map((m) => ({ role: m.role, parts: [{ text: m.content }] })),
            { role: 'user', parts: [{ text: `Based on history, rewrite this as a standalone DSA search query: ${question}` }] }
          ],
          config: {
            systemInstruction: "You are a query rewriter. Output ONLY the standalone question.",
          },
        });
        standaloneQuery = transformResponse.text || question;
      } catch (e) {
        console.warn("Query transformation failed, using original question.", e);
      }
    }

    // 3. Retrieval with polite fallback
    let context = "";
    let retrievalNotice = "";

    if (PINECONE_CONFIGURED) {
      try {
        const matches = await queryVectorDB([]); 
        context = matches.map((m: any) => m.metadata.text).join('\n---\n');
      } catch (e) {
        retrievalNotice = "\n\n*(Note: I'm having trouble connecting to my specialized knowledge base right now, so I'm answering using my general knowledge.)*";
      }
    } else {
      retrievalNotice = "\n\n*(Note: My specialized DSA knowledge base (Pinecone) isn't connected yet. I'll provide the best answer I can from my core training.)*";
    }

    // 4. Grounded Generation
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: [
        ...history.map((m) => ({ role: m.role, parts: [{ text: m.content }] })),
        { role: 'user', parts: [{ text: question }] }
      ],
      config: {
        systemInstruction: `You are a world-class Data Structures and Algorithms Expert.
        Answer the user's question. 
        ${context ? `Use this context from my knowledge base: ${context}` : "Note: No specific context provided, answer from general expertise."}
        If context is provided but doesn't contain the answer, acknowledge that but still provide a helpful general DSA explanation.
        Use clean Markdown and code blocks.`,
      },
    });

    return (response.text || "I processed your request but couldn't generate a text response. Please try rephrasing.") + retrievalNotice;

  } catch (error: any) {
    console.error("RAG Service Runtime Error:", error);
    
    if (error.message?.includes("401") || error.message?.includes("API key")) {
      return "It seems there's an issue with my **API Key** (it might be invalid or expired). Please double-check your credentials so I can get back to work!";
    }
    
    if (error.message?.includes("429")) {
      return "I'm receiving a lot of questions right now! I've hit my rate limit. Could you please wait a moment and try again? I'd love to help once things calm down.";
    }

    return "I apologize, but I encountered an unexpected technical glitch while processing your question. 🛠️\n\nPlease try again in a few seconds. If the problem persists, checking the server logs might reveal what went wrong.";
  }
}
