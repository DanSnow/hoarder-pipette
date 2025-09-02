import { type Context, Effect, Layer } from 'effect'
import { createStore } from 'jotai'
import { userSitesAtom } from '~/atoms/storage'

export class Store extends Effect.Service<Store>()('@app/Store', {
  sync: () => ({ store: createStore() }),
  accessors: true,
}) {}

export class Storage extends Effect.Service<Storage>()('@app/Storage', {
  effect: Effect.gen(function* () {
    const store = yield* Store.store

    return {
      userSites: Effect.promise(() => store.get(userSitesAtom)),
    }
  }),
  accessors: true,
  dependencies: [Store.Default],
}) {
  static layerWithData = ({ userSites }: Omit<Context.Tag.Service<typeof this>, '_tag'>) =>
    Layer.succeed(
      this,
      this.make({
        userSites,
      }),
    )
}
