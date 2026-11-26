import { useEffect, useState } from 'react'
import { Links, Meta, Outlet, Scripts, ScrollRestoration, isRouteErrorResponse, useNavigate } from 'react-router'
import { SessionContext, takeAfterSignInPath, useSessionState } from './lib/auth.js'
import { supabase } from './lib/supabase.js'
import SiteHeader from './components/SiteHeader.jsx'
import SiteFooter from './components/SiteFooter.jsx'
import './index.css'
import './App.css'

// The HTML wrapper shared by every page.
export function Layout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#14A24E" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="preload" href="/fonts/rubik-latin.woff2" as="font" type="font/woff2" crossOrigin="" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

// The green top bar, the page content, and the footer around every page.
function Shell({ children, notice }) {
  return (
    <div className="site">
      <SiteHeader />
      <main className="page-main" id="main">
        <div className="container">
          {notice}
          {children}
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}

// If Google or Supabase sends the user back with an error, it arrives in the URL.
// We show our own fixed message rather than the text from the URL, because
// anyone can make a link with any "error" text in it.
function readSignInErrorFromUrl() {
  const params = new URLSearchParams(window.location.search + '&' + window.location.hash.slice(1))
  if (!params.get('error') && !params.get('error_description')) return false
  window.history.replaceState(null, '', window.location.pathname)
  return true
}

export default function App() {
  const session = useSessionState()
  const navigate = useNavigate()
  const [signInFailed, setSignInFailed] = useState(false)

  // Runs in the browser only (pre-built pages never see a URL error).
  useEffect(() => {
    if (readSignInErrorFromUrl()) {
      takeAfterSignInPath()
      // The address bar can only be read after the page has loaded in the
      // browser, so this has to happen here rather than while drawing.
      // oxlint-disable-next-line react/set-state-in-effect
      setSignInFailed(true)
    }
  }, [])

  // Right after signing in, continue to the page the user was heading for.
  useEffect(() => {
    if (!session) return
    const next = takeAfterSignInPath()
    if (next) navigate(next, { replace: true })
  }, [session, navigate])

  const notice = !supabase ? (
    <p className="notice" role="alert">
      Sign-in isn’t set up on this copy of the site. Add <code>VITE_SUPABASE_URL</code> and{' '}
      <code>VITE_SUPABASE_PUBLISHABLE_KEY</code> to <code>.env.local</code> (or the Cloudflare build variables), then
      restart.
    </p>
  ) : signInFailed ? (
    <p className="notice" role="alert">
      Sign-in didn’t finish. Try again, and if it keeps happening, ask the site owner to add your Google account as a
      tester.
    </p>
  ) : null

  return (
    <SessionContext.Provider value={session}>
      <Shell notice={notice}>
        <Outlet />
      </Shell>
    </SessionContext.Provider>
  )
}

// Shown for a moment while a page that wasn't pre-built loads.
export function HydrateFallback() {
  return (
    <div className="site-header" aria-busy="true">
      <div className="site-header__inner">
        <span className="brand">Recipe Indexer</span>
      </div>
    </div>
  )
}

// Shown if something breaks while drawing a page.
export function ErrorBoundary({ error }) {
  const notFound = isRouteErrorResponse(error) && error.status === 404
  return (
    <div className="site">
      <div className="site-header">
        <div className="site-header__inner">
          <a className="brand" href="/">
            Recipe Indexer
          </a>
        </div>
      </div>
      <main className="page-main">
        <div className="container page-head">
          <h1 className="headline headline--display">{notFound ? 'Page not found' : 'Something went wrong'}</h1>
          <p className="lede">
            {notFound
              ? 'This page doesn’t exist. It may have moved.'
              : 'The page couldn’t load. Refresh to try again.'}
          </p>
          <p>
            <a href="/">Back to the home page</a>
          </p>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
