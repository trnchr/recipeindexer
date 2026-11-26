import { NavLink } from 'react-router'

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <nav aria-label="Site">
          <ul className="footer-links">
            <li>
              <NavLink to="/how-it-works">How it works</NavLink>
            </li>
            <li>
              <NavLink to="/privacy">Privacy</NavLink>
            </li>
            <li>
              <NavLink to="/terms">Terms</NavLink>
            </li>
          </ul>
        </nav>
        <p className="fine-print">Early test version. Only you can see the recipes you save.</p>
      </div>
    </footer>
  )
}
