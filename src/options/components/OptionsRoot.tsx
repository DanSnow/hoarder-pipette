import { createStore, Provider } from 'jotai'
import { useState } from 'react'
import { RouterProvider } from '@tanstack/react-router'
import { router } from '../router'

export function OptionsRoot() {
  const [store] = useState(createStore())
  return (
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  )
}
