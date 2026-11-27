import { useState } from 'react'
import { useNavigate } from 'react-router'
import BackToRecipes from '../components/BackToRecipes.jsx'
import GoogleButton from '../components/GoogleButton.jsx'
import ImportRecipe from '../components/ImportRecipe.jsx'
import RecipeForm from '../components/RecipeForm.jsx'
import { useSession } from '../lib/auth.js'
import { useLibraryAddress } from '../lib/libraryAddress.js'
import { pageMeta } from '../lib/site.js'

// The "Add a recipe" page, at /library/new: import from a link, or type it in.
// Private page: tell search engines not to list it.
export function meta() {
  return pageMeta({
    title: 'Add a recipe',
    description: 'Add a recipe to your private library.',
    noindex: true,
  })
}

function SignedOut() {
  const [error, setError] = useState(null)
  return (
    <>
      <header className="page-head">
        <h1 className="headline headline--display">Add a recipe</h1>
      </header>
      <section className="panel cta-band" aria-label="Sign in">
        <div className="cta-text">
          <p className="lede">Sign in to add recipes to your library.</p>
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

function SignedIn() {
  const navigate = useNavigate()
  const libraryAddress = useLibraryAddress()
  // After "Enter it by hand": the link that couldn't be imported, which the
  // form starts with. `manualCount` makes the form start over each time.
  const [manualLink, setManualLink] = useState(null)
  const [manualCount, setManualCount] = useState(0)

  // After saving: back to the full library (no search, so the new recipe is
  // at the top), which shows "Saved “...”.".
  function handleSaved(recipe) {
    navigate('/library', { state: { savedTitle: recipe.title } })
  }

  return (
    <>
      <header className="page-head">
        <BackToRecipes />
        <h1 className="headline headline--display">Add a recipe</h1>
      </header>

      <section className="panel add-recipe" aria-label="Add a recipe">
        <ImportRecipe
          onManual={(link) => {
            setManualLink(link)
            setManualCount(manualCount + 1)
          }}
        />
        <p className="or-divider">
          <span>or type it in</span>
        </p>
        <RecipeForm
          key={manualCount}
          startWith={manualLink ? { sourceUrl: manualLink } : undefined}
          autoFocusTitle={manualCount > 0}
          onSaved={handleSaved}
          onCancel={() => navigate(libraryAddress)}
        />
      </section>
    </>
  )
}

export default function NewRecipe() {
  const session = useSession()

  if (session === undefined) {
    return (
      <header className="page-head" aria-busy="true">
        <p className="lede">Checking your sign-in…</p>
      </header>
    )
  }
  if (!session) return <SignedOut />
  return <SignedIn />
}
