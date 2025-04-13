import invariant from 'tiny-invariant'
import type { z } from 'zod'
import type { BookmarkSchema } from '~/client'
import { cn, decodeEntities } from '~/lib/utils'
import { BookmarkMenu } from './BookmarkMenu'

export function BookmarkPreview({ bookmark }: { bookmark: z.infer<typeof BookmarkSchema> }) {
  invariant(bookmark.content.type === 'link', 'bookmark is not link')

  const { imageUrl, title, description } = bookmark.content
  const hasImage = !!imageUrl

  return (
    <div className="relative">
      <a className="block h-full min-h-16" href={bookmark.content.url} target="_blank" rel="noreferrer noopener">
        <div
          className={cn(
            'flex h-full @md:flex-row flex-col @md:items-center @md:gap-2 p-2 shadow-none transition-all duration-200 hover:shadow-lg dark:shadow-gray-500',
            {
              'px-4': !hasImage,
            },
          )}
        >
          {imageUrl && (
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
