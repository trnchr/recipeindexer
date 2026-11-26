import { SITE_URL } from '../lib/site.js'

// The public pages search engines should list. Add new public pages here
// AND to `prerender` in react-router.config.js.
const PUBLIC_PAGES = ['/', '/how-it-works', '/privacy', '/terms']

// sitemap.xml lists the public pages for search engines. Built once, at build time.
export function loader() {
  const urls = SITE_URL ? PUBLIC_PAGES.map((path) => `  <url><loc>${SITE_URL}${path}</loc></url>`) : []
  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls,
    '</urlset>',
    '',
  ].join('\n')
  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  })
}
