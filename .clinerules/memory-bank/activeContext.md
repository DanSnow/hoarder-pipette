# Active Context: Hoarder's Pipette

## Current work focus
Addressing the content script CSP issue for images in Firefox.

## Recent changes
- Modified `trpc/index.ts` to add a `searchBookmark` procedure in the background script's tRPC router (previously done).
- Modified `content/HoarderCard.tsx` to use the tRPC client from `shared/context.ts` and `useQuery(trpc.searchBookmark.queryOptions(...))` to fetch data via the background script (previously done).
- Deleted the unused `hooks/use-client.ts` file (previously done).
- Removed the unused `clientAtom` from `atoms/storage.ts` (previously done).
- Modified `trpc/index.ts` to add a `checkAllUrlsPermission` procedure in the background script's tRPC router to check for the `<all_urls>` permission.
- Modified `components/BookmarkPreview.tsx` to use the `checkAllUrlsPermission` tRPC procedure to determine if the image should be displayed, conditionally hiding it based on browser environment (Firefox) and the presence of the `<all_urls>` permission.

## Next steps
- Implement image proxying through the background script for Firefox when the `<all_urls>` permission is granted.
- Add an option in the settings page to allow users to enable/disable image display, which will trigger the permission request.

## Active decisions and considerations
- Leveraging `import.meta.env.EXTENSION_BROWSER === 'firefox'` to reliably detect the Firefox environment within the content script.
- Using a tRPC procedure (`checkAllUrlsPermission`) in the background script to check for the `<all_urls>` permission, as `browser.permissions` is not available in content scripts.
- Conditionally rendering the image element in `components/BookmarkPreview.tsx` based on the Firefox environment and the result of the tRPC call for permission status.
- The next step is to implement the image proxying mechanism via tRPC for the case where the permission *is* granted.

## Important patterns and preferences
- Utilizing tRPC for secure and type-safe communication between different parts of the browser extension (content script and background script).
- Following the pattern of proxying network requests and browser API calls that are restricted by content script CSP through the background script.
- Using `webextension-polyfill` for cross-browser compatibility with browser APIs.
- Using `import.meta.env.EXTENSION_BROWSER` for build-time environment checks.

## Learnings and project insights
- Successfully implemented conditional rendering of the bookmark image in `components/BookmarkPreview.tsx` based on the browser environment and granted permissions, by checking the permission status via a tRPC call to the background script.
- Confirmed that `import.meta.env.EXTENSION_BROWSER` is the correct way to check the target browser during development/build.
- Learned that `browser.permissions` is not available in content scripts and permission checks must be performed in the background script.
- Successfully added a new tRPC procedure in the background script to handle the permission check.
- Successfully updated `components/BookmarkPreview.tsx` to use the new tRPC procedure with `@tanstack/react-query`'s `useQuery` and `queryOptions`.
- Corrected the `useEffect` dependency array based on feedback to resolve a linter error.
