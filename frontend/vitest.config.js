import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    // No frontend unit tests yet — don't fail `npm test` because of that.
    passWithNoTests: true,
  },
})