// types/entry.ts

export interface KoshaEntry {
  id: string;                    // Unique ID (e.g., "amsha")
  headword: string;              // Devanagari: "अंशः"
  headwordIAST: string;          // IAST: "aṃśaḥ"
  headwordSlug: string;          // URL slug: "amsha"
  grammaticalInfo?: string;      // Vyakarana: "पुंल्लिङ्गः" etc.
  
  definitions: Definition[];     // Numbered senses
  references: Reference[];       // Scriptural citations
  crossReferences: CrossRef[];   // Links to other entries
  
  // Metadata
  letter: string;                // First letter: "अ"
  letterSlug: string;            // "a"
}

export interface Definition {
  number: number;                // 1, 2, 3...
  text: string;                  // Devanagari definition
  textIAST: string;              // IAST transliteration
  translation?: string;          // English translation (if available)
  explanation?: string;          // Additional philosophical explanation
}

export interface Reference {
  type: ReferenceType;           // Panini, Upanishad, etc.
  citation: string;              // e.g., "1.4.54", "छान्दोग्योपनिषत् 6.3.2"
  text?: string;                 // Quoted Sanskrit text
  textIAST?: string;             // IAST of quoted text
}

export type ReferenceType = 
  | 'panini'           // पाणिनिसूत्रम्
  | 'brahma_sutra'     // ब्रह्मसूत्रम्
  | 'upanishad'        // उपनिषत्
  | 'purana'           // पुराणम्
  | 'other';           // Other scriptural sources

export interface CrossRef {
  targetHeadword: string;        // Devanagari of target entry
  targetSlug: string;            // URL slug of target
  type: 'see_also' | 'antonym' | 'synonym' | 'related';
}

// For search index
export interface SearchIndexEntry {
  id: string;
  headword: string;
  headwordIAST: string;
  headwordSlug: string;
  definitionsText: string;       // Concatenated for search
  letter: string;
}
