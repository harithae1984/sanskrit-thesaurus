// components/entry/EntryCard.tsx
// Compact entry preview card for browse pages

import Link from 'next/link';
import { KoshaEntry } from '@/types/entry';
import DevanagariText from '@/components/ui/DevanagariText';
import IASTText from '@/components/ui/IASTText';

interface EntryCardProps {
  entry: KoshaEntry;
  showLetter?: boolean;
  variant?: 'default' | 'compact';
}

export default function EntryCard({ 
  entry, 
  showLetter = false,
  variant = 'default' 
}: EntryCardProps) {
  const firstDefinition = entry.definitions[0];
  
  if (variant === 'compact') {
    return (
      <Link
        href={`/entry/${entry.headwordSlug}`}
        className="block p-3 bg-white rounded-lg border border-gray-200 hover:border-sanskrit-400 hover:shadow-md transition-all group"
      >
        <div className="flex items-baseline justify-between">
          <DevanagariText 
            as="span" 
            size="lg" 
            weight="semibold"
            className="text-gray-900 group-hover:text-sanskrit-600 transition-colors"
          >
            {entry.headword}
          </DevanagariText>
          <IASTText size="xs" className="ml-2">
            {entry.headwordIAST}
          </IASTText>
        </div>
      </Link>
    );
  }
  
  return (
    <Link
      href={`/entry/${entry.headwordSlug}`}
      className="entry-card group"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-baseline space-x-3">
            <DevanagariText 
              as="h3" 
              size="2xl" 
              weight="bold"
              className="text-gray-900 group-hover:text-sanskrit-600 transition-colors"
            >
              {entry.headword}
            </DevanagariText>
            {showLetter && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-sanskrit-100 text-sanskrit-800 font-devanagari">
                {entry.letter}
              </span>
            )}
          </div>
          <IASTText size="base" className="mt-1 block">
            {entry.headwordIAST}
          </IASTText>
        </div>
      </div>
      
      {/* Grammatical info */}
      {entry.grammaticalInfo && (
        <div className="mb-3">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 font-devanagari">
            {entry.grammaticalInfo}
          </span>
        </div>
      )}
      
      {/* First definition preview */}
      {firstDefinition && (
        <div className="mb-3">
          <DevanagariText 
            as="p" 
            size="base" 
            className="text-gray-700 line-clamp-2"
          >
            {firstDefinition.text}
          </DevanagariText>
          {entry.definitions.length > 1 && (
            <p className="text-sm text-gray-500 mt-1">
              +{entry.definitions.length - 1} more {entry.definitions.length === 2 ? 'definition' : 'definitions'}
            </p>
          )}
        </div>
      )}
      
      {/* Metadata */}
      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center space-x-4">
          {entry.references.length > 0 && (
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              {entry.references.length}
            </span>
          )}
          {entry.crossReferences.length > 0 && (
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              {entry.crossReferences.length}
            </span>
          )}
        </div>
        
        <div className="flex items-center text-sanskrit-600 group-hover:text-sanskrit-700">
          <span className="text-xs font-medium">View</span>
          <svg className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  );
}
