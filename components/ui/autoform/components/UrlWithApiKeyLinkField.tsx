import type { AutoFormFieldProps } from '@autoform/react'
import type React from 'react'
import { type ChangeEvent, useCallback, useState } from 'react'
import { joinURL } from 'ufo'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Tooltip, TooltipContent, TooltipTrigger } from '~/components/ui/tooltip'

export const UrlWithApiKeyLinkField: React.FC<AutoFormFieldProps> = ({ inputProps, error, id }) => {
  const [url, setUrl] = useState('')
  const handleChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setUrl(event.target.value)
  }, [])

  return (
    <div className="flex gap-1">
      <Input id={id} className={error ? 'border-destructive' : ''} {...inputProps} onChange={handleChange} />
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            disabled={!url}
            variant="outline"
            size="sm"
            onClick={() => {
              window.open(joinURL(url, '/settings/api-keys'), '_blank')
            }}
          >
            <span className="i-lucide-key" />
          </Button>
        </TooltipTrigger>
        <TooltipContent className="max-w-60">Open settings page to create an API key.</TooltipContent>
      </Tooltip>
    </div>
  )
}
