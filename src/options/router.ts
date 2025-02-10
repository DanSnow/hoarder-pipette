import { createRouter, createHashHistory } from '@tanstack/react-router'

// Import the generated route tree
import { routeTree } from './routeTree.gen'
import { context } from './context'

// Create a new router instance
export const router = createRouter({ routeTree, context, history: createHashHistory() })

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
