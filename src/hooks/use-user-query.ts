import { useAtomValue } from 'jotai'
import { useCallback, useEffect, useRef, useState } from 'react'

import { userSitesAtom } from '~/atoms/storage'
import { getUserQuery } from '~/lib/search-engines'

/**
 * Tracks the active search query for search engines that update in-place.
 *
 * Some engines, including Kagi, change URL state without reloading the content
 * script, so the hook polls and listens for navigation events while avoiding
 * duplicate React state updates.
 */
export function useUserQuery() {
  const [query, setQuery] = useState('')
  const queryRef = useRef('')
  const userSites = useAtomValue(userSitesAtom)

  const updateQuery = useCallback(() => {
    try {
      const nextQuery = getUserQuery(userSites) ?? ''
      if (queryRef.current === nextQuery) {
        return
      }

      queryRef.current = nextQuery
      setQuery(nextQuery)
    } catch {
      if (queryRef.current === '') {
        return
      }

      queryRef.current = ''
      setQuery('')
    }
  }, [userSites])

  useEffect(() => {
    updateQuery()

    const interval = window.setInterval(updateQuery, 500)

    window.addEventListener('popstate', updateQuery)
    window.addEventListener('hashchange', updateQuery)

    return () => {
      window.clearInterval(interval)
      window.removeEventListener('popstate', updateQuery)
      window.removeEventListener('hashchange', updateQuery)
    }
  }, [updateQuery])

  return query
}
