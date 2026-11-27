import { makeKeywords } from './keywords.js'
import { supabase } from './supabase.js'

// Everything that saves or loads recipes goes through this file, so pages
// never talk to the database about recipes directly.
//
// The database's security rules (Row Level Security) make sure each person
// only ever gets their own recipes, so these functions don't need to filter
// by user.

// Columns shown in the recipe list.
export const LIST_COLUMNS = 'id, title, servings, total_time, source_url, created_at'

// Columns shown on a recipe's own page.
const PAGE_COLUMNS = 'id, title, ingredients, steps, servings, total_time, notes, source_url, imported, created_at'

// Recipe ids look like "3f2b8c1e-...". Checking first means a mistyped
// address shows "not found" instead of a database error.
const ID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

// The website's name from a source link, e.g. "seriouseats.com" from
// "https://www.seriouseats.com/best-chili". Null if the link can't be read.
export function siteName(sourceUrl) {
  try {
    return new URL(sourceUrl).hostname.replace(/^www\./, '')
  } catch {
    return null
  }
}

// Where a recipe came from, as a labeled line for the recipe list, written
// the same way as the other details ("Servings: 4").
// A recipe with a source link shows the website's name, for example
// "https://www.seriouseats.com/best-chili" becomes "Source: seriouseats.com",
// to credit the original site. A recipe without one shows "Source: manual".
export function sourceLabel(recipe) {
  if (!recipe.source_url) return 'Source: manual'
  return `Source: ${siteName(recipe.source_url) ?? 'website'}`
}

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

// One of the signed-in user's recipes, for its own page.
// Returns null if there's no such recipe (or it belongs to someone else,
// which the database's security rules treat the same way). Throws if the
// recipe couldn't be loaded.
export async function getRecipe(id) {
  if (!ID_PATTERN.test(id)) return null

  const { data, error } = await supabase.from('recipes').select(PAGE_COLUMNS).eq('id', id).maybeSingle()

  if (error) throw new Error('This recipe could not be loaded. Please refresh the page to try again.')
  return data
}

// Turns the form's text into a database row, checking the required boxes.
// Throws an Error whose message can be shown to the user.
function formToRow(form) {
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
  // Only imports set this. Once saved, the database won't let it change.
  if (form.imported === true) row.imported = true
  // Only imports send a photo link. The edit form leaves it out, so editing
  // keeps whatever photo link the recipe already has.
  if (form.imageUrl !== undefined) row.image_url = photoLink(form.imageUrl)
  return row
}

// A photo link from an import: kept only if it's an http(s) web address.
function photoLink(text) {
  try {
    const url = new URL(text)
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.href : null
  } catch {
    return null
  }
}

// The opposite of formToRow: a saved recipe as the text for each form box,
// so the form can start filled in when editing.
export function recipeToForm(recipe) {
  return {
    title: recipe.title,
    ingredients: recipe.ingredients.join('\n'),
    steps: recipe.steps.join('\n'),
    servings: recipe.servings ?? '',
    totalTime: recipe.total_time ?? '',
    notes: recipe.notes ?? '',
    sourceUrl: recipe.source_url ?? '',
  }
}

// Saves a recipe typed into the form. `form` holds the text from each box.
// Returns the saved recipe (in the same shape as listRecipes) or throws an
// Error whose message can be shown to the user.
export async function addRecipe(form) {
  const row = formToRow(form)
  const { data, error } = await supabase.from('recipes').insert(row).select(LIST_COLUMNS).single()

  if (error) throw new Error('The recipe could not be saved. Please try again.')
  return data
}

// Saves changes to an existing recipe from the edit form. The search
// keywords are rebuilt from the new ingredients. An imported recipe's source
// link is never sent, since it can't be changed (the database refuses too).
// Returns the updated recipe (in the same shape as getRecipe) or throws.
export async function updateRecipe(recipe, form) {
  const row = formToRow(form)
  if (recipe.imported) delete row.source_url
  const { data, error } = await supabase
    .from('recipes')
    .update(row)
    .eq('id', recipe.id)
    .select(PAGE_COLUMNS)
    .maybeSingle()

  if (error) throw new Error('Your changes could not be saved. Please try again.')
  if (!data) throw new Error('This recipe is no longer in your library.')
  return data
}

// Deletes a recipe for good. Throws if it couldn't be deleted.
export async function deleteRecipe(id) {
  const { data, error } = await supabase.from('recipes').delete().eq('id', id).select('id')

  if (error) throw new Error('The recipe could not be deleted. Please try again.')
  // The security rules quietly skip recipes that aren't yours, so check one was removed.
  if (data.length === 0) throw new Error('This recipe is no longer in your library.')
}
