import { fakeBrowser } from '@webext-core/fake-browser'
import { vi } from 'vitest'

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
vi.spyOn(fakeBrowser.runtime, 'connect').mockImplementation((): any => new EventTarget())

export { fakeBrowser as default }
