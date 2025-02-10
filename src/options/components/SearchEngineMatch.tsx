import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { TooltipContent, Tooltip, TooltipTrigger } from '~/components/ui/tooltip'
import { cn } from '~/lib/utils'
import type { SearchEngineMatch } from '~/schemas/supported-engines'
import { useMutation } from '@tanstack/react-query'
import { Effect } from 'effect'
import { requestOrigin } from '../permission'
import { useRouteContext } from '@tanstack/react-router'

export function SearchEngineMatchItem({ match }: { match: SearchEngineMatch }) {
  const { trpc, trpcUtils } = useRouteContext({ from: '__root__' })
  const { mutate: registerAll } = trpc.registerAll.useMutation()
  const { mutate } = useMutation({
    mutationKey: ['requestOriginPermission'],
    mutationFn: () => {
      return Effect.runPromise(requestOrigin(match.originUrl))
    },
    onSuccess: async () => {
      trpcUtils.listSupportedSearchEngines.invalidate()
      registerAll()
    },
  })
  return (
    <div className={cn('flex items-center justify-between gap-2', { 'py-2': match.isEnabled })}>
      <p className="w-2/3 truncate underline">{match.match}</p>
      {match.isEnabled ? (
        <Badge className="bg-green-400">
          <span className="i-lucide-check" />
        </Badge>
      ) : (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button size="badge" onClick={() => mutate()}>
              <span className="i-lucide-check" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Enable on url</TooltipContent>
        </Tooltip>
      )}
    </div>
  )
}
