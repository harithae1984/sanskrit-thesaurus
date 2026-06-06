// lib/transliteration.ts
// Devanagari to IAST transliteration
// Uses the sanscript library for accurate transliteration

// For now, use a simple mapping. For production, install and use:
// npm install @indic-transliteration/sanscript
// import * as Sanscript from '@indic-transliteration/sanscript';

const devanagariToIAST: Record<string, string> = {
  // Vowels (independent)
  'अ': 'a', 'आ': 'ā', 'इ': 'i', 'ई': 'ī', 'उ': 'u', 'ऊ': 'ū',
  'ऋ': 'ṛ', 'ॠ': 'ṝ', 'ऌ': 'ḷ', 'ॡ': 'ḹ',
  'ए': 'e', 'ऐ': 'ai', 'ओ': 'o', 'औ': 'au',
  
  // Consonants (with inherent 'a')
  'क': 'ka', 'ख': 'kha', 'ग': 'ga', 'घ': 'gha', 'ङ': 'ṅa',
  'च': 'ca', 'छ': 'cha', 'ज': 'ja', 'झ': 'jha', 'ञ': 'ña',
  'ट': 'ṭa', 'ठ': 'ṭha', 'ड': 'ḍa', 'ढ': 'ḍha', 'ण': 'ṇa',
  'त': 'ta', 'थ': 'tha', 'द': 'da', 'ध': 'dha', 'न': 'na',
  'प': 'pa', 'फ': 'pha', 'ब': 'ba', 'भ': 'bha', 'म': 'ma',
  'य': 'ya', 'र': 'ra', 'ल': 'la', 'व': 'va',
  'श': 'śa', 'ष': 'ṣa', 'स': 'sa', 'ह': 'ha',
  'ळ': 'ḷa', 'क्ष': 'kṣa', 'ज्ञ': 'jña',
  
  // Diacritics
  'ः': 'ḥ', 'ं': 'ṃ', 'ँ': '~', 
  
  // Vowel signs (matras) - replace the 'a' in consonant
  'ा': 'ā', 'ि': 'i', 'ी': 'ī', 'ु': 'u', 'ू': 'ū',
  'ृ': 'ṛ', 'ॄ': 'ṝ', 'ॢ': 'ḷ', 'ॣ': 'ḹ',
  'े': 'e', 'ै': 'ai', 'ो': 'o', 'ौ': 'au',
  
  // Virama - suppresses inherent 'a'
  '्': '',
  
  // Numerals
  '०': '0', '१': '1', '२': '2', '३': '3', '४': '4',
  '५': '5', '६': '6', '७': '7', '८': '8', '९': '9',
  
  // Punctuation
  '।': '.', '॥': '..', ',': ',', ';': ';', ':': ':', 
  ' ': ' ', '-': '-', '(': '(', ')': ')',
};

export function toIAST(devanagari: string): string {
  if (!devanagari) return '';
  
  let result = '';
  let i = 0;
  let previousWasConsonant = false;
  
  while (i < devanagari.length) {
    const char = devanagari[i];
    const nextChar = i + 1 < devanagari.length ? devanagari[i + 1] : null;
    
    // Handle virama - skip it and mark that previous consonant loses its 'a'
    if (char === '्') {
      // Remove the 'a' from the previous consonant if it was added
      if (result.endsWith('a')) {
        result = result.slice(0, -1);
      }
      i++;
      previousWasConsonant = false;
      continue;
    }
    
    // Handle vowel signs (matras) - they modify the previous consonant
    if ('ािीुूृॄॢॣेैोौ'.includes(char)) {
      // Remove the 'a' from previous consonant and add the vowel sign
      if (result.endsWith('a')) {
        result = result.slice(0, -1);
      }
      result += devanagariToIAST[char] || char;
      i++;
      previousWasConsonant = false;
      continue;
    }
    
    // Regular character mapping
    if (devanagariToIAST[char]) {
      result += devanagariToIAST[char];
      // Check if this is a consonant (ends with 'a' in our mapping)
      previousWasConsonant = devanagariToIAST[char].endsWith('a');
    } else {
      // Keep unknown characters as-is
      result += char;
      previousWasConsonant = false;
    }
    
    i++;
  }
  
  // Clean up: remove trailing 'a' if the word ends with virama (should already be handled)
  // Handle visarga and anusvara correctly
  result = result.replace(/aḥ$/g, 'aḥ');
  
  return result;
}

export function fromIAST(iast: string): string {
  // Reverse mapping (IAST to Devanagari) - simplified
  // For production use, consider using sanscript.js library
  const iastToDevanagari: Record<string, string> = {};
  
  // Build reverse mapping
  for (const [deva, iastChar] of Object.entries(devanagariToIAST)) {
    if (!iastToDevanagari[iastChar]) {
      iastToDevanagari[iastChar] = deva;
    }
  }
  
  // Add conjuncts to reverse mapping
  for (const [deva, iastConj] of Object.entries(conjuncts)) {
    iastToDevanagari[iastConj] = deva;
  }
  
  let result = iast;
  // Sort by length (longest first) to match conjuncts before single chars
  const sortedKeys = Object.keys(iastToDevanagari).sort((a, b) => b.length - a.length);
  
  for (const key of sortedKeys) {
    const regex = new RegExp(key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
    result = result.replace(regex, iastToDevanagari[key]);
  }
  
  return result;
}
