import { Link, Outlet, createFileRoute } from '@tanstack/react-router'
import { Button } from '~/components/ui/button'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '~/components/ui/navigation-menu'
import { OptionsContainer } from '../components/OptionsContainer'

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
