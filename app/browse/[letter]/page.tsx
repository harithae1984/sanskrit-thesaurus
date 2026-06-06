// app/browse/[letter]/page.tsx
// Browse entries by specific letter

import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getEntriesByLetter, getAllLetters, getAllEntries } from '@/lib/data';
import LetterSection from '@/components/browse/LetterSection';
import AlphabetNav from '@/components/browse/AlphabetNav';
import DevanagariText from '@/components/ui/DevanagariText';
import { toIAST } from '@/lib/transliteration';

interface LetterPageProps {
  params: {
    letter: string;
  };
}

export async function generateStaticParams() {
  const letters = await getAllLetters();
  return letters.map(letter => ({
    letter: encodeURIComponent(letter),
  }));
}

export async function generateMetadata({ params }: LetterPageProps) {
  const letter = decodeURIComponent(params.letter);
  const letterIAST = toIAST(letter);
  
  return {
    title: `Browse Letter ${letter} (${letterIAST})`,
    description: `Browse Vishishtadvaita Kosha entries starting with the Sanskrit letter ${letter} (${letterIAST})`,
  };
}

export default async function LetterPage({ params }: LetterPageProps) {
  const letter = decodeURIComponent(params.letter);
  const [entries, allEntries] = await Promise.all([
    getEntriesByLetter(letter),
    getAllEntries(),
  ]);
  
  if (entries.length === 0) {
    notFound();
  }
  
  // Create letter counts for navigation
  const letterCounts = new Map<string, number>();
  allEntries.forEach(entry => {
    letterCounts.set(entry.letter, (letterCounts.get(entry.letter) || 0) + 1);
  });
  
  const letterIAST = toIAST(letter);
  
  // Get adjacent letters for navigation
  const allLetters = Array.from(letterCounts.keys()).sort();
  const currentIndex = allLetters.indexOf(letter);
  const prevLetter = currentIndex > 0 ? allLetters[currentIndex - 1] : null;
  const nextLetter = currentIndex < allLetters.length - 1 ? allLetters[currentIndex + 1] : null;
  
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-sm text-gray-500">
            <li>
              <Link href="/" className="hover:text-sanskrit-600">
                Home
              </Link>
            </li>
            <li>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </li>
            <li>
              <Link href="/browse" className="hover:text-sanskrit-600">
                Browse
              </Link>
            </li>
            <li>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </li>
            <li className="text-gray-900 font-medium font-devanagari">
              {letter}
            </li>
          </ol>
        </nav>
        
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <div className="flex items-baseline justify-between mb-6">
            <div>
              <div className="flex items-baseline space-x-4">
                <DevanagariText as="h1" size="3xl" weight="bold" className="text-gray-900">
                  {letter}
                </DevanagariText>
                <span className="text-2xl text-gray-500 font-iast">
                  {letterIAST}
                </span>
              </div>
              <p className="mt-2 text-gray-600">
                {entries.length} {entries.length === 1 ? 'entry' : 'entries'} starting with this letter
              </p>
            </div>
            
            {/* Letter navigation */}
            <div className="hidden md:flex items-center space-x-2">
              {prevLetter ? (
                <Link
                  href={`/browse/${encodeURIComponent(prevLetter)}`}
                  className="p-2 text-gray-600 hover:text-sanskrit-600 hover:bg-gray-100 rounded transition-colors"
                  aria-label={`Previous letter: ${prevLetter}`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </Link>
              ) : (
                <div className="p-2 text-gray-300">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </div>
              )}
              
              <Link
                href="/browse"
                className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-sanskrit-600 hover:bg-gray-100 rounded transition-colors"
              >
                All Letters
              </Link>
              
              {nextLetter ? (
                <Link
                  href={`/browse/${encodeURIComponent(nextLetter)}`}
                  className="p-2 text-gray-600 hover:text-sanskrit-600 hover:bg-gray-100 rounded transition-colors"
                  aria-label={`Next letter: ${nextLetter}`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ) : (
                <div className="p-2 text-gray-300">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              )}
            </div>
          </div>
          
          {/* Compact alphabet nav */}
          <div className="pt-6 border-t border-gray-200">
            <AlphabetNav 
              currentLetter={letter}
              letterCounts={letterCounts}
              variant="compact"
              showCounts={false}
            />
          </div>
        </div>
        
        {/* Entries */}
        <LetterSection 
          letter={letter}
          entries={entries}
          showLetterHeader={false}
        />
        
        {/* Bottom navigation */}
        <div className="mt-12 flex justify-between items-center">
          {prevLetter ? (
            <Link
              href={`/browse/${encodeURIComponent(prevLetter)}`}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <DevanagariText as="span" size="base">
                {prevLetter}
              </DevanagariText>
            </Link>
          ) : (
            <div />
          )}
          
          {nextLetter ? (
            <Link
              href={`/browse/${encodeURIComponent(nextLetter)}`}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              <DevanagariText as="span" size="base">
                {nextLetter}
              </DevanagariText>
              <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ) : (
            <div />
          )}
        </div>
      </div>
    </div>
  );
}
