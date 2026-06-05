import type { ContentScriptContext } from '#imports'
import { createRoot } from 'react-dom/client'

import { userSitesAtom } from '~/atoms/storage'
import { getRenderRoot } from '~/lib/search-engines'
import { store } from '~/store'

import { ContentRoot } from './ContentRoot'

let unmount: (() => void) | undefined
let removeCurrentUi: (() => void) | undefined
let currentAnchor: HTMLElement | undefined
let remountTimeout: number | undefined
let isMounting = false

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
  await mount(ctx)

  const observer = new MutationObserver(() => {
    if (isMounting || remountTimeout !== undefined || !currentAnchor || currentAnchor.isConnected) {
      return
    }

    remountTimeout = window.setTimeout(async () => {
      remountTimeout = undefined

      if (!currentAnchor || currentAnchor.isConnected) {
        return
      }

      await mount(ctx)
    }, 250)
  })

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  })

  unmount = () => {
    observer.disconnect()
    if (remountTimeout !== undefined) {
      clearTimeout(remountTimeout)
      remountTimeout = undefined
    }
    removeCurrentUi?.()
    removeCurrentUi = undefined
    currentAnchor = undefined
  }
}

async function mount(ctx: ContentScriptContext) {
  isMounting = true

  try {
    removeCurrentUi?.()
    removeCurrentUi = undefined
    currentAnchor = undefined

    const userSites = await store.get(userSitesAtom)
    const mountContainer = await getRenderRoot(userSites)
    currentAnchor = mountContainer.container

    const root = createRoot(mountContainer.renderRoot)
    root.render(<ContentRoot />)

    const ui = await createShadowRootUi(ctx, {
      name: 'hoarder-pipette',
      position: 'inline',
      anchor: mountContainer.container,
      onMount: (uiContainer) => {
        uiContainer.append(mountContainer.renderRoot)
      },
      onRemove: () => {
        root.unmount()
        mountContainer.container.remove()
      },
    })

    ui.mount()

    removeCurrentUi = () => {
      ui.remove()
    }
  } finally {
    isMounting = false
  }
}
