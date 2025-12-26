
import React, { useRef, useEffect } from 'react';
import { ChatMessage as ChatMessageType } from '../types';
import { Message } from './Message';
import { ChatInput } from './ChatInput';

interface ChatInterfaceProps {
  messages: ChatMessageType[];
  isLoading: boolean;
  onSendMessage: (text: string) => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages, isLoading, onSendMessage }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex flex-col flex-grow w-full h-full overflow-hidden">
      <main className="flex-grow p-4 space-y-6 overflow-y-auto">
        <div className="space-y-4">
          {messages.map((msg, index) => (
            <Message key={index} role={msg.role} content={msg.content} />
          ))}
          {isLoading && (
            <div className="flex items-center space-x-2 animate-pulse">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-500/80 flex items-center justify-center">
                 <BotIcon/>
              </div>
              <div className="p-3 rounded-lg rounded-bl-none bg-gray-700 max-w-lg">
                <div className="flex space-x-1">
                    <span className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-2 h-2 bg-white rounded-full animate-bounce"></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>
      <div className="px-4 pb-4 shrink-0">
        <ChatInput onSendMessage={onSendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
};


const BotIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
)
