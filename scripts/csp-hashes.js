// Runs after every build (see "build" in package.json).
//
// React Router puts a few small scripts directly inside each pre-built page.
// Our security rules (public/_headers) block scripts that aren't in separate
// files, so this step takes a fingerprint (a SHA-256 hash) of each page's own
// inline scripts and adds a rule to that page allowing exactly those, and
// nothing else. A script injected by an attacker wouldn't match a fingerprint,
// so the browser would still refuse to run it.
import { createHash } from 'node:crypto'
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const OUTPUT = 'dist/client'

function findHtmlFiles(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name)
    if (statSync(path).isDirectory()) return findHtmlFiles(path)
    return name.endsWith('.html') ? [path] : []
  })
}

let count = 0
for (const file of findHtmlFiles(OUTPUT)) {
  const html = readFileSync(file, 'utf8')
  if (html.includes('http-equiv="Content-Security-Policy"')) continue

  // Inline scripts are <script> tags without a src="..." attribute.
  const hashes = [...html.matchAll(/<script(?![^>]*\ssrc=)[^>]*>([\s\S]*?)<\/script>/g)].map(
    ([, body]) => `'sha256-${createHash('sha256').update(body, 'utf8').digest('base64')}'`,
  )
  const policy = `script-src 'self' ${hashes.join(' ')}`.trim()
  const tag = `<meta http-equiv="Content-Security-Policy" content="${policy}"/>`

  // The rule must come before any script, so put it first inside <head>.
  writeFileSync(file, html.replace('<head>', `<head>${tag}`))
  count++
}

if (count === 0) {
  console.error('csp-hashes: no pages found to protect. Did the build run?')
  process.exit(1)
}
console.log(`csp-hashes: protected inline scripts in ${count} pages`)
