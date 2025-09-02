import invariant from 'tiny-invariant'
import { defineRenderRoot } from '../mount-container'
import { $ } from '../utils'
import { fromUrlQuery } from './utils/get-query'
import type { SearchEngine } from './utils/types'

export const ECOSIA_URL = 'https://www.ecosia.org/search'

export const ecosia: SearchEngine = {
  id: 'ecosia',
  icon: 'i-simple-icons-ecosia',
  name: 'Ecosia',
  matches: [ECOSIA_URL],
  getQuery: fromUrlQuery('q'),
  getRenderRoot: defineRenderRoot((container) => {
    const aside = $('[data-test-id=sidebar]')
    if (aside) {
      aside.prepend(container)
      return
    }
    // TODO: create sidebar if not exist
    const firstSearchResult = $('[data-test-id=mainline]')
    invariant(firstSearchResult, 'inject point not found')
    firstSearchResult.prepend(container)
  }),
}
