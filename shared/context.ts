import { QueryClient } from '@tanstack/react-query'
import { createTRPCClient } from '@trpc/client'
import { createTRPCOptionsProxy } from '@trpc/tanstack-react-query'
import type { AppRouter } from '~/trpc'
import { createLink } from '~/trpc/link'

const chromeLink = createLink()

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

export const client = createTRPCClient<AppRouter>({
  links: [chromeLink],
})

export const trpc = createTRPCOptionsProxy<AppRouter>({
  client,
  queryClient,
})

export const context = {
  trpc,
  queryClient,
  client,
} as const

export type Context = typeof context
