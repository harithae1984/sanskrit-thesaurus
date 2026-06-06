// components/ui/TransliterationToggle.tsx
// Toggle button for showing/hiding IAST transliteration

'use client';

import { useState } from 'react';

interface TransliterationToggleProps {
  defaultShow?: boolean;
  onToggle?: (show: boolean) => void;
  className?: string;
}

export default function TransliterationToggle({
  defaultShow = false,
  onToggle,
  className = '',
}: TransliterationToggleProps) {
  const [showIAST, setShowIAST] = useState(defaultShow);
  
  const handleToggle = () => {
    const newValue = !showIAST;
    setShowIAST(newValue);
    onToggle?.(newValue);
  };
  
  return (
    <button
      type="button"
      onClick={handleToggle}
      className={`
        inline-flex items-center px-3 py-1.5 text-sm font-medium
        border border-gray-300 rounded-md
        hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-sanskrit-500
        transition-colors ${className}
      `.trim()}
      aria-pressed={showIAST}
      aria-label={showIAST ? 'Hide IAST transliteration' : 'Show IAST transliteration'}
    >
      <svg
        className="w-4 h-4 mr-2"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
        />
      </svg>
      <span className="font-devanagari">
        {showIAST ? 'IAST गोपयतु' : 'IAST दर्शयतु'}
      </span>
      <span className="ml-2 text-xs text-gray-500">
        ({showIAST ? 'Hide' : 'Show'} IAST)
      </span>
    </button>
  );
}

// Hook for managing IAST visibility state across components
import { createContext, useContext, ReactNode } from 'react';

interface IASTContextType {
  showIAST: boolean;
  toggleIAST: () => void;
  setShowIAST: (show: boolean) => void;
}

const IASTContext = createContext<IASTContextType | undefined>(undefined);

export function IASTProvider({ children }: { children: ReactNode }) {
  const [showIAST, setShowIAST] = useState(false);
  
  const toggleIAST = () => setShowIAST(prev => !prev);
  
  return (
    <IASTContext.Provider value={{ showIAST, toggleIAST, setShowIAST }}>
      {children}
    </IASTContext.Provider>
  );
}

export function useIAST() {
  const context = useContext(IASTContext);
  if (context === undefined) {
    throw new Error('useIAST must be used within an IASTProvider');
  }
  return context;
}
