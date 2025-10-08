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
import { teacherSideBarData } from '../../../../../../components/layout/data/teacher-side-bar-data'
import { NavUser } from './teacher-nav-user'

export function AppSidebar({ role, ...props }) {
  const navigate = useNavigate()
  return (
    <Sidebar collapsible='icon' variant='floating' {...props}>
      <SidebarHeader className='flex items-center text-center'>
        <div
          onClick={() => navigate({ to: '/teacher' })}
          className='flex cursor-pointer flex-col items-center justify-center'
        >
          <img
            src='/images/main-logo.jpg'
            alt='Bruce LMS'
            width='40'
            height='40'
            className='rounded-full border-[2px] border-blue-500 shadow-md'
            loading='lazy'
          />
          <h1 className='bg-clip-text text-lg font-extrabold tracking-tight drop-shadow-md'>
            Bruce LMS
          </h1>
        </div>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarSeparator />

      <SidebarContent>
        {teacherSideBarData.navGroups.map((props) => (
          <NavGroup key={props.title} {...props} />
        ))}
      </SidebarContent>
      <SidebarSeparator />
      <SidebarFooter>
        <NavUser user={teacherSideBarData.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
