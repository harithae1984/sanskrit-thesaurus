// lib/constants.ts

import { ReferenceType } from '@/types/entry';

// Sanskrit alphabet in traditional order
export const SANSKRIT_ALPHABET = {
  vowels: [
    'अ', 'आ', 'इ', 'ई', 'उ', 'ऊ', 'ऋ', 'ॠ', 'ऌ', 'ॡ',
    'ए', 'ऐ', 'ओ', 'औ'
  ],
  consonants: [
    // Velars
    'क', 'ख', 'ग', 'घ', 'ङ',
    // Palatals
    'च', 'छ', 'ज', 'झ', 'ञ',
    // Retroflex
    'ट', 'ठ', 'ड', 'ढ', 'ण',
    // Dentals
    'त', 'थ', 'द', 'ध', 'न',
    // Labials
    'प', 'फ', 'ब', 'भ', 'म',
    // Semivowels
    'य', 'र', 'ल', 'व',
    // Sibilants and aspirate
    'श', 'ष', 'स', 'ह'
  ]
};

export const ALL_LETTERS = [
  ...SANSKRIT_ALPHABET.vowels,
  ...SANSKRIT_ALPHABET.consonants
];

// Reference type mappings
export const REFERENCE_TYPE_LABELS: Record<ReferenceType, string> = {
  panini: 'पाणिनिसूत्रम्',
  brahma_sutra: 'ब्रह्मसूत्रम्',
  upanishad: 'उपनिषत्',
  purana: 'पुराणम्',
  other: 'अन्य'
};

export const REFERENCE_TYPE_LABELS_ENGLISH: Record<ReferenceType, string> = {
  panini: 'Panini Sutra',
  brahma_sutra: 'Brahma Sutra',
  upanishad: 'Upanishad',
  purana: 'Purana',
  other: 'Other'
};

// Common Upanishads for reference parsing
export const UPANISHAD_NAMES = [
  'ईशोपनिषत्', 'केनोपनिषत्', 'कठोपनिषत्', 'प्रश्नोपनिषत्',
  'मुण्डकोपनिषत्', 'माण्डूक्योपनिषत्', 'तैत्तिरीयोपनिषत्',
  'ऐतरेयोपनिषत्', 'छान्दोग्योपनिषत्', 'बृहदारण्यकोपनिषत्',
  'श्वेताश्वतरोपनिषत्', 'कौषीतक्युपनिषत्', 'मैत्रायण्युपनिषत्'
];

// Common Puranas
export const PURANA_NAMES = [
  'विष्णुपुराणम्', 'भागवतपुराणम्', 'गरुडपुराणम्', 'पद्मपुराणम्',
  'ब्रह्मपुराणम्', 'शिवपुराणम्', 'मार्कण्डेयपुराणम्'
];

// Site metadata
export const SITE_CONFIG = {
  title: 'विशिष्टाद्वैतकोशः | Vishishtadvaita Kosha',
  description: 'A Sanskrit thesaurus of Vishishtadvaita philosophy with Devanagari, IAST transliteration, and English translations',
  author: 'Vishishtadvaita Kosha Project',
  url: 'https://vishishtadvaita-kosha.vercel.app', // Update after deployment
};
