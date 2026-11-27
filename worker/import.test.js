// Tests for recipe import. Run with: npm test
// Uses Node's built-in test runner (no extra packages). The sample pages are
// made up for these tests, not copied from real recipe sites.
import assert from 'node:assert/strict'
import { describe, test } from 'node:test'
import { cleanText, describeMinutes, readRecipe } from './recipe-data.js'
import { checkImportLink } from './safe-url.js'

const OWN_HOST = 'recipes.example.org'

// Wraps JSON-LD data in a minimal web page.
function page(...data) {
  const scripts = data.map((d) => `<script type="application/ld+json">${typeof d === 'string' ? d : JSON.stringify(d)}</script>`)
  return `<!doctype html><html><head><title>Test</title>${scripts.join('')}</head><body><p>Hello</p></body></html>`
}

const BASIC = {
  '@context': 'https://schema.org',
  '@type': 'Recipe',
  name: 'Weeknight Chicken &amp; Rice',
  recipeIngredient: ['2 lbs chicken thighs', '1 cup rice', '  1 tsp   cumin '],
  recipeInstructions: [
    { '@type': 'HowToStep', text: 'Season the chicken.' },
    { '@type': 'HowToStep', text: '<p>Cook the rice.</p>' },
  ],
  recipeYield: ['4', '4 servings'],
  totalTime: 'PT1H15M',
  image: { '@type': 'ImageObject', url: '/photos/chicken.jpg' },
}

describe('which links are allowed', () => {
  const allowed = ['https://www.seriouseats.com/best-chili', 'http://cooking.example.com/r/1?x=2#comments']
  for (const link of allowed) {
    test(`allows ${link}`, () => {
      assert.doesNotThrow(() => checkImportLink(link, OWN_HOST))
    })
  }

  test('drops the #section part', () => {
    assert.equal(checkImportLink('https://site.com/r#jump', OWN_HOST).href, 'https://site.com/r')
  })

  const refused = [
    'ftp://site.com/recipe',
    'javascript:alert(1)',
    'file:///etc/passwd',
    'not a link',
    'http://localhost/',
    'http://LOCALHOST./',
    'http://app.localhost/',
    'http://router/',
    'http://printer.local/',
    'http://db.internal/',
    'http://nas.home.arpa/',
    'http://127.0.0.1/',
    'http://10.0.0.5/',
    'http://192.168.1.1/',
    'http://169.254.169.254/latest/meta-data/',
    'http://8.8.8.8/',
    'http://2130706433/', // 127.0.0.1 written as one number
    'http://0x7f.0.0.1/', // 127.0.0.1 written in hex
    'http://[::1]/',
    'http://[::ffff:127.0.0.1]/',
    'https://site.com:8080/recipe',
    'https://user:pass@site.com/recipe',
    `https://${OWN_HOST}/library`,
  ]
  for (const link of refused) {
    test(`refuses ${link}`, () => {
      assert.throws(() => checkImportLink(link, OWN_HOST), (err) => ['invalid-link', 'blocked-address'].includes(err.code))
    })
  }
})

