// components/entry/CrossReferenceLinks.tsx
// Display cross-references to related entries

import Link from 'next/link';
import { CrossRef } from '@/types/entry';
import DevanagariText from '@/components/ui/DevanagariText';

interface CrossReferenceLinksProps {
  crossReferences: CrossRef[];
}

export default function CrossReferenceLinks({ crossReferences }: CrossReferenceLinksProps) {
  if (crossReferences.length === 0) {
    return null;
  }
  
  // Group by type
  const groupedByType = crossReferences.reduce((acc, ref) => {
    if (!acc[ref.type]) {
      acc[ref.type] = [];
    }
    acc[ref.type].push(ref);
    return acc;
  }, {} as Record<string, CrossRef[]>);
  
  const typeLabels: Record<string, { sanskrit: string; english: string }> = {
    see_also: { sanskrit: 'द्रष्टव्यम्', english: 'See also' },
    synonym: { sanskrit: 'पर्यायः', english: 'Synonyms' },
    antonym: { sanskrit: 'विपरीतम्', english: 'Antonyms' },
    related: { sanskrit: 'सम्बद्धम्', english: 'Related terms' },
  };
  
  return (
    <div className="space-y-4">
      {Object.entries(groupedByType).map(([type, refs]) => {
        const label = typeLabels[type] || { sanskrit: type, english: type };
        
        return (
          <div key={type}>
            <h4 className="text-sm font-semibold text-gray-700 mb-3">
              <DevanagariText as="span" size="base" className="mr-2">
                {label.sanskrit}
              </DevanagariText>
              <span className="text-gray-500 font-normal">({label.english})</span>
            </h4>
            
            <div className="flex flex-wrap gap-2">
              {refs.map((ref, index) => (
                <Link
                  key={index}
                  href={`/entry/${ref.targetSlug}`}
                  className="inline-flex items-center px-3 py-1.5 bg-white border border-sanskrit-200 rounded-md text-sm font-medium text-sanskrit-700 hover:bg-sanskrit-50 hover:border-sanskrit-300 transition-colors group"
                >
                  <DevanagariText as="span" size="base" className="group-hover:text-sanskrit-800">
                    {ref.targetHeadword}
                  </DevanagariText>
                  <svg className="ml-1.5 h-3 w-3 text-sanskrit-400 group-hover:text-sanskrit-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </Link>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
