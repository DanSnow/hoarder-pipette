import * as React from 'react'
import {
  Header as AriaHeader,
  ListBox as AriaListBox,
  ListBoxItem as AriaListBoxItem,
  type ListBoxProps as AriaListBoxProps,
  ListBoxSection as AriaListBoxSection,
  Separator as AriaSeparator,
  type ListBoxItemProps,
  type ListBoxSectionProps,
  type SeparatorProps,
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
        'max-h-72 min-h-20 space-y-2 overflow-auto bg-background p-1 text-sm shadow-black/5 shadow-sm transition-shadow',
        className,
      )}
      {...props}
    />
  )
}
ListBox.displayName = 'ListBox'

const ListBoxItem = React.forwardRef<HTMLLIElement, ListBoxItemProps>(({ className, ...props }, ref) => (
  <AriaListBoxItem
    ref={ref}
    className={cn(
      'relative rounded-md px-2 py-1.5 outline-none data-[disabled]:cursor-not-allowed data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground data-[disabled]:opacity-50',
      className,
    )}
    {...props}
  />
))
ListBoxItem.displayName = 'ListBoxItem'

function ListBoxSection<T extends object>({
  className,
  ref,
  ...props
}: ListBoxSectionProps<T> & React.RefAttributes<HTMLDivElement>) {
  return <AriaListBoxSection ref={ref} className={cn('space-y-1', className)} {...props} />
}
ListBoxSection.displayName = 'ListBoxSection'

const ListBoxHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <AriaHeader
      ref={ref}
      className={cn('px-2 py-1.5 font-medium text-muted-foreground text-xs', className)}
      {...props}
    />
  ),
)
ListBoxHeader.displayName = 'ListBoxHeader'

const ListBoxSeparator = React.forwardRef<HTMLDivElement, SeparatorProps>(({ className, ...props }, ref) => (
  <AriaSeparator ref={ref} className={cn('-mx-1 my-1 h-px bg-border', className)} {...props} />
))
ListBoxSeparator.displayName = 'ListBoxSeparator'

export { ListBox, ListBoxItem, ListBoxSection, ListBoxHeader, ListBoxSeparator }
