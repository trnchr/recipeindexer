import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router'
import BackToRecipes from '../components/BackToRecipes.jsx'
import GoogleButton from '../components/GoogleButton.jsx'
import RecipeForm from '../components/RecipeForm.jsx'
import { useSession } from '../lib/auth.js'
import { useLibraryAddress } from '../lib/libraryAddress.js'
import { deleteRecipe, getRecipe, siteName } from '../lib/recipes.js'
import { pageMeta, SITE_NAME } from '../lib/site.js'

// One recipe's own page, at /library/<recipe id>.
// Private page: tell search engines not to list it.
export function meta() {
  return pageMeta({
    title: 'Recipe',
    description: 'A recipe from your private library.',
    noindex: true,
  })
}

// "Source: seriouseats.com" as a link to the original recipe, opening in a
// new tab, or "Source: manual" for a recipe typed in by hand.
function SourceTag({ sourceUrl }) {
  if (!sourceUrl) return <p className="source-tag">Source: manual</p>
  return (
    <a className="source-tag source-tag--link" href={sourceUrl} target="_blank" rel="noopener noreferrer">
      Source: {siteName(sourceUrl) ?? 'website'} <span aria-hidden="true">↗</span>
      <span className="visually-hidden"> (opens in a new tab)</span>
    </a>
  )
}

