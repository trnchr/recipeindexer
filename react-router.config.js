// Settings for React Router, which gives the site real page addresses.
export default {
  // Our React code lives in src/ (React Router's default is app/).
  appDirectory: 'src',
  // Build output goes to dist/client (wrangler.jsonc points there).
  buildDirectory: 'dist',
  // No server code: every page is saved as a finished HTML file at build time,
  // so search engines get complete pages and Cloudflare serves plain files.
  ssr: false,
  // Pages to pre-build. Add new public pages here AND in src/routes/sitemap.js.
  prerender: ['/', '/how-it-works', '/privacy', '/terms', '/library', '/robots.txt', '/sitemap.xml'],
}
