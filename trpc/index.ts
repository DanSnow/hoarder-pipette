import { TRPCError, initTRPC } from '@trpc/server'
import browser from 'webextension-polyfill' // Import browser from polyfill
import { z } from 'zod' // Import z from zod
import { optionsAtom } from '~/atoms/storage'
import { getSupportedSearchEngines, registerAll } from '~/background/dynamic-search-engine'
import { BackgroundRuntime } from '~/background/runtime'
import { SupportSearchEnginesSchema } from '~/schemas/supported-engines'
import { contract, createClient } from '~/shared/client'
import { store } from '~/store' // Import store

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
  checkInstance: publicProcedure
    .input(
      z.object({
        url: z.string(),
        apiKey: z.string(),
      }),
    )
    .output(
      z.object({
        ok: z.boolean(),
        status: z.number(),
        message: z.string().optional(),
      }),
    )
    .query(async ({ input }) => {
      const client = createClient(input.url, input.apiKey)

      try {
        const res = await client.getLists()
        console.log(res)
        return {
          ok: res.status === 200,
          status: res.status,
        }
      } catch (error) {
        return {
          ok: false,
          status: 0,
          message: (error as Error).message,
        }
      }
    }),
  searchBookmark: publicProcedure
    .input(z.object({ input: z.object({ json: z.object({ text: z.string() }) }) })) // Correct input structure
    .output(contract.searchBookmark.responses[200])
    .query(async ({ input }) => {
      const options = await store.get(optionsAtom) // Use store.get
      if (!options.apiKey || !options.url) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'API key or URL is not configured.',
        })
      }
      const client = createClient(options.url, options.apiKey)
      const response = await client.searchBookmark({
        query: input, // Pass input directly
      })

      if (response.status !== 200) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `Failed to fetch bookmarks: ${response.status}`,
        })
      }

      return response.body
    }),
  checkAllUrlsPermission: publicProcedure.query(async () => {
    // Check for <all_urls> permission in the background script
    if (browser.permissions) {
      // Use browser from polyfill
      return browser.permissions.contains({ origins: ['<all_urls>'] })
    }
    // Assume true in non-extension environments (e.g., Storybook)
    return true
  }),
})

export type AppRouter = typeof appRouter
