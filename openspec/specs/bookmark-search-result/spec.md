# bookmark-search-result Specification

## Purpose

TBD - created by archiving change 'minimal-bookmark-schema'. Update Purpose after archive.

## Requirements

### Requirement: Minimal bookmark search result schema
The system SHALL define a `zBookmarkSearchResult` Zod schema in `src/schemas/bookmark-search-result.ts` containing only the fields consumed by the extension UI. The schema SHALL NOT include strict enum validation for server-side status fields. Fields not used by the UI SHALL be omitted entirely.

The schema SHALL include:
- `id`: `z.string()`
- `createdAt`: `z.string()`
- `content`: a discriminated union on `type`, with a fully-typed `link` variant and a catch-all variant
- `tags`: array of objects with `id` and `name` as strings

The `link` content variant SHALL include: `url`, `title` (nullish string), `description` (nullish string), `imageUrl` (nullish string).

The catch-all content variant SHALL accept any `type` string value and no other required fields, so that `text`, `asset`, and `unknown` bookmarks pass validation without error.

#### Scenario: Link bookmark passes validation
- **WHEN** the API returns a bookmark with `content.type === 'link'`
- **THEN** the schema SHALL validate successfully and expose `url`, `title`, `description`, `imageUrl`

#### Scenario: Non-link bookmark passes validation
- **WHEN** the API returns a bookmark with `content.type` of `'text'`, `'asset'`, or `'unknown'`
- **THEN** the schema SHALL validate successfully without throwing an output validation error

##### Example: status enum variance
- **GIVEN** a bookmark where `taggingStatus` is `'running'` (not in the original enum)
- **WHEN** the API response is validated against `zBookmarkSearchResult`
- **THEN** validation SHALL succeed because `taggingStatus` is not part of the schema

#### Scenario: Missing optional fields pass validation
- **WHEN** a link bookmark has `null` or absent `title`, `description`, or `imageUrl`
- **THEN** the schema SHALL validate successfully


<!-- @trace
source: minimal-bookmark-schema
updated: 2026-04-26
code:
  - src/orpc/index.ts
  - src/schemas/bookmark-search-result.ts
  - src/entrypoints/background/index.ts
  - src/components/BookmarkList.tsx
  - src/components/BookmarkPreview.tsx
-->

---
### Requirement: searchBookmark uses minimal schema
The `searchBookmark` oRPC handler in `src/orpc/index.ts` SHALL use `z.array(zBookmarkSearchResult)` as its output schema instead of `z.array(zBookmark)`.

#### Scenario: Search succeeds for bookmarks that previously failed
- **WHEN** the Karakeep API returns bookmarks with unexpected status values or extra fields
- **THEN** the handler SHALL return results successfully instead of throwing `Output validation failed`


<!-- @trace
source: minimal-bookmark-schema
updated: 2026-04-26
code:
  - src/orpc/index.ts
  - src/schemas/bookmark-search-result.ts
  - src/entrypoints/background/index.ts
  - src/components/BookmarkList.tsx
  - src/components/BookmarkPreview.tsx
-->

---
### Requirement: UI components typed against minimal schema
`BookmarkList` and `BookmarkPreview` SHALL use `z.infer<typeof zBookmarkSearchResult>` as their bookmark prop type instead of `z.infer<typeof zBookmark>`.

#### Scenario: Components compile with new type
- **WHEN** `zBookmarkSearchResult` is used as the prop type
- **THEN** TypeScript SHALL compile without errors because all accessed fields are present in the minimal schema

<!-- @trace
source: minimal-bookmark-schema
updated: 2026-04-26
code:
  - src/orpc/index.ts
  - src/schemas/bookmark-search-result.ts
  - src/entrypoints/background/index.ts
  - src/components/BookmarkList.tsx
  - src/components/BookmarkPreview.tsx
-->