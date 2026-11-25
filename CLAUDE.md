# Recipe Indexer

A private recipe library. Users sign in with Google, save recipes (typed in by hand or imported from a recipe URL), and search them by ingredient (for example: every recipe containing chicken AND cumin).

The owner is new to web development. Explain changes in plain language.

## Stack

- **Frontend:** React + Vite (JavaScript, not TypeScript), in `src/`
- **Hosting:** Cloudflare Workers with static assets, configured in `wrangler.jsonc`
- **Worker code:** `worker/index.js` serves the built site and runs a daily cron that pings Supabase so the free project doesn't pause. Keep that cron working.
- **Database + auth:** Supabase (Postgres) with Google sign-in through Supabase Auth
- **Deploys:** every push to `main` on GitHub automatically builds and deploys to Cloudflare

## Commands

- `npm run dev`: local site at http://localhost:5173
- `npm run build`: builds the site into `dist/`
- `npx wrangler dev --test-scheduled`: runs the Worker locally at http://localhost:8787 (run `npm run build` first); `curl.exe http://localhost:8787/__scheduled` triggers the cron

## Security rules (never break these)

- Row Level Security (RLS) must be ON for every table, with policies that limit each user to their own rows using `auth.uid()`. Never create a table without RLS and policies in the same step.
- Only the Supabase **publishable key** (`sb_publishable_...`) and project URL may appear in frontend code or `wrangler.jsonc`. The **secret key** (`sb_secret_...`) must never be in frontend code, `wrangler.jsonc`, or any committed file. If server code ever needs it, it goes in `.dev.vars` locally and in Cloudflare secrets in production.
- Frontend config uses `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` from `.env.local` (git-ignored). The same values must be added as build variables in the Cloudflare dashboard. Tell the owner when that is needed.
- Never commit `.env`, `.env.*`, `.dev.vars`, or `.wrangler/`.
- Recipe URL import must fetch pages from the Worker, never from the browser. Validate that the URL is http/https and don't fetch private or local addresses.

## Cost rules

- Free tiers only (Cloudflare Workers Free, Supabase Free). Don't add paid services, paid APIs, or AI/LLM API calls without asking first and explaining the cost.
- Recipe URL import should read the schema.org `Recipe` JSON-LD embedded in the page. Don't use AI to parse recipes.
- Photos: store a link to the image on the source site; don't upload images for now.

## Data and search design

- Each recipe keeps the ingredient lines as written (for example "2 lbs boneless chicken thighs") AND a separate normalized keyword list (lowercase, singular, no amounts, for example `chicken`, `thigh`).
- All search logic lives in one module (for example `src/lib/search.js` exposing `searchRecipes()`). The UI only calls that function, so the search approach can change later without touching pages.
- Database changes: give the SQL to the owner to run in the Supabase SQL Editor, and also save it as a numbered file in `supabase/migrations/` so there is a record.

## Hosting notes

- `wrangler.jsonc` is the source of truth for Worker settings; don't tell the owner to change them in the Cloudflare dashboard.
- `assets.not_found_handling` is `single-page-application`. Any future Worker API routes (for example `/api/*`) must be listed in `assets.run_worker_first`, or the React app will be served instead.

## How to work

- One small feature per task. Propose a short plan before writing code.
- After changes, list every file created or changed and explain what each does.
- Ask before installing new npm packages, and say why each one is needed.
- Don't run `git commit` or `git push`. The owner commits and pushes after testing.
- Keep code simple and readable over clever.
