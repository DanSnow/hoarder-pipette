import { useAtomValue } from 'jotai'
import { clientAtom } from '~/atoms/storage'

export function useClient() {
  const client = useAtomValue(clientAtom)
  return client
}
