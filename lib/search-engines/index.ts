import type { UserSite } from '~/schemas/user-sites'
import { ecosia } from './ecosia'
import { google } from './google'
import { searXNG } from './searxng'
import { startPage } from './startpage'
import type { SearchEngine } from './utils/types'

export const supportedEngines = [ecosia, google, startPage, searXNG]

export function getUserQuery() {
  for (const engine of supportedEngines) {
    if (isMatchSearchEngine(engine, window.location.href)) {
      return engine.getQuery()
    }
  }
  throw new Error('Unsupported engine')
}

export function getRenderRoot(userSites: UserSite[] = []): HTMLElement {
  for (const engine of supportedEngines) {
    const url = window.location.href
    if (isMatchSearchEngine(engine, url)) {
      return engine.getRenderRoot()
    }

    if (userSites.some((site) => site.id === engine.id && url.startsWith(site.url))) {
      return engine.getRenderRoot()
    }
  }
  throw new Error('Unsupported engine')
}

export function isMatchSearchEngine(engine: SearchEngine, url: string): boolean {
  const matches = [...engine.matches, ...(engine.optionalMatches ?? [])]
  return matches.some((pattern) => url.startsWith(pattern))
}
