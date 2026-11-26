import ContactLine from '../components/ContactLine.jsx'
import { pageMeta } from '../lib/site.js'
import DocPage from '../components/DocPage.jsx'

export function meta() {
  return pageMeta({
    title: 'Privacy policy',
    description: 'What Recipe Indexer stores about you, who can see it, and how to delete it.',
    path: '/privacy',
  })
}

const SECTIONS = [
  { id: 'what-we-collect', title: 'What we collect' },
  { id: 'what-we-dont-do', title: 'What we don’t do' },
  { id: 'who-can-see-your-recipes', title: 'Who can see your recipes' },
  { id: 'services-we-use', title: 'Services we use' },
  { id: 'whats-stored-in-your-browser', title: 'What’s stored in your browser' },
  { id: 'deleting-your-data', title: 'Deleting your data' },
  { id: 'children', title: 'Children' },
  { id: 'changes-to-this-policy', title: 'Changes to this policy' },
  { id: 'contact', title: 'Contact' },
]

export default function Privacy() {
  return (
    <DocPage
      title="Privacy policy"
      updated="November 25, 2026"
      sections={SECTIONS}
    >
      <p className="lede">
        Recipe Indexer is a private recipe library. This page explains what we store, why, and who can see it.
      </p>

      <h2 id="what-we-collect">What we collect</h2>
      <ul>
        <li>
          <strong>From your Google account, when you sign in:</strong> your name, email address, profile photo, and
          Google account ID. We use these to create your account and show you who you’re signed in as.
        </li>
        <li>
          <strong>Your recipes:</strong> the recipes you save or type in, including links to the pages they came from
          and links to their photos.
        </li>
        <li>
          <strong>Basic technical information:</strong> our hosting provider handles your IP address and similar
          request details to deliver the site and protect it from abuse.
        </li>
      </ul>

      <h2 id="what-we-dont-do">What we don’t do</h2>
      <ul>
        <li>We don’t sell your information or share it with advertisers.</li>
        <li>We don’t show ads.</li>
        <li>We don’t use analytics or tracking cookies.</li>
      </ul>

      <h2 id="who-can-see-your-recipes">Who can see your recipes</h2>
      <p>
        Only you. Your library is private, and the database only lets each account read its own recipes. There are no
        public profiles and no sharing.
      </p>

      <h2 id="services-we-use">Services we use</h2>
      <p>
        These companies run parts of Recipe Indexer and process data on our behalf. Their servers may be outside your
        country.
      </p>
      <ul>
        <li>
          <strong>Google:</strong> sign-in. Your profile photo is loaded from Google’s servers.
        </li>
        <li>
          <strong>Supabase:</strong> stores your account and recipes.
        </li>
        <li>
          <strong>Cloudflare:</strong> hosts the website.
        </li>
      </ul>

      <h2 id="whats-stored-in-your-browser">What’s stored in your browser</h2>
      <p>
        To keep you signed in, your browser stores a sign-in token for this site. Signing out removes it. We don’t use
        any other cookies or storage.
      </p>

      <h2 id="deleting-your-data">Deleting your data</h2>
      <p>
        You can ask us to delete your account and everything in it at any time by emailing <ContactLine />. We’ll
        delete it within 30 days.
      </p>

      <h2 id="children">Children</h2>
      <p>Recipe Indexer isn’t meant for children under 13, and we don’t knowingly collect their information.</p>

      <h2 id="changes-to-this-policy">Changes to this policy</h2>
      <p>
        If we change this policy, we’ll update the date at the top of this page. If a change matters, we’ll tell signed-in
        users on the site.
      </p>

      <h2 id="contact">Contact</h2>
      <p>
        Questions about your privacy: <ContactLine />.
      </p>
    </DocPage>
  )
}
