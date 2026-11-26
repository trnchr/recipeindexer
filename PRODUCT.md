# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Home cooks who collect recipes from many websites and their own notes. The owner is the first user, but the product is meant to be open to anyone eventually; every person signs in with Google and has their own private library.

They use it in three situations:

- **Cooking:** on a phone in the kitchen, reading a recipe's ingredients and steps while their hands are busy.
- **Deciding:** on a phone at the store or in front of the fridge, asking "what can I make with chicken and cumin?"
- **Saving:** on a computer, importing recipes from URLs or typing them in, and keeping the library tidy.

## Product Purpose

A private recipe library. Users save recipes (typed in by hand or imported from a recipe page's URL) and later find them by ingredient: for example, every saved recipe that contains chicken AND cumin. Success means a user can go from "what do I have?" to a recipe they've already saved in a few seconds, and can then cook from it comfortably on a phone.

## Positioning

- **Ingredient search across your own library.** Search returns every saved recipe containing ALL the listed ingredients (proteins, vegetables, spices), not a web search and not a single-tag filter.
- **Clean recipes.** A saved recipe is just its ingredients and steps, with no ads or life stories.
- **Your data, one place.** Recipes from any site plus the user's own, together, private, and on free infrastructure, not locked inside someone else's app.

## Operating Context

- Imported recipes come from the schema.org `Recipe` JSON-LD embedded in the source page, fetched by the Worker (never the browser). Pages without that data need manual entry.
- Each recipe keeps ingredient lines as written ("2 lbs boneless chicken thighs") plus a normalized keyword list (lowercase, singular, no amounts: `chicken`, `thigh`) that powers search.
- Photos are a link to the image on the source site; no image uploads for now.

## Capabilities and Constraints

- Stack (existing): React + Vite (JavaScript) frontend, Cloudflare Workers with static assets, Supabase Postgres + Supabase Auth with Google sign-in. Pushes to `main` deploy automatically.
- Every table uses Row Level Security limited to the user's own rows.
- Free tiers only (Cloudflare Workers Free, Supabase Free). No paid services and no AI/LLM calls, including for recipe parsing, without the owner's approval.
- All search logic lives in one module (`searchRecipes()`), so the search approach can change without touching the UI.
- The owner is new to web development; changes should be simple and explained in plain language. See `CLAUDE.md` for the full rules.
- Undecided: whether recipes can be edited after import, tags or collections beyond ingredients, sharing between users, and what happens when free-tier limits are reached if the user base grows.

## Brand Commitments

Working name: Recipe Indexer. No logo, voice guide, or visual identity is set yet.

## Evidence on Hand

None yet. The app is still the default Vite starter (`src/App.jsx`). There are no saved recipes, users, screenshots, or testimonials. Future work must not invent any.

## Product Principles

1. **Search is the product.** Finding recipes by ingredient comes first; every other feature supports it.
2. **The recipe, nothing else.** Show ingredients and steps without clutter.
3. **Works at the stove.** Recipe reading on a phone, mid-cooking, is a main use case, not an afterthought.
4. **Private by default.** Each user's library is theirs alone, enforced in the database.
5. **Free and simple to run.** Prefer the approach that stays on free tiers and that a beginner can maintain.
