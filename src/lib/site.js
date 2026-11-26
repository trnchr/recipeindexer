// Site-wide settings used by page titles, search engines, and the legal pages.

export const SITE_NAME = 'Recipe Indexer'

// The live site's address, e.g. https://recipeindexer.example.workers.dev
// Set VITE_SITE_URL in .env.local and in the Cloudflare build variables.
// Without it, pages still work but skip the "canonical" address and the sitemap.
export const SITE_URL = (import.meta.env.VITE_SITE_URL || '').replace(/\/$/, '')

// Shown on the privacy and terms pages. Fill this in before opening the site to the public.
export const CONTACT_EMAIL = ''

// Builds the <title>, description, and link-preview tags for one page.
export function pageMeta({ title, description, path, noindex = false }) {
  const fullTitle = title ? `${title} · ${SITE_NAME}` : `${SITE_NAME}: your recipes, searchable by ingredient`
  const tags = [
    { title: fullTitle },
    { name: 'description', content: description },
    { property: 'og:site_name', content: SITE_NAME },
    { property: 'og:title', content: fullTitle },
    { property: 'og:description', content: description },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary' },
  ]
  if (noindex) {
    tags.push({ name: 'robots', content: 'noindex' })
  } else if (SITE_URL && path) {
    tags.push({ tagName: 'link', rel: 'canonical', href: SITE_URL + path })
    tags.push({ property: 'og:url', content: SITE_URL + path })
  }
  return tags
}
