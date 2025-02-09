import { QueryClient } from '@tanstack/react-query'
import { createTRPCQueryUtils, createTRPCReact } from '@trpc/react-query'
import type { AppRouter } from '~/trpc'
import { createLink } from '~/trpc/link'

const chromeLink = createLink()

export function createContext() {
  const trpc = createTRPCReact<AppRouter>()
  const queryClient = new QueryClient({
    defaultOptions: {
      mutations: {
        onError: (err) => console.error('Mutation error:', err),
      },
    },
  })
  const client = trpc.createClient({
    links: [chromeLink],
  })

  const trpcUtils = createTRPCQueryUtils({
    client,
    queryClient,
  })

  return {
    trpc,
    queryClient,
    client,
    trpcUtils,
  }
}

export type Context = ReturnType<typeof createContext>
