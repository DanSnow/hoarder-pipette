import { createORPCClient } from '@orpc/client'
import { RPCLink } from '@orpc/client/message-port'
import type { RouterClient } from '@orpc/server'
import { createTanstackQueryUtils } from '@orpc/tanstack-query'
import { QueryClient } from '@tanstack/react-query'
import { browser } from 'wxt/browser'

import type { AppRouter } from '~/orpc'

class ReconnectingPort {
  private port: Browser.runtime.Port
  private messageListeners: ((message: unknown) => void)[] = []
  private disconnectListeners: (() => void)[] = []

  constructor(private connect: () => Browser.runtime.Port) {
    this.port = this.connect()
    this.setupPort()
  }

  private setupPort() {
    this.port.onDisconnect.addListener(() => {
      this.reconnect()
    })
    this.port.onMessage.addListener((message) => {
      for (const listener of this.messageListeners) {
        listener(message)
      }
    })
  }

  private reconnect() {
    this.port = this.connect()
    this.setupPort()
  }

  onDisconnect = {
    addListener: (callback: () => void) => {
      this.disconnectListeners.push(callback)
    },
  }

  onMessage = {
    addListener: (callback: (message: unknown) => void) => {
      this.messageListeners.push(callback)
    },
  }

  postMessage(message: unknown) {
    try {
      this.port.postMessage(message)
    } catch {
      this.reconnect()
      this.port.postMessage(message)
    }
  }
}

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

const port = new ReconnectingPort(() => browser.runtime.connect())

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
