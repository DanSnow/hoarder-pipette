import type * as React from 'react'
import {
  Header as AriaHeader,
  ListBox as AriaListBox,
  ListBoxItem as AriaListBoxItem,
  type ListBoxProps as AriaListBoxProps,
  ListBoxSection as AriaListBoxSection,
  Separator as AriaSeparator,
  type ListBoxSectionProps,
} from 'react-aria-components'

import { cn } from '~/lib/utils'

function ListBox<T extends object>({
  className,
  ref,
  ...props
}: AriaListBoxProps<T> & React.RefAttributes<HTMLDivElement>) {
  return (
    <AriaListBox
      ref={ref}
      className={cn(
        'bg-background max-h-72 min-h-20 space-y-2 overflow-auto p-1 text-sm shadow-sm shadow-black/5 transition-shadow',
        className,
      )}
      {...props}
    />
  )
}
ListBox.displayName = 'ListBox'

function ListBoxItem({ className, ref, ...props }: React.ComponentProps<typeof AriaListBoxItem>) {
  return (
    <AriaListBoxItem
      ref={ref}
      className={cn(
        'data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground relative rounded-md px-2 py-1.5 outline-none data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50',
        className,
      )}
      {...props}
    />
  )
}
ListBoxItem.displayName = 'ListBoxItem'

function ListBoxSection<T extends object>({
  className,
  ref,
  ...props
}: ListBoxSectionProps<T> & React.RefAttributes<HTMLDivElement>) {
  return <AriaListBoxSection ref={ref} className={cn('space-y-1', className)} {...props} />
}
ListBoxSection.displayName = 'ListBoxSection'

function ListBoxHeader({ className, ref, ...props }: React.ComponentProps<typeof AriaHeader>) {
  return (
    <AriaHeader
      ref={ref}
      className={cn('text-muted-foreground px-2 py-1.5 text-xs font-medium', className)}
      {...props}
    />
  )
}
ListBoxHeader.displayName = 'ListBoxHeader'

function ListBoxSeparator({ className, ref, ...props }: React.ComponentProps<typeof AriaSeparator>) {
  return <AriaSeparator ref={ref} className={cn('bg-border -mx-1 my-1 h-px', className)} {...props} />
}
ListBoxSeparator.displayName = 'ListBoxSeparator'

export { ListBox, ListBoxItem, ListBoxSection, ListBoxHeader, ListBoxSeparator }
