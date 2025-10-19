import { main } from './content'
import '~/styles/tailwind.css'

export default defineContentScript({
  matches: ['https://www.google.com/search*', 'https://www.ecosia.org/search*'],
  cssInjectionMode: 'ui',
  main,
})
