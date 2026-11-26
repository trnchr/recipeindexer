import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router'
import { signInWithGoogle, signOut, useSession } from '../lib/auth.js'

function Avatar({ user }) {
  const [broken, setBroken] = useState(false)
  const photo = user.user_metadata?.avatar_url
  const name = user.user_metadata?.full_name || user.email

  if (photo && !broken) {
    // Google photos refuse to load when the browser sends our site's address.
    return (
      <img
        className="avatar"
        src={photo}
        alt=""
        width="40"
        height="40"
        referrerPolicy="no-referrer"
        onError={() => setBroken(true)}
      />
    )
  }
  return (
    <span className="avatar avatar--initial" aria-hidden="true">
      {name.charAt(0).toUpperCase()}
    </span>
  )
}

// Signed in: your photo; tapping it opens your account menu.
// (Account settings and preferences will live here once they exist.)
function AccountMenu({ user }) {
  // The menu remembers which page it was opened on, so it closes by itself
  // when you go to another page.
  const { pathname } = useLocation()
  const [openOn, setOpenOn] = useState(null)
  const open = openOn === pathname
  const setOpen = (value) => setOpenOn(value ? pathname : null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)
  const wrapper = useRef(null)

  // Close it when you click outside it or press Escape.
  useEffect(() => {
    if (!open) return
    function onPointer(event) {
      if (!wrapper.current?.contains(event.target)) setOpenOn(null)
    }
    function onKey(event) {
      if (event.key === 'Escape') setOpenOn(null)
    }
    document.addEventListener('pointerdown', onPointer)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  async function handleSignOut() {
    setBusy(true)
    setError(null)
    const { error } = await signOut()
    if (error) {
      setBusy(false)
      setError('Couldn’t sign out. Try again.')
    }
  }

  return (
    <div className="account-menu" ref={wrapper}>
      <button
        type="button"
        className="account-button"
        aria-expanded={open}
        aria-controls="account-panel"
        onClick={() => setOpen(!open)}
      >
        <Avatar user={user} />
        <span className="visually-hidden">Account</span>
      </button>
      {open && (
        <div className="account-panel" id="account-panel">
          <div className="account-who">
            <p className="section-label">Signed in as</p>
            {user.user_metadata?.full_name && <p className="account-name">{user.user_metadata.full_name}</p>}
            <p className="account-email">{user.email}</p>
          </div>
          <button type="button" className="btn-secondary" onClick={handleSignOut} disabled={busy}>
            {busy ? 'Signing out…' : 'Sign out'}
          </button>
          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}
        </div>
      )}
    </div>
  )
}

// Signed out: a small "Sign in" button that goes straight to Google.
function SignInButton() {
  const [opening, setOpening] = useState(false)
  const [error, setError] = useState(null)

  async function handleClick() {
    setOpening(true)
    setError(null)
    const { error } = await signInWithGoogle()
    if (error) {
      setOpening(false)
      setError('Couldn’t reach Google. Try again.')
    }
  }

  return (
    <div className="header-sign-in">
      <button type="button" className="btn-signin" onClick={handleClick} disabled={opening}>
        {opening ? 'Opening Google…' : 'Sign in'}
      </button>
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

export default function SiteHeader() {
  const session = useSession()

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link className="brand" to="/">
          Recipe Indexer
        </Link>
        {session && (
          <nav className="site-nav" aria-label="Main">
            <NavLink to="/library">My recipes</NavLink>
          </nav>
        )}
        <div className="site-header__account">
          {session === undefined ? (
            // Still checking: keep the space so nothing jumps.
            <span className="account-placeholder" aria-hidden="true" />
          ) : session ? (
            <AccountMenu user={session.user} />
          ) : (
            <SignInButton />
          )}
        </div>
      </div>
    </header>
  )
}
