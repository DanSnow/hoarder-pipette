import type { GetRenderRoot, MountContainer, RenderRootContext } from './search-engines/utils/types'

export function createMountContainer(context: RenderRootContext): MountContainer {
  const container = document.createElement('div')
  container.id = 'extension-root'

  // Injecting content_scripts inside a shadow dom
  // prevents conflicts with the host page's styles.
  // This way, styles from the extension won't leak into the host page.
  const shadowRoot = container.attachShadow({ mode: 'open' })

  const style = new CSSStyleSheet()
  shadowRoot.adoptedStyleSheets = [style]
  style.replace(context.style)

  const renderRoot = document.createElement('div')
  renderRoot.id = 'hoarder-inject'
  shadowRoot.append(renderRoot)
  return {
    container,
    shadowRoot,
    renderRoot,
  }
}

type MountRenderRoot = (container: HTMLElement) => void

export function defineRenderRoot(mount: MountRenderRoot): GetRenderRoot {
  return (context: RenderRootContext) => {
    const mountContainer = createMountContainer(context)
    mount(mountContainer.container)
    return mountContainer
  }
}
