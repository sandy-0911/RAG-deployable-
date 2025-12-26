
import React, { useState, useCallback } from 'react';
import { ChatMessage } from './types';
import { Header } from './components/Header';
import { ChatInterface } from './components/ChatInterface';

const App: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'model',
      content: "Hello! I am your DSA Expert. Ask me anything about Data Structures and Algorithms, and I'll find the answer in my knowledge base.",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = useCallback(async (text: string) => {
    if (!text.trim()) return;

    const userMessage: ChatMessage = { role: 'user', content: text };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      // FIX: Replaced call to deprecated getExpertAnswer from services/geminiService.ts
      // with a fetch to the Next.js API route /api/query/route.ts.
      const response = await fetch('/api/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: text, history: messages })
      });

      const data = await response.json();
      
      if (data.error) throw new Error(data.error);

      const modelResponse = data.answer;
      const modelMessage: ChatMessage = { role: 'model', content: modelResponse };
      setMessages(prev => [...prev, modelMessage]);
    } catch (error) {
      console.error("Error getting answer:", error);
      const errorMessage: ChatMessage = {
        role: 'model',
        content: "Sorry, I encountered an error while processing your request. Please check the console for details and ensure your API key and environment variables are configured correctly."
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [messages]);

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col font-sans antialiased">
       <div 
        className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-900/40 via-gray-900 to-gray-900 z-0"
        style={{
          background: 'radial-gradient(circle at top left, rgba(55, 48, 163, 0.3), transparent 40%), radial-gradient(circle at bottom right, rgba(132, 204, 22, 0.2), transparent 50%)',
          backgroundColor: '#111827'
        }}
      ></div>
      <div className="relative z-10 flex flex-col h-screen w-full max-w-4xl mx-auto">
        <Header />
        <ChatInterface 
          messages={messages} 
          isLoading={isLoading} 
          onSendMessage={handleSendMessage} 
        />
      </div>
    </div>
  );
};

export default App;
