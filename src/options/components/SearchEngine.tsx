import type { SupportSearchEngine } from '~/schemas/supported-engines'
import { Badge } from '~/components/ui/badge'
import { useMutation } from '@tanstack/react-query'
import { useRouteContext } from '@tanstack/react-router'
import { Effect } from 'effect'
import { requestSite } from '../permission'
import { ListBoxItem } from '~/components/ui/listbox'
import { SearchEngineStateButton } from './SearchEngineStateButton'

export function SearchEngine({ engine }: { engine: SupportSearchEngine }) {
  const { trpc, trpcUtils } = useRouteContext({ from: '__root__' })
  const totalMatches = engine.matches.length
  const enabledMatches = engine.matches.filter((m) => m.isEnabled).length

  const { mutate: registerAll } = trpc.registerAll.useMutation()
  const { mutate: requestSitePermission } = useMutation({
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
    <ListBoxItem value={engine}>
      <div className="flex items-center gap-2">
        <SearchEngineStateButton engine={engine} onClick={requestSitePermission} />
        <h2 className="font-bold text-lg">{engine.name}</h2>
        {totalMatches === enabledMatches ? (
          <Badge className="bg-green-400">All Enabled</Badge>
        ) : (
          <Badge>
            {enabledMatches}/{totalMatches}
          </Badge>
        )}
      </div>
    </ListBoxItem>
  )
}
