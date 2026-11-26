import { reactRouter } from '@react-router/dev/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
// The React Router plugin replaces the plain React plugin: it handles pages,
// pre-building, and React itself.
export default defineConfig({
  plugins: [reactRouter()],
})
