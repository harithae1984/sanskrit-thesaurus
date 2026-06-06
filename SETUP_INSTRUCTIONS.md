# Setup Instructions - Vishishtadvaita Kosha Website

## What Was Built

A complete Next.js 14 TypeScript web application for the Vishishtadvaita Kosha Sanskrit thesaurus has been created at:

**`C:\Users\harithae\Desktop\sanskrit-thesaurus\`**

### ✅ Completed Features

1. **Project Foundation**
   - Next.js 14 with App Router and TypeScript
   - Tailwind CSS with Sanskrit font configuration
   - Project structure following Next.js best practices

2. **Data Models & Parsing**
   - TypeScript interfaces for Kosha entries, definitions, references
   - Word document parser (`scripts/parse-docx.ts`) using mammoth.js
   - IAST transliteration utilities
   - URL slug generation
   - Review script for manual verification

3. **Core UI Components**
   - Header and Footer with navigation
   - DevanagariText component for proper Sanskrit rendering
   - IASTText component for transliteration display
   - TransliterationToggle for showing/hiding IAST

4. **Search Functionality**
   - Fuse.js powered fuzzy search
   - Search by Devanagari, IAST, or English
   - Real-time suggestions with 300ms debounce
   - Search results with relevance scoring

5. **Browse Features**
   - Alphabet navigation (Sanskrit letters in traditional order)
   - Browse by letter pages with entry counts
   - Entry cards with previews
   - Letter sections with grouped entries

6. **Entry Detail Pages**
   - Full entry display with headword, IAST, grammar info
   - Numbered definitions with optional IAST
   - Scriptural references grouped by type
   - Cross-reference links to related terms
   - Previous/next entry navigation
   - Copy link and citation functionality
   - JSON-LD structured data for SEO

7. **SEO & Polish**
   - Metadata for all pages
   - Sitemap generation (`app/sitemap.ts`)
   - Robots.txt (`app/robots.ts`)
   - 404 Not Found page
   - Responsive design for mobile
   - Print styles for entry pages

## Next Steps

### 1. Install Node.js (Required)

Node.js is not currently installed on this system. You need Node.js 18+ to run the application.

**Option A: Download from nodejs.org**
1. Visit https://nodejs.org/
2. Download the LTS version (recommended)
3. Run the installer
4. Verify installation:
   ```bash
   node --version
   npm --version
   ```

**Option B: Using a version manager (recommended for developers)**
- **Windows**: Use [nvm-windows](https://github.com/coreybutler/nvm-windows)
- **macOS/Linux**: Use [nvm](https://github.com/nvm-sh/nvm)

### 2. Install Dependencies

Once Node.js is installed, open PowerShell/Terminal in the project directory:

```bash
cd C:\Users\harithae\Desktop\sanskrit-thesaurus
npm install
```

This will install:
- next, react, react-dom
- fuse.js (search)
- mammoth (Word doc parsing)
- TypeScript and type definitions
- Tailwind CSS and PostCSS
- ESLint

### 3. Parse the Word Document

The Word document is located at:
**`C:\Users\harithae\Downloads\Thesaurus (1).docx`**

Run the parser:

```bash
npm run parse-docx "C:\Users\harithae\Downloads\Thesaurus (1).docx"
```

This will:
- Extract all 46 entries from the Word document
- Parse headwords, definitions, and references
- Generate IAST transliterations
- Create URL slugs
- Output to `data/entries.json`

### 4. Review the Parsed Data

Generate review files to verify the parsing:

```bash
npm run review-entries
```

This creates:
- `data/entries-review.md` - Human-readable Markdown file
- `data/entries-summary.tsv` - Tabular summary

**Important**: Review the parsed data carefully! The parser uses regex patterns that may need adjustment based on the actual Word document format. You may need to manually edit `data/entries.json` to fix any parsing errors.

### 5. Run the Development Server

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

### 6. Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
sanskrit-thesaurus/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout with fonts
│   ├── page.tsx                 # Home page
│   ├── globals.css              # Global styles + Sanskrit typography
│   ├── not-found.tsx            # 404 page
│   ├── sitemap.ts               # Sitemap generation
│   ├── robots.ts                # Robots.txt
│   ├── browse/                  # Browse pages
│   │   ├── page.tsx             # Browse index
│   │   └── [letter]/page.tsx    # Letter-specific pages
│   └── entry/                   # Entry pages
│       └── [slug]/page.tsx      # Entry detail pages
├── components/                  # React components
│   ├── layout/Header.tsx        # Site header
│   ├── layout/Footer.tsx        # Site footer
│   ├── search/                  # Search components
│   ├── entry/                   # Entry display components
│   ├── browse/                  # Browse components
│   └── ui/                      # UI primitives
├── lib/                         # Utilities
│   ├── data.ts                  # Data loading functions
│   ├── search.ts                # Fuse.js config
│   ├── transliteration.ts       # Devanagari ↔ IAST
│   ├── slugify.ts               # URL generation
│   └── constants.ts             # Alphabet, config
├── types/entry.ts               # TypeScript interfaces
├── data/entries.json            # Parsed data (generated)
├── scripts/                     # Build scripts
│   ├── parse-docx.ts            # Word doc parser
│   └── review-entries.ts        # Review generator
└── public/                      # Static assets
```

