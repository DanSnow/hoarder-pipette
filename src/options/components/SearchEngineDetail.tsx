import type { SupportSearchEngine } from '~/schemas/supported-engines'
import { Card, CardContent, CardHeader } from '~/components/ui/card'
import { SearchEngineMatchItem } from './SearchEngineMatch'
import { Button } from '~/components/ui/button'
import { useCallback } from 'react'
import { useRequestUserSitePermission } from '../hooks/request-user-site-permission'

export function SearchEngineDetail({
  engine,
  url,
  isAllowUrl,
}: { engine: SupportSearchEngine; url: string | undefined; isAllowUrl: boolean }) {
  const { requestUserSitePermission } = useRequestUserSitePermission()

  const handleClick = useCallback(() => {
    if (!url) {
      return
    }
    requestUserSitePermission({
      id: engine.id,
      url,
    })
  }, [engine.id, url, requestUserSitePermission])

  const isAlreadyEnabled = engine.matches.some((match) => match.match === url)

  return (
    <Card className="border-none">
      <CardHeader className="pt-1">
        <h2 className="grow font-bold text-lg">{engine.name}</h2>
        {engine.allowUserSites && Boolean(url) && (
          <Button className="w-full" disabled={!isAllowUrl || isAlreadyEnabled} onClick={handleClick}>
            Enable on this page
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {engine.matches.map((match) => (
          <SearchEngineMatchItem key={match.match} match={match} />
        ))}
      </CardContent>
    </Card>
  )
}
