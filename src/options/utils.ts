import { Predicate } from 'effect'
import { parseURL, stringifyParsedURL } from 'ufo'
import browser from 'webextension-polyfill'

export async function getCurrentTab() {
  const [tab] = await browser.tabs.query({ active: true, lastFocusedWindow: true })
  return tab
}

export async function getCurrentTabUrl() {
  const tab = await getCurrentTab()
  return tab.url && withoutQueryAndHash(tab.url)
}

export function withoutQueryAndHash(url: string) {
  const parsed = parseURL(url)
  parsed.search = ''
  parsed.hash = ''
  return stringifyParsedURL(parsed)
}

const ALLOW_PROTOCOL = ['http:', 'https:']

export type AllowUrl = `http://${string}` | `https://${string}`

export function isAllowProtocol(url: string): url is AllowUrl {
  return ALLOW_PROTOCOL.includes(parseURL(url).protocol ?? '')
}

export const isAllowUrl = Predicate.compose(Predicate.isString, isAllowProtocol)
