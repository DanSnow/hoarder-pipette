import { createFileRoute, Link, linkOptions, Outlet } from '@tanstack/react-router'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '~/components/ui/navigation-menu'
import { OptionsContainer } from '../components/OptionsContainer'

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
])

function RouteComponent() {
  return (
    <OptionsContainer>
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
    </OptionsContainer>
  )
}
