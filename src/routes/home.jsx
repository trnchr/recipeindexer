import { useState } from 'react'
import { Link } from 'react-router'
import GoogleButton from '../components/GoogleButton.jsx'
import { useSession } from '../lib/auth.js'
import { pageMeta } from '../lib/site.js'

export function meta() {
  return pageMeta({
    description:
      'Save recipes from any website or type in your own, then find them by the ingredients you have. A private recipe library, free to use.',
    path: '/',
  })
}

// Made-up recipes that show how ingredient search works.
const SAMPLE_RESULTS = [
  { name: 'Miso-glazed chicken thighs', time: '35 min', ingredients: ['chicken', 'miso', 'honey', 'garlic'] },
  { name: 'Chicken miso ramen', time: '50 min', ingredients: ['chicken', 'miso', 'ramen noodles', 'egg', 'scallion'] },
  { name: 'Miso butter roast chicken', time: '1 hr 20 min', ingredients: ['chicken', 'miso', 'butter', 'lemon'] },
  { name: 'Miso-ginger chicken stir-fry', time: '25 min', ingredients: ['chicken', 'miso', 'ginger', 'broccoli'] },
  { name: 'Sheet-pan miso chicken and sweet potatoes', time: '45 min', ingredients: ['chicken', 'miso', 'sweet potato', 'sesame'] },
  { name: 'Miso chicken meatballs', time: '30 min', ingredients: ['chicken', 'miso', 'panko', 'scallion'] },
]
const SAMPLE_SEARCH = ['chicken', 'miso']

const STEPS = [
  { name: 'Save from any recipe site', detail: 'Paste a link and keep just the ingredients and steps.' },
  { name: 'Type in your own', detail: 'Family recipes and notes, in the same place.' },
  { name: 'Search by what you have', detail: 'List your ingredients and see every recipe that uses them all.' },
]

function StartCta() {
  const session = useSession()
  const [error, setError] = useState(null)

  if (session) {
    return (
      <Link className="btn-primary" to="/library">
        Go to your recipes
      </Link>
    )
  }
  return (
    <div className="cta-action">
      <GoogleButton onError={setError} />
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

export default function Home() {
  return (
    <>
      <header className="hero">
        <h1 className="hero-title">All your recipes, searchable by ingredient.</h1>
        <p className="hero-lede">
          Save recipes from any site or type in your own, all in one private library. Then list the ingredients you have and see only the recipes that use them.
        </p>
      </header>

      <div className="home-stack">
        <section className="panel" aria-labelledby="steps-title">
          <h2 className="section-label" id="steps-title">
            How it works
          </h2>
          <ul className="menu menu--steps">
            {STEPS.map((step) => (
              <li className="menu-item" key={step.name}>
                <p className="menu-name menu-name--quiet">{step.name}</p>
                <p className="menu-detail">{step.detail}</p>
              </li>
            ))}
          </ul>
          <p className="more-link">
            <Link to="/how-it-works">More about how it works</Link>
          </p>
        </section>

        <section className="panel panel--example" aria-labelledby="example-title">
          <h2 className="section-label" id="example-title">
            Example search
          </h2>

          <div className="search-sample" role="group" aria-label="Example search for chicken and miso">
            {SAMPLE_SEARCH.map((word) => (
              <span className="chip" key={word}>
                {word}
              </span>
            ))}
            <span className="search-sample__hint" aria-hidden="true">
              Add an ingredient…
            </span>
          </div>

          <p className="count-label">{SAMPLE_RESULTS.length} recipes have both</p>

          <ul className="menu menu--results">
            {SAMPLE_RESULTS.map((recipe) => (
              <li className="menu-item" key={recipe.name}>
                <p className="menu-line">
                  <span className="menu-name">{recipe.name}</span>
                  <span className="leader" aria-hidden="true" />
                  <span className="menu-time">{recipe.time}</span>
                </p>
                <p className="menu-detail">
                  {recipe.ingredients.map((item, i) => (
                    <span key={item}>
                      {i > 0 && ' · '}
                      {SAMPLE_SEARCH.includes(item) ? <mark>{item}</mark> : item}
                    </span>
                  ))}
                </p>
              </li>
            ))}
          </ul>

          <p className="sample-note">Sample recipes, shown to explain how search works.</p>
        </section>
      </div>

      <section className="panel cta-band" aria-labelledby="start-title">
        <div className="cta-text">
          <h2 className="headline" id="start-title">
            Start your own library
          </h2>
          <p className="lede">Sign in with your Google account. It’s free, and your recipes stay private.</p>
        </div>
        <StartCta />
      </section>
    </>
  )
}
