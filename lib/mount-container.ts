import type { GetRenderRoot, MountContainer, RenderRootContext } from './search-engines/utils/types'

export function createMountContainer(context: RenderRootContext): MountContainer {
  const container = document.createElement('div')
  container.id = 'extension-root'

  // Injecting content_scripts inside a shadow dom
  // prevents conflicts with the host page's styles.
  // This way, styles from the extension won't leak into the host page.
  const shadowRoot = container.attachShadow({ mode: 'open' })

  // Firefox doesn't support to use CSSStyleSheet in extension scripts.
  if (import.meta.env.EXTENSION_BROWSER === 'firefox') {
    const style = document.createElement('style')
    style.textContent = context.style
    shadowRoot.append(style)
  } else {
    const style = new CSSStyleSheet()
    shadowRoot.adoptedStyleSheets = [style]
    style.replace(context.style)
  }

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
