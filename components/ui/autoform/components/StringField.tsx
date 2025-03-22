import type { AutoFormFieldProps } from '@autoform/react'
import type React from 'react'
import { Input } from '~/components/ui/input'

export const StringField: React.FC<AutoFormFieldProps> = ({ inputProps, error, id }) => (
  <Input id={id} className={error ? 'border-destructive' : ''} {...inputProps} />
)
