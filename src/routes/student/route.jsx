import { createFileRoute, Link, Outlet } from '@tanstack/react-router'
import { NavbarRouteComponent } from '../-NavbarRouteComponent'

export const Route = createFileRoute('/student')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
   <>
<NavbarRouteComponent/>
  <Outlet/>

    </>
  )
}
