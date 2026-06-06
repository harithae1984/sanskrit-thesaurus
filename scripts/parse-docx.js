// scripts/parse-docx.js
// Parse Word document containing Sanskrit thesaurus entries
// JavaScript version for direct Node.js execution

const mammoth = require('mammoth');
const fs = require('fs');
const path = require('path');

// Improved IAST transliteration
const devanagariToIAST = {
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
  'ळ': 'ḷa',
  
  // Diacritics
  'ः': 'ḥ', 'ं': 'ṃ', 'ँ': '~',
  
  // Vowel signs (matras)
  'ा': 'ā', 'ि': 'i', 'ी': 'ī', 'ु': 'u', 'ू': 'ū',
  'ृ': 'ṛ', 'ॄ': 'ṝ', 'ॢ': 'ḷ', 'ॣ': 'ḹ',
  'े': 'e', 'ै': 'ai', 'ो': 'o', 'ौ': 'au',
  
  // Virama - handled specially
  '्': '',
  
  // Punctuation
  '।': '.', '॥': '..', ' ': ' ', ',': ',', '.': '.',
};

function toIAST(devanagari) {
  if (!devanagari) return '';
  
  let result = '';
  let i = 0;
  
  while (i < devanagari.length) {
    const char = devanagari[i];
    
    // Handle virama - removes 'a' from previous consonant
    if (char === '्') {
      if (result.endsWith('a')) {
        result = result.slice(0, -1);
      }
      i++;
      continue;
    }
    
    // Handle vowel signs - replace the 'a' in previous consonant
    if ('ािीुूृॄॢॣेैोौ'.includes(char)) {
      if (result.endsWith('a')) {
        result = result.slice(0, -1);
      }
      result += devanagariToIAST[char] || char;
      i++;
      continue;
    }
    
    // Regular character
    if (devanagariToIAST[char]) {
      result += devanagariToIAST[char];
    } else {
      result += char;
    }
    
    i++;
  }
  
  return result;
}

function generateSlug(headword) {
  const iast = toIAST(headword);
  return iast
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-+/g, '-');
}

function generateLetterSlug(letter) {
  const iast = toIAST(letter);
  return iast.toLowerCase().replace(/[^a-z]/g, '');
}

function mapReferenceType(sanskritType) {
  const typeMap = {
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

async function parseWordDocument(filePath) {
  console.log(`Parsing Word document: ${filePath}`);
  
  const result = await mammoth.convertToHtml({ path: filePath });
  const html = result.value;
  
  if (result.messages.length > 0) {
    console.log('Conversion messages:', result.messages);
  }
  
  // Split by headword pattern: Devanagari word followed by " - " or "ः -"
  const entryPattern = /([ऀ-ॿ]+ः?)\s*-\s*([\s\S]*?)(?=(?:[ऀ-ॿ]+ः?\s*-)|$)/g;
  
  const entries = [];
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

function parseEntry(raw) {
  const { headword, rawText } = raw;
  
  // Extract definitions: "1. text । 2. text ।"
  const definitionPattern = /(\d+)\.\s*([^।]+।)/g;
  const definitions = [];
  let defMatch;
  
  while ((defMatch = definitionPattern.exec(rawText)) !== null) {
    const defText = defMatch[2].trim();
    definitions.push({
      number: parseInt(defMatch[1]),
      text: defText,
      textIAST: toIAST(defText),
    });
  }
  
  // Extract references
  const refPattern = /(?:\[)?(पाणिनिसूत्रम्|ब्रह्मसूत्रम्|उपनिषत्|पुराणम्|पाणिनि|ब्रह्मसूत्र|उपनिषद्|पुराण)\s*([^\]\n।]+)(?:\])?/g;
  const references = [];
  let refMatch;
  
  while ((refMatch = refPattern.exec(rawText)) !== null) {
    references.push({
      type: mapReferenceType(refMatch[1]),
      citation: refMatch[2].trim(),
    });
  }
  
  // Extract cross-references
  const crossRefPattern = /(?:see|cf\.|द्रष्टव्यम्|पश्य)\s+([ऀ-ॿ]+)/gi;
  const crossReferences = [];
  let crossMatch;
  
  while ((crossMatch = crossRefPattern.exec(rawText)) !== null) {
    const targetHeadword = crossMatch[1].trim();
    crossReferences.push({
      targetHeadword,
      targetSlug: generateSlug(targetHeadword),
      type: 'see_also',
    });
  }
  
  // Extract grammatical info
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
    console.error('Usage: node scripts/parse-docx.js <path-to-docx> [output-path]');
    console.error('Example: node scripts/parse-docx.js "C:/Users/harithae/Downloads/Thesaurus (1).docx"');
    process.exit(1);
  }
  
  const docxPath = args[0];
  const outputPath = args[1] || path.join(__dirname, '../data/entries.json');
  
  try {
    const rawEntries = await parseWordDocument(docxPath);
    const entries = rawEntries.map(parseEntry);
    
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    fs.writeFileSync(outputPath, JSON.stringify(entries, null, 2), 'utf-8');
    
    console.log(`\n✅ Successfully parsed ${entries.length} entries`);
    console.log(`📄 Output written to: ${outputPath}`);
    
    console.log('\n📊 Summary:');
    console.log(`   Total entries: ${entries.length}`);
    
    const letters = new Set(entries.map(e => e.letter));
    console.log(`   Unique letters: ${letters.size}`);
    
    const totalDefinitions = entries.reduce((sum, e) => sum + e.definitions.length, 0);
    console.log(`   Total definitions: ${totalDefinitions}`);
    
    const totalReferences = entries.reduce((sum, e) => sum + e.references.length, 0);
    console.log(`   Total references: ${totalReferences}`);
    
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

if (require.main === module) {
  main();
}

module.exports = { parseWordDocument, parseEntry };
