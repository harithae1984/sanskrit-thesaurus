// components/browse/AlphabetNav.tsx
// Sanskrit alphabet navigation component

import Link from 'next/link';
import { SANSKRIT_ALPHABET } from '@/lib/constants';
import DevanagariText from '@/components/ui/DevanagariText';

interface AlphabetNavProps {
  currentLetter?: string;
  letterCounts?: Map<string, number>;
  variant?: 'grid' | 'list' | 'compact';
  showCounts?: boolean;
}

export default function AlphabetNav({
  currentLetter,
  letterCounts = new Map(),
  variant = 'grid',
  showCounts = true,
}: AlphabetNavProps) {
  const allLetters = [
    ...SANSKRIT_ALPHABET.vowels,
    ...SANSKRIT_ALPHABET.consonants,
  ];
  
  if (variant === 'compact') {
    return (
      <div className="flex flex-wrap gap-1">
        {allLetters.map((letter) => {
          const count = letterCounts.get(letter) || 0;
          const isActive = currentLetter === letter;
          const hasEntries = count > 0;
          
          return (
            <Link
              key={letter}
              href={hasEntries ? `/browse/${encodeURIComponent(letter)}` : '#'}
              className={`
                px-2 py-1 text-sm font-devanagari rounded
                ${isActive 
                  ? 'bg-sanskrit-600 text-white' 
                  : hasEntries
                    ? 'bg-white border border-gray-300 hover:bg-sanskrit-50 hover:border-sanskrit-400 text-gray-700'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }
                transition-colors
              `.trim()}
              aria-current={isActive ? 'page' : undefined}
              aria-disabled={!hasEntries}
            >
              {letter}
              {showCounts && hasEntries && (
                <span className="ml-1 text-xs opacity-75">({count})</span>
              )}
            </Link>
          );
        })}
      </div>
    );
  }
  
  if (variant === 'list') {
    return (
      <div className="space-y-6">
        {/* Vowels */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3 font-devanagari">
            स्वराः (Vowels)
          </h3>
          <div className="grid grid-cols-7 sm:grid-cols-10 gap-2">
            {SANSKRIT_ALPHABET.vowels.map((letter) => {
              const count = letterCounts.get(letter) || 0;
              const isActive = currentLetter === letter;
              const hasEntries = count > 0;
              
              return (
                <LetterButton
                  key={letter}
                  letter={letter}
                  count={count}
                  isActive={isActive}
                  hasEntries={hasEntries}
                  showCounts={showCounts}
                />
              );
            })}
          </div>
        </div>
        
        {/* Consonants */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3 font-devanagari">
            व्यञ्जनानि (Consonants)
          </h3>
          <div className="grid grid-cols-7 sm:grid-cols-10 gap-2">
            {SANSKRIT_ALPHABET.consonants.map((letter) => {
              const count = letterCounts.get(letter) || 0;
              const isActive = currentLetter === letter;
              const hasEntries = count > 0;
              
              return (
                <LetterButton
                  key={letter}
                  letter={letter}
                  count={count}
                  isActive={isActive}
                  hasEntries={hasEntries}
                  showCounts={showCounts}
                />
              );
            })}
          </div>
        </div>
      </div>
    );
  }
  
  // Default: grid variant
  return (
    <div className="grid grid-cols-8 sm:grid-cols-12 md:grid-cols-14 gap-2">
      {allLetters.map((letter) => {
        const count = letterCounts.get(letter) || 0;
        const isActive = currentLetter === letter;
        const hasEntries = count > 0;
        
        return (
          <LetterButton
            key={letter}
            letter={letter}
            count={count}
            isActive={isActive}
            hasEntries={hasEntries}
            showCounts={showCounts}
          />
        );
      })}
    </div>
  );
}

interface LetterButtonProps {
  letter: string;
  count: number;
  isActive: boolean;
  hasEntries: boolean;
  showCounts: boolean;
}

function LetterButton({ letter, count, isActive, hasEntries, showCounts }: LetterButtonProps) {
  const baseClasses = 'letter-button flex flex-col items-center justify-center p-2 min-h-[3rem]';
  
  if (!hasEntries) {
    return (
      <div
        className={`${baseClasses} bg-gray-100 text-gray-400 cursor-not-allowed`}
        aria-disabled="true"
        title="No entries"
      >
        <DevanagariText size="lg">{letter}</DevanagariText>
      </div>
    );
  }
  
  return (
    <Link
      href={`/browse/${encodeURIComponent(letter)}`}
      className={`
        ${baseClasses}
        ${isActive ? 'active' : ''}
      `.trim()}
      aria-current={isActive ? 'page' : undefined}
      title={`${count} ${count === 1 ? 'entry' : 'entries'}`}
    >
      <DevanagariText size="lg" weight={isActive ? 'bold' : 'normal'}>
        {letter}
      </DevanagariText>
      {showCounts && (
        <span className={`text-xs mt-1 ${isActive ? 'text-white' : 'text-gray-500'}`}>
          {count}
        </span>
      )}
    </Link>
  );
}
