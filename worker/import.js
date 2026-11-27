import { readRecipe } from './recipe-data.js'
import { checkImportLink, LinkProblem } from './safe-url.js'

// Recipe import: POST /api/import with { "url": "https://..." }.
//
// The Worker only READS the recipe and sends it back. It never touches the
// database: the user's browser saves the recipe with the user's own sign-in,
// so the database's per-user security rules still apply and no secret key
// is ever needed.
//
// Answers:
//   200 { ok: true, recipe: { title, ingredients, steps, servings, totalTime, imageUrl, sourceUrl } }
//   4xx { ok: false, code, message, site }
// Codes: invalid-link, blocked-address, not-found (no such page),
// signed-out, blocked (the site refused), unavailable, timeout, too-big,
// not-a-page, no-recipe.

const TIME_LIMIT_MS = 10_000
const MAX_BYTES = 5 * 1024 * 1024 // 5 MB
const MAX_REDIRECTS = 3

// An honest name for the Worker when it visits recipe sites. It does not
// pretend to be a normal browser to get past a site's bot protection.
const USER_AGENT = 'RecipeIndexerImport/1.0 (imports one recipe for a private recipe library)'

class ImportProblem extends Error {
  constructor(code, message, status = 422) {
    super(message)
    this.code = code
    this.status = status
  }
}

function answer(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Robots-Tag': 'noindex',
    },
  })
}

// Asks Supabase whether the sign-in token belongs to a signed-in user.
async function isSignedIn(request, env) {
  const auth = request.headers.get('Authorization') ?? ''
  if (!auth.startsWith('Bearer ') || auth.length < 20) return false
  const res = await fetch(`${env.SUPABASE_URL}/auth/v1/user`, {
    headers: { apikey: env.SUPABASE_PUBLISHABLE_KEY, Authorization: auth },
    signal: AbortSignal.timeout(5_000),
  })
  return res.ok
}

// Fetches a page, following up to MAX_REDIRECTS redirects itself so that
// every new address gets the same safety check. Returns the final response
// and its address.
async function fetchPage(url, ownHost, signal) {
  let current = url
  for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
    const res = await fetch(current.href, {
      redirect: 'manual',
      signal,
      headers: { 'User-Agent': USER_AGENT, Accept: 'text/html,application/xhtml+xml' },
    })
    if (res.status >= 300 && res.status < 400 && res.headers.get('Location')) {
      res.body?.cancel()
      // Check the new address too (throws LinkProblem if it isn't allowed).
      current = checkImportLink(new URL(res.headers.get('Location'), current).href, ownHost)
      continue
    }
    return { res, finalUrl: current }
  }
  throw new ImportProblem('unavailable', 'The page redirected too many times.')
}

// Reads the page's text, giving up if it's bigger than MAX_BYTES.
async function readText(res) {
  const declared = Number(res.headers.get('Content-Length') ?? 0)
  if (declared > MAX_BYTES) {
    res.body?.cancel()
    throw new ImportProblem('too-big', 'That page is too big to import.')
  }
  if (!res.body) return ''
  const reader = res.body.getReader()
  const decoder = new TextDecoder()
  let text = ''
  let bytes = 0
  for (;;) {
    const { done, value } = await reader.read()
    if (done) break
    bytes += value.byteLength
    if (bytes > MAX_BYTES) {
      reader.cancel()
      throw new ImportProblem('too-big', 'That page is too big to import.')
    }
    text += decoder.decode(value, { stream: true })
  }
  return text + decoder.decode()
}

async function importFrom(link, ownHost) {
  const url = checkImportLink(link, ownHost)
  const signal = AbortSignal.timeout(TIME_LIMIT_MS)

  const { res, finalUrl } = await fetchPage(url, ownHost, signal)

  if ([401, 403, 429, 503].includes(res.status)) {
    res.body?.cancel()
    throw new ImportProblem('blocked', 'The site didn’t let us read the recipe.')
  }
  if (res.status === 404 || res.status === 410) {
    res.body?.cancel()
    throw new ImportProblem('not-found', 'That page wasn’t found. Check the link and try again.')
  }
  if (!res.ok) {
    res.body?.cancel()
    throw new ImportProblem('unavailable', `The site answered with an error (${res.status}).`)
  }
  const type = res.headers.get('Content-Type') ?? ''
  if (!/text\/html|application\/xhtml\+xml/i.test(type)) {
    res.body?.cancel()
    throw new ImportProblem('not-a-page', 'That link isn’t a web page.')
  }

  const html = await readText(res)
  const recipe = readRecipe(html, finalUrl.href)
  if (!recipe) throw new ImportProblem('no-recipe', 'We couldn’t find a recipe on that page.')

  // Save the link the user pasted (without any "#section"), so the
  // "already in your library" check matches next time.
  return { ...recipe, sourceUrl: url.href }
}

export async function handleImport(request, env) {
  if (request.method !== 'POST') {
    return answer({ ok: false, code: 'wrong-method', message: 'Use POST.' }, 405)
  }

  let link = ''
  try {
    const body = await request.json()
    link = typeof body?.url === 'string' ? body.url.slice(0, 2000) : ''
  } catch {
    // Handled below as an invalid link.
  }

  const ownHost = new URL(request.url).hostname
  // Site name for messages, e.g. "seriouseats.com" (only if the link can be read).
  let site = null
  try {
    site = new URL(link).hostname.replace(/^www\./, '')
  } catch {
    // Not a link; the check below explains.
  }

  try {
    if (!(await isSignedIn(request, env))) {
      throw new ImportProblem('signed-out', 'Please sign in again, then try the import.', 401)
    }
    const recipe = await importFrom(link, ownHost)
    console.log(`import ok: ${site}`)
    return answer({ ok: true, recipe })
  } catch (err) {
    let problem = err
    if (err instanceof LinkProblem) {
      problem = new ImportProblem(err.code, err.message, 400)
    } else if (err?.name === 'TimeoutError' || err?.name === 'AbortError') {
      problem = new ImportProblem('timeout', 'The site took too long to answer.')
    } else if (!(err instanceof ImportProblem)) {
      // Network failures, unknown site names, and other surprises.
      problem = new ImportProblem('unavailable', 'We couldn’t reach that site.')
    }
    // Log only the outcome and site name, never the user's sign-in token.
    console.log(`import ${problem.code}: ${site ?? 'invalid link'}`)
    return answer({ ok: false, code: problem.code, message: problem.message, site }, problem.status)
  }
}
