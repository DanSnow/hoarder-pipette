import { beforeEach, vi } from 'vitest'
import { browser } from 'wxt/browser'
import { fakeBrowser } from 'wxt/testing/fake-browser'

beforeEach(() => {
  // Reset the in-memory state before every test
  fakeBrowser.reset()
})

// @ts-expect-error mocking
browser.permissions ??= {}

vi.mock('wxt/browser', async () => {
  const { fakeBrowser } = await vi.importActual('wxt/testing/fake-browser')
  return { browser: fakeBrowser }
})

Object.defineProperty(browser, 'permissions', {
  value: {
    contains: vi.fn(() => Promise.resolve(true)),
    getAll: vi.fn(),
    remove: vi.fn(),
    request: vi.fn(),
  } satisfies Pick<typeof browser.permissions, 'contains' | 'getAll' | 'remove' | 'request'>,
})

vi.spyOn(browser.runtime, 'connect').mockImplementation(() => ({
  name: '',
  // @ts-expect-error mocking
  onDisconnect: {
    addListener: vi.fn(),
  },
  // @ts-expect-error mocking
  onMessage: {
    addListener: vi.fn(),
  },
  disconnect: vi.fn(),
  postMessage: vi.fn(),
}))
