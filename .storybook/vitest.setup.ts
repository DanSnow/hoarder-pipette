import { vi } from 'vitest'

import { browser } from './fake-browser'

vi.stubGlobal('chrome', browser)
