// lib/search.ts
// Fuse.js search configuration for Kosha entries

import Fuse from 'fuse.js';
import { KoshaEntry, SearchIndexEntry } from '@/types/entry';

const fuseOptions: Fuse.IFuseOptions<SearchIndexEntry> = {
  keys: [
    { name: 'headword', weight: 0.5 },
    { name: 'headwordIAST', weight: 0.4 },
    { name: 'definitionsText', weight: 0.1 }
  ],
  threshold: 0.3,  // Fuzzy match tolerance (0.0 = exact, 1.0 = match anything)
  includeScore: true,
  includeMatches: true,
  minMatchCharLength: 1,
  shouldSort: true,
  findAllMatches: false,
  location: 0,
  distance: 100,
  useExtendedSearch: true,
};

let fuseInstance: Fuse<SearchIndexEntry> | null = null;

export function createSearchIndex(entries: KoshaEntry[]): Fuse<SearchIndexEntry> {
  const indexData: SearchIndexEntry[] = entries.map(entry => ({
    id: entry.id,
    headword: entry.headword,
    headwordIAST: entry.headwordIAST,
    headwordSlug: entry.headwordSlug,
    definitionsText: entry.definitions.map(d => d.text).join(' '),
    letter: entry.letter,
  }));
  
  fuseInstance = new Fuse(indexData, fuseOptions);
  return fuseInstance;
}

export function getSearchIndex(): Fuse<SearchIndexEntry> | null {
  return fuseInstance;
}

export interface SearchResult {
  item: SearchIndexEntry;
  score?: number;
  matches?: readonly Fuse.FuseResultMatch[];
}

export function searchEntries(
  query: string,
  fuse: Fuse<SearchIndexEntry>,
  limit: number = 20
): SearchResult[] {
  if (!query || query.trim().length === 0) {
    return [];
  }
  
  const results = fuse.search(query, { limit });
  return results.map(result => ({
    item: result.item,
    score: result.score,
    matches: result.matches,
  }));
}

// Highlight matching text
export function highlightMatches(
  text: string,
  matches?: readonly Fuse.FuseResultMatch[]
): string {
  if (!matches || matches.length === 0) {
    return text;
  }
  
  // Find matches for this specific field
  const relevantMatches = matches.filter(m => 
    m.value && text.includes(m.value)
  );
  
  if (relevantMatches.length === 0) {
    return text;
  }
  
  // For simplicity, just return the text
  // In a real implementation, you'd wrap matched portions in <mark> tags
  return text;
}

// Get search suggestions (for autocomplete)
export function getSearchSuggestions(
  query: string,
  fuse: Fuse<SearchIndexEntry>,
  limit: number = 5
): SearchIndexEntry[] {
  if (!query || query.trim().length < 2) {
    return [];
  }
  
  const results = fuse.search(query, { limit });
  return results.map(r => r.item);
}
