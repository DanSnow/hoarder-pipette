# System Patterns: Hoarder's Pipette

## System Architecture
The project is structured as a Chrome Extension using the Extension.js framework.

## Key Technical Decisions
- Use of Extension.js for extension development.
- Content scripts are injected into supported search engine pages.
- Background script handles communication with the Hoarder app API.
- UI components likely built with React (based on file structure).

## Design Patterns in Use
- Content Script/Background Script communication pattern for Chrome Extensions.
- Potential use of React component patterns for UI rendering.

## Component Relationships
- Content scripts interact with the DOM of search result pages.
- Content scripts communicate with the background script.
- The background script communicates with the Hoarder app API.
- React components (in `content/` and `src/options/`) are used for rendering UI in the injected content and the options page.

## Critical Implementation Paths
- Injecting the content script correctly into supported search engine pages.
- Successfully querying the Hoarder app API from the background script.
- Displaying the bookmarked results clearly and non-intrusively on the search results page.
