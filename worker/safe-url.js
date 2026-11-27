// Decides whether the Worker may fetch a link for recipe import.
//
// The Worker fetches pages on a user's behalf, so it must never be pointed
// at private or local places (the security term is SSRF). The rules, kept
// strict because real recipe sites always pass them:
//   - http:// or https:// only, on the normal ports (no ":8080")
//   - no "user:password@" in the link
//   - no IP addresses at all (recipe sites use names like seriouseats.com)
//   - no local or private names: localhost, *.local, *.internal, and names
//     without a dot (like "router")
//   - not this site itself (so the Worker can't call itself)
//
// Note: the browser's URL reader turns tricky forms like "http://2130706433"
// or "http://0x7f.1" into a normal "127.0.0.1" first, so they get caught by
// the IP address rule.

// Endings used for local, private, or special-use networks.
const BLOCKED_ENDINGS = [
  '.localhost',
  '.local',
  '.internal',
  '.intranet',
  '.lan',
  '.home',
  '.corp',
  '.private',
  '.home.arpa',
  '.arpa',
  '.test',
  '.invalid',
  '.example',
]

// A problem with a link, with a short code the website turns into a message.
export class LinkProblem extends Error {
  constructor(code, message) {
    super(message)
    this.code = code
  }
}

const IPV4 = /^\d{1,3}(\.\d{1,3}){3}$/

// Checks a link. Returns it as a URL, or throws a LinkProblem.
// `ownHost` is this site's own host name, which is never allowed.
export function checkImportLink(text, ownHost) {
  let url
  try {
    url = new URL(String(text).trim())
  } catch {
    throw new LinkProblem('invalid-link', 'That doesn’t look like a web address.')
  }

  if (url.protocol !== 'https:' && url.protocol !== 'http:') {
    throw new LinkProblem('invalid-link', 'The link should start with https:// or http://')
  }
  if (url.username || url.password) {
    throw new LinkProblem('blocked-address', 'Links with a username or password can’t be imported.')
  }
  if (url.port !== '') {
    throw new LinkProblem('blocked-address', 'Links with a port number (like :8080) can’t be imported.')
  }

  const host = url.hostname.toLowerCase().replace(/\.$/, '')
  const isIp = IPV4.test(host) || host.startsWith('[')
  const isLocalName =
    host === 'localhost' || !host.includes('.') || BLOCKED_ENDINGS.some((ending) => host.endsWith(ending))

  if (isIp || isLocalName) {
    throw new LinkProblem('blocked-address', 'That address can’t be imported. Use a recipe website’s link.')
  }
  if (ownHost && host === ownHost.toLowerCase()) {
    throw new LinkProblem('blocked-address', 'Links to this site can’t be imported.')
  }

  // Drop "#section" parts, which never change the page that's fetched.
  url.hash = ''
  return url
}
