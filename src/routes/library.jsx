import { useEffect, useState } from 'react'
import GoogleButton from '../components/GoogleButton.jsx'
import RecipeForm from '../components/RecipeForm.jsx'
import { useSession } from '../lib/auth.js'
import { listRecipes } from '../lib/recipes.js'
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
const COMING_UP = ['Open, edit, or delete a recipe', 'Paste a recipe link', 'Search by ingredients']

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

function countLabel(recipes) {
  if (recipes === undefined) return 'Loading…'
  return recipes.length === 1 ? '1 recipe' : `${recipes.length} recipes`
}

function RecipeList({ recipes }) {
  return (
    <ul className="menu">
      {recipes.map((recipe) => {
        // "Servings: 4 · Total time: 45 minutes", leaving out any that are empty.
        const details = [
          recipe.servings && `Servings: ${recipe.servings}`,
          recipe.total_time && `Total time: ${recipe.total_time}`,
        ].filter(Boolean)

        return (
          <li className="menu-item" key={recipe.id}>
            <p className="menu-name">{recipe.title}</p>
            {details.length > 0 && <p className="menu-detail">{details.join(' · ')}</p>}
          </li>
        )
      })}
    </ul>
  )
}

function SignedIn({ session }) {
  // undefined while loading, then the list of recipes (newest first).
  const [recipes, setRecipes] = useState(undefined)
  const [loadError, setLoadError] = useState(null)
  const [adding, setAdding] = useState(false)
  const [savedTitle, setSavedTitle] = useState(null)

  const userId = session.user.id
  useEffect(() => {
    let current = true
    listRecipes()
      .then((list) => current && setRecipes(list))
      .catch((err) => current && setLoadError(err.message))
    return () => {
      current = false
    }
  }, [userId])

  function handleSaved(recipe) {
    setRecipes([recipe, ...(recipes ?? [])])
    setSavedTitle(recipe.title)
    setAdding(false)
  }

  function startAdding() {
    setSavedTitle(null)
    setAdding(true)
  }

  const firstName = session.user.user_metadata?.full_name?.split(' ')[0]

  let libraryBody
  if (loadError) {
    libraryBody = (
      <p className="form-error" role="alert">
        {loadError}
      </p>
    )
  } else if (recipes === undefined) {
    libraryBody = <p className="lede">Loading your recipes…</p>
  } else if (recipes.length === 0) {
    libraryBody = <p className="lede">Your library is empty. Add your first recipe to get started.</p>
  } else {
    libraryBody = <RecipeList recipes={recipes} />
  }

  return (
    <>
      <header className="page-head">
        <h1 className="headline headline--display">{firstName ? `${firstName}’s recipes` : 'Your recipes'}</h1>
        <p className="count-label">{countLabel(recipes)}</p>
        {!adding && (
          <p>
            <button className="btn-primary" type="button" onClick={startAdding}>
              Add a recipe
            </button>
          </p>
        )}
      </header>

      <div className="library-grid">
        {adding ? (
          <section className="panel" aria-labelledby="add-title">
            <h2 className="section-label" id="add-title">
              Add a recipe
            </h2>
            <RecipeForm onSaved={handleSaved} onCancel={() => setAdding(false)} />
          </section>
        ) : (
          <section className="panel" aria-labelledby="library-title">
            <h2 className="section-label" id="library-title">
              Your library
            </h2>
            {savedTitle && (
              <p className="status-note" role="status">
                Saved “{savedTitle}”.
              </p>
            )}
            {libraryBody}
          </section>
        )}

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
  return <SignedIn session={session} />
}
