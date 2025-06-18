// @ts-check
import starlight from '@astrojs/starlight'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'astro/config'

// https://astro.build/config
export default defineConfig({
  site: 'https://dansnow.github.io',
  base: process.env.NODE_ENV === 'production' ? '/hoarder-pipette' : '/',

  integrations: [
    starlight({
      title: "Hoarder' Pipette",
      customCss: ['./src/tailwind.css'],
      logo: {
        src: './src/assets/logo.svg',
      },
      social: [
        {
          icon: 'github',
          label: 'Github',
          href: 'https://github.com/DanSnow/hoarder-pipette',
        },
      ],
      editLink: {
        baseUrl: 'https://github.com/DanSnow/hoarder-pipette/edit/main/docs/',
      },
      sidebar: [
        {
          label: 'Get Started',
          autogenerate: { directory: 'guides' },
        },
        {
          label: 'Contribute',
          autogenerate: { directory: 'contribute' },
        },
      ],
    }),
  ],

  vite: {
    plugins: [tailwindcss()],
  },
})
