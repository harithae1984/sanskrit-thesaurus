/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // Enable static exports for SSG
  output: 'export',
  
  // Disable image optimization for static export
  images: {
    unoptimized: true,
  },
  
  // Base path if deploying to subdirectory
  // basePath: '/sanskrit-thesaurus',
  
  // Trailing slash for static hosting
  trailingSlash: true,
}

module.exports = nextConfig
