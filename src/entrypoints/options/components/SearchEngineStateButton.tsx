import { Match, pipe } from 'effect'
import { Tooltip, TooltipContent, TooltipTrigger } from '~/components/ui/tooltip'
import type { SupportSearchEngine } from '~/schemas/supported-engines'
import { CheckButton, type State } from './CheckButton'

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
        <CheckButton state={state} disabled={state === 'enabled' && totalMatches > 0} onClick={onClick} />
      </TooltipTrigger>
      <TooltipContent className="max-w-36 text-wrap">{tooltipContent[state]}</TooltipContent>
    </Tooltip>
  )
}
