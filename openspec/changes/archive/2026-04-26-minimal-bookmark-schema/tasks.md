## 1. Define minimal bookmark search result schema

- [x] 1.1 Implement "Minimal bookmark search result schema": create `src/schemas/bookmark-search-result.ts` with the `zBookmarkSearchResult` Zod schema: `id` (string), `createdAt` (string), `content` (discriminated union with a `link` variant containing `url`, `title`, `description`, `imageUrl` all nullish except `url`, plus a catch-all variant `z.object({ type: z.string() })`), and `tags` (array of `{ id: string, name: string }`)

## 2. Wire minimal schema into oRPC handler

- [x] 2.1 Implement "searchBookmark uses minimal schema": update `src/orpc/index.ts` to import `zBookmarkSearchResult` from `~/schemas/bookmark-search-result`, replace `.output(z.array(zBookmark))` with `.output(z.array(zBookmarkSearchResult))` on the `searchBookmark` handler, and remove the unused `zBookmark` import

## 3. Update UI component prop types to use minimal schema

- [x] 3.1 Implement "UI components typed against minimal schema" in `src/components/BookmarkList.tsx`: replace `z.infer<typeof zBookmark>` with `z.infer<typeof zBookmarkSearchResult>` in the `BookmarkListProps` interface and update the import
- [x] 3.2 Implement "UI components typed against minimal schema" in `src/components/BookmarkPreview.tsx`: replace `z.infer<typeof zBookmark>` with `z.infer<typeof zBookmarkSearchResult>` in the prop type and update the import

## 4. Verify

- [x] 4.1 Run `pnpm tsc --noEmit` (or equivalent type check) and confirm zero TypeScript errors related to the changed files
