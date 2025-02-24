import invariant from 'tiny-invariant'
import { createMountContainer } from '../mount-container'
import { $ } from '../utils'
import { fromUrlQuery } from './utils/get-query'
import type { SearchEngine } from './utils/types'

export const GOOGLE_URL = 'https://www.google.com/search'

export const google: SearchEngine = {
  name: 'Google',
  matches: [GOOGLE_URL],
  optionalMatches: ['https://www.google.de/search'],
  getQuery: fromUrlQuery('q'),
  getRenderRoot: () => {
    const { container, renderRoot } = createMountContainer()
    const searchContainer = $('#rso')
    invariant(searchContainer, 'inject point not found')
    searchContainer.prepend(container)
    return renderRoot
  },
}
