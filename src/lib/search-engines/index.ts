import { Effect, pipe, Schedule } from 'effect'

import type { UserSite } from '~/schemas/user-sites'

import { brave } from './brave'
import { duckduckgo } from './duckduckgo'
import { ecosia } from './ecosia'
import { google } from './google'
import { kagi } from './kagi'
import { searXNG } from './searxng'
import { startPage } from './startpage'
import type { MountContainer, SearchEngine } from './utils/types'

export const supportedEngines = [ecosia, google, startPage, searXNG, duckduckgo, brave, kagi]

/** Resolves the search engine that owns the current page URL. */
export function getSearchEngine(userSites: UserSite[]): SearchEngine {
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

/** Returns the active page query using the matched search engine adapter. */
export function getUserQuery(userSites: UserSite[]): string | null {
  return getSearchEngine(userSites).getQuery()
}

/** Returns a retrying render-root mount container for the active search engine. */
export function getRenderRoot(userSites: UserSite[]): Promise<MountContainer> {
  return ensureRenderRoot(getSearchEngine(userSites))
}

/**
 * Ensure the render root is exists in document before return
 *
 * This is a workaround for Brave search as it will remove our render root when hydrating
 * @param searchEngine The search engine config
 * @param context The context for render root
 * @returns mount container
 */
export function ensureRenderRoot(searchEngine: SearchEngine): Promise<MountContainer> {
  return pipe(
    Effect.sync(() => searchEngine.getRenderRoot()),
    Effect.delay('500 millis'),
    Effect.filterOrFail((mountContainer: MountContainer) => mountContainer.container.isConnected),
    Effect.retry({
      times: 10,
      schedule: Schedule.exponential('100 millis'),
    }),
    Effect.runPromise,
  )
}

/** Checks whether a URL matches one of an engine's static or optional URL prefixes. */
export function isMatchSearchEngine(engine: SearchEngine, url: string): boolean {
  const matches = [...engine.matches, ...(engine.optionalMatches ?? [])]
  return matches.some((pattern) => url.startsWith(pattern))
}
