import { createFileRoute } from '@tanstack/react-router'
import { SearchEngine } from '../components/SearchEngine'
import { Accordion } from '~/components/ui/accordion'

export const Route = createFileRoute('/search-engines')({
  component: RouteComponent,
})

function RouteComponent() {
  const { trpc, trpcUtils } = Route.useRouteContext()
  const { data } = trpc.listSupportedSearchEngines.useQuery()
  console.log(data)

  return (
    <Accordion type="multiple" className="w-full">
      {data?.map((engine) => (
        <SearchEngine key={engine.name} engine={engine} trpc={trpc} trpcUtils={trpcUtils} />
      ))}
    </Accordion>
  )
}
