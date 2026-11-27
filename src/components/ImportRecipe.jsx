import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { importRecipe, ImportProblem } from '../lib/importRecipe.js'

// "Paste a recipe link" box. Import saves the recipe straight away and opens
// its page. If the recipe can't be retrieved, it offers "Enter it by hand",
// which calls onManual(link) so the form below can start with the link filled in.
export default function ImportRecipe({ onManual }) {
  const navigate = useNavigate()
  const [link, setLink] = useState('')
  const [busy, setBusy] = useState(false)
  // null, or the ImportProblem from the last try.
  const [problem, setProblem] = useState(null)

  async function handleSubmit(event) {
    event.preventDefault()
    setBusy(true)
    setProblem(null)
    try {
      const saved = await importRecipe(link)
      navigate(`/library/${saved.id}`, { state: { imported: true } })
    } catch (err) {
      setProblem(err instanceof ImportProblem ? err : new ImportProblem('error', 'Something went wrong. Please try again.'))
      setBusy(false)
    }
  }

  // "seriouseats.com" for the message, if the link can be read.
  let site = problem?.site
  if (!site) {
    try {
      site = new URL(link.trim()).hostname.replace(/^www\./, '')
    } catch {
      site = 'that site'
    }
  }

  return (
    <form className="import-form" onSubmit={handleSubmit} noValidate>
      <div className="field">
        <label htmlFor="import-link">Paste a recipe link</label>
        <p className="field-hint" id="import-hint">
          The recipe is read from the page and saved to your library right away.
        </p>
        <div className="import-row">
          <input
            id="import-link"
            type="url"
            inputMode="url"
            placeholder="https://"
            value={link}
            onChange={(event) => setLink(event.target.value)}
            maxLength={2000}
            aria-describedby="import-hint"
            disabled={busy}
            autoFocus
          />
          <button className="btn-primary" type="submit" disabled={busy || link.trim() === ''}>
            {busy ? 'Importing…' : 'Import'}
          </button>
        </div>
      </div>

      {problem?.kind === 'manual' && (
        <div className="import-problem" role="alert">
          <p>
            <strong>We couldn’t get the recipe from {site}.</strong> You’ll need to enter this one by hand.
          </p>
          <p className="field-hint">{problem.message}</p>
          <p>
            <button className="btn-secondary" type="button" onClick={() => onManual(link.trim())}>
              Enter it by hand
            </button>
          </p>
        </div>
      )}

      {problem?.kind === 'duplicate' && (
        <p className="status-note" role="alert">
          This recipe is already in your library: <Link to={`/library/${problem.recipeId}`}>{problem.recipeTitle}</Link>
        </p>
      )}

      {(problem?.kind === 'fix-link' || problem?.kind === 'error') && (
        <p className="form-error" role="alert">
          {problem.message}
        </p>
      )}
    </form>
  )
}
