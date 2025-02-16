import { createFileRoute, Link, redirect } from '@tanstack/react-router'
import { Array, Option, pipe } from 'effect'
import { SearchEngineDetail } from '../components/SearchEngineDetail'
import { OptionsContainer } from '../components/OptionsContainer'
import {
  navigationMenuTriggerStyle,
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from '~/components/ui/navigation-menu'
import { Button } from '~/components/ui/button'

export const Route = createFileRoute('/search-engines/$id')({
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
  return (
    <OptionsContainer>
      <NavigationMenu>
        <NavigationMenuList className="flex flex-nowrap gap-3">
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link className={navigationMenuTriggerStyle()} to="/">
                <Button variant="ghost" size="sm">
                  <span className="i-lucide-chevron-left" />
                </Button>
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      <SearchEngineDetail engine={engine} />
    </OptionsContainer>
  )
}
