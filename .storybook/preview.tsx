import type { Preview } from '@storybook/react'
import { RouterProvider, createMemoryHistory } from '@tanstack/react-router'
import { Provider, createStore } from 'jotai'
import React from 'react'
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
