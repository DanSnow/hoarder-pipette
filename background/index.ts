import { experimental_RPCHandler as RPCHandler } from '@orpc/server/message-port'
import browser from 'webextension-polyfill'
import { appRouter } from '~/orpc'
import { registerAll } from './dynamic-search-engine'
import { migrateData } from './migrate'
import { BackgroundRuntime } from './runtime'

const handler = new RPCHandler(appRouter)

browser.runtime.onConnect.addListener((port) => {
  handler.upgrade(port, {
    context: {}, // provide initial context if needed
  })
})

const task = BackgroundRuntime.runFork(registerAll())

task.addObserver((exit) => {
  console.log(exit)
})

migrateData()
