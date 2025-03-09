import { getIconCollections, iconsPlugin } from '@egoist/tailwindcss-icons'
import type { Config } from 'tailwindcss'

/** @type {import('tailwindcss').Config} */
const config: Config = {
  plugins: [
    iconsPlugin({
      collections: getIconCollections(['lucide', 'simple-icons']),
    }),
  ],
}

export default config
