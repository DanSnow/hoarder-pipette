import type React from 'react'
import { Button } from '~/components/ui/button'
import { PlusIcon } from 'lucide-react'
import type { ArrayWrapperProps } from '@autoform/react'

export const ArrayWrapper: React.FC<ArrayWrapperProps> = ({ label, children, onAddItem }) => {
  return (
    <div className="space-y-4">
      <h3 className="font-medium text-lg">{label}</h3>
      {children}
      <Button onClick={onAddItem} variant="outline" size="sm" type="button">
        <PlusIcon className="h-4 w-4" />
      </Button>
    </div>
  )
}
