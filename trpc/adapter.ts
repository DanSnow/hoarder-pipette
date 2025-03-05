import { type AnyTRPCRouter, type inferRouterContext, callTRPCProcedure } from '@trpc/server'
import { onMessage, type TrpcMessage } from './channel'

export function createTrpcAdapter<TRouter extends AnyTRPCRouter>(
  router: TRouter,
  createContext?: () => Promise<inferRouterContext<TRouter>>,
) {
  const handleMessage = createMessageHandler<TRouter>(router, createContext)

  onMessage('trpc', (message) => {
    return handleMessage(message.data)
  })
}

export function createMessageHandler<TRouter extends AnyTRPCRouter>(
  router: TRouter,
  createContext?: () => Promise<inferRouterContext<TRouter>>,
) {
  return async ({ path, input, type }: TrpcMessage) => {
    console.log({ path, input, type })
    return callTRPCProcedure({
      ctx: await createContext?.(),
      router,
      path,
      type,
      input,
      getRawInput: () => Promise.resolve(input),
      signal: new AbortController().signal,
    })
  }
}
