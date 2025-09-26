import { useNavigate } from '@tanstack/react-router'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
  SidebarHeader,
  SidebarSeparator,
} from '@/components/ui/sidebar'
import { NavGroup } from '@/components/layout/nav-group'
import { NavUser } from './admin-nav-user'
import { adminSideBarData } from './data/admin-side-bar-data'

export function AppSidebar({ ...props }) {
  const navigate = useNavigate()
  return (
    <Sidebar collapsible='icon' variant='floating' {...props}>
      <SidebarHeader className='flex items-center text-center'>
        {' '}
        <div
          onClick={() => navigate({ to: '/admin' })}
          className='flex cursor-pointer flex-col items-center justify-center'
        >
          <img
            src='/images/main-logo.jpg'
            alt='Bruce LMS'
            width='40'
            height='40'
            className='rounded-full shadow-md border-[2px] border-blue-500'
            loading='lazy'
          />
          <h1 className='bg-clip-text text-lg font-extrabold tracking-tight drop-shadow-md'>
            Bruce LMS
          </h1>
        </div>
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        {adminSideBarData.navGroups.map((props) => (
          <NavGroup key={props.title} {...props} />
        ))}
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={adminSideBarData.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
