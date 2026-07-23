import { Array, pipe } from 'effect'

import { BookmarkPreview } from '~/components/BookmarkPreview'
import type { BookmarkSearchResult } from '~/schemas/bookmark-search-result'

interface BookmarkListProps {
  bookmarks: BookmarkSearchResult[] | undefined
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
    <div className="max-h-100 w-full scrollbar-thin scrollbar-thumb-muted-foreground scrollbar-track-muted overflow-y-auto">
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
