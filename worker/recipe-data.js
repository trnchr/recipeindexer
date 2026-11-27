// Reads a recipe out of a web page's HTML, using the schema.org "Recipe"
// data that most recipe sites embed for search engines (JSON-LD, inside
// <script type="application/ld+json"> tags). No AI, just reading that data.
//
// This file only works with text, so it can be tested on its own
// (see recipe-data.test.js). worker/import.js does the fetching.

// Size limits for what an imported recipe can contain.
export const LIMITS = {
  title: 200,
  line: 500, // one ingredient line
  step: 2000, // one step
  lines: 200, // ingredient lines, and also steps
  short: 100, // servings, total time
  link: 2000,
}

// ---------------------------------------------------------------------------
// Finding the data in the page

const LD_JSON_SCRIPT = /<script\b[^>]*\btype\s*=\s*["']?application\/ld\+json["']?[^>]*>([\s\S]*?)<\/script\s*>/gi

// The text inside every JSON-LD script tag on the page.
export function jsonLdBlocks(html) {
  return [...html.matchAll(LD_JSON_SCRIPT)].map((match) => match[1])
}

// Reads one block of JSON-LD text. Returns null if it isn't valid JSON.
function parseBlock(text) {
  const cleaned = text
    .trim()
    // Some sites wrap the data in <!-- --> or CDATA markers.
    .replace(/^<!--|-->$/g, '')
    .replace(/^\s*\/\/\s*<!\[CDATA\[|\/\/\s*\]\]>\s*$/g, '')
    .trim()
  try {
    return JSON.parse(cleaned)
  } catch {
    return null
  }
}

// True for things marked as a Recipe ("Recipe", ["Recipe", "NewsArticle"],
// or "http://schema.org/Recipe").
function isRecipe(thing) {
  const types = [thing['@type']].flat()
  return types.some((type) => typeof type === 'string' && /(^|[/:])recipe$/i.test(type))
}

// Looks through some JSON-LD data (objects, lists, "@graph" groups, and
// "mainEntity" links) for the first Recipe. Returns it or null.
function findRecipeIn(data, depth = 0) {
  if (depth > 6 || data === null || typeof data !== 'object') return null
  if (Array.isArray(data)) {
    for (const item of data) {
      const found = findRecipeIn(item, depth + 1)
      if (found) return found
    }
    return null
  }
  if (isRecipe(data)) return data
  return findRecipeIn(data['@graph'], depth + 1) ?? findRecipeIn(data.mainEntity, depth + 1)
}

// The first Recipe in the page's HTML, or null if there isn't one.
export function findRecipe(html) {
  for (const block of jsonLdBlocks(html)) {
    const found = findRecipeIn(parseBlock(block))
    if (found) return found
  }
  return null
}

// ---------------------------------------------------------------------------
// Cleaning up text

const NAMED_ENTITIES = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ',
  ndash: '–', mdash: '—', hellip: '…', deg: '°', times: '×',
  lsquo: '‘', rsquo: '’', ldquo: '“', rdquo: '”',
  frac12: '½', frac14: '¼', frac34: '¾', frac13: '⅓', frac23: '⅔',
  eacute: 'é', egrave: 'è', agrave: 'à', ccedil: 'ç', ntilde: 'ñ', uuml: 'ü', ouml: 'ö', auml: 'ä',
}

// Turns codes like "&amp;", "&#39;", and "&#x2019;" into the characters they stand for.
function decodeEntities(text) {
  return text.replace(/&(#x[0-9a-f]+|#\d+|[a-z][a-z0-9]*);/gi, (whole, code) => {
    if (code[0] === '#') {
      const number = code[1].toLowerCase() === 'x' ? parseInt(code.slice(2), 16) : parseInt(code.slice(1), 10)
      return number > 0 && number <= 0x10ffff ? String.fromCodePoint(number) : whole
    }
    return NAMED_ENTITIES[code.toLowerCase()] ?? whole
  })
}

// Plain, tidy text: web code (tags) removed, codes decoded, spaces and line
// breaks squeezed to single spaces, and cut to `max` characters.
export function cleanText(value, max) {
  if (typeof value !== 'string' && typeof value !== 'number') return ''
  let text = String(value).replace(/<[^>]*>/g, ' ')
  // Some sites encode twice ("&amp;amp;"), so decode up to two times.
  text = decodeEntities(decodeEntities(text))
  text = text.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  return text.length > max ? text.slice(0, max - 1).trimEnd() + '…' : text
}

// ---------------------------------------------------------------------------
// The recipe's parts

function ingredientLines(recipe) {
  const raw = [recipe.recipeIngredient ?? recipe.ingredients ?? []].flat()
  return raw
    .map((line) => cleanText(line, LIMITS.line))
    .filter(Boolean)
    .slice(0, LIMITS.lines)
}

