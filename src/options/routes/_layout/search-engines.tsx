import { createFileRoute, Link } from '@tanstack/react-router'
import { SearchEngine } from '../../components/SearchEngine'
import { ListBox } from '~/components/ui/listbox'
import { Button } from '~/components/ui/button'
import { getCurrentTabUrl, isAllowUrl } from '../../utils'

export const Route = createFileRoute('/_layout/search-engines')({
  component: RouteComponent,
  loader: async () => {
    const url = await getCurrentTabUrl()
    return isAllowUrl(url)
  },
})

function RouteComponent() {
  const { trpc } = Route.useRouteContext()
  const { data } = trpc.listSupportedSearchEngines.useQuery()
  const isAllowUrl = Route.useLoaderData()

  console.log(data)

  return (
    <div>
      <Link to="/search-engines/apply" disabled={!isAllowUrl}>
        <Button className="w-full" disabled={!isAllowUrl}>
          Enable on this page
        </Button>
      </Link>
      <ListBox>
        {data?.map((engine) => (
          <SearchEngine key={engine.name} engine={engine} />
        ))}
      </ListBox>
    </div>
  )
}
