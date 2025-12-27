
import { getAiClient } from '../lib/gemini';
import { queryVectorDB } from '../lib/pinecone';
import { ChatMessage } from '../types';

/**
 * Robust RAG service with graceful degradation and polite error reporting.
 * Handles missing API keys, database connection issues, and API rate limits.
 */
export async function getExpertAnswer(question: string, history: ChatMessage[]) {
  const ai = getAiClient();
  
  // 1. Critical Check: Google Gemini API Key
  if (!ai) {
    return "I'm truly sorry, but I'm currently unable to process your request because my **API Key** hasn't been configured in the environment settings. 🤖\n\nIf you're the developer, please ensure the `API_KEY` environment variable is set. If you're a user, please contact support or try again later!";
  }

  // Check if Pinecone is ready
  const isPineconeReady = !!(process.env.PINECONE_API_KEY && process.env.PINECONE_HOST);

  try {
    // 2. Query Transformation (Contextual Rewriting)
    let standaloneQuery = question;
    if (history && history.length > 1) {
      try {
        const transformResponse = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: [
            ...history.map((m) => ({ role: m.role, parts: [{ text: m.content }] })),
            { role: 'user', parts: [{ text: `Based on the conversation history, rewrite the following as a standalone Data Structures and Algorithms search query: "${question}"` }] }
          ],
          config: {
            systemInstruction: "You are a specialized query rewriter for technical DSA questions. Output ONLY the standalone rewritten question text, with no preamble.",
          },
        });
        standaloneQuery = transformResponse.text?.trim() || question;
      } catch (e) {
        console.warn("Query transformation failed, proceeding with original question.", e);
      }
    }

    // 3. Retrieval with polite fallback messaging
    let context = "";
    let systemNotice = "";

    if (isPineconeReady) {
      try {
        // In a full implementation, we'd generate embeddings for standaloneQuery here.
        // For this preview, we use the structuring logic provided in pinecone.ts.
        const matches = await queryVectorDB([]); 
        if (matches && matches.length > 0) {
          context = matches.map((m: any) => m.metadata.text).join('\n---\n');
        }
      } catch (e) {
        console.error("Retrieval error:", e);
        systemNotice = "\n\n*(Note: I'm currently unable to access my specialized database, so I'll answer using my general DSA knowledge.)*";
      }
    } else {
      systemNotice = "\n\n*(Note: My specialized knowledge base (Pinecone) isn't connected. I'll provide an expert response from my core training.)*";
    }

    // 4. Grounded Generation
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview', // High reasoning model for DSA complexity.
      contents: [
        ...history.map((m) => ({ role: m.role, parts: [{ text: m.content }] })),
        { role: 'user', parts: [{ text: question }] }
      ],
      config: {
        systemInstruction: `You are a world-class Data Structures and Algorithms Expert. 
        Your goal is to provide clear, accurate, and educational answers.
        ${context ? `Use this provided context for accuracy: ${context}` : "Answer from your general expertise."}
        - If the context doesn't contain the answer, say so, but still help the user using your general knowledge.
        - Use clean Markdown and provide code examples (Python/C++/Java) where relevant.
        - Be encouraging and concise.`,
      },
    });

    const finalAnswer = response.text || "I was able to process your query, but the generated response was empty. Could you please try rephrasing your question?";
    return finalAnswer + systemNotice;

  } catch (error: any) {
    console.error("RAG Service Error:", error);
    
    // Polite handling of specific API error types
    if (error.message?.includes("401") || error.message?.includes("API key")) {
      return "It appears there's an issue with my **API Authentication**. My key might be invalid or expired. I'll need a quick fix before I can help you again! 🛠️";
    }
    
    if (error.message?.includes("429")) {
      return "I'm currently being flooded with questions! 🌊 I've hit a rate limit. Could you please wait about 30 seconds and ask again? I'm excited to help!";
    }

    if (error.message?.includes("quota")) {
      return "I've reached my usage quota for the moment. Please try again later today or contact my creator!";
    }

    return "I apologize, but I encountered an unexpected technical glitch while thinking about your question. 🩹\n\nPlease try refreshing the page or asking again in a few moments.";
  }
}
