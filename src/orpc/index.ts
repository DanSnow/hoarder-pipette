import { ORPCError, os } from '@orpc/server'
import { joinURL } from 'ufo'
import { browser } from 'wxt/browser'
import { z } from 'zod/v4' // Import z from zod

import { optionsAtom } from '~/atoms/storage'
import { getSupportedSearchEngines, registerAll } from '~/entrypoints/background/dynamic-search-engine'
import { BackgroundRuntime } from '~/entrypoints/background/runtime'
import { SupportSearchEnginesSchema } from '~/schemas/supported-engines'
import { createClient } from '~/shared/client/client'
import { zBookmarkSearchResult } from '~/schemas/bookmark-search-result'
import { karakeep } from '~/shared/karakeep'
import { store } from '~/store' // Import store

const API_PREFIX = '/api/v1'

async function responseToDataUrl(response: Response) {
  const contentType = response.headers.get('content-type') ?? 'application/octet-stream'
  const bytes = new Uint8Array(await response.arrayBuffer())
  const chunkSize = 0x8000
  let binary = ''

  for (let index = 0; index < bytes.length; index += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(index, index + chunkSize))
  }

  return `data:${contentType};base64,${btoa(binary)}`
}

export const appRouter = os.router({
  registerAll: os.output(z.void()).handler(() => {
    return BackgroundRuntime.runPromise(registerAll())
  }),
  listSupportedSearchEngines: os.output(SupportSearchEnginesSchema).handler(() => {
    return BackgroundRuntime.runPromise(getSupportedSearchEngines())
  }),
  checkInstance: os
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
    .handler(async ({ input }) => {
      try {
        const { body, response } = await karakeep.getLists({
          client: createClient({
            baseUrl: joinURL(input.url, API_PREFIX),
            auth: () => input.apiKey,
          }),
        })
        console.log(body)
        return {
          ok: response.status === 200,
          status: response.status,
        }
      } catch (error) {
        console.log(error)
        return {
          ok: false,
          status: 0,
          message: (error as Error).message,
        }
      }
    }),
  searchBookmark: os
    .input(z.object({ text: z.string() })) // Correct input structure
    .output(z.array(zBookmarkSearchResult))
    .handler(async ({ input }) => {
      const options = await store.get(optionsAtom) // Use store.get
      if (!options.apiKey || !options.url) {
        throw new ORPCError('UNAUTHORIZED', {
          message: 'API key or URL is not configured.',
        })
      }
      const { body, response } = await karakeep.getBookmarksSearch({
        query: {
          q: input.text,
        },
        client: createClient({
          baseUrl: joinURL(options.url, API_PREFIX),
          auth: () => options.apiKey,
        }),
      })

      if (response.status !== 200) {
        throw new ORPCError('INTERNAL_SERVER_ERROR', {
          message: `Failed to fetch bookmarks: ${response.status}`,
        })
      }

      const client = createClient({
        baseUrl: joinURL(options.url, API_PREFIX),
        auth: () => options.apiKey,
      })

      return Promise.all(
        body.bookmarks.map(async (bookmark) => {
          const { body: hydratedBookmark, response: hydratedResponse } = await karakeep.getBookmarksByBookmarkId({
            path: {
              bookmarkId: bookmark.id,
            },
            query: {
              includeContent: true,
            },
            client,
          })

          if (hydratedResponse.status !== 200) {
            return bookmark
          }

          return hydratedBookmark
        }),
      )
    }),
  getAssetDataUrl: os
    .input(z.object({ assetId: z.string() }))
    .output(z.string())
    .handler(async ({ input }) => {
      const options = await store.get(optionsAtom)
      if (!options.apiKey || !options.url) {
        throw new ORPCError('UNAUTHORIZED', {
          message: 'API key or URL is not configured.',
        })
      }

      const response = await fetch(joinURL(options.url, API_PREFIX, 'assets', input.assetId), {
        headers: {
          Authorization: `Bearer ${options.apiKey}`,
        },
      })

      if (!response.ok) {
        throw new ORPCError('INTERNAL_SERVER_ERROR', {
          message: `Failed to fetch asset: ${response.status}`,
        })
      }

      return responseToDataUrl(response)
    }),
  checkAllUrlsPermission: os.output(z.boolean()).handler(async () => {
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
