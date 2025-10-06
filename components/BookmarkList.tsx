import { Array, pipe } from 'effect'
import type { z } from 'zod/v4'
import { BookmarkPreview } from '~/components/BookmarkPreview'
import type { zBookmark } from '~/shared/client/zod.gen'

interface BookmarkListProps {
  bookmarks: z.infer<typeof zBookmark>[] | undefined
  isPending: boolean
  error: Error | null
}

export function BookmarkList({ bookmarks, isPending, error }: BookmarkListProps) {
  if (isPending) {
    return (
      <div className="p-6 text-center">
        <p className="text-foreground/80">Searching...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <p className="text-destructive">An error occurred: {error.message}</p>
      </div>
    )
  }

  if (!bookmarks || bookmarks.length === 0) {
    return (
      <div className="p-6 text-center">
        <p className="text-foreground/80">No bookmarks found.</p>
      </div>
    )
  }

  return (
    <div className="max-h-[400px] w-full overflow-y-auto">
      {pipe(
        bookmarks,
        Array.filter((bookmark) => bookmark.content.type === 'link'),
        Array.map((bookmark) => (
          <div key={bookmark.id} className="rounded-lg transition-colors hover:bg-accent/50">
            <BookmarkPreview bookmark={bookmark} />
          </div>
        )),
      )}
    </div>
  )
}
