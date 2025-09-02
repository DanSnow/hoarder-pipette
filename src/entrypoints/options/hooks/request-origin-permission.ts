import { useMutation } from '@tanstack/react-query'
import { useRouteContext } from '@tanstack/react-router'
import { Effect } from 'effect'
import { requestOrigin } from '../permission'

export function useRequestOriginPermission() {
  const { orpc, queryClient } = useRouteContext({ from: '__root__' })
  const { mutate: registerAll } = useMutation(orpc.registerAll.mutationOptions())
  const { mutateAsync } = useMutation({
    mutationKey: ['requestOriginPermission'],
    mutationFn: (originUrl: string) => {
      return Effect.runPromise(requestOrigin(originUrl))
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: orpc.listSupportedSearchEngines.queryKey() })
      registerAll({})
    },
  })
  return { requestOriginPermission: mutateAsync }
}
