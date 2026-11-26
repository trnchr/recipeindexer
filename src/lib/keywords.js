// Turns ingredient lines into search keywords, using simple rules (no AI).
//
//   "2 lbs boneless chicken thighs"  ->  ["chicken", "thigh"]
//   "1 tsp ground cumin"             ->  ["cumin"]
//   "Salt and pepper to taste"       ->  ["salt", "pepper"]
//
// The rules:
//   1. Skip section headings like "For the sauce:".
//   2. Ignore anything in (parentheses) and anything after the first comma
//      ("1 onion, finely chopped" -> "1 onion").
//   3. Drop numbers, amounts, and units ("2", "1/2", "lbs", "cups").
//   4. Drop describing and filler words ("boneless", "chopped", "to taste").
//   5. Lowercase everything and make simple plurals singular ("thighs" -> "thigh").
//
// Search will run the words you type through normalizeWord() too, so
// "Thighs" in a search box matches "thigh" in a recipe.

// Measurements and containers: an amount, not an ingredient.
const UNITS = new Set([
  'tsp', 'teaspoon', 'tbsp', 'tbs', 'tablespoon', 'cup', 'c', 'oz', 'ounce',
  'fl', 'lb', 'lbs', 'pound', 'g', 'gram', 'kg', 'kilogram', 'mg', 'ml',
  'milliliter', 'l', 'liter', 'litre', 'quart', 'qt', 'pint', 'pt', 'gallon',
  'pinch', 'dash', 'splash', 'handful', 'can', 'jar', 'bottle', 'package',
  'pkg', 'packet', 'bag', 'box', 'container', 'carton', 'stick', 'slice',
  'piece', 'bunch', 'sprig', 'head', 'inch', 'cm', 'x',
])

// Words that describe an ingredient or fill out the sentence.
const FILLER = new Set([
  // little words
  'a', 'an', 'the', 'and', 'or', 'of', 'for', 'to', 'with', 'into', 'in',
  'on', 'at', 'as', 'about', 'plus', 'more', 'some', 'few', 'each', 'per',
  // sizes and amounts in words
  'large', 'medium', 'small', 'big', 'whole', 'half', 'heaping', 'level',
  'scant', 'generous', 'extra', 'one', 'two', 'three', 'four', 'five', 'six',
  'dozen',
  // preparation
  'boneless', 'skinless', 'chopped', 'minced', 'diced', 'sliced', 'cubed',
  'grated', 'shredded', 'crushed', 'peeled', 'seeded', 'trimmed', 'halved',
  'quartered', 'julienned', 'mashed', 'beaten', 'melted', 'softened',
  'thawed', 'drained', 'rinsed', 'packed', 'sifted', 'cut', 'cube',
  'finely', 'roughly', 'coarsely', 'thinly', 'thickly', 'lightly',
  'freshly', 'fresh', 'ground', 'dried', 'frozen', 'cooked', 'uncooked',
  'raw', 'ripe', 'room', 'temperature', 'cold', 'warm', 'hot',
  'unsalted', 'virgin', 'all', 'purpose',
  // instructions mixed into the line
  'taste', 'optional', 'divided', 'needed', 'serving', 'garnish', 'like',
])

// Plurals the simple rules below would get wrong.
const PLURAL_EXCEPTIONS = {
  leaves: 'leaf',
  halves: 'half',
  loaves: 'loaf',
  knives: 'knife',
  cookies: 'cookie',
  brownies: 'brownie',
  smoothies: 'smoothie',
  veggies: 'veggie',
  molasses: 'molasses',
  hummus: 'hummus',
}

// Lowercases a word and makes simple plurals singular.
export function normalizeWord(word) {
  const w = word.toLowerCase()
  if (PLURAL_EXCEPTIONS[w]) return PLURAL_EXCEPTIONS[w]
  if (w.length > 4 && w.endsWith('ies')) return w.slice(0, -3) + 'y' // berries -> berry
  if (w.length > 4 && w.endsWith('oes')) return w.slice(0, -2) // tomatoes -> tomato
  if (/(ch|sh|x|ss)es$/.test(w)) return w.slice(0, -2) // peaches -> peach
  if (w.length > 3 && w.endsWith('s') && !/(ss|us|is)$/.test(w)) return w.slice(0, -1) // thighs -> thigh
  return w
}

// Keywords for one ingredient line, in the order they appear.
function keywordsForLine(line) {
  const text = line.trim()
  if (text.endsWith(':')) return [] // a heading like "For the sauce:"

  const words = text
    .replace(/\([^)]*\)/g, ' ') // drop "(about 2 cups)"
    .split(',')[0] // drop ", finely chopped"
    .match(/\p{L}+/gu) // keep only runs of letters, so numbers and "1/2" fall away
  if (!words) return []

  return words
    .map(normalizeWord)
    .filter((w) => w.length > 1 && !UNITS.has(w) && !FILLER.has(w))
}

// Keywords for a whole recipe: every line's keywords, with repeats removed.
export function makeKeywords(ingredientLines) {
  const all = ingredientLines.flatMap(keywordsForLine)
  return [...new Set(all)]
}
