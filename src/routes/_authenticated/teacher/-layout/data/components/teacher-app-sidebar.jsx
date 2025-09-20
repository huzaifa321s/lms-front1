import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
  SidebarHeader,
} from '@/components/ui/sidebar'
import { NavGroup } from '@/components/layout/nav-group'
import { teacherSideBarData } from '../../../../../../components/layout/data/teacher-side-bar-data'
import { NavUser } from './teacher-nav-user'
import { useNavigate } from '@tanstack/react-router'

export function AppSidebar({ role, ...props }) {
    const navigate = useNavigate()
  return (
    <Sidebar collapsible='icon' variant='floating' {...props}>
      <SidebarHeader className="flex items-center text-center">    <div 
  onClick={() => navigate({ to: "/teacher" })} 
  className="flex items-center flex-col justify-center cursor-pointer"
>
  <img
    src="/images/main-logo.jpg"
    alt="Bruce LMS"
    width="40"
    height="40"
    className="rounded-full shadow-md"
    loading="lazy"
  />
  <h1 className="bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] bg-clip-text text-lg font-extrabold tracking-tight text-transparent drop-shadow-md">
    Bruce LMS
  </h1>
</div></SidebarHeader>
      <SidebarContent>
        {teacherSideBarData.navGroups.map((props) => (
          <NavGroup key={props.title} {...props} />
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={teacherSideBarData.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
