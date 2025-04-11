import '~/styles/tailwind.css'
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
  const style = await fetchCSS()
  const renderRoot = getRenderRoot(userSites, { style })
  const root = createRoot(renderRoot)
  root.render(<ContentRoot />)
}

async function fetchCSS() {
  // extension.js has some specific process if you fetch the css in the entry point of content script.
  const cssUrl = new URL('~/styles/tailwind.css', import.meta.url)
  const response = await fetch(cssUrl)
  const text = await response.text()
  return response.ok ? text : Promise.reject(text)
}
