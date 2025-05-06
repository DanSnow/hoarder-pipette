# Active Context: Hoarder's Pipette

## Current work focus
Resolved the content script CSP issue in Firefox by proxying API calls through the background script.

## Recent changes
- Modified `trpc/index.ts` to add a `searchBookmark` procedure in the background script's tRPC router.
- Modified `content/HoarderCard.tsx` to use the tRPC client from `src/options/context.ts` and `useQuery(trpc.searchBookmark.queryOptions(...))` to fetch data via the background script.
- Deleted the unused `hooks/use-client.ts` file.
- Removed the unused `clientAtom` from `atoms/storage.ts`.

## Next steps
- The image loaded in `components/BookmarkPreview.tsx` is also blocked by CSP in Firefox. Investigate how to resolve this issue. Consider using a different approach or proxying mechanism if possible.

## Active decisions and considerations
- The primary decision was to leverage the existing tRPC infrastructure for inter-script communication to bypass the content script's strict CSP in Firefox.
- Confirmed the correct usage of `useQuery` with tRPC's `queryOptions` and handling of nested response structures.

## Important patterns and preferences
- Utilizing tRPC for secure and type-safe communication between different parts of the browser extension (content script and background script).
- Following the pattern of proxying network requests that are restricted by content script CSP through the background script.

## Learnings and project insights
- Successfully implemented proxying of API calls through the background script using tRPC.
- Learned the correct syntax for using `@tanstack/react-query`'s `useQuery` with tRPC's `queryOptions`.
- Understood the nested structure of the API response and how to access the relevant data (`data.result.data.json.bookmarks`).
- Confirmed that the tRPC client in `src/options/context.ts` is configured with a message-passing link suitable for extension communication.
- The `ts-rest` client handles the JSON stringification of the query input internally based on the contract.
- Jotai atoms outside of React components require using `store.get(atom)` to access their values.
