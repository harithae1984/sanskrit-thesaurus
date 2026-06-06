// app/browse/page.tsx
// Browse index page - list all letters with entry counts

import Link from 'next/link';
import { getAllLetterSlugs, getAllEntries } from '@/lib/data';
import AlphabetNav from '@/components/browse/AlphabetNav';
import { LetterSectionCompact } from '@/components/browse/LetterSection';
import DevanagariText from '@/components/ui/DevanagariText';

export const metadata = {
  title: 'Browse by Letter',
  description: 'Browse Vishishtadvaita Kosha entries organized by Sanskrit alphabet',
};

export default async function BrowsePage() {
  const [letterSlugs, entries] = await Promise.all([
    getAllLetterSlugs(),
    getAllEntries(),
  ]);
  
  // Create letter counts map
  const letterCounts = new Map(
    letterSlugs.map(ls => [ls.letter, ls.count])
  );
  
  // Group entries by letter
  const entriesByLetter = new Map<string, typeof entries>();
  entries.forEach(entry => {
    const existing = entriesByLetter.get(entry.letter) || [];
    existing.push(entry);
    entriesByLetter.set(entry.letter, existing);
  });
  
  // Sort letters
  const sortedLetters = Array.from(entriesByLetter.keys()).sort();
  
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Browse by Letter
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore {entries.length} Sanskrit entries organized by the traditional 
            Devanagari alphabet. Click on any letter to view all entries starting with that letter.
          </p>
        </div>
        
        {/* Alphabet Navigation */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-12">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Sanskrit Alphabet
          </h2>
          <AlphabetNav 
            letterCounts={letterCounts}
            variant="list"
            showCounts={true}
          />
        </div>
        
        {/* Letter Sections */}
        <div className="space-y-12">
          {sortedLetters.map(letter => {
            const letterEntries = entriesByLetter.get(letter) || [];
            return (
              <LetterSectionCompact
                key={letter}
                letter={letter}
                entries={letterEntries}
              />
            );
          })}
        </div>
        
        {/* Stats */}
        <div className="mt-16 bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="text-3xl font-bold text-sanskrit-600 mb-2">
                {entries.length}
              </div>
              <div className="text-gray-600">Total Entries</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-sanskrit-600 mb-2">
                {letterSlugs.length}
              </div>
              <div className="text-gray-600">Letters Represented</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-sanskrit-600 mb-2">
                {Math.round(entries.reduce((sum, e) => sum + e.definitions.length, 0) / entries.length)}
              </div>
              <div className="text-gray-600">Avg Definitions per Entry</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
