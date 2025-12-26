import React from 'react';
import './globals.css'; // Assume basic tailwind imports here

export const metadata = {
  title: 'DSA Expert RAG',
  description: 'AI-powered Data Structures and Algorithms guide',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
