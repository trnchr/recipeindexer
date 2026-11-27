import { useEffect, useState } from 'react'
import { Link, useLocation, useSearchParams } from 'react-router'
import GoogleButton from '../components/GoogleButton.jsx'
import IngredientSearch from '../components/IngredientSearch.jsx'
import { useSession } from '../lib/auth.js'
import { listRecipes, sourceLabel } from '../lib/recipes.js'
import { searchRecipes, toSearchWords } from '../lib/search.js'
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
const COMING_UP = ['Recipe photos']

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

// How long to wait after the last keystroke before searching, in milliseconds.
const SEARCH_DELAY = 250

// "3 recipes match both", "1 recipe matches “chick”", "No recipes match all 3".
function resultLabel(count, words) {
  const subject = count === 0 ? 'No recipes' : count === 1 ? '1 recipe' : `${count} recipes`
  const verb = count === 1 ? 'matches' : 'match'
  const what = words.length === 1 ? `“${words[0]}”` : words.length === 2 ? 'both' : `all ${words.length}`
  return `${subject} ${verb} ${what}`
}

function RecipeList({ recipes }) {
  // Remember the current search, so the recipe page's back link returns to it.
  const { search } = useLocation()
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
            <p className="menu-name">
              <Link className="recipe-link" to={`/library/${recipe.id}`} state={{ librarySearch: search }}>
                {recipe.title}
              </Link>
            </p>
            {/* Servings and time on the left, the source bubble on the right. */}
            <div className="menu-detail menu-detail--split">
              {details.length > 0 && <p>{details.join(' · ')}</p>}
              <p className="source-tag">{sourceLabel(recipe)}</p>
            </div>
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
  // A short message at the top of the list: "Saved “...”." when arriving
  // from the Add a recipe page, or "Deleted “...”." from a deleted recipe's page.
  const { state, search } = useLocation()
  const [listNote] = useState(() => {
    if (state?.savedTitle) return `Saved “${state.savedTitle}”.`
    if (state?.deletedTitle) return `Deleted “${state.deletedTitle}”.`
    return null
  })

  // Search: the chips plus whatever is being typed in the box. The list
  // filters as you type, a moment after you stop (SEARCH_DELAY).
  // The words are also kept in the page address (/library?with=chick+cumin),
  // so they come back as chips after a refresh or a visit to a recipe.
  const [searchParams, setSearchParams] = useSearchParams()
  const [chips, setChips] = useState(() => toSearchWords(searchParams.get('with') ?? ''))
  const [typed, setTyped] = useState('')
  const liveKey = [...new Set([...chips, ...toSearchWords(typed)])].join(' ')
  // The words the shown results are for. Catches up with liveKey after the pause.
  const [wordsKey, setWordsKey] = useState(liveKey)
  const words = wordsKey === '' ? [] : wordsKey.split(' ')
  // undefined until a search has finished, then the matching recipes.
  const [results, setResults] = useState(undefined)
  const [searchError, setSearchError] = useState(null)

  useEffect(() => {
    const timer = setTimeout(() => setWordsKey(liveKey), SEARCH_DELAY)
    return () => clearTimeout(timer)
  }, [liveKey])

  useEffect(() => {
    setSearchParams(wordsKey === '' ? {} : { with: wordsKey }, { replace: true })
    // Runs only when the words change.
  }, [wordsKey])

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

  // Runs the search again whenever the words change.
  useEffect(() => {
    setSearchError(null)
    if (wordsKey === '') {
      setResults(undefined)
      return
    }
    let current = true
    searchRecipes(wordsKey.split(' '))
      .then((found) => current && setResults(found))
      .catch((err) => current && setSearchError(err.message))
    return () => {
      current = false
    }
  }, [wordsKey, userId])

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
    let listBody
    if (words.length === 0) {
      listBody = <RecipeList recipes={recipes} />
    } else if (searchError) {
      listBody = (
        <p className="form-error" role="alert">
          {searchError}
        </p>
      )
    } else if (results === undefined) {
      listBody = <p className="lede">Searching…</p>
    } else {
      listBody = (
        <>
          <p className="count-label search-count" role="status">
            {resultLabel(results.length, words)}
          </p>
          {results.length > 0 ? (
            <RecipeList recipes={results} />
          ) : (
            <p className="lede">Try removing an ingredient, or typing less of a word (“chick” finds chicken).</p>
          )}
        </>
      )
    }
    libraryBody = (
      <>
        <IngredientSearch words={chips} onWordsChange={setChips} text={typed} onTextChange={setTyped} />
        {listBody}
      </>
    )
  }

  return (
    <>
      <header className="page-head">
        <h1 className="headline headline--display">{firstName ? `${firstName}’s recipes` : 'Your recipes'}</h1>
        <p className="count-label">{countLabel(recipes)}</p>
        <p>
          {/* Its own page (/library/new), so "My recipes" and the browser's
              Back button both return here. Passes the search along. */}
          <Link className="btn-primary" to="/library/new" state={{ librarySearch: search }}>
            Add a recipe
          </Link>
        </p>
      </header>

      <div className="library-grid">
        <section className="panel" aria-labelledby="library-title">
          <h2 className="section-label" id="library-title">
            Your library
          </h2>
          {listNote && (
            <p className="status-note" role="status">
              {listNote}
            </p>
          )}
          {libraryBody}
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
