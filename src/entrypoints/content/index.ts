import '~/styles/tailwind.css'

import { main } from './content'

export default defineContentScript({
  matches: ['https://www.google.com/search*', 'https://www.ecosia.org/search*'],
  cssInjectionMode: 'ui',
  main,
})
