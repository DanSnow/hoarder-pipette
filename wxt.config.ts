import { tanstackRouter } from '@tanstack/router-plugin/vite'
import { defineConfig } from 'wxt'

// See https://wxt.dev/api/config.html
export default defineConfig({
  srcDir: 'src',
  modules: ['@wxt-dev/module-react'],
  vite: () => ({
    plugins: [tanstackRouter()],
  }),
  manifest: {
    permissions: ['storage', 'activeTab', 'scripting'],
    optional_host_permissions: ['*://*/*'],
    homepage_url: 'https://dansnow.github.io/hoarder-pipette/',
    name: "Hoarder's Pipette",
    description: 'Search smarter. Find your Hoarder bookmarks directly in search results.',
    browser_specific_settings: {
      gecko: {
        id: 'hoarder-pipette@dansnow.github.io',
      },
    },
  },
})
