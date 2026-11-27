import { normalizeWord } from './keywords.js'
import { LIST_COLUMNS } from './recipes.js'
import { supabase } from './supabase.js'

// All ingredient search logic lives in this file. Pages only call
// toSearchWords() and searchRecipes(), so how search works can change later
// (for example, moving it into the database) without touching any page.
//
// How it works today:
//   - A recipe matches only if it has EVERY word you searched for.
//   - A word matches the start of a recipe keyword, so "chick" finds
//     "chicken" (and also "chickpea"), and "pepper" finds "peppercorn".
//   - Searched words get the same cleanup as saved keywords, so "Thighs"
//     finds "thigh".
//   - The browser does the matching. It loads every recipe's keyword list
//     (small, even for hundreds of recipes) and checks each one. The
//     database's security rules still mean you only ever get your own
//     recipes.

// Turns typed text into search words: lowercase letters only, repeats
// removed. "Chicken thigh, cumin" -> ["chicken", "thigh", "cumin"].
export function toSearchWords(text) {
  const words = text.toLowerCase().match(/\p{L}+/gu) ?? []
  return [...new Set(words)]
}

// True if one search word matches the start of one of the recipe's keywords.
// Checks the word as typed, in its singular form ("berries" -> "berry"), and
// with a half-typed "-ies" ending turned back into "y" ("berri" -> "berry").
function wordMatches(word, keywords) {
  const forms = [word, normalizeWord(word), word.replace(/ie?$/, 'y')]
  return keywords.some((keyword) => forms.some((form) => keyword.startsWith(form)))
}

// The signed-in user's recipes that contain every search word, newest
// first, in the same shape as listRecipes(). Throws an Error whose message
// can be shown to the user.
export async function searchRecipes(words) {
  const { data, error } = await supabase
    .from('recipes')
    .select(`${LIST_COLUMNS}, keywords`)
    .order('created_at', { ascending: false })

  if (error) throw new Error('The search could not be run. Please try again.')

  return data
    .filter((recipe) => words.every((word) => wordMatches(word, recipe.keywords)))
    .map(({ keywords: _keywords, ...recipe }) => recipe)
}
