import { Match, pipe } from 'effect'
import { Button } from '~/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '~/components/ui/tooltip'
import { cn } from '~/lib/utils'
import type { SupportSearchEngine } from '~/schemas/supported-engines'

type State = 'disabled' | 'enabled' | 'partial'

const icons: Record<State, string> = {
  enabled: 'i-lucide-square-check-big',
  partial: 'i-lucide-square-divide',
  disabled: 'i-lucide-square-check',
}

const colors: Record<State, string> = {
  enabled: 'text-green-500',
  partial: 'text-blue-500',
  disabled: 'text-gray-500',
}

const tooltipContent: Record<State, string> = {
  enabled: 'All enabled',
  partial: 'Some enabled, click to enable all',
  disabled: 'Click to enable all',
}

export function SearchEngineStateButton({ engine, onClick }: { engine: SupportSearchEngine; onClick: () => void }) {
  const totalMatches = engine.matches.length
  const enabledMatches = engine.matches.filter((m) => m.isEnabled).length

  const isUserSites = totalMatches === 0 && engine.allowUserSites

  const state = pipe(
    Match.value(enabledMatches),
    Match.withReturnType<State>(),
    Match.when(0, () => 'disabled'),
    Match.when(totalMatches, () => 'enabled'),
    Match.orElse(() => 'partial'),
  )

  return (
    <Tooltip open={isUserSites ? false : undefined}>
      <TooltipTrigger asChild>
        <Button
          size="sm"
          variant="ghost"
          disabled={state === 'enabled' && totalMatches > 0}
          className="disabled:pointer-events-auto disabled:opacity-100"
          onClick={onClick}
        >
          <span className={cn(colors[state], icons[state])} />
        </Button>
      </TooltipTrigger>
      <TooltipContent className="max-w-36 text-wrap">{tooltipContent[state]}</TooltipContent>
    </Tooltip>
  )
}
