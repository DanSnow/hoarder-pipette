import type { SupportSearchEngine } from '~/schemas/supported-engines'
import { useMutation } from '@tanstack/react-query'
import { Link, useRouteContext } from '@tanstack/react-router'
import { Effect } from 'effect'
import { requestSite } from '../permission'
import { ListBoxItem } from '~/components/ui/listbox'
import { SearchEngineStateButton } from './SearchEngineStateButton'
import { Button } from '~/components/ui/button'

export function SearchEngine({ engine }: { engine: SupportSearchEngine }) {
  const { trpc, trpcUtils } = useRouteContext({ from: '__root__' })

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
        <h2 className="grow font-bold text-lg">{engine.name}</h2>
        <Link to="/search-engines/$id" params={{ id: engine.id }}>
          <Button size="sm" variant="ghost">
            <span className="i-lucide-chevron-right" />
          </Button>
        </Link>
      </div>
    </ListBoxItem>
  )
}
