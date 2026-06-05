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
const MAX_ASSET_DATA_URL_BYTES = 1_000_000
const ASSET_FETCH_TIMEOUT_MS = 10_000

function encodeAssetIdPathSegment(assetId: string) {
  if (!assetId || assetId === '.' || assetId === '..' || assetId.includes('/') || assetId.includes('\\')) {
    return null
  }

  return encodeURIComponent(assetId)
}

/**
 * Converts a small authenticated image response into a data URL for previews.
 *
 * Non-image responses, missing streams, and images over the size limit return
 * `null` so callers can fall back to external images, favicons, or placeholders.
 */
async function responseToDataUrl(response: Response) {
  const contentType = response.headers.get('content-type') ?? 'application/octet-stream'
  if (!contentType.toLowerCase().startsWith('image/')) {
    return null
  }

  const contentLength = Number(response.headers.get('content-length'))
  if (Number.isFinite(contentLength) && contentLength > MAX_ASSET_DATA_URL_BYTES) {
    return null
  }

  if (!response.body) {
    return null
  }

  const reader = response.body.getReader()
  const chunks: BlobPart[] = []
  let totalBytes = 0

  while (true) {
    const { done, value } = await reader.read()
    if (done) {
      break
    }

    totalBytes += value.byteLength
    if (totalBytes > MAX_ASSET_DATA_URL_BYTES) {
      await reader.cancel()
      return null
    }

    chunks.push(new Uint8Array(value))
  }

  const blob = new Blob(chunks, { type: contentType })

  return new Promise<string | null>((resolve) => {
    const fileReader = new FileReader()
    fileReader.onloadend = () => resolve(fileReader.result as string)
    fileReader.onerror = () => resolve(null)
    fileReader.readAsDataURL(blob)
  })
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

      return body.bookmarks
    }),
  getBookmark: os
    .input(z.object({ bookmarkId: z.string() }))
    .output(zBookmarkSearchResult.nullable())
    .handler(async ({ input }) => {
      const options = await store.get(optionsAtom)
      if (!options.apiKey || !options.url) {
        throw new ORPCError('UNAUTHORIZED', {
          message: 'API key or URL is not configured.',
        })
      }

      try {
        const { body, response } = await karakeep.getBookmarksByBookmarkId({
          path: {
            bookmarkId: input.bookmarkId,
          },
          query: {
            includeContent: true,
          },
          client: createClient({
            baseUrl: joinURL(options.url, API_PREFIX),
            auth: () => options.apiKey,
          }),
        })

        if (response.status !== 200) {
          return null
        }

        return body
      } catch {
        return null
      }
    }),
  getAssetDataUrl: os
    .input(z.object({ assetId: z.string() }))
    .output(z.string().nullable())
    .handler(async ({ input }) => {
      const options = await store.get(optionsAtom)
      if (!options.apiKey || !options.url) {
        throw new ORPCError('UNAUTHORIZED', {
          message: 'API key or URL is not configured.',
        })
      }

      const encodedAssetId = encodeAssetIdPathSegment(input.assetId)
      if (!encodedAssetId) {
        return null
      }

      const abortController = new AbortController()
      const timeoutId = setTimeout(() => abortController.abort(), ASSET_FETCH_TIMEOUT_MS)

      try {
        const response = await fetch(joinURL(options.url, API_PREFIX, 'assets', encodedAssetId), {
          headers: {
            Authorization: `Bearer ${options.apiKey}`,
          },
          signal: abortController.signal,
        })

        if (!response.ok) {
          return null
        }

        return await responseToDataUrl(response)
      } catch {
        return null
      } finally {
        clearTimeout(timeoutId)
      }
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
