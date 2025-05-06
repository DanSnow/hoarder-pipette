import { useAtomValue } from 'jotai'
import { joinURL } from 'ufo'
import type { z } from 'zod'
import { optionsAtom } from '~/atoms/storage'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import { cn } from '~/lib/utils'
import type { BookmarkSchema } from '~/shared/client'
import { Button } from './ui/button'

export function BookmarkMenu({
  bookmark,
  className,
}: {
  bookmark: z.infer<typeof BookmarkSchema>
  className?: string
}) {
  const { url } = useAtomValue(optionsAtom)
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className={cn('rounded-full', className)} size="icon" variant="outline">
          <span className="i-lucide-ellipsis-vertical" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <a target="_blank" rel="nopener noreferrer" href={joinURL(url, '/dashboard/preview', bookmark.id)}>
          <DropdownMenuLabel>
            <span className="i-lucide-eye" /> View in Hoarder
          </DropdownMenuLabel>
        </a>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
