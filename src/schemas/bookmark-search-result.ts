import { z } from 'zod/v4'

export const zBookmarkSearchResult = z.object({
  id: z.string(),
  createdAt: z.string(),
  modifiedAt: z.string().nullish(),
  title: z.string().nullish(),
  content: z.union([
    z.object({
      type: z.literal('link'),
      url: z.string(),
      title: z.string().nullish(),
      description: z.string().nullish(),
      imageUrl: z.string().nullish(),
      imageAssetId: z.string().nullish(),
      screenshotAssetId: z.string().nullish(),
      favicon: z.string().nullish(),
    }),
    z.object({
      type: z.string(),
    }),
  ]),
  tags: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
    }),
  ).catch([]),
})

export type BookmarkSearchResult = z.infer<typeof zBookmarkSearchResult>
