export interface RenderRootContext {
  style: string
}

export interface MountContainer {
  container: HTMLElement
  shadowRoot: ShadowRoot
  renderRoot: HTMLElement
}

export type GetRenderRoot = (context: RenderRootContext) => MountContainer

export interface SearchEngine {
  /**
   * Unique identifier of the search engine
   */
  id: string
  /**
   * Icon of the search engine
   */
  icon: string
  /**
   * Search engine name
   */
  name: string
  /**
   * The search pages of the search engine
   */
  matches: string[]
  /**
   * Extra search pages that are not default enabled, but can be enabled by the user.
   */
  optionalMatches?: string[]
  /**
   * Whether the search engine allows user sites, e.g. SearXNG.
   */
  allowUserSites?: boolean
  /**
   * Get user's search query
   * @returns Search query, if not available, return `null`
   */
  getQuery: () => string | null
  /**
   * The root element to insert the bookmarks
   * @returns Root element where bookmarks will be rendered
   */
  getRenderRoot: GetRenderRoot
}
