export interface SearchEngine {
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
   * Get user's search query
   * @returns Search query, if not available, return `null`
   */
  getQuery: () => string | null
  /**
   * The root element to insert the bookmarks
   * @returns Root element where bookmarks will be rendered
   */
  getRenderRoot: () => HTMLElement
}
