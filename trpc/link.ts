import { TRPCClientError, type TRPCLink } from '@trpc/client'
import type { AnyTRPCRouter } from '@trpc/server'
import { observable } from '@trpc/server/observable'
import { sendMessage } from './channel'

export const createLink = <T extends AnyTRPCRouter>(): TRPCLink<T> => {
  return () => {
    return ({ op }) => {
      return observable((observer) => {
        if (op.type === 'subscription') {
          observer.error(new TRPCClientError('Unsupported subscription'))
          return
        }

        const sendRequest = async () => {
          const result = await sendMessage('trpc', {
            id: op.id,
            input: op.input,
            path: op.path,
            type: op.type as 'query' | 'mutation',
          })
          observer.next({
            result: {
              type: 'data',
              data: result,
            },
          })
          observer.complete()
        }

        sendRequest()
      })
    }
  }
}
