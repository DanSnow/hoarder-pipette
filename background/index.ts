import { appRouter } from '~/trpc'
import { createTrpcAdapter } from '~/trpc/adapter'
import { registerAll } from './dynamic-search-engine'
import { migrateData } from './migrate'
import { BackgroundRuntime } from './runtime'

createTrpcAdapter(appRouter)

const task = BackgroundRuntime.runFork(registerAll())

task.addObserver((exit) => {
  console.log(exit)
})

migrateData()
