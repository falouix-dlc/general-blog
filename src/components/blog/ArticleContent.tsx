'use client';

import { useEffect } from 'react';

interface ArticleContentProps {
  content: string;
}

export function ArticleContent({ content }: ArticleContentProps) {
  useEffect(() => {
    // Add copy button to code blocks
    const codeBlocks = document.querySelectorAll('pre');
    codeBlocks.forEach((block) => {
      const button = document.createElement('button');
      button.className = 'absolute top-2 right-2 p-2 text-sm bg-gray-700 text-white rounded opacity-0 hover:opacity-100 transition-opacity';
      button.textContent = 'Copy';
      button.onclick = () => {
        navigator.clipboard.writeText(block.textContent || '');
        button.textContent = 'Copied!';
        setTimeout(() => (button.textContent = 'Copy'), 2000);
      };
      block.style.position = 'relative';
      block.appendChild(button);
      block.onmouseenter = () => (button.style.opacity = '1');
      block.onmouseleave = () => (button.style.opacity = '0');
    });
  }, [content]);

  return (
   <div 
  className="prose prose-lg max-w-none 
    prose-headings:text-gray-950  /* darker headings */
    prose-p:text-gray-900          /* darker body text */"
  dangerouslySetInnerHTML={{ __html: content }}
/>
  );
}