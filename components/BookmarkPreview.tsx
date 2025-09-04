import {useQuery} from '@tanstack/react-query' // Import useQuery
import {useEffect, useState} from 'react'
import invariant from 'tiny-invariant'
import type {z} from 'zod/v4'
import {decodeEntities} from '~/lib/utils'
import type {zBookmark} from '~/shared/client/zod.gen'
import {orpc} from '~/shared/context' // Import orpc client
import {Clock, ExternalLink, Star} from "lucide-react";
import {Button} from "~/components/ui/button";
import {useAtomValue} from 'jotai'
import {joinURL} from 'ufo'
import {optionsAtom} from '~/atoms/storage'

export function BookmarkPreview({bookmark}: { bookmark: z.infer<typeof zBookmark> }) {
  invariant(bookmark.content.type === 'link', 'bookmark is not link')

  const {imageUrl, title, description} = bookmark.content
  const {url} = useAtomValue(optionsAtom)

  const isFirefox = import.meta.env.EXTENSION_BROWSER === 'firefox'
  const [hasAllUrlsPermission, setHasAllUrlsPermission] = useState(!isFirefox) // Assume true if not Firefox

  // Use oRPC to check for <all_urls> permission in the background script
  const {data: permissionData, isLoading} = useQuery(
    orpc.checkAllUrlsPermission.queryOptions({
      enabled: isFirefox, // Only check permission if in Firefox
    }),
  )

  useEffect(() => {
    if (isFirefox && !isLoading && permissionData !== undefined) {
      setHasAllUrlsPermission(permissionData)
    }
  }, [isLoading, permissionData])

  // Image should be displayed if imageUrl exists AND (it's not Firefox OR it is Firefox and has <all_urls> permission)
  const shouldDisplayImage = imageUrl && (!isFirefox || hasAllUrlsPermission)

  // Format the created date
  const formattedDate = bookmark.createdAt

  return (
    <div className="group relative p-3 transition-colors">
      <div className="flex items-start gap-3">
        {/* Thumbnail */}
        {shouldDisplayImage && (
          <div
            className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
            <img
              className="h-full w-full object-cover"
              src={imageUrl}
              alt={title || 'Bookmark thumbnail'}
              onError={(e) => {
                // Fallback to a placeholder if image fails to load
                const target = e.target as HTMLImageElement
                target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2NCIgaGVpZ2h0PSI2NCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiA3N2FhZTYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBjbGFzcz0ibHVjaWRlIGx1Y2lkZS1ib29rbWFyayI+PHBhdGggZD0iTTYgNHYxNmA1IDUgMCAwIDAgNy4zMDEgNC41ODFMMTIgMjMuMzE2bC0xLjMwMS0xLjczNUExLjgxIDEuODEgMCAwIDEgMTAgMjAuNjVWN2E1IDUgMCAwIDEgMTAgMHYxMy42NWEuODY1Ljg2NSAwIDAgMS0xLjI0OC44MzRMMTIgMjEuNzYiLz48L3N2Zz4='
              }}
            />
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <a
              href={bookmark.content.url}
              target="_blank"
              rel="noreferrer noopener"
              className="block group-hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm -mx-1 px-1 -my-0.5"
            >
              <h3 className="text-sm font-medium text-foreground line-clamp-2">
                {decodeEntities(title || 'Untitled Bookmark')}
              </h3>
            </a>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  // TODO: Implement favorite functionality
                }}
              >
                <Star className="h-3.5 w-3.5"/>
              </Button>
            </div>
          </div>

          {description && (
            <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
              {decodeEntities(description)}
            </p>
          )}

          <div className="mt-2 flex items-center text-xs text-muted-foreground">
            {formattedDate && (
              <div className="flex items-center">
                <Clock className="mr-1 h-3 w-3"/>
                <span>{formattedDate}</span>
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
                  View in Karakeep
                  <ExternalLink className="ml-1 h-3 w-3"/>
                </a>
              </>
            )}
          </div>

          {/* Tags would go here if available */}
          {/* {bookmark.tags && bookmark.tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {bookmark.tags.map(tag => (
                <span key={tag} className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                  {tag}
                </span>
              ))}
            </div>
          )} */}
        </div>
      </div>
    </div>
  )
}
