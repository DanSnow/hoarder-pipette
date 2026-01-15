import { useQuery } from '@tanstack/react-query' // Import useQuery
import { useAtomValue } from 'jotai'
import { Clock, ExternalLink } from 'lucide-react'
import { useEffect, useState } from 'react'
import invariant from 'tiny-invariant'
import { joinURL } from 'ufo'
import type { z } from 'zod/v4'

import { optionsAtom } from '~/atoms/storage'
import { BOOKMARK_PLACEHOLDER_SVG, decodeEntities, formattedDate } from '~/lib/utils'
import type { zBookmark } from '~/shared/client/zod.gen'
import { orpc } from '~/shared/context' // Import orpc client

export function BookmarkPreview({ bookmark }: { bookmark: z.infer<typeof zBookmark> }) {
  invariant(bookmark.content.type === 'link', 'bookmark is not link')

  const { imageUrl, title, description } = bookmark.content
  const { url } = useAtomValue(optionsAtom)

  const isFirefox = import.meta.env.EXTENSION_BROWSER === 'firefox'
  const [hasAllUrlsPermission, setHasAllUrlsPermission] = useState(!isFirefox) // Assume true if not Firefox

  // Use oRPC to check for <all_urls> permission in the background script
  const { data: permissionData, isLoading } = useQuery(
    orpc.checkAllUrlsPermission.queryOptions({
      enabled: isFirefox, // Only check permission if in Firefox
    }),
  )

  useEffect(() => {
    if (isFirefox && !isLoading && permissionData !== undefined) {
      setHasAllUrlsPermission(permissionData)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- isFirefox is a build-time constant
  }, [isLoading, permissionData])

  // Image should be displayed if imageUrl exists AND (it's not Firefox OR it is Firefox and has <all_urls> permission)
  const shouldDisplayImage = imageUrl && (!isFirefox || hasAllUrlsPermission)

  // Format the created date
  const formattedDateString = formattedDate(bookmark.createdAt)

  return (
    <div className="group relative p-3 transition-colors">
      <div className="flex flex-wrap items-start gap-3">
        {/* Thumbnail */}
        {shouldDisplayImage && (
          <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
            <img
              className="h-full w-full object-cover"
              src={imageUrl}
              alt={title || 'Bookmark thumbnail'}
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
              href={bookmark.content.url}
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

            {bookmark.content.url && url && (
              <>
                <span className="mx-2">•</span>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={joinURL(url, '/dashboard/preview', bookmark.id)}
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
          {bookmark.tags && bookmark.tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {bookmark.tags.map((tag) => (
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
