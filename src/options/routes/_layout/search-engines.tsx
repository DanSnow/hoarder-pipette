import { createFileRoute } from '@tanstack/react-router'
import { SearchEngine } from '../../components/SearchEngine'
import { ListBox } from '~/components/ui/listbox'

export const Route = createFileRoute('/_layout/search-engines')({
  component: RouteComponent,
})

function RouteComponent() {
  const { trpc } = Route.useRouteContext()
  const { data } = trpc.listSupportedSearchEngines.useQuery()
  console.log(data)

  return (
    <div>
      <ListBox>
        {data?.map((engine) => (
          <SearchEngine key={engine.name} engine={engine} />
        ))}
      </ListBox>
    </div>
  )
}
