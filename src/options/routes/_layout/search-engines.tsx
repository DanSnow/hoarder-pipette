import { useQuery } from '@tanstack/react-query'
import { Link, createFileRoute } from '@tanstack/react-router'
import { useAtomValue } from 'jotai'
import { userSitesAtom } from '~/atoms/storage'
import { Button } from '~/components/ui/button'
import { ListBox } from '~/components/ui/listbox'
import { SearchEngine } from '../../components/SearchEngine'
import { getCurrentTabUrl, isAllowUrl } from '../../utils'

export const Route = createFileRoute('/_layout/search-engines')({
  component: RouteComponent,
  loader: async ({ context: { orpc, queryClient } }) => {
    const url = await getCurrentTabUrl()
    const engines = await queryClient.ensureQueryData(orpc.listSupportedSearchEngines.queryOptions())
    return {
      url,
      isAllowUrl: isAllowUrl(url),
      engines,
    }
  },
  wrapInSuspense: true,
})

function RouteComponent() {
  const { orpc } = Route.useRouteContext()
  const { url, isAllowUrl, engines } = Route.useLoaderData()
  const { data } = useQuery(
    orpc.listSupportedSearchEngines.queryOptions({
      initialData: engines,
    }),
  )
  const userSites = useAtomValue(userSitesAtom)

  const isAlreadyEnabled = Boolean(url && userSites.some((site) => site.url === url))

  console.log(data)

  return (
    <div>
      <Link to="/search-engines/apply" disabled={!isAllowUrl}>
        <Button className="w-full" disabled={!isAllowUrl || isAlreadyEnabled}>
          Enable on this page
        </Button>
      </Link>
      <ListBox>
        {data?.map((engine) => (
          <SearchEngine key={engine.id} engine={engine} />
        ))}
      </ListBox>
    </div>
  )
}
