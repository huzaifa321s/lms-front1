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

export function AppSidebar({ role, ...props }) {
  return (
    <Sidebar collapsible='icon' variant='floating' {...props}>
      <SidebarHeader className="flex items-center text-center"><img src="/images/main-logo.jpg" width="50" height="50"/>  <h1 className="bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] bg-clip-text text-lg font-extrabold tracking-tight text-transparent drop-shadow-md">
  Bruce LMS
</h1></SidebarHeader>
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
