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
  const mountContainer = await getRenderRoot(userSites)

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
}
