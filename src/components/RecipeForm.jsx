import { useState } from 'react'
import { makeKeywords } from '../lib/keywords.js'
import { addRecipe, recipeToForm, siteName, toLines, updateRecipe } from '../lib/recipes.js'

const EMPTY = {
  title: '',
  ingredients: '',
  steps: '',
  servings: '',
  totalTime: '',
  notes: '',
  sourceUrl: '',
}

// The recipe form, used both to add a recipe and to edit one.
// Without `recipe` it starts empty and adds a new recipe. With `recipe`
// (a saved recipe) it starts filled in and saves changes to it.
// Calls onSaved(savedRecipe) after a successful save, and onCancel() when
// the user closes it without saving.
// `startWith` fills in some boxes of a new recipe (e.g. { sourceUrl } after
// an import couldn't read the page). `autoFocusTitle` puts the cursor in
// the Title box when the form appears.
export default function RecipeForm({ recipe, startWith, autoFocusTitle = true, onSaved, onCancel }) {
  const editing = Boolean(recipe)
  const [form, setForm] = useState(() => (editing ? recipeToForm(recipe) : { ...EMPTY, ...startWith }))
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  // Updates one box's text as the user types.
  function update(event) {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSaving(true)
    setError(null)
    try {
      const saved = editing ? await updateRecipe(recipe, form) : await addRecipe(form)
      onSaved(saved)
    } catch (err) {
      setError(err.message)
      setSaving(false)
    }
  }

  // An imported recipe's source link credits the original site, so it's
  // shown but can't be changed.
  const sourceLocked = editing && recipe.imported === true

  // Live preview of the search keywords, rebuilt on every keystroke.
  const keywords = makeKeywords(toLines(form.ingredients))

  return (
    <form className="recipe-form" onSubmit={handleSubmit} noValidate>
      <div className="field">
        <label htmlFor="recipe-title">Title</label>
        <input
          id="recipe-title"
          name="title"
          type="text"
          value={form.title}
          onChange={update}
          maxLength={200}
          required
          autoFocus={autoFocusTitle}
        />
      </div>

      <div className="field-row">
        <div className="field">
          <label htmlFor="recipe-servings">
            Servings <span className="field-optional">(optional)</span>
          </label>
          <input
            id="recipe-servings"
            name="servings"
            type="text"
            placeholder="4"
            value={form.servings}
            onChange={update}
            maxLength={100}
          />
        </div>
        <div className="field">
          <label htmlFor="recipe-time">
            Total time <span className="field-optional">(optional)</span>
          </label>
          <input
            id="recipe-time"
            name="totalTime"
            type="text"
            placeholder="45 minutes"
            value={form.totalTime}
            onChange={update}
            maxLength={100}
          />
        </div>
      </div>

      <div className="field">
        <label htmlFor="recipe-ingredients">Ingredients</label>
        <p className="field-hint" id="ingredients-hint">
          One per line, for example “2 lbs boneless chicken thighs”.
        </p>
        <textarea
          id="recipe-ingredients"
          name="ingredients"
          rows={8}
          value={form.ingredients}
          onChange={update}
          maxLength={10000}
          required
          aria-describedby="ingredients-hint keywords-preview"
        />
        <div className="keyword-preview" id="keywords-preview">
          <p className="field-hint">Search keywords:</p>
          {keywords.length > 0 ? (
            <ul className="keyword-list">
              {keywords.map((word) => (
                <li className="chip chip--small" key={word}>
                  {word}
                </li>
              ))}
            </ul>
          ) : (
            <p className="field-hint">They’ll appear here as you type ingredients.</p>
          )}
        </div>
      </div>

      <div className="field">
        <label htmlFor="recipe-steps">
          Steps <span className="field-optional">(optional)</span>
        </label>
        <p className="field-hint" id="steps-hint">
          One step per line.
        </p>
        <textarea
          id="recipe-steps"
          name="steps"
          rows={8}
          value={form.steps}
          onChange={update}
          maxLength={20000}
          aria-describedby="steps-hint"
        />
      </div>

      <div className="field">
        <label htmlFor="recipe-notes">
          Notes <span className="field-optional">(optional)</span>
        </label>
        <textarea
          id="recipe-notes"
          name="notes"
          rows={3}
          value={form.notes}
          onChange={update}
          maxLength={5000}
        />
      </div>

      {sourceLocked ? (
        <div className="field">
          <label htmlFor="recipe-source">Source link</label>
          <input
            id="recipe-source"
            name="sourceUrl"
            type="url"
            value={form.sourceUrl}
            readOnly
            aria-describedby="source-locked-note"
          />
          <p className="field-hint" id="source-locked-note">
            The link can’t be changed as it was imported directly from {siteName(form.sourceUrl) ?? 'its website'}.
          </p>
        </div>
      ) : (
        <div className="field">
          <label htmlFor="recipe-source">
            Source link <span className="field-optional">(optional)</span>
          </label>
          <input
            id="recipe-source"
            name="sourceUrl"
            type="url"
            inputMode="url"
            placeholder="https://"
            value={form.sourceUrl}
            onChange={update}
            maxLength={2000}
          />
        </div>
      )}

      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}

      <div className="form-actions">
        <button className="btn-primary" type="submit" disabled={saving}>
          {saving ? 'Saving…' : editing ? 'Save changes' : 'Save recipe'}
        </button>
        <button className="btn-secondary" type="button" onClick={onCancel} disabled={saving}>
          Cancel
        </button>
      </div>
    </form>
  )
}
