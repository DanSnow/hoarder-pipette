import { initTRPC } from '@trpc/server'
import { getSupportedSearchEngines, registerAll } from '~/background/dynamic-search-engine'
import { BackgroundRuntime } from '~/background/runtime'
import { SupportSearchEnginesSchema } from '~/schemas/supported-engines'

const t = initTRPC.create({
  isServer: false,
  allowOutsideOfServer: true,
})

const publicProcedure = t.procedure.use(async ({ input, next }) => {
  const output = await next()
  console.log({ input, output })
  return output
})

export const appRouter = t.router({
  registerAll: publicProcedure.mutation(() => {
    return BackgroundRuntime.runPromise(registerAll())
  }),
  listSupportedSearchEngines: publicProcedure.output(SupportSearchEnginesSchema).query(() => {
    return BackgroundRuntime.runPromise(getSupportedSearchEngines())
  }),
})

export type AppRouter = typeof appRouter
