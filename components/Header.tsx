
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="py-4 px-6 shrink-0">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white tracking-wider">
          DSA Expert
        </h1>
        <p className="text-indigo-300 text-sm mt-1">
          Your AI-powered guide through Data Structures & Algorithms
        </p>
      </div>
    </header>
  );
};
