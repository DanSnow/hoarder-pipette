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
let active = false

if (import.meta.hot) {
  import.meta.hot?.accept()
  import.meta.hot?.dispose(() => unmount?.())
}

/** Starts the content script once the page DOM is ready for injection. */
export function main(ctx: ContentScriptContext) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => initial(ctx))
  } else {
    initial(ctx)
  }
}

/**
 * Mounts the UI and watches for search-page DOM replacements.
 *
 * Kagi can replace the result layout without a full page load, so this observer
 * remounts the UI when the current anchor is disconnected.
 */
async function initial(ctx: ContentScriptContext) {
  active = true
  await mount(ctx)

  const observer = new MutationObserver(() => {
    if (!active || isMounting || remountTimeout !== undefined || !currentAnchor || currentAnchor.isConnected) {
      return
    }

    remountTimeout = window.setTimeout(async () => {
      remountTimeout = undefined

      if (!active || !currentAnchor || currentAnchor.isConnected) {
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
    active = false
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

/**
 * Creates a fresh WXT shadow-root UI at the current search-engine render root.
 *
 * The active and mounting guards prevent concurrent mounts and cleanly abort
 * async work if the content script is disposed while awaiting storage or UI
 * setup.
 */
async function mount(ctx: ContentScriptContext) {
  if (!active || isMounting) {
    return
  }

  isMounting = true

  try {
    removeCurrentUi?.()
    removeCurrentUi = undefined
    currentAnchor = undefined

    const userSites = await store.get(userSitesAtom)
    if (!active) {
      return
    }

    const mountContainer = await getRenderRoot(userSites)
    if (!active) {
      mountContainer.container.remove()
      return
    }

    currentAnchor = mountContainer.observedAnchor ?? mountContainer.container

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

    if (!active) {
      root.unmount()
      mountContainer.container.remove()
      return
    }

    ui.mount()

    removeCurrentUi = () => {
      ui.remove()
    }
  } finally {
    isMounting = false
  }
}
