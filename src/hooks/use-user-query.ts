import { useAtomValue } from 'jotai'
import { useCallback, useSyncExternalStore } from 'react'

import { userSitesAtom } from '~/atoms/storage'
import { getUserQuery } from '~/lib/search-engines'

/**
 * Tracks the active search query for search engines that update in-place.
 *
 * Some engines, including Kagi, change URL state without reloading the content
 * script, so the hook polls and listens for navigation events to detect the change.
 */
function readUserQuery(userSites: ReturnType<typeof useAtomValue<typeof userSitesAtom>>) {
  try {
    return getUserQuery(userSites) ?? ''
  } catch {
    return ''
  }
}

function subscribe(onStoreChange: () => void) {
  const interval = window.setInterval(onStoreChange, 500)

  window.addEventListener('popstate', onStoreChange)
  window.addEventListener('hashchange', onStoreChange)

  return () => {
    window.clearInterval(interval)
    window.removeEventListener('popstate', onStoreChange)
    window.removeEventListener('hashchange', onStoreChange)
  }
}

export function useUserQuery() {
  const userSites = useAtomValue(userSitesAtom)
  const getSnapshot = useCallback(() => readUserQuery(userSites), [userSites])

  return useSyncExternalStore(subscribe, getSnapshot)
}
