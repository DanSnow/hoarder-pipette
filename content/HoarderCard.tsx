import { useQuery } from '@tanstack/react-query'
import { Array, pipe } from 'effect'
import { useAtomValue } from 'jotai'
import { optionsAtom } from '~/atoms/storage'
import { BookmarkPreview } from '~/components/BookmarkPreview'
import { Card, CardContent, CardHeader } from '~/components/ui/card'
import { ScrollArea, ScrollBar } from '~/components/ui/scroll-area'
import { trpc } from '~/shared/context' // Import trpc client

export function HoarderCard({ className, userQuery }: { className?: string; userQuery: string }) {
  const options = useAtomValue(optionsAtom)
  const { data } = useQuery(
    // Use useQuery with trpc.searchBookmark.queryOptions
    trpc.searchBookmark.queryOptions(
      {
        input: {
          json: {
            text: userQuery,
          },
        },
      },
      {
        enabled: Boolean(userQuery),
        gcTime: 600_000, // 10 minutes,
        staleTime: 300_000, // 5 minutes,
      },
    ),
  )

  if (!options.apiKey || !options.url) {
    return (
      <div className="rounded-md bg-background p-2">
        <h2 className="text-center font-bold text-foreground text-lg">
          Hoarder's Pipette: Please open options page to configure your API key and URL
        </h2>
      </div>
    )
  }

  if (!userQuery) {
    return null
  }

  const bookmarks = data?.result?.data?.json?.bookmarks

  if (!bookmarks || bookmarks.length === 0) {
    return null
  }

  return (
    <Card className={className}>
      <CardHeader>
        <h2 className="font-bold text-xl">Hoarder Bookmarks</h2>
      </CardHeader>
      <CardContent>
        <ScrollArea className="@container h-72 pr-8">
          <div className="flex flex-col gap-2">
            {pipe(
              bookmarks, // Use the bookmarks array
              Array.filter((bookmark) => bookmark.content.type === 'link'),
              Array.map((bookmark) => <BookmarkPreview key={bookmark.id} bookmark={bookmark} />),
            )}
          </div>
          <ScrollBar orientation="vertical" />
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
