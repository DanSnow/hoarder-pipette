import '~/styles/tailwind.css?inline_style'
import { createRoot } from 'react-dom/client'
import { userSitesAtom } from '~/atoms/storage'
import { getRenderRoot } from '~/lib/search-engines'
import { store } from '~/store'
import { ContentRoot } from './ContentRoot'

if (document.readyState === 'complete') {
  initial()
} else {
  document.addEventListener('readystatechange', () => {
    if (document.readyState === 'complete') initial()
  })
}

async function initial() {
  const userSites = await store.get(userSitesAtom)
  const renderRoot = getRenderRoot(userSites)
  const root = createRoot(renderRoot)
  root.render(<ContentRoot />)
}
