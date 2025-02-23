import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate, useRouteContext } from '@tanstack/react-router'
import { useSetAtom } from 'jotai'
import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { userSitesAtom } from '~/atoms/storage'
import { supportedEngines } from '~/lib/search-engines'
import { toOriginUrl } from '~/lib/utils'
import { useRequestOriginPermission } from './request-origin-permission'
import { useMutation } from '@tanstack/react-query'
import type { UserSite } from '~/schemas/user-sites'

export function useRequestUserSitePermission() {
  const setUserSites = useSetAtom(userSitesAtom)
  const { trpc, trpcUtils } = useRouteContext({ from: '__root__' })
  const { mutate: registerAll } = trpc.registerAll.useMutation()
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
      trpcUtils.listSupportedSearchEngines.invalidate()
      registerAll()
    },
  })

  return { requestUserSitePermission: mutateAsync }
}
