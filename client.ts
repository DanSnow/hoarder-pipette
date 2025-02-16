import { initClient, initContract } from '@ts-rest/core'
import { z } from 'zod'

const c = initContract()

const BookmarkId = z.string()
const ListId = z.string()
const TagId = z.string()
export const BookmarkSchema = z
  .object({
    id: z.string(),
    createdAt: z.string(),
    title: z.string().max(250).nullish(),
    archived: z.boolean(),
    favourited: z.boolean(),
    taggingStatus: z.enum(['success', 'failure', 'pending']).nullable(),
    note: z.string().nullish(),
    summary: z.string().nullish(),
    tags: z.array(
      z
        .object({
          id: z.string(),
          name: z.string(),
          attachedBy: z.enum(['ai', 'human']),
        })
        .passthrough(),
    ),
    content: z.union([
      z
        .object({
          type: z.literal('link'),
          url: z.string(),
          title: z.string().nullish(),
          description: z.string().nullish(),
          imageUrl: z.string().nullish(),
          imageAssetId: z.string().nullish(),
          screenshotAssetId: z.string().nullish(),
          fullPageArchiveAssetId: z.string().nullish(),
          videoAssetId: z.string().nullish(),
          favicon: z.string().nullish(),
          htmlContent: z.string().nullish(),
          crawledAt: z.string().nullish(),
        })
        .passthrough(),
      z
        .object({
          type: z.literal('text'),
          text: z.string(),
          sourceUrl: z.string().nullish(),
        })
        .passthrough(),
      z
        .object({
          type: z.literal('asset'),
          assetType: z.enum(['image', 'pdf']),
          assetId: z.string(),
          fileName: z.string().nullish(),
          sourceUrl: z.string().nullish(),
        })
        .passthrough(),
      z.object({ type: z.literal('unknown') }).passthrough(),
    ]),
    assets: z.array(
      z
        .object({
          id: z.string(),
          assetType: z.enum(['screenshot', 'bannerImage', 'fullPageArchive', 'video', 'bookmarkAsset', 'unknown']),
        })
        .passthrough(),
    ),
  })
  .passthrough()
const PaginatedBookmarks = z
  .object({
    bookmarks: z.array(BookmarkSchema),
    nextCursor: z.string().nullable(),
  })
  .passthrough()
const Cursor = z.string()
const List = z
  .object({
    id: z.string(),
    name: z.string(),
    icon: z.string(),
    parentId: z.string().nullable(),
  })
  .passthrough()
const Tag = z
  .object({
    id: z.string(),
    name: z.string(),
    numBookmarks: z.number(),
    numBookmarksByAttachedType: z.object({ ai: z.number().optional(), human: z.number().optional() }).passthrough(),
  })
  .passthrough()

export const schemas = {
  BookmarkId,
  ListId,
  TagId,
  Bookmark: BookmarkSchema,
  PaginatedBookmarks,
  Cursor,
  List,
  Tag,
}

