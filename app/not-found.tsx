// app/not-found.tsx
// 404 Not Found page

import Link from 'next/link';
import DevanagariText from '@/components/ui/DevanagariText';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <DevanagariText as="h1" size="3xl" weight="bold" className="text-sanskrit-600 mb-4">
            न लभ्यते
          </DevanagariText>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Page Not Found
          </h2>
          <p className="text-gray-600 mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="space-y-4">
            <Link
              href="/"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sanskrit-600 hover:bg-sanskrit-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sanskrit-500 transition-colors"
            >
              Go to Homepage
            </Link>
            
            <Link
              href="/browse"
              className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sanskrit-500 transition-colors"
            >
              Browse Entries
            </Link>
          </div>
          
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or try searching</span>
              </div>
            </div>
            
            <div className="mt-6">
              <p className="text-sm text-gray-600 text-center">
                Use the search bar at the top of the page to find Sanskrit terms by 
                Devanagari, IAST transliteration, or English meaning.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
