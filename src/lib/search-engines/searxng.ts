import invariant from 'tiny-invariant'
import { defineRenderRoot } from '../mount-container'
import { $ } from '../utils'
import { fromInput } from './utils/get-query'
import type { SearchEngine } from './utils/types'

export const searXNG: SearchEngine = {
  id: 'searxng',
  icon: 'i-simple-icons-searxng',
  name: 'SearXNG',
  matches: [],
  allowUserSites: true,
  getQuery: fromInput('input#q'),
  getRenderRoot: defineRenderRoot((container) => {
    const sidebarContainer = $('#sidebar')
    invariant(sidebarContainer, 'inject point not found')
    sidebarContainer.prepend(container)
  }),
}
