import { atom } from 'jotai'
import { createClient } from '~/client'
import { LooseOptionsSchema, type InstanceOptions } from '~/schemas/options'

export const optionsAtom = atom(async () => {
  const res = await chrome.storage.sync.get({
    apiKey: '',
    url: '',
  } satisfies InstanceOptions)
  return LooseOptionsSchema.parse(res)
})

export const clientAtom = atom(async (get) => {
  const { apiKey, url } = await get(optionsAtom)
  return createClient(url, apiKey)
})
