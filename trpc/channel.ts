import { defineExtensionMessaging } from '@webext-core/messaging'

export interface TrpcMessage {
  id: number
  path: string
  type: 'query' | 'mutation'
  input: unknown
}

interface Protocol {
  trpc(message: TrpcMessage): Promise<unknown>
}

export const { onMessage, sendMessage } = defineExtensionMessaging<Protocol>()
