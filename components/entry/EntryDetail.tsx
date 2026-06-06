// components/entry/EntryDetail.tsx
// Full entry detail page component

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { KoshaEntry } from '@/types/entry';
import DevanagariText from '@/components/ui/DevanagariText';
import IASTText from '@/components/ui/IASTText';
import TransliterationToggle from '@/components/ui/TransliterationToggle';
import DefinitionList from './DefinitionList';
import ReferenceList from './ReferenceList';
import CrossReferenceLinks from './CrossReferenceLinks';

interface EntryDetailProps {
  entry: KoshaEntry;
  prevEntry?: KoshaEntry | null;
  nextEntry?: KoshaEntry | null;
}

export default function EntryDetail({ entry, prevEntry, nextEntry }: EntryDetailProps) {
  const [showIAST, setShowIAST] = useState(false);
  
  const handleCopyLink = async () => {
    const url = `${window.location.origin}/entry/${entry.headwordSlug}`;
    await navigator.clipboard.writeText(url);
    // Could add a toast notification here
  };
  
  const handleCopyCitation = async () => {
    const citation = `${entry.headword} (${entry.headwordIAST}). Vishishtadvaita Kosha.`;
    await navigator.clipboard.writeText(citation);
    // Could add a toast notification here
  };
  
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-sm text-gray-500">
            <li>
              <Link href="/" className="hover:text-sanskrit-600">
                Home
              </Link>
            </li>
            <li>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </li>
            <li>
              <Link href="/browse" className="hover:text-sanskrit-600">
                Browse
              </Link>
            </li>
            <li>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </li>
            <li>
              <Link 
                href={`/browse/${encodeURIComponent(entry.letter)}`} 
                className="hover:text-sanskrit-600 font-devanagari"
              >
                {entry.letter}
              </Link>
            </li>
            <li>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </li>
            <li className="text-gray-900 font-medium font-devanagari">
              {entry.headword}
            </li>
          </ol>
        </nav>
        
        {/* Main Entry Card */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-sanskrit-50 to-sanskrit-100 px-8 py-10 border-b border-sanskrit-200">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <DevanagariText as="h1" size="3xl" weight="bold" className="text-gray-900 mb-3">
                  {entry.headword}
                </DevanagariText>
                <IASTText size="lg" className="block mb-4">
                  {entry.headwordIAST}
                </IASTText>
                
                {entry.grammaticalInfo && (
                  <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white text-sanskrit-700 border border-sanskrit-200">
                    <DevanagariText as="span" size="base">
                      {entry.grammaticalInfo}
                    </DevanagariText>
                  </div>
                )}
              </div>
              
              {/* Actions */}
              <div className="flex items-center space-x-2 ml-4">
                <TransliterationToggle 
                  onToggle={setShowIAST}
                  className="bg-white"
                />
                <button
                  onClick={handleCopyLink}
                  className="p-2 text-gray-600 hover:text-sanskrit-600 hover:bg-white rounded-md transition-colors"
                  title="Copy link"
                  aria-label="Copy link to this entry"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          
          {/* Content */}
          <div className="px-8 py-8 space-y-10">
            {/* Definitions */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="font-devanagari mr-2">अर्थाः</span>
                <span className="text-gray-500 font-normal text-base">(Definitions)</span>
              </h2>
              <DefinitionList definitions={entry.definitions} showIAST={showIAST} />
            </section>
            
            {/* References */}
            {entry.references.length > 0 && (
              <section className="pt-8 border-t border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <span className="font-devanagari mr-2">प्रमाणानि</span>
                  <span className="text-gray-500 font-normal text-base">(References)</span>
                </h2>
                <ReferenceList references={entry.references} showIAST={showIAST} />
              </section>
            )}
            
            {/* Cross References */}
            {entry.crossReferences.length > 0 && (
              <section className="pt-8 border-t border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <span className="font-devanagari mr-2">सम्बद्धाः</span>
                  <span className="text-gray-500 font-normal text-base">(Related Terms)</span>
                </h2>
                <CrossReferenceLinks crossReferences={entry.crossReferences} />
              </section>
            )}
          </div>
        </div>
        
        {/* Navigation */}
        <div className="mt-8 flex justify-between items-center">
          {prevEntry ? (
            <Link
              href={`/entry/${prevEntry.headwordSlug}`}
              className="group flex items-center px-4 py-3 bg-white rounded-lg shadow-sm border border-gray-200 hover:border-sanskrit-300 hover:shadow-md transition-all"
            >
              <svg className="w-5 h-5 mr-3 text-gray-400 group-hover:text-sanskrit-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <div className="text-left">
                <div className="text-xs text-gray-500">Previous</div>
                <DevanagariText as="div" size="base" weight="medium" className="text-gray-900 group-hover:text-sanskrit-600">
                  {prevEntry.headword}
                </DevanagariText>
              </div>
            </Link>
          ) : (
            <div />
          )}
          
          {nextEntry ? (
            <Link
              href={`/entry/${nextEntry.headwordSlug}`}
              className="group flex items-center px-4 py-3 bg-white rounded-lg shadow-sm border border-gray-200 hover:border-sanskrit-300 hover:shadow-md transition-all"
            >
              <div className="text-right">
                <div className="text-xs text-gray-500">Next</div>
                <DevanagariText as="div" size="base" weight="medium" className="text-gray-900 group-hover:text-sanskrit-600">
                  {nextEntry.headword}
                </DevanagariText>
              </div>
              <svg className="w-5 h-5 ml-3 text-gray-400 group-hover:text-sanskrit-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ) : (
            <div />
          )}
        </div>
        
        {/* Citation */}
        <div className="mt-8 p-4 bg-gray-100 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              <span className="font-medium">Cite this entry:</span>{' '}
              <span className="font-devanagari">{entry.headword}</span>{' '}
              ({entry.headwordIAST}). Vishishtadvaita Kosha.
            </div>
            <button
              onClick={handleCopyCitation}
              className="text-sm text-sanskrit-600 hover:text-sanskrit-700 font-medium"
            >
              Copy citation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
