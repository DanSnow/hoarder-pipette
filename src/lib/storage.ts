import { defineExtensionStorage } from '@webext-core/storage'
import browser from 'webextension-polyfill'
import type { InstanceOptions } from '~/schemas/options'
import type { UserSite } from '~/schemas/user-sites'

export interface StorageSchema {
  version: number
  /**
   * @deprecated use `options` instead
   */
  apiKey: string
  /**
   * @deprecated use `options` instead
   */
  url: string
  options: InstanceOptions
  sites: UserSite[]
}

export const storage = defineExtensionStorage<StorageSchema>(browser.storage.sync)
