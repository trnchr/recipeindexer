import { Link } from 'react-router'
import { pageMeta } from '../lib/site.js'

export function meta() {
  return pageMeta({
    title: 'Page not found',
    description: 'This page doesn’t exist.',
    noindex: true,
  })
}

export default function NotFound() {
  return (
    <header className="page-head">
      <h1 className="headline headline--display">Page not found</h1>
      <p className="lede">This page doesn’t exist. It may have moved.</p>
      <p>
        <Link to="/">Back to the home page</Link>
      </p>
    </header>
  )
}
