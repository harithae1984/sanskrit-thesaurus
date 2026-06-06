// components/layout/Footer.tsx

import Link from 'next/link';
import { SITE_CONFIG } from '@/lib/constants';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="font-devanagari text-xl font-bold text-white mb-4">
              विशिष्टाद्वैतकोशः
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              A digital Sanskrit thesaurus dedicated to the Vishishtadvaita philosophical tradition. 
              Explore the rich vocabulary of Vedantic thought with Devanagari script, IAST transliteration, 
              and detailed explanations.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-sanskrit-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/browse" className="hover:text-sanskrit-400 transition-colors">
                  Browse by Letter
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-sanskrit-400 transition-colors">
                  About the Project
                </Link>
              </li>
              <li>
                <Link href="/help" className="hover:text-sanskrit-400 transition-colors">
                  How to Use
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-white font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a 
                  href="https://en.wikipedia.org/wiki/Vishishtadvaita" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-sanskrit-400 transition-colors"
                >
                  About Vishishtadvaita
                </a>
              </li>
              <li>
                <a 
                  href="https://en.wikipedia.org/wiki/Devanagari" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-sanskrit-400 transition-colors"
                >
                  Devanagari Script
                </a>
              </li>
              <li>
                <a 
                  href="https://en.wikipedia.org/wiki/International_Alphabet_of_Sanskrit_Transliteration" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-sanskrit-400 transition-colors"
                >
                  IAST Transliteration
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm text-gray-400">
          <p>
            © {currentYear} {SITE_CONFIG.author}. Built with Next.js and Tailwind CSS.
          </p>
          <p className="mt-2">
            Content from the Vishishtadvaita Kosha. For educational and research purposes.
          </p>
        </div>
      </div>
    </footer>
  );
}
