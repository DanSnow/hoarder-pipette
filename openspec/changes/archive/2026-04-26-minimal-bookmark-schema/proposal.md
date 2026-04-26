## Why

Fixes [GitHub issue #1395](https://github.com/DanSnow/hoarder-pipette/issues/1395) — "Error on some searches": users see `An error occurred: Output validation failed` on certain searches while other searches work fine.

The `searchBookmark` oRPC handler validates API responses against the full auto-generated `zBookmark` schema, which includes strict enums (`taggingStatus`, `summarizationStatus`) and many fields the extension never reads. When a specific bookmark has a status value outside the expected enum or an unexpected field combination, Zod throws `Output validation failed`, causing the entire search to fail for that user — even though the extension only needs a small subset of fields to render results.

## What Changes

- Replace the `zBookmark` output schema in `searchBookmark` with a minimal hand-written schema containing only the fields the extension actually renders
- The new schema uses `z.string()` for status fields (no strict enums) and omits all unused fields
- `BookmarkList` and `BookmarkPreview` prop types are updated to use the new minimal schema type

## Non-Goals

- Not regenerating or updating the auto-generated client files (`zod.gen.ts`, `types.gen.ts`, `sdk.gen.ts`)
- Not changing how bookmarks are fetched or displayed
- Not adding support for `text` or `asset` bookmark types in the UI (they are still filtered out in `BookmarkList`)

## Capabilities

### New Capabilities

- `bookmark-search-result`: Minimal validated schema for bookmark search results returned to the extension UI

### Modified Capabilities

(none)

## Impact

- Affected code:
  - New: `src/schemas/bookmark-search-result.ts`
  - Modified: `src/orpc/index.ts`, `src/components/BookmarkList.tsx`, `src/components/BookmarkPreview.tsx`
