// components/search/SearchBar.tsx
// Main search input with Fuse.js integration

'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Fuse from 'fuse.js';
import { KoshaEntry, SearchIndexEntry } from '@/types/entry';
import { createSearchIndex, searchEntries, SearchResult } from '@/lib/search';
import SearchResults from './SearchResults';
import DevanagariText from '@/components/ui/DevanagariText';

interface SearchBarProps {
  entries: KoshaEntry[];
  placeholder?: string;
  autoFocus?: boolean;
  onSearch?: (query: string, results: SearchResult[]) => void;
}

export default function SearchBar({
  entries,
  placeholder = 'Search by Sanskrit, IAST, or meaning...',
  autoFocus = false,
  onSearch,
}: SearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  
  // Create Fuse.js index (memoized)
  const fuse = useMemo(() => {
    return createSearchIndex(entries);
  }, [entries]);
  
  // Debounced search
  useEffect(() => {
    if (!query || query.trim().length === 0) {
      setResults([]);
      setShowResults(false);
      return;
    }
    
    setIsSearching(true);
    
    const timeoutId = setTimeout(() => {
      const searchResults = searchEntries(query, fuse, 20);
      setResults(searchResults);
      setShowResults(true);
      setIsSearching(false);
      onSearch?.(query, searchResults);
    }, 300); // 300ms debounce
    
    return () => clearTimeout(timeoutId);
  }, [query, fuse, onSearch]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      // Navigate to search results page or update URL
      const params = new URLSearchParams();
      params.set('q', query.trim());
      router.push(`/?${params.toString()}`);
      setShowResults(false);
    }
  };
  
  const handleResultClick = (slug: string) => {
    setShowResults(false);
    router.push(`/entry/${slug}`);
  };
  
  const handleClear = () => {
    setQuery('');
    setResults([]);
    setShowResults(false);
  };
  
  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            placeholder={placeholder}
            autoFocus={autoFocus}
            className="search-input pr-12"
            aria-label="Search Sanskrit thesaurus"
            aria-autocomplete="list"
            aria-controls="search-results"
            aria-expanded={showResults}
          />
          
          {/* Search icon */}
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            {isSearching ? (
              <svg className="animate-spin h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : (
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            )}
          </div>
          
          {/* Clear button */}
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute inset-y-0 right-10 flex items-center pr-3 text-gray-400 hover:text-gray-600"
              aria-label="Clear search"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        
        {/* Search button (for accessibility, hidden visually but available to screen readers) */}
        <button type="submit" className="sr-only">
          Search
        </button>
      </form>
      
      {/* Results dropdown */}
      {showResults && results.length > 0 && (
        <div 
          id="search-results"
          className="absolute z-50 w-full mt-2 bg-white rounded-lg shadow-lg border border-gray-200 max-h-96 overflow-y-auto"
          role="listbox"
        >
          <SearchResults 
            results={results} 
            onResultClick={handleResultClick}
            query={query}
          />
        </div>
      )}
      
      {/* No results message */}
      {showResults && query && results.length === 0 && !isSearching && (
        <div className="absolute z-50 w-full mt-2 bg-white rounded-lg shadow-lg border border-gray-200 p-4">
          <p className="text-gray-500 text-center">
            No results found for{' '}
            <DevanagariText as="span" size="base" weight="medium" className="text-gray-700">
              &quot;{query}&quot;
            </DevanagariText>
          </p>
          <p className="text-sm text-gray-400 text-center mt-2">
            Try searching by Devanagari, IAST, or English meaning
          </p>
        </div>
      )}
    </div>
  );
}
