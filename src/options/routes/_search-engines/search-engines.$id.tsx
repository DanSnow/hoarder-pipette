import { createFileRoute, redirect } from '@tanstack/react-router'
import { Array, Option, pipe } from 'effect'
import { SearchEngineDetail } from '../../components/SearchEngineDetail'

export const Route = createFileRoute('/_search-engines/search-engines/$id')({
  component: RouteComponent,
  loader: async ({ context: { trpcUtils }, params }) => {
    const searchEngines = await trpcUtils.listSupportedSearchEngines.ensureData()
    const searchEngine = pipe(
      searchEngines,
      Array.findFirst((engine) => engine.id === params.id),
      Option.getOrThrowWith(() => redirect({ to: '/search-engines' })),
    )
    return searchEngine
  },
})

function RouteComponent() {
  const engine = Route.useLoaderData()

  return <SearchEngineDetail engine={engine} />
}
