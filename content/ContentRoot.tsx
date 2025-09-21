import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import {Provider} from 'jotai'
import {useState} from 'react'
import {useLocation} from 'react-use'
import {store} from '~/store'
import {ContentUI} from './ContentUI'

export function ContentRoot() {
  const [client] = useState(new QueryClient())
  const {href = ''} = useLocation()

  return (
    <QueryClientProvider client={client}>
      <Provider store={store}>
        <ContentUI key={href}/>
      </Provider>
    </QueryClientProvider>
  )
}
