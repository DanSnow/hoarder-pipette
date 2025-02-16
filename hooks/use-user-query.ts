import { useState } from 'react'
import { useEffectOnce } from 'react-use'
import { getUserQuery } from '~/lib/search-engines'

export function useUserQuery() {
  const [query, setQuery] = useState('')

  useEffectOnce(() => {
    try {
      const userQuery = getUserQuery()
      if (userQuery) {
        setQuery(userQuery)
      }
    } catch {}
  })

  return query
}
