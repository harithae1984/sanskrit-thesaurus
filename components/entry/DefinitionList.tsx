// components/entry/DefinitionList.tsx
// Display numbered definitions for an entry

import { Definition } from '@/types/entry';
import DevanagariText from '@/components/ui/DevanagariText';
import IASTText from '@/components/ui/IASTText';

interface DefinitionListProps {
  definitions: Definition[];
  showIAST?: boolean;
}

export default function DefinitionList({ definitions, showIAST = false }: DefinitionListProps) {
  if (definitions.length === 0) {
    return (
      <div className="text-gray-500 italic">
        No definitions available.
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {definitions.map((definition) => (
        <div key={definition.number} className="flex">
          {/* Definition number */}
          <div className="flex-shrink-0 w-8">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-sanskrit-100 text-sanskrit-800 text-sm font-medium">
              {definition.number}
            </span>
          </div>
          
          {/* Definition content */}
          <div className="flex-1 ml-4">
            <DevanagariText 
              as="p" 
              size="lg" 
              className="text-gray-900 leading-relaxed"
            >
              {definition.text}
            </DevanagariText>
            
            {showIAST && (
              <IASTText size="base" className="mt-2 block">
                {definition.textIAST}
              </IASTText>
            )}
            
            {definition.translation && (
              <p className="mt-3 text-gray-600 italic">
                {definition.translation}
              </p>
            )}
            
            {definition.explanation && (
              <div className="mt-3 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Explanation: </span>
                  {definition.explanation}
                </p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
