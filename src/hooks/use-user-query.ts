import { useAtomValue } from 'jotai'
import { useCallback, useEffect, useState } from 'react'

import { userSitesAtom } from '~/atoms/storage'
import { getUserQuery } from '~/lib/search-engines'

/**
 * Tracks the active search query for search engines that update in-place.
 *
 * Some engines, including Kagi, change URL state without reloading the content
 * script, so the hook polls and listens for navigation events while avoiding
 * duplicate React state updates.
 */
function readUserQuery(userSites: ReturnType<typeof useAtomValue<typeof userSitesAtom>>) {
  try {
    return getUserQuery(userSites) ?? ''
  } catch {
    return ''
  }
}

export function useUserQuery() {
  const userSites = useAtomValue(userSitesAtom)
  const [query, setQuery] = useState(() => readUserQuery(userSites))
  const [syncedUserSites, setSyncedUserSites] = useState(userSites)

  if (syncedUserSites !== userSites) {
    setSyncedUserSites(userSites)
    const nextQuery = readUserQuery(userSites)
    if (query !== nextQuery) {
      setQuery(nextQuery)
    }
  }

  const updateQuery = useCallback(() => {
    setQuery((current) => {
      const nextQuery = readUserQuery(userSites)
      return current === nextQuery ? current : nextQuery
    })
  }, [userSites])

  useEffect(() => {
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
