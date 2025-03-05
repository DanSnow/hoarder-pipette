import { defineConfig } from 'vitest/config'
import { mergeConfig } from 'vite'
import viteConfig from './vite.config'
import Inspect from 'vite-plugin-inspect'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

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
