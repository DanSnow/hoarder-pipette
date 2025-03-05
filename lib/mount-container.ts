export interface MountContainer {
  container: HTMLElement
  renderRoot: HTMLElement
}

declare global {
  interface Window {
    __EXTENSION_SHADOW_ROOT__: ShadowRoot
  }
}

export function createMountContainer(): MountContainer {
  const container = document.createElement('div')
  container.id = 'extension-root'

  // Injecting content_scripts inside a shadow dom
  // prevents conflicts with the host page's styles.
  // This way, styles from the extension won't leak into the host page.
  const shadowRoot = container.attachShadow({ mode: 'open' })

  // Inform Extension.js that the shadow root is available.
  window.__EXTENSION_SHADOW_ROOT__ = shadowRoot

  const renderRoot = document.createElement('div')
  renderRoot.id = 'hoarder-inject'
  shadowRoot.append(renderRoot)
  return {
    container,
    renderRoot,
  }
}
