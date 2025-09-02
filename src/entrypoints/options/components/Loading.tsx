import { Skeleton } from '~/components/ui/skeleton'

export function Loading() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-64 w-full" />
    </div>
  )
}
