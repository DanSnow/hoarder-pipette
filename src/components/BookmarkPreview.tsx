import { useQuery } from '@tanstack/react-query' // Import useQuery
import { useAtomValue } from 'jotai'
import { Clock, ExternalLink } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import invariant from 'tiny-invariant'
import { joinURL } from 'ufo'

import { optionsAtom } from '~/atoms/storage'
import { useInView } from '~/hooks/use-in-view'
import { BOOKMARK_PLACEHOLDER_SVG, decodeEntities, formattedDate } from '~/lib/utils'
import type { BookmarkSearchResult } from '~/schemas/bookmark-search-result'
import { orpc } from '~/shared/context' // Import orpc client

/** Renders a bookmark search result with hydrated metadata and preview imagery. */
export function BookmarkPreview({ bookmark }: { bookmark: BookmarkSearchResult }) {
  invariant(bookmark.content.type === 'link', 'bookmark is not link')

  const previewRef = useRef<HTMLDivElement>(null)
  const isVisible = useInView(previewRef, { rootMargin: '200px' })

  const { data: hydratedBookmark } = useQuery(
    orpc.getBookmark.queryOptions({
      input: {
        bookmarkId: bookmark.id,
      },
      enabled: isVisible,
      staleTime: 300_000,
    }),
  )

  const previewBookmark = hydratedBookmark ?? bookmark
  const content = previewBookmark.content as Extract<typeof previewBookmark.content, { type: 'link' }>
  const { imageUrl, description } = content
  const title = previewBookmark.title ?? content.title
  const previewAssetId = content.imageAssetId || content.screenshotAssetId
  const { url } = useAtomValue(optionsAtom)

  const isFirefox = import.meta.env.EXTENSION_BROWSER === 'firefox'
  const [hasAllUrlsPermission, setHasAllUrlsPermission] = useState(!isFirefox) // Assume true if not Firefox

  // Use oRPC to check for <all_urls> permission in the background script
  const { data: permissionData, isLoading } = useQuery(
    orpc.checkAllUrlsPermission.queryOptions({
      enabled: isFirefox, // Only check permission if in Firefox
    }),
  )

  const { data: assetDataUrl } = useQuery(
    orpc.getAssetDataUrl.queryOptions({
      input: {
        assetId: previewAssetId ?? '',
      },
      enabled: isVisible && Boolean(previewAssetId),
      staleTime: 60_000,
    }),
  )

  useEffect(() => {
    if (isFirefox && !isLoading && permissionData !== undefined) {
      setHasAllUrlsPermission(permissionData)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- isFirefox is a build-time constant
  }, [isLoading, permissionData])

  // Image should be displayed if it is an authenticated Karakeep asset, or if
  // an existing external preview image exists and the browser has permission to load it.
  // Avoid falling back to favicons here: loading a bookmarked site's favicon from
  // a search-result page can disclose private bookmark matches to that origin.
  const previewImageUrl = assetDataUrl || imageUrl || undefined
  const shouldDisplayImage = assetDataUrl || (imageUrl && (!isFirefox || hasAllUrlsPermission))

  // Format the created date
  const formattedDateString = formattedDate(previewBookmark.createdAt)

  return (
    <div ref={previewRef} className="group relative p-3 transition-colors">
      <div className="flex flex-wrap items-start gap-3">
        {/* Thumbnail */}
        {shouldDisplayImage && (
          <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
            <img
              className="h-full w-full object-cover"
              src={previewImageUrl}
              alt={title || 'Bookmark thumbnail'}
              referrerPolicy="no-referrer"
              onError={(e) => {
                // Fallback to a placeholder if image fails to load
                const target = e.target as HTMLImageElement
                target.src = BOOKMARK_PLACEHOLDER_SVG
              }}
            />
          </div>
        )}

        {/* Content */}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <a
              href={content.url}
              target="_blank"
              rel="noreferrer noopener"
              className="-mx-1 -my-0.5 block rounded-sm px-1 hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              <h3 className="line-clamp-2 text-sm font-medium text-foreground">
                {decodeEntities(title || 'Untitled Bookmark')}
              </h3>
            </a>
          </div>

          {description && (
            <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{decodeEntities(description)}</p>
          )}

          <div className="mt-2 flex items-center text-xs text-muted-foreground">
            {formattedDateString && (
              <div className="flex items-center">
                <Clock className="mr-1 h-3 w-3" />
                <span>{formattedDateString}</span>
              </div>
            )}

            {content.url && url && (
              <>
                <span className="mx-2">•</span>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={joinURL(url, '/dashboard/preview', previewBookmark.id)}
                  className="flex items-center text-blue-600 hover:underline dark:text-blue-400"
                  onClick={(e) => e.stopPropagation()}
                >
                  <span className="mx-2">
                    View in Karakeep
                    <ExternalLink className="ml-1 inline-block h-3 w-3" />
                  </span>
                </a>
              </>
            )}
          </div>

          {/* Tags would go here if available */}
          {url && previewBookmark.tags && previewBookmark.tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {previewBookmark.tags.map((tag) => (
                <a
                  key={tag.id}
                  href={joinURL(url, '/dashboard/tags', tag.id)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                  onClick={(e) => e.stopPropagation()}
                >
                  {tag.name}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
