import { Link } from 'react-router'
import { useLibraryAddress } from '../lib/libraryAddress.js'

// "← Back to your recipes", a plain text link. Returns to the
// library with the search you came from. `bottom` adds space above it, for
// a second copy at the end of a long page.
export default function BackToRecipes({ bottom = false }) {
  return (
    <p className={bottom ? 'back-link back-link--bottom' : 'back-link'}>
      <Link to={useLibraryAddress()}>← Back to your recipes</Link>
    </p>
  )
}
