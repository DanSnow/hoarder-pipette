import { useAtomValue } from 'jotai'
import { useState } from 'react'
import { useEffectOnce } from 'react-use'
import { userSitesAtom } from '~/atoms/storage'
import { getUserQuery } from '~/lib/search-engines'

export function useUserQuery() {
  const [query, setQuery] = useState('')
  const userSites = useAtomValue(userSitesAtom)

  useEffectOnce(() => {
    try {
      const userQuery = getUserQuery(userSites)
      if (userQuery) {
        setQuery(userQuery)
      }
    } catch {}
  })

  return query
}
