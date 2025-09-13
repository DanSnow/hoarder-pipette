import tailwindUrl from '~/styles/tailwind.css?url'
import {createRoot} from 'react-dom/client'
import {userSitesAtom} from '~/atoms/storage'
import {getRenderRoot} from '~/lib/search-engines'
import {store} from '~/store'
import {ContentRoot} from './ContentRoot'

let unmount: (() => void) | undefined

if (import.meta.webpackHot) {
  import.meta.webpackHot?.accept()
  import.meta.webpackHot?.dispose(() => unmount?.())
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initial)
} else {
  initial()
}

async function initial() {
  const userSites = await store.get(userSitesAtom)
  const style = await fetchCSS()
  const idx = style.indexOf('@property');
  if (idx !== -1) {
    const atProperties = style.slice(idx);
    const styleElement = document.createElement('style');
    styleElement.innerText = atProperties;
    document.head.appendChild(styleElement);
  }
  const mountContainer = await getRenderRoot(userSites, {style})
  const root = createRoot(mountContainer.renderRoot)
  root.render(<ContentRoot/>)

  unmount = () => {
    root.unmount()
    mountContainer.container.remove()
  }
}

async function fetchCSS() {
  // extension.js has some specific process if you fetch the css in the entry point of content script.
  const cssUrl = tailwindUrl
  const response = await fetch(cssUrl)
  const text = await response.text()
  return response.ok ? text : Promise.reject(text)
}
