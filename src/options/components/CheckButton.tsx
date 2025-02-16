import { Button } from '~/components/ui/button'
import { cn } from '~/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'
import type { ComponentProps } from 'react'

export type State = 'disabled' | 'enabled' | 'partial'

const checkButtonContentVariants = cva('', {
  variants: {
    state: {
      enabled: 'text-green-500 i-lucide-square-check-big',
      partial: 'text-blue-500 i-lucide-square-divide',
      disabled: 'text-gray-500 i-lucide-square-check',
    },
  },
})

type CheckButtonContentVariantProps = Required<VariantProps<typeof checkButtonContentVariants>>

export function CheckButton({
  className,
  state,
  ...props
}: CheckButtonContentVariantProps & ComponentProps<typeof Button>) {
  return (
    <Button
      size="sm"
      variant="ghost"
      className={cn('disabled:pointer-events-auto disabled:opacity-100', className)}
      {...props}
    >
      <span className={checkButtonContentVariants({ state })} />
    </Button>
  )
}
