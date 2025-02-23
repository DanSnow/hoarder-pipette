import { Array, Effect, pipe } from 'effect'
import browser from 'webextension-polyfill'
import { supportedEngines } from '~/lib/search-engines'
import { ContentScriptRegister } from './content-script-register'
import type { SearchEngineMatch, SupportSearchEngines, SupportSearchEngine } from '~/schemas/supported-engines'
import { toOriginUrl } from '~/lib/utils'
import { Storage } from './store'

function getIsPermissionGranted(matches: string[]): Effect.Effect<SearchEngineMatch[]> {
  return pipe(
    matches,
    Array.map((match) => {
      const originUrl = toOriginUrl(match)

      return pipe(
        Effect.promise(() => browser.permissions.contains({ origins: [originUrl] })),
        Effect.map(
          (isEnabled): SearchEngineMatch => ({
            match,
            originUrl,
            isEnabledByDefault: false,
            isEnabled,
          }),
        ),
      )
    }),
    Effect.allWith({ concurrency: 'unbounded' }),
  )
}

function toDefaultEnabled(matches: string[]): SearchEngineMatch[] {
  return pipe(
    matches,
    Array.map(
      (match): SearchEngineMatch => ({
        match,
        originUrl: toOriginUrl(match),
        isEnabledByDefault: true,
        isEnabled: true,
      }),
    ),
  )
}

function getUserSites(id: string): Effect.Effect<SearchEngineMatch[], never, Storage> {
  return pipe(
    Storage.userSites,
    Effect.map((sites) =>
      pipe(
        sites,
        Array.filter((site) => site.id === id),
        Array.map(
          (site): SearchEngineMatch => ({
            match: site.url,
            originUrl: toOriginUrl(site.url),
            isEnabledByDefault: false,
            isEnabled: true,
          }),
        ),
      ),
    ),
  )
}

export function getSupportedSearchEngines(): Effect.Effect<SupportSearchEngines, never, Storage> {
  return pipe(
    supportedEngines,
    Array.map((engine) =>
      pipe(
        getIsPermissionGranted(engine.optionalMatches ?? []),
        Effect.zipWith(getUserSites(engine.id), (optionalMatch, userSites) =>
          Array.appendAll(optionalMatch, userSites),
        ),
        Effect.map(
          (matches): SupportSearchEngine => ({
            id: engine.id,
            name: engine.name,
            icon: engine.icon,
            allowUserSites: engine.allowUserSites ?? false,
            matches: [...toDefaultEnabled(engine.matches), ...matches],
          }),
        ),
      ),
    ),
    Effect.allWith({ concurrency: 'unbounded' }),
  )
}

export function getRegisterableScripts(): Effect.Effect<string[], never, Storage> {
  return pipe(
    getSupportedSearchEngines(),
    Effect.map((engines) =>
      pipe(
        engines,
        Array.flatMap((engine) => engine.matches),
        Array.filter((match) => match.isEnabled && !match.isEnabledByDefault),
        Array.map((match) => match.originUrl),
      ),
    ),
  )
}

const CONTENT_SCRIPT = '/scripts/content-script.js'

export function registerAll() {
  return pipe(
    getRegisterableScripts(),
    Effect.flatMap((origins) => ContentScriptRegister.registerAll(origins, CONTENT_SCRIPT)),
  )
}
