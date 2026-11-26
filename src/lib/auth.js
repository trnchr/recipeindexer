import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from './supabase.js'

// Tracks who is signed in. `session` is:
//   undefined -> still checking (also what pre-built pages show)
//   null      -> signed out
//   object    -> signed in (session.user has the email and Google profile)
// The root layout calls this once and shares the answer with every page.
export function useSessionState() {
  const [session, setSession] = useState(supabase ? undefined : null)

  useEffect(() => {
    if (!supabase) return

    supabase.auth.getSession().then(({ data }) => setSession(data.session))

    // Fires on sign in, sign out, and when Supabase refreshes the login.
    const { data } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
    })
    return () => data.subscription.unsubscribe()
  }, [])

  return session
}

export const SessionContext = createContext(undefined)

// Any page or component can ask "who is signed in?" with this.
export function useSession() {
  return useContext(SessionContext)
}

// Where to go after Google sends the user back. Google always returns to the
// home page (the address allowed in Supabase), and the root layout then moves
// the user on to this page.
const AFTER_SIGN_IN_KEY = 'recipe-indexer:after-sign-in'

export function signInWithGoogle(nextPath = '/library') {
  sessionStorage.setItem(AFTER_SIGN_IN_KEY, nextPath)
  return supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: window.location.origin },
  })
}

// Returns the saved page (once) and forgets it. Only same-site paths are allowed.
export function takeAfterSignInPath() {
  const path = sessionStorage.getItem(AFTER_SIGN_IN_KEY)
  sessionStorage.removeItem(AFTER_SIGN_IN_KEY)
  return path && path.startsWith('/') && !path.startsWith('//') ? path : null
}

export function signOut() {
  return supabase.auth.signOut()
}
