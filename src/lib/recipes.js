import { makeKeywords } from './keywords.js'
import { supabase } from './supabase.js'

// Everything that saves or loads recipes goes through this file, so pages
// never talk to the database about recipes directly.
//
// The database's security rules (Row Level Security) make sure each person
// only ever gets their own recipes, so these functions don't need to filter
// by user.

// Columns shown in the recipe list.
const LIST_COLUMNS = 'id, title, servings, total_time, created_at'

// Splits a text box into lines, trimming spaces and skipping blank lines.
export function toLines(text) {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
}

// Like toLines, but also removes numbering people often type ("1.", "Step 2:"),
// since steps are numbered when shown.
function toSteps(text) {
  return toLines(text)
    .map((line) => line.replace(/^(step\s*)?\d+\s*[.):-]\s*/i, ''))
    .filter(Boolean)
}

// An empty box becomes "no value" in the database instead of an empty string.
function optional(text) {
  const value = text.trim()
  return value === '' ? null : value
}

// Checks a typed link. Returns the link, null if left empty, or throws.
function checkLink(text) {
  const value = optional(text)
  if (value === null) return null
  let url
  try {
    url = new URL(value)
  } catch {
    throw new Error('The source link should be a full web address, starting with https://')
  }
  if (url.protocol !== 'https:' && url.protocol !== 'http:') {
    throw new Error('The source link should start with https:// or http://')
  }
  return url.href
}

// The signed-in user's recipes, newest first.
export async function listRecipes() {
  const { data, error } = await supabase
    .from('recipes')
    .select(LIST_COLUMNS)
    .order('created_at', { ascending: false })

  if (error) throw new Error('Your recipes could not be loaded. Please refresh the page to try again.')
  return data
}

// Saves a recipe typed into the form. `form` holds the text from each box.
// Returns the saved recipe (in the same shape as listRecipes) or throws an
// Error whose message can be shown to the user.
export async function addRecipe(form) {
  const title = form.title.trim()
  const ingredients = toLines(form.ingredients)

  if (!title) throw new Error('Please give the recipe a title.')
  if (ingredients.length === 0) throw new Error('Please add at least one ingredient.')

  const row = {
    title,
    ingredients,
    keywords: makeKeywords(ingredients),
    steps: toSteps(form.steps),
    servings: optional(form.servings),
    total_time: optional(form.totalTime),
    notes: optional(form.notes),
    source_url: checkLink(form.sourceUrl),
  }

  const { data, error } = await supabase.from('recipes').insert(row).select(LIST_COLUMNS).single()

  if (error) throw new Error('The recipe could not be saved. Please try again.')
  return data
}
