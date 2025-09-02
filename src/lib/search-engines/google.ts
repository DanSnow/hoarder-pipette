import invariant from 'tiny-invariant'
import { defineRenderRoot } from '../mount-container'
import { $ } from '../utils'
import { fromUrlQuery } from './utils/get-query'
import type { SearchEngine } from './utils/types'

export const GOOGLE_URL = 'https://www.google.com/search'

export const google: SearchEngine = {
  id: 'google',
  icon: 'i-simple-icons-google',
  name: 'Google',
  matches: [GOOGLE_URL],
  optionalMatches: ['https://www.google.de/search', 'https://www.google.ca/search'],
  getQuery: fromUrlQuery('q'),
  getRenderRoot: defineRenderRoot((container) => {
    const aside = $('#rhs')
    if (aside) {
      aside.prepend(container)
    } else {
      const center = $('#center_col')
      invariant(center, 'inject point not found')
      container.id = 'rhs'
      center.parentElement?.append(container)
    }
  }),
}
