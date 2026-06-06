// app/page.tsx
// Home page with search and alphabet navigation

import { Suspense } from 'react';
import Link from 'next/link';
import { getAllEntries, getAllLetterSlugs, getEntryCount, getRandomEntries } from '@/lib/data';
import SearchBar from '@/components/search/SearchBar';
import AlphabetNav from '@/components/browse/AlphabetNav';
import DevanagariText from '@/components/ui/DevanagariText';
import { SITE_CONFIG } from '@/lib/constants';

export default async function HomePage() {
  const [entries, letterSlugs, entryCount, featuredEntries] = await Promise.all([
    getAllEntries(),
    getAllLetterSlugs(),
    getEntryCount(),
    getRandomEntries(3),
  ]);
  
  // Create letter counts map for AlphabetNav
  const letterCounts = new Map(
    letterSlugs.map(ls => [ls.letter, ls.count])
  );
  
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-sanskrit-50 to-white py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="font-devanagari text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-4">
              विशिष्टाद्वैतकोशः
            </h1>
            <p className="text-xl sm:text-2xl text-gray-600 mb-2 font-devanagari">
              Vishishtadvaita Kosha
            </p>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-8">
              A comprehensive Sanskrit thesaurus of Vishishtadvaita philosophy. 
              Explore {entryCount} entries with Devanagari script, IAST transliteration, 
              and detailed explanations.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <Suspense fallback={<div className="h-14 bg-gray-200 rounded-lg animate-pulse" />}>
                <SearchBar entries={entries} autoFocus />
              </Suspense>
              <p className="mt-3 text-sm text-gray-500">
                Search by Sanskrit (अंशः), IAST (aṃśaḥ), or English meaning
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Alphabet Navigation */}
      <section className="py-12 bg-white border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Browse by Letter
            </h2>
            <p className="text-gray-600">
              Explore entries organized by Sanskrit alphabet
            </p>
          </div>
          
          <AlphabetNav 
            letterCounts={letterCounts}
            variant="list"
            showCounts={true}
          />
          
          <div className="text-center mt-8">
            <Link
              href="/browse"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-sanskrit-600 hover:bg-sanskrit-700 transition-colors"
            >
              View All Letters
              <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Featured Entries */}
      {featuredEntries.length > 0 && (
        <section className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Featured Entries
              </h2>
              <p className="text-gray-600">
                Discover key terms from Vishishtadvaita philosophy
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredEntries.map((entry) => (
                <Link
                  key={entry.id}
                  href={`/entry/${entry.headwordSlug}`}
                  className="entry-card group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <DevanagariText size="2xl" weight="bold" className="text-gray-900 group-hover:text-sanskrit-600 transition-colors">
                      {entry.headword}
                    </DevanagariText>
                    <span className="text-sm text-gray-500 font-iast">
                      {entry.headwordIAST}
                    </span>
                  </div>
                  
                  {entry.definitions.length > 0 && (
                    <p className="text-gray-600 font-devanagari line-clamp-3">
                      {entry.definitions[0].text}
                    </p>
                  )}
                  
                  <div className="mt-4 flex items-center text-sm text-sanskrit-600 group-hover:text-sanskrit-700">
                    <span>Read more</span>
                    <svg className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
      
      {/* About Section */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            About the Vishishtadvaita Kosha
          </h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            The Vishishtadvaita Kosha is a specialized Sanskrit thesaurus that documents 
            the philosophical terminology of the Vishishtadvaita (qualified non-dualism) 
            tradition founded by Ramanuja. This digital edition makes these scholarly 
            resources accessible to students, researchers, and enthusiasts of Indian philosophy.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/about"
              className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              Learn More
            </Link>
            <Link
              href="/browse"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-sanskrit-600 hover:bg-sanskrit-700 transition-colors"
            >
              Start Browsing
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
