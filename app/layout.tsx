import type { Metadata } from 'next';
import { Noto_Sans_Devanagari, Noto_Serif_Devanagari } from 'next/font/google';
import './globals.css';
import { SITE_CONFIG } from '@/lib/constants';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const notoSansDevanagari = Noto_Sans_Devanagari({
  subsets: ['devanagari'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-noto-sans-devanagari',
  display: 'swap',
});

const notoSerifDevanagari = Noto_Serif_Devanagari({
  subsets: ['devanagari'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-noto-serif-devanagari',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: SITE_CONFIG.title,
    template: `%s | ${SITE_CONFIG.title}`,
  },
  description: SITE_CONFIG.description,
  authors: [{ name: SITE_CONFIG.author }],
  keywords: [
    'Sanskrit',
    'Vishishtadvaita',
    'Kosha',
    'Thesaurus',
    'Devanagari',
    'IAST',
    'Sanskrit Dictionary',
    'Indian Philosophy'
  ],
  openGraph: {
    title: SITE_CONFIG.title,
    description: SITE_CONFIG.description,
    type: 'website',
    locale: 'en_US',
    siteName: SITE_CONFIG.title,
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_CONFIG.title,
    description: SITE_CONFIG.description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html 
      lang="sa" 
      className={`${notoSansDevanagari.variable} ${notoSerifDevanagari.variable}`}
    >
      <head>
        {/* Preconnect to Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Additional font for IAST */}
        <link
          href="https://fonts.googleapis.com/css2?family=Charis+SIL:ital,wght@0,400;0,700;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
