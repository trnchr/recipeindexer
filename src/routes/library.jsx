import { useState } from 'react'
import GoogleButton from '../components/GoogleButton.jsx'
import { useSession } from '../lib/auth.js'
import { pageMeta } from '../lib/site.js'

// Private page: tell search engines not to list it.
export function meta() {
  return pageMeta({
    title: 'Your recipes',
    description: 'Your private recipe library.',
    noindex: true,
  })
}

// Features that are planned but not built yet, listed like a menu.
const COMING_UP = ['Paste a recipe link', 'Type in your own recipe', 'Search by ingredients']

function SignedOut() {
  const [error, setError] = useState(null)
  return (
    <>
      <header className="page-head">
        <h1 className="headline headline--display">Your recipes</h1>
      </header>
      <section className="panel cta-band" aria-label="Sign in">
        <div className="cta-text">
          <p className="lede">Sign in to see your recipe library.</p>
        </div>
        <div className="cta-action">
          <GoogleButton onError={setError} />
          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}
        </div>
      </section>
    </>
  )
}

export default function Library() {
  const session = useSession()

  if (session === undefined) {
    return (
      <header className="page-head" aria-busy="true">
        <p className="lede">Checking your sign-in…</p>
      </header>
    )
  }
  if (!session) return <SignedOut />

  const firstName = session.user.user_metadata?.full_name?.split(' ')[0]

  return (
    <>
      <header className="page-head">
        <h1 className="headline headline--display">{firstName ? `${firstName}’s recipes` : 'Your recipes'}</h1>
        <p className="count-label">0 recipes</p>
      </header>

      <div className="library-grid">
        <section className="panel empty-state" aria-labelledby="library-title">
          <h2 className="section-label" id="library-title">
            Your library
          </h2>
          <p className="lede">
            Your library is empty for now. Saving recipes is the next thing being built, so check back soon.
          </p>
        </section>

        <section className="panel" aria-labelledby="coming-title">
          <h2 className="section-label" id="coming-title">
            Coming up
          </h2>
          <ul className="menu">
            {COMING_UP.map((item) => (
              <li className="menu-item" key={item}>
                <p className="menu-line">
                  <span className="menu-name menu-name--quiet">{item}</span>
                  <span className="leader" aria-hidden="true" />
                  <span className="menu-soon">soon</span>
                </p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  )
}
