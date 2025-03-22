import { useMutation } from '@tanstack/react-query'
import { useRouteContext } from '@tanstack/react-router'
import { useSetAtom } from 'jotai'
import { userSitesAtom } from '~/atoms/storage'
import { toOriginUrl } from '~/lib/utils'
import type { UserSite } from '~/schemas/user-sites'
import { useRequestOriginPermission } from './request-origin-permission'

export function useRequestUserSitePermission() {
  const setUserSites = useSetAtom(userSitesAtom)
  const { trpc, queryClient } = useRouteContext({ from: '__root__' })
  const { mutate: registerAll } = useMutation(trpc.registerAll.mutationOptions())
  const { requestOriginPermission } = useRequestOriginPermission()

  const { mutateAsync } = useMutation({
    mutationKey: ['requestUserSitePermission'],
    mutationFn: async (userSite: UserSite) => {
      const originUrl = toOriginUrl(userSite.url)
      await requestOriginPermission(originUrl)
      await setUserSites(async (sitesPromise) => {
        const sites = (await sitesPromise) ?? []
        return [...sites, userSite]
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries(trpc.listSupportedSearchEngines.queryFilter())
      registerAll()
    },
  })

  return { requestUserSitePermission: mutateAsync }
}
