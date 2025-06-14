import { tanstackRouter } from '@tanstack/router-plugin/vite'
import TsConfigPaths from 'vite-plugin-tsconfig-paths'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [TsConfigPaths(), tanstackRouter()],
  optimizeDeps: {
    include: ['@ts-rest/core'],
  },
  test: {
    setupFiles: ['vitest.setup.ts'],

    server: {
      deps: {
        inline: [
          '@webext-core/messaging',
          '@webext-core/storage',
          'extension',
          'extension-develop',
          'webextension-polyfill',
        ],
      },
    },
  },
})
