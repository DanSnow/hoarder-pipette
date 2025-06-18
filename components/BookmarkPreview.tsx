import { useQuery } from '@tanstack/react-query' // Import useQuery
import { useEffect, useState } from 'react'
import invariant from 'tiny-invariant'
import type { z } from 'zod/v4'
import { cn, decodeEntities } from '~/lib/utils'
import type { zBookmark } from '~/shared/client/zod.gen'
import { orpc } from '~/shared/context' // Import orpc client
import { BookmarkMenu } from './BookmarkMenu'

export function BookmarkPreview({ bookmark }: { bookmark: z.infer<typeof zBookmark> }) {
  invariant(bookmark.content.type === 'link', 'bookmark is not link')

  const { imageUrl, title, description } = bookmark.content

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
  }, [isLoading, permissionData])

  // Image should be displayed if imageUrl exists AND (it's not Firefox OR it is Firefox and has <all_urls> permission)
  const shouldDisplayImage = imageUrl && (!isFirefox || hasAllUrlsPermission)

  return (
    <div className="relative">
      <a className="block h-full min-h-16" href={bookmark.content.url} target="_blank" rel="noreferrer noopener">
        <div
          className={cn(
            'flex h-full @md:flex-row flex-col @md:items-center @md:gap-2 p-2 shadow-none transition-all duration-200 hover:shadow-lg dark:shadow-gray-500',
            {
              'px-4': !shouldDisplayImage, // Adjust padding if image is not displayed
            },
          )}
        >
          {shouldDisplayImage && (
            <div className="relative aspect-square size-32 overflow-clip">
              <img className="absolute inset-0 m-auto object-contain" src={imageUrl} alt={title || 'image'} />
            </div>
          )}
          <div>
            <h3 className="font-bold">{decodeEntities(title ?? '')}</h3>
            <p className="line-clamp-2 text-gray-500 dark:text-gray-300">{decodeEntities(description ?? '')}</p>
          </div>
        </div>
      </a>
      <BookmarkMenu bookmark={bookmark} className="absolute top-0 right-0" />
    </div>
  )
}
