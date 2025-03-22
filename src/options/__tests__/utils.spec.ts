import { describe, expect, it } from 'vitest'
import { withoutQueryAndHash } from '../utils'

describe('withoutQueryAndHash', () => {
  it('should remove query and hash from the URL', () => {
    const url = 'https://example.com/path?query=value#hash'
    const expectedUrl = 'https://example.com/path'
    expect(withoutQueryAndHash(url)).toBe(expectedUrl)
  })
  it('should return the original URL if there is no query or hash', () => {
    const url = 'https://example.com/path'
    const expectedUrl = 'https://example.com/path'
    expect(withoutQueryAndHash(url)).toBe(expectedUrl)
  })
})