export const contract = c.router({
  searchBookmark: {
    method: 'GET',
    path: '/api/trpc/bookmarks.searchBookmarks',
    query: z.object({
      input: z
        .object({
          json: z.object({ text: z.string() }),
        })
        .transform((input) => JSON.stringify(input)),
    }),
    responses: {
      200: z.object({
        result: z.object({
          data: z.object({
            json: z.object({
              bookmarks: z.array(BookmarkSchema),
            }),
          }),
        }),
      }),
    },
  },
  getBookmarks: {
    method: 'GET',
    path: '/api/v1/bookmarks',
    summary: 'Get all bookmarks',
    query: z.object({
      archived: z.boolean().optional(),
      favourited: z.boolean().optional(),
      limit: z.number().optional(),
      cursor: z.string().optional(),
    }),
    responses: { 200: PaginatedBookmarks },
  },
  createBookmark: {
    method: 'POST',
    path: '/api/v1/bookmarks',
    summary: 'Create a new bookmark',
    body: z
      .object({
        title: z.string().max(250).nullish(),
        archived: z.boolean().optional(),
        favourited: z.boolean().optional(),
        note: z.string().optional(),
        summary: z.string().optional(),
        createdAt: z.string().optional(),
      })
      .passthrough()
      .and(
        z.union([
          z.object({ type: z.literal('link'), url: z.string().url() }).passthrough(),
          z
            .object({
              type: z.literal('text'),
              text: z.string(),
              sourceUrl: z.string().optional(),
            })
            .passthrough(),
          z
            .object({
              type: z.literal('asset'),
              assetType: z.enum(['image', 'pdf']),
              assetId: z.string(),
              fileName: z.string().optional(),
              sourceUrl: z.string().optional(),
            })
            .passthrough(),
        ]),
      ),
    contentType: 'application/json',
    responses: { 201: BookmarkSchema },
  },
  getBookmark: {
    method: 'GET',
    path: '/api/v1/bookmarks/:bookmarkId',
    summary: 'Get a single bookmark',
    pathParams: z.object({ bookmarkId: z.string() }),
    responses: { 200: BookmarkSchema },
  },
  deleteBookmark: {
    method: 'DELETE',
    path: '/api/v1/bookmarks/:bookmarkId',
    summary: 'Delete a bookmark',
    pathParams: z.object({ bookmarkId: z.string() }),
    body: c.noBody(),
    responses: { 204: c.noBody() },
  },
  updateBookmark: {
    method: 'PATCH',
    path: '/api/v1/bookmarks/:bookmarkId',
    summary: 'Update a bookmark',
    pathParams: z.object({ bookmarkId: z.string() }),
    body: z
      .object({
        archived: z.boolean().optional(),
        favourited: z.boolean().optional(),
        summary: z.string().nullish(),
        note: z.string().optional(),
        title: z.string().max(250).nullish(),
        createdAt: z.string().optional(),
      })
      .passthrough(),
    contentType: 'application/json',
    responses: {
      200: z
        .object({
          id: z.string(),
          createdAt: z.string(),
          title: z.string().max(250).nullish(),
          archived: z.boolean(),
          favourited: z.boolean(),
          taggingStatus: z.enum(['success', 'failure', 'pending']).nullable(),
          note: z.string().nullish(),
          summary: z.string().nullish(),
        })
        .passthrough(),
    },
  },
  createBookmarkTag: {
    method: 'POST',
    path: '/api/v1/bookmarks/:bookmarkId/tags',
    summary: 'Attach tags to a bookmark',
    pathParams: z.object({ bookmarkId: z.string() }),
    body: z
      .object({
        tags: z.array(
          z
            .object({
              tagId: z.string().optional(),
              tagName: z.string().optional(),
            })
            .passthrough(),
        ),
      })
      .passthrough(),
    contentType: 'application/json',
    responses: { 200: z.object({ attached: z.array(TagId) }).passthrough() },
  },
  deleteBookmarkTag: {
    method: 'DELETE',
    path: '/api/v1/bookmarks/:bookmarkId/tags',
    summary: 'Detach tags from a bookmark',
    pathParams: z.object({ bookmarkId: z.string() }),
    body: z
      .object({
        tags: z.array(
          z
            .object({
              tagId: z.string().optional(),
              tagName: z.string().optional(),
            })
            .passthrough(),
        ),
      })
      .passthrough(),
    contentType: 'application/json',
    responses: { 200: z.object({ detached: z.array(TagId) }).passthrough() },
  },
  getLists: {
    method: 'GET',
    path: '/api/v1/lists',
    summary: 'Get all lists',
    responses: { 200: z.object({ lists: z.array(List) }).passthrough() },
  },
  createList: {
    method: 'POST',
    path: '/api/v1/lists',
    summary: 'Create a new list',
    body: z
      .object({
        name: z.string().min(1).max(40),
        icon: z.string(),
        parentId: z.string().nullish(),
      })
      .passthrough(),
    contentType: 'application/json',
    responses: { 201: List },
  },
  getList: {
    method: 'GET',
    path: '/api/v1/lists/:listId',
    summary: 'Get a single list',
    pathParams: z.object({ listId: z.string() }),
    responses: { 200: List },
  },
  deleteList: {
    method: 'DELETE',
    path: '/api/v1/lists/:listId',
    summary: 'Delete a list',
    pathParams: z.object({ listId: z.string() }),
    body: c.noBody(),
    responses: { 204: c.noBody() },
  },
  updateList: {
    method: 'PATCH',
    path: '/api/v1/list/:listId',
    summary: 'Update a list',
    pathParams: z.object({ listId: z.string() }),
    body: z
      .object({
        name: z.string().min(1).max(40).optional(),
        icon: z.string().optional(),
        parentId: z.string().nullish(),
      })
      .passthrough(),
    contentType: 'application/json',
    responses: { 200: List },
  },
  listsListIdBookmarks: {
    method: 'GET',
    path: '/api/v1/lists/:listId/bookmarks',
    summary: 'Get a bookmarks in a list',
    query: z.object({
      limit: z.number().optional(),
      cursor: z.string().optional(),
    }),
    pathParams: z.object({ listId: z.string() }),
    responses: { 200: PaginatedBookmarks },
  },
  addBookmarkToList: {
    method: 'PUT',
    path: '/api/v1/lists/:listId/bookmarks/:bookmarkId',
    summary: 'Add a bookmark to a list',
    pathParams: z.object({ listId: z.string(), bookmarkId: z.string() }),
    body: c.noBody(),
    responses: { 204: c.noBody() },
  },
  deleteBookmarkFromList: {
    method: 'DELETE',
    path: '/api/v1/lists/:listId/bookmarks/:bookmarkId',
    summary: 'Remove a bookmark from a list',
    pathParams: z.object({ listId: z.string(), bookmarkId: z.string() }),
    body: c.noBody(),
    responses: { 204: c.noBody() },
  },
  getTags: {
    method: 'GET',
    path: '/api/v1/tags',
    summary: 'Get all tags',
    responses: { 200: z.object({ tags: z.array(Tag) }).passthrough() },
  },
  getTag: {
    method: 'GET',
    path: '/api/v1/tags/:tagId',
    summary: 'Get a single tag',
    pathParams: z.object({ tagId: z.string() }),
    responses: { 200: Tag },
  },
  deleteTag: {
    method: 'DELETE',
    path: '/api/v1/tags/:tagId',
    summary: 'Delete a tag',
    pathParams: z.object({ tagId: z.string() }),
    body: c.noBody(),
    responses: { 204: c.noBody() },
  },
  updateTag: {
    method: 'PATCH',
    path: '/api/v1/tags/:tagId',
    summary: 'Update a tag',
    pathParams: z.object({ tagId: z.string() }),
    body: z.object({ name: z.string().optional() }).passthrough(),
    contentType: 'application/json',
    responses: { 200: Tag },
  },
  tagsTagIdBookmarks: {
    method: 'GET',
    path: '/api/v1/tags/:tagId/bookmarks',
    summary: 'Get a bookmarks with the tag',
    query: z.object({
      limit: z.number().optional(),
      cursor: z.string().optional(),
    }),
    pathParams: z.object({ tagId: z.string() }),
    responses: { 200: PaginatedBookmarks },
  },
})

export function createClient(baseUrl: string, apiKey: string) {
  return initClient(contract, {
    baseUrl,
    baseHeaders: {
      Authorization: `Bearer ${apiKey}`,
    },
    validateResponse: true,
    jsonQuery: true,
  })
}
