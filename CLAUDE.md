# Recipe Indexer

A private recipe library. Users sign in with Google, save recipes (typed in by hand or imported from a recipe URL), and search them by ingredient (for example: every recipe containing chicken AND cumin).

The owner is new to web development. Explain changes in plain language.

## Stack

- **Frontend:** React + Vite (JavaScript, not TypeScript), in `src/`, using React Router in framework mode with `ssr: false`. Every page in `prerender` (`react-router.config.js`) is built into a finished HTML file, so public pages are readable by search engines.
- **Pages:** listed in `src/routes.js`, one file per page in `src/routes/`. Public pages: `/`, `/how-it-works`, `/privacy`, `/terms`. `/library` is private (signed in, `noindex`, blocked in `robots.txt`). A new public page must be added to `src/routes.js`, to `prerender` in `react-router.config.js`, and to `PUBLIC_PAGES` in `src/routes/sitemap.js`, and gets its title and description from `pageMeta()` in `src/lib/site.js`.
- **Hosting:** Cloudflare Workers with static assets, configured in `wrangler.jsonc`
- **Worker code:** `worker/index.js` serves the built site and runs a daily cron that pings Supabase so the free project doesn't pause. Keep that cron working.
- **Database + auth:** Supabase (Postgres) with Google sign-in through Supabase Auth
- **Deploys:** every push to `main` on GitHub automatically builds and deploys to Cloudflare

## Commands

- `npm run dev`: local site at http://localhost:5173
- `npm run build`: builds the site into `dist/client`, then `scripts/csp-hashes.js` adds each page's script fingerprints (needed by the security headers)
- `npm run preview`: builds, then runs the real Cloudflare setup at http://localhost:8787
- `npx wrangler dev --test-scheduled`: runs the Worker locally at http://localhost:8787 (run `npm run build` first); `curl.exe http://localhost:8787/__scheduled` triggers the cron

## Security rules (never break these)

- Row Level Security (RLS) must be ON for every table, with policies that limit each user to their own rows using `auth.uid()`. Never create a table without RLS and policies in the same step.
- Only the Supabase **publishable key** (`sb_publishable_...`) and project URL may appear in frontend code or `wrangler.jsonc`. The **secret key** (`sb_secret_...`) must never be in frontend code, `wrangler.jsonc`, or any committed file. If server code ever needs it, it goes in `.dev.vars` locally and in Cloudflare secrets in production.
- Frontend config uses `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, and `VITE_SITE_URL` (the live site address, for canonical links and the sitemap) from `.env.local` (git-ignored). The same values must be added as build variables in the Cloudflare dashboard. Tell the owner when that is needed.
- `public/_headers` sets the security headers, including a Content-Security-Policy. Any new outside service the browser talks to (images, APIs) must be added there. Don't remove `scripts/csp-hashes.js` from the build.
- Imported recipes are other sites' content and stay private forever. Never create public pages for recipes.
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
- Built files are served from `dist/client` with `html_handling: drop-trailing-slash` and `not_found_handling: none`. Any address that doesn't match a file goes to `worker/index.js`, which returns the app shell with a 404 status (React Router then shows the not-found page). Future Worker API routes (for example `/api/*`) must be handled in `worker/index.js` before that 404 fallback.

## How to work

- One small feature per task. Propose a short plan before writing code.
- After changes, list every file created or changed and explain what each does.
- Ask before installing new npm packages, and say why each one is needed.
- Don't run `git commit` or `git push`. The owner commits and pushes after testing.
- Keep code simple and readable over clever.
- When the owner makes a decision (design, features, security, wording), record it during the same task as an ADR (Architecture Decision Record). The decisions are the owner's private notes: they live in a folder outside this repository, never in it, and are never committed or pushed. The folder's location is in Claude's local memory, not in this file. Copy `_template.md` in that folder to the next number (for example `0017-short-name.md`), fill in the header (id, date, status, tags, related) and the Decided / Why / Open sections, and add a row to the top of the table in its `README.md`. Small follow-ups to a decision made in the same task can go in that task's ADR. Never rewrite an old decision: write a new one and set the old one's `status` to `superseded by NNNN`. Never put secrets (keys, passwords) in decisions.
- On the owner's computer, a guardrail hook blocks actions on secret files, writing secret keys, and destructive commands, and asks before every `git commit`/`git push`. If a guardrail ever blocks something, say so clearly in the reply (what was attempted and why) and don't try to get around it.
- This repository is public. Never put personal details (emails, names, local folder paths) in any committed file.
- Before the owner tests a change, give a numbered "How to test" list (each step with what they should see) and a short list of things that are intentionally not built yet.
