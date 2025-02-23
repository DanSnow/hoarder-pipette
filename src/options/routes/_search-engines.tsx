import { createFileRoute, Link, Outlet } from '@tanstack/react-router'
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from '~/components/ui/navigation-menu'
import { OptionsContainer } from '../components/OptionsContainer'
import { Button } from '~/components/ui/button'

export const Route = createFileRoute('/_search-engines')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <OptionsContainer>
      <NavigationMenu>
        <NavigationMenuList className="flex flex-nowrap gap-3">
          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link className={navigationMenuTriggerStyle()} to="/search-engines">
                <Button variant="ghost" size="sm">
                  <span className="i-lucide-chevron-left" />
                </Button>
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      <Outlet />
    </OptionsContainer>
  )
}
