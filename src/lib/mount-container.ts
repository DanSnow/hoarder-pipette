import type { GetRenderRoot, MountContainer } from './search-engines/utils/types'

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

export function defineRenderRoot(mount: MountRenderRoot): GetRenderRoot {
  return () => {
    const mountContainer = createMountContainer()
    mountContainer.observedAnchor = mount(mountContainer.container) ?? mountContainer.container
    return mountContainer
  }
}
