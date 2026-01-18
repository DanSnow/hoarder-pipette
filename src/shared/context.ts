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

  constructor(private connect: () => Browser.runtime.Port) {
    this.port = this.connect()
    this.setupPort()
  }

  private setupPort() {
    this.port.onDisconnect.addListener(this.handleDisconnect)
    this.port.onMessage.addListener(this.forwardMessage)
  }

  private handleDisconnect = () => {
    this.port.onDisconnect.removeListener(this.handleDisconnect)
    this.port.onMessage.removeListener(this.forwardMessage)
    this.port = this.connect()
    this.setupPort()
  }

  private forwardMessage = (message: unknown) => {
    for (const listener of this.messageListeners) {
      listener(message)
    }
  }

  private reconnect() {
    this.handleDisconnect()
  }

  onDisconnect = {
    addListener: (_callback: () => void) => {},
  }

  onMessage = {
    addListener: (callback: (message: unknown) => void) => {
      this.messageListeners.push(callback)
    },
  }

  // Retry once on failure (port may have disconnected)
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
