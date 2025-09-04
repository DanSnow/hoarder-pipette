import { useStore } from 'jotai'
import { useCallback } from 'react'
import { useMedia } from 'react-use'
import { containerAtom } from '~/atoms/container'
import { Toaster } from '~/components/ui/sonner'
import { useUserQuery } from '~/hooks/use-user-query'
import { cn } from '~/lib/utils'
import { HoarderCard } from './HoarderCard'

export function ContentUI() {
  const userQuery = useUserQuery()
  const isDark = useMedia('(prefers-color-scheme: dark)')
  const store = useStore()

  const setContainer = useCallback(
    (el: HTMLElement | null) => {
      if (!el) {
        return
      }

      store.set(containerAtom, el)

      return () => {
        store.set(containerAtom, undefined)
      }
    },
    [store],
  )

  return (
    <div className={cn({ dark: isDark })}>
      <HoarderCard key={userQuery} userQuery={userQuery} className="min-w-[25rem]" />
      <Toaster />
      <div ref={setContainer} />
    </div>
  )
}
