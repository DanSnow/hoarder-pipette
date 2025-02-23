import { createFileRoute, redirect } from '@tanstack/react-router'
import { Array, Effect, Option, pipe } from 'effect'
import { SearchEngineDetail } from '../../components/SearchEngineDetail'
import { getCurrentTabUrl, isAllowUrl } from '../../utils'

export const Route = createFileRoute('/_search-engines/search-engines/$id')({
  component: RouteComponent,
  loader: async ({ context: { trpcUtils }, params }) => {
    const searchEngines = await trpcUtils.listSupportedSearchEngines.ensureData()
    const searchEngine = pipe(
      searchEngines,
      Array.findFirst((engine) => engine.id === params.id),
      Option.getOrThrowWith(() => redirect({ to: '/search-engines' })),
    )
    const url = await getCurrentTabUrl()

    return {
      engine: searchEngine,
      url,
      isAllowUrl: isAllowUrl(url),
    }
  },
})

function RouteComponent() {
  const { engine, url, isAllowUrl } = Route.useLoaderData()

  return <SearchEngineDetail engine={engine} url={url} isAllowUrl={isAllowUrl} />
}
