import invariant from 'tiny-invariant'
import { defineRenderRoot } from '../mount-container'
import { $ } from '../utils'
import { fromUrlQuery } from './utils/get-query'
import type { SearchEngine } from './utils/types'

export const BRAVE_URL = 'https://search.brave.com/search'

export const brave: SearchEngine = {
  id: 'brave',
  icon: 'i-simple-icons-brave',
  name: 'Brave',
  matches: [],
  optionalMatches: [BRAVE_URL],
  getQuery: fromUrlQuery('q'),
  getRenderRoot: defineRenderRoot((container) => {
    const sidebar = $('.sidebar')
    invariant(sidebar, 'inject point not found')
    sidebar.prepend(container)
  }),
}