function SignedOut() {
  const [error, setError] = useState(null)
  return (
    <>
      <header className="page-head">
        <h1 className="headline headline--display">Your recipe</h1>
      </header>
      <section className="panel cta-band" aria-label="Sign in">
        <div className="cta-text">
          <p className="lede">Sign in to see this recipe.</p>
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

// "Delete “Chicken Miso Soup”? This can't be undone." with Delete and Keep.
function ConfirmDelete({ recipe, onKeep }) {
  const navigate = useNavigate()
  const libraryAddress = useLibraryAddress()
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState(null)

  async function handleDelete() {
    setDeleting(true)
    setError(null)
    try {
      await deleteRecipe(recipe.id)
      // Back to the library, which shows "Deleted “...”." at the top.
      navigate(libraryAddress, { state: { deletedTitle: recipe.title } })
    } catch (err) {
      setError(err.message)
      setDeleting(false)
    }
  }

  return (
    <div className="confirm-box" role="group" aria-labelledby="confirm-title">
      <p id="confirm-title">
        Delete “{recipe.title}”? This can’t be undone.
      </p>
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      <div className="recipe-actions">
        <button className="btn-secondary btn-danger" type="button" onClick={handleDelete} disabled={deleting}>
          {deleting ? 'Deleting…' : 'Delete'}
        </button>
        {/* Starts focused, so pressing Enter by accident keeps the recipe. */}
        <button className="btn-secondary" type="button" onClick={onKeep} disabled={deleting} autoFocus>
          Keep
        </button>
      </div>
    </div>
  )
}

// The recipe being edited: the same form as "Add a recipe", filled in.
function RecipeEdit({ recipe, onSaved, onCancel }) {
  return (
    <>
      <header className="page-head">
        <BackToRecipes />
        <h1 className="headline headline--display">Edit recipe</h1>
      </header>
      <section className="panel" aria-label="Edit recipe">
        <RecipeForm recipe={recipe} onSaved={onSaved} onCancel={onCancel} />
      </section>
    </>
  )
}

function RecipeView({ recipe, note, confirming, onEdit, onDelete, onKeep }) {
  // "Servings: 4 · Total time: 45 minutes", leaving out any that are empty.
  const details = [
    recipe.servings && `Servings: ${recipe.servings}`,
    recipe.total_time && `Total time: ${recipe.total_time}`,
  ].filter(Boolean)

  return (
    <>
      <header className="page-head">
        <BackToRecipes />
        <h1 className="headline headline--display">{recipe.title}</h1>
        <div className="menu-detail menu-detail--split">
          {details.length > 0 && <p>{details.join(' · ')}</p>}
          <SourceTag sourceUrl={recipe.source_url} />
        </div>
        {confirming ? (
          <ConfirmDelete recipe={recipe} onKeep={onKeep} />
        ) : (
          <div className="recipe-actions">
            <button className="btn-secondary" type="button" onClick={onEdit}>
              Edit
            </button>
            <button className="btn-secondary" type="button" onClick={onDelete}>
              Delete
            </button>
          </div>
        )}
        {note && (
          <p className="status-note" role="status">
            {note}
          </p>
        )}
      </header>

      <div className="recipe-grid">
        <section className="panel" aria-labelledby="ingredients-title">
          <h2 className="section-label" id="ingredients-title">
            Ingredients
          </h2>
          <ul className="ingredient-list">
            {recipe.ingredients.map((line, i) => (
              <li key={i}>{line}</li>
            ))}
          </ul>
        </section>

        <div className="recipe-column">
          <section className="panel" aria-labelledby="steps-title">
            <h2 className="section-label" id="steps-title">
              Steps
            </h2>
            {recipe.steps.length > 0 ? (
              <ol className="step-list">
                {recipe.steps.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ol>
            ) : (
              <p className="lede">No steps saved for this recipe.</p>
            )}
          </section>

          {recipe.notes && (
            <section className="panel" aria-labelledby="notes-title">
              <h2 className="section-label" id="notes-title">
                Notes
              </h2>
              <p className="recipe-notes">{recipe.notes}</p>
            </section>
          )}
        </div>
      </div>

      {/* A second way back at the end, so there's no need to scroll up. */}
      <BackToRecipes bottom />
    </>
  )
}

function SignedIn({ id, userId }) {
  // undefined while loading, null if not found, otherwise the recipe.
  const [recipe, setRecipe] = useState(undefined)
  const [loadError, setLoadError] = useState(null)
  // 'view', 'edit', or 'confirm' (asking "Delete ...?").
  const [mode, setMode] = useState('view')
  // A short message after an action, like "Saved your changes."
  const [note, setNote] = useState(null)
  const { state } = useLocation()
  const justImported = state?.imported === true

  useEffect(() => {
    let current = true
    setRecipe(undefined)
    setLoadError(null)
    setMode('view')
    // Just imported? Say so, and suggest checking it over.
    setNote(justImported ? 'Imported and saved. Check it over, and use Edit to fix anything.' : null)
    getRecipe(id)
      .then((found) => current && setRecipe(found))
      .catch((err) => current && setLoadError(err.message))
    return () => {
      current = false
    }
  }, [id, userId, justImported])

  // Show the recipe's name in the browser tab.
  useEffect(() => {
    if (recipe) document.title = `${recipe.title} · ${SITE_NAME}`
  }, [recipe])

  if (loadError) {
    return (
      <header className="page-head">
        <BackToRecipes />
        <p className="form-error" role="alert">
          {loadError}
        </p>
      </header>
    )
  }
  if (recipe === undefined) {
    return (
      <header className="page-head" aria-busy="true">
        <BackToRecipes />
        <p className="lede">Loading the recipe…</p>
      </header>
    )
  }
  if (recipe === null) {
    return (
      <header className="page-head">
        <BackToRecipes />
        <h1 className="headline headline--display">Recipe not found</h1>
        <p className="lede">This recipe isn’t in your library. It may have been removed, or the link may be wrong.</p>
      </header>
    )
  }

  function handleSaved(updated) {
    setRecipe(updated)
    setMode('view')
    setNote('Saved your changes.')
    window.scrollTo(0, 0)
  }

  if (mode === 'edit') {
    return <RecipeEdit recipe={recipe} onSaved={handleSaved} onCancel={() => setMode('view')} />
  }
  return (
    <RecipeView
      recipe={recipe}
      note={note}
      confirming={mode === 'confirm'}
      onEdit={() => {
        setNote(null)
        setMode('edit')
      }}
      onDelete={() => {
        setNote(null)
        setMode('confirm')
      }}
      onKeep={() => setMode('view')}
    />
  )
}

export default function Recipe() {
  const { id } = useParams()
  const session = useSession()

  if (session === undefined) {
    return (
      <header className="page-head" aria-busy="true">
        <p className="lede">Checking your sign-in…</p>
      </header>
    )
  }
  if (!session) return <SignedOut />
  return <SignedIn id={id} userId={session.user.id} />
}
