export default {
  // Cloudflare serves the pre-built pages and files directly. This only runs
  // for addresses that don't match any file: it returns React Router's app
  // shell, which draws the "page not found" page, with a 404 status so search
  // engines know the page doesn't exist.
  async fetch(request, env) {
    const fallback = await env.ASSETS.fetch(new URL('/__spa-fallback', request.url))
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
