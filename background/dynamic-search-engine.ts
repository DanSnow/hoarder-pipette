import { Array, Effect, pipe } from 'effect'
import browser from 'webextension-polyfill'
import { supportedEngines } from '~/lib/search-engines'
import { ContentScriptRegister } from './content-script-register'
import type { SearchEngineMatch, SupportSearchEngines } from '~/schemas/supported-engines'

function toOriginUrl(url: string): string {
  return `${url}*`
}

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

export function getSupportedSearchEngines(): Effect.Effect<SupportSearchEngines> {
  return pipe(
    supportedEngines,
    Array.map((engine) =>
      pipe(
        getIsPermissionGranted(engine.optionalMatches ?? []),
        Effect.map((matches) => ({
          name: engine.name,
          matches: [...toDefaultEnabled(engine.matches), ...matches],
        })),
      ),
    ),
    Effect.allWith({ concurrency: 'unbounded' }),
  )
}

export function getRegisterableScripts(): Effect.Effect<string[]> {
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
