import { createORPCClient } from '@orpc/client'
import { RPCLink } from '@orpc/client/message-port'
import type { RouterClient } from '@orpc/server'
import { createTanstackQueryUtils } from '@orpc/tanstack-query'
import { QueryClient } from '@tanstack/react-query'
import browser from 'webextension-polyfill'
import type { AppRouter } from '~/orpc'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
    },
    mutations: {
      onError: (err) => console.error('Mutation error:', err),
    },
  },
})

const port = browser.runtime.connect()

const link = new RPCLink({
  port,
})

export const client: RouterClient<AppRouter> = createORPCClient(link)

export const orpc = createTanstackQueryUtils(client)

export const context = {
  orpc,
  queryClient,
  client,
} as const

export type Context = typeof context
