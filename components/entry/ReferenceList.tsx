// components/entry/ReferenceList.tsx
// Display scriptural references for an entry

import { Reference } from '@/types/entry';
import { REFERENCE_TYPE_LABELS, REFERENCE_TYPE_LABELS_ENGLISH } from '@/lib/constants';
import DevanagariText from '@/components/ui/DevanagariText';
import IASTText from '@/components/ui/IASTText';

interface ReferenceListProps {
  references: Reference[];
  showIAST?: boolean;
}

export default function ReferenceList({ references, showIAST = false }: ReferenceListProps) {
  if (references.length === 0) {
    return null;
  }
  
  // Group references by type
  const referencesByType = references.reduce((acc, ref) => {
    if (!acc[ref.type]) {
      acc[ref.type] = [];
    }
    acc[ref.type].push(ref);
    return acc;
  }, {} as Record<string, Reference[]>);
  
  return (
    <div className="space-y-6">
      {Object.entries(referencesByType).map(([type, refs]) => (
        <div key={type}>
          <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
            <DevanagariText as="span" size="base" weight="semibold" className="mr-2">
              {REFERENCE_TYPE_LABELS[type as keyof typeof REFERENCE_TYPE_LABELS]}
            </DevanagariText>
            <span className="text-gray-500 font-normal">
              ({REFERENCE_TYPE_LABELS_ENGLISH[type as keyof typeof REFERENCE_TYPE_LABELS_ENGLISH]})
            </span>
          </h4>
          
          <ul className="space-y-2">
            {refs.map((ref, index) => (
              <li key={index} className="flex items-start">
                <span className="flex-shrink-0 w-2 h-2 mt-2 mr-3 bg-sanskrit-400 rounded-full" />
                <div className="flex-1">
                  <DevanagariText as="span" size="base" className="text-gray-900">
                    {ref.citation}
                  </DevanagariText>
                  
                  {ref.text && (
                    <div className="mt-2 p-3 bg-gray-50 rounded border-l-4 border-gray-300">
                      <DevanagariText as="p" size="base" className="text-gray-800">
                        {ref.text}
                      </DevanagariText>
                      {showIAST && ref.textIAST && (
                        <IASTText size="sm" className="mt-1 block">
                          {ref.textIAST}
                        </IASTText>
                      )}
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
