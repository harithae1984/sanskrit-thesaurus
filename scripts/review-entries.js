// scripts/review-entries.js
// Generate a human-readable review file for manual verification of parsed entries

const fs = require('fs');
const path = require('path');

function generateMarkdownReview(entries) {
  let markdown = `# Vishishtadvaita Kosha - Entry Review\n\n`;
  markdown += `Total entries: ${entries.length}\n\n`;
  markdown += `Generated on: ${new Date().toISOString()}\n\n`;
  markdown += `---\n\n`;
  
  entries.forEach((entry, index) => {
    markdown += `## ${index + 1}. ${entry.headword} (${entry.headwordIAST})\n\n`;
    markdown += `**Slug:** \`${entry.headwordSlug}\`  \n`;
    markdown += `**Letter:** ${entry.letter} (${entry.letterSlug})  \n`;
    
    if (entry.grammaticalInfo) {
      markdown += `**Grammar:** ${entry.grammaticalInfo}  \n`;
    }
    
    markdown += `\n### Definitions\n\n`;
    
    if (entry.definitions.length === 0) {
      markdown += `*No definitions found*\n\n`;
    } else {
      entry.definitions.forEach(def => {
        markdown += `${def.number}. ${def.text}\n\n`;
        markdown += `   *IAST:* ${def.textIAST}\n\n`;
        if (def.translation) {
          markdown += `   *Translation:* ${def.translation}\n\n`;
        }
        if (def.explanation) {
          markdown += `   *Explanation:* ${def.explanation}\n\n`;
        }
      });
    }
    
    if (entry.references.length > 0) {
      markdown += `### References\n\n`;
      entry.references.forEach(ref => {
        markdown += `- **${ref.type}:** ${ref.citation}\n`;
        if (ref.text) {
          markdown += `  - Text: ${ref.text}\n`;
        }
        if (ref.textIAST) {
          markdown += `  - IAST: ${ref.textIAST}\n`;
        }
      });
      markdown += `\n`;
    }
    
    if (entry.crossReferences.length > 0) {
      markdown += `### Cross References\n\n`;
      entry.crossReferences.forEach(crossRef => {
        markdown += `- ${crossRef.targetHeadword} (${crossRef.type}) → \`${crossRef.targetSlug}\`\n`;
      });
      markdown += `\n`;
    }
    
    markdown += `---\n\n`;
  });
  
  return markdown;
}

function generateTSVReview(entries) {
  const headers = [
    'ID',
    'Headword',
    'Headword IAST',
    'Slug',
    'Letter',
    'Grammar',
    'Num Definitions',
    'Num References',
    'Num CrossRefs'
  ];
  
  let tsv = headers.join('\t') + '\n';
  
  entries.forEach(entry => {
    const row = [
      entry.id,
      entry.headword,
      entry.headwordIAST,
      entry.headwordSlug,
      entry.letter,
      entry.grammaticalInfo || '',
      entry.definitions.length.toString(),
      entry.references.length.toString(),
      entry.crossReferences.length.toString()
    ];
    tsv += row.join('\t') + '\n';
  });
  
  return tsv;
}

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length < 1) {
    console.error('Usage: node scripts/review-entries.js <path-to-entries-json> [output-dir]');
    console.error('Example: node scripts/review-entries.js data/entries.json');
    process.exit(1);
  }
  
  const entriesPath = args[0];
  const outputDir = args[1] || path.dirname(entriesPath);
  
  try {
    const entriesData = fs.readFileSync(entriesPath, 'utf-8');
    const entries = JSON.parse(entriesData);
    
    console.log(`Reviewing ${entries.length} entries...`);
    
    const markdown = generateMarkdownReview(entries);
    const markdownPath = path.join(outputDir, 'entries-review.md');
    fs.writeFileSync(markdownPath, markdown, 'utf-8');
    console.log(`✅ Markdown review written to: ${markdownPath}`);
    
    const tsv = generateTSVReview(entries);
    const tsvPath = path.join(outputDir, 'entries-summary.tsv');
    fs.writeFileSync(tsvPath, tsv, 'utf-8');
    console.log(`✅ TSV summary written to: ${tsvPath}`);
    
    console.log('\n📊 Statistics:');
    console.log(`   Total entries: ${entries.length}`);
    
    const entriesWithDefinitions = entries.filter(e => e.definitions.length > 0).length;
    console.log(`   Entries with definitions: ${entriesWithDefinitions}`);
    
    const entriesWithReferences = entries.filter(e => e.references.length > 0).length;
    console.log(`   Entries with references: ${entriesWithReferences}`);
    
    const entriesWithCrossRefs = entries.filter(e => e.crossReferences.length > 0).length;
    console.log(`   Entries with cross-refs: ${entriesWithCrossRefs}`);
    
    const entriesWithGrammar = entries.filter(e => e.grammaticalInfo).length;
    console.log(`   Entries with grammar info: ${entriesWithGrammar}`);
    
    const letterCounts = new Map();
    entries.forEach(e => {
      letterCounts.set(e.letter, (letterCounts.get(e.letter) || 0) + 1);
    });
    
    console.log('\n📝 Entries by letter:');
    Array.from(letterCounts.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .forEach(([letter, count]) => {
        console.log(`   ${letter}: ${count}`);
      });
    
  } catch (error) {
    console.error('❌ Error generating review:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { generateMarkdownReview, generateTSVReview };
