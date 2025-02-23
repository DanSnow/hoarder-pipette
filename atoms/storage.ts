import { atom, type ExtractAtomArgs } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { createClient } from '~/client'
import { LooseOptionsSchema } from '~/schemas/options'
import type { ZodType } from 'zod'
import { storage, type StorageSchema } from '~/lib/storage'
import type { AsyncStorage } from 'jotai/vanilla/utils/atomWithStorage'
import { UserSitesSchema, type UserSite } from '~/schemas/user-sites'

function atomWithBrowserStorage<
  Key extends keyof StorageSchema,
  StrictType = StorageSchema[Key],
  LooseType extends StrictType = StrictType,
>(key: Key, schema: ZodType<LooseType>, defaultValue: StrictType) {
  const innerAtom = atomWithStorage(key, defaultValue, storage as AsyncStorage<StrictType>, { getOnInit: true })

  return atom(
    async (get) => {
      const value = (await get(innerAtom)) ?? defaultValue
      return schema.parse(value)
    },
    async (_get, set, ...valueOrAction: ExtractAtomArgs<typeof innerAtom>) => {
      set(innerAtom, ...valueOrAction)
    },
  )
}

export const optionsAtom = atomWithBrowserStorage('options', LooseOptionsSchema, {
  apiKey: '',
  url: '',
})

export const userSitesAtom = atomWithBrowserStorage('sites', UserSitesSchema, [] as UserSite[])

export const clientAtom = atom(async (get) => {
  const { apiKey, url } = await get(optionsAtom)
  return createClient(url, apiKey)
})
