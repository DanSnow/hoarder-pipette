// @ts-check
import starlight from '@astrojs/starlight'
import { defineConfig } from 'astro/config'

import tailwindcss from '@tailwindcss/vite'

// https://astro.build/config
export default defineConfig({
  site: 'https://dansnow.github.io',
  base: 'hoarder-pipette',

  integrations: [
    starlight({
      title: "Hoarder' Pipette",
      customCss: ['./src/tailwind.css'],
      logo: {
        src: './src/assets/logo.svg',
      },
      social: {
        github: 'https://github.com/DanSnow/hoarder-pipette',
      },
      editLink: {
        baseUrl: 'https://github.com/DanSnow/hoarder-pipette/edit/main/docs/',
      },
      sidebar: [
        {
          label: 'Get Started',
          items: [
            // Each item here is one entry in the navigation menu.
            { label: 'Installation', slug: 'guides/installation' },
            { label: 'Configuration', slug: 'guides/configuration' },
          ],
        },
      ],
    }),
  ],

  vite: {
    plugins: [tailwindcss()],
  },
})
