import { createHashHistory, createRouter } from '@tanstack/react-router'

import { context } from '../../shared/context'
import { Loading } from './components/Loading'
// Import the generated route tree
import { routeTree } from './routeTree.gen'

// Create a new router instance
export const router = createRouter({
  routeTree,
  context,
  history: createHashHistory(),
  defaultPendingComponent: Loading,
})

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
