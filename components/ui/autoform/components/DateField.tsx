import type React from 'react'
import { Input } from '~/components/ui/input'
import type { AutoFormFieldProps } from '@autoform/react'

export const DateField: React.FC<AutoFormFieldProps> = ({ inputProps, error, id }) => (
  <Input id={id} type="date" className={error ? 'border-destructive' : ''} {...inputProps} />
)
