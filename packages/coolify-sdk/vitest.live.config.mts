import { defineConfig } from 'vitest/config'

// Live contract tests hit a real Coolify instance. Opt-in via `pnpm test:live`
// with COOLIFY_API_URL / COOLIFY_API_KEY set; they self-skip without them.
export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/live/**/*.spec.ts'],
    testTimeout: 30_000,
  },
})
