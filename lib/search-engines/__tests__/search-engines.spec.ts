import { describe, expect, it } from 'vitest'
import { google } from '../google'
import { isMatchSearchEngine } from '../index'

describe('isMatchSearchEngine', () => {
  it('should return true if the url matches the search engine', () => {
    const url = 'https://www.google.com/search?q=hello+world'
    expect(isMatchSearchEngine(google, url)).toBe(true)
  })
})
