import { Link } from 'react-router'
import { pageMeta } from '../lib/site.js'
import DocPage from '../components/DocPage.jsx'

export function meta() {
  return pageMeta({
    title: 'How it works',
    description:
      'Recipe Indexer keeps the recipes you save from any website, plus your own, in one private library you can search by ingredient.',
    path: '/how-it-works',
  })
}

const SECTIONS = [
  { id: 'save-recipes-from-any-site', title: 'Save recipes from any site' },
  { id: 'type-in-your-own', title: 'Type in your own' },
  { id: 'search-by-the-ingredients-you-have', title: 'Search by the ingredients you have' },
  { id: 'private-by-design', title: 'Private by design' },
]

export default function HowItWorks() {
  return (
    <DocPage
      title="How it works"
      sections={SECTIONS}
    >
      <p className="lede">
        Recipe Indexer is a private recipe library. You keep the recipes you love in one place, then find them by
        what’s already in your kitchen.
      </p>

      <p className="status-note">
        Recipe Indexer is in early testing. Signing in works today; saving recipes and ingredient search are being
        built now.
      </p>

      <h2 id="save-recipes-from-any-site">Save recipes from any site</h2>
      <p>
        Paste the link to a recipe page. Most recipe sites publish the recipe’s details in a standard format behind the
        scenes, and Recipe Indexer reads that, so you get the ingredients and steps without the ads or the life story.
        If a page doesn’t include those details, you can type the recipe in instead.
      </p>

      <h2 id="type-in-your-own">Type in your own</h2>
      <p>
        Family recipes, notes on a card, things you’ve worked out yourself: add them by hand and they sit right next to
        the ones you saved from the web.
      </p>

      <h2 id="search-by-the-ingredients-you-have">Search by the ingredients you have</h2>
      <p>
        List what you have, say <mark>chicken</mark> and <mark>miso</mark>, and you’ll see every saved recipe that
        uses all of them. Each recipe keeps its ingredient list exactly as written, plus a simple list of the
        ingredients themselves, so “2 lbs boneless chicken thighs” is found by a search for chicken.
      </p>

      <h2 id="private-by-design">Private by design</h2>
      <p>
        Your library is yours. Only you can see the recipes you save; there’s no public profile and nothing is shared.
        Read the <Link to="/privacy">privacy policy</Link> for the details.
      </p>
    </DocPage>
  )
}
