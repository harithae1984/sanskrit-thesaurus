// components/browse/LetterSection.tsx
// Group entries by letter for browse pages

import { KoshaEntry } from '@/types/entry';
import EntryCard from '@/components/entry/EntryCard';
import DevanagariText from '@/components/ui/DevanagariText';

interface LetterSectionProps {
  letter: string;
  entries: KoshaEntry[];
  showLetterHeader?: boolean;
}

export default function LetterSection({ 
  letter, 
  entries,
  showLetterHeader = true 
}: LetterSectionProps) {
  if (entries.length === 0) {
    return null;
  }
  
  // Sort entries alphabetically by headword
  const sortedEntries = [...entries].sort((a, b) => 
    a.headword.localeCompare(b.headword)
  );
  
  return (
    <section className="mb-12">
      {showLetterHeader && (
        <div className="mb-6 pb-4 border-b border-gray-200">
          <div className="flex items-baseline space-x-4">
            <DevanagariText as="h2" size="3xl" weight="bold" className="text-gray-900">
              {letter}
            </DevanagariText>
            <span className="text-lg text-gray-500">
              {entries.length} {entries.length === 1 ? 'entry' : 'entries'}
            </span>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedEntries.map((entry) => (
          <EntryCard key={entry.id} entry={entry} />
        ))}
      </div>
    </section>
  );
}

// Compact version for letter index page
export function LetterSectionCompact({ 
  letter, 
  entries 
}: LetterSectionProps) {
  if (entries.length === 0) {
    return null;
  }
  
  return (
    <div className="mb-8">
      <div className="flex items-baseline space-x-3 mb-4">
        <DevanagariText as="h3" size="2xl" weight="bold" className="text-gray-900">
          {letter}
        </DevanagariText>
        <span className="text-sm text-gray-500">
          ({entries.length})
        </span>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {entries.map((entry) => (
          <EntryCard 
            key={entry.id} 
            entry={entry} 
            variant="compact"
          />
        ))}
      </div>
    </div>
  );
}
