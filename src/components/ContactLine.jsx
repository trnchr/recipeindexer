import { CONTACT_EMAIL } from '../lib/site.js'

// The contact address from src/lib/site.js, or a clear placeholder until it's set.
export default function ContactLine() {
  if (CONTACT_EMAIL) {
    return <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
  }
  return <strong>[contact email coming soon]</strong>
}
