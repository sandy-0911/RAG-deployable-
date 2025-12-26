
import React, { useState, useRef, useEffect } from 'react';

interface ChatInputProps {
  onSendMessage: (text: string) => void;
  isLoading: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [text]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() && !isLoading) {
      onSendMessage(text);
      setText('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-end space-x-3 p-2 bg-gray-800/50 rounded-xl border border-gray-700 focus-within:border-lime-400 transition-colors">
      <textarea
        ref={textareaRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask a DSA question..."
        className="flex-grow bg-transparent text-white placeholder-gray-400 focus:outline-none resize-none max-h-40 p-2"
        rows={1}
        disabled={isLoading}
      />
      <button
        type="submit"
        disabled={isLoading || !text.trim()}
        className="w-10 h-10 flex-shrink-0 bg-lime-500 text-gray-900 rounded-full flex items-center justify-center disabled:bg-gray-600 disabled:cursor-not-allowed hover:bg-lime-400 focus:outline-none focus:ring-2 focus:ring-lime-300 transition-all duration-200"
      >
        <SendIcon />
      </button>
    </form>
  );
};

const SendIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
    </svg>
)
