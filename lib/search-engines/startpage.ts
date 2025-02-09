import invariant from 'tiny-invariant'
import { createMountContainer } from '../mount-container'
import { $ } from '../utils'
import type { SearchEngine } from './utils/types'

export const startPage: SearchEngine = {
  name: 'StartPage',
  matches: [],
  optionalMatches: ['https://www.startpage.com/sp/search'],
  getQuery: () => $('input.search-form-input')?.value ?? null,
  getRenderRoot: () => {
    const { container, renderRoot } = createMountContainer()
    const sidebarContainer = $('#sidebar')
    invariant(sidebarContainer, 'inject point not found')
    sidebarContainer.prepend(container)
    return renderRoot
  },
}
