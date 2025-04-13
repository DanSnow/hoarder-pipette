import { Effect, Schedule, pipe } from 'effect'
import type { UserSite } from '~/schemas/user-sites'
import { brave } from './brave'
import { duckduckgo } from './duckduckgo'
import { ecosia } from './ecosia'
import { google } from './google'
import { searXNG } from './searxng'
import { startPage } from './startpage'
import type { MountContainer, RenderRootContext, SearchEngine } from './utils/types'

export const supportedEngines = [ecosia, google, startPage, searXNG, duckduckgo, brave]

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

export function getUserQuery(userSites: UserSite[]): string | null {
  return getSearchEngine(userSites).getQuery()
}

export function getRenderRoot(userSites: UserSite[], context: RenderRootContext): Promise<MountContainer> {
  return ensureRenderRoot(getSearchEngine(userSites), context)
}

/**
 * Ensure the render root is exists in document before return
 *
 * This is a workaround for Brave search as it will remove our render root when hydrating
 * @param searchEngine The search engine config
 * @param context The context for render root
 * @returns mount container
 */
export function ensureRenderRoot(searchEngine: SearchEngine, context: RenderRootContext): Promise<MountContainer> {
  return pipe(
    Effect.sync(() => searchEngine.getRenderRoot(context)),
    Effect.delay('500 millis'),
    Effect.filterOrFail((mountContainer: MountContainer) => mountContainer.container.isConnected),
    Effect.retry({
      times: 10,
      schedule: Schedule.exponential('100 millis'),
    }),
    Effect.runPromise,
  )
}

export function isMatchSearchEngine(engine: SearchEngine, url: string): boolean {
  const matches = [...engine.matches, ...(engine.optionalMatches ?? [])]
  return matches.some((pattern) => url.startsWith(pattern))
}
