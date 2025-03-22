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
  loader: async () => {
    const url = await getCurrentTabUrl()
    return {
      url,
      isAllowUrl: isAllowUrl(url),
    }
  },
  wrapInSuspense: true,
})

function RouteComponent() {
  const { trpc } = Route.useRouteContext()
  const { data } = useQuery(trpc.listSupportedSearchEngines.queryOptions())
  const { url, isAllowUrl } = Route.useLoaderData()
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
