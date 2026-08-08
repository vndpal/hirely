import { defineConfig } from 'vitest/config'
import { resolve } from 'path'

export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname),
    },
  },
  test: {
    environment: 'node',
    // better-sqlite3 is a native CommonJS addon; don't let Vite transform it.
    server: {
      deps: {
        external: ['better-sqlite3'],
      },
    },
  },
})
