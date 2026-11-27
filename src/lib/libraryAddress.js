import { useLocation } from 'react-router'

// The library address to go back to, keeping the search you came from
// (/library?with=chick+cumin). Pages that link onward from the library pass
// that search along as `state: { librarySearch }`.
export function useLibraryAddress() {
  const { state } = useLocation()
  return `/library${state?.librarySearch ?? ''}`
}
