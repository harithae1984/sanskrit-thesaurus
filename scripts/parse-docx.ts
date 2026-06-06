// scripts/parse-docx.ts
// Parse Word document containing Sanskrit thesaurus entries

import * as mammoth from 'mammoth';
import * as fs from 'fs';
import * as path from 'path';
import { KoshaEntry, Definition, Reference, CrossRef, ReferenceType } from '../types/entry';
import { toIAST } from '../lib/transliteration';
import { generateSlug, generateLetterSlug } from '../lib/slugify';

interface RawEntry {
  headword: string;           // "अंशः"
  rawText: string;            // Full entry text
}

async function parseWordDocument(filePath: string): Promise<RawEntry[]> {
  console.log(`Parsing Word document: ${filePath}`);
  
  const result = await mammoth.convertToHtml({ path: filePath });
  const html = result.value;
  
  // Log any conversion messages
  if (result.messages.length > 0) {
    console.log('Conversion messages:', result.messages);
  }
  
  // Split by headword pattern: Devanagari word followed by " - " or "ः -"
  // Example: "अंशः - 1. एकवस्त्वेकदेशः ।"
  const entryPattern = /([ऀ-ॿ]+ः?)\s*-\s*([\s\S]*?)(?=(?:[ऀ-ॿ]+ः?\s*-)|$)/g;
  
  const entries: RawEntry[] = [];
  let match;
  
  while ((match = entryPattern.exec(html)) !== null) {
    entries.push({
      headword: match[1].trim(),
      rawText: match[2].trim()
    });
  }
  
  console.log(`Found ${entries.length} entries`);
  return entries;
}

function mapReferenceType(sanskritType: string): ReferenceType {
  const typeMap: Record<string, ReferenceType> = {
    'पाणिनिसूत्रम्': 'panini',
    'पाणिनि': 'panini',
    'ब्रह्मसूत्रम्': 'brahma_sutra',
    'ब्रह्मसूत्र': 'brahma_sutra',
    'उपनिषत्': 'upanishad',
    'उपनिषद्': 'upanishad',
    'पुराणम्': 'purana',
    'पुराण': 'purana',
  };
  
  return typeMap[sanskritType] || 'other';
}

function parseEntry(raw: RawEntry): KoshaEntry {
  const { headword, rawText } = raw;
  
  // 1. Extract definitions: "1. text । 2. text ।"
  const definitionPattern = /(\d+)\.\s*([^।]+।)/g;
  const definitions: Definition[] = [];
  let defMatch;
  
  while ((defMatch = definitionPattern.exec(rawText)) !== null) {
    const defText = defMatch[2].trim();
    definitions.push({
      number: parseInt(defMatch[1]),
      text: defText,
      textIAST: toIAST(defText),
    });
  }
  
  // 2. Extract references: Look for patterns like "[पाणिनिसूत्रम् 1.4.54]"
  // or "पाणिनिसूत्रम् 1.4.54" without brackets
  const refPattern = /(?:\[)?(पाणिनिसूत्रम्|ब्रह्मसूत्रम्|उपनिषत्|पुराणम्|पाणिनि|ब्रह्मसूत्र|उपनिषद्|पुराण)\s*([^\]\n।]+)(?:\])?/g;
  const references: Reference[] = [];
  let refMatch;
  
  while ((refMatch = refPattern.exec(rawText)) !== null) {
    references.push({
      type: mapReferenceType(refMatch[1]),
      citation: refMatch[2].trim(),
    });
  }
  
  // 3. Extract cross-references: Look for "see X" or "cf. X" patterns
  // This is simplified - may need manual annotation
  const crossRefPattern = /(?:see|cf\.|द्रष्टव्यम्|पश्य)\s+([ऀ-ॿ]+)/gi;
  const crossReferences: CrossRef[] = [];
  let crossMatch;
  
  while ((crossMatch = crossRefPattern.exec(rawText)) !== null) {
    const targetHeadword = crossMatch[1].trim();
    crossReferences.push({
      targetHeadword,
      targetSlug: generateSlug(targetHeadword),
      type: 'see_also',
    });
  }
  
  // 4. Extract grammatical info (if present)
  // Look for patterns like "पुंल्लिङ्गः" (masculine), "स्त्रीलिङ्गः" (feminine), etc.
  const grammarPattern = /(पुंल्लिङ्गः|स्त्रीलिङ्गः|नपुंसकलिङ्गः|विशेषणम्|अव्ययम्|धातुः)/;
  const grammarMatch = rawText.match(grammarPattern);
  const grammaticalInfo = grammarMatch ? grammarMatch[1] : undefined;
  
  const headwordIAST = toIAST(headword);
  const headwordSlug = generateSlug(headword);
  const letter = headword.charAt(0);
  const letterSlug = generateLetterSlug(letter);
  
  return {
    id: headwordSlug,
    headword,
    headwordIAST,
    headwordSlug,
    grammaticalInfo,
    definitions,
    references,
    crossReferences,
    letter,
    letterSlug,
  };
}

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length < 1) {
    console.error('Usage: ts-node scripts/parse-docx.ts <path-to-docx> [output-path]');
    console.error('Example: ts-node scripts/parse-docx.ts "C:/Users/harithae/Downloads/Thesaurus (1).docx"');
    process.exit(1);
  }
  
  const docxPath = args[0];
  const outputPath = args[1] || path.join(__dirname, '../data/entries.json');
  
  try {
    // Parse the Word document
    const rawEntries = await parseWordDocument(docxPath);
    
    // Parse each entry into structured format
    const entries: KoshaEntry[] = rawEntries.map(parseEntry);
    
    // Ensure output directory exists
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // Write to JSON file
    fs.writeFileSync(outputPath, JSON.stringify(entries, null, 2), 'utf-8');
    
    console.log(`\n✅ Successfully parsed ${entries.length} entries`);
    console.log(`📄 Output written to: ${outputPath}`);
    
    // Print summary
    console.log('\n📊 Summary:');
    console.log(`   Total entries: ${entries.length}`);
    
    const letters = new Set(entries.map(e => e.letter));
    console.log(`   Unique letters: ${letters.size}`);
    
    const totalDefinitions = entries.reduce((sum, e) => sum + e.definitions.length, 0);
    console.log(`   Total definitions: ${totalDefinitions}`);
    
    const totalReferences = entries.reduce((sum, e) => sum + e.references.length, 0);
    console.log(`   Total references: ${totalReferences}`);
    
    // Print first few entries for verification
    console.log('\n📝 First 3 entries:');
    entries.slice(0, 3).forEach((entry, i) => {
      console.log(`\n${i + 1}. ${entry.headword} (${entry.headwordIAST})`);
      console.log(`   Slug: ${entry.headwordSlug}`);
      console.log(`   Definitions: ${entry.definitions.length}`);
      console.log(`   References: ${entry.references.length}`);
    });
    
  } catch (error) {
    console.error('❌ Error parsing document:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

export { parseWordDocument, parseEntry };
