import path from 'node:path'
import { fileURLToPath } from 'node:url'
import type { StorybookConfig } from '@storybook/react-vite'
import { mergeConfig } from 'vite'

const dirname = path.dirname(fileURLToPath(import.meta.url))

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: ['@storybook/addon-docs', '@storybook/addon-vitest', '@storybook/addon-a11y'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  viteFinal: (config) =>
    mergeConfig(config, {
      resolve: {
        alias: {
          'wxt/browser': path.resolve(dirname, './fake-browser.ts'),
          'webextension-polyfill': path.resolve(dirname, './fake-browser.ts'),
        },
      },
    }),
}
export default config
