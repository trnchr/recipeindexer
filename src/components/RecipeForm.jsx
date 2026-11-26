import { useState } from 'react'
import { makeKeywords } from '../lib/keywords.js'
import { addRecipe, toLines } from '../lib/recipes.js'

const EMPTY = {
  title: '',
  ingredients: '',
  steps: '',
  servings: '',
  totalTime: '',
  notes: '',
  sourceUrl: '',
}

// The "Add a recipe" form. Calls onSaved(recipe) after a successful save,
// and onCancel() when the user closes it without saving.
export default function RecipeForm({ onSaved, onCancel }) {
  const [form, setForm] = useState(EMPTY)
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
      const recipe = await addRecipe(form)
      onSaved(recipe)
    } catch (err) {
      setError(err.message)
      setSaving(false)
    }
  }

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
          autoFocus
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

      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}

      <div className="form-actions">
        <button className="btn-primary" type="submit" disabled={saving}>
          {saving ? 'Saving…' : 'Save recipe'}
        </button>
        <button className="btn-secondary" type="button" onClick={onCancel} disabled={saving}>
          Cancel
        </button>
      </div>
    </form>
  )
}
