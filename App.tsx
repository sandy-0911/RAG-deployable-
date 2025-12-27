import React, { useState, useCallback } from 'react';
import { ChatMessage } from './types';
import { Header } from './components/Header';
import { ChatInterface } from './components/ChatInterface';
import { getExpertAnswer } from './services/ragService';

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
    const history = [...messages];
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // The ragService now handles internal errors gracefully and returns polite strings
      const answer = await getExpertAnswer(text, history);
      
      const modelMessage: ChatMessage = { role: 'model', content: answer };
      setMessages(prev => [...prev, modelMessage]);
    } catch (error) {
      // This block now only catches catastrophic failures (e.g. network disconnect)
      console.error("Critical App Error:", error);
      const errorMessage: ChatMessage = {
        role: 'model',
        content: "I'm having trouble connecting to my services. Please check your internet connection and try again."
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [messages]);

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col font-sans antialiased relative overflow-hidden">
       <div 
        className="absolute top-0 left-0 w-full h-full z-0"
        style={{
          background: 'radial-gradient(circle at top left, rgba(55, 48, 163, 0.3), transparent 40%), radial-gradient(circle at bottom right, rgba(132, 204, 22, 0.2), transparent 50%)',
          backgroundColor: '#111827'
        }}
      ></div>
      <div className="relative z-10 flex flex-col h-screen w-full max-w-4xl mx-auto shadow-2xl">
        <Header />
        <div className="flex-grow overflow-hidden flex flex-col bg-gray-900/40 backdrop-blur-sm border-x border-gray-800">
          <ChatInterface 
            messages={messages} 
            isLoading={isLoading} 
            onSendMessage={handleSendMessage} 
          />
        </div>
      </div>
    </div>
  );
};

export default App;
