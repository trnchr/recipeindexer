import { toSearchWords } from '../lib/search.js'

// The ingredient search box: a row of chips and a text box. The page filters
// the list as you type. A space, comma, or Enter turns the word you typed
// into a chip. Each chip has an × to remove it. Backspace in the empty box
// puts the last chip's word back in the box so you can fix it.
//
// words / onWordsChange(newWords): the chips.
// text / onTextChange(newText): what's in the text box right now.
export default function IngredientSearch({ words, onWordsChange, text, onTextChange }) {
  function addTyped() {
    const added = toSearchWords(text).filter((word) => !words.includes(word))
    onTextChange('')
    if (added.length > 0) onWordsChange([...words, ...added])
  }

  // Everything before the last space or comma becomes chips; the rest stays
  // in the box. Also handles pasting "chicken cumin rice" (chicken and cumin
  // become chips, "rice" stays to keep typing).
  function handleChange(value) {
    const parts = value.split(/[\s,]+/)
    const rest = parts.pop()
    const added = toSearchWords(parts.join(' ')).filter((word) => !words.includes(word))
    if (added.length > 0) onWordsChange([...words, ...added])
    onTextChange(rest)
  }

  function handleKeyDown(event) {
    if (event.key === 'Enter') {
      event.preventDefault()
      addTyped()
    } else if (event.key === 'Backspace' && text === '' && words.length > 0) {
      event.preventDefault()
      onWordsChange(words.slice(0, -1))
      onTextChange(words[words.length - 1])
    }
  }

  function remove(word) {
    onWordsChange(words.filter((w) => w !== word))
  }

  return (
    <div className="search-box">
      <label className="visually-hidden" htmlFor="ingredient-search">
        Search by ingredient
      </label>
      {words.map((word) => (
        <span className="chip chip--removable" key={word}>
          {word}
          <button className="chip-remove" type="button" onClick={() => remove(word)} aria-label={`Remove ${word}`}>
            ×
          </button>
        </span>
      ))}
      <input
        id="ingredient-search"
        className="search-box__input"
        type="text"
        value={text}
        onChange={(event) => handleChange(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Search by ingredient…"
        enterKeyHint="done"
        autoComplete="off"
        autoCapitalize="none"
        spellCheck="false"
      />
    </div>
  )
}
