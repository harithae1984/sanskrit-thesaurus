// lib/slugify.ts
// Generate URL-friendly slugs from Devanagari headwords

import { toIAST } from './transliteration';

export function generateSlug(headword: string): string {
  // Convert Devanagari to IAST first
  const iast = toIAST(headword);
  
  // Convert to lowercase and replace spaces/special chars with hyphens
  return iast
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')  // Replace non-alphanumeric with hyphens
    .replace(/^-+|-+$/g, '')       // Remove leading/trailing hyphens
    .replace(/-+/g, '-');          // Collapse multiple hyphens
}

export function generateLetterSlug(letter: string): string {
  // For single Sanskrit letters, use IAST
  const iast = toIAST(letter);
  return iast.toLowerCase().replace(/[^a-z]/g, '');
}

// Reverse: get Devanagari from slug (for display purposes)
export function slugToDisplay(slug: string): string {
  // This is a simple conversion - for accurate Devanagari, 
  // you'd need to store the original headword
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
