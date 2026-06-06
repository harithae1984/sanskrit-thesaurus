// components/layout/Header.tsx

import Link from 'next/link';
import { SITE_CONFIG } from '@/lib/constants';

export default function Header() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Title */}
          <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <div className="flex flex-col">
              <span className="font-devanagari text-2xl font-bold text-sanskrit-700 leading-tight">
                विशिष्टाद्वैतकोशः
              </span>
              <span className="text-sm text-gray-600 font-medium">
                Vishishtadvaita Kosha
              </span>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              href="/" 
              className="text-gray-700 hover:text-sanskrit-600 font-medium transition-colors"
            >
              Home
            </Link>
            <Link 
              href="/browse" 
              className="text-gray-700 hover:text-sanskrit-600 font-medium transition-colors"
            >
              Browse
            </Link>
            <Link 
              href="/about" 
              className="text-gray-700 hover:text-sanskrit-600 font-medium transition-colors"
            >
              About
            </Link>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              className="text-gray-700 hover:text-sanskrit-600 p-2"
              aria-label="Open menu"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile navigation (hidden by default, would need JS to toggle) */}
      <div className="md:hidden border-t border-gray-200 hidden">
        <div className="px-4 py-3 space-y-1">
          <Link 
            href="/" 
            className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
          >
            Home
          </Link>
          <Link 
            href="/browse" 
            className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
          >
            Browse
          </Link>
          <Link 
            href="/about" 
            className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
          >
            About
          </Link>
        </div>
      </div>
    </header>
  );
}
