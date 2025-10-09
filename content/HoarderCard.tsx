import {useQuery} from '@tanstack/react-query'
import {useAtomValue} from 'jotai'
import {optionsAtom} from '~/atoms/storage'
import {BookmarkList} from '~/components/BookmarkList'
import {Card, CardContent, CardFooter, CardHeader} from '~/components/ui/card'
import {cn} from '~/lib/utils'
import {orpc} from '~/shared/context'

export function HoarderCard({ className, userQuery }: { className?: string; userQuery: string }) {
  const options = useAtomValue(optionsAtom)
  const {
    data: bookmarks,
    isPending,
    error,
  } = useQuery(
    // Use useQuery with orpc.searchBookmark.queryOptions
    orpc.searchBookmark.queryOptions({
      input: {
        text: userQuery,
      },
      enabled: Boolean(userQuery),
      gcTime: 600_000, // 10 minutes,
      staleTime: 300_000, // 5 minutes,
    }),
  )

  if (!options.apiKey || !options.url) {
    return (
      <Card className="w-full max-w-2xl">
        <CardHeader className="border-gray-200 border-b dark:border-gray-700">
          <h2 className="font-semibold text-foreground text-lg">Hoarder's Pipette</h2>
        </CardHeader>
        <CardContent className="p-6 text-center">
          <p className="text-foreground/80">Please open options page to configure your API key and URL</p>
        </CardContent>
      </Card>
    )
  }

  if (!userQuery) {
    return null
  }

  const hasBookmarks = bookmarks && bookmarks.length > 0

  return (
    <Card className={cn(className, 'w-full max-w-2xl')}>
      <CardHeader className="border-gray-200 border-b px-6 py-4 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-foreground text-xl">Karakeep Bookmarks</h2>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <BookmarkList bookmarks={bookmarks} isPending={isPending} error={error} />
      </CardContent>

      {hasBookmarks && (
        <CardFooter className="flex items-center justify-between border-gray-200 border-t px-6 py-3 dark:border-gray-700">
          <span className="text-muted-foreground text-sm">
            {bookmarks.length} {bookmarks.length === 1 ? 'bookmark' : 'bookmarks'} found
          </span>
        </CardFooter>
      )}
    </Card>
  )
}
