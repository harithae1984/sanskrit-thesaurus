// app/entry/[slug]/page.tsx
// Entry detail page with static generation

import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getEntryBySlug, getAllEntries, getAdjacentEntries } from '@/lib/data';
import EntryDetail from '@/components/entry/EntryDetail';
import { SITE_CONFIG } from '@/lib/constants';

interface EntryPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const entries = await getAllEntries();
  return entries.map(entry => ({
    slug: entry.headwordSlug,
  }));
}

export async function generateMetadata({ params }: EntryPageProps): Promise<Metadata> {
  const entry = await getEntryBySlug(params.slug);
  
  if (!entry) {
    return {
      title: 'Entry Not Found',
    };
  }
  
  const firstDefinition = entry.definitions[0]?.text || '';
  const description = `${entry.headword} (${entry.headwordIAST}) - ${firstDefinition.substring(0, 150)}...`;
  
  return {
    title: `${entry.headword} (${entry.headwordIAST})`,
    description,
    openGraph: {
      title: `${entry.headword} | ${SITE_CONFIG.title}`,
      description,
      type: 'article',
    },
    twitter: {
      card: 'summary',
      title: `${entry.headword} (${entry.headwordIAST})`,
      description,
    },
  };
}

export default async function EntryPage({ params }: EntryPageProps) {
  const entry = await getEntryBySlug(params.slug);
  
  if (!entry) {
    notFound();
  }
  
  const { prev, next } = await getAdjacentEntries(params.slug);
  
  // Generate JSON-LD structured data for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    name: entry.headword,
    alternateName: entry.headwordIAST,
    description: entry.definitions.map(d => d.text).join(' '),
    inDefinedTermSet: {
      '@type': 'DefinedTermSet',
      name: SITE_CONFIG.title,
      description: SITE_CONFIG.description,
    },
  };
  
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <EntryDetail entry={entry} prevEntry={prev} nextEntry={next} />
    </>
  );
}
