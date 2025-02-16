import type { SupportSearchEngine } from '~/schemas/supported-engines'
import { Card, CardContent, CardHeader } from '~/components/ui/card'
import { SearchEngineMatchItem } from './SearchEngineMatch'

export function SearchEngineDetail({ engine }: { engine: SupportSearchEngine }) {
  return (
    <Card className="border-none">
      <CardHeader className="pt-1">
        <h2 className="grow font-bold text-lg">{engine.name}</h2>
      </CardHeader>
      <CardContent>
        {engine.matches.map((match) => (
          <SearchEngineMatchItem key={match.match} match={match} />
        ))}
      </CardContent>
    </Card>
  )
}
