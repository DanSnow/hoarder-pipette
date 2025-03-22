import { Effect } from 'effect'
import browser from 'webextension-polyfill'

export class ContentScriptMutex extends Effect.Service<ContentScriptMutex>()('@app/ContentScriptMutex', {
  effect: Effect.makeSemaphore(1),
}) {}

export class ContentScriptRegister extends Effect.Service<ContentScriptRegister>()('@app/ContentScriptRegister', {
  effect: Effect.gen(function* () {
    const mutex = yield* ContentScriptMutex
    return {
      registerAll: (origins: string[], contentScript: string) => {
        return mutex.withPermits(1)(
          Effect.gen(function* () {
            yield* Effect.promise(() => browser.scripting.unregisterContentScripts())
            yield* Effect.promise(() =>
              browser.scripting.registerContentScripts([
                {
                  id: 'dynamic-content-scripts',
                  matches: origins,
                  js: [contentScript],
                },
              ]),
            )
          }),
        )
      },
    }
  }),
  accessors: true,
  dependencies: [ContentScriptMutex.Default],
}) {}
