import { index, route } from '@react-router/dev/routes'

// Every page address on the site, and the file that draws it.
export default [
  // Public pages (search engines can find these)
  index('routes/home.jsx'),
  route('how-it-works', 'routes/how-it-works.jsx'),
  route('privacy', 'routes/privacy.jsx'),
  route('terms', 'routes/terms.jsx'),

  // Private pages: only useful when signed in, hidden from search engines
  route('library', 'routes/library.jsx'),
  route('library/new', 'routes/new-recipe.jsx'), // the "Add a recipe" page
  route('library/:id', 'routes/recipe.jsx'), // one recipe, e.g. /library/3f2b8c1e-...

  // Files for search engines
  route('robots.txt', 'routes/robots.js'),
  route('sitemap.xml', 'routes/sitemap.js'),

  // Anything else: "page not found"
  route('*', 'routes/not-found.jsx'),
]
