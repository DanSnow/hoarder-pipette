import invariant from 'tiny-invariant'
import { defineRenderRoot } from '../mount-container'
import { $ } from '../utils'
import { fromUrlQuery } from './utils/get-query'
import type { SearchEngine } from './utils/types'

export const DUCKDUCKGO_URL = 'https://duckduckgo.com/'

export const duckduckgo: SearchEngine = {
  id: 'duckduckgo',
  icon: 'i-simple-icons-duckduckgo',
  name: 'DuckDuckGo',
  matches: [],
  optionalMatches: [DUCKDUCKGO_URL],
  getQuery: fromUrlQuery('q'),
  getRenderRoot: defineRenderRoot((container) => {
    const sidebar = $('[data-area=sidebar]')
    invariant(sidebar, 'inject point not found')
    sidebar.prepend(container)
  }),
}
