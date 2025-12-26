
import React from 'react';

interface MessageProps {
  role: 'user' | 'model';
  content: string;
}

export const Message: React.FC<MessageProps> = ({ role, content }) => {
  const isUser = role === 'user';

  const formatContent = (text: string) => {
    // Basic markdown for code blocks
    const codeBlockRegex = /```([\s\S]*?)```/g;
    const parts = text.split(codeBlockRegex);

    return parts.map((part, index) => {
      if (index % 2 === 1) { // This is a code block
        // Naive language detection for display
        const langMatch = part.match(/^(python|javascript|java|c\+\+|go|typescript|ts|js)\n/);
        const lang = langMatch ? langMatch[1] : '';
        const code = langMatch ? part.substring(langMatch[0].length) : part;

        return (
          <div key={index} className="bg-gray-800 rounded-md my-2 relative">
             {lang && <span className="absolute top-1 right-2 text-xs text-gray-400">{lang}</span>}
             <pre className="p-3 text-sm text-gray-200 overflow-x-auto">
              <code>{code}</code>
            </pre>
          </div>
        );
      }
      // Basic markdown for bold and lists
      let formattedPart = part.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      formattedPart = formattedPart.replace(/^\s*-\s/gm, '• ');
      return <p key={index} className="whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: formattedPart }} />;
    });
  };

  return (
    <div className={`flex items-start space-x-3 ${isUser ? 'justify-end' : ''}`}>
      {!isUser && (
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-500/80 flex items-center justify-center border-2 border-indigo-400">
          <BotIcon />
        </div>
      )}
      <div 
        className={`p-3 rounded-lg max-w-lg ${isUser 
          ? 'bg-lime-500 text-gray-900 rounded-br-none' 
          : 'bg-gray-700 text-gray-200 rounded-bl-none'}`}
      >
        <div className="prose prose-invert prose-sm text-white">{formatContent(content)}</div>
      </div>
      {isUser && (
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center border-2 border-gray-500">
          <UserIcon />
        </div>
      )}
    </div>
  );
};

const BotIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
)

const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
)
