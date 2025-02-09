import { TooltipProvider } from '@radix-ui/react-tooltip'
import { createRootRoute, createRootRouteWithContext, Link, Outlet } from '@tanstack/react-router'
import { useMedia } from 'react-use'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '~/components/ui/navigation-menu'
import { Toaster } from '~/components/ui/toaster'
import { cn } from '~/lib/utils'
import { createContext, type Context } from '../context'
import { QueryClientProvider } from '@tanstack/react-query'

export const Route = createRootRouteWithContext<Context>()({
  component: RouteComponent,
  context: createContext,
})

function RouteComponent() {
  const { trpc, client, queryClient } = Route.useRouteContext()
  const isDark = useMedia('(prefers-color-scheme: dark)')
  return (
    <trpc.Provider client={client} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <div className={cn({ dark: isDark })}>
            <div className="container mx-auto flex min-w-96 flex-col gap-1 bg-background p-2 text-foreground lg:py-8">
              <NavigationMenu>
                <NavigationMenuList className="flex flex-nowrap gap-3">
                  <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                      <Link className={navigationMenuTriggerStyle()} to="/" activeProps={{ 'data-active': 'true' }}>
                        Instance
                      </Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <Link
                        className={navigationMenuTriggerStyle()}
                        to="/search-engines"
                        activeProps={{ 'data-active': 'true' }}
                      >
                        Search Engines
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
              <Outlet />
              <Toaster />
            </div>
          </div>
        </TooltipProvider>
      </QueryClientProvider>
    </trpc.Provider>
  )
}
