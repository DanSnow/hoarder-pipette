import { useCallback } from 'react'
import type { SearchEngineMatch } from '~/schemas/supported-engines'
import { useRequestOriginPermission } from '../hooks/request-origin-permission'
import { CheckButton } from './CheckButton'

export function SearchEngineMatchItem({ match }: { match: SearchEngineMatch }) {
  const { requestOriginPermission } = useRequestOriginPermission()
  const handleClick = useCallback(() => {
    requestOriginPermission(match.originUrl)
  }, [requestOriginPermission, match.originUrl])

  return (
    <div className="flex items-center justify-start gap-4">
      <CheckButton state={match.isEnabled ? 'enabled' : 'disabled'} onClick={handleClick} />
      <p className="w-2/3 truncate underline">{match.match}</p>
    </div>
  )
}
