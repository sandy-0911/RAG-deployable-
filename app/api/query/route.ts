import { NextResponse } from 'next/server';
import { ai } from '../../../lib/gemini';
import { queryVectorDB } from '../../../lib/pinecone';

export async function POST(req: Request) {
  try {
    const { question, history } = await req.json();

    // 1. Query Transformation (Turn follow-up into standalone query)
    let standaloneQuery = question;
    if (history && history.length > 1) {
      // Use ai.models.generateContent to transform the query.
      const transformResponse = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [
          ...history.map((m: any) => ({ role: m.role, parts: [{ text: m.content }] })),
          { role: 'user', parts: [{ text: `Based on history, rewrite this as a standalone DSA search query: ${question}` }] }
        ],
        config: {
          systemInstruction: "You are a query rewriter. Output ONLY the standalone question.",
        },
      });
      // Access the .text property directly (do not call as a function).
      standaloneQuery = transformResponse.text?.trim() || question;
    }

    // 2. Retrieval (Get context from Pinecone)
    // First, embed the query
    // NOTE: In a real implementation, you'd use the embedding model
    // const embedResult = await ai.models.embedContent({ model: 'text-embedding-004', content: standaloneQuery });
    // const matches = await queryVectorDB(embedResult.embedding.values);
    
    // For demo purposes, we'll use mocked retrieval
    const matches = await queryVectorDB([]); 
    const context = matches.map((m: any) => m.metadata.text).join('\n---\n');

    // 3. Grounded Generation
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview', // High reasoning model for complex DSA tasks.
      contents: [
        ...history.map((m: any) => ({ role: m.role, parts: [{ text: m.content }] })),
        { role: 'user', parts: [{ text: question }] }
      ],
      config: {
        systemInstruction: `You are a world-class Data Structures and Algorithms Expert.
        Answer the user's question using the provided context.
        Context: ${context}
        If the answer isn't in the context, say: "I'm sorry, my knowledge base doesn't contain that specific detail."
        Use clean Markdown and code blocks.`,
      },
    });

    // Extract text from the response using the .text property.
    return NextResponse.json({ answer: response.text || "I was unable to generate a response at this time." });

  } catch (error: any) {
    console.error("RAG Error:", error);
    return NextResponse.json({ error: "Failed to process query" }, { status: 500 });
  }
}
