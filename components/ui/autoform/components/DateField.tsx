import type { AutoFormFieldProps } from '@autoform/react'
import type React from 'react'
import { Input } from '~/components/ui/input'

export const DateField: React.FC<AutoFormFieldProps> = ({ inputProps, error, id }) => (
  <Input id={id} type="date" className={error ? 'border-destructive' : ''} {...inputProps} />
)
