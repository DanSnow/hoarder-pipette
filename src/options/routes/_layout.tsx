import { createFileRoute, Link, linkOptions, Outlet } from '@tanstack/react-router'
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from '~/components/ui/navigation-menu'

export const Route = createFileRoute('/_layout')({
  component: RouteComponent,
})

const links = linkOptions([
  {
    to: '/',
    label: 'Instance',
  },
  {
    to: '/search-engines',
    label: 'Search Engines',
  },
  {
    to: '/list',
    label: 'List',
  },
])

function RouteComponent() {
  return (
    <div className="container mx-auto flex min-w-96 flex-col gap-1 p-2 lg:py-8">
      <NavigationMenu>
        <NavigationMenuList className="flex flex-nowrap gap-3">
          {links.map((link) => (
            <NavigationMenuItem key={link.to}>
              <NavigationMenuLink asChild>
                <Link className={navigationMenuTriggerStyle()} to={link.to} activeProps={{ 'data-active': 'true' }}>
                  {link.label}
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
      <Outlet />
    </div>
  )
}
