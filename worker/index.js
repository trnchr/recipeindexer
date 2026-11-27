import { handleImport } from './import.js'

export default {
  // Cloudflare serves the pre-built pages and files directly. This only runs
  // for addresses that don't match any file.
  async fetch(request, env) {
    const { pathname } = new URL(request.url)

    // Worker API routes come first, before the page fallbacks below.
    if (pathname === '/api/import') return handleImport(request, env)
    if (pathname.startsWith('/api/')) {
      return Response.json({ ok: false, code: 'not-found' }, { status: 404 })
    }

    const fallback = await env.ASSETS.fetch(new URL('/__spa-fallback', request.url))

    // A recipe's own page (/library/<recipe id>) isn't a pre-built file, since
    // recipes are private. Send React Router's app shell with a normal 200
    // status so the page loads in the browser and shows the recipe (or its own
    // "Recipe not found" message). The header keeps search engines away too.
    if (/^\/library\/[^/]+$/.test(pathname)) {
      const headers = new Headers(fallback.headers)
      headers.set('X-Robots-Tag', 'noindex')
      return new Response(fallback.body, { status: 200, headers })
    }

    // Anything else: the app shell, which draws the "page not found" page,
    // with a 404 status so search engines know the page doesn't exist.
    return new Response(fallback.body, { status: 404, headers: fallback.headers })
  },

  // Runs once a day on the schedule in wrangler.jsonc
  async scheduled(_controller, env) {
    const res = await fetch(
      `${env.SUPABASE_URL}/rest/v1/keep_alive?select=id&limit=1`,
      { headers: { apikey: env.SUPABASE_PUBLISHABLE_KEY } }
    );
    console.log(`Supabase keep-alive ping: ${res.status}`);
  },
};