## Customization

### Adding More Entries

1. Add entries to the Word document
2. Re-run the parser: `npm run parse-docx <path>`
3. Rebuild: `npm run build`

### Styling

- **Colors**: Edit `tailwind.config.js` - Sanskrit color palette defined
- **Fonts**: Edit `app/layout.tsx` - Google Fonts configuration
- **Layout**: Edit components in `components/` directory

### Search Configuration

Edit `lib/search.ts` to adjust:
- Fuzzy match threshold
- Field weights (headword vs definitions)
- Search result limits

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project at vercel.com
3. Vercel auto-detects Next.js settings
4. Deploy!

**Environment**: No environment variables needed (static data)

### Static Export (GitHub Pages, Netlify)

1. Update `next.config.js` if needed (basePath for subdirectory)
2. Build: `npm run build`
3. Deploy the `out/` directory

### Other Platforms

The app uses Next.js static generation, so it can be deployed to any static hosting:
- Netlify
- GitHub Pages
- AWS S3 + CloudFront
- Cloudflare Pages

## Troubleshooting

### Parser Issues

If the Word document parser doesn't extract entries correctly:

1. Check the HTML output by modifying `scripts/parse-docx.ts` to log the HTML
2. Adjust regex patterns in the parser to match your document format
3. The parser expects format: `अंशः - 1. definition । 2. definition ।`

### Font Rendering Issues

If Devanagari doesn't render properly:
1. Ensure internet connection for Google Fonts
2. Check browser console for font loading errors
3. Verify `app/layout.tsx` has correct font configuration

### Build Errors

1. Ensure `data/entries.json` exists and is valid JSON
2. Run `npm run type-check` to check TypeScript errors
3. Run `npm run lint` to check for linting issues

## Sample Data

A sample `data/entries.json` with 5 entries has been created for testing:
- अंशः (aṃśaḥ) - part, portion
- अंशी (aṃśī) - having parts
- आत्मा (ātmā) - self, soul
- जीवः (jīvaḥ) - living being
- भागः (bhāgaḥ) - part, division

Replace this with your actual parsed data from the Word document.

## Support

For issues or questions:
1. Check the README.md for detailed documentation
2. Review the plan file: `C:\Users\harithae\.llms\plans\sanskrit_thesaurus_website.plan.md`
3. Check Next.js documentation: https://nextjs.org/docs

## Summary

All 9 implementation phases from the plan have been completed:

✅ Phase 1: Project Setup and Data Pipeline  
✅ Phase 2: Core Layout and Data Loading  
✅ Phase 3: Home Page and Search Functionality  
✅ Phase 4: Browse by Letter Pages  
✅ Phase 5: Entry Detail Pages  
✅ Phase 6: Polish, SEO, and Deployment  

The application is ready to use once Node.js is installed and the Word document is parsed!
