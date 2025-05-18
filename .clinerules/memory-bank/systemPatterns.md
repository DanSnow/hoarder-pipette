# System Patterns: Hoarder's Pipette

## System Architecture
The project is structured as a browser extension using the Extension.js framework. Inter-script communication, particularly between the content script and background script, is handled using tRPC to enable secure and type-safe data exchange and proxying of network requests.

## Key Technical Decisions
- Use of Extension.js for extension development.
- Content scripts are injected into supported search engine pages.
- Background script handles communication with the Hoarder app API.
- UI components built with React and `@tanstack/react-query` for data fetching.
- **tRPC is used for inter-script communication to proxy API calls from the content script to the background script, bypassing content script CSP limitations.**

## Design Patterns in Use
- Content Script/Background Script communication pattern using tRPC.
- React component patterns for UI rendering.
- Usage of `@tanstack/react-query` for managing data fetching state.

## Component Relationships
- Content scripts interact with the DOM of search result pages.
- Content scripts communicate with the background script using tRPC for API requests.
- The background script's tRPC server handles incoming requests from content scripts and communicates with the Hoarder app API using the `ts-rest` client.
- React components (in `content/` and `src/options/`) use `@tanstack/react-query` hooks with the tRPC client to fetch data via the background script.

## Critical Implementation Paths
- Injecting the content script correctly into supported search engine pages.
- Successfully querying the Hoarder app API from the background script.
- Displaying the bookmarked results clearly and non-intrusively on the search results page.
