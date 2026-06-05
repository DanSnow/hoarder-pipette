import type { GetRenderRoot, MountContainer } from './search-engines/utils/types'

/** Creates the DOM container and React render root used by injected search cards. */
export function createMountContainer(): MountContainer {
  const container = document.createElement('div')
  container.id = 'extension-root'

  const renderRoot = document.createElement('div')
  renderRoot.id = 'hoarder-inject'
  renderRoot.className = 'min-w-[25rem]'
  container.append(renderRoot)
  return {
    container,
    renderRoot,
  }
}

type MountRenderRoot = (container: HTMLElement) => HTMLElement | void

/**
 * Wraps a search-engine-specific mount callback in the common MountContainer shape.
 *
 * The callback may return a page-owned anchor to observe separately from the
 * extension container, which is useful when the extension UI is appended to
 * document.body but should remount when a search-results layout node is replaced.
 */
export function defineRenderRoot(mount: MountRenderRoot): GetRenderRoot {
  return () => {
    const mountContainer = createMountContainer()
    mountContainer.observedAnchor = mount(mountContainer.container) ?? mountContainer.container
    return mountContainer
  }
}
