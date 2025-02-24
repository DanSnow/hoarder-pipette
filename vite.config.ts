import { defineConfig } from 'vitest/config'
import TsConfigPaths from 'vite-plugin-tsconfig-paths'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'

export default defineConfig({
  plugins: [TsConfigPaths(), TanStackRouterVite()],
  test: {
    setupFiles: ['vitest.setup.ts'],

    server: {
      deps: {
        inline: ['@webext-core/messaging'],
      },
    },
  },
})
