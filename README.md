# Vishishtadvaita Kosha - Sanskrit Thesaurus Website

A modern web application for browsing the Vishishtadvaita Kosha, a Sanskrit thesaurus of Vishishtadvaita philosophical terminology. Built with Next.js 14, TypeScript, and Tailwind CSS.

## Features

- 🔍 **Search**: Find entries by Devanagari script, IAST transliteration, or English meaning
- 📚 **Browse**: Navigate entries organized by Sanskrit alphabet
- 📖 **Detailed Entries**: View comprehensive definitions, scriptural references, and cross-references
- 🎨 **Typography**: Proper Devanagari rendering with Noto Sans/Serif fonts
- 🔗 **Cross-references**: Navigate between related terms
- 📱 **Responsive**: Optimized for desktop, tablet, and mobile devices
- ⚡ **Fast**: Static site generation for optimal performance
- 🔍 **SEO**: Structured data, sitemaps, and metadata for search engines

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Search**: Fuse.js (client-side fuzzy search)
- **Fonts**: Noto Sans Devanagari, Noto Serif Devanagari (Google Fonts)
- **Data**: Static JSON (generated from Word document)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd sanskrit-thesaurus
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Generate data from Word document (if you have the source .docx):
```bash
npm run parse-docx "path/to/Thesaurus.docx"
```

This will:
- Parse the Word document using mammoth.js
- Extract headwords, definitions, and references
- Generate IAST transliterations
- Output structured data to `data/entries.json`

4. Review the parsed data:
```bash
npm run review-entries
```

This generates:
- `data/entries-review.md` - Human-readable review file
- `data/entries-summary.tsv` - Tabular summary

### Development

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
npm start
```

The build process:
1. Generates static pages for all entries (SSG)
2. Creates optimized bundles
3. Outputs to `.next/` directory

### Deployment

#### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Vercel will auto-detect Next.js settings
4. Deploy!

#### Static Export

For static hosting (GitHub Pages, Netlify, etc.):

```bash
npm run build
```

The static files will be in `out/` directory.

## Project Structure

```
sanskrit-thesaurus/
├── app/                      # Next.js App Router
│   ├── layout.tsx           # Root layout with fonts
│   ├── page.tsx             # Home page
│   ├── globals.css          # Global styles
│   ├── not-found.tsx        # 404 page
│   ├── sitemap.ts           # Sitemap generation
│   ├── robots.ts            # Robots.txt
│   ├── browse/              # Browse pages
│   │   ├── page.tsx         # Browse index
│   │   └── [letter]/        # Letter-specific pages
│   └── entry/               # Entry pages
│       └── [slug]/          # Entry detail pages
├── components/              # React components
│   ├── layout/              # Header, Footer
│   ├── search/              # SearchBar, SearchResults
│   ├── entry/               # EntryCard, EntryDetail, etc.
│   ├── browse/              # AlphabetNav, LetterSection
│   └── ui/                  # DevanagariText, IASTText, etc.
├── lib/                     # Utilities
│   ├── data.ts              # Data loading functions
│   ├── search.ts            # Fuse.js configuration
│   ├── transliteration.ts   # Devanagari ↔ IAST
│   ├── slugify.ts           # URL slug generation
│   └── constants.ts         # Alphabet, config
├── types/                   # TypeScript types
│   └── entry.ts             # Entry interfaces
├── data/                    # Generated data
│   └── entries.json         # Parsed kosha entries
├── scripts/                 # Build scripts
│   ├── parse-docx.ts        # Word doc parser
│   └── review-entries.ts    # Review generator
└── public/                  # Static assets
```

## Data Pipeline

### Parsing Word Document

The `scripts/parse-docx.ts` script:

1. Uses `mammoth.js` to convert .docx to HTML
2. Extracts entries using regex patterns:
   - Headword: Devanagari word followed by " - "
   - Definitions: Numbered list (1., 2., 3., etc.)
   - References: Scriptural citations in brackets
3. Generates IAST transliterations
4. Creates URL slugs
5. Outputs structured JSON

### Data Model

```typescript
interface KoshaEntry {
  id: string;                    // Unique ID (slug)
  headword: string;              // Devanagari: "अंशः"
  headwordIAST: string;          // IAST: "aṃśaḥ"
  headwordSlug: string;          // URL slug: "amsha"
  grammaticalInfo?: string;      // Vyakarana
  definitions: Definition[];     // Numbered senses
  references: Reference[];       // Scriptural citations
  crossReferences: CrossRef[];   // Links to other entries
  letter: string;                // First letter: "अ"
  letterSlug: string;            // "a"
}
```

## Customization

### Adding More Entries

1. Add entries to the Word document following the format:
   ```
   अंशः - 1. एकवस्त्वेकदेशः । 2. भागः ।
   ```

2. Re-run the parser:
   ```bash
   npm run parse-docx "path/to/updated.docx"
   ```

3. Rebuild the site:
   ```bash
   npm run build
   ```

### Styling

- Edit `tailwind.config.js` for theme customization
- Modify `app/globals.css` for global styles
- Component-specific styles use Tailwind utility classes

### Fonts

The site uses Google Fonts:
- **Noto Sans Devanagari**: For UI and body text
- **Noto Serif Devanagari**: For headings
- **Charis SIL**: For IAST transliteration

To change fonts, update `app/layout.tsx`.

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript compiler
- `npm run parse-docx` - Parse Word document
- `npm run review-entries` - Generate review files

## Performance

- **Static Generation**: All pages pre-rendered at build time
- **Client-side Search**: Fuse.js for fast, fuzzy search (no server needed)
- **Font Optimization**: Next.js font optimization with `font-display: swap`
- **Image Optimization**: Next.js Image component (if images added)
- **Code Splitting**: Automatic by Next.js

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

Devanagari rendering requires proper font support, which is handled by Google Fonts.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is for educational and research purposes. The Vishishtadvaita Kosha content is provided for scholarly use.

## Acknowledgments

- Vishishtadvaita tradition and scholars
- Sanskrit linguistic community
- Next.js and React teams
- Tailwind CSS

## Support

For issues, questions, or contributions:
- Open an issue on GitHub
- Contact the maintainers

---

Built with ❤️ for Sanskrit and Indian philosophy enthusiasts.
