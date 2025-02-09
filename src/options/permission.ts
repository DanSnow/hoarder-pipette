import { Array, Effect, pipe, Predicate, Equal } from 'effect'
import browser from 'webextension-polyfill'
import type { SupportSearchEngine } from '~/schemas/supported-engines'

export function requestOrigins(origins: string[]) {
  return Effect.promise(() => browser.permissions.request({ origins }))
}

export function requestOrigin(origin: string) {
  return requestOrigins([origin])
}

export function requestSite(engine: SupportSearchEngine) {
  return pipe(
    engine.matches,
    Array.filter(Predicate.struct({ isEnabled: Equal.equals(false) })),
    Array.map((match) => match.originUrl),
    (origins) => requestOrigins(origins),
  )
}
