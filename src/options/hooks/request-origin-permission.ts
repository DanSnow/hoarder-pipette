import { useMutation } from '@tanstack/react-query'
import { useRouteContext } from '@tanstack/react-router'
import { Effect } from 'effect'
import { requestOrigin } from '../permission'

export function useRequestOriginPermission() {
  const { trpc, trpcUtils } = useRouteContext({ from: '__root__' })
  const { mutate: registerAll } = trpc.registerAll.useMutation()
  const { mutateAsync } = useMutation({
    mutationKey: ['requestOriginPermission'],
    mutationFn: (originUrl: string) => {
      return Effect.runPromise(requestOrigin(originUrl))
    },
    onSuccess: async () => {
      trpcUtils.listSupportedSearchEngines.invalidate()
      registerAll()
    },
  })
  return { requestOriginPermission: mutateAsync }
}
