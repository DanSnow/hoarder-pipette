---
title: How to add a Search Engine
---

## Overview
To add a new search engine, you need to define an implementation that adheres to the `SearchEngine` interface. Here is the structure of the interface:


```ts
export interface SearchEngine {
  /**
   * Unique identifier of the search engine.
   */
  id: string

  /**
   * Icon of the search engine, you can use icon from https://icones.js.org/collection/simple-icons
   */
  icon: string

  /**
   * Name of the search engine.
   */
  name: string

  /**
   * URLs that this search engine can handle and default eanbled URLs.
   */
  matches: string[]

  /**
   * Optional URLs that can be enabled by users, but are not default-activated.
   */
  optionalMatches?: string[]

  /**
   * Whether the search engine allows user sites such as SearXNG.
   */
  allowUserSites?: boolean

  /**
   * A function to retrieve the current search query from the URL or from user input.
   * @returns The search query, or `null` if no query is found.
   */
  getQuery: () => string | null

  /**
   * A function that returns the root element where bookmarks will be rendered.
   * @returns The root DOM element.
   */
  getRenderRoot: () => HTMLElement
}
```

You can find it at [here](https://github.com/DanSnow/hoarder-pipette/blob/main/lib/search-engines/utils/types.ts)

## How to Add a Search Engine
Define Your Search Engine: Create an object that conforms to the `SearchEngine` interface. Here¡¦s an example based on how Google is defined:


```ts
import invariant from 'tiny-invariant'
import { createMountContainer } from '../mount-container'
import { $ } from '../utils'
import { fromUrlQuery } from './utils/get-query'
import type { SearchEngine } from './utils/types'

const MY_SEARCH_ENGINE_URL = 'https://myservice.com/search' // Replace with the actual URL for your search engine

export const mySearchEngine: SearchEngine = {
  id: 'mysearchengine',
  icon: 'i-simple-icons-myservice', // Replace with the appropriate icon
  name: 'My Service',
  matches: [],
  optionalMatches: [MY_SEARCH_ENGINE_URL],  // Customize as needed
  allowUserSites: true, // Set to `true` if your service allows user sites. Like SearXNG
  getQuery: fromUrlQuery('q'),  // This extracts the query from URL parameters. Adjust based on your requirement.
  getRenderRoot: () => {
    const { container, renderRoot } = createMountContainer()
    const searchContainer = $('#myRootElement') // Replace 'myRootElement' with an appropriate selector
    invariant(searchContainer, 'Injection point not found.')
    searchContainer.prepend(container)
    return renderRoot
  }
}
```

## Test the New Search Engine support

To test the extension, follow the guide in [How to contribute](./how-to-contribute)
