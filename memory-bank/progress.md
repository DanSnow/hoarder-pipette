# Progress: Hoarder's Pipette

## What works
- Initial project structure based on Extension.js.
- Basic integration concept for injecting bookmarks into search results.
- Support for Google and Ecosia (based on README).
- A version for Chrome is already available.
- Full implementation of bookmark injection logic.
- Handling communication between content scripts and background script.
- UI for displaying bookmarks.
- Options page functionality.

## What's left to build
- **Firefox support, including addressing Content Security Policy (CSP) issues in content scripts.**
- **Rename Hoarder to Karakeep.**
- **Add note support.**
- Support for additional search engines.

## Current status
The project has a working Chrome version. The current development priorities are:
1. Firefox support (including addressing CSP issues). There is an open draft PR (244) for this.
2. Renaming Hoarder to Karakeep. There is an open PR (294) for this.
3. Adding note support. There is an open issue (57) related to this.

## Known issues
- Content Security Policy (CSP) restrictions in Firefox content scripts need to be addressed for proper functionality.
- Issue 57: Not getting same results (potentially related to note search).

## Evolution of project decisions
- Initial focus was on Chrome, now shifting to include Firefox support.
- The project name and related branding are being updated from Hoarder to Karakeep.
- Adding support for searching notes is a planned enhancement.