// Steps come in many shapes: one block of text, a list of text, a list of
// HowToStep objects ({ text }), or HowToSection groups that hold more steps.
function collectSteps(value, out, depth = 0) {
  if (depth > 4 || value === null || value === undefined) return
  if (typeof value === 'string') {
    // One big block: split on line breaks (or HTML line breaks and paragraphs).
    const parts = value.split(/<br\s*\/?>|<\/p>|<\/li>|\r?\n/i)
    for (const part of parts) {
      const step = cleanText(part, LIMITS.step)
      if (step) out.push(step)
    }
    return
  }
  if (Array.isArray(value)) {
    for (const item of value) collectSteps(item, out, depth + 1)
    return
  }
  if (typeof value === 'object') {
    if (value.itemListElement) {
      collectSteps(value.itemListElement, out, depth + 1)
    } else {
      const step = cleanText(value.text ?? value.name ?? '', LIMITS.step)
      if (step) out.push(step)
    }
  }
}

function stepList(recipe) {
  const steps = []
  collectSteps(recipe.recipeInstructions, steps)
  // Remove numbering like "1." or "Step 2:", since steps are numbered when shown.
  return steps
    .map((step) => step.replace(/^(step\s*)?\d+\s*[.):-]\s*/i, ''))
    .filter(Boolean)
    .slice(0, LIMITS.lines)
}

// "4", ["4", "4 servings"] -> "4 servings" (prefers the one with words).
function servings(recipe) {
  const options = [recipe.recipeYield ?? recipe.yield ?? []]
    .flat()
    .map((value) => cleanText(value, LIMITS.short))
    .filter(Boolean)
  return options.find((option) => /\p{L}/u.test(option)) ?? options[0] ?? ''
}

// Reads an ISO 8601 length of time like "PT1H30M" or "P1DT2H" into minutes.
// Returns null if it isn't in that format.
function durationMinutes(value) {
  const match = typeof value === 'string' && value.trim().match(/^P(?:(\d+(?:\.\d+)?)D)?(?:T(?:(\d+(?:\.\d+)?)H)?(?:(\d+(?:\.\d+)?)M)?(?:(\d+(?:\.\d+)?)S)?)?$/i)
  if (!match) return null
  const [, days, hours, minutes, seconds] = match.map((part) => Number(part ?? 0))
  return Math.round(days * 1440 + hours * 60 + minutes + seconds / 60)
}

// 90 -> "1 hour 30 minutes", 45 -> "45 minutes", 1500 -> "25 hours".
export function describeMinutes(total) {
  const hours = Math.floor(total / 60)
  const minutes = total % 60
  const parts = []
  if (hours > 0) parts.push(hours === 1 ? '1 hour' : `${hours} hours`)
  if (minutes > 0) parts.push(minutes === 1 ? '1 minute' : `${minutes} minutes`)
  return parts.join(' ')
}

// Total time: totalTime if given, otherwise prep + cook time added up.
function totalTime(recipe) {
  const total = durationMinutes(recipe.totalTime)
  if (total) return describeMinutes(total)
  const prep = durationMinutes(recipe.prepTime) ?? 0
  const cook = durationMinutes(recipe.cookTime) ?? 0
  if (prep + cook > 0) return describeMinutes(prep + cook)
  // Not in the usual format: keep it only if it reads like plain words ("45 minutes").
  const text = cleanText(recipe.totalTime, LIMITS.short)
  return /^\d/.test(text) && /\p{L}/u.test(text) ? text : ''
}

// The photo link: a link, a list of links, or an ImageObject ({ url }).
// Made into a full https:// link and checked, or '' if there isn't a usable one.
function imageLink(recipe, pageUrl) {
  let image = recipe.image
  if (Array.isArray(image)) image = image[0]
  if (image && typeof image === 'object') image = image.url ?? image.contentUrl
  if (typeof image !== 'string') return ''
  try {
    const url = new URL(decodeEntities(image.trim()), pageUrl)
    if (url.protocol !== 'https:' && url.protocol !== 'http:') return ''
    return url.href.length <= LIMITS.link ? url.href : ''
  } catch {
    return ''
  }
}

// Turns a page's HTML into the recipe's parts, or returns null if the page
// has no usable recipe (it needs at least a title and one ingredient).
export function readRecipe(html, pageUrl) {
  const recipe = findRecipe(html)
  if (!recipe) return null

  const result = {
    title: cleanText(recipe.name ?? recipe.headline, LIMITS.title),
    ingredients: ingredientLines(recipe),
    steps: stepList(recipe),
    servings: servings(recipe),
    totalTime: totalTime(recipe),
    imageUrl: imageLink(recipe, pageUrl),
  }
  if (!result.title || result.ingredients.length === 0) return null
  return result
}
