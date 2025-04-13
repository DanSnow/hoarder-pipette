import invariant from 'tiny-invariant'
import { defineRenderRoot } from '../mount-container'
import { $ } from '../utils'
import type { SearchEngine } from './utils/types'

export const searXNG: SearchEngine = {
  id: 'searxng',
  icon: 'i-simple-icons-searxng',
  name: 'SearXNG',
  matches: [],
  allowUserSites: true,
  getQuery: () => $('input#q')?.value ?? null,
  getRenderRoot: defineRenderRoot((container) => {
    const sidebarContainer = $('#sidebar')
    invariant(sidebarContainer, 'inject point not found')
    sidebarContainer.prepend(container)
  }),
}
