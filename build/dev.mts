import process from 'node:process'
import { createEnv } from '@t3-oss/env-core'
import { Match, pipe } from 'effect'
import { loadEnv } from 'vite'
import { z } from 'zod/v4'
import { $ } from 'zx'

const supportBrowser = z.enum(['chrome', 'firefox'])

const browser = supportBrowser.parse(process.argv[2])

const env = createEnv({
  server: {
    CHROMIUM_PATH: z.string().optional(),
    FIREFOX_PATH: z.string().optional(),
  },
  runtimeEnv: loadEnv('', process.cwd(), ''),
  emptyStringAsUndefined: true,
})

const input = browser === 'chrome' ? ([browser, env.CHROMIUM_PATH] as const) : ([browser, env.FIREFOX_PATH] as const)

const args = pipe(
  Match.value(input),
  Match.when(['chrome', undefined], () => ['--browser=chrome']),
  Match.when(['firefox', undefined], () => ['--browser=firefox']),
  Match.when(['chrome', Match.string], ([, path]) => [`--chromium-binary=${path}`]),
  Match.when(['firefox', Match.string], ([, path]) => [`--gecko-binary=${path}`]),
  Match.exhaustive,
)

await $({ stdio: 'inherit' })`extension dev ${args}`
