import { defineConfig } from 'vitest/config'
import TsConfigPaths from 'vite-plugin-tsconfig-paths'

export default defineConfig({
  plugins: [TsConfigPaths()],
  test: {
    setupFiles: ['vitest.setup.ts'],

    server: {
      deps: {
        inline: ['@webext-core/messaging'],
      },
    },
  },
})
