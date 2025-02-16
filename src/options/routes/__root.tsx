import { TooltipProvider } from '@radix-ui/react-tooltip'
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'
import { useMedia } from 'react-use'
import { Toaster } from '~/components/ui/toaster'
import { cn } from '~/lib/utils'
import type { Context } from '../context'
import { QueryClientProvider } from '@tanstack/react-query'

export const Route = createRootRouteWithContext<Context>()({
  component: RouteComponent,
})

function RouteComponent() {
  const { trpc, client, queryClient } = Route.useRouteContext()
  const isDark = useMedia('(prefers-color-scheme: dark)')
  return (
    <trpc.Provider client={client} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <div className={cn('bg-background text-foreground', { dark: isDark })}>
            <Outlet />
            <Toaster />
          </div>
        </TooltipProvider>
      </QueryClientProvider>
    </trpc.Provider>
  )
}
