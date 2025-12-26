import React from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

interface SmartTextProps {
  text: string;
  className?: string;
}

const fixLatexHallucinations = (latex: string): string => {
  let fixed = latex;
  // Fix common hallucinations
  fixed = fixed.replace(/\\rac\{/g, '\\frac{');
  fixed = fixed.replace(/\\ext\{/g, '\\text{');
  fixed = fixed.replace(/\\imes/g, '\\times');
  fixed = fixed.replace(/\\div/g, '\\div');
  // Ensure proper escaping
  return fixed;
};

const renderLatex = (latex: string, displayMode: boolean = false): string => {
  try {
    const fixedLatex = fixLatexHallucinations(latex);
    return katex.renderToString(fixedLatex, {
      throwOnError: false,
      displayMode,
      trust: true,
      strict: false,
    });
  } catch (error) {
    console.error('LaTeX rendering error:', error);
    return `<span class="text-destructive">${latex}</span>`;
  }
};

export const SmartText: React.FC<SmartTextProps> = ({ text, className = '' }) => {
  if (!text) return null;

  // Split by $ delimiters for inline math
  const parts = text.split(/(\$[^$]+\$)/g);

  const renderedParts = parts.map((part, index) => {
    if (part.startsWith('$') && part.endsWith('$')) {
      // It's a LaTeX expression
      const latex = part.slice(1, -1);
      const html = renderLatex(latex, false);
      return (
        <span
          key={index}
          dangerouslySetInnerHTML={{ __html: html }}
          className="inline-block align-middle"
        />
      );
    }
    // Regular text
    return <span key={index}>{part}</span>;
  });

  return <span className={className}>{renderedParts}</span>;
};

export default SmartText;
