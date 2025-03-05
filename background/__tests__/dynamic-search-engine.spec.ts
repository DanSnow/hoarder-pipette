import { expect } from 'vitest'
import { layer } from '@effect/vitest'
import { Effect } from 'effect'
import { getRegisterableScripts, getSupportedSearchEngines } from '../dynamic-search-engine'
import { startPage } from '~/lib/search-engines/startpage'
import { Storage } from '../store'

layer(Storage.Default)('getRegisterableScripts', (it) => {
  it.effect('should list all supported search engines', () =>
    Effect.gen(function* () {
      expect(yield* getRegisterableScripts()).toContain(`${startPage.optionalMatches?.[0]}*`)
    }),
  )
})

layer(Storage.Default)('getSupportedSearchEngines', (it) => {
  it.effect('should list supported search engines', () =>
    Effect.gen(function* () {
      const engines = yield* getSupportedSearchEngines()
      expect(engines).toContainEqual({
        id: startPage.id,
        name: startPage.name,
        icon: startPage.icon,
        allowUserSites: false,
        matches: [
          {
            match: startPage.optionalMatches?.[0],
            originUrl: `${startPage.optionalMatches?.[0]}*`,
            isEnabled: true,
            isEnabledByDefault: false,
          },
        ],
      })
    }),
  )
})
