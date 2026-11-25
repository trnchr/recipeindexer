export default {
  // Serves your React site for normal visits
  async fetch(request, env) {
    return env.ASSETS.fetch(request);
  },

  // Runs once a day on the schedule in wrangler.jsonc
  async scheduled(controller, env, ctx) {
    const res = await fetch(
      `${env.SUPABASE_URL}/rest/v1/keep_alive?select=id&limit=1`,
      { headers: { apikey: env.SUPABASE_PUBLISHABLE_KEY } }
    );
    console.log(`Supabase keep-alive ping: ${res.status}`);
  },
};