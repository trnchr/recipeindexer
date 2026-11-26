# Decisions

A record of what was decided for Recipe Indexer and why. Newest entries go at the top.
Each entry is added in the same change as the code it describes, so committing the change
also records the decision in git history.

Format: date, what was decided, why, and anything still open.

---

## 2026-11-25: Conversation logs are backed up outside the project

- **Decided:** After each Claude reply, the conversation log is copied to a private folder outside the project and saved as a version there. That folder is never pushed to GitHub.
- **Why:** Claude Code deletes old logs after 30 days. The logs contain personal details, so they stay off GitHub.
- **Also:** This file (`docs/DECISIONS.md`) is the readable, committed history of decisions.

## 2026-11-25: Accent color changed from red to amber

- **Decided:** The accent color is Toasted Amber `#A46522` (used for highlights, focus rings, the favicon bar).
- **Why:** The red felt too strong. The owner picked `#A96824`; `#A46522` is a touch darker so it passes the 4.5:1 contrast check for text on cream (4.6:1).
- **Open:** The old red-family tokens `--coral-pink` and `--pink-wash` are unused and could be removed.

## 2026-11-25: Home page copy

- **Decided:** Heading: "All your recipes, searchable by ingredient." Description: "Save recipes from any site or type in your own, all in one private library. Then list the ingredients you have and see only the recipes that use them."
- **Why:** The owner liked the "all in one private library" idea and wanted the search/filter idea up front. "Recipe Indexer" appears only in the header, so the heading can carry the slogan.

## 2026-11-25: Home page layout and header

- **Decided:**
  - "How it works" sits above the example search on the home page and was removed from the header.
  - The example search uses chicken + miso and shows 6 sample recipes.
  - When signed in, "My recipes" is a link in the header. The avatar menu holds only account items (sign out now, settings and preferences later).
  - The site name in the header is larger.
- **Why:** Clearer order for new visitors (what it does, then a demo), and the account menu stays reserved for account settings.

## 2026-11-25: Design direction: database portal, not a single receipt

- **Decided:** Full-width layout with a green top bar and roomier spacing between sections ("The Green Awning" in `DESIGN.md`). The receipt zigzag edge stays only as a small accent (under the header and in the favicon).
- **Why:** The first design (one narrow cream receipt) felt cramped and didn't use wide screens well.
- **Earlier steps:** The receipt edge went from small scallops, to larger ones, to a rounded zigzag "W" like a real receipt. The owner preferred the zigzag.

## 2026-11-25: Brand green made lighter

- **Decided:** Main green is `#14A24E`.
- **Why:** The owner wanted a lighter green. Because it's lighter, any text placed on green must be at least 19px and bold to stay readable.

## 2026-11-25: Public pages for search engines (SEO)

- **Decided:**
  - Public, indexable pages: `/`, `/how-it-works`, `/privacy`, `/terms`.
  - `/library` is private: signed-in only, hidden from search engines.
  - Recipes are never public pages, ever.
  - Google sign-in moved to a button in the top-right corner.
  - React Router (framework mode) was added so each public page is built as a finished HTML file that search engines can read.
- **Why:** Long-term growth: the site needs pages search engines can find, while every user's recipes stay private.
- **Open:** `VITE_SITE_URL`, `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` must be added as build variables in the Cloudflare dashboard.

## 2026-11-25: Security review and headers

- **Decided:**
  - Security headers in `public/_headers`: Content-Security-Policy, no framing, HSTS, and others.
  - `scripts/csp-hashes.js` runs after each build so each page only allows its own scripts.
  - Sign-in uses the safer PKCE flow.
  - Google is the only sign-in method.
- **Why:** The owner asked for a check for data or personal-information leaks. None were found, and these headers harden the site.
- **Open:** The daily keep-alive ping gets "permission denied" from Supabase. A small SQL fix was offered but not yet applied.

## 2026-11-25: Privacy and terms pages

- **Decided:** Plain-language privacy and terms pages exist.
- **Open (owner to confirm):**
  - A contact email (`CONTACT_EMAIL` in `src/lib/site.js` is still empty).
  - The promise to delete a user's data within 30 days of a request.
  - The promise to give notice before shutting the site down.

## 2026-11-25: Sign-in with Google through Supabase

- **Decided:** Users sign in with Google via Supabase Auth. Only test users for now.
- **Why:** Simple, free, and no passwords to store.

## 2026-11-25: Visual references

- **Decided:** The look is based on the owner's reference images: a dark wiki entry list (layout only), the "Lucky Bellies" posters, the Dìdi menu, and a Notion table. The font is Rubik, self-hosted. Details are in `DESIGN.md`.

---

## Next up

- Saving recipes (the next feature to build).
