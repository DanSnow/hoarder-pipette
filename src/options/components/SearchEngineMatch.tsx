import type { SearchEngineMatch } from '~/schemas/supported-engines'
import { useMutation } from '@tanstack/react-query'
import { Effect } from 'effect'
import { requestOrigin } from '../permission'
import { useRouteContext } from '@tanstack/react-router'
import { CheckButton } from './CheckButton'
import { useCallback } from 'react'

export function SearchEngineMatchItem({ match }: { match: SearchEngineMatch }) {
  const { trpc, trpcUtils } = useRouteContext({ from: '__root__' })
  const { mutate: registerAll } = trpc.registerAll.useMutation()
  const { mutate } = useMutation({
    mutationKey: ['requestOriginPermission'],
    mutationFn: () => {
      return Effect.runPromise(requestOrigin(match.originUrl))
    },
    onSuccess: async () => {
      trpcUtils.listSupportedSearchEngines.invalidate()
      registerAll()
    },
  })
  const handleClick = useCallback(() => {
    mutate()
  }, [mutate])

  return (
    <div className="flex items-center justify-start gap-4">
      <CheckButton state={match.isEnabled ? 'enabled' : 'disabled'} onClick={handleClick} />
      <p className="w-2/3 truncate underline">{match.match}</p>
    </div>
  )
}
