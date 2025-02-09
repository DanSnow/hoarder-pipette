import { ecosia } from './ecosia'
import { google } from './google'
import { startPage } from './startpage'
import type { SearchEngine } from './utils/types'

export const supportedEngines = [ecosia, google, startPage]

export function getUserQuery() {
  for (const engine of supportedEngines) {
    if (isMatchSearchEngine(engine, window.location.href)) {
      return engine.getQuery()
    }
  }
  throw new Error('Unsupported engine')
}

export function getRenderRoot(): HTMLElement {
  for (const engine of supportedEngines) {
    if (isMatchSearchEngine(engine, window.location.href)) {
      return engine.getRenderRoot()
    }
  }
  throw new Error('Unsupported engine')
}

export function isMatchSearchEngine(engine: SearchEngine, url: string): boolean {
  const matches = [...engine.matches, ...(engine.optionalMatches ?? [])]
  return matches.some((pattern) => url.startsWith(pattern))
}
