import { createRoot } from 'react-dom/client'
import type { ContentScriptContext } from '#imports'
import { userSitesAtom } from '~/atoms/storage'
import { getRenderRoot } from '~/lib/search-engines'
import { store } from '~/store'
import { ContentRoot } from './ContentRoot'

let unmount: (() => void) | undefined

if (import.meta.hot) {
  import.meta.hot?.accept()
  import.meta.hot?.dispose(() => unmount?.())
}

export function main(ctx: ContentScriptContext) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => initial(ctx))
  } else {
    initial(ctx)
  }
}

async function initial(ctx: ContentScriptContext) {
  const userSites = await store.get(userSitesAtom)
  const style = await fetchCSS()
  const idx = style.indexOf('@property')
  if (idx !== -1) {
    const atProperties = style.slice(idx)
    const styleElement = document.createElement('style')
    styleElement.innerText = atProperties
    styleElement.id = 'hoarder-pipette-injection'
    document.head.appendChild(styleElement)
  }
  const mountContainer = await getRenderRoot(userSites, { style })

  const root = createRoot(mountContainer.renderRoot)
  root.render(<ContentRoot />)

  const ui = await createShadowRootUi(ctx, {
    name: 'hoarder-pipette',
    position: 'inline',
    onMount: (uiContainer) => {
      uiContainer.append(mountContainer.renderRoot)
      mountContainer.container.append(uiContainer)
    },
    onRemove: () => {
      root.unmount()
      mountContainer.container.remove()
    },
  })

  ui.mount()
}

async function fetchCSS() {
  // extension.js has some specific process if you fetch the css in the entry point of content script.
  const cssUrl = new URL('~/styles/tailwind.css', import.meta.url)
  const response = await fetch(cssUrl)
  const text = await response.text()
  return response.ok ? text : Promise.reject(text)
}
