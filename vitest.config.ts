import path, { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { storybookTest } from '@storybook/addon-vitest/vitest-plugin'
import { playwright } from '@vitest/browser-playwright'
import { mergeConfig } from 'vite'
import { defineConfig } from 'vitest/config'
import { WxtVitest } from 'wxt/testing/vitest-plugin'

import viteConfig from './vite.config'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default mergeConfig(
  viteConfig,
  defineConfig({
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
          inline: ['@webext-core/messaging', '@webext-core/storage', 'webextension-polyfill'],
        },
      },
      projects: [
        {
          extends: true,
          plugins: [WxtVitest()],
          test: {
            name: 'unit-test',
          },
        },
        {
          extends: true,
          plugins: [
            // The plugin will run tests for the stories defined in your Storybook config
            // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
            storybookTest({ configDir: path.join(__dirname, '.storybook') }),
          ],
          optimizeDeps: {
            include: ['react/jsx-dev-runtime'],
          },
          test: {
            name: 'storybook',
            browser: {
              enabled: true,
              headless: true,
              provider: playwright({
                launchOptions: {
                  channel: process.env.CI ? 'chrome' : undefined,
                },
              }),
              instances: [
                {
                  browser: 'chromium',
                },
              ],
            },
            setupFiles: ['.storybook/vitest.setup.ts'],
          },
        },
      ],
    },
  }),
)
