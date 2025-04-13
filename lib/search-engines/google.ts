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
    const searchContainer = $('#rso')
    invariant(searchContainer, 'inject point not found')
    searchContainer.prepend(container)
  }),
}
