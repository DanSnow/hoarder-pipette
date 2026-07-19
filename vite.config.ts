import tailwindcss from '@tailwindcss/vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [tanstackRouter(), tailwindcss()],
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    setupFiles: ['vitest.setup.ts'],

    server: {
      deps: {
        inline: ['@webext-core/messaging', '@webext-core/storage', 'webextension-polyfill', 'wxt/browser'],
      },
    },
  },
})
