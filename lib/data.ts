// lib/data.ts
// Data loading utilities for Kosha entries

import { KoshaEntry, SearchIndexEntry } from '@/types/entry';
import entriesData from '@/data/entries.json';

// Type assertion for imported JSON
const entries = entriesData as KoshaEntry[];

/**
 * Get all entries
 */
export async function getAllEntries(): Promise<KoshaEntry[]> {
  return entries;
}

/**
 * Get entry by slug
 */
export async function getEntryBySlug(slug: string): Promise<KoshaEntry | null> {
  const entry = entries.find(e => e.headwordSlug === slug);
  return entry || null;
}

/**
 * Get entries by letter (Devanagari letter)
 */
export async function getEntriesByLetter(letter: string): Promise<KoshaEntry[]> {
  return entries.filter(e => e.letter === letter);
}

/**
 * Get entries by letter slug (IAST)
 */
export async function getEntriesByLetterSlug(letterSlug: string): Promise<KoshaEntry[]> {
  return entries.filter(e => e.letterSlug === letterSlug);
}

/**
 * Get all unique letters
 */
export async function getAllLetters(): Promise<string[]> {
  const letters = new Set(entries.map(e => e.letter));
  return Array.from(letters).sort();
}

/**
 * Get all letter slugs with counts
 */
export async function getAllLetterSlugs(): Promise<Array<{ letter: string; slug: string; count: number }>> {
  const letterMap = new Map<string, { letter: string; slug: string; count: number }>();
  
  entries.forEach(entry => {
    const existing = letterMap.get(entry.letterSlug);
    if (existing) {
      existing.count++;
    } else {
      letterMap.set(entry.letterSlug, {
        letter: entry.letter,
        slug: entry.letterSlug,
        count: 1
      });
    }
  });
  
  return Array.from(letterMap.values()).sort((a, b) => 
    a.letter.localeCompare(b.letter)
  );
}

/**
 * Get entry count
 */
export async function getEntryCount(): Promise<number> {
  return entries.length;
}

/**
 * Get entries for search index
 */
export async function getSearchIndex(): Promise<SearchIndexEntry[]> {
  return entries.map(entry => ({
    id: entry.id,
    headword: entry.headword,
    headwordIAST: entry.headwordIAST,
    headwordSlug: entry.headwordSlug,
    definitionsText: entry.definitions.map(d => d.text).join(' '),
    letter: entry.letter,
  }));
}

/**
 * Get previous and next entries (alphabetical order)
 */
export async function getAdjacentEntries(slug: string): Promise<{
  prev: KoshaEntry | null;
  next: KoshaEntry | null;
}> {
  const sortedEntries = [...entries].sort((a, b) => 
    a.headword.localeCompare(b.headword)
  );
  
  const currentIndex = sortedEntries.findIndex(e => e.headwordSlug === slug);
  
  if (currentIndex === -1) {
    return { prev: null, next: null };
  }
  
  return {
    prev: currentIndex > 0 ? sortedEntries[currentIndex - 1] : null,
    next: currentIndex < sortedEntries.length - 1 ? sortedEntries[currentIndex + 1] : null,
  };
}

/**
 * Search entries by headword (exact match)
 */
export async function searchByHeadword(query: string): Promise<KoshaEntry[]> {
  const normalizedQuery = query.trim().toLowerCase();
  return entries.filter(entry => 
    entry.headword.toLowerCase().includes(normalizedQuery) ||
    entry.headwordIAST.toLowerCase().includes(normalizedQuery) ||
    entry.headwordSlug.toLowerCase().includes(normalizedQuery)
  );
}

/**
 * Get random entries (for homepage featured section)
 */
export async function getRandomEntries(count: number = 5): Promise<KoshaEntry[]> {
  const shuffled = [...entries].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
