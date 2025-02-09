import { vi } from 'vitest'
import browser from 'webextension-polyfill'

vi.mock('webextension-polyfill')

Object.defineProperty(browser, 'permissions', {
  value: {
    contains: vi.fn(() => Promise.resolve(true)),
    getAll: vi.fn(),
    remove: vi.fn(),
    request: vi.fn(),
  } satisfies Omit<typeof browser.permissions, 'onAdded' | 'onRemoved'>,
})
