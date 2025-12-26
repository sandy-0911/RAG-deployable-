'use client';

import React, { useState, useCallback } from 'react';
import { ChatMessage } from '../types';
import { Header } from '../components/Header';
import { ChatInterface } from '../components/ChatInterface';

export default function Home() {
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
      const response = await fetch('/api/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: text, history: messages })
      });

      const data = await response.json();
      
      if (data.error) throw new Error(data.error);

      const modelMessage: ChatMessage = { role: 'model', content: data.answer };
      setMessages(prev => [...prev, modelMessage]);
    } catch (error) {
      console.error("Error getting answer:", error);
      setMessages(prev => [...prev, {
        role: 'model',
        content: "Sorry, I encountered an error. Please ensure your environment variables are set up in Vercel."
      }]);
    } finally {
      setIsLoading(false);
    }
  }, [messages]);

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col font-sans antialiased relative">
       <div 
        className="absolute top-0 left-0 w-full h-full z-0"
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
}
