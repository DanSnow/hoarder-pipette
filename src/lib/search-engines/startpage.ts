import invariant from 'tiny-invariant'
import { defineRenderRoot } from '../mount-container'
import { $ } from '../utils'
import { fromInput } from './utils/get-query'
import type { SearchEngine } from './utils/types'

export const startPage: SearchEngine = {
  id: 'startpage',
  icon: 'i-simple-icons-startpage',
  name: 'StartPage',
  matches: [],
  optionalMatches: ['https://www.startpage.com/sp/search'],
  getQuery: fromInput('input.search-form-input'),
  getRenderRoot: defineRenderRoot((container) => {
    const sidebarContainer = $('#sidebar')
    invariant(sidebarContainer, 'inject point not found')
    sidebarContainer.prepend(container)
  }),
}
