import type { UserSite } from '~/schemas/user-sites'
import { ecosia } from './ecosia'
import { google } from './google'
import { searXNG } from './searxng'
import { startPage } from './startpage'
import type { MountContainer, RenderRootContext, SearchEngine } from './utils/types'

export const supportedEngines = [ecosia, google, startPage, searXNG]

function getSearchEngine(userSites: UserSite[]): SearchEngine {
  for (const engine of supportedEngines) {
    const url = window.location.href
    if (isMatchSearchEngine(engine, url)) {
      return engine
    }

    if (userSites.some((site) => site.id === engine.id && url.startsWith(site.url))) {
      return engine
    }
  }
  throw new Error('Unsupported engine')
}

export function getUserQuery(userSites: UserSite[]): string | null {
  return getSearchEngine(userSites).getQuery()
}

export function getRenderRoot(userSites: UserSite[], context: RenderRootContext): MountContainer {
  return getSearchEngine(userSites).getRenderRoot(context)
}

export function isMatchSearchEngine(engine: SearchEngine, url: string): boolean {
  const matches = [...engine.matches, ...(engine.optionalMatches ?? [])]
  return matches.some((pattern) => url.startsWith(pattern))
}
