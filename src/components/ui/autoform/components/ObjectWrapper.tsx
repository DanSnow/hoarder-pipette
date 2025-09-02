import type { ObjectWrapperProps } from '@autoform/react'
import type React from 'react'

export const ObjectWrapper: React.FC<ObjectWrapperProps> = ({ label, children }) => {
  return (
    <div className="space-y-4">
      <h3 className="font-medium text-lg">{label}</h3>
      {children}
    </div>
  )
}
