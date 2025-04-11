import invariant from 'tiny-invariant'
import { createMountContainer } from '../mount-container'
import { $ } from '../utils'
import type { SearchEngine } from './utils/types'

export const startPage: SearchEngine = {
  id: 'startpage',
  icon: 'i-simple-icons-startpage',
  name: 'StartPage',
  matches: [],
  optionalMatches: ['https://www.startpage.com/sp/search'],
  getQuery: () => $('input.search-form-input')?.value ?? null,
  getRenderRoot: (ctx) => {
    const { container, renderRoot } = createMountContainer(ctx)
    const sidebarContainer = $('#sidebar')
    invariant(sidebarContainer, 'inject point not found')
    sidebarContainer.prepend(container)
    return renderRoot
  },
}
