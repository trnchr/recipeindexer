import { SITE_URL } from '../lib/site.js'

// robots.txt tells search engines what to skip. Built once, at build time.
export function loader() {
  const lines = ['User-agent: *', 'Disallow: /library', '']
  if (SITE_URL) lines.push(`Sitemap: ${SITE_URL}/sitemap.xml`, '')
  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
