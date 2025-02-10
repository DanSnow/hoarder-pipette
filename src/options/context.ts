import { QueryClient } from '@tanstack/react-query'
import { createTRPCQueryUtils, createTRPCReact } from '@trpc/react-query'
import type { AppRouter } from '~/trpc'
import { createLink } from '~/trpc/link'

const chromeLink = createLink()

export const trpc = createTRPCReact<AppRouter>()

export const queryClient = new QueryClient({
  defaultOptions: {
    mutations: {
      onError: (err) => console.error('Mutation error:', err),
    },
  },
})
export const client = trpc.createClient({
  links: [chromeLink],
})

export const trpcUtils = createTRPCQueryUtils({
  client,
  queryClient,
})

export const context = {
  trpc,
  queryClient,
  client,
  trpcUtils,
} as const

export type Context = typeof context
