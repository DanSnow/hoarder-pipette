import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { mergeConfig } from 'vite'
import Inspect from 'vite-plugin-inspect'
import { defineConfig } from 'vitest/config'
import viteConfig from './vite.config'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default mergeConfig(
  viteConfig,
  defineConfig({
    plugins: [
      Inspect({
        build: true,
        outputDir: '.vite-inspect',
      }),
    ],
    resolve: {
      alias: { 'webextension-polyfill': resolve(__dirname, '__mocks__/webextension-polyfill.ts') },
    },
    optimizeDeps: {
      include: ['react/jsx-dev-runtime'],
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
  }),
)
