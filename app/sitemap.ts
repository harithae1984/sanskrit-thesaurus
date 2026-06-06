// app/sitemap.ts
// Generate sitemap for SEO

import { MetadataRoute } from 'next';
import { getAllEntries, getAllLetters } from '@/lib/data';
import { SITE_CONFIG } from '@/lib/constants';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SITE_CONFIG.url;
  
  // Get all entries and letters
  const [entries, letters] = await Promise.all([
    getAllEntries(),
    getAllLetters(),
  ]);
  
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/browse`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ];
  
  // Letter pages
  const letterPages: MetadataRoute.Sitemap = letters.map(letter => ({
    url: `${baseUrl}/browse/${encodeURIComponent(letter)}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.6,
  }));
  
  // Entry pages
  const entryPages: MetadataRoute.Sitemap = entries.map(entry => ({
    url: `${baseUrl}/entry/${entry.headwordSlug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));
  
  return [...staticPages, ...letterPages, ...entryPages];
}
