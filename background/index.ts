import { appRouter } from '~/trpc'
import { createTrpcAdapter } from '~/trpc/adapter'
import { BackgroundRuntime } from './runtime'
import { registerAll } from './dynamic-search-engine'
import { migrateData } from './migrate'

createTrpcAdapter(appRouter)

const task = BackgroundRuntime.runFork(registerAll())

task.addObserver((exit) => {
  console.log(exit)
})

migrateData()
