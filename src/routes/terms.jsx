import { Link } from 'react-router'
import ContactLine from '../components/ContactLine.jsx'
import { pageMeta } from '../lib/site.js'
import DocPage from '../components/DocPage.jsx'

export function meta() {
  return pageMeta({
    title: 'Terms of use',
    description: 'The rules for using Recipe Indexer, a private recipe library.',
    path: '/terms',
  })
}

const SECTIONS = [
  { id: 'the-service', title: 'The service' },
  { id: 'your-account', title: 'Your account' },
  { id: 'your-recipes', title: 'Your recipes' },
  { id: 'fair-use-of-the-service', title: 'Fair use of the service' },
  { id: 'no-guarantees', title: 'No guarantees' },
  { id: 'ending-your-account', title: 'Ending your account' },
  { id: 'changes-to-these-terms', title: 'Changes to these terms' },
  { id: 'contact', title: 'Contact' },
]

export default function Terms() {
  return (
    <DocPage
      title="Terms of use"
      updated="November 25, 2026"
      sections={SECTIONS}
    >
      <p className="lede">By using Recipe Indexer, you agree to these terms. They’re short, so please read them.</p>

      <h2 id="the-service">The service</h2>
      <p>
        Recipe Indexer lets you keep a private library of recipes and search it by ingredient. It’s free and in early
        testing, so features may change, and parts of it may not always work.
      </p>

      <h2 id="your-account">Your account</h2>
      <p>
        You sign in with a Google account, and you’re responsible for what happens under it. Keep your Google account
        secure.
      </p>

      <h2 id="your-recipes">Your recipes</h2>
      <ul>
        <li>Recipes you type in are yours. We only store them so you can use them.</li>
        <li>
          Recipes you save from other websites belong to their authors. Recipe Indexer keeps them in your private
          library for your personal use; don’t republish them as your own.
        </li>
      </ul>

      <h2 id="fair-use-of-the-service">Fair use of the service</h2>
      <p>Don’t use Recipe Indexer to:</p>
      <ul>
        <li>break the law or anyone else’s rights;</li>
        <li>try to get into other people’s accounts or data;</li>
        <li>overload, scrape, or interfere with the site.</li>
      </ul>
      <p>We may suspend accounts that do.</p>

      <h2 id="no-guarantees">No guarantees</h2>
      <p>
        Recipe Indexer is provided “as is.” We work to keep your recipes safe, but we can’t promise the service will
        always be available or that data will never be lost, so keep copies of recipes that matter to you. To the extent
        the law allows, we aren’t liable for losses caused by using the service.
      </p>

      <h2 id="ending-your-account">Ending your account</h2>
      <p>
        You can stop using Recipe Indexer at any time and ask us to delete your account (see the{' '}
        <Link to="/privacy">privacy policy</Link>). We may end the service or an account, and if we shut the service
        down we’ll give signed-in users notice first.
      </p>

      <h2 id="changes-to-these-terms">Changes to these terms</h2>
      <p>If we change these terms, we’ll update the date at the top of this page.</p>

      <h2 id="contact">Contact</h2>
      <p>
        Questions about these terms: <ContactLine />.
      </p>
    </DocPage>
  )
}
