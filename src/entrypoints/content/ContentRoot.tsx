import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Provider } from 'jotai'
import { Suspense, useState } from 'react'
import { useLocation } from 'react-use'
import { store } from '~/store'
import { ContentUI } from './ContentUI'
import { Loading } from './Loading'

export function ContentRoot() {
  const [client] = useState(new QueryClient())
  const { href = '' } = useLocation()

  return (
    <QueryClientProvider client={client}>
      <Provider store={store}>
        <Suspense fallback={<Loading />}>
          <ContentUI key={href} />
        </Suspense>
      </Provider>
    </QueryClientProvider>
  )
}
