import { type AnyTRPCRouter, type inferRouterContext, callTRPCProcedure } from '@trpc/server'
import { onMessage, type TrpcMessage } from './channel'

export function createTrpcAdapter<TRouter extends AnyTRPCRouter>(
  router: TRouter,
  createContext?: () => Promise<inferRouterContext<TRouter>>,
) {
  const handleMessage = async ({ path, input, type }: TrpcMessage) => {
    console.log({ path, input, type })
    return callTRPCProcedure({
      ctx: await createContext?.(),
      _def: router._def,
      path,
      type,
      input,
      getRawInput: () => Promise.resolve(input),
      signal: new AbortController().signal,
    })
  }

  onMessage('trpc', (message) => {
    return handleMessage(message.data)
  })
}
