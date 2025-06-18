import type { Preview } from '@storybook/react'
import { createMemoryHistory, RouterProvider } from '@tanstack/react-router'
import { createStore, Provider } from 'jotai'
import { router } from '../src/options/router'
import '../styles/tailwind.css'
import { StoryContext } from '../src/options/components/StoryRenderer'

const store = createStore()

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    (Story) => {
      return (
        <Provider store={store}>
          <StoryContext.Provider value={Story}>
            <RouterProvider
              router={router}
              history={createMemoryHistory({
                initialEntries: ['/story-render'],
              })}
            />
          </StoryContext.Provider>
        </Provider>
      )
    },
  ],
}

export default preview
