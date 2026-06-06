// components/search/SearchResults.tsx
// Display search results list

import Link from 'next/link';
import { SearchResult } from '@/lib/search';
import DevanagariText from '@/components/ui/DevanagariText';
import IASTText from '@/components/ui/IASTText';

interface SearchResultsProps {
  results: SearchResult[];
  onResultClick?: (slug: string) => void;
  query?: string;
}

export default function SearchResults({ results, onResultClick, query }: SearchResultsProps) {
  if (results.length === 0) {
    return null;
  }
  
  const handleClick = (slug: string) => {
    onResultClick?.(slug);
  };
  
  return (
    <ul className="divide-y divide-gray-100" role="listbox">
      {results.map((result, index) => {
        const { item, score } = result;
        
        return (
          <li key={item.id} role="option" aria-selected={false}>
            <Link
              href={`/entry/${item.headwordSlug}`}
              onClick={() => handleClick(item.headwordSlug)}
              className="block px-4 py-3 hover:bg-gray-50 transition-colors focus:bg-gray-50 focus:outline-none"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  {/* Headword */}
                  <div className="flex items-baseline space-x-2">
                    <DevanagariText
                      as="span"
                      size="lg"
                      weight="semibold"
                      className="text-gray-900 truncate"
                    >
                      {item.headword}
                    </DevanagariText>
                    <IASTText size="sm" className="truncate">
                      {item.headwordIAST}
                    </IASTText>
                  </div>
                  
                  {/* Preview of definitions (first 100 chars) */}
                  {item.definitionsText && (
                    <p className="mt-1 text-sm text-gray-600 line-clamp-2 font-devanagari">
                      {item.definitionsText.substring(0, 100)}
                      {item.definitionsText.length > 100 && '...'}
                    </p>
                  )}
                  
                  {/* Letter badge */}
                  <div className="mt-2 flex items-center space-x-2">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-sanskrit-100 text-sanskrit-800 font-devanagari">
                      {item.letter}
                    </span>
                    {score !== undefined && (
                      <span className="text-xs text-gray-400">
                        Relevance: {Math.round((1 - score) * 100)}%
                      </span>
                    )}
                  </div>
                </div>
                
                {/* Arrow icon */}
                <div className="ml-4 flex-shrink-0">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

// Compact version for sidebar or smaller spaces
export function CompactSearchResults({ results, onResultClick }: SearchResultsProps) {
  if (results.length === 0) {
    return null;
  }
  
  return (
    <ul className="space-y-1">
      {results.slice(0, 5).map((result) => (
        <li key={result.item.id}>
          <Link
            href={`/entry/${result.item.headwordSlug}`}
            onClick={() => onResultClick?.(result.item.headwordSlug)}
            className="block px-3 py-2 rounded hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-baseline space-x-2">
              <DevanagariText as="span" size="base" weight="medium">
                {result.item.headword}
              </DevanagariText>
              <IASTText size="xs">
                {result.item.headwordIAST}
              </IASTText>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
