import { TooltipProvider } from '@radix-ui/react-tooltip'
import { QueryClientProvider } from '@tanstack/react-query'
import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import { useMedia } from 'react-use'
import { Toaster } from '~/components/ui/toaster'
import { cn } from '~/lib/utils'
import type { Context } from '../../../shared/context'

export const Route = createRootRouteWithContext<Context>()({
  component: RouteComponent,
})

function RouteComponent() {
  const { queryClient } = Route.useRouteContext()
  const isDark = useMedia('(prefers-color-scheme: dark)')
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className={cn('bg-background text-foreground', { dark: isDark })}>
          <Outlet />
          <Toaster />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  )
}