describe('reading a recipe from a page', () => {
  test('reads a simple recipe', () => {
    const recipe = readRecipe(page(BASIC), 'https://site.com/recipes/chicken')
    assert.deepEqual(recipe, {
      title: 'Weeknight Chicken & Rice',
      ingredients: ['2 lbs chicken thighs', '1 cup rice', '1 tsp cumin'],
      steps: ['Season the chicken.', 'Cook the rice.'],
      servings: '4 servings',
      totalTime: '1 hour 15 minutes',
      imageUrl: 'https://site.com/photos/chicken.jpg',
    })
  })

  test('finds the recipe inside an @graph group with other data', () => {
    const data = {
      '@context': 'https://schema.org',
      '@graph': [{ '@type': 'WebSite', name: 'A site' }, { '@type': 'BreadcrumbList' }, { ...BASIC, '@type': ['Recipe', 'NewsArticle'] }],
    }
    assert.equal(readRecipe(page(data), 'https://site.com/').title, 'Weeknight Chicken & Rice')
  })

  test('finds the recipe in a later script tag, skipping broken ones', () => {
    const html = page('{ this is not json', { '@type': 'Organization', name: 'Org' }, [BASIC])
    assert.equal(readRecipe(html, 'https://site.com/').ingredients.length, 3)
  })

  test('handles steps grouped into sections, and numbered steps', () => {
    const data = {
      ...BASIC,
      recipeInstructions: [
        { '@type': 'HowToSection', name: 'For the sauce', itemListElement: [{ '@type': 'HowToStep', text: '1. Melt butter.' }] },
        { '@type': 'HowToSection', name: 'To finish', itemListElement: [{ '@type': 'HowToStep', text: 'Step 2: Serve.' }] },
      ],
    }
    assert.deepEqual(readRecipe(page(data), 'https://site.com/').steps, ['Melt butter.', 'Serve.'])
  })

  test('splits steps written as one block of text', () => {
    const data = { ...BASIC, recipeInstructions: 'Boil water.\nAdd pasta.<br>Drain.' }
    assert.deepEqual(readRecipe(page(data), 'https://site.com/').steps, ['Boil water.', 'Add pasta.', 'Drain.'])
  })

  test('adds prep and cook time when there is no total time', () => {
    const { totalTime: _unused, ...rest } = BASIC
    const data = { ...rest, prepTime: 'PT20M', cookTime: 'PT25M' }
    assert.equal(readRecipe(page(data), 'https://site.com/').totalTime, '45 minutes')
  })

  test('handles a number for servings and a list of photo links', () => {
    const data = { ...BASIC, recipeYield: 6, image: ['https://cdn.site.com/a.jpg', 'https://cdn.site.com/b.jpg'] }
    const recipe = readRecipe(page(data), 'https://site.com/')
    assert.equal(recipe.servings, '6')
    assert.equal(recipe.imageUrl, 'https://cdn.site.com/a.jpg')
  })

  test('ignores photo links that are not web links', () => {
    const data = { ...BASIC, image: 'javascript:alert(1)' }
    assert.equal(readRecipe(page(data), 'https://site.com/').imageUrl, '')
  })

  test('removes web code from text', () => {
    const data = { ...BASIC, name: '<b>Best</b> <img src=x onerror="alert(1)">Pie &lt;i&gt;' }
    assert.equal(readRecipe(page(data), 'https://site.com/').title, 'Best Pie')
  })

  test('returns nothing when the page has no recipe', () => {
    assert.equal(readRecipe('<html><body>No data here</body></html>', 'https://site.com/'), null)
    assert.equal(readRecipe(page({ '@type': 'Article', name: 'News' }), 'https://site.com/'), null)
  })

  test('returns nothing when the recipe has no ingredients', () => {
    assert.equal(readRecipe(page({ ...BASIC, recipeIngredient: [] }), 'https://site.com/'), null)
  })

  test('limits how many ingredient lines are kept', () => {
    const data = { ...BASIC, recipeIngredient: Array.from({ length: 500 }, (_, i) => `item ${i}`) }
    assert.equal(readRecipe(page(data), 'https://site.com/').ingredients.length, 200)
  })
})

describe('text helpers', () => {
  test('decodes codes, including double-encoded ones', () => {
    assert.equal(cleanText('Mom&#39;s &amp;amp; Dad&rsquo;s &frac12; cup', 100), 'Mom\'s & Dad’s ½ cup')
  })

  test('cuts long text', () => {
    assert.equal(cleanText('a'.repeat(50), 10).length, 10)
  })

  test('describes times', () => {
    assert.equal(describeMinutes(90), '1 hour 30 minutes')
    assert.equal(describeMinutes(60), '1 hour')
    assert.equal(describeMinutes(1), '1 minute')
  })
})
