import { createClient } from '@supabase/supabase-js'

// These come from .env.local on your computer, and from the build
// variables in the Cloudflare dashboard when the site is deployed.
// Only the publishable key belongs here, never the secret key.
const url = import.meta.env.VITE_SUPABASE_URL
const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

// If the values are missing, `supabase` is null and the app shows a
// setup message instead of crashing.
export const supabase =
  url && publishableKey
    ? createClient(url, publishableKey, {
        auth: {
          // "PKCE" sign-in: Google sends back a one-time code instead of the
          // login token itself, so the token never appears in the page address
          // (where it could end up in browser history).
          flowType: 'pkce',
        },
      })
    : null
