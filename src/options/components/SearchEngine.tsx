import { AccordionContent, AccordionItem, AccordionTrigger } from '~/components/ui/accordion'
import type { SupportSearchEngine } from '~/schemas/supported-engines'
import { SearchEngineMatchItem } from './SearchEngineMatch'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '~/components/ui/tooltip'
import type { Context } from '../context'
import { useMutation } from '@tanstack/react-query'
import { Effect } from 'effect'
import { requestSite } from '../permission'

export function SearchEngine({
  engine,
  trpc,
  trpcUtils,
}: { engine: SupportSearchEngine; trpc: Context['trpc']; trpcUtils: Context['trpcUtils'] }) {
  const totalMatches = engine.matches.length
  const enabledMatches = engine.matches.filter((m) => m.isEnabled).length
  const { mutate: registerAll } = trpc.registerAll.useMutation()
  const { mutate } = useMutation({
    mutationKey: ['requestSitePermission'],
    mutationFn: () => {
      return Effect.runPromise(requestSite(engine))
    },
    onSuccess: () => {
      trpcUtils.listSupportedSearchEngines.invalidate()
      registerAll()
    },
  })

  return (
    <AccordionItem value={engine.name}>
      <AccordionTrigger>
        <div className="flex items-center gap-2">
          <h2 className="font-bold text-lg">{engine.name}</h2>
          {totalMatches === enabledMatches ? (
            <Badge className="bg-green-400">All Enabled</Badge>
          ) : (
            <Badge>
              {enabledMatches}/{totalMatches}
            </Badge>
          )}
        </div>
        {enabledMatches !== totalMatches && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="badge" onClick={() => mutate()}>
                <span className="i-lucide-check-check" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Enable on site</TooltipContent>
          </Tooltip>
        )}
      </AccordionTrigger>
      <AccordionContent>
        {engine.matches.map((match) => (
          <SearchEngineMatchItem key={match.match} match={match} trpc={trpc} trpcUtils={trpcUtils} />
        ))}
      </AccordionContent>
    </AccordionItem>
  )
}
