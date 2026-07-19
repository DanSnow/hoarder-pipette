import { describe, expect, it } from 'vitest'

import { zBookmarkSearchResult } from './bookmark-search-result'

describe('zBookmarkSearchResult', () => {
  it('accepts minimal search result payloads', () => {
    const bookmark = zBookmarkSearchResult.parse({
      id: 'bookmark-id',
      createdAt: '2026-05-24T01:27:49.000Z',
      content: {
        type: 'link',
        url: 'https://mimir.example.test',
      },
    })

    expect(bookmark.id).toBe('bookmark-id')
    expect(bookmark.content).toMatchObject({
      type: 'link',
      url: 'https://mimir.example.test',
    })
    expect(bookmark.tags).toEqual([])
  })

  it('preserves user-edited bookmark fields and link asset metadata', () => {
    const bookmark = zBookmarkSearchResult.parse({
      id: 'bookmark-id',
      createdAt: '2026-05-24T01:27:49.000Z',
      modifiedAt: '2026-06-05T02:25:29.000Z',
      title: 'Mimir',
      content: {
        type: 'link',
        url: 'https://mimir.example.test',
        title: 'Mimir/Login',
        description: 'Dashboard description',
        imageUrl: null,
        imageAssetId: 'image-asset-id',
        screenshotAssetId: 'screenshot-asset-id',
        favicon: 'https://mimir.example.test/favicon.ico',
      },
      tags: [
        {
          id: 'tag-id',
          name: 'Homelab',
        },
      ],
    })

    expect(bookmark.title).toBe('Mimir')
    expect(bookmark.modifiedAt).toBe('2026-06-05T02:25:29.000Z')
    expect(bookmark.content).toMatchObject({
      type: 'link',
      imageAssetId: 'image-asset-id',
      screenshotAssetId: 'screenshot-asset-id',
      favicon: 'https://mimir.example.test/favicon.ico',
    })
    expect(bookmark.tags).toEqual([{ id: 'tag-id', name: 'Homelab' }])
  })
})
