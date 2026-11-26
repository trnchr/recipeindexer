// Layout for text pages (How it works, Privacy, Terms): an "On this page"
// list on the left on wide screens, and the text on the right.
// `sections` is a list of { id, title } matching the ids on the page's <h2>s.
export default function DocPage({ title, updated, sections, children }) {
  return (
    <div className="doc">
      <header className="page-head doc__head">
        <h1 className="headline headline--display">{title}</h1>
        {updated && <p className="updated">Last updated {updated}</p>}
      </header>

      <nav className="doc__toc" aria-labelledby="toc-title">
        <h2 className="section-label" id="toc-title">
          On this page
        </h2>
        <ul className="toc-links">
          {sections.map((section) => (
            <li key={section.id}>
              <a href={`#${section.id}`}>{section.title}</a>
            </li>
          ))}
        </ul>
      </nav>

      <article className="doc__body prose">{children}</article>
    </div>
  )
}
