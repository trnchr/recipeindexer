import { addRecipe } from './recipes.js'
import { supabase } from './supabase.js'

// Imports a recipe from a link and saves it to the signed-in user's library.
//
// The steps:
//   1. Check the link looks like a web address.
//   2. Check it isn't already in the library (same source link).
//   3. Ask our own Worker (/api/import) to fetch the page and read the
//      recipe. The browser never fetches the recipe site itself.
//   4. Save it from here, with the user's own sign-in, so the database's
//      per-user security rules apply. The Worker never touches the database.
//
// Returns the saved recipe, or throws an ImportProblem saying what went wrong.

// What went wrong, as a `kind` the import box uses to decide what to show:
//   'manual'     the recipe can't be retrieved; offer "Enter it by hand"
//   'duplicate'  already saved (recipeId, recipeTitle say which one)
//   'fix-link'   the link itself is the problem; the user can correct it
//   'error'      anything else (signed out, no internet, not saved)
export class ImportProblem extends Error {
  constructor(kind, message, details = {}) {
    super(message)
    this.kind = kind
    Object.assign(this, details)
  }
}

// Worker answers that mean "fix the link" rather than "enter it by hand".
const LINK_CODES = new Set(['invalid-link', 'blocked-address', 'not-found'])

function checkShape(text) {
  let url
  try {
    url = new URL(text.trim())
  } catch {
    throw new ImportProblem('fix-link', 'Paste a full web address, starting with https://')
  }
  if (url.protocol !== 'https:' && url.protocol !== 'http:') {
    throw new ImportProblem('fix-link', 'The link should start with https:// or http://')
  }
  url.hash = ''
  return url
}

async function findExisting(link) {
  const { data, error } = await supabase.from('recipes').select('id, title').eq('source_url', link).limit(1)
  if (error) throw new ImportProblem('error', 'Your library could not be checked. Please try again.')
  return data[0] ?? null
}

async function askWorker(link) {
  const { data } = await supabase.auth.getSession()
  const token = data.session?.access_token
  if (!token) throw new ImportProblem('error', 'Please sign in again, then try the import.')

  let res
  try {
    res = await fetch('/api/import', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ url: link }),
    })
  } catch {
    throw new ImportProblem('error', 'Couldn’t connect. Check your internet connection and try again.')
  }

  let body = null
  try {
    body = await res.json()
  } catch {
    // Not an answer from our Worker. This happens with `npm run dev`, which
    // doesn't run the Worker.
  }
  if (!body || typeof body.ok !== 'boolean') {
    throw new ImportProblem('error', 'Import needs the Worker. To try it on your computer, use npm run preview (http://localhost:8787).')
  }
  if (body.ok) return body.recipe

  if (LINK_CODES.has(body.code)) throw new ImportProblem('fix-link', body.message)
  if (body.code === 'signed-out') throw new ImportProblem('error', body.message)
  throw new ImportProblem('manual', body.message, { site: body.site })
}

export async function importRecipe(text) {
  const url = checkShape(text)

  const existing = await findExisting(url.href)
  if (existing) {
    throw new ImportProblem('duplicate', 'This recipe is already in your library.', {
      recipeId: existing.id,
      recipeTitle: existing.title,
    })
  }

  const recipe = await askWorker(url.href)

  try {
    return await addRecipe({
      title: recipe.title,
      ingredients: recipe.ingredients.join('\n'),
      steps: recipe.steps.join('\n'),
      servings: recipe.servings,
      totalTime: recipe.totalTime,
      notes: '',
      sourceUrl: recipe.sourceUrl,
      imageUrl: recipe.imageUrl,
      // Marks it as imported, which locks the source link to credit the site.
      imported: true,
    })
  } catch (err) {
    throw new ImportProblem('error', err.message)
  }
}
