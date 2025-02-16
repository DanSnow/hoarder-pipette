import { createFileRoute } from '@tanstack/react-router'
import { Label } from '~/components/ui/label'
import { ListBox, ListBoxItem } from '~/components/ui/listbox'

export const Route = createFileRoute('/_layout/list')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <ListBox>
      <ListBoxItem className="flex items-center gap-4 p-3">
        <div className="i-simple-icons-google" />
        <Label>Google</Label>
      </ListBoxItem>
      <ListBoxItem className="flex items-center gap-4 p-3">
        <div className="i-simple-icons-ecosia" />
        <Label>Ecosia</Label>
      </ListBoxItem>
    </ListBox>
  )
}
