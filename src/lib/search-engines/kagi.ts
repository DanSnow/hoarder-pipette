import { defineRenderRoot } from '../mount-container'
import { $ } from '../utils'
import { fromUrlQuery } from './utils/get-query'
import type { SearchEngine } from './utils/types'

export const KAGI_URL = 'https://kagi.com/search'

/**
 * Mounts the extension UI into Kagi's search layout.
 *
 * Kagi uses different desktop and mobile containers, so this prefers the
 * desktop sidebar when there is enough visible room and falls back to an
 * inline placement for narrow or mobile layouts.
 */
function mountKagiRenderRoot(container: HTMLElement) {
  const nav = $('#tonav') ?? $('.serp-nav')
  const layout = $('#layout-v2')
  const page = $('#page0')
  const appContent = $('#_0_app_content')
  const firstResult = $('.search-result')
  const resultList = firstResult?.parentElement
  const mainFallback = $('#main') ?? layout ?? page ?? appContent ?? resultList
  const main = mainFallback ?? $('main#app') ?? $('main') ?? document.body

  const mainRect = main.getBoundingClientRect()
  const navRect = nav?.getBoundingClientRect() ?? mainRect
  const hasSidebarRoom = mainRect.width > 0 && window.innerWidth - (mainRect.left + mainRect.width) >= 460

  if (nav && main !== document.body && hasSidebarRoom) {
    container.style.position = 'absolute'
    container.style.top = `${navRect.top + window.scrollY}px`
    container.style.left = `${mainRect.left + mainRect.width + 32}px`
    container.style.width = '400px'
    container.style.zIndex = '5'

    document.body.append(container)
    return
  }

  const renderRoot = container.querySelector<HTMLElement>('#hoarder-inject')
  if (renderRoot) {
    renderRoot.style.minWidth = '0'
    renderRoot.style.width = '100%'
  }

  container.style.position = 'relative'
  container.style.width = '100%'
  container.style.maxWidth = 'none'
  container.style.boxSizing = 'border-box'
  container.style.marginBottom = '16px'

  ;(layout ?? resultList ?? main).prepend(container)
}

export const kagi: SearchEngine = {
  id: 'kagi',
  icon: 'i-simple-icons-kagi',
  name: 'Kagi',
  matches: [],
  optionalMatches: [KAGI_URL],
  getQuery: fromUrlQuery('q'),
  getRenderRoot: defineRenderRoot(mountKagiRenderRoot),
}
